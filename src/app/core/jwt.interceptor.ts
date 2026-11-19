// import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
// import { Inject, Injectable } from "@angular/core";
// import { MatDialog } from "@angular/material/dialog";
// import { Router } from "@angular/router";
// import { Error0Component } from "app/main/shared/APIerrorpages/error-0/error-0.component";
// import { StoreUnitContextService } from "app/main/shared/services/storeunit-context.service";
// import { ToastrService } from 'ngx-toastr';
// import { EMPTY, Observable, throwError } from "rxjs";
// import { catchError, finalize, map } from 'rxjs/operators';
// import { APP_CONFIG, AppConfig } from './../app-config.module';
// import { LoaderService } from "./components/loader/loader.service";
// import { AuthenticationService } from "./services/authentication.service";


// @Injectable()
// export class JwtInterceptor implements HttpInterceptor {
//     private dialogOpen = false;

//     constructor(@Inject(APP_CONFIG) private config: AppConfig, private dialog: MatDialog,
//         private _ls: LoaderService, public toastr: ToastrService, private router: Router,
//         private authenticationService: AuthenticationService,
//         private contextSvc: StoreUnitContextService) { }

//     intercept(
//         request: HttpRequest<any>,
//         next: HttpHandler
//     ): Observable<HttpEvent<any>> {
//         // add authorization header with jwt token if available
//         const currentUser = this.authenticationService.currentUserValue;
//         const ctx = this.contextSvc.getContext();
//         if (currentUser && currentUser.token) {
//             if (request.body instanceof FormData)
//                 request = request.clone({
//                     setHeaders: {
//                         Authorization: `Bearer ${currentUser.token}`,
//                         'X-Store-Id': ctx?.storeId?.toString() ?? "",
//                         'X-Unit-Id': ctx?.unitId?.toString() ?? ""
//                     },
//                 });
//             else
//                 request = request.clone({
//                     setHeaders: {
//                         Authorization: `Bearer ${currentUser.token}`,
//                         "Content-Type": "application/json; charset=utf-8",
//                         'X-Store-Id': ctx?.storeId?.toString() ?? "",
//                         'X-Unit-Id': ctx?.unitId?.toString() ?? ""
//                     },
//                 });
//         }
//         // this._ls.show();

//         // stoped the loader for abha api calling 13-10-2026
//         if (!request.url.includes('/AbhaConnects/')) {
//             this._ls.show();
//         }

//         return next.handle(request).pipe(
//             catchError((err: HttpErrorResponse) => { // Type the error as HttpErrorResponse
//                 if (err.status == 401) {
//                     if (err.url.endsWith('/login/get-menus')) {
//                         return EMPTY;
//                     }
//                     else {
//                         this.toastr.error(err.error.message, 'Authentication !', {
//                             toastClass: 'tostr-tost custom-toast-error',
//                         });
//                         this.router.navigate(["/unauthorize"]);
//                     }
//                 }
//                 else if (err.status == 403) {
//                     this.toastr.error(err.error.message, 'Authentication !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                     this.dialog.closeAll(); // 👈 close all open dialogs
//                     this.router.navigate(["/forbidden"]);
//                     // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
//                     //     this.router.navigate(['/forbidden']);
//                     // });

//                 } else if (err.status === 500) {
//                     this.toastr.error('Server Error. Please try again after some time', 'Server Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 } else if (err.status === 0) {
//                     if (!this.dialogOpen) {
//                         this.dialogOpen = true;
//                         const dialogRef = this.dialog.open(Error0Component, {
//                             disableClose: true,
//                             width: '400px',
//                             data: { countdown: 300 } // 300 seconds = 5 minutes
//                         });

//                         dialogRef.afterClosed().subscribe(() => {
//                             this.dialogOpen = false;
//                             this.router.navigate(['']);
//                         });
//                     }
//                 }
//                 else {
//                     const errorMessage = 'An unknown error occurred. Please try again after sometime';
//                     this.toastr.error(errorMessage, 'Error !', {
//                         toastClass: 'tostr-tost custom-toast-error',
//                     });
//                 }
//                 return throwError(() => err); // Return an Observable using throwError
//             }),
//             // finalize(() => { // Use finalize for cleanup, even after errors
//             //     this._ls.hide();
//             // })

//             // changed for abha 13-10-2026
//             finalize(() => { // Use finalize for cleanup, even after errors
//                 if (!request.url.includes('/AbhaConnects/')) {
//                     this._ls.hide();
//                 }
//             })
//         );

//         // return next.handle(request).pipe(map(event => {
//         //     if (event instanceof HttpResponse) {
//         //         this._ls.hide();
//         //     }
//         //     return event;
//         // }));
//         //return next.handle(request);
//     }
// }

