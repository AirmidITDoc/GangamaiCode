import { DatePipe } from '@angular/common';
import { Component, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { BillRevenuList } from 'app/main/Lab Management/branch-wise-summary/branch-wise-summary.component';
import { DashboardService } from '../dashboard.service';

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

    constructor(
        public _dashboardServices: DashboardService,
        public _accountServices: AuthenticationService,
        private router: Router,
        public datePipe: DatePipe,
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

    wardHeadCount = new MatTableDataSource<WardCount>();
    charges = new MatTableDataSource<Servicecharge>();
    opVisits = new MatTableDataSource<Visitdata>();
    referrals = new MatTableDataSource<referralsWise>();
    Billingsummary = new MatTableDataSource<Billingsummarydata>();
    consultantCharges = new MatTableDataSource<consultantChargesdata>();
    packages = new MatTableDataSource<packagesdata>();
    finOPIPPayment = new MatTableDataSource<Servicecharge>();
    receipts = new MatTableDataSource<Servicecharge>();
    receipt = new MatTableDataSource<Servicecharge>();
    advanceOPIP = new MatTableDataSource<Servicecharge>();
    refundOPIP = new MatTableDataSource<Servicecharge>();
    pharmacyReturn = new MatTableDataSource<Servicecharge>();
    pharmacyop = new MatTableDataSource<pharmacyopsales>();
    pharmacyip = new MatTableDataSource<pharmacyipsales>();
    finaladvance = new MatTableDataSource<Advance>();
    finalOutstanding = new MatTableDataSource<Advance>();
    finalOutstandingwithdate = new MatTableDataSource<Advance>();
    Insuranceds = new MatTableDataSource<Insurance>();

    // Summary card data
    todayRegistration = 0;
    todaySales = 0;
    thisMonthSales = 0;
    todayTests = 0;
    pendingTests = 0;
    labBusinessLabel = 'Lab Business';

    doctorSales = new MatTableDataSource<DoctorSalesList>();
    BranchList = new MatTableDataSource<branchList>();
    cpSales = new MatTableDataSource<CompanyList>();
    // Branch list
    branches: string[] = []
    //   'SADAR HOSPITAL VAISHALI-BIHAR',
    //   'SADAR HOSPITAL AURANGABAD-BIHAR',
    //   'AAHCUTTACK',
    //   'SADAR HOSPITAL GOPALGANJ-BIHAR',
    //   'DHH SAMBALPUR CT CENTRE',
    //   'AHRCC CT SCAN CENTER-CUTTACK',
    //   'SADAR HOSPITAL GAYA(CT)-BIHAR',
    //   'MALKANAGIRI',
    //   'DHH ANGUL MRI CENTER-ANGUL',
    //   'MKCG MCH CT SCAN CENTER-BERHAMPUR',
    // ];
    selectedBranch = 'AAHCUTTACK';

    // Department wise sales  'centerSale', 'corporate', 'digital', 'referral',
    departmentSalesColumns: string[] = ['index', 'department', 'testCount', 'netSale'];
    departmentSales = new MatTableDataSource<any>([
        // { department: 'CARDIOLOGY', testCount: 11, centerSale: 5550.0, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 5550.0 },
        // { department: 'GASTROENTEROLOGY', testCount: 4, centerSale: 6000.0, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 6000.0 },
        // { department: 'NEUROLOGY', testCount: 3, centerSale: 3700.0, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 3700.0 },
        // { department: 'PATHOLOGY', testCount: 48, centerSale: 8381.0, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 8381.0 },
        // { department: 'RADIOLOGY', testCount: 94, centerSale: 165528.27, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 165528.27 },
        // { department: 'UROFLOWMETRY', testCount: 1, centerSale: 350.0, corporate: 0.0, digital: 0.0, referral: 0.0, netSale: 350.0 },
    ]);

    todaySaleTotal = 0;
    todaySaleTestCount = 0;
    monthSaleTotal = 0;
    monthTestCount = 0;

    // Daily sales chart (ngx-charts)
    dailySalesChartData: any[] = [
        { name: '01', value: 150000 },
        { name: '02', value: 180000 },
        { name: '03', value: 120000 },
        { name: '04', value: 200000 },
        { name: '05', value: 160000 },
        { name: '06', value: 140000 },
        { name: '07', value: 190000 },
        { name: '08', value: 170000 },
        { name: '09', value: 210000 },
        { name: '10', value: 130000 },
        { name: '11', value: 175000 },
        { name: '12', value: 195000 },
        { name: '13', value: 165000 },
        { name: '14', value: 185000 },
        { name: '15', value: 220000 },
        { name: '16', value: 145000 },
        { name: '17', value: 200000 },
        { name: '18', value: 155000 },
        { name: '19', value: 180000 },
        { name: '20', value: 170000 },
        { name: '21', value: 190000 },
        { name: '22', value: 160000 },
        { name: '23', value: 175000 },
        { name: '24', value: 210000 },
        { name: '25', value: 140000 },
        { name: '26', value: 195000 },
        { name: '27', value: 189506 },
    ];
    chartColorScheme: any = { domain: ['#4CAF50'] };



    // Doctor wise sales
    doctorSalesColumns: string[] = ['index', 'doctorName', 'totalPatient', 'totalSales'];
    // doctorSales = new MatTableDataSource<any>([
    //   { doctorName: 'DESIRE TO LIFE', totalPatient: 4, totalSales: 12700.0 },
    //   { doctorName: 'CHANAKYA HOSPITAL', totalPatient: 4, totalSales: 12000.0 },
    //   { doctorName: 'MEERA HOSPITAL', totalPatient: 3, totalSales: 11700.0 },
    //   { doctorName: 'Satya Sai Clinic', totalPatient: 3, totalSales: 10700.0 },
    //   { doctorName: 'Dr.Sanjay Kumar Behera', totalPatient: 3, totalSales: 10300.0 },
    //   { doctorName: 'MATIKURUPA PATHO CARE & MEDICINE STORE', totalPatient: 3, totalSales: 8400.0 },
    //   { doctorName: 'NABAKALEBAR CLINIC', totalPatient: 2, totalSales: 7700.0 },
    //   { doctorName: 'Relax Hospital', totalPatient: 2, totalSales: 7000.0 },
    //   { doctorName: 'DR.PARSIRAM JENA', totalPatient: 3, totalSales: 6100.0 },
    //   { doctorName: 'ARCHIE HOSPITAL', totalPatient: 1, totalSales: 6000.0 },
    // ]);

    // CP wise sales
    cpSalesColumns: string[] = ['index', 'cpName', 'totalPatient', 'totalSales'];
    // cpSales = new MatTableDataSource<any>([
    //   { cpName: "DOCTOR'S CARE HOSPITAL & RESEARCH CENTRE (BSKY)", totalPatient: 2, totalSales: 8858.0 },
    //   { cpName: 'RAKSHYA HOSPITAL BSKY', totalPatient: 3, totalSales: 3238.0 },
    //   { cpName: 'SAI VISION HOSPITAL & RESEARCH CENTER(BSKY)', totalPatient: 1, totalSales: 900.0 },
    //   { cpName: 'SATYAM HOSPITAL(BSKY)', totalPatient: 1, totalSales: 800.0 },
    //   { cpName: 'ROHAN HOSPITAL(BSKY)', totalPatient: 1, totalSales: 400.0 },
    // ]);



    metrics = [
        { label: 'Todays Registration', value: 0, color: 'green', icon: 'user-plus' },
        { label: 'Todays Sales', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'Todays Test', value: 0, color: 'sky', icon: 'logout' },
        { label: 'Business', value: 0, color: 'butter', icon: 'user-plus' }
    ];

    cpTotalPatient = 8;
    cpTotalSales = 14196.0;

    // Marketing wise sales
    marketingSalesColumns: string[] = ['index', 'marketingEx', 'gross', 'discount', 'reversal', 'net'];
    marketingSales = new MatTableDataSource<any>([
        { marketingEx: 'Hrushikesh Samal', gross: 70350.0, discount: 12100.0, reversal: 0.0, net: 58850.0 },
        { marketingEx: 'Chitta Ranjan Nayak', gross: 53400.0, discount: 14350.0, reversal: 0.0, net: 39050.0 },
        { marketingEx: 'Ashish Sharma', gross: 49000.0, discount: 11400.0, reversal: 0.0, net: 37600.0 },
        { marketingEx: 'Susil Kumar Nayak', gross: 38006.0, discount: 3900.0, reversal: 978.0, net: 34106.0 },
        { marketingEx: 'Swarup Kumar Jena', gross: 15300.0, discount: 4100.0, reversal: 0.0, net: 11200.0 },
        { marketingEx: 'Japil Kasari Rout', gross: 5750.0, discount: 300.0, reversal: 0.0, net: 4950.0 },
        { marketingEx: 'Others', gross: 11350.0, discount: 7600.0, reversal: 0.0, net: 3750.0 },
    ]);
    marketingTotalGross = 243156.0;
    marketingTotalDiscount = 54250.0;
    marketingTotalReversal = 978.0;
    marketingTotalNet = 199506.0;

    // Existing column definitions kept for backward compatibility
    wardHeadCountColumns: string[] = ['wardName', 'occupancyPct', 'patients'];
    pharmacyopsalesColumns: string[] = ['Total Sales', 'Toal Cost', 'Profit'];
    chargesColumns: string[] = ['serviceName', 'ip', 'op'];
    receiptsColumns: string[] = ['serviceName', 'ip', 'op'];
    opVisitColumns: string[] = ['typeOfVisit', 'patients'];
    patientTypeColumns: string[] = ['typeOfPatient', 'ip', 'op'];

    patientTypes: any[] = [
        { typeOfPatient: 'New', ip: 0, op: 0 },
        { typeOfPatient: 'Existing', ip: 0, op: 0 },
    ];

    referralColumns: string[] = ['referredBy', 'ipPatients', 'opPatients'];
    AdvoutsandingColumns: string[] = ['IP(DIS)', 'OP', 'Total'];
    InsuranceColumns: string[] = ['Approved Amount', 'Unadjusted Advance', 'Unpaid Ip Charges', 'Insurancy Adequecy'];
    AdvadequcyColumns: string[] = ['Unadjusted Advance', 'Unpaid Ip Charges', 'Adequecy Advance'];

    receiptSummary: any[] = [
        { label: 'Receipt', amount: 0 },
        { label: 'Advance', amount: 0 },
        { label: 'Return', amount: 0 },
        { label: 'Refund', amount: 0 },
    ];

    modeSummary: any[] = [
        { label: 'Cash', amount: 0 },
        { label: 'Card', amount: 0 },
    ];

    collection: any[] = [
        { mode: 'Cash', amount: 0 },
        { mode: 'Cheque', amount: 0 },
        { mode: 'Card', amount: 0 },
        { mode: 'EFT', amount: 0 },
        { mode: 'ECS', amount: 0 },
    ];

    consultantChargeColumns: string[] = ['consultantName', 'patients', 'charges'];
    packageColumns: string[] = ['packageName', 'patients'];

    Financedata: any;

    ngOnInit(): void {
        this.myFilterform = this._dashboardServices.filterFormfinance();
        this.username = this._accountServices.currentUserValue.userName
            ? this._accountServices.currentUserValue.userName
            : '';

        this.getwardpatientList();
        this.getDoctorwisesalesList()
        this.getBranchList()
        this.GetBillRevenudetail()
        this.GetCompanywisesale()
        this.getDepartmentwisesalesList()
    }

    onGo(): void {
        this.getDoctorwisesalesList()
        this.getBranchList()
        this.GetBillRevenudetail()
        this.GetCompanywisesale()
        this.getDepartmentwisesalesList()
    }

    selectBranch(branch: string): void {
        this.selectedBranch = branch;
    }

    // formatCurrency(value: number): string {
    //   return value.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    // }

    get wardTotalPatients(): number {
        return this.wardHeadCount.data.reduce((sum, r) => sum + r.occupiedBeds, 0);
    }
    get chargesTotalIp(): number {
        return this.charges.data.reduce((sum, r) => sum + (r.ipCollection || 0), 0);
    }
    get chargesTotalOp(): number {
        return this.charges.data.reduce((sum, r) => sum + (r.opCollection || 0), 0);
    }
    get chargesDiscountIp(): number {
        return this.charges.data.reduce((sum, r) => sum + (r.ipDiscount || 0), 0);
    }
    get chargesDiscountOp(): number {
        return this.charges.data.reduce((sum, r) => sum + (r.opDiscount || 0), 0);
    }
    get chargesNetIp(): number {
        return this.chargesTotalIp - (this.chargesDiscountIp || 0);
    }
    get chargesNetOp(): number {
        return this.chargesTotalOp - (this.chargesDiscountOp || 0);
    }
    get receiptsTotalIp(): number {
        return this.receipts.data.reduce((sum, r) => sum + (r.ipCollection || 0), 0);
    }
    get receiptsTotalOp(): number {
        return this.receipts.data.reduce((sum, r) => sum + (r.opCollection || 0), 0);
    }
    get receiptsDiscountOp(): number {
        return this.receipts.data.reduce((sum, r) => sum + (r.opDiscount || 0), 0);
    }
    get receiptsDiscountIp(): number {
        return this.receipts.data.reduce((sum, r) => sum + (r.ipDiscount || 0), 0);
    }
    get receiptsNetIp(): number {
        return this.receiptsTotalIp - (this.receiptsDiscountIp || 0);
    }
    get receiptsNetOp(): number {
        return this.receiptsTotalOp - (this.receiptsDiscountOp || 0);
    }
    get opTotalPatients(): number {
        return this.opVisits.data.reduce((sum, r) => sum + r.patientCount, 0);
    }
    get pharmacyoptotal(): number {
        return this.pharmacyop.data.reduce((sum, r) => sum + r.opNetAmount, 0);
    }
    get pharmacyiptotal(): number {
        return this.pharmacyip.data.reduce((sum, r) => sum + r.ipNetAmount, 0);
    }
    get billingTotalCharges(): number {
        return this.receiptSummaryTotal;
    }
    get receiptSummaryTotal(): number {
        return this.receipt.data.reduce((sum, r) => sum + (r.receipt || 0), 0);
    }
    get receiptamount(): number {
        return this.receipt.data.reduce((sum, r) => sum + (r.receipt || 0), 0);
    }
    get modeSummaryTotal(): number {
        return this.modeSummary.reduce((sum, r) => sum + (r.amount || 0), 0);
    }
    get collectionTotal(): number {
        return this.collection.reduce((sum, r) => sum + (r.amount || 0), 0);
    }
    get getcashtotal(): number {
        return this.Billingsummary.data.reduce((sum, r) => sum + (r.cash || 0), 0);
    }
    get getcardtotal(): number {
        return this.Billingsummary.data.reduce((sum, r) => sum + (r.cardPay || 0), 0);
    }

    get deptTotalTestCount(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.testCount || 0), 0);
    }
    get deptTotalNetSale(): number {
        return this.departmentSales.data.reduce((sum, r) => sum + (r.totalAmount || 0), 0);
    }



    getDoctorwisesalesList() {

        const filters: any[] = [];
        // UnitId: this.UnitId,
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020',


            filters.push(

                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "FromDate",
                    "fieldValue": String(this.fromDate),
                    "opType": "Contains"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": String(this.toDate),
                    "opType": "Equals"
                }
            );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "DoctorName",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        this._dashboardServices.getDoctorwisesales(data).subscribe((data: any) => {
            this.Financedata = data;
            console.log(data)
            this.doctorSales.data = data.data;
        })
    }
    Brancharray = []
    getBranchList() {

        const filters: any[] = [];
        // UnitId: this.UnitId,
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020',


            filters.push(

                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "FromDate",
                    "fieldValue": String(this.fromDate),
                    "opType": "Contains"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": String(this.toDate),
                    "opType": "Equals"
                }
            );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "DoctorName",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        this._dashboardServices.getBranchList(data).subscribe((data: any) => {

            this.Brancharray = data.data as [];
            this.branches = [...new Set(this.Brancharray.map(item => item.unitBranchName))];

            console.log(this.branches)

        })
    }

    GetCompanywisesale() {

        const filters: any[] = [];
        // UnitId: this.UnitId,
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020',


            filters.push(

                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "FromDate",
                    "fieldValue": String(this.fromDate),
                    "opType": "Contains"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": String(this.toDate),
                    "opType": "Equals"
                }
            );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "CompanyName",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        this._dashboardServices.getCompanywiseList(data).subscribe((data: any) => {

            this.cpSales.data = data.data as [];
            // this.branches = [...new Set(this.Brancharray.map(item => item.unitBranchName))];

            console.log(this.cpSales.data)

        })
    }

    getDepartmentwisesalesList() {

        const filters: any[] = [];
        // UnitId: this.UnitId,
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020',


            filters.push(

                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Contains"
                },
                {
                    "fieldName": "FromDate",
                    "fieldValue": String(this.fromDate),
                    "opType": "Contains"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": String(this.toDate),
                    "opType": "Equals"
                }
            );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "UnitId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        debugger
        this._dashboardServices.getDeptwisesales(data).subscribe((data: any) => {
            console.log(data)
            this.departmentSales.data = data.data;
        })
    }
    Billdetaildatasource = new MatTableDataSource<BillRevenuList>();
    paydata = []
    paymentModeData1: any[] = []
    GetBillRevenudetail() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020'

        const vdata = {
            "first": 0,
            "rows": 200,
            "sortField": "UnitId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Equals"
                },
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

            ],
            "Columns": [],
            "exportType": "JSON"
        }

        console.log(vdata)

        this._dashboardServices.getBillrevenudetailList(vdata).subscribe(data => {
            this.Billdetaildatasource.data = data.data as BillRevenuList[]
            console.log(this.Billdetaildatasource.data)

            this.todayRegistration = this.Billdetaildatasource.data[0]['patientCount'];
            this.todaySales = this.Billdetaildatasource.data[0]['totalRevenue'];
            // this.thisMonthSales =this.Billdetaildatasource.data.patientCount;
            // this.todayTests =this.Billdetaildatasource.data.patientCount;
            // this.pendingTests = 0;
            this.labBusinessLabel = 'Lab Business';


            this.metrics = [
                { label: 'Todays Registration', value: this.Billdetaildatasource.data[0]['patientCount'] ?? 0, color: 'green', icon: 'user-plus' },
                { label: 'Todays Sales', value: this.Billdetaildatasource.data[0]['totalRevenue'] ?? 0, color: 'rose', icon: 'hourglass' },
                { label: 'Todays Test', value: 0, color: 'sky', icon: 'logout' },
                { label: 'Business', value: 0, color: 'butter', icon: 'user-plus' }
            ];



            this.paydata = [];

            // if (this.paymentModeChart) {
            //   this.paymentModeChart.destroy();
            // }
            this.Billdetaildatasource.data.forEach(element => {
                console.log(element)
                this.paydata.push({
                    mode: element.unitBranchName?.trim() || '',
                    amount: Number(element.netRevenue) || 0
                });
                console.log(this.paydata)
                // this.paymentModeData1.push(this.paydata)
            })

            // ✅ Re-create chart AFTER data is ready
            setTimeout(() => {
                // this.renderPaymentChart();
            }, 0);

            // console.log(this.paymentModeData1)
            if (this.Billdetaildatasource.data.length > 0)
                this.getsumdetail()
        })
    }

    TotAmt = 0
    TotconAmt = 0
    TotNetamt = 0

    count = 0
    TotCount = 0
    getsumdetail() {
        // 
        this.count = this.Billdetaildatasource.data.length

        this.TotCount = this.Billdetaildatasource.data.reduce((sum, { patientCount }) => sum += +(patientCount || 0), 0);

        this.TotNetamt = this.Billdetaildatasource.data.reduce((sum, { netRevenue }) => sum += +(netRevenue || 0), 0);

    }

    getwardpatientList() {
        const vadat = {
            UnitId: this.UnitId,
            FromDate: this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd') || '01/01/2020',
            ToDate: this.datePipe.transform(this.myFilterform.get('toDate').value, 'yyyy-MM-dd ') || '01/01/2020',
        };
        this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
            this.Financedata = data;
            this.wardHeadCount.data = this.Financedata.bedOccupancyCountSummary;
            this.charges.data = this.Financedata.serviceCharges;
            this.receipts.data = this.Financedata.receiptPayment;
            this.opVisits.data = this.Financedata.typeOfVisit;
            this.referrals.data = this.Financedata.ipRefDoctorCount;
            this.Billingsummary.data = this.Financedata.billSummary;
            this.receipt.data = this.Financedata.receiptOPIP;

            if (this.Financedata.financialOPExistingPatientCount) {
                this.patientTypes[0].op = this.Financedata.financialOPExistingPatientCount[0]['opNewPatientCount'];
                this.patientTypes[1].op = this.Financedata.financialOPExistingPatientCount[0]['opExistingPatientCount'];
                this.patientTypes[0].ip = this.Financedata.financialIPExistingPatientCount[0]['ipNewPatientCount'];
                this.patientTypes[1].ip = this.Financedata.financialIPExistingPatientCount[0]['ipExistingPatientCount'];
            }

            if (this.Financedata.receiptOPIP) {
                this.receiptSummary[0].amount = this.Financedata.receiptOPIP[0]['receipt'];
                this.receiptSummary[1].amount = this.Financedata.advanceOPIP[0]['advance'];
                this.receiptSummary[2].amount = this.Financedata.refundOPIP[0]['refund'];
                this.receiptSummary[3].amount = this.Financedata.pharmacyReturn[0]['return1'];
            }

            this.modeSummary[0].amount = this.getcashtotal;
            this.modeSummary[1].amount = this.getcardtotal;

            if (this.Financedata.billSummary) {
                this.collection[0].amount = this.Financedata.billSummary[0]['cash'];
                this.collection[1].amount = this.Financedata.billSummary[0]['cheque'];
                this.collection[2].amount = this.Financedata.billSummary[0]['cardPay'];
                this.collection[3].amount = this.Financedata.billSummary[0]['upi'];
            }

            this.consultantCharges.data = this.Financedata.doctorWisePatientCount;
            this.pharmacyop.data = this.Financedata.pharmacyOPDPatientSale;
            this.pharmacyip.data = this.Financedata.pharmacySaleIP;
            this.opippharmacyTotal = this.pharmacyiptotal + this.pharmacyoptotal;
            this.finalOutstanding.data = this.Financedata.financialOutStandingOPIP;
            this.packages.data = this.Financedata.pathologyWorkloads;
        });
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

}

