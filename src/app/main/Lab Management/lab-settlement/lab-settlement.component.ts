import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountAfterFinalLabbillComponent } from '../lab-patient-reg/discount-after-final-labbill/discount-after-final-labbill.component';
import { LabPatientList } from '../lab-patient-reg/lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg/lab-patient-reg.service';
import { ConfigService } from 'app/core/services/config.service';

@Component({
    selector: 'app-lab-settlement',
    templateUrl: './lab-settlement.component.html',
    styleUrls: ['./lab-settlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LabSettlementComponent {
    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vMobileNo: any;
    vOPIPId = 0;
    f_name: any = ""
    regNo: any = "0"
    regNo2: any = "0"
    l_name: any = ""
    CompanyId = "0"
    PBillNo: any = "%"
    autocompleteModecompany: string = "Company";
    searchFormGroup: FormGroup
    RegNo: any;
    PatientName: any;
    billNo: any;
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0;
    registerObj = new LabPatientList({});
    RegId = 0;
    OpSettlementForm: FormGroup
    isSettlement: boolean = false;

    autocompleteModeunit: string = "Hospital";
    UnitId: any = this.accountService.currentUserValue.user.unitId;
    isSuperAdmin: any = this.accountService.currentUserValue.user.isAdminMultiview;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    VlabPatRegId: any;

    constructor(
        public _labPatientRegService: LabPatientRegService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _ConfigService: ConfigService,
        public accountService: AuthenticationService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService, public formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.OpSettlementForm = this.CreateOPSettlementForm();

        const access = this._ConfigService.userAccessParam.find(x => x.AccessValueName === 'IsSettlement');
        this.isSettlement = access?.AccessValue;
        console.log("Login Access:", access);
    }

    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
            UnitId: [this.accountService.currentUserValue.user.unitId]
        });
    }

    CreateOPSettlementForm() {
        return this.formBuilder.group({
            opCreditPayment: this.formBuilder.group({
                paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                // receiptNo:['0'],
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
                opdipdType: [0],
                neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            //bill update 
            billUpdate: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            //New Payments
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        })
    }

    CreateModePaymentform(item: any): FormGroup {
        return this.formBuilder.group({
            paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [item?.unitId ?? this.accountService.currentUserValue.user.unitId],
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
            tranMode: [item?.tranMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [item?.createdBy ?? this.accountService.currentUserValue.userId],
            transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.OpSettlementForm.get('tPayments') as FormArray;
    }

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    AllColumns = [
        {
            heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionsTemplate, width: 40
        },
        { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 8 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, columnClass: (element) => element["balanceAmt"] > 0 ? Color.RED : "" },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.ExternalInvestigation,
        apiUrl: "OPBill/OPBillListSettlementList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId), opType: OperatorComparer.Contains }
        ],
        row: 25
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = 0
    }

    getSelectedObj(obj) {
        console.log(obj)
        // this.RegId = obj.labPatientId;  
        this.RegId = obj.visitId;

        if (this.RegId) {
            setTimeout(() => {
                this._labPatientRegService.getLabRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    this.VlabPatRegId = this.registerObj?.labPatientId
                    this.RegNo = this.registerObj?.labRequestNo
                    this.PatientName = this.registerObj?.patientName
                    this.billNo = this.registerObj.billNo;
                    console.log(response)
                    // this.getfilterdata(this.VlabPatRegId)
                });
            }, 100);
        }
        this.GetDetails(obj.value)
    }

    @ViewChild('tblLabPatient', { static: false }) tblLabPatient: AirmidTableComponent;
    GetDetails(data: any) {
        let filters = [
            { fieldName: "RegId", fieldValue: String(this.RegId), opType: OperatorComparer.Contains }
        ]
        setTimeout(() => {
            this.tblLabPatient.gridConfig.filters = filters;
            this.tblLabPatient.bindGridData();
        }, 100);
    }

    openPaymentpopup(contact) {
        console.log(contact)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
            PatientHeaderObj['RegNo'] = contact.labRequestNo;
        PatientHeaderObj['PatientName'] = contact.patientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.labPatientId;
        PatientHeaderObj['Age'] = contact.ageYear;
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['billNo'] = contact.billNo || 0;
        PatientHeaderObj['DoctorName'] = contact.doctorName;
        PatientHeaderObj['TariffName'] = contact.tariffName;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['TransactionLabel'] = 'LAB_SETTLEMENT';
        // this.vMobileNo = contact.mobileNo;
        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                width: '70%',
                maxHeight: "90vw",
                height: '90%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "LAB-SETTLEMENT"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result.IsSubmitFlag == true) {
                this.OpSettlementForm.get('billUpdate.billNo').setValue(contact.billNo)
                this.OpSettlementForm.get('billUpdate.balanceAmt').setValue(result.BillBalanceAmount)
                this.OpSettlementForm.get('opCreditPayment').setValue(result.submitDataPay.ipPaymentInsert)

                this.ModeOfPaymentsArray.clear();
                result.submitDataPay.ipModePaymentInsert.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });

                debugger
                if (this.OpSettlementForm.valid) {
                    console.log(this.OpSettlementForm.value)
                    console.log(result.submitDataPay.ipPaymentInsert)

                    this._labPatientRegService.InsertLabBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
                        this.viewgetOPPayemntPdf(response, true);
                        this.grid.bindGridData();
                    });
                } else {
                    const invalidFields = []
                    if (this.OpSettlementForm.invalid) {
                        for (const controlName in this.OpSettlementForm.controls) {
                            const control = this.OpSettlementForm.get(controlName);
                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`OP Settlement Data: ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`OPSettlement From: ${controlName}`);
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

    getFinalDisc(contact) {
        const dialogRef = this._matDialog.open(DiscountAfterFinalLabbillComponent,
            {
                maxWidth: "100%",
                height: '55%',
                width: '45%',
                data: {
                    Obj: contact,
                    // PatientObj: this.registerObj
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }

    viewgetOPPayemntPdf(data, status) {
        if (status == true)
            this.commonService.Onprint("PaymentId", data, "LabPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "LabPaymentReceipt");
    }
}
