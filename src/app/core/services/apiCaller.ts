import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ToastrService } from 'ngx-toastr';
import { Observable, of } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { apiResponse } from "../models/apiResponse";
import { AppConfigService } from "./api-config.service";

@Injectable({ providedIn: "root" })
export class ApiCaller {
    //ApiUrl = environment.API_BASE_PATH;
    constructor(public _httpClient: HttpClient, public toastr: ToastrService, private router: Router, private config: AppConfigService
    ) {
    }
    GetData(url: string): Observable<any> {
        return this._httpClient.get(`${this.config.apiBaseUrl}${url}`).pipe(
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
        return (this._httpClient.post<any>(`${this.config.apiBaseUrl}${url}`, data).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                if (data.message)
                    this.toastr.success(data.message, 'success !', { toastClass: 'tostr-tost custom-toast-success', });
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
        return (this._httpClient.put<any>(`${this.config.apiBaseUrl}${url}`, data).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                if (data.message)
                    this.toastr.success(data.message, 'success !', { toastClass: 'tostr-tost custom-toast-success', });
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
        return (this._httpClient.delete<any>(`${this.config.apiBaseUrl}${url}`).pipe(map((data: apiResponse) => {
            if (data.statusCode == 200) {
                if (data.message)
                    this.toastr.success(data.message, 'success !', { toastClass: 'tostr-tost custom-toast-success', });
                return data?.data || data;
            }
            else {
                this.toastr.error(data.message, 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        })));
    }
    downloadFilePost(url: string, body: any, filename: string): Observable<Blob> {
        return this._httpClient.post(`${this.config.apiBaseUrl}${url}`, body, {
            responseType: 'blob',
            observe: 'response',
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Accept': 'application/octet-stream'
            })
        }).pipe(
            map(response => {
                this.saveFile(response.body as Blob, filename);
                return response.body as Blob;
            })
        );
    }
    saveFile(blob: Blob, filename: string): void {
        const link = document.createElement('a');
        const url = window.URL.createObjectURL(blob);

        link.href = url;
        link.download = filename;
        link.click();

        // Cleanup
        setTimeout(() => {
            window.URL.revokeObjectURL(url);
            link.remove();
        }, 100);
    }

}
