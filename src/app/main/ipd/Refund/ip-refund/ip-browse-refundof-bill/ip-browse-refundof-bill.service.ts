import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPBrowseRefundofBillService {

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
  
    public getIpdRefundBillBrowseList(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPRefundBillReceipt", employee)
    } 

    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    }
    public getIPRefundBILLBrowsePrint(RefundId) {
      return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofBillPrint", RefundId)
    }    

    public getRefundofbillview(RefundId){
      return this._httpClient.get("InPatient/view-IP-ReturnOfBillReceipt?RefundId=" + RefundId);
    }
}
