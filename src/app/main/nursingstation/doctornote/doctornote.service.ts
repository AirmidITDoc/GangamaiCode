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
  noteform: FormGroup

  constructor(
    // public _httpClient: HttpClient,
    public _httpClient: ApiCaller,
    public _formBuilder: UntypedFormBuilder) {
    this.myform = this.createtemplateForm();
    this.noteform = this.createDoctorNoteForm();
    this.Templateform = this.createnewtemplateForm();
  }

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      Note: [''],
      Description: [''],
      DoctNoteId: '',
      WardName: [''],
      docHandId:[0],
      HandOverType: ["Morning"],
      staffName: [''],
      SYMPTOMS: [''],
      Instruction: [''],
      Stable: [''],
      Assessment: [''],
      Category: ['NursNote'],
      isActive: [true, [Validators.required]],
      TemplateId: [''],
      TemplateName: [''],
      templateDesc: [''],
      templateName:['']
    });
  }

  createDoctorNoteForm(): FormGroup {
    return this._formBuilder.group({
      doctNoteId: [0],
      admId: [''],
      TemplateId: [''],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      // TemplateName:[''],
      templateDesc: [''],
      isAddedBy: ['']
    });
  }

  createnewtemplateForm(): FormGroup {
    return this._formBuilder.group({
      TemplateId: [''],
      TemplateName: [''],
      TemplateDesc: [''],
    });
  }

  public templateMasterSave(Param: any) {
    if (Param.templateId) {
      return this._httpClient.PutData("RadiologyTemplate/" + Param.templateId, Param);
    } else return this._httpClient.PostData("RadiologyTemplate", Param);
  }

  public deactivateTheStatus(m_data) {
    return this._httpClient.DeleteData("ItemCategoryMaster?Id=" + m_data.toString());
  }

  DoctorNotepoppulateForm(param) {
    this.myform.patchValue(param)
  }
  public getdoctornoteList(param) {
    return this._httpClient.PostData("CanteenRequest/DoctorNoteList", param);
  }
  public getpatientHandList(param) {
    return this._httpClient.PostData("CanteenRequest/TDoctorPatientHandoverList", param);
  }
  public HandOverInsert(employee) {
    return this._httpClient.PostData("Nursing/DoctorPatientHandoverInsert", employee)
  }

  public HandOverUpdate(Param: any) {
    if (Param.docHandId) {
      return this._httpClient.PutData("Nursing/DoctorPatientHandover/" + Param.docHandId, Param);
    }
  }

  public DoctorNoteInsert(Param: any) {
    debugger
    if (Param.doctNoteId) {
      return this._httpClient.PutData("Nursing/DoctorNoteUpdate/" + Param.doctNoteId, Param);
    } else return this._httpClient.PostData("Nursing/DoctorNoteInsert", Param);
  }


  public getRegistraionById(Id) {
    return this._httpClient.GetData("OutPatient/" + Id);
  }

  public getDoctorNoteCombo() {
    return this._httpClient.PostData("Generic/GetByProc?procName=m_Rtrv_DoctorNotesTemplateMaterForCombo", {})
  }
  // public getWardNameList() {
  //   return this._httpClient.post("Generic/GetByProc?procName=m_Retrieve_WardClassMasterForCombo", {})
  // }

}
