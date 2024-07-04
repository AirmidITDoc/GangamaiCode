import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChargesList } from 'app/main/opd/op-search-list/opd-search-list/opd-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from '../../advance';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { IPAdvancePaymentComponent } from '../ip-advance-payment/ip-advance-payment.component';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceDetail, AdvanceDetailObj } from '../ip-search-list.component';
import { Router } from '@angular/router';
import * as converter from 'number-to-words';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { IpdAdvanceBrowseModel } from '../../browse-ipadvance/browse-ipadvance.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { debug } from 'console';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-ip-advance',
  templateUrl: './ip-advance.component.html',
  styleUrls: ['./ip-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPAdvanceComponent implements OnInit {

  msg: any;
  sIsLoading: string = '';
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  currentDate = new Date();
  reportPrintObjList: IpdAdvanceBrowseModel[] = [];
  reportPrintsummaryObjList: IpdAdvanceBrowseModel[] = [];
  Filepath:any;


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
    'UserName',
    'buttons'

  ];
  dataSource = new MatTableDataSource<AdvanceDetail>();
  menuActions: Array<string> = [];
  advanceAmount: any;
  isLoadingStr: string = '';
  AdvFormGroup: FormGroup;
  isLoading: string = '';
  selectedAdvanceObj: AdmissionPersonlModel;
  screenFromString = 'advance';
  dateTimeObj: any;
  TotalAdvamt: any;
  Advavilableamt: any;
  vAdvanceId: any;
  reportPrintObj: IpdAdvanceBrowseModel;
  reportPrintsummaryObj: IpdAdvanceBrowseModel;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  CashCounterList: any = [];
  PatientHeaderObj: any;
  vMobileNo:any;


  constructor(public _IpSearchListService: IPSearchListService,
    public _opappointmentService: OPSearhlistService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public _WhatsAppEmailService:WhatsAppEmailService,
    private dialogRef: MatDialogRef<IPAdvanceComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.AdvFormGroup = this.formBuilder.group({
      advanceAmt: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      comment: [''],
      CashCounterId: [0],
      cashpay: ['1'],
    });

    if (this.advanceDataStored.storage) {
     debugger
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      this.vMobileNo= this.selectedAdvanceObj.MobileNo
      console.log( this.selectedAdvanceObj)
    }

    let AdmissionId = this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value
    this.getAdvanceList();
    this.getCashCounterComboList();
  }
