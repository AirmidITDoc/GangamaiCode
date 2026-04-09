import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { BillRevenuList } from 'app/main/Lab Management/branch-wise-summary/branch-wise-summary.component';
import { DashboardService } from '../dashboard.service';
import { Chart } from 'chart.js';
import { MatDialog } from '@angular/material/dialog';
import { RadiologysaleComponent } from './radiologysale/radiologysale.component';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { StoreUnitContextService } from 'app/main/shared/services/storeunit-context.service';
import { DepartmentSalesComponent } from './department-sales/department-sales.component';

@Component({
    selector: 'app-lab-financial-dashboard',
    templateUrl: './lab-financial-dashboard.component.html',
    styleUrls: ['./lab-financial-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabFinancialDashboardComponent {
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    myFilterform: FormGroup;
    username = '';
    UnitId: any = this._accountServices.currentUserValue.user.unitId;


    //Raksha

    TopDDstoreId: number;
    TopDDunitId: number;

    constructor(
        public _dashboardServices: DashboardService,
        public _accountServices: AuthenticationService,
        private router: Router, private contextSvc: StoreUnitContextService,
        public datePipe: DatePipe, public _matDialog: MatDialog,
    ) { }

    AppoinmentCount: any;
    TotalAdmittedCount: any;
    TotalSelf: any;
    TotalCompany: any;
    TodayAdmittedCount: any;
    TodayDischargeCount: any;
    TodaySelf: any;
    TodayOther: any;
    opippharmacyTotal: any;

    // Summary card data
    todayRegistration = 0;
    todaySales = 0;
    thisMonthSales = 0;
    todayTests = 0;
    pendingTests = 0;
    labBusinessLabel = 'Radiology Sale';

    monthtestCount = 0;
    monthcenter = 0;
    monthcorporate = 0;
    monthdigital = 0;
    monthreferral = 0;
    monthnetSale = 0;

    doctorSales = new MatTableDataSource<DoctorSalesList>();
    BranchList = new MatTableDataSource<branchList>();
    cpSales = new MatTableDataSource<CompanyList>();
    RadioSales = new MatTableDataSource<RadioList>();

    // Department wise sales  
    //  'corporate', 'digital', 'referral',?
    departmentSalesColumns: string[] = ['department', 'testCount', 'centerSale', 'netSale'];

    departmentSales = new MatTableDataSource<departmentList>();
    todaySaleTotal = 0;
    todaySaleTestCount = 0;
    monthSaleTotal = 0;
    monthTestCount = 0;
    public DailysalesChart: any;
    // Daily sales chart (ngx-charts)

    chartColorScheme: any = { domain: ['#4CAF50'] };

    // Doctor wise sales
    doctorSalesColumns: string[] = ['doctorName', 'totalPatient', 'totalAmt', 'totalSales', 'paidAmount'];
    branchColumns: string[] = ['hospitalName', 'MonthlySale', 'Todaysale'];
    // CP wise sales
    cpSalesColumns: string[] = ['cpName', 'totalPatient', 'totalSales'];

    metrics = [
        { label: 'Todays Registration', value: 0, color: 'green', icon: 'user-plus' },
        { label: 'Todays Sales', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'Todays Test', value: 0, color: 'sky', icon: 'logout' },
        { label: 'Business', value: 0, color: 'butter', icon: 'user-plus' }
    ];


    // Marketing wise sales
    marketingSalesColumns: string[] = ['marketingEx', 'gross', 'discount', 'reversal', 'net'];
    marketingSales = new MatTableDataSource<any>([

    ]);


    Financedata: any;

    ngOnInit(): void {

        this.myFilterform = this._dashboardServices.filterFormfinance();
        this.username = this._accountServices.currentUserValue.userName ? this._accountServices.currentUserValue.userName : '';


        this.contextSvc.context$.subscribe(res => {
            if (res) {
                this.TopDDstoreId = res.storeId;
                this.TopDDunitId = res.unitId;

                console.log('StoreId:', this.TopDDstoreId);
                console.log('UnitId:', this.TopDDunitId);
            }
        });
        this.Mainsummarylist()
    }

    onGo(): void {
        this.UnitId = this._accountServices.currentUserValue.user.unitId
        
        this.Mainsummarylist()
        
    }

    selectBranch(branch: string): void {
        // this.selectedBranch = branch;
    }


    get cpTotalPatient(): number {
        return this.cpSales.data.reduce((sum, r) => sum + (r.totalPatients || 0), 0);
    }
    get cpTotalSales(): number {
        return this.cpSales.data.reduce((sum, r) => sum + (r.totalSales || 0), 0);
    }
    get deptTotalTestCount(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.testCount || 0), 0);
    }
    get deptTotalCenSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.centerSale || 0), 0);
    }

    get deptTotalCopSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.corporate || 0), 0);
    }
    get deptTotalDigSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.digital || 0), 0);
    }

    get deptTotalrefSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.referral || 0), 0);
    }
    get deptTotalNetSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.netSale || 0), 0);
    }

    get marketingTotalGross(): number {
        return this.marketingSales.data.reduce((sum, r) => sum + (r.gross || 0), 0);
    }
    get marketingTotalDiscount(): number {
        return this.marketingSales.data.reduce((sum, r) => sum + (r.discount || 0), 0);
    }
    get marketingTotalReversal(): number {
        return this.marketingSales.data.reduce((sum, r) => sum + (r.reversal || 0), 0);
    }
    get marketingTotalNet(): number {
        return this.marketingSales.data.reduce((sum, r) => sum + (r.net || 0), 0);
    }

    get drTotalTestCount(): number {
        return this.doctorSales.data.reduce((sum, r) => sum + (r.totalPatients || 0), 0);
    }
    get drTotalNetSale(): number {
        return this.doctorSales.data.reduce((sum, r) => sum + (r.netAmount || 0), 0);
    }


    get drTotaltotSale(): number {
        return this.doctorSales.data.reduce((sum, r) => sum + (r.totalAmt || 0), 0);
    }
    get drTotalpaidSale(): number {
        return this.doctorSales.data.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    }

    get BranchMonthsale(): number {
        return this.BranchList.data.reduce((sum, r) => sum + (r.monthlySale || 0), 0);
    }
    get Branchdailysale(): number {
        return this.BranchList.data.reduce((sum, r) => sum + (r.todaySale || 0), 0);
    }

    get RadiosaleTotal(): number {
        return this.RadioSales.data.reduce((sum, r) => sum + (r.dailyRadiologySale || 0), 0);
    }

  
    //Common
    Billdetaildatasource = new MatTableDataSource<BillRevenuList>();
    paydata = []
    paymentModeData1: any[] = []
    modalityData = [

    ];
    modalityData1 = [
        { name: '', value: 0 }
    ];
    salesdata: any
    trendData: any
    MainBranchsummarylist() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020'


        this._dashboardServices.getLabSummarydetailList({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((data) => {
            console.log(data)
            
            this.salesdata = data.dailySalesTrend
            if (data.dailySalesTrend.length == 0) {
                this.modalityData = []
                this.trendData = []
            }
            else
                this.trendData = data.dailySalesTrend
            console.log(data.dailySalesTrend)

            // this.BranchList.data = data.branchList
            this.marketingSales.data = data.executiveWiseSales
            this.departmentSales.data = data.departmentWiseSales;
            this.doctorSales.data = data.refDoctorWiseSales;
            this.cpSales.data = data.cpWiseSales;
            this.RadioSales.data = data.radiologySales;


            this.todayRegistration = data.topBoxes.todayRegistration
            this.todaySales = data.topBoxes.todaySales
            this.thisMonthSales = data.topBoxes.monthlySale
            this.todayTests = data.topBoxes.todayTotalTests
            this.pendingTests = data.topBoxes.todayPendingReports


            this.monthtestCount = data.departmentSummary[1].testCount
            this.monthcenter = data.departmentSummary[1].centerSale
            this.monthcorporate = data.departmentSummary[1].corporate
            this.monthdigital = data.departmentSummary[1].digital
            this.monthreferral = data.departmentSummary[1].referral
            this.monthnetSale = data.departmentSummary[1].netSale


            // if (data.dailySalesTrend.length) {

            // this.modalityData = [
            //     ...this.modalityData,
            //     ...this.trendData.map(item => ({

            //         name: item.billDate,
            //         value: item.dailySales
            //     }))
            // ];
            // }

            this.modalityData = data.dailySalesTrend

            console.log(this.modalityData)

            // if (data.dailySalesTrend.length)
            this.DailysalesChart = this.getSalesBarChart();

        })
    }


    Mainsummarylist() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020'


        this._dashboardServices.getLabSummarydetailList({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((data) => {
            console.log(data)
            debugger
            this.salesdata = data.dailySalesTrend
            this.trendData = data.dailySalesTrend
            if (data.dailySalesTrend.length == 0)
                this.modalityData = []
            this.BranchList.data = data.branchList
            this.marketingSales.data = data.executiveWiseSales
            this.departmentSales.data = data.departmentWiseSales;
            this.doctorSales.data = data.refDoctorWiseSales;
            this.cpSales.data = data.cpWiseSales;
            this.RadioSales.data = data.radiologySales;


            this.todayRegistration = data.topBoxes.todayRegistration
            this.todaySales = data.topBoxes.todaySales
            this.thisMonthSales = data.topBoxes.monthlySale
            this.todayTests = data.topBoxes.todayTotalTests
            this.pendingTests = data.topBoxes.todayPendingReports


            this.monthtestCount = data.departmentSummary[1].testCount
            this.monthcenter = data.departmentSummary[1].centerSale
            this.monthcorporate = data.departmentSummary[1].corporate
            this.monthdigital = data.departmentSummary[1].digital
            this.monthreferral = data.departmentSummary[1].referral
            this.monthnetSale = data.departmentSummary[1].netSale

            debugger
            // if (data.dailySalesTrend.length) {

            //     this.modalityData = [
            //         ...this.modalityData,
            //         ...this.trendData.map(item => ({

            //             name: item.billDate,
            //             value: item.dailySales
            //         }))
            //     ];
            // }
            debugger
            // console.log(this.modalityData)
            this.modalityData = data.dailySalesTrend

            if (data.dailySalesTrend.length)
                this.DailysalesChart = this.getSalesBarChart();

        })
    }
    getSalesBarChart() {
        if (this.DailysalesChart) {
            this.DailysalesChart.destroy();
        }


        return new Chart('DailysalesChart', {
            type: 'bar',
            data: {
                labels: this.modalityData.map(d => this.datePipe.transform(d.billDate, 'dd-MMM')),
                datasets: [
                    {
                        label: 'Date',
                        data: this.modalityData.map(d => d.dailySales),
                        backgroundColor: [
                            '#d289f4',   // very pale blue
                            '#e680c9',   // light sky blue
                            '#7dc1f9',   // medium light blue
                            '#749bf6',   // your bright one
                            '#8082fd',   // indigo transition
                            '#6b70f8',   // deep vivid blue
                            '#c57bf7',   // bluish purple
                            '#a660d5'    // final vivid purple
                        ],
                        borderRadius: 6
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 }
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        }
                    }
                }
            }
        });
    }


    GetDetails(event) {
        console.log(event)
        this.UnitId = event.hospitalId
        this.MainBranchsummarylist()
    }

    RadiologycollectionTrend() {
        if (this.RadioSales.data.length) {
            this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")

            const dialogRef = this._matDialog.open(RadiologysaleComponent,
                {
                    maxWidth: "70vw",
                    height: '70%',
                    width: '90%',
                    data: { unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
                });
            dialogRef.afterClosed().subscribe(result => {

            });
        } else
            Swal.fire("Data Not Avilable!....")
    }

     DeptGetDetails(element) {
        // if (this.RadioSales.data.length) {
        debugger
        console.log(element)
            this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd")

            const dialogRef = this._matDialog.open(DepartmentSalesComponent,
                {
                    maxWidth: "50vw",
                    height: '60%',
                    width: '50%',
                    data: { unit: this.UnitId,groupId: element.groupId, fdate: this.fromDate, tdate: this.toDate }
                });
            dialogRef.afterClosed().subscribe(result => {

            });
        // } else
        //     Swal.fire("No data Avilable!....")
    }

    
    getMatIcon(icon: string): string {
        switch (icon) {
            case 'assignment':
                return 'assignment';
            case 'user-plus':
                return 'person_add';
            case 'calendar':
                return 'calendar_today';
            case 'check-circle':
                return 'check_circle';
            case 'logout':
                return 'exit_to_app';
            case 'hourglass':
                return 'hourglass_empty';
            case 'ambulance':
                return 'local_hospital';
            default:
                return 'dashboard';
        }
    }

    // added by raksha on 08/04/2026
    printDailyCollectionWithSummary() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd') || '01/01/2020'
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "FromDate",
                        "fieldValue": this.fromDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "ToDate",
                        "fieldValue": this.toDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "UserId",
                        "fieldValue": String(this._accountServices.currentUserValue.userId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "HospitalId",
                        "fieldValue": String(this.TopDDunitId),
                        "opType": "Equals"
                    }
                ],
                "reportId": 303
            }
            console.log(param)
            this._dashboardServices.print(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Report Viewer"
                    }
                });
                matDialog.afterClosed().subscribe(result => { });
            });
        }, 100);
    }

    printLabDailyCollectionDetailsWithSummary() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd') || '01/01/2020'
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "FromDate",
                        "fieldValue": this.fromDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "ToDate",
                        "fieldValue": this.toDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "HospitalId",
                        "fieldValue": String(this.TopDDunitId),
                        "opType": "Equals"
                    }
                ],
                "reportId": 304
            }
            console.log(param)
            this._dashboardServices.print(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Report Viewer"
                    }
                });
                matDialog.afterClosed().subscribe(result => { });
            });
        }, 100);
    }

    printPatientDaySheet() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd') || '01/01/2020'
        setTimeout(() => {
            const param = {
                "searchFields": [
                    {
                        "fieldName": "FromDate",
                        "fieldValue": this.fromDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "ToDate",
                        "fieldValue": this.toDate,
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "HospitalId",
                        "fieldValue": String(this.TopDDunitId),
                        "opType": "Equals"
                    }
                ],
                "reportId": 306
            }
            console.log(param)
            this._dashboardServices.print(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Report Viewer"
                    }
                });
                matDialog.afterClosed().subscribe(result => { });
            });
        }, 100);
    }
}




