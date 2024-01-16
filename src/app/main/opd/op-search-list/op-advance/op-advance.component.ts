import { Component, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetail, AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { OPSearhlistService } from '../op-searhlist.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OPAdvancePaymentComponent } from '../op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';


@Component({
  selector: 'app-op-advance',
  templateUrl: './op-advance.component.html',
  styleUrls: ['./op-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPAdvanceComponent implements OnInit {

  msg: any;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  currentDate = new Date();

  displayedColumns = [
    'Date',
    'AdvanceNo',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount',
    'CashPay',
    'ChequePay',
    'CardPay',
    'NeftPay',
    'PayTMPay',
    'UserName'

  ];
  dataSource = new MatTableDataSource<AdvanceDetail>();
  menuActions: Array<string> = [];
  advanceAmount: any;
  isLoadingStr: string = '';
  AdvFormGroup: FormGroup;
  isLoading: string = '';
  // screenNameString = 'advance';
  screenFromString = 'advance';
  dateTimeObj: any;
  selectedAdvanceObj: AdvanceDetailObj;
  
  constructor(public _opappointmentService: OPSearhlistService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private advanceDataStored: AdvanceDataStored,
    public datePipe: DatePipe,
    private dialogRef: MatDialogRef<OPAdvanceComponent>,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,) {
      dialogRef.disableClose = true;
     }

  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }
    console.log(this.selectedAdvanceObj);
    this.AdvFormGroup = this.formBuilder.group({
      advanceAmt: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      comment: ['']
    });
    let AdmissionId = this._opappointmentService.myShowAdvanceForm.get("AdmissionID").value
    this._opappointmentService.getAdvanceList(AdmissionId);
  }

  getAdvanceList() {
    var m_data = {
      "AdmissionID": this._opappointmentService.myShowAdvanceForm.get("AdmissionID").value || 0,
    }
    this.isLoadingStr = 'loading';
    this._opappointmentService.getAdvanceList(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as AdvanceDetails[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    });
  }

  getDateTime(dateTimeObj) {
    
    this.dateTimeObj = dateTimeObj;
  }

  onSave() {
    
    this.isLoading = 'submit';
    let advanceHeaderObj = {};
    advanceHeaderObj['AdvanceId'] = 0;
    advanceHeaderObj['Date'] = this.dateTimeObj.date;
    advanceHeaderObj['RefId'] = 0;
    advanceHeaderObj['OPD_IPD_Type'] = 0;
    advanceHeaderObj['OPD_IPD_Id'] = this._opappointmentService.myShowAdvanceForm.get("AdmissionID").value;
    advanceHeaderObj['AdvanceAmount'] = parseInt(this.advanceAmount);
    advanceHeaderObj['AdvanceUsedAmount'] = 0;
    advanceHeaderObj['BalanceAmount'] = parseInt(this.advanceAmount);
    advanceHeaderObj['AddedBy'] = 0;
    advanceHeaderObj['IsCancelled'] = false;
    advanceHeaderObj['IsCancelledBy'] = 0;
    advanceHeaderObj['IsCancelledDate'] = '01/01/1900';

    
    let AdvanceDetObj = {};
    AdvanceDetObj['AdvanceDetailID'] ='0';
    AdvanceDetObj['Date'] = this.dateTimeObj.date;
    AdvanceDetObj['Time'] = this.dateTimeObj.time;
    AdvanceDetObj['AdvanceId'] = 0;
    AdvanceDetObj['RefId'] = 0;
    AdvanceDetObj['OPD_IPD_Type'] = 1;
    AdvanceDetObj['OPD_IPD_Id'] = this._opappointmentService.myShowAdvanceForm.get("AdmissionID").value;
    AdvanceDetObj['AdvanceAmount'] =parseInt(this.advanceAmount);
    AdvanceDetObj['AdvanceUsedAmount'] = 0;
    AdvanceDetObj['BalanceAmount'] =parseInt(this.advanceAmount);
    AdvanceDetObj['RefundAmount'] = 0;
    AdvanceDetObj['ReasonOfAdvanceId'] = 0;
    AdvanceDetObj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
    AdvanceDetObj['IsCancelled'] = false;
    AdvanceDetObj['IsCancelledBy'] = 0;
    AdvanceDetObj['IsCancelledDate'] = '01/01/1900';


    let PatientHeaderObj = {};

    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['OPD_IPD_Id'] = this._opappointmentService.myShowAdvanceForm.get("AdmissionID").value;
    PatientHeaderObj['NetPayAmount'] =  this.advanceAmount;;

    const advanceHeaderInsert = new AdvanceHeader(advanceHeaderObj);
    const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

    const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
      {
        maxWidth: "75vw",
        maxHeight: "100vh", //width: '100%', height: "100%",
        data: {
          patientName: this._opappointmentService.myShowAdvanceForm.get("PatientName").value,
          advanceObj: PatientHeaderObj,
          FromName: "Advance"
        }
      });
    dialogRef.afterClosed().subscribe(result => {
          console.log('============================== OP Advance ===========');
          let submitData = {
            "opAdvanceHeaderInsert": advanceHeaderInsert,
            "opAdvanceDetailInsert": advanceDetailInsert,
            "opPaymentInsert": result.submitDataPay.ipPaymentInsert
          };
          
          console.log(submitData);
          this._opappointmentService.OPInsertAdvanceHeader(submitData).subscribe(response => {
              if (response) {
              Swal.fire('Congratulations !', 'OP Advance data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  this.getAdvanceList();
                  this._matDialog.closeAll();
                }
              });
            } else {
              Swal.fire('Error !', 'OP Advance data not saved', 'error');
            }
            this.isLoading = '';
          });
          
    });

    this.AdvFormGroup.get('advanceAmt').reset(0);
    this.AdvFormGroup.get('comment').reset('');
  }



  

  onClose() {
    this.dialogRef.close();
  }
  

}

