import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import Chart from 'chart.js/auto';
import { DashboardService } from "../dashboard.service";

@Component({
    selector: 'app-cashless-dashboard',
    templateUrl: './cashless-dashboard.component.html',
    styleUrls: ['./cashless-dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CashlessDashboardComponent implements OnInit {
    myFilterform: UntypedFormGroup;
    UnitId: any = this._accountServices.currentUserValue.user.unitId;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    cashlessallData: any
    public CompanycountChart: any;
    public CompanydailyTrendChart: any
    public CompanyrevenuStatusPieChart: any;

    compReportsColumns: string[] = ['companyName', 'cashlessPatientCount', 'billAmount', 'discAmount', 'compDiscAmount', 'netBillAmount'];


    constructor(
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder, public _accountServices: AuthenticationService,
        private dashboardService: DashboardService,
    ) {

        // this.initializeDateRange();
    }


    metrics = [
        { label: 'Total OP Count', value: 0, color: 'lavender', icon: 'assignment' },
        { label: 'Total IP Count', value: 0, color: 'mint', icon: 'pending' },
        // { label: 'Approval', value: 0, color: 'rose', icon: 'collected' },
        // { label: 'Rejected', value: 0, color: 'sky', icon: 'notcollected' },
        // { label: 'Verified', value: 0, color: 'green', icon: 'verified' },
        // { label: 'Not Verified', value: 0, color: 'peach', icon: 'unpublished' },
        // { label: 'Dispatched', value: 0, color: 'peach', icon: 'local_shipping' },
        // { label: 'NoDispatch', value: 0, color: 'orange', icon: 'pending_actions' },
    ];
    ngOnInit(): void {

        this.myFilterform = this.dashboardService.filterFormfinance();
        this.loadDashboardData();

        setTimeout(() => {
            // this.initializePathologyCharts();
            // this.initializeRadiologyCharts();
        }, 500);
    }

    onGo(): void {

        this.loadDashboardData()
    }

    loadDashboardData(): void {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || '01/01/2020',
            this.toDate = this.datePipe.transform(this.myFilterform.get('toDate').value, "yyyy-MM-dd ") || '01/01/2020'

        this.getCashlessdata()
        // this.getCompanydailyTrendChart()
        // this.getCompnayRevenuChart()
    }

    dsCompsummaryReports = new MatTableDataSource<Compsummary>();
    getCashlessdata() {


        this.dashboardService.getcashlessDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
            this.cashlessallData = res;
            console.log('Cashless Reports:', res);

            if (this.cashlessallData) {
                this.dsCompsummaryReports.data = res.companyBillSummaries;
                //  this.dsCompsummaryReports.data = res.companyBillSummaries;
                debugger
                this.metrics = [
                    { label: 'Total OP Count', value: this.cashlessallData?.cashlessPatientSummary[0].cashlessPatientCount || 0, color: 'cream', icon: 'assignment' },
                    { label: 'Total IP Count', value: this.cashlessallData?.cashlessPatientSummary[1].cashlessPatientCount || 0, color: 'cream', icon: 'check_circle' },

                ];

                if (this.cashlessallData.companyPatientCounts)
                    this.CompanycountChart = this.getCompnayRevenuChart();
                if (this.cashlessallData.dailyTrend.length > 0)
                    this.CompanydailyTrendChart = this.getCompanydailyTrendChart()
            }
        });

    }


    getCompanydailyTrendChart() {

        if (this.CompanydailyTrendChart) {
            this.CompanydailyTrendChart.destroy();
        }

        return new Chart('CompanydailyTrendChart', {

            type: 'line',
            data: {
                labels: this.cashlessallData.dailyTrend.map(d => d.date),
                datasets: [
                    {
                        label: 'Daily Count',
                        data: this.cashlessallData.dailyTrend.map(d => d.cashlessPatientCount),
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


    // Pathology Department Bar Chart
    getCompnayRevenuChart() {

        if (this.CompanycountChart) {
            this.CompanycountChart.destroy();
        }

        return new Chart('CompanycountChart', {
            // this.pathologyDepartmentChart = new Chart('pathologyDepartmentChart', {

            type: 'bar',
            data: {
                labels: this.cashlessallData.companyPatientCounts.map(d => d.companyName),
                datasets: [
                    {
                        label: 'Number of Tests',
                        data: this.cashlessallData.companyPatientCounts.map(d => d.cashlessPatientCount),
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

}


export class Compsummary {
    companyName: any;
    cashlessPatientCount: any;
    billAmount: any;
    discAmount: any;
    compDiscAmount: any;
    netBillAmount: any;
    constructor(Compsummary) {
        this.companyName = Compsummary.companyName || '';
        this.cashlessPatientCount = Compsummary.cashlessPatientCount || '0';
        this.billAmount = Compsummary.billAmount || '0';
        this.discAmount = Compsummary.discAmount || '0';
        this.compDiscAmount = Compsummary.compDiscAmount || '0';
        this.netBillAmount = Compsummary.netBillAmount || '0';
    }
}