getAdvanceDetaId(){
  let Query ;
  Query = "select * from AdvanceDetail where RefId=" + this.selectedAdvanceObj.RegID 
  console.log(Query)
 // this.AdvanceDetailList = 
}
  getAdvanceList() {
    this.isLoadingStr = 'loading';
    var m_data = {
      "AdmissionID": this.selectedAdvanceObj.AdmissionID
    }
    setTimeout(() => {
      this.isLoadingStr = 'loading';
      this._IpSearchListService.getAdvanceList(m_data).subscribe(Visit => {
        this.dataSource.data = Visit as AdvanceDetail[];
        if (this.dataSource.data.length > 0) {
          this.vAdvanceId = this.dataSource.data[0]['AdvanceId'];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        }
        else {
          this.vAdvanceId = 0;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        }
      },
        error => {
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        });
    }, 500);

  }

  getCashCounterComboList() {
    this._opappointmentService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
    });
  }

  getAdvancetotal(element) {

    let netAmt;
    netAmt = element.reduce((sum, { AdvanceAmount }) => sum += +(AdvanceAmount || 0), 0);
    this.TotalAdvamt = netAmt;
    return netAmt;
  }

  getAdvBalance(element) {
    let netAmt;
    netAmt = element.reduce((sum, { BalanceAmount }) => sum += +(BalanceAmount || 0), 0);
    // this.Advavilableamt = netAmt;
    return netAmt;
  }

  getAdvanceusedtotal(element) {
    let netAmt;
    netAmt = element.reduce((sum, { UsedAmount }) => sum += +(UsedAmount || 0), 0);
    // this.Advavilableamt = netAmt;
    return netAmt;
  }

  getAdvancerefund(element) {
    let netAmt;
    netAmt = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    // this.Advavilableamt = netAmt;
    return netAmt;
  }




  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  onSave() {

    debugger
    if (this.vAdvanceId == 0) {
      this.isLoading = 'submit';

      let advanceHeaderObj = {};
      advanceHeaderObj['AdvanceId'] = 0;
      advanceHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      advanceHeaderObj['RefId'] = this.selectedAdvanceObj.RegID,
        advanceHeaderObj['OPD_IPD_Type'] = 1;
      advanceHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      advanceHeaderObj['AdvanceAmount'] = this.advanceAmount;
      advanceHeaderObj['AdvanceUsedAmount'] = 0;
      advanceHeaderObj['BalanceAmount'] = this.advanceAmount;
      advanceHeaderObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      advanceHeaderObj['IsCancelled'] = false;
      advanceHeaderObj['IsCancelledBy'] = '0';
      advanceHeaderObj['IsCancelledDate'] = '01/01/1900';

      let AdvanceDetObj = {};
      AdvanceDetObj['AdvanceDetailID'] = '0';
      AdvanceDetObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      AdvanceDetObj['Time'] = this.datePipe.transform(this.currentDate, 'hh:mm:ss') || '01/01/1900'
      AdvanceDetObj['AdvanceId'] = 0;
      AdvanceDetObj['RefId'] = this.selectedAdvanceObj.RegID,
        AdvanceDetObj['transactionID'] = 2;
      AdvanceDetObj['OPD_IPD_Type'] = 1;
      AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      AdvanceDetObj['usedAmount'] = 0;
      AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      AdvanceDetObj['RefundAmount'] = 0;
      AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      AdvanceDetObj['IsCancelled'] = false;
      AdvanceDetObj['IsCancelledBy'] = 0;
      AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
      // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;
      debugger
      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['NetPayAmount'] = this.advanceAmount;
      PatientHeaderObj['BillId'] = 0;

      // const advanceHeaderInsert = new AdvanceHeader(advanceHeaderObj);
      // const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);

      // console.log(this.AdvFormGroup.get('cashpay').value)
      // if (this.AdvFormGroup.get('cashpay').value != 1) {
        const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
          {
            maxWidth: "90vw",
            height: '640px',
            width: '100%',

            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "Advance",
              advanceObj: PatientHeaderObj,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');
          let submitData = {
            "advanceHeaderInsert": advanceHeaderObj,
            "advanceDetailInsert": AdvanceDetObj,
            "ipPaymentInsert": result.submitDataPay.ipPaymentInsert
          };
          console.log(submitData);
          this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {

            if (response) {
              Swal.fire('Congratulations !', 'IP Advance data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  this.viewgetAdvanceReceiptReportPdf(response,true);
                  this.getWhatsappsAdvance(response,this.vMobileNo);
                  this._matDialog.closeAll();
                }
              });
            } else {
              Swal.fire('Error !', 'IP Advance data not saved', 'error');
            }
            this.isLoading = '';
          });

        });
      // }
      // else if (this.AdvFormGroup.get('cashpay').value == 1) {

      //   let Paymentobj = {};
      //   Paymentobj['BillNo'] = 0;
      //   Paymentobj['ReceiptNo'] = "";
      //   Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
      //     Paymentobj['CashPayAmount'] = this.advanceAmount || 0;
      //   Paymentobj['ChequePayAmount'] = 0;
      //   Paymentobj['ChequeNo'] = 0;
      //   Paymentobj['BankName'] = "";
      //   Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['CardPayAmount'] = 0;
      //   Paymentobj['CardNo'] = 0;
      //   Paymentobj['CardBankName'] = "";
      //   Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['AdvanceUsedAmount'] = 0;
      //   Paymentobj['AdvanceId'] = 0;
      //   Paymentobj['RefundId'] = 0;
      //   Paymentobj['TransactionType'] = 0;
      //   Paymentobj['Remark'] = "Cashpayment";
      //   Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
      //     Paymentobj['IsCancelled'] = 0;
      //   Paymentobj['IsCancelledBy'] = 0;
      //   Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['CashCounterId'] = 0;
      //   Paymentobj['NEFTPayAmount'] = 0;
      //   Paymentobj['NEFTNo'] = 0;
      //   Paymentobj['NEFTBankMaster'] = "";
      //   Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PayTMAmount'] = 0;
      //   Paymentobj['PayTMTranNo'] = 0;
      //   Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PaidAmt'] = this.advanceAmount || 0;
      //   Paymentobj['BalanceAmt'] = 0;

      //   let submitData = {
      //     "advanceHeaderInsert": advanceHeaderObj,
      //     "advanceDetailInsert": AdvanceDetObj,
      //     "ipPaymentInsert": Paymentobj
      //   };
      //   console.log(submitData);
      //   this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {

      //     if (response) {
      //       Swal.fire('Congratulations !', 'IP Advance Cash data saved Successfully !', 'success').then((result) => {
      //         if (result.isConfirmed) {
      //           this.viewgetAdvanceReceiptReportPdf(response);

      //           this._matDialog.closeAll();
      //         }
      //       });
      //     } else {
      //       Swal.fire('Error !', 'IP Advance data not saved', 'error');
      //     }
      //     this.isLoading = '';
      //   });

      // }



    }
    else {
      this.isLoading = 'submit';

      let AdvanceDetObj = {};
      AdvanceDetObj['AdvanceDetailID'] = this.selectedAdvanceObj ;
      AdvanceDetObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      AdvanceDetObj['Time'] = this.dateTimeObj.time || '01/01/1900'
      AdvanceDetObj['AdvanceId'] = this.vAdvanceId || 0;
      AdvanceDetObj['RefId'] =0,// this.selectedAdvanceObj.RegId;
      AdvanceDetObj['transactionID'] = 2;
      AdvanceDetObj['OPD_IPD_Type'] = 1;
      AdvanceDetObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      AdvanceDetObj['AdvanceAmount'] = this.advanceAmount;
      AdvanceDetObj['AdvanceUsedAmount'] = 0;
      AdvanceDetObj['BalanceAmount'] = this.advanceAmount;
      AdvanceDetObj['RefundAmount'] = 0;
      AdvanceDetObj['ReasonOfAdvanceId'] = 0;
      AdvanceDetObj['AddedBy'] = this.accountService.currentUserValue.user.id;
      AdvanceDetObj['IsCancelled'] = false;
      AdvanceDetObj['IsCancelledBy'] = 0;
      AdvanceDetObj['IsCancelledDate'] = '01/01/1900';
      AdvanceDetObj['Reason'] = this.AdvFormGroup.get("comment").value;
      // AdvanceDetObj['CashCounterId'] = 2;//this.AdvFormGroup.get('CashCounterId').value.CashCounterId;

      let advanceHeaderObj = {};
      advanceHeaderObj['AdvanceId'] = this.vAdvanceId;
      advanceHeaderObj['AdvanceAmount'] = parseInt(this.advanceAmount.toString());

      let PatientHeaderObj = {};

      PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['NetPayAmount'] = this.advanceAmount;

      const advanceHeaderUpdate = new AdvanceHeaderUpdate(advanceHeaderObj);
      const advanceDetailInsert = new AdvanceDetails(AdvanceDetObj);
      
        const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
          {
            maxWidth: "75vw",
            height: '75vh',
            width: '100%',

            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "Advance",
              advanceObj: PatientHeaderObj,
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('==============================  Advance Amount ===========');

          let submitData = {
            "advanceHeaderUpdate": advanceHeaderUpdate,
            "advanceDetailInsert1": advanceDetailInsert,
            "ipPaymentInsert1": result.submitDataPay.ipPaymentInsert
          };
          console.log(submitData);
          this._IpSearchListService.InsertAdvanceHeaderUpdate(submitData).subscribe(response => {
            if (response) {
              Swal.fire('Congratulations !', 'IP Advance data Updated Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  this.getAdvanceList();
                  this._matDialog.closeAll();
                  this.viewgetAdvanceReceiptReportPdf(response,true);
                  this.getWhatsappsAdvance(response,this.vMobileNo);
                }
              });
            } else {
              Swal.fire('Error !', 'IP Advance data not Updated', 'error');
            }
            this.isLoading = '';
          });

        });
      // }
      // else if (this.AdvFormGroup.get('cashpay').value == 1) {

      //   let Paymentobj = {};
      //   Paymentobj['BillNo'] = 0;
      //   Paymentobj['ReceiptNo'] = "";
      //   Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
      //     Paymentobj['CashPayAmount'] = this.advanceAmount || 0;
      //   Paymentobj['ChequePayAmount'] = 0;
      //   Paymentobj['ChequeNo'] = 0;
      //   Paymentobj['BankName'] = "";
      //   Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['CardPayAmount'] = 0;
      //   Paymentobj['CardNo'] = 0;
      //   Paymentobj['CardBankName'] = "";
      //   Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['AdvanceUsedAmount'] = 0;
      //   Paymentobj['AdvanceId'] = 0;
      //   Paymentobj['RefundId'] = 0;
      //   Paymentobj['TransactionType'] = 0;
      //   Paymentobj['Remark'] = "Cashpayment";
      //   Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
      //     Paymentobj['IsCancelled'] = 0;
      //   Paymentobj['IsCancelledBy'] = 0;
      //   Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['CashCounterId'] = 0;
      //   Paymentobj['NEFTPayAmount'] = 0;
      //   Paymentobj['NEFTNo'] = 0;
      //   Paymentobj['NEFTBankMaster'] = "";
      //   Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PayTMAmount'] = 0;
      //   Paymentobj['PayTMTranNo'] = 0;
      //   Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
      //     Paymentobj['PaidAmt'] = this.advanceAmount || 0;
      //   Paymentobj['BalanceAmt'] = 0;

      //   let submitData = {
      //     "advanceHeaderUpdate": advanceHeaderUpdate,
      //     "advanceDetailInsert1": advanceDetailInsert,
      //     "ipPaymentInsert": Paymentobj
      //   };
      //   console.log(submitData);
      //   this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {

      //     if (response) {
      //       Swal.fire('Congratulations !', 'IP Advance Cash data saved Successfully !', 'success').then((result) => {
      //         if (result.isConfirmed) {
      //           this.viewgetAdvanceReceiptReportPdf(response);

      //           this._matDialog.closeAll();
      //         }
      //       });
      //     } else {
      //       Swal.fire('Error !', 'IP Advance data not saved', 'error');
      //     }
      //     this.isLoading = '';
      //   });

      // }

    }
    this.AdvFormGroup.get('advanceAmt').reset(0);
    this.AdvFormGroup.get('comment').reset('');
    this.AdvFormGroup.get('CashCounterId').reset(0);
  }

  convertToWord(e) {

    return converter.toWords(e);
  }

 

  keyPressCharater(event){
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  viewgetAdvanceReceiptReportPdf(AdvanceID,Flag) {
    let AdvanceDetailID
    if(Flag)
    AdvanceDetailID = AdvanceID
    else
    AdvanceDetailID = AdvanceID.AdvanceDetailID


    this._IpSearchListService.getViewAdvanceReceipt(
      AdvanceDetailID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Advance Viewer"
          }
        });
    });
  }

  getWhatsappsAdvance(el, vmono) {
    debugger
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPAdvance',
        "smsFlag": 0,
        "smsDate": this.currentDate,
        "tranNo": el,
        "PatientType": 2,//el.PatientType,
        "templateId": 0,
        "smSurl": "info@gmail.com",
        "filePath": '',
        "smsOutGoingID": 0
      }
    }
    this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
      if (response) {
        this.toastr.success('IP Advance Receipt Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
  }
  }

  getStatementPrint() {
    let AdvanceDetailID=0
    this._IpSearchListService.getViewAdvancestatementReceipt(
      AdvanceDetailID
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Advance Statement Viewer"
          }
        });
    });
   }


  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }



  onClose() {
    this.dialogRef.close();
  }


}

