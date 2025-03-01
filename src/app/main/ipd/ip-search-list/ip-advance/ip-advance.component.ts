import { Component, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
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
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { debug } from 'console';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { AdmissionPersonlModel } from '../../Admission/admission/admission.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { map, startWith } from 'rxjs/operators';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';


@Component({
  selector: 'app-ip-advance',
  templateUrl: './ip-advance.component.html',
  styleUrls: ['./ip-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPAdvanceComponent implements OnInit {
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 
  currentDate = new Date();  
  Filepath:any;
  AdmissionId:any=0; 
  autocompleteModeCashCounter: string="CashCounter";

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  gridConfig: gridModel = {
      apiUrl: "Advance/PatientWiseAdvanceList",
      columnsList: [
          { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "AdvanceAmt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "UsedAmt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BalanceAmt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 300 },
          { heading: "RefundAmt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' }, 
          { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 250 }, 
          { heading: "CashPayAmt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ChequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CardPayAmt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "NeftPayAmt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 250 }, 
          { heading: "PayTMAmt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 200 } 
      ],
      sortField: "AdvanceDetailID",
      sortOrder: 0,
      filters: [
          { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }  
      ],
      row: 25 
  } 

 
  advanceAmount: any;
  isLoadingStr: string = '';
  AdvFormGroup: FormGroup;
  isLoading: string = '';
  selectedAdvanceObj:any=[];
  screenFromString = 'advance';
  dateTimeObj: any;
  TotalAdvamt: any;
  Advavilableamt: any;
  vAdvanceId: any;    
  PatientHeaderObj: any;
  vMobileNo:any;
  isCashCounterSelected:boolean=false;
  filteredOptionsCashCounter:Observable<string[]>;
  registerObj:any; 
  vAdvanceDetId:any;

  constructor(public _IpSearchListService: IPSearchListService,
    public _opappointmentService: OPSearhlistService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe, 
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _WhatsAppEmailService:WhatsAppEmailService,
    private dialogRef: MatDialogRef<IPAdvanceComponent>,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    private formBuilder: UntypedFormBuilder) 
    { }

  ngOnInit(): void { 
    debugger
    this.createAdvform(); 
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log("Advance data:",this.registerObj)
      this.AdmissionId =this.registerObj.admissionId
    


      if (this.AdmissionId > 0) {
        setTimeout(() => {
            this._IpSearchListService.AdvanceHeaderlist(this.AdmissionId).subscribe((response) => {
                this.selectedAdvanceObj = response;
                console.log(this.selectedAdvanceObj) 
               });
        }, 500);
    } 
    this.getdata(this.AdmissionId);
    } 

   
}
  createAdvform(){
    this.AdvFormGroup = this.formBuilder.group({
      advanceAmt: ['',Validators.required, [Validators.pattern('^[0-9]{2,8}$')]],
      comment: [''],
      CashCounterId: [0],
      cashpay: ['1'],
      CashCounterID:['5',Validators.required]
    });
  }  
  getValidationMessages() {
    return {  
      CashCounterID: [
        { name: "required", Message: "CashCounter Name is required" }
      ],
      advanceAmt: [
        { name: "required", Message: "Advance Amount is required" }
      ]
    };
  } 

  
  onSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');

    let AdvanceAMt = this.AdvFormGroup.get('advanceAmt').value || 0; 
    if (AdvanceAMt == "" || AdvanceAMt == undefined || AdvanceAMt == 0 || AdvanceAMt == null) {
      this.toastr.warning('Please enter Advance Amount', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    let CashCounter = this.AdvFormGroup.get('advanceAmt').value || 0;
    if (CashCounter == "" || CashCounter == undefined || CashCounter == null) {
      this.toastr.warning('select Cash Counter Name', 'warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vAdvanceId = 0
    let advanceHeaderObj = {};
    advanceHeaderObj['date'] = formattedDate || '1900-01-01';
    advanceHeaderObj['refId'] = this.registerObj.regId;
    advanceHeaderObj['opdIpdType'] = 1;
    advanceHeaderObj['opdIpdId'] = this.registerObj.admissionId;
    advanceHeaderObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;
    advanceHeaderObj['advanceUsedAmount'] = 0;
    advanceHeaderObj['balanceAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;
    advanceHeaderObj['addedBy'] = this.accountService.currentUserValue.userId;
    advanceHeaderObj['isCancelled'] = false;
    advanceHeaderObj['isCancelledBy'] = '0';
    advanceHeaderObj['isCancelledDate'] = '1900-01-01';
    advanceHeaderObj['advanceId'] = 0;

    let AdvanceDetObj = {};
    AdvanceDetObj['date'] = formattedDate || '1900-01-01';
    AdvanceDetObj['time'] = formattedTime || '1900-01-01';
    AdvanceDetObj['advanceId'] = 0;
    AdvanceDetObj['refId'] = this.registerObj.regId;
    AdvanceDetObj['transactionId'] = 2;
    AdvanceDetObj['opdIpdId'] = this.registerObj.admissionId;
    AdvanceDetObj['opdIpdType'] = 1;
    AdvanceDetObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;
    AdvanceDetObj['usedAmount'] = 0;
    AdvanceDetObj['balanceAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;
    AdvanceDetObj['refundAmount'] = 0;
    AdvanceDetObj['reasonOfAdvanceId'] = 0;
    AdvanceDetObj['addedBy'] = this.accountService.currentUserValue.userId;
    AdvanceDetObj['isCancelled'] = false;
    AdvanceDetObj['isCancelledby'] = 0;
    AdvanceDetObj['isCancelledDate'] = '1900-01-01';
    AdvanceDetObj['reason'] = this.AdvFormGroup.get("comment").value;
    AdvanceDetObj['advanceDetailId'] = '0';

    let advanceHeaderUpdateObj = {};
    advanceHeaderUpdateObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;
    advanceHeaderUpdateObj['advanceId'] = 0;

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
      PatientHeaderObj['PatientName'] = this.registerObj.patientName;
    PatientHeaderObj['RegNo'] = this.registerObj.regNo,
      PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
    PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
    PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
    PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
    PatientHeaderObj['Age'] = this.registerObj.ageYear;
    PatientHeaderObj['NetPayAmount'] = this.AdvFormGroup.get('advanceAmt').value || 0;

    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Advance",
          advanceObj: PatientHeaderObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('==============================  Advance Amount ===========', result);


      if (!this.vAdvanceId) {
        let submitData = {
          "advance": advanceHeaderObj,
          "advanceDetail": AdvanceDetObj,
          "advancePayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {
          this.toastr.success(response.message);
          this.viewgetAdvanceReceiptReportPdf(response, true);
          this.getWhatsappsAdvance(response, this.vMobileNo);
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
      else {
        let submitData = {
          "advance": advanceHeaderUpdateObj,
          "advanceDetail": AdvanceDetObj,
          "advancePayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.UpdateAdvanceHeader(submitData).subscribe(response => {
          this.toastr.success(response.message);
          this.viewgetAdvanceReceiptReportPdf(response, true);
          this.getWhatsappsAdvance(response, this.vMobileNo);
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    });

    this.AdvFormGroup.get('advanceAmt').reset(0);
    this.AdvFormGroup.get('comment').reset('');
    this.AdvFormGroup.get('CashCounterId').setValue(5);
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

  getdata(data){
   // console.log(data)
    this.gridConfig = {
      apiUrl: "Advance/PatientWiseAdvanceList",
      columnsList: [
          { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "AdvanceAmt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "UsedAmt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "BalanceAmt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 300 },
          { heading: "RefundAmt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' }, 
          { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "PaymentDate", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 250 }, 
          { heading: "CashPayAmt", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "ChequePayAmt", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "CardPayAmt", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
          { heading: "NeftPayAmt", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 250 }, 
          { heading: "PayTMAmt", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA' },
          { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 200 }
      
      ],
      sortField: "AdvanceDetailID",
      sortOrder: 0,
      filters: [
          { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals },
          { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
          { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }  
      ],
      row: 25 
  } 
  this.grid.gridConfig = this.gridConfig;
  this.grid.bindGridData(); 
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