import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
@Injectable({
    providedIn: 'root'
})
export class DiscountApprovalService {

    myformSearch: FormGroup;
    sampldetailform: FormGroup;

    constructor(private _formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _httpClient: ApiCaller) {
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
            TestStatusSearch: ['1'],
            PBillNo: '',
            CompanyId: 0,
            UnitId: [this.accountService.currentUserValue.user.unitId]
        });
    }

    CreateForm() {
        return this._formBuilder.group({
            discSeqId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opipid: [0, Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            opiptype: 4,
            billNo: [0, Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            requestAmount: [0, Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            approvedAmount: [0, Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()],
            appovedBy: this.accountService.currentUserValue.userId,
            approvedDateTime: [new Date().toISOString()],
            comments: ['', [Validators.required]],
            isActive: [false],
        })
    }

    public statusUpdate(Param: any) {
        return this._httpClient.PutData("RefundOfBill/UpdateRefundApproval" + Param.refundId, Param);
    }
}
