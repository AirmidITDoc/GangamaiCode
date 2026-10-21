import { DatePipe } from '@angular/common';  
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component'; 
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewOpAdvanceComponent } from './new-op-advance/new-op-advance.component';  
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service'; 
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';  
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OpAdvanceService } from './op-advance.service';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';

@Component({
    selector: 'app-op-advance',
    templateUrl: './op-advance.component.html',
    styleUrls: ['./op-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
}) 
export class OpAdvanceComponent implements OnInit {

    AdvFormGroup: FormGroup;
    searchFormGroup: FormGroup
    screenFromString = 'advance-form';
    dateTimeObj: any;
    RegId:any= 0;
    vPatientName: any;
    registerObj: any;
    Patientdetails: any;
    vAdvanceId: any = 0;
    PatientName: any
    OP_IP_Id: any
    regNo = 0
    selectedAdvanceObj: any = [];
    autocompleteModeCashCounter: string = "CashCounter";
    UserWsieCashcounterId: boolean = false;
    vUserID: any = 0;
    //Advance Amt summary
    TotalAdvanceAmt: any = 0;
    TotalAdvUsedAmt: any = 0;
    TotalAdvaBalAmt: any = 0;
    TotalAdvRefAmt: any = 0;
    currency: any = '';

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically 
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    AllColumns = [
        { heading: "Advance Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200, },
        { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Used Amt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 170 },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        // { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        // { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "onlineAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        {
            heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        apiUrl: "Advance/PatientWiseAdvanceList",
        columnsList: this.AllColumns,
        sortField: "AdvanceDetailID",
        sortOrder: 0,
        filters: [
            { fieldName: "AdmissionID", fieldValue: String(this.RegId), opType: OperatorComparer.Equals }
        ]
    }
    constructor(
        public _OpAdvanceService: OpAdvanceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe, 
        public _WhatsAppEmailService: WhatsAppEmailService, 
        private accountService: AuthenticationService,
        private commonService: PrintserviceService,
        public toastr: ToastrService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        private hospitalconfigservice: HospitalConfigService,
        public _configService: ConfigService,
        private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.vUserID = this.accountService.currentUserValue?.userId || 0;
        this.searchFormGroup = this.createSearchForm();
        this.createAdvform();
        this.AdvFormGroup.markAllAsTouched();
 
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._configService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue

        const [UserWsieCashcounterId, UserWsieCashcounterVal] = this._configService.configParams.IsUserwiseCashCounterflow.split(":");
        this.UserWsieCashcounterId = UserWsieCashcounterId === "1";

        this.getuserwisecashcounterlist();
        this.getdata(this.RegId)
    }
    getSelectedObjReg(obj) { 
        this.registerObj = obj;
        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.lastName;
        this.RegId = this.registerObj?.regId
        this.OP_IP_Id = this.registerObj.visitId;
        this.regNo = this.registerObj.regNo;

        if (this.RegId > 0) {  
            const vdata = {
                "first": 0,
                "rows": 999,
                "sortField": "AdmissionID",
                "sortOrder": 0,
                "filters": [{ "fieldName": "AdmissionID", "fieldValue": String(this.RegId), "opType": "Equals" }],
                "Columns": [],
                "exportType": "JSON"
            }
            setTimeout(() => {
                this._OpAdvanceService.AdvanceHeaderlist(vdata).subscribe((response) => {
                    this.selectedAdvanceObj = response.data;
                    if (this.selectedAdvanceObj.length > 0)
                        this.vAdvanceId = this.selectedAdvanceObj[0]?.advanceId ?? 0
                    this.selectedAdvanceObj.forEach(element => {
                        this.TotalAdvanceAmt += element.advanceAmount
                        this.TotalAdvUsedAmt += element.usedAmount
                        this.TotalAdvaBalAmt += element.balanceAmount
                        this.TotalAdvRefAmt += element.refundAmount
                    })
                });
            }, 500); 
        }
        this.getdata(this.RegId)
    }
    getdata(obj) {
        this.gridConfig = {
            apiUrl: "Advance/PatientWiseAdvanceList",
            columnsList: this.AllColumns,
            sortField: "AdvanceDetailID",
            sortOrder: 0,
            filters: [
                { fieldName: "AdmissionID", fieldValue: String(this.RegId), opType: OperatorComparer.Equals }
            ]
        }
         setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }, 1000);
    }
    createSearchForm(): FormGroup {
        return this.formBuilder.group({
            RegId: [0]  // Initial value is 0
        });
    } 
    createAdvform() {
        this.AdvFormGroup = this.formBuilder.group({
            CashCounterID: [this.hospitalconfigservice.HospitalconfigParams.IPD_Advance_CounterId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
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
                unitId: [this.accountService.currentUserValue.user.unitId]
            }),
            // details 
            advanceDetail: this.formBuilder.group({
                date: ['', [this._FormvalidationserviceService.validDateValidator()]],
                time: [''],
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator()]],
                transactionId: [1],
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
                unitId: [this.accountService.currentUserValue.user.unitId],
                cashCounterId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
            }),
            //advanceupdate header
            advanceupdate: this.formBuilder.group({
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
                this._FormvalidationserviceService.onlyNumberValidator(), Validators.min(1)]]
            })
        });
    } 
    onSave() {
        debugger
        Swal.fire({
            title: 'Do you want to Add Advance ',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Add!"

        }).then((result) => {
            if (result.isConfirmed) {
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
                this.AdvFormGroup.get('advance.opdIpdId').setValue(this.RegId)
                this.AdvFormGroup.get('advanceDetail.opdIpdId').setValue(this.RegId)
                this.AdvFormGroup.get('advanceDetail.refId').setValue(this.RegId)
                this.AdvFormGroup.get('advance.refId').setValue(this.RegId)
                this.AdvFormGroup.get('advanceDetail.cashCounterId').setValue(this.AdvFormGroup.get('CashCounterID')?.value)

                if (this.AdvFormGroup.valid) {
                    const PatientHeaderObj = {};
                    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
                        PatientHeaderObj['PatientName'] = this.registerObj?.patientName || '';
                    PatientHeaderObj['RegNo'] = this.registerObj?.regNo || 0,
                        PatientHeaderObj['DoctorName'] = this.registerObj?.doctorname || '';
                    PatientHeaderObj['CompanyName'] = this.registerObj?.companyName || '';
                    PatientHeaderObj['DepartmentName'] = this.registerObj?.departmentName || '';
                    PatientHeaderObj['CashCounterId'] = this.AdvFormGroup.get('CashCounterID')?.value || 0;
                    PatientHeaderObj['OPD_IPD_Id'] = this.registerObj?.ipdno || '';
                    PatientHeaderObj['CompanyId'] = this.registerObj?.companyId || 0;
                    PatientHeaderObj['TransactionLabel'] = 'OP_ADVANCE';
                    PatientHeaderObj['Age'] = this.registerObj?.ageYear || 0;
                    PatientHeaderObj['NetPayAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;

                    const dialogRef = this._matDialog.open(OpPaymentComponent,
                        {
                            maxWidth: "80vw",
                            height: '750px',
                            width: '80%',
                            data: {
                                vPatientHeaderObj: PatientHeaderObj,
                                FromName: "OP-Advance",
                                advanceObj: PatientHeaderObj,
                            }
                        });
                    dialogRef.afterClosed().subscribe(result => {
                        console.log('Payment Details', result);
                        if (!this.AdvFormGroup.get('advanceupdate.advanceId').value) {
                            const submitData = {
                                "advance": this.AdvFormGroup.value.advance,
                                "advanceDetail": this.AdvFormGroup.value.advanceDetail,
                                "advancePayment": result.submitDataPay.ipPaymentInsert,
                                "tPayments": result.submitDataPay.ipModePaymentInsert
                            };
                            console.log(submitData);
                            this._OpAdvanceService.InsertAdvanceHeader(submitData).subscribe(response => {
                                this.grid.bindGridData();
                                if (response) this.viewgetAdvanceReceiptReportPdf(response);
                                this.onClose();
                            });
                        }
                        else {
                            const submitData = {
                                "advance": this.AdvFormGroup.value.advanceupdate,
                                "advanceDetail": this.AdvFormGroup.value.advanceDetail,
                                "advancePayment": result.submitDataPay.ipPaymentInsert,
                                "tPayments": result.submitDataPay.ipModePaymentInsert
                            };
                            console.log(submitData);
                            this._OpAdvanceService.UpdateAdvanceHeader(submitData).subscribe(response => {
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
        });
    } 
    onClose() {
        this.registerObj = 0;
        this.vAdvanceId = 0;
        this.TotalAdvanceAmt = 0;
        this.TotalAdvUsedAmt = 0;
        this.TotalAdvaBalAmt = 0;
        this.TotalAdvRefAmt = 0;
        this.RegId = 0;
        this.regNo = 0
        this.selectedAdvanceObj = []; 
        this.AdvFormGroup.get('advanceAmount').setValue(0);
        this.AdvFormGroup.get('advanceAmount').setValidators(Validators.required)
        this.AdvFormGroup.get('CashCounterID').setValue(this.hospitalconfigservice.HospitalconfigParams.IPD_Advance_CounterId);
        this.AdvFormGroup.get('reason').setValue('');
        this.getdata(this.RegId);
        this.searchFormGroup.reset();
         this._matDialog.closeAll();
    }

    viewgetAdvanceReceiptReportPdf(element) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "AdvanceDetailID", "fieldValue": String(element.advanceDetailID || element), "opType": "13" },
                    { "fieldName": "UserId", "fieldValue": String(this.accountService.currentUserValue.userId), "opType": "13" }
                ],
                "mode": "IpAdvanceReceipt"
            }
            this._OpAdvanceService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "OP Advance Receipt" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    getStatementPrint() {
        this.commonService.Onprint("AdmissionID", this.registerObj.admissionId, "IpAdvanceStatement");
    }
    viewgetAdvanceReceiptReportPdfold(data) {
        console.log(data)
        this.commonService.Onprint("AdvanceDetailID", data.advanceDetailID || data, "IpAdvanceReceipt");
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
    getuserwisecashcounterlist() {
        if (!this.UserWsieCashcounterId) { return };
        const Type = 'IPD_ADVANCE';
        this._OpAdvanceService.getuserwisecashcounterlist(this.vUserID, Type).subscribe((data) => {
            const cashcounterlist = data
            console.log('user wise cashcounter list: ', cashcounterlist);
            if (cashcounterlist) {
                const dvalue = cashcounterlist.filter((item) => item.isDefault == true)
                this.AdvFormGroup.get('CashCounterID').setValue(dvalue[0]?.cashCounterId);
            }
        });
    }
}

export class AdvanceHeader {
    AdvanceId: number;
    AdvanceAmount: number;
    Date: Date;
    RefId: number;
    OPD_IPD_Type: any;
    OPD_IPD_Id: number;
    AdvanceUsedAmount: number;
    BalanceAmount: number;
    AddedBy: any;
    IsCancelled: boolean;
    IsCancelledBy: any;
    IsCancelledDate: Date;

    constructor(AdvanceHeaderObj) {
        this.AdvanceId = AdvanceHeaderObj.AdvanceId || '0';
        this.Date = AdvanceHeaderObj.Date || '0';
        this.RefId = AdvanceHeaderObj.RefId || '0';
        this.OPD_IPD_Type = AdvanceHeaderObj.OPD_IPD_Type || '';
        this.OPD_IPD_Id = AdvanceHeaderObj.OPD_IPD_Id || '0';
        this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || '0';
        this.AdvanceUsedAmount = AdvanceHeaderObj.AdvanceUsedAmount || '0';
        this.BalanceAmount = AdvanceHeaderObj.BalanceAmount || '0';
        this.AddedBy = AdvanceHeaderObj.AddedBy || '';
        this.IsCancelled = AdvanceHeaderObj.IsCancelled || false;
        this.IsCancelledBy = AdvanceHeaderObj.IsCancelledBy || '';
        this.IsCancelledDate = AdvanceHeaderObj.IsCancelledDate || '';
    }
}

export class AdvanceDetails {
    AdvanceDetailID: number;
    Date: any;
    Time: any;
    AdvanceId: number;
    RefId: number;
    TransactionID: number;
    OPD_IPD_Type: any;
    OPD_IPD_Id: number;
    AdvanceAmount: number;
    UsedAmount: any;
    BalanceAmount: number;
    RefundAmount: any;
    ReasonOfAdvanceId: any;
    AddedBy: any;
    IsCancelled: boolean;
    IsCancelledBy: any;
    IsCancelledDate: Date;
    Reason: any;
    CashCounterId: any;

    constructor(AdvanceDetailsObj) {
        this.AdvanceDetailID = AdvanceDetailsObj.AdvanceDetailID || '0';
        this.Date = AdvanceDetailsObj.Date;
        this.Time = AdvanceDetailsObj.Time;
        this.AdvanceId = AdvanceDetailsObj.AdvanceId;
        this.RefId = AdvanceDetailsObj.RefId;
        this.TransactionID = AdvanceDetailsObj.TransactionID || '0';
        this.OPD_IPD_Type = AdvanceDetailsObj.OPD_IPD_Type || 1;
        this.OPD_IPD_Id = AdvanceDetailsObj.OPD_IPD_Id || '0';
        this.AdvanceAmount = AdvanceDetailsObj.AdvanceAmount || '0';
        this.UsedAmount = AdvanceDetailsObj.UsedAmount || '0';
        this.BalanceAmount = AdvanceDetailsObj.BalanceAmount || '0';
        this.RefundAmount = AdvanceDetailsObj.RefundAmount || '0';
        this.ReasonOfAdvanceId = AdvanceDetailsObj.ReasonOfAdvanceId || '0';
        this.Reason = AdvanceDetailsObj.Reason || '';
        this.AddedBy = AdvanceDetailsObj.AddedBy || 0;
        this.IsCancelled = AdvanceDetailsObj.IsCancelled || false;
        this.IsCancelledBy = AdvanceDetailsObj.IsCancelledBy || 0;
        this.IsCancelledDate = AdvanceDetailsObj.IsCancelledDate || '01/01/1900';
        this.CashCounterId = AdvanceDetailsObj.CashCounterId || 0;
    }

}


export class IpPaymentInsert {
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
    CashCounterId: number;
    IsSelfORCompany: number;
    CompanyId: any;
    NEFTPayAmount: number;
    NEFTNo: any;
    NEFTBankMaster: any;
    NEFTDate: any;
    PayTMAmount: number;
    PayTMTranNo: any;
    PayTMDate: Date;
    PaidAmt: number;
    BalanceAmt: number;
    UsedAmount: number;
    BalanceAmount: number;

    constructor(IpPayment) {
        this.PaymentId = IpPayment.PaymentId || 0;
        this.BillNo = IpPayment.BillNo || 0;
        this.ReceiptNo = IpPayment.ReceiptNo || '';
        this.PaymentDate = IpPayment.PaymentDate || '01/01/1900';
        this.PaymentTime = IpPayment.PaymentTime || '01/01/1900';
        this.CashPayAmount = IpPayment.CashPayAmount || 0;
        this.ChequePayAmount = IpPayment.ChequePayAmount || 0;
        this.ChequeNo = IpPayment.ChequeNo || '';

        this.BankName = IpPayment.BankName || '';
        this.ChequeDate = IpPayment.ChequeDate || '01/01/1900';
        this.CardPayAmount = IpPayment.CardPayAmount || 0;
        this.CardNo = IpPayment.CardNo || '';
        this.CardBankName = IpPayment.CardBankName || '';
        this.BalanceAmount = IpPayment.BalanceAmount || 0;
        this.CardDate = IpPayment.CardDate || '01/01/1900';
        this.AdvanceUsedAmount = IpPayment.AdvanceUsedAmount || 0;
        this.AdvanceId = IpPayment.AdvanceId || 0;
        this.RefundId = IpPayment.RefundId || 0;
        this.TransactionType = IpPayment.TransactionType || 0;
        this.Remark = IpPayment.Remark || '';
        this.UsedAmount = IpPayment.UsedAmount || 0;
        this.AddBy = IpPayment.AddBy || 0;
        this.IsCancelled = IpPayment.IsCancelled || 0;
        this.IsCancelledBy = IpPayment.IsCancelledBy || 0;
        this.IsCancelledDate = IpPayment.IsCancelledDate || '01/01/1900';

        this.CashCounterId = IpPayment.CashCounterId || 0;
        this.IsSelfORCompany = IpPayment.IsSelfORCompany || 0;
        this.CompanyId = IpPayment.CompanyId || 0;

        this.NEFTPayAmount = IpPayment.NEFTPayAmount || 0;
        this.NEFTNo = IpPayment.NEFTNo || '';
        this.NEFTBankMaster = IpPayment.NEFTBankMaster || '';
        this.NEFTDate = IpPayment.NEFTDate || '01/01/1900';

        this.PayTMAmount = IpPayment.PayTMAmount || 0;
        this.PayTMTranNo = IpPayment.PayTMTranNo || '';
        this.PayTMDate = IpPayment.PayTMDate || '01/01/1900';

        this.PaidAmt = IpPayment.PaidAmt || 0;
        this.BalanceAmt = IpPayment.BalanceAmt || 0;
    }

}




//     constructor(
//         public _BrowseIpAdvanceService: OpAdvanceService,
//         public datePipe: DatePipe,
//         public _matDialog: MatDialog,
//         public toastr: ToastrService, public permissionService: PagePermissionService,
//         private commonService: PrintserviceService,
//     ) { }

//     ngOnInit(): void { }

//     fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
//     toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


//     @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
//     @ViewChild('actionButtonTemplateone') actionButtonTemplateone!: TemplateRef<any>;


//     ngAfterViewInit() {
//         this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
//         this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateone;
//     }


//     @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
//     @ViewChild('ipRefund', { static: false }) grid1: AirmidTableComponent;

//     f_name: any = ""
//     regNo: any = "0"
//     l_name: any = ""
//     PBillNo: any = "0"

//     af_name: any = ""
//     aregNo: any = "0"
//     al_name: any = ""
//     afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
//     atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

//     allAdvanceFilter = [
//         { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
//         { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
//         { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
//         { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
//         { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
//         { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals }
//     ]

//     allAdvanceColumns = [
//         { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', type: 6 , width: 150 },
//         { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
//         { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
//         { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
//         { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
//         { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
//         { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
//         { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200},
//         { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
//         { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
//         { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' , width: 150},
//         {
//             heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
//             template: this.actionButtonTemplateone  // Assign ng-template to the column
//         }
//     ]

//     allRefundOfAdvanceFilters = [
//         { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
//         { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
//         { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
//         { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
//         { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
//     ]

//     allRefundOfAdvanceColumns = [
//         { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
//         { heading: "Date", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
//         { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
//         { heading: "Advance Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Advance UsedAmt", key: "advanceUsedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 150 },
//         { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Pay Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 6 },
//         { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
//         { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 300 },
//         { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
//         {
//             heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
//             template: this.actionButtonTemplate  // Assign ng-template to the column
//         }
//     ]

//     gridConfig: gridModel = {
//         permissionCode: permissionCodes.Advance,
//         apiUrl: "Advance/BrowseAdvanceList",
//         columnsList: this.allAdvanceColumns,
//         sortField: "RegID",
//         sortOrder: 0,
//         filters: this.allAdvanceFilter
//     }

//     gridConfig1: gridModel = {
//         permissionCode: permissionCodes.Advance,
//         apiUrl: "Advance/BrowseRefundOfAdvanceList",
//         columnsList: this.allRefundOfAdvanceColumns,
//         sortField: "RegId",
//         sortOrder: 0,
//         filters: this.allRefundOfAdvanceFilters
//     }

//     onChangeAdvance() {
//         this.fromDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
//         this.toDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
//         this.f_name = this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').value + "%"
//         this.l_name = this._BrowseIpAdvanceService.UserFormGroup.get('LastName').value + "%"
//         this.regNo = this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').value || "0"
//         this.PBillNo = this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').value || "0"
//         this.getfilterAdvanceList();
//     }

//     getfilterAdvanceList() {

//         this.gridConfig = {
//             apiUrl: "Advance/BrowseAdvanceList",
//             columnsList: this.allAdvanceColumns,
//             sortField: "RegID",
//             sortOrder: 0,
//             filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
//             { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
//             { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
//             { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
//             { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
//             { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals }
//             ]
//         }
//         this.grid.gridConfig = this.gridConfig;
//         this.grid.bindGridData();
//     }

//     ClearfilterAdvance(event) {
//         console.log(event)
//         if (event == 'FirstName')
//             this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').setValue("")
//         else
//             if (event == 'LastName')
//                 this._BrowseIpAdvanceService.UserFormGroup.get('LastName').setValue("")
//         if (event == 'RegNo')
//             this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').setValue("")
//         if (event == 'PBillNo')
//             this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').setValue("")

//         this.onChangeAdvance();
//     }

//     onChangeAdvanceOfRefund() {
//         this.afromDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('fromDate').value, "yyyy-MM-dd")
//         this.atoDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('enddate').value, "yyyy-MM-dd")
//         this.af_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').value + "%"
//         this.al_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').value + "%"
//         this.aregNo = this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').value || "0"
//         this.getfilterAdvanceOfRefundList();
//     }

//     getfilterAdvanceOfRefundList() {

//         this.gridConfig1 = {
//             apiUrl: "Advance/BrowseRefundOfAdvanceList",
//             columnsList: this.allRefundOfAdvanceColumns,
//             sortField: "RegId",
//             sortOrder: 0,
//             filters: [{ fieldName: "F_Name", fieldValue: this.af_name, opType: OperatorComparer.Contains },
//             { fieldName: "L_Name", fieldValue: this.al_name, opType: OperatorComparer.Contains },
//             { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
//             { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
//             { fieldName: "Reg_No", fieldValue: this.aregNo, opType: OperatorComparer.Equals }
//             ]
//         }
//         this.grid1.gridConfig = this.gridConfig1;
//         this.grid1.bindGridData();
//     }

//     ClearfilterAdvanceOfRefund(event) {
//         console.log(event)
//         if (event == 'FirstName')
//             this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').setValue("")
//         else
//             if (event == 'LastName')
//                 this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').setValue("")
//         if (event == 'RegNo')
//             this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').setValue("")

//         this.onChangeAdvanceOfRefund();
//     }

//     OnAdvanceViewReportPdf(element) {
//         console.log(element)
//         this.commonService.Onprint("AdvanceDetailID", element.advanceDetailID, "IpAdvanceReceipt");
//     }


//     getAdvreturnview(element) {
//         console.log(element)
//         this.commonService.Onprint("RefundId", element.refundId, "IpAdvanceRefundReceipt");
//     }
//     whatsappAppoitment(data) { }



//     getSelectedRow(row: any): void {
//         console.log("Selected row : ", row);
//     }

//     onAdvance() {
//         const dialogRef = this._matDialog.open(NewOpAdvanceComponent,
//             {
//                maxWidth: "100%",
//                height: '95%',
//                width: '80%',
//             });
//         dialogRef.afterClosed().subscribe(result => {
//             console.log('The dialog was closed - Insert Action', result);
//             this.grid.bindGridData();
//         });
//     }

//     onNewRefund() {
//         const dialogRef = this._matDialog.open(NewRefundOfAdvanceComponent,
//             {
//                     maxWidth: "100%",
//                     height: '90%',
//                     width: '90%',
//             });
//         dialogRef.afterClosed().subscribe(result => {
//             console.log('The dialog was closed - Insert Action', result);
//             this.grid.bindGridData();
//         });
//     }
// }
