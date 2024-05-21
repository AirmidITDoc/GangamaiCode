import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PharAdvanceService {
  SearchGroupForm : FormGroup;
  NewAdvanceForm : FormGroup;
  SearchRefundForm : FormGroup;
  NewRefundForm : FormGroup

  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { 
    this.SearchGroupForm = this.CreaterSearchForm();
    this.NewAdvanceForm = this.CreaterNewAdvanceForm();
    this.SearchRefundForm = this.CreaterSearchRefundForm();
    this.NewRefundForm = this.CreaterNewRefundForm();
   }
   
   CreaterSearchForm(){
    return this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: [''],
      F_Name: [''],
      L_Name: [''],
      AdvanceNo: ['']
    });
   }
   CreaterNewAdvanceForm(){
    return this._formbuilder.group({
      RegID: [''],
      Op_ip_id: ['1'],
      advanceAmt:[''],
      comment:['']
    });
   }
   CreaterSearchRefundForm(){
    return  this._formbuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      RegNo: [''],
      F_Name: [''],
      L_Name: [''],
      AdvanceNo: ['']
    });
   }
   CreaterNewRefundForm(){
    return this._formbuilder.group({

    });
   }

   public getIPAdvanceList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseIPPharAdvanceReceipt", Param);
  }
  public getIPAdvanceRefList(Param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BrowseT_PhAdvRefundReceipt", Param);
  }
  public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public getAdvanceList(employee)
  {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_T_AdvanceList",employee)
  }
}
