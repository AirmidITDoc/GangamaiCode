import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';

import { DatePipe } from '@angular/common';
import { FormArray, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../Admission/admission/admission.component';
import { IPSettlementService } from './ip-settlement.service';
import { IpPaymentInsert } from '../ip-search-list/ip-advance/ip-advance.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { DiscountAfterFinalBillComponent } from '../ip-search-list/discount-after-final-bill/discount-after-final-bill.component';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';


@Component({
    selector: 'app-ip-settlement',
    templateUrl: './ip-settlement.component.html',
    styleUrls: ['./ip-settlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {
    searchFormGroup: FormGroup
    myFormGroup: FormGroup
    IPMultipleSettlForm: FormGroup
    RegId1 = "0";
    RegId2 = "0";
    CompanyId = "0"
    BillNo: any;
    vpaidamt: any = 0;
    vbalanceamt: any = 0;
    registerObj = new RegInsert({});
    PatientName: any;
    AdmissionId: any = 0;
    dsMultiplepayList = new MatTableDataSource<MultiplePayList>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
    vNetAmount: any = 0;
    vPaidAmount: any = 0;
    vBalanceAmount: any = 0;
    isSearchTriggered = false;
    autocompleteModecompany: string = "Company";

    displayedColumns = [
        'CheckBox',
        'BillDate',
        'PBillNo',
        'uhid',
        'patientName',
        'BillAmount',
        'ConsessionAmt',
        'NetAmount',
        'balAmount',
        'PaidAmount',
        'tds',
        'companyName',
        'action',
    ];

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
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillDate", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ConsessionAmt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "BalanceAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]
    gridConfig: gridModel = {
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
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public formBuilder: UntypedFormBuilder,) { }

    ngOnInit(): void {
        this.searchFormGroup = this.createSearchForm();
        this.IPBillMyForm = this.CreateIPBillForm();

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
        this.getmultiplePaymentList(true);
    }
    createSearchForm() {
        return this.formBuilder.group({
            RegId: 0,
            AppointmentDate: [(new Date()).toISOString()],
        });
    }
    IPBillMyForm: FormGroup;
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
        });
    }
    createAdvanceUpdate(item: any): FormGroup {
        return this.formBuilder.group({
            advanceDetailID: [item?.AdvanceDetailID ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            usedAmount: [item?.UsedAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            balanceAmount: [item?.BalanceAmount ?? 0, [, this._FormvalidationserviceService.AllowDecimalNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        });
    }
    // Getters  
    get AdvacnedetUpdateArray(): FormArray {
        return this.IPBillMyForm.get('advanceDetailupdate') as FormArray;
    }
    //    110193 
    getSelectedObj(obj) {
        console.log(obj)
        this.RegId1 = obj.regID;
        this.registerObj = obj;
        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
        // setTimeout(() => {
        //     this._IPSettlementService.getRegistraionById(this.RegId1).subscribe((response) => {
        //         this.registerObj = response;
        //         this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName

        //     });  
        // }, 500);                   "
        this.GetDetails(this.RegId1)
    }

    openPaymentpopup(contact) {
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['AdvanceAmount'] = contact.balanceAmt;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt;
        PatientHeaderObj['BillNo'] = contact.billNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdipdid;
        PatientHeaderObj['IPDNo'] = contact.ipdNo;
        PatientHeaderObj['RegNo'] = contact.regNo;
        PatientHeaderObj['DoctorName'] = contact.doctorName;
        PatientHeaderObj['CompanyName'] = contact.companyName;
        PatientHeaderObj['CompanyId'] = contact.companyId;
        PatientHeaderObj['DepartmentName'] = contact.departmentName;
        PatientHeaderObj['Age'] = this.registerObj.age;

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

    // Multiple settlement part

    getSelectedObj1(obj) {
        console.log(obj)
        this.RegId1 = obj.regID;
        this.registerObj = obj;
        this.PatientName = this.registerObj.firstName + ' ' + this.registerObj.middleName + ' ' + this.registerObj.lastName
        this.getmultiplePaymentList();
    }

    getmultiplePaymentList(validate = true) {
        this.CompanyId = String(this.IPMultipleSettlForm.get('CompanyId').value)
        this.RegId2 = this.IPMultipleSettlForm.get('RegId')?.value.value

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
        // var vdata = {
        //     "first": 0,
        //     "rows": 10,
        //     "sortField": "RegNo",
        //     "sortOrder": 0,
        //     "filters": [
        //         {
        //             "fieldName": "F_Name",
        //             "fieldValue": "%",
        //             "opType": "Equals"
        //         },
        //         {
        //             "fieldName": "L_Name",
        //             "fieldValue": "%",
        //             "opType": "Equals"
        //         },
        //         {
        //             "fieldName": "From_Dt",
        //             "fieldValue": fromDate, //"2024-01-01",
        //             "opType": "StartsWith"
        //         },
        //         {
        //             "fieldName": "To_Dt",
        //             "fieldValue": toDate, //"2025-01-01",
        //             "opType": "StartsWith"
        //         },
        //         {
        //             "fieldName": "Reg_No",
        //             "fieldValue": this.regNo2, //"1",
        //             "opType": "Contains"
        //         },
        //         {
        //             "fieldName": "PBillNo",
        //             "fieldValue": "0",
        //             "opType": "Contains"
        //         },
        //         {
        //             "fieldName": "ReceiptNo",
        //             "fieldValue": "0",
        //             "opType": "Contains"
        //         },
        //         {
        //             "fieldName": "CompanyId",
        //             "fieldValue": this.CompanyId,
        //             "opType": "Contains"
        //         }
        //     ],
        //     "exportType": "JSON",
        //     "columns": []
        // }
        // console.log(vdata)
        // this._IPSettlementService.getmultiplePayList(vdata).subscribe((data) => {
        //     this.dsMultiplepayList.data = data.data as MultiplePayList[];
        //     console.log(this.dsMultiplepayList.data)
        //     this.dsMultiplepayList.sort = this.sort;
        //     this.dsMultiplepayList.paginator = this.paginator;
        // });
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.CompanyId = value.value
        else
            this.CompanyId = "0"

        this.getmultiplePaymentList();
    }

    ipMulSettFormReset() {
        this.RegId2 = "0"
        this.getmultiplePaymentList();
    }

    onClear() {
    }

    OnReset() {
        this.vNetAmount = 0;
        this.vPaidAmount = 0;
        this.vBalanceAmount = 0;
        this.SelectedList = [];
        this.selection.clear();
    }

    selection = new SelectionModel<MultiplePayList>(true, []);
    SelectedList: any = [];
    masterToggle() {
        debugger
        if (this.isSomeSelected()) {
            this.vNetAmount = 0;
            this.vPaidAmount = 0;
            this.vBalanceAmount = 0;
            this.selection.clear();
            this.SelectedList = [];
        } else {
            this.isAllSelected()
                ? this.selection.clear()
                : this.dsMultiplepayList.data.forEach(row => this.selection.select(row));

            this.dsMultiplepayList.data.forEach(element => {
                console.log(element)
                this.vNetAmount += element.billAmount
                this.vPaidAmount += element.PaidAmount
                this.vBalanceAmount += element.balanceAmt
                this.SelectedList.push(element)
            })
        }
        this.SelectedList.push(this.selection.selected);
        console.log(this.SelectedList)
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
        debugger
        if (event.checked) {

            if (element._origPaidAmount === undefined && element._origBalanceAmt === undefined) {
                element._origPaidAmount = element.PaidAmount ?? 0;
                element._origBalanceAmt = element.balanceAmt;
            }

            // ✅ Your swap logic
            element.PaidAmount = element.balanceAmt; //here for paid i pass balAmt & viceversa in html
            element.balanceAmt = 0;
            // element.tds = 0;

            if (this.SelectedList.length > 0) {
                // if (!this.SelectedList.some(item => item.supplierName == element.supplierName)) {
                //   this.toastr.warning('Please select same supplier Name', 'Warning !', {
                //     toastClass: 'tostr-tost custom-toast-warning',
                //   });
                //   this.SelectedList = [];
                //   this.selection.clear()
                //   this.getSupplierPayStatusList();
                //   this._SupplierPaymentStatusService.SearchFormGroup.patchValue({
                //     NetAmount: '',
                //     PaidAmount: '',
                //     BalanceAmount: ''
                //   });
                //   this.vNetAmount = 0;
                //   this.vPaidAmount = 0;
                //   this.vBalanceAmount = 0;
                //   return;
                // }
                this.SelectedList.push(element)
            } else {
                this.SelectedList.push(element)
            }

            this.vNetAmount = this.roundAmount(this.vNetAmount + element.billAmount);
            this.vPaidAmount = this.roundAmount(this.vPaidAmount + element.PaidAmount);
            this.vBalanceAmount = this.roundAmount(this.vBalanceAmount + element.balanceAmt);
        }
        else {

            if (element._origPaidAmount !== undefined && element._origBalanceAmt !== undefined) {
                element.PaidAmount = 0;
                element.balanceAmt = element._origBalanceAmt;
            }
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
            element.PaidAmount = this.roundAmount(origPaid);
            return;
        }

        element.PaidAmount = this.roundAmount(origPaid - tdsValue);

        this.vNetAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.netAmount || 0), 0)
        );

        this.vPaidAmount = this.roundAmount(
            this.SelectedList.reduce((sum, x) => sum + (x.PaidAmount || 0), 0)
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

        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    CurrentDate = new Date()
    OnSave() {
        if ((this.vPaidAmount == 0 && this.vNetAmount == 0)) {
            this.toastr.warning('Please select Check Box', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        debugger

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.CurrentDate, 'dd/MM/YYYY') || '01/01/1900'
        PatientHeaderObj['NetPayAmount'] = this.vNetAmount;
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
            debugger
            console.log("payment:", result)
            // if (this.OPMultipleSettlInsertForm.valid) {
            //     console.log(this.OPMultipleSettlInsertForm.value)
            //     console.log(result.submitDataPay.ipPaymentInsert)

            //     // this._CompanysettlementService.InsertOPBillingsettlement(this.OpSettlementForm.value).subscribe(response => {
            //     //     // this.GetDetails(this.RegId1)
            //     //     // this.viewgetOPPayemntPdf(response, true);
            //     // });
            // } else {
            //     let invalidFields = []
            //     if (this.OPMultipleSettlInsertForm.invalid) {
            //         for (const controlName in this.OPMultipleSettlInsertForm.controls) {
            //             const control = this.OPMultipleSettlInsertForm.get(controlName);
            //             if (control instanceof FormGroup || control instanceof FormArray) {
            //                 for (const nestedKey in control.controls) {
            //                     if (control.get(nestedKey)?.invalid) {
            //                         invalidFields.push(`OP Settlement Data: ${controlName}.${nestedKey}`);
            //                     }
            //                 }
            //             } else if (control?.invalid) {
            //                 invalidFields.push(`OPSettlement From: ${controlName}`);
            //             }
            //         }
            //     }
            //     if (invalidFields.length > 0) {
            //         invalidFields.forEach(field => {
            //             this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
            //             );
            //         });
            //         return
            //     }
            // }
        });
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
        }
    }
}