export class WardCount {
    wardName: any;
    occupancyPercent: any;
    occupiedBeds: any;
    constructor(WardCount) {
        this.wardName = WardCount.wardName || '';
        this.occupancyPercent = WardCount.occupancyPercent || 0;
        this.occupiedBeds = WardCount.occupiedBeds || 0;
    }
}

export class Servicecharge {
    serviceName: any;
    opTotalAMT: any;
    opDiscount: any;
    ipTotalAMT: any;
    ipDiscount: any;
    IPCollection: any;
    opCollection: any;
    ipCollection: any;
    receipt: any;
    advance: any;
    refund: any;
    constructor(Servicecharge) {
        this.serviceName = Servicecharge.serviceName || '';
        this.opTotalAMT = Servicecharge.opTotalAMT || 0;
        this.opDiscount = Servicecharge.opDiscount || 0;
        this.ipTotalAMT = Servicecharge.ipTotalAMT || 0;
        this.ipDiscount = Servicecharge.ipDiscount || 0;
        this.IPCollection = Servicecharge.IPCollection || 0;
        this.opCollection = Servicecharge.opCollection || 0;
        this.ipCollection = Servicecharge.ipCollection || 0;
        this.receipt = Servicecharge.receipt || 0;
        this.advance = Servicecharge.advance || 0;
        this.refund = Servicecharge.refund || 0;
    }
}

