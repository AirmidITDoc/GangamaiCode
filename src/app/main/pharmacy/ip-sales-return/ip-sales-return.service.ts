import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class IpSalesReturnService {

  userFormGroup: FormGroup;
  IPFinalform :FormGroup;


  constructor(
    public _httpClient: HttpClient,
     public _httpClient1: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService :FormvalidationserviceService
  ) { 
    this.userFormGroup = this.CreateusefromGroup();
    this.IPFinalform= this.CreateaIpFinalform();
  }

  CreateaIpFinalform() {
    return this._formBuilder.group({
      FinalNetAmount: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      FinalTotalAmt:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      FinalGSTAmt:'',
      FinalDiscAmount:''
    });
  }
  
  CreateusefromGroup() {
    return this._formBuilder.group({
      RegID: ['',[Validators.required]],
      Op_ip_id: ['1'],
      PaymentType:['CashPay'],
      ItemName:['',[Validators.required]] ,
      ReturnQty:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
      TotalQty:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]] ,
    });
  }

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
    return this._httpClient.post("Pharmacy/InsertSalesReturnCredit", employee)
  }
  
  public InsertCashSalesReturn (employee){
    return this._httpClient.post("Pharmacy/InsertSalesReturnPaid", employee)
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
