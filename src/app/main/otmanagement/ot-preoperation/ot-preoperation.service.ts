import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class OtPreoperationService {

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

  createOtPreOperationForm(): FormGroup {
    return this._formBuilder.group({
      opIpType: ["OP"],
      opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      BloodGroup: [],
      CategoryTypeId: [],
      Theater: [],
      TheaterLocation: [],
      estimateTime: [],
      Surgerydate: [new Date()],
      MobileNo: [],
      Diagnosis: [[]],
      Remarks: [],
      bloodArg: ["1"],
      pacReq: ["1"],
      EquReq: ["1"],
      Infective: ["1"],
      Clearance: [],
      Medical: [],
      Finance: [],
      surgeonTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeryType: ['', [Validators.required]],
      surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      partId: [],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      duration: ['', Validators.required],
      fromTime1: ['', Validators.required],
      toTime1: ['', Validators.required],
      duration1: ['', Validators.required],
      isprimary: [],
      surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      recourceType: [0],
      anestypeId: [0],
      anestheticsDr1: [0],
      bodyPartId: [],
      cathLabDiagnosis: [],
      ConsentText: [],
    });
  }

  createOtPostOperationForm(): FormGroup {
    return this._formBuilder.group({
      opIpType: ["OP"],
      opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeonTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeryType: ['', [Validators.required]],
      surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      partId: [],
      fromTime: ['', Validators.required],
      toTime: ['', Validators.required],
      duration: ['', Validators.required],
      surgeryAmt: [],
      DiscPer: [],
      concAmt: [],
      InfectivePer: [],
      InfectiveAmt: [],
      netAmt: [],
      Surgerydate: [new Date()],
      totalGrossAmt: [0],
      totalDiscAmt: [0],
      totalNetAmt: [0],
      billProcess: ['1'],
      isresourcecharge: [],
      isBilling: [],
      closureNote: [''],
      operativeFinding: [''],
      postOperNote: [''],
      patientCondNote: [''],

      BloodGroup: [],
      CategoryTypeId: [],
      Theater: [],
      TheaterLocation: [],
      estimateTime: [],
      Surgerydate1: [new Date()],
      MobileNo: [],
      Diagnosis: [[]],
      Remarks: [],
      fromTime1: ['', Validators.required],
      toTime1: ['', Validators.required],
      duration1: ['', Validators.required],
      cathLabDiagnosis: [],
      bloodArg: ["1"],
      pacReq: ["1"],
      EquReq: ["1"],
      Infective: ["1"],
      Medical: [],
      Finance: [],
    });
  }

}
