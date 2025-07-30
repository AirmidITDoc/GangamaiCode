import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
    private _FormvalidationserviceService: FormvalidationserviceService,
    public _formBuilder: UntypedFormBuilder) {
    this.myform = this.createtemplateForm();
    this.noteform = this.createDoctorNoteForm();
    this.Templateform = this.templateForm();
  }

  createtemplateForm(): FormGroup {
    return this._formBuilder.group({
      RegID: [''],
      TemplateId: [''],
      Category: ['NursNote'],
    });
  }

   creathandOverForm(): FormGroup {
    return this._formBuilder.group({
      docHandId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      admId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      shiftInfo: ["morning"],
      patHandI: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandS: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandB: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandA: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      patHandR: ['',[Validators.maxLength(500),this._FormvalidationserviceService.allowEmptyStringValidator()]],
      isAddedBy: this._loggedService.currentUserValue.userId
    });
  }

   createDoctorNoteForm(): FormGroup {
    return this._formBuilder.group({
      doctNoteId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      admId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tdate: [(new Date()).toISOString()],
      ttime: [(new Date()).toISOString()],
      doctorsNotes: ['',[Validators.maxLength(500)]],
      isAddedBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  templateForm(): FormGroup {
    return this._formBuilder.group({
      docNoteTempId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      docsTempName:['',[ Validators.required,this._FormvalidationserviceService.allowEmptyStringValidator(),Validators.maxLength(100)]],
      templateDesc: ['',[ Validators.required,this._FormvalidationserviceService.allowEmptyStringValidator()]],
      addedBy:[this._loggedService.currentUserValue.userId,[ Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
      updatedBy:[this._loggedService.currentUserValue.userId,[ Validators.required,this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }

  public templateMasterSave(Param: any) {
    return this._httpClient.PostData("Nursing/DoctorNotesTemplateInsert", Param);
}

  DoctorNotepoppulateForm(param) {
    this.myform.patchValue(param)
  }
  
  public HandOverInsert(Param: any) {
    if (Param.docHandId) {
      return this._httpClient.PutData("Nursing/DoctorPatientHandover/" + Param.docHandId, Param);
    }else return this._httpClient.PostData("Nursing/DoctorPatientHandoverInsert", Param)
  }

  public DoctorNoteInsert(Param: any) {
    if (Param.doctNoteId) {
      return this._httpClient.PutData("Nursing/DoctorNoteUpdate/" + Param.doctNoteId, Param);
    } else return this._httpClient.PostData("Nursing/DoctorNoteInsert", Param);
  }
}
