import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { EmergencyService } from '../emergency.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder } from '@angular/forms';

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
emgHistoryList: any[] = [];
  selectedEmg: any = null;

  constructor(
      public _EmergencyService: EmergencyService,
      private _loggedService: AuthenticationService,
      public datePipe: DatePipe,
      public _matDialog: MatDialog,
      public toastr: ToastrService,
      @Inject(MAT_DIALOG_DATA) public data: any
    ) { }
  
    ngOnInit(): void {
    this._EmergencyService.getEmergencyById(this.data.emgId).subscribe((res) => {
      this.emgHistoryList = res;
    });
    }

    getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}
