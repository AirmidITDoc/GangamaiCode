import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SalesService {

  userFormGroup: FormGroup;
  IndentSearchGroup :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.IndentSearchGroup= this.IndentSearchFrom();
  }

  IndentSearchFrom() {
    return this._formBuilder.group({
   
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
      DiscAmt:'',
      NetAmt:'',
      DiscPer:'',
 
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
 
  public getIndentID(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Indent_by_ID",Param);
  }


  public getIndentList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IndentItemList",Param);
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
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ItemName_BatchPOP_BalanceQty",Param);
  }
  public getConcessionCombo()
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ConcessionReasonMasterForCombo", {});
  }
  public InsertCashSales(employee){
    return this._httpClient.post("Pharmacy/SalesSaveWithPayment", employee)
  }

  public InsertCreditSales(employee){
    return this._httpClient.post("Pharmacy/SalesSaveWithCredit", employee)
  }

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
  public getSalesPrint(emp){
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesPrint",emp);
  }
}
