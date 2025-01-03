import { Inject, Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable } from "rxjs";
import { catchError, map } from "rxjs/operators";

import { ToastrService } from 'ngx-toastr';
import { APP_CONFIG, AppConfig } from "app/app-config.module";
import { User } from "../models/user";
import { AuthenticationService } from "./authentication.service";
import { environment } from '../../../environments/environment';
import { apiResponse } from "../models/apiResponse";

@Injectable({ providedIn: "root" })
export class ApiCaller {
    ApiUrl=environment.API_BASE_PATH;
    constructor(@Inject(APP_CONFIG) private config: AppConfig, public _httpClient: HttpClient, public toastr: ToastrService,private authenticationService: AuthenticationService) {
    }
    GetData(url: string, passToken: boolean = true): Observable<any> {
        var httpOptions = {};
        if (passToken) {
            let currentUser=JSON.parse(localStorage.getItem("currentUser"));
            httpOptions = {
                headers: new HttpHeaders({
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            };
        };
        return this._httpClient.get(`${this.ApiUrl}${url}`, httpOptions).pipe(
            map((data: apiResponse) => {
                if (data.statusCode == 200) {
                    console.log('get : ' + data.data);
                    return data.data;

                }
                else {
                    this.toastr.error(data.message, 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            }),
            catchError((err: any): any => {
            this.toastr.error(err, 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
        }));
    }

    PostData(url: string, data: any,passToken: boolean = true) {
        var httpOptions = {};
        if (passToken) {
            let currentUser=JSON.parse(localStorage.getItem("currentUser"));
            httpOptions = {
                headers: new HttpHeaders({
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            };
        };
        return (this._httpClient.post<any>(`${this.ApiUrl}${url}`, data,httpOptions).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                console.log('Post : ' + data.data);
                return data?.data || data;
            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        })));
    }

    PutData(url: string, data: any,passToken: boolean = true) {
        var httpOptions = {};
        if (passToken) {
            let currentUser=JSON.parse(localStorage.getItem("currentUser"));
            httpOptions = {
                headers: new HttpHeaders({
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            };
        };
        return (this._httpClient.put<any>(`${this.ApiUrl}${url}`, data,httpOptions).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                console.log('Put : ' + data.data);
                return data?.data || data;
            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        })));
    }

    DeleteData(url: string,passToken: boolean = true) {
        var httpOptions = {};
        if (passToken) {
            let currentUser=JSON.parse(localStorage.getItem("currentUser"));
            httpOptions = {
                headers: new HttpHeaders({
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            };
        };
        return (this._httpClient.delete<any>(`${this.ApiUrl}${url}`).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                console.log('Delete : ' + data.data);
                return data?.data || data;

            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        })));
    }    
}