export class patientinfo {
  Date: Date;
  OPD_IPD_Id: number;
  NetPayAmount: number;
  AdvanceId: number;

  constructor(patientinfo) {
    this.Date = patientinfo.Date || 0;
    this.OPD_IPD_Id = patientinfo.OPD_IPD_Id || 0;
    this.NetPayAmount = patientinfo.NetPayAmount || 0;
    this.AdvanceId = patientinfo.AdvanceId || 0;
  }
}
export class AdvanceHeader {
  AdvanceId: number;
  AdvanceAmount: number;
  Date: Date;
  RefId: number;
  OPD_IPD_Type: any;
  OPD_IPD_Id: number;
  AdvanceUsedAmount: number;
  BalanceAmount: number;
  AddedBy: any;
  IsCancelled: boolean;
  IsCancelledBy: any;
  IsCancelledDate: Date;

  constructor(AdvanceHeaderObj) {
    this.AdvanceId = AdvanceHeaderObj.AdvanceId || '0';
    this.Date = AdvanceHeaderObj.Date || '0';
    this.RefId = AdvanceHeaderObj.RefId || '0';
    this.OPD_IPD_Type = AdvanceHeaderObj.OPD_IPD_Type || '';
    this.OPD_IPD_Id = AdvanceHeaderObj.OPD_IPD_Id || '0';
    this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || '0';
    this.AdvanceUsedAmount = AdvanceHeaderObj.AdvanceUsedAmount || '0';
    this.BalanceAmount = AdvanceHeaderObj.BalanceAmount || '0';
    this.AddedBy = AdvanceHeaderObj.AddedBy || '';
    this.IsCancelled = AdvanceHeaderObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceHeaderObj.IsCancelledBy || '';
    this.IsCancelledDate = AdvanceHeaderObj.IsCancelledDate || '';
  }

}
export class AdvanceHeaderUpdate {
  AdvanceId: number;
  AdvanceAmount: number;

  constructor(AdvanceHeaderObj) {
    this.AdvanceId = AdvanceHeaderObj.AdvanceId || '0';
    this.AdvanceAmount = AdvanceHeaderObj.AdvanceAmount || '0';
  }

}
export class AdvanceDetails {
  AdvanceDetailID: number;
  Date: any;
  Time: any;
  AdvanceId: number;
  RefId: number;
  TransactionID: number;
  OPD_IPD_Type: any;
  OPD_IPD_Id: number;
  AdvanceAmount: number;
  UsedAmount: any;
  BalanceAmount: number;
  RefundAmount: any;
  ReasonOfAdvanceId: any;
  AddedBy: any;
  IsCancelled: boolean;
  IsCancelledBy: any;
  IsCancelledDate: Date;
  Reason: any;
  CashCounterId: any;

  constructor(AdvanceDetailsObj) {
    this.AdvanceDetailID = AdvanceDetailsObj.AdvanceDetailID || '0';
    this.Date = AdvanceDetailsObj.Date;
    this.Time = AdvanceDetailsObj.Time;
    this.AdvanceId = AdvanceDetailsObj.AdvanceId;
    this.RefId = AdvanceDetailsObj.RefId;
    this.TransactionID = AdvanceDetailsObj.TransactionID || '0';
    this.OPD_IPD_Type = AdvanceDetailsObj.OPD_IPD_Type || 1;
    this.OPD_IPD_Id = AdvanceDetailsObj.OPD_IPD_Id || '0';
    this.AdvanceAmount = AdvanceDetailsObj.AdvanceAmount || '0';
    this.UsedAmount = AdvanceDetailsObj.UsedAmount || '0';
    this.BalanceAmount = AdvanceDetailsObj.BalanceAmount || '0';
    this.RefundAmount = AdvanceDetailsObj.RefundAmount || '0';
    this.ReasonOfAdvanceId = AdvanceDetailsObj.ReasonOfAdvanceId || '0';
    this.Reason = AdvanceDetailsObj.Reason || '';
    this.AddedBy = AdvanceDetailsObj.AddedBy || 0;
    this.IsCancelled = AdvanceDetailsObj.IsCancelled || false;
    this.IsCancelledBy = AdvanceDetailsObj.IsCancelledBy || 0;
    this.IsCancelledDate = AdvanceDetailsObj.IsCancelledDate || '01/01/1900';
    this.CashCounterId = AdvanceDetailsObj.CashCounterId || 0;
  }

}