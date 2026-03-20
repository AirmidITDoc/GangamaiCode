import { Injectable } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Injectable({
    providedIn: 'root'
})
export class PaymentmodechangesforpharmacyService {

    userFormGroup: FormGroup;
    paymentform: FormGroup;
    paymentInsertform: FormGroup;
    phartpayFormGroup: FormGroup;
    constructor(
        private _httpClient: ApiCaller,
        private _formBuilder: UntypedFormBuilder, private accountService: AuthenticationService,
        private _FormvalidationserviceService: FormvalidationserviceService
    ) {
        this.userFormGroup = this.createUseForm()
        this.paymentform = this.createpaymentForm();
        this.phartpayFormGroup = this.createUseForm()
        this.paymentInsertform = this.createpaymentInsertForm();
    }

    createUseForm() {
        return this._formBuilder.group({
            startdate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            RegNo: '',
            FirstName: '',
            LastName: '',
            SalesNo: '',
            Radio: ['0'],
            StoreId: ''

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

    createpaymentInsertForm() {
        return this._formBuilder.group({
            PaymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            BillNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ReceiptNo: [],
            PaymentDate: [new Date()],
            PaymentTime: [new Date()],
            CashPayAmount: ["0"],
            ChequePayAmount: ["0"],
            ChequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            BankName: '',
            ChequeDate: [new Date()],
            CardPayAmount: '',
            CardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            CardBankName: '',
            CardDate: [new Date()],
            AdvanceUsedAmount: '',
            AdvanceId: '',
            RefundId: '',
            TransactionType: '',
            Remark: '',
            AddBy: 0,
            IsCancelled: false,
            IsCancelledBy: 0,
            IsCancelledDate: '1900-01-01',
            NeftpayAmount: '',
            Neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            NeftbankMaster: '',
            Neftdate: [new Date()],
            PayTmamount: '',
            PayTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            PayTmdate: [new Date()],
            // Tdsamount: 0,
            wfamount: 0,
            companyId: 0,
            tdsamount: 0,
            cashCounterId: 0,

            isSelfOrcompany: 0,
            chCashPayAmount: 0,
            chChequePayAmount: 0,
            chCardPayAmount: 0,
            chAdvanceUsedAmount: 0,
            chNeftpayAmount: 0,
            chPayTmamount: 0,
            tranMode: 0,

            // extra fields

            PaidAmount: '',
            BalAmount: '',
            IsPayTMpay: '',
            NEFTBankName: '',
            IsNEFTpay: '',
            IsCardpay: '',
            IsChequepay: '',
            ChequeBankName: '',
            IsCashpay: '',
            strId: 0,
            opdipdtype: 1

        })
    }

    public deactivateTheStatus(m_data) {
        return this._httpClient.DeleteData("StoreMaster?Id=" + m_data.toString());
    }

    // public getBankMasterCombo() {
    //   return this._httpClient.PostData("Generic/GetByProc?procName=RetrieveBankMasterForCombo", {})
    // }

    public PaymentUpdate(employee) {

        if (employee.PaymentId)
            return this._httpClient.PutData("PaymentMode/Edit/" + employee.PaymentId, employee);
    }

    public PaymentPhyUpdate(employee) {

        if (employee.PaymentId)
            return this._httpClient.PutData("paymentpharmacy/Edit/" + employee.PaymentId, employee);
    }



    public TPaymentUpdate(paymentId, m_data) {
        return this._httpClient.PutData("PaymentMode/PaymentMode" + paymentId, m_data);
    }

    public getpaybBillBrowseList(m_data) {
        return this._httpClient.PostData("PaymentMode/OPBillListForPaymentModeChangeListBillNoWise", m_data);
    }


    public getpaymodeList(m_data) {
        return this._httpClient.PostData("Common", m_data)
    }

    public getBankNameList(m_data) {
        return this._httpClient.PostData("Common", m_data)
    }

}
