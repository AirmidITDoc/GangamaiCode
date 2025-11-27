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
      categoryType: [],
      ottable: [],
      TheaterLocation: [],
      estimateTime: [],
      surgeryDate: [new Date()],
      MobileNo: [],
      diagnosis: [[], [Validators.required]],
      Remarks: [],
      bloodArg: ["1"],
      Clearance: [],
      pacrequired: ['1'],
      equipmentsRequired: ['1'],
      clearanceMedical: false,
      clearanceFinancial: false,
      infective: ['1'],
      surgeryCategoryId: [''],
      surgeryId: [0],
      partId: [],
      surgeryFromTime: [''],
      surgeryEndTime: [''],
      surgeryDuration: [''],
      fromTime1: ['', Validators.required],
      toTime1: ['', Validators.required],
      duration1: ['', Validators.required],
      isprimary: [],
      surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      recourceType: [0],
      doctorTypeId: [0],
      doctorId: [0],
      bodyPartId: [],
      cathLabDiagnosis: [],
      consentName: [''],
      departmentId: [0],
      ConsentText: [''],
      surgeryPart: [''],
    });
  }

  createOtPostOperationForm(): FormGroup {
    return this._formBuilder.group({
      opIpType: ["OP"],
      opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      surgeonTypeId: [0],
      surgeryCategoryId: [''],
      surgeryPart: [''],
      surgeryId: [0],
      partId: [],
      surgeryFromTime: [''],
      surgeryEndTime: [''],
      surgeryDuration: [''],
      surgeryAmt: [],
      DiscPer: [],
      concAmt: [],
      InfectivePer: [],
      InfectiveAmt: [],
      netAmt: [],
      surgeryDate: [],
      totalGrossAmt: [0],
      totalDiscAmt: [0],
      totalNetAmt: [0],
      billProcess: ['0'],
      isresourcecharge: [],
      isBilling: [],
      closureNote: [''],
      operativeFinding: [''],
      postOperNote: [''],
      patientCondNote: [''],

      BloodGroup: [],
      categoryType: [],
      ottable: [],
      TheaterLocation: [],
      estimateTime: [],
      surgeryDate1: [new Date()],
      MobileNo: [],
      diagnosis: [[]],
      Remarks: [],
      fromTime1: ['', Validators.required],
      toTime1: ['', Validators.required],
      duration1: ['', Validators.required],
      cathLabDiagnosis: [],
      bloodArg: ["1"],
      pacrequired: ['1'],
      equipmentsRequired: ['1'],
      clearanceMedical: false,
      clearanceFinancial: false,
      infective: ['1'],
      bodyPartId: [],
      paymentMode: [1],
    });
  }

  public getotReservationById(Id) {
    return this._httpClient.GetData("OTReservation/" + Id);
  }
  public getotTableById(Id) {
    return this._httpClient.GetData("OtTableMaster/" + Id);
  }
  public getRtrvdiagnosisList(employee) {
    return this._httpClient.PostData("OTReservation/OtReservationDiagnosisList", employee);
  }
  public getRtrvReservationAttendentList(employee) {
    return this._httpClient.PostData("OTReservation/OtReservationAttendingDetailList", employee);
  }
   public getRtrvpreOperAttendentList(employee) {
    return this._httpClient.PostData("OTPreOperation/preOperationAttendentList", employee);
  }
  public getRtrvReservationSurgeryList(employee) {
    return this._httpClient.PostData("OTReservation/OtReservationSurgeryDetailList", employee);
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

  public InsertOTPreOperation(employee) {
    if (employee.otpreOperationId) {
      return this._httpClient.PutData("OTPreOperation/Edit/" + employee.otpreOperationId, employee);
    } else return this._httpClient.PostData("OTPreOperation/Insert", employee);
  }

  public getpreOPerById(Id) {
    // return this._httpClient.GetData("OTReservation/Getcheckinout/" + Id);
  }

}
