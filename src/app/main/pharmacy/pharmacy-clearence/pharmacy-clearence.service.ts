import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharmacyClearenceService {

  userFormGroup: FormGroup;
  MyFrom: FormGroup;

  constructor(
    public _httpClient: HttpClient,
    private _formBuilder: FormBuilder
  ) { 
    this.userFormGroup = this.CreateUseFrom();
    this.MyFrom = this.createmyFrom(); 
  }

  CreateUseFrom() {
    return this._formBuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:[''],
      comment:['']
    });
  }

  createmyFrom() {
    return this._formBuilder.group({
      IssueStatus:'',
      IssueAssigned:'',

    });
  }
  
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getSalesList(Param){ 
    return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_PrescriptionListforSales",Param);
  }
  public getItemDetailList(Param){
    return this._httpClient.post("Generic/GetByProc?procName=Ret_PrescriptionDet",Param);
  }
  
}
