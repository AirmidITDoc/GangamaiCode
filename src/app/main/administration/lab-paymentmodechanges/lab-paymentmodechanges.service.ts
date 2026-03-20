import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class LabPaymentmodechangesService {

    tpayFormGroup: FormGroup

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
    ) {
        this.tpayFormGroup = this.createUserFormGroup()
    }

    createUserFormGroup() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            RegNo: '',
            FirstName: '',
            LastName: '',
            PBillNo: '',
            Radio: ['0'],
            ReceiptNo: ''
        })
    }

    createpaymentForm() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            PaymentId: '',
            CashPayAmt: '',
            IsCashpay: '',
            CardPayAmt: '',
            CardNo: '',
            CardBankName: '',
            IsCardpay: '',
            ChequePayAmt: '',
            ChequeNo: '',
            ChequeBankName: '',
            IsChequepay: '',
            NEFTPayAmount: '',
            NEFTNo: '',
            NEFTBankName: '',
            IsNEFTpay: '',
            PayTMAmount: '',
            PayTMTranNo: '',
            IsPayTMpay: '',
            PaidAmount: '',
            BalAmount: ''

        })
    }
}
