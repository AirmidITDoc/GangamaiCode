import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class InOperationService {

  constructor(
    private _httpClient: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  createSearchForm(): FormGroup {
    return this._formBuilder.group({
      start: [(new Date()).toISOString()],
      end: [(new Date()).toISOString()],
      FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
      RegNo: []
    });
  }

  createInOperationForm(): FormGroup {
    return this._formBuilder.group({
      otreservationId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opIpId: [""],
      opIpType: ["OP"],

      // new fields
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      duration: ['', Validators.required],
      surgeryType: ['', [Validators.required]],
      surgeonTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      partId: [],
      isprimary: [],
      surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      Theater: [],
      TheaterLocation: [],
      CategoryTypeId: [],
      Surgerydate: [new Date()],
      fromTime1: ['', Validators.required],
      toTime1: ['', Validators.required],
      duration1: ['', Validators.required],
      preOperDiagnosis: [[]],
      postOperDiagnosis: [],
      bloodArg: ["1"],
      pacReq: ["1"],
      EquReq: ["1"],
      Infective: ["1"],
      Clearance: [],
      Medical: [],
      Finance: [],
      bodyPartId: [],
      stepProc: [],
      bloodLoss: [],
      anestypeId: [],
      theaterinDt: [],
      theaterintime: [],
      theateroutDt: [],
      theaterouttime: [],
      intraOper: ["1"],
      mopCount: ["1"],
      closureNote: [''],
      operativeFinding: [''],
      recourceType: [0],
      anestypeId1: [0],
      anestheticsDr1: [0],
      postOperNote: [''],
      patientCondNote: [''],
    });
  }
}
