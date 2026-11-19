import { TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom, isObservable, of, throwError } from 'rxjs';
import { AuthGuard } from './auth.guard';
import { User } from './models/user';
import { AuthenticationService, MenuItem } from './services/authentication.service';

describe('AuthGuard', () => {
    let guard: AuthGuard;
    let router: Router;
    let auth: jasmine.SpyObj<AuthenticationService>;
    let toastr: jasmine.SpyObj<ToastrService>;

    beforeEach(() => {
        auth = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['getNavigationData'], {
            currentUserValue: Object.assign(new User(), { userId: 1 })
        });

        toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);
        TestBed.configureTestingModule({
            providers: [
                provideRouter([]),
                AuthGuard,
                { provide: AuthenticationService, useValue: auth },
                { provide: ToastrService, useValue: toastr }
            ]
        });
        guard = TestBed.inject(AuthGuard);
        router = TestBed.inject(Router);
    });

    async function check(url: string, child = false): Promise<boolean | string> {
        const route = {} as ActivatedRouteSnapshot;
        const state = { url } as RouterStateSnapshot;
        const result = child ? guard.canActivateChild(route, state) : guard.canActivate(route, state);
        const value = isObservable(result) ? await firstValueFrom(result) : result;
        return value instanceof UrlTree ? router.serializeUrl(value) : value;
    }

    it('allows nested menu URLs, ignoring query and fragment but not extra path segments', async () => {
        auth.getNavigationData.and.returnValue(of([
            { children: [{ children: [{ url: 'setup/Constants/', isView: true }] }] }
        ]));
        expect(await check('/setup/Constants?tab=1#details', true)).toBe(true);
        expect(await check('/setup/Constants/other')).toBe('/forbidden');
        expect(await check('/setup/Constant')).toBe('/forbidden');
    });

    it('denies missing or explicitly non-viewable URLs', async () => {
        const menus: MenuItem[] = [{ url: '/ipd/admission', isView: false }];
        auth.getNavigationData.and.returnValue(of(menus));
        expect(await check('/ipd/admission')).toBe('/forbidden');
        expect(await check('/opd/registration')).toBe('/forbidden');
    });

    it('allows home for a signed-in user without needing the menu', async () => {
        expect(await check('/dashboard/home')).toBe(true);
        expect(auth.getNavigationData).not.toHaveBeenCalled();
    });

    it('redirects signed-out users to login with the requested URL', async () => {
        Object.defineProperty(auth, 'currentUserValue', { get: () => null });
        expect(await check('/ipd/admission?tab=1')).toBe('/auth/login?returnUrl=%2Fipd%2Fadmission%3Ftab%3D1');
    });

    it('fails closed and reports a menu loading error', async () => {
        spyOn(console, 'error');
        auth.getNavigationData.and.returnValue(throwError(() => new Error('offline')));
        expect(await check('/ipd/admission')).toBe('/forbidden');
        expect(toastr.error).toHaveBeenCalled();
    });
});

@Component({ template: '', standalone: true })
class GuardTestPageComponent {}

describe('AuthGuard routing', () => {
    it('checks nested navigation after the parent route has already been activated', async () => {
        const auth = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['getNavigationData'], {
            currentUserValue: new User()
        });
        auth.getNavigationData.and.returnValue(of([{ url: '/module/allowed', isView: true }]));
        TestBed.configureTestingModule({
            providers: [
                provideRouter([
                    {
                        path: 'module',
                        canActivate: [AuthGuard],
                        canActivateChild: [AuthGuard],
                        runGuardsAndResolvers: 'always',
                        loadChildren: () => Promise.resolve([
                            { path: 'allowed', component: GuardTestPageComponent },
                            { path: 'denied', component: GuardTestPageComponent }
                        ])
                    },
                    { path: 'forbidden', component: GuardTestPageComponent }
                ]),
                { provide: AuthenticationService, useValue: auth },
                { provide: ToastrService, useValue: jasmine.createSpyObj('ToastrService', ['error']) }
            ]
        });
        const harness = await RouterTestingHarness.create();
        await harness.navigateByUrl('/module/allowed', GuardTestPageComponent);
        expect(TestBed.inject(Router).url).toBe('/module/allowed');
        await harness.navigateByUrl('/module/denied', GuardTestPageComponent);
        expect(TestBed.inject(Router).url).toBe('/forbidden');
    });
});
