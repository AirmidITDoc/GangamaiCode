import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AppointmentlistService {
  myCrossConsulteForm: FormGroup;
  myformSearch: FormGroup;
  personalFormGroup: FormGroup;
  VisitFormGroup: FormGroup;

  constructor(public _httpClient1: ApiCaller,private _formBuilder: FormBuilder,) {  
    this.personalFormGroup=this.createPesonalForm();
    this.VisitFormGroup = this.createVisitdetailForm(); }

  
  // new APi
  

      createPesonalForm(): FormGroup {
        return this._formBuilder.group({
      regId: [""],
      regDate: [""],
      regTime: [""],
      prefixId: [""],
      firstName: ['', [
        Validators.required,
        Validators.maxLength(50),
        // Validators.pattern("^[a-zA-Z._ -]*$"),
        Validators.pattern('^[a-zA-Z () ]*$')
      ]],
      middleName: ['', [
      ]],
      lastName: ['', [
        Validators.required,
      ]],
      genderId: [""],
      address: [""],
      city: [""],
      pinNo: [""],
      dateOfBirth: [''],
      age: [""],
      phoneNo: ['', [
        Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10)
      ]],
      mobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      ageYear: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      ageMonth: ['', Validators.pattern("[0-9]+")],
      ageDay: ['', Validators.pattern("[0-9]+")],

      countryId: [''],
      stateId: [""],
      cityId: [""],
      maritalStatusId: [""],
      religionId: [""],
      isCharity: [""],
      areaId: [""],
      isSeniorCitizen: [""],
      aadharCardNo: [""],
      panCardNo: ["", [Validators.pattern("/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/"),
      Validators.minLength(10),
      Validators.maxLength(10)]],

      photo: [""],


    });

  }


 
      createVisitdetailForm(): FormGroup {
        return this._formBuilder.group({
      visitId: [""],
      regId: [""],
      VisitDate: [""],
      VisitTime: [""],
      unitId: [""],
      patientTypeId: [""],
      consultantDocId: [""],
      refDocId: [""],
      tariffId: [""],
      companyId: [""],
      isCancelled: [""],
      isCancelledBy: [""],
      isCancelledDate: [""],
      classId: [""],
      departmentId: [""],
      patientOldNew: [""],
      firstFollowupVisit: [""],
      appPurposeId: [""],
      followupDate: [""],
      crossConsulFlag: [""],
      phoneAppId: [""],
    });
  }
createSearchForm(): FormGroup {
  return this._formBuilder.group({
      patientNameSearch: [""],
      IsDeletedSearch: ["2"],
  });
}


createConsultatDrForm() {
  return this._formBuilder.group({
    doctorID: '',
    departmentid: ''
  });
}

createRefranceDrForm() {
  return this._formBuilder.group({
    refDoctorId: ['', [
      Validators.required]],
   
  });
}

initializeFormGroup() {
  this.createPesonalForm();
  this.createVisitdetailForm();
}

  getCrossConValidationMessages() {
    return {
      Departmentid: [
            { name: "required", Message: "Patient Name is required" },
            { name: "maxlength", Message: "Patient name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}

public appointmentSave(Param: any, showLoader = true) {
    if (Param.visitID) {
        return this._httpClient1.PutData("VisitDetail/Insert" + Param.visitID, Param, showLoader);
    } else return this._httpClient1.PostData("VisitDetail/Insert", Param, showLoader);
}

public EditConDoctor(Param: any, showLoader = true) {
  if (Param.visitID) {
      return this._httpClient1.PutData("ConsRefDoctor/ConsultantDoctorUpdate" + Param.visitID, Param, showLoader);
  } else return this._httpClient1.PostData("ConsRefDoctor/ConsultantDoctorUpdate", Param, showLoader);
}

public EditRefDoctor(Param: any, showLoader = true) {
  if (Param.visitID) {
      return this._httpClient1.PutData("ConsRefDoctor/RefDoctorUpdate" + Param.visitID, Param, showLoader);
  } else return this._httpClient1.PostData("ConsRefDoctor/RefDoctorUpdate", Param, showLoader);
}

public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("VisitDetail", m_data);
}

public crossconsultSave(Param: any, showLoader = true) {
  if (Param.visitID) {
      return this._httpClient1.PutData("CrossConsultation/CrossConsultationInsert" + Param.visitID, Param, showLoader);
  } else return this._httpClient1.PostData("CrossConsultation/CrossConsultationInsert", Param, showLoader);
}
}


// "url": "http://192.168.2.100:9090/api"