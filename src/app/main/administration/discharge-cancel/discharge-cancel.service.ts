import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class DischargeCancelService {
  DischargeForm : FormGroup;
  date:any
  constructor(
    public _formbuilder:UntypedFormBuilder,
    public _httpClient1: ApiCaller,
    public _httpClient:HttpClient
  )
   { this.DischargeForm = this.CreateDischargeForm()
     const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  
   }

   CreateDischargeForm(){
    return this._formbuilder.group({
      RegID: '',
      Op_ip_id: '1',
      IsDischargedit: 0, 
      IsIPDnoEdit: 0,
      AdmissionDate: [(new Date()).toISOString(),Validators.required],
      AdmissionTime: [''],
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      NewIpdNo:['',Validators.required]
    });
   }
   public getAdmittedpatientlist(id){
    
    return this._httpClient1.GetData("Admission/" + id);
  }

  // i used visit DD for demo use here discharge dropdown
  public getVisitById(Id) {
    return this._httpClient1.GetData("VisitDetail/" + Id);
}
  public SaveDischargeCancel(employee){
    return this._httpClient1.PostData("Administration/IP_DISCHARGE_CANCELLATION", employee)
  }
  public getDischargepatientlist(employee){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientDischargedListSearch ", employee)
  }
 
public getDateTimeChange(employee){
  return this._httpClient1.PutData("Administration/UpdateAdmissiondatetime"+ employee.admissionID, employee)
}



public AdmissionCancel(data){
  return this._httpClient1.PostData("",data)
}
}
