import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
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
      this.registerObj = this.data.Obj;
      console.log("Advance data:", this.registerObj)
      this.AdmissionId = this.registerObj.admissionId

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
              this.vAdvanceId = this.selectedAdvanceObj[0].advanceId
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
      date: ['', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
      refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator,this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      advanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator, Validators.min(1)]],
      addedBy: [this.accountService.currentUserValue.userId],
      isCancelled: [false],
      isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
      advanceId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator,
      this._FormvalidationserviceService.onlyNumberValidator]],
      // details 
      time: ['', [this._FormvalidationserviceService.notBlankValidator]],
      transactionId: [2, [this._FormvalidationserviceService.onlyNumberValidator, this._FormvalidationserviceService.notBlankValidator]],
      usedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      reasonOfAdvanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
      reason: ['', [this._FormvalidationserviceService.allowEmptyStringValidator]],
      advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator]],
    });
  }

  onSave() {

    debugger
    this.AdvFormGroup.get('date').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
    this.AdvFormGroup.get('time').setValue(this.dateTimeObj.time)
    this.AdvFormGroup.get('opdIpdId').setValue(this.registerObj.admissionId)
    this.AdvFormGroup.get('refId').setValue(this.registerObj.regId)
    this.AdvFormGroup.get('advanceId').setValue(this.vAdvanceId)
    this.AdvFormGroup.get('balanceAmount').setValue(this.AdvFormGroup.get('advanceAmount').value)

    let invalidFields = [];
    if (this.AdvFormGroup.invalid) {
      for (const controlName in this.AdvFormGroup.controls) {
        if (this.AdvFormGroup.controls[controlName].invalid) {
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


    // Fields to not allowed for Advance header 
    const NotallowedFields = ['CashCounterID', 'time', 'transactionId', 'usedAmount', 'refundAmount', 'reasonOfAdvanceId', 'reason',
      'advanceDetailId'];
    // Get all form values
    const allValues = this.AdvFormGroup.value;
    // Filter out only the fields you want to save
    const AdvanceHeaderFormValues = this._FormvalidationserviceService.fromEntries(
      Object.entries(allValues).filter(([key]) => !NotallowedFields.includes(key))
    );
    console.log('Saving only selected values:', AdvanceHeaderFormValues);

    //For Advance Details
    // Fields to not allowed for Advance Details
    const NotallowedFieldsDetails = ['CashCounterID', 'advanceUsedAmount'];
    // Filter out only the fields you want to save
    const AdvanceDetailsFormValues = this._FormvalidationserviceService.fromEntries(
      Object.entries(allValues).filter(([key]) => !NotallowedFieldsDetails.includes(key))
    );
    console.log('Saving only selected values details :', AdvanceDetailsFormValues);

    //For Advance header Updates
    // Fields to not allowed for Advance Details 
    const NotallowedFieldsAdvUpdates = ['date', 'refId', 'opdIpdType', 'opdIpdId', 'advanceUsedAmount', 'balanceAmount', 'addedBy', 'isCancelled',
      'isCancelledBy', 'isCancelledDate', 'time', 'transactionId', 'usedAmount', 'refundAmount', 'reasonOfAdvanceId', 'reason', 'advanceUsedAmount',]
    // Filter out only the fields you want to save
    const AdvanceHeaderUpdateValues = this._FormvalidationserviceService.fromEntries(
      Object.entries(allValues).filter(([key]) => !NotallowedFieldsAdvUpdates.includes(key))
    );
    console.log('Saving only selected values header update  :', AdvanceHeaderUpdateValues);


    let PatientHeaderObj = {};
    PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
      PatientHeaderObj['PatientName'] = this.registerObj.patientName;
    PatientHeaderObj['RegNo'] = this.registerObj.regNo,
      PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
    PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
    PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
    PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
    PatientHeaderObj['Age'] = this.registerObj.ageYear;
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
      console.log('==============================  Advance Amount ===========', result);
      if (!this.AdvFormGroup.get('advanceId').value) {
        let submitData = {
          "advance": AdvanceHeaderFormValues,
          "advanceDetail": AdvanceDetailsFormValues,
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
          "advance": AdvanceHeaderUpdateValues,
          "advanceDetail": AdvanceDetailsFormValues,
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
  }

  // onSaveold() {
  //   const currentDate = new Date();
  //   const datePipe = new DatePipe('en-US');
  //   const formattedTime = datePipe.transform(currentDate, 'shortTime');
  //   const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');


  //      let invalidFields = []; 
  //     if (this.AdvFormGroup.invalid) {
  //       for (const controlName in this.AdvFormGroup.controls) {
  //         if (this.AdvFormGroup.controls[controlName].invalid) {
  //           invalidFields.push(`${controlName}`);
  //         }
  //       }
  //     } 
  //     if (invalidFields.length > 0) {
  //       invalidFields.forEach(field => {
  //         this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
  //         );
  //       });
  //     }

  //   let AdvanceAMt = this.AdvFormGroup.get('advanceAmount').value || 0; 
  //   if (AdvanceAMt == "" || AdvanceAMt == undefined || AdvanceAMt == 0 || AdvanceAMt == null) {
  //     this.toastr.warning('Please enter Advance Amount', 'warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  //   let CashCounter = this.AdvFormGroup.get('CashCounterID').value || 0;
  //   if (CashCounter == "" || CashCounter == undefined || CashCounter == null || CashCounter == '0') {
  //     this.toastr.warning('select Cash Counter Name', 'warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   } 

  //   let advanceHeaderObj = {};
  //   advanceHeaderObj['date'] = formattedDate || '1900-01-01';
  //   advanceHeaderObj['refId'] = this.registerObj.regId;
  //   advanceHeaderObj['opdIpdType'] = 1;
  //   advanceHeaderObj['opdIpdId'] = this.registerObj.admissionId;
  //   advanceHeaderObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;
  //   advanceHeaderObj['advanceUsedAmount'] = 0;
  //   advanceHeaderObj['balanceAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;
  //   advanceHeaderObj['addedBy'] = this.accountService.currentUserValue.userId;
  //   advanceHeaderObj['isCancelled'] = false;
  //   advanceHeaderObj['isCancelledBy'] = '0';
  //   advanceHeaderObj['isCancelledDate'] = '1900-01-01';
  //   advanceHeaderObj['advanceId'] = 0;

  //   let AdvanceDetObj = {};
  //   AdvanceDetObj['date'] = formattedDate || '1900-01-01';
  //   AdvanceDetObj['time'] = formattedTime || '1900-01-01';
  //   AdvanceDetObj['advanceId'] = this.vAdvanceId  || 0;
  //   AdvanceDetObj['refId'] = this.registerObj.regId;
  //   AdvanceDetObj['transactionId'] = 2;
  //   AdvanceDetObj['opdIpdId'] = this.registerObj.admissionId;
  //   AdvanceDetObj['opdIpdType'] = 1;
  //   AdvanceDetObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;
  //   AdvanceDetObj['usedAmount'] = 0;
  //   AdvanceDetObj['balanceAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;
  //   AdvanceDetObj['refundAmount'] = 0;
  //   AdvanceDetObj['reasonOfAdvanceId'] = 0;
  //   AdvanceDetObj['addedBy'] = this.accountService.currentUserValue.userId;
  //   AdvanceDetObj['isCancelled'] = false;
  //   AdvanceDetObj['isCancelledby'] = 0;
  //   AdvanceDetObj['isCancelledDate'] = '1900-01-01';
  //   AdvanceDetObj['reason'] = this.AdvFormGroup.get("reason").value;
  //   AdvanceDetObj['advanceDetailId'] = '0';

  //   let advanceHeaderUpdateObj = {};
  //   advanceHeaderUpdateObj['advanceAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;
  //   advanceHeaderUpdateObj['advanceId'] = this.vAdvanceId ;

  //   let PatientHeaderObj = {};
  //   PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '1900-01-01',
  //   PatientHeaderObj['PatientName'] = this.registerObj.patientName;
  //   PatientHeaderObj['RegNo'] = this.registerObj.regNo,
  //   PatientHeaderObj['DoctorName'] = this.registerObj.doctorname;
  //   PatientHeaderObj['CompanyName'] = this.registerObj.companyName;
  //   PatientHeaderObj['DepartmentName'] = this.registerObj.departmentName;
  //   PatientHeaderObj['OPD_IPD_Id'] = this.registerObj.ipdno;
  //   PatientHeaderObj['Age'] = this.registerObj.ageYear;
  //   PatientHeaderObj['NetPayAmount'] = this.AdvFormGroup.get('advanceAmount').value || 0;

  //   const dialogRef = this._matDialog.open(OpPaymentComponent,
  //     {
  //       maxWidth: "80vw",
  //       height: '750px',
  //       width: '80%',
  //       data: {
  //         vPatientHeaderObj: PatientHeaderObj,
  //         FromName: "IP-Advance",
  //         advanceObj: PatientHeaderObj,
  //       }
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('==============================  Advance Amount ===========', result);


  //     if (!this.vAdvanceId) {
  //       let submitData = {
  //         "advance": advanceHeaderObj,
  //         "advanceDetail": AdvanceDetObj,
  //         "advancePayment": result.submitDataPay.ipPaymentInsert
  //       };
  //       console.log(submitData);
  //       this._IpSearchListService.InsertAdvanceHeader(submitData).subscribe(response => {

  //         this.grid.bindGridData();
  //        this.viewgetAdvanceReceiptReportPdf(response);
  //         this.getWhatsappsAdvance(response, this.vMobileNo);
  //         this._matDialog.closeAll();
  //       } );
  //     }
  //     else {
  //       let submitData = {
  //         "advance": advanceHeaderUpdateObj,
  //         "advanceDetail": AdvanceDetObj,
  //         "advancePayment": result.submitDataPay.ipPaymentInsert
  //       };
  //       console.log(submitData);
  //       this._IpSearchListService.UpdateAdvanceHeader(submitData).subscribe(response => {  
  //         this.viewgetAdvanceReceiptReportPdf(response);
  //         this.getWhatsappsAdvance(response, this.vMobileNo);
  //         this.vAdvanceId = 0;
  //         this._matDialog.closeAll();
  //       } );
  //     }
  //   });

  //   this.AdvFormGroup.get('advanceAmount').reset(0);
  //   this.AdvFormGroup.get('reason').reset('');
  //   this.AdvFormGroup.get('CashCounterId').setValue(5);

  // } 
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