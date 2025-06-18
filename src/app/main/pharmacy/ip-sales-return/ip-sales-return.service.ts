import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IpSalesReturnService { 
  constructor(
    public _httpClient: HttpClient,
     public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService :FormvalidationserviceService
  ) {} 
    public getSalesReturnitemlist(param){
    return this._httpClient1.PostData("Common",param)
  }

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getItemlist(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ItemNameForSalesReturnSearch",Param)
  }  
  public getCashItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPSalesBillForReturn_Cash",Param);
  } 
  public getCreditItemList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IPSalesBillForReturn_Credit",Param);
  }

  public InsertCreditSalesReturn(employee){
    return this._httpClient1.PostData("SalesReturn/SalesReturnWithCredit", employee)
  }
  
  public InsertCashSalesReturn (employee){
    return this._httpClient1.PostData("SalesReturn/SalesReturnWithCash", employee)
  }

  // Retrieve_BrowseSalesBill

  public getStoreFromList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ToStoreName",{});
  }

  public getToList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_StoreNameForLogedUser_Conditional",{});
  }

  public getSelectionList(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseSalesBill",{});
  }
  public getSalesReturncash(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SalesBill_Return_Cash",{});
  }
  
  public getSalesReturnCredit(){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_SalesBill_Return_Credit",{});
  }
  public getSalesReturnPdf(SalesId,OP_IP_Type) {
    return this._httpClient.get("Pharmacy/view-SalesTaxReturn_Report?SalesId=" + SalesId + "&OP_IP_Type=" + OP_IP_Type);
    }
  
}
