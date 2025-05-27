import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  userFormGroup: FormGroup;
  IndentSearchGroup :FormGroup;
  PrescriptionFrom:FormGroup;


  constructor(
    public _httpClient: HttpClient,public _httpClient1 :ApiCaller,
    private _loaderService: LoaderService,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.IndentSearchGroup= this.IndentSearchFrom();
    this.PrescriptionFrom = this.CreatePrescriptionFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
      Barcode:'',
      StoreId: '',
      ItemId:'',
      ItemName:'',
      BatchNo:'',
      BatchExpDate:'',
      BalanceQty:'',
      UnitMRP:'',
      Qty: [' ', [Validators.pattern("^^[1-9]+[0-9]*$")] ],
      IssQty:'',
      Bal:'',
      StoreName:'',
      GSTPer:'',
      GSTAmt:'',
      MRP:'',
      TotalMrp:'',
      DiscAmt: [' ', [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$")] ],
      NetAmt:'',
      DiscPer:'',
      MarginAmt:'0'
      // ItemName:'',
      // start: [(new Date()).toISOString()],
      // end: [(new Date()).toISOString()],
    });
  }
  
    IndentID() {
    return this._formBuilder.group({
      RoleId: '',
      RoleName: '',
      AdmDate:'',
      Date:'',
      StoreName:'',
      PreNo:'',
      IsActive: '',
      
    });
  }
  CreatePrescriptionFrom() {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      StoreId:'',
      RegNo:'',
      Status:'0',
      PreNo:'',
      IsActive: '',
      
    });
  }
 
  public getIndentID(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Indent_by_ID",Param);
  }


  public getIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
  }

  public getTopSalesDetails(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Top3SalesDetails",Param);
  }

  public getStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }
  
  public getItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param);
  }
  // ItemMaster/GetItemListForSalesBatchPop?StoreId=2&ItemId=0
  public getBatchList(Param){ 
    return this._httpClient1.GetData("ItemMaster/GetItemListForSalesBatchPop?StoreId="+Param.StoreId+"&ItemId="+Param.ItemId); 
  }
  public getConcessionCombo()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
  }
  public InsertCashSales(employee){
    return this._httpClient.post("Pharmacy/SalesSaveWithPayment", employee)
  }

  public InsertCreditSales  (employee){
    return this._httpClient.post("Pharmacy/SalesSaveWithCredit", employee)
  }

  public InsertSalesDraftBill(employee){
    return this._httpClient.post("Pharmacy/SalesSaveDraftBill", employee)
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
  public getSalesPrint(emp){
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesPrint",emp);
  }
  
  public getSalesReturnPrint(emp){
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesReturnPrint",emp);
  }

  public getDraftList (emp){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SalesDraftBillList",emp);
  }

  public getBalAvaListStore(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_getBalAvaListStore",Param);
  }
  public getchargesList(data) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }

  public getDelDrat(data){
    return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  }
 public getDraftBillItem(emp){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BatchPOP_BalanceQty",emp);
  }
  public InsertWhatsappSms(emp){
    return this._httpClient.post("InPatient/WhatsappSMSoutgoingSave", emp);
  }

  public getCurrentStockItem(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CurrentStock_ItemList",param);
  }
  
  public getSubstitutes(emp) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_Item_Generic_ByName",emp);
  }
  public getItemListSearchList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemName",Param);
  }
  public getGenericNameList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_ItemGenericName",Param);
  }
  public getPrescriptionList(Param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PrescriptionListforSales",Param);
  }
  public getItemDetailList(Param,loader = true){ 
    if (loader) {
      this._loaderService.show();
  }
    return this._httpClient.post("Generic/GetByProc?procName=Ret_PrescriptionDet",Param);
  }
}
