import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class BrowseRefundlistService {

  myFilterform: FormGroup;
  
  constructor(public _httpClient:HttpClient,
      private _formBuilder: FormBuilder,
      
      ) {
        this.myFilterform=this.filterForm();
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
        PBillNo: '',
        RegNo: '',
        FirstName: '',
        LastName: '',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
      });
    }
   
    public getBrowseOPDReturnReceiptList(employee) {
      
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_RefundofBill", {})
    }
  
   
     public getRefundBrowsePrint(RefundId) {
      return this._httpClient.post("Generic/GetByProc?procName=rptOPRefundofBillPrint", RefundId)
    } 
    
  
    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    } 

    

  public getTemplates(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  public getBrowseOpdPaymentReceiptPrint(PaymentId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptOPDPaymentReceiptPrint", PaymentId)
  }   
  }
