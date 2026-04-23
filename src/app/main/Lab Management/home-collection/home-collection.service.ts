import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class HomeCollectionService {

    myFilterform: FormGroup;
    MyForm: FormGroup;

    constructor(
        public _frombuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller,
        private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }

    CreateSearchGroup() {
        return this._frombuilder.group({
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            FirstName: [''],
            LastName: [''],
            PBillNo: [''],
            DoctorID: [''],
            UnitId: [this.accountService.currentUserValue.user.unitId]
        })
    }

    public getstateId(Id) {
        return this._httpClient.GetData("StateMaster/" + Id);
    }
    public getCollectionById(param) {
        return this._httpClient.PostData("HomeCollection/homeCollectionDetList", param);
    }
    public getLabRegistraionMasterById(Id) {
        return this._httpClient.GetData("LabPatientRegistration/GetLabPatientRegisteredMaster?id=" + Id);
    }
    public getserviceList(param) {
        return this._httpClient.PostData("PathlogySampleCollection/PathRadServiceList", param);
    }
    public getReportView(Param) {
        return this._httpClient.PostData("Report/ViewReportFromDB", Param);
    }
    public getlabSuggestions(apiUrl: string, inputValue: string): Observable<any[]> {
        // debugger
        return this._httpClient.GetData(apiUrl + inputValue);
    }
    public getRtevPackageDetList(param) {
        return this._httpClient.PostData("BillingService/PackageDetailList", param);
    }
    public InsertHomeCollection(param) {
        if (param.homeCollectionId) {
            return this._httpClient.PutData("HomeCollection/Edit/" + param.homeCollectionId, param)
        } else return this._httpClient.PostData("HomeCollection/Insert", param)
    }

    public gethomeCollById(Id) {
        return this._httpClient.GetData("HomeCollection/" + Id);
    }
    public OnCancel(param) {
        return this._httpClient.PostData('HomeCollection/Cancel', param)
    }

    public statusUpdate(Param: any) {
        if (Param.homeCollectionId) {
            return this._httpClient.PutData("HomeCollection/updatePhlebotomist" + Param.homeCollectionId, Param);
        }
    }
}
