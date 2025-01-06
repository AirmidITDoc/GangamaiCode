import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class NurBedTransferService {

 
  bsaveForm:UntypedFormGroup;
  constructor(public _httpClient:HttpClient,
    private _formBuilder: UntypedFormBuilder) { 
      this.bsaveForm=this.bedsaveForm();
 
    }

    
  bedsaveForm(): UntypedFormGroup{
    return this._formBuilder.group({
     RegNo: '',
     RoomId: ['',Validators.required],
     RoomName: '',
     BedId:['',Validators.required],
     BedName :'',
     ClassId : ['',Validators.required],
     ClassName:'',
     Remark :'',
     RegID :'',
    });
  }
  public getDischargePatientList() {
    return this._httpClient.post("Generic/GetByProc?procName=ps_rtrv_dischargesimple",{})
}  
  //Doctor 1 Combobox List
  public getDoctorMaster1Combo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  //Ward Combobox List
  public getWardCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_RoomMasterForCombo", {})
  }Retrieve_RoomMasterForCombo
 
  
 //Bed Combobox List
 public getBedCombo(Id) {
   return this._httpClient.post("Generic/GetByProc?procName=RetrieveBedMasterForCombo_Conditional", {"Id":Id})
  }
  public BedtransferUpdate(employee)
  {    
    return this._httpClient.post("InPatient/IPDBedTransfer",employee);
  }

  //ClassName Combobox List
public getBedClassCombo(Id) {
  return this._httpClient.post("Generic/GetByProc?procName=Retrieve_ClassName_Conditional", {"Id":Id})
}
public getAdmittedpatientlist(employee){
  return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch ", employee)
}
}