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
        if (currentUser && currentUser.token) {
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
        this._ls.show();
        return next.handle(request).pipe(
            catchError((err: HttpErrorResponse) => { // Type the error as HttpErrorResponse
                if (err.status == 401) {
                    if (err.url.endsWith('/login/get-menus')) {
                        return EMPTY;
                    }
                    else {
                        this.toastr.error(err.error.message, 'Authentication !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                        this.router.navigate(["/unauthorize"]);
                    }
                }
                else if (err.status == 403) {
                    this.toastr.error(err.error.message, 'Authentication !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                    this.dialog.closeAll(); // 👈 close all open dialogs
                    this.router.navigate(["/forbidden"]);
                    // this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    //     this.router.navigate(['/forbidden']);
                    // });

                } else if (err.status === 500) {
                    this.toastr.error('Server Error. Please try again after some time', 'Server Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                } else if (err.status === 0) {
                    if (!this.dialogOpen) {
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
                    const errorMessage = 'An unknown error occurred. Please try again after sometime';
                    this.toastr.error(errorMessage, 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
                return throwError(() => err); // Return an Observable using throwError
            }),
            finalize(() => { // Use finalize for cleanup, even after errors
                this._ls.hide();
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
}