import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { OpPaymentComponent } from '../../op-search-list/op-payment/op-payment.component';
import { OpAdvanceService } from '../op-advance.service';

@Component({
    selector: 'app-new-op-advance',
    templateUrl: './new-op-advance.component.html',
    styleUrls: ['./new-op-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewOpAdvanceComponent {

    AdvFormGroup: FormGroup;
    searchFormGroup: FormGroup
    screenFromString = 'advance-form';
    dateTimeObj: any;
    RegId = 0;
    vPatientName: any;
    registerObj: any;
    TotalAdvanceAmt: any = 0;
    TotalAdvUsedAmt: any = 0;
    TotalAdvaBalAmt: any = 0;
    TotalAdvRefAmt: any = 0;
    Patientdetails: any;
    vAdvanceId: any = 0;
    DoctorName: any
    HospitalId = 0
    PatientName: any
    OP_IP_Id: any
    OPDNo: any
    regNo = 0
    departmentName: any
    CompanyName: any


    autocompleteModeCashCounter: string = "CashCounter";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    AllColumns = [
        { heading: "Advance Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Used Amt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    constructor(
        public _opAdvanceService: OpAdvanceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public _WhatsAppEmailService: WhatsAppEmailService,
        private dialogRef: MatDialogRef<NewOpAdvanceComponent>,
        private accountService: AuthenticationService,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.createAdvform();
        this.AdvFormGroup.markAllAsTouched();

        if (this.data) {
            this.registerObj = this.data
            this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.lastName;
            this.RegId = this.registerObj.regId;
            this.OP_IP_Id = this.registerObj.visitId;
            this.OPDNo = this.registerObj.opdNo;
            this.HospitalId = this.registerObj.hospitalId;
            this.DoctorName = this.registerObj.doctorName;
            this.regNo = this.registerObj.regNo;

            this.departmentName = this.registerObj.departmentName;
            this.CompanyName = this.registerObj.CompanyName;
        }
    }

    createSearchForm(): FormGroup {
        return this.formBuilder.group({
            RegId: [0]  // Initial value is 0
        });
    }

    createAdvform() {
        this.AdvFormGroup = this.formBuilder.group({
            CashCounterID: ['5', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            reason: [''],

            advance: this.formBuilder.group({
                date: ['', [this._FormvalidationserviceService.validDateValidator]],
                refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                opdIpdType: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
                opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                cashCounterId: ['5', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            }),
            // details 
            advanceDetail: this.formBuilder.group({
                date: ['', [this._FormvalidationserviceService.validDateValidator()]],
                time: [''],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionId: [2],
                opdIpdType: [0],
                opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                usedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                reasonOfAdvanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                addedBy: [this.accountService.currentUserValue.userId],
                isCancelled: [false],
                isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],
                reason: [''],
                advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //advanceupdate header
            advanceupdate: this.formBuilder.group({
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator(), Validators.min(1)]]
            })
        });
    }

    // getSelectedObj(obj) {
    //   this.RegId = obj.value;
    //   if ((this.RegId ?? 0) > 0) {
    //     setTimeout(() => {
    //       this._opAdvanceService.getRegistraionById(this.RegId).subscribe((response) => {
    //         this.registerObj = response;
    //         this.vPatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
    //         console.log(response)
    //       });
    //     }, 500);
    //   }
    // }

    gridConfig: gridModel = {
        apiUrl: "",
        columnsList: this.AllColumns,
        sortField: "AdvanceDetailID",
        sortOrder: 0,
        filters: [
            // { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
        ]
    }

    getSelectedObjOP(obj) {
        console.log(obj);
        this.registerObj = obj;

        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.lastName;
        this.RegId = this.registerObj.regId;
        this.OP_IP_Id = this.registerObj.visitId;
        this.OPDNo = this.registerObj.opdNo;
        this.HospitalId = this.registerObj.hospitalId;
        this.DoctorName = this.registerObj.doctorName;
        this.regNo = this.registerObj.regNo;

        this.departmentName = this.registerObj.departmentName;
        this.CompanyName = this.registerObj.CompanyName;
        // this.regNo=obj.regNo;
    }



    onSave() {
        debugger
        this.AdvFormGroup.get('advance.date').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.AdvFormGroup.get('advanceDetail.date').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.AdvFormGroup.get('advanceDetail.time').setValue(this.dateTimeObj.time)
        this.AdvFormGroup.get('advance.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
        this.AdvFormGroup.get('advanceDetail.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
        this.AdvFormGroup.get('advanceupdate.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
        this.AdvFormGroup.get('advance.advanceId').setValue(this.vAdvanceId)
        this.AdvFormGroup.get('advanceDetail.advanceId').setValue(this.vAdvanceId)
        this.AdvFormGroup.get('advanceupdate.advanceId').setValue(this.vAdvanceId)
        this.AdvFormGroup.get('advance.balanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
        this.AdvFormGroup.get('advanceDetail.balanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
        this.AdvFormGroup.get('advanceDetail.reason').setValue(this.AdvFormGroup.get('reason')?.value)
        this.AdvFormGroup.get('advance.opdIpdId').setValue(this.OP_IP_Id)
        this.AdvFormGroup.get('advanceDetail.opdIpdId').setValue(this.OP_IP_Id)
        this.AdvFormGroup.get('advanceDetail.refId').setValue(this.RegId)
        this.AdvFormGroup.get('advance.refId').setValue(this.RegId)

        if (this.AdvFormGroup.valid) {
            console.log(this.AdvFormGroup.value)
            const PatientHeaderObj = {};
            PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
                PatientHeaderObj['PatientName'] = this.PatientName;
            PatientHeaderObj['RegNo'] = this.regNo,
                PatientHeaderObj['DoctorName'] = this.DoctorName;
            PatientHeaderObj['CompanyName'] = this.registerObj?.companyName || '';
            PatientHeaderObj['DepartmentName'] = this.registerObj?.departmentName;
            PatientHeaderObj['OPD_IPD_Id'] = this.OP_IP_Id;
            PatientHeaderObj['Age'] = this.registerObj?.ageYear;
            PatientHeaderObj['NetPayAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;

            const dialogRef = this._matDialog.open(OpPaymentComponent,
                {
                    maxWidth: "80vw",
                    height: '750px',
                    width: '80%',
                    data: {
                        vPatientHeaderObj: PatientHeaderObj,
                        FromName: "IP-Advance",
                        advanceObj: PatientHeaderObj,
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                console.log('Payment Details', result);
                if (!this.AdvFormGroup.get('advanceupdate.advanceId').value) {
                    const submitData = {
                        "advance": this.AdvFormGroup.value.advance,
                        "advanceDetail": this.AdvFormGroup.value.advanceDetail,
                        "advancePayment": result.submitDataPay.ipPaymentInsert
                    };
                    console.log(submitData);
                    this._opAdvanceService.InsertAdvanceHeader(submitData).subscribe(response => {
                        this.grid.bindGridData();
                        if (response)
                            this.viewgetAdvanceReceiptReportPdf(response);
                        this.onClose();
                    });
                }
                else {
                    const submitData = {
                        "advance": this.AdvFormGroup.value.advanceupdate,
                        "advanceDetail": this.AdvFormGroup.value.advanceDetail,
                        "advancePayment": result.submitDataPay.ipPaymentInsert
                    };
                    console.log(submitData);
                    this._opAdvanceService.UpdateAdvanceHeader(submitData).subscribe(response => {
                        this.viewgetAdvanceReceiptReportPdf(response);
                        this.onClose();
                    });
                }
            });
        } else {
            const invalidFields = [];

            if (this.AdvFormGroup.invalid) {
                for (const controlName in this.AdvFormGroup.controls) {
                    const control = this.AdvFormGroup.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Advance Date : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Advance From: ${controlName}`);
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
        this.dialogRef.close();
    }

    viewgetAdvanceReceiptReportPdf(data) {
        console.log(data)
        // this.commonService.Onprint("AdvanceDetailID",data.advanceDetailID || data, "IpAdvanceReceipt");
    }

    getStatementPrint() {
        this.commonService.Onprint("AdmissionID", this.registerObj.admissionId, "IpAdvanceStatement");
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

    getValidationMessages() {
        return {
            CashCounterID: [
                { name: "required", Message: "CashCounter Name is required" }
            ],
            advanceAmt: [
                { name: "required", Message: "Advance Amount is required" }
            ]
        };
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

}
