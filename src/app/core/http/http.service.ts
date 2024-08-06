import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { LoaderService } from "../components/loader/loader.service";
import { ApiResponse } from "../constants/interface";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  constructor(private _http: HttpClient, private _loaderService: LoaderService) {}

  get<T>(url, httpParams?: any, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.get<ApiResponse<T>>(url, { params: httpParams });
  }
  post<T>(url, data, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.post<ApiResponse<T>>(url, data);
  }
  put<T>(url, data?, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.put<ApiResponse<T>>(url, data);
  }
  delete<T>(url, query?: any, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.delete<ApiResponse<T>>(url, { params: query });
  }
  patch<T>(url, data, option?, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.patch<ApiResponse<T>>(url, data, { params: option });
  }

  getCallForQuery<T>(url, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.get<ApiResponse<T>>(url);
  }
  getLocal(url: string): Observable<any> {
    return this._http.get(url).pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }
  postFile<T>(url, content_, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.post<ApiResponse<T>>(url, content_);
  }
}