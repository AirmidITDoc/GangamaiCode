import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { DatePipe } from '@angular/common';
import { AbstractControl, FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { ConfigService } from 'app/core/services/config.service';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../Admission/admission/admission.component';
import { DiscountAfterFinalBillComponent } from '../ip-search-list/discount-after-final-bill/discount-after-final-bill.component';
import { IpPaymentInsert } from '../ip-search-list/ip-advance/ip-advance.component';
import { IPSettlementService } from './ip-settlement.service';


@Component({
    selector: 'app-ip-settlement',
    templateUrl: './ip-settlement.component.html',
    styleUrls: ['./ip-settlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {
    displayedColumns = [
        'CheckBox',
        'BillDate',
        'PBillNo',
        'uhid',
        'patientName',
        'BillAmount',
        'ConsessionAmt',
        'CompanyDiscAmt',
        'NetAmount',
        'balAmount',
        'PaidAmount',
        'tds',
        'companyName',
        'action',
    ];
    searchFormGroup: FormGroup;
    myFormGroup: FormGroup;
    IPMultipleSettlForm: FormGroup;
    ipMultiSaveForm: FormGroup;
    IPBillMyForm: FormGroup;
    RegId1 = "0";
    RegId2 = "0";
    CompanyId = "0"
    BillNo: any;
    vpaidamt: any = 0;
    regNo2: any = 0;
    currency: any = '';
    vbalanceamt: any = 0;
    // registerObj = new RegInsert({});
    registerObj: any;
    vNetAmount: any = 0;
    vPaidAmount: any = 0;
    vTDSAmount: any = 0;
    vBalanceAmount: any = 0;
    isSearchTriggered = false;
    UserDiscApplyPer : boolean =false;
    vUPINO: any;
    autocompleteModebank: string = "Bank";
    PatientName: any;
    AdmissionId: any = 0;
    dsMultiplepayList = new MatTableDataSource<MultiplePayList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    autocompleteModecompany: string = "Company";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionsTemplate2') actionsTemplate2!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'companyId')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.actionsTemplate2;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    AllColumns = [
        {
            heading: "-", key: "companyId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
            template: this.actionsTemplate, width: 50
        },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company DiscAmt", key: "compDiscAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amt", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Bill,
        apiUrl: "IPBill/IPBillList",
        columnsList: this.AllColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "RegId", fieldValue: String(this.RegId1), opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _IPSettlementService: IPSettlementService,
        private commonService: PrintserviceService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public _configService: ConfigService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public formBuilder: UntypedFormBuilder,) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.IPBillMyForm = this.CreateIPBillForm();
        this.ipMultiSaveForm = this.CreateIPMultipleSettlInsertForm();

        this.IPMultipleSettlForm = this._IPSettlementService.CreateIPMultiplpeSettlForm();
        // 🔹 Auto refresh when Company is cleared
        this.IPMultipleSettlForm.get('CompanyId')?.valueChanges.subscribe(value => {
            if (!value || value === '0' || value === '') {
                if (this.isSearchTriggered) {  // only clear if user had searched
                    this.dsMultiplepayList.data = []; // clear table
                }
            }
        });

        // 🔹 Auto refresh when Patient is cleared
        this.IPMultipleSettlForm.get('RegId')?.valueChanges.subscribe(value => {
            if (!value || value === '0' || value === '') {
                this.RegId2 = "0";
                if (this.isSearchTriggered) {  // only clear if user had searched
                    this.dsMultiplepayList.data = []; // clear table
                }
            }
        });
        // this.getmultiplePaymentList(true);
        //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._configService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue

         // this.getmultiplePaymentList(true);
        const access = this._configService.userAccessParam.find(x => x.AccessValueName === 'DiscApplyPer');
        this.UserDiscApplyPer = access?.AccessValue;
    }
    BankId = 0
    BankNam: any;
    selectChangebank(event) {
        console.log(event)
        this.BankId = event.value
        this.BankNam = event.text
    }
    GetDetails(RegId1) {
        this.gridConfig = {
            apiUrl: "IPBill/IPBillList",
            columnsList: this.AllColumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [
                { fieldName: "RegId", fieldValue: String(RegId1), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    getSelectedObjIP(obj) {
        if ((obj.regID ?? 0) > 0) {
            this.registerObj = obj;
            console.log("this.registerObj patient:", this.registerObj)
            console.log("Admitted patient:", obj)
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
    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    }
    //IP bill save form 
    CreateIPBillForm(): FormGroup {
        return this.formBuilder.group({
            //Payment form
            payment: this.formBuilder.group({
                paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
                opdipdType: [3, [this._FormvalidationserviceService.onlyNumberValidator()]],
                neftpayAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                neftdate: ['1999-01-01'],
                payTmamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
                payTmdate: ['1999-01-01'],
                tdsAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                unitId: [this.accountService.currentUserValue.user.unitId, [this._FormvalidationserviceService.onlyNumberValidator()]],
                wfamount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            }),
            // BIll update
            billupdate: this.formBuilder.group({
                billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            // Advance details update in array
            advanceDetailupdate: this.formBuilder.array([]),
            // Advacne header update
            advanceHeaderupdate: this.formBuilder.group({
                advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
                advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
                balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            }),
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([])
        });
    }
    createAdvanceUpdate(item: any): FormGroup {
        return this.formBuilder.group({
            advanceDetailID: [item?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            usedAmount: [item?.UsedAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            balanceAmount: [item?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
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
    // Getters  
    get AdvacnedetUpdateArray(): FormArray {
        return this.IPBillMyForm.get('advanceDetailupdate') as FormArray;
    }
    get ModeOfPaymentsArray(): FormArray {
        return this.IPBillMyForm.get('tPayments') as FormArray;
    }
    vIPDNo = ''
    getSelectedObj(obj) {
        console.log(obj)
        this.RegId1 = obj.regID;
        this.registerObj = obj;
        this.vIPDNo = obj.ipdNo
        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
        console.log("this Regissyerobj : " + this.registerObj);
        this.GetDetails(this.RegId1)
    }
    openPaymentpopup(contact) {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName || '';
        PatientHeaderObj['AdvanceAmount'] = contact?.balanceAmt || 0;
        PatientHeaderObj['NetPayAmount'] = contact?.balanceAmt || 0;
        PatientHeaderObj['BillNo'] = contact?.billNo || 0;
        PatientHeaderObj['OPD_IPD_Id'] = contact?.opdipdid;
        PatientHeaderObj['IPDNo'] = contact?.ipdNo || '';
        PatientHeaderObj['RegNo'] = contact?.regNo || 0;
        PatientHeaderObj['DoctorName'] = contact?.doctorName || '';
        PatientHeaderObj['CompanyName'] = contact?.companyName || '';
        PatientHeaderObj['CompanyId'] = contact?.companyId || 0;
        PatientHeaderObj['DepartmentName'] = contact?.departmentName || '';
        PatientHeaderObj['Age'] = this.registerObj.age || 0;
        PatientHeaderObj['TransactionLabel'] = 'IP_SETTLEMENT'

        const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
            {
                maxWidth: "80vw",
                height: '750px',
                width: '80%',
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "IP-SETTLEMENT",
                    advanceObj: PatientHeaderObj,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result && result.IsSubmitFlag) {
                let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
                UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;

                this.IPBillMyForm.get('billupdate.billNo').setValue(contact.billNo)
                this.IPBillMyForm.get('billupdate.balanceAmt').setValue(result.BalAmt)

                this.AdvacnedetUpdateArray.clear();
                UpdateAdvanceDetailarr1.forEach(item => {
                    this.AdvacnedetUpdateArray.push(this.createAdvanceUpdate(item));
                });
                let AdvanceBalAmt = 0;
                let AdvanceUsedAmt = 0;
                if (UpdateAdvanceDetailarr1.length > 0) {
                    UpdateAdvanceDetailarr1.forEach(element => {
                        AdvanceUsedAmt = AdvanceUsedAmt + element.UsedAmount
                        AdvanceBalAmt = AdvanceBalAmt + element.BalanceAmount
                        this.IPBillMyForm.get('advanceHeaderupdate.advanceId')?.setValue(element.AdvanceId)
                        this.IPBillMyForm.get('advanceHeaderupdate.advanceUsedAmount')?.setValue(AdvanceUsedAmt)
                        this.IPBillMyForm.get('advanceHeaderupdate.balanceAmount')?.setValue(AdvanceBalAmt)
                    })
                }

                this.IPBillMyForm.get('payment').setValue(result.submitDataPay.ipPaymentInsert)
                this.ModeOfPaymentsArray.clear();
                result.submitDataPay.ipModePaymentInsert.forEach(item => {
                    this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
                });
                console.log(this.IPBillMyForm.value);
                this._IPSettlementService.InsertIPSettlementPayment(this.IPBillMyForm.value).subscribe(response => {
                    this.GetDetails(this.RegId1)
                    this.viewgetIPPayemntPdf(response)
                    this.reset();
                });
            }
        });
        this.searchFormGroup.get('RegId').setValue('')
    }
    viewgetIPPayemntPdf(paymentId) {
        this.commonService.Onprint("PaymentId", paymentId, "IpPaymentReceipt");
    }
    reset() {
        this.searchFormGroup.reset();
        this.PatientName = '';
        this.registerObj = new RegInsert({});
    }
    // Multiple settlement part------------------------------------------------------------------------------
    getSelectedObj1(obj) {
        console.log(obj)
        this.RegId1 = obj.regID;
        this.regNo2 = obj.regNo
        this.registerObj = obj;
        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
        this.getmultiplePaymentListNew();
    }
    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId = value.value
        else
            this.CompanyId = "0"

        this.getmultiplePaymentListNew();
    }
    getmultiplePaymentListNew(validate = true) {
        this.CompanyId = String(this.IPMultipleSettlForm.get('CompanyId').value)
        this.RegId2 = this.IPMultipleSettlForm.get('RegId')?.value?.regID || 0

        if (validate &&
            (this.CompanyId === "0" || this.CompanyId === "" || this.CompanyId === null) &&
            (this.RegId2 === "0" || this.RegId2 === "" || this.RegId2 === undefined)) {
            this.toastr.warning('Please select either a Company or a Patient before searching.');
            this.dsMultiplepayList.data = []; // keep list empty
            return;
        }
        this.isSearchTriggered = true;
        let fromDate = this.IPMultipleSettlForm.get("fromDate").value || "";
        let toDate = this.IPMultipleSettlForm.get("enddate").value || "";
        fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
        toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
        const vdata = {
            "first": 0,
            "rows": 999,
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
                    "fieldValue": String(this.regNo2), //"1",
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
                    "fieldValue": String(this.CompanyId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "OPIPType",
                    "fieldValue": "1",
                    "opType": "Contains"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }
        console.log(vdata)
        this._IPSettlementService.getmultiplePayList(vdata).subscribe((data) => {
            this.dsMultiplepayList.data = data.data as MultiplePayList[];
            console.log(this.dsMultiplepayList.data)
            this.dsMultiplepayList.sort = this.sort;
            this.dsMultiplepayList.paginator = this.paginator;
        });
    }
    selection = new SelectionModel<MultiplePayList>(true, []);
    SelectedList: any = [];
    // masterToggle() {
    //     debugger
    //     if (this.isSomeSelected()) {
    //         this.vNetAmount = 0;
    //         this.vPaidAmount = 0;
    //         this.vBalanceAmount = 0;
    //         this.vTDSAmount = 0;
    //         this.selection.clear();
    //         this.SelectedList = [];

    //           this.dsMultiplepayList.data.forEach(element => { 
    //         if (element.paidAmount  && element.balanceAmt == 0) {
    //             element.paidAmount = 0;
    //             element.balanceAmt = element.paidAmount;
    //             element.netAmount = element.paidAmount;
    //         }
    //     });
    //     } else {
    //         this.isAllSelected()
    //             ? this.selection.clear()
    //             : this.dsMultiplepayList.data.forEach(row => this.selection.select(row));

    //         this.dsMultiplepayList.data.forEach(element => { 
    //                     // ✅ Your swap logic
    //         element.paidAmount = element.balanceAmt; //here for paid i pass balAmt & viceversa in html
    //         element.balanceAmt = 0;
    //         element.tds = 0;
    //         element.CompanyDisc = 0;

    //         element.netAmount = this.roundAmount(element.billAmount - (element.discAmount ?? 0) - (element.CompanyDisc ?? 0));


    //             console.log(element)
    //             this.vNetAmount += element?.billAmount || 0
    //             this.vPaidAmount += element?.paidAmount || 0
    //             this.vBalanceAmount += element?.balanceAmt || 0
    //             this.vTDSAmount += element.tds ?? 0;
    //             this.SelectedList.push(element)
    //         })

    //     }
    //     this.SelectedList.push(this.selection.selected);
    //     console.log(this.SelectedList)
    // }
masterToggle() {
    this.vNetAmount = 0;
    this.vPaidAmount = 0;
    this.vBalanceAmount = 0;
    this.vTDSAmount = 0;
    this.SelectedList = [];

    if (this.isSomeSelected()) {

        this.selection.clear();

        this.dsMultiplepayList.data.forEach(element => {

            // Restore values
            element.balanceAmt = element.paidAmount || 0;
            element.paidAmount = 0;
            element.netAmount = 0;
            element.tds = 0;
            element.CompanyDisc = 0;
        });

    } else {

        this.dsMultiplepayList.data.forEach(row => this.selection.select(row));

        this.dsMultiplepayList.data.forEach(element => {

            // Move Balance to Paid
            element.paidAmount = element.balanceAmt || 0;
            element.balanceAmt = 0;
            element.tds = 0;
            element.CompanyDisc = 0;

            element.netAmount = this.roundAmount(
                (element.billAmount || 0) -
                (element.discAmount || 0) -
                (element.CompanyDisc || 0)
            );

            this.vNetAmount += element.netAmount || 0;
            this.vPaidAmount += element.paidAmount || 0;
            this.vBalanceAmount += element.balanceAmt || 0;
            this.vTDSAmount += element.tds || 0;

            this.SelectedList.push(element);
        });
    }

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
                element._origPaidAmount = element.paidAmount ?? 0;
                element._origBalanceAmt = element.balanceAmt;
                element._origNetAmt = element.netAmount ?? 0;
            }

            // ✅ Your swap logic
            element.paidAmount = element.balanceAmt; //here for paid i pass balAmt & viceversa in html
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
            this.vPaidAmount = this.roundAmount(this.vPaidAmount + element.paidAmount);
            this.vBalanceAmount = this.roundAmount(this.vBalanceAmount + element.balanceAmt);
            this.vTDSAmount = this.roundAmount(this.vTDSAmount + element.tds);
        }
        else {

            if (element._origPaidAmount !== undefined && element._origBalanceAmt !== undefined && element._origNetAmt !== undefined) {
                element.paidAmount = 0;
                element.balanceAmt = element._origBalanceAmt;
                element.netAmount = element._origNetAmt;
            }
            element.CompanyDisc = 0;
            element.tds = 0;

            const index = this.SelectedList.indexOf(element);
            if (index >= 0) {
                this.SelectedList.splice(index, 1);
            }

            this.vNetAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + x.billAmount, 0)
            );
            this.vPaidAmount = this.roundAmount(
                this.SelectedList.reduce((sum, x) => sum + x.paidAmount, 0)
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
            element.paidAmount = this.roundAmount(origPaid);
            this.recalculateTotals();
            return;
        }

        element.paidAmount = this.roundAmount(origPaid - tdsValue);

        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.netAmount || 0), 0)
        );

        this.vTDSAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.tds || 0), 0)
        );

        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.paidAmount || 0), 0)
        );

        this.vBalanceAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.balanceAmt || 0), 0)
        );
    }
    recalculateTotals() {
        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.netAmount || 0), 0)
        );

        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.paidAmount || 0), 0)
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
            this.SelectedList.reduce((sum, x) => sum + x.paidAmount, 0)
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

    CreateIPMultipleSettlInsertForm() {
        return this.formBuilder.group({
            payment: this.formBuilder.array([]),
            // ✅ Fixed: should be FormArray 
            billUpdate: this.formBuilder.array([]),
            // ✅ Fixed: should be FormArray
            tPayments: this.formBuilder.array([]),
        })
    }
    CreateIPMultipleSettlLoopInsertForm(element: any = {}): FormGroup {
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
            opdipdType: [1],
            neftpayAmount: [element.paidAmount, [this._FormvalidationserviceService.onlyNumberValidator()]],
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
    CreateMultipleModePaymentform(item: any): FormGroup {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        return this.formBuilder.group({
            paymentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            unitId: [this.accountService.currentUserValue.user.unitId],
            billNo: [item?.billNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
            opdipdtype: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
            paymentDate: [formattedDate],
            paymentTime: [formattedTime],
            payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            validationDate: [formattedDate],
            advanceUsedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            comments: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            onlineTranResponse: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            cashCounterId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            tranMode: ['HOSP', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
            createdBy: [this.accountService.currentUserValue.userId],
            transactionLabel: ['IP_SETTLEMENT', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        });
    }
    CreateIPMultipleSettlBillLoopInsertForm(element: any = {}): FormGroup {
        return this.formBuilder.group({
            // billUpdate: this.formBuilder.group({
            billNo: [element.billNo, [this._FormvalidationserviceService.onlyNumberValidator()]],
            balanceAmt: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
            // })
        })
    }
    get IPMulSetLoopArray(): FormArray {
        return this.ipMultiSaveForm.get('payment') as FormArray;
    }
    get ModeOfPaymentsMultipleArray(): FormArray {
        return this.ipMultiSaveForm.get('tPayments') as FormArray;
    }

    get IPMulSetBillLoopArray(): FormArray {
        return this.ipMultiSaveForm.get('billUpdate') as FormArray;
    }
    CurrentDate = new Date()
    // OnSave1() {
    //     if ((this.vPaidAmount == 0 && this.vNetAmount == 0)) {
    //         this.toastr.warning('Please select Check Box', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     debugger 
    //     let PatientHeaderObj = {};
    //     PatientHeaderObj['Date'] = this.datePipe.transform(this.CurrentDate, 'dd/MM/YYYY') || '01/01/1900'
    //     PatientHeaderObj['NetPayAmount'] = this.vNetAmount;
    //     const dialogRef = this._matDialog.open(OpPaymentComponent,
    //         {
    //             maxWidth: "80vw",
    //             height: '750px',
    //             width: '80%',
    //             data: {
    //                 vPatientHeaderObj: PatientHeaderObj,
    //                 FromName: "OP-SETTLEMENT"
    //             }
    //         });
    //     dialogRef.afterClosed().subscribe(result => {
    //         debugger
    //         console.log("payment:", result)

    //     });
    // }
    OnSave() {
        if ((this.vPaidAmount == 0 && this.vNetAmount == 0)) {
            this.toastr.warning('Please select Check Box', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.IPMultipleSettlForm.get('UPINO').value == undefined) {
            this.toastr.warning('Please Enter UPINO', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.IPMultipleSettlForm.get('bankName').value == "") {
            this.toastr.warning('Please select Bank Name', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        debugger

        if (!this.IPMultipleSettlForm.invalid) {
            const upiNoValue = this.IPMultipleSettlForm.get('UPINO').value;

            this.IPMulSetLoopArray.clear();
            this.SelectedList.forEach(item => {
                const formGroup = this.CreateIPMultipleSettlLoopInsertForm(item);
                formGroup.get('neftno').setValue(upiNoValue);
                this.IPMulSetLoopArray.push(formGroup);
            })

            this.IPMulSetBillLoopArray.clear();
            this.SelectedList.forEach(item => {
                this.IPMulSetBillLoopArray.push(this.CreateIPMultipleSettlBillLoopInsertForm(item))
            });

            const ModePaymentObj = [];
            this.SelectedList.forEach(item => {
                ModePaymentObj.push({
                    billNo: item?.billNo,
                    payAmount: item?.paidAmount,
                    tranNo: this.IPMultipleSettlForm.get('UPINO').value || 0,
                    bankName: this.BankNam,
                    payMode: "net banking",
                    companyId: item?.companyId ?? 0,
                    isSelfOrcompany: item?.companyId ? 1 : 0,
                });
            })

            this.ModeOfPaymentsMultipleArray.clear();
            ModePaymentObj.forEach(item => {
                this.ModeOfPaymentsMultipleArray.push(this.CreateMultipleModePaymentform(item));
            });
            console.log(this.ipMultiSaveForm.value)
            this._IPSettlementService.InsertIPMultiplesettlement(this.ipMultiSaveForm.value).subscribe(response => {
                this.getmultiplePaymentListNew();
                this.OnReset();
                // this.viewgetOPPayemntPdf(response, true);
            });
        } else {
            const invalidFields = this.getInvalidFields(this.ipMultiSaveForm);
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning');
                });
            }
        }
    }

    OnReset() {
        this.vNetAmount = 0;
        this.vPaidAmount = 0;
        this.vTDSAmount = 0;
        this.vBalanceAmount = 0;
        this.SelectedList = [];
        this.selection.clear();
        this.regNo2 = 0;
    }
    IpMulSettFormReset() {
        this.RegId2 = "0"
        this.regNo2 = "0"
        this.getmultiplePaymentListNew();
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
    discAmount:any;
      CompanyDisc:any;
            _origPaidAmount:any; 
                        _origNetAmt:any;
                              _origBalanceAmt:any;

 
    constructor(MultiplePayList) {
        {
            this.billDate = MultiplePayList.billDate || 0;
              this._origNetAmt = MultiplePayList._origNetAmt || 0;
                 this._origBalanceAmt = MultiplePayList._origBalanceAmt || 0;
            this._origPaidAmount = MultiplePayList._origPaidAmount || 0;
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
            this.discAmount = MultiplePayList.discAmount || 0
            this.tds = MultiplePayList.tds || 0
            this.billAmount = MultiplePayList.billAmount || 0
             this.CompanyDisc = MultiplePayList.CompanyDisc || 0
        }
    }
}
