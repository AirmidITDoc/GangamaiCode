import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPBrowseRefundofAdvanceService {

  myFilterform: FormGroup;
  
  
  constructor(public _httpClient:HttpClient,
      private _formBuilder: FormBuilder
      ) {
        this.myFilterform=this.filterForm();
       }
  
    filterForm(): FormGroup {
      return this._formBuilder.group({
       // PBillNo: '',
        RegNo: '',
      //  ReceiptNo:'',
        FirstName: '',
        LastName: '',
        start: [(new Date()).toISOString()],
        end: [(new Date()).toISOString()],
      });
    }
  
    public getIpdreturnAdvancepaymentreceipt(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPRefundAdvanceReceipt", employee)
    } 

    public getTemplate(query) {
      return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
    }  

    public getAdvanceReceiptPrint(RefundId){
      return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofAdvancePrint", RefundId)

    }
  
    public getAdvanceRefundReceiptPrint(RefundId){
      return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofAdvancePrint", RefundId)
    }
}
