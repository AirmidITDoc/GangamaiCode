import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class PhoneAppointListService {
  myFilterform: FormGroup;
  mysearchform: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder,
    private _loaderService:LoaderService
  ) { 
    this.myFilterform=this.filterForms();
    this.mysearchform=this.filterForm();
  }

  filterForm(): FormGroup {
    return this._formBuilder.group({
     
      FirstNameSearch:['', [
           Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastNameSearch:['', [
        
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],

    });
  }


  filterForms(): FormGroup {
    return this._formBuilder.group({
     
      HospitalId:'0',
      PatientTypeID: '0',
      CompanyId: '0',
      TariffId: '0',
      DepartmentId: '0',
      DoctorId: '0',
      RefDocName: '0',
      classId: '0',
      CountryId: '0',
      IsSeniorCitizen:'0',

    });
  }

  public getPhoneAppointmentlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PhoneAppList",employee)
  }

  public getOTReservationlist(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=Retrieve_OTBookingList",employee)
  }
    
  public getPhoenapplist(employee) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_PhoneAppList",employee)
  }
      
  public getPhoenappschdulelist() {
      return this._httpClient.post("Generic/GetByProc?procName=Rtrv_ScheduledPhoneApp",{})
  }
  public getAdmittedDoctorCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }

     //Deartment Combobox List
  public getDepartmentCombo() {
      return this._httpClient.post("Generic/GetByProc?procName=RetrieveDepartmentMasterForCombo", {})
  }
   
  public PhoneAppointInsert(employee)
  {
    return this._httpClient.post("OutPatient/PhoneAppointmentInsert", employee);
  }
  public PhoneAppointUpdate(employee)
  {
    // return this._httpClient.post("OutPatient/PhoneAppointmentInsert", employee);
  }
  
  public PhoneAppointCancle(employee)
  {
    return this._httpClient.post("OutPatient/PhoneAppointmentCancle", employee);
  }
    //Doctor Master Combobox List
  public getDoctorMasterCombo(param) {
      return this._httpClient.post("Generic/GetByProc?procName=Retrieve_DoctorWithDepartMasterForCombo_Conditional", param)
  }
  
  //Hospital Combobox List
  public getHospitalCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=rtrv_UnitMaster_1", {})
  }

  public getPatientRegisterListSearch(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientRegistrationList", employee)
  }
    public getFutureAppointmentlist(employee,loader = true) {
    if(loader){
      this._loaderService.show();
    }
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_FutureAppointmentlist", employee)
  }
  
}
