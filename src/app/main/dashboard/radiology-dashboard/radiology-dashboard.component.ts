import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Chart, { Color } from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from "../dashboard.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { SignalRService } from "app/core/services/signalr.service";

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
    UnitId: any = this._accountServices.currentUserValue.user.unitId;
    AppoinmentCount: any;
    TotalAdmittedCount: any;
    TotalSelf: any;
    TotalCompany: any;
    TodayAdmittedCount: any;
    TodayDischargeCount: any;
    TodaySelf: any;
    TodayOther: any;
    // Summary Card Data
    totalTestsToday: number = 0;
    completedReports: number = 0;
    pendingReports: number = 0;
    cancelledScans: number = 0;

    // Radiology Chart References
    public RadiologytotalTestsChart: any;
    public RadiologycompletedReportsChart: any;
    public RadiologypendingReportsChart: any;
    public RadiologycancelledScansChart: any;

    public statusPieChart: any;
    public statusPieChart1: any;
    public volumeTrendChart: any;


    trendData: TopTest1[] = [];
    trendData1: TopTest1[] = [];
    dsCountsummary: testcountsummary[] = [];

    metrics = [
        { label: 'Total Report', value: 0, color: 'lavender', icon: 'assignment' },
        { label: 'Completed', value: 0, color: 'green', icon: 'check_circle' },
        { label: 'Pending', value: 0, color: 'mint', icon: 'pending' },
        { label: 'Collected', value: 0, color: 'rose', icon: 'collected' },
        { label: 'NotCollected', value: 0, color: 'sky', icon: 'notcollected' },
        { label: 'Verified', value: 0, color: 'green', icon: 'verified' },
        { label: 'Not Verified', value: 0, color: 'peach', icon: 'unpublished' },
        { label: 'Dispatched', value: 0, color: 'peach', icon: 'local_shipping' },
        { label: 'NoDispatch', value: 0, color: 'orange', icon: 'pending_actions' },
    ];



    statusData = [
        { status: 'Completed', count: 0 },
        { status: 'Pending', count: 0 },
        { status: 'Cancelled', count: 0 }
    ];

    statusData1 = [
        { status: 'Completed', count: 0 },
        { status: 'Pending', count: 0 },
        { status: 'Cancelled', count: 0 }
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


    public RadiologyDepartmentChart: any;
    public RadiologyStatusPieChart: any;
    public RadiologyVolumeTrendChart: any;


    // Pathology Table Column Definitions
    pathologyReportsColumns: string[] = ['Date', 'PatientName', 'TestName', 'Pathologist', 'Status'];
    pathologyTopTestsColumns: string[] = ['TestName', 'Count'];
    pathologistWorkloadColumns: string[] = ['PathologistName', 'TestsReported'];
    // Radiology Table Column Definitions
    recentReportsColumns: string[] = ['Date', 'PatientName', 'patientType', 'Radiologist', 'Status'];
    topTestsColumns: string[] = ['TestName', 'Count'];
    radiologistPerformanceColumns: string[] = ['RadiologistName', 'ReportsCompleted'];
    // Pathology Table Data Sources
    dsPathologyReports = new MatTableDataSource<PathologyReport1>();
    dsPathologyTopTests = new MatTableDataSource<TopTest1>();
    dsPathologistWorkload = new MatTableDataSource<PathologistWorkload>();
    // dsCountsummary = new MatTableDataSource<testcountsummary>();

    dsRadiologyCount = new MatTableDataSource<PathologyCount>()
    // Table Data Sources
    dsRadiologyRecentReports = new MatTableDataSource<RecentReport>();
    dsTopTests = new MatTableDataSource<TopTest2>();
    dsRadiologistPerformance = new MatTableDataSource<RadiologistPerformance>();

    // Sample Collection Statistics
    sampleCollectionStats = [
        { name: 'Collected', count: 234 },
        { name: 'In Process', count: 28 },
        { name: 'Delayed', count: 12 }
    ];

    constructor(
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder, public _accountServices: AuthenticationService,
        private dashboardService: DashboardService,
        private signalRService: SignalRService
    ) {

        // this.initializeDateRange();
    }
    pathologyData: any;
    RadiologyData: any;
    ngOnInit(): void {
        this.signalRService.startConnection();
        this.signalRService.addReceiveInvestigationDashboardListener((data, user) => {
            if (data == "Investigation_Bill") {
                var old = this.metrics.find(x => x.label == "Total Report");
                this.metrics.find(x => x.label == "Total Report").value = old.value + user.BillCount;
            }
        });
        this.myFilterform = this.dashboardService.filterFormfinance();


        this.loadTableData();
        // this.getHomeDashboardAPI();

        setTimeout(() => {
            this.initializePathologyCharts();
            this.initializeRadiologyCharts();
        }, 500);


    }

    onGo(): void {
        // this.ngOnDestroy()
        this.loadTableData()
    }

    loadTableData(): void {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',
            this.getHomeDashboardAPI();
        this.getRadiologyData();
        this.getpathologyReportData();
        this.getRadiologyReportData();


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

    get RadioTotalTest(): number {
        return this.dsTopTests.data.reduce((sum, r) => sum + r.count, 0);
    }


    get Radtotalworkload(): number {
        return this.dsRadiologistPerformance.data.reduce((sum, r) => sum + r.count, 0);
    }

    getpathologyReportData() {


        this.dashboardService.getPathologyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
            this.pathologyData = res;
            console.log('Pathology Reports:', res);

            if (this.pathologyData) {
                this.dsPathologyReports.data = res.recentPathologyReports;
                this.dsPathologyTopTests.data = res.mostOrderedTests;
                // this.trendData = this.pathologyData.mostOrderedTests
                this.dsPathologistWorkload.data = res.pathologyWorkloads


                // if (this.trendData) {

                //     this.modalityData = [
                //         ...this.modalityData,
                //         ...this.trendData.map(item => ({

                //             modality: item.testName,
                //             count: item.count
                //         }))
                //     ];
                // }

                // console.log(this.modalityData)
                // if (this.modalityData)
                //     this.modalityChart = this.getModalityBarChart();

                // if (this.pathologyData) {
                //     this.statusData[0].count = this.pathologyData.countSummary.completedCount
                //     this.statusData[1].count = this.pathologyData.countSummary.pendingCount
                //     this.statusData[2].count = this.pathologyData.countSummary.rejectedCount
                // }
                // if (this.statusData)
                //     this.statusPieChart = this.getStatusPieChart();

                if (this.pathologyData.pathologyValumes.length > 0)
                    // this.getPathologyDepartmentChart()
                    this.pathologyDepartmentChart = this.getPathologyDepartmentChart();
                this.pathologyStatusPieChart = this.getPathologyStatusPieChart()
                if (this.pathologyData.dailyTestCounts.length > 0)
                    this.pathologyVolumeTrendChart = this.getPathologyVolumeTrendChart()
            }
        });

    }
    getRadiologyReportData() {
        debugger
        this.dashboardService.getRadiologyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
            this.RadiologyData = res;
            console.log('Radiology Reports:', res);
            debugger
            if (this.RadiologyData) {
                this.dsRadiologyRecentReports.data = res.recentRadiologyReports;
                this.dsTopTests.data = res.topOrderedTests;
                this.dsRadiologistPerformance.data = res.radiologyWorkloads

                if (this.RadiologyData.radiologyVolumes.length > 0)
                    this.RadiologyDepartmentChart = this.getRadiologyDepartmentChart()
                this.RadiologyStatusPieChart = this.getRadiologyStatusPieChart()
                if (this.RadiologyData.dailyTestCounts.length > 0)
                    this.RadiologyVolumeTrendChart = this.getRadiologyVolumeTrendChart()
            }
        });

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
            this.dsRadiologyRecentReports.data = res || [];
            this.dsTopTests.data = res || [];
            this.dsRadiologistPerformance.data = res || [];

            console.log(this.dsRadiologyCount)


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
                this.initializeRadiologyCharts();
            }
        }, 100);
    }

    getSampleTotal(): number {
        return this.sampleCollectionStats.reduce((sum, stat) => sum + stat.count, 0);
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

        // if (this.modalityChart) {
        //     this.modalityChart.destroy();
        // }
        // if (this.modalityChart1) {
        //     this.modalityChart1.destroy();
        // }
        // if (this.statusPieChart) {
        //     this.statusPieChart.destroy();
        // }
        // if (this.statusPieChart1) {
        //     this.statusPieChart1.destroy();
        // }
        if (this.pathologyDepartmentChart) {
            this.pathologyDepartmentChart.destroy();
        }
        if (this.pathologyStatusPieChart) {
            this.pathologyStatusPieChart.destroy();
        }
        if (this.pathologyVolumeTrendChart) {
            this.pathologyVolumeTrendChart.destroy();
        }
        // if (this.pathologyTotalTestsChart) {
        //     this.pathologyTotalTestsChart.destroy();
        // }


        // if (this.RadiologytotalTestsChart) {
        //     this.RadiologytotalTestsChart.destroy();
        // }
        //  if (this.RadiologycompletedReportsChart) {
        //     this.RadiologycompletedReportsChart.destroy();
        // } if (this.RadiologypendingReportsChart) {
        //     this.RadiologypendingReportsChart.destroy();
        // } if (this.RadiologycancelledScansChart) {
        //     this.RadiologycancelledScansChart.destroy();
        // }

        if (this.RadiologyDepartmentChart) {
            this.RadiologyDepartmentChart.destroy();
        }
        if (this.RadiologyStatusPieChart) {
            this.RadiologyStatusPieChart.destroy();
        }
        if (this.RadiologyVolumeTrendChart) {
            this.RadiologyVolumeTrendChart.destroy();
        }

    }

    // Volume Trend Line Chart
    getVolumeTrendChart() {
        return new Chart('volumeTrendChart', {
            type: 'line',
            data: {
                labels: this.RadiologyData.volumeTrendData.map(d => d.day),
                datasets: [
                    {
                        label: 'Daily Test Count',
                        data: this.RadiologyData.volumeTrendData.map(d => d.count),
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

        // Department Bar Chart
        if (document.getElementById('pathologyTotalTestsChart')) {
            this.pathologyTotalTestsChart = this.getpathologyTotalTestsChart();
        } else if (document.getElementById('pathologyCompletedChart')) {
            this.pathologyCompletedChart = this.getpathologyCompletedChart();
        } else
            if (document.getElementById('pathologyPendingChart')) {
                this.pathologyPendingChart = this.getpathologyPendingChart();
            } else if (document.getElementById('pathologyRejectedChart')) {
                this.pathologyRejectedChart = this.getpathologyRejectedChart();
            } else if (document.getElementById('pathologyDepartmentChart')) {
                // this.pathologyDepartmentChart = this.getPathologyDepartmentChart();
            } else // Status Pie Chart
                if (document.getElementById('pathologyStatusPieChart')) {
                    // this.pathologyStatusPieChart = this.getPathologyStatusPieChart();
                } else // Volume Trend Chart
                    if (document.getElementById('pathologyVolumeTrendChart')) {
                        // this.pathologyVolumeTrendChart = this.getPathologyVolumeTrendChart();
                    }
    }
    bartotalTests = []

    getpathologyTotalTestsChart() {


        if (this.pathologyData.weeklyTestReport) {
            this.bartotalTests = this.pathologyData.weeklyTestReport.map(day => day.totalTests);
        }
        console.log(this.bartotalTests)
        this.pathologyTotalTestsChart = this.getLineChartData(
            'pathologyTotalTestsChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.bartotalTests
        );
    }

    barCompletTests = []
    getpathologyCompletedChart() {
        if (this.pathologyData.weeklyTestReport) {
            this.barCompletTests = this.pathologyData.weeklyTestReport.map(day => day.completedReports);
        }
        console.log(this.barCompletTests)
        this.pathologyCompletedChart = this.getLineChartData(
            'pathologyCompletedChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.barCompletTests
        );
    }


    barpendingTests = []
    getpathologyPendingChart() {


        if (this.pathologyData.weeklyTestReport) {
            this.barpendingTests = this.pathologyData.weeklyTestReport.map(day => day.pendingReports);
        }
        console.log(this.barpendingTests)
        this.pathologyPendingChart = this.getLineChartData(
            'pathologyPendingChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.barpendingTests
        );
    }


    barrejectedTests = []
    getpathologyRejectedChart() {


        if (this.pathologyData.weeklyTestReport) {
            this.barrejectedTests = this.pathologyData.weeklyTestReport.map(day => day.cancelledReports);
        }
        console.log(this.barrejectedTests)
        this.pathologyRejectedChart = this.getLineChartData(
            'pathologyRejectedChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.barrejectedTests
        );
    }


    // Pathology Department Bar Chart
    getPathologyDepartmentChart() {

        if (this.pathologyDepartmentChart) {
            this.pathologyDepartmentChart.destroy();
        }

        return new Chart('pathologyDepartmentChart', {
            // this.pathologyDepartmentChart = new Chart('pathologyDepartmentChart', {

            type: 'bar',
            data: {
                labels: this.pathologyData.pathologyValumes.map(d => d.categoryName),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.pathologyData.pathologyValumes.map(d => d.categoryCount),
                        backgroundColor: ['#179ee2', '#ff6b9d', '#c364c7', '#6bcf7f'],
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
        if (this.pathologyStatusPieChart) {
            this.pathologyStatusPieChart.destroy();
        }

        // Pathology Status Data
        let pathologyStatusData = [
            { status: 'Completed', count: this.pathologyData?.countSummary?.completedCount ?? 0 },
            { status: 'Pending', count: this.pathologyData?.countSummary?.pendingCount ?? 0 },
            { status: 'Rejected', count: this.pathologyData?.countSummary?.rejectedCount ?? 0 }
        ];
        return new Chart('pathologyStatusPieChart', {
            // this.pathologyStatusPieChart = new Chart('pathologyStatusPieChart', {

            type: 'doughnut',
            data: {
                labels: pathologyStatusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: ['#497df7', '#28af28', '#ff5a8a'],
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

        if (this.pathologyVolumeTrendChart) {
            this.pathologyVolumeTrendChart.destroy();
        }

        return new Chart('pathologyVolumeTrendChart', {
            // this.pathologyVolumeTrendChart = new Chart('pathologyVolumeTrendChart', {

            type: 'line',
            data: {
                labels: this.pathologyData.dailyTestCounts.map(d => d.pathDate),
                datasets: [
                    {
                        label: 'Daily Test Count',
                        data: this.pathologyData.dailyTestCounts.map(d => d.dayCount),
                        backgroundColor: 'rgba(255, 107, 157, 0.2)',
                        borderColor: '#3d4ff7',
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

    initializeRadiologyCharts(): void {

        if (document.getElementById('RadiologytotalTestsChart')) {
            this.RadiologytotalTestsChart = this.getradiologyTotalTestsChart();
        } else if (document.getElementById('RadiologycompletedReportsChart')) {
            this.RadiologycompletedReportsChart = this.getradiologyCompletTestsChart();
        } else if (document.getElementById('RadiologypendingReportsChart')) {
            this.RadiologypendingReportsChart = this.getradiologyPendingTestsChart();
        } else if (document.getElementById('RadiologycancelledScansChart')) {
            this.RadiologycancelledScansChart = this.getradiologyCancleTestsChart();
        } else // Department Bar Chart
            if (document.getElementById('RadiologyDepartmentChart')) {
                // this.RadiologyDepartmentChart = this.getRadiologyDepartmentChart();
            } else // Status Pie Chart
                if (document.getElementById('RadiologyStatusPieChart')) {
                    // this.RadiologyStatusPieChart = this.getRadiologyStatusPieChart();
                } else // Volume Trend Chart
                    if (document.getElementById('RadiologyVolumeTrendChart')) {
                        // this.RadiologyVolumeTrendChart = this.getRadiologyVolumeTrendChart();
                    }
    }


    radiobartotalTests = []

    getradiologyTotalTestsChart() {


        if (this.RadiologyData.radWeeklyTestReport) {
            this.radiobartotalTests = this.RadiologyData.radWeeklyTestReport.map(day => day.totalTests);
        }
        console.log(this.radiobartotalTests)
        this.pathologyTotalTestsChart = this.getLineChartData(
            'RadiologytotalTestsChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.radiobartotalTests
        );
    }

    radiobarcomplTests = []

    getradiologyCompletTestsChart() {
        if (this.RadiologyData.radWeeklyTestReport) {
            this.radiobarcomplTests = this.RadiologyData.radWeeklyTestReport.map(day => day.completedReports);
        }
        console.log(this.radiobarcomplTests)
        this.RadiologycompletedReportsChart = this.getLineChartData(
            'RadiologycompletedReportsChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.radiobarcomplTests
        );
    }


    radiobarpendingTests = []

    getradiologyPendingTestsChart() {


        if (this.RadiologyData.radWeeklyTestReport) {
            this.radiobarpendingTests = this.RadiologyData.radWeeklyTestReport.map(day => day.pendingReports);
        }
        console.log(this.radiobarpendingTests)
        this.RadiologypendingReportsChart = this.getLineChartData(
            'RadiologypendingReportsChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.radiobarpendingTests
        );
    }


    radiobarcancleTests = []

    getradiologyCancleTestsChart() {


        if (this.RadiologyData.radWeeklyTestReport) {
            this.radiobarcancleTests = this.RadiologyData.radWeeklyTestReport.map(day => day.pendingReports);
        }
        console.log(this.radiobarcancleTests)
        this.RadiologycancelledScansChart = this.getLineChartData(
            'RadiologycancelledScansChart',
            '#d4bbf4',
            '#c5aae6',
            ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
            this.radiobarcancleTests
        );
    }

    // Radiology Department Bar Chart
    getRadiologyDepartmentChart() {
        if (this.RadiologyDepartmentChart) {
            this.RadiologyDepartmentChart.destroy();
        }

        // this.RadiologyDepartmentChart = new Chart('RadiologyDepartmentChart', {

        return new Chart('RadiologyDepartmentChart', {
            type: 'bar',
            data: {
                labels: this.RadiologyData.radiologyVolumes.map(d => d.categoryName),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.RadiologyData.radiologyVolumes.map(d => d.categoryCount),
                        backgroundColor: ['#179ee2', '#ff6b9d', '#c364c7', '#6bcf7f'],
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

    // Radiology Status Pie Chart
    getRadiologyStatusPieChart() {
        if (this.RadiologyStatusPieChart) {
            this.RadiologyStatusPieChart.destroy();
        }


        // Pathology Status Data
        let RadiologyStatusData = [
            { status: 'Completed', count: this.RadiologyData?.countSummary?.completedCount ?? 0 },
            { status: 'Pending', count: this.RadiologyData?.countSummary?.pendingCount ?? 0 },
            { status: 'Rejected', count: this.RadiologyData?.countSummary?.rejectedCount ?? 0 }
        ];
        return new Chart('RadiologyStatusPieChart', {
            // this.RadiologyStatusPieChart = new Chart('RadiologyStatusPieChart', {

            type: 'doughnut',
            data: {
                labels: RadiologyStatusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: ['#497df7', '#28af28', '#ff5a8a'],
                        data: RadiologyStatusData.map(d => d.count),
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

    // Radiology Volume Trend Line Chart
    getRadiologyVolumeTrendChart() {

        if (this.RadiologyVolumeTrendChart) {
            this.RadiologyVolumeTrendChart.destroy();
        }
        // this.RadiologyVolumeTrendChart = new Chart('RadiologyVolumeTrendChart', {
        debugger
        return new Chart('RadiologyVolumeTrendChart', {
            type: 'line',
            data: {
                labels: this.RadiologyData.dailyTestCounts.map(d => d.radDate),
                datasets: [
                    {
                        label: 'Daily Test Count',
                        data: this.RadiologyData.dailyTestCounts.map(d => d.dayCount),
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
            case 'assignment':
                return 'assignment';
            case 'check_circle':
                return 'check_circle';
            case 'pending':
                return 'hourglass_empty';
            case 'collected':
                return 'local_shipping';
            case 'notcollected':
                return 'work_off';
            case 'verified':
                return 'verified_user';
            case 'unpublished':
                return 'error_outline';
            case 'local_shipping':
                return 'local_shipping';
            case 'pending_actions':
                return 'backspace';
            default:
                return 'dashboard';
        }
    }

    getHomeDashboardAPI() {

        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020',

            this.dashboardService.getPathologyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
                this.pathologyData = res;
                console.log('Pathology Reports:', res);

                let apiData = this.pathologyData.pathologyReportStatus && this.pathologyData.pathologyReportStatus.length ? this.pathologyData.pathologyReportStatus[0] : {};
                this.metrics = [
                    { label: 'Total Report', value: apiData?.totalReports || 0, color: 'cream', icon: 'assignment' },
                    { label: 'Completed', value: apiData?.completedReports || 0, color: 'cream', icon: 'check_circle' },
                    { label: 'Pending', value: apiData?.pendingReports || 0, color: 'cream', icon: 'pending' },
                    { label: 'Collected', value: apiData?.collectedSamples || 0, color: 'cream', icon: 'collected' },
                    { label: 'NoCollected', value: apiData?.notCollectedSamples, color: 'cream', icon: 'notcollected' }, // If API has a matching field, set it.
                    { label: 'Verified', value: apiData?.verifiedReports || 0, color: 'cream', icon: 'verified' },
                    { label: 'Not Verified', value: apiData?.nonVerifiedReports || 0, color: 'cream', icon: 'unpublished' },
                    { label: 'Dispatched', value: apiData?.dispatchedReports, color: 'cream', icon: 'local_shipping' }, // If API has a matching field, set it.
                    { label: 'NoDispatch', value: apiData?.nonDispatchedReports || 0, color: 'cream', icon: 'pending_actions' }
                ];

            }, err => {
                this.metrics = [
                    { label: 'Total Report', value: 0, color: 'lavender', icon: 'assignment' },
                    { label: 'Completed', value: 0, color: 'green', icon: 'check_circle' },
                    { label: 'Pending', value: 0, color: 'mint', icon: 'pending' },
                    { label: 'Collected', value: 0, color: 'rose', icon: 'collected' },
                    { label: 'NoCollected', value: 0, color: 'sky', icon: 'notcollected' },
                    { label: 'Verified', value: 0, color: 'green', icon: 'verified' },
                    { label: 'Not Verified', value: 0, color: 'peach', icon: 'unpublished' },
                    { label: 'Dispatched', value: 0, color: 'peach', icon: 'local_shipping' },
                    { label: 'NoDispatch', value: 0, color: 'orange', icon: 'pending_actions' },
                ];
            });
    }

    workloadTrend() { }
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
export class TopTest2 {
    serviceName: string;
    count: number;

    constructor(test: any) {
        this.serviceName = test.serviceName || '';
        this.count = test.count || 0;
    }
}

export class RadiologistPerformance {
    RadiologistName: string;
    ReportsCompleted: number;
    AvgTime: number;
    count: any
    constructor(radiologist: any) {
        this.RadiologistName = radiologist.RadiologistName || '';
        this.ReportsCompleted = radiologist.ReportsCompleted || 0;
        this.AvgTime = radiologist.AvgTime || 0;
        this.count = radiologist.count || 0;
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
