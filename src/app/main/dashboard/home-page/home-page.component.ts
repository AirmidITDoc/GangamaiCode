import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class HomePageComponent {
  username: any;

  constructor(
    public _accountServices: AuthenticationService,
  ) {
  }

  ngOnInit(): void {
    this.username = this._accountServices.currentUserValue.userName
      ? this._accountServices.currentUserValue.userName
      : '';
  }

}
