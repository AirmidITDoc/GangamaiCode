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
      diagnosis: [[]],
      categoryType: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ottable: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      reservationType: ['1'],
      pacrequired: ['1'],
      equipmentsRequired: ['1'],
      clearanceMedical: false,
      clearanceFinancial: false,
      infective: ['1'],
      TheaterLocation: [],
      surgeryDate: ['', [Validators.required]],

      ////////surgery det parameters ////////////
      surgeryCategoryId: [''],
      surgeryId: [0],
      surgeryPart: [''],
      surgeryFromTime: [''],
      surgeryEndTime: [''],
      surgeryDuration: [''],
      isPrimary: [false],
      surgeonId: [0],
      anesthetistId: [0],

      ////////attendent det parameters ////////////
      recourceType: [0],
      doctorTypeId: [0],
      doctorId: [0],

      surgeonTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      // surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      partId: [],
      CategoryTypeId: [],
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
      // recourceType: [0],
      anestypeId1: [0],
      anestheticsDr1: [0],
      postOperNote: [''],
      patientCondNote: [''],
    });
  }

  public getpreOPerById(Id) {
    return this._httpClient.GetData("OTPreOperation/" + Id);
  }
  public getinOPerById(Id) {
    return this._httpClient.GetData("OTInOperation/" + Id);
  }
  public getotTableById(Id) {
    return this._httpClient.GetData("OtTableMaster/" + Id);
  }
  public getRtrvdiagnosisList(employee) {
    return this._httpClient.PostData("OTPreOperation/OtPreOperationDiagnosisList", employee);
  }
  public getRtrvpreOperAttendentList(employee) {
    return this._httpClient.PostData("OTPreOperation/preOperationAttendentList", employee);
  }
  public getRtrvPreOperSurgeryList(employee) {
    return this._httpClient.PostData("OTPreOperation/perOperationsurgeryList", employee);
  }
  public getotsiteDiscById(Id) {
    return this._httpClient.GetData("SiteDescriptionMaster/" + Id);
  }
  public getDoctorsByDoctorType(doctTypeId) {
    return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId=" + doctTypeId)
  }
  public InsertOTInOperation(employee) {
    if (employee.otinOperationId) {
      return this._httpClient.PutData("OTInOperation/Edit/" + employee.otinOperationId, employee);
    } else return this._httpClient.PostData("OTInOperation/Insert", employee);
  }
  public getRtrvinOperAttendentList(employee) {
    return this._httpClient.PostData("OTInOperation/InOperationAttendingDetailsList", employee);
  }
  public getRtrvinOperSurgeryList(employee) {
    return this._httpClient.PostData("OTInOperation/InOperationSurgeryDetailsList", employee);
  }
  public getRtrvInoprdiagnosisList(employee) {
    return this._httpClient.PostData("OTInOperation/OTInOperationDiagnosisList", employee);
  }
  public getRtrvInoprPostdiagnosisList(employee) {
    return this._httpClient.PostData("OTInOperation/OTInOperationPostOperDiagnosisList", employee);
  }
}
