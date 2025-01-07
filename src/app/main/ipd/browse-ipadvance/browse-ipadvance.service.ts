import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class BrowseIPAdvanceService {

  myFilterform: FormGroup;
  myFilterrefundform: FormGroup;

  constructor(public _httpClient:HttpClient,public _httpClient1:ApiCaller,
        private _formBuilder: UntypedFormBuilder) { 
          this.myFilterform=this.filterForm_IpdAdvance();
          this.myFilterrefundform=this.filterForm_IpRefunddAdvance();
        }

  filterForm_IpdAdvance(): FormGroup {
    return this._formBuilder.group({
      PBillNo: '',
      RegNo: '',
      FirstName: '',
      LastName: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }

  filterForm_IpRefunddAdvance(): FormGroup {
    return this._formBuilder.group({
      PBillNo: '',
      RegNo: '',
      FirstName: '',
      LastName: '',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
  }
  

  public getIpdAdvanceBrowseList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_BrowseIPAdvanceList", employee)
  }  

  public getTemplate(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }  

  public getAdvanceBrowsePrint(AdvanceDetailID) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPDAdvancePrint", AdvanceDetailID)
  }  

  public getIPAdvanceReceipt(AdvanceDetailID){
    return this._httpClient.get("InPatient/view-IP-AdvanceReceipt="+AdvanceDetailID);
  }

  public getViewAdvanceReceipt(AdvanceDetailID){
    // return this._httpClient.get("InPatient/view-IP-AdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
    return this._httpClient.get("InPatient/view-IP-AdvanceReceipt?AdvanceDetailID=" + AdvanceDetailID);
  }
  public getIpdreturnAdvancepaymentreceipt(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPRefundAdvanceReceipt", employee)
  }
  
  public getRefundofAdvanceview(RefundId){
    return this._httpClient.get("InPatient/view-IP-ReturnOfAdvanceReceipt?RefundId=" + RefundId);
  }

  // new Api
  public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("VisitDetail", m_data);
  }
  

  public deactivateTheStatusAdvRefund(m_data) {
    return this._httpClient1.PostData("VisitDetail", m_data);
  }
}
