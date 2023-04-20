import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup , Validators} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class PhoneAppointListService {
  myFilterform: FormGroup;
  mysearchform: FormGroup;

  constructor(
    private _httpClient: HttpClient,
    private _formBuilder: FormBuilder
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

  public getAdmittedDoctorCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=RetrieveConsultantDoctorMasterForCombo", {})
  }
  
}
