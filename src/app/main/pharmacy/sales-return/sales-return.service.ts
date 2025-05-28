import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class SalesReturnService {

  userFormGroup: FormGroup;
  IndentSearchGroup :FormGroup;
  IndentlistSearchGroup :FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder,
    private _httpClient1:ApiCaller,
    
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
    return this._httpClient1.PostData("Sales/salesbrowselist",Param);
  }

  public getLoggedStoreList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",Param);
  }

  public getSalesDetCash_CreditList(Param){
   return this._httpClient1.PostData("Common",Param)
  } 
  public InsertSalesReturn(employee){
    return this._httpClient.post("Pharmacy/InsertSalesReturn", employee)
  }
  public getSalesReturnPrint(emp){
    return this._httpClient.post("Generic/GetByProc?procName=m_rptSalesReturnPrint",emp);
  }
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  } 

  public InsertCreditSalesReturn(employee){
    return this._httpClient.post("Pharmacy/InsertSalesReturnCredit", employee)
  }
  
  public InsertCashSalesReturn (employee){
    return this._httpClient.post("Pharmacy/InsertSalesReturnPaid", employee)
  }
}
