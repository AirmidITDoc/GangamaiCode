import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(public _httpClient:HttpClient,
    private _formBuilder: FormBuilder) { }

  public getDailyDashboardSummary()
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptDailyDashboardSummary",{})
  }

  public getOPDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptOP_DepartmentChart_Range", params)
  }

  public getIPDashChart(params)
  {
    return this._httpClient.post("Generic/GetByProc?procName=rptIP_DepartmentChart_Range", params)
  }
}
