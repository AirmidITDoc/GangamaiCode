import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EndoscopyService {

  constructor(private _httpClient: HttpClient,) { }

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
}
