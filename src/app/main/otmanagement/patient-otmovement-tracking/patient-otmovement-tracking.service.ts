import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
  providedIn: 'root'
})
export class PatientOtmovementTrackingService {

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

  createCheckInForm(): FormGroup {
    return this._formBuilder.group({
      otcheckInId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      otreservationId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      otcheckInDate: [new Date()],
      otcheckInTime: ['',[Validators.required]],
      opipid: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opiptype: ["OP"],//true
      fromDepartment: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      toDepartment: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      movingType: ['OTRequest'],
      modeOfTransfer: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      authorisedBy: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      accompanied: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      equipmentCarried: [''],
      remark: [''],
      purPoseOfMovement: [''],
      checkInOut: [1], //if checkinid then pass 0
      checkOutTime: [''], //if checkinid then pass time or else no
      checkOutFromDepartment: [0], //if checkinid then pass id or else no
      checkOutToDepartment: [0], //if checkinid then pass id or else no
    });
  }


  public getotReservationById(Id) {
    return this._httpClient.GetData("OTReservation/" + Id);
  }

  public getotcheckInOutById(Id) {
    return this._httpClient.GetData("OTReservation/Getcheckinout/" + Id);
  }

  public CheckINOutSave(Param: any) {
    if (Param.otcheckInId) {
      return this._httpClient.PutData("OTReservation/OtReservationCheckInOut", Param);
    } else return this._httpClient.PostData("OTReservation/OtReservationCheckInOut", Param);
  }

    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }
}