export class DoctorSalesList {

    refDoctorname: string;
    totalPatients: number;
    netAmount: number;
    totalAmt: any
    paidAmount: any
    constructor(DoctorSalesList) {

        this.refDoctorname = DoctorSalesList.refDoctorname;
        this.totalPatients = DoctorSalesList.totalPatients || 0;
        this.netAmount = DoctorSalesList.netAmount || '0';
        this.totalAmt = DoctorSalesList.totalAmt || 0;
        this.paidAmount = DoctorSalesList.paidAmount || '0';

    }
}


export class branchList {
    hospitalId: any
    hospitalName: string;
    serverIP: string;
    serverDatabasename: string;
    userName: string;
    serverPassword: string;
    todaySale: number;
    monthlySale: number;
    constructor(branchList) {
        this.hospitalId = branchList.hospitalId;

        this.hospitalName = branchList.hospitalName;
        this.serverIP = branchList.serverIP || '';
        this.serverDatabasename = branchList.serverDatabasename || '';
        this.userName = branchList.userName || '';
        this.serverPassword = branchList.serverPassword || '';

        this.todaySale = branchList.todaySale || '0';
        this.monthlySale = branchList.monthlySale || '0';

    }
}


export class departmentList {

    department: string;
    testCount: number;
    centerSale: number;
    corporate: number;
    digital: number;
    referral: number;
    netSale: number;
    serviceName:any;
    constructor(departmentList) {

        this.department = departmentList.department;
        this.testCount = departmentList.testCount || 0;
        this.centerSale = departmentList.centerSale || '0';
        this.corporate = departmentList.corporate || '0';
        this.digital = departmentList.digital || '0';
        this.referral = departmentList.referral || '0';
        this.netSale = departmentList.netSale || '0';
        this.serviceName = departmentList.serviceName || '';

    }
}


export class CompanyList {

    companyName: string;
    totalPatients: number;
    totalSales: number;

    constructor(CompanyList) {

        this.companyName = CompanyList.companyName;
        this.totalPatients = CompanyList.totalPatients || 0;
        this.totalSales = CompanyList.totalSales || '0';

    }
}

export class RadioList {
    radDate: any;
    dailyRadiologySale: any;
    constructor(RadioList) {
        this.radDate = RadioList.radDate;
        this.dailyRadiologySale = RadioList.dailyRadiologySale;
    }
}