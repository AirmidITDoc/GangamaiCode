import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class OtBillingService {

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
            RegNo: [],
            opipType: ["2"],
        });
    }

    createOtbillForm(): FormGroup {
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
            surgeryDate: [(new Date()).toISOString(), Validators.required],
            totalGrossAmt: [0],
            totalDiscAmt: [0],
            totalNetAmt: [0],
            billProcess: ['0'],
            isresourcecharge: [],
            isBilling: [],
            pacrequired: ['1'],
            equipmentsRequired: ['1'],
            clearanceMedical: false,
            clearanceFinancial: false,
            infective: ['1'],
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
