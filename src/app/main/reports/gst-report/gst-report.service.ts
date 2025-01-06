import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class GstReportService {
  userForm:UntypedFormGroup;
  constructor(public _formBuilder:UntypedFormBuilder,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup();}




      createUserFormGroup(){
        return this._formBuilder.group({
          startdate: [(new Date()).toISOString()],
          enddate: [(new Date()).toISOString()],
          UserId:'',
          DoctorId:'',
          StoreId:'',
          // VisitId:'',
          // PaymentId:'',
          // RefundId:'',
          // DoctorID:'',
          // ServiceId:'',
          // GroupId:''
          // Radio:['1']
  
        })
      }
    public getDataByQuery(emp) {
          return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ReportList",emp)
    }
  
    public getUserdetailList(data){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo",data)
    }

    
  public getSalesprofitsummaryReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesProfitSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getSalesprofitbillReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-SalesProfitBillReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getProfititemwisesummaryReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-SalesProfitItemWiseSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getpurchasesupplierwiseReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-PurchaseGSTReportSupplierWiseGST?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getpurchasesupplierwisewithoutgstReport(FromDate,ToDate,StoreID){
  
    return this._httpClient.get("GSTReport/view-PurchaseGSTReportSupplierWiseWithoutGST?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreID="+StoreID);
  }

  public getpurchasedatewiseReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-ViewPurchaseGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
  public getpurchasegstsummaryReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-ViewPurchaseGSTReportSummary?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }


  public getpurchasereturndatewiseReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-PurchaseRetumGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getpurchasereturngstsummaryReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-PurchaseRetumGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getSalesGstReport(FromDate,ToDate,StoreId){
  
    return this._httpClient.get("GSTReport/view-SalesGSTReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
  public getSalesGstdatewiseReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesGSTDateWiseReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getSalesreturnReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesReturnGSTReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }


  public getSalesreturndatewiseReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesReturnGSTDateWiseReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
 
  public geGSTB2cReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-SalesReturnGSTReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getHSNcodewiseReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-HSNCodeWiseReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public geGSTRAZPurchaseReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-GSTRZAPurchaseReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
 
  public geGSTR2ASupplierwiseReport(FromDate,ToDate){
  
    return this._httpClient.get("GSTReport/view-ViewGSTR2ASupplierWisePurchaseReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }
}
