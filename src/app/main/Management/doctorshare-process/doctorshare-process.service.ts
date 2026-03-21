import { Injectable } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class DoctorshareProcessService {
    UserFormGroup: any;

    constructor(public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller) {
        this.UserFormGroup = this.createUserFormGroup()
    }

    createUserFormGroup() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],

        })
    }

    public DoctorProcPayment(Param) {
        return this._httpClient.PostData("DoctorPAy/DoctorPayoutProcess", Param)
    }
}
