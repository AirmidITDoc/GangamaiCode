import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class DischargeCancelService {
  DischargeForm : FormGroup;
  constructor(
    public _formbuilder:UntypedFormBuilder,
    public _httpClient1: ApiCaller,
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
   public getAdmittedpatientlist(id){
    debugger
    return this._httpClient1.GetData("Admission/" + id);
  }

  // i used visit DD for demo use here discharge dropdown
  public getVisitById(Id) {
    return this._httpClient1.GetData("VisitDetail/" + Id);
}
  public SaveDischargeCancel(employee){
    return this._httpClient.post("Administration/IPDischargeCancel", employee)
  }
  public getDischargepatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientDischargedListSearch ", employee)
  }
  // public getDateTimeChange(data) {
  //   return this._httpClient.post("Generic/GetBySelectQuery?query="+data, {})
  // }
  public getDateTimeChange(m_data) {
    return this._httpClient.post("Generic/ExecByQueryStatement?query=" + m_data,{});
}
}
