import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowsePaymentListService } from '../browse-payment-list.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import { BrowseOpdPaymentReceipt } from '../browse-payment-list.component';
import { Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-print-payment',
  templateUrl: './print-payment.component.html',
  styleUrls: ['./print-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrintPaymentComponent implements OnInit {

  reportPrintObj: BrowseOpdPaymentReceipt;
  subscriptionArr: Subscription[] = [];
  
  
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOpdPaymentReceiptService:BrowsePaymentListService,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog) { }

  ngOnInit(): void {
  }

  
getPrint(el) {
  debugger
   var D_data = {
     "PaymentId": el.PaymentId,
   }
   this.subscriptionArr.push(
    this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptPrint(D_data).subscribe(res => {
      if(res){  
      this.reportPrintObj = res[0] as BrowseOpdPaymentReceipt;
      console.log(res);
     }
             
    })
  );
 }


}
