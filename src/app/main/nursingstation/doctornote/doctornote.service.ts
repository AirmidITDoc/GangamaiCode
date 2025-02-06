import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
  providedIn: 'root'
})
export class DoctornoteService {
  myform: FormGroup;
  Templateform: FormGroup;

  constructor(public _httpClient: HttpClient,
    public _httpClient1: ApiCaller,
    public _formBuilder: UntypedFormBuilder) {
      this.myform = this.createtemplateForm();
      this.Templateform=this.createnewtemplateForm();
     }

     createtemplateForm(): FormGroup {
      return this._formBuilder.group({
      Note: [''], 
      Description:[''],
      DoctNoteId:'',
      WardName:[''],
      HandOverType:['0']
      });
    }

    createnewtemplateForm(): FormGroup {
      return this._formBuilder.group({
        TemplateId:[''],
        TemplateName:[''],
        TemplateDesc:[''],
        IsDeleted:[true],
        Category:['NursNote']
          });
    }
  
  // public DoctorNoteInsert(employee) {
  //   return this._httpClient.post("InPatient/DoctorNoteInsert", employee)
  // }
  DoctorNotepoppulateForm(param){
    this.myform.patchValue(param)
  }
  public getdoctornoteList(param) {
    return this._httpClient1.PostData("CanteenRequest/DoctorNoteList",param);
}
public getpatientHandList(param) {
  return this._httpClient1.PostData("CanteenRequest/TDoctorPatientHandoverList",param);
}
  public DoctorNoteInsert(employee) {
    return this._httpClient1.PostData("DoctorNote", employee)
  }
  public DoctorNoteUpdate(Param: any) {
    debugger
    if (Param.doctNoteId) {
        return this._httpClient1.PutData("DoctorNote/" + Param.doctNoteId, Param);
    }
  }
  public getRegistraionById(Id) {
    return this._httpClient1.GetData("OutPatient/" + Id);
}

  public getDoctorNoteCombo() {
    return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_DoctorNotesTemplateMaterForCombo", {})
  }
  // public getWardNameList() {
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_WardClassMasterForCombo", {})
  // }
}
