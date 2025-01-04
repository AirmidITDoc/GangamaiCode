import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { OttypeMasterService } from '../ottype-master.service';

@Component({
  selector: 'app-new-ottype-master',
  templateUrl: './new-ottype-master.component.html',
  styleUrls: ['./new-ottype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewOttypeMasterComponent implements OnInit {

  constructor(
    public _otTypeMasterService: OttypeMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewOttypeMasterComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
  }

  onClose(){
    this._otTypeMasterService.myform.reset();
    this.dialogRef.close();
  }

}
