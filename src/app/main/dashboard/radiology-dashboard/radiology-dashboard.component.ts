import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Chart, { Color } from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from "../dashboard.service";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: 'app-radiology-dashboard',
    templateUrl: './radiology-dashboard.component.html',
    styleUrls: ['./radiology-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RadiologyDashboardComponent implements OnInit {

    myFilterform: UntypedFormGroup;
    fromDate: any;
    toDate: any;

     AppoinmentCount:any;
  TotalAdmittedCount:any;
  TotalSelf:any;
  TotalCompany:any;
  TodayAdmittedCount:any;
  TodayDischargeCount:any;
  TodaySelf:any;
  TodayOther:any;
    // Summary Card Data
    totalTestsToday: number = 0;
    completedReports: number = 0;
    pendingReports: number = 0;
    cancelledScans: number = 0;

    // Chart References
    public totalTestsChart: any;
    public completedReportsChart: any;
    public pendingReportsChart: any;
    public cancelledScansChart: any;

    public statusPieChart: any;
    public statusPieChart1: any;
    public volumeTrendChart: any;


     metrics = [
    { label: 'Todays Registrations', value: 0, color: 'lavender', icon: 'user-plus' },
    { label: 'Appointments', value: 0, color: 'butter', icon: 'calendar' },
    { label: 'Checked In', value: 0, color: 'mint', icon: 'check-circle' },
    { label: 'Checked-Out', value: 0, color: 'rose', icon: 'logout' },
    { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' },
    { label: 'ER to OP.', value: 0, color: 'peach', icon: 'ambulance' }
  ];

    // Table Column Definitions
    recentReportsColumns: string[] = ['PatientName', 'TestType', 'Status', 'Radiologist', 'Date'];
    topTestsColumns: string[] = ['TestName', 'Count'];
    radiologistPerformanceColumns: string[] = ['RadiologistName', 'ReportsCompleted', 'AvgTime'];


    public modalityChart: any;
    public modalityChart1: any;
    // Tests by Modality Data

    modalityData = [
        { modality: '', count: 0 }
    ];

    modalityData1 = [
        { modality: '', count: 0 }
    ];
    // Report Status Data

    //   statusData = [
    //     { status: '', count: 0 }
    // ];

    statusData = [
        { status: 'Completed', count: 0 },
        { status: 'Pending', count: 0 },
        { status: 'Cancelled', count: 0 }
    ];

    // Daily Test Volume Trend (Last 7 days)
    volumeTrendData = [
        { day: 'Mon', count: 142 },
        { day: 'Tue', count: 158 },
        { day: 'Wed', count: 135 },
        { day: 'Thu', count: 165 },
        { day: 'Fri', count: 148 },
        { day: 'Sat', count: 172 },
        { day: 'Sun', count: 156 }
    ];

    // Recent Reports Mock Data
    recentReportsData: RecentReport[] = [
        { PatientName: 'Rajesh Kumar', TestType: 'CT Scan - Brain', Status: 'Completed', Radiologist: 'Dr. Sharma', Date: '2025-11-09' },
        { PatientName: 'Priya Singh', TestType: 'X-Ray - Chest', Status: 'Completed', Radiologist: 'Dr. Patel', Date: '2025-11-09' },
        { PatientName: 'Amit Verma', TestType: 'MRI - Spine', Status: 'Pending', Radiologist: 'Dr. Reddy', Date: '2025-11-09' },
        { PatientName: 'Sunita Devi', TestType: 'Ultrasound - Abdomen', Status: 'Completed', Radiologist: 'Dr. Gupta', Date: '2025-11-09' },
        { PatientName: 'Vikram Rao', TestType: 'CT Scan - Abdomen', Status: 'Pending', Radiologist: 'Dr. Sharma', Date: '2025-11-08' },
        { PatientName: 'Anjali Mehta', TestType: 'Mammography', Status: 'Completed', Radiologist: 'Dr. Nair', Date: '2025-11-08' },
        { PatientName: 'Ravi Shankar', TestType: 'X-Ray - Knee', Status: 'Cancelled', Radiologist: 'Dr. Patel', Date: '2025-11-08' },
        { PatientName: 'Neha Agarwal', TestType: 'MRI - Brain', Status: 'Completed', Radiologist: 'Dr. Reddy', Date: '2025-11-08' }
    ];

    // Top Requested Tests Mock Data
    topTestsData: TopTest[] = [
        { TestName: 'X-Ray - Chest', Count: 45 },
        { TestName: 'CT Scan - Brain', Count: 38 },
        { TestName: 'Ultrasound - Abdomen', Count: 35 },
        { TestName: 'MRI - Spine', Count: 28 },
        { TestName: 'X-Ray - Knee', Count: 24 },
        { TestName: 'CT Scan - Abdomen', Count: 22 },
        { TestName: 'Mammography', Count: 16 }
    ];

    // Radiologist Performance Mock Data
    radiologistPerformanceData: RadiologistPerformance[] = [
        { RadiologistName: 'Dr. Sharma', ReportsCompleted: 42, AvgTime: 2.5 },
        { RadiologistName: 'Dr. Patel', ReportsCompleted: 38, AvgTime: 2.8 },
        { RadiologistName: 'Dr. Reddy', ReportsCompleted: 35, AvgTime: 3.2 },
        { RadiologistName: 'Dr. Gupta', ReportsCompleted: 32, AvgTime: 2.9 },
        { RadiologistName: 'Dr. Nair', ReportsCompleted: 28, AvgTime: 3.0 }
    ];

    // Equipment Utilization Data
    equipmentUtilization = [
        { name: 'CT Scanner', utilization: 85, scans: 32 },
        { name: 'MRI Machine', utilization: 78, scans: 28 },
        { name: 'X-Ray', utilization: 92, scans: 45 },
        { name: 'Ultrasound', utilization: 68, scans: 35 }
    ];

    // ========== PATHOLOGY DATA ==========
    // TODO: Replace with API data

    // Tab Management
    selectedTabIndex: number = 0;


    // Pathology Chart References
    public pathologyTotalTestsChart: any;
    public pathologyCompletedChart: any;
    public pathologyPendingChart: any;
    public pathologyRejectedChart: any;
    public pathologyDepartmentChart: any;
    public pathologyStatusPieChart: any;
    public pathologyVolumeTrendChart: any;

    // Pathology Table Column Definitions
    pathologyReportsColumns: string[] = ['PatientName', 'TestName', 'Status', 'Pathologist', 'Date'];
    pathologyTopTestsColumns: string[] = ['TestName', 'Count'];
    pathologistWorkloadColumns: string[] = ['PathologistName', 'TestsReported'];

    // Pathology Table Data Sources
    dsPathologyReports = new MatTableDataSource<PathologyReport1>();
    dsPathologyTopTests = new MatTableDataSource<TopTest1>();
    dsPathologistWorkload = new MatTableDataSource<PathologistWorkload>();
    // dsCountsummary = new MatTableDataSource<testcountsummary>();

    dsRadiologyCount = new MatTableDataSource<PathologyCount>()
    // Table Data Sources
    dsRecentReports = new MatTableDataSource<RecentReport>();
    dsTopTests = new MatTableDataSource<TopTest>();
    dsRadiologistPerformance = new MatTableDataSource<RadiologistPerformance>();

    // Sample Collection Statistics
    sampleCollectionStats = [
        { name: 'Collected', count: 234 },
        { name: 'In Process', count: 28 },
        { name: 'Delayed', count: 12 }
    ];
    UnitId: any = this._accountServices.currentUserValue.user.unitId;
    constructor(
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder, public _accountServices: AuthenticationService,
        private dashboardService: DashboardService,
    ) {

        // this.initializeDateRange();
    }
    pathologyData: any;
    ngOnInit(): void {

        this.myFilterform = this.dashboardService.filterFormfinance();


        // this.dashboardService.getRadiologyDashboard({ "UnitId": this.UnitId, "FromDate": "2025-01-01", "ToDate": "2026-02-10" }).subscribe((data) => {
        //     this.pathologyData = data;
        //     console.log(data)
        //     this.dsPathologyReports.data = this.pathologyData.recentPathologyReports;
        //     this.dsPathologyTopTests.data = this.pathologyData.mostOrderedTests;
        //     this.dsPathologistWorkload.data = this.pathologyData.pathologyWorkloads;
        //     this.dsCountsummary.data = this.pathologyData.countSummary

        //   debugger
        //     this.totalTestsToday = this.pathologyData.countSummary.todaysCount
        //     this.completedReports = this.pathologyData.countSummary.completedCount
        //     this.pendingReports = this.pathologyData.countSummary.pendingCount
        //     this.cancelledScans = this.pathologyData.countSummary.rejectedCount
        //     debugger
        //     this.dsPathologyTopTests.data.forEach((item, index) => {
        //         this.modalityData[index].modality = item.testName
        //         this.modalityData[index].count = item.count

        //     });



        // })
        this.initializePathologyCharts();
         this.getHomeDashboardAPI();
        this.loadTableData();

        // Initialize all charts after view is loaded
        // setTimeout(() => {
        //     this.initializeCharts();
        // }, 500);
    }

    // initializeDateRange() {
    //     const today = new Date();
    //     this.toDate = new Date(today);

    //     // Find Monday of current week
    //     const day = today.getDay();
    //     const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    //     const monday = new Date(today);
    //     monday.setDate(diff);
    //     this.fromDate = monday;
    // }

    loadTableData(): void {
        // Load Radiology Data
        this.modalityData = [];

        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',

            this.getRadiologyData();
        this.getpathologyReportData();
    }

    onDateRangeChanged(): void {
        console.log('Date range changed:', this.myFilterform.value);
        if (this.fromDate && this.toDate) {
            this.loadTableData();
        }
    }


  get totalworkload(): number {
    return this.dsPathologistWorkload.data.reduce((sum, r) => sum + r.count, 0);
  }

   get TotalTest(): number {
    return this.dsPathologyTopTests.data.reduce((sum, r) => sum + r.count, 0);
  }

    trendData: TopTest1[] = [];
    dsCountsummary: testcountsummary[] = [];

    getpathologyReportData() {

        this.dashboardService.getPathologyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
            this.pathologyData = res;
            console.log('Pathology Reports:', res);

            if (this.pathologyData) {
                this.dsPathologyReports.data = res.recentPathologyReports;
                this.dsPathologyTopTests.data = res.mostOrderedTests;
                this.trendData = this.pathologyData.mostOrderedTests
                this.dsPathologistWorkload.data = res.pathologyWorkloads


                if (this.trendData) {

                    this.modalityData = [
                        ...this.modalityData,
                        ...this.trendData.map(item => ({

                            modality: item.testName,
                            count: item.count
                        }))
                    ];
                }
                debugger
                console.log(this.modalityData)
                if (this.modalityData)
                    this.modalityChart = this.getModalityBarChart();

                if (this.pathologyData) {
                    this.statusData[0].count = this.pathologyData.countSummary.completedCount
                    this.statusData[1].count = this.pathologyData.countSummary.pendingCount
                    this.statusData[2].count = this.pathologyData.countSummary.rejectedCount
                }
                if (this.statusData)
                    this.statusPieChart = this.getStatusPieChart();

                 this.getPathologyDepartmentChart()
                this.getPathologyStatusPieChart()
                this.getPathologyVolumeTrendChart()
            }
        });




    }

    onGo(): void {
        this.ngOnDestroy()
        this.loadTableData()
    }

    getRadiologyData() {
        const payload = {
            searchFields: [
                {
                    fieldName: "FromDate",
                    fieldValue: this.fromDate,
                    opType: "Equals"
                },
                {
                    fieldName: "ToDate",
                    fieldValue: this.toDate,
                    opType: "Equals"
                }
            ],
            mode: "RadiologyDashboard"
        };

        this.totalTestsToday = 0;
        this.completedReports = 0;
        this.pendingReports = 0;
        this.cancelledScans = 0;

        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            this.dsRadiologyCount.data = res || [];
            this.dsRecentReports.data = res || [];
            this.dsTopTests.data = res || [];
            this.dsRadiologistPerformance.data = res || [];

            if (this.dsRadiologyCount.data.length > 0) {

                this.dsRadiologyCount.data.forEach(element => {

                    // TOTAL TEST COUNT (DATE RANGE)
                    this.totalTestsToday += Number(element.TestCount) || 0;

                    if (element.IsCompleted == 1) {
                        this.completedReports++;
                    }

                    if (element.Pending == 0) {
                        this.pendingReports++;
                    }

                    if (element.IsCancelled == 1) {
                        this.cancelledScans++;
                    }
                });
            }
            console.log('Radiology Total Tests:', this.totalTestsToday);
            console.log('Radiology complete Tests:', this.completedReports);
            console.log('Radiology Pending Tests:', this.pendingReports);
            console.log('Radiology cancel Tests:', this.cancelledScans);
        });
    }


    onTabChanged(event: any): void {
        console.log('Tab changed to:', event.index);
        // Reinitialize charts for the selected tab
        setTimeout(() => {
            if (event.index === 0) {
                this.initializePathologyCharts();
                // Pathology tab - charts already initialized
                console.log('Radiology tab selected');
            } else if (event.index === 1) {
                // Radiology tab - initialize charts
                // this.initializeRadiologyCharts();
            }
        }, 100);
    }

    getSampleTotal(): number {
        return this.sampleCollectionStats.reduce((sum, stat) => sum + stat.count, 0);
    }

    initializeCharts(): void {
        // Summary Cards Charts
        if (document.getElementById('totalTestsChart')) {
            this.totalTestsChart = this.getLineChartData(
                'totalTestsChart',
                '#d4bbf4',
                '#c5aae6',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [142, 158, 135, 165, 148, 172, 156]
            );
        }

        if (document.getElementById('completedReportsChart')) {
            this.completedReportsChart = this.getLineChartData(
                'completedReportsChart',
                '#f3ddb3',
                '#ebcf9a',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [105, 122, 98, 128, 110, 135, 118]
            );
        }

        if (document.getElementById('pendingReportsChart')) {
            this.pendingReportsChart = this.getLineChartData(
                'pendingReportsChart',
                '#d1efad',
                '#c5e999',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [28, 30, 32, 28, 35, 30, 32]
            );
        }

        if (document.getElementById('cancelledScansChart')) {
            this.cancelledScansChart = this.getLineChartData(
                'cancelledScansChart',
                '#c5f1ef',
                '#a1e6e3',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [5, 6, 5, 9, 3, 7, 6]
            );
        }

        // Tests by Modality Bar Chart
        if (document.getElementById('modalityChart')) {
            // this.modalityChart = this.getModalityBarChart();
        }

        // Status Pie Chart
        if (document.getElementById('statusPieChart')) {
            // this.statusPieChart = this.getStatusPieChart();
        }

        // Volume Trend Chart
        if (document.getElementById('volumeTrendChart')) {
            // this.volumeTrendChart = this.getVolumeTrendChart();
        }
    }

    // Small line chart for summary cards
    getLineChartData(chartId: string, backgroundColor: Color, borderColor: Color, labels: string[], data: number[]) {
        return new Chart(chartId, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Value',
                        data: data,
                        backgroundColor: backgroundColor,
                        borderColor: borderColor,
                        tension: 0.4,
                        fill: true
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                elements: { point: { radius: 2 } },
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        display: true,
                        grid: { display: false },
                        ticks: { font: { size: 9 } }
                    },
                    y: {
                        display: true,
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: { font: { size: 9 } }
                    }
                }
            }
        });
    }

    ngOnDestroy() {
        
        if (this.modalityChart) {
            this.modalityChart.destroy();
        }
        if (this.modalityChart1) {
            this.modalityChart1.destroy();
        }
        if (this.statusPieChart) {
            this.statusPieChart.destroy();
        }
        if (this.statusPieChart1) {
            this.statusPieChart1.destroy();
        }
        if (this.pathologyDepartmentChart) {
            this.pathologyDepartmentChart.destroy();
        }
        if (this.pathologyStatusPieChart) {
            this.pathologyStatusPieChart.destroy();
        }
        if (this.pathologyVolumeTrendChart) {
            this.pathologyVolumeTrendChart.destroy();
        }

    }
    // Tests by Modality Bar Chart
    getModalityBarChart() {
        debugger
        return new Chart('modalityChart', {
            type: 'bar',
            data: {
                labels: this.modalityData.map(d => d.modality),
                datasets: [
                    {
                        label: 'Tests Name',
                        data: this.modalityData.map(d => d.count),
                        backgroundColor: ['#9661db', '#f961d3', '#28af28', '#70c7bd', '#fbfb79'],
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

    getModalityBarChart1() {
        return new Chart('modalityChart1', {
            type: 'bar',
            data: {
                labels: this.modalityData1.map(d => d.modality),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.modalityData1.map(d => d.count),
                        backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a'],
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

    // Status Pie Chart
    getStatusPieChart() {
        debugger
        return new Chart('statusPieChart', {
            type: 'doughnut',
            data: {
                labels: this.statusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: ['#28af28', '#ff5a8a', '#546dfa'],
                        data: this.statusData.map(d => d.count),
                        borderWidth: 2
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + ' reports';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Status Pie Chart
    getStatusPieChart1() {
        return new Chart('statusPieChart1', {
            type: 'doughnut',
            data: {
                labels: this.statusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: [ '#ca42f7','#69f869', 'rgb(66, 138, 246)'],
                        data: this.statusData.map(d => d.count),
                        borderWidth: 2
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + ' reports';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    // Volume Trend Line Chart
    getVolumeTrendChart() {
        return new Chart('volumeTrendChart', {
            type: 'line',
            data: {
                labels: this.volumeTrendData.map(d => d.day),
                datasets: [
                    {
                        label: 'Daily Test Count',
                        data: this.volumeTrendData.map(d => d.count),
                        backgroundColor: 'rgba(150, 97, 219, 0.2)',
                        borderColor: '#9661db',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#9661db',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                return 'Tests: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

    // ========== PATHOLOGY CHART METHODS ==========

    initializePathologyCharts(): void {
        // Summary Cards Charts
        if (document.getElementById('pathologyTotalTestsChart')) {
            this.pathologyTotalTestsChart = this.getLineChartData(
                'pathologyTotalTestsChart',
                '#d4bbf4',
                '#c5aae6',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [218, 245, 212, 252, 229, 268, 234]
            );
        }

        if (document.getElementById('pathologyCompletedChart')) {
            this.pathologyCompletedChart = this.getLineChartData(
                'pathologyCompletedChart',
                '#f3ddb3',
                '#ebcf9a',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [182, 205, 178, 215, 192, 228, 198]
            );
        }

        if (document.getElementById('pathologyPendingChart')) {
            this.pathologyPendingChart = this.getLineChartData(
                'pathologyPendingChart',
                '#d1efad',
                '#c5e999',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [30, 32, 28, 30, 32, 35, 28]
            );
        }

        if (document.getElementById('pathologyRejectedChart')) {
            this.pathologyRejectedChart = this.getLineChartData(
                'pathologyRejectedChart',
                '#c5f1ef',
                '#a1e6e3',
                ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                [6, 8, 6, 7, 5, 5, 8]
            );
        }

        // Department Bar Chart
        if (document.getElementById('pathologyDepartmentChart')) {
            this.pathologyDepartmentChart = this.getPathologyDepartmentChart();
        }

        // Status Pie Chart
        if (document.getElementById('pathologyStatusPieChart')) {
            this.pathologyStatusPieChart = this.getPathologyStatusPieChart();
        }

        // Volume Trend Chart
        if (document.getElementById('pathologyVolumeTrendChart')) {
            this.pathologyVolumeTrendChart = this.getPathologyVolumeTrendChart();
        }
    }
   
    // Pathology Department Bar Chart
    getPathologyDepartmentChart() {
        return new Chart('pathologyDepartmentChart', {
            type: 'bar',
            data: {
                labels: this.pathologyData.pathologyValumes.map(d => d.categoryName),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.pathologyData.pathologyValumes.map(d => d.categoryCount),
                        backgroundColor: ['#179ee2','#ff6b9d', '#c364c7', '#6bcf7f'],
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

    // Pathology Status Pie Chart
    getPathologyStatusPieChart() {

        // Pathology Status Data
        let pathologyStatusData = [
            { status: 'Completed', count: this.pathologyData?.countSummary?.completedCount ?? 0 },
            { status: 'Pending', count: this.pathologyData?.countSummary?.pendingCount ?? 0 },
            { status: 'Rejected', count: this.pathologyData?.countSummary?.rejectedCount ?? 0 }
        ];
        return new Chart('pathologyStatusPieChart', {
            type: 'doughnut',
            data: {
                labels: pathologyStatusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: ['#497df7','#28af28',  '#ff5a8a'],
                        data: pathologyStatusData.map(d => d.count),
                        borderWidth: 2
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: { size: 12 },
                            padding: 15
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.parsed + ' tests';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Pathology Volume Trend Line Chart
    getPathologyVolumeTrendChart() {
        return new Chart('pathologyVolumeTrendChart', {
            type: 'line',
            data: {
                labels: this.pathologyData.dailyTestCounts.map(d => d.pathDate),
                datasets: [
                    {
                        label: 'Daily Test Count',
                        data: this.pathologyData.dailyTestCounts.map(d => d.dayCount),
                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                        borderColor: '#ff6b9d',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 5,
                        pointBackgroundColor: '#ff6b9d',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        position: 'top',
                        labels: {
                            font: { size: 12 }
                        }
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                return 'Tests: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: { size: 11 }
                        },
                        grid: {
                            color: 'rgba(0, 0, 0, 0.05)'
                        }
                    },
                    x: {
                        ticks: {
                            font: { size: 11 }
                        },
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }

  getMatIcon(icon: string): string {
    switch (icon) {
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

      getHomeDashboardAPI() {
    const payload = {
      searchFields: [
        { fieldName: 'UnitId', fieldValue: '0', opType: 'Equals' }
      ],
      mode: 'HomeDashboardAPI'
    };
    this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
      
      let apiData = res && res.length ? res[0] : {};
      this.metrics = [
        { label: 'Todays Registrations', value: apiData?.RegistrationCount || 0, color: 'lavender', icon: 'user-plus' },
        { label: 'Appointments', value: apiData?.AppointmentCount || 0, color: 'butter', icon: 'calendar' },
        { label: 'Checked In', value: apiData?.CheckInCount || 0, color: 'mint', icon: 'check-circle' },
        { label: 'Checked-Out', value: apiData?.CheckOutCount || 0, color: 'rose', icon: 'logout' },
        { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' }, // If API has a matching field, set it.
        { label: 'ER to OP.', value: apiData?.OPtoIPConvertCount || 0, color: 'peach', icon: 'ambulance' }
      ];
     
    }, err => {
      this.metrics = [
        { label: 'Todays Registrations', value: 0, color: 'lavender', icon: 'user-plus' },
        { label: 'Appointments', value: 0, color: 'butter', icon: 'calendar' },
        { label: 'Checked In', value: 0, color: 'mint', icon: 'check-circle' },
        { label: 'Checked-Out', value: 0, color: 'rose', icon: 'logout' },
        { label: 'Pending & Waiting', value: 0, color: 'sky', icon: 'hourglass' },
        { label: 'ER to OP.', value: 0, color: 'peach', icon: 'ambulance' }
      ];
    });
  }

    workloadTrend(){}
}

// Interface Definitions
export class RecentReport {
    PatientName: string;
    TestType: string;
    Status: string;
    Radiologist: string;
    Date: string;

    constructor(report: any) {
        this.PatientName = report.PatientName || '';
        this.TestType = report.TestType || '';
        this.Status = report.Status || '';
        this.Radiologist = report.Radiologist || '';
        this.Date = report.Date || '';
    }
}



export class TopTest {
    TestName: string;
    Count: number;

    constructor(test: any) {
        this.TestName = test.TestName || '';
        this.Count = test.Count || 0;
    }
}


export class TopTest1 {
    testName: string;
    count: number;

    constructor(test: any) {
        this.testName = test.testName || '';
        this.count = test.count || 0;
    }
}

export class RadiologistPerformance {
    RadiologistName: string;
    ReportsCompleted: number;
    AvgTime: number;

    constructor(radiologist: any) {
        this.RadiologistName = radiologist.RadiologistName || '';
        this.ReportsCompleted = radiologist.ReportsCompleted || 0;
        this.AvgTime = radiologist.AvgTime || 0;
    }
}

// Pathology Interfaces
export class PathologyReport {
    PatientName: string;
    TestName: string;
    Status: string;
    Pathologist: string;
    Date: string;

    constructor(report: any) {
        this.PatientName = report.PatientName || '';
        this.TestName = report.TestName || '';
        this.Status = report.Status || '';
        this.Pathologist = report.Pathologist || '';
        this.Date = report.Date || '';
    }
}

export class PathologyReport1 {
    patientName: string;
    testName: string;
    isCompleted: string;
    doctorName: string;
    pathDate: string;

    constructor(report: any) {
        this.patientName = report.patientName || '';
        this.testName = report.testName || '';
        this.isCompleted = report.isCompleted || 0;
        this.doctorName = report.doctorName || '';
        this.pathDate = report.pathDate || '';
    }
}

export class PathologyCount {
    TestCount: any;
    IsCompleted: any;
    IsCancelled: any;
    Pending: any;

    constructor(PathologyCount) {
        this.TestCount = PathologyCount.TestCount || '0';
        this.IsCompleted = PathologyCount.IsCompleted || '';
        this.IsCancelled = PathologyCount.IsCancelled || '';
        this.Pending = PathologyCount.Pending || '';
    }
}

export class PathologistWorkload {
    PathologistName: string;
    TestsReported: number;
    AvgTime: number;
    count: any
    doctorName: any

    constructor(pathologist: any) {
        this.PathologistName = pathologist.PathologistName || '';
        this.TestsReported = pathologist.TestsReported || 0;
        this.AvgTime = pathologist.AvgTime || 0;
        this.doctorName = pathologist.doctorName || '';
        this.count = pathologist.count || 0;

    }
}


export class testcountsummary {
    todaysCount: any;
    completedCount: any;
    pendingCount: any;
    rejectedCount: any;

    constructor(PathologyCount) {
        this.todaysCount = PathologyCount.todaysCount || '0';
        this.completedCount = PathologyCount.completedCount || '0';
        this.pendingCount = PathologyCount.pendingCount || '0';
        this.rejectedCount = PathologyCount.rejectedCount || '0';
    }
}