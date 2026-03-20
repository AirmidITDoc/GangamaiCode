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
import { OpRefundOfAdvanceService } from '../../op-refund-of-advance/op-refund-of-advance.service';

@Component({
  selector: 'app-new-refund-of-advance',
  templateUrl: './new-refund-of-advance.component.html',
  styleUrls: ['./new-refund-of-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRefundOfAdvanceComponent {
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
  searchFormGroup: FormGroup
  dateTimeObj: any;
  registerObj: any;
  AdvanceId: any;
  UsedAmount: number = 0;
  chargeList: any = [];
  isLoadingStr: string = '';
  autocompleteModeCashcounter: string = "CashCounter";
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  RegId = 0;
  vPatientName: any;
  dsrefundlist = new MatTableDataSource<OPRefundofAdvance>();

  constructor(public _opSearchListService: OpRefundOfAdvanceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NewRefundOfAdvanceComponent>,
    private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: UntypedFormBuilder,) { }

  ngOnInit(): void {
    this.RefundOfAdvanceFormGroup = this.createRefAdvForm();
    this.RefundOfAdvanceFormGroup.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    if (this.data) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.getRefundofAdvanceListRegIdwise();
    }
  }

    createSearchForm(): FormGroup {
    return this.formBuilder.group({
      RegId: [0]  // Initial value is 0
    });
  }

  createRefAdvForm() {
    return this.formBuilder.group({
      CashCounterID: ['8', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      refundAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator, Validators.min(0)]],
      remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],

      // refund header
      refundHeader: this.formBuilder.group({
        refundDate: ['', [this._FormvalidationserviceService.validDateValidator()]],
        refundTime: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
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
        balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
      }),
      // ✅ Fixed: should be FormArray
      AdvDetailsnew: this.formBuilder.array([]),
      AdvDetailsUpdate: this.formBuilder.array([]),
    });
  }

    getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((this.RegId ?? 0) > 0) {
      setTimeout(() => {
        this._opSearchListService.getRegistraionById(this.RegId).subscribe((response) => {
          this.registerObj = response;
          this.vPatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
          console.log(response)
        });
      }, 500);
    }
  }

  onSave(){

  }
  
  getRefundofAdvanceListRegIdwise() {
    // var m_data = {
    //   "first": 0,
    //   "rows": 10,
    //   "sortField": "AdvanceId",
    //   "sortOrder": 0,
    //   "filters": [
    //     {
    //       "fieldName": "RegID",
    //       "fieldValue": String(this.registerObj.regId),
    //       "opType": "Equals"
    //     }
    //   ],
    //   "Columns": [],
    //   "exportType": "JSON"
    // } 
    // this._opSearchListService.getRefundofAdvanceList(m_data).subscribe(response => { 
    //   this.dsrefundlist.data = response.data
    //   this.chargeList = this.dsrefundlist.data 
    //   this.dsrefundlist.sort = this.sort;
    //   this.dsrefundlist.paginator = this.paginator;
    //   this.isLoadingStr = this.dsrefundlist.data.length == 0 ? 'no-data' : '';
    //   this.getRefundSum();
    // });
  }

  getRefundSum() {
    const totalRefAmt = this.dsrefundlist.data.reduce((sum, { refundAmt }) => sum += +(refundAmt || 0), 0);
    const newBalAmt = this.dsrefundlist.data.filter(i => i.isCancelled == false)
    const totalBalAmt = newBalAmt.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0);

    this.RefundOfAdvanceFormGroup.patchValue({
      refundAmount: totalRefAmt,
      balanceAmount: totalBalAmt
    })
  }

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

  onClose() {
    this._opSearchListService.myRefundAdvanceForm.reset();
    this.dsrefundlist.data = []
    this._matDialog.closeAll();
    this.RefundOfAdvanceFormGroup.markAllAsTouched();
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
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

export class OPRefundofAdvance {
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
  advRefundAmt: any;

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