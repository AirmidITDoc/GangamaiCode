import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DischargeCancelService {
  DischargeForm : FormGroup;
  constructor(
    public _formbuilder:FormBuilder,
    public _httpClient:HttpClient
  )
   { this.DischargeForm = this.CreateDischargeForm()}

   CreateDischargeForm(){
    return this._formbuilder.group({
      RegID: '',
      Op_ip_id: '1',
      IsDischarged: '', 
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
    });
   }
   public getAdmittedpatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
  }
  public SaveDischargeCancel(employee){
    return this._httpClient.post("Administration/IPDischargeCancel", employee)
  }
}
