import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HomePageComponent {
  username: any;
  // private currentUserSubject: BehaviorSubject<User>;
  // public currentUser: Observable<User>;

  constructor(
        public _accountServices: AuthenticationService,
        private router: Router,
  ) { 
    //  this.currentUserSubject = new BehaviorSubject<User>(
    //             JSON.parse(localStorage.getItem("currentUser"))
    //         );
  }

  ngOnInit(): void {
    this.username = this._accountServices.currentUserValue.user
    ? this._accountServices.currentUserValue.user.firstName + ' ' + this._accountServices.currentUserValue.user.lastName
    : '';
  }

}
