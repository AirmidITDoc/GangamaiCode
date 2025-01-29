import { Inject, Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { AppConfig, APP_CONFIG } from './../app-config.module';
import { AuthenticationService } from "./services/authentication.service";
import { catchError, finalize, map } from 'rxjs/operators';
import { LoaderService } from "./components/loader/loader.service";


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private config: AppConfig,
        private _ls: LoaderService,
        private authenticationService: AuthenticationService) { }

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
                    "Access-Control-Allow-Origin": "*",
                    "Content-Type": "application/json; charset=utf-8"
                },
            });
        }
        this._ls.show();
        return next.handle(request).pipe(map(event => {
            if (event instanceof HttpResponse) {
                debugger
                this._ls.hide();
            }
            return event;
        }));
        //return next.handle(request);
    }
}