import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { OPSearhlistService } from 'app/main/opd/op-search-list/op-searhlist.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { IPSearchListService } from '../ip-search-list.service';


@Component({
  selector: 'app-ip-advance',
  templateUrl: './ip-advance.component.html',
  styleUrls: ['./ip-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPAdvanceComponent implements OnInit { 
  AdvFormGroup: FormGroup;
  selectedAdvanceObj: any = [];
  screenFromString = 'advance-form';
  dateTimeObj: any;
  vAdvanceId: any = 0;
  vMobileNo: any;
  registerObj: any;
  //Advance Amt summary
  TotalAdvanceAmt: any = 0;
  TotalAdvUsedAmt: any = 0;
  TotalAdvaBalAmt: any = 0;
  TotalAdvRefAmt: any = 0;
  currentDate = new Date();
  AdmissionId: any = 0;
  autocompleteModeCashCounter: string = "CashCounter";

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    // Assign the template to the column dynamically 
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
  gridConfig: gridModel = {
    apiUrl: "Advance/PatientWiseAdvanceList",
    columnsList: this.AllColumns,
    sortField: "AdvanceDetailID",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
    ]
  }

  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private dialogRef: MatDialogRef<IPAdvanceComponent>,
    private accountService: AuthenticationService,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    public _FormvalidationserviceService: FormvalidationserviceService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {

    this.createAdvform();
    this.AdvFormGroup.markAllAsTouched();
    if (this.data) {
      this.registerObj = this.data?.Obj;
      console.log("Advance data:", this.registerObj)
      this.AdmissionId = this.registerObj?.admissionId

      if (this.AdmissionId > 0) {
        var vdata = {
          "first": 0,
          "rows": 10,
          "sortField": "AdmissionID",
          "sortOrder": 0,
          "filters": [
            {
              "fieldName": "AdmissionID",
              "fieldValue": String(this.AdmissionId),
              "opType": "Equals"
            }
          ],
          "Columns": [],
          "exportType": "JSON"
        }

        setTimeout(() => {
          this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
            this.selectedAdvanceObj = response.data;
            if (this.selectedAdvanceObj.length > 0)
              this.vAdvanceId = this.selectedAdvanceObj[0]?.advanceId ?? 0
            this.selectedAdvanceObj.forEach(element => {
              this.TotalAdvanceAmt += element.advanceAmount
              this.TotalAdvUsedAmt += element.usedAmount
              this.TotalAdvaBalAmt += element.balanceAmount
              this.TotalAdvRefAmt += element.refundAmount
            })
          });
        }, 500);
      }
      this.getdata(this.AdmissionId);
    }
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
        isCancelledDate: ['1900-01-01', [ this._FormvalidationserviceService.validDateValidator()]],
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]]
      }),
      // details 
      advanceDetail: this.formBuilder.group({
        date: ['', [ this._FormvalidationserviceService.validDateValidator()]],
        time: ['', [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
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
        isCancelledDate: ['1900-01-01', [ this._FormvalidationserviceService.validDateValidator()]],
        reason: [''],
        advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }), 
      //advanceupdate header
      advanceupdate: this.formBuilder.group({ 
        advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(),
        this._FormvalidationserviceService.onlyNumberValidator(), Validators.min(1)]]
      })
    });
  }

  onSave() { 
    debugger
    this.AdvFormGroup.get('advance.date').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.AdvFormGroup.get('advanceDetail.date').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.AdvFormGroup.get('advanceDetail.time').setValue(this.dateTimeObj.time)
    this.AdvFormGroup.get('advance.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
    this.AdvFormGroup.get('advanceDetail.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
    this.AdvFormGroup.get('advanceupdate.advanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
    this.AdvFormGroup.get('advance.advanceId').setValue(this.vAdvanceId)
     this.AdvFormGroup.get('advanceDetail.advanceId').setValue(this.vAdvanceId)
    this.AdvFormGroup.get('advanceupdate.advanceId').setValue(this.vAdvanceId)
    this.AdvFormGroup.get('advance.balanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
    this.AdvFormGroup.get('advanceDetail.balanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)
    this.AdvFormGroup.get('advanceDetail.reason').setValue(this.AdvFormGroup.get('reason')?.value) 
    this.AdvFormGroup.get('advance.opdIpdId').setValue(this.registerObj.admissionId)
    this.AdvFormGroup.get('advanceDetail.opdIpdId').setValue(this.registerObj.admissionId)
    this.AdvFormGroup.get('advanceDetail.refId').setValue(this.registerObj.regId)
    this.AdvFormGroup.get('advance.refId').setValue(this.registerObj.regId)
 
  if(this.AdvFormGroup.valid){
    console.log(this.AdvFormGroup.value)
    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
    PatientHeaderObj['PatientName'] = this.registerObj?.patientName;
    PatientHeaderObj['RegNo'] = this.registerObj?.regNo,
    PatientHeaderObj['DoctorName'] = this.registerObj?.doctorname;
    PatientHeaderObj['CompanyName'] = this.registerObj?.companyName;
    PatientHeaderObj['DepartmentName'] = this.registerObj?.departmentName;
    PatientHeaderObj['OPD_IPD_Id'] = this.registerObj?.ipdno;
    PatientHeaderObj['Age'] = this.registerObj?.ageYear;
    PatientHeaderObj['NetPayAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;

    const dialogRef = this._matDialog.open(OpPaymentComponent,
      {
        maxWidth: "80vw",
        height: '750px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "IP-Advance",
          advanceObj: PatientHeaderObj,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Payment Details', result);
      if (!this.AdvFormGroup.get('advanceupdate.advanceId').value) {
        let submitData = {
          "advance": this.AdvFormGroup.value.advance,
          "advanceDetail": this.AdvFormGroup.value.advanceDetail,
          "advancePayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {
          this.grid.bindGridData();
          this.viewgetAdvanceReceiptReportPdf(response);
          this.getWhatsappsAdvance(response, this.vMobileNo);
          this.onClose();
        });
      }
      else {
        let submitData = {
          "advance":  this.AdvFormGroup.value.advanceupdate,
          "advanceDetail":  this.AdvFormGroup.value.advanceDetail,
          "advancePayment": result.submitDataPay.ipPaymentInsert
        };
        console.log(submitData);
        this._IpSearchListService.UpdateAdvanceHeader(submitData).subscribe(response => {
          this.viewgetAdvanceReceiptReportPdf(response);
          this.getWhatsappsAdvance(response, this.vMobileNo);
          this.onClose();
        });
      }
    });
  }else{
  let invalidFields = [];
    // if (this.AdvFormGroup.invalid) {
    //   for (const controlName in this.AdvFormGroup.controls) {
    //     if (this.AdvFormGroup.controls[controlName].invalid) {
    //       invalidFields.push(`${controlName}`);
    //     }
    //   }
    // } 
       if (this.AdvFormGroup.invalid) {
            for (const controlName in this.AdvFormGroup.controls) {
              const control = this.AdvFormGroup.get(controlName);
    
              if (control instanceof FormGroup || control instanceof FormArray) {
                for (const nestedKey in control.controls) {
                  if (control.get(nestedKey)?.invalid) {
                    invalidFields.push(`Advance Date : ${controlName}.${nestedKey}`);
                  }
                }
              } else if (control?.invalid) {
                invalidFields.push(`Advance From: ${controlName}`);
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
    this.dialogRef.close();
    this.AdvFormGroup.reset()
    this.vAdvanceId = 0;
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getdata(data) {
    this.gridConfig = {
      apiUrl: "Advance/PatientWiseAdvanceList",
      columnsList: this.AllColumns,
      sortField: "AdvanceDetailID",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionID", fieldValue: String(this.AdmissionId), opType: OperatorComparer.Equals }
      ]
    }
  }
  getWhatsappsAdvance(el, vmono) {
    if (vmono != '' && vmono != "0") {
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
    this.commonService.Onprint("AdmissionID", this.registerObj.admissionId, "IpAdvanceStatement");
  }
  viewgetAdvanceReceiptReportPdf(data) {
    console.log(data)
    this.commonService.Onprint("AdvanceDetailID", data, "IpAdvanceReceipt");
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