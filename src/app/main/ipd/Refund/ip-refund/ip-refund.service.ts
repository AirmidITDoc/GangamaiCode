import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPRefundService {

  constructor(public _httpClient:HttpClient,
    private _formBuilder: UntypedFormBuilder) { }


  public getRefundofAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_IPRefundAdvanceDetails",employee)
  }
  public getRefundofBillList()
  {
    return this._httpClient.post("Generic/GetByProc?procName=ps_Rtrv_IPRefundofBill",{})
  }


  public getIPRefundBILLBrowsePrint(RefundId) {
    return this._httpClient.post("Generic/GetByProc?procName=rptIPRefundofBillPrint", RefundId)
  } 

  public getRefundofBillServiceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_IPBill_For_Refund",employee)
  }
  public InsertIPRefundBilling(employee) {
    return this._httpClient.post("InPatient/InsertIPRefundofBill", employee)
  }

  
  // Get billing Service List 
  public getBillingServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveServices",employee)
     }

     


public getClassList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional",employee)
}

 // Admitted Doctor Master Combobox List
 public getAdmittedDoctorCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
}
public getserviceCombo() {
  return this._httpClient.post("Generic/GetByProc?procName=ps_Retrieve_ServiceMasterForCombo", {})
}
public getRefundofBillIPDList(employee){
  return this._httpClient.post("Generic/GetByProc?procName=m_IPBillListforRefund",employee)
  }


  
  public getRefundofbillview(RefundId){
    return this._httpClient.get("InPatient/view-IP-ReturnOfBillReceipt?RefundId=" + RefundId);
  }
  public getRefundofBillDetailList(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_OPDRefundAgainstBillList", employee)
  }
  
}
