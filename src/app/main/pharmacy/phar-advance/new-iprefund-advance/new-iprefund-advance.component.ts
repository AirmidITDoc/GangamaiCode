import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { PharAdvanceService } from '../phar-advance.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-iprefund-advance',
  templateUrl: './new-iprefund-advance.component.html',
  styleUrls: ['./new-iprefund-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewIPRefundAdvanceComponent implements OnInit {


  dateTimeObj: any;
  sIsLoading: string = '';
  isLoading = true;

  constructor(
    public _PharAdvanceService:PharAdvanceService, 
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe, 
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewIPRefundAdvanceComponent>,
  ) { }

  ngOnInit(): void {
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose(){
    this._matDialog.closeAll();
  }
}
