import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesforpharmacyService } from './paymentmodechangesfor-pharmacy.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';

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
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangeforpharmacyService:PaymentmodechangesforpharmacyService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe
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
       
  getIPPharAdvanceList(){
    this.sIsLoading = 'loading-data';
    var vdata={
      'F_Name':this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value || '%',
      'L_Name':this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value   || '%', 
      'FromDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate':this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No':this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || 0,
      'SalesNo':this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || 0,
      //'StoreId':this._PaymentmodechangeforpharmacyService.userFormGroup.get('StoreId').value.storeid || 0,
    }   
    console.log(vdata);
    this._PaymentmodechangeforpharmacyService.getIpPharAdvanceList(vdata).subscribe(data =>{
      this.dsPaymentPharmacyList.data= data as PaymentPharmayList [];
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsPaymentPharmacyList.data);
    } ,
    error => {
      this.sIsLoading = '';
    });
   }
   getSalesList(){
    this.sIsLoading = 'loading-data';
    var vdata={
      'F_Name':this._PaymentmodechangeforpharmacyService.userFormGroup.get('FirstName').value || '%',
      'L_Name':this._PaymentmodechangeforpharmacyService.userFormGroup.get('LastName').value   || '%', 
      'FromDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate':this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No':this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || 0,
      'SalesNo':this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || 0,
     // 'StoreId':this._PaymentmodechangeforpharmacyService.userFormGroup.get('StoreId').value.storeid || 0,
    }   
    console.log(vdata);
    this._PaymentmodechangeforpharmacyService.getSalesNoList(vdata).subscribe(data =>{
      this.dsPaymentPharmacyList.data= data as PaymentPharmayList [];
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsPaymentPharmacyList.data);
    } ,
    error => {
      this.sIsLoading = '';
    });
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
