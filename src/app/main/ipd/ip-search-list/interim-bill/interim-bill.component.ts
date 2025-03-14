import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import * as converter from 'number-to-words';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { Cal_DiscAmount } from '../ip-billing/ip-billing.component';
import { ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { IPpaymentWithadvanceComponent } from '../../ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-interim-bill',
  templateUrl: './interim-bill.component.html',
  styleUrls: ['./interim-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InterimBillComponent implements OnInit {
  displayedColumns = [ 
    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'ChargeDoctorName',
    'ClassName', 
  ]; 
 

  vTotalBillAmt: any = 0; 
  vNetAmount: any = 0;
  vUPINO: any;
  disamt: any;  
  

  dataSource = new MatTableDataSource<ChargesList>(); 
  constructor(
    public _IpSearchListService: IPSearchListService,
    public _printpreview: PrintPreviewService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService, 
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<InterimBillComponent>,
    private formBuilder: UntypedFormBuilder,
    public _WhatsAppEmailService:WhatsAppEmailService,
    public _ConfigService : ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    {}

    selectedAdvanceObj:any; 
    ConShow: boolean = false;
    DiscountFlag: boolean = false;
    onlineflag: boolean = false;
    interimArray: any = [];
    isLoading: String = ''; 
    InterimFormGroup: FormGroup;
    
  currentDate = new Date();
  autocompleteModeConcession: string = "Concession";
  autocompleteModeCashCounter: string = "CashCounter";

  ngOnInit(): void {
    this.dataSource.data = []; 
     this.InterimFormGroup = this.InterimForm();  
    if (this.data) {
      console.log(this.data);
      this.dataSource.data  = this.data.Obj; 
      this.getNetAmtSum(this.data.Obj)
      this.selectedAdvanceObj = this.data.PatientHeaderObj;  
    } 
    this.setupFormListener()
  } 
  InterimForm(): FormGroup {
    return this.formBuilder.group({
      NetpayAmount: [0],
      ConcessionId: '0',
      Remark: [''],
      TotalAmt: [0], 
      CashCounterID:[''],
      discPer: [0],
      concessionAmt: [0],
      paymode: ['cashpay'],
      UPINO: ['']
    });
  }
  private setupFormListener(): void { 
    this.handleChange('discPer', () => this.calculateDiscPer());
    this.handleChange('concessionAmt', () => this.calculateDiscamt()); 
  }  
  getValidationMessages() {
    return { 
      TotalAmt: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      NetpayAmount: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      discPer: [
        { name: "pattern", Message: "only Number allowed." }
      ],
      concessionAmt: [{ name: "pattern", Message: "only Number allowed." }],
      Remark: [{ name: "pattern", Message: "only charactors allowed." }],
      concessionId: [],
      cashCounterId: [], 
    }
  } 
  selectChangeConcession(event) { 
    console.log(event)
  } 
 
  getNetAmtSum(element) { 
    let netAmt = element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
    let totalAmt = element.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0).toFixed(2);
    let discountAmount = element.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0).toFixed(2);
    if(discountAmount > 0){
      this.ConShow = true;
      this.DiscountFlag = true;
    } 
    else{
      this.ConShow = false;
      this.DiscountFlag = false;
    } 
    this.InterimFormGroup.patchValue({
      TotalAmt: totalAmt,
      NetpayAmount: netAmt,
      concessionAmt:discountAmount
    });
  }  
  calculateDiscPer() {  
    const perControl = this.InterimFormGroup.get("discPer");
    if (!perControl.valid || perControl.value == 0) {
      this.InterimFormGroup.get("concessionAmt").setValue(0);
      this.InterimFormGroup.get("discPer").setValue(0); 
      this.ConShow = false;
      this.toastr.error("Enter discount % between 0-100");
      return;
    }
    let percentage = perControl.value;
    let totalAmount = this.InterimFormGroup.get("TotalAmt").value; 
    let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
    let netAmount = parseFloat((totalAmount - discountAmount).toFixed(2));
    this.ConShow = true;

    this.InterimFormGroup.patchValue({ 
      NetpayAmount: netAmount,
      concessionAmt:discountAmount
    },{ emitEvent: false }); 
  } 
  calculateDiscamt() {  
    let discountAmount = this.InterimFormGroup.get("concessionAmt").value;
    let totalAmount = this.InterimFormGroup.get("TotalAmt").value;

    if (discountAmount < 0 || discountAmount > totalAmount || discountAmount == 0) {
      this.InterimFormGroup.get("concessionAmt").setValue(0);
      this.InterimFormGroup.get("discPer").setValue(0); 
      this.ConShow = false;
      this.toastr.error("Discount must be between 0 and the total amount.");
      return;
    } 
    let percent = Number(totalAmount ? ((discountAmount / totalAmount) * 100).toFixed(2) : "0.00");
    let netAmount = Number((totalAmount - discountAmount).toFixed(2));
    this.ConShow = true;
    this.InterimFormGroup.patchValue({
      discPer: percent,
      NetpayAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop 
  }


  onChangeReg(event) { 
    if (event.value == 'onlinepay') {
      this.onlineflag = true; 
      this.InterimFormGroup.get('UPINO').setValidators([Validators.required]);
      this.InterimFormGroup.get('UPINO').enable();
      this.InterimFormGroup.get('DoctorID').updateValueAndValidity();
    } else {
      this.onlineflag = false;
      this.InterimFormGroup.get('UPINO').reset();
      this.InterimFormGroup.get('UPINO').clearValidators();
      this.InterimFormGroup.get('UPINO').updateValueAndValidity();
    }
  }
 
 
  onSave() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');  

    const formvalue = this.InterimFormGroup.value

    if (this.InterimFormGroup.get('discPer').value > 0 || this.InterimFormGroup.get('concessionAmt').value > 0) {
      if (!this.InterimFormGroup.get('ConcessionId').value) {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (!this.InterimFormGroup.get('CashCounterID').value) {
      this.toastr.warning('Please select Cash Counter.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let interimBillChargesobj = {};
    interimBillChargesobj['chargesID'] = 0// this.ChargesId;

    let billObj = {};
    billObj['billNo'] = 0;
    billObj['opdipdid'] = this.selectedAdvanceObj.admissionId;
    billObj['totalAmt'] = this.InterimFormGroup.get('TotalAmt').value;//this.netAmount;
    billObj['concessionAmt'] = this.InterimFormGroup.get('concessionAmt').value || 0;
    billObj['netPayableAmt'] = this.InterimFormGroup.get('NetpayAmount').value, // this.netAmount;
    billObj['paidAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0,//this.advanceAmount;
    billObj['balanceAmt'] = 0;
    billObj['billDate'] = formattedDate;
    billObj['opdipdType'] = 1;
    billObj['addedBy'] = this.accountService.currentUserValue.userId || 0;
    billObj['totalAdvanceAmount'] = this.selectedAdvanceObj.AdvTotalAmount || 0;
    billObj['billTime'] =  formattedTime;
    billObj['concessionReasonId'] = this.InterimFormGroup.get('ConcessionId').value.ConcessionId || 0,
    billObj['isSettled'] = false;
    billObj['isPrinted'] = true;
    billObj['isFree'] = false;
    billObj['companyId'] = this.selectedAdvanceObj.companyId || 0,
    billObj['tariffId'] = this.selectedAdvanceObj.tariffId || 0,
    billObj['unitId'] = this.selectedAdvanceObj.unitId || 0;
    billObj['interimOrFinal'] = 1;
    billObj['companyRefNo'] = 0;
    billObj['concessionAuthorizationName'] = 0;
    billObj['speTaxPer'] =   0;
    billObj['speTaxAmt'] =   0;
    billObj['discComments'] = this.InterimFormGroup.get('Remark').value || ''; 
    billObj['compDiscAmt'] = 0 ;
    billObj['cashCounterId'] = this.InterimFormGroup.get('CashCounterID').value.CashCounterId || 0;

    let billDetailObj = []; 
    this.dataSource.data.forEach((element) => {
      let billDetailObj1 = {}; 
      billDetailObj1['billNo'] = 0;
      billDetailObj1['chargesId'] = element.chargesId; 
      billDetailObj.push(billDetailObj1);
    });  

    if (this.InterimFormGroup.get('paymode').value == 'cashpay') { 
      let Paymentobj = {};  
      Paymentobj['billNo'] = 0;
      Paymentobj['receiptNo'] = "";
      Paymentobj['paymentDate'] =  formattedDate;
      Paymentobj['paymentTime'] =  formattedTime;
      Paymentobj['cashPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0,
      Paymentobj['chequePayAmount'] = 0;
      Paymentobj['chequeNo'] = 0;
      Paymentobj['bankName'] = "";
      Paymentobj['chequeDate'] =  formattedDate;
      Paymentobj['cardPayAmount'] = 0;
      Paymentobj['cardNo'] = 0;
      Paymentobj['cardBankName'] = "";
      Paymentobj['cardDate'] = formattedDate;
      Paymentobj['advanceUsedAmount'] = 0;
      Paymentobj['advanceId'] = 0;
      Paymentobj['refundId'] = 0;
      Paymentobj['transactionType'] = 0;
      Paymentobj['remark'] = "Cashpayment";
      Paymentobj['addBy'] = this.accountService.currentUserValue.userId,
      Paymentobj['isCancelled'] = false;
      Paymentobj['isCancelledBy'] = 0;
      Paymentobj['isCancelledDate'] = '1990-01-01'
      Paymentobj['CashCounterId'] = 0;
      Paymentobj['neftpayAmount'] = 0;
      Paymentobj['neftno'] = 0;
      Paymentobj['neftbankMaster'] = "";
      Paymentobj['neftdate'] = formattedDate;
      Paymentobj['payTmamount'] = 0;
      Paymentobj['payTmtranNo'] = 0;
      Paymentobj['payTmdate'] = formattedDate;
      Paymentobj['tdsAmount'] = 0;  

      let submitData = { 
        "ipBillling": billObj,
        "addChargeM": interimBillChargesobj,
        "billingDetails": billDetailObj,
        "payments": Paymentobj,
      };
      console.log(submitData); 
        this._IpSearchListService.InsertInterim(submitData).subscribe(response => {  
          this.toastr.success(response.message);
          this.viewgetInterimBillReportPdf(response);
          this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
          this.onClose()
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        }); 
    }
    else if (this.InterimFormGroup.get('paymode').value == 'onlinepay') { 
      let Paymentobj = {};  
      Paymentobj['billNo'] = 0;
      Paymentobj['receiptNo'] = "";
      Paymentobj['paymentDate'] =  formattedDate;
      Paymentobj['paymentTime'] =  formattedTime;
      Paymentobj['cashPayAmount'] = 0
      Paymentobj['chequePayAmount'] = 0;
      Paymentobj['chequeNo'] = 0;
      Paymentobj['bankName'] = "";
      Paymentobj['chequeDate'] =  formattedDate;
      Paymentobj['cardPayAmount'] = 0;
      Paymentobj['cardNo'] = 0;
      Paymentobj['cardBankName'] = "";
      Paymentobj['cardDate'] = formattedDate;
      Paymentobj['advanceUsedAmount'] = 0;
      Paymentobj['advanceId'] = 0;
      Paymentobj['refundId'] = 0;
      Paymentobj['transactionType'] = 0;
      Paymentobj['remark'] = "Cashpayment";
      Paymentobj['addBy'] = this.accountService.currentUserValue.userId,
      Paymentobj['isCancelled'] = false;
      Paymentobj['isCancelledBy'] = 0;
      Paymentobj['isCancelledDate'] = '1990-01-01'
      Paymentobj['CashCounterId'] = 0;
      Paymentobj['neftpayAmount'] = 0;
      Paymentobj['neftno'] = 0;
      Paymentobj['neftbankMaster'] = "";
      Paymentobj['neftdate'] = formattedDate;
      Paymentobj['payTmamount'] = this.InterimFormGroup.get('NetpayAmount').value || 0,
      Paymentobj['payTmtranNo'] = this.InterimFormGroup.get('UPINO').value || 0;
      Paymentobj['payTmdate'] = formattedDate;
      Paymentobj['tdsAmount'] = 0;  
 
      let submitData = {
        "ipBillling": billObj,
        "addChargeM": interimBillChargesobj,
        "billingDetails": billDetailObj,
        "ipIntremPaymentInsert": Paymentobj, 
      };
      console.log(submitData); 
        this._IpSearchListService.InsertInterim(submitData).subscribe(response => {  
          this.toastr.success(response.message);
          this.viewgetInterimBillReportPdf(response);
          this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
          this.onClose()
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        }); 
    }
    else if (this.InterimFormGroup.get('paymode').value == 'PayOption') {
      let PatientHeaderObj = {};
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      PatientHeaderObj['Date'] = //this.dateTimeObj.date;
      PatientHeaderObj['UHIDNO'] =this.selectedAdvanceObj.RegNo;
      PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.Doctorname;
      PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.IPDNo ; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
      PatientHeaderObj['NetPayAmount'] = //this.netAmount;
      PatientHeaderObj['AdvanceAmount'] =  //this.netAmount; 
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID;
      PatientHeaderObj['ComapanyId'] = this.selectedAdvanceObj.CompanyId;
 
      const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
        {
          maxWidth: "95vw",
          height: '650px',
          width: '85%',
          data: {
            advanceObj: PatientHeaderObj,
            FromName: "IP-IntrimBIll"
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        let submitData = {
          "ipBillling": billObj,
        "addChargeM": interimBillChargesobj,
        "billingDetails": billDetailObj, 
        "ipIntremPaymentInsert": result.submitDataPay.ipPaymentInsert,
        };
        console.log(submitData)
        this._IpSearchListService.InsertInterim(submitData).subscribe(response => {  
          this.toastr.success(response.message);
          this.viewgetInterimBillReportPdf(response);
          this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
          this.onClose()
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        }); 
      });
    }
    else {
      Swal.fire('Error !', 'Please Select paymentModes', 'error');
    }
  }
  onClose() {
    this.dialogRef.close(); 
  }
  
  getWhatsappshareIPInterimBill(el, vmono) {
    
    if(vmono !='' && vmono !="0"){
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPInterim',
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
        this.toastr.success('IP Interim Bill Sent on WhatsApp Successfully.', 'Save !', {
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
  viewgetInterimBillReportPdf(BillNo) {

    this._IpSearchListService.getIpInterimBillReceipt(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Interim Bill  Viewer"
          }
        });
    });
  } 

 
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  } 
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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
  public subscription: Array<Subscription> = [];
  handleChange(key: string, callback: () => void, form: FormGroup = this.InterimFormGroup) {
    this.subscription.push(form.get(key).valueChanges.subscribe(value => {
      callback();
    }));
  }
}

export class interimBill {
  chargesId: number;

  constructor(interimBill) {
    {
      this.chargesId = interimBill.chargesId || 0;
    }
  }
}

export class Bill {
  AdmissionID: any;
  billNo: number;
  OPD_IPD_ID: any;
  totalAmt: any;
  concessionAmt: number;
  netPayableAmt: number;
  paidAmt: number;
  balanceAmt: number;
  billDate: Date;
  opD_IPD_Type: any;
  addedBy: number;
  totalAdvanceAmount: any;
  billTime: Date;
  concessionReasonId: any;
  isSettled: boolean;
  isPrinted: boolean;
  isFree: boolean;
  companyId: any;
  tariffId: any;
  unitId: any;
  interimOrFinal: boolean;
  companyRefNo: String;
  concessionAuthorizationName: String;
  taxPer: any;
  taxAmount: any;
  discComments: String;
  CashCounterId: any;
  CompDiscAmt: any;
  PatientName: any;
  RegNo:any;
  DoctorName:any;
  IPDNo:any;
  constructor(Bill) {
    {
      this.AdmissionID = Bill.AdmissionID || 0;
      this.RegNo = Bill.RegNo || 0;
      this.IPDNo = Bill.IPDNo || 0;
      this.DoctorName = Bill.DoctorName || '';
      this.billNo = Bill.billNo || 0;
      this.OPD_IPD_ID = Bill.OPD_IPD_ID || 0;
      this.totalAmt = Bill.totalAmt || 0;
      this.concessionAmt = Bill.concessionAmt || 0;
      this.netPayableAmt = Bill.netPayableAmt || 0;
      this.paidAmt = Bill.paidAmt || 0;
      this.balanceAmt = Bill.balanceAmt || 0;
      this.billDate = Bill.billDate || '01/01/1900';
      this.opD_IPD_Type = Bill.opD_IPD_Type || 1;
      this.addedBy = Bill.addedBy || 0;
      this.totalAdvanceAmount = Bill.totalAdvanceAmount || 0;
      this.billTime = Bill.billTime || '01/01/1900';
      this.concessionReasonId = Bill.concessionReasonId || 0;
      this.isSettled = Bill.isSettled || true;
      this.isPrinted = Bill.isPrinted || true;
      this.isFree = Bill.isFree || true;
      this.companyId = Bill.companyId || 0;
      this.tariffId = Bill.tariffId || 0;
      this.unitId = Bill.unitId || 0;
      this.interimOrFinal = Bill.interimOrFinal || 0;
      this.companyRefNo = Bill.companyRefNo || 0;
      this.concessionAuthorizationName = Bill.concessionAuthorizationName || 0;
      this.taxPer = Bill.taxPer || 0;
      this.taxAmount = Bill.taxAmount || 0;
      this.discComments = Bill.discComments || '';
      this.CashCounterId = Bill.CashCounterId || 0;
      this.CompDiscAmt = Bill.CompDiscAmt || 0;
      this.PatientName = Bill.PatientName || '';
    }
  }
}

export class billDetails {
  billNo: number;
  chargesID: number;

  constructor(billDetails) {
    {
      this.billNo = billDetails.billNo || 0;
      this.chargesID = billDetails.chargesID || 0;
    }
  }
}


export class AdmissionIPBilling {
  AdmissionID: number;

  constructor(AdmissionIPBilling) {
    {
      this.AdmissionID = AdmissionIPBilling.AdmissionID || 0;

    }
  }
}

