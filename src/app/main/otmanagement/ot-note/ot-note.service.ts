import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
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
    private _FormvalidationserviceService: FormvalidationserviceService
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
      OTNoteID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      TranDate: [new Date().toISOString()],
      TranTime: [new Date().toISOString()],
      opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opIpType: ["OP"],
      surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeonId1: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeonId2: [0],
      anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anestheticsDr1: [0],
      anestheticsDr2: [0],
      description: [''],
      assistant: [''],
      bloodLoss: [''],
      sorubNurse: [''],
      histopathology: [''],
      bostOPOrders: [''],
      complicationMode: [''],

      Duration: '',
      OTTableId: '',
      Surgeryname: '',
      ProcedureId: '',
      AnesthType: '',
      UnBooking: '',
      Instruction: '',
      IsAddedBy: '',
      OTBookingID: '',
      Assistantscrub: '',
      Circulatingstaff: '',
      AnathesticNAme: '',
      OtNote: '',
      Extra: '',
      Pre: '',
      DoctorId: '',
      DoctorId1: '',
      AnestheticsDr3: '',
      RegID: '',
      PatientType: ['IP'],
    });
  }

  public getReportView(Param) {
    return this._httpClient.PostData("Report/ViewReport", Param);
  }
}
