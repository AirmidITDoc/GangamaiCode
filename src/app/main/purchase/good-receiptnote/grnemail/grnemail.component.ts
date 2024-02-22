import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { GoodReceiptnoteService } from '../good-receiptnote.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
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
  registerObj:any;
  vToMailId:any;
  vSubject:any;
  vBody:any;

  constructor(
    public _GRNList: GoodReceiptnoteService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<GrnemailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj ;
      //console.log(this.registerObj);
      this.vToMailId = this.registerObj.Email;
      this.vSubject = "we rise purchase order ";
      this.vSubject =this.registerObj.SupplierName;
      this.vBody = " we rise purchase order "
     
    }
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
