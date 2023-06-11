import { Injectable } from "@angular/core";
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from "@angular/common/http";
import { Observable } from "rxjs";

import { AuthenticationService } from "./services/authentication.service";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) {}

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
        // HIMS Link
        //  request = request.clone({ url: `http://localhost:63750/swagger/index.html/${request.url}` });
        request = request.clone({
            url: `http://103.113.29.249:7001/api/${request.url}`,
        });

        // Vijaypura Live
        //  request = request.clone({ url: `http://103.112.213.175:201/api/${request.url}` });
        // http://103.117.208.130:6063/swagger/index.html
        // Construction Link
        // http://103.117.208.130:6062/swagger/index.html
                            //    request = request.clone({ url: `http://103.117.208.130:6063/api/${request.url}` });
      
      
                            // Local Link
    //    request = request.clone({ url: `http://localhost:63750/api/${request.url}` });

       request = request.clone({ url: `http://103.113.29.249:7001/api/${request.url}` });
        return next.handle(request);
    }
}
