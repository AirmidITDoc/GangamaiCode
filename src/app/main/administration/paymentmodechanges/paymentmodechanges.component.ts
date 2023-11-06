import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesService } from './paymentmodechanges.service';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-paymentmodechanges',
  templateUrl: './paymentmodechanges.component.html',
  styleUrls: ['./paymentmodechanges.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesComponent implements OnInit {
  
  displayedColumns:string[] = [
    'action',
    'PayDate',
    'ReceiptNo',
    'BillNo',
    'RegNo',
    'PatientName',
    'BillAmt',
    'PaidAmt',
    'CashAmt',
    'ChequeAmt',
    'CardAmt',
    'User'
  ];
 
  sIsLoading: string = '';
  isLoading = true;

 dsPaymentChanges = new MatTableDataSource<PaymentChange>();
 
 @ViewChild(MatSort) sort: MatSort;
 @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangesService:PaymentmodechangesService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,

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
 getOPReceiptList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || 0,
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || 0
  }
  console.log(vdata);
  this._PaymentmodechangesService.getOpReceiptList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }

 getIPReceiptList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || 0,
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || 0
  }
  console.log(vdata);
  this._PaymentmodechangesService.getIpReceiptList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }

 getIPAdvanceList(){
  this.sIsLoading = 'loading-data';
  var vdata={
    'F_Name':this._PaymentmodechangesService.UseFormGroup.get('FirstName').value || '%',
    'L_Name':this._PaymentmodechangesService.UseFormGroup.get('LastName').value   || '%', 
    'From_Dt': this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'To_Dt':this.datePipe.transform(this._PaymentmodechangesService.UseFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    'Reg_No':this._PaymentmodechangesService.UseFormGroup.get('RegNo').value || 0,
    'PBillNo':this._PaymentmodechangesService.UseFormGroup.get('BillNo').value  || 0,
    'ReceiptNo':this._PaymentmodechangesService.UseFormGroup.get('ReceiptNo').value || 0
  }
  console.log(vdata);
  this._PaymentmodechangesService.getIpAdvanceList(vdata).subscribe(data =>{
    this.dsPaymentChanges.data= data as PaymentChange [];
    this.dsPaymentChanges.sort = this.sort;
    this.dsPaymentChanges.paginator = this.paginator;
    this.sIsLoading = '';
    console.log(this.dsPaymentChanges.data);
  } ,
  error => {
    this.sIsLoading = '';
  });
 }
 
 
         


}
export class PaymentChange{
  PayDate:any;
  BillNo:any ;
  RegNo:number;
  PatientName:string;
  BillAmt:any;
  PaidAmt:any ;
  CashAmt:number;
  ChequeAmt:any ;
  CardAmt:number;
  User:any;

 constructor(PaymentChange){
  {
    this.PayDate = PaymentChange.PayDate || 0;
      this.BillNo = PaymentChange.BillNo || 0;
      this.RegNo = PaymentChange.RegNo || 0;
      this.PatientName = PaymentChange.PatientName || "";
      this.BillAmt = PaymentChange.BillAmt || 0;
      this.PaidAmt = PaymentChange.PaidAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.User = PaymentChange.User || '';
  }
 }

}
