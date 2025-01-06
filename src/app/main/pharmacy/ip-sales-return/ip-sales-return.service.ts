import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IpSalesReturnService {

  userFormGroup: FormGroup;
  IPFinalform :FormGroup;


  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: UntypedFormBuilder
  ) { 
    this.userFormGroup = this.CreateusefromGroup();
    this.IPFinalform= this.CreateaIpFinalform();
  }

  CreateaIpFinalform() {
    return this._formBuilder.group({
      FinalNetAmount: '',
      FinalTotalAmt:'' ,
      FinalGSTAmt:'',
      FinalDiscAmount:''
    });
  }
  
  CreateusefromGroup() {
    return this._formBuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      TypeodPay:['CashPay'],
      ItemName:'',
      ReturnQty:'',
      TotalQty:'', 
    });
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