export class AdvanceHeader {
  AdvanceId: number;
  AdvanceAmount: number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;

  constructor(AdvanceHeaderObj) {
    this.AdvanceId = AdvanceHeaderObj.AdvanceId || 0;
    this.Date = AdvanceHeaderObj.Date || '';
    this.RefId = AdvanceHeaderObj.RefId || 0;
    this.OPD_IPD_Type = AdvanceHeaderObj.OPD_IPD_Type || 0;
    this.OPD_IPD_Id = AdvanceHeaderObj.OPD_IPD_Id || 0;
    this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || 0;
    this.AdvanceUsedAmount = AdvanceHeaderObj.AdvanceUsedAmount || 0;
    this.BalanceAmount = AdvanceHeaderObj.BalanceAmount || 0;
    this.AddedBy = AdvanceHeaderObj.AddedBy || 0;
    this.IsCancelled = AdvanceHeaderObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceHeaderObj.IsCancelledBy || 0;
    this.IsCancelledDate = AdvanceHeaderObj.IsCancelledDate || '';
  }

}

export class AdvanceDetails {
  AdvanceDetailID: number;
  Date: any;
  Time: any;
  AdvanceId: number;
  RefId: number;
  TransactionID: number;
  OPD_IPD_Type: number;
  OPD_IPD_Id: number;
  AdvanceAmount: number;
  UsedAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  ReasonOfAdvanceId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  Reason: any;

  constructor(AdvanceDetailsObj) {
    this.AdvanceDetailID = AdvanceDetailsObj.AdvanceDetailID || 0;
    this.Date = AdvanceDetailsObj.Date;
    this.Time = AdvanceDetailsObj.Time;
    this.AdvanceId= AdvanceDetailsObj.AdvanceId || 0;
    this.RefId= AdvanceDetailsObj.RefId || 0;
    this.TransactionID = AdvanceDetailsObj.TransactionID || 0
    this.OPD_IPD_Type = AdvanceDetailsObj.OPD_IPD_Type || 0
    this.OPD_IPD_Id = AdvanceDetailsObj.OPD_IPD_Id || 0
    this.AdvanceAmount = AdvanceDetailsObj.AdvanceAmount || 0
    this.UsedAmount = AdvanceDetailsObj.UsedAmount || 0
    this.RefundAmount = AdvanceDetailsObj.RefundAmount || 0
    this.ReasonOfAdvanceId = AdvanceDetailsObj.ReasonOfAdvanceId || 0
    this.Reason = AdvanceDetailsObj.Reason || '';
    this.AddedBy = AdvanceDetailsObj.AddedBy || 0;
    this.IsCancelled = AdvanceDetailsObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceDetailsObj.IsCancelledBy || 0;
    this.IsCancelledDate = AdvanceDetailsObj.IsCancelledDate || '01/01/1900';

  }

}



