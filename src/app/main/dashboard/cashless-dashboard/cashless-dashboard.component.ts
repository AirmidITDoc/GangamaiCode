import { DatePipe } from "@angular/common";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { UntypedFormBuilder, UntypedFormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Chart, { Color } from 'chart.js/auto';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from "../dashboard.service";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
  selector: 'app-cashless-dashboard',
  templateUrl: './cashless-dashboard.component.html',
  styleUrls: ['./cashless-dashboard.component.scss']
})
export class CashlessDashboardComponent implements OnInit {
  myFilterform: UntypedFormGroup;
  UnitId: any = this._accountServices.currentUserValue.user.unitId;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

   cashlessallData:any
  public CompanyRevenuChart: any;
  public CompanyrevenuStatusPieChart: any;



  constructor(
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder, public _accountServices: AuthenticationService,
    private dashboardService: DashboardService,
  ) {

    // this.initializeDateRange();
  }
  metrics = [
    { label: 'Total Cashless', value: 0, color: 'lavender', icon: 'assignment' },
    // { label: 'Completed', value: 0, color: 'green', icon: 'check_circle' },
    { label: 'Pending', value: 0, color: 'mint', icon: 'pending' },
    { label: 'Approval', value: 0, color: 'rose', icon: 'collected' },
    { label: 'Rejected', value: 0, color: 'sky', icon: 'notcollected' },
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
  }
 

  getCashlessdata() {


    this.dashboardService.getcashlessDashboard({ "UnitId": this.UnitId, "FromDate": this.fromDate, "ToDate": this.toDate }).subscribe((res) => {
      this.cashlessallData = res;
      console.log('Cashless Reports:', res);

      if (this.cashlessallData) {
        // this.dsPathologyReports.data = res.recentPathologyReports;
        // this.dsPathologyTopTests.data = res.mostOrderedTests;
        // this.trendData = this.cashlessallData.mostOrderedTests
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

        // console.log(this.modalityData)
        // if (this.modalityData)
        //     this.modalityChart = this.getModalityBarChart();

        // if (this.cashlessallData) {
        //     this.statusData[0].count = this.cashlessallData.countSummary.completedCount
        //     this.statusData[1].count = this.cashlessallData.countSummary.pendingCount
        //     this.statusData[2].count = this.cashlessallData.countSummary.rejectedCount
        // }
        // if (this.statusData)
        //     this.statusPieChart = this.getStatusPieChart();

        // if (this.cashlessallData.pathologyValumes.length > 0)

        this.CompanyRevenuChart = this.getCompnayRevenuChart();
        // this.pathologyStatusPieChart = this.getPathologyStatusPieChart()
        // if (this.cashlessallData.dailyTestCounts.length > 0)
        //     this.pathologyVolumeTrendChart = this.getPathologyVolumeTrendChart()
      }
    });

  }


  // Pathology Department Bar Chart
  getCompnayRevenuChart() {

    if (this.CompanyRevenuChart) {
      this.CompanyRevenuChart.destroy();
    }

    return new Chart('CompanyRevenuChart', {
      // this.pathologyDepartmentChart = new Chart('pathologyDepartmentChart', {

      type: 'bar',
      data: {
        labels: this.cashlessallData.pathologyValumes.map(d => d.categoryName),
        datasets: [
          {
            label: 'Number of Tests',
            data: this.cashlessallData.pathologyValumes.map(d => d.categoryCount),
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
