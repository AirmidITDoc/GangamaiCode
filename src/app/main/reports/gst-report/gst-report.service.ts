import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class GstReportService {
  userForm:FormGroup;
  constructor(public _formBuilder:FormBuilder,
    private _loaderService: LoaderService,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup();}




      createUserFormGroup(){
        return this._formBuilder.group({
          startdate: [(new Date()).toISOString()],
          enddate: [(new Date()).toISOString()],
          UserId:'',
          DoctorId:'',
          StoreId:'',
          ReportType:['1']
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

    
  public getSalesprofitsummaryReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesProfitSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getSalesprofitbillReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesProfitBillReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getProfititemwisesummaryReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesProfitItemWiseSummaryReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getpurchasesupplierwiseReport(FromDate,ToDate,StoreId,loader = true){
  
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-PurchaseGSTReportSupplierWiseGST?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getpurchasesupplierwisewithoutgstReport(FromDate,ToDate,StoreID,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-PurchaseGSTReportSupplierWiseWithoutGST?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreID="+StoreID);
  }

  public getpurchasedatewiseReport(FromDate,ToDate,StoreId,loader = true){
  
    return this._httpClient.get("GSTReport/view-ViewPurchaseGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
  public getpurchasegstsummaryReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-ViewPurchaseGSTReportSummary?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }


  public getpurchasereturndatewiseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-PurchaseRetumGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  public getpurchasereturngstsummaryReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-PurchaseRetumGSTReportDateWise?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getSalesGstReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesGSTReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
  public getSalesGstdatewiseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesGSTDateWiseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
  public getSalesreturnReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
  
    return this._httpClient.get("GSTReport/view-SalesReturnGSTReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }


  public getSalesreturndatewiseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-SalesReturnGSTDateWiseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
  
 
  public geGSTB2cReport(FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-SalesReturnGSTReport?FromDate="+FromDate+"&ToDate="+ToDate);
  }
  
  public getHSNcodewiseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-HSNCodeWiseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public geGSTRAZPurchaseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-GSTRZAPurchaseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }
 
  public geGSTR2ASupplierwiseReport(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-ViewGSTR2ASupplierWisePurchaseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public geDrWiseProfitDetailReport(FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-SalesProfitDetailDoctorWiseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }

  public geDrWiseProfitSummeryReport(FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("GSTReport/view-SalesProfitSummaryDoctorWiseReport?FromDate="+FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }

  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }

  public getDoctorMaster() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
}
