import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaymentReceiptService {

  myFilterform: FormGroup;
  
  
  constructor(public _httpClient:HttpClient,
      private _formBuilder: FormBuilder
      ) {
        this.myFilterform=this.filterForm();
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
        PBillNo: '',
        RegNo: '',
        ReceiptNo:'',
        FirstName: '',
        LastName: '',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
      });
    }
  
    public getIpdRefundpaymentreceiptBrowseList(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPDPaymentReceipt", employee)
    } 

    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    }  


    public getBrowseIPDPaymentReceiptPrint(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=rptIPDPaymentReceiptPrint", employee)
    } 

    
  public getIpPaymentReceiptView(PaymentId){
  
    return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
  }
}
