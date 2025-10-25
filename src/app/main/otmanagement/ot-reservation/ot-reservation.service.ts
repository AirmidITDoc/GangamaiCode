import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class OtReservationService {

    reservationForm: FormGroup;
    myformSearch: FormGroup;

    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.reservationForm = this.createReservationForm();
        this.myformSearch = this.createSearchForm();
    }

    createReservationForm(): FormGroup {
        return this._formBuilder.group({

            otreservationId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
            reservationDate: [new Date(), [Validators.required]],
            reservationTime: [new Date(), [Validators.required]],
            opIpId: [""],
            opIpType: ["OP"],
            opdate: [new Date()],
            opstartTime: ['', Validators.required],
            opendTime: ['', Validators.required],
            // duration: ['', Validators.required],
            ottableId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
            // surgeonId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            surgeonId1: [0],
            // anestheticsDr: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            // anestheticsDr1: [0],
            // surgeryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            anesthTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            instruction: ["", this._FormvalidationserviceService.allowEmptyStringValidatorOnly()],
            ottypeId: [0],
            unBooking: [false],
            isCancelled: [false],
            isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isCancelledDateTime: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
            departmentId: [0],
            otrequestId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],

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
            bodyPartId:[],
            RefNo:[],
            id:[]
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            FirstName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            LastName: ['', [Validators.pattern("^[A-Za-z/() ]*$")]],
            RegNo: [],
            ottableId:[0]
        });
    }
    
    CreateForm() {
        return this._formBuilder.group({
            PatientName: [''],
            Reason: ['']
        })
    }

    populateForm(param) {
        // this.personalFormGroup.patchValue(param);
    }
    initializeFormGroup() {
        this.createReservationForm();
    }

    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }

    public reservationSave(Param: any) {
        if (Param.otreservationId) {
            return this._httpClient.PutData("OTReservation/Edit/" + Param.otreservationId, Param);
        } else return this._httpClient.PostData("OTReservation/Insert", Param);
    }

    public getBookingDatePostpone(Param: any) {
        return this._httpClient.PostData("", Param);
    }

     public OnCancel(param) {
        return this._httpClient.PostData('OTReservation/Cancel', param)
    }
}