export class ChargesList{
    ChargesId: number;
    ServiceId: number;
    ServiceName : String;
    Price:number;
    Qty: number;
    TotalAmt: number;
    DiscPer: number;
    DiscAmt: number;
    NetAmount: number;
    ChargeDoctorName: String;
    ChargesDate: Date;
    IsPathology:boolean;
    IsRadiology:boolean;
    ClassName: string;
    ChargesAddedName: string;

    constructor(ChargesList){
            this.ChargesId = ChargesList.ChargesId || '';
            this.ServiceId = ChargesList.ServiceId || '';
            this.ServiceName = ChargesList.ServiceName || '';
            this.Price = ChargesList.Price || '';
            this.Qty = ChargesList.Qty || '';
            this.TotalAmt = ChargesList.TotalAmt || '';
            this.DiscPer = ChargesList.DiscPer || '';
            this.DiscAmt = ChargesList.DiscAmt || '';
            this.NetAmount = ChargesList.NetAmount || '';
            this.ChargeDoctorName = ChargesList.ChargeDoctorName || '';
            this.ChargesDate = ChargesList.ChargesDate || '';
            this.IsPathology = ChargesList.IsPathology || '';
            this.IsRadiology = ChargesList.IsRadiology || '';
            this.ClassName = ChargesList.ClassName || '';
            this.ChargesAddedName = ChargesList.ChargesAddedName || '';
    }
} 

export class Payment
{
    PaymentId : Number;
    BillNo : number;
	ReceiptNo : string;
	PaymentDate	: Date;
	PaymentTime : Date; 
	CashPayAmount :	number;
	ChequePayAmount : number;
	ChequeNo : string;
	BankName : string;
	ChequeDate : Date;
	CardPayAmount :	number;
	CardNo : string;
	CardBankName : string;
	CardDate : Date;
	AdvanceUsedAmount :	number;
	AdvanceId :	number;
	RefundId :	number;
	TransactionType :	number;
	Remark : string;
	AddBy:	number;
	IsCancelled	: boolean;
	IsCancelledBy : number;
	IsCancelledDate	: Date;
	CashCounterId :	number;
	IsSelfORCompany	: number;
	CompanyId : number;
	NEFTPayAmount :	number;
	NEFTNo : string;
	NEFTBankMaster : string;
	NEFTDate	:Date;
	PayTMAmount	: number;
    PayTMTranNo : string;
	PayTMDate : Date;

     /**
     * Constructor
     *
     * @param Payment
     */
      constructor(Payment) {
        {
           this.PaymentId = Payment.PaymentId || 0;       
           this.BillNo = Payment.BillNo || 0;       
           this.ReceiptNo = Payment.ReceiptNo || '';       
           this.PaymentDate = Payment.PaymentDate || '';       
           this.PaymentTime = Payment.PaymentTime || '';       
           this.CashPayAmount = Payment.CashPayAmount || 0;       
           this.ChequePayAmount = Payment.ChequePayAmount || 0;       
           this.ChequeNo = Payment.ChequeNo || '';       
           this.BankName = Payment.BankName || '';       
           this.ChequeDate = Payment.ChequeDate || '';       
           this.CardPayAmount = Payment.CardPayAmount || 0;       
           this.CardNo = Payment.CardNo || '';       
           this.CardBankName = Payment.CardBankName || '';       
           this.CardDate = Payment.CardDate || '';       
           this.AdvanceUsedAmount = Payment.AdvanceUsedAmount || 0;       
           this.AdvanceId = Payment.AdvanceId || 0;       
           this.RefundId = Payment.RefundId || 0;       
           this.TransactionType = Payment.TransactionType || 0;       
           this.Remark = Payment.Remark || '';       
           this.AddBy = Payment.AddBy || 0;       
           this.IsCancelled = Payment.IsCancelled || '';       
           this.IsCancelledBy = Payment.IsCancelledBy || 0;       
           this.IsCancelledDate = Payment.IsCancelledDate || '';       
           this.CashCounterId = Payment.CashCounterId || '';       
           this.IsSelfORCompany = Payment.IsSelfORCompany || '';       
           this.CompanyId = Payment.CompanyId || 0;       
           this.NEFTPayAmount = Payment.NEFTPayAmount || 0;       
           this.NEFTNo = Payment.NEFTNo || '';       
           this.NEFTBankMaster = Payment.NEFTBankMaster || '';       
           this.NEFTDate = Payment.NEFTDate || '';       
           this.PayTMAmount = Payment.PayTMAmount || 0;       
           this.PayTMTranNo = Payment.PaymentId || 0;       
           this.PayTMDate = Payment.PayTMDate || '';       
          
           
        }
    }
    
}