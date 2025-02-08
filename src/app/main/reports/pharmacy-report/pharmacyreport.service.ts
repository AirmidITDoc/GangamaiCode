import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PharmacyreportService {
  userForm:FormGroup;
  constructor( public _formBuilder:FormBuilder,
    private _loaderService: LoaderService,
    public _httpClient:HttpClient) {this.userForm=this.createUserFormGroup()}

    createUserFormGroup(){
      return this._formBuilder.group({
        startdate: [(new Date()).toISOString()],
        enddate: [(new Date()).toISOString()],
        UserId:'',
        RegNo:'',
        FirstName:'',
        LastName:'',
        BillNo:'',
        DrugTypeId:'',
        Radio:['1'],
        StoreId:[''],
        ItemId:[''],
        DoctorID:[''],
        OPIPType:['2'],
        RegID:[''],
        PaymentMode:['']
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

  // public getDoctorMaster(loader = true) {
   
  //   return this._httpClient.post("Generic/GetByProc?procName=m_RetrieveDoctorMasterForCombo", {})
  // }
  public getDoctorMaster(param) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorListMasterForCombo", param)
  }
  // public getPharmacyDailyCollectionNew(FromDate,ToDate,StoreId,AddedById){
  //   return this._httpClient.get("Sales/view-pharmacy-daily-collection?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  // }

  public getPharmacyDailyCollectionNew(FromDate,ToDate,StoreId,AddedById,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-PharmacyDailyCollectionReport?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }
  
  public getSalesDailyCollectionSummary(FromDate,ToDate,StoreId,AddedById,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-pharmacy-daily-collection_Summary?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDailyCollectionSummaryDayuserwise(FromDate,ToDate,StoreId,AddedById,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-PharCollectionSummaryDayanduserwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDetail_Patientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId,RegId,loader = true){
    debugger
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-SalesPatientWiseReport?FromDate=" + FromDate + "&ToDate="+ToDate + "&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId+"&RegId="+RegId);
  }

  public getSalesReturnsummary(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-SalesReturnSummary_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }


  public getSalesCredit(FromDate,ToDate,SalesFromNumber,SalesToNumber,CreditReasonId,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-SalesCredit_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&CreditReasonId="+CreditReasonId+"&StoreId="+StoreId);
  }
  public getSalesReturnPatientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-SalesReturn_Patientwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }

  public getDrugTypeCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemDrugTypeList", {})
  }


  public getSalesCashBook(FromDate,ToDate,PaymentMode,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-PharSalesCashBookReport?FromDate=" + FromDate + "&ToDate=" + ToDate + "&PaymentMode=" + PaymentMode + "&StoreId="+StoreId);
  }

  public getSalesDetailSummary(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("Sales/view-SalesSummary_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
  }

  
  public getSchduleh1Book(FromDate,ToDate,DrugTypeId,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-SCHEDULEH1Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&DrugTypeId="+DrugTypeId+"&StoreId="+StoreId);
  }

  public getSchsuleh1salesummaryBook(FromDate,ToDate,DrugTypeId,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-SCHEDULEH1SalesSummaryReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+"&DrugTypeId="+DrugTypeId+"&StoreId="+StoreId);
  }
  public getSalesh1drugcount(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-SalesH1DrugCountReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+"&StoreId="+StoreId);
  }

  public getItemwisedailysales(FromDate,ToDate,ItemId,RegNo,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-ItemWiseDailySalesReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&ItemId="+ItemId+"&RegNo="+RegNo+"&StoreId="+StoreId);
  }

  public getHighriskdrug(FromDate,ToDate,StoreId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-WardWiseHighRiskDrugList?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId);
  }

  public getPurchaseorderlist(StoreId,FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-PurchaseReOrderList?StoreId=" + StoreId+"&FromDate="+FromDate+"&ToDate="+ToDate);
  }
  public getPharmacybillsummary(StoreId,FromDate,ToDate,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-PharmacyBillSummaryReport?StoreId=" + StoreId+"&FromDate="+FromDate+"&ToDate="+ToDate);
  }

  public getPharmacyDrprofit(FromDate,ToDate,DoctorId,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-DoctorWiseProfitReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId);
  }

  
  
  
  public getDrwisesales(FromDate,ToDate,StoreId,DoctorId,OP_IP_Type,loader = true){
    debugger
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-DoctorWiseSalesReport?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&DoctorId="+DoctorId+"&OP_IP_Type=" + OP_IP_Type);
  }

  public getDrwiseprofitdetail(FromDate,ToDate,StoreId,DoctorId,OP_IP_Type,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-PharmacySalesDoctorWiseProfitDetailsReportOPIP?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&DoctorId="+DoctorId+"&OP_IP_Type="+OP_IP_Type);
  }
  
  public getdrwiseperofitsummary(FromDate,ToDate,DoctorId,OP_IP_Type,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.get("PharmacyReport/view-PharmacySalesDoctorWiseProfitReportSummaryOPIP?FromDate=" + FromDate+"&ToDate="+ToDate+"&DoctorId="+DoctorId+"&OP_IP_Type="+OP_IP_Type);
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_Item_Name",Param)
  }



  getStoreList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{})
  }

  public getPatientRegisterListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }
  public getDoctorWiseSalesReportlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptDoctorWiseSalesReport", employee)
  }
  public getPurchaseOrderlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rpt_PurReOrder_1", employee)
  }
  public getWardWiseHighRiskDrugReportlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptIPPatientWardWiseSalesList", employee)
  }
  public getPharmacybillsummryReportlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptPharmacyBillSummaryReport", employee)
  }
  public getItemWiseDailyReportlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesProductWiseDaily", employee)
  }
  public getScheduleH1SalesSummryReportlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesH1DrugReport", employee)
  }
  public getSalesH1DrugCountlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesH1DrugCount", employee)
  }
  public getSalesDailyCollectionlist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesDailyCollection", employee)
  }
  public getSalesDailyCollectionSummarylist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesDailyColSummary", employee)
  } 
  public getSalesCashBooklist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesCashbook", employee)
  } 
  public getSalesDailyColleSummryUserwiselist(employee,loader = true){
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesDailyColSummary_DayWise", employee)
  } 
}

