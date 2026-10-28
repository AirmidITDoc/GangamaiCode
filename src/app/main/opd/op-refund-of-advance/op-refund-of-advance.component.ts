import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component'; 
import { OpRefundOfAdvanceService } from './op-refund-of-advance.service';
import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators, FormArray } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr'; 
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';

 @Component({
    selector: 'app-op-refund-of-advance',
    templateUrl: './op-refund-of-advance.component.html',
    styleUrls: ['./op-refund-of-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OpRefundOfAdvanceComponent implements OnInit {
    displayedColumns = [
        'Date',
        'AdvanceAmount',
        'UsedAmount',
        'BalanceAmount',
        'RefundAmt',
        'PreRefundAmt'
    ];

    screenFromString = 'Common-form';
    RefundOfAdvanceFormGroup: FormGroup;
    searchFormGroup: FormGroup
    dateTimeObj: any;
    registerObj: any;
    AdvanceId: any;
    UsedAmount: number = 0;
    chargeList: any = [];
    isLoadingStr: string = '';
    autocompleteModeCashcounter: string = "CashCounter";
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    RegId: any = 0;
    vPatientName: any;
    autocompleteModeCashCounter: string = "CashCounter";
    UserWsieCashcounterId: boolean = false;
    vUserID: any = 0;
    currency: any = '';
    OP_IP_Id: any = 0;

    dsrefundlist = new MatTableDataSource<OPRefundofAdvance>();

    constructor(
        public _OpRefundOfAdvanceService: OpRefundOfAdvanceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe, 
        // private dialogRef: MatDialogRef<OpRefundOfAdvanceComponent>,
        private accountService: AuthenticationService,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        private hospitalConfigservice: HospitalConfigService,
        public _ConfigService: ConfigService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: UntypedFormBuilder) { }

    ngOnInit(): void {
        this.vUserID = this.accountService.currentUserValue?.userId || 0;
        this.RefundOfAdvanceFormGroup = this.createRefAdvForm();
        this.RefundOfAdvanceFormGroup.markAllAsTouched();
        this.searchFormGroup = this.createSearchForm(); 
        
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue

        const [UserWsieCashcounterId, UserWsieCashcounterVal] = this._ConfigService.configParams.IsUserwiseCashCounterflow.split(":");
        this.UserWsieCashcounterId = UserWsieCashcounterId === "1";

        this.getuserwisecashcounterlist();
    }
    getSelectedObjReg(obj) {
        this.registerObj = obj;
        this.vPatientName = this.registerObj.firstName + ' ' + this.registerObj.lastName;
        this.RegId = this.registerObj?.regId
        this.OP_IP_Id = this.registerObj.visitId;
        this.getRefundofAdvanceListRegIdwise();
    }
    createSearchForm(): FormGroup {
        return this.formBuilder.group({
            RegId: [0]  // Initial value is 0
        });
    }
    createRefAdvForm() {
        return this.formBuilder.group({
            CashCounterID: [this.hospitalConfigservice.HospitalconfigParams?.OPD_Refund_Advance_CounterId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
            this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
            balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator, Validators.min(0)]],
            remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],

            // refund header
            refundHeader: this.formBuilder.group({
                refundDate: ['', [this._FormvalidationserviceService.validDateValidator()]],
                refundTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
                billId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdType: [0],
                opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator(),]],
                remark: [''],
                transactionId: [2],
                addedBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                UnitId: [this.accountService.currentUserValue.user.unitId],
                cashCounterId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            }),

            //Advance update
            advanceHeaderupdate: this.formBuilder.group({
                advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
            }),
            // ✅ Fixed: should be FormArray
            AdvDetailsnew: this.formBuilder.array([]),
            AdvDetailsUpdate: this.formBuilder.array([]),
        });
    }
    createAdvDetailsnew(item: any): FormGroup {
        return this.formBuilder.group({
            advDetailId: [item?.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
            this._FormvalidationserviceService.onlyNumberValidator()]],
            refundDate: [this.convertToISODate(item?.date),
            [this._FormvalidationserviceService.validDateValidator()]],
            refundTime: [item?.time,
            []],
            advRefundAmt: [item?.refundAmt || 0, [, this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    createAdvDetailsUpdate(item: any): FormGroup {
        return this.formBuilder.group({
            advanceDetailId: [item?.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
            this._FormvalidationserviceService.onlyNumberValidator()]],
            refundAmount: [item?.refundAmt || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            balanceAmount: [item?.balanceAmount || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }
    // Getters
    get advaDetailsArray(): FormArray {
        return this.RefundOfAdvanceFormGroup.get('AdvDetailsnew') as FormArray;
    }
    get AdvDetailsUpdateArray(): FormArray {
        return this.RefundOfAdvanceFormGroup.get('AdvDetailsUpdate') as FormArray;
    }
    onSave() {
        //Assigning value to run time values to from control
        this.RefundOfAdvanceFormGroup.get('refundHeader.refundDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.RefundOfAdvanceFormGroup.get('refundHeader.refundTime').setValue(this.dateTimeObj.time)
        this.RefundOfAdvanceFormGroup.get('refundHeader.opdIpdId').setValue(this.RegId)
        this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceUsedAmount').setValue(this.UsedAmount)
        this.RefundOfAdvanceFormGroup.get('refundHeader.advanceId').setValue(this.AdvanceId)
        this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceId').setValue(this.AdvanceId)
        this.RefundOfAdvanceFormGroup.get('refundHeader.remark').setValue(this.RefundOfAdvanceFormGroup.get('remark')?.value)
        this.RefundOfAdvanceFormGroup.get('refundHeader.refundAmount').setValue(this.RefundOfAdvanceFormGroup.get('refundAmount')?.value)
        this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.balanceAmount').setValue(this.RefundOfAdvanceFormGroup.get('balanceAmount')?.value || 0)
        this.RefundOfAdvanceFormGroup.get('refundHeader.cashCounterId').setValue(this.RefundOfAdvanceFormGroup.get('CashCounterID')?.value)

        //getting data from table to array
        if (this.RefundOfAdvanceFormGroup.valid) {
            this.advaDetailsArray.clear();
            this.AdvDetailsUpdateArray.clear();
            this.dsrefundlist.data.forEach(item => {
                this.advaDetailsArray.push(this.createAdvDetailsnew(item as OPRefundofAdvance));
                this.AdvDetailsUpdateArray.push(this.createAdvDetailsUpdate(item as OPRefundofAdvance));
            });
            //console.log('Saved Form Data:', this.RefundOfAdvanceFormGroup.value);

            const PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
            PatientHeaderObj['PatientName'] = this.registerObj?.patientName || '';
            PatientHeaderObj['RegNo'] = this.registerObj?.regNo || 0,
            PatientHeaderObj['DoctorName'] = this.registerObj?.doctorname || '';
            PatientHeaderObj['CompanyName'] = this.registerObj?.companyName || '';
            PatientHeaderObj['DepartmentName'] = this.registerObj?.departmentName || '';
            PatientHeaderObj['OPD_IPD_Id'] = this.registerObj?.ipdno || '';
            PatientHeaderObj['Age'] = this.registerObj?.ageYear || 0;
            PatientHeaderObj['NetPayAmount'] = Math.round(this.RefundOfAdvanceFormGroup.get('refundAmount').value) || 0;
            PatientHeaderObj['CashCounterId'] = this.RefundOfAdvanceFormGroup.get('CashCounterID')?.value || 0;
            PatientHeaderObj['CompanyId'] = this.registerObj?.companyId || 0;
            PatientHeaderObj['TransactionLabel'] = 'OP_REFUND_OF_ADVANCE';

            const dialogRef = this._matDialog.open(OpPaymentComponent,
                {
                    maxWidth: "80vw",
                    height: '750px',
                    width: '80%',
                    data: {
                        vPatientHeaderObj: PatientHeaderObj,
                        FromName: "OP-RefundOfAdvance",
                        advanceObj: PatientHeaderObj,
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result && result.IsSubmitFlag) {
                    const submitData = {
                        "refund": this.RefundOfAdvanceFormGroup.value.refundHeader,
                        "advanceHeaderupdate": this.RefundOfAdvanceFormGroup.value.advanceHeaderupdate,
                        "advDetailRefund": this.RefundOfAdvanceFormGroup.value.AdvDetailsnew,
                        "adveDetailupdate": this.RefundOfAdvanceFormGroup.value.AdvDetailsUpdate,
                        "payment": result.submitDataPay.ipPaymentInsert,
                        "tPayments": result.submitDataPay.ipModePaymentInsert
                    };
                    // console.log(submitData);
                    this._OpRefundOfAdvanceService.insertIPRefundOfAdvance(submitData).subscribe(response => {
                        this.viewgetRefundofAdvanceReportPdf(response);
                        // this.getWhatsappsRefundAdvance(response, this.vMobileNo);
                        this.onClose()
                    });
                }
            });
        } else {
            const invalidFields = [];
            if (this.RefundOfAdvanceFormGroup.invalid) {
                for (const controlName in this.RefundOfAdvanceFormGroup.controls) {
                    const control = this.RefundOfAdvanceFormGroup.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Refund of Advance Date : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`RefundOfAdvance From: ${controlName}`);
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
    onClose() {
        this.registerObj = '';
        this.vPatientName = '';
        this.RegId = 0;
        this.OP_IP_Id = 0;
        this.RefundOfAdvanceFormGroup.get('refundAmount').setValue(0);
        this.RefundOfAdvanceFormGroup.get('refundAmount').setValidators(Validators.required)
        this.RefundOfAdvanceFormGroup.get('CashCounterID').setValue(this.hospitalConfigservice.HospitalconfigParams.OPD_Refund_Advance_CounterId);
        this.RefundOfAdvanceFormGroup.get('remark').setValue('');
        this.RefundOfAdvanceFormGroup.get('balanceAmount').setValue(0);
        this.searchFormGroup.reset();
        this.dsrefundlist.data = [] 
        this._matDialog.closeAll(); 
    }
    viewgetRefundofAdvanceReportPdf(RefundId) {
        this.commonService.Onprint("RefundId", RefundId, "OpAdvanceRefundReceipt");
    }
    getRefundofAdvanceListRegIdwise() {
        var m_data = {
            "first": 0,
            "rows": 999,
            "sortField": "AdvanceId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "OPDIPDId", "fieldValue": String(this.RegId), "opType": "Equals" }],
            "Columns": [],
            "exportType": "JSON"
        }
        this._OpRefundOfAdvanceService.getRefundofAdvanceList(m_data).subscribe(response => {
            this.dsrefundlist.data = response.data
            this.chargeList = this.dsrefundlist.data
            this.dsrefundlist.sort = this.sort;
            this.dsrefundlist.paginator = this.paginator;
            this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : '';
            this.getRefundSum();
        });
    }
    getRefundSum() {
        const totalRefAmt = this.dsrefundlist.data.reduce((sum, { refundAmt }) => sum += +(refundAmt || 0), 0);
        const newBalAmt = this.dsrefundlist.data.filter(i => i.isCancelled == false)
        const totalBalAmt = newBalAmt.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0);

        this.RefundOfAdvanceFormGroup.patchValue({
            refundAmount: totalRefAmt,
            balanceAmount: totalBalAmt
        })
    }
    //Refund Amount calculation
    getCellCalculation(element, RefundAmt) {
        if (RefundAmt > 0 && RefundAmt <= element.netBallAmt) {
            element.balanceAmount = ((element.netBallAmt) - (RefundAmt));
        }
        else if (parseInt(RefundAmt) > parseInt(element.netBallAmt)) {
            this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.refundAmt = ''
            element.balanceAmount = element.netBallAmt;
        }
        else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null) {
            element.refundAmt = ''
            element.balanceAmount = element.netBallAmt;
        }
        this.AdvanceId = element.advanceId
        this.UsedAmount = element.usedAmount
        this.getRefundSum();
    }
    getValidationMessages() {
        return {
            serviceName: [
                { name: "required", Message: "Service Name is required" },
            ],
            cashCounterId: [
                { name: "required", Message: "First Name is required" },

                { name: "pattern", Message: "only Number allowed." }
            ],
            NewRefundAmount: [
                {
                    name: "pattern", Message: "only Number allowed."
                }
            ],
            BalanceAdvance: [{ name: "pattern", Message: "only Number allowed." }],
        }
    }
    getuserwisecashcounterlist() {
        if (!this.UserWsieCashcounterId) { return };
        const Type = 'OP_REFUND_OF_ADV';
        this._OpRefundOfAdvanceService.getuserwisecashcounterlist(this.vUserID, Type).subscribe((data) => {
            const cashcounterlist = data
            console.log('user wise cashcounter list: ', cashcounterlist);
            if (cashcounterlist) {
                const dvalue = cashcounterlist.filter((item) => item.isDefault == true)
                this.RefundOfAdvanceFormGroup.get('CashCounterID').setValue(dvalue[0]?.cashCounterId);
            }
        });
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
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    //Date convert string to Date 
    convertToISODate(dateStr: string): string {
        const [day, month, year] = dateStr.split('/');
        return `${year}-${month}-${day}`;
    }
}

export class OPRefundofAdvance {
    RefundDate: Date;
    RefundTime: any;
    BillId: number;
    advanceId: number;
    OPD_IPD_Type: number;
    OPD_IPD_ID: number;
    usedAmount: number;
    balanceAmount: number;
    RefundAmount: number;
    Remark: string;
    TransactionId: number;
    AddedBy: number;
    isCancelled: boolean;
    IsCancelledBy: number;
    IsCancelledDate: Date;
    RefundId: number;
    Date: any;
    refundAmount: any;
    advanceDetailID: any;
    refundAmt: any;
    advRefundAmt: any;

    constructor(OPRefundofAdvance) {
        this.RefundDate = OPRefundofAdvance.RefundDate || '0';
        this.RefundTime = OPRefundofAdvance.RefundTime || '0';
        this.BillId = OPRefundofAdvance.BillId || 0;
        this.advanceId = OPRefundofAdvance.advanceId || '0';
        this.OPD_IPD_Type = OPRefundofAdvance.OPD_IPD_Type || '0';
        this.OPD_IPD_ID = OPRefundofAdvance.OPD_IPD_ID || '0';
        this.usedAmount = OPRefundofAdvance.usedAmount || '0';
        this.balanceAmount = OPRefundofAdvance.balanceAmount || '0';
        this.RefundAmount = OPRefundofAdvance.RefundAmount || '0';
        this.Remark = OPRefundofAdvance.Remark || '';
        this.TransactionId = OPRefundofAdvance.TransactionId || 0;
        this.AddedBy = OPRefundofAdvance.AddedBy || 0;
        this.isCancelled = OPRefundofAdvance.isCancelled || false;
        this.IsCancelledBy = OPRefundofAdvance.IsCancelledBy || 0;
        this.IsCancelledDate = OPRefundofAdvance.IsCancelledDate || '';
        this.RefundId = OPRefundofAdvance.RefundId || '0';
        this.Date = OPRefundofAdvance.Date || '';
        this.refundAmount = OPRefundofAdvance.refundAmount || 0;
        this.advanceDetailID = OPRefundofAdvance.advanceDetailID || '0';
        this.refundAmt = OPRefundofAdvance.refundAmt || '0';
        this.advRefundAmt = OPRefundofAdvance.advRefundAmt || 0;
    }
}
