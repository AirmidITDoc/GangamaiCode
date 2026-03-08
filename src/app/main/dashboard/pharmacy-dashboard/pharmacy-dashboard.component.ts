import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Chart, { Color } from 'chart.js/auto';
import { AuthenticationService } from "app/core/services/authentication.service";
import { DashboardService } from "../dashboard.service";

@Component({
    selector: "app-pharmacy-dashboard",
    templateUrl: "./pharmacy-dashboard.component.html",
    styleUrls: ["./pharmacy-dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PharmacyDashboardComponent implements OnInit {

    username: any;
    dateFilterForm: UntypedFormGroup;
    UnitId: any = this._accountServices.currentUserValue.user.unitId;
    pharmacyData
    fromDate: any;
    toDate: any;
    // Static data for dashboard (NOT affected by date filter)
    totalRevenue: any;
    weeklyRevenue: any;
    monthlyRevenue: any;
    inventoryValue: any;
    lowStockItems: any;
    expiringMedicines: any;
    totalSuppliers: any;

    // Date-filtered data (AFFECTED by date filter)
    totalOrders: any;
    totalCustomers: any;
    pendingOrders: any;

    // Charts
    public weeklyRevenueChart: any;
    public monthlyRevenueChart: any;
    public ordersChart: any;
    public customersChart: any;
    public paymentModeChart: any;
    public topMedicinesChart: any;
    public stockValueChart: any;
    public expiryChart: any;
    public categoryChart: any;

    // Weekly revenue data (last 7 days) - NOT affected by date filter
    weeklyRevenueData = [
        { day: 'Mon', revenue: 38000 },
        { day: 'Tue', revenue: 42000 },
        { day: 'Wed', revenue: 35000 },
        { day: 'Thu', revenue: 48000 },
        { day: 'Fri', revenue: 45000 },
        { day: 'Sat', revenue: 52000 },
        { day: 'Sun', revenue: 25000 }
    ];

    // Monthly revenue data (last 12 months) - NOT affected by date filter
    monthlyRevenueData = [
        { month: 'Jan', revenue: 95000 },
        { month: 'Feb', revenue: 88000 },
        { month: 'Mar', revenue: 102000 },
        { month: 'Apr', revenue: 98000 },
        { month: 'May', revenue: 115000 },
        { month: 'Jun', revenue: 108000 },
        { month: 'Jul', revenue: 125000 },
        { month: 'Aug', revenue: 118000 },
        { month: 'Sep', revenue: 105000 },
        { month: 'Oct', revenue: 132000 },
        { month: 'Nov', revenue: 128000 },
        { month: 'Dec', revenue: 142000 }
    ];

    // Payment mode distribution - AFFECTED by date filter
    paymentModeData = [
        { mode: 'Cash', amount: 0 },
        { mode: 'Card', amount: 0 },
        { mode: 'Online', amount: 0 },
        { mode: 'Insurance', amount: 0 }
    ];

    // Top selling medicines - AFFECTED by date filter
    topMedicinesData = [
        { name: 'Paracetamol', sales: 0 },
        { name: 'Amoxicillin', sales: 0 },
        { name: 'Ibuprofen', sales: 0 },
        { name: 'Metformin', sales: 0 },
        { name: 'Aspirin', sales: 0 }
    ];

    // Inventory status - NOT affected by date filter
    inventoryData = [
        { category: 'In Stock', count: 0 },
        { category: 'Low Stock', count: 0 },
        { category: 'Out of Stock', count: 8 }
    ];

    // Medicine categories - NOT affected by date filter
    categoryData = [
        { category: 'Tablets', count: 0 },
        { category: 'Syrups', count: 0 },
        { category: 'Injections', count: 0 },
        { category: 'Capsules', count: 0 },
        { category: 'Ointments', count: 0 }
    ];

    // Expiring medicines - NOT affected by date filter
    expiryData = [
        { period: 'This Month', count: 0 },
        { period: 'Next Month', count: 0 },
        { period: '3 Months', count: 0 }
    ];

    // Stock value by category - NOT affected by date filter
    stockValueData = [
        { category: 'Antibiotics', value: 0 },
        { category: 'Pain Relief', value: 0 },
        { category: 'Diabetes Care', value: 0 },
        { category: 'Cardiac', value: 0 },
        { category: 'Others', value: 0 }
    ];

    constructor(
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        public _accountServices: AuthenticationService, private dashboardService: DashboardService,
    ) {
        // Initialize date filter form
        this.dateFilterForm = this.formBuilder.group({
            start: [new Date(new Date().setDate(new Date().getDate() - 30))],
            end: [new Date()]
        });
    }

    ngOnInit(): void {
        // Safely get username with null check
        if (this._accountServices && this._accountServices.currentUserValue) {
            this.username = this._accountServices.currentUserValue.userName || 'User';
        } else {
            this.username = 'User';
        }

        // Initialize all charts after view is loaded
        setTimeout(() => {
            this.initializeCharts();
        }, 500);
    }

    onDateRangeChanged(): void {
        // This method will be called when date range changes
        // Here you would filter the date-dependent data
        console.log('Date range changed:', this.dateFilterForm.value);

        // For now, using static data
        // When you add APIs, filter these data based on date:
        // - totalOrders
        // - totalCustomers
        // - paymentModeData
        // - topMedicinesData

        // Re-render affected charts
        this.updateDateFilteredCharts();
    }

    onGo(): void {
        // this.ngOnDestroy()
        this.getpathologyReportData()
        this.updateDateFilteredCharts()
    }

    getpathologyReportData() {
        this.fromDate = this.datePipe.transform(this.dateFilterForm.get('start').value, "yyyy-MM-dd") || '01/01/2020',
        this.toDate = this.datePipe.transform(this.dateFilterForm.get('end').value, "yyyy-MM-dd ") || '01/01/2020',


            this.dashboardService.getPathologyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
                this.pharmacyData = res;
                console.log('Pathology Reports:', res);

                if (this.pharmacyData) {
                    // this.dsPathologyReports.data = res.recentPathologyReports;
                    // this.dsPathologyTopTests.data = res.mostOrderedTests;
                    // this.trendData = this.pathologyData.mostOrderedTests
                    // this.dsPathologistWorkload.data = res.pathologyWorkloads


                    // if (this.trendData) {

                    //     this.modalityData = [
                    //         ...this.modalityData,
                    //         ...this.trendData.map(item => ({

                    //             modality: item.testName,
                    //             count: item.count
                    //         }))
                    //     ];
                    // }
                    debugger
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

                    // if (this.pathologyData.pathologyValumes.length > 0)
                    //     // this.getPathologyDepartmentChart()
                    //     this.pathologyDepartmentChart = this.getPathologyDepartmentChart();
                    // this.pathologyStatusPieChart = this.getPathologyStatusPieChart()
                    // if (this.pathologyData.dailyTestCounts.length > 0)
                    //     this.pathologyVolumeTrendChart = this.getPathologyVolumeTrendChart()
                }
            });

    }
    updateDateFilteredCharts(): void {
        // Update charts that are affected by date filter
        if (this.ordersChart) {
            this.ordersChart.destroy();
        }
        if (this.customersChart) {
            this.customersChart.destroy();
        }
        if (this.paymentModeChart) {
            this.paymentModeChart.destroy();
        }
        if (this.topMedicinesChart) {
            this.topMedicinesChart.destroy();
        }

        // Reinitialize the affected charts
        setTimeout(() => {
            if (document.getElementById('ordersChart')) {
                this.ordersChart = this.getLineChartData(
                    'ordersChart',
                    '#d1efad',
                    '#c5e999',
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    [45, 52, 48, 65, 58, 72, 38],
                    'Days',
                    'Orders'
                );
            }

            if (document.getElementById('customersChart')) {
                this.customersChart = this.getLineChartData(
                    'customersChart',
                    '#c5f1ef',
                    '#a1e6e3',
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    [28, 35, 32, 42, 38, 45, 25],
                    'Days',
                    'Customers'
                );
            }

            if (document.getElementById('paymentModeChart')) {
                this.paymentModeChart = this.getPaymentDoughnutChart();
            }

            if (document.getElementById('topMedicinesChart')) {
                this.topMedicinesChart = this.getTopMedicinesChart();
            }
        }, 100);
    }

    initializeCharts(): void {
        console.log('Initializing charts...');

        // Weekly Revenue Chart (NOT affected by date filter)
        const weeklyCanvas = document.getElementById('weeklyRevenueChart');
        if (weeklyCanvas) {
            console.log('Creating weekly revenue chart');
            try {
                this.weeklyRevenueChart = this.getLineChartData(
                    'weeklyRevenueChart',
                    '#d4bbf4',
                    '#c5aae6',
                    this.weeklyRevenueData.map(d => d.day),
                    this.weeklyRevenueData.map(d => d.revenue),
                    'Days',
                    'Revenue (₹)'
                );
            } catch (error) {
                console.error('Error creating weekly revenue chart:', error);
            }
        } else {
            console.warn('Weekly revenue chart canvas not found');
        }

        // Monthly Revenue Chart (NOT affected by date filter)
        const monthlyCanvas = document.getElementById('monthlyRevenueChart');
        if (monthlyCanvas) {
            console.log('Creating monthly revenue chart');
            try {
                this.monthlyRevenueChart = this.getLineChartData(
                    'monthlyRevenueChart',
                    '#f3ddb3',
                    '#ebcf9a',
                    this.monthlyRevenueData.slice(-7).map(d => d.month),
                    this.monthlyRevenueData.slice(-7).map(d => d.revenue),
                    'Months',
                    'Revenue (₹)'
                );
            } catch (error) {
                console.error('Error creating monthly revenue chart:', error);
            }
        } else {
            console.warn('Monthly revenue chart canvas not found');
        }

        // Orders Chart (AFFECTED by date filter)
        const ordersCanvas = document.getElementById('ordersChart');
        if (ordersCanvas) {
            console.log('Creating orders chart');
            try {
                this.ordersChart = this.getLineChartData(
                    'ordersChart',
                    '#d1efad',
                    '#c5e999',
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    [45, 52, 48, 65, 58, 72, 38],
                    'Days',
                    'Orders'
                );
            } catch (error) {
                console.error('Error creating orders chart:', error);
            }
        } else {
            console.warn('Orders chart canvas not found');
        }

        // Customers Chart (AFFECTED by date filter)
        const customersCanvas = document.getElementById('customersChart');
        if (customersCanvas) {
            console.log('Creating customers chart');
            try {
                this.customersChart = this.getLineChartData(
                    'customersChart',
                    '#c5f1ef',
                    '#a1e6e3',
                    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    [28, 35, 32, 42, 38, 45, 25],
                    'Days',
                    'Customers'
                );
            } catch (error) {
                console.error('Error creating customers chart:', error);
            }
        } else {
            console.warn('Customers chart canvas not found');
        }

        // Payment Mode Doughnut Chart (AFFECTED by date filter)
        if (document.getElementById('paymentModeChart')) {
            console.log('Creating payment mode chart');
            try {
                this.paymentModeChart = this.getPaymentDoughnutChart();
            } catch (error) {
                console.error('Error creating payment mode chart:', error);
            }
        }

        // Top Medicines Bar Chart (AFFECTED by date filter)
        if (document.getElementById('topMedicinesChart')) {
            console.log('Creating top medicines chart');
            try {
                this.topMedicinesChart = this.getTopMedicinesChart();
            } catch (error) {
                console.error('Error creating top medicines chart:', error);
            }
        }

        // Stock Value Chart (NOT affected by date filter)
        if (document.getElementById('stockValueChart')) {
            console.log('Creating stock value chart');
            try {
                this.stockValueChart = this.getStockValueChart();
            } catch (error) {
                console.error('Error creating stock value chart:', error);
            }
        }

        // Expiry Chart (NOT affected by date filter)
        if (document.getElementById('expiryChart')) {
            console.log('Creating expiry chart');
            try {
                this.expiryChart = this.getExpiryChart();
            } catch (error) {
                console.error('Error creating expiry chart:', error);
            }
        }

        // Category Chart (NOT affected by date filter)
        if (document.getElementById('categoryChart')) {
            console.log('Creating category chart');
            try {
                this.categoryChart = this.getCategoryChart();
            } catch (error) {
                console.error('Error creating category chart:', error);
            }
        }

        console.log('Charts initialization complete');
    }

    // Small line chart for cards
    getLineChartData(chartId: string, backgroundColor: Color, borderColor: Color, labels: string[], data: number[], xAxisLabel?: string, yAxisLabel?: string) {
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
                        title: {
                            display: !!xAxisLabel,
                            text: xAxisLabel || '',
                            font: {
                                size: 10,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: false
                        },
                        ticks: {
                            font: {
                                size: 9
                            }
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: !!yAxisLabel,
                            text: yAxisLabel || '',
                            font: {
                                size: 10,
                                weight: 'bold'
                            }
                        },
                        grid: {
                            display: true,
                            color: 'rgba(0, 0, 0, 0.05)'
                        },
                        ticks: {
                            font: {
                                size: 9
                            },
                            callback: function (value: any) {
                                if (Number(value) >= 1000) {
                                    return '₹' + (Number(value) / 1000) + 'K';
                                }
                                return '₹' + value;
                            }
                        }
                    }
                }
            }
        });
    }

    // Payment Mode Doughnut Chart
    getPaymentDoughnutChart() {
        return new Chart('paymentModeChart', {
            type: 'doughnut',
            data: {
                labels: this.pharmacyData.paymentModeData.map(d => d.mode),
                datasets: [
                    {
                        backgroundColor: ['#FF3784', '#36A2EB', '#4BC0C0', '#F77825'],
                        data: this.paymentModeData.map(d => d.amount)
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    },
                    tooltip: {
                        enabled: true,
                        callbacks: {
                            label: function (context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '₹' + context.parsed.toLocaleString('en-IN');
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }

    // Top Medicines Horizontal Bar Chart
    getTopMedicinesChart() {
        return new Chart('topMedicinesChart', {
            type: 'bar',
            data: {
                labels: this.pharmacyData.topMedicinesData.map(d => d.name),
                datasets: [
                    {
                        label: 'Sales Count',
                        data: this.topMedicinesData.map(d => d.sales),
                        backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6']
                    }
                ]
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    x: {
                        beginAtZero: true
                    }
                }
            }
        });
    }

    // Stock Value by Category Chart
    getStockValueChart() {
        return new Chart('stockValueChart', {
            type: 'bar',
            data: {
                labels: this.pharmacyData.stockValueData.map(d => d.category),
                datasets: [
                    {
                        label: 'Stock Value (₹)',
                        data: this.stockValueData.map(d => d.value),
                        backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a']
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
                            callback: function (value: any) {
                                return '₹' + (Number(value) / 1000) + 'K';
                            }
                        }
                    }
                }
            }
        });
    }

    // Expiring Medicines Chart
    getExpiryChart() {
        return new Chart('expiryChart', {
            type: 'doughnut',
            data: {
                labels: this.expiryData.map(d => d.period),
                datasets: [
                    {
                        backgroundColor: ['#ff5a8a', '#f6c542', '#3ecf8e'],
                        data: this.expiryData.map(d => d.count)
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Medicine Categories Chart
    getCategoryChart() {
        return new Chart('categoryChart', {
            type: 'pie',
            data: {
                labels: this.categoryData.map(d => d.category),
                datasets: [
                    {
                        backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a'],
                        data: this.categoryData.map(d => d.count)
                    }
                ]
            },
            options: {
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

