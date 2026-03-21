import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { LoaderService } from 'app/core/components/loader/loader.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class OpAdvanceService {

    myFilterform: FormGroup;
    UserFormGroup: FormGroup;
    AdvanceOfRefund: FormGroup;
    constructor(
        public _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder,
        private _loaderService: LoaderService,
    ) {
        this.myFilterform = this.filterForm();
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

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            RegNo: '',
            OPDNo: '',
            FirstName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MiddleName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            LastName: ['', [Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),]],
            MobileNo: ['', [Validators.pattern("^[0-9]*$"), Validators.minLength(10), Validators.maxLength(10),]],
            searchDoctorId: '0',
            DoctorName: '',
            IsDischarge: [0],
            WardId: '0',
            RoomName: '',
            fromDate: [],
            enddate: [],
            DischargeId: [''],

        });
    }

    public getRegistraionById(Id) {
        return this._httpClient.GetData("OutPatient/" + Id);
    }
    public InsertAdvanceHeader(employee) {

        return this._httpClient.PostData("Advance/InsertSP", employee)
    }
    public UpdateAdvanceHeader(employee) {

        return this._httpClient.PutData("Advance/Edit", employee)
    }
}
