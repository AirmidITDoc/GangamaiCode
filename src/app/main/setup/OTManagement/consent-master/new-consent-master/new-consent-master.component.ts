import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ConsentMasterService } from '../consent-master.service';

@Component({
  selector: 'app-new-consent-master',
  templateUrl: './new-consent-master.component.html',
  styleUrls: ['./new-consent-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentMasterComponent implements OnInit {

  constructor(
    public _otConsentService: ConsentMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onClose(){
    this._otConsentService.myform.reset();
    this.dialogRef.close();
  }

}
export class OtConsentMasterList {
  OtConsentId:number;
  OtConsentName:string;
  IsActive:string;
  
  /**
   * Constructor
   *
   * @param contact
   */
  constructor(OtSiteDescMasterList) {
    {
      this.OtConsentId = OtSiteDescMasterList.OtConsentId || '';
      this.OtConsentName = OtSiteDescMasterList.OtConsentName || '';
      this.IsActive=OtSiteDescMasterList.IsActive || '';
    }
  }
}