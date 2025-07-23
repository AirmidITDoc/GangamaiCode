import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import { IPBrowseBillService } from './ip-browse-bill.service';


import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { IPAdvanceComponent, IpPaymentInsert } from '../ip-search-list/ip-advance/ip-advance.component';

@Component({
    selector: 'app-ip-bill-browse-list',
    templateUrl: './ip-bill-browse-list.component.html',
    styleUrls: ['./ip-bill-browse-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {
    myFilterform: FormGroup;
    myFilterFormIPBrowsePayment: FormGroup;
    myFilterFormIPBrowseRefund: FormGroup;
    menuActions: Array<string> = [];
    // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
    @ViewChild('ipPayment', { static: false }) grid1: AirmidTableComponent;
    @ViewChild('ipRefund', { static: false }) grid2: AirmidTableComponent;

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    PBillNo: any = "%"
    IsIntrimOrFinal: any = "0"

    pfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    pf_name: any = "%"
    pl_name: any = "%"
    pregNo: any = "0"
    pPBillNo: any = "%"
    pReceiptNo: any = "0"

    rfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    rtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    rf_name: any = "%"
    rl_name: any = "%"
    rregNo: any = "0"

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP;
        this.gridConfig.columnsList.find(col => col.key === 'patientTypeId')!.template = this.patientTypetemp;
        this.gridConfig.columnsList.find(col => col.key === 'interimOrFinal')!.template = this.Billstatus;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.balancestatus;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.isCancelledstatus;

        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplatepayment;
        this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPRefund;

    }
    @ViewChild('actionButtonTemplateIP') actionButtonTemplateIP!: TemplateRef<any>;
    @ViewChild('actionButtonTemplatepayment') actionButtonTemplatepayment!: TemplateRef<any>;


    @ViewChild('patientTypetemp') patientTypetemp!: TemplateRef<any>;
    @ViewChild('Billstatus') Billstatus!: TemplateRef<any>;
    @ViewChild('balancestatus') balancestatus!: TemplateRef<any>;
    @ViewChild('isCancelledstatus') isCancelledstatus!: TemplateRef<any>;

    @ViewChild('actionButtonTemplateIPRefund') actionButtonTemplateIPRefund!: TemplateRef<any>;

    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsIntrimOrFinal", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allIPBillListColumns = [
        { heading: "", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "DOD", key: "dischargeDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "IPDNO", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref Doctor Name", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Tariff Name", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Company DiscAmt", key: "compDiscAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "bAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "NEFT Pay", key: "neftPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv Use Amount", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayCount", key: "paycount", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Counter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateIP  // Assign ng-template to the column
        }
    ]

    gridConfig: gridModel = {
        apiUrl: "Billing/BrowseIPBillList",
        columnsList: this.allIPBillListColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allfilters
    }

    allIpPaymentFilter = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Equals }
    ]

    allIpPaymentListColumns = [
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', type: 6 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "TotalAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "BalAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
     
        { heading: "AdvanceUsed", key: "advused", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CashPayAmt", key: "cashPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "ChequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CardPayAmt", key: "cardPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
       
        { heading: "NEFTPayAmt", key: "nEFTPayAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayTMAmt", key: "payTmPayAmount", sort: true, align: "center", emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Remark ", key: "remark0", sort: true, align: "center", emptySign: 'NA' },
        { heading: "User Name", key: "userName", sort: true, align: "center", emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplatepayment  // Assign ng-template to the column
        }
    ]

    gridConfig1: gridModel = {
        apiUrl: "Billing/BrowseIPPaymentList",
        columnsList: this.allIpPaymentListColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allIpPaymentFilter
    }

    allIpRefundFilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allIpRefundListColumns = [
        { heading: "Payment Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
          { heading: "Refund Date", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "RefundAmount", key: "refundId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CashPay", key: "cashPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CardPay", key: "cardPayAmount", sort: true, align: "center", type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: "center" },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateIPRefund  // Assign ng-template to the column
        }//Action 1-view, 2-Edit,3-delete
    ]

    gridConfig2: gridModel = {
        apiUrl: "Billing/BrowseIPRefundlist",
        columnsList: this.allIpRefundListColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allIpRefundFilters
    }

    constructor(public _IPBrowseBillService: IPBrowseBillService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog, private _ActRoute: Router,
        private accountService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._IPBrowseBillService.filterForm_IpdBrowse();
        this.myFilterFormIPBrowsePayment = this._IPBrowseBillService.filterForm_IpdpaymentBrowse()
        this.myFilterFormIPBrowseRefund = this._IPBrowseBillService.filterForm_IpdrefundBrowse()

        if (this._ActRoute.url == '/ipd/ipd-bill-browse-list') {
            this.menuActions.push('Print Final Bill - Group wise');
            this.menuActions.push('Print Final Bill - Class wise');
            this.menuActions.push('Print Final Bill - Class Service');
            this.menuActions.push('Print Final Bill');
            // this.menuActions.push('Print FinalBill WardWise');
        }
    }

    onChangeIPBill() {
        debugger
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.PBillNo = this.myFilterform.get('PBillNo').value || "%"
        this.IsIntrimOrFinal = this.myFilterform.get('IsInterimOrFinal').value
        this.getfilterdataIPBill();
    }

    getfilterdataIPBill() {
        this.gridConfig = {
            apiUrl: "Billing/BrowseIPBillList",
            columnsList: this.allIPBillListColumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
            { fieldName: "IsIntrimOrFinal", fieldValue: this.IsIntrimOrFinal, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    ClearfilterIPbill(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.myFilterform.get('PBillNo').setValue("")
        this.onChangeIPBill();
    }

    onChangeIPPayment() {
        this.pfromDate = this.datePipe.transform(this.myFilterFormIPBrowsePayment.get('fromDate').value, "yyyy-MM-dd")
        this.ptoDate = this.datePipe.transform(this.myFilterFormIPBrowsePayment.get('enddate').value, "yyyy-MM-dd")
        this.pf_name = this.myFilterFormIPBrowsePayment.get('FirstName').value + "%"
        this.pl_name = this.myFilterFormIPBrowsePayment.get('LastName').value + "%"
        this.pregNo = this.myFilterFormIPBrowsePayment.get('RegNo').value || "0"
        this.pPBillNo = this.myFilterFormIPBrowsePayment.get('PBillNo').value || "%"
        this.pReceiptNo = this.myFilterFormIPBrowsePayment.get('ReceiptNo').value || "0"
        this.getfilterdataIPPayment();
    }

    getfilterdataIPPayment() {
        this.gridConfig1 = {
            apiUrl: "Billing/BrowseIPPaymentList",
            columnsList: this.allIpPaymentListColumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.pf_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.pl_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.pregNo, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.pPBillNo, opType: OperatorComparer.Equals },
            { fieldName: "ReceiptNo", fieldValue: this.pReceiptNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    ClearfilterIPpayment(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterFormIPBrowsePayment.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterFormIPBrowsePayment.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterFormIPBrowsePayment.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.myFilterFormIPBrowsePayment.get('PBillNo').setValue("")
        if (event == 'ReceiptNo')
            this.myFilterFormIPBrowsePayment.get('ReceiptNo').setValue("")
        this.onChangeIPPayment();
    }

    onChangeIPRefund() {
        this.rfromDate = this.datePipe.transform(this.myFilterFormIPBrowseRefund.get('fromDate').value, "yyyy-MM-dd")
        this.rtoDate = this.datePipe.transform(this.myFilterFormIPBrowseRefund.get('enddate').value, "yyyy-MM-dd")
        this.rf_name = this.myFilterFormIPBrowseRefund.get('FirstName').value + "%"
        this.rl_name = this.myFilterFormIPBrowseRefund.get('LastName').value + "%"
        this.rregNo = this.myFilterFormIPBrowseRefund.get('RegNo').value || "0"
        this.getfilterdataIPRefund();
    }

    getfilterdataIPRefund() {
        this.gridConfig2 = {
            apiUrl: "Billing/BrowseIPRefundlist",
            columnsList: this.allIpRefundListColumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.rf_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.rl_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.rfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.rtoDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.rregNo, opType: OperatorComparer.Equals },
            ]
        }
        this.grid2.gridConfig = this.gridConfig2;
        this.grid2.bindGridData();
    }

    ClearfilterIPRefund(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterFormIPBrowseRefund.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterFormIPBrowseRefund.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterFormIPBrowseRefund.get('RegNo').setValue("")
        this.onChangeIPRefund();
    }

    onSave(row: any = null) {
    }

    OngetRecord(contact, m): void {
        console.log(contact)
        if (m == "Print Final Bill - Group wise")
            if (!contact.InterimOrFinal)
                this.viewgetFinalBillReportGroupwisePdf(contact.billNo)
            else
                this.viewgetInterimBillReportPdf(contact.billNo)
        if (m == "Print Final Bill - Class wise")
            this.viewgetBillReportclasswisePdf(contact.billNo)
        if (m == "Print Final Bill - Class Service")
            this.viewgetBillReportclassservicewisePdf(contact.billNo)

        if (m == "Print Final Bill")
            this.viewgetFinalBillReportNewPdf(contact.billNo)
    }

    // viewgetBillReportPdf(billNo) {
    //     this.commonService.Onprint("BillNo", billNo, "IpFinalBill");
    // }
    viewgetInterimBillReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpInterimBill");
    }
    viewgetBillReportclasswisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillClassWise");
    }
    viewgetBillReportclassservicewisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillClassServiceWise");
    }
    viewgetFinalBillReportNewPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillGroupwise");
    }
    viewgetFinalBillReportGroupwisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillGroupwise");
    }


    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            RegNo: [],
            PBillNo: []

        }
    }

    onChangeDate(selectDate) {
        if (selectDate) {

            this.fromDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.fromDate);
            this.gridConfig.filters[2].fieldValue = this.fromDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }
            ]
        }

    }
    onChangeDate1(selectDate) {
        if (selectDate) {

            this.toDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.toDate);
            this.gridConfig.filters[3].fieldValue = this.toDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }]
        }
    }


    Billpayment(contact) {

        console.log(contact)
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = contact.billDate;
        PatientHeaderObj['PatientName'] = contact.patientName;
        PatientHeaderObj['AdvanceAmount'] = contact.advUsedPay;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt;
        PatientHeaderObj['BillNo'] = contact.billNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['IPDNo'] = contact.opD_IPD_ID;
        PatientHeaderObj['RegNo'] = contact.regNo;
        console.log(PatientHeaderObj)

        const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
            {
                maxWidth: "95vw",
                height: '750px',
                width: '85%',

                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "IP-SETTLEMENT",
                    advanceObj: PatientHeaderObj,
                }
            });


        dialogRef.afterClosed().subscribe(result => {
            let NeftNo = "0"
            //   console.log(result.submitDataPay.ipPaymentInsert)

            if (result.submitDataPay.ipPaymentInsert.NEFTNo == "undefined")
                NeftNo = "0"
            else
                NeftNo = String(result.submitDataPay.ipPaymentInsert.NEFTNo)
            if (result.IsSubmitFlag) {
                let Paymentobj = {};

                Paymentobj['PaymentId'] = '0';
                Paymentobj['billNo'] = contact.billNo;
                Paymentobj['PaymentDate'] = result.submitDataPay.ipPaymentInsert.PaymentDate;
                Paymentobj['PaymentTime'] = result.submitDataPay.ipPaymentInsert.PaymentTime; //this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
                Paymentobj['CashPayAmount'] = result.submitDataPay.ipPaymentInsert.CashPayAmount ?? 0;
                Paymentobj['ChequePayAmount'] = result.submitDataPay.ipPaymentInsert.ChequePayAmount ?? 0;
                Paymentobj['ChequeNo'] = String(result.submitDataPay.ipPaymentInsert.ChequeNo) ?? "0";
                Paymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName ?? "";
                Paymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate;
                Paymentobj['CardPayAmount'] = result.submitDataPay.ipPaymentInsert.CardPayAmount
                Paymentobj['CardNo'] = String(result.submitDataPay.ipPaymentInsert.CardNo);
                Paymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName
                Paymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate
                Paymentobj['AdvanceUsedAmount'] = result.submitDataPay.ipPaymentInsert.AdvanceUsedAmount
                Paymentobj['AdvanceId'] = result.submitDataPay.ipPaymentInsert.AdvanceId
                Paymentobj['RefundId'] = 0;
                Paymentobj['TransactionType'] = 0;
                Paymentobj['Remark'] = '';
                Paymentobj['AddBy'] = this.accountService.currentUserValue.userId,
                    Paymentobj['IsCancelled'] = false;
                Paymentobj['IsCancelledBy'] = '0';
                Paymentobj['IsCancelledDate'] = result.submitDataPay.ipPaymentInsert.IsCancelledDate
                Paymentobj['opdipdType'] = 1;
                Paymentobj['neftpayAmount'] = result.submitDataPay.ipPaymentInsert.NEFTPayAmount
                Paymentobj['neftno'] = NeftNo;
                Paymentobj['neftbankMaster'] = result.submitDataPay.ipPaymentInsert.NEFTBankMaster
                Paymentobj['neftdate'] = result.submitDataPay.ipPaymentInsert.NEFTDate
                Paymentobj['payTmamount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount
                Paymentobj['payTmtranNo'] = "0",//result.submitDataPay.ipPaymentInsert.PayTMTranNo || 0
                    Paymentobj['payTmdate'] = result.submitDataPay.ipPaymentInsert.PayTMDate
                Paymentobj['tdsAmount'] = result.submitDataPay.ipPaymentInsert.tdsAmount

                let BillUpdateObj = {};

                BillUpdateObj['billNo'] = contact.billNo;
                BillUpdateObj['balanceAmt'] = result.BalAmt;

                console.log("Procced with Payment Option");
                let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];

                if (result.IsSubmitFlag) {
                    console.log(result);
                    result.submitDataPay.ipPaymentInsert.TransactionType = 0;
                    UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
                    console.log(UpdateAdvanceDetailarr1);

                    let UpdateAdvanceDetailarr = [];
                    let BalanceAmt = 0;
                    let UsedAmt = 0;
                    if (result.submitDataAdvancePay.length > 0) {
                        result.submitDataAdvancePay.forEach((element) => {
                            let UpdateAdvanceDetailObj = {};
                            UpdateAdvanceDetailObj['advanceDetailID'] = element.AdvanceDetailID;
                            UpdateAdvanceDetailObj['usedAmount'] = element.UsedAmount;
                            UsedAmt += element.UsedAmount;
                            UpdateAdvanceDetailObj['balanceAmount'] = element.BalanceAmount;
                            BalanceAmt += element.BalanceAmount;
                            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                        });
                    }
                    else {
                        let UpdateAdvanceDetailObj = {};
                        UpdateAdvanceDetailObj['advanceDetailID'] = 0,
                            UpdateAdvanceDetailObj['usedAmount'] = 0,
                            UpdateAdvanceDetailObj['balanceAmount'] = 0,
                            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                    }


                    let UpdateAdvanceHeaderObj = {};
                    if (result.submitDataAdvancePay.length > 0) {
                        UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
                            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UsedAmt,
                            UpdateAdvanceHeaderObj['BalanceAmount'] = BalanceAmt
                    }
                    else {
                        UpdateAdvanceHeaderObj['advanceId'] = 0,
                            UpdateAdvanceHeaderObj['advanceUsedAmount'] = 0,
                            UpdateAdvanceHeaderObj['balanceAmount'] = 0
                    }

                    let submitData = {
                        "payment": Paymentobj,// result.submitDataPay.ipPaymentInsert,
                        "billupdate": BillUpdateObj,
                        "advanceDetailupdate": UpdateAdvanceDetailarr,
                        "advanceHeaderupdate": UpdateAdvanceHeaderObj
                    };
                    let data = {
                        submitDataPay: submitData
                    }
                    console.log(submitData);
                    this._IPBrowseBillService.InsertIPSettlementPayment(submitData).subscribe(response => {
                        this.toastr.success(response.message);
                        this.viewgetIPPayemntPdf(response)
                        debugger
                        this.onChangeIPBill()
                    }, (error) => {
                        this.toastr.error(error.message);
                    });
                }

            }
        });

    }

    viewgetIPPayemntPdf(data) {
        this.commonService.Onprint("PaymentId", data, "IpPaymentReceipt");
    }

    getFinalBillview(data) {
        console.log("BillNo Click : ", data.billNo);
        if (!data.InterimOrFinal)
            this.viewgetFinalBillReportGroupwisePdf(data.billNo)
        else
            this.viewgetInterimBillReportPdf(data.billNo)
    }

    OnViewReportPdf(element) {
        this.commonService.Onprint("PaymentId", element.paymentId, "IpPaymentReceipt");
    }

    getPaymentreceiptview(element) {
        this.commonService.Onprint("PaymentId", element.paymentId, "IpPaymentReceipt");
    }

    getRefundreceiptview(element) {
        console.log(element)
        this.commonService.Onprint("RefundId", element.refundId, "IpBillRefundReceipt");
    }

    IPAdvanceComponent() {

        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(IPAdvanceComponent,
            {
                maxWidth: "100%",
                maxHeight: '95%',
                width: '80%',
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }

}
