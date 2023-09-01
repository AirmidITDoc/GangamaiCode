import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import Chart, { ChartColor } from 'chart.js';

@Component({
  selector: 'app-daily-dashboard',
  templateUrl: './daily-dashboard.component.html',
  styleUrls: ['./daily-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DailyDashboardComponent implements OnInit {

  dashbardCardData: any = [];
  username: any;

  DashChartIP: any = [];
  DashChartOP: any = [];

  isLoadingArr = ['0', '0', '0'];
  pieChartOPData = new PieChartOPData();
  pieChartData = new PieChartData();
  tableCurrentRange: any;
  public chart1: any;
  public chart2: any;
  public chart3: any;
  public chart4: any;
  public surveyChart: any;
  public doughnutChart: any;

  constructor(
    public _dashboardServices: DashboardService,
    public _accountServices: AuthenticationService
  ) { }

  ngOnInit(): void {

    this.username = this._accountServices.currentUserValue.user
      ? this._accountServices.currentUserValue.user.firstName + ' ' + this._accountServices.currentUserValue.user.lastName
      : '';

    this.getDashboardSummary();
    this.getOPChartData();
    this.getIPChartData();

    this.tableCurrentRange = this.pieChartData.currentRange;
    this.chart1 = this.getLineChartData('MyChart1', '#d4bbf4', '#c5aae6');
    this.chart2 = this.getLineChartData('MyChart2', '#f3ddb3', '#ebcf9a');
    this.chart3 = this.getLineChartData('MyChart3', '#d1efad', '#c5e999');
    this.chart4 = this.getLineChartData('MyChart4', '#c5f1ef', '#a1e6e3');
    this.surveyChart = this.getSurveyChart();
    this.doughnutChart = this.getDoughnutChart();
  }

  public getDashboardSummary() {
    this._dashboardServices.getDailyDashboardSummary().subscribe(data => {
      this.dashbardCardData = data;
      //console.log(this.dashCardsData);
    });
  }

  showOPDayGroupWiseSummary() {

  }

  onSelectPieOptionOP(value) {
    this.DashChartOP = [];
    this.pieChartOPData.currentRange = value;
    this.getOPChartData();
  }

  public getOPChartData() {
    this.isLoadingArr[0] = '0';
    var m_data = {
      "DateRange": this.pieChartOPData.currentRange,
    }
    this._dashboardServices.getOPDashChart(m_data).subscribe(data => {
      this.DashChartOP = data;
      this.isLoadingArr[0] = '1';
      if (this.DashChartOP && this.DashChartOP.length > 0) {
        this.isLoadingArr[0] = '2';
        this.pieChartOPData['footerLeft'].title = 'Total Count';
        this.pieChartOPData['footerLeft'].count = this.DashChartOP[0]['TotalCount'];
        this.pieChartOPData['footerRight'].title = 'Doctor Count';
        this.pieChartOPData['footerRight'].count = this.DashChartOP[0]['DischargeCount'];
        this.pieChartOPData.mainChart[this.pieChartOPData.currentRange] = [];
        this.DashChartOP.forEach(element => {
          this.pieChartOPData.mainChart[this.pieChartOPData.currentRange].push(element);
        });
      } else {
        this.pieChartOPData['footerLeft'].count = 0;
        this.pieChartOPData['footerRight'].count = 0;
      }
    });
  }

  onSelectPieOptionIP(value) {
    this.DashChartIP = [];
    this.pieChartData.currentRange = value;
    this.getIPChartData();
    // this.getCurrAdmDepartSumry();
  }

  getIPChartData() {
    var m_data = {
      "DateRange": this.pieChartData.currentRange,
    }
    this.isLoadingArr[1] = '0';
    this.getIPChartDataAPI(m_data).subscribe(response => {
      this.DashChartIP.push(response);
      if (this.DashChartIP && this.DashChartIP.length > 0) {
        this.isLoadingArr[2] = '2';
        this.pieChartData['footerLeft'].title = 'Admission Count ';
        this.pieChartData['footerLeft'].count = this.DashChartIP[0]['TotalCount'];
        this.pieChartData['footerRight'].title = 'Discharge Count';
        this.pieChartData['footerRight'].count = this.DashChartIP[0]['DischargeCount'];
        this.pieChartData.mainChart[this.pieChartData.currentRange] = [];
        this.DashChartIP.forEach(element => {
          this.pieChartData.mainChart[this.pieChartData.currentRange].push(element);
        });
      } else {
        this.isLoadingArr[1] = '1';
        this.pieChartData['footerLeft'].count = 0;
        this.pieChartData['footerRight'].count = 0;
      }
    });
  }
  public getIPChartDataAPI(params: Object): Observable<any> {
    var subject = new Subject<string>();
    this._dashboardServices.getIPDashChart(params).subscribe((data: any) => {
      // this.sIsLoading = '';
      data.map(response => {
        subject.next(response);
      });
    });
    return subject.asObservable();
  }

  getLineChartData(charId: string, backgroundColor: ChartColor, borderColor: ChartColor) {

    return new Chart(charId, {
      type: 'line',
      data: {
        labels: ['2022-05-10', '2022-05-11', '2022-05-12', '2022-05-13',
          '2022-05-14'],
        datasets: [
          {
            label: "Sales",
            data: [0, 90, 70, 60, 110],
            backgroundColor: backgroundColor, //#cacef3',
            borderColor: borderColor
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        elements: {
          point: {
            radius: 0
          }
        },
        legend: {
          display: false,
        },
        scales: {
          xAxes: [{
            display: false
          }],
          yAxes: [{
            display: false
          }]
        }
      }
    });
  }

  getSurveyChart() {
    const canvas = <HTMLCanvasElement>document.getElementById('surveyChart');
    const ctx = canvas.getContext('2d');
    var gradient1 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient1.addColorStop(0, 'rgba(10,10,10,.2)');
    gradient1.addColorStop(1, 'rgba(255,255,255,1)');

    var gradient2 = ctx.createLinearGradient(0, 0, 0, 400);
    gradient2.addColorStop(0, 'rgb(183 115 208 / 20%)');
    gradient2.addColorStop(1, 'rgba(255,255,255,1)');
    return new Chart("surveyChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Friday', 'Sat'],
        datasets: [
          {
            label: "Sales",
            data: [467, 576, 572, 79, 92, 574],
            backgroundColor: gradient1,
            borderColor: "rgba(10,10,10,.2)"
          },
          {
            label: "Profit",
            data: [542, 542, 536, 327, 17, 0.00],
            backgroundColor: gradient2,
            borderColor: "rgb(156 76 186 / 20%)"
          }
        ]
      },
      options: {
        scales: {
          xAxes: [{
            display: false
          }],
        }
      }

    });
  }

  getDoughnutChart() {
    return new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels: ['ONE', 'TWO', 'THREE', 'FOUR', 'FIVE'],
        datasets: [
          {
            backgroundColor: [
              '#FF3784',
              '#36A2EB',
              '#4BC0C0',
              '#F77825',
              '#9966FF',
            ],
            data: [1, 2, 3, 4, 5],
          },
        ],
      },
      options: {
        plugins: {
          legend: true,
          tooltip: {
            enabled: true,
          },
          outlabels: {
            text: '%l %p',
            color: 'white',
            stretch: 35,
            font: {
              resizable: true,
              minSize: 12,
              maxSize: 18,
            },
          },
        },
      },
    })
  }
}

export class PieChartData {
  currentRange = 'Todays';
  mainChart = {
    'Todays': [],
    'Last Weeks': [],
    'Last Month': []
  };
  footerLeft = {
    title: '',
    count: 0
  };
  footerRight = {
    title: '',
    count: 0
  };
}

export class PieChartOPData {
  currentRange = 'Todays';
  mainChart = {
    'Todays': [],
    'Last Weeks': [],
    'Last Month': []
  };
  footerLeft = {
    title: '',
    count: 0
  };
  footerRight = {
    title: '',
    count: 0
  };
}