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
    getPaymentArr() {
        //return this._httpClient1.GetData("Dropdown/GetBindDropDown?mode=PaymentMode");
        return [
            { value: 'cash', viewValue: 'Cash' },
            { value: 'cheque', viewValue: 'Cheque' },
            { value: 'upi', viewValue: 'UPI' },
            { value: 'net banking', viewValue: 'Net Banking' },
            { value: 'card', viewValue: 'Card' },
            { value: 'tds', viewValue: 'TDS' },
            { value: 'wf', viewValue: 'WF' }
        ];
    }
    public DoctorProcPayment(Param) {
        return this._httpClient.PostData("DoctorPAy/DoctorPayoutProcess", Param)
    }
    public DoctorSharePayment(Param) {
        return this._httpClient.PostData("DoctorPAy/TDoctorpaymentInsert", Param)
    }
    public UnProcessDoctorpayout(Param) {
        return this._httpClient.PutData("DoctorPAy/DoctorPayoutUnprocess", Param)
    }
}
