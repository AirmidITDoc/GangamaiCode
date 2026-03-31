import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import Chart, { Color } from 'chart.js/auto';
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

    financeSummary = [
        { label: 'Patients', value: 0, color: 'green', icon: 'user-plus' },
        { label: 'Collection', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'DiscAmount', value: 0, color: 'sky', icon: 'logout' },
        { label: 'Revenue', value: 0, color: 'butter', icon: 'user-plus' },
        { label: 'PaidAmount', value: 0, color: 'green', icon: 'check-circle' },
        { label: 'CreditAmount', value: 0, color: 'rose', icon: 'hourglass' },
        { label: 'RefundAmount', value: 0, color: 'sky', icon: 'logout' },
        { label: 'AdvAmount', value: 0, color: 'butter', icon: 'user-plus' },
        { label: 'Advused', value: 0, color: 'sky', icon: 'logout' },
        { label: 'AdvRefund', value: 0, color: 'butter', icon: 'user-plus' }
    ];

    dspcategorycount = new MatTableDataSource<PharmacyRecentReport>();
    dsCollectioncount = new MatTableDataSource<PharmacyRecentReport>();


    recentReportsColumns: string[] = ['countPatient', 'totalCollection', 'discAmount', 'totalRevenue', 'paidAmount', 'creditAmount', 'refundAmount', 'advAmount', 'advusedAmount', 'advRefundAmount'];

    pcategorycountColumns: string[] = ['opipType', 'countPatient', 'totalCollection', 'totalRevenue', 'paidAmount'
        , 'creditAmount', 'refundAmount'
    ];


    // Weekly revenue data (last 7 days) - NOT affected by date filter
    weeklyRevenueData = [
        { day: 'Mon', revenue: 0 },
        { day: 'Tue', revenue: 0 },
        { day: 'Wed', revenue: 0 },
        { day: 'Thu', revenue: 0 },
        { day: 'Fri', revenue: 0 },
        { day: 'Sat', revenue: 0 },
        { day: 'Sun', revenue: 0 }
    ];

    // Monthly revenue data (last 12 months) - NOT affected by date filter
    monthlyRevenueData = [
        { month: 'Jan', revenue: 0 },
        { month: 'Feb', revenue: 0 },
        { month: 'Mar', revenue: 0 },
        { month: 'Apr', revenue: 0 },
        { month: 'May', revenue: 0 },
        { month: 'Jun', revenue: 0 },
        { month: 'Jul', revenue: 0 },
        { month: 'Aug', revenue: 0 },
        { month: 'Sep', revenue: 0 },
        { month: 'Oct', revenue: 0 },
        { month: 'Nov', revenue: 0 },
        { month: 'Dec', revenue: 0 }
    ];

    // Payment mode distribution - AFFECTED by date filter
    paymentModeData = [
        { mode: 'Cash', amount: 0 },
        { mode: 'Card', amount: 0 },
        { mode: 'Online', amount: 0 },
        { mode: 'AdvUsed', amount: 0 },
        { mode: 'TdsPay', amount: 0 },
        { mode: 'WFPay', amount: 0 },
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
    colorScheme = { domain: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#a1f6d9', '#f97fbc', '#3b82f6', '#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6'] };

    // Expiring medicines - NOT affected by date filter
    expiryData = [
        { name: 'This Year', value: 0 },
        { name: 'This Month', value: 0 },
        { name: 'Count', value: 0 }
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
        this.getpharmacyData()
        // Initialize all charts after view is loaded
        setTimeout(() => {
            this.initializeCharts();
        }, 500);
    }

    onDateRangeChanged(): void {
        // This method will be called when date range changes
        // Here you would filter the date-dependent data
        console.log('Date range changed:', this.dateFilterForm.value);
        // Re-render affected charts
        this.updateDateFilteredCharts();
    }

    onGo(): void {
        // this.ngOnDestroy()

        this.updateDateFilteredCharts()
        this.getpharmacyData()
    }
    modalityData = [
        { modality: '', opcount: 0 }
    ];
    getpharmacyData() {
        this.fromDate = this.datePipe.transform(this.dateFilterForm.get('start').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.dateFilterForm.get('end').value, "yyyy-MM-dd ") || '01/01/2020',
            this.dashboardService.getPharmacyDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
                this.pharmacyData = res;
                debugger
                this.dsCollectioncount.data[0] = this.pharmacyData.collectionCountSummary
                this.dspcategorycount.data = this.pharmacyData.patientCategoryWiseSummary

                console.log('Pharmacy Reports:', res);

                if (this.pharmacyData) {


                    this.financeSummary = [
                        { label: 'Patients', value: this.pharmacyData.collectionCountSummary?.countPatient || 0, color: 'mint', icon: 'check-circle' },
                        { label: 'Collection', value: this.pharmacyData.collectionCountSummary?.totalCollection || 0, color: 'rose', icon: 'hourglass' },
                        { label: 'DiscAmount', value: this.pharmacyData.collectionCountSummary?.discAmount || 0, color: 'sky', icon: 'logout' },
                        { label: 'Revenue', value: this.pharmacyData.collectionCountSummary?.totalRevenue || 0, color: 'butter', icon: 'user-plus' },
                        { label: 'PaidAmount', value: this.pharmacyData.collectionCountSummary?.paidAmount || 0, color: 'butter', icon: 'user-plus' },

                        { label: 'CreditAmount', value: this.pharmacyData.collectionCountSummary?.creditAmount || 0, color: 'mint', icon: 'check-circle' },
                        { label: 'RefundAmount', value: this.pharmacyData.collectionCountSummary?.refundAmount || 0, color: 'rose', icon: 'hourglass' },
                        { label: 'AdvAmount', value: this.pharmacyData.collectionCountSummary?.advAmount || 0, color: 'sky', icon: 'logout' },
                        { label: 'Advused', value: this.pharmacyData.collectionCountSummary?.advusedAmount || 0, color: 'butter', icon: 'user-plus' },
                        { label: 'AdvRefund', value: this.pharmacyData.collectionCountSummary?.advRefundAmount || 0, color: 'mint', icon: 'check-circle' },

                    ];



                    if (this.pharmacyData.paymentCountSummary)
                        this.paymentModeChart = this.getPaymentDoughnutChart();
                    this.topMedicinesChart = this.getTopMedicinesChart();
                    // this.stockValueChart = this.getStockValueChart();
                    if (this.pharmacyData.expiringMedicines)
                        this.expiryChart = this.getExpiryChart();

                }
            })

    }


    getExpiryChart() {
        if (this.expiryChart) {
            this.expiryChart.destroy();
        }

        // Pharmacy Exp Data
        this.expiryData = [
            { name: 'This Year', value: this.pharmacyData?.expiringMedicines[0]?.expYear ?? 0 },
            { name: 'This Month', value: this.pharmacyData?.expiringMedicines[0]?.expMonth ?? 0 },
            { name: 'Count', value: this.pharmacyData?.expiringMedicines[0]?.cnt ?? 0 }
        ];
        return new Chart('MexpiryStatusPieChart', {
            // this.MexpiryStatusPieChart = new Chart('MexpiryStatusPieChart', {

            type: 'doughnut',
            data: {
                labels: this.expiryData.map(d => d.name),
                datasets: [
                    {
                        backgroundColor: ['#7779f8', '#4f7adf', '#4e519f', '#309afd', '#bb65f5', '#acf1da', '#bc789a', '#4d77b9', '#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6'],
                        data: this.expiryData.map(d => d.value),
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
                // this.paymentModeChart = this.getPaymentDoughnutChart();
            } catch (error) {
                console.error('Error creating payment mode chart:', error);
            }
        }

        // Top Medicines Bar Chart (AFFECTED by date filter)
        if (document.getElementById('topMedicinesChart')) {
            console.log('Creating top medicines chart');
            try {
                // this.topMedicinesChart = this.getTopMedicinesChart();
            } catch (error) {
                console.error('Error creating top medicines chart:', error);
            }
        }

        // Stock Value Chart (NOT affected by date filter)
        if (document.getElementById('stockValueChart')) {
            console.log('Creating stock value chart');
            try {
                // this.stockValueChart = this.getStockValueChart();
            } catch (error) {
                console.error('Error creating stock value chart:', error);
            }
        }

        // Expiry Chart (NOT affected by date filter)
        if (document.getElementById('expiryChart')) {
            console.log('Creating expiry chart');
            try {
                // this.expiryChart = this.getExpiryChart();
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

        if (this.paymentModeChart) {
            this.paymentModeChart.destroy();
        }
        this.paymentModeData[0].amount = this.pharmacyData.paymentCountSummary['cashPay']
        this.paymentModeData[1].amount = this.pharmacyData.paymentCountSummary['cardPay']
        this.paymentModeData[2].amount = this.pharmacyData.paymentCountSummary['onlinePay']
        this.paymentModeData[3].amount = this.pharmacyData.paymentCountSummary['advUsed']
        this.paymentModeData[4].amount = this.pharmacyData.paymentCountSummary['tdsPay']
        this.paymentModeData[5].amount = this.pharmacyData.paymentCountSummary['wfPay']
        debugger
        return new Chart('paymentModeChart', {
            type: 'doughnut',
            data: {
                labels: this.paymentModeData.map(d => d.mode),
                datasets: [
                    {
                        backgroundColor: ['#ce92f6', '#ad73d4', '#754e90', '#bdbfee', '#ca80a5', '#a8efcf', '#aedef5', '#a283f6', '#5287f0', '#a1f6d9', '#3b82f6', '#ff5a8a', '#f6c542'],
                        data: this.paymentModeData.map(d => d.amount),
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
        if (this.topMedicinesChart) {
            this.topMedicinesChart.destroy();
        }

        return new Chart('topMedicinesChart', {
            type: 'bar',
            data: {
                labels: this.pharmacyData.topSellingMedicines.map(d => d.itemName),
                datasets: [
                    {
                        label: 'Sales Count',
                        data: this.pharmacyData.topSellingMedicines.map(d => d.qty),
                        backgroundColor: ['#bb5bfa', '#a84ce5', '#813cb0', '#f08cbe', '#d7669e', '#884659', '#6ed8f5', '#68bad0', '#4d8595', '#a283f6']
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
                // labels: this.pharmacyData.stockValueData.map(d => d.category),
                datasets: [
                    {
                        label: 'Stock Value (₹)',
                        data: this.stockValueData.map(d => d.value),
                        backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#a1f6d9', '#f97fbc', '#3b82f6', '#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6']
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


    // Medicine Categories Chart
    getCategoryChart() {
        return new Chart('categoryChart', {
            type: 'pie',
            data: {
                labels: this.pharmacyData.patientCategoryWiseSummary.map(d => d.category),
                datasets: [
                    {
                        backgroundColor: ['#6366f1', '#497df7', '#4c52f8', '#5287f0', '#bb65f5', '#a1f6d9', '#f97fbc', '#3b82f6', '#ff5a8a', '#f6c542', '#3ecf8e', '#5ac8fa', '#a283f6'],
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
// cat??
    get catTotalcount(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.countPatient || 0), 0);
    }

 get catTotalGross(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.totalCollection || 0), 0);
    }
    get catTotalDiscount(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.discAmount || 0), 0);
    }

    
 get catTotalReversal(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.totalRevenue || 0), 0);
    }
    get catpaidTotal(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.paidAmount || 0), 0);
    }
 get catrefundTotal(): number {
        return this.dspcategorycount.data.reduce((sum, r) => sum + (r.creditAmount || 0), 0);
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


export class PharmacyRecentReport {
    opipType: any;
    countPatient: any;
    totalCollection: any;
    discAmount: any;
    totalRevenue: any;
    paidAmount: any;
    creditAmount: any;
    refundAmount: any;
    advAmount: any;
    advusedAmount: any;
    advRefundAmount: any;

    constructor(report: any) {

        this.opipType = report.opipType || '';

        this.countPatient = report.countPatient || '';
        this.totalCollection = report.totalCollection || '';
        this.discAmount = report.discAmount || 0;
        this.totalRevenue = report.totalRevenue || '';
        this.paidAmount = report.paidAmount || '';
        this.creditAmount = report.creditAmount || '';
        this.refundAmount = report.refundAmount || 0;
        this.advAmount = report.advAmount || '';
        this.advusedAmount = report.advusedAmount || '';
        this.advRefundAmount = report.advRefundAmount || '';
    }
}
