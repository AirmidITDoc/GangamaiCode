import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { apiResponse } from "../models/apiResponse";
import { ToastrService } from 'ngx-toastr';
import { environment } from '../../../environments/environment';
import { Router } from "@angular/router";

@Injectable({ providedIn: "root" })
export class ApiCaller {
    ApiUrl = environment.API_BASE_PATH;
    constructor(public _httpClient: HttpClient, public toastr: ToastrService, private router: Router) {
    }
    GetData(url: string): Observable<any> {
        return this._httpClient.get(`${this.ApiUrl}${url}`).pipe(
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
                let errorMessage = 'An unknown error occurred. Please try again after sometime';
                // if (err.error instanceof ErrorEvent) {
                //     errorMessage = `Error: ${err.error.message}`;
                // } else {
                //     errorMessage = `Error Code: ${err.status}\nMessage: ${err.message}`;
                // }
                this.toastr.error(errorMessage, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
                return of(null);  // Return an empty observable to continue without crashing
            }));
    }
    
    PostData(url: string, data: any) {
        return (this._httpClient.post<any>(`${this.ApiUrl}${url}`, data).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                this.toastr.success(data.message, 'success !', {toastClass: 'tostr-tost custom-toast-success',});
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

    PutData(url: string, data: any) {
        return (this._httpClient.put<any>(`${this.ApiUrl}${url}`, data).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                this.toastr.success(data.message, 'success !', {toastClass: 'tostr-tost custom-toast-success',});
                return data?.data || data;
            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        })));
    }

    DeleteData(url: string) {
        return (this._httpClient.delete<any>(`${this.ApiUrl}${url}`).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                this.toastr.success(data.message, 'success !', {toastClass: 'tostr-tost custom-toast-success',});
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
