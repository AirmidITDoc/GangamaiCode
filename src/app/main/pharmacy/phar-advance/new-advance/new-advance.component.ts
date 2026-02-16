import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { OpPaymentComponent } from 'app/main/opd/op-search-list/op-payment/op-payment.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { PharAdvanceService } from '../phar-advance.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';

@Component({
  selector: 'app-new-advance',
  templateUrl: './new-advance.component.html',
  styleUrls: ['./new-advance.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewAdvanceComponent implements OnInit {

  dateTimeObj: any;
  screenFromString = 'Common-form';
  vRegNo: any;
  vPatienName: any;
  vadvanceAmount: any;
  vRegId: any;
  regObj: any;
  dsIpItemList = new MatTableDataSource<IpItemList>();
  insertForm: FormGroup
  MainForm: FormGroup

  @ViewChild('grid', { static: false }) grid: AirmidTableComponent;

  AllColumns = [
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Used Amt", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CardPay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "NeftPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PayTMPay", key: "payTmamount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.print, callback: (data: any) => {
            this.commonService.Onprint("AdvanceDetailID", data.advanceDetailId, "IPPharmaAdvanceReport");
          }
        }]
    }
  ]
  gridConfig: gridModel = {
    apiUrl: "Sales/PharAdvanceList",
    columnsList: this.AllColumns,
    sortField: "AdmissionID",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionID", fieldValue: "0", opType: OperatorComparer.Equals }, //String(this.vAdmissionID)
    ],
    row: 25
  }

  constructor(
    public _PharAdvanceService: PharAdvanceService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewAdvanceComponent>,
    private commonService: PrintserviceService,
  ) { }

  ngOnInit(): void {
    this.MainForm = this._PharAdvanceService.NewAdvanceForm
    this.MainForm.markAllAsTouched()
    this.insertForm = this.IPAdvacneFormInsert();
  }
  IPAdvacneFormInsert(): FormGroup {
    return this.formBuilder.group({

      pharmacyHeader: this.formBuilder.group({
        advanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),

      pharmacyAdvance: this.formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: [''],
        refId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()
        ]],
        addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
        storeId: [this._loggedService.currentUserValue.user.storeId],
        unitId:[this._loggedService.currentUserValue.user.unitId]
      }),

      pharmacyAdvanceDetails: this.formBuilder.group({
        advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date:  [''],
        time:  [''],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionId: [8, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        usedAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), Validators.minLength(1),
        this._FormvalidationserviceService.notEmptyOrZeroValidator()
        ]],
        refundAmount: [0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
        reasonOfAdvanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
        reason: [''],
        storeId: [this._loggedService.currentUserValue.user.storeId],
          unitId:[this._loggedService.currentUserValue.user.unitId]
      }), 
      paymentPharmacy: '' ,
      //New Payments
      // ✅ Fixed: should be FormArray
      tPayments: this.formBuilder.array([]),
    });
  }
    CreateModePaymentform(item: any): FormGroup {
    return this.formBuilder.group({
      paymentId: [item?.paymentId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: [item?.unitId ?? this._loggedService.currentUserValue.user.unitId],
      billNo: [item?.billNo ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdtype: [item?.opdipdtype ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      paymentDate: [item?.paymentDate ?? ''],
      paymentTime: [item?.paymentTime ?? ''],
      payAmount: [item?.payAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      tranNo: [item?.tranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      bankName: [item?.bankName ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      validationDate: [item?.validationDate ?? ''],
      advanceUsedAmount: [item?.advanceUsedAmount ?? 0, [this._FormvalidationserviceService.AllowDecimalNumberValidator()]],
      comments: [item?.comments ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      payMode: [item?.payMode ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranNo: [item?.onlineTranNo ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      onlineTranResponse: [item?.onlineTranResponse ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      companyId: [item?.companyId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      advanceId: [item?.advanceId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [item?.refundId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      cashCounterId: [item?.cashCounterId ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType: [item?.transactionType ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      isSelfOrcompany: [item?.isSelfOrcompany ?? 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      tranMode: ['PHAR', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
      createdBy: [item?.createdBy ?? this._loggedService.currentUserValue.userId],
      transactionLabel: [item?.transactionLabel ?? '', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly]],
    });
  }
  // Getters 
  get ModeOfPaymentsArray(): FormArray {
    return this.insertForm.get('tPayments') as FormArray;
    }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.regObj = obj
      console.log("Admitted patient:", this.regObj)
      this.vPatienName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.getAdvanceList(obj);
      this.getListdata(obj);
    }
  }
  getListdata(obj) {
    this.gridConfig = {
      apiUrl: "Sales/PharAdvanceList",
      columnsList: this.AllColumns,
      sortField: "AdmissionID",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionID", fieldValue: String(obj?.admissionID), opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = { ...this.gridConfig };
    this.grid.bindGridData();
  }
  vAdvanceId: any = 0;
  vAdvanceDetailID: any = 0;
  getAdvanceList(obj) {
    var m_data = {
      "first": 0,
      "rows": 9999,
      "sortField": "AdmissionID",
      "sortOrder": 0,
      "filters": [{ "fieldName": "AdmissionID", "fieldValue": String(obj.admissionID), "opType": "Equals" }],
      "exportType": "JSON",
      "columns": []
    }
    this._PharAdvanceService.getAdvanceList(m_data).subscribe(Visit => {
      this.dsIpItemList.data = Visit.data as IpItemList[];
      this.vAdvanceId = this.dsIpItemList.data[0]?.advanceId || 0;
      this.vAdvanceDetailID = this.dsIpItemList.data[0]?.advanceDetailId || 0; 
    });
  }
  onSave() {
    const formattedTime = this.dateTimeObj.time;
    const formattedDate = this.datePipe.transform(this.dateTimeObj.date,'yyyy-MM-dd');
    const FormattedDateTime = formattedDate + ' ' + formattedTime 
    if (!this.MainForm.get('RegID')?.value && !this.vRegId) {
      this.toastr.warning('Please Select Patient', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    this.insertForm?.get("pharmacyAdvance.advanceId")?.setValue(this.vAdvanceId || 0);
    this.insertForm?.get("pharmacyAdvance.advanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvance.date")?.setValue(formattedDate);
    this.insertForm?.get("pharmacyAdvance.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvance.refId")?.setValue(this.regObj?.regID || 0);
    this.insertForm?.get("pharmacyAdvance.opdIpdId")?.setValue(this.regObj?.admissionID || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.advanceId")?.setValue(this.vAdvanceId || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.advanceDetailId")?.setValue(this.vAdvanceDetailID || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.date")?.setValue(formattedDate);
    this.insertForm?.get("pharmacyAdvanceDetails.time")?.setValue(FormattedDateTime);
    this.insertForm?.get("pharmacyAdvanceDetails.advanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvanceDetails.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvanceDetails.reason")?.setValue(this.MainForm?.get('comment')?.value ?? '');
    this.insertForm?.get("pharmacyAdvanceDetails.refId")?.setValue(this.regObj?.regID || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.opdIpdId")?.setValue(this.regObj?.admissionID || 0);

    if (!this.insertForm?.invalid) {
      const PatientHeaderObj = {
        Date: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        PatientName: this.vPatienName || '',
        RegNo: this.regObj.regNo || '', 
        CompanyName: this.regObj.companyName || '',
        OPD_IPD_Id: this.regObj.ipdNo || '',
        Age: this.regObj.age || '',
        NetPayAmount: this.MainForm.get('advanceAmt').value || 0,
        AdvanceDetailId: 0,
        TransactionLabel:'ADVANCE' 
      };
      const dialogRef = this._matDialog.open(OpPaymentComponent,
        {
          maxWidth: "80vw",
          height: '650px',
          width: '80%',
          data: {
            vPatientHeaderObj: PatientHeaderObj,
            FromName: "IP-Pharma-Advance",
            advanceObj: PatientHeaderObj,
          }
        });
      dialogRef.afterClosed().subscribe(result => {
        if (result && result.submitDataPay) {
          if (!this.vAdvanceId) {
            this.insertForm?.get('paymentPharmacy')?.setValue(result.submitDataPay.ipPaymentInsert);
            this.ModeOfPaymentsArray.clear();
            result.submitDataPay.ipModePaymentInsert.forEach(item => {
              this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
            });
            this.ModeOfPaymentsArray.clear();
            result.submitDataPay.ipModePaymentInsert.forEach(item => {
              this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
            });
            this.insertForm.removeControl('pharmacyHeader');
            console.log(this.insertForm?.value);
            this._PharAdvanceService.InsertIpPharmaAdvance(this.insertForm.value).subscribe(response => { 
              this.viewgetIPAdvanceReportPdf(response);
              this._matDialog.closeAll();
              this.OnReset();
            });
          } else {
            this.insertForm.removeControl('pharmacyAdvance');
            this.insertForm?.get("pharmacyHeader.advanceId")?.setValue(this.vAdvanceId || 0);
            this.insertForm?.get("pharmacyHeader.advanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
            this.insertForm?.get("pharmacyHeader.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
            this.insertForm?.get('paymentPharmacy')?.setValue(result.submitDataPay.ipPaymentInsert);
            this.ModeOfPaymentsArray.clear();
            result.submitDataPay.ipModePaymentInsert.forEach(item => {
              this.ModeOfPaymentsArray.push(this.CreateModePaymentform(item));
            });
            console.log(this.insertForm?.value);
            this._PharAdvanceService.UpdateIpPharmaAdvance(this.insertForm.value).subscribe(response => { 
              this.viewgetIPAdvanceReportPdf(response);
              this._matDialog.closeAll();
              this.OnReset();
            });
          }
        }
      });
    } else {
      let invalidFields: string[] = [];
      if (this._PharAdvanceService.CreaterNewAdvanceForm().invalid) {
        for (const controlName in this._PharAdvanceService.CreaterNewAdvanceForm().controls) {
          if (this._PharAdvanceService.CreaterNewAdvanceForm().controls[controlName].invalid) {
            invalidFields.push(`Advance of Bill Footer: ${controlName}`);
          }
        }
      }
      // checks nested error 
      if (this.insertForm?.invalid) {
        for (const controlName in this.insertForm.controls) {
          const control = this.insertForm.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Nested : ${controlName}.${nestedKey}`);
              }
            }
          } else if (control?.invalid) {
            invalidFields.push(`MainForm: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }
  OnReset() {
    this.MainForm.reset();
    this.MainForm.get('Op_ip_id').setValue('1');
    this.MainForm.get('RegID').setValue('')
    this.dsIpItemList.data = [];
    this.vAdvanceId = 0;
    this.vAdvanceDetailID = 0;
    this._matDialog.closeAll();
  }
  viewgetIPAdvanceReportPdf(contact) {
    debugger;
    this.commonService.Onprint("AdvanceDetailID", contact, "PharamcyAdvanceReceipt");
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

  removeControls(group: FormGroup, controlNames: string[]) {
    controlNames.forEach(name => group?.removeControl(name));
  }
}
export class IpItemList {
  PatientName: string;
  Date: number;
  AdvanceNo: number;
  UsedAmount: any;
  AdvanceAmount: number;
  BalanceAmount: number;
  RefundAmount: number;
  UHIDNo: any;
  CashPay: any;
  ChequePay: any;
  CardPay: any;
  AdvanceId: any;
  OPD_IPD_Id: any;
  NeftPay: any;
  PayTMPay: any;
  UserName: any;
  AdvanceDetailID: any;
  advanceDetailId: any;
  advanceId: any;

  constructor(IpItemList) {
    {
      this.PatientName = IpItemList.PatientName || '';
      this.Date = IpItemList.Date || 0;
      this.AdvanceNo = IpItemList.AdvanceNo || 0;
      this.UHIDNo = IpItemList.UHIDNo || 0;
      this.AdvanceAmount = IpItemList.AdvanceAmount || 0;
      this.UsedAmount = IpItemList.UsedAmount || 0;
      this.BalanceAmount = IpItemList.BalanceAmount || 0;
      this.RefundAmount = IpItemList.RefundAmount || 0;
      this.AdvanceId = IpItemList.AdvanceId || 0;
      this.advanceId = IpItemList.advanceId || 0;
      this.OPD_IPD_Id = IpItemList.OPD_IPD_Id || 0;
      this.CashPay = IpItemList.CashPay || 0;
      this.ChequePay = IpItemList.ChequePay || 0;
      this.CardPay = IpItemList.CardPay || 0;
      this.NeftPay = IpItemList.NeftPay || 0;
      this.PayTMPay = IpItemList.PayTMPay || 0;
      this.UserName = IpItemList.UserName || '';
      this.advanceDetailId = IpItemList.advanceDetailId || 0
    }
  }
}
