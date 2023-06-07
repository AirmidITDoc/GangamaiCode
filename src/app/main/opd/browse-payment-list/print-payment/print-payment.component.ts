import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { BrowsePaymentListService } from '../browse-payment-list.service';
import { DatePipe } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
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
  name = 'Angular';
  NEFTPayAmount=0;
  cardNo=0;
  PayTMAmount=0;
  CashPayAmount=0;
  CardPayAmount=0;
  ChequePayAmount=0;
  registerObj = new BrowseOpdPaymentReceipt({});
  PaymentId:any;
  BillNo:any;
  RegNo:any;
  RegId:any;
  PatientName:any;
  FirstName:any;
  MiddleName:any;
  LastName:any;
  TotalAmt:any;
  BalanceAmt:any;
  Remark:any;
  PaymentDate:any;
  AdvanceUsedAmount:any;
  AdvanceId:any;
  RefundId:any;
  IsCancelledv
  AddBy:any;
  UserName:any;
  PBillNo:any;
  ReceiptNo:any;
  TransactionType:any;
  PayDate:any;
  PaidAmount:any;

  Today= this.datePipe.transform(new Date(), 'dd/MM/yyyy h:mm a'); 
  
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _BrowseOpdPaymentReceiptService:BrowsePaymentListService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog) { }

  ngOnInit(): void {
debugger;
    // if(this.data){
      
    //   console.log( this.data);
    //   this.registerObj=this.data.registerObj;
    //     // // this.AgeYear = this.data.PatObj.AgeYear;
    //     // this.RegId=this.data.registerObj.RegId;
    //     // this.PatientName=this.data.PatObj.PatientName;
    //     // this.AdmissionDate=this.data.PatObj.AdmissionDate;
    //     // this.RelativeName= this.data.PatObj.RelativeName;
    //     // this.RelativeAddress= this.data.PatObj.RelativeAddress;
    //     // this.PaidAmount= this.data.PatObj.PaidAmount;
        
    // }

    this.getPrint(this.data.registerObj.PaymentId);
  }

  
getPrint(el) {
  debugger
   var D_data = {
     "PaymentId": el,
   }
   this.subscriptionArr.push(
    this._BrowseOpdPaymentReceiptService.getBrowseOpdPaymentReceiptPrint(D_data).subscribe(res => {
      if(res){  
      this.registerObj = res[0] as BrowseOpdPaymentReceipt;
      console.log(res);
     }
             
    })
  );

  // this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(objPrintWordInfo.PaidAmount));


 }


 convertToWord(e){
  // this.numberInWords= converter.toWords(this.mynumber);
  //  return converter.toWords(e);
     }

}
