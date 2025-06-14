import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr'; 
import { ChargesList } from '../ip-search-list.component';
import { IPSearchListService } from '../ip-search-list.service'; 

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
  FinalNetAmt:any=0;
  selectedAdvanceObj: any;
  ConShow: boolean = false;
  DiscountFlag: boolean = false;
  onlineflag: boolean = false;
  interimArray: any = [];
  isLoading: String = '';
  InterimFooterForm: FormGroup;
  IPInterimBillForm:FormGroup;
  concessionId:any = 0; 
  currentDate = new Date();
  autocompleteModeConcession: string = "Concession";
  autocompleteModeCashCounter: string = "CashCounter";

  dataSource = new MatTableDataSource<ChargesList>(); 

  constructor(
    public _IpSearchListService: IPSearchListService, 
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
    @Inject(MAT_DIALOG_DATA) public data: any) {} 

  ngOnInit(): void {
    this.dataSource.data = []; 
     this.InterimFooterForm = this.CreateFooterForm();
     this.IPInterimBillForm = this.createInterimbillForm();
     this.InterimFooterForm.markAllAsTouched();  
     this.IPInterimBillForm.markAllAsTouched();  
    if (this.data) {
      console.log(this.data);
      this.dataSource.data  = this.data.Obj; 
      this.interimArray = this.dataSource.data 
      this.selectedAdvanceObj = this.data.PatientHeaderObj;  
      this.getNetAmtSum(); 
      this.IPInterimBillForm = this.createInterimbillForm();
    }  
  } 
  CreateFooterForm(): FormGroup {
    return this.formBuilder.group({  
        CashCounterID:[4,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),Validators.min(1)]], 
        TotalAmt: [0,[this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        discPer: [0, [Validators.min(0), Validators.max(100),this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAmt: [0, [Validators.min(0),this._FormvalidationserviceService.onlyNumberValidator()]],
        ConcessionId: [0,this._FormvalidationserviceService.onlyNumberValidator()], 
        NetpayAmount: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(),this._FormvalidationserviceService.onlyNumberValidator()]],
        paymode: ['cashpay'], 
        UPINO: [''], 
        Remark: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]], 
    });
  }  
  createInterimbillForm(): FormGroup {
    return this.formBuilder.group({
        //Addcharges
      addChargeM: this.formBuilder.group({
        chargesID:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      //ipInterim bill header  
      ipBillling: this.formBuilder.group({    
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdid: [this.selectedAdvanceObj?.admissionId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        totalAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        concessionAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        netPayableAmt: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        paidAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), this._FormvalidationserviceService.validDateValidator()]],
        opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        totalAdvanceAmount: [this.selectedAdvanceObj?.AdvTotalAmount ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        billTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        concessionReasonId: [this.concessionId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isSettled: false,
        isPrinted: true,
        isFree: true,
        companyId: [this.selectedAdvanceObj?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        tariffId: [this.selectedAdvanceObj?.tariffId, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        unitId: [this.selectedAdvanceObj?.hospitalID, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],
        interimOrFinal: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        companyRefNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
        concessionAuthorizationName: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxPer: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        speTaxAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        compDiscAmt: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        discComments: [0, [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],//need to set concession reason
        cashCounterId: [0, [this._FormvalidationserviceService.notEmptyOrZeroValidator(), this._FormvalidationserviceService.onlyNumberValidator()]],//need to set cashCounterId
      }),  
      // ✅ Fixed: should be FormArray
      billingDetails: this.formBuilder.array([]),
      //Payment form
      payments: this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        receiptNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        paymentDate: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        paymentTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        cashPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequePayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chequeNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        bankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        chequeDate: ['1999-01-01'],
        cardPayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        cardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardBankName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        cardDate: ['1999-01-01'],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionType: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        addBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1999-01-01'],
        neftpayAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        neftno: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftbankMaster: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        neftdate: ['1999-01-01'],
        payTmamount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        payTmtranNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
        payTmdate: ['1999-01-01'],
        tdsAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      })
    });
  }   
    createBillDetails(item: any): FormGroup {
      return this.formBuilder.group({
        billNo: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        chargesId: [item?.chargesId, [, this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      });
    } 
 
    // Getters 
    get BillDetailsArray(): FormArray { 
      return this.IPInterimBillForm.get('billingDetails') as FormArray;
    }   

  getNetAmtSum() { 
    this.FinalNetAmt =  this.interimArray.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0); 
    let totalAmt =  this.interimArray.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
    let discountAmount =  this.interimArray.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);
    if(discountAmount > 0){
      this.ConShow = true;
      this.DiscountFlag = true;
    } 
    else{
      this.ConShow = false;
      this.DiscountFlag = false;
    } 
    this.InterimFooterForm.patchValue({
      TotalAmt: totalAmt,
      NetpayAmount:   this.FinalNetAmt,
      concessionAmt:discountAmount
    });
  }  
  //Calculate Disc Amt
  calculateDiscPer() {  
    const perControl = this.InterimFooterForm.get("discPer");
    let  finalNetAmt = this.FinalNetAmt 
    if (!perControl.valid || perControl.value == 0 || perControl.value == '') {  
        this.ConShow = false 
        this.InterimFooterForm.patchValue({ 
          discPer:'',
          concessionAmt:'',
          NetpayAmount: Math.round(finalNetAmt),
        }, { emitEvent: false }); 
      this.toastr.error("Enter Discount % between 0-100");  
      return; 
    } 
    let percentage = perControl.value;
    let totalAmount = this.InterimFooterForm.get("TotalAmt").value; 
    let discountAmount = parseFloat((totalAmount * percentage / 100).toFixed(2));
   finalNetAmt = parseFloat((totalAmount - discountAmount).toFixed(2));
    this.ConShow = true;

    this.InterimFooterForm.patchValue({ 
      NetpayAmount: finalNetAmt,
      concessionAmt:discountAmount
    },{ emitEvent: false }); 
  } 
  //Calculate Disc Per
  calculateDiscamt() {   
    let discountAmount = this.InterimFooterForm.get("concessionAmt").value;
    let totalAmount = this.InterimFooterForm.get("TotalAmt").value;
    let  finalNetAmt = this.FinalNetAmt 
    if (discountAmount < 0 || discountAmount == 0 || discountAmount == '' || parseFloat(discountAmount) > parseFloat(totalAmount)) { 
      this.ConShow = false;
      this.InterimFooterForm.patchValue({ 
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
    this.InterimFooterForm.patchValue({
      discPer: percent,
      NetpayAmount: netAmount
    }, { emitEvent: false }); // Prevent infinite loop 
  } 
  onChangeReg(event) { 
    if (event.value == 'onlinepay') {
      this.onlineflag = true; 
      this.InterimFooterForm.get('UPINO').setValidators([Validators.required]);
      this.InterimFooterForm.get('UPINO').enable(); 
    } else {
      this.onlineflag = false;
      this.InterimFooterForm.get('UPINO').reset();
      this.InterimFooterForm.get('UPINO').clearValidators();
      this.InterimFooterForm.get('UPINO').updateValueAndValidity();
    }
  }  
  onSave() {
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(new Date(), 'shortTime');
    const formattedDate = datePipe.transform(new Date(), 'yyyy-MM-dd');
    debugger
    const formValue = this.InterimFooterForm.value
    if (formValue.discPer > 0 || formValue.concessionAmt > 0) {
      if (formValue.ConcessionId == '' || formValue.ConcessionId == null || formValue.ConcessionId == '0') {
        this.toastr.warning('Please select ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    this.IPInterimBillForm.get('ipBillling.totalAmt')?.setValue(this.InterimFooterForm.get('TotalAmt')?.value)
    this.IPInterimBillForm.get('ipBillling.concessionAmt')?.setValue(this.InterimFooterForm.get('concessionAmt')?.value)
    this.IPInterimBillForm.get('ipBillling.netPayableAmt')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
    this.IPInterimBillForm.get('ipBillling.paidAmt')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
    this.IPInterimBillForm.get('ipBillling.billDate').setValue(formattedDate)
    this.IPInterimBillForm.get('ipBillling.billTime').setValue(formattedTime)
    this.IPInterimBillForm.get('ipBillling.concessionReasonId')?.setValue(this.InterimFooterForm.get('ConcessionId')?.value)
    this.IPInterimBillForm.get('ipBillling.discComments')?.setValue(this.InterimFooterForm.get('Remark')?.value)
    this.IPInterimBillForm.get('ipBillling.cashCounterId')?.setValue(this.InterimFooterForm.get('CashCounterID')?.value)


    if (this.IPInterimBillForm.valid) {
      this.BillDetailsArray.clear();
      this.dataSource.data.forEach(item => {
        this.BillDetailsArray.push(this.createBillDetails(item as ChargesList));
      });

      if (this.InterimFooterForm.get('paymode').value == 'cashpay') {
        this.IPInterimBillForm.get('payments.cashPayAmount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
        this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
        this.IPInterimBillForm.get('payments.paymentTime').setValue(formattedTime)
        console.log("form values", this.IPInterimBillForm.value)
        this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
          this.viewgetInterimBillReportPdf(response);
          this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
          this.onClose()
        });
      }
      else if (this.InterimFooterForm.get('paymode').value == 'onlinepay') {
        this.IPInterimBillForm.get('payments.payTmamount')?.setValue(this.InterimFooterForm.get('NetpayAmount')?.value)
        this.IPInterimBillForm.get('payments.payTmtranNo').setValue(this.InterimFooterForm.get('UPINO')?.value)
        this.IPInterimBillForm.get('payments.payTmdate').setValue(formattedDate)
        this.IPInterimBillForm.get('payments.paymentDate').setValue(formattedDate)
        this.IPInterimBillForm.get('payments.paymentTime').setValue(formattedTime)
        console.log("form values", this.IPInterimBillForm.value)
        this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
          this.viewgetInterimBillReportPdf(response);
          this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
          this.onClose()
        });
      }
      else if (this.InterimFooterForm.get('paymode').value == 'PayOption') {
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate
        PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.patientName;
        PatientHeaderObj['RegNo'] = this.selectedAdvanceObj.regNo;
        PatientHeaderObj['DoctorName'] = this.selectedAdvanceObj.doctorname;
        PatientHeaderObj['CompanyName'] = this.selectedAdvanceObj.companyName;
        PatientHeaderObj['DepartmentName'] = this.selectedAdvanceObj.departmentName;
        PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.admissionId;
        PatientHeaderObj['Age'] = this.selectedAdvanceObj.ageYear;
        PatientHeaderObj['NetPayAmount'] = this.InterimFooterForm.get('NetpayAmount').value
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
          console.log(result.submitDataPay.ipPaymentInsert)
          this.IPInterimBillForm.get('payments').setValue(result.submitDataPay.ipPaymentInsert)

          console.log("form values", this.IPInterimBillForm.value)
          this._IpSearchListService.InsertInterim(this.IPInterimBillForm.value).subscribe(response => {
            this.viewgetInterimBillReportPdf(response);
            this.getWhatsappshareIPInterimBill(response, this.selectedAdvanceObj.mobileNo);
            this.onClose()
          });
        });
      }
    } else {
      let invalidFields = [];
      if (this.InterimFooterForm.invalid) {
        for (const controlName in this.InterimFooterForm.controls) {
          const control = this.InterimFooterForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`IP Interim Date : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`IP InterimBill From: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  } 
 
  onClose() {
    this.dataSource.data = [];
    this.interimArray = [];
    this.InterimFooterForm.reset({
      NetpayAmount: [0],
      ConcessionId: [0],
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
    selectChangeConcession(event) {  
    this.concessionId = event.value
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
 

