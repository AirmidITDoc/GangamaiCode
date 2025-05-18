import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class BrowsSalesBillService {

  userForm: FormGroup;
  formReturn: FormGroup;
  SalesPatientForm: FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder,
    private _loaderService: LoaderService,
    private _loggedService: AuthenticationService,
    private _FormvalidationserviceService:FormvalidationserviceService
  ) {
    this.userForm = this.SearchFilter();
    this.formReturn = this.SearchFilterReturn();
    this.SalesPatientForm = this.SearchFilterReturn();
  }

  SearchFilter(): FormGroup {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      L_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      SalesNo: '',
      OP_IP_Type: ['3'], 
      IPNo: '',
      UserId:'',
      PaymentMode:'',
      StoreId: [this._loggedService.currentUserValue.user.storeId,
        [Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], 
    })
  }
  SearchFilterReturn(): FormGroup {
    return this._formBuilder.group({
      startdate1: [(new Date()).toISOString()],
      enddate1: [(new Date()).toISOString()],
      RegNo: '',
      F_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      L_Name: ['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      SalesNo: '',
      OP_IP_Types: ['3'],
      StoreId: [this._loggedService.currentUserValue.user.storeId]

    })
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      fromDate: [],
      enddate: [], 
      IPDNo: '',
      F_Name:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      M_Name:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      L_Name:['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]], 
      IsDischarge:[0],  
    });
  }


  public getStoreFromList() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName", {});
  }


  public getSalesList(Param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
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

  public getSalesReturnList(Param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnBillList", Param);
  }
  public getSalesReturnDetList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_SalesReturnDetails", Param);
  }

  public InsertSalessettlement(emp) {
    return this._httpClient.post("Pharmacy/PaymentSettlement", emp);
  }

  public InsertWhatsappSales(emp){
    return this._httpClient.post("WhatsappEmail/WhatsappSalesSave", emp);
  }

  public InsertWhatsappSalesReturn(emp){
    return this._httpClient.post("WhatsappEmail/WhatsappSalesReturnSave", emp);
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

  public getPurchaseOrder(PurchaseID){
    return this._httpClient.get("Pharmacy/view-PurchaseOrder_Report?PurchaseID=" +  PurchaseID);
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
    return this._httpClient.get("Pharmacy/view-Sales_Report_PatientWiseNew?FromDate=" + FromDate + "&ToDate="+ToDate + "&SalesFromNumber="+SalesFromNumber+"&SalesToNumber="+SalesToNumber+"&AddedBy="+AddedBy+"&StoreId="+StoreId);
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

  public getSalesCashBook(FromDate,ToDate,PaymentMode,StoreId){
    return this._httpClient.get("Pharmacy/view-PharSalesCashBookReport?FromDate=" + FromDate + "&ToDate=" + ToDate + "&PaymentMode=" + PaymentMode + "&StoreId="+StoreId);
  }
  public getPdfSalesstatement(OP_IP_ID,StoreId){
    return this._httpClient.get("Sales/view-PatientStatement?OP_IP_ID=" + OP_IP_ID +"&StoreId=" + StoreId);
  }
  
}