export class Visitdata {
    typeOFVisit: any;
    patientCount: any;
    opNewPatientCount: any;
    opExistingPatientCount: any;
    ipNewPatientCount: any;
    ipExistingPatientCount: any;
    constructor(Visitdata) {
        this.typeOFVisit = Visitdata.typeOFVisit || '';
        this.patientCount = Visitdata.patientCount || 0;
        this.opNewPatientCount = Visitdata.opNewPatientCount || 0;
        this.opExistingPatientCount = Visitdata.opExistingPatientCount || 0;
        this.ipNewPatientCount = Visitdata.ipNewPatientCount || 0;
        this.ipExistingPatientCount = Visitdata.ipExistingPatientCount || 0;
    }
}

export class referralsWise {
    refName: any;
    opRefCount: any;
    ipRefCount: any;
    constructor(referralsWise) {
        this.refName = referralsWise.refName || '';
        this.opRefCount = referralsWise.opRefCount || 0;
        this.ipRefCount = referralsWise.ipRefCount || 0;
    }
}

export class Billingsummarydata {
    cash: any;
    cardPay: any;
    neft: any;
    cheque: any;
    upi: any;
    usedAdvance: any;
    amount: any;
    constructor(Billingsummarydata) {
        this.cash = Billingsummarydata.cash || '';
        this.cardPay = Billingsummarydata.cardPay || 0;
        this.neft = Billingsummarydata.neft || 0;
        this.cheque = Billingsummarydata.cheque || 0;
        this.upi = Billingsummarydata.upi || 0;
        this.usedAdvance = Billingsummarydata.usedAdvance || 0;
        this.amount = Billingsummarydata.amount || 0;
    }
}

