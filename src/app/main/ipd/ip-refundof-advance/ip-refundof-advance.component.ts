import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { AdvanceDataStored } from '../advance';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';

@Component({
  selector: 'app-ip-refundof-advance',
  templateUrl: './ip-refundof-advance.component.html',
  styleUrls: ['./ip-refundof-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPRefundofAdvanceComponent implements OnInit {
  displayedColumns = [
    'Date',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmt',
    'PreRefundAmt'
  ];

  screenFromString = 'Common-form';
  RefundOfAdvanceFormGroup: FormGroup;
  dateTimeObj: any;
  isLoadingStr: string = '';
  vMobileNo: any;
  currentDate = new Date();
  registerObj: any;
  AdvanceId: any;
  UsedAmount: number = 0;
  chargeList: any = [];

  autocompleteModeCashcounter: string = "CashCounter";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dsrefundlist = new MatTableDataSource<IPRefundofAdvance>();


  constructor(public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<IPRefundofAdvanceComponent>,
    private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    private advanceDataStored: AdvanceDataStored,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.RefundOfAdvanceFormGroup = this.createRefAdvForm();
    this.RefundOfAdvanceFormGroup.markAllAsTouched();
    if (this.data) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.getRefundofAdvanceListRegIdwise();
    } 
  }
  createRefAdvForm() {
    return this.formBuilder.group({
      CashCounterID: ['8', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],

      // refund header
      refundHeader: this.formBuilder.group({
        refundDate: ['', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
        refundTime: ['', [this._FormvalidationserviceService.notBlankValidator]],
        billId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
        this._FormvalidationserviceService.onlyNumberValidator]],
        opdIpdType: [true, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
        this._FormvalidationserviceService.onlyNumberValidator]],
        refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
        this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
        remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
        transactionId: [2, [this._FormvalidationserviceService.onlyNumberValidator, this._FormvalidationserviceService.notBlankValidator]],
        addedBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      }),

      //Advance update
      advanceHeaderupdate: this.formBuilder.group({
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
        this._FormvalidationserviceService.onlyNumberValidator]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
        this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      }),


      // AdvDetails: [
      //   { 
      //     advDetailId:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      // this._FormvalidationserviceService.onlyNumberValidator]],
      //      refundDate: ['', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
      //     refundTime: ['', [this._FormvalidationserviceService.notBlankValidator]], 
      //     advRefundAmt:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      // this._FormvalidationserviceService.onlyNumberValidator]],
      //   }
      // ],
      //     AdvDetailsUpdate: [
      //   {  
      //     advanceDetailID: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      // this._FormvalidationserviceService.onlyNumberValidator]],
      //     refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      // this._FormvalidationserviceService.onlyNumberValidator]],
      //     balanceAmount:[0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      // this._FormvalidationserviceService.onlyNumberValidator]],
      //   }
      // ]

      // ✅ Fixed: should be FormArray
      AdvDetailsnew: this.formBuilder.array([]),
      AdvDetailsUpdate: this.formBuilder.array([]),
    });
  } 
  createAdvDetailsnew(item: any): FormGroup {
    return this.formBuilder.group({
      advDetailId: [item.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      refundDate: [this.datePipe.transform(item.date, 'yyyy-MM-dd'),
      [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
      refundTime: [this.datePipe.transform(item.time, 'hh:mm'),
      [this._FormvalidationserviceService.notBlankValidator]],
      advRefundAmt: [item.refundAmt, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
    });
  }
  createAdvDetailsUpdate(item: any): FormGroup {
    return this.formBuilder.group({
      advanceDetailID: [item.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      refundAmount: [item.refundAmt, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      balanceAmount: [item.balanceAmount, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]]
    });
  }
  // Getters
  get advaDetailsArray(): FormArray { 
    return this.RefundOfAdvanceFormGroup.get('AdvDetailsnew') as FormArray;
  }
  get AdvDetailsUpdateArray(): FormArray { 
    return this.RefundOfAdvanceFormGroup.get('AdvDetailsUpdate') as FormArray;
  }

  onSave() {
    debugger
    //Assigning value to run time values to from control
    this.RefundOfAdvanceFormGroup.get('refundHeader.refundDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.RefundOfAdvanceFormGroup.get('refundHeader.refundTime').setValue(this.dateTimeObj.time)
    this.RefundOfAdvanceFormGroup.get('refundHeader.opdIpdId').setValue(this.registerObj.admissionId)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceUsedAmount').setValue(this.UsedAmount)
    this.RefundOfAdvanceFormGroup.get('refundHeader.advanceId').setValue(this.AdvanceId)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceId').setValue(this.AdvanceId)
    this.RefundOfAdvanceFormGroup.get('refundHeader.remark').setValue(this.RefundOfAdvanceFormGroup.get('remark').value)
    this.RefundOfAdvanceFormGroup.get('refundHeader.refundAmount').setValue(this.RefundOfAdvanceFormGroup.get('refundAmount').value)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.balanceAmount').setValue(this.RefundOfAdvanceFormGroup.get('balanceAmount').value)

    //getting data from table to array
    if (this.RefundOfAdvanceFormGroup.valid) {
      this.dsrefundlist.data.forEach(item => {
        this.advaDetailsArray.push(this.createAdvDetailsnew(item));
        this.AdvDetailsUpdateArray.push(this.createAdvDetailsUpdate(item));
      });
      //console.log('Saved Form Data:', this.RefundOfAdvanceFormGroup.value);

      let PatientHeaderObj = {};
      PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
        PatientHeaderObj['PatientName'] = this.registerObj.patientName;
      PatientHeaderObj['RegNo'] = this.registerObj.regNo,
        PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
      PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
      PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
      PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
      PatientHeaderObj['Age'] = this.registerObj.ageYear;
      PatientHeaderObj['NetPayAmount'] = this.RefundOfAdvanceFormGroup.get('refundAmount').value || 0;

      const dialogRef = this._matDialog.open(OpPaymentComponent,
        {
          maxWidth: "80vw",
          height: '650px',
          width: '80%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-RefundOfAdvance",
            advanceObj: PatientHeaderObj,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result.IsSubmitFlag) {
          console.log('============================== Return RefAdv ===========');
          let submitData = {
            "refund": this.RefundOfAdvanceFormGroup.value.refundHeader,
            "advanceHeaderupdate": this.RefundOfAdvanceFormGroup.value.advanceHeaderupdate,
            "advDetailRefund": this.RefundOfAdvanceFormGroup.value.AdvDetailsnew,
            "adveDetailupdate": this.RefundOfAdvanceFormGroup.value.AdvDetailsUpdate,
            "payment": result.submitDataPay.ipPaymentInsert
          };
          console.log(submitData);
          this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => {
            this.viewgetRefundofAdvanceReportPdf(response);
            this.getWhatsappsRefundAdvance(response, this.vMobileNo);
            this.onClose()
          });
        }
      });
    } else {
      let invalidFields = [];
      if (this.RefundOfAdvanceFormGroup.invalid) {
        for (const controlName in this.RefundOfAdvanceFormGroup.controls) {
          if (this.RefundOfAdvanceFormGroup.controls[controlName].invalid) {
            invalidFields.push(`${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return
      }
    }
  }

  onSaveold() {
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    const formValue = this.RefundOfAdvanceFormGroup.value;


    let invalidFields = [];
    if (this.RefundOfAdvanceFormGroup.invalid) {
      for (const controlName in this.RefundOfAdvanceFormGroup.controls) {
        if (this.RefundOfAdvanceFormGroup.controls[controlName].invalid) {
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

    if (formValue.NewRefundAmount == '' || formValue.NewRefundAmount == 0 || formValue.NewRefundAmount == null || formValue.NewRefundAmount == undefined) {
      this.toastr.warning('Enter a Refund Amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    let IPRefundofAdvanceObj = {};
    IPRefundofAdvanceObj['refundDate'] = formattedDate;
    IPRefundofAdvanceObj['refundTime'] = formattedTime;
    IPRefundofAdvanceObj['billId'] = 0;
    IPRefundofAdvanceObj['advanceId'] = this.AdvanceId;
    IPRefundofAdvanceObj['opdipdType'] = true;
    IPRefundofAdvanceObj['opdipdid'] = this.registerObj.admissionId || 0,
      IPRefundofAdvanceObj['refundAmount'] = this.RefundOfAdvanceFormGroup.get('NewRefundAmount').value || 0;
    IPRefundofAdvanceObj['remark'] = this.RefundOfAdvanceFormGroup.get("Remark").value;
    IPRefundofAdvanceObj['transactionId'] = 2;
    IPRefundofAdvanceObj['addedBy'] = this.accountService.currentUserValue.userId,
      IPRefundofAdvanceObj['isCancelled'] = false;
    IPRefundofAdvanceObj['isCancelledBy'] = 0;
    IPRefundofAdvanceObj['isCancelledDate'] = '1900-01-01';
    IPRefundofAdvanceObj['refundId'] = 0;

    let advanceHeaderupdate = {};
    advanceHeaderupdate['advanceId'] = this.AdvanceId;
    advanceHeaderupdate['advanceUsedAmount'] = this.UsedAmount;
    advanceHeaderupdate['balanceAmount'] = this.RefundOfAdvanceFormGroup.get('BalanceAdvance').value || 0;

    let advDetailRefundObj = [];
    this.dsrefundlist.data.forEach((element) => {
      let advDetailRefund = {};
      advDetailRefund['advDetailId'] = element.advanceDetailID || 0;
      advDetailRefund['refundDate'] = formattedDate;
      advDetailRefund['refundTime'] = formattedTime;
      advDetailRefund['advRefundAmt'] = element.refundAmt || 0;
      advDetailRefundObj.push(advDetailRefund)
    });

    let adveDetailupdateObj = [];
    this.dsrefundlist.data.forEach((element) => {
      let adveDetailupdate = {};
      adveDetailupdate['advanceDetailID'] = element.advanceDetailID || 0;
      adveDetailupdate['balanceAmount'] = element.balanceAmount || 0;
      adveDetailupdate['refundAmount'] = element.refundAmt || 0;
      adveDetailupdateObj.push(adveDetailupdate)
    });

    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
      PatientHeaderObj['PatientName'] = this.registerObj.patientName;
    PatientHeaderObj['RegNo'] = this.registerObj.regNo,
      PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
    PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
    PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
    PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
    PatientHeaderObj['Age'] = this.registerObj.ageYear;
    PatientHeaderObj['NetPayAmount'] = this.RefundOfAdvanceFormGroup.get('NewRefundAmount').value || 0;

    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-RefundOfAdvance",
          advanceObj: PatientHeaderObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result.IsSubmitFlag) {
        console.log('============================== Return RefAdv ===========');
        let submitData = {
          "refund": IPRefundofAdvanceObj,
          "advanceHeaderupdate": advanceHeaderupdate,
          "advDetailRefund": advDetailRefundObj,
          "adveDetailupdate": adveDetailupdateObj,
          "payment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => {
          console.log(response)
          this.toastr.success(response.message);
          this.viewgetRefundofAdvanceReportPdf(response);
          this.getWhatsappsRefundAdvance(response, this.vMobileNo);
          this.onClose()
          this._matDialog.closeAll();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    });
  }
  onClose() {
    this._IpSearchListService.myRefundAdvanceForm.reset();
    this.dsrefundlist.data = []
    this._matDialog.closeAll();
    this.RefundOfAdvanceFormGroup.markAllAsTouched();
  }


  getRefundofAdvanceListRegIdwise() {
    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "AdvanceId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegID",
          "fieldValue": String(this.registerObj.regId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    console.log(m_data)
    this._IpSearchListService.getRefundofAdvanceList(m_data).subscribe(response => {
      console.log(response)
      this.dsrefundlist.data = response.data
      this.chargeList = this.dsrefundlist.data
      console.log(this.dsrefundlist.data)
      this.dsrefundlist.sort = this.sort;
      this.dsrefundlist.paginator = this.paginator;
      this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : '';
      this.getRefundSum();
    });
  }

  //Refund Amount calculation
  getCellCalculation(element, RefundAmt) {
    console.log(element)
    if (RefundAmt > 0 && RefundAmt <= element.netBallAmt) {
      element.balanceAmount = ((element.netBallAmt) - (RefundAmt));
    }
    else if (parseInt(RefundAmt) > parseInt(element.netBallAmt)) {
      this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      element.refundAmt = ''
      element.balanceAmount = element.netBallAmt;
    }
    else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == undefined || RefundAmt == null) {
      element.refundAmt = ''
      element.balanceAmount = element.netBallAmt;
    }
    this.AdvanceId = element.advanceId
    this.UsedAmount += element.usedAmount
    this.getRefundSum();
  }
  getRefundSum() {
    let totalRefAmt = this.dsrefundlist.data.reduce((sum, { refundAmt }) => sum += +(refundAmt || 0), 0);
    const newBalAmt = this.dsrefundlist.data.filter(i => i.isCancelled == false)
    let totalBalAmt = newBalAmt.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0);

    this.RefundOfAdvanceFormGroup.patchValue({
      refundAmount: totalRefAmt,
      balanceAmount: totalBalAmt
    })

  }
  sIsLoading: string = '';
  viewgetRefundofAdvanceReportPdf(RefundId) {
    this.commonService.Onprint("RefundId", RefundId, "IpAdvanceRefundReceipt");
  }
  getWhatsappsRefundAdvance(el, vmono) {
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'IPREFADVANCE',
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
        this.toastr.success('IP Refund Of Advance Receipt Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
    });
  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      serviceName: [
        { name: "required", Message: "Service Name is required" },
      ],
      cashCounterId: [
        { name: "required", Message: "First Name is required" },

        { name: "pattern", Message: "only Number allowed." }
      ],
      NewRefundAmount: [
        {
          name: "pattern", Message: "only Number allowed."
        }
      ],
      BalanceAdvance: [{ name: "pattern", Message: "only Number allowed." }],
    }
  }
}

export class IPRefundofAdvance {
  RefundDate: Date;
  RefundTime: any;
  BillId: number;
  advanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  usedAmount: number;
  balanceAmount: number;
  RefundAmount: number;
  Remark: string;
  TransactionId: number;
  AddedBy: number;
  isCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: Date;
  RefundId: number;
  Date: any;
  refundAmount: any;
  advanceDetailID: any;
  refundAmt: any;  

  constructor(IPRefundofAdvanceObj) { 
    this.RefundDate = IPRefundofAdvanceObj.RefundDate || '0';
    this.RefundTime = IPRefundofAdvanceObj.RefundTime || '0';
    this.BillId = IPRefundofAdvanceObj.BillId || 0;
    this.advanceId = IPRefundofAdvanceObj.advanceId || '0';
    this.OPD_IPD_Type = IPRefundofAdvanceObj.OPD_IPD_Type || '0';
    this.OPD_IPD_ID = IPRefundofAdvanceObj.OPD_IPD_ID || '0';
    this.usedAmount = IPRefundofAdvanceObj.usedAmount || '0';
    this.balanceAmount = IPRefundofAdvanceObj.balanceAmount || '0';
    this.RefundAmount = IPRefundofAdvanceObj.RefundAmount || '0';
    this.Remark = IPRefundofAdvanceObj.Remark || '';
    this.TransactionId = IPRefundofAdvanceObj.TransactionId || 0;
    this.AddedBy = IPRefundofAdvanceObj.AddedBy || 0;
    this.isCancelled = IPRefundofAdvanceObj.isCancelled || false;
    this.IsCancelledBy = IPRefundofAdvanceObj.IsCancelledBy || 0;
    this.IsCancelledDate = IPRefundofAdvanceObj.IsCancelledDate || '';
    this.RefundId = IPRefundofAdvanceObj.RefundId || '0';
    this.Date = IPRefundofAdvanceObj.Date || '';
    this.refundAmount = IPRefundofAdvanceObj.refundAmount || 0;
    this.advanceDetailID = IPRefundofAdvanceObj.advanceDetailID || '0';
    this.refundAmt = IPRefundofAdvanceObj.refundAmt || '0';
  }
}
// export class IPRefundofAdvanceDetail {

//   AdvRefId: number;
//   AdvDetailId: number;
//   RefundDate: Date;
//   RefundTime: any;
//   AdvRefundAmt: number;
//   constructor(InsertIPRefundofAdvanceDetailObj) {

//     this.AdvRefId = InsertIPRefundofAdvanceDetailObj.AdvRefId || 0;
//     this.AdvDetailId = InsertIPRefundofAdvanceDetailObj.AdvDetailId || 0;
//     this.RefundDate = InsertIPRefundofAdvanceDetailObj.RefundDate || '';
//     this.RefundTime = InsertIPRefundofAdvanceDetailObj.RefundTime || '';
//     this.AdvRefundAmt = InsertIPRefundofAdvanceDetailObj.AdvRefundAmt || 0;

//   }
// }
// export class BrowseIpdreturnadvanceReceipt {
//   PaymentId: Number;
//   BillNo: Number;
//   RegNo: number;
//   RegId: number;
//   PatientName: string;
//   FirstName: string;
//   MiddleName: string;
//   LastName: string;
//   TotalAmt: number;
//   BalanceAmt: number;
//   GenderName: string;
//   Remark: string;
//   PaymentDate: any;
//   CashPayAmount: number;
//   ChequePayAmount: number;
//   CardPayAmount: number;
//   AdvanceUsedAmount: number;
//   AdvanceId: number;
//   RefundId: number;
//   IsCancelled: boolean;
//   AddBy: number;
//   UserName: string;
//   PBillNo: string;
//   ReceiptNo: string;
//   TransactionType: number;
//   PayDate: Date;
//   PaidAmount: number;
//   NEFTPayAmount: number;
//   PayTMAmount: number;
//   AddedBy: string;
//   HospitalName: string;
//   RefundAmount: number;
//   RefundNo: number;
//   HospitalAddress: string;
//   Phone: any;
//   EmailId: any;
//   Age: number;
//   AgeYear: number;
//   IPDNo: any;
//   NetPayableAmt: any;
//   RefundDate: any;
//   AdvanceAmount: any;
//   BalanceAmount: any;
//   /**
//    * Constructor
//    *
//    * @param BrowseIpdreturnadvanceReceipt
//    */
//   constructor(BrowseIpdreturnadvanceReceipt) {
//     {
//       this.PaymentId = BrowseIpdreturnadvanceReceipt.PaymentId || '';
//       this.BillNo = BrowseIpdreturnadvanceReceipt.BillNo || '';
//       this.RegNo = BrowseIpdreturnadvanceReceipt.RegNo || '';
//       this.RegId = BrowseIpdreturnadvanceReceipt.RegId || '';
//       this.PatientName = BrowseIpdreturnadvanceReceipt.PatientName || '';
//       this.FirstName = BrowseIpdreturnadvanceReceipt.FirstName || '';
//       this.MiddleName = BrowseIpdreturnadvanceReceipt.MiddleName || '';
//       this.LastName = BrowseIpdreturnadvanceReceipt.LastName || '';
//       this.TotalAmt = BrowseIpdreturnadvanceReceipt.TotalAmt || '';
//       this.BalanceAmt = BrowseIpdreturnadvanceReceipt.BalanceAmt || '';
//       this.Remark = BrowseIpdreturnadvanceReceipt.Remark || '';
//       this.PaymentDate = BrowseIpdreturnadvanceReceipt.PaymentDate || '';
//       this.CashPayAmount = BrowseIpdreturnadvanceReceipt.CashPayAmount || '';
//       this.ChequePayAmount = BrowseIpdreturnadvanceReceipt.ChequePayAmount || '';
//       this.CardPayAmount = BrowseIpdreturnadvanceReceipt.CardPayAmount || '';
//       this.AdvanceUsedAmount = BrowseIpdreturnadvanceReceipt.AdvanceUsedAmount || '';
//       this.AdvanceId = BrowseIpdreturnadvanceReceipt.AdvanceId || '';
//       this.RefundId = BrowseIpdreturnadvanceReceipt.RefundId || '';
//       this.IsCancelled = BrowseIpdreturnadvanceReceipt.IsCancelled || '';
//       this.AddBy = BrowseIpdreturnadvanceReceipt.AddBy || '';
//       this.UserName = BrowseIpdreturnadvanceReceipt.UserName || '';
//       this.ReceiptNo = BrowseIpdreturnadvanceReceipt.ReceiptNo || '';
//       this.PBillNo = BrowseIpdreturnadvanceReceipt.PBillNo || '';
//       this.TransactionType = BrowseIpdreturnadvanceReceipt.TransactionType || '';
//       this.PayDate = BrowseIpdreturnadvanceReceipt.PayDate || '';
//       this.PaidAmount = BrowseIpdreturnadvanceReceipt.PaidAmount || '';
//       this.NEFTPayAmount = BrowseIpdreturnadvanceReceipt.NEFTPayAmount || '';
//       this.PayTMAmount = BrowseIpdreturnadvanceReceipt.PayTMAmount || '';
//       this.HospitalName = BrowseIpdreturnadvanceReceipt.HospitalName;
//       this.RefundAmount = BrowseIpdreturnadvanceReceipt.RefundAmount || '';
//       this.RefundNo = BrowseIpdreturnadvanceReceipt.RefundNo || '';
//       this.GenderName = BrowseIpdreturnadvanceReceipt.GenderName || '';
//       this.AddedBy = BrowseIpdreturnadvanceReceipt.AddedBy || '';
//       this.HospitalAddress = BrowseIpdreturnadvanceReceipt.HospitalAddress || '';
//       this.AgeYear = BrowseIpdreturnadvanceReceipt.AgeYear || ''
//       this.IPDNo = BrowseIpdreturnadvanceReceipt.IPDNo || '';
//       this.Phone = BrowseIpdreturnadvanceReceipt.Phone || ''
//       this.EmailId = BrowseIpdreturnadvanceReceipt.EmailId || '';

//       this.NetPayableAmt = BrowseIpdreturnadvanceReceipt.NetPayableAmt || 0;
//       this.RefundDate = BrowseIpdreturnadvanceReceipt.RefundDate || '';
//       this.AdvanceAmount = BrowseIpdreturnadvanceReceipt.AdvanceAmount || 0;
//       this.BalanceAmount = BrowseIpdreturnadvanceReceipt.BalanceAmount || 0;
//     }

//   }
// }