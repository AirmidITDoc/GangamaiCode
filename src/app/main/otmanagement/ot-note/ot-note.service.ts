import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
  providedIn: 'root'
})
export class OtNoteService {

  OTNoteform: FormGroup;
  myformSearch: FormGroup;
  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService
  ) {
    // this.OTNoteform = this.createReservationForm();
    // this.OTNoteform = this.createOtNoteForm();
  }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      RegNo: []
    });
  }

  createOtNoteForm() {
    return this._formBuilder.group({
      otnoteTempId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      ottemplateName: [''],
      otdate: [new Date().toISOString()],
      ottime: [new Date().toISOString()],
      surgeryName: ['',[Validators.required]],
      surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeonId1: [0],
      assistant: [''],
      anesthetishId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anesthetishId1: [0],
      anesthetishId2: [0], //passing assisstent doctor id
      anesthetishType: [''],
      incision: [''],
      operativeDiagnosis: [''],
      operativeFindings: [''],
      operativeProcedure: [''],
      extraProPerformed: [''],
      closureTechnique: [''],
      postOpertiveInstru: [''],
      detSpecimenForLab: [''],
      addedBy:[this.accountService.currentUserValue.userId],
      updatedBy:[this.accountService.currentUserValue.userId],
      surgeryType:[''],
      fromTime:['',[Validators.required]],
      toTime:['',[Validators.required]],
      otreservationId:[0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      bloodLoss: [''],
      sorubNurse: [''],
      histopathology: [''],
      surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      bostOporders: [''],
      anestTypeId:[0], //pass from setvalue
      siteDescId:[0], //pass from setvalue
      complicationMode:[''],
      serviceId:[0],
      procedureId:[0],

      // extra field
      description:['']
    });
  }

  public getReportView(Param) {
     return this._httpClient.PostData("Report/ViewReportFromDB", Param);
  }

    public otNoteSave(Param: any) {
        return this._httpClient.PostData("OTNotesTemplate", Param);
    }
}