export class consultantChargesdata {
    doctorName: any;
    patientCount: any;
    opCollection: any;
    constructor(consultantChargesdata) {
        this.doctorName = consultantChargesdata.doctorName || '';
        this.patientCount = consultantChargesdata.patientCount || 0;
        this.opCollection = consultantChargesdata.opCollection || 0;
    }
}

export class packagesdata {
    packageName: any;
    patients: any;
    constructor(packages) {
        this.packageName = packages.packageName || '';
        this.patients = packages.patients || 0;
    }
}

export class pharmacyopsales {
    opTotalLandedAmount: any;
    opNetAmount: any;
    oPprofitamount: any;
    constructor(pharmacyopsales) {
        this.opTotalLandedAmount = pharmacyopsales.opTotalLandedAmount || '0';
        this.opNetAmount = pharmacyopsales.opNetAmount || 0;
        this.oPprofitamount = pharmacyopsales.oPprofitamount || 0;
    }
}

export class pharmacyipsales {
    ipTotalLandedAmount: any;
    ipNetAmount: any;
    iPprofitamount: any;
    constructor(pharmacyopsales) {
        this.ipTotalLandedAmount = pharmacyopsales.ipTotalLandedAmount || '0';
        this.ipNetAmount = pharmacyopsales.ipNetAmount || 0;
        this.iPprofitamount = pharmacyopsales.iPprofitamount || 0;
    }
}

