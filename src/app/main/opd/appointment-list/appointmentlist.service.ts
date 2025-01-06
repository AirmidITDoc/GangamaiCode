import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class AppointmentlistService {
  myCrossConsulteForm: UntypedFormGroup;
  myformSearch: UntypedFormGroup;
  personalFormGroup: UntypedFormGroup;
  VisitFormGroup: UntypedFormGroup;

  constructor(public _httpClient1: ApiCaller,private _formBuilder: UntypedFormBuilder,   private _loaderService: LoaderService,
    public _httpClient: HttpClient,
  ) {  
    this.myformSearch=this.filterForm();
    this.myCrossConsulteForm = this.createConsultatDrForm(); 
    }

  
  // new APi
  
  filterForm(): UntypedFormGroup {
    return this._formBuilder.group({
      RegNo:'',
      FirstName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName:['', [
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      DoctorId:'',
      DoctorName:'',
      IsMark: 2,
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }
createSearchForm(): UntypedFormGroup {
  return this._formBuilder.group({
      patientNameSearch: [""],
      IsDeletedSearch: ["2"],
  });
}


createConsultatDrForm() {
  return this._formBuilder.group({
    consultantDocId: '',
    departmentId: ''
  });
}

createRefranceDrForm() {
  return this._formBuilder.group({
    DoctorID: ['', [
      Validators.required]],
   
  });
}

initializeFormGroup() {
  // this.createPesonalForm();
  // this.createVisitdetailForm();
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
public documentuploadInsert(employee, loader = true){
  if (loader) {
      this._loaderService.show();
  }
  return this._httpClient1.PutData("InPatient/DocAttachment", employee);
}

public NewappointmentSave(Param: any, showLoader = true) {
    if (Param.visitID) {
        return this._httpClient1.PutData("VisitDetail/AppVisitInsert" + Param.visitID, Param, showLoader);
    } else return this._httpClient1.PostData("VisitDetail/AppVisitInsert", Param, showLoader);
}

public RregisteredappointmentSave(Param: any, showLoader = true) {
  if (Param.visitID) {
      return this._httpClient1.PutData("VisitDetail/AppVisitInsert" + Param.visitID, Param, showLoader);
  } else return this._httpClient1.PostData("VisitDetail/AppVisitInsert", Param, showLoader);
}

public EditConDoctor(Param: any, showLoader = true) {

   return this._httpClient1.PostData("ConsRefDoctor/ConsultantDoctorUpdate", Param, showLoader);
}

public EditRefDoctor(Param: any, showLoader = true) {
 
  return this._httpClient1.PostData("ConsRefDoctor/RefDoctorUpdate", Param, showLoader);
}

public deactivateTheStatus(m_data) {
    return this._httpClient1.PostData("VisitDetail", m_data);
}

public crossconsultSave(Param: any, showLoader = true) {
  if (Param.visitID) {
      return this._httpClient1.PutData("CrossConsultation/CrossConsultationInsert" + Param.visitID, Param, showLoader);
  } else return this._httpClient1.PostData("CrossConsultation/CrossConsultationInsert", Param, showLoader);
}

public getMaster(mode,Id) {
  return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode="+mode+"&Id="+Id);
}

getRegistrationValidationMessages() {
      return {
          patientName: [
              { name: "required", Message: "Patient Name is required" },
              { name: "maxlength", Message: "Patient name should not be greater than 50 char." },
              { name: "pattern", Message: "Special char not allowed." }
          ]
      };
  }

  public getAppointmenttemplateReport(Param: any, showLoader = true) {
    
        return this._httpClient1.PutData("Report/ViewReport" +  Param, showLoader);
    
}
  


// new API?

public getAppointmentList(employee) {
  return this._httpClient1.PostData("VisitDetail/AppVisitList", employee)
}  

public Appointmentcancle(employee, loader = true) {
  // if (loader) {
  //     this._loaderService.show();
  // }
  return this._httpClient1.PostData("VisitDetail/Cancel", employee);
}

public getdoctorList(employee) {
  return this._httpClient1.PostData("DoctoreMaster/List",employee)
}  

public getVisitById(Id,showLoader = true) {
  return this._httpClient1.GetData("VisitDetail/" + Id,showLoader);
}
}


// "url": "http://192.168.2.100:9090/api"