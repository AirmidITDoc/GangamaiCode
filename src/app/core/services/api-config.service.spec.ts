import { DOCUMENT } from '@angular/common';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { appConfigFactory } from '../../app-config.module';
import { AppConfigService } from './api-config.service';

describe('Runtime API configuration', () => {
    let service: AppConfigService;
    let http: HttpTestingController;
    let browserDocument: { location: URL };
    const config = {
        apiBaseUrl: 'https://backend.example.test/api/v2',
        notificationHub: 'https://notifications.example.test/events'
    };

    beforeEach(() => {
        browserDocument = { location: new URL('http://localhost:9876') };
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [{ provide: DOCUMENT, useValue: browserDocument }]
        });
        service = TestBed.inject(AppConfigService);
        http = TestBed.inject(HttpTestingController);
    });

    afterEach(() => http.verify());

    it('revalidates configuration instead of reusing a stale browser response', async () => {
        const loaded = service.loadConfig();
        const request = http.expectOne('assets/config/api-config.json');
        expect(request.request.headers.get('Cache-Control')).toBe('no-cache');
        expect(request.request.headers.get('Pragma')).toBe('no-cache');
        request.flush(config);
        await loaded;
    });

    it('uses configured paths on localhost and normalizes the API trailing slash', async () => {
        const loaded = service.loadConfig();
        http.expectOne('assets/config/api-config.json').flush(config);
        await loaded;
        expect(service.apiBaseUrl).toBe('/api/v2/');
        expect(service.notificationHub).toBe('/events');
        expect(service.productName).toBe('Healthcare-Core');
    });

    it('preserves independent API and hub hosts in deployed builds', async () => {
        browserDocument.location = new URL('https://hospital.example.test');
        const loaded = service.loadConfig();
        http.expectOne('assets/config/api-config.json').flush(config);
        await loaded;
        expect(service.apiBaseUrl).toBe(`${config.apiBaseUrl}/`);
        expect(service.notificationHub).toBe(config.notificationHub);
    });

    for (const host of ['127.0.0.1', '[::1]']) {
        it(`uses local proxy paths on ${host}`, async () => {
            browserDocument.location = new URL(`http://${host}:4200`);
            const loaded = service.loadConfig();
            http.expectOne('assets/config/api-config.json').flush(config);
            await loaded;
            expect(service.apiBaseUrl).toBe('/api/v2/');
            expect(service.notificationHub).toBe('/events');
        });
    }

    it('allows configured HTTP endpoints on a private network address', async () => {
        const loaded = service.loadConfig();
        http.expectOne('assets/config/api-config.json').flush({
            apiBaseUrl: 'http://192.168.2.100:8045/api/v1/',
            notificationHub: 'http://192.168.2.100:8045/himshub'
        });
        await loaded;
        expect(service.apiBaseUrl).toBe('/api/v1/');
        expect(service.notificationHub).toBe('/himshub');
    });

    it('preserves LAN endpoint URLs when the frontend is opened from a LAN host', async () => {
        browserDocument.location = new URL('http://192.168.2.50:9092');
        const loaded = service.loadConfig();
        const lanConfig = {
            apiBaseUrl: 'http://192.168.2.100:8045/api/v1/',
            notificationHub: 'http://192.168.2.100:8045/himshub'
        };
        http.expectOne('assets/config/api-config.json').flush(lanConfig);
        await loaded;
        expect(service.apiBaseUrl).toBe(lanConfig.apiBaseUrl);
        expect(service.notificationHub).toBe(lanConfig.notificationHub);
    });
    
    it('supports root-relative endpoints and keeps the legacy token in sync', async () => {
        const legacyConfig = appConfigFactory(service);
        const loaded = service.loadConfig();
        http.expectOne('assets/config/api-config.json').flush({
            apiBaseUrl: '/backend/api/', notificationHub: '/notifications'
        });
        await loaded;
        expect(service.apiBaseUrl).toBe('/backend/api/');
        expect(service.notificationHub).toBe('/notifications');
        expect(legacyConfig.apiEndpoint).toBe(service.apiBaseUrl);
        expect(legacyConfig.newApiEndPoint).toBe(service.apiBaseUrl);
    });

    for (const invalid of [
        { ...config, apiBaseUrl: '' },
        { ...config, notificationHub: undefined },
        { ...config, apiBaseUrl: 'backend/api' },
        { ...config, apiBaseUrl: 'ftp://backend.example.test/api' },
        { ...config, apiBaseUrl: '//backend.example.test/api' },
        { ...config, notificationHub: '/events?token=value' }
    ]) {
        it(`rejects invalid endpoint configuration: ${JSON.stringify(invalid)}`, async () => {
            const logged = spyOn(console, 'error');
            const loaded = service.loadConfig();
            const rejected = expectAsync(loaded).toBeRejectedWithError(/Invalid/);
            http.expectOne('assets/config/api-config.json').flush(invalid);
            await rejected;
            expect(logged).toHaveBeenCalled();
        });
    }

    it('propagates config loading failures instead of starting with undefined URLs', async () => {
        spyOn(console, 'error');
        const loaded = service.loadConfig();
        const rejected = expectAsync(loaded).toBeRejected();
        http.expectOne('assets/config/api-config.json').flush('Unavailable', {
            status: 503, statusText: 'Service Unavailable'
        });
        await rejected;
        expect(() => service.apiBaseUrl).toThrowError(/not been loaded/);
    });
});
