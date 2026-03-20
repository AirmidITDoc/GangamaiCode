import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { TallyInterfaceService } from './tally-interface.service';


@Component({
    selector: 'app-tally-interface',
    templateUrl: './tally-interface.component.html',
    styleUrls: ['./tally-interface.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TallyInterfaceComponent implements OnInit {
    myFilteropcashcounerform: FormGroup;
    myFilterpayform: FormGroup;
    myFilterrefundform: FormGroup;

    myFilterIpBillform: FormGroup;
    myFilterIpAdvform: FormGroup;

    myFiltersalesform: FormGroup;
    myFilterpurchaseform: FormGroup;

    menuActions: Array<string> = [];
    autocompletestore: string = "Store";

    @ViewChild('opBillGrid', { static: false }) opcashgrid: AirmidTableComponent;
    @ViewChild('opRefundGrid', { static: false }) oprefunfgrid: AirmidTableComponent;


    // @ViewChild('IPBillGrid', { static: false }) ipbillGrid: AirmidTableComponent;
    @ViewChild('IPCashGrid', { static: false }) ipcashcounergrid: AirmidTableComponent;
    @ViewChild('IPPatientwiseGrid', { static: false }) ippatientwiseGrid: AirmidTableComponent;

    @ViewChild('IpRefundGrid', { static: false }) iprefundgrid: AirmidTableComponent;

    @ViewChild('IPAdvGrid', { static: false }) ipadvGrid: AirmidTableComponent;
    @ViewChild('IPAdvRefGrid', { static: false }) ipadvrefundGrid: AirmidTableComponent;

    @ViewChild('SalesGrid', { static: false }) saleGrid: AirmidTableComponent;
    @ViewChild('salereturnGrid', { static: false }) salesreturnGrid: AirmidTableComponent;
    @ViewChild('PharPayGrid', { static: false }) phapayGrid: AirmidTableComponent;
    @ViewChild('salespayreceipt', { static: false }) salesreceiptGrid: AirmidTableComponent;
    @ViewChild('PurchaseGrid', { static: false }) purchaseGrid: AirmidTableComponent;

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate2 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate3 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate3 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromDate4 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate4 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    vMobileNo: any;
    vbalanceamt: any;
    vpaidamt: any;
    vOPIPId = 0;
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    CompanyId = 0
    PBillNo: any = "%"
    autocompleteModecompany: string = "Company";
    autocompleteModecompany1: string = "Company";
    pf_name: any = ""
    pregNo: any = "0"
    pl_name: any = ""
    precptNo = "0"
    pPBillNo: any = "%"

    rf_name: any = ""
    rregNo: any = "0"
    rl_name: any = ""
    rPBillNo: any = "%"



    constructor(public _OPListService: TallyInterfaceService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        public _accountService: AuthenticationService, public permissionService: PagePermissionService,
        public _whatsppService: WhatsAppEmailService,
        private overlay: Overlay
    ) { }

    vstoreId = 0
    ngOnInit(): void {

        this.vstoreId = this._accountService.currentUserValue.user.storeId

        this.myFilteropcashcounerform = this._OPListService.myFilterOpcashcounerform();

        this.myFilterIpBillform = this._OPListService.myFilterrIPBillform();
        this.myFilterIpAdvform = this._OPListService.myFilterIPAdvanceform();

        this.myFiltersalesform = this._OPListService.myFiltersalesform();
        this.myFilterpurchaseform = this._OPListService.myFilterpurchaseform();

    }

    // allOBillfilters = [
    //     { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    //     { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    // ];

    // allOPbillcolumns = [
    //     { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
    //     { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
    //     { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     // { heading: "PayTM Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    //     { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    // ];

    allOBillcashcounterfilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allOPbillcashcountercolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Cash Counter ", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allOPRefundfilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },

    ];


    allOPRefundColumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ]

    allIPbillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpBillColumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ]



    allIPbillPatienwisefilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpBillPatienwiseColumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

    ]



    allIpCashcountercolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allIpcashcounterfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];


    allIpRefundBillcolumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Refund No", key: "refundNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayTM Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA' },


    ];


    allIPRefundBillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

    ];

    allIpBillcashcountercolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    // allIPcashcounterfilters = [
    //     { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
    //     { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

    // ];

    allIpAdvancecolumns = [
        { heading: "Advance Date", key: "advDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Adv Amount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];



    allIPAdvancefilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },

    ];

    allAdvReturnfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals }

    ];

    allAdvReturncolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];



    //
    allPharmacysalesfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

    ];

    allPharmacySalescolumns = [

        { heading: "SalesNo", key: "srNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Sales Date", key: "mDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Cash Amount", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Debit", key: "debit", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Credit", key: "credit", sort: true, align: 'left', emptySign: 'NA' },

    ];

    allPharmacyPayfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

    ];

    allPharmacypaycolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayTM Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allPharmacySalesReutrnfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }
    ];

    allPharmacySalesReutrncolumns = [

        { heading: "SalesNo", key: "srNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Sales Date", key: "mDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Cash Amount", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Debit", key: "debit", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Credit", key: "credit", sort: true, align: 'left', emptySign: 'NA' },

    ];

    allPharReceiptColumns = [
        { heading: "SalesNo", key: "srNo", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "Sales Date", key: "mDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Cash Amount", key: "cashPay", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Debit", key: "debit", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Credit", key: "credit", sort: true, align: 'left', emptySign: 'NA' },

    ]

    allPharReceiptfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }


    ];

    allPurchaseColumns = [
        { heading: "Grn Date", key: "grnDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA', width: 200, },
        { heading: "Grn No", key: "grnNumber", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Invoice No", key: "invoiceNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "MRP", key: "mrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PTR", key: "ptr", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cgst(%)", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Cgst Amt", key: "cgstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 90 },
        { heading: "Sgst(%)", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Sgst Amt", key: "sgstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 90 },
        { heading: "Igst(%)", key: "igstPer", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Igst Amt", key: "igstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 90 },
        { heading: "Vat Amount", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Dis Amount", key: "discountAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cr.DrAmount", key: "crDrAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Total BillAmount", key: "totalBillAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ]

    allPurchasefilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate4, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate4, opType: OperatorComparer.Equals },
        { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }


    ];


    // gridConfigOPbill: gridModel = {
    //     //  permissionCode: permissionCodes.TallyInterface,
    //     apiUrl: "Tally/TallyOPBillCashCounterList",
    //     columnsList: this.allOPbillcolumns,
    //     sortField: "BillDate",
    //     sortOrder: 0,
    //     filters: this.allOBillfilters
    // }

    gridConfigOPBillCashcouner: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPBillCashCounterList",
        columnsList: this.allOPbillcashcountercolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOBillcashcounterfilters
    }

    gridConfigOpRefund: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPRefundBillCounterList",
        columnsList: this.allOPRefundColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOPRefundfilters
    }



    gridConfigIPBill: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/IPBillListPatientWisePaymentList",
        columnsList: this.allIpBillColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbillfilters
    }

    gridConfigIPBillPatientwise: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/IPBillListPatientWiseList",
        columnsList: this.allIpBillPatienwiseColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbillPatienwisefilters
    }

    gridConfigIPbillCashcounter: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/IPBillCashCounterList",
        columnsList: this.allIpCashcountercolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIpcashcounterfilters
    }


    gridConfigIPRefundBillPay: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/IPBillRefundBillPatientWisePaymentList",
        columnsList: this.allIpRefundBillcolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPRefundBillfilters
    }
    gridConfigIPAdvance: gridModel = {

        apiUrl: "Tally/IPAdvPatientWisePaymentList",
        columnsList: this.allIpAdvancecolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPAdvancefilters
    }

    gridConfigIAdvRefund: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/IPAdvRefundPatientWisePaymentlist",
        columnsList: this.allAdvReturncolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allAdvReturnfilters
    }

    gridConfigPharSales: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPhar2SalesList",
        columnsList: this.allPharmacySalescolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharmacysalesfilters
    }

    gridConfigPharPayment: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPhar2PaymentList",
        columnsList: this.allPharmacypaycolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharmacyPayfilters
    }

    gridConfigPharsalesreturn: gridModel = {
        apiUrl: "Tally/TallyPhar2SalesReturnList",
        columnsList: this.allPharmacySalesReutrncolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharmacySalesReutrnfilters
    }

    gridConfigPharReceipt: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyPhar2ReceiptList",
        columnsList: this.allPharReceiptColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharReceiptfilters
    }

    gridConfigPurchase: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/PurchaseWiseSupplierList",
        columnsList: this.allPurchaseColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPurchasefilters
    }


    onChangeOPBill() {

        this.fromDate = this.datePipe.transform(this.myFilteropcashcounerform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilteropcashcounerform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataOpBill();
        this.getfilterdataOprefundBill();
    }

    getfilterdataOpBill() {

        this.gridConfigOPBillCashcouner = {
            apiUrl: "Tally/TallyOPBillCashCounterList",
            columnsList: this.allOPbillcashcountercolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ]
        }

        this.opcashgrid.gridConfig = { ...this.gridConfigOPBillCashcouner };

        this.opcashgrid.bindGridData();
    }


    getfilterdataOprefundBill() {

        this.gridConfigOpRefund = {
            apiUrl: "Tally/TallyOPRefundBillCounterList",
            columnsList: this.allOPRefundColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

            ]
        }
        this.oprefunfgrid.gridConfig = this.gridConfigOpRefund;
        this.oprefunfgrid.bindGridData();
    }

    //IP
    onChangeIPBill() {
        debugger
        this.fromDate1 = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataIpBill();
        this.getfilterdataIPcashdBill();
        this.getfilterdataIPBillPaienwise()
        this.getfilterdataIPrefunddBill()
    }

    getfilterdataIpBill() {

        // this.gridConfigIPBill = {
        //     apiUrl: "Tally/IPBillListPatientWisePaymentList",
        //     columnsList: this.allIpBillColumns,
        //     sortField: "BillDate",
        //     sortOrder: 0,
        //     filters: [ { fieldName: "FromDate", fieldValue:  this.fromDate, opType: OperatorComparer.Equals },
        //                  { fieldName: "Todate", fieldValue:   this.fromDate, opType: OperatorComparer.Equals },

        //     ]
        // }
        // this.ipbillGrid.gridConfig = this.gridConfigIPBill;
        // this.ipbillGrid.bindGridData();
    }



    getfilterdataIPcashdBill() {

        this.gridConfigIPbillCashcounter = {
            apiUrl: "Tally/IPBillCashCounterList",
            columnsList: this.allIpCashcountercolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ]
        }
        this.ipcashcounergrid.gridConfig = this.gridConfigIPbillCashcounter;
        this.ipcashcounergrid.bindGridData();
    }

    getfilterdataIPBillPaienwise() {

        this.gridConfigIPBillPatientwise = {
            apiUrl: "Tally/IPBillListPatientWiseList",
            columnsList: this.allIpBillPatienwiseColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ]
        }
        this.ippatientwiseGrid.gridConfig = this.gridConfigIPBillPatientwise;
        this.ippatientwiseGrid.bindGridData();
    }

    getfilterdataIPrefunddBill() {

        this.gridConfigIPRefundBillPay = {
            apiUrl: "Tally/IPBillRefundBillPatientWisePaymentList",
            columnsList: this.allIpRefundBillcolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ]
        }
        this.iprefundgrid.gridConfig = this.gridConfigIPRefundBillPay;
        this.iprefundgrid.bindGridData();
    }


    onChangeIPAdvance() {

        this.fromDate2 = this.datePipe.transform(this.myFilterIpAdvform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate2 = this.datePipe.transform(this.myFilterIpAdvform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataIpAdvance();
        this.getfilterdataIPAdvRefund();

    }


    getfilterdataIpAdvance() {

        this.gridConfigIPAdvance = {
            apiUrl: "Tally/IPAdvPatientWisePaymentList",
            columnsList: this.allIpAdvancecolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },

            ]
        }
        this.ipadvGrid.gridConfig = this.gridConfigIPAdvance;
        this.ipadvGrid.bindGridData();
    }

    getfilterdataIPAdvRefund() {

        this.gridConfigIAdvRefund = {
            apiUrl: "Tally/IPAdvRefundPatientWisePaymentlist",
            columnsList: this.allAdvReturncolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate2, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate2, opType: OperatorComparer.Equals },

            ]
        }
        this.ipadvrefundGrid.gridConfig = this.gridConfigIAdvRefund;
        this.ipadvrefundGrid.bindGridData();
    }

    onChangePharmacy() {
        debugger
        this.fromDate3 = this.datePipe.transform(this.myFiltersalesform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate3 = this.datePipe.transform(this.myFiltersalesform.get('enddate').value, "yyyy-MM-dd")
        this.StoreId = parseInt(this.myFiltersalesform.get('StoreId').value)


        this.getfilterdataPharsales();
        this.getfilterdataPharsalesReturn();
        this.getfilterdataPharReceipt();
        this.getfilterdataPharPayment();
    }


    getfilterdataPharsales() {

        this.gridConfigPharSales = {
            apiUrl: "Tally/TallyPhar2SalesList",
            columnsList: this.allPharmacySalescolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

            ]
        }
        this.saleGrid.gridConfig = this.gridConfigPharSales;
        this.saleGrid.bindGridData();
    }

    getfilterdataPharsalesReturn() {

        this.gridConfigPharsalesreturn = {
            apiUrl: "Tally/TallyPhar2SalesReturnList",
            columnsList: this.allPharmacySalesReutrncolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }
            ]
        }
        this.salesreturnGrid.gridConfig = this.gridConfigPharsalesreturn;
        this.salesreturnGrid.bindGridData();
    }

    getfilterdataPharReceipt() {

        this.gridConfigPharReceipt = {
            apiUrl: "Tally/TallyPhar2ReceiptList",
            columnsList: this.allPharReceiptColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

            ]
        }
        this.salesreceiptGrid.gridConfig = this.gridConfigPharReceipt;
        this.salesreceiptGrid.bindGridData();
    }

    getfilterdataPharPayment() {

        this.gridConfigPharPayment = {
            apiUrl: "Tally/TallyPhar2PaymentList",
            columnsList: this.allPharmacypaycolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate3, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate3, opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

            ]
        }
        this.phapayGrid.gridConfig = this.gridConfigPharPayment;
        this.phapayGrid.bindGridData();
    }

    onChangePurchase() {
        debugger
        this.fromDate4 = this.datePipe.transform(this.myFilterpurchaseform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate4 = this.datePipe.transform(this.myFilterpurchaseform.get('enddate').value, "yyyy-MM-dd")
        this.StoreId1 = parseInt(this.myFilterpurchaseform.get('StoreId').value)

        this.getfilterdataPurchase();
    }


    getfilterdataPurchase() {

        this.gridConfigPurchase = {
            apiUrl: "Tally/PurchaseWiseSupplierList",
            columnsList: this.allPurchaseColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate4, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate4, opType: OperatorComparer.Equals },
            { fieldName: "StoreID", fieldValue: String(this.StoreId1), opType: OperatorComparer.Equals }

            ]
        }
        this.purchaseGrid.gridConfig = this.gridConfigPurchase;
        this.purchaseGrid.bindGridData();
    }

    getValidationMessages() {
        return {
            StoreId: [
                // { name: "required", Message: "SupplierId is required" }
            ],
            //   IPDNo: [
            //     // { name: "required", Message: "SupplierId is required" }
            //   ],
            //   F_Name: [
            //     // { name: "required", Message: "Item Name is required" }
            //   ],
            //   M_Name: [
            //     // { name: "required", Message: "Batch No is required" }
            //   ],
            //   L_Name: [
            //     // { name: "required", Message: "Invoice No is required" }
            //   ],
            //   SalesNo: [
            //     // { name: "required", Message: "Invoice No is required" }
            //   ],
            //   StoreId: [
            //     // { name: "required", Message: "Invoice No is required" }
            //   ]

        };
    }
    StoreId = 0
    selectChangeStore(value) {
        if (value.value !== 0)
            this.StoreId = value.value
        else
            this.StoreId = 0

        this.onChangePharmacy();
    }

    StoreId1 = 0
    selectChangeStore1(value) {
        if (value.value !== 0)
            this.StoreId1 = value.value
        else
            this.StoreId1 = 0

        this.onChangePurchase();
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
}