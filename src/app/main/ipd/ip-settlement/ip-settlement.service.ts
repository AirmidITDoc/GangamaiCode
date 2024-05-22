import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class IPSettlementService {

  constructor(public _httpClient:HttpClient,
    private _formBuilder: FormBuilder) { }

  //Adv paymnet
  public getAdvcanceDetailslist(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  
public getPaidBillList(data) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
}

public getCreditBillList(data) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
}
public InsertIPSettlementPayment (employee){
  // return this._httpClient.post("InPatient/IPBillingCreditInsert", employee)
   return this._httpClient.post("InPatient/IPSettlement", employee)
}

public getIPBILLBrowsePrint(BillNo) {
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDFinalBill", BillNo)
}
public getIPsettlementPrint(PaymentId){
  return this._httpClient.post("Generic/GetByProc?procName=rptIPDPaymentReceiptPrint", PaymentId)
 }

 public getTemplate(query) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
}


  // registration patient list
  public getRegistrationList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_PatientRegistrationList",employee)
  }


  public getSettlementview(PaymentId){
    return this._httpClient.get("InPatient/view-IP-SettlementReceipt?PaymentId=" + PaymentId);
  }

  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }

  public getBankMasterCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
}



fieldValidations() {
  return [
    {
      key: 'cash_controller',
      // validation: [{ 'type': 'required' }, { 'type': 'pattern', value: /^[a-zA-Z]+$/ }]
      validation: []
    },
  ];
}

}