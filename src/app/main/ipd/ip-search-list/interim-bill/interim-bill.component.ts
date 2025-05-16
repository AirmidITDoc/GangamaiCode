import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { AdvanceDetailObj, ChargesList } from '../ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog'; 
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations'; 
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component'; 
import { ToastrService } from 'ngx-toastr';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { IPpaymentWithadvanceComponent } from '../../ip-settlement/ippayment-withadvance/ippayment-withadvance.component';
import { map, startWith } from 'rxjs/operators';
import { ConfigService } from 'app/core/services/config.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

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
 
 
  vUPINO: any;
  selectedAdvanceObj: any;
  ConShow: boolean = false;
  DiscountFlag: boolean = false;
  onlineflag: boolean = false;
  interimArray: any = [];
  isLoading: String = '';
  InterimFormGroup: FormGroup;
  concessionId:any = 0; 
  currentDate = new Date();
  autocompleteModeConcession: string = "Concession";
  autocompleteModeCashCounter: string = "CashCounter";

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
    private commonService: PrintserviceService,
    public _WhatsAppEmailService:WhatsAppEmailService,
    public _ConfigService : ConfigService,
    public _FormvalidationserviceService:FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any) 
    {} 
  ngOnInit(): void {
    this.dataSource.data = []; 
     this.InterimFormGroup = this.InterimForm();
        this.InterimFormGroup.markAllAsTouched();  
    if (this.data) {
      console.log(this.data);
      this.dataSource.data  = this.data.Obj; 
      this.interimArray = this.dataSource.data 
      this.selectedAdvanceObj = this.data.PatientHeaderObj;  
      this.getNetAmtSum(); 
    } 
 
  } 
  InterimForm(): FormGroup {
    return this.formBuilder.group({
      NetpayAmount: [0,[Validators.required,Validators.min(1)]], 
      ConcessionId: [''],
      Remark: [''],
      TotalAmt: [0,[Validators.required,Validators.min(1)]], 
      CashCounterID:[4,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], 
      paymode: ['cashpay'],
      UPINO: [''],
      discPer: [0,[Validators.min(0), Validators.max(100)]],
      concessionAmt:[0,[Validators.min(0)]],
    });
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
    this.concessionId = event.value
  } 
 
 
 
  FinalNetAmt:any=0;
  getNetAmtSum() { 
    this.FinalNetAmt =  this.interimArray.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
    let totalAmt =  this.interimArray.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0).toFixed(2);
    let discountAmount =  this.interimArray.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0).toFixed(2);
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
      NetpayAmount:   this.FinalNetAmt,
      concessionAmt:discountAmount
    });
  }  
  //Calculate Disc Amt
  calculateDiscPer() {  
    const perControl = this.InterimFormGroup.get("discPer");
    let  finalNetAmt = this.FinalNetAmt 
    if (!perControl.valid || perControl.value == 0 || perControl.value == '') {  
        this.ConShow = false 
        this.InterimFormGroup.patchValue({ 
          discPer:'',
          concessionAmt:'',
          NetpayAmount: Math.round(finalNetAmt),
        }, { emitEvent: false }); 
      this.toastr.error("Enter Discount % between 0-100");  
      return; 
    } 
    let percentage = perControl.value;
    let totalAmount = this.InterimFormGroup.get("TotalAmt").value; 
    let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
   finalNetAmt = parseFloat((totalAmount - discountAmount).toFixed(2));
    this.ConShow = true;

    this.InterimFormGroup.patchValue({ 
      NetpayAmount: finalNetAmt,
      concessionAmt:discountAmount
    },{ emitEvent: false }); 
  } 
  //Calculate Disc Per
  calculateDiscamt() {   
    let discountAmount = this.InterimFormGroup.get("concessionAmt").value;
    let totalAmount = this.InterimFormGroup.get("TotalAmt").value;
    let  finalNetAmt = this.FinalNetAmt 
    if (discountAmount < 0 || discountAmount == 0 || discountAmount == '' || parseFloat(discountAmount) > parseFloat(totalAmount)) { 
      this.ConShow = false;
      this.InterimFormGroup.patchValue({ 
        discPer:'',
        concessionAmt:'',
        NetpayAmount: Math.round(finalNetAmt),
      }, { emitEvent: false }); 
      this.toastr.warning("Discount must be between 0 and the total amount.");
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
 
debugger
   const formValue = this.InterimFormGroup.value 
           let invalidFields = []; 
      if (this.InterimFormGroup.invalid) {
        for (const controlName in this.InterimFormGroup.controls) {
          if (this.InterimFormGroup.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
          }
        }
      } 
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
      } 


    if (formValue.discPer > 0 || formValue.concessionAmt > 0) {
      if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if (formValue.CashCounterID == '' || formValue.CashCounterID == null || formValue.CashCounterID == '0') {
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
    billObj['concessionReasonId'] = this.concessionId || 0,
    billObj['isSettled'] = false;
    billObj['isPrinted'] = true;
    billObj['isFree'] = false;
    billObj['companyId'] = this.selectedAdvanceObj.companyId || 0,
    billObj['tariffId'] = this.selectedAdvanceObj.tariffId || 0,
    billObj['unitId'] = this.selectedAdvanceObj.hospitalID || 0;
    billObj['interimOrFinal'] = 1;
    billObj['companyRefNo'] = "";
    billObj['concessionAuthorizationName'] = 0;
    billObj['speTaxPer'] =   0;
    billObj['speTaxAmt'] =   0;
    billObj['discComments'] = this.InterimFormGroup.get('Remark').value || ''; 
    billObj['compDiscAmt'] = 0 ;
    billObj['cashCounterId'] = this.InterimFormGroup.get('CashCounterID').value || 0;

    let billDetailObj = []; 
    this.dataSource.data.forEach((element) => {
      let billDetailObj1 = {}; 
      billDetailObj1['billNo'] = 0;
      billDetailObj1['chargesId'] = element.chargesId; 
      billDetailObj.push(billDetailObj1);
    });  

    if (this.InterimFormGroup.get('paymode').value != 'PayOption') { 
      let Paymentobj = {};  
      Paymentobj['billNo'] = 0;
      Paymentobj['receiptNo'] = "";
      Paymentobj['paymentDate'] =  formattedDate;
      Paymentobj['paymentTime'] =  formattedTime;
      if(this.InterimFormGroup.get('paymode').value == 'cashpay'){
        Paymentobj['cashPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0;
      }else{
        Paymentobj['cashPayAmount'] = 0;
      } 
      Paymentobj['chequePayAmount'] = 0;
      Paymentobj['chequeNo'] = "";
      Paymentobj['bankName'] = "";
      Paymentobj['chequeDate'] =  formattedDate;
      Paymentobj['cardPayAmount'] = 0;
      Paymentobj['cardNo'] = "";
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
      Paymentobj['CashCounterId'] =  this.InterimFormGroup.get('CashCounterID').value || 0;
      Paymentobj['neftpayAmount'] = 0;
      Paymentobj['neftno'] = "";
      Paymentobj['neftbankMaster'] = "";
      Paymentobj['neftdate'] = formattedDate;
      if(this.InterimFormGroup.get('paymode').value == 'onlinepay'){
        Paymentobj['payTmamount'] = this.InterimFormGroup.get('NetpayAmount').value || 0,
        Paymentobj['payTmtranNo'] = this.InterimFormGroup.get('UPINO').value || 0;
      }else{
        Paymentobj['payTmamount'] = 0;
        Paymentobj['payTmtranNo'] = "";
      }  
      Paymentobj['payTmdate'] = formattedDate;
      Paymentobj['tdsAmount'] = 0;  

      let submitData = {  
        "addChargeM": interimBillChargesobj,
        "ipBillling": billObj,
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
    else if (this.InterimFormGroup.get('paymode').value == 'PayOption') {
      // let PatientHeaderObj = {};
      // PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName;
      // PatientHeaderObj['Date'] = formattedDate
      // PatientHeaderObj['UHIDNO'] =this.selectedAdvanceObj.regNo;
      // PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname;
      // PatientHeaderObj['IPDNo'] = this.selectedAdvanceObj.ipdno ;  
      // PatientHeaderObj['NetPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value
      // PatientHeaderObj['AdvanceAmount'] =  this.InterimFormGroup.get('NetpayAmount').value
      // PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.admissionId;
      // PatientHeaderObj['ComapanyId'] = this.selectedAdvanceObj.ompanyId;

      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = formattedDate
      PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName;
      PatientHeaderObj['RegNo'] = this.selectedAdvanceObj.regNo;
      PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname;
      PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj.companyName;
      PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj.departmentName;
      PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.admissionId;
      PatientHeaderObj['Age'] = this.selectedAdvanceObj.ageYear;
      PatientHeaderObj['NetPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value

      // const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
      //   {
      //     maxWidth: "95vw",
      //     height: '650px',
      //     width: '85%',
      //     data: {
      //       advanceObj: PatientHeaderObj,
      //       FromName: "IP-IntrimBIll"
      //     }
      //   });

      const dialogRef = this._matDialog.open(OpPaymentComponent,
        {
          maxWidth: "80vw",
          height: '650px',
          width: '80%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-IntrimBIll",
            advanceObj: PatientHeaderObj,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result)
        let submitData = {
          "addChargeM": interimBillChargesobj,
          "ipBillling": billObj,
          "billingDetails": billDetailObj,
          "payments": result.submitDataPay.ipPaymentInsert,
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
    this.dataSource.data = [];
    this.interimArray = [];
    this.InterimFormGroup.reset({
      NetpayAmount: [0],
      ConcessionId: '0',
      Remark: [''],
      TotalAmt: [0], 
      CashCounterID:[''],
      discPer: [0],
      concessionAmt: [0],
      paymode: ['cashpay'],
      UPINO: ['']
    })
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
  viewgetInterimBillReportPdf(billNo) {
    this.commonService.Onprint("BillNo", billNo, "IpInterimBill");
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
 
  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
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

