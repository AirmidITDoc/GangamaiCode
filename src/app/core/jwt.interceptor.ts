import { Inject, Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AppConfig, APP_CONFIG } from './../app-config.module';
import { AuthenticationService } from "./services/authentication.service";
import { mainModule } from "process";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(@Inject(APP_CONFIG) private config: AppConfig,
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
    request = request.clone({ url: this.config.apiEndpoint +`/${request.url}` });
                            // Local Link
    // request = request.clone({ url: `http://localhost:63750/api/${request.url}` });
        return next.handle(request);
    }
}