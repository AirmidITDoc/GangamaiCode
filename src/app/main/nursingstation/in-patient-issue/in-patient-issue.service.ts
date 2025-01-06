import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class InPatientIssueService {
  userFormGroup: FormGroup;
    IndentSearchGroup :FormGroup;
    PrescriptionFrom:FormGroup;
  
  
    constructor(
      public _httpClient: HttpClient,
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
    public getLoggedStoreList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
    }
    public getAdmittedPatientList(employee){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
    }
    public getConcessionCombo()
    {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
    }
    public getBillSummaryQuery(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    } 
    public getDraftBillItem(emp){
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BatchPOP_BalanceQty",emp);
    }
    public getCurrentStockItem(param){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_CurrentStock_ItemList",param);
    }
    public getItemList(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BalanceQty",Param);
    }
    public getBalAvaListStore(Param){
      return this._httpClient.post("Generic/GetByProc?procName=m_getBalAvaListStore",Param);
    }
    public getTopSalesDetails(Param){
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Top3SalesDetails",Param);
    }
    public getchargesList(data) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
    }
    public InsertSalesDraftBill(employee){
      return this._httpClient.post("Pharmacy/SalesSaveDraftBill", employee)
    }
    public getDraftList (emp){
      return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_SalesDraftBillList",emp);
    }
    public InsertCashSales(employee){
      return this._httpClient.post("Pharmacy/SalesSaveWithPayment", employee)
    } 
    public InsertCreditSales  (employee){
      return this._httpClient.post("Pharmacy/SalesSaveWithCredit", employee)
    }
    public getSalesPrint(emp){
      return this._httpClient.post("Generic/GetByProc?procName=rptSalesPrint",emp);
    }
}
