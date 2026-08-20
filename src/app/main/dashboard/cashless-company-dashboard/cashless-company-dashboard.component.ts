import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { CashlessDashboardService } from './cashless-dashboard.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CompanyPatientSummaryDashboardComponent } from './company-patient-summary-dashboard/company-patient-summary-dashboard.component';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-cashless-company-dashboard',
    templateUrl: './cashless-company-dashboard.component.html',
    styleUrls: ['./cashless-company-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashlessCompanyDashboardComponent implements OnInit {

    @ViewChild('grid1Ref') grid1: AirmidTableComponent;
    @ViewChild('grid2Ref') grid2: AirmidTableComponent;
    @ViewChild('grid3Ref') grid3: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButTemplate') actionButTemplate!: TemplateRef<any>;
    @ViewChild('ActionButtonCompnayPatientType') ActionButtonCompnayPatientType!: TemplateRef<any>;

    fromDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");
    toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

    // ===== Start Table Count Wise summary  =================

    myformSearch: FormGroup;

    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig_CompanyWise.columnsList.find(col => col.key === 'action')!.template = this.actionButTemplate;
        this.gridConfig_CompanyWise.columnsList.find(col => col.key === 'opdIpdType')!.template = this.ActionButtonCompnayPatientType;
    }


    allcolumns = [
        { heading: "Visit Date", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 200 },
        { heading: "Total Cnt", key: "totalCount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Self Cnt", key: "selfCount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Company Cnt", key: "companyCount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Approved Cnt", key: "approvedCount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Pending Cnt", key: "pendingCount", sort: true, align: "center", emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    allfilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate ?? '', opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate ?? '', opType: OperatorComparer.Equals },
    ]
    gridConfig: gridModel = {
        apiUrl: "CashLess/CashlessCountSummaryList",
        columnsList: this.allcolumns,
        sortField: "count",
        sortOrder: 0,
        filters: this.allfilters,
    }

    // ========================= end table Count Wise summary  =================

    // ===== Start Table Count Wise summary  =================

    allcolumns_CompanyWise = [
        { heading: "", key: "opdIpdType", sort: false, align: "left", emptySign: 'NA', width:70, type: gridColumnTypes.template,
               template: this.ActionButtonCompnayPatientType 
        },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Count", key: "patientCount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Net Bill Amt", key: "draftBill", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Pharmacy Amt", key: "pharmacyAmount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Final Amt", key: "finalAmount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Approved Amt", key: "ApprovedAmount", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Remaining Amt", key: "remainingAmount", sort: true, align: "center", emptySign: 'NA' },
          {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButTemplate  // Assign ng-template to the column
        }
    ]

    allfilters_CompanyWise = [
        { fieldName: "FromDate", fieldValue: this.fromDate ?? '', opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate ?? '', opType: OperatorComparer.Equals },
    ]
    gridConfig_CompanyWise: gridModel = {
        apiUrl: "CashLess/CashlessCompanyWiseSummaryList",
        columnsList: this.allcolumns_CompanyWise,
        sortField: "companyName",
        sortOrder: 0,
        filters: this.allfilters_CompanyWise,
    }

    // ========================= end table Count Wise summary  =================

    // ===== Start Table Count Wise summary  =================

    allcolumns_MonthlyCompanyWise = [
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Jan", key: "jan", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Feb", key: "feb", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Mar", key: "mar", sort: true, align: "center", emptySign: 'NA' },
        { heading: "Apr", key: "apr", sort: true, align: "center", emptySign: 'NA' },
        { heading: "May", key: "may", sort: true, align: "center", emptySign: 'NA' },
        { heading: "jun", key: "jun", sort: true, align: "center", emptySign: 'NA' },
        { heading: "jul", key: "jul", sort: true, align: "center", emptySign: 'NA' },
        { heading: "aug", key: "aug", sort: true, align: "center", emptySign: 'NA' },
        { heading: "sep", key: "sep", sort: true, align: "center", emptySign: 'NA' },
        { heading: "oct", key: "oct", sort: true, align: "center", emptySign: 'NA' },
        { heading: "nov", key: "nov", sort: true, align: "center", emptySign: 'NA' },
        { heading: "dec", key: "dec", sort: true, align: "center", emptySign: 'NA' },
    ]
    allfilters_MonthlyCompanyWise = [
        { fieldName: "Year", fieldValue: '2026', opType: OperatorComparer.Equals },
    ]
    gridConfig_MonthlyCompanyWise: gridModel = {
        apiUrl: "CashLess/CashlessMonthlyCompanyWiseSummary",
        columnsList: this.allcolumns_MonthlyCompanyWise,
        sortField: "companyName",
        sortOrder: 0,
        filters: this.allfilters_MonthlyCompanyWise,
    }

    //========================= end table Count Wise summary  =================

    constructor(
        public _CashlessDashboardService: CashlessDashboardService,
        public permissionService: PagePermissionService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._CashlessDashboardService.createSearchForm();
            this.myformSearch.get('fromDate')?.setValue(this.fromDate)
        this.myformSearch.get('enddate')?.setValue(this.toDate)
        this.getCashlessDashboardData();
    }
    onGo() { 
        this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate')?.value, "yyyy-MM-dd") || "01/01/1900",
            this.toDate = this.datePipe.transform(this.myformSearch.get('enddate')?.value, "yyyy-MM-dd") || "01/01/1900",
            this.getfilterdata();
        this.getCashlessDashboardData();
    }

    onView(row: any) {
        console.log(row)
    }
    onViewCompanyPatientSummary(row: any) {
        console.log(row)
        this.fromDate
        this.toDate
        const dialogRef = this._matDialog.open(CompanyPatientSummaryDashboardComponent,
            {
                maxWidth: "90vw",
                height: '90vw',
                width: '100%',
                // data: row
                data: {
                    row: row,
                    fromDate: this.fromDate,
                    toDate: this.toDate
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
        });
    }
    getfilterdata() {
        // ===== Start Table Count Wise summary  =================
        this.gridConfig = {
            apiUrl: "CashLess/CashlessCountSummaryList",
            columnsList: this.allcolumns,
            sortField: "count",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.fromDate ?? '', opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: this.toDate ?? '', opType: OperatorComparer.Equals },
            ],
        }
        this.grid1.gridConfig = this.gridConfig;
        this.grid1.bindGridData();

        // ===== Start Table Company Count Wise summary  =================
        this.gridConfig_CompanyWise = {
            apiUrl: "CashLess/CashlessCompanyWiseSummaryList",
            columnsList: this.allcolumns_CompanyWise,
            sortField: "companyName",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.fromDate ?? '', opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: this.toDate ?? '', opType: OperatorComparer.Equals },
            ],
        }
        this.grid2.gridConfig = this.gridConfig_CompanyWise;
        this.grid2.bindGridData();

        // ===== Start Table Monthly Company Wise summary  =================
        this.gridConfig_MonthlyCompanyWise = {
            apiUrl: "CashLess/CashlessMonthlyCompanyWiseSummary",
            columnsList: this.allcolumns_MonthlyCompanyWise,
            sortField: "companyName",
            sortOrder: 0,
            filters: [
                { fieldName: "Year", fieldValue: '2026', opType: OperatorComparer.Equals },
            ],
        }
        this.grid3.gridConfig = this.gridConfig_MonthlyCompanyWise;
        this.grid3.bindGridData();

    }
    VSalesSection: CashlessPatientSummary[] = [];
    vCashlessData: any;
    vcashlessList: CashlessPatientSummary[] = [];
    vCashLessRevenu: CashlessPatientRevenu[] = [];
    vCashLessCollection: CashlessPatientCollection[] = [];
    getCashlessDashboardData() {
        this._CashlessDashboardService.getCashlessDashboard({ "UnitId": 1, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((data) => {
            this.vCashlessData = data;
            console.log('Cashless Reports:', data);
            if (this.vCashlessData) {
                this.vcashlessList = (data?.cashlessPatientSummary || []).map(
                    (item: any) => new CashlessPatientSummary(item)
                ); 
                this.VSalesSection =   this.vcashlessList 
                console.log(this.vcashlessList) 
                this.vcashlessList = this.vcashlessList.filter( item => item.section !== 'Sales'); 
                this.VSalesSection = this.VSalesSection.filter( item => item.section === 'Sales');
                
                

                this.vCashLessRevenu = (data?.revenueSummaries || []).map((item:any) => new CashlessPatientRevenu(item))
                this.vCashLessCollection = (data?.collectionSummaries || []).map((item:any) => new CashlessPatientCollection(item))
                
            }
        });

    }

    getApprovedPercent(item: any): number {
        if (!item.companyCount) return 0;
        return (item.approvedCount / item.companyCount) * 100;
    }

}

export class CashlessPatientSummary {
    section: any;
    totalCount: any;
    selfCount: any;
    companyCount: any;
    approvedCount: any;
    pendingCount: any;
    constructor(data: any) {
        this.section = data.section || '';
        this.totalCount = data.totalCount || '0';
        this.selfCount = data.selfCount || '0';
        this.companyCount = data.companyCount || '0';
        this.approvedCount = data.approvedCount || '0';
        this.pendingCount = data.pendingCount || '0';
    }
}
export class CashlessPatientRevenu {
    lbl: any;
    netAmount: any;
    balanceAmount: any; 
    constructor(data: any) {
        this.lbl = data.lbl || '';
        this.netAmount = data.netAmount || '0';
        this.balanceAmount = data.balanceAmount || '0'; 
    } 
}

export class CashlessPatientCollection {
    lbl: any;
    cashCollection: any;
    chequeCollection: any; 
    cardCollection: any;
    upiCollection: any;
    neftCollection: any; 
    totalCollection:any;
    constructor(data: any) {
        this.lbl = data.lbl || '';
        this.cashCollection = data.cashCollection || '0';
        this.chequeCollection = data.chequeCollection || '0'; 
        this.cardCollection = data.cardCollection || '0';
        this.upiCollection = data.upiCollection || '0';
         this.neftCollection = data.neftCollection || '0';
        this.totalCollection = data.totalCollection || '0';  
    } 
} 
