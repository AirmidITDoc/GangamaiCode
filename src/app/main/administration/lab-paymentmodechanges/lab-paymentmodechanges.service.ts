import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';

@Injectable({
    providedIn: 'root'
})
export class LabPaymentmodechangesService {

    tpayFormGroup: FormGroup
    paymentform: FormGroup

    constructor(
        public _formBuilder: UntypedFormBuilder,
        public _httpClient: ApiCaller
    ) {
        this.tpayFormGroup = this.createUserFormGroup()
        this.paymentform = this.createpaymentForm();
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

    public getpaybBillBrowseList(m_data) {
        return this._httpClient.PostData("PaymentMode/OPBillListForPaymentModeChangeListBillNoWise", m_data);
    }

    public TPaymentUpdate(paymentId, m_data) {
        return this._httpClient.PutData("PaymentMode/NewPaymentMode" + paymentId, m_data);
    }

    public getpaymodeList(m_data) {
        return this._httpClient.PostData("Common", m_data)
    }

    public getBankNameList(m_data) {
        return this._httpClient.PostData("Common", m_data)
    }
        public Deletepaymentmode(m_data) {
        return this._httpClient.PostData("PaymentMode/Cancel", m_data)
    }
}