import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { Error0Component } from "app/main/shared/APIerrorpages/error-0/error-0.component";
import { StoreUnitContextService } from "app/main/shared/services/storeunit-context.service";
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, throwError } from "rxjs";
import { catchError, finalize, map } from 'rxjs/operators';
import { APP_CONFIG, AppConfig } from './../app-config.module';
import { LoaderService } from "./components/loader/loader.service";
import { AuthenticationService } from "./services/authentication.service";
// import { ASSISTANT_LOCAL_ERRORS } from "./services/ai-assistant.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    private dialogOpen = false;

    constructor(@Inject(APP_CONFIG) private config: AppConfig, private dialog: MatDialog,
        private _ls: LoaderService, public toastr: ToastrService, private router: Router,
        private authenticationService: AuthenticationService,
        private contextSvc: StoreUnitContextService) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        const currentUser = this.authenticationService.currentUserValue;
        const ctx = this.contextSvc.getContext();
        const isPublicAuthRequest = /\/login\/(challenge|authenticatev2|confirmauthenticatev2)(?:\?.*)?$/i.test(request.url);
        if (!isPublicAuthRequest && currentUser && currentUser.token) {
            if (request.body instanceof FormData)
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                        'X-Store-Id': ctx?.storeId?.toString() ?? "",
                        'X-Unit-Id': ctx?.unitId?.toString() ?? ""
                    },
                });
            else
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${currentUser.token}`,
                        "Content-Type": "application/json; charset=utf-8",
                        'X-Store-Id': ctx?.storeId?.toString() ?? "",
                        'X-Unit-Id': ctx?.unitId?.toString() ?? ""
                    },
                });
        }

        // stoped the loader for abha api calling 13-10-2026
        if (!request.url.includes('/AbhaConnects/')) {
            this._ls.show();
        }

        // Loading overlay is handled by SpinnerInterceptor (+ <app-global-spinner>); ABHA calls are skipped there.

        return next.handle(request).pipe(
            catchError((err: unknown) => {
                if (!(err instanceof HttpErrorResponse)) {
                    return throwError(() => err);
                }

                // if (request.context.get(ASSISTANT_LOCAL_ERRORS) && err.status !== 401) {
                //     return throwError(() => err);
                // }

                console.error('[HTTP request failed]', {
                    method: request.method,
                    url: request.url.split('?')[0],
                    status: err.status
                });

                if (err.status == 401) {
                    if (isPublicAuthRequest) {
                        return throwError(() => err);
                    }

                    this.authenticationService.clearSession();
                    if (!this.router.url.startsWith('/auth/login')) {
                        this.toastr.error(this.getErrorMessage(err, 'Your session has expired. Please sign in again.'), 'Authentication !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                        this.router.navigate(['/auth/login'], {
                            queryParams: this.router.url === '/' ? undefined : { returnUrl: this.router.url },
                            replaceUrl: true
                        });
                    }
                }
                else if (err.status == 403) {
                    this.toastr.error(this.getErrorMessage(err, 'You do not have permission to access this resource.'), 'Authentication !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                    this.dialog.closeAll(); // 👈 close all open dialogs
                    this.router.navigate(["/forbidden"]);
                    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    //     this.router.navigate(['/forbidden']);
                    // });

                } else if (err.status >= 500) {
                    this.toastr.error('Server Error. Please try again after some time', 'Server Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                } else if (err.status === 0) {
                    if (!isPublicAuthRequest && !this.dialogOpen) {
                        this.dialogOpen = true;
                        const dialogRef = this.dialog.open(Error0Component, {
                            disableClose: true,
                            width: '400px',
                            data: { countdown: 300 } // 300 seconds = 5 minutes
                        });

                        dialogRef.afterClosed().subscribe(() => {
                            this.dialogOpen = false;
                            this.router.navigate(['']);
                        });
                    }
                }
                else {
                    const messages: { [status: number]: string } = {
                        400: 'The request could not be processed. Please check the entered information.',
                        404: 'The requested resource was not found. Please refresh or contact support.',
                        405: 'This action is not supported by the server. Please contact support.',
                        408: 'The request timed out. Please try again.',
                        409: 'The information has changed or already exists. Please refresh and try again.',
                        422: 'Please correct the entered information and try again.',
                        429: 'Too many requests. Please wait a moment before trying again.'
                    };
                    const errorMessage = this.getErrorMessage(err,
                        messages[err.status] || `The request failed (HTTP ${err.status}). Please try again or contact support.`);
                    this.toastr.error(errorMessage, 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
                return throwError(() => err); // Return an Observable using throwError
            }),

             // changed for abha 13-10-2026
            finalize(() => { // Use finalize for cleanup, even after errors
                if (!request.url.includes('/AbhaConnects/')) {
                    this._ls.hide();
                }
            })
        );

        // return next.handle(request).pipe(map(event => {
        //     if (event instanceof HttpResponse) {
        //         this._ls.hide();
        //     }
        //     return event;
        // }));
        //return next.handle(request);
    }

    private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
        const body: unknown = error.error;
        if (error.status === 431 || (error.status === 400 && typeof body === 'string'
            && /request too long|size of the request headers is too long/i.test(body))) {
            return 'The server rejected oversized request headers. Contact support to reduce the login token size or review the server header limit.';
        }
        if (typeof body === 'object' && body !== null && 'message' in body
            && typeof body.message === 'string' && body.message.trim()) {
            return body.message;
        }
        return fallback;
    }
}