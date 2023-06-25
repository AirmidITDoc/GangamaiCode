import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-daily-dashboard',
  templateUrl: './daily-dashboard.component.html',
  styleUrls: ['./daily-dashboard.component.scss']
})
export class DailyDashboardComponent implements OnInit {

  dashbardCardData : any = [];
  username :any;

  constructor(
    public _dashboardServices: DashboardService,
    public _accountServices: AuthenticationService
  ) { }

  ngOnInit(): void {
    
    this.username = this._accountServices.currentUserValue.user
      ? this._accountServices.currentUserValue.user.firstName + ' ' + this._accountServices.currentUserValue.user.lastName
      : '';

    this.getDashboardSummary();
  }

  public getDashboardSummary() {
    this._dashboardServices.getDailyDashboardSummary().subscribe(data => {
      this.dashbardCardData = data;
      //console.log(this.dashCardsData);
    });
  }
  showOPDayGroupWiseSummary(){

  }
}
