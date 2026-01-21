import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { Overlay, ToastrService } from 'ngx-toastr';
import { NewTallyComponent } from './new-tally/new-tally.component';
import { TallyInterfaceService } from './tally-interface.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { DatePipe } from '@angular/common';
import { map, Observable, startWith } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ConfigService } from 'app/core/services/config.service';


@Component({
    selector: 'app-tally-interface',
    templateUrl: './tally-interface.component.html',
    styleUrls: ['./tally-interface.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TallyInterfaceComponent implements OnInit {
    myFilterbillform: FormGroup;
    myFilterpayform: FormGroup;
    myFilterrefundform: FormGroup;

    myFilterIpBillform: FormGroup;
    myFilterIpAdvform: FormGroup;
    myFilterIpAdvReturnform: FormGroup;
    myFilteropcashcounerform: FormGroup;
    myFilterIprefundBillform: FormGroup;
    myFilterIpcashcounterform: FormGroup;
    myFiltersalesform: FormGroup;
    myFiltersalesreurnform: FormGroup;
    myFilterPharPaymentform: FormGroup;
    myFilterPhar2receiptform: FormGroup;
    myFilterPurchaseform: FormGroup;

    menuActions: Array<string> = [];

    @ViewChild('opBillGrid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('opPaymentGrid', { static: false }) grid1: AirmidTableComponent;
    @ViewChild('opRefundGrid', { static: false }) grid2: AirmidTableComponent;

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


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

    rfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    rtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    pfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ptoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    constructor(public _OPListService: TallyInterfaceService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        public _accountService: AuthenticationService,
        public _whatsppService: WhatsAppEmailService,
        private overlay: Overlay
    ) { }

    vstoreId = 0
    ngOnInit(): void {

        this.vstoreId = this._accountService.currentUserValue.user.storeId
      
        // this.myFilterbillform = this._OPListService.myFilterbillbrowseform();
        this.myFilterrefundform = this._OPListService.myFilterOprefundform();
        this.myFilteropcashcounerform = this._OPListService.myFilterOpcashcounerform();

        this.myFilterIpBillform = this._OPListService.myFilterrIPBillform();
        this.myFilterIpcashcounterform = this._OPListService.myFilterrIPcashcounterform();
         this.myFilterIpAdvform = this._OPListService.myFilterIPAdvanceform();
        this.myFilterIpAdvReturnform = this._OPListService.myFilterAdvrefundform();
        this.myFilterIprefundBillform = this._OPListService.myFilterrIPrefundBillform();
       
        this.myFiltersalesform = this._OPListService.myFiltersalesform();
        this.myFiltersalesreurnform = this._OPListService.myFilterrsalesreturnform();
        this.myFilterPharPaymentform = this._OPListService.myFilterPharPaymentform();
        this.myFilterPhar2receiptform = this._OPListService.myFilterPhar2receiptform();
        this.myFilterPurchaseform = this._OPListService.myFilterpurchaseform();

}

    allOBillfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allOPbillcolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "PayTM Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];

    allOBillcashcounterfilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allOPbillcashcountercolumns = [
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


    allOPRefundfilters = [
        { fieldName: "From_Dt", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

    ];


    allOPRefundColumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        // { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


        // {
        //     heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate2
        // },
    ]

    allIPbillfilters = [
        { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

    ];


    allIpBillColumns = [
        { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Refund No", key: "refundNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },

        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


        // {
        //     heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate2
        // },
    ]

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
        { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

    ];

    allAdvReturnfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }

    ];

    allAdvReturncolumns = [
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
        { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

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
        { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

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


    allIPcashcounterfilters = [
        { fieldName: "FromDate", fieldValue: this.pfromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.ptoDate, opType: OperatorComparer.Equals },

    ];


    //
    allPharmacysalesfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
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
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
         { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }

    ];

    allPharmacypaycolumns = [
        { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "CashCounter Name", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Net Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Amount", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Amount", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Amount", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        // { heading: "NEFT Amount", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PayTM Amount", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Adv used Amount", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },


    ];


    allPharmacySalesReutrnfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
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
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
         { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }


    ];

    allPurchaseColumns = [
        { heading: "Grn Date", key: "grnDate", sort: true, align: 'left', emptySign: 'NA', width: 120, type: 6 },
        { heading: "Supplier Name", key: "supplierName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Grn N0", key: "grnNumber", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Invoice No", key: "invoiceNo", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "MRP", key: "mrp", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "PTR", key: "ptr", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cgst(%)", key: "cgstPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Cgst Amt", key: "cgstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Sgst(%)", key: "sgstPer", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Sgst Amt", key: "sgstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Igst(%)", key: "igstPer", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Igst Amt", key: "igstAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Vat Amount", key: "vatAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Dis Amount", key: "discountAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cr.DrAmount", key: "crDrAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Total BillAmount", key: "totalBillAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
       

        // {
        //     heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate2
        // },
    ]

    allPurchasefilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
         { fieldName: "StoreID", fieldValue: String(this.vstoreId), opType: OperatorComparer.Equals }


    ];


    gridConfigOPbill: gridModel = {

        apiUrl: "Tally/TallyOPBillCashCounterList",
        columnsList: this.allOPbillcolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOBillfilters
    }

    gridConfigOPBillCashcouner: gridModel = {
        apiUrl: "Tally/TallyOPBillCashCounterList",
        columnsList: this.allOPbillcashcountercolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOBillcashcounterfilters
    }

    gridConfigOpRefund: gridModel = {
        apiUrl: "Tally/TallyOPRefundBillCounterList",
        columnsList: this.allOPRefundColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOPRefundfilters
    }



    gridConfigIPBill: gridModel = {
        apiUrl: "Tally/IPBillListPatientWisePaymentList",
        columnsList: this.allIpBillColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPbillfilters
    }


    gridConfigIPAdvance: gridModel = {

        apiUrl: "Tally/IPAdvPatientWisePaymentList",
        columnsList: this.allIpAdvancecolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPAdvancefilters
    }

    gridConfigIAdvRefund: gridModel = {
        apiUrl: "Tally/IPAdvRefundPatientWisePaymentlist",
        columnsList: this.allAdvReturncolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allAdvReturnfilters
    }


    gridConfigIPbillCashcounter: gridModel = {
        apiUrl: "Tally/IPBillCashCounterList",
        columnsList: this.allIpCashcountercolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIpcashcounterfilters
    }

    gridConfigIPRefundBillPay: gridModel = {
        apiUrl: "Tally/IPBillRefundBillPatientWisePaymentList",
        columnsList: this.allIpRefundBillcolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allIPRefundBillfilters
    }

    gridConfigPharSales: gridModel = {
        apiUrl: "Tally/TallyPhar2SalesList",
        columnsList: this.allPharmacySalescolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharmacysalesfilters
    }

    gridConfigPharPayment: gridModel = {
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
        apiUrl: "Tally/TallyPhar2ReceiptList",
        columnsList: this.allPharReceiptColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPharReceiptfilters
    }

    gridConfigPurchase: gridModel = {
        apiUrl: "Tally/PurchaseWiseSupplierList",
        columnsList: this.allPurchaseColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allPurchasefilters
    }

    viewgetOPPayemntPdf(data, status) {
        if (status == true)
            this.commonService.Onprint("PaymentId", data, "OPPaymentReceipt");
        else
            this.commonService.Onprint("PaymentId", data.paymentId, "OPPaymentReceipt");
    }


    viewgetOPRefundBillReportPdf(data) {

        this.commonService.Onprint("RefundId", data.refundId, "OPRefundReceipt");
    }


    //All Good print is ok
    currentDate = new Date();
    viewgetOPBillThermalReportPdf(BillNo) {

        //   debugger
        //   let param = {
        //       "searchFields": [
        //           {
        //               "fieldName": 'BillNo',
        //               "fieldValue": String(BillNo),
        //               "opType": "13"
        //           }
        //       ],
        //       "mode": 'OPBillPrint'
        //   }
        //   this._OPListService.getReportView(param).subscribe(res => {
        //       console.log(res)
        //       this.reportPrintObjList = res as BrowseOPDBill[]; 
        //       setTimeout(() => {
        //           this.print3();
        //       }, 1000);
        //   });
    }


    onTabChange(event: MatTabChangeEvent) {
        console.log('Selected Tab Index:', event.index);
        console.log('Selected Tab Label:', event.tab.textLabel);

        // Add custom logic here
        //   if (event.index === 1) {
        //       this.grid.gridConfig = this.gridConfig
        //       console.log('Tab 1 is selected');
        //       this.grid.bindGridData();

        //   }
        //   if (event.index === 2) {
        //       this.grid.gridConfig = this.gridConfig1
        //       console.log('Tab 2 is selected');
        //       this.grid.bindGridData();

        //   }
        //   if (event.index === 3) {
        //       this.grid.gridConfig = this.gridConfig2
        //       console.log('Tab 3 is selected');
        //       this.grid.bindGridData();

        //   }
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
}