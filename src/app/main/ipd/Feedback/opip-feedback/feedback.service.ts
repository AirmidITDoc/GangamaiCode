import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  MyForm:UntypedFormGroup;
  MyfeedbackForm:UntypedFormGroup;
  constructor(   public _formbuilder:UntypedFormBuilder,
    public _httpClient:HttpClient) {
    
    this.MyfeedbackForm = this.createMyfeedbackForm();
   }


  createMyfeedbackForm(){
    return this._formbuilder.group({ 
      AdmissionId:[''],
      PatientFeedbackId:[''],
      PatientName:[''],
      // PatientName:[''],
      Feedbackdetails:[''],
      fbone:[''],
      FeedbackCategory:[''],
      FeedbackRating:[''],
      FeedbackResult:[1],
      FeedbackComments:[''],
     FromDate:[new Date()],
     ToDate:[new Date()],
    })
  }

  public feedbackInsert(employee)
  {    
    return this._httpClient.post("OutPatient/PatientFeedback",employee);
  }

  public getWardList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_WardMasterListForCombo",{});
  }
  public getPatientList(param){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_AdmisionList_NursingList",param);
  }
  public getquestionList(){
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_m_Feedbackquestion",{});
  }
  public getPatientVisitedListSearch(employee) {//m_Rtrv_PatientVisitedListSearch
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientVisitedListSearch", employee)
  }
  public getAdmittedPatientList(employee) {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_PatientAdmittedListSearch", employee)
  }
}
