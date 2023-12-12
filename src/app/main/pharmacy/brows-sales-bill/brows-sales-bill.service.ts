import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowsSalesBillService {

  userForm: FormGroup;
  formReturn: FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.userForm = this.SearchFilter();
    this.formReturn = this.SearchFilterReturn();
  }

  SearchFilter(): FormGroup {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: '',
      L_Name: '',
      SalesNo: '',
      OP_IP_Type: ['3'],
      StoreId: '',
      IPNo: '',
      UserId:'',

    })
  }
  SearchFilterReturn(): FormGroup {
    return this._formBuilder.group({
      startdate1: [(new Date()).toISOString()],
      enddate1: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: '',
      L_Name: '',
      SalesNo: '',
      OP_IP_Types: ['3'],
      StoreId: ''

    })
  }




  public getStoreFromList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  }


  public getSalesList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesBillList", Param);
  }
  public getPdfSales(SalesId, OP_IP_Type) {
    return this._httpClient.get("Pharmacy/view-SalesTax_Report?SalesId=" + SalesId + "&OP_IP_Type=" + OP_IP_Type);
  }

  public getSalesDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesDetails", Param);
  }
  public getLoggedStoreList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional", Param);
  }

  public getSalesReturnList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnBillList", Param);
  }
  public getSalesReturnDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnDetails", Param);
  }

  public InsertSalessettlement(emp) {
    return this._httpClient.post("Pharmacy/PaymentSettlement", emp);
  }


  public getSalesReturnPrint(emp) {
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesReturnPrint", emp);
  }

  public getSalesReturnPdf(SalesId,OP_IP_Type) {
    return this._httpClient.get("Pharmacy/view-SalesTaxReturn_Report?SalesId=" + SalesId + "&OP_IP_Type=" + OP_IP_Type);
    }
  

  public getSalesCollectionSummary(emp){
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesDailyColSummary", emp);
  }
  
  public getSalesDailyCollection(emp){
    return this._httpClient.post("Generic/GetByProc?procName=RptSalesDailyCollection ", emp);
  }

  public getSalesDailyCollectionNew(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Pharmacy/view-pharmacy-daily-collection?FromDate=" +  FromDate + "&ToDate=" + ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDailyCollectionSummary(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Pharmacy/view-pharmacy-daily-collection_Summary?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }

  public getSalesDailyCollectionSummaryDayuserwise(FromDate,ToDate,StoreId,AddedById){
    return this._httpClient.get("Pharmacy/view-PharCollectionSummaryDayanduserwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }
  public getSalesDetailSummary(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId){
    return this._httpClient.get("Pharmacy/view-PharCollectionSummaryDayanduserwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
  }


public getSalesDetail_Patientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,AddedBy,StoreId){
    return this._httpClient.get("Pharmacy/view-Sales_Report_PatientWise?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
  }

  public getSalesReturnPatientwise(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId){
    return this._httpClient.get("Pharmacy/view-SalesReturn_Patientwise_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }

  public getSalesReturn(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId){
    return this._httpClient.get("Pharmacy/view-SalesReturnSummary_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&StoreId="+StoreId);
  }


  public getSalesCredit(FromDate,ToDate,SalesFromNumber,SalesToNumber,CreditReasonId,StoreId){
    return this._httpClient.get("Pharmacy/view-SalesCredit_Report?FromDate=" + FromDate+"&ToDate="+ToDate+"&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&CreditReasonId="+CreditReasonId+"&StoreId="+StoreId);
  }



  public getSalesDetailPatientwise(emp){
    return this._httpClient.post("Generic/GetByProc?procName=RptPharmacyCreditReport_PatientWise ", emp);
  }

  public getSalesDetail(FromDate,ToDate,SalesFromNumber,SalesToNumber,StoreId,AddedById){
    return this._httpClient.get("Pharmacy/view-pharmacy-daily-collection_Summary=" + "&FromDate="+ FromDate + "&ToDate=" + ToDate+ "&SalesFromNumber=" +SalesFromNumber+"&SalesToNumber=" +SalesToNumber+"&StoreId="+StoreId+"&AddedById="+AddedById);
  }
}
