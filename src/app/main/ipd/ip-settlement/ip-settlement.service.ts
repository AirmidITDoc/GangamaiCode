import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class IPSettlementService {

  constructor(public _httpClient:HttpClient,public _httpClient1:ApiCaller,
    private _loaderService: LoaderService,
    private _formBuilder: UntypedFormBuilder) { }

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



public InsertIPSettlementPayment (employee){
 
   return this._httpClient1.PostData("IPBill/PaymentSettelment", employee)
}


public getRegistraionById(Id) {
  return this._httpClient1.GetData("OutPatient/" + Id);
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