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
            RegNo: [],
            opipType: ["2"],
        });
    }

    public getDoctorsByDoctorType(doctTypeId) {
        return this._httpClient.GetData("VisitDetail/DoctorTypeDoctorList?DocTypeId=" + doctTypeId)
    }
    public getotRequestById(Id) {
        return this._httpClient.GetData("OTRequest/" + Id);
    }
    public getotTableById(Id) {
        return this._httpClient.GetData("OtTableMaster/" + Id);
    }
    public getotsiteDiscById(Id) {
        return this._httpClient.GetData("SiteDescriptionMaster/" + Id);
    }
    public OnCancel(param) {
        return this._httpClient.PostData('OTRequest/Cancel', param)
    }
    public requestSave(Param: any) {
        if (Param.otrequestId) {
            return this._httpClient.PutData("OTRequest/Edit/" + Param.otrequestId, Param);
        } else return this._httpClient.PostData("OTRequest/Insert", Param);
    }

    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReportFromDB", Param);
    }

    public getRtrvdiagnosisList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestDiagnosisList", employee);
    }
    public getRtrvRequestSurgeryList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestSurgeryDetailList", employee);
    }
    public getRtrvRequestAttendentList(employee) {
        return this._httpClient.PostData("OTRequest/OtRequestAttendingDetailList", employee);
    }
}
