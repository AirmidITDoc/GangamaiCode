import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { apiResponse } from "../models/apiResponse";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: "root" })
export class ApiCaller {
    ApiUrl=environment.API_BASE_PATH;
    constructor(public _httpClient: HttpClient, public toastr: ToastrService) {
    }
    GetData(url: string, passToken: boolean = true): Observable<any> {
        let httpOptions = {};
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
                    return data.data;

                }
                else {
                    this.toastr.error(data.message, 'Error !', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                    return of(null); // Avoid returning anything invalid
                }
            }),
            catchError((err: any): any => {
            let errorMessage = 'An unknown error occurred';
            if (err.error instanceof ErrorEvent) {
                errorMessage = `Error: ${err.error.message}`;
            } else {
                errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
            }
            this.toastr.error(errorMessage, 'Error !', {
                toastClass: 'tostr-tost custom-toast-error',
            });
            return of(null);  // Return an empty observable to continue without crashing
        }));
    }

    PostData(url: string, data: any,passToken: boolean = true) {
        let httpOptions = {};
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
                return data?.data || data;
            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return of(null); // Avoid returning anything invalid
            }
        })));
    }

    PutData(url: string, data: any,passToken: boolean = true) {
        let httpOptions = {};
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
        let httpOptions = {};
        if (passToken) {
            let currentUser=JSON.parse(localStorage.getItem("currentUser"));
            httpOptions = {
                headers: new HttpHeaders({
                    'content-type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                })
            };
        };
        return (this._httpClient.delete<any>(`${this.ApiUrl}${url}`, httpOptions).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
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
