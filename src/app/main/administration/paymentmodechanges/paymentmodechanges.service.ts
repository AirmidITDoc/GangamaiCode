import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PaymentmodechangesService {

  UseFormGroup:FormGroup
  constructor(
    public _formBuilder:FormBuilder,
    public _httpClient:HttpClient
  ) 
  { this.UseFormGroup=this.createUserFormGroup() }

  createUserFormGroup(){
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegNo:'',
      FirstName:'',
      LastName:'',
      BillNo:'',
      Radio:['1'],
      ReceiptNo:''
    })
  }
  public getOpReceiptList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseOPDPaymentReceipt",Param)
  }
  public getIpReceiptList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPDPaymentReceipt",Param)
  }
  public getIpAdvanceList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_BrowseIPAdvPaymentReceipt",Param)
  }
}
