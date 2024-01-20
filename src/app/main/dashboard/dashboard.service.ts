import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class DashboardService {
  UseFrom: FormGroup;
  constructor(public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { this.UseFrom = this.createUseFrom() }

  createUseFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId:''
    });
  }

  public getDailyDashboardSummary() {
    return this._httpClient.post("Generic/GetByProc?procName=rptDailyDashboardSummary", {})
  }

  public getOPDashChart(params) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOP_DepartmentChart_Range", params)
  }

  public getIPDashChart(params) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIP_DepartmentChart_Range", params)
  }

  public getWard(params) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_WardWiseBedOccupancy_1", params)
  }

  public getWardDetails(params) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BedOccupancyList_1", params)
  }

  // Pharmacy Dashboard Summary
  public getPharDashboardSalesSummary(params) {
    return this._httpClient.post("Generic/GetByProc?procName=m_PharCollectionSummaryDashboard", params)
  }
  // public getPharDashboardPeichart(params) {
  //   return this._httpClient.post("Generic/GetByProc?procName=m_PharCollectionSummaryDashboard", params)
  // }
  public getThreeMonSumData(api, params) {
    return this._httpClient.post("Generic/GetByProc?procName="+api, params)
  }
  public getPharmStoreList() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_PharStoreName", {})
  }

  public getPharStockColSumData(api, params) {
    return this._httpClient.post("Generic/GetByProc?procName="+api, params)
  }

}

