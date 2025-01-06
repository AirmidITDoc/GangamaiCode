import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CompanyListService {
 
  myFilterform: FormGroup;

  constructor(
    public _httpClient:HttpClient,
    private _formBuilder: UntypedFormBuilder
    ) 
    {
      this.myFilterform=this.filterForm(); 
     }

  filterForm(): FormGroup {
    return this._formBuilder.group({
      RegNo: '',
      IPDNo: '',
      FirstName:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      MiddleName:['', [ Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      LastName:['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
      MobileNo: ['', [Validators.pattern("^[0-9]*$"),Validators.minLength(10),Validators.maxLength(10),]],   
      DoctorId: '0',
      DoctorName: '',
      IsDischarge:[0],
      WardId: '0',
      RoomName: '',
      start: [],
      end: [],
      DischargeId:[''], 
    });
  }
  public getAdmittedPatientList_1(Param) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_rtrv_Admtd_Ptnt_Dtls", Param);
  }
  public getDischargedPatientList_1(employee) {
    return this._httpClient.post("Generic/GetDataSetByProc?procName=m_rtrv_AdmtdWithDischargeDate_Ptnt_Dtls", employee)
  }
  getIpDischargeReceipt(AdmId) {
    return this._httpClient.get("InPatient/view-DischargeCheckOutReceipt?AdmId=" + AdmId)
  }
  getIpDischargesummaryReceipt(AdmissionID){
    return this._httpClient.get("InPatient/view-DischargSummary?AdmissionID=" + AdmissionID)
   } 
}
