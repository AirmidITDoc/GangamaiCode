import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { BillDoctorwiseService } from '../../bill-list-doctorwise/bill-doctorwise.service';
import { DoctorshareProcessService } from '../doctorshare-process.service';


@Component({
  selector: 'app-doctor-payment',
  templateUrl: './doctor-payment.component.html',
  styleUrls: ['./doctor-payment.component.scss'],
      animations: fuseAnimations
})
export class DoctorPaymentComponent {
currentDate = new Date();
    patientDetailsFormGrp: FormGroup;
    selectedPaymnet1: string = '';
    RegNo: any;
    DoctorName: any;
    CompanyName: any;
    Date: any;
    DepartmentName: any;
    Age: any;
    OPD_IPD_Id: any;
    TariffName: any;
    MultipleSettlement: boolean = false;
    autocompleteModebank: string = "Bank";
    netPayAmt: any = 0;
    nowDate: Date;
    amount1: number;
    screenFromString = 'payment-form';
    autocompleteModecompany: string = "Company";
    autocompleteModePaymentMode: string = "CommonpaymentMode";
    paidAmt: number;
    balanceAmt: number = 0;
    advanceData: any = {};
    PatientName: any;
    submitted: boolean = false;
    paymentArr1: any[] = this._DoctorshareProcessService.getPaymentArr();
    BindPaymentTypes() {
        
        const full = this._DoctorshareProcessService.getPaymentArr();
        const final = [];
        full.forEach((item) => {
            if (!this.Payments.data.find(x => x.PaymentType == item.value)) {
                final.push(item);
            }
        });
        this.paymentArr1 = final;
    }
    Upiflag = 0
    onChangePaymentType() {
        if (this.selectedPaymnet1 == 'CASH') {
            this.patientDetailsFormGrp.get('referenceNo1').clearValidators();
            this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('regDate1').clearValidators();
            this.patientDetailsFormGrp.get('regDate1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('bankName1').clearValidators();
            this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
        }
        else if (this.selectedPaymnet1 == 'TDS' || this.selectedPaymnet1 == 'WF') {
            this.patientDetailsFormGrp.get('referenceNo1').clearValidators();
            this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('regDate1').clearValidators();
            this.patientDetailsFormGrp.get('regDate1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('bankName1').clearValidators();
            this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
        }
        else {
            this.patientDetailsFormGrp.get('referenceNo1').setValidators([Validators.required]);
            this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
            if (this.selectedPaymnet1 == 'CHEQUE') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
            else if (this.selectedPaymnet1 == 'CARD') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
            else if (this.selectedPaymnet1 == 'NET BANKING') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
            else if (this.selectedPaymnet1 == 'UPI') {
                this.patientDetailsFormGrp.get('referenceNo1').setValidators([Validators.required]);
                this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
                this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
                this.patientDetailsFormGrp.get('bankName1').clearValidators();
                this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
                // Optionally revalidate the whole form
                this.patientDetailsFormGrp.updateValueAndValidity();
                this.Upiflag = 1
            }
            else {
                this.patientDetailsFormGrp.get('bankName1').clearValidators();
                this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
            }
        }
        this.patientDetailsFormGrp.markAllAsTouched();
        this.patientDetailsFormGrp.updateValueAndValidity();
    }
    currency: any = '';
    Payments = new MatTableDataSource<PaymentList>();
    selectedSaleDisplayedCol = [
        'PaymentType',
        'Amount',
        'BankName',
        'RefNo',
        'RegDate',
        'buttons'
    ];

    get f(): { [key: string]: AbstractControl } {
        return this.patientDetailsFormGrp.controls;
    }
    IsAllowAdd() {
        return this.netPayAmt > ((this.paidAmt || 0) + Number(this.amount1));
    }
    GetBalanceAmt() {
        if (this.amount1 > this.netPayAmt) {
            this.toastr.warning('Entered amount is greaterthan NetAmount!, Please check..', 'warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.amount1 = 0;
            this.balanceAmt = Number(this.netPayAmt || 0) - (Number(this.paidAmt || 0));
            return
        }
        if (this.amount1 > (this.netPayAmt - this.paidAmt)) {
            this.toastr.warning('Entered amount is greaterthan balance amt!, Please check..', 'warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            this.amount1 = 0;
            this.balanceAmt = Number(this.netPayAmt || 0) - (Number(this.paidAmt || 0));
            return
        }
        this.balanceAmt = Number(this.netPayAmt || 0) - (Number(this.paidAmt || 0) + Number(this.amount1 || 0));
    }

    OnCheckFormValidity(): number {
        this.patientDetailsFormGrp.markAllAsTouched();
        this.patientDetailsFormGrp.updateValueAndValidity();

        if (this.patientDetailsFormGrp.invalid) {

            const invalidFields = [];
            if (this.patientDetailsFormGrp.invalid) {
                for (const controlName in this.patientDetailsFormGrp.controls) {
                    const control = this.patientDetailsFormGrp.get(controlName);
                    if (control?.invalid) {
                        invalidFields.push(`Payment From: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
                return 0
            }
        }
        return 1;
    }
    getselectObjPayMode(obj) {
        console.log(obj)
        this.selectedPaymnet1 = obj.text
        this.onChangePaymentType();
    }
    onAddPayment() {
        this.submitted = true;
        if (this.patientDetailsFormGrp.invalid) {
            return;
        }
        const isDuplicate = this.Payments.data.some(item => item?.PaymentType === this.selectedPaymnet1 &&
            item.RefNo?.trim().toLowerCase() === this.patientDetailsFormGrp.get("referenceNo1")?.value?.trim().toLowerCase() &&
            item.BankName?.trim().toLowerCase() === this.BankNam?.trim().toLowerCase() &&
            Number(item.Amount) === Number(this.amount1)
        );
        if (isDuplicate) {
            Swal.fire('Already record added with same details');
            return;
        }
        const tmp = this.Payments.data;
        tmp.push({
            Id: this.getNewId(),
            PaymentType: this.selectedPaymnet1, Amount: this.amount1,
            RefNo: this.patientDetailsFormGrp.get("referenceNo1")?.value ?? "",
            BankId: this.BankId,
            BankName: this.BankNam,
            RegDate: this.patientDetailsFormGrp.get("regDate1")?.value ?? ""
        });
        this.Payments.data = tmp;
        this.paidAmt = this.Payments.data.reduce(function (a, b) { return a + Number(b['Amount']); }, 0);
        this.balanceAmt = this.netPayAmt - this.paidAmt;
        this.patientDetailsFormGrp.get('balanceAmountController').setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("referenceNo1").setValue('');
        this.patientDetailsFormGrp.get("bankName1").setValue(null);
        //this.patientDetailsFormGrp.get("regDate1").setValue(null);
        this.patientDetailsFormGrp.get("amount1").setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("paymentType1").setValue(null);
        this.BankId = 0;
        this.BankNam = '';
        this.BindPaymentTypes();
        this.GetBalanceAmt();
    }
    getNewId() {
        return Math.max(...this.Payments.data.map(o => o.Id), 0) + 1;
    }
    deletePayment(payment) {
        Swal.fire({
            title: "Are you sure to remove this payment?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                const tmp = this.Payments.data;
                tmp.splice(this.Payments.data.findIndex(x => x.Id == payment.Id), 1);
                this.Payments.data = tmp;
                this.paidAmt = this.Payments.data.reduce(function (a, b) { return a + Number(b['Amount']); }, 0);
                this.balanceAmt = this.netPayAmt - this.paidAmt;
                this.BindPaymentTypes();
            }
        });
    }

    constructor(
        private formBuilder: UntypedFormBuilder,
        private dialogRef: MatDialogRef<DoctorPaymentComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _DoctorshareProcessService: DoctorshareProcessService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _ConfigService: ConfigService
        // private snackBarService: SnackBarService
    ) {
        this.patientDetailsFormGrp = this.createForm();
        this.nowDate = new Date();
        console.log(this.data)
        if (data) {
            this.advanceData = this.data.vPatientHeaderObj;
            this.patientDetailsFormGrp.get('paymentType1')?.setValue('CASH')
            this.selectedPaymnet1 = 'CASH'
            console.log(this.advanceData)
            this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.amount1 = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.PatientName = this.advanceData.PatientName;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.DoctorName;
            this.CompanyName = this.advanceData.CompanyName;
            this.Date = this.advanceData.Date;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName;
            this.Paymentobj['transactionType'] = 0;
        }

        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue
    }

    ngOnInit(): void {
        // this.patientDetailsFormGrp = this.createForm();
    }
    dateTimeObj: Date;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    createForm() {
        return this.formBuilder.group({
            paymentType1: ['', Validators.required],
            amount1: [this.netPayAmt, Validators.min(0.1)],
            referenceNo1: [''],
            bankName1: [''],
            regDate1: [(new Date()).toISOString()],
            paidAmountController: [this.paidAmt],
            balanceAmountController: [this.balanceAmt],
            CompanyId: [0]
        });
    }

    BankId = 0
    BankNam: any;
    selectChangebank(event) {
        console.log(event)
        this.BankId = event.value
        this.BankNam = event.text
    }

    getValidationMessages() {
        return {
            bankName1: [
                { name: "required", Message: "bankName is required" }
            ],
            paymentType1: [
                { name: "required", Message: "Payment mode is required" }
            ]
        };
    }
    onClose() {
        this.dialogRef.close();
    }

    Paymentobj = {};
    ModePaymentObj: any = [];
    // Paymentobj: any[] = [];   //changed by raksha
    onSubmit() {
        let transactionType = 0;
        let opdipdtype = 0;
        const result = this.OnCheckFormValidity();
        if (result === 0) return; // stop execution if invalid


        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        this.onAddPayment();
        if (this.balanceAmt != 0 && this.data?.FromName != 'OP-Bill' && this.data?.FromName != 'OP-SETTLEMENT'
            && this.data?.FromName != 'LAB-Bill' && this.data?.FromName != 'LAB-SETTLEMENT') {
            Swal.fire('Please select payment mode, Balance Amount is' + this.balanceAmt)
            return
        }
        // -------------- If you comment this code -- OP Billing and Browse List - you can't do the parital payment
        if (this.amount1 != 0 && this.data?.FromName == 'OP-Bill' && this.data?.FromName != 'OP-SETTLEMENT'
            && this.data?.FromName == 'LAB-Bill' && this.data?.FromName != 'LAB-SETTLEMENT') {
            const balamt = this.netPayAmt - this.paidAmt
            // Swal.fire('Please pay remaing amount, Balance Amount is ' + balamt)
            this.patientDetailsFormGrp.get("balanceAmountController").setValue(balamt);
            // return
        }
        if (this.amount1 != 0 && this.data?.FromName != 'OP-Bill' && this.data?.FromName != 'OP-SETTLEMENT'
            && this.data?.FromName != 'LAB-Bill' && this.data?.FromName != 'LAB-SETTLEMENT') {
            const balamt = this.netPayAmt - this.paidAmt
            Swal.fire('Please pay remaing amount, Balance Amount is ' + balamt)
            return
        }
        //new changes done by Ambadas op SETTLEMENT 10/6/2025
             
        //new changes done by Ambadas op bill 10/6/2025
        //  if (this.data.FromName == "OP-Bill") {
            transactionType = 0;
            this.Paymentobj['paymentId'] = 0;
            this.Paymentobj['billNo'] = 0;
            this.Paymentobj['receiptNo'] = '';
            this.Paymentobj['paymentDate'] = formattedDate
            this.Paymentobj['paymentTime'] = formattedTime
            this.Paymentobj['cashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CASH")?.Amount ?? 0;
            this.Paymentobj['chequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.Amount ?? 0;
            this.Paymentobj['chequeNo'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.RefNo ?? "0";
            this.Paymentobj['bankName'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.BankName ?? "";
            this.Paymentobj['chequeDate'] = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['cardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.Amount ?? 0;
            this.Paymentobj['cardNo'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.RefNo ?? "0";
            this.Paymentobj['cardBankName'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.BankName ?? "";
            this.Paymentobj['cardDate'] = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['advanceUsedAmount'] = 0;
            this.Paymentobj['advanceId'] = 0;
            this.Paymentobj['refundId'] = 0;
            this.Paymentobj['transactionType'] = 0;
            this.Paymentobj['remark'] = " ";
            this.Paymentobj['addBy'] = this._loggedService.currentUserValue.userId,
                this.Paymentobj['isCancelled'] = false;
            this.Paymentobj['isCancelledBy'] = 0;
            this.Paymentobj['isCancelledDate'] = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['neftpayAmount'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.Amount ?? 0;
            this.Paymentobj['neftno'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.RefNo ?? "0";
            this.Paymentobj['neftbankMaster'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.BankName ?? "";
            this.Paymentobj['neftdate'] = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['payTmamount'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.Amount ?? 0;
            this.Paymentobj['payTmtranNo'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.RefNo ?? "0";
            this.Paymentobj['payTmdate'] = this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['tdsamount'] = this.Payments.data.find(x => x.PaymentType == "TDS")?.Amount ?? 0;
            this.Paymentobj['unitId'] = this._loggedService.currentUserValue.user.unitId
            this.Paymentobj['wfamount'] = this.Payments.data.find(x => x.PaymentType == "WF")?.Amount ?? 0;
            this.Paymentobj['companyId'] = 0;
        // }
       
        this.Payments.data.forEach(element => {
            this.ModePaymentObj.push({
                paymentId: 0,
                unitId: this._loggedService.currentUserValue.user.unitId,
                billNo: this.advanceData?.billNo || 0,
                opdipdtype: opdipdtype || 0,
                paymentDate: formattedDate,
                paymentTime: formattedTime,
                payAmount: element.Amount ?? 0,
                tranNo: element.RefNo ?? "",
                bankName: element.BankName ?? "",
                validationDate: this.datePipe.transform(element.RegDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                advanceUsedAmount: 0,
                comments: "",
                payMode: element.PaymentType ?? "",
                onlineTranNo: '0',
                onlineTranResponse: '0',
                companyId: this.patientDetailsFormGrp.get('CompanyId')?.value || 0,
                advanceId: 0,
                refundId: 0,
                cashCounterId: this.advanceData?.CashCounterId || 0,
                transactionType: transactionType,
                isSelfOrcompany: this.advanceData?.CompanyId ? 1 : 0,
                tranMode: "HOSP",
                createdBy: this._loggedService.currentUserValue?.userId ?? 0,
                transactionLabel: this.advanceData?.TransactionLabel || 0,
            });
        });

        const submitDataPay = {
            ipPaymentInsert: this.Paymentobj,
            ipModePaymentInsert: this.ModePaymentObj
        };
        const IsSubmit = {
            "submitDataPay": submitDataPay,
            "IsSubmitFlag": true,
            "BillBalanceAmount": this.patientDetailsFormGrp.get("balanceAmountController").value

        }
        console.log(IsSubmit);
        this.dialogRef.close(IsSubmit);
    }

    onClose1() {
        const IsSubmit = {
            "IsSubmitFlag": false,
            "BalAmt": this.netPayAmt
        }

        this.dialogRef.close(IsSubmit);
        this.advanceData = null;
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    keyPressCharater(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

}
export class PharPaymentInsert {
    PaymentId: number;
    BillNo: number;
    ReceiptNo: any;
    PaymentDate: Date;
    PaymentTime: any;
    CashPayAmount: number;
    ChequePayAmount: number;
    ChequeNo: any;
    BankName: any;
    ChequeDate: Date;
    CardPayAmount: number;
    CardNo: any;
    CardBankName: any;
    CardDate: Date;
    AdvanceUsedAmount: number;
    AdvanceId: any;
    RefundId: any;
    TransactionType: any;
    Remark: any;
    AddBy: any;
    IsCancelled: boolean;
    IsCancelledBy: any;
    IsCancelledDate: Date;
    OPD_IPD_Type: any;
    // CashCounterId: number;
    // IsSelfORCompany: number;
    // CompanyId: any;
    NEFTPayAmount: number;
    NEFTNo: any;
    NEFTBankMaster: any;
    NEFTDate: any;
    PayTMAmount: number;
    PayTMTranNo: any;
    PayTMDate: Date;
    PaidAmt: number;
    BalanceAmt: number;

    constructor(PharPaymentInsert) {
        this.PaymentId = PharPaymentInsert.PaymentId || 0;
        this.BillNo = PharPaymentInsert.BillNo || 0;
        this.ReceiptNo = PharPaymentInsert.ReceiptNo || '';
        this.PaymentDate = PharPaymentInsert.PaymentDate || '01/01/1900';
        this.PaymentTime = PharPaymentInsert.PaymentTime || '';
        this.CashPayAmount = PharPaymentInsert.CashPayAmount || 0;
        this.ChequePayAmount = PharPaymentInsert.ChequePayAmount || 0;
        this.ChequeNo = PharPaymentInsert.ChequeNo || '';

        this.BankName = PharPaymentInsert.BankName || '';
        this.ChequeDate = PharPaymentInsert.ChequeDate || '01/01/1900';
        this.CardPayAmount = PharPaymentInsert.CardPayAmount || 0;
        this.CardNo = PharPaymentInsert.CardNo || '';
        this.CardBankName = PharPaymentInsert.CardBankName || '';

        this.CardDate = PharPaymentInsert.CardDate || '01/01/1900';
        this.AdvanceUsedAmount = PharPaymentInsert.AdvanceUsedAmount || 0;
        this.AdvanceId = PharPaymentInsert.AdvanceId || 0;
        this.RefundId = PharPaymentInsert.RefundId || 0;
        this.TransactionType = PharPaymentInsert.TransactionType || 0;
        this.Remark = PharPaymentInsert.Remark || '';

        this.AddBy = PharPaymentInsert.AddBy || 0;
        this.IsCancelled = PharPaymentInsert.IsCancelled || 0;
        this.IsCancelledBy = PharPaymentInsert.IsCancelledBy || 0;
        this.IsCancelledDate = PharPaymentInsert.IsCancelledDate || '01/01/1900';

        this.OPD_IPD_Type = PharPaymentInsert.OPD_IPD_Type || 0;
        // this.IsSelfORCompany = PharPaymentInsert.IsSelfORCompany || 0;
        // this.CompanyId = PharPaymentInsert.CompanyId || 0;

        this.NEFTPayAmount = PharPaymentInsert.NEFTPayAmount || 0;
        this.NEFTNo = PharPaymentInsert.NEFTNo || '';
        this.NEFTBankMaster = PharPaymentInsert.NEFTBankMaster || '';
        this.NEFTDate = PharPaymentInsert.NEFTDate || '01/01/1900';

        this.PayTMAmount = PharPaymentInsert.PayTMAmount || 0;
        this.PayTMTranNo = PharPaymentInsert.PayTMTranNo || '';
        this.PayTMDate = PharPaymentInsert.PayTMDate || '01/01/1900';

        this.PaidAmt = PharPaymentInsert.PaidAmt || 0;
        this.BalanceAmt = PharPaymentInsert.BalanceAmt || 0;
    }

}
export class PaymentList {
    PaymentType: string;
    Amount: number;
    RefNo: string;
    BankName: string;
    RegDate: Date;
    Id: number;
    BankId: number;
}