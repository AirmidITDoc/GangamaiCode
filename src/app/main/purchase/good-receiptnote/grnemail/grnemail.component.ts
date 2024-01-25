import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-grnemail',
  templateUrl: './grnemail.component.html',
  styleUrls: ['./grnemail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GrnemailComponent implements OnInit {

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<GrnemailComponent>,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
  }

  OnSend(){

  }
  OnReset(){
    this._GRNList.GRNEmailFrom.reset();
  }
  onClose(){
    this.dialogRef.close();
  }
}
