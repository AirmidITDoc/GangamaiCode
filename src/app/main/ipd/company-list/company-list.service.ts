import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

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
          FirstName: '',
          MiddleName: '',
          LastName: '',
          MobileNo: '',
          searchDoctorId: 0,
          WardId: '0',
          RoomName: '',
          PatientType: '',
          patientstatus: '',
          fromDate:[''],// [(new Date()).toISOString()],
          enddate: [''][(new Date()).toISOString()],

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
