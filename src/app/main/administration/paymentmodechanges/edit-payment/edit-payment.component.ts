import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { PaymentmodechangesService } from '../paymentmodechanges.service'; 
import { DatePipe } from '@angular/common';
import { FormGroup, FormGroupName, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PaymentmodechangesforpharmacyService } from '../../paymentmodechangesfor-pharmacy/paymentmodechangesfor-pharmacy.service';
import { PaymentChange } from '../paymentmodechanges.component';
import { ConsoleLogger } from '@microsoft/signalr/dist/esm/Utils';
import { ConsentModule } from 'app/main/nursingstation/consent/consent.module';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
    selector: 'app-edit-payment',
    templateUrl: './edit-payment.component.html',
    styleUrls: ['./edit-payment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class EditPaymentComponent implements OnInit {

    filteredOptionsStorename: Observable<string[]>;
    filteredOptionsDoctorName: Observable<string[]>;
    isStoreSelected: boolean = false;
    isDoctorSelected: boolean = false;
    registerObj = new PaymentChange({});
    vpaymentId: any = 0;
    filteredOptionsBank1: Observable<string[]>;
    optionsBank1: any[] = [];
    isBank1elected: boolean = false;
    filteredOptionsBank2: Observable<string[]>;
    optionsBank2: any[] = [];
    isBank2elected: boolean = false;
    filteredOptionsBank3: Observable<string[]>;
    optionsBank3: any[] = [];
    isBank1elected3: boolean = false;
    filteredOptionsBank4: Observable<string[]>;
    optionsBank4: any[] = [];
    isBank1elected4: boolean = false;
    isBank3elected: boolean = false;
    BankNameList1: any = [];
    BankNameList2: any = [];
    BankNameList4: any = [];
    BankNameList5: any = [];
    chkcash: boolean = false;
    chkcheque: boolean = false;
    chkcard: boolean = false;
    chkneft: boolean = false;
    chkpaytm: boolean = false;

    isSaveDisabled: boolean = false;
    vbalanceAmt: any = 0;
    vnetPayAmt: any;
    vcashpay: any = 0;
    vcardpay: any = 0;
    vchequepay: any = 0;
    vneftpay: any = 0;
    vpaytmpay: any = 0;
    vPayTmtranNo: any;
    label: any;
    vPaidAmount: any;
    vCashCheckStatus: boolean = false;
    vCardCheckStatus: boolean = false;
    vCheckCheckStatus: boolean = false;
    vNFTPayCheckStatus: boolean = false;
    vPayTMCheckStatus: boolean = false;
    vCardNo: any;
    vchequeNo: any;
    vNeftno: any;
    vBillNo: any;
    opiptype = 1
    autocompleteModeBankName: string = "Bank";
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    constructor(
        public _Paymentmodesevice: PaymentmodechangesforpharmacyService,
        private accountService: AuthenticationService,
        public toastr: ToastrService, private _FormvalidationserviceService: FormvalidationserviceService,
        public dialogRef: MatDialogRef<EditPaymentComponent>,
        private _formBuilder: UntypedFormBuilder,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }
    payDate: any
    payTime: any
    newPharpayFormGroup: FormGroup
    ngOnInit(): void {
        this.newPharpayFormGroup = this.createpaymentInsertFormNew()
        if (this.data) {
            this.registerObj = this.data.registerObj;
            console.log("EditData:", this.registerObj)
            console.log(this.data)
            this.vpaymentId = this.registerObj.paymentId;
            this.vnetPayAmt = this.registerObj.paidAmount;
            this.vbalanceAmt = this.registerObj.paidAmount;
            this.vPaidAmount = this.registerObj.paidAmount;
            this.payDate = this.registerObj.payDate;
            this.payTime = this.registerObj.payTime;
            if (this.data.FromName == 'IP-PaymentModeChange')
                this.vBillNo = this.registerObj.billNo || 0;
            else
                this.vBillNo = this.registerObj.salesId || 0;

            this.opiptype = this.registerObj.opdipdtype || 1
        }

        if (this.registerObj.cashPayAmount > 0) {
            this.vCashCheckStatus = true;
            this.vcashpay = this.registerObj.cashPayAmount;
            this.getbalAmt()
        } if (this.registerObj.cardPayAmount > 0) {
            this.vCardCheckStatus = true;
            this.vcardpay = this.registerObj.cardPayAmount;
            this.getbalAmt()
        } if (this.registerObj.chequePayAmount > 0) {
            this.vCheckCheckStatus = true;
            this.vchequepay = this.registerObj.chequePayAmount;
            this.getbalAmt()
        } if (this.registerObj.neftPayAmount > 0) {
            this.vNFTPayCheckStatus = true;
            this.vneftpay = this.registerObj.neftPayAmount;
            this.getbalAmt()
        } if (this.registerObj.payTMAmount > 0) {
            this.vPayTMCheckStatus = true;
            this.vpaytmpay = this.registerObj.payTMAmount;
            this.getbalAmt()
        }
    }


    createpaymentInsertFormNew() {
        return this._formBuilder.group({
            PaymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            type: 1,
            cashPayAmount: ["0"],
            cardPayAmount: '',
            cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            cardBankName: '',
            chequePayAmount: ["0"],
            chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            bankName: '',
            neftpayAmount: '',
            neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            neftbankMaster: '',
            payTmamount: '',
            payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        })
    }
    balAmount: any = 0;
    totalAmountAdded: any = 0;
    TotalpaidAmt: any = 0;

    getbalAmt(inputElement?: any) {

        // if (!inputElement) return;
        // debugger
        const totalAmountAdded: any = ((this.vcashpay ? parseFloat(this.vcashpay) : 0)
            + (this.vcardpay ? parseFloat(this.vcardpay) : 0)
            + (this.vchequepay ? parseFloat(this.vchequepay) : 0)
            + (this.vneftpay ? parseFloat(this.vneftpay) : 0)
            + (this.vpaytmpay ? parseFloat(this.vpaytmpay) : 0));

        // this.vbalanceAmt = this.registerObj.paidAmount -totalAmountAdded;


        if (totalAmountAdded > this.vnetPayAmt) {
            Swal.fire('Amount is greater than Paid amount', 'warning!',)

            const controlName = inputElement.getAttribute('formControlName');

            if (inputElement) {
                console.log('Triggered from:', controlName);   // For debugging

                const form = this._Paymentmodesevice.paymentInsertform;


                if (controlName === 'CashPayAmount') {
                    this.vCashCheckStatus = false;
                    form.get(controlName)?.setValue(0);
                    this.vbalanceAmt = this.registerObj.paidAmount - this.vcashpay - this.vcardpay - this.vchequepay - this.vneftpay - this.vpaytmpay

                } else if (controlName === 'CardPayAmount') {
                    this.vCardCheckStatus = false;
                    form.get(controlName)?.setValue(0);
                    this.vbalanceAmt = this.registerObj.paidAmount - this.vcashpay - this.vcardpay - this.vchequepay - this.vneftpay - this.vpaytmpay

                } else if (controlName === 'ChequePayAmount') {
                    this.vCheckCheckStatus = false;
                    form.get(controlName)?.setValue(0);
                    this.vbalanceAmt = this.registerObj.paidAmount - this.vcashpay - this.vcardpay - this.vchequepay - this.vneftpay - this.vpaytmpay

                } else if (controlName === 'NeftpayAmount') {
                    this.vNFTPayCheckStatus = false;
                    form.get(controlName)?.setValue(0);
                    this.vbalanceAmt = this.registerObj.paidAmount - this.vcashpay - this.vcardpay - this.vchequepay - this.vneftpay - this.vpaytmpay

                } else if (controlName === 'PayTmamount') {
                    this.vPayTMCheckStatus = false;
                    form.get(controlName)?.setValue(0);
                    this.vbalanceAmt = this.registerObj.paidAmount - this.vcashpay - this.vcardpay - this.vchequepay - this.vneftpay - this.vpaytmpay

                }
            } else
                //  this.vbalanceAmt = this.vnetPayAmt;
                this.vbalanceAmt = this.registerObj.paidAmount - totalAmountAdded;



        }
        else {
            const balamt = (parseFloat(this.vnetPayAmt) - parseFloat(totalAmountAdded)).toFixed(2);
            this.vbalanceAmt = balamt;
            this.amount = parseInt(balamt)
        }

        // return this.vbalanceAmt;
    }

    onClose() {
        this.dialogRef.close();
    }

    CardBankdd: any;
    ChequeBankdd: any;
    NFTBankdd: any
    type = 1
    Save() {
        const datePipe = new DatePipe('en-US');
        // if (this._Paymentmodesevice.paymentInsertform.get('BalAmount').value == 0 ) {
        if (this.vbalanceAmt == 0) {

            if (this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').value > 0) {
                if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
                    this.toastr.warning('Please enterc a Card No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                if (!this._Paymentmodesevice.paymentInsertform.get('CardBankName').value) {
                    this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            if (this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').value > 0) {
                if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
                    this.toastr.warning('Please enter a Cheque No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                if (!this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').value) {
                    this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            if (this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').value > 0) {
                if ((this.vNeftno == '' || this.vNeftno == null || this.vNeftno == undefined)) {
                    this.toastr.warning('Please enter a NEFT No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
                if (!this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').value) {
                    this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            if (this._Paymentmodesevice.paymentInsertform.get('PayTmamount').value > 0) {
                if ((this.vPayTmtranNo == '' || this.vPayTmtranNo == null || this.vPayTmtranNo == undefined)) {
                    this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            let CardBank = this._Paymentmodesevice.paymentInsertform.get('CardBankName')?.value
                ? this.CardBankdd
                : 0;

            let ChequeBank = this._Paymentmodesevice.paymentInsertform.get('ChequeBankName')?.value
                ? this.ChequeBankdd
                : 0;

            let NFTBank = this._Paymentmodesevice.paymentInsertform.get('NEFTBankName')?.value
                ? this.NFTBankdd
                : 0;

            if (this.data.FromName == 'Pharma-PaymentModeChange')
                this.type = 1
            else
                this.type = 2

            this.newPharpayFormGroup.get('PaymentId').setValue(this.registerObj.paymentId || 0)
            this.newPharpayFormGroup.get('type').setValue(this.type)
            this.newPharpayFormGroup.get('cashPayAmount').setValue(this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').value || 0)
            this.newPharpayFormGroup.get('cardPayAmount').setValue(this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').value || 0)
            this.newPharpayFormGroup.get('cardNo').setValue(this._Paymentmodesevice.paymentInsertform.get('CardNo').value || "")
            this.newPharpayFormGroup.get('cardBankName').setValue(CardBank || "")
            this.newPharpayFormGroup.get('chequePayAmount').setValue(this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').value || 0)
            this.newPharpayFormGroup.get('chequeNo').setValue(this._Paymentmodesevice.paymentInsertform.get('ChequeNo').value || "")
            this.newPharpayFormGroup.get('bankName').setValue(ChequeBank || '')
            this.newPharpayFormGroup.get('neftpayAmount').setValue(this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').value || 0)
            this.newPharpayFormGroup.get('neftno').setValue(this._Paymentmodesevice.paymentInsertform.get('Neftno').value || "")
            this.newPharpayFormGroup.get('neftbankMaster').setValue(NFTBank || "")
            this.newPharpayFormGroup.get('payTmamount').setValue(this._Paymentmodesevice.paymentInsertform.get('PayTmamount').value || 0)
            this.newPharpayFormGroup.get('payTmtranNo').setValue(this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').value || "")

            console.log(this.newPharpayFormGroup.value);
            this._Paymentmodesevice.NewPaymentUpdate(this.newPharpayFormGroup.value).subscribe(response => {
                this.dialogRef.close();
                this.Reset();
            });
        } else if (this.vbalanceAmt > 0) {
            this.toastr.error('Please check Balance Amount', 'Check !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }

    }


    selectChangeBankName(obj: any) {
        console.log(obj)
        this.CardBankdd = obj.text
        this.ChequeBankdd = obj.text
        this.NFTBankdd = obj.text
    }
    getValidationMessages() {
        return {
            CardBankName: [],
            ChequeBankName: [],
            NEFTBankName: []
        }
    }
    Reset() {
        this._Paymentmodesevice.paymentInsertform.reset();
        const controlsToRemove = ['PaidAmount', 'BalAmount', 'IsPayTMpay', 'RefundBalAmount', 'NEFTBankName', 'IsNEFTpay', 'IsCardpay', 'IsChequepay', 'ChequeBankName', 'IsCashpay'];
        controlsToRemove.forEach(controlName => {
            const ctrl = this._Paymentmodesevice.paymentInsertform.get(controlName);
            if (ctrl) {
                ctrl.enable();
            }
        });

        this._Paymentmodesevice.paymentInsertform.get('IsCancelled').setValue(false)
        this._Paymentmodesevice.paymentInsertform.get('IsCancelledBy').setValue(0)
        this._Paymentmodesevice.paymentInsertform.get('IsCancelledDate').setValue('1900-01-01')


        this._Paymentmodesevice.paymentInsertform.get('Neftdate').setValue('1900-01-01')
        this._Paymentmodesevice.paymentInsertform.get('PayTmdate').setValue('1900-01-01')
        this._Paymentmodesevice.paymentInsertform.get('tdsamount').setValue(0)

        this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').setValue('0')
        this._Paymentmodesevice.paymentInsertform.get('ChequeNo').setValue('')
        this._Paymentmodesevice.paymentInsertform.get('BankName').setValue('')

        this._Paymentmodesevice.paymentInsertform.get('ChequeDate').setValue('1900-01-01')
        this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue('')
        this._Paymentmodesevice.paymentInsertform.get('NeftbankMaster').setValue('')

        this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').setValue('0')

        // this._Paymentmodesevice.paymentInsertform.get('BankName').setValue('')

    }
    amount: any = 0;

    getPaidAmount(event) {
        const amount = this.vbalanceAmt//this.registerObj.paidAmount
        // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
        //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
        if (event.checked == true) {
            this.vCashCheckStatus = true;
            if (this.amount > 0) {
                this.vcashpay = this.amount;
            } else {
                this.vcashpay = amount
            }

            if (!this.vcardpay) {
                this.vcardpay = 0
                this.vCardNo = 0
                this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue('');
            }
            if (!this.vchequepay) {
                this.vchequepay = 0
                this.vchequeNo = 0
                this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue('');
            }
            if (!this.vneftpay) {
                this.vneftpay = 0
                this.vNeftno = 0
                this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue('');
            }
            if (!this.vpaytmpay) {
                this.vpaytmpay = 0
                this.vPayTmtranNo = 0
            }
            this.getbalAmt()
        } else {
            this.vcashpay = 0;
            this.getbalAmt()
        }
    }
    getCardPayAmount(event) {
        const amount = this.vbalanceAmt//this.registerObj.paidAmount
        // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
        //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
        if (event.checked == true) {
            this.vCardCheckStatus = true;
            if (this.amount > 0) {
                this.vcardpay = this.amount;
            } else {
                this.vcardpay = amount;
            }

            if (!this.vcashpay) {
                this.vcashpay = 0
            }
            if (!this.vchequepay) {
                this.vchequepay = 0
                this.vchequeNo = 0
                this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue('');
            }
            if (!this.vneftpay) {
                this.vneftpay = 0
                this.vNeftno = 0
                this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue('');
            }
            if (!this.vpaytmpay) {
                this.vpaytmpay = 0
                this.vPayTmtranNo = 0
            }
            this.getbalAmt()
            if (this.vcardpay > 0) {
                if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
                    this.toastr.warning('Please enter a Card No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            // this.CardNo.nativeElement.focus();

        } else {
            this.vcardpay = 0;
            this.getbalAmt()
        }

    }
    getCheckPayAmount(event) {
        const amount = this.vbalanceAmt//this.registerObj.paidAmount
        // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
        //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
        if (event.checked == true) {
            this.vCheckCheckStatus = true;
            if (this.amount > 0) {
                this.vchequepay = this.amount;
            } else {
                this.vchequepay = amount;
            }

            if (!this.vcashpay) {
                this.vcashpay = 0
            }
            if (!this.vcardpay) {
                this.vcardpay = 0
                this.vCardNo = 0
                this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue('');
            }
            if (!this.vneftpay) {
                this.vneftpay = 0
                this.vNeftno = 0
                this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue('');
            }
            if (!this.vpaytmpay) {
                this.vpaytmpay = 0
                this.vPayTmtranNo = 0
            }
            this.getbalAmt()
            if (this.vchequepay > 0) {
                if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
                    this.toastr.warning('Please enter a Cheque No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }

            // this.ChequeNo.nativeElement.focus(); 
        } else {
            this.vchequepay = 0;
            this.getbalAmt()
        }

    }
    getNFTPayAmount(event) {
        const amount = this.vbalanceAmt//this.registerObj.paidAmount
        // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
        //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
        if (event.checked == true) {
            this.vNFTPayCheckStatus = true;
            if (this.amount > 0) {
                this.vneftpay = this.amount;
            } else {
                this.vneftpay = amount;
            }
            if (!this.vcashpay) {
                this.vcashpay = 0
            }
            if (!this.vcardpay) {
                this.vcardpay = 0
                this.vCardNo = 0
                this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue('');
            }
            if (!this.vchequepay) {
                this.vchequepay = 0
                this.vchequeNo = 0
                this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue('');
            }
            if (!this.vpaytmpay) {
                this.vpaytmpay = 0
                this.vPayTmtranNo = 0
            }
            this.getbalAmt()
            if (this.vneftpay > 0) {
                if ((this.vNeftno == '' || this.vNeftno == null || this.vNeftno == undefined)) {
                    this.toastr.warning('Please enter a NEFT No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }

            // this.Neftno.nativeElement.focus(); 
        } else {
            this.vneftpay = 0;
            this.getbalAmt()
        }

    }
    getPayTMPayAmount(event) {
        const amount = this.vbalanceAmt//this.registerObj.paidAmount
        // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
        //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
        if (event.checked == true) {
            this.vPayTMCheckStatus = true;
            if (this.amount > 0) {
                this.vpaytmpay = this.amount;
            } else {
                this.vpaytmpay = amount;
            }
            if (!this.vcashpay) {
                this.vcashpay = 0
            }
            if (!this.vcardpay) {
                this.vcardpay = 0
                this.vCardNo = 0
                this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue('');
            }
            if (!this.vchequepay) {
                this.vchequepay = 0
                this.vchequeNo = 0
                this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue('');
            }
            if (!this.vneftpay) {
                this.vneftpay = 0
                this.vNeftno = 0
                this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue('');
            }
            this.getbalAmt()
            if (this.vpaytmpay > 0) {
                if ((this.vPayTmtranNo == '' || this.vPayTmtranNo == null || this.vPayTmtranNo == undefined)) {
                    this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    return;
                }
            }
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').updateValueAndValidity();
            // this.PayTmtranNo.nativeElement.focus();

        } else {
            this.vpaytmpay = 0;
            this.getbalAmt()
        }

    }
    @ViewChild('cashpay') cashpay: ElementRef;
    @ViewChild('CardPayAmount') CardPayAmount: ElementRef;
    @ViewChild('CardNo') CardNo: ElementRef;
    @ViewChild('CardBankName') CardBankName: ElementRef;
    @ViewChild('ChequeNo') ChequeNo: ElementRef;
    @ViewChild('chequebank') chequebank: ElementRef;
    @ViewChild('Neftno') Neftno: ElementRef;
    @ViewChild('nftbank') nftbank: ElementRef;
    @ViewChild('PayTmtranNo') PayTmtranNo: ElementRef;
    onEnterCashpay(event) {
        if (event.which === 13) {
            this.CardPayAmount.nativeElement.focus();
        }
    }
    onEnterCardPayAmount(event) {
        if (event.which === 13) {
            this.CardNo.nativeElement.focus();
        }
    }
    onEnterCardNo(event) {
        if (event.which === 13) {
            this.CardBankName.nativeElement.focus();
        }
    }
    onEnterCheckPayAmt(event) {
        if (event.which === 13) {
            this.ChequeNo.nativeElement.focus();
        }
    }
    onEnterChequeNo(event) {
        if (event.which === 13) {
            this.chequebank.nativeElement.focus();
        }
    }
    onEnterNFTPayAmt(event) {
        if (event.which === 13) {
            this.Neftno.nativeElement.focus();
        }
    }
    onEnterNeftno(event) {
        if (event.which === 13) {
            this.nftbank.nativeElement.focus();
        }
    }
    onEnterPayTMamt(event) {
        if (event.which === 13) {
            this.PayTmtranNo.nativeElement.focus();
        }
    }

    chkcashpay(event) {
        if (event.checked == true) {
            this.chkcash = true;
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').enable();
        } else {
            this.chkcash = false;
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').updateValueAndValidity();

        }

    }

    chkcardpay(event) {
        if (event.checked == true) {
            this.chkcard = true;
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').enable();

            this._Paymentmodesevice.paymentInsertform.get('CardNo').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardNo').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('CardNo').enable();

            this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').enable();

        } else {
            this.chkcard = false;
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('CardNo').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardNo').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('CardNo').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('CardBankName').updateValueAndValidity();
        }


    }

    chkchequepay(event) {
        if (event.checked == true) {
            this.chkcheque = true;
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').enable();


            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').enable();


            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').enable();

        } else {
            this.chkcheque = false;
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('ChequeNo').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').updateValueAndValidity();

        }

    }


    chkNeftpay(event) {
        if (event.checked == true) {
            this.chkneft = true;
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').enable();


            this._Paymentmodesevice.paymentInsertform.get('Neftno').reset();
            this._Paymentmodesevice.paymentInsertform.get('Neftno').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('Neftno').enable();


            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').enable();

        } else {
            this.chkneft = false;
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('Neftno').reset();
            this._Paymentmodesevice.paymentInsertform.get('Neftno').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('Neftno').updateValueAndValidity();

            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').updateValueAndValidity();

        }

    }

    chkpayTmpay(event) {
        if (event.checked == true) {
            this.chkpaytm = true
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').setValidators([Validators.required]);
            this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').enable();
        } else {
            this.chkpaytm = false
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').reset();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').clearValidators();
            this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').updateValueAndValidity();
        }
    }
}
