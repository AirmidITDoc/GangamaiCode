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
  vAdmissionID: any;
  vIPDNo: any;
  vCompanyName: any;
  vDoctorName: any;
  vAge: any;
  vadvanceAmount: any;
  vRegId: any;
  vPatientType: any;
  vAdmissionTime: any;
  regObj: any;
  dsIpItemList = new MatTableDataSource<IpItemList>();
  insertForm: FormGroup
  MainForm: FormGroup

  @ViewChild('grid', { static: false }) grid: AirmidTableComponent;

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
  ) { }

  ngOnInit(): void {
    this.MainForm = this._PharAdvanceService.NewAdvanceForm
    this.MainForm.markAllAsTouched()
    this.insertForm = this.IPAdvacneFormInsert();
  }

  IPAdvacneFormInsert(): FormGroup {
    return this.formBuilder.group({

      pharmacyHeader: this.formBuilder.group({
        advanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),

      pharmacyAdvance: this.formBuilder.group({
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: '',
        refId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        advanceUsedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), Validators.minLength(1),
        this._FormvalidationserviceService.notEmptyOrZeroValidator()
        ]],
        addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
      }),

      pharmacyAdvanceDetails: this.formBuilder.group({
        advanceDetailId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        date: '',
        time: '',
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        refId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        transactionId: [2, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdType: [1, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdIpdId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        usedAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        balanceAmount: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), Validators.minLength(1),
        this._FormvalidationserviceService.notEmptyOrZeroValidator()
        ]],
        refundAmount: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        reasonOfAdvanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this._loggedService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: [false],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
        reason: [''],
        storeId: this._loggedService.currentUserValue.user.storeId || 0,
      }),

      paymentPharmacy: ''

    });
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  getSelectedObjIP(obj) {
    if ((obj.regID ?? 0) > 0) {
      this.regObj = obj
      console.log("Admitted patient:", this.regObj)
      this.vPatienName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.vAdmissionTime = obj.admissionTime
      this.vAdmissionID = obj.admissionID;
      this.vRegNo = obj.regNo;
      this.vRegId = obj.regID;
      this.vIPDNo = obj.ipdNo;
      this.vAge = obj.age;
      this.vCompanyName = obj.companyName;
      this.vDoctorName = obj.doctorName;
      this.getAdvanceList(obj);
      this.getListdata();
    }
  }

  AllColumns = [
    { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AdvanceNo", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "AdvanceAmount", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UsedAmount", key: "usedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "BalanceAmount", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "RefundAmount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CashPay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "ChequePay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "CardPay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "NeftPay", key: "neftPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "PayTMPay", key: "payTmamount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
    { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        { action: gridActions.print, callback: (data: any) => { } }]
    }
  ]
  gridConfig: gridModel = {
    apiUrl: "Sales/PharAdvanceList",
    columnsList: this.AllColumns,
    sortField: "AdmissionId",
    sortOrder: 0,
    filters: [
      { fieldName: "AdmissionId", fieldValue: "0", opType: OperatorComparer.Equals }, //String(this.vAdmissionID)
    ],
    row: 25
  }

  getListdata() {
    this.gridConfig = {
      apiUrl: "Sales/PharAdvanceList",
      columnsList: this.AllColumns,
      sortField: "AdmissionId",
      sortOrder: 0,
      filters: [
        { fieldName: "AdmissionId", fieldValue: String(this.vAdmissionID), opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = { ...this.gridConfig };
    this.grid.bindGridData();
  }

  vAdvanceId: any;
  vAdvanceDetailID: any;
  getAdvanceList(obj) {
    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "AdmissionId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "AdmissionId",
          "fieldValue": String(obj.admissionID),
          "opType": "Equals"
        }

      ],
      "exportType": "JSON",
      "columns": []
    }

    this._PharAdvanceService.getAdvanceList(m_data).subscribe(Visit => {
      debugger
      this.dsIpItemList.data = Visit.data as IpItemList[];
      this.vAdvanceId = this.dsIpItemList.data[0].advanceId;
      this.vAdvanceDetailID = this.dsIpItemList.data[0].advanceDetailId;
      console.log(this.dsIpItemList.data)
    });
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

  onSave() {
    if (!this.MainForm.get('RegID')?.value && !this.vRegId) {
      this.toastr.warning('Please Select Patient', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.vadvanceAmount == '' || this.vadvanceAmount == null || this.vadvanceAmount == undefined || this.vadvanceAmount == 0) {
      this.toastr.warning('Please enter advance amount', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
    }

    this.insertForm?.get("pharmacyAdvance.advanceId")?.setValue(this.vAdvanceId || 0);
    this.insertForm?.get("pharmacyAdvance.advanceAmount")?.setValue(Number(this.MainForm?.get('date')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvance.date")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
    this.insertForm?.get("pharmacyAdvance.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvance.refId")?.setValue(this.vRegId || 0);
    this.insertForm?.get("pharmacyAdvance.opdIpdId")?.setValue(this.vAdmissionID || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.advanceId")?.setValue(this.vAdvanceId || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.advanceDetailId")?.setValue(this.vAdvanceDetailID || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.date")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
    this.insertForm?.get("pharmacyAdvanceDetails.time")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'shortTime'));
    this.insertForm?.get("pharmacyAdvanceDetails.advanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvanceDetails.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
    this.insertForm?.get("pharmacyAdvanceDetails.reason")?.setValue(this.MainForm?.get('comment')?.value ?? 0);
    this.insertForm?.get("pharmacyAdvanceDetails.refId")?.setValue(this.vRegId || 0);
    this.insertForm?.get("pharmacyAdvanceDetails.opdIpdId")?.setValue(this.vAdmissionID || 0);

    if (!this.insertForm?.invalid) {
      const PatientHeaderObj = {
        Date: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        PatientName: this.vPatienName,
        RegNo: this.vRegNo,
        DoctorName: this.vDoctorName,
        CompanyName: this.vCompanyName,
        OPD_IPD_Id: this.vIPDNo,
        Age: this.vAge,
        NetPayAmount: this.MainForm.get('advanceAmt').value || 0,
        AdvanceDetailId: this.vAdvanceDetailID || 0,
      };

      if (!this.vAdvanceId) {

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
            this.insertForm?.get('paymentPharmacy')?.setValue(result.submitDataPay.ipPaymentInsert);
            this.insertForm.removeControl('pharmacyHeader');

            console.log(this.insertForm?.value);
            this._PharAdvanceService.InsertIpPharmaAdvance(this.insertForm.value).subscribe(response => {
              this.viewgetIPAdvanceReportPdf(response);
              this._matDialog.closeAll();
              this.onClose();
            });
          }
        });

      }
      else {
        // const pharmacyAdvanceGroup = this.insertForm?.get('pharmacyAdvance') as FormGroup;
        // this.removeControls(pharmacyAdvanceGroup, [
        //   'date', 'refId', 'opdIpdType', 'opdIpdId','advanceUsedAmount', 'addedBy', 'isCancelled','isCancelledBy', 'isCancelledDate']);
        this.insertForm.removeControl('pharmacyAdvance');
        this.insertForm?.get("pharmacyHeader.advanceId")?.setValue(this.vAdvanceId || 0);
        this.insertForm?.get("pharmacyHeader.advanceAmount")?.setValue(Number(this.MainForm?.get('date')?.value ?? 0));
        this.insertForm?.get("pharmacyHeader.balanceAmount")?.setValue(Number(this.MainForm?.get('advanceAmt')?.value ?? 0));
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
            this.insertForm?.get('paymentPharmacy')?.setValue(result.submitDataPay.ipPaymentInsert);

            console.log(this.insertForm?.value);
            this._PharAdvanceService.InsertIpPharmaAdvance(this.insertForm.value).subscribe(response => {
              this.viewgetIPAdvanceReportPdf(response);
              this._matDialog.closeAll();
              this.onClose();
            });
          }
        });
      }
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

  //  onSave() {
  //     if (!this.MainForm.get('RegID')?.value && !this.vRegId) {
  //         this.toastr.warning('Please Select Patient', 'Warning!', {
  //           toastClass: 'tostr-tost custom-toast-warning',
  //         });
  //         return;
  //       }
  //     if (this.vadvanceAmount == '' || this.vadvanceAmount == null || this.vadvanceAmount == undefined || this.vadvanceAmount == 0) {
  //       this.toastr.warning('Please enter advance amount', 'Warning !', {
  //         toastClass: 'tostr-tost custom-toast-warning',
  //       });
  //     }
  //     if (!this.vAdvanceId) {
  //       let insertPHAdvanceObj = {};
  //       insertPHAdvanceObj['advanceID'] = 0;
  //       insertPHAdvanceObj['date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')
  //       insertPHAdvanceObj['refId'] = this.vRegId || 0;
  //       insertPHAdvanceObj['opdIpdType'] = 1;
  //       insertPHAdvanceObj['opdIpdId'] = this.vAdmissionID || 0;
  //       insertPHAdvanceObj['advanceAmount'] = Number(this.MainForm.get('advanceAmt').value) || 0;
  //       insertPHAdvanceObj['advanceUsedAmount'] = 0;
  //       insertPHAdvanceObj['balanceAmount'] = Number(this.MainForm.get('advanceAmt').value) || 0;
  //       insertPHAdvanceObj['addedBy'] = this._loggedService.currentUserValue.userId;
  //       insertPHAdvanceObj['isCancelled'] = false;
  //       insertPHAdvanceObj['isCancelledBy'] = 0;
  //       insertPHAdvanceObj['isCancelledDate'] = '1900-01-01'

  //       let insertPHAdvanceDetailobj = {};
  //       insertPHAdvanceDetailobj['advanceDetailID'] = 0;
  //       insertPHAdvanceDetailobj['date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd')
  //       insertPHAdvanceDetailobj['time'] = this.datePipe.transform(this.dateTimeObj.date, 'shortTime')
  //       insertPHAdvanceDetailobj['advanceId'] = 0;
  //       insertPHAdvanceDetailobj['refId'] = this.vRegId || 0;
  //       insertPHAdvanceDetailobj['transactionId'] = 2;
  //       insertPHAdvanceDetailobj['opdIpdId'] = this.vAdmissionID || 0;
  //       insertPHAdvanceDetailobj['opdIpdType'] = 1;
  //       insertPHAdvanceDetailobj['advanceAmount'] = Number(this.MainForm.get('advanceAmt').value);
  //       insertPHAdvanceDetailobj['usedAmount'] = 0;
  //       insertPHAdvanceDetailobj['balanceAmount'] = Number(this.MainForm.get('advanceAmt').value);
  //       insertPHAdvanceDetailobj['refundAmount'] = 0;
  //       insertPHAdvanceDetailobj['reasonOfAdvanceId'] = 0;
  //       insertPHAdvanceDetailobj['addedBy'] = this._loggedService.currentUserValue.userId;
  //       insertPHAdvanceDetailobj['isCancelled'] = false;
  //       insertPHAdvanceDetailobj['isCancelledBy'] = 0;
  //       insertPHAdvanceDetailobj['isCancelledDate'] = '1900-01-01';
  //       insertPHAdvanceDetailobj['reason'] = this.MainForm.get('comment').value || '';
  //       insertPHAdvanceDetailobj['storeId'] = this._loggedService.currentUserValue.user.storeId || 0;

  //       debugger
  //        const PatientHeaderObj = {
  //         Date: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
  //         PatientName: this.vPatienName,
  //         RegNo: this.vRegNo, 
  //         DoctorName: this.vDoctorName, 
  //         CompanyName: this.vCompanyName, 
  //         OPD_IPD_Id: this.vIPDNo, 
  //         Age: this.vAge,
  //         NetPayAmount: this.MainForm.get('advanceAmt').value || 0,
  //       };

  //       const dialogRef = this._matDialog.open(OpPaymentComponent,
  //         {
  //           maxWidth: "80vw",
  //           height: '650px',
  //           width: '80%',
  //           data: {
  //             vPatientHeaderObj: PatientHeaderObj,
  //             FromName: "IP-Pharma-Advance",
  //             advanceObj: PatientHeaderObj,
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log('==============================  Advance Amount ===========', result);

  //          if (result && result.submitDataPay) {

  //           let submitData = {
  //           "pharmacyAdvance": insertPHAdvanceObj,
  //           "pharmacyAdvanceDetails": insertPHAdvanceDetailobj,
  //           "paymentPharmacy": result.submitDataPay.ipPaymentInsert
  //         };
  //         console.log(submitData);
  //           this._PharAdvanceService.InsertIpPharmaAdvance(submitData).subscribe(response => {

  //             this.viewgetIPAdvanceReportPdf(response);
  //             this._matDialog.closeAll();
  //             this.onClose();
  //         });
  //         }
  //       });

  //     }
  //     else {
  //       let updatePHAdvanceObj = {};
  //       updatePHAdvanceObj['advanceAmount'] = this.MainForm.get('advanceAmt').value || 0
  //       updatePHAdvanceObj['balanceAmount'] = this.MainForm.get('advanceAmt').value || 0
  //       updatePHAdvanceObj['advanceId'] = this.vAdvanceId || 0;

  //       let insertPHAdvanceDetailobj = {};
  //       insertPHAdvanceDetailobj['advanceDetailID'] = this.vAdvanceDetailID || 0;
  //       insertPHAdvanceDetailobj['date'] = this.dateTimeObj.date;
  //       insertPHAdvanceDetailobj['time'] = this.dateTimeObj.time;
  //       insertPHAdvanceDetailobj['advanceId'] = this.vAdvanceId || 0;
  //       insertPHAdvanceDetailobj['refId'] = this.vRegId || 0;
  //       insertPHAdvanceDetailobj['transactionId'] = 2;
  //       insertPHAdvanceDetailobj['opD_IPD_Type'] = 1;
  //       insertPHAdvanceDetailobj['opD_IPD_Id'] = this.vAdmissionID || 0;
  //       insertPHAdvanceDetailobj['advanceAmount'] = this.MainForm.get('advanceAmt').value;
  //       insertPHAdvanceDetailobj['usedAmount'] = 0;
  //       insertPHAdvanceDetailobj['balanceAmount'] = this.MainForm.get('advanceAmt').value;
  //       insertPHAdvanceDetailobj['refundAmount'] = 0;
  //       insertPHAdvanceDetailobj['reasonOfAdvanceId'] = 0;
  //       insertPHAdvanceDetailobj['addedBy'] = this._loggedService.currentUserValue.userId;
  //       insertPHAdvanceDetailobj['isCancelled'] = false;
  //       insertPHAdvanceDetailobj['isCancelledBy'] = 0;
  //       insertPHAdvanceDetailobj['isCancelledDate'] = this.dateTimeObj.date;
  //       insertPHAdvanceDetailobj['reason'] = this.MainForm.get('comment').value || '';
  //       insertPHAdvanceDetailobj['storeId'] = this._loggedService.currentUserValue.storeId || 0;

  //       let PatientHeaderObj = {};
  //       // PatientHeaderObj['Date'] = this.dateTimeObj.date || '01/01/1900'
  //       // PatientHeaderObj['OPD_IPD_Id'] = this.vIPDNo;
  //       // PatientHeaderObj['PatientName'] = this.vPatienName;
  //       // PatientHeaderObj['UHIDNO'] = this.vRegNo;
  //       // PatientHeaderObj['BillId'] = 0;
  //       // PatientHeaderObj['DoctorName'] = this.vDoctorName;
  //       // PatientHeaderObj['NetPayAmount'] = this.MainForm.get('advanceAmt').value || 0;

  //       // const dialogRef = this._matDialog.open(OPAdvancePaymentComponent,
  //       //   {
  //       //     maxWidth: "90vw",
  //       //     height: '640px',
  //       //     width: '70%',

  //       //     data: {
  //       //       vPatientHeaderObj: PatientHeaderObj,
  //       //       FromName: "IP-Pharma-Advance",
  //       //       advanceObj: PatientHeaderObj,
  //       //     }
  //       //   });
  //       PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //         PatientHeaderObj['PatientName'] = this.vPatienName;
  //       PatientHeaderObj['RegNo'] = this.vRegNo;
  //       PatientHeaderObj['DoctorName'] = this.vDoctorName;
  //       PatientHeaderObj['CompanyName'] = this.vCompanyName;
  //       PatientHeaderObj['OPD_IPD_Id'] = this.vIPDNo;
  //       PatientHeaderObj['Age'] = this.vAge;
  //       PatientHeaderObj['NetPayAmount'] = this.MainForm.get('advanceAmt').value || 0;
  //       const dialogRef = this._matDialog.open(OpPaymentComponent,
  //         {
  //           maxWidth: "80vw",
  //           height: '650px',
  //           width: '80%',
  //           data: {
  //             vPatientHeaderObj: PatientHeaderObj,
  //             FromName: "IP-Pharma-Advance",
  //             advanceObj: PatientHeaderObj,
  //           }
  //         });
  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log('==============================  Advance Amount ===========');

  //         let submitData = {
  //           "updatePHAdvance": updatePHAdvanceObj,
  //           "insertPHAdvanceDetail": insertPHAdvanceDetailobj,
  //           "insertPHPayment": result.submitDataPay.ipPaymentInsert
  //         };
  //         console.log(submitData);
  //         this._PharAdvanceService.UpdateIpPharmaAdvance(submitData).subscribe(response => {
  //           if (response) {
  //             this.toastr.success('IP Pharma Advance data Updated Successfully !', 'Updated !', {
  //               toastClass: 'tostr-tost custom-toast-success',
  //             });
  //             this._matDialog.closeAll();
  //             this.onClose();
  //             this.viewgetIPAdvanceReportPdf(response);
  //           } else {
  //             this.toastr.success('IP Pharma Advance data not Updated !', 'error !', {
  //               toastClass: 'tostr-tost custom-toast-success',
  //             });
  //           }
  //           this.isLoading = '';
  //         });

  //       });
  //     }

  //   }

  viewgetIPAdvanceReportPdf(contact) {

  }

  onClose() {
    this._matDialog.closeAll();
    this.OnReset();
  }
  OnReset() {
    this.MainForm.reset();
    this.MainForm.get('Op_ip_id').setValue('1');
    this.dsIpItemList.data = [];
  }

  inputValue = '';
  chips: string[] = [];

  allOptions: string[] = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry'];
  filteredOptions: string[] = [...this.allOptions];

  handleEnter() {
    this.addChip(this.inputValue.trim());
  }

  handleChange() {
    // Called when selecting from datalist
    this.addChip(this.inputValue.trim());
  }



  addChip(value: string) {
    value = value.trim();
    if (!value) return;

    const isDuplicate = this.chips.includes(value);

    if (!isDuplicate) {
      this.chips.push(value);
    }

    this.inputValue = '';
    this.filteredOptions = [...this.allOptions];
  }


  removeChip(value: string) {
    this.chips = this.chips.filter(chip => chip !== value);
  }

  filterOptions() {
    const filter = this.inputValue.toLowerCase();
    this.filteredOptions = this.allOptions.filter(option =>
      option.toLowerCase().includes(filter)
    );
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
