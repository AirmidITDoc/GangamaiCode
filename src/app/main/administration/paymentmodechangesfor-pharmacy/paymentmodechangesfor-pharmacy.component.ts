import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangeforpharmacyService } from './paymentmodechangeforpharmacy.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-paymentmodechangesfor-pharmacy',
  templateUrl: './paymentmodechangesfor-pharmacy.component.html',
  styleUrls: ['./paymentmodechangesfor-pharmacy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesforPharmacyComponent implements OnInit {
  displayedColumns:string[] = [
    'action',
    'Date',
    'ReceiptNo',
    'SalesNo',
    'PatientName',
    'PaidAmount',
    'CashAmt',
    'ChequeAmt',
    'CardAmt',
    'NeftPay'
    
  ];

  sIsLoading: string = '';
  isLoading = true;

  dsPaymentPharmacyList = new MatTableDataSource<PaymentPharmayList>();
 

  constructor(
    public _PaymentmodechangeforpharmacyService:PaymentmodechangeforpharmacyService,
    private _fuseSidebarService: FuseSidebarService,
  ) { }

  ngOnInit(): void {
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

}
export class PaymentPharmayList {
  Date: Number;
  ReceiptNo: number;
  SalesNo:number;
  PatientName:string;
  PaidAmount:number;
  CashAmt:number;
  ChequeAmt:number;
  CardAmt:number;
  NeftPay:any;

  constructor(PaymentPharmayList) {
    {
      this.Date = PaymentPharmayList.Date || 0;
      this.ReceiptNo = PaymentPharmayList.ReceiptNo || 0;
      this.SalesNo = PaymentPharmayList.SalesNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.PaidAmount = PaymentPharmayList.PaidAmount || 0;
      this.CashAmt = PaymentPharmayList.CashAmt || 0;
      this.ChequeAmt = PaymentPharmayList.ChequeAmt || 0;
      this.CardAmt = PaymentPharmayList.CardAmt || 0;
      this.NeftPay = PaymentPharmayList.NeftPay || 0;
       
    }
  }
}

