import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { OpAdvanceService } from '../op-advance.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from '../../registration/registration.component';
import { gridModel } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-new-op-advance',
  templateUrl: './new-op-advance.component.html',
  styleUrls: ['./new-op-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOpAdvanceComponent {

  AdvFormGroup: FormGroup;
  searchFormGroup: FormGroup
  screenFromString = 'advance-form';
  dateTimeObj: any;
  RegId = 0;
  vPatientName: any;
  registerObj: any;
  TotalAdvanceAmt: any = 0;
  TotalAdvUsedAmt: any = 0;
  TotalAdvaBalAmt: any = 0;
  TotalAdvRefAmt: any = 0;
  autocompleteModeCashCounter: string = "CashCounter";

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  AllColumns = [
    { heading: "Advance Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
    { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
    { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
    { heading: "Used Amt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', width: 160, type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 230 },
    { heading: "Payment Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
    { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
    { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
    { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
    { heading: "NEFT Pay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
    { heading: "PayTM Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', width: 180, type: gridColumnTypes.amount },
    { heading: "Reason", key: "reason", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]

  constructor(
    public _opAdvanceService: OpAdvanceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private dialogRef: MatDialogRef<NewOpAdvanceComponent>,
    private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    public _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.createAdvform();
    this.AdvFormGroup.markAllAsTouched();
  }

  createSearchForm(): FormGroup {
    return this.formBuilder.group({
      RegId: [0]  // Initial value is 0
    });
  }

  createAdvform() {
    this.AdvFormGroup = this.formBuilder.group({
      CashCounterID: ['5', [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      reason: [''],

      advance: this.formBuilder.group({
        date: ['', [this._FormvalidationserviceService.validDateValidator]],
        refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdType: [1, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
      }),
      // details 
      advanceDetail: this.formBuilder.group({
        date: ['', [this._FormvalidationserviceService.validDateValidator()]],
        time: [''],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionId: [2],
        opdIpdType: [1],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        usedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        reasonOfAdvanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator()]],
        reason: [''],
        advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),
      //advanceupdate header
      advanceupdate: this.formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator(), Validators.min(1)]]
      })
    });
  }

  getSelectedObj(obj) {
    this.RegId = obj.value;
    if ((this.RegId ?? 0) > 0) {
      setTimeout(() => {
        this._opAdvanceService.getRegistraionById(this.RegId).subscribe((response) => {
          this.registerObj = response;
          this.vPatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
          console.log(response)
        });
      }, 500);
    }
  }

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.AllColumns,
    sortField: "AdvanceDetailID",
    sortOrder: 0,
    filters: [
      // { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
    ]
  }

  onSave() { }
  onClose() {
    this.dialogRef.close();
  }

   viewgetAdvanceReceiptReportPdf(data) {
    console.log(data)
    // this.commonService.Onprint("AdvanceDetailID",data.advanceDetailID || data, "IpAdvanceReceipt");
  }

    getStatementPrint() {
    this.commonService.Onprint("AdmissionID", this.registerObj.admissionId, "IpAdvanceStatement");
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

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

}
