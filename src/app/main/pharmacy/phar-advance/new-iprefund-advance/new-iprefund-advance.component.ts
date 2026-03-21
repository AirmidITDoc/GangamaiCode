import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { PharAdvanceService } from '../phar-advance.service';


@Component({
    selector: 'app-new-iprefund-advance',
    templateUrl: './new-iprefund-advance.component.html',
    styleUrls: ['./new-iprefund-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewIPRefundAdvanceComponent implements OnInit {
    displayedColumns1 = [
        'Date',
        'RefundAmount'
    ];
    displayedColumns = [
        'Date',
        'AdvanceAmount',
        'UsedAmount',
        'BalanceAmount',
        'RefundAmount',
        'PrevRefundAmount'
    ];
    dateTimeObj: any;
    sIsLoading: string = '';
    screenFromString = 'Common-form';
    vPatienName: any;
    regObj: any;
    RefundFooterForm: FormGroup
    RefundSaveForm: FormGroup
    dsIpItemList = new MatTableDataSource<IpItemList>();
    advanceDetailId: any = 0;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    @ViewChild('Secondpaginator', { static: true }) public Secondpaginator: MatPaginator;

    constructor(
        public _PharAdvanceService: PharAdvanceService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public formBuilder: FormBuilder,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public dialogRef: MatDialogRef<NewIPRefundAdvanceComponent>,
        private commonService: PrintserviceService,
    ) { }

    ngOnInit(): void {
        this.RefundFooterForm = this._PharAdvanceService.NewRefundForm
        this.RefundFooterForm.markAllAsTouched()
        this.RefundSaveForm = this.IPAdRefundSaveFormInsert();
    }
    IPAdRefundSaveFormInsert(): FormGroup {
        return this.formBuilder.group({
            pharmacyRefund: this.formBuilder.group({
                refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refundDate: ['', [this._FormvalidationserviceService.validDateValidator()]],
                refundTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                billId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdId: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
                transactionId: 9,
                addBy: [this._loggedService.currentUserValue.userId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
                strId: [this._loggedService.currentUserValue.user.storeId, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
            }),
            phAdvanceHeader: this.formBuilder.group({
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
            }),
            phAdvRefundDetail: this.formBuilder.array([]),
            phAdvanceDetailBalAmount: this.formBuilder.array([]),
            pharPayment: '',
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        });
    }
    CreatePhAdvRefundDetail(item: any) {
        return this.formBuilder.group({
            advDetailId: [item?.advanceDetailId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundDate: this.datePipe.transform(new Date(), 'yyyy-MM-dd'),
            refundTime: this.datePipe.transform(new Date(), 'hh:mm'),
            advRefundAmt: [item?.refundAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
        })
    }
    CreatePhAdvRefundBalDet(item: any) {
        return this.formBuilder.group({
            advanceDetailId: [item?.advanceDetailId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            balanceAmount: [item?.balanceAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            refundAmount: [item?.refundAmount || 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]]
        })
    }
    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [item?.unitId ?? this._loggedService.currentUserValue.user.unitId],
            billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [item?.opdipdtype ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [item?.paymentDate ?? ''],
            paymentTime: [item?.paymentTime ?? ''],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [item?.validationDate ?? ''],
            advanceUsedAmount: [item?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
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
            tranMode: ['PHAR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [item?.createdBy ?? this._loggedService.currentUserValue.userId],
            transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    // Getters 
    get ModeOfPaymentsArray(): FormArray {
        return this.RefundSaveForm.get('tPayments') as FormArray;
    }
    get AdvRefundDetailsArray(): FormArray {
        return this.RefundSaveForm.get('phAdvRefundDetail') as FormArray;
    }
    get AdvRefundBalDetArray(): FormArray {
        return this.RefundSaveForm.get('phAdvanceDetailBalAmount') as FormArray;
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    getSelectedObjIP(obj) {
        if ((obj.regID ?? 0) > 0) {
            this.regObj = obj
            console.log("Admitted patient:", this.regObj)
            this.vPatienName = obj.firstName + " " + obj.middleName + " " + obj.lastName
            this.getRefundAdvanceList(obj);
        }
    }
    getRefundAdvanceList(obj) {
        const m_data = {
            "first": 0,
            "rows": 9999,
            "sortField": "AdmissionId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "AdmissionId", "fieldValue": String(obj.admissionID), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": []
        }
        this._PharAdvanceService.getRefundAdvanceList(m_data).subscribe(Visit => {
            this.dsIpItemList.data = Visit.data as IpItemList[];
            this.dsIpItemList.sort = this.sort;
            this.dsIpItemList.paginator = this.paginator;
            console.log(this.dsIpItemList.data)
        });
        this.getAdvaceSum(this.dsIpItemList.data)
    }
    AdvanceId: any = 0;
    getCellCalculation(element, RefundAmt) {
        debugger
        if (RefundAmt > 0 && RefundAmt <= element.netBalAmt) {
            element.balanceAmount = ((element.netBalAmt) - (RefundAmt));
        }
        else if (parseInt(RefundAmt) > parseInt(element.netBalAmt)) {
            this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.refundAmount = ''
            element.balanceAmount = element.netBalAmt;
        }
        else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null) {
            element.refundAmount = ''
            element.balanceAmount = element.netBalAmt;
        }
        this.AdvanceId = element?.advanceId || 0
        this.advanceDetailId = element?.advanceDetailId || 0
        this.getAdvaceSum(this.dsIpItemList.data)
    }
    getAdvaceSum(ItemList) {
        const Itemlist = ItemList
        const balAmt = Itemlist.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0).toFixed(2);
        const RefundAmt = Itemlist.reduce((sum, { refundAmount }) => sum += +(refundAmount || 0), 0).toFixed(2);

        this.RefundFooterForm.patchValue({
            ToatalRefunfdAmt: RefundAmt,
            BalanceAmount: balAmt,
        })
    }
    onSave() {
        const formattedTime = this.dateTimeObj.time;
        const formattedDate = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd');
        const FormattedDateTime = formattedDate + ' ' + formattedTime
        if (this.RefundFooterForm.invalid) {
            this.toastr.warning('Please check Refund Form is Invalid ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }

        const formValues = this.RefundFooterForm.value
        this.RefundSaveForm.get('pharmacyRefund.refundDate').setValue(formattedDate)
        this.RefundSaveForm.get('pharmacyRefund.refundTime').setValue(FormattedDateTime)
        this.RefundSaveForm.get('pharmacyRefund.opdIpdId').setValue(this.regObj?.admissionID)
        this.RefundSaveForm.get('pharmacyRefund.opdIpdId').setValue(this.regObj?.admissionID)
        this.RefundSaveForm.get('pharmacyRefund.refundAmount').setValue(formValues?.ToatalRefunfdAmt)
        this.RefundSaveForm.get('pharmacyRefund.advanceId').setValue(this.advanceDetailId)
        this.RefundSaveForm.get('phAdvanceHeader.advanceId').setValue(this.AdvanceId)
        this.RefundSaveForm.get('phAdvanceHeader.balanceAmount').setValue(formValues?.BalanceAmount)
        if (this.RefundSaveForm.valid) {

            this.AdvRefundDetailsArray.clear()
            this.AdvRefundBalDetArray.clear()
            this.dsIpItemList.data.forEach((element) => {
                this.AdvRefundDetailsArray.push(this.CreatePhAdvRefundDetail(element))
                this.AdvRefundBalDetArray.push(this.CreatePhAdvRefundBalDet(element))
            })
            const PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                PatientHeaderObj['PatientName'] = this.vPatienName || ';'
            PatientHeaderObj['RegNo'] = this.regObj?.regNo || 0;
            PatientHeaderObj['DoctorName'] = this.regObj?.doctorName || '';
            PatientHeaderObj['CompanyName'] = this.regObj?.companyName || '';
            PatientHeaderObj['OPD_IPD_Id'] = this.regObj?.ipdNo || '';
            PatientHeaderObj['Age'] = this.regObj?.age || 0;
            PatientHeaderObj['NetPayAmount'] = Math.round(this.RefundFooterForm.get('ToatalRefunfdAmt').value) || 0;
            PatientHeaderObj['CompanyId'] = this.regObj?.companyId || 0;
            PatientHeaderObj['TransactionLabel'] = 'REFUND_OF_ADVANCE';
            const dialogRef = this._matDialog.open(OpPaymentComponent,
                {
                    maxWidth: "80vw",
                    height: '650px',
                    width: '80%',
                    data: {
                        vPatientHeaderObj: PatientHeaderObj,
                        FromName: "IP-Pharma-Refund",
                        advanceObj: PatientHeaderObj,
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                console.log('==============================  Refung Amount ===========', result);
                this.RefundSaveForm.get('pharPayment').setValue(result.submitDataPay.ipPaymentInsert)
                this.ModeOfPaymentsArray.clear();
                result.submitDataPay.ipModePaymentInsert.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });

                console.log(this.RefundSaveForm.value);
                this._PharAdvanceService.InsertRefundOfAdv(this.RefundSaveForm.value).subscribe(response => {
                    this.viewgetRefundofAdvanceReportPdf(response);
                    this.OnReset();
                });
            });
        } else {
            const invalidFields: string[] = [];
            // checks nested error 
            if (this.RefundSaveForm?.invalid) {
                for (const controlName in this.RefundSaveForm.controls) {
                    const control = this.RefundSaveForm.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Advance Refund Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Advance Refund Form: ${controlName}`);
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
    OnReset() {
        this.RefundFooterForm.reset();
        this.RefundFooterForm.get('Op_ip_id').setValue(1);
        this.RefundFooterForm.get('RegID').setValue('');
        this.dsIpItemList.data = [];
        this.AdvanceId = 0;
        this._matDialog.closeAll();
    }

    viewgetRefundofAdvanceReportPdf(contact) {
        this.commonService.Onprint("RefundId", contact, "PharamcyAdvanceReturnReceipt");
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
    // shoe 2nd table data
    //   getPreRefundofAdvance(row) {  
    //      var m_data = {
    //   "first": 0,
    //   "rows": 10,
    //   "sortField": "AdvanceId",
    //   "sortOrder": 0,
    //   "filters": [ { "fieldName": "AdvanceId", "fieldValue": String(row.advanceId),  "opType": "Contains" }],
    //   "exportType": "JSON",
    //   "columns": []
    // }  
    //     this._PharAdvanceService.getPreRefundofAdvance(m_data).subscribe(Visit => {
    //       this.dsPreRefundList.data =  Visit.data as IpItemList[];       
    //       this.dsPreRefundList.sort = this.sort;
    //       this.dsPreRefundList.paginator = this.paginator;
    //       console.log(this.dsPreRefundList.data); 
    //     });  
    //   }
}
export class IpItemList {
    AdvanceNo: number;
    PreviousRef: number;
    BalanceAmount: any;
    UsedAmount: any;
    AdvanceAmount: any;
    Date: any;
    RefundAmount: any;
    refundAmount: any;
    AdvanceDetailID: any;
    PrevRefundAmount: any;
    prevRefundAmount: any;
    advanceDetailId: any;
    balanceAmount: any;

    constructor(IpItemList) {
        {
            this.AdvanceAmount = IpItemList.AdvanceAmount || 0;
            this.UsedAmount = IpItemList.UsedAmount || 0;
            this.PrevRefundAmount = IpItemList.PrevRefundAmount || 0;
            this.BalanceAmount = IpItemList.BalanceAmount || 0;
            this.AdvanceNo = IpItemList.AdvanceNo || 0;
            this.PreviousRef = IpItemList.PreviousRef || 0;
            this.RefundAmount = IpItemList.RefundAmount || 0;
            this.Date = IpItemList.Date || 0;
            this.AdvanceDetailID = IpItemList.AdvanceDetailID || 0;
            this.refundAmount = IpItemList.refundAmount || 0;
            this.prevRefundAmount = IpItemList.prevRefundAmount || 0;
            this.advanceDetailId = IpItemList.advanceDetailId || 0;
            this.balanceAmount = IpItemList.balanceAmount || 0;
        }
    }
}


