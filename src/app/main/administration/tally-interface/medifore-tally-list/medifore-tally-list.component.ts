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
    myFilteropBillform: FormGroup
    myFilterIpBillform: FormGroup

    @ViewChild('OPBillGrid', { static: false }) opcashgrid: AirmidTableComponent;
    @ViewChild('OPBildetailsGrid', { static: false }) opbilldetailgrid: AirmidTableComponent;

    @ViewChild('IPBillGrid', { static: false }) ipcashcounergrid: AirmidTableComponent;
    @ViewChild('IPBilldetailGrid', { static: false }) ippatientwiseGrid: AirmidTableComponent;


    ngAfterViewInit() {
        this.gridConfigOPBill.columnsList.find(col => col.key === 'interimOrFinal')!.template = this.OPBillstatus;
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
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },

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
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
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

    gridConfigOPBill: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPBillListMediforte",
        columnsList: this.allOPbillcolumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOBillfilters
    }

    gridConfigOpbilldetail: gridModel = {
        permissionCode: permissionCodes.TallyInterface,
        apiUrl: "Tally/TallyOPBillDetailListMediforte",
        columnsList: this.allOPbilldetailColumns,
        sortField: "BillDate",
        sortOrder: 0,
        filters: this.allOPbilldetailfilters
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



    onChangeOPBill() {

        this.fromDate = this.datePipe.transform(this.myFilteropBillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilteropBillform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataOpBill();
        this.getfilterdataOpBilldetail();
    }

    getfilterdataOpBill() {

        this.gridConfigOPBill = {
            apiUrl: "Tally/TallyOPBillListMediforte",
            columnsList: this.allOPbillcolumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ]
        }

        this.opcashgrid.gridConfig = { ...this.gridConfigOPBill };

        this.opcashgrid.bindGridData();
    }

    getfilterdataOpBilldetail() {

        this.gridConfigOpbilldetail = {
            apiUrl: "Tally/TallyOPBillDetailListMediforte",
            columnsList: this.allOPbilldetailColumns,
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ]
        }

        this.opbilldetailgrid.gridConfig = { ...this.gridConfigOpbilldetail };

        this.opbilldetailgrid.bindGridData();
    }


    //IP
    onChangeIPBill() {
        debugger
        this.fromDate1 = this.datePipe.transform(this.myFilterIpBillform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this.myFilterIpBillform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdataIpBill();
        this.getfilterdataIPBilldetail();

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
            sortField: "BillDate",
            sortOrder: 0,
            filters: [{ fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
            { fieldName: "Todate", fieldValue: this.toDate1, opType: OperatorComparer.Equals },

            ]
        }
        this.ippatientwiseGrid.gridConfig = { ...this.gridConfigIPBilldetail };
        this.ippatientwiseGrid.bindGridData();
    }

}
