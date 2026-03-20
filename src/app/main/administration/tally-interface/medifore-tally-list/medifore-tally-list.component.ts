import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { TallyInterfaceService } from '../tally-interface.service';

@Component({
    selector: 'app-medifore-tally-list',
    templateUrl: './medifore-tally-list.component.html',
    styleUrls: ['./medifore-tally-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MediforeTallyListComponent {
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate3 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate3 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    myFilteropBillform: FormGroup
    myFilterIpBillform: FormGroup
    myFilterAdvanceform: FormGroup
    myFiltersalesform: FormGroup
    myFilterpurchaseform: FormGroup

    @ViewChild('OPPaymentGrid', { static: false }) oppaygrid: AirmidTableComponent;

    @ViewChild('OPBillGrid', { static: false }) opcashgrid: AirmidTableComponent;
    @ViewChild('OPBildetailsGrid', { static: false }) opbilldetailgrid: AirmidTableComponent;
    @ViewChild('OPrefundGrid', { static: false }) oprefundgrid: AirmidTableComponent;

    @ViewChild('IPBillGrid', { static: false }) ipcashcounergrid: AirmidTableComponent;
    @ViewChild('IPBilldetailGrid', { static: false }) ippatientwiseGrid: AirmidTableComponent;
    @ViewChild('IPPaymentGrid', { static: false }) ippaymentGrid: AirmidTableComponent;
    @ViewChild('IPRefundGrid', { static: false }) iprefundGrid: AirmidTableComponent;

    @ViewChild('IPAdvanceGrid', { static: false }) ipadvanceGrid: AirmidTableComponent;
    @ViewChild('IPAdvRefundGrid', { static: false }) ipadvrefundGrid: AirmidTableComponent;

    @ViewChild('SalesGrid', { static: false }) saleGrid: AirmidTableComponent;
    @ViewChild('SalesdetailGrid', { static: false }) saledetailGrid: AirmidTableComponent;
    @ViewChild('salereturn', { static: false }) salesreturnGrid: AirmidTableComponent;


    ngAfterViewInit() {
        // this.gridConfigOPBill.columnsList.find(col => col.key === 'interimOrFinal')!.template = this.OPBillstatus;
        this.gridConfigIPBill.columnsList.find(col => col.key === 'interimOrFinal')!.template = this.IPBillstatus;

    }


    @ViewChild('IPBillstatus') IPBillstatus!: TemplateRef<any>;
    @ViewChild('OPBillstatus') OPBillstatus!: TemplateRef<any>;


    constructor(public _OPListService: TallyInterfaceService, public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        public _accountService: AuthenticationService, public permissionService: PagePermissionService,

    ) { }

    ngOnInit(): void {

        this.myFilteropBillform = this._OPListService.myFilterOpcashcounerform();

        this.myFilterIpBillform = this._OPListService.myFilterrIPBillform();
        this.myFilterAdvanceform = this._OPListService.myFilterIPAdvanceform();

        this.myFiltersalesform = this._OPListService.myFiltersalesform();
        this.myFilterpurchaseform = this._OPListService.myFilterpurchaseform();

    }

    allOBillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allOPbillcolumns = [
        { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Bill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },

        // { heading: "Cash Counter ", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amt", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "PrintBillNo", key: "printBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Govt CompanyName", key: "govtCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Govt RefNo", key: "govtRefNo", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Govt Appr.Amt", key: "govtApprovedAmt", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Compnay Name", key: "compnayCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comp RefNo", key: "compRefNo", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Company Appr.Amt", key: "companyApprovedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },



    ];


    allOPbilldetailfilters = [
        { fieldName: "Frodate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];


    allOPbilldetailColumns = [

        { heading: "Label", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Admission ID", key: "admissionId", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },


        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 90 },

        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "chargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },

    ]
    //
    allOBillcashcounterfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
    ];

    allOPbillcashcountercolumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Receipt No", key: "oP_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "OPD No", key: "opdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patitent Name", key: "patitentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Amt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Pay", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Pay", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 }
    ];

    allOPRefundfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
    ];

    allOPRefundColumns = [
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Refund PaymentNo", key: "oP_RefundPaymentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patitent Name", key: "patitentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Amt", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Amt", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    ]
    //IP
    allIPbillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals }
    ];


    allIpBillColumns = [
        { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        // { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amt", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PrintBillNo", key: "printBillNo", sort: true, align: 'left', emptySign: 'NA', width: 160 },
        { heading: "Govt CompanyName", key: "govtCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Govt RefNo", key: "govtRefNo", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        // { heading: "Govt Appr.Amt", key: "govtApprovedAmt", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Compnay Name", key: "compnayCompanyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comp RefNo", key: "compRefNo", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Company Appr.Amt", key: "companyApprovedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    ]


    allIPbilldetailfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpBilldetailColumns = [

        { heading: "Label", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "chargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },

    ]


    allIPPaymentfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];

    allIpBillcashcountercolumns = [
        { heading: "Label", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IP_ReceiptNo", key: "iP_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Amt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Amt", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Amt", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    ];


    allIPBillRefundfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];

    allIpBillRefundcolumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PaymentNo", key: "iP_RefundPaymentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Cash Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Amt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Amt", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Amt", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }

    ];
    allIPAdvancefilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];

    allIpAdvancecolumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "IP_Adv_ReceiptNo", key: "iP_Adv_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        //{ heading: "Adv Amount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Amt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Amt", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Amt", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }
    ];

    allAdvReturnfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allAdvReturncolumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "IP_RefundAdvNo", key: "iP_RefundAdvNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patitentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        //    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Neft Amt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Tds Amt", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Wf Amt", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }
    ];

    //
    allPharmacysalesfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }
    ];

    allPharmacySalescolumns = [

        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Receipt No", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "OPIPD No", key: "opdipno", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amt", key: "onlinePayment", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "MPaisa Amt", key: "mPaisa", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        // { heading: "Debit", key: "debit", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Credit", key: "credit", sort: true, align: 'left', emptySign: 'NA' },

    ];

    allPharmacysalesdetailfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }

    ];

    allPharmacysalesdetailcolumns = [
        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Bill Date", key: "billdate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Sales Type", key: "salesType", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Sales No", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "OPIPD No", key: "opipno", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ChargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount }
    ];


    allPharreturnColumns = [
        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Bill Date", key: "billdate", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Return Type", key: "returnType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SalesReturnNo", key: "salesReturnNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "OPIPD No", key: "opipno", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ChargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

    ]

    allPharreturnfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },

    ];



    gridConfigOPBillCashcouner: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPPaymentMediforte",
        columnsList: this.allOPbillcashcountercolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOBillcashcounterfilters,
        fileName: 'OpPayment_Excel'
    }
    // gridConfigOPBill: gridModel = {
    //     permissionCode: permissionCodes.TallyInterface,
    //     apiUrl: "Tally/TallyOPBillListMediforte",
    //     columnsList: this.allOPbillcolumns,
    //     sortField: "BillDate",
    //     sortOrder: 0,
    //     filters: this.allOBillfilters
    // }


    // gridConfigOpbilldetail: gridModel = {
    //     permissionCode: permissionCodes.TallyInterface,
    //     apiUrl: "Tally/TallyOPBillDetailListMediforte",
    //     columnsList: this.allOPbilldetailColumns,
    //     sortField: "BillDate",
    //     sortOrder: 0,
    //     filters: this.allOPbilldetailfilters
    // }


    gridConfigOpRefund: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPBillRefundPaymentMediforte",
        columnsList: this.allOPRefundColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOPRefundfilters,
        fileName: 'OpRefundPayment_Excel'
    }


    gridConfigIPBill: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillListMediforte",
        columnsList: this.allIpBillColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbillfilters,
        fileName: 'IpBillPatientWise_Excel'
    }

    gridConfigIPBilldetail: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillDetailListMediforte",
        columnsList: this.allIpBilldetailColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbilldetailfilters,
        fileName: 'IpBillDetailsWise_Excel'
    }



    gridConfigIPbillCashcounter: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillPaymentListMediforte",
        columnsList: this.allIpBillcashcountercolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPPaymentfilters,
        fileName: 'IpBillPayment_Excel'
    }


    gridConfigIPRefundBillPay: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillRefundPaymentListMediforte",
        columnsList: this.allIpBillRefundcolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPBillRefundfilters,
        fileName: 'IpBillRefundPayment_Excel'
    }

    gridConfigIPAdvance: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPAdvancePaymentListMediforte",
        columnsList: this.allIpAdvancecolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPAdvancefilters,
        fileName: 'IpAdvancePayment_Excel'
    }

    gridConfigIAdvRefund: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPAdvanceRefundPaymentListMediforte",
        columnsList: this.allAdvReturncolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allAdvReturnfilters,
        fileName: 'IpAdvanceRefundPayment_Excel'
    }



    onChangeOPBill() {

        this.fromDate = this.datePipe.transform(this.myFilteropBillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilteropBillform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataOpBill();
        this.getfilterdataOpBilldetail();
        this.getfilterdataOppayyyment()
        this.getfilterdataOpRefund()

    }

    getfilterdataOpBill() {

        // this.gridConfigOPBill = {
        //     apiUrl: "Tally/TallyOPBillListMediforte",
        //     columnsList: this.allOPbillcolumns,
        //     sortField: "BillDate",
        //     sortOrder: 0,
        //     filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        //     { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
        //     ]
        // }

        // this.opcashgrid.gridConfig = { ...this.gridConfigOPBill };

        // this.opcashgrid.bindGridData();
    }


    getfilterdataOpBilldetail() {

        // this.gridConfigOpbilldetail = {
        //     apiUrl: "Tally/TallyOPBillDetailListMediforte",
        //     columnsList: this.allOPbilldetailColumns,
        //     sortField: "BillDate",
        //     sortOrder: 0,
        //     filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        //     { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
        //     ]
        // }

        // this.opbilldetailgrid.gridConfig = { ...this.gridConfigOpbilldetail };

        // this.opbilldetailgrid.bindGridData();
    }

    getfilterdataOppayyyment() {

        this.gridConfigOPBillCashcouner = {
            apiUrl: "Tally/TallyOPPaymentMediforte",
            columnsList: this.allOPbillcashcountercolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ],
            fileName: 'OpPayment_Excel'
        }

        this.oppaygrid.gridConfig = { ...this.gridConfigOPBillCashcouner };

        this.oppaygrid.bindGridData();
    }

    getfilterdataOpRefund() {

        this.gridConfigOpRefund = {
            apiUrl: "Tally/TallyOPBillRefundPaymentMediforte",
            columnsList: this.allOPRefundColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ],
            fileName: 'OpRefundPayment_Excel'
        }

        this.oprefundgrid.gridConfig = { ...this.gridConfigOpRefund };

        this.oprefundgrid.bindGridData();
    }


    //IP
    onChangeIPBill() {
        debugger
        this.fromDate1 = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataIpBill();
        this.getfilterdataIPBilldetail();
        this.getfilterdataIppayment()
        this.getfilterdataIPBillRefund()
    }

    getfilterdataIpBill() {

        this.gridConfigIPBill = {
            apiUrl: "Tally/TallyIPBillListMediforte",
            columnsList: this.allIpBillColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpBillPatientWise_Excel'
        }
        this.ipcashcounergrid.gridConfig = { ...this.gridConfigIPBill };
        this.ipcashcounergrid.bindGridData();
    }

    getfilterdataIPBilldetail() {

        this.gridConfigIPBilldetail = {
            apiUrl: "Tally/TallyIPBillDetailListMediforte",
            columnsList: this.allIpBilldetailColumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpBillDetailsWise_Excel'
        }
        this.ippatientwiseGrid.gridConfig = { ...this.gridConfigIPBilldetail };
        this.ippatientwiseGrid.bindGridData();
    }



    getfilterdataIppayment() {

        this.gridConfigIPbillCashcounter = {
            apiUrl: "Tally/TallyIPBillPaymentListMediforte",
            columnsList: this.allIpBillcashcountercolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpBillPayment_Excel'
        }
        this.ippaymentGrid.gridConfig = { ...this.gridConfigIPbillCashcounter };
        this.ippaymentGrid.bindGridData();
    }

    getfilterdataIPBillRefund() {

        this.gridConfigIPRefundBillPay = {
            apiUrl: "Tally/TallyIPBillRefundPaymentListMediforte",
            columnsList: this.allIpBillRefundcolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpBillRefundPayment_Excel'
        }
        this.iprefundGrid.gridConfig = { ...this.gridConfigIPRefundBillPay };
        this.iprefundGrid.bindGridData();
    }
    onChangeIPAdvance() {

        this.fromDate2 = this.datePipe.transform(this.myFilterAdvanceform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate2 = this.datePipe.transform(this.myFilterAdvanceform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataIpAdvance();
        this.getfilterdataIPAdvRefund();

    }


    getfilterdataIpAdvance() {

        this.gridConfigIPAdvance = {
            apiUrl: "Tally/TallyIPAdvancePaymentListMediforte",
            columnsList: this.allIpAdvancecolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpAdvancePayment_Excel'
        }
        this.ipadvanceGrid.gridConfig = this.gridConfigIPAdvance;
        this.ipadvanceGrid.bindGridData();
    }

    getfilterdataIPAdvRefund() {

        this.gridConfigIAdvRefund = {
            apiUrl: "Tally/TallyIPAdvanceRefundPaymentListMediforte",
            columnsList: this.allAdvReturncolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },

            ],
            fileName: 'IpAdvanceRefundPayment_Excel'
        }
        this.ipadvrefundGrid.gridConfig = this.gridConfigIAdvRefund;
        this.ipadvrefundGrid.bindGridData();
    }

    //Pharmmacy


    gridConfigPharSales: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPharmacyOPIPSalesPaymentListMediforte ",
        columnsList: this.allPharmacySalescolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allPharmacysalesfilters,
        fileName: 'IpOPIPSalesPayment_Excel'
    }

    gridConfigSalesdetail: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPharmacyOPIPSalesDetailListMediforte",
        columnsList: this.allPharmacysalesdetailcolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allPharmacysalesdetailfilters,
        fileName: 'IpOPIPSalesDetails_Excel'
    }


    gridConfigSalesReturn: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPharmacyOPIPSalesReturnDetailListMediforte",
        columnsList: this.allPharreturnColumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allPharreturnfilters,
        fileName: 'IpOPIPSalesReturn_Excel'
    }

    onChangePharmacy() {
        debugger
        this.fromDate3 = this.datePipe.transform(this.myFiltersalesform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate3 = this.datePipe.transform(this.myFiltersalesform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataPharPayment();
        this.getfilterdataPharsalesdetail();
        this.getfilterdataPharsalesreturn();

    }


    getfilterdataPharPayment() {

        this.gridConfigPharSales = {
            apiUrl: "Tally/TallyPharmacyOPIPSalesPaymentListMediforte ",
            columnsList: this.allPharmacySalescolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }

            ],
            fileName: 'IpOPIPSalesPayment_Excel'
        }
        this.saleGrid.gridConfig = this.gridConfigPharSales;
        this.saleGrid.bindGridData();
    }

    getfilterdataPharsalesdetail() {

        this.gridConfigSalesdetail = {
            apiUrl: "Tally/TallyPharmacyOPIPSalesDetailListMediforte",
            columnsList: this.allPharmacysalesdetailcolumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }
            ],
            fileName: 'IpOPIPSalesDetails_Excel'
        }
        this.saledetailGrid.gridConfig = this.gridConfigSalesdetail;
        this.saledetailGrid.bindGridData();
    }

    getfilterdataPharsalesreturn() {

        this.gridConfigSalesReturn = {
            apiUrl: "Tally/TallyPharmacyOPIPSalesReturnDetailListMediforte",
            columnsList: this.allPharreturnColumns,
            sortField: "UnitId",
            sortOrder: 0,
            filters: [{ fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }

            ],
            fileName: 'IpOPIPSalesReturn_Excel'
        }
        this.salesreturnGrid.gridConfig = this.gridConfigSalesReturn;
        this.salesreturnGrid.bindGridData();
    }




}
