import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class OtRequestService {

    myformSearch: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
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
            RegNo: []
        });
    }

    // getOtRequestList(fromDate: string, toDate: string) {
    //     return this._httpClient.PostData('OTBooking/OTBookingRequestEmergencyList', {
    //         fromDate,
    //         toDate
    //     });
    // }

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
        if (Param.otrequestId) {
            return this._httpClient.PutData("OTBooking/Edit/" + Param.otrequestId, Param);
        } else return this._httpClient.PostData("OTBooking/Insert", Param);
    }

    // public deactivateTheStatus(m_data) {
    //     return this._httpClient.DeleteData("CityMaster?Id=" + m_data.toString());
    // }
    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReport", Param);
    }
}
