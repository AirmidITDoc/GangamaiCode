import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class OtReservationService {
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loggedService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            RegNo: [],
            opipType: ["2"],
        });
    }

//      "otreservationId": 0,
//   "opipid": 0,
//   "surgeryDate": "Unknown Type: DateTime",
//   "createdby": 0,
//   "reason": "string",
//   "newOTReservationId": 0

    CreateForm() {
        return this._formBuilder.group({
            otreservationId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            isAnaesthetistPaid: [false],
            isMaterialReplacement: [false],
            PatientName:'',
            surgeryDate:[new Date().toISOString()],
            reason:'',
            opipid:'',
            createdby:0,
            newOTReservationId:0
        })
    }

    populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }

    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }
     public getMultiReportView(Param) {
        return this._httpClient.PostData("Report/NewMultiReport", Param);
    }
    public getotRequestById(Id) {
        return this._httpClient.GetData("OTRequest/" + Id);
    }
    public getotReservationById(Id) {
        return this._httpClient.GetData("OTReservation/" + Id);
    }
    public getotOperativeById(Id) {
        return this._httpClient.GetData("OTOperativeNotes/" + Id);
    }
    public getotsiteDiscById(Id) {
        return this._httpClient.GetData("SiteDescriptionMaster/" + Id);
    }
    public getotTableById(Id) {
        return this._httpClient.GetData("OtTableMaster/" + Id);
    }
    public getDoctorsByDoctorType(doctTypeId) {
        return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId=" + doctTypeId)
    }
    public reservationSave(Param: any) {
        if (Param.otreservationId) {
            return this._httpClient.PutData("OTReservation/Edit/" + Param.otreservationId, Param);
        } else return this._httpClient.PostData("OTReservation/Insert", Param);
    }

    public getBookingDatePostpone(Param: any) {
        return this._httpClient.PostData("OTReservation/OTBookingPostPone", Param);
    }

    public OnCancel(param) {
        return this._httpClient.PostData('OTReservation/Cancel', param)
    }
    public getRtrvReservationAttendentList(employee) {
        return this._httpClient.PostData("OTReservation/OtReservationAttendingDetailList", employee);
    }
    public getRtrvReservationSurgeryList(employee) {
        return this._httpClient.PostData("OTReservation/OtReservationSurgeryDetailList", employee);
    }
    public getRtrvdiagnosisList(employee) {
        return this._httpClient.PostData("OTReservation/OtReservationDiagnosisList", employee);
    }
    public getRtrvRequestSurgeryList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestSurgeryDetailList", employee);
    }
    public getRtrvRequestAttendentList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestAttendingDetailList", employee);
    }
    public getRtrvotReqdiagnosisList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestDiagnosisList", employee);
    }
    public operativeSave(Param: any) {
        if (Param.operativeNotesId) {
            return this._httpClient.PutData("OTOperativeNotes/" + Param.operativeNotesId, Param);
        } else return this._httpClient.PostData("OTOperativeNotes/Insert", Param);
    }

    public statusUpdate(Param: any) {
        // if (Param.otreservationId) {
            return this._httpClient.PostData("OTReservation/UpdateOTReservationHeader/", Param);
        // }
    }
}
