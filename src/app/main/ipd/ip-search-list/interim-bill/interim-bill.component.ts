import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { UserDetail } from 'app/main/administration/create-user/nuser/nuser.component';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { interval, Subscription, switchMap } from 'rxjs';
import Swal from 'sweetalert2';
import { ChargesList } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
    selector: 'app-interim-bill',
    templateUrl: './interim-bill.component.html',
    styleUrls: ['./interim-bill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class InterimBillComponent implements OnInit {
    displayedColumns = [
        'ChargesDate',
        'ServiceName',
        'Price',
        'Qty',
        'TotalAmt',
        'DiscPer',
        'DiscAmt',
        'NetAmount',
        'ChargeDoctorName',
        'ClassName',
    ];

    countdown: number = 180; // 3 minutes
    countdownColorClass = 'green';
    vUPINO: any;
    FinalNetAmt: any = 0;
    selectedAdvanceObj: any;
    ConShow: boolean = false;
    DiscountFlag: boolean = false;
    onlineflag: boolean = false;
    interimArray: any = [];
    currency: any = '';
    isLoading: string = '';
    InterimFooterForm: FormGroup;
    IPInterimBillForm: FormGroup;
    concessionId: any = 0;
    currentDate = new Date();
    autocompleteModeConcession: string = "Concession";
    autocompleteModeCashCounter: string = "CashCounter";

    dataSource = new MatTableDataSource<ChargesList>();
    public dsMpesaTransactionlist = new MatTableDataSource<ChargesList>();

    private _AppointmentlistService: any;

    constructor(
        public _IpSearchListService: IPSearchListService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<InterimBillComponent>,
        private formBuilder: UntypedFormBuilder,
        private commonService: PrintserviceService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public _ConfigService: ConfigService,
        private hospitalconfigservice: HospitalConfigService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public toastrService: ToastrService,

        @Inject(MAT_DIALOG_DATA) public data: any) { }
            SetCashbydefault: any = 0

    ngOnInit(): void {
        this.dataSource.data = [];
        this.InterimFooterForm = this.CreateFooterForm();
        this.IPInterimBillForm = this.createInterimbillForm();
        this.InterimFooterForm.markAllAsTouched();
        this.IPInterimBillForm.markAllAsTouched();
        if (this.data) {
            console.log(this.data);
            this.dataSource.data = this.data.Obj;
            this.interimArray = this.dataSource.data
            this.selectedAdvanceObj = this.data.PatientHeaderObj;
            this.getNetAmtSum();
            this.IPInterimBillForm = this.createInterimbillForm();
        }
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue
        this.startCountdown();
        this.getAccessDetail();

       const [setCashBydefaultId, setCashBydefault] = this._ConfigService.configParams.OpBillSetCash.split(":");
        this.SetCashbydefault = setCashBydefaultId ;
          const paymentType =  +this.SetCashbydefault === 2 ? "PayOption"  :   "cashpay";
          this.InterimFooterForm.patchValue({paymode:paymentType})
      
    }
    CreateFooterForm(): FormGroup {
        return this.formBuilder.group({
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams.IPD_Billing_CounterId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            TotalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            discPer: [0, [Validators.min(0), Validators.max(100), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            concessionAmt: [0, [Validators.min(0), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            ConcessionId: [0, this._FormvalidationserviceService.onlyNumberValidator()],
            NetpayAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            paymode: ['cashpay'],
            UPINO: [''],
            Remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            mpesaMobile: ['', [Validators.minLength(10), Validators.maxLength(10)]],
        });
    }
    createInterimbillForm(): FormGroup {
        return this.formBuilder.group({
            //Addcharges
            addChargeM: this.formBuilder.group({
                chargesID: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //ipInterim bill header  
            ipBillling: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdipdid: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                regNo: [this.selectedAdvanceObj?.regNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
                patientName: [this.selectedAdvanceObj?.patientName, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                ipdno: [this.selectedAdvanceObj?.ipdno, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                ageYear: [Number(this.selectedAdvanceObj?.ageYear || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                ageMonth: [Number(this.selectedAdvanceObj?.ageMonth || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                ageDays: [Number(this.selectedAdvanceObj?.ageDay || 0), [this._FormvalidationserviceService.onlyNumberValidator()]],
                doctorId: [this.selectedAdvanceObj?.docNameId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                doctorName: [this.selectedAdvanceObj?.doctorname || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                wardId: [this.selectedAdvanceObj?.wardId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                bedId: [this.selectedAdvanceObj?.bedId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                patientType: [this.selectedAdvanceObj?.companyId ? true : false],
                companyName: [this.selectedAdvanceObj?.companyName || '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                companyAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                patientAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                concessionAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                paidAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
                opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId],
                totalAdvanceAmount: [this.selectedAdvanceObj?.AdvTotalAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                billTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                concessionReasonId: [this.concessionId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isSettled: false,
                isPrinted: true,
                isFree: true,
                companyId: [this.selectedAdvanceObj?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                tariffId: [this.selectedAdvanceObj?.tariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
                interimOrFinal: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                companyRefNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
                cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
                govtApprovedAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
            }),
            // ✅ Fixed: should be FormArray
            billingDetails: this.formBuilder.array([]),
            //Payment form
            payments: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                cashPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequePayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                chequeDate: ['1999-01-01'],
                cardPayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                cardDate: ['1999-01-01'],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                addBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1999-01-01'],
                neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([])
        });
    }
    createBillDetails(item: any): FormGroup {
        return this.formBuilder.group({
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [item?.chargesId, [, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: ['HOSP', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [item?.createdBy ?? this.accountService.currentUserValue.userId],
            transactionLabel: ['IP_INTERIM_BILL', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // Getters 
    get BillDetailsArray(): FormArray {
        return this.IPInterimBillForm.get('billingDetails') as FormArray;
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.IPInterimBillForm.get('tPayments') as FormArray;
    }
    getNetAmtSum() {
        this.FinalNetAmt = this.interimArray.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);
        const totalAmt = this.interimArray.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
        const discountAmount = this.interimArray.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);
        if (discountAmount > 0) {
            this.ConShow = true;
            this.DiscountFlag = true;
        }
        else {
            this.ConShow = false;
            this.DiscountFlag = false;
        }
        this.InterimFooterForm.patchValue({
            TotalAmt: totalAmt,
            NetpayAmount: this.FinalNetAmt,
            concessionAmt: discountAmount
        });
    }
    UserDicPerLimit: any = 0;
    getAccessDetail() {
        // debugger
        const SelectQuery = {
            "first": 0,
            "rows": 999,
            "sortField": "AccessValueId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "LoginId",
                    "fieldValue": String(this.accountService.currentUserValue.userId), //"30091",
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        this._IpSearchListService.getAccessDetailList(SelectQuery).subscribe(response => {
            const getUserAccesDetList = response.data as UserDetail[];
            console.log("get Access data:", getUserAccesDetList)

            const discountData = response.data.find(x => x.accessValueName === 'IsDiscount');
            console.log(discountData)
            if (discountData?.accessValue) {
                this.UserDicPerLimit = discountData?.accessInputValue || 0
            }
        });
    }
    //Calculate Disc Amt
    calculateDiscPer() {

        if (this.UserDicPerLimit > 0) {
            const discper = this.InterimFooterForm.get("discPer")?.value;
            if (+discper > +this.UserDicPerLimit) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Discount Limit Exceeded',
                    text: `Maximum allowed discount is ${this.UserDicPerLimit}%`,
                    confirmButtonColor: '#d33'
                });
                this.InterimFooterForm.get("discPer").setValue(this.UserDicPerLimit);
            }
        }

        const perControl = this.InterimFooterForm.get("discPer");
        let finalNetAmt = this.FinalNetAmt
        if (!perControl.valid || perControl.value == 0 || perControl.value == '') {
            this.ConShow = false
            this.InterimFooterForm.patchValue({
                discPer: '',
                concessionAmt: '',
                NetpayAmount: Math.round(finalNetAmt),
            }, { emitEvent: false });
            this.toastr.warning("Enter Discount % between 0-100");
            return;
        }
        const percentage = perControl.value;
        const totalAmount = this.InterimFooterForm.get("TotalAmt").value;
        const discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
        finalNetAmt = parseFloat((totalAmount - discountAmount).toFixed(2));
        this.ConShow = true;

        this.InterimFooterForm.patchValue({
            NetpayAmount: finalNetAmt,
            concessionAmt: discountAmount
        }, { emitEvent: false });
    }
    //Calculate Disc Per
    calculateDiscamt() {
        const discountAmount = this.InterimFooterForm.get("concessionAmt").value;
        const totalAmount = this.InterimFooterForm.get("TotalAmt").value;
        const finalNetAmt = this.FinalNetAmt
        if (discountAmount < 0 || discountAmount == 0 || discountAmount == '' || parseFloat(discountAmount) > parseFloat(totalAmount)) {
            this.ConShow = false;
            this.InterimFooterForm.patchValue({
                discPer: '',
                concessionAmt: '',
                NetpayAmount: Math.round(finalNetAmt),
            }, { emitEvent: false });
            this.toastr.warning("Discount must be between 0 and the total amount.");
            return;
        }

        const percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
        const netAmount = Number((totalAmount - discountAmount).toFixed(2));
        this.ConShow = true;
        this.InterimFooterForm.patchValue({
            discPer: percent,
            NetpayAmount: netAmount
        }, { emitEvent: false }); // Prevent infinite loop 
    }
    onChangeReg(event) {
        if (event.value == 'onlinepay') {
            this.onlineflag = true;
            this.InterimFooterForm.get('UPINO').setValidators([Validators.required]);
            this.InterimFooterForm.get('UPINO').enable();
        } else {
            this.onlineflag = false;
            this.InterimFooterForm.get('UPINO').reset();
            this.InterimFooterForm.get('UPINO').clearValidators();
            this.InterimFooterForm.get('UPINO').updateValueAndValidity();
        }
    }
    onSave() {
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(new Date(), 'shortTime');
        const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime

        debugger
        const formValue = this.InterimFooterForm.value
        if (formValue.discPer > 0 || formValue.concessionAmt > 0) {
            if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        this.IPInterimBillForm.get('ipBillling.totalAmt')?.setValue(formValue?.TotalAmt ?? 0)
        this.IPInterimBillForm.get('ipBillling.concessionAmt')?.setValue(formValue?.concessionAmt || 0)
        this.IPInterimBillForm.get('ipBillling.netPayableAmt')?.setValue(formValue?.NetpayAmount ?? 0)
        this.IPInterimBillForm.get('ipBillling.paidAmt')?.setValue(formValue?.NetpayAmount ?? 0)
        this.IPInterimBillForm.get('ipBillling.billDate').setValue(formattedDate)
        this.IPInterimBillForm.get('ipBillling.billTime').setValue(FormattedDateTime)
        this.IPInterimBillForm.get('ipBillling.concessionReasonId')?.setValue(formValue?.ConcessionId || 0)
        this.IPInterimBillForm.get('ipBillling.discComments')?.setValue(formValue?.Remark || '')
        this.IPInterimBillForm.get('ipBillling.cashCounterId')?.setValue(formValue?.CashCounterID ?? 0)


        if (this.IPInterimBillForm.valid) {
            this.BillDetailsArray.clear();
            this.dataSource.data.forEach(item => {
                this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
            });
            const [InterimA5_Print, InterimA5_Value] = this._ConfigService.configParams.InterimBillA5Print.split(":");
            if (this.InterimFooterForm.get('paymode').value == 'cashpay') {
                this.IPInterimBillForm.get('payments.cashPayAmount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
                this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
                this.IPInterimBillForm.get('payments.paymentTime').setValue(FormattedDateTime)
                const ModePaymentObj = [];
                ModePaymentObj.push({
                    paymentDate: formattedDate,
                    paymentTime: formattedTime,
                    payAmount: formValue?.NetpayAmount ?? 0,
                    tranNo: "",
                    bankName: "",
                    validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                    comments: "",
                    payMode: "CASH",
                    onlineTranNo: "0",
                    onlineTranResponse: "0",
                    companyId: this.selectedAdvanceObj?.CompanyId ?? 0,
                    cashCounterId: formValue?.CashCounterID || 0,
                    transactionType: 0,
                    isSelfOrcompany: this.selectedAdvanceObj?.CompanyId ? 1 : 0,
                    createdBy: this.accountService.currentUserValue?.userId ?? 0
                });
                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                });

                console.log("form values", this.IPInterimBillForm.value)
                this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
                    if (InterimA5_Print != 1) {
                        this.viewgetInterimBillReportPdf(response);
                    } else {
                        this.viewgetInterim_A5ReportPdf(response)
                    }

                    this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
                    this.onClose()
                });
            }
            else if (this.InterimFooterForm.get('paymode').value == 'onlinepay') {
                if (!(this.InterimFooterForm.get('UPINO')?.value)) {
                    this.toastr.warning('Please enter upi no', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                this.IPInterimBillForm.get('payments.payTmamount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
                this.IPInterimBillForm.get('payments.payTmtranNo').setValue(this.InterimFooterForm.get('UPINO')?.value || 0)
                this.IPInterimBillForm.get('payments.payTmdate').setValue(formattedDate)
                this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
                this.IPInterimBillForm.get('payments.paymentTime').setValue(FormattedDateTime)

                const ModePaymentObj = [];
                ModePaymentObj.push({
                    paymentDate: formattedDate,
                    paymentTime: formattedTime,
                    payAmount: formValue?.NetpayAmount ?? 0,
                    tranNo: this.InterimFooterForm.get('UPINO')?.value || 0,
                    bankName: "",
                    validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                    comments: "",
                    payMode: "UPI",
                    onlineTranNo: "0",
                    onlineTranResponse: "0",
                    companyId: this.selectedAdvanceObj?.CompanyId ?? 0,
                    cashCounterId: formValue?.CashCounterID || 0,
                    transactionType: 0,
                    isSelfOrcompany: this.selectedAdvanceObj?.CompanyId ? 1 : 0,
                    createdBy: this.accountService.currentUserValue?.userId ?? 0
                });
                this.ModeOfPaymentsArray.clear();
                ModePaymentObj.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                });

                console.log("form values", this.IPInterimBillForm.value)
                this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
                    this.viewgetInterimBillReportPdf(response);
                    this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
                    this.onClose()
                });
            }
            else if (this.InterimFooterForm.get('paymode').value == 'PayOption') {
                const PatientHeaderObj = {};
                PatientHeaderObj['Date'] = formattedDate
                PatientHeaderObj['PatientName'] = this.selectedAdvanceObj?.patientName || '';
                PatientHeaderObj['RegNo'] = this.selectedAdvanceObj?.regNo || 0;
                PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj?.doctorname || '';
                PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj?.companyName || '';
                PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj?.departmentName || '';
                PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj?.admissionId || '';
                PatientHeaderObj['Age'] = this.selectedAdvanceObj?.ageYear || '';
                PatientHeaderObj['NetPayAmount'] = Math.round(this.InterimFooterForm.get('NetpayAmount')?.value) || 0,
                    PatientHeaderObj['TransactionLabel'] = 'IP_INTERIM_BILL',
                    PatientHeaderObj['CashCounterId'] = this.InterimFooterForm.get('CashCounterID').value || 0
                const dialogRef = this._matDialog.open(OpPaymentComponent,
                    {
                        maxWidth: "80vw",
                        height: '750px',
                        width: '80%',
                        data: {
                            vPatientHeaderObj: PatientHeaderObj,
                            FromName: "IP-IntrimBIll",
                            advanceObj: PatientHeaderObj,
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    console.log(result.submitDataPay.ipPaymentInsert)
                    this.IPInterimBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)
                    this.ModeOfPaymentsArray.clear();
                    result.submitDataPay.ipModePaymentInsert.forEach(item => {
                        this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                    });

                    console.log("form values", this.IPInterimBillForm.value)
                    this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
                        this.viewgetInterimBillReportPdf(response);
                        this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
                        this.onClose()
                    });
                });
            }
            else if (this.InterimFooterForm.get('paymode')?.value === 'Mpesa') {
                this.openWaitingScreen();
            }
        } else {
            const invalidFields = [];
            if (this.IPInterimBillForm.invalid) {
                for (const controlName in this.IPInterimBillForm.controls) {
                    const control = this.IPInterimBillForm.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`IP Interim Date : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`IP InterimBill From: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }

    onClose() {
        this.dataSource.data = [];
        this.interimArray = [];
        this.InterimFooterForm.reset({
            NetpayAmount: [0],
            ConcessionId: [0],
            Remark: [''],
            TotalAmt: [0],
            CashCounterID: [''],
            discPer: [0],
            concessionAmt: [0],
            paymode: ['cashpay'],
            UPINO: ['']
        })
        this.dialogRef.close();
    }
    startCountdown() {
        const interval = setInterval(() => {
            this.countdown--;
            // Update color dynamically
            if (this.countdown > 120) {
                this.countdownColorClass = 'green';
            } else if (this.countdown > 60) {
                this.countdownColorClass = 'orange';
            } else {
                this.countdownColorClass = 'red';
            }
            if (this.countdown <= 0) {
                clearInterval(interval);
                this.isWaiting = false;
                this.stopPolling();             // Stop polling
                this.statusMessage = '❌ Payment not completed. User did not approve.';
            }
        }, 1000);
    }
    isWaiting = false;
    mpesaResponse: any;
    statusMessage: any;
    pollingSub?: Subscription;
    mPesa_ReceiptNo: any = '0';
    openWaitingScreen() {
        debugger
        this.countdown = 180;  // reset timer
        this.statusMessage = 'Waiting for customer approval...';
        this._IpSearchListService.postpayment(this.InterimFooterForm.get("NetpayAmount")?.value, this.InterimFooterForm.get('mpesaMobile')?.value,
            this.selectedAdvanceObj?.admissionId).subscribe(response => {
                this.mpesaResponse = response;
                console.log(this.mpesaResponse)
                // Build message AFTER response arrives
                this.statusMessage = '' + response.responseDescription + '\n' +
                    'CheckoutRequestId  : ' + response.checkoutRequestID + '\n' +
                    'MerchantRequestId  : ' + response.merchantRequestID;
                this.isWaiting = true;
                this.startCountdown();
                this.startPolling();
            });
    }
    startPolling() {
        this.pollingSub = interval(10000)
            .pipe(switchMap(() => this._AppointmentlistService.checkStatus(this.mpesaResponse)))
            .subscribe((status: any) => this.handleStatus(status));
    }
    stopPolling() {
        if (this.pollingSub) {
            this.pollingSub.unsubscribe();
            this.pollingSub = null;
        }
    }

    checkStatus() {
        if (this.mpesaResponse) {
            this._AppointmentlistService.checkStatus(this.mpesaResponse)
                .subscribe((status: any) => this.handleStatus(status));
        }
    }
    handleStatus(status: any) {
        console.log(status)
        debugger
        const isSuccess = status?.resultCode == 0 || status?.resultCode == "0" || status?.resultCode == "000000";
        const receipt = status?.mpesaReceiptNumber;
        if (isSuccess && receipt) {
            this.statusMessage =
                'Payment successful.' + this.mpesaResponse.responseDescription + '\n' +
                'CheckoutRequestId  : ' + this.mpesaResponse.checkoutRequestID + '\n' +
                'MerchantRequestId  : ' + this.mpesaResponse.merchantRequestID + '\n' +
                'Receipt No=' + receipt;
            this.mPesa_ReceiptNo = receipt;
            this.stopPolling();
            this.isWaiting = false;
            this.SavemPesaBill();
        }
        // else {
        //   if (status?.resultDesc) {
        //     this.statusMessage = status?.resultDesc;
        //     this.stopPolling();
        //     this.isWaiting = false;
        //   }
        // } 
    }
    // Mpesa Save  
    SavemPesaBill() {
        debugger
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(new Date(), 'shortTime');
        const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime
        const mPesaMerchant_CheckoutRequest_Id = this.mpesaResponse.checkoutRequestID + "|" + this.mpesaResponse.merchantRequestID;
        const formValue = this.IPInterimBillForm.value

        this.IPInterimBillForm.get('payments.payTmamount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
        this.IPInterimBillForm.get('payments.payTmtranNo').setValue(this.mPesa_ReceiptNo)
        this.IPInterimBillForm.get('payments.payTmdate').setValue(formattedDate)
        this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
        this.IPInterimBillForm.get('payments.paymentTime').setValue(FormattedDateTime)

        const ModePaymentObj = [];
        ModePaymentObj.push({
            paymentDate: formattedDate,
            paymentTime: formattedTime,
            payAmount: formValue?.NetpayAmount ?? 0,
            tranNo: this.mPesa_ReceiptNo || 0,
            bankName: "",
            validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
            comments: "",
            payMode: "UPI",
            onlineTranNo: "0",
            onlineTranResponse: "0",
            companyId: this.selectedAdvanceObj?.CompanyId ?? 0,
            cashCounterId: formValue?.CashCounterID || 0,
            transactionType: 0,
            isSelfOrcompany: this.selectedAdvanceObj?.CompanyId ? 1 : 0,
            createdBy: this.accountService.currentUserValue?.userId ?? 0
        });
        this.ModeOfPaymentsArray.clear();
        ModePaymentObj.forEach(item => {
            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
        });

        console.log("form values", this.IPInterimBillForm.value)
        this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
            this.viewgetInterimBillReportPdf(response);
            this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
            this.onClose()
        });
    }
    // mpesa Save through history
    OnmPesaSave(row) {
        const mpesaAmt = row?.amount || 0;
        const netAmt = this.InterimFooterForm.get('NetpayAmount')?.value || 0;

        if (mpesaAmt !== netAmt) {
            Swal.fire({
                icon: 'warning',
                title: 'Payment Amount Mismatch',
                html: `
      <b>M-Pesa Amount:</b> <span style="color:#d33;">${mpesaAmt}</span><br>
      <b>Net Payable Amount:</b> <span style="color:#d33;">${netAmt}</span><br><br>
      Please check and retry.
    `,
                confirmButtonText: 'OK'
            });
            return;

        }
        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to save this Supplimentry bill?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const datePipe = new DatePipe('en-US');
                const formattedTime = datePipe.transform(new Date(), 'shortTime');
                const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
                const FormattedDateTime = formattedDate + ' ' + formattedTime
                debugger
                const formValue = this.InterimFooterForm.value
                if (formValue.discPer > 0 || formValue.concessionAmt > 0) {
                    if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
                        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }
                }
                this.IPInterimBillForm.get('ipBillling.totalAmt')?.setValue(formValue?.TotalAmt ?? 0)
                this.IPInterimBillForm.get('ipBillling.concessionAmt')?.setValue(formValue?.concessionAmt || 0)
                this.IPInterimBillForm.get('ipBillling.netPayableAmt')?.setValue(formValue?.NetpayAmount ?? 0)
                this.IPInterimBillForm.get('ipBillling.paidAmt')?.setValue(formValue?.NetpayAmount ?? 0)
                this.IPInterimBillForm.get('ipBillling.billDate').setValue(formattedDate)
                this.IPInterimBillForm.get('ipBillling.billTime').setValue(FormattedDateTime)
                this.IPInterimBillForm.get('ipBillling.concessionReasonId')?.setValue(formValue?.ConcessionId || 0)
                this.IPInterimBillForm.get('ipBillling.discComments')?.setValue(formValue?.Remark || '')
                this.IPInterimBillForm.get('ipBillling.cashCounterId')?.setValue(formValue?.CashCounterID ?? 0)

                if (this.IPInterimBillForm.valid) {
                    this.BillDetailsArray.clear();
                    this.dataSource.data.forEach(item => {
                        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
                    });
                    const [InterimA5_Print, InterimA5_Value] = this._ConfigService.configParams.InterimBillA5Print.split(":");

                    if (this.InterimFooterForm.get('paymode').value == 'Mpesa') {
                        this.mPesa_ReceiptNo = row?.mpesaReceiptNumber || 0
                        const [ThermalPrint, ThermalPrintValue] = this._ConfigService.configParams.ThermalPrint.split(":");
                        const mPesaMerchant_CheckoutRequest_Id = row?.checkoutRequestId + "|" + row?.merchantRequestId;

                        this.IPInterimBillForm.get('payments.payTmamount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
                        this.IPInterimBillForm.get('payments.payTmtranNo').setValue(this.mPesa_ReceiptNo)
                        this.IPInterimBillForm.get('payments.payTmdate').setValue(formattedDate)
                        this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
                        this.IPInterimBillForm.get('payments.paymentTime').setValue(FormattedDateTime)
                        this.IPInterimBillForm.get('payments.remark').setValue(mPesaMerchant_CheckoutRequest_Id);
                        this.IPInterimBillForm.get('payments.companyId')?.setValue(this.selectedAdvanceObj?.CompanyId || 0)

                        const ModePaymentObj = [];
                        ModePaymentObj.push({
                            paymentDate: formattedDate,
                            paymentTime: formattedTime,
                            payAmount: formValue?.NetpayAmount ?? 0,
                            tranNo: this.mPesa_ReceiptNo || 0,
                            bankName: "",
                            validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                            comments: "",
                            payMode: "MPESA",
                            onlineTranNo: this.mPesa_ReceiptNo || 0,
                            onlineTranResponse: mPesaMerchant_CheckoutRequest_Id || 0,
                            companyId: this.selectedAdvanceObj?.CompanyId ?? 0,
                            cashCounterId: formValue?.CashCounterID || 0,
                            transactionType: 0,
                            isSelfOrcompany: this.selectedAdvanceObj?.CompanyId ? 1 : 0,
                            createdBy: this.accountService.currentUserValue?.userId ?? 0
                        });
                        this.ModeOfPaymentsArray.clear();
                        ModePaymentObj.forEach(item => {
                            this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item as ChargesList));
                        });

                        console.log("form values", this.IPInterimBillForm.value)
                        this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
                            this.viewgetInterimBillReportPdf(response);
                            this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
                            this.onClose()
                        });
                    }
                }
                else {
                    const invalidFields = [];
                    if (this.IPInterimBillForm.invalid) {
                        for (const controlName in this.IPInterimBillForm.controls) {
                            const control = this.IPInterimBillForm.get(controlName);
                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`IP Supplimentry Bill Data : ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`IP Supplimentry From: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                            );
                        });
                        return
                    }
                }
            }
        });
    }
    selectChangeConcession(event) {
        this.concessionId = event.value
    }
    getWhatsappshareIPInterimBill(el, vmono) {
        if (vmono != '' && vmono != "0") {
            const m_data = {
                "insertWhatsappsmsInfo": {
                    "mobileNumber": vmono || 0,
                    "smsString": '',
                    "isSent": 0,
                    "smsType": 'IPInterim',
                    "smsFlag": 0,
                    "smsDate": this.currentDate,
                    "tranNo": el,
                    "PatientType": 2,//el.PatientType,
                    "templateId": 0,
                    "smSurl": "info@gmail.com",
                    "filePath": '',
                    "smsOutGoingID": 0
                }
            }
            // this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
            //   if (response) {
            //     this.toastr.success('IP Interim Bill Sent on WhatsApp Successfully.', 'Save !', {
            //       toastClass: 'tostr-tost custom-toast-success',
            //     });
            //   } else {
            //     this.toastr.error('API Error!', 'Error WhatsApp!', {
            //       toastClass: 'tostr-tost custom-toast-error',
            //     });
            //   }
            // });
        }
    }
    viewgetInterimBillReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPDInterimBill");
    }
    viewgetInterim_A5ReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPDInterimBillA5");
    }
    @ViewChild('MpesatranscationlistTable') MpesatranscationlistTable!: TemplateRef<any>;
    getMpesaTransactionlist(): void {
        debugger
        if (!this.dataSource.data.length) {
            this.toastrService.warning('Charges are not available in list, Please add Charges', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const formValue = this.InterimFooterForm.value
        if (formValue.discPer > 0 || formValue.concessionAmt > 0) {
            if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
                this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (!formValue?.mpesaMobile) {
            this.toastr.warning('Enter Mobile number', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this._matDialog.open(this.MpesatranscationlistTable, {
            width: '65vw',
            maxHeight: '60vh'
        })
        //424929  this.vOPIPId
        const Data = {
            "first": 0,
            "rows": 999,
            "sortField": "Id",
            "sortOrder": 0,
            "filters": [{ "fieldName": "Opdipdid", "fieldValue": String(this.selectedAdvanceObj?.admissionId || 0), "opType": "Equals" },
            { "fieldName": "PhoneNumber", "fieldValue": String(this.IPInterimBillForm.get('mpesaMobile')?.value || 0), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._AppointmentlistService.getmPesaTranscationlist(Data).subscribe((response) => {
            this.dsMpesaTransactionlist.data = response.data;
            console.log(this.dsMpesaTransactionlist.data)
        });
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
    public setFocus(nextElementId): void {
        document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
    }
    getValidationMessages() {
        return {
            TotalAmt: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            NetpayAmount: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            discPer: [
                { name: "pattern", Message: "only Number allowed." }
            ],
            concessionAmt: [{ name: "pattern", Message: "only Number allowed." }],
            Remark: [{ name: "pattern", Message: "only charactors allowed." }],
            concessionId: [],
            cashCounterId: [],
            mpesaMobile: [
                { name: "pattern", Message: "only Number allowed." },
                { name: "minLength", Message: "10 digit Number allowed." },
                { name: "maxLength", Message: "10 digit Number allowed." }
            ],
        }
    }
}
export class Bill {
    AdmissionID: any;
    billNo: number;
    OPD_IPD_ID: any;
    totalAmt: any;
    concessionAmt: number;
    netPayableAmt: number;
    paidAmt: number;
    balanceAmt: number;
    billDate: Date;
    opD_IPD_Type: any;
    addedBy: number;
    totalAdvanceAmount: any;
    billTime: Date;
    concessionReasonId: any;
    isSettled: boolean;
    isPrinted: boolean;
    isFree: boolean;
    companyId: any;
    tariffId: any;
    unitId: any;
    interimOrFinal: boolean;
    companyRefNo: string;
    concessionAuthorizationName: string;
    taxPer: any;
    taxAmount: any;
    discComments: string;
    CashCounterId: any;
    CompDiscAmt: any;
    PatientName: any;
    RegNo: any;
    DoctorName: any;
    IPDNo: any;
    constructor(Bill) {
        {
            this.AdmissionID = Bill.AdmissionID || 0;
            this.RegNo = Bill.RegNo || 0;
            this.IPDNo = Bill.IPDNo || 0;
            this.DoctorName = Bill.DoctorName || '';
            this.billNo = Bill.billNo || 0;
            this.OPD_IPD_ID = Bill.OPD_IPD_ID || 0;
            this.totalAmt = Bill.totalAmt || 0;
            this.concessionAmt = Bill.concessionAmt || 0;
            this.netPayableAmt = Bill.netPayableAmt || 0;
            this.paidAmt = Bill.paidAmt || 0;
            this.balanceAmt = Bill.balanceAmt || 0;
            this.billDate = Bill.billDate || '01/01/1900';
            this.opD_IPD_Type = Bill.opD_IPD_Type || 1;
            this.addedBy = Bill.addedBy || 0;
            this.totalAdvanceAmount = Bill.totalAdvanceAmount || 0;
            this.billTime = Bill.billTime || '01/01/1900';
            this.concessionReasonId = Bill.concessionReasonId || 0;
            this.isSettled = Bill.isSettled || true;
            this.isPrinted = Bill.isPrinted || true;
            this.isFree = Bill.isFree || true;
            this.companyId = Bill.companyId || 0;
            this.tariffId = Bill.tariffId || 0;
            this.unitId = Bill.unitId || 0;
            this.interimOrFinal = Bill.interimOrFinal || 0;
            this.companyRefNo = Bill.companyRefNo || 0;
            this.concessionAuthorizationName = Bill.concessionAuthorizationName || 0;
            this.taxPer = Bill.taxPer || 0;
            this.taxAmount = Bill.taxAmount || 0;
            this.discComments = Bill.discComments || '';
            this.CashCounterId = Bill.CashCounterId || 0;
            this.CompDiscAmt = Bill.CompDiscAmt || 0;
            this.PatientName = Bill.PatientName || '';
        }
    }
}


