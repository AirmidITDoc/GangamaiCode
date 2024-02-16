import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { PurchaseOrderService } from '../purchase-order.service';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class EmailComponent implements OnInit {

 registerObj:any;
 vToMailId:any;
 vSubject:any;
 vBody:any;

  constructor(
    public _matDialog: MatDialog,
    public _PurchaseOrder: PurchaseOrderService,
    public datePipe: DatePipe,
    public dialogRef: MatDialogRef<EmailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr : ToastrService,
    private accountService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
    this.registerObj = this.data.Obj ;
    //console.log(this.registerObj);
    this.vToMailId = this.registerObj.Email;
    this.vSubject = "we rise purchase order ";
    this.vBody = " we rise purchase order "
    }
  }
  
  OnSend(){

  }
  OnReset(){
    this._PurchaseOrder.POEmailFrom.reset();
  }
  onClose(){
    this.dialogRef.close();
  }
}
