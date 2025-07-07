  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
  
  @Injectable({
    providedIn: 'root'
  })
  export class SalesHospitalService {
  
    userFormGroup: FormGroup;
    ItemSearchGroup :FormGroup;
    PrescriptionFrom:FormGroup;
  
  
    constructor(
      public _httpClient: HttpClient,
      private _formBuilder: UntypedFormBuilder,
      public _httpClient1 :ApiCaller,
      public _FormvalidationserviceService:FormvalidationserviceService
    ) { 
      this.userFormGroup = this.IndentID();
      this.ItemSearchGroup= this.ItemSearchFrom();
    }
  
    ItemSearchFrom() {
      return this._formBuilder.group({
        Barcode:['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        StoreId:['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        ItemId:['', [Validators.required]],
        ItemName:['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        BatchNo:['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        BatchExpDate:['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        BalanceQty:['', [this._FormvalidationserviceService.onlyNumberValidator()]],
        Qty: [1, [Validators.pattern("^-?[0-9]\\d*(\\.\\d{1,2})?$"),this._FormvalidationserviceService.onlyNumberValidator()] ],  
        GSTPer:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        MRP: ['', [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        TotalMrp: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        DiscAmt: [' '],
        NetAmt: ['', [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        DiscPer:['', [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        MarginAmt:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       GSTAmount:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       LandedRateandedTotal:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       CGSTAmt:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       SGSTAmt:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       IGSTAmt:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
       PurTotAmt:[0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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
 
   
    public getIndentID(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Indent_by_ID",Param);
    }
    public getstoreDetails(Param){
      return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode="+ Param);
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
  
    public getBatchList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ItemName_BatchPOP_BalanceQty",Param);
    }
    public getConcessionCombo()
    {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
    }
    public InsertCashSales(employee){
      return this._httpClient1.PostData("Sales/SalesSaveWithPayment", employee)
    }
  
    public InsertCreditSales  (employee){
      return this._httpClient1.PostData("Sales/SalesSaveWithCredit", employee)
    }
  
    public InsertSalesDraftBill(employee){
      return this._httpClient1.PostData("Sales/SalesDraftBillSave", employee)
    }
  
    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    } 
    public getBillSummaryQuery(query) {
      return this._httpClient1.PostData("Sales/SalesPatientWiseCreditAmountList",query)
    } 
    public getSalesPrint(emp){
      return this._httpClient.post("Generic/GetByProc?procName=rptSalesPrint",emp);
    }
    
    public getSalesReturnPrint(emp){
      return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesReturnPrint",emp);
    }
  
    public getDraftList (emp){
      return this._httpClient1.PostData("Sales/salesDraftlist",emp);
    }
  
    public getBalAvaListStore(Param){
      return this._httpClient1.PostData("Sales/StockavailableList",Param);
    }
    public getDraftItemDetailsList(data) {
      return this._httpClient1.PostData("Sales/SalesDraftBillItemDet",data)
    }
  
    public getDeleteDratf(data){
      return this._httpClient1.PostData("Sales/SalesDraftbillcancel",data)
    }
   public getDraftBillItemBalQty(emp){
      return this._httpClient1.PostData("Sales/BalqtysalesDraftlist",emp);
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
    public getPrescriptionList(Param){//Retrieve_PrescriptionListforSales
      return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PrescriptionListforSales",Param);
    }
    public getItemDetailList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Ret_PrescriptionDet",Param);
    }
      public getAdvanceList(employee)
  {
    return this._httpClient1.PostData("Sales/PharAdvanceList",employee)
  }
      public getPrescriptionBalQtyList(employee)
  {
    return this._httpClient1.PostData("Sales/PrescriptionItemDetList",employee)
  }
  }
  
