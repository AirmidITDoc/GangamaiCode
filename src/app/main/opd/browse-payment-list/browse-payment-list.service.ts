import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowsePaymentListService {
  myFilterform: FormGroup;

  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: FormBuilder
  ) {
    this.myFilterform=this.filterForm();
   }
   
   filterForm(): FormGroup {
    return this._formBuilder.group({
    
      FirstName: '',
      LastName: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: '',
      PBillNo: '',
      ReceiptNo: '',
      
    });
  }

  public getBrowseOpdPaymentReceiptList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseOPDPaymentReceipt", employee)
  }  
  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }  

  public getAdvanceBrowsePrint(AdvanceDetailID) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDAdvancePrint", AdvanceDetailID)
  }  


  public getTemplates(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  public getBrowseOpdPaymentReceiptPrint(PaymentId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPaymentReceiptPrint", PaymentId)
  }    

  

  public getHospital() {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Hospital", {})
  }  

  
  public getOpPaymentview(PaymentId){
    return this._httpClient.get("OutPatient/view-OP-PaymentReceipt?PaymentId=" + PaymentId);
  }

  
}
