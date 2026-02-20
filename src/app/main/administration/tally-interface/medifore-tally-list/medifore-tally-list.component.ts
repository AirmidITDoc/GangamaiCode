import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { TallyInterfaceService } from '../tally-interface.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ConfigService } from 'app/core/services/config.service';
import { MatDialog } from '@angular/material/dialog';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

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

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
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
        { heading: "Govt CompanyName", key: "govtCompanyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Govt RefNo", key: "govtRefNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Govt Appr.Amt", key: "govtApprovedAmt", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Compnay Name", key: "compnayCompanyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Comp RefNo", key: "compRefNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Appr.Amt", key: "companyApprovedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },



    ];


    allOPbilldetailfilters = [
        { fieldName: "Frodate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];


    allOPbilldetailColumns = [

        { heading: "Label", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Admission ID", key: "admissionId", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },


        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 90, type: 6 },

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
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "OP_ReceiptNo", key: "oP_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "OPDNo", key: "opdNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "PatitentName", key: "patitentName", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allOPRefundfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];


    allOPRefundColumns = [
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "OP_RefundPaymentNo", key: "oP_RefundPaymentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "PatitentName", key: "patitentName", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "TdsAmount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "WfAmount", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


        { heading: "TransactionType", key: "transactionType", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },

    ]
    //IP
    allIPbillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpBillColumns = [
        { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 30 },

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Bill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        // { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Paid Amt", key: "paidAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Bal Amt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PrintBillNo", key: "printBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Govt CompanyName", key: "govtCompanyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Govt RefNo", key: "govtRefNo", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Govt Appr.Amt", key: "govtApprovedAmt", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Compnay Name", key: "compnayCompanyName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Comp RefNo", key: "compRefNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Company Appr.Amt", key: "companyApprovedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ]


    allIPbilldetailfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpBilldetailColumns = [

        { heading: "Label", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Admission ID", key: "admissionId", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },

        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Charges Date", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 90, type: 6 },

        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },
        { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "chargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.amount },

    ]


    allIPPaymentfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];

    allIpBillcashcountercolumns = [

        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "IP_ReceiptNo", key: "iP_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allIPBillRefundfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];

    allIpBillRefundcolumns = [
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA' , width: 90},

        { heading: "IPRefundPaymentNo", key: "iP_RefundPaymentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },


        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' , width: 90},
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' , width:200},

       { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
         { heading: "TdsAmount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "WfAmount", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },



    ];
    allIPAdvancefilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];

    allIpAdvancecolumns = [
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "IP_Adv_ReceiptNo", key: "iP_Adv_ReceiptNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Adv Amount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "TdsAmount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "WfAmount", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },



    ];

    allAdvReturnfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allAdvReturncolumns = [
        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "IP_RefundAdvNo", key: "iP_RefundAdvNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        //    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "TdsAmount", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "WfAmount", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },



    ];

    //
    allPharmacysalesfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }
    ];

    allPharmacySalescolumns = [

        { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Lbl", key: "lbl", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "OPIPDNo", key: "opdipno", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "SalesNo", key: "salesNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "DiscAmount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "NetAmount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "onlinePayment", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "MPaisa Amount", key: "mPaisa", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        // { heading: "Debit", key: "debit", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Credit", key: "credit", sort: true, align: 'left', emptySign: 'NA' },

    ];

    allPharmacysalesdetailfilters = [
        { fieldName: "Fromdate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals }

    ];

    allPharmacysalesdetailcolumns = [
        { heading: "ChargesDate", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "SalesType", key: "salesType", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "SalesNo", key: "salesNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "OPIPDNo", key: "opipno", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ChargesTotalAmt", key: "chargesTotalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "DiscAmount", key: "discAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "NetAmount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

    ];


    allPharreturnColumns = [
        { heading: "ChargesDate", key: "chargesDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "ReturnType", key: "returnType", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "SalesReturnNo", key: "salesReturnNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "OPIPDNo", key: "opipno", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
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
        filters: this.allOBillcashcounterfilters
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
        filters: this.allOPRefundfilters
    }


    gridConfigIPBill: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillListMediforte",
        columnsList: this.allIpBillColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbillfilters
    }

    gridConfigIPBilldetail: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillDetailListMediforte",
        columnsList: this.allIpBilldetailColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbilldetailfilters
    }



    gridConfigIPbillCashcounter: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillPaymentListMediforte",
        columnsList: this.allIpBillcashcountercolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPPaymentfilters
    }


    gridConfigIPRefundBillPay: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPBillRefundPaymentListMediforte",
        columnsList: this.allIpBillRefundcolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPBillRefundfilters
    }

    gridConfigIPAdvance: gridModel = {

        apiUrl: "Tally/TallyIPAdvancePaymentListMediforte",
        columnsList: this.allIpAdvancecolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allIPAdvancefilters
    }

    gridConfigIAdvRefund: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyIPAdvanceRefundPaymentListMediforte",
        columnsList: this.allAdvReturncolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allAdvReturnfilters
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
            ]
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
            ]
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

            ]
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

            ]
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

            ]
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

            ]
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

            ]
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

            ]
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
        filters: this.allPharmacysalesfilters
    }

    gridConfigSalesdetail: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPharmacyOPIPSalesDetailListMediforte",
        columnsList: this.allPharmacysalesdetailcolumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allPharmacysalesdetailfilters
    }


    gridConfigSalesReturn: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPharmacyOPIPSalesReturnDetailListMediforte",
        columnsList: this.allPharreturnColumns,
        sortField: "UnitId",
        sortOrder: 0,
        filters: this.allPharreturnfilters
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

            ]
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
            ]
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

            ]
        }
        this.salesreturnGrid.gridConfig = this.gridConfigSalesReturn;
        this.salesreturnGrid.bindGridData();
    }




}
