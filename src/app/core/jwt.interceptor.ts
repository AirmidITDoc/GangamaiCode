import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from './services/authentication.service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = this.authenticationService.currentUserValue;
        if (currentUser && currentUser.token) {
            request = request.clone({
                setHeaders: {
                    Authorization: `Bearer ${currentUser.token}`
                }
            });
        }
        // HIMS Link
        //  request = request.clone({ url: `http://localhost:63750/swagger/index.html/${request.url}` });

        // request = request.clone({ url: `http://103.117.208.130:6064/api/${request.url}` });

         request = request.clone({ url: `http://103.117.208.130:6063/api/${request.url}` });

         
        // Construction Link
        //request = request.clone({ url: `http://117.232.117.146:4022/api/${request.url}` });
        // Local Link
     //   request = request.clone({ url: `http://localhost:63750/api/${request.url}` });
        return next.handle(request);
    }
}