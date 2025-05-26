import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

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
        private _loggedService: AuthenticationService,
    public _formBuilder: UntypedFormBuilder) {
    this.myform = this.createtemplateForm();
    this.noteform = this.createDoctorNoteForm();
    this.Templateform = this.templateForm();
  }

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      Note: [''],
      Description: [''],
      DoctNoteId: '',
      WardName: [''],
      docHandId:[0],
      HandOverType: ["morning"],
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

   creathandOverForm(): FormGroup {
    return this._formBuilder.group({
      docHandId: [0],
      admId: [0],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      shiftInfo: ["morning"],
      patHandI: [''],
      patHandS: [''],
      patHandB: [''],
      patHandA: [''],
      patHandR: [''],
      isAddedBy: this._loggedService.currentUserValue.userId
    });
  }

   createDoctorNoteForm(): FormGroup {
    return this._formBuilder.group({
      doctNoteId: [0],
      admId: [0],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      doctorsNotes: [''],
      isAddedBy: this._loggedService.currentUserValue.userId
    });
  }

  templateForm(): FormGroup {
    return this._formBuilder.group({
      docNoteTempId: 0,
      docsTempName:[''],
      templateDesc: [''],
      addedBy:0,
      updatedBy:0
    });
  }

  public templateMasterSave(Param: any) {
    return this._httpClient.PostData("Nursing/DoctorNotesTemplateInsert", Param);
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

  public HandOverInsert(Param: any) {
    if (Param.docHandId) {
      return this._httpClient.PutData("Nursing/DoctorPatientHandover/" + Param.docHandId, Param);
    }else return this._httpClient.PostData("Nursing/DoctorPatientHandoverInsert", Param)
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
function notEmptyOrZeroValidator(): any {
  return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      return value > 0 ? null : { greaterThanZero: { value: value } };
    };
}
