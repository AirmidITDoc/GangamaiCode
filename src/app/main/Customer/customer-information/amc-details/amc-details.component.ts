import { Component, ElementRef, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CustomerInformationService } from '../customer-information.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
  selector: 'app-amc-details',
  templateUrl: './amc-details.component.html',
  styleUrls: ['./amc-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AMCDetailsComponent implements OnInit {

  constructor(
    public _CustomerInfo: CustomerInformationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private elementRef: ElementRef,
    public dialogRef: MatDialogRef<AMCDetailsComponent>,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {


  }



  onClose(){
    this._matDialog.closeAll();
  }
}
