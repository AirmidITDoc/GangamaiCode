import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharmacyreportService {
  UserFormGroup:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    public _httpClient:HttpClient) {this.UserFormGroup=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        RegNo:'',
        FirstName:'',
        LastName:'',
        BillNo:'',
        Radio:['1']

      })
    }
  public getDataByQuery(emp) {
    // return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
  }

  public getUserdetailList(data){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
  }

  public getPaymentModeList(){
    return this._httpClient.post("Generic/GetByProc?procName=M_Rtrv_PaymentModeList",{})
  }


  public getPharmacyDailyCollectionNew(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Sales/view-pharmacy-daily-collection?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDailyCollectionSummary(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Sales/view-pharmacy-daily-collection_Summary?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDailyCollectionSummaryDayuserwise(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Sales/view-PharCollectionSummaryDayanduserwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDetail_Patientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId){
    return this._httpClient.get("Sales/view-Sales_Report_PatientWiseNew?FromDate=" + FromDate + "&ToDate="+ToDate + "&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
  }

  public getSalesReturnsummary(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId){
    return this._httpClient.get("Sales/view-SalesReturnSummary_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }


  public getSalesCredit(FromDate,ToDate,SalesFromNumber,SalesToNumber,CreditReasonId,StoreId){
    return this._httpClient.get("Sales/view-SalesCredit_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&CreditReasonId="+CreditReasonId+"&StoreId="+StoreId);
  }
  public getSalesReturnPatientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId){
    return this._httpClient.get("Sales/view-SalesReturn_Patientwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }

  


  public getSalesCashBook(FromDate,ToDate,PaymentMode,StoreId){
    return this._httpClient.get("Sales/view-PharSalesCashBookReport?FromDate=" + FromDate + "&ToDate=" + ToDate + "&PaymentMode=" + PaymentMode + "&StoreId="+StoreId);
  }

  public getSalesDetailSummary(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId){
    return this._httpClient.get("Sales/view-SalesSummary_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
  }

  
  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }
}

