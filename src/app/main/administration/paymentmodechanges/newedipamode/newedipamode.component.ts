import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { tPaymentChange } from '../paymentmodechanges.component';
import { PaymentmodechangesService } from '../paymentmodechanges.service';

@Component({
    selector: 'app-newedipamode',
    templateUrl: './newedipamode.component.html',
    styleUrls: ['./newedipamode.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewedipamodeComponent {

    paymentForm: FormGroup
    mainpaymentForm: FormGroup


    FromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    StoreId1 = 2// this._Paymentmodesevice.tpayFormGroup.get('StoreId').value || 0;
    isShowDetailTable: boolean = false;
    OpIpType: any = "0";
    salesNo: any = "0";
    regNo: any = "0";
    firstName: any = "%";
    LastName: any = "%";
    vbalanceAmt = 0
    autocompleteModePaymentMode: string = "CommonpaymentMode";


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
    public bankList: BankNames[] = [];
    filteredbankList: BankNames[] = [];
    selectedPaymnet1: string = '';


    public displayedColumn: string[] =
        [
            // 'paymentId',
            // 'unitId": 1,
            // 'opdipdType": 0,
            // 'isDisplay',
            'billNo',
            'receiptNo',
            'paymentDate',
            'payAmount',
            'payMode',
            'payMode1',
            'tranNo',
            // 'bankName1',
            'bankName',
            // 'validationDate',
            // 'advanceUsedAmount',
            // 'onlineTranNo',
            // 'onlineTranResponse',
            // 'companyId',
            // 'advanceId',
            // 'refundId',
            // 'cashCounterId',
            // 'transactionType',
            // 'isSelfORCompany',
            // 'tranMode',
            // 'comments',
            // 'buttons'
        ];

    salesForm: FormGroup;
    registerObj = new tPaymentChange({});
    vpaymentId: any = 0;
    vBillNo: any;
    opiptype = 1


    public dsPayList = new MatTableDataSource<tPaymentChange>();

    constructor(
        public _Paymentmodesevice: PaymentmodechangesService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe, private formBuilder: FormBuilder,
        public toastr: ToastrService,
        private _ActRoute: Router,
        public _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
        public _FormvalidationserviceService: FormvalidationserviceService, public _whatsppService: WhatsAppEmailService,
        private overlay: Overlay,
    ) { }

    ngOnInit(): void {
        this.mainpaymentForm = this.CreaeMainPayform()

        if (this.data) {
            this.registerObj = this.data.registerObj;

            console.log(this.data.registerObj)
            this.vpaymentId = this.registerObj.paymentId;
            this.vnetPayAmt = this.registerObj.payAmount;
            this.vBillNo = this.registerObj.billNo || 0;

        }

        this.getPaylist();
        this.getPaymodelist();
        this.getBanklist();

        this.tpaymentsArray.push(this.createpayFormarray());
    }

    CreaeMainPayform() {
        return this._formBuilder.group({
            tpaymentUpdate: this._formBuilder.array([])
        });
    }

    createpayFormarray(item: any = {}): FormGroup {
        console.log(item)
        return this._formBuilder.group({
            paymentId: [item.paymentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [this.vBillNo],
            payMode: [item.payMode1 || "CASH",
            [
                Validators.required, Validators.maxLength(50),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]
            ],
            tranNo: [item.tranNo],
            bankName: [item.bankName],

        });
    }

    get tpaymentsArray(): FormArray {
        return this.mainpaymentForm.get('tpaymentUpdate') as FormArray;
    }


    chargelist: any = [];
    getPaylist() {
        debugger
        const vdata = {
            "first": 0,
            "rows": 100,
            "sortField": "BillNo",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "BillNo", "fieldValue": this.vBillNo, "opType": OperatorComparer.Equals }
            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._Paymentmodesevice.getpaybBillBrowseList(vdata).subscribe(response => {
            this.chargelist = response.data
            console.log(this.chargelist)
            if (this.chargelist)
                this.dsPayList.data = this.chargelist

        })

    }


    // getCellCalculation(item: PaymentChange) {

    //   debugger
    //   if (item.payMode1 = 'CARD') {
    //     if ((item.tranNo == '' || item.tranNo == null || item.tranNo == undefined)) {
    //       this.toastr.warning('Please enter a Card No', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //     if ((item.bankName == '' || item.bankName == null || item.bankName == undefined)) {
    //       this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //   }
    //   if (item.payMode1 = 'CHEQUE') {
    //     if ((item.tranNo == '' || item.tranNo == null || item.tranNo == undefined)) {
    //       this.toastr.warning('Please enter a Card No', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //     if ((item.bankName == '' || item.bankName == null || item.bankName == undefined)) {
    //       this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //   }
    //   if (item.payMode1 = 'NET BANKING') {
    //     if ((item.tranNo == '' || item.tranNo == null || item.tranNo == undefined)) {
    //       this.toastr.warning('Please enter a Card No', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //     if ((item.bankName == '' || item.bankName == null || item.bankName == undefined)) {
    //       this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //   }
    //   if (item.payMode1 = 'UPI') {

    //     if ((item.onlineTranNo == '' || item.onlineTranNo == null || item.onlineTranNo == undefined)) {
    //       this.toastr.warning('Please enter a Card No', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //   }

    // }

    // Chktotal = 0
    // getsumdetail() {
    //   console.log(this.dsPayList.data)
    //   this.Chktotal = this.vcashpay + this.vneftpay + this.vcardpay + this.vchequepay + this.vpaytmpay
    //   console.log(this.Chktotal)

    //   if (this.Chktotal > this.vPaidAmount) {
    //     this.toastr.warning('Please Check Enter Amount > than PaidAmount', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //     return;
    //   }
    // }
    keyPressDigitsOnly(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }


    onTranNoInput(contact: any, value?: string) {
        debugger
        const tranNo = contact.tranNo

        if (tranNo.length === 0) {
            contact.tranNoValid = false;
            this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + contact.receiptNo + '  Amount:' + contact.payAmount, {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } else if (tranNo.length < 4) {
            contact.tranNoValid = false;
            this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + contact.receiptNo + '  Amount:' + contact.payAmount, {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } else {
            contact.tranNoValid = true;
            contact.tranNoError = null;
            // Further checks if needed (e.g., API validation)
        }
    }
    chkbank(contact, event) {
        console.log(contact)
        console.log(event)
    }

    onDisplayColumnChange(event: any, element: any) {
        if (!event.checked) {
            element.ReportColumnWidth = 0;
            element.ReportColumnAligment = "";
        }
    }
    setflag = false
    totalPayment = 0
    Save() {

        this.totalPayment = 0

        this.dsPayList.data.forEach(item => {
            debugger
            if (item.payMode1 == 'CARD' || item.payMode1 == 'CHEQUE' || item.payMode1 == 'NET BANKIN' || item.payMode1 == 'UPI') {
                if ((item.tranNo == '' || item.tranNo == null || item.tranNo == undefined)) {
                    this.toastr.warning('Please enter a Card No', 'Warning !--for ' + item.receiptNo + '  Amount:' + item.payAmount, {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    this.setflag = false
                    return;
                } else {
                    const tranNo = item.tranNo

                    if (tranNo.length === 0) {
                        this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + item.receiptNo + '  Amount:' + item.payAmount, {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    } else if (tranNo.length < 4) {
                        this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + item.receiptNo + '  Amount:' + item.payAmount, {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    } else {
                        this.setflag = false
                    }
                }
                if ((item.bankName == '' || item.bankName == null || item.bankName == undefined)) {
                    this.toastr.warning('Please Select Card Bank Name', 'Warning ! for ' + item.receiptNo + '  Amount:' + item.payAmount, {
                        toastClass: 'tostr-tost custom-toast-warning',
                    });
                    this.setflag = false
                    return;
                }
                else {
                    this.setflag = true
                }
            }

            this.totalPayment += item.payAmount

        });

        // if (this.totalPayment == this.vnetPayAmt) {

        console.log(this.mainpaymentForm.value);

        debugger
        this.tpaymentsArray.clear();
        this.dsPayList.data.forEach(item => {
            this.tpaymentsArray.push(this.createpayFormarray(item as tPaymentChange));
        });
        if (this.setflag == true || this.dsPayList.data.length == 1 && this.dsPayList.data[0].payMode == "CASH") {
            console.log(this.mainpaymentForm.value);
            this._Paymentmodesevice.TPaymentUpdate(this.vpaymentId, this.mainpaymentForm.value).subscribe(response => {
                this._matDialog.closeAll()
            });

        } else {
            this.toastr.warning('Please check Payment Data', 'Check !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
        // } else {
        //   this.toastr.error('Please check Balance Amount', 'Check !', {
        //     toastClass: 'tostr-tost custom-toast-success',
        //   });
        // }
    }

    getselectObjPayMode(obj) {
        console.log(obj)
        this.selectedPaymnet1 = obj.text
        //  this.onChangePaymentType();
    }

    getBanklist() {
        // this.selectedRow = contact;
        this.bankList = [];
        this.filteredbankList = [];
        const SelectQuery = {
            searchFields: [
            ],
            mode: 'BankNameList'
        };

        this._Paymentmodesevice.getBankNameList(SelectQuery).subscribe((res: any) => {

            this.bankList = Array.isArray(res) ? res : [];
            this.filteredbankList = [...this.bankList];
            console.log(this.filteredbankList)
        });
    }


    filterbankList(value: string) {
        if (!value) {
            this.filteredbankList = [...this.bankList];
            return;
        }

        const searchValue = value.toLowerCase();

        this.filteredbankList = this.bankList.filter(item =>
            String(item.BankName ?? '').toLowerCase().includes(searchValue) ||

            String(item.BankName ?? '').toLowerCase().includes(searchValue)
        );
    }

    onOptionSelectedBank(contact, event: any) {
        debugger
        if (contact) {
            contact.bankName = event.option.value;
        }
    }


    public payList: Paymode[] = [];
    filteredpayList: Paymode[] = [];
    selectedRow: any;
    getPaymodelist() {
        // this.selectedRow = contact;
        this.payList = [];
        this.filteredpayList = [];
        const SelectQuery = {
            searchFields: [

            ],
            mode: 'PaymentMode'
        };

        this._Paymentmodesevice.getpaymodeList(SelectQuery).subscribe((res: any) => {

            this.payList = Array.isArray(res) ? res : [];
            this.filteredpayList = [...this.payList];
            console.log(this.filteredpayList)
        });
    }

    filterList(value: string) {
        if (!value) {
            this.filteredpayList = [...this.payList];
            return;
        }

        const searchValue = value.toLowerCase();

        this.filteredpayList = this.payList.filter(item =>
            String(item.Value ?? '').toLowerCase().includes(searchValue) ||

            String(item.Value ?? '').toLowerCase().includes(searchValue)
        );
    }

    // onOptionSelected(contact, event: any) {
    //   debugger
    //   if (contact) {
    //     contact.payMode1 = event.option.value;
    //   }
    // }

    onOptionSelected(contact, event: any) {
        debugger
        if (event.option.value == 'CARD' || event.option.value == 'CHEQUE' || event.option.value == 'NET BANKING') {
            contact.vCardCheckStatus = true
        }
    }




    getValidationMessages() {
        return {
            bankName1: [
                { name: "required", Message: "bankName is required" }
            ],
            consultantDocId: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            CompanyId: [
                { name: "required", Message: "Company is required" }
            ],
            paymentType1: [
                { name: "required", Message: "Payment Mode is required" }
            ],
        };
    }
    onClose() {
        this._matDialog.closeAll()
    }

}


export class Paymode {
    ConstantId: any;
    Value: any;


    constructor(Paymode) {
        this.ConstantId = Paymode.ConstantId || 0;
        this.Value = Paymode.Value || '';

    }

}
export class BankNames {
    BankId: any;
    BankName: any;


    constructor(BankNames) {
        this.BankId = BankNames.BankId || 0;
        this.BankName = BankNames.BankName || '';

    }

}
