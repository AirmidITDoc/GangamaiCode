import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class IPSettlementService {

  constructor(public _httpClient:HttpClient,
    private _loaderService: LoaderService,
    private _formBuilder: FormBuilder) { }

  //Adv paymnet
   
  public getAdvcanceDetailslist(query) {
    return this._httpClient.post("Generic/GetBySelectQuery?query="+query, {})
  }
  
public getPaidBillList(data) {
  return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
}

public getCreditBillList(data,loader = true) {
  if (loader) {
    this._loaderService.show();
}
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IP_Bill_List_Settlement" ,data)
}
public InsertIPSettlementPayment (employee,loader = true){
  if (loader) {
    this._loaderService.show();
}
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
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList",employee)
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