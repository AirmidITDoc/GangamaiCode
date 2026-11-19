import { LocationStrategy } from '@angular/common';
import { Router } from '@angular/router';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject, firstValueFrom, of, throwError } from 'rxjs';
import { ApiCaller } from './apiCaller';
import { AuthenticationService, MenuItem } from './authentication.service';
import { LoginEnvelopeService } from './login-envelope.service';

describe('AuthenticationService menu loading', () => {
    let service: AuthenticationService;
    let api: jasmine.SpyObj<ApiCaller>;
    let navigation: jasmine.SpyObj<FuseNavigationService>;
    let envelope: jasmine.SpyObj<LoginEnvelopeService>;

    beforeEach(() => {
        spyOn(localStorage, 'getItem').and.returnValue(null);
        spyOn(localStorage, 'setItem');
        spyOn(localStorage, 'removeItem');
        api = jasmine.createSpyObj<ApiCaller>('ApiCaller', ['GetData', 'PostData']);
        navigation = jasmine.createSpyObj<FuseNavigationService>('FuseNavigationService',
            ['register', 'unregister', 'setCurrentNavigation']);
        envelope = jasmine.createSpyObj<LoginEnvelopeService>('LoginEnvelopeService', ['encrypt']);
        service = new AuthenticationService(
            jasmine.createSpyObj<Router>('Router', ['navigate']),
            api,
            navigation,
            jasmine.createSpyObj<LocationStrategy>('LocationStrategy', ['onPopState']),
            envelope
        );
    });

    it('shares a pending menu request and caches its result', () => {
        const response = new Subject<MenuItem[]>();
        api.GetData.and.returnValue(response);
        const results: MenuItem[][] = [];
        service.getNavigationData().subscribe(value => results.push(value));
        service.getNavigationData().subscribe(value => results.push(value));
        response.next([{ url: 'ipd/admission', isView: true }]);
        response.complete();
        service.getNavigationData().subscribe(value => results.push(value));
        expect(api.GetData).toHaveBeenCalledTimes(1);
        expect(results.length).toBe(3);
        expect(navigation.register).toHaveBeenCalledTimes(1);
    });

    it('rejects invalid responses and allows a later retry', () => {
        api.GetData.and.returnValues(of(null), of([{ url: '/ipd/admission' }]));
        let error: Error;
        service.getNavigationData().subscribe({ error: value => error = value });
        expect(error.message).toContain('invalid');
        service.getNavigationData().subscribe();
        expect(api.GetData).toHaveBeenCalledTimes(2);
    });

    it('does not install menus from a session that has ended', () => {
        const response = new Subject<MenuItem[]>();
        api.GetData.and.returnValue(response);
        let error: Error;
        service.getNavigationData().subscribe({ error: value => error = value });
        service.clearSession();
        response.next([{ url: '/ipd/admission' }]);
        expect(error.message).toContain('expired session');
        expect(navigation.register).not.toHaveBeenCalled();
    });

    it('clears cached menus and sidebar on a new login', async () => {
        api.GetData.and.returnValues(of([{ url: '/old' }]), of([{ url: '/new' }]));
        service.getNavigationData().subscribe();
        api.PostData.and.returnValue(of({ status: 'Ok', userId: 2 }));
        envelope.encrypt.and.resolveTo({
            version: 1,
            kid: 'key-1',
            challengeId: 'challenge-1',
            nonce: btoa(String.fromCharCode(...new Uint8Array(12))),
            wrappedKey: 'wrapped',
            ciphertext: 'ciphertext',
            tag: 'tag',
            loginType: 'Web'
        });
        await firstValueFrom(service.login(
            { username: 'user', password: 'password', captchaCode: 'ABC' },
            {
                version: 1,
                kid: 'key-1',
                algorithm: 'RSA-OAEP-256',
                publicKey: 'public-key',
                challengeId: 'challenge-1',
                nonce: btoa(String.fromCharCode(...new Uint8Array(12))),
                expiresAt: new Date(Date.now() + 60000).toISOString(),
                captchaId: 'captcha-1',
                img: 'image',
                context: 'context'
            }
        ));
        let menus: MenuItem[];
        service.getNavigationData().subscribe(value => menus = value);
        expect(menus[0].url).toBe('/new');
        expect(api.GetData).toHaveBeenCalledTimes(2);
        expect(navigation.register).toHaveBeenCalledWith('main1', []);
    });

    it('refreshes the challenge once for an unsupported login key', async () => {
        const challenge = {
            version: 1,
            kid: 'old-key',
            algorithm: 'RSA-OAEP-256',
            publicKey: 'public-key',
            challengeId: 'challenge-old',
            nonce: btoa(String.fromCharCode(...new Uint8Array(12))),
            expiresAt: new Date(Date.now() + 60000).toISOString(),
            captchaId: 'captcha-old',
            img: 'image',
            context: 'context'
        };
        const refreshed = { ...challenge, kid: 'new-key', challengeId: 'challenge-new' };
        api.GetData.and.returnValue(of(refreshed));
        api.PostData.and.returnValues(
            throwError(() => new HttpErrorResponse({
                status: 409,
                error: { data: { code: 'LOGIN_KEY_UNSUPPORTED' } }
            })),
            of({ status: 'Ok', userId: 2 })
        );
        envelope.encrypt.and.resolveTo({
            version: 1,
            kid: 'key',
            challengeId: 'challenge',
            nonce: challenge.nonce,
            wrappedKey: 'wrapped',
            ciphertext: 'ciphertext',
            tag: 'tag',
            loginType: 'Web'
        });

        await firstValueFrom(service.login(
            { username: 'user', password: 'password', captchaCode: 'ABC' },
            challenge
        ));

        expect(api.GetData).toHaveBeenCalledOnceWith('Login/Challenge?loginType=Web');
        expect(envelope.encrypt).toHaveBeenCalledTimes(2);
        expect(envelope.encrypt.calls.mostRecent().args[1]).toBe(refreshed);
        expect(api.PostData).toHaveBeenCalledTimes(2);
    });
});
