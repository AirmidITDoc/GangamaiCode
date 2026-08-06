import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IPBrowseBillService } from './ip-browse-bill.service';


import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { ReviewcompanyBillComponent } from 'app/main/opd/new-oplist/reviewcompany-bill/reviewcompany-bill.component';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { IPAdvanceComponent, IpPaymentInsert } from '../ip-search-list/ip-advance/ip-advance.component';


import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';

import { ComponentPortal } from '@angular/cdk/portal';
import { ConfigService } from 'app/core/services/config.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { ToastrService } from 'ngx-toastr';


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
        this.gridConfig.columnsList.find(col => col.key === 'creditbill')!.template = this.balancestatus;
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
        { heading: "", key: "creditbill", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
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
        { heading: "Balance Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
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
    Is9_Digit_National_Id: boolean = false;
    IsChennaiIPFinalPrint: boolean = false;
    IsGroupWise: boolean = false;
    IsClassWise: boolean = false;
    IsClassService: boolean = false;
    IsFinalBill: boolean = false;
    IsChargeDateWise: boolean = false;
    IsPatientStatementPrint: boolean = false;
    IsAdvanceStatementPrint: boolean = false;
    IsChargeDateWithGroupWise: boolean = false;
    IsChargeDateWithGroupWiseWithoutAdvance: boolean = false;
    constructor(public _IPBrowseBillService: IPBrowseBillService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog, private _ActRoute: Router,
        private accountService: AuthenticationService,
        public formBuilder: FormBuilder, public _whatsppService: WhatsAppEmailService,
        private overlay: Overlay,
        public _configue: ConfigService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._IPBrowseBillService.filterForm_IpdBrowse();
        this.IPBillMyForm = this.CreateIPBillForm();
        this.myFilterFormIPBrowsePayment = this._IPBrowseBillService.filterForm_IpdpaymentBrowse()
        this.myFilterFormIPBrowseRefund = this._IPBrowseBillService.filterForm_IpdrefundBrowse()

        const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is9_Digit_National_Id = id === "1";
        debugger
        const rawValue1 = this?._configue?.configParams?.IsChennaiIPFinalPrint || "";
        const [id1, val1] = rawValue1.includes(":") ? rawValue1.split(":") : [null, null];
        this.IsChennaiIPFinalPrint = id1 === "1";


        // const vIsGroupWise = this?._configue?.configParams?.IsGroupWise || "";
        // const [id2, val2] = vIsGroupWise.includes(":") ? vIsGroupWise.split(":") : [null, null];
        // this.IsGroupWise = id2 === "1";

        // const vIsClassWise = this?._configue?.configParams?.IsClassWise || "";
        // const [id3, val3] = vIsClassWise.includes(":") ? vIsClassWise.split(":") : [null, null];
        // this.IsClassWise = id3 === "1";

        // const vIsClassService = this?._configue?.configParams?.IsClassService || "";
        // const [id4, val4] = vIsClassService.includes(":") ? vIsClassService.split(":") : [null, null];
        // this.IsClassService = id4 === "1";

        // const vIsFinalBill = this?._configue?.configParams?.IsFinalBill || "";
        // const [id5, val5] = vIsFinalBill.includes(":") ? vIsFinalBill.split(":") : [null, null];
        // this.IsFinalBill = id5 === "1";

        // const vIsChargeDateWise = this?._configue?.configParams?.IsChargeDateWise || "";
        // const [id6, val6] = vIsChargeDateWise.includes(":") ? vIsChargeDateWise.split(":") : [null, null];
        // this.IsChargeDateWise = id6 === "1";

        // const vIsPatientStatementPrint = this?._configue?.configParams?.IsPatientStatementPrint || "";
        // const [id7, val7] = vIsGroupWise.includes(":") ? vIsGroupWise.split(":") : [null, null];
        // this.IsPatientStatementPrint = id7 === "1";

        // const vIsAdvanceStatementPrint = this?._configue?.configParams?.IsAdvanceStatementPrint || "";
        // const [id8, val8] = vIsGroupWise.includes(":") ? vIsGroupWise.split(":") : [null, null];
        // this.IsAdvanceStatementPrint = id8 === "1";

        // const vIsChargeDateWithGroupWise = this?._configue?.configParams?.IsChargeDateWithGroupWise || "";
        // const [id9, val9] = vIsChargeDateWithGroupWise.includes(":") ? vIsChargeDateWithGroupWise.split(":") : [null, null];
        // this.IsChargeDateWithGroupWise = id9 === "1";
        // const IsChargeDateWithGroupWiseWithoutAdvance = this?._configue?.configParams?.IsChargeDateWithGroupWiseWithoutAdvance || "";
        // const [id10, val10] = vIsGroupWise.includes(":") ? vIsGroupWise.split(":") : [null, null];
        // this.IsChargeDateWithGroupWiseWithoutAdvance = id2 === "1";

debugger
        if (this._ActRoute.url == '/ipd/ipd-bill-browse-list') {
            if (!this.Is9_Digit_National_Id) {
                debugger
                // if (this.IsGroupWise)
                    this.menuActions.push('Print Final Bill - Group wise');
               // if (this.IsClassWise)
                    this.menuActions.push('Print Final Bill - Class wise');
               // if (this.IsClassService)
                    this.menuActions.push('Print Final Bill - Class Service');
               // if (this.IsFinalBill)
                    this.menuActions.push('Print Final Bill');
                //if (this.IsChargeDateWise)
                    this.menuActions.push('Print Final Bill - Charge Date Wise');
               // if (this.IsPatientStatementPrint)
                    this.menuActions.push('Patient Statement Print');
               // if (this.IsAdvanceStatementPrint)
                    this.menuActions.push('Advance Statement Print');
            } else {
               // if (this.IsChargeDateWithGroupWise)
                    this.menuActions.push('Print Final Bill - Charge Date with Group wise');
               // if (this.IsChargeDateWithGroupWiseWithoutAdvance)
                    this.menuActions.push('Print Final Bill - Charge Date with Group wise Without Advance');
                // this.menuActions.push('Advance Statement Print');
            }

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

        else if (m == "Print Final Bill - Charge Date Wise") {
            this.viewgetFinalBillReportChargeDatewisePdf(contact.billNo)
        }
        else if (m == "Patient Statement Print") {
            this.OnPaitentFinalPrint(contact)
        }
        else if (m == "Print Final Bill - Charge Date with Group wise") {
            this.viewgetFinalGroupWisChargeatewiseReportPdf(contact.billNo)
        }
        else if (m == "Print Final Bill - Charge Date with Group wise Without Advance") {
            this.viewgetFinalGroupWisChargeatewiseWithoutAdvanceReportPdf(contact.billNo)
        }
        else if (m == "Advance Statement Print") {
            this.commonService.Onprint("AdmissionID", contact.opdipdid, "IpAdvanceStatement");
        }
    }

    OnPaitentFinalPrint(element) {
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "OPIPId", "fieldValue": String(element.opdipdid), "opType": "13" },
                    { "fieldName": "OPIPType", "fieldValue": String(element.opdipdType), "opType": "13" }
                ],
                "mode": "PatientBillStatement"
            }
            this._IPBrowseBillService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Patient Statement" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    viewgetFinalGroupWisChargeatewiseReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillChargesDateWisegroupwise");
    }
    viewgetFinalGroupWisChargeatewiseWithoutAdvanceReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillChargesDateWisegroupwisewithoutadvance");
    }
    // viewgetBillReportPdf(billNo) {
    //     this.commonService.Onprint("BillNo", billNo, "IpFinalBill");
    // }
    viewgetInterimBillReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPDInterimBill");
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
        //  this.commonService.Onprint("BillNo", billNo, "IPFinalBillGroupwise");  
        setTimeout(() => {
            const param = {
                "searchFields": [
                    { "fieldName": "BillNo", "fieldValue": String(billNo), "opType": "13" },
                ],
                "mode": "IPFinalBillGroupwise"
            }
            this._IPBrowseBillService.getIPFInalGroupWiseReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Final Bill Groupwise" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }
    viewgetFinalBillReportChargeDatewisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IPFinalBillChargesDateWise");
    }
    OnCompanyBill(element) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();
        const dialogRef = this._matDialog.open(ReviewcompanyBillComponent, {
            maxWidth: "98vw",
            height: "96vh",
            width: "100%",
            data: {
                Obj: element,
                OPIPType: 1
            }
        });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
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
    Billpayment(contact) {
        console.log(contact)
        const PatientHeaderObj = {};
        PatientHeaderObj['Date'] = contact.billDate;
        PatientHeaderObj['PatientName'] = contact.patientName || '';
        PatientHeaderObj['AdvanceAmount'] = contact.advUsedPay || 0;
        PatientHeaderObj['NetPayAmount'] = contact.balanceAmt || 0;
        PatientHeaderObj['BillNo'] = contact.billNo || 0;
        PatientHeaderObj['OPD_IPD_Id'] = contact.opdipdid || 0;
        PatientHeaderObj['IPDNo'] = contact.ipdNo || '';
        PatientHeaderObj['RegNo'] = contact.regNo || 0;
        PatientHeaderObj['DoctorName'] = contact.doctorName || '';
        PatientHeaderObj['CompanyName'] = contact.companyName || '';
        PatientHeaderObj['CompanyId'] = contact.companyId || 0;
        PatientHeaderObj['DepartmentName'] = contact.departmentName || '';
        PatientHeaderObj['TransactionLabel'] = 'IP_SETTLEMENT';

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
                this._IPBrowseBillService.InsertIPSettlementPayment(this.IPBillMyForm.value).subscribe(response => {
                    this.viewgetIPPayemntPdf(response)
                    this.onChangeIPBill()
                });
            }
        });
    }
    viewgetIPPayemntPdf(data) {
        this.commonService.Onprint("PaymentId", data, "IpPaymentReceipt");
    }

    getFinalBillview(data) {
        console.log(data);
        console.log("BillNo Click : ", data.billNo);
        // if (!data.interimOrFinal)
        //     this.viewgetFinalBillReportChargeDatewisePdf(data.billNo)    // this.viewgetFinalBillReportGroupwisePdf(data.billNo)
        // else
        //     this.viewgetInterimBillReportPdf(data.billNo)  
        debugger
        if (this.IsChennaiIPFinalPrint) {
            this.viewgetFinalBillReportGroupwisePdf(data.billNo)
        } else {
            if (!data.interimOrFinal)
                this.viewgetFinalBillReportChargeDatewisePdf(data.billNo)    // this.viewgetFinalBillReportGroupwisePdf(data.billNo)
            else
                this.viewgetInterimBillReportPdf(data.billNo)
        }
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

        const that = this;
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


    private overlayRef: OverlayRef | null = null;
    private EmailOverlayRef: OverlayRef | null = null;
    private whatsappOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    openEmailDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.EmailOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
            const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.EmailOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeEmailDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }
        }, 200);
    }
    openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }

    Onmessage(data) { }

    getWhatsappshareBill(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.billNo,
            smsType: "IPBill",
            patientId: el.regNo
        })
    }

    getWhatsappsharePayment(el) {
        console.log(el);
        debugger
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.paymentId,
            smsType: "IPReceipt",
            patientId: el.regNo
        })
    }
    openWhatsappDetailsPopoverpay(event: MouseEvent, patientData: any) {
        console.log(patientData)
        debugger
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpenpay());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopoverpay());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopoverpay() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }

    keepPatientPopoverOpenpay() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }
    //refund

    getWhatsappshareRefund(el) {
        console.log(el);
        debugger
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.refundId,
            smsType: "IPRefundReceipt",
            patientId: el.regNo
        })
    }
    openWhatsappDetailsPopoverrefund(event: MouseEvent, patientData: any) {
        console.log(patientData)
        debugger
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpenrefund());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopoverrefund());
        }, 300); // 300ms delay before showing popover
    }
    keepPatientPopoverOpenrefund() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }

    closeWhatsappDetailsPopoverrefund() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }

    // keepPatientPopoverOpen() {
    //     // Clear close timeout when hovering over popover
    //     if (this.patientCloseTimeout) {
    //         clearTimeout(this.patientCloseTimeout);
    //         this.patientCloseTimeout = null;
    //     }
    // }

    Onemail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'IPBill'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    Onemailpayment(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'IPReceipt'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OnemailBillRefund(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'IPRefundReceipt'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}
