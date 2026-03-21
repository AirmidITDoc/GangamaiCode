import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})

export class TheaterInService {

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

    createTheaterInForm(): FormGroup {
        return this._formBuilder.group({
            otbookingId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]], //doctortype value passing here
            siteDescId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            surgeryTypeId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryCategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            doctorTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            // new fields
            BloodGroup: [],
            categoryType: [],
            ottable: [],
            TheaterLocation: [],
            estimateTime: [],
            surgeryDate: [''],
            MobileNo: [],
            diagnosis: [[]],
            Remarks: [],
            partId: [],
            bodyPartId: [],
            theaterInDt: [],
            theaterInTime: [],
            startTime: [],
            endTime: [],
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
    public getRtrvReservationSurgeryList(employee) {
        return this._httpClient.PostData("OTReservation/OtReservationSurgeryDetailList", employee);
    }
    public getotsiteDiscById(Id) {
        return this._httpClient.GetData("SiteDescriptionMaster/" + Id);
    }
    public getDoctorsByDoctorType(doctTypeId) {
        return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId=" + doctTypeId)
    }
}
