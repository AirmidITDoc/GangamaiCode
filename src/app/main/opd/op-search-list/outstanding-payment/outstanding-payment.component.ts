import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-outstanding-payment',
  templateUrl: './outstanding-payment.component.html',
  styleUrls: ['./outstanding-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OutstandingPaymentComponent implements OnInit {
  inputdata:any;
  constructor(
  // @inject(MAT_DIALOG_DATA) public data:any,
  // private ref:MatDialogRef<OutstandingPaymentComponent>

  ) { }

  ngOnInit(): void {
    // this.inputdata=this.data;
    // console.log(this.inputdata);
  }

}
