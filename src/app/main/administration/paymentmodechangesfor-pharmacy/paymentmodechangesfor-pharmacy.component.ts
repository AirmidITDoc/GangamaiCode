import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { PaymentmodechangesforpharmacyService } from './paymentmodechangesfor-pharmacy.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { EditPaymentmodeComponent } from './edit-paymentmode/edit-paymentmode.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { MatDialog } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { BillDateUpdateComponent } from '../cancellation/bill-date-update/bill-date-update.component';

@Component({
  selector: 'app-paymentmodechangesfor-pharmacy',
  templateUrl: './paymentmodechangesfor-pharmacy.component.html',
  styleUrls: ['./paymentmodechangesfor-pharmacy.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PaymentmodechangesforPharmacyComponent implements OnInit {
  displayedColumns:string[] = [
    'Type',
    'Date',
    'ReceiptNo',
    'SalesNo',
    'PatientName',
    'PaidAmount',
    'CashAmt',
    'ChequeAmt',
    'CardAmt',
    'NeftPay',
     'PayAtm',
     'action',
  ];

  sIsLoading: string = '';
  isLoading = true;
  dateTimeObj: any;


  dsPaymentPharmacyList = new MatTableDataSource<PaymentPharmayList>();
 
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _PaymentmodechangeforpharmacyService:PaymentmodechangesforpharmacyService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getSalesList();
  }


  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }  
  getSearchList(){
    if(this._PaymentmodechangeforpharmacyService.userFormGroup.get('Radio').value == '1'){
      this.getSalesList();
    }else{
      this.getIPPharAdvanceList();
    } 
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
    }   
    this._PaymentmodechangeforpharmacyService.getIpPharAdvanceList(vdata).subscribe(data =>{
      this.dsPaymentPharmacyList.data= data as PaymentPharmayList [];
      console.log( this.dsPaymentPharmacyList.data)
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;
     
      this.sIsLoading = '';
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
      'FromDate':this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('startdate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'ToDate': this.datePipe.transform(this._PaymentmodechangeforpharmacyService.userFormGroup.get('enddate').value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      'Reg_No':this._PaymentmodechangeforpharmacyService.userFormGroup.get('RegNo').value || 0,
      'SalesNo':this._PaymentmodechangeforpharmacyService.userFormGroup.get('SalesNo').value || 0,
     // 'StoreId':this._PaymentmodechangeforpharmacyService.userFormGroup.get('StoreId').value.storeid || 0,
    }   
    this._PaymentmodechangeforpharmacyService.getSalesNoList(vdata).subscribe(data =>{
      this.dsPaymentPharmacyList.data= data as PaymentPharmayList [];
      this.dsPaymentPharmacyList.sort = this.sort;
      this.dsPaymentPharmacyList.paginator = this.paginator;
      console.log(this.dsPaymentPharmacyList.data)
      this.sIsLoading = '';
    } ,
    error => {
      this.sIsLoading = '';
    });
   }
  onEdit(m) {
    console.log(m)
    let xx = {
      UserId: m.UserId,
      FirstName: m.FirstName,
      LastName: m.LastName,
      UserLoginName: m.UserLoginName,
      IsActive: m.IsActive,
      AddedBy: m.AddedBy,
      RoleName: m.RoleName,
      RoleId: m.RoleId,
      UserName: m.UserName,
      StoreId: m.StoreId,
      StoreName: m.StoreName,
      IsDoctorType: m.IsDoctorType,
      DoctorID: m.DoctorID,
      DoctorName: m.DoctorName,
      IsPOVerify: m.IsPOVerify,
      IsGRNVerify: m.IsGRNVerify,
      IsCollection: m.IsCollection,
      IsBedStatus: m.IsBedStatus,
      IsCurrentStk: m.IsCurrentStk,
      IsPatientInfo: m.IsPatientInfo,
      IsDateInterval: m.IsDateInterval,
      IsDateIntervalDays: m.IsDateIntervalDays,
      MailId: m.MailId,
      MailDomain: m.MailDomain,
      AddChargeIsDelete: m.AddChargeIsDelete,
      IsIndentVerify: m.IsIndentVerify,
      IsInchIndVfy: m.IsInchIndVfy,
    };
    this.advanceDataStored.storage = new PaymentPharmayList(xx);
    const dialogRef = this._matDialog.open(EditPaymentmodeComponent,
      { 
        height: "85%",
        width: '75%',
        data: {
          registerObj: m,
           FromName: "Pharma-PaymentModeChange"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getSalesList();
    });
  }
  BillDate(contact){ 
    const dialogRef = this._matDialog.open(BillDateUpdateComponent,
      {
        height: "35%",
        width: '35%',
        data: {
          obj: contact,
          FormName:'Pharmacy-Bill'
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.getSalesList(); 
      this.getIPPharAdvanceList();
    });
  }   
}
export class PaymentPharmayList {
  Date: Number;
  ReceiptNo: number;
  SalesNo:number;
  PatientName:string;
  PaidAmount:number;
  CashPayAmount:number;
  ChequePayAmount:number;
  ChequeNo :any;
  ChequeBankName :any;
  CardPayAmount:number;
  CardNo :any;
  CardBankName :any;
  NEFTPayAmount:any;
  NEFTNo :any;
  NEFTBankName :any;
  PayTMAmount :any;
  PayTMTranNo:any;
  PaymentId :any;
  TarrifName:any;
  NetAmount:any;

  CashAmt:any;
  ChequeAmt:any;
  CardAmt:any;
  NeftPay:any;
  // PaidAmount:any;

  constructor(PaymentPharmayList) {
    {
      this.Date = PaymentPharmayList.Date || 0;
      this.ReceiptNo = PaymentPharmayList.ReceiptNo || 0;
      this.SalesNo = PaymentPharmayList.SalesNo || 0;
      this.PatientName = PaymentPharmayList.PatientName || "";
      this.PaidAmount = PaymentPharmayList.PaidAmount || 0;
      this.CashPayAmount = PaymentPharmayList.CashPayAmount || 0;
      this.ChequePayAmount = PaymentPharmayList.ChequePayAmount || 0;
      this.ChequeNo  = PaymentPharmayList.ChequeNo  || 0;
      this.ChequeBankName  = PaymentPharmayList.ChequeBankName  || 0;
      this.CardPayAmount = PaymentPharmayList.CardPayAmount || 0;
      this.CardBankName =PaymentPharmayList.CardBankName  || '';
      this.CardNo =PaymentPharmayList.CardNo  || 0;
      this.NEFTPayAmount = PaymentPharmayList.NEFTPayAmount || 0;
      this.NEFTNo  = PaymentPharmayList.NEFTNo  || 0;
      this.NEFTBankName  = PaymentPharmayList.NEFTBankName  || '';


      this.PaymentId = PaymentPharmayList.PaymentId || 0;
      this.PayTMAmount  = PaymentPharmayList.PayTMAmount  || 0;
      this.PayTMTranNo  = PaymentPharmayList.PayTMTranNo  || 0;
      this.TarrifName = PaymentPharmayList.TarrifName || 0;
      this.NetAmount = PaymentPharmayList.NetAmount || 0;
      this.CashAmt = PaymentPharmayList.CashAmt || 0;
      this.ChequeAmt  = PaymentPharmayList.ChequeAmt  || 0;
      this.CardAmt = PaymentPharmayList.CardAmt || 0;
      this.NeftPay = PaymentPharmayList.NeftPay || 0;
      // this.PaidAmount = PaymentPharmayList.PaidAmount || 0;
    }
  }
}

