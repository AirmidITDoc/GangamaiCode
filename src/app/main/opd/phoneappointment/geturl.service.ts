import { HttpBackend, HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GeturlService {

  constructor(
    private handler: HttpBackend, private _httpClient: HttpClient
  ) { }

  getVisitData() {
    this._httpClient = new HttpClient(this.handler);
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
    let httpOptions = {
      headers: headers,
    };

    return this._httpClient
      .post<any>("http://49.248.20.2:5003/api/Generic/GetByProc?procName=crms_visitdetails", { "mrno": 111023 }, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
        } else {

          return throwError(error);
        }
      }));
  }
  getBillData() {
    this._httpClient = new HttpClient(this.handler);
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
    let httpOptions = {
      headers: headers,
    };

    return this._httpClient
      .post<any>("http://49.248.20.2:5003/api/Generic/GetByProc?procName=crms_bill", { "visitid":2652762 }, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
        } else {

          return throwError(error);
        }
      }));
  }
  getBillDetData() {
    this._httpClient = new HttpClient(this.handler);
    let headers = new HttpHeaders()
      .set("Content-Type", "application/json")
      .set("Accept", "application/json")
    let httpOptions = {
      headers: headers,
    };

    return this._httpClient
      .post<any>("http://49.248.20.2:5003/api/Generic/GetByProc?procName=crms_billdetails", { "billid": 2623564 }, httpOptions)
      .pipe(catchError((error: HttpErrorResponse) => {
        console.log(error);
        if (error.status === 401) {
        } else {

          return throwError(error);
        }
      }));
  }


}



