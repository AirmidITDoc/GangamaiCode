import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class DoctorShareService {
  UserFormGroup: FormGroup;
  DocFormGroup: FormGroup;
  
  constructor(
    public _formBuilder: FormBuilder,
    public _httpClient: HttpClient
  ) { this.UserFormGroup = this.createUserFormGroup(),
    this.DocFormGroup = this.createDocFormGroup() 
   }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegId: '',
      DoctorID:'',
      FirstName: '',
      LastName: '',
      PbillNo: '',
      OP_IP_Type: ['1'] 
    })
  }
  createDocFormGroup() {
    return this._formBuilder.group({ 
      Type: ['1'],
      DoctorID:'',
      FirstName: '',
      LastName: '', 
      ServiceID:'',
      PatientType:'0',
      NewType:'1',
      ClassId:'',
      DocShareType:'P',
      Amount:'',
      Percentage:''
    })
  }
  public getPatientVisitedListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  public getBillListForDocShrList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_BillListForDocShr",param)
  }
  public getDocShrList(param) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_DoctorShareList_by_Name",param)
  }
  public getServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_ServicesList",employee) 
  }
  public getClassList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_BillingClassName",employee) 
  }
}
