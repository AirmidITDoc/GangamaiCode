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
        refundDate: ['', [this._FormvalidationserviceService.validDateValidator]],
        refundTime: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        billId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdType: [true],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator(),]],
        remark: [''],
        transactionId: [2],
        addedBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),

      //Advance update
      advanceHeaderupdate: this.formBuilder.group({
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator(), Validators.min(1)]],
      }),  
      // ✅ Fixed: should be FormArray
      AdvDetailsnew: this.formBuilder.array([]),
      AdvDetailsUpdate: this.formBuilder.array([]),
    });
  } 
  
  createAdvDetailsnew(item: any): FormGroup {
    return this.formBuilder.group({
      advDetailId: [item?.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
      this._FormvalidationserviceService.onlyNumberValidator()]],
      refundDate: [  this.convertToISODate(item?.date),
      [this._FormvalidationserviceService.validDateValidator()]],
      refundTime: [item?.time,
      []],
      advRefundAmt: [item?.refundAmt, [, this._FormvalidationserviceService.onlyNumberValidator()]],
    });
  }
  createAdvDetailsUpdate(item: any): FormGroup {
    return this.formBuilder.group({
      advanceDetailID: [item?.advanceDetailID, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
      this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [item?.refundAmt, [this._FormvalidationserviceService.onlyNumberValidator()]],
      balanceAmount: [item?.balanceAmount, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
      this._FormvalidationserviceService.onlyNumberValidator()]]
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
    this.RefundOfAdvanceFormGroup.get('refundHeader.opdIpdId').setValue(this.registerObj?.admissionId)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceUsedAmount').setValue(this.UsedAmount)
    this.RefundOfAdvanceFormGroup.get('refundHeader.advanceId').setValue(this.AdvanceId)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.advanceId').setValue(this.AdvanceId)
    this.RefundOfAdvanceFormGroup.get('refundHeader.remark').setValue(this.RefundOfAdvanceFormGroup.get('remark').value)
    this.RefundOfAdvanceFormGroup.get('refundHeader.refundAmount').setValue(this.RefundOfAdvanceFormGroup.get('refundAmount').value)
    this.RefundOfAdvanceFormGroup.get('advanceHeaderupdate.balanceAmount').setValue(this.RefundOfAdvanceFormGroup.get('balanceAmount').value)

    //getting data from table to array
    if (this.RefundOfAdvanceFormGroup.valid) {
      this.advaDetailsArray.clear();
      this.AdvDetailsUpdateArray.clear();
      this.dsrefundlist.data.forEach(item => {
        this.advaDetailsArray.push(this.createAdvDetailsnew(item as IPRefundofAdvance));
        this.AdvDetailsUpdateArray.push(this.createAdvDetailsUpdate(item as IPRefundofAdvance));
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
        if (result && result.IsSubmitFlag) { 
          let submitData = {
            "refund": this.RefundOfAdvanceFormGroup.value.refundHeader,
            "advanceHeaderupdate": this.RefundOfAdvanceFormGroup.value.advanceHeaderupdate,
            "advDetailRefund": this.RefundOfAdvanceFormGroup.value.AdvDetailsnew,
            "adveDetailupdate": this.RefundOfAdvanceFormGroup.value.AdvDetailsUpdate,
            "payment": result.submitDataPay.ipPaymentInsert
          };
         // console.log(submitData);
          this._IpSearchListService.insertIPRefundOfAdvance(submitData).subscribe(response => {
            this.viewgetRefundofAdvanceReportPdf(response);
            this.getWhatsappsRefundAdvance(response, this.vMobileNo);
            this.onClose()
          });
        }  
      });
    } else {
      let invalidFields = [];
      // if (this.RefundOfAdvanceFormGroup.invalid) {
      //   for (const controlName in this.RefundOfAdvanceFormGroup.controls) {
      //     if (this.RefundOfAdvanceFormGroup.controls[controlName].invalid) {
      //       invalidFields.push(`${controlName}`);
      //     }
      //   }
      // }

        if (this.RefundOfAdvanceFormGroup.invalid) {
            for (const controlName in this.RefundOfAdvanceFormGroup.controls) {
              const control = this.RefundOfAdvanceFormGroup.get(controlName);
    
              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`Refund of Advance Date : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`RefundOfAdvance From: ${controlName}`);
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
    this._IpSearchListService.getRefundofAdvanceList(m_data).subscribe(response => { 
      this.dsrefundlist.data = response.data
      this.chargeList = this.dsrefundlist.data 
      this.dsrefundlist.sort = this.sort;
      this.dsrefundlist.paginator = this.paginator;
      this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : '';
      this.getRefundSum();
    });
  }

  //Refund Amount calculation
  getCellCalculation(element, RefundAmt) { 
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
  //Date convert string to Date 
   convertToISODate(dateStr: string): string {
    const [day, month, year] = dateStr.split('/');
    return `${year}-${month}-${day}`;
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
  advRefundAmt:any;

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
     this.advRefundAmt = IPRefundofAdvanceObj.advRefundAmt || 0;
  }
}
 