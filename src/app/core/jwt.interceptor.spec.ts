import { HttpContext, HttpErrorResponse, HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { StoreUnitContextService } from 'app/main/shared/services/storeunit-context.service';
import { ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import { LoaderService } from './components/loader/loader.service';
import { JwtInterceptor } from './jwt.interceptor';
import { AuthenticationService } from './services/authentication.service';
import { ASSISTANT_LOCAL_ERRORS } from './services/ai-assistant.service';
import { User } from './models/user';

describe('JwtInterceptor error reporting', () => {
    let interceptor: JwtInterceptor;
    let toastr: jasmine.SpyObj<ToastrService>;
    let router: jasmine.SpyObj<Router>;
    let authentication: jasmine.SpyObj<AuthenticationService>;
    let dialog: jasmine.SpyObj<MatDialog>;

    beforeEach(() => {
        toastr = jasmine.createSpyObj<ToastrService>('ToastrService', ['error']);
        router = jasmine.createSpyObj<Router>('Router', ['navigate'], { url: '/dashboard/home' });
        authentication = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['clearSession'], { currentUserValue: null });
        dialog = jasmine.createSpyObj<MatDialog>('MatDialog', ['open', 'closeAll']);
        const context = jasmine.createSpyObj<StoreUnitContextService>('StoreUnitContextService', ['getContext']);
        context.getContext.and.returnValue(null);
        const loader = jasmine.createSpyObj<LoaderService>('LoaderService', ['show', 'hide']);
        interceptor = new JwtInterceptor({ apiEndpoint: '/api', newApiEndPoint: '/api' }, dialog, loader, toastr, router,
            authentication, context);
        spyOn(console, 'error');
    });

    function failWith(error: unknown): unknown {
        const handler: HttpHandler = { handle: () => throwError(() => error) };
        let received: unknown;
        interceptor.intercept(new HttpRequest('GET', '/api/example'), handler)
            .subscribe({ error: err => received = err });
        return received;
    }

    it('does not report runtime exceptions as unknown HTTP errors', () => {
        const error = new TypeError('Invalid response processing');
        expect(failWith(error)).toBe(error);
        expect(toastr.error).not.toHaveBeenCalled();
    });

    it('uses the server message for a validation failure and propagates the error', () => {
        const error = new HttpErrorResponse({ status: 400, error: { message: 'Please select a hospital.' } });
        expect(failWith(error)).toBe(error);
        expect(toastr.error).toHaveBeenCalledOnceWith('Please select a hospital.', 'Error !', jasmine.any(Object));
    });

    it('reports a missing resource with an actionable message', () => {
        failWith(new HttpErrorResponse({ status: 404, error: '<html>Not found</html>' }));
        expect(toastr.error.calls.mostRecent().args[0]).toContain('not found');
    });

    for (const status of [400, 431]) {
        it(`explains oversized headers for HTTP ${status} without displaying the server HTML`, () => {
            const error = new HttpErrorResponse({
                status,
                error: '<html><h2>Bad Request - Request Too Long</h2><p>The size of the request headers is too long.</p></html>'
            });
            expect(failWith(error)).toBe(error);
            expect(toastr.error.calls.mostRecent().args[0]).toContain('reduce the login token size');
            expect(toastr.error.calls.mostRecent().args[0]).not.toContain('<html>');
        });
    }

    it('handles a forbidden response with an empty body without throwing another error', () => {
        const error = new HttpErrorResponse({ status: 403, error: null });
        expect(failWith(error)).toBe(error);
        expect(toastr.error.calls.mostRecent().args[0]).toContain('permission');
        expect(router.navigate).toHaveBeenCalledWith(['/forbidden']);
    });

    it('keeps network errors on the connection dialog path', () => {
        const dialogRef = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
        dialogRef.afterClosed.and.returnValue(of(undefined));
        dialog.open.and.returnValue(dialogRef);
        const error = new HttpErrorResponse({ status: 0 });
        expect(failWith(error)).toBe(error);
        expect(dialog.open).toHaveBeenCalled();
        expect(toastr.error).not.toHaveBeenCalled();
    });

    for (const status of [0, 400, 403, 404, 429, 503, 504]) {
        it(`lets the assistant handle HTTP ${status} locally without navigating or showing a global dialog`, () => {
            const error = new HttpErrorResponse({ status });
            const handler: HttpHandler = { handle: () => throwError(() => error) };
            const request = new HttpRequest('GET', '/api/v1/ai-assistant/capabilities', {
                context: new HttpContext().set(ASSISTANT_LOCAL_ERRORS, true)
            });
            let received: unknown;
            interceptor.intercept(request, handler).subscribe({ error: err => received = err });
            expect(received).toBe(error);
            expect(dialog.open).not.toHaveBeenCalled();
            expect(dialog.closeAll).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
            expect(toastr.error).not.toHaveBeenCalled();
        });
    }

    it('retains the sign-in flow for assistant HTTP 401 errors', () => {
        const handler: HttpHandler = { handle: () => throwError(() => new HttpErrorResponse({ status: 401 })) };
        const request = new HttpRequest('GET', '/api/v1/ai-assistant/capabilities', {
            context: new HttpContext().set(ASSISTANT_LOCAL_ERRORS, true)
        });
        interceptor.intercept(request, handler).subscribe({ error: () => undefined });
        expect(authentication.clearSession).toHaveBeenCalled();
        expect(router.navigate).toHaveBeenCalled();
    });

    it('still attaches bearer authentication and store/unit headers to assistant requests', () => {
        const user = new User();
        user.token = 'test-token';
        const auth = jasmine.createSpyObj<AuthenticationService>('AuthenticationService', ['clearSession'], { currentUserValue: user });
        const context = jasmine.createSpyObj<StoreUnitContextService>('StoreUnitContextService', ['getContext']);
        context.getContext.and.returnValue({ storeId: 7, unitId: 8, storeName: '', unitName: '', Stores: [], Units: [] });
        const loader = jasmine.createSpyObj<LoaderService>('LoaderService', ['show', 'hide']);
        const authenticated = new JwtInterceptor({ apiEndpoint: '/api', newApiEndPoint: '/api' },
            dialog, loader, toastr, router, auth, context);
        const handler = jasmine.createSpyObj<HttpHandler>('HttpHandler', ['handle']);
        handler.handle.and.returnValue(of(new HttpResponse({ status: 200 })));
        authenticated.intercept(new HttpRequest('GET', '/api/v1/ai-assistant/capabilities', {
            context: new HttpContext().set(ASSISTANT_LOCAL_ERRORS, true)
        }), handler).subscribe();
        const request = handler.handle.calls.mostRecent().args[0];
        expect(request.headers.get('Authorization')).toBe('Bearer test-token');
        expect(request.headers.get('X-Store-Id')).toBe('7');
        expect(request.headers.get('X-Unit-Id')).toBe('8');
    });
});
