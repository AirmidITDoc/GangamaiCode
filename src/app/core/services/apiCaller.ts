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
    PostFromData(url: string, data: any) {
        const formData = this.toFormData(data);
        return (this._httpClient.post<any>(`${this.config.apiBaseUrl}${url}`, formData).pipe(map((data: apiResponse) => {
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
    toFormData(data: any, form: FormData = new FormData(), namespace: string = ''): FormData {
        for (const key of Object.keys(data)) {
            const value = data[key];
            const formKey = namespace ? ((value instanceof File || value instanceof Blob) ? `${namespace}.${key}` : `${namespace}[${key}]`) : key;

            if (value instanceof File || value instanceof Blob) {
                form.append(formKey, value);
            } else if (Array.isArray(value)) {
                value.forEach((item, index) => {
                    const arrayKey = `${formKey}[${index}]`;
                    if (item instanceof File || item instanceof Blob) {
                        form.append(arrayKey, item);
                    } else if (typeof item === 'object' && item !== null) {
                        this.toFormData(item, form, arrayKey); // Recurse with index
                    } else {
                        form.append(arrayKey, item != null ? item.toString() : '');
                    }
                });
            } else if (typeof value === 'object' && value !== null) {
                this.toFormData(value, form, formKey); // Recursively handle nested objects
            } else if (value !== null && value !== undefined) {
                form.append(formKey, value.toString());
            }
        }
        return form;
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
    PutFromData(url: string, data: any) {
        const formData = this.toFormData(data);
        return (this._httpClient.put<any>(`${this.config.apiBaseUrl}${url}`, formData).pipe(map((data: apiResponse) => {
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
