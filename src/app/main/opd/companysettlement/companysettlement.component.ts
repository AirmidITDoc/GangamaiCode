import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { Color, gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { RegInsert } from '../registration/registration.component';
import { CompanysettlementService } from './companysettlement.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DiscountAfterFinalBillComponent } from 'app/main/ipd/ip-search-list/discount-after-final-bill/discount-after-final-bill.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
    selector: 'app-companysettlement',
    templateUrl: './companysettlement.component.html',
    styleUrls: ['./companysettlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class CompanysettlementComponent implements OnInit {
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
    OPMultipleSettlForm: FormGroup
    // OPMultipleSettlInsertForm: FormGroup
    OPMultipleSettlLoopInsertForm: FormGroup
    RegId1 = "0";
    RegId2 = "0";
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0;
    registerObj = new RegInsert({});
    RegId = 0;
    OpSettlementForm: FormGroup

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    displayedColumns = [
        'CheckBox',
        'BillDate',
        'BillNo',
        'uhid',
        'opd/ipdNo',
        'patientName',
        'BillAmount',
        'ConsessionAmt',
        'CompanyDisc',
        'NetAmount',
        'balAmount',
        'PaidAmount',
        'tds',
        'companyName',
        'action',
    ];
    vNetAmount: any = 0;
    vPaidAmount: any = 0;
    vTDSAmount: any = 0;
    vBalanceAmount: any = 0;
    isSearchTriggered = false;
    vUPINO: any;
    autocompleteModebank: string = "Bank";

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }
    AllColumns = [
        {
            heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionsTemplate, width: 40
        },
        { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', type: 9 },
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
        apiUrl: "OPBill/OPBillListSettlementList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains }
        ],
        row: 25
    }
    allOPpaymentfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Contains },
        { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Contains }

    ];
    gridConfig1: gridModel = {
        apiUrl: "OPBill/BrowseOPPaymentList",
        columnsList: this.AllColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allOPpaymentfilters
    }

    constructor(
        public _CompanysettlementService: CompanysettlementService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public accountService: AuthenticationService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService, public formBuilder: UntypedFormBuilder
    ) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.OpSettlementForm = this.CreateOPSettlementForm();
        this.OPMultipleSettlForm = this.CreateOPMultiplpeSettlForm();

        this.OPMultipleSettlLoopInsertForm = this.CreateOPMultipleSettlInsertForm();
        this.OPMulSetLoopArray.push(this.CreateOPMultipleSettlLoopInsertForm())
        this.OPMulSetBillLoopArray.push(this.CreateOPMultipleSettlBillLoopInsertForm())

        // Auto refresh when Company is cleared
        this.OPMultipleSettlForm.get('CompanyId')?.valueChanges.subscribe(value => {
            if (!value || value === '0' || value === '') {
                if (this.isSearchTriggered) {  // only clear if user had searched
                    this.dsMultiplepayList.data = []; // clear table
                    this.resetSelectionAndFooter();
                }
            } else {
                this.resetSelectionAndFooter();
            }
        });

        // Auto refresh when Patient is cleared
        this.OPMultipleSettlForm.get('RegId')?.valueChanges.subscribe(value => {
            if (!value || value === '0' || value === '') {
                this.regNo2 = "0";
                if (this.isSearchTriggered) {  // only clear if user had searched
                    this.dsMultiplepayList.data = []; // clear table
                    this.resetSelectionAndFooter();
                }
            } else {
                this.resetSelectionAndFooter();
            }
        });

       // this.getmultiplePaymentList(true);
    }

    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    }

    CreateOPMultiplpeSettlForm() {
        return this.formBuilder.group({
            FirstName: ['', [Validators.maxLength(50),
            Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            LastName: ['', [Validators.maxLength(50),
            Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
            ]],
            fromDate: [],
            enddate: [],
            PBillNo: '',
            RegNo: '',
            CompanyId: 0,
            opipType: '0',
            RegId: 0,

            NetAmount: [''],
            PaidAmount: [''],
            BalanceAmount: [''],
            TDSAmount: [''],
            paymode: ['NEFT'],
            UPINO: ['0', [Validators.required]],
            bankName: ['', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]]
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
    CreateOPMultipleSettlInsertForm() {
        return this.formBuilder.group({
            opCreditPayment: this.formBuilder.array([]), 
            // ✅ Fixed: should be FormArray 
            billUpdate: this.formBuilder.array([]),
        })
    }

    CreateOPMultipleSettlLoopInsertForm(element: any = {}): FormGroup {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 

        return this.formBuilder.group({
            // opCreditPayment: this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            billNo: [element.billNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
            receiptNo: ['0'],
            paymentDate: [formattedDate, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            paymentTime: [formattedTime, [this._FormvalidationserviceService.allowEmptyStringValidator()]],
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
            neftpayAmount: [element.PaidAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
            neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            neftbankMaster: [this.BankNam, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            neftdate: [formattedDate], //['1999-01-01'],

            payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payTmdate: ['1999-01-01'],
            tdsamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
            wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // })
        })
    }
    get OPMulSetLoopArray(): FormArray {
        return this.OPMultipleSettlLoopInsertForm.get('opCreditPayment') as FormArray;
    } 

    CreateOPMultipleSettlBillLoopInsertForm(element: any = {}): FormGroup {
        return this.formBuilder.group({
            // billUpdate: this.formBuilder.group({
            billNo: [element.billNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
            balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            // })
        })
    }
    get OPMulSetBillLoopArray(): FormArray {
        return this.OPMultipleSettlLoopInsertForm.get('billUpdate') as FormArray;
    }


    getSelectedObj(obj) {
        this.RegId1 = obj.value;
        this.regNo = obj.regNo
        this.registerObj = obj
        this.GetDetails(obj.value)
    }

    getSelectedObj2(obj) {
        this.RegId2 = obj.value;
        this.regNo2 = obj.regNo
        this.registerObj = obj
        this.getmultiplePaymentList();
    }

    openPaymentpopup(contact) {
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(contact.billDate, 'MM/dd/yyyy') || '01/01/1900',
        PatientHeaderObj['RegNo'] = this.registerObj?.regNo;
        PatientHeaderObj['PatientName'] = this.registerObj?.patientName
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdNo;
        PatientHeaderObj['Age'] = this.registerObj?.ageYear
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['billNo'] = contact.billNo;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['CompanyId'] = contact.companyId;  
        PatientHeaderObj['TransactionLabel'] = 'OP Settlement';

        const dialogRef = this._matDialog.open(OpPaymentComponent,
            {
                maxWidth: "80vw",
                height: '750px',
                width: '80%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "OP-SETTLEMENT"
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.IsSubmitFlag == true) {
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

                    this._CompanysettlementService.InsertOPBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
                        this.GetDetails(this.RegId1)
                        this.viewgetOPPayemntPdf(response, true);
                    });
                } else {
                    let invalidFields = []
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
        this.searchFormGroup.get('RegId').setValue('')
    }

    viewgetOPPayemntPdf(data, status) {
        if (status)
            this.commonService.Onprint("PaymentId", data, "OPPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "OPPaymentReceipt");
    }
    GetDetails(data) {
        this.gridConfig = {
            apiUrl: "OPBill/OPBillListSettlementList",
            columnsList: this.AllColumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Contains }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    onChangeOPBill() {
        this.fromDate = this.datePipe.transform(this.OPMultipleSettlForm.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.OPMultipleSettlForm.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.OPMultipleSettlForm.get('FirstName').value + "%"
        this.l_name = this.OPMultipleSettlForm.get('LastName').value + "%"
        this.regNo = this.OPMultipleSettlForm.get('RegNo').value || "0"
        this.PBillNo = this.OPMultipleSettlForm.get('PBillNo').value || "%"
        this.getfilterdataOpBill();
    }
    getfilterdataOpBill() {
        this.gridConfig = {
            apiUrl: "OPBill/BrowseOPDBillPagiList",
            columnsList: this.AllColumns,
            sortField: "PbillNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
            { fieldName: "Company_Id", fieldValue: String(this.CompanyId), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    ClearfilterOPbill(event) {
        console.log(event)
        if (event == 'FirstName')
            this.OPMultipleSettlForm.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.OPMultipleSettlForm.get('LastName').setValue("")
        if (event == 'RegNo')
            this.OPMultipleSettlForm.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.OPMultipleSettlForm.get('PBillNo').setValue("")

        this.onChangeOPBill();
    }
    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId = value.value
        else
            this.CompanyId = "0"

        this.getmultiplePaymentList();
    }
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    getFinalDisc(contact) {
        const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
            {
                maxWidth: "100%",
                height: '65%',
                width: '45%',
                data: {
                    Obj: contact,
                    PatientObj: this.registerObj
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }

    onTDSChange(element: any) {

        if (!this.selection.isSelected(element)) {
            this.toastr.warning('Please select the row before entering TDS.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.tds = 0;
            return;
        }

        if (element._origPaidAmount === undefined || element._origPaidAmount == "0") {
            element._origPaidAmount = Number(element.PaidAmount) || 0;
        }

        const tdsValue = Number(element.tds) || 0;
        const origPaid = Number(element._origPaidAmount) || 0;

        if (tdsValue > origPaid) {
            this.toastr.warning('TDS cannot be greater than Paid Amount.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.tds = 0;
            element.PaidAmount = this.roundAmount(origPaid);
            this.recalculateTotals();
            return;
        }

        element.PaidAmount = this.roundAmount(origPaid - tdsValue);

        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.netAmount || 0), 0)
        );

        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.PaidAmount || 0), 0)
        );

        this.vTDSAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.tds || 0), 0)
        );

        this.vBalanceAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.balanceAmt || 0), 0)
        );
    }

    onCompanyDiscChange(element: any) {
        // Prevent manual input on unselected rows
        if (!this.selection.isSelected(element)) {
            this.toastr.warning('Please select the row before entering Company Discount.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.CompanyDisc = 0;
            return;
        }

        const billAmt = Number(element.billAmount) || 0;
        const discAmt = Number(element.discAmount) || 0;
        const companyDisc = Number(element.CompanyDisc) || 0;

        // Validate: company discount cannot exceed remaining amount
        if (companyDisc > billAmt - discAmt) {
            this.toastr.warning('Company Discount cannot be greater than remaining amount.', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            element.CompanyDisc = 0;
        }

        element.netAmount = this.roundAmount(billAmt - discAmt - element.CompanyDisc);
        element.PaidAmount = this.roundAmount(billAmt - discAmt - element.CompanyDisc);
        this.recalculateTotals();
    }

    recalculateTotals() {
        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.netAmount || 0), 0)
        );

        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.PaidAmount || 0), 0)
        );

        this.vTDSAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.tds || 0), 0)
        );

        this.vBalanceAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.balanceAmt || 0), 0)
        );
    }

    deleteTableRow(element: MultiplePayList) {
        const currentData = this.dsMultiplepayList.data;
        const index = currentData.indexOf(element);

        if (index >= 0) {
            currentData.splice(index, 1); // remove element from table
            this.dsMultiplepayList.data = [...currentData];
        }

        // 🔹 Deselect if it was selected
        this.selection.deselect(element);

        // 🔹 Remove from SelectedList if present
        const selectedIndex = this.SelectedList.indexOf(element);
        if (selectedIndex >= 0) {
            this.SelectedList.splice(selectedIndex, 1);
        }

        // 🔹 Recalculate totals based on remaining selected items
        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + x.billAmount, 0)
        );
        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + x.PaidAmount, 0)
        );
        this.vBalanceAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + x.balanceAmt, 0)
        );
        this.vTDSAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.tds || 0), 0)
        );

        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    dsMultiplepayList = new MatTableDataSource<MultiplePayList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    getmultiplePaymentList(validate = true) {
        this.CompanyId = String(this.OPMultipleSettlForm.get('CompanyId').value)
        this.RegId2 = this.OPMultipleSettlForm.get('RegId')?.value.value 

        if (validate &&
            (this.CompanyId === "0" || this.CompanyId === "" || this.CompanyId === null) &&
            (this.RegId2 === "0" || this.RegId2 === "" || this.RegId2 === undefined)) {
            this.toastr.warning('Please select either a Company or a Patient before searching.');
            this.dsMultiplepayList.data = []; // keep list empty
            return;
        }

        this.isSearchTriggered = true;

        let fromDate = this.OPMultipleSettlForm.get("fromDate").value || "";
        let toDate = this.OPMultipleSettlForm.get("enddate").value || "";
        fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
        toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
        var vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "RegNo",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "F_Name",
                    "fieldValue": "%",
                    "opType": "Equals"
                },
                {
                    "fieldName": "L_Name",
                    "fieldValue": "%",
                    "opType": "Equals"
                },
                {
                    "fieldName": "From_Dt",
                    "fieldValue": fromDate, //"2024-01-01",
                    "opType": "StartsWith"
                },
                {
                    "fieldName": "To_Dt",
                    "fieldValue": toDate, //"2025-01-01",
                    "opType": "StartsWith"
                },
                {
                    "fieldName": "Reg_No",
                    "fieldValue": this.regNo2, //"1",
                    "opType": "Contains"
                },
                {
                    "fieldName": "PBillNo",
                    "fieldValue": "0",
                    "opType": "Contains"
                },
                {
                    "fieldName": "ReceiptNo",
                    "fieldValue": "0",
                    "opType": "Contains"
                },
                {
                    "fieldName": "CompanyId",
                    "fieldValue": this.CompanyId,
                    "opType": "Contains"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": "0",
                    "opType": "Contains"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        console.log(vdata)
        this._CompanysettlementService.getmultiplePayList(vdata).subscribe((data) => {
            this.dsMultiplepayList.data = data.data as MultiplePayList[];
            console.log(this.dsMultiplepayList.data)
            this.dsMultiplepayList.sort = this.sort;
            this.dsMultiplepayList.paginator = this.paginator;
        });
    }

    resetSelectionAndFooter() {
        this.selection.clear(); // Clear all selected rows
        this.SelectedList = [];

        // Reset footer totals
        this.vNetAmount = 0;
        this.vPaidAmount = 0;
        this.vBalanceAmount = 0;
        this.vTDSAmount = 0;
        this.vUPINO = '';
        this.OPMultipleSettlForm.get('UPINO')?.reset();
        this.OPMultipleSettlForm.get('bankName')?.reset(0);

        // Clear table
        this.dsMultiplepayList.data = [];
    }

    selection = new SelectionModel<MultiplePayList>(true, []);
    SelectedList: any = [];

    // masterToggle() {
    //     debugger;

    //     if (this.isAllSelected() || this.isSomeSelected()) {
    //         // Unselect all
    //         this.selection.clear();
    //         this.SelectedList = [];
    //         this.vNetAmount = 0;
    //         this.vPaidAmount = 0;
    //         this.vBalanceAmount = 0;
    //         this.vTDSAmount = 0;

    //         this.dsMultiplepayList.data.forEach(element => {
    //             if (element._origBalanceAmt !== undefined) {
    //                 element.PaidAmount = 0;
    //                 element.balanceAmt = element._origBalanceAmt;
    //                 element.netAmount = element._origNetAmt;
    //             }
    //             element.tds = 0;
    //             element.CompanyDisc = 0;
    //         });

    //     } else {
    //         // Select all
    //         this.SelectedList = [];
    //         this.vNetAmount = 0;
    //         this.vPaidAmount = 0;
    //         this.vBalanceAmount = 0;
    //         this.vTDSAmount = 0;

    //         this.dsMultiplepayList.data.forEach(element => {
    //             this.selection.select(element);

    //             if (element._origPaidAmount === undefined && element._origBalanceAmt === undefined && element._origNetAmt !== undefined) {
    //                 element._origPaidAmount = element.PaidAmount ?? 0;
    //                 element._origBalanceAmt = element.balanceAmt;
    //                 element.netAmount = element._origNetAmt;
    //             }

    //             element.PaidAmount = element.balanceAmt;
    //             element.balanceAmt = 0;
    //             element.tds = 0;
    //             element.CompanyDisc = 0;

    //             element.netAmount = this.roundAmount(
    //                 element.billAmount - (element.discAmount ?? 0) - (element.CompanyDisc ?? 0)
    //             );

    //             this.SelectedList.push(element);
    //             this.vNetAmount += element.billAmount;
    //             this.vPaidAmount += element.PaidAmount;
    //             this.vBalanceAmount += element.balanceAmt;
    //             this.vTDSAmount += element.tds;
    //         });
    //     }

    //     // Refresh the table view
    //     this.dsMultiplepayList.data = [...this.dsMultiplepayList.data];
    //     console.log(this.SelectedList);
    // }
    masterToggle() {
        debugger;

        if (this.isAllSelected() || this.isSomeSelected()) {
            
            this.selection.clear();
            this.SelectedList = [];
            this.vNetAmount = 0;
            this.vPaidAmount = 0;
            this.vBalanceAmount = 0;
            this.vTDSAmount = 0;

            this.dsMultiplepayList.data.forEach(element => {
                // Restore original values if present
                if (element._origBalanceAmt !== undefined) {
                    element.PaidAmount = element._origPaidAmount ?? 0;
                    element.balanceAmt = element._origBalanceAmt ?? 0;
                    element.netAmount = element._origNetAmt ?? element.netAmount;
                } else {
                    element.PaidAmount = 0;
                }
                element.tds = 0;
                element.CompanyDisc = 0;
            });

        } else {
            // 🟢 Select all
            this.SelectedList = [];
            this.vNetAmount = 0;
            this.vPaidAmount = 0;
            this.vBalanceAmount = 0;
            this.vTDSAmount = 0;

            this.dsMultiplepayList.data.forEach(element => {
                this.selection.select(element);

                if (element._origPaidAmount === undefined || element._origBalanceAmt === undefined || element._origNetAmt === undefined) {
                    element._origPaidAmount = element.PaidAmount ?? 0;
                    element._origBalanceAmt = element.balanceAmt ?? 0;
                    element._origNetAmt = element.netAmount ?? 0;
                }

                element.PaidAmount = element.balanceAmt ?? 0;
                element.balanceAmt = 0;
                element.tds = 0;
                element.CompanyDisc = 0;

                element.netAmount = this.roundAmount(
                    element.billAmount - (element.discAmount ?? 0) - (element.CompanyDisc ?? 0)
                );
                this.SelectedList.push(element);
                this.vNetAmount += element.billAmount ?? 0;
                this.vPaidAmount += element.PaidAmount ?? 0;
                this.vBalanceAmount += element.balanceAmt ?? 0;
                this.vTDSAmount += element.tds ?? 0;
            });
        }

        this.dsMultiplepayList.data = [...this.dsMultiplepayList.data];
        console.log(this.SelectedList);
    } 
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dsMultiplepayList.data.length;

        return numSelected === numRows;
    }
    isSomeSelected() {
        return this.selection.selected.length > 0;
    }

    OnSelectPayment(event, element) {
        // debugger
        if (event.checked) {

            if (element._origPaidAmount === undefined && element._origBalanceAmt === undefined && element._origNetAmt === undefined) {
                element._origPaidAmount = element.PaidAmount ?? 0;
                element._origBalanceAmt = element.balanceAmt;
                element._origNetAmt = element.netAmount ?? 0;
            }

            // ✅ Your swap logic
            element.PaidAmount = element.balanceAmt; //here for paid i pass balAmt & viceversa in html
            element.balanceAmt = 0;
            element.tds = 0;
            element.CompanyDisc = 0;

            element.netAmount = this.roundAmount(element.billAmount - (element.discAmount ?? 0) - (element.CompanyDisc ?? 0));

            if (this.SelectedList.length > 0) {
                this.SelectedList.push(element)
            } else {
                this.SelectedList.push(element)
            }

            this.vNetAmount = this.roundAmount(this.vNetAmount + element.billAmount);
            this.vPaidAmount = this.roundAmount(this.vPaidAmount + element.PaidAmount);
            this.vBalanceAmount = this.roundAmount(this.vBalanceAmount + element.balanceAmt);
            this.vTDSAmount = this.roundAmount(this.vTDSAmount + element.tds);
        }
        else {

            if (element._origPaidAmount !== undefined && element._origBalanceAmt !== undefined && element._origNetAmt !== undefined) {
                element.PaidAmount = 0;
                element.balanceAmt = element._origBalanceAmt;
                element.netAmount = element._origNetAmt;
            }
            element.CompanyDisc = 0;
            element.tds = 0;

            let index = this.SelectedList.indexOf(element);
            if (index >= 0) {
                this.SelectedList.splice(index, 1);
            }

            this.vNetAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + x.billAmount, 0)
            );
            this.vPaidAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + x.PaidAmount, 0)
            );
            this.vBalanceAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + x.balanceAmt, 0)
            );
            this.vTDSAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + (x.tds || 0), 0)
            );
            this.dsMultiplepayList.data = [...this.dsMultiplepayList.data];
        }
        console.log(this.SelectedList)
    }
    roundAmount(value: number, decimals: number = 1): number {
        return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
    }

    opMulSettFormReset() {
        this.regNo = "0"
        this.RegId2 = "0"
        this.regNo2 = "0"
        this.getmultiplePaymentList();
    }

    OnReset() {
        this.vNetAmount = 0;
        this.vPaidAmount = 0;
        this.vTDSAmount = 0;
        this.vBalanceAmount = 0;
        this.SelectedList = [];
        this.selection.clear();
    }

    OnClose() {
        this.vNetAmount = 0;
        this.vPaidAmount = 0;
        this.vTDSAmount = 0;
        this.vBalanceAmount = 0;
        this.SelectedList = [];
        this.OPMultipleSettlForm.get('UPINO').setValue('')
        this.OPMultipleSettlForm.get('bankName').setValue(0)
        this.selection.clear();
    }

    BankId = 0
    BankNam: any;
    selectChangebank(event) {
        console.log(event)
        this.BankId = event.value
        this.BankNam = event.text
    }

    CurrentDate = new Date()
    OnSave() {
        if ((this.vPaidAmount == 0 && this.vNetAmount == 0)) {
            this.toastr.warning('Please select Check Box', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.OPMultipleSettlForm.get('UPINO').value == undefined) {
            this.toastr.warning('Please Enter UPINO', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.OPMultipleSettlForm.get('bankName').value == "") {
            this.toastr.warning('Please select Bank Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        } 

        debugger
        console.log(this.OPMultipleSettlLoopInsertForm.value)
        if (!this.OPMultipleSettlLoopInsertForm.invalid) {
            const upiNoValue = this.OPMultipleSettlForm.get('UPINO').value;

            this.OPMulSetLoopArray.clear();
            this.SelectedList.forEach(item => {
                const formGroup = this.CreateOPMultipleSettlLoopInsertForm(item);
                formGroup.get('neftno').setValue(upiNoValue);
                this.OPMulSetLoopArray.push(formGroup);
            })

            this.OPMulSetBillLoopArray.clear();
            this.SelectedList.forEach(item => {
                this.OPMulSetBillLoopArray.push(this.CreateOPMultipleSettlBillLoopInsertForm(item))
            });

                //       let ModePaymentObj = [];
                //   this.SelectedList.forEach(item => {
                //  ModePaymentObj.push({
                //     paymentId: 0,
                //     unitId: this.accountService.currentUserValue.user.unitId,
                //     billNo: 0,
                //     opdipdtype: 0,
                //     paymentDate: formattedDate,
                //     paymentTime: formattedTime,
                //     payAmount: this.OPFooterForm.get('netPayableAmt')?.value ?? 0,
                //     tranNo: this.OPMultipleSettlForm.get('UPINO').value || 0,
                //     bankName: "",
                //     validationDate: this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
                //     advanceUsedAmount: 0,
                //     comments: "",
                //     payMode: "Cash",
                //     onlineTranNo: "0",
                //     onlineTranResponse: "0",
                //     companyId: this.patientDetail?.CompanyId ?? 0,
                //     advanceId: 0,
                //     refundId: 0,
                //     cashCounterId: 0,
                //     transactionType: 0,
                //     isSelfOrcompany: this.patientDetail?.CompanyId ? 1 : 0,
                //     tranMode: "Cash",
                //     isCancelled: false,
                //     isCancelledBy: 0,
                //     isCancelledDate: "1999-01-01",
                //     createdBy: this.accountService.currentUserValue?.userId ?? 0
                // }); 

                //    this.OPMulModePaymentArray.clear(); 
                //                         ModePaymentObj.forEach(item => {
                //                         this.OPMulModePaymentArray.push(this.CreateModePaymentform(item));
                //                         });  

            console.log(this.OPMultipleSettlLoopInsertForm.value)
            this._CompanysettlementService.InsertOPMultiplesettlement(this.OPMultipleSettlLoopInsertForm.value).subscribe(response => {
                this.getmultiplePaymentList();
                this.OnClose();
                // this.viewgetOPPayemntPdf(response, true);
            });
        } else {
            const invalidFields = this.getInvalidFields(this.OPMultipleSettlLoopInsertForm);

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
            }
        }
    }

    private getInvalidFields(form: AbstractControl, path: string = ''): string[] {
        let invalidFields: string[] = [];

        if (form instanceof FormGroup) {
            Object.keys(form.controls).forEach(key => {
                const control = form.get(key);
                if (control) {
                    invalidFields = invalidFields.concat(
                        this.getInvalidFields(control, path ? `${path} -> ${key}` : key)
                    );
                }
            });
        }
        else if (form instanceof FormArray) {
            form.controls.forEach((control, index) => {
                invalidFields = invalidFields.concat(
                    this.getInvalidFields(control, `${path}[${index + 1}]`)
                );
            });
        }
        else if (form.invalid) {
            invalidFields.push(path);
        }

        return invalidFields;
    }
}

export class MultiplePayList {
    billDate: any;
    pBillNo: string;
    totalAmt: number;
    concessionAmt: number;
    netPayableAmt: any;
    paidAmount: any;
    PaidAmount: any;
    balanceAmt: any;
    companyName: any;
    patientName: any;
    regNo: any;
    netAmount: any;
    billAmount: any;
    tds: any;
    _origPaidAmount: any;
    _origBalanceAmt: any;
    _origNetAmt: any;
    discAmount: any;
    CompanyDisc: any;
    billNo: any;

    constructor(MultiplePayList) {
        {
            this.billDate = MultiplePayList.billDate || 0;
            this.pBillNo = MultiplePayList.pBillNo || '';
            this.totalAmt = MultiplePayList.totalAmt || 0;
            this.concessionAmt = MultiplePayList.concessionAmt || 0;
            this.netPayableAmt = MultiplePayList.netPayableAmt || 0;
            this.paidAmount = MultiplePayList.paidAmount || 0;
            this.PaidAmount = MultiplePayList.PaidAmount || 0
            this.balanceAmt = MultiplePayList.balanceAmt || '';
            this.companyName = MultiplePayList.companyName || '';
            this.patientName = MultiplePayList.patientName || '';
            this.regNo = MultiplePayList.regNo || 0;
            this.netAmount = MultiplePayList.netAmount || 0
            this.tds = MultiplePayList.tds || 0
            this.billAmount = MultiplePayList.billAmount || 0
            this._origPaidAmount = MultiplePayList._origPaidAmount || 0
            this._origBalanceAmt = MultiplePayList._origBalanceAmt || 0
            this._origNetAmt = MultiplePayList._origNetAmt || 0
            this.discAmount = MultiplePayList.discAmount || 0
            this.CompanyDisc = MultiplePayList.CompanyDisc || 0
            this.billNo = MultiplePayList.billNo || 0
        }
    }
}
