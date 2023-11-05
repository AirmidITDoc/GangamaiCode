import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnService {

  userFormGroup: FormGroup;
  IndentSearchGroup :FormGroup;
  IndentlistSearchGroup :FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.IndentID();
    this.IndentSearchGroup= this.IndentSearchFrom();
    this.IndentlistSearchGroup= this.IndentSearchFrom1();
  }

  IndentSearchFrom1() {
    return this._formBuilder.group({
      ToStoreId: '',
      FromStoreId:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
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
 
  public getSalesBillList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseSalesBill",Param);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getSalesDetCashList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SalesBill_Return_Cash",Param);
  }

  public getSalesDetCreditList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SalesBill_Return_Credit",Param);
  }

  public InsertSalesReturn(employee){
    return this._httpClient.post("Pharmacy/InsertSalesReturn", employee)
  }
  public getSalesReturnPrint(emp){
    return this._httpClient.post("Generic/GetByProc?procName=rptSalesReturnPrint",emp);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 
}
