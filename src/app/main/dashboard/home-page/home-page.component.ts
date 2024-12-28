import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { DashboardService } from '../dashboard.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class HomePageComponent implements OnInit {


  username: any;

  constructor(
        public _dashboardServices: DashboardService,
        public _accountServices: AuthenticationService,
        private router: Router,
        public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.username = this._accountServices.currentUserValue.user.UserName || '';
  }

}
