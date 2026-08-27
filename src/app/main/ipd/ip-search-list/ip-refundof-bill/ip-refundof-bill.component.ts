import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
    selector: 'app-ip-refundof-bill',
    templateUrl: './ip-refundof-bill.component.html',
    styleUrls: ['./ip-refundof-bill.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPRefundofBillComponent implements OnInit {
    displayedColumns1 = [
        'ServiceName',
        'Qty',
        'Price',
        'NetAmount',
        'ChargesDocName',
        'RefundAmount',
        'BalanceAmount',
        'PreviousRefundAmt'
    ];

    AdmissionId: any = '0'
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    AllColumns = [
        { heading: "Bil Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: 22 },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: 22 },
        { heading: "Bill Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: 22 },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: 22 },
    ]

    gridConfig: gridModel = {
        apiUrl: "RefundOfBill/IPBillListforRefundList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "AdmissionId", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
        ]
    }

    searchFormGroup: FormGroup;
    screenFromString = 'Common-form';
    vRefundOfBillFormGroup: FormGroup
    RefundOfBillFormFooter: FormGroup;
    isLoading: string = '';
    selectedAdvanceObj: any;

    dateTimeObj: any;
    BillNo: number;
    NetBillAmount: number = 0;
    TotalRefundAmount: any;
    RefundBalAmount: number = 0;
    BillDate: any;
    RefundAmount: number;
    PatientName: any = "";
    RegId: any = 0;
    registerObj: any
    Chargelist: any = [];
    currency: any = '';
    UserWsieCashcounterId:boolean = false;
    vUserID:any=0;
    autocompleteModeCashCounter: string = "CashCounter";

    dataSource2 = new MatTableDataSource<InsertRefundDetail>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _IpSearchListService: IPSearchListService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private accountService: AuthenticationService,
        private formBuilder: UntypedFormBuilder,
        public _WhatsAppEmailService: WhatsAppEmailService,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        private dialogRef: MatDialogRef<IPRefundofBillComponent>,
        private _formBuilder: UntypedFormBuilder,
        private hospitalconfigservice: HospitalConfigService,
        public _ConfigService: ConfigService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {

          this.vUserID = this.accountService.currentUserValue?.userId || 0;
        this.RefundOfBillFormFooter = this.refundFormFooter();
        this.RefundOfBillFormFooter.markAllAsTouched();

        this.vRefundOfBillFormGroup = this.vRefundBillFormInsert();
        this.vRefundOfBillFormGroup.markAllAsTouched();

        this.searchFormGroup = this.createSearchForm();
        if (this.data) {
            console.log(this.data)
            this.selectedAdvanceObj = this.data

            this.registerObj = this.data
            this.getData(this.selectedAdvanceObj.admissionId)
            this.vRefundOfBillFormGroup.get("refund.opdipdid")?.setValue(this.selectedAdvanceObj.admissionId)
        }
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue


        const [UserWsieCashcounterId, UserWsieCashcounterVal] = this._ConfigService.configParams.IsUserwiseCashCounterflow.split(":");
        this.UserWsieCashcounterId = UserWsieCashcounterId === "1";

        this.getuserwisecashcounterlist();
    }

    createSearchForm() {
        return this.formBuilder.group({
            RegId: [''],
        });
    }

    // 1. Main Form Group new method
    vRefundBillFormInsert(): FormGroup {
        return this.formBuilder.group({
            refund: this.formBuilder.group({
                refundNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                refundDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
                refundTime: [this.datePipe.transform(new Date(), 'shortTime')],
                billId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdipdtype: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdipdid: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                refundAmount: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), Validators.minLength(1),
                this._FormvalidationserviceService.notEmptyOrZeroValidator()
                ]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                transactionId: [2, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelled: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId],
                cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
                isApproval: false,
                approvedBy: 0,
                approvalDatetime: "1900-01-01",
                comment: ""
            }),

            tRefundDetails: this.formBuilder.array([]), // FormArray for details
            addCharges: this.formBuilder.array([]), // FormArray for charges
            payment: '',
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        });
    }

    // 2. FormArray Group for Refund Detail
    createRefundDetail(item: any = {}): FormGroup {
        return this.formBuilder.group({
            refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceId: [item.serviceId ?? 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            serviceAmount: [item.netAmount ?? 0],
            refundAmount: [item.refundAmount ||  0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
            doctorId: [item.doctorId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly(), Validators.maxLength(50)]],
            addBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            chargesId: [item.chargesId ?? 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    //  3. FormArray Group for Charges
    createAddCharge(item: any = {}): FormGroup {
        return this.formBuilder.group({
            chargesId: [item.chargesId ?? 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [item.refundAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [item?.unitId ?? this.accountService.currentUserValue.user.unitId],
            billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [item?.opdipdtype ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [item?.advanceUsedAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [item?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [item?.refundId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: [item?.tranMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [item?.createdBy ?? this.accountService.currentUserValue.userId],
            transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // 5.FormArray Getters
    get refundDetailsArray(): FormArray {
        return this.vRefundOfBillFormGroup.get('tRefundDetails') as FormArray;
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.vRefundOfBillFormGroup.get('tPayments') as FormArray;
    }
    get addChargesArray(): FormArray {
        return this.vRefundOfBillFormGroup.get('addCharges') as FormArray;
    }

    refundFormFooter(): FormGroup {
        return this._formBuilder.group({
            TotalRefundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            Remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly(), Validators.maxLength(200)]],
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams.IPD_Refund_of_Bill_CounterId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]]
        });
    }

    getSelectedRow(contact) {
        console.log(contact)
        this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(contact.billNo)
        if (contact.netPayableAmt == contact.refundAmount) {
            this.toastr.warning('Selected Bill already Refunded.!', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return
        }
        this.BillNo = contact.billNo;
        this.BillDate = this.datePipe.transform(contact.billDate, 'dd/MM/yyyy hh:mm a');
        this.NetBillAmount = contact.netPayableAmt;
        this.RefundAmount = contact.refundAmount;
        this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));


        const vdata = {
            "first": 0,
            "rows": 999,
            "sortField": "ChargesId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "BillNo",
                    "fieldValue": String(contact.billNo),
                    "opType": "Equals"
                }

            ],
            "Columns": [],
            "exportType": "JSON"
        }
        this._IpSearchListService.getRefundofBillServiceList(vdata).subscribe((response) => {
            this.dataSource2.data = response.data
            this.Chargelist = this.dataSource2.data
            console.log(this.dataSource2.data)
        })
    }

    //new code 
    getSelectedObj(obj) {
        console.log(obj)
        this.RegId = obj.value;
        if ((this.RegId ?? 0) > 0) {
            // console.log(this.data)
            setTimeout(() => {
                this._IpSearchListService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName

                    console.log(this.registerObj)
                });

            }, 500);
        }

    }

    gettablecalculation(row: InsertRefundDetail = null, refundAmount): void {
        if (refundAmount > 0 && refundAmount <= row.balAmt) {
            const balanceAmount = row.balAmt - refundAmount;
            row.balanceAmount = balanceAmount;
        } else if (refundAmount > row.balAmt) {
            this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            row.refundAmount = '';
            row.balanceAmount = row.balAmt;
        } else if (refundAmount == 0 || refundAmount === '' || refundAmount == null || refundAmount === undefined) {
            row.refundAmount = '';
            row.balanceAmount = row.balAmt;
        }
        this.calculateTotalAmount();
    }

    calculateTotalAmount(): void {
        const RefundAmount = this.dataSource2.data.reduce((sum, { refundAmount }) => sum + +(refundAmount || 0), 0);
        const RefBalAmount = this.dataSource2.data.reduce((sum, { balanceAmount }) => sum + +(balanceAmount || 0), 0);

        this.RefundOfBillFormFooter.patchValue({
            TotalRefundAmount: RefundAmount,
            RefundBalAmount: Math.round(RefBalAmount),
        }, { emitEvent: false });
    }

    onSave() {
        this.vRefundOfBillFormGroup.get("refund.refundAmount")?.setValue(parseInt(this.RefundOfBillFormFooter.get('TotalRefundAmount')?.value))
        this.vRefundOfBillFormGroup.get("refund.remark")?.setValue(this.RefundOfBillFormFooter.get('Remark')?.value)
        this.vRefundOfBillFormGroup.get("refund.refundDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1900-01-01')
        this.vRefundOfBillFormGroup.get("refund.refundTime")?.setValue(this.dateTimeObj.time)
        this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(this.BillNo || 0)
        this.vRefundOfBillFormGroup.get("refund.comment")?.setValue(this.RefundOfBillFormFooter.get('Remark')?.value || '')
        this.vRefundOfBillFormGroup.get("refund.cashCounterId")?.setValue(this.RefundOfBillFormFooter.get('CashCounterID')?.value || 0)

        if (!this.RefundOfBillFormFooter.invalid && !this.vRefundOfBillFormGroup.invalid) {

            // Refund table detail assign to array
            this.refundDetailsArray.clear();
            this.addChargesArray.clear();

            this.dataSource2.data.forEach(item => {
                this.refundDetailsArray.push(this.createRefundDetail(item));
                this.addChargesArray.push(this.createAddCharge(item));
            });

            const PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                PatientHeaderObj['PatientName'] = this.selectedAdvanceObj?.patientName || '';
            PatientHeaderObj['RegNo'] = this.selectedAdvanceObj?.regNo || 0,
                PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj?.doctorname || '';
            PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj?.companyName || '';
            PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj?.departmentName || '';
            PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj?.admissionId || 0;
            PatientHeaderObj['Age'] = this.selectedAdvanceObj?.ageYear || 0;
            PatientHeaderObj['TransactionLabel'] = 'IP_REFUND_OF_BILL';
            // PatientHeaderObj['billNo']= this.BillNo || 0,
            PatientHeaderObj['NetPayAmount'] = Math.round(this.RefundOfBillFormFooter.get('TotalRefundAmount').value) || 0
            PatientHeaderObj['CashCounterId'] = this.RefundOfBillFormFooter.get('CashCounterID').value || 0

            const dialogRef = this._matDialog.open(OpPaymentComponent,
                {
                    maxWidth: "80vw",
                    height: '750px',
                    width: '80%',
                    data: {
                        vPatientHeaderObj: PatientHeaderObj,
                        FromName: "IP-RefundOfBill",
                        advanceObj: PatientHeaderObj,
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.submitDataPay) {
                    this.vRefundOfBillFormGroup.get('payment')?.setValue(result.submitDataPay.ipPaymentInsert);
                    this.ModeOfPaymentsArray.clear();
                    result.submitDataPay.ipModePaymentInsert.forEach(item => {
                        this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                    });

                    this.ModeOfPaymentsArray.clear();
                    result.submitDataPay.ipModePaymentInsert.forEach(item => {
                        this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                    });
                    console.log(this.vRefundOfBillFormGroup.value);

                    this._IpSearchListService.InsertRefundOfBill(this.vRefundOfBillFormGroup.value).subscribe(response => {
                        this.viewgetRefundofBillReportPdf(response)
                        this.grid.bindGridData();
                        this.onClose();
                    });
                }
            });
        } else {
            const invalidFields: string[] = [];
            // checks nested error 
            if (this.vRefundOfBillFormGroup.invalid) {
                for (const controlName in this.vRefundOfBillFormGroup.controls) {
                    const control = this.vRefundOfBillFormGroup.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Table Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`MainForm: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }
        }
    }

    viewgetRefundofBillReportPdf(RefundId) {
        this.commonService.Onprint("RefundId", RefundId, "IpBillRefundReceipt");
    }

    onClose() {
        this.dialogRef.close();
        this.dataSource2.data = [];
        this.RefundOfBillFormFooter.reset();
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp)) {
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
    getData(AdmissionId) {
        this.gridConfig = {
            apiUrl: "RefundOfBill/IPBillListforRefundList",
            columnsList: this.AllColumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "AdmissionId", fieldValue: String(AdmissionId), opType: OperatorComparer.Equals }
            ]
        }
    }
        getuserwisecashcounterlist(){ 
        if(!this.UserWsieCashcounterId){ return};
        const  Type ='IP_REFUND_BILL';
        this._IpSearchListService.getuserwisecashcounterlist(this.vUserID,Type).subscribe((data)=>{
            const cashcounterlist = data
            console.log('user wise cashcounter list: ', cashcounterlist) ;
            if(cashcounterlist){
                const dvalue = cashcounterlist.filter((item)=> item.isDefault == true)
                this.RefundOfBillFormFooter.get('CashCounterID').setValue(dvalue[0]?.cashCounterId);
            } 
        });
    } 
}

export class InsertRefund {
    RefundId: number;
    RefundDate: any;
    RefundTime: any;
    BillId: number;
    AdvanceId: number;
    OPD_IPD_Type: number;
    OPD_IPD_ID: number;
    RefundAmount: any;
    Remark: string;
    TransactionId: number;
    AddedBy: number;
    IsCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: any;
    RefundNo: string;

    constructor(InsertRefundObj) {
        {
            this.RefundId = InsertRefundObj.RefundId || 0;
            this.RefundDate = InsertRefundObj.RefundDate || '';
            this.RefundTime = InsertRefundObj.RefundTime || '';
            this.BillId = InsertRefundObj.BillId || 0;
            this.AdvanceId = InsertRefundObj.AdvanceId || 0;
            this.OPD_IPD_Type = InsertRefundObj.OPD_IPD_Type || 0;
            this.OPD_IPD_ID = InsertRefundObj.OPD_IPD_ID || 0;
            this.RefundAmount = InsertRefundObj.RefundAmount || 0;
            this.Remark = InsertRefundObj.Remark || '';
            this.TransactionId = InsertRefundObj.TransactionId || 0;
            this.AddedBy = InsertRefundObj.AddedBy || 0;
            this.IsCancelled = InsertRefundObj.IsCancelled || false;
            this.IsCancelledBy = InsertRefundObj.IsCancelledBy || 0;
            this.IsCancelledDate = InsertRefundObj.IsCancelledDate || '';
            this.RefundNo = InsertRefundObj.RefundNo || '';
        }
    }
}

export class InsertRefundDetail {
    RefundID: any;
    serviceId: number;
    serviceName: any;
    netAmount: number;
    refundAmount: any;
    doctorId: number;
    Remark: string;
    AddBy: number;
    chargesId: number;
    chargesDate: Date;
    price: number;
    qty: number;
    totalAmt: number;
    NetAmount: number;
    chargesDocName: any;
    RefundAmt: any;
    balAmt: any;
    balanceAmount: any;

    constructor(InsertRefundDetailObj) {
        {
            this.RefundID = InsertRefundDetailObj.RefundID || 0;
            this.serviceId = InsertRefundDetailObj.serviceId || 0;
            this.serviceName = InsertRefundDetailObj.serviceName || 0;
            this.netAmount = InsertRefundDetailObj.netAmount || 0;
            this.refundAmount = InsertRefundDetailObj.refundAmount || 0;
            this.doctorId = InsertRefundDetailObj.doctorId || 0;
            this.Remark = InsertRefundDetailObj.Remark || '';
            this.AddBy = InsertRefundDetailObj.AddBy || 0;
            this.chargesId = InsertRefundDetailObj.chargesId || 0;
            this.chargesDate = InsertRefundDetailObj.chargesDate || '';
            this.price = InsertRefundDetailObj.price || 0;
            this.qty = InsertRefundDetailObj.qty || 0;
            this.totalAmt = InsertRefundDetailObj.totalAmt || 0;
            this.NetAmount = InsertRefundDetailObj.NetAmount || '';
            this.chargesDocName = InsertRefundDetailObj.chargesDocName || 0;
            this.RefundAmt = InsertRefundDetailObj.RefundAmt || 0;
            this.balAmt = InsertRefundDetailObj.balAmt || 0;
            this.balanceAmount = InsertRefundDetailObj.balanceAmount || 0;

        }
    }
}

export class AddchargesRefundAmount {
    chargesId: number;
    refundAmount: number;

    constructor(AddchargesRefundAmountObj) {
        {
            this.chargesId = AddchargesRefundAmountObj.chargesId || 0;
            this.refundAmount = AddchargesRefundAmountObj.refundAmount || 0;

        }
    }
}

export class DocShareGroupwise {
    refundId: number;

    constructor(DocShareGroupwiseObj) {
        {
            this.refundId = DocShareGroupwiseObj.refundId || 0;

        }
    }
}

export class BillMaster {

    BillNo: number;
    TotalAmt: number;
    ConcessionAmt: number;
    NetPayableAmt: number;
    PBillNo: number;
    RefundAmount: number;
    OPD_IPD_Type: number;
    OPD_IPD_ID: number;
    AdmissionID: number;
    ChargesID: number;
    BillDate: Date;
    PaidAmt: number;
    BalanceAmt: number;
    IsCancelled: number;
    RegID: number;
    RegId: number;

    constructor(BillMaster) {
        {
            this.BillNo = BillMaster.BillNo || 0;
            this.TotalAmt = BillMaster.TotalAmt || 0;
            this.ConcessionAmt = BillMaster.ConcessionAmt || 0;
            this.NetPayableAmt = BillMaster.NetPayableAmt || 0;
            this.PBillNo = BillMaster.PBillNo || 0;
            this.RefundAmount = BillMaster.RefundAmount || 0;
            this.OPD_IPD_Type = BillMaster.OPD_IPD_Type || 0;
            this.OPD_IPD_ID = BillMaster.OPD_IPD_ID || 0;
            this.AdmissionID = BillMaster.AdmissionID || 0;
            this.ChargesID = BillMaster.ChargesID || 0;
            this.BillDate = BillMaster.BillDate || 0;
            this.PaidAmt = BillMaster.PaidAmt || 0;
            this.BalanceAmt = BillMaster.BalanceAmt || 0;
            this.IsCancelled = BillMaster.IsCancelled || '';
            this.RegID = BillMaster.RegID || 0;
            this.RegId = BillMaster.RegId || 0;

        }
    }
}

export class RegRefundBillMaster {

    NetPayableAmt: number;
    RefundAmount: number;
    BillDate: any;
    BillNo: any;

    constructor(RegRefundBillMaster) {
        {

            this.NetPayableAmt = RegRefundBillMaster.NetPayableAmt || 0;
            this.RefundAmount = RegRefundBillMaster.RefundAmount || 0;
            this.BillDate = RegRefundBillMaster.BillDate || 0;
            this.BillNo = RegRefundBillMaster.BillNo || 0;

        }
    }
}

export class BillRefundMaster {

    RefundId: any;
    RefundDate: Date;
    RefundAmount: any;
    RefundNo: any;
    Remark: any;
    RefundTime: any;


    constructor(BillRefundMaster) {
        {
            this.RefundId = BillRefundMaster.RefundId || '';
            this.RefundDate = BillRefundMaster.RefundDate || '';
            this.RefundAmount = BillRefundMaster.RefundAmount || 0;
            this.RefundNo = BillRefundMaster.RefundNo || '';
            this.Remark = BillRefundMaster.Remark || '';
            this.RefundTime = BillRefundMaster.RefundTime || '';
        }
    }
}

