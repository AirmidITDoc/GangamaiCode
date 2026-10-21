import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // fixed: was '@microsoft/signalr'
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class DietCreationService {

  constructor(
    public _formbuilder: UntypedFormBuilder,
    public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  filterForm(): FormGroup {
    return this._formbuilder.group({
      dietPlanId: '',
      dietTypeId: '',
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      FirstName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
      LastName: ['', [
        Validators.maxLength(50),
        Validators.pattern("^[A-Za-z/() ]*$")
      ]],
    });
  }
  public SaveDietCreation(Param) {
    debugger
    if (Param[0].dietPlanId) {
      return this._httpClient1.PutData(`DietPlanSchedule/Edit/${Param[0].dietPlanId}`, Param[0]);
    } else {
      return this._httpClient1.PostData("DietPlanSchedule/Insert", Param);
    }

  }

  public dietplancancle(param) {
    return this._httpClient1.PostData('ClinicalCare/TNursingPainAssessmentCancel', param)
  }

  public getdietplanById(param) {
    return this._httpClient1.PostData('DietPlanSchedule/DietplandetailsList', param)
  }
  public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
  }
  public getAdmissionById(Id) {
    return this._httpClient1.GetData("Admission/" + Id);
  }
  public getassessmentById(Param) {
    return this._httpClient1.PostData("DietAssessmentInfo/PatientAssessmentList", Param);
  }
}
