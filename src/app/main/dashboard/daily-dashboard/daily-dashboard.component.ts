import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Observable, Subject } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-daily-dashboard',
  templateUrl: './daily-dashboard.component.html',
  styleUrls: ['./daily-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DailyDashboardComponent implements OnInit {

  dashbardCardData : any = [];
  username :any;
  
  DashChartIP: any = [];
  DashChartOP: any = [];
  
  isLoadingArr = ['0', '0', '0'];
  pieChartOPData = new PieChartOPData();
  pieChartData = new PieChartData();
  tableCurrentRange: any;
  
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
  }

  public getDashboardSummary() {
    this._dashboardServices.getDailyDashboardSummary().subscribe(data => {
      this.dashbardCardData = data;
      //console.log(this.dashCardsData);
    });
  }
  
  showOPDayGroupWiseSummary(){

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