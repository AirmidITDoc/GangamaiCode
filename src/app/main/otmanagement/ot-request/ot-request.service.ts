import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class OtRequestService {



    requestform: FormGroup;
    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.requestform = this.createRequestForm();
        this.myformSearch = this.createSearchForm();
    }

    createRequestForm(): FormGroup {
        return this._formBuilder.group({
            otbookingId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opIpId: ["", [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]], //doctortype value passing here
            siteDescId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            otRequestDate: [new Date()],
            otRequestTime: ['', [Validators.required]],
            // Validators.pattern(/^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i)
            opIpType: ["OP"],
            surgeryTypeId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            surgeryCategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            otbookingDate: [new Date(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
            otrequestId: [0],
            otbookingTime: [new Date(), [Validators.required]],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],

            doctorTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],

            // new fields
            BloodGroup: [],
            CategoryTypeId: [],
            Theater: [],
            TheaterLocation: [],
            estimateTime: [],
            Surgerydate: [new Date()],
            MobileNo: [],
            Diagnosis: [[]],
            Remarks: [],
            reqtype: ["1"],
            pacReq: ["1"],
            EquReq: ["1"],
            Infective: ["1"],
            Clearance: [],
            Medical: [],
            Finance: [],
            surgeryType: ['',[Validators.required]],
            surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            partId: [],
            fromTime: ['', Validators.required],
            toTime: ['', Validators.required],
            duration: ['', Validators.required],
            isprimary: [],
            surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            recourceType:[0],
            anestypeId: [0],
            anestheticsDr1: [0],
            bodyPartId:[]
        });
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

    // getOtRequestList(fromDate: string, toDate: string) {
    //     return this._httpClient.PostData('OTBooking/OTBookingRequestEmergencyList', {
    //         fromDate,
    //         toDate
    //     });
    // }

    initializeFormGroup() {
        this.createRequestForm();
    }
    populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }
    public getSurgeonsByDoctorType(doctTypeId) {
        return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId=" + doctTypeId)
    }

    public OnCancel(param) {
        return this._httpClient.PostData('OTBooking/Cancel', param)
    }
    public requestSave(Param: any) {
        if (Param.otbookingId) {
            return this._httpClient.PutData("OTBooking/Edit/" + Param.otbookingId, Param);
        } else return this._httpClient.PostData("OTBooking/Insert", Param);
    }

    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.DeleteData("CityMaster?Id=" + m_data.toString());
    // }
    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }
}