export class Advance {
    unadjestAdvance: any;
    opOustandingAMT: any;
    totalOutstanding: any;
    opOustandingAMTDate: any;
    ipOutstandingAMTDate: any;
    totalOutstandingdate: any;
    constructor(Advance) {
        this.unadjestAdvance = Advance.unadjestAdvance || '0';
        this.opOustandingAMT = Advance.opOustandingAMT || 0;
        this.totalOutstanding = Advance.totalOutstanding || 0;
        this.opOustandingAMTDate = Advance.opOustandingAMTDate || '0';
        this.ipOutstandingAMTDate = Advance.ipOutstandingAMTDate || 0;
        this.totalOutstandingdate = Advance.totalOutstandingdate || 0;
    }
}

export class Insurance {
    IPApprovedAmount: any;
    IPUnpaidCharges: any;
    UnadjestedAdvance: any;
    InsuranceAdequancy: any;
    constructor(Insurance) {
        this.IPApprovedAmount = Insurance.IPApprovedAmount || '0';
        this.IPUnpaidCharges = Insurance.IPUnpaidCharges || 0;
        this.UnadjestedAdvance = Insurance.UnadjestedAdvance || 0;
        this.InsuranceAdequancy = Insurance.InsuranceAdequancy || '0';
    }
}

export class DoctorSalesList {

    doctorName: string;
    testCount: number;
    totalAmount: number;
    constructor(DoctorSalesList) {

        this.doctorName = DoctorSalesList.doctorName;
        this.testCount = DoctorSalesList.testCount || 0;
        this.totalAmount = DoctorSalesList.totalAmount || '0';

    }
}


export class branchList {

    doctorName: string;
    testCount: number;
    totalAmount: number;

    constructor(branchList) {

        this.doctorName = branchList.doctorName;
        this.testCount = branchList.testCount || 0;
        this.totalAmount = branchList.totalAmount || '0';

    }
}


export class CompanyList {

    companyName: string;
    testCount: number;
    totalAmount: number;

    constructor(CompanyList) {

        this.companyName = CompanyList.companyName;
        this.testCount = CompanyList.testCount || 0;
        this.totalAmount = CompanyList.totalAmount || '0';

    }
}
