import { Inject, Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from "@angular/common/http";
import { EMPTY, Observable, throwError } from "rxjs";
import { AppConfig, APP_CONFIG } from './../app-config.module';
import { AuthenticationService } from "./services/authentication.service";
import { catchError, finalize, map } from 'rxjs/operators';
import { LoaderService } from "./components/loader/loader.service";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private config: AppConfig,
    private _ls: LoaderService,
    public toastr: ToastrService,
    private router: Router,
    private authenticationService: AuthenticationService) {} 

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`,
                },
            });
        }
    //    main
    // if(request.url.indexOf('Gender') > -1)
    //     request = request.clone({ url: `http://192.168.2.100:8083/api/v1/${request.url}` });
    // else 
   request = request.clone({ url: this.config.apiEndpoint +`/${request.url}` });
                            // Local Link
    //   request = request.clone({ url: `http://localhost:63750/api/${request.url}` });
        //return next.handle(request);
        return next.handle(request).pipe(
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                this._ls.hide();
                // return throwError(error.error ? error.error : error);
                if (error.status == 401) {
                    if (error.url.endsWith('/login/get-menus')) {
                        return EMPTY;
                    }
                    else {
                        this.toastr.error(error.error.message, 'Authentication !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                        this.router.navigate(["/unauthorize"]);
                    }
                }
                else if (error.status == 403) {
                    this.toastr.error(error.error.message, 'Authentication !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                    this.router.navigate(["/forbidden"]);
                } else if (error.status === 0 || error.status === 500) {
                    this.toastr.error('Unable to connect to the server. Please try again later.', 'Server !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
                return throwError(() => error); // Return an Observable using throwError
            }),
            finalize(() => {
                this._ls.hide();
            })
          );  
    }  
    
}