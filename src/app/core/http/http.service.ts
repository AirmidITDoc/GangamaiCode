import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, map } from 'rxjs/operators';
import { environment } from 'environments/environment';
import { LoaderService } from "../components/loader/loader.service";
import { ApiResponse } from "../constants/interface";

@Injectable({
  providedIn: "root",
})
export class HttpService {
  private _apiUrl: string;
  constructor(private _http: HttpClient, private _loaderService: LoaderService) {
    this._apiUrl = environment.API_BASE_PATH;
  }

  get<T>(url, httpParams?: any, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.get<ApiResponse<T>>(this._apiUrl + url, { params: httpParams });
  }
  post<T>(url, data, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.post<ApiResponse<T>>(this._apiUrl + url, data);
  }
  put<T>(url, data?, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.put<ApiResponse<T>>(this._apiUrl + url, data);
  }
  delete<T>(url, query?: any, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.delete<ApiResponse<T>>(this._apiUrl + url, { params: query });
  }
  patch<T>(url, data, option?, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.patch<ApiResponse<T>>(this._apiUrl + url, data, { params: option });
  }

  getCallForQuery<T>(url, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.get<ApiResponse<T>>(this._apiUrl + url);
  }
  getLocal(url: string): Observable<any> {
    return this._http.get(url).pipe(catchError((err: HttpErrorResponse) => throwError(err)));
  }
  postFile<T>(url, content_, loader = true): Observable<ApiResponse<T>> {
    if (loader) {
      this._loaderService.show();
    }
    return this._http.post<ApiResponse<T>>(this._apiUrl + url, content_);
  }
}