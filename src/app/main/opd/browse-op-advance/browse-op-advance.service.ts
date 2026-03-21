import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class BrowseOpAdvanceService {

    UserFormGroup: FormGroup;
    AdvanceOfRefund: FormGroup
    MyForm: FormGroup;

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller) {
        this.UserFormGroup = this.createUserFormGroup()
        this.AdvanceOfRefund = this.createAdvacneofRefundForm()
    }

    createUserFormGroup() {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            PBillNo: '',
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }

    createAdvacneofRefundForm() {
        return this._formBuilder.group({
            FirstName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [
                Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            RegNo: '',
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
        })
    }
}
