import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { EmergencyService } from '../emergency.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-emergency-history',
  templateUrl: './emergency-history.component.html',
  styleUrls: ['./emergency-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmergencyHistoryComponent {
  screenFromString = 'Common-form';
  dateTimeObj: any;

  constructor(
      public _EmergencyService: EmergencyService,
      private _loggedService: AuthenticationService,
      public datePipe: DatePipe,
      public _matDialog: MatDialog,
      public toastr: ToastrService,
    ) { }
  
    ngOnInit(): void {
    }
    
    getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}
