import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Chart, { Color } from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from "../dashboard.service";

@Component({
    selector: 'app-radiology-dashboard',
    templateUrl: './radiology-dashboard.component.html',
    styleUrls: ['./radiology-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RadiologyDashboardComponent implements OnInit {

    dateFilterForm: UntypedFormGroup;
    fromDate: Date;
    toDate: Date;
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
    public modalityChart: any;
    public statusPieChart: any;
    public volumeTrendChart: any;

    // Table Column Definitions
    recentReportsColumns: string[] = ['PatientName', 'TestType', 'Status', 'Radiologist', 'Date'];
    topTestsColumns: string[] = ['TestName', 'Count'];
    radiologistPerformanceColumns: string[] = ['RadiologistName', 'ReportsCompleted', 'AvgTime'];

    dsPathologyCount = new MatTableDataSource<PathologyCount>()
    dsRadiologyCount = new MatTableDataSource<PathologyCount>()
    // Table Data Sources
    dsRecentReports = new MatTableDataSource<RecentReport>();
    dsTopTests = new MatTableDataSource<TopTest>();
    dsRadiologistPerformance = new MatTableDataSource<RadiologistPerformance>();

    // Tests by Modality Data
    modalityData = [
        { modality: 'X-Ray', count: 45 },
        { modality: 'CT Scan', count: 32 },
        { modality: 'MRI', count: 28 },
        { modality: 'Ultrasound', count: 35 },
        { modality: 'Mammography', count: 16 }
    ];

    // Report Status Data
    statusData = [
        { status: 'Completed', count: 118 },
        { status: 'Pending', count: 32 },
        { status: 'Cancelled', count: 6 }
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

    // Pathology Summary Card Data
    pathologyTotalTests: number = 0;
    pathologyCompletedReports: number = 0;
    pathologyPendingReports: number = 0;
    pathologyRejectedSamples: number = 0;

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
    dsPathologyReports = new MatTableDataSource<PathologyReport>();
    dsPathologyTopTests = new MatTableDataSource<TopTest>();
    dsPathologistWorkload = new MatTableDataSource<PathologistWorkload>();



    // Sample Collection Statistics
    sampleCollectionStats = [
        { name: 'Collected', count: 234 },
        { name: 'In Process', count: 28 },
        { name: 'Delayed', count: 12 }
    ];

    constructor(
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private dashboardService: DashboardService,
    ) {
        // Initialize date filter form
        this.dateFilterForm = this.formBuilder.group({
            start: [new Date(new Date().setDate(new Date().getDate() - 7))],
            end: [new Date()]
        });

        this.initializeDateRange();
    }
    pathologyData: any;
    ngOnInit(): void {
        this.dashboardService.getPathologyDashboard({ "FromDate": this.fromDate.toLocaleDateString(), "ToDate": this.toDate.toLocaleDateString() }).subscribe((data) => {
            debugger
            this.pathologyData = data;
            this.dsPathologyReports.data = this.pathologyData.recentPathologyReports;
            this.dsPathologyTopTests.data = this.pathologyData.mostOrderedTests;
            this.dsPathologistWorkload.data = this.pathologyData.pathologyWorkloads;
        })
        this.loadTableData();

        // Initialize all charts after view is loaded
        setTimeout(() => {
            this.initializeCharts();
        }, 500);
    }

    initializeDateRange() {
        const today = new Date();
        this.toDate = new Date(today);

        // Find Monday of current week
        const day = today.getDay();
        const diff = today.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
        const monday = new Date(today);
        monday.setDate(diff);
        this.fromDate = monday;
    }

    loadTableData(): void {
        // Load Radiology Data
        this.getRadiologyData();
        this.dsRecentReports.data = this.recentReportsData;
        this.dsTopTests.data = this.topTestsData;
        this.dsRadiologistPerformance.data = this.radiologistPerformanceData;

        // Load Pathology Data
        this.getpathologyData();
        this.getpathologyReportData();
        // this.dsPathologyReports.data = this.pathologyReportsData;
        // this.dsPathologyTopTests.data = this.pathologyTopTestsData;
        // this.dsPathologistWorkload.data = this.pathologistWorkloadData;
    }

    formatDateForAPI(date: Date): string {
        const dd = String(date.getDate()).padStart(2, '0');
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    formatDateForRadiologyAPI(date: Date): string {
        if (!date) return '';

        const d = new Date(date);
        const year = d.getFullYear();
        const month = ('0' + (d.getMonth() + 1)).slice(-2);
        const day = ('0' + d.getDate()).slice(-2);

        return `${year}-${month}-${day}`;
    }

    onDateRangeChanged(): void {
        console.log('Date range changed:', this.dateFilterForm.value);
        // TODO: When you add APIs, filter data based on date range here
        // For now, using static data
        if (this.fromDate && this.toDate) {
            this.loadTableData();
        }
    }

    getpathologyData() {
        const payload = {
            "searchFields": [
                {
                    "fieldName": "FromDate",
                    "fieldValue": this.formatDateForAPI(this.fromDate),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": this.formatDateForAPI(this.toDate),
                    "opType": "Equals"
                }
            ],
            "mode": "PathologyDashboard"
        };

        this.pathologyTotalTests = 0;
        this.pathologyCompletedReports = 0;
        this.pathologyPendingReports = 0;
        this.pathologyRejectedSamples = 0;

        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            this.dsPathologyCount.data = res || [];
            if (this.dsPathologyCount.data.length > 0) {

                this.dsPathologyCount.data.forEach(element => {

                    // TOTAL TEST COUNT (DATE RANGE)
                    this.pathologyTotalTests += Number(element.TestCount) || 0;

                    if (element.IsCompleted == 1) {
                        this.pathologyCompletedReports++;
                    }

                    if (element.IsCompleted == 0) {
                        this.pathologyPendingReports++;
                    }

                    if (element.IsCancelled == 1) {
                        this.pathologyRejectedSamples++;
                    }

                });
                console.log('Pathology Total Tests:', this.pathologyTotalTests);
                console.log('Pathology complete Tests:', this.pathologyCompletedReports);
                console.log('Pathology Pending Tests:', this.pathologyPendingReports);
                console.log('Pathology cancel Tests:', this.pathologyRejectedSamples);
            }
        });
    }

    getpathologyReportData() {
        const payload = {
            "searchFields": [
                {
                    "fieldName": "FromDate",
                    "fieldValue": this.formatDateForAPI(this.fromDate),
                    "opType": "Equals"
                },
                {
                    "fieldName": "ToDate",
                    "fieldValue": this.formatDateForAPI(this.toDate),
                    "opType": "Equals"
                }
            ],
            "mode": "PathologyDashboard"
        };

        this.dashboardService.HomeDashboardAPI(payload).subscribe((res: any) => {
            // this.dsPathologyReports.data = res || [];
            //this.dsPathologyTopTests.data = res || [];
            //this.dsPathologistWorkload.data = res || [];
            console.log('Pathology Reports:', this.dsPathologyReports.data);
            console.log('Pathology TopTests:', this.dsPathologyTopTests.data);
            console.log('Pathologist:', this.dsPathologistWorkload.data);
        });
    }

    getRadiologyData() {
        const payload = {
            searchFields: [
                {
                    fieldName: "FromDate",
                    fieldValue: this.formatDateForRadiologyAPI(this.fromDate),
                    opType: "Equals"
                },
                {
                    fieldName: "ToDate",
                    fieldValue: this.formatDateForRadiologyAPI(this.toDate),
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
                // Radiology tab - charts already initialized
                console.log('Radiology tab selected');
            } else if (event.index === 1) {
                // Pathology tab - initialize charts
                this.initializePathologyCharts();
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
            this.modalityChart = this.getModalityBarChart();
        }

        // Status Pie Chart
        if (document.getElementById('statusPieChart')) {
            this.statusPieChart = this.getStatusPieChart();
        }

        // Volume Trend Chart
        if (document.getElementById('volumeTrendChart')) {
            this.volumeTrendChart = this.getVolumeTrendChart();
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

    // Tests by Modality Bar Chart
    getModalityBarChart() {
        return new Chart('modalityChart', {
            type: 'bar',
            data: {
                labels: this.modalityData.map(d => d.modality),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.modalityData.map(d => d.count),
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
        return new Chart('statusPieChart', {
            type: 'doughnut',
            data: {
                labels: this.statusData.map(d => d.status),
                datasets: [
                    {
                        backgroundColor: ['#28af28', '#f6c542', '#ff5a8a'],
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
                        backgroundColor: ['#ff6b9d', '#c364c7', '#4d96ff', '#6bcf7f'],
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
                        backgroundColor: ['#28af28', '#f6c542', '#ff5a8a'],
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

    constructor(pathologist: any) {
        this.PathologistName = pathologist.PathologistName || '';
        this.TestsReported = pathologist.TestsReported || 0;
        this.AvgTime = pathologist.AvgTime || 0;
    }
}
