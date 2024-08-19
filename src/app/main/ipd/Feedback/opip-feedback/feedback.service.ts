import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {
  MyForm:FormGroup;
  MyfeedbackForm:FormGroup;
  constructor(   public _formbuilder:FormBuilder,
    public _httpClient:HttpClient) {
    this.MyForm = this.createMyForm();
    this.MyfeedbackForm = this.createMyfeedbackForm();
   }

  createMyForm(){
    return this._formbuilder.group({ 
      WardName:[''],
      RegID:['']
     // FromDate:[new Date()],
     // ToDate:[new Date()],
    })
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
  
}
