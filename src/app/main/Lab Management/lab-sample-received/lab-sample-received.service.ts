import { HttpBackend, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Injectable({
    providedIn: 'root'
})
export class LabSampleReceivedService {

    myformSearch: FormGroup;
    sampldetailform: FormGroup;

    constructor(private _formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        private handler: HttpBackend, private _httpClient: HttpClient, private _httpClient1: ApiCaller,) {
        this.myformSearch = this.createSearchForm();
    }

    createSearchForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: [],
            FirstName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]],
            // BillNo:[''],
            // BillDate:[''],
            PatientTypeSearch: ['5'],
            StatusSearch: ['0'],
            Istype: ['2'],
            CategoryId: [''],
            start: [new Date().toISOString()],
            end: [new Date().toISOString()],
            PBillNo: '',
            CompanyId: 0,
            UnitId: [this.accountService.currentUserValue.user.unitId]
        });
    }

    public UpdateSampleRecived(employee) {
        return this._httpClient1.PutData("LabSampleRecived/LabSampleRecivedUpdate", employee);
    }

    public getSampleRecivedlist(employee) {
        return this._httpClient1.PostData("LabSampleRecived/LabSampleRecivedList", employee)
    }
    public OnCancel(param) {
        return this._httpClient1.PostData('LabSampleRecived/Cancel', param)
    }
}
