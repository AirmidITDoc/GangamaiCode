import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // fixed: was '@microsoft/signalr'
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietAssessmentService {

  constructor(
    public _formbuilder: UntypedFormBuilder,
    public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  filterForm(): FormGroup {
    return this._formbuilder.group({
      DietAssessmentId: '',
      assessmentById: '',
      FirstName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      LastName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
    });
  }

  public SaveDietassessment(Param: any) {
    if (Param.dietAssessmentId) {
      return this._httpClient1.PutData(`DietAssessmentInfo/Edit/${Param.dietAssessmentId}`, Param);
    } else {
      return this._httpClient1.PostData("DietAssessmentInfo/Insert", Param);
    }
  }
  public getassessmentById(Param) {
    return this._httpClient1.PostData("DietAssessmentInfo/PatientAssessmentList", Param);
  }
  public assessmentcancle(param) {
    return this._httpClient1.PostData('DietAssessmentInfo/AssessmentCancel', param)
  }
  public getVitalById(Param) {
    return this._httpClient1.PostData("DietAssessmentInfo/PatientvitalsdetailList", Param);
  }

  public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
  }
  public getAdmissionById(Id) {
    return this._httpClient1.GetData("Admission/" + Id);
  }
  public getUserdetailList(data) {
    return this._httpClient1.PostData("Generic/GetByProc?procName=m_Rtrv_loginManagerUserForCombo", data)
  }

}