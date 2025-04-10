import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class DoctorShareService {
  UserFormGroup: FormGroup;
  DocFormGroup: FormGroup;
  DocPrecessForm:FormGroup;
  
  constructor(
    public _formBuilder: FormBuilder,
    public _httpClient: HttpClient,
    public _loaderService: LoaderService
  ) { this.UserFormGroup = this.createUserFormGroup(),
    this.DocFormGroup = this.createDocFormGroup(),
    this.DocPrecessForm = this.createProDocFormGroup() 
   }

  createUserFormGroup() {
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      RegId: '',
      DoctorID:'',
      GroupId:'',
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
      DoctorName: '', 
      ServiceID:'',
      GroupWise:'',
      PatientType:'0',
      ServiceOrgrpType:'1',
      ClassId:'',
      DocShareType:'P',
      Amount:'',
      Percentage:''
    })
  }
  createProDocFormGroup() {
    return this._formBuilder.group({ 
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()], 
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
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorShareList_by_Name",param)
  }
  public getServiceList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ServicesList_Combo",employee) 
  }
  public getClassList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_rtrv_BillingClassName",employee) 
  }
  public getGroupList() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveGroupMasterForCombo",{}) 
  }
  public InsertDocShare(employee, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Administration/InsertDoctorShareMaster",employee) 
  }
  public UpdateDocShare(employee, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Administration/UpdateDoctorShareMaster",employee) 
  }
  public SaveProcessdocShare(employee, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.post("Administration/DoctorShareProcess",employee) 
  } 
  public getPdfDocShareSummaryRpt(From_Dt,ToDate,DoctorId,GroupId,OP_IP_Type, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.get("DoctorShareReports/viewDoctorWiseSummaryReport?Doctor_Id="+ DoctorId +"&GroupId" +GroupId + "&From_Dt=" + From_Dt +"&To_Dt=" + ToDate +"&OP_IP_Type" +OP_IP_Type);
  }
  public getPdfDocShareRpt(From_Dt,ToDate,DoctorId,GroupId,OP_IP_Type, loader = true) {
    if(loader){
      this._loaderService.show()
    }
    return this._httpClient.get("DoctorShareReports/view-DoctorShareReport?Doctor_Id="+ DoctorId +"&GroupId" +GroupId + "&From_Dt=" + From_Dt +"&To_Dt=" + ToDate +"&OP_IP_Type" +OP_IP_Type);
  }
}
