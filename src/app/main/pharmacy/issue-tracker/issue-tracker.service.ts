import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup, UntypedFormBuilder, Validators } from "@angular/forms";
import { ApiCaller } from "app/core/services/apiCaller";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";

@Injectable({
    providedIn: 'root'
})
export class IssueTrackerService {
    userFormGroup: FormGroup;
    MyFrom: FormGroup;

    constructor(
        private _httpClient1: ApiCaller,
        private _httpClient: HttpClient,
        private _formBuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) { }

    CreateNewIssueFrom() {
        return this._formBuilder.group({
            IssueSummary: '',
            IssueDescription: '',
            IssueStatus: '',
            ImageName: '',
            ImagePath: '',
            imageFile: '',
            IssueRaised: '',
            IssueAssigned: '',

            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
        });
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
            customerName: [0],
            issueRaised: [0],
            issueStatus: [0],
            issueAssigned: [0],
            isCodeRelease: [false],
            isReviewStatus: [false],
        });
    }

    public getIssuTrackerList(Params) {
        return this._httpClient.post("Generic/GetByProc?procName=m_Rtrv_IssueTrackerInformation", Params);
    }
    public InsertIssueTracker(Param) {
        return this._httpClient.post("InventoryTransaction/IssueTrackerSave", Param)
    }
    public UpdateIssueTracker(Param) {
        return this._httpClient.post("InventoryTransaction/IssueTrackerUpdate", Param)
    }
    public getConstantsList(Params) {
        return this._httpClient.post("Generic/GetByProc?procName=Rtrv_Constants", Params);
    }


}
