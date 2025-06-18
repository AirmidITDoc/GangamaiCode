import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component'; 
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { PaymentInsert } from '../appointment-list/appointment-billing/appointment-billing.component';
import { VisitMaster1 } from '../appointment-list/appointment-list.component';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import { RegInsert } from '../registration/registration.component';
import { RefundbillService } from './refundbill.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-refundbill',
  templateUrl: './refundbill.component.html',
  styleUrls: ['./refundbill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RefundbillComponent implements OnInit {

  displayedColumns1 = [
    'serviceName',
    'price',
    'qty',
    'ServiceWiseDisc',
    'netAmount',
    'chargesDocName',
    'refAmount',
    'balanceAmount',
    'refundAmount'
  ];
 @ViewChild('grid') grid: AirmidTableComponent;
    allColumns1 = [
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA' , type: 6},
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Bill Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: 22}
  ]  
  gridConfig: gridModel = {
    apiUrl: "RefundOfBill/OPBilllistforrefundList",
    columnsList: this.allColumns1,
    sortField: "BillNo",
    sortOrder: 0,
    filters:  [  { fieldName: "RegId", fieldValue: '0', opType: OperatorComparer.Equals }  ] 
  } 
 
  screenFromString = 'Common-form'; 
  searchFormGroup: FormGroup; 
  RefundOfBillFormFooter:FormGroup
  vRefundOfBillFormGroup:FormGroup
  dateTimeObj: any; 
  currentDate = new Date();
  isLoadingStr: string = ''; 
  registerObj = new RegInsert({});
  PatientName: any = "";
  RegId: any;     
  RegNo: any; ;  
  billNo:any;

  dataSource2 = new MatTableDataSource<InsertRefundDetail>();   

  constructor(public _RefundbillService: RefundbillService, 
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService, 
    private commonService: PrintserviceService,
    private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();

    this.vRefundOfBillFormGroup = this.vRefundBillFormInsert();
    this.vRefundOfBillFormGroup.markAllAsTouched();

    this.RefundOfBillFormFooter = this.refundFormFooter();
    this.RefundOfBillFormFooter.markAllAsTouched();

    // loop array defined
    this.refundDetailsArray.push(this.createRefundDetail());
    this.addChargesArray.push(this.createAddCharge());

    this.vRefundOfBillFormGroup.get("refund.isCancelledDate")?.setValue('1900-01-01')
    this.vRefundOfBillFormGroup.get("refund.refundDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1900-01-01')
    this.vRefundOfBillFormGroup.get("refund.refundTime")?.setValue(this.dateTimeObj.time)
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: ['']
    });
  }

  // 1. Main Form Group new method
  vRefundBillFormInsert(): FormGroup {
    return this.formBuilder.group({
      refund: this.formBuilder.group({
        refundNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
        refundDate: [this.datePipe.transform(new Date(), 'yyyy-MM-dd')],
        refundTime: [this.datePipe.transform(new Date(), 'shortTime')],
        billId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        advanceId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdtype: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        opdipdid: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
        refundAmount: [0, [Validators.required,this._FormvalidationserviceService.onlyNumberValidator(),Validators.minLength(1),
          this._FormvalidationserviceService.notEmptyOrZeroValidator()
        ]],
        remark: [''],
        transactionId: [2, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        addedBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelled: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledBy: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.validDateValidator]],
        refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      }),

      tRefundDetails: this.formBuilder.array([]), // FormArray for details
      addCharges: this.formBuilder.array([]), // FormArray for charges
      payment: ''
    });
  }

  // 2. FormArray Group for Refund Detail
  createRefundDetail(item: any = {}): FormGroup {
    return this.formBuilder.group({
      refundId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceId: [item.serviceId || 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      serviceAmount: [item.netAmount || 0],
      refundAmount: [item.RefundAmt || 0, [this._FormvalidationserviceService.notEmptyOrZeroValidator]],
      doctorId: [item.doctorId || 0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      remark: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(50)]],
      addBy: [this.accountService.currentUserValue.userId, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      chargesId: [item.chargesId || 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  //  3. FormArray Group for Charges
  createAddCharge(item: any = {}): FormGroup {
    return this.formBuilder.group({
      chargesId: [item.chargesId || 0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      refundAmount: [parseFloat(item.RefundAmt) || 0, [this._FormvalidationserviceService.onlyNumberValidator()]]
    });
  }

  // 5.FormArray Getters
  get refundDetailsArray(): FormArray {
    return this.vRefundOfBillFormGroup.get('tRefundDetails') as FormArray;
  }

  get addChargesArray(): FormArray {
    return this.vRefundOfBillFormGroup.get('addCharges') as FormArray;
  }

  // footer form
  refundFormFooter(): FormGroup {
    return this.formBuilder.group({
      TotalRefundAmount: [0,[Validators.required,this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      RefundBalAmount:  [0,[Validators.required]],
      Remark: [''],
    });
  }  
  getSelectedObj(obj) {
    if ((obj.value ?? 0) > 0) {
      console.log(obj)
      setTimeout(() => {
        this._RefundbillService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          this.RegId = this.registerObj?.regId
          this.RegNo = this.registerObj?.regNo
          this.PatientName = this.registerObj?.firstName + " " + this.registerObj?.middleName + " " + this.registerObj?.lastName
          this.billNo = this.registerObj.billNo;
          this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(this.registerObj.billNo);
          console.log(response)
        });
      }, 500);
    }
    this.getfilterdata(obj.value)
  }
    getfilterdata(RegId) {
    this.gridConfig = {
      apiUrl: "RefundOfBill/OPBilllistforrefundList",
      columnsList: this.allColumns1,
      sortField: "RegNo",
      sortOrder: 0,
      filters: [
        { fieldName: "RegId", fieldValue: String(RegId), opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

   
  onPriceOrQtyChange(row : InsertRefundDetail = null, RefundAmt): void {
    if (RefundAmt > 0 && RefundAmt <= row.balAmt) {
      const BalanceAmount = row.balAmt - RefundAmt;
       row.balanceAmount = BalanceAmount;
    }
    else if (RefundAmt > row.balAmt) {
      this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      row.RefundAmt = '';
      row.balanceAmount = row.balAmt;
    }
    else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == null || RefundAmt == undefined) {
      row.RefundAmt = '';
      row.balanceAmount = row.balAmt;
    } 
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void { 
    let RefundAmount = this.dataSource2.data.reduce((sum, { RefundAmt }) => sum += +(RefundAmt || 0), 0);
    let RefBalAmount = this.dataSource2.data.reduce((sum, { balanceAmount }) => sum += +(balanceAmount || 0), 0);

    this.RefundOfBillFormFooter.patchValue({
      TotalRefundAmount: RefundAmount,
      RefundBalAmount: Math.round(RefBalAmount),
    }, { emitEvent: false });
  }   
  // new save method date:5/6/25
  onSave() {

    this.vRefundOfBillFormGroup.get("refund.isCancelledDate")?.setValue('1900-01-01')
    this.vRefundOfBillFormGroup.get("refund.refundAmount")?.setValue(parseInt(this.RefundOfBillFormFooter.get('TotalRefundAmount')?.value))
    this.vRefundOfBillFormGroup.get("refund.remark")?.setValue(this.RefundOfBillFormFooter.get('Remark')?.value)
    this.vRefundOfBillFormGroup.get("refund.refundDate")?.setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1900-01-01')
    this.vRefundOfBillFormGroup.get("refund.refundTime")?.setValue(this.dateTimeObj.time)

    if (!this.RefundOfBillFormFooter.invalid && !this.vRefundOfBillFormGroup.invalid) { 
       console.log("FormValue", this.vRefundOfBillFormGroup.value)

      // Refund table detail assign to array
      this.refundDetailsArray.clear();
      this.dataSource2.data.forEach(item => {
        this.refundDetailsArray.push(this.createRefundDetail(item));
      });

      // addCharges table detail assign to array
      this.addChargesArray.clear();
      this.dataSource2.data.forEach(item => {
        this.addChargesArray.push(this.createAddCharge(item));
      });

      // Patient info
      const PatientHeaderObj = {
        Date: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
        PatientName: this.PatientName,
        RegNo: this.RegNo, 
        Age: this.registerObj?.ageYear,
        NetPayAmount: Math.round(this.RefundOfBillFormFooter.get('TotalRefundAmount').value),
        billNo: this.vRefundOfBillFormGroup.get("refund.billId")?.value
      };

      const dialogRef = this._matDialog.open(OpPaymentComponent, {
        maxWidth: "90vw",
        height: '650px',
        width: '80%',
        data: {
          vPatientHeaderObj: PatientHeaderObj,
          FromName: "OP-RefundOfBill",
          advanceObj: PatientHeaderObj
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.submitDataPay) {
          this.vRefundOfBillFormGroup.get('payment')?.setValue(result.submitDataPay.ipPaymentInsert);
          
          console.log("OP Refund Value --> ", this.vRefundOfBillFormGroup.value)

          this._RefundbillService.InsertOPRefundBilling(this.vRefundOfBillFormGroup.value).subscribe(response => {
            this.viewgetOPRefundBillReportPdf(response);
            setTimeout(() => {
              this.grid.bindGridData();              
              this.cleardata();
            }, 100); 
          });
        }
      });
    } else {
      let invalidFields: string[] = [];

      if (this.RefundOfBillFormFooter.invalid) {
        for (const controlName in this.RefundOfBillFormFooter.controls) {
          if (this.RefundOfBillFormFooter.controls[controlName].invalid) {
            invalidFields.push(`Refund of Bill Footer: ${controlName}`);
          }
        }
      }
      // checks nested error 
      if (this.vRefundOfBillFormGroup.invalid) {
        for (const controlName in this.vRefundOfBillFormGroup.controls) {
          const control = this.vRefundOfBillFormGroup.get(controlName);

          if (control instanceof FormGroup || control instanceof FormArray) {
            for (const nestedKey in control.controls) {
              if (control.get(nestedKey)?.invalid) {
                invalidFields.push(`Table Data : ${controlName}.${nestedKey}`);
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
  cleardata() {
    this.dataSource2.data = [];
    this.RefundOfBillFormFooter.reset();
    this.searchFormGroup.get('RegId')?.setValue(0); 
    this.registerObj = new RegInsert({});
    this.RegNo = ''; 
     this.RefundOfBillFormFooter.markAllAsTouched();
     this.getfilterdata(0)
  }
  onEdit(row) { 
    console.log(row);
    var datePipe = new DatePipe("en-US"); 
    this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(row.billNo)  
    this.vRefundOfBillFormGroup.get("refund.opdipdid")?.setValue(row.visitId)
    //Testing
    if (row.refundAmount < row.netPayableAmt) {
      this.getservicedtailList(row); 
      
    } else {
       this.toastr.warning('Bill Amount Already Refund .', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });  
    }
      this.calculateTotalAmount();
  }
  getservicedtailList(row) { 
     var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "BillNo",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(row.billNo),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }  
    this._RefundbillService.getRefundofBillServiceList(m_data).subscribe(response => { 
       this.dataSource2.data = response.data  as InsertRefundDetail[] 
       this.dataSource2.data.forEach(element => {
       element.balanceAmount = element.balAmt - element.serviceWiseDisc;
       element.balAmt = element.balAmt - element.serviceWiseDisc;
       });
       this.dataSource2.data = [...this.dataSource2.data];
      this.isLoadingStr = this.dataSource2.data.length == 0 ? 'no-data' : '';
      this.calculateTotalAmount();
    });
  }
  chargelist:any=[];
  populateiprefund(employee) {
    this.RefundOfBillFormFooter.patchValue(employee);
  }  
  viewgetOPRefundBillReportPdf(data) { 
    this.commonService.Onprint("RefundId", data, "OPRefundReceipt");
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  } 
  getWhatsappshareRefundbill(el, vmono) { 
    var m_data = {
      "insertWhatsappsmsInfo": {
        "mobileNumber": vmono || 0,
        "smsString": '',
        "isSent": 0,
        "smsType": 'OPREFBILL',
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
        this.toastr.success('Refund Of Bill Sent on WhatsApp Successfully.', 'Save !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
      } else {
        this.toastr.error('API Error!', 'Error WhatsApp!', {
          toastClass: 'tostr-tost custom-toast-error',
        });
      }
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
}

export class InsertRefund {
  RefundId: number;
  RefundDate: any;
  RefundTime: any;
  BillId: number;
  AdvanceId: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  RefundAmount: any;
  Remark: String;
  TransactionId: number;
  AddedBy: number;
  IsCancelled: boolean;
  IsCancelledBy: number;
  IsCancelledDate: any;
  RefundNo: string; 

  constructor(InsertRefundObj) {
    {
      this.RefundId = InsertRefundObj.RefundId || 0;
      this.RefundDate = InsertRefundObj.RefundDate || '';
      this.RefundTime = InsertRefundObj.RefundTime || '';
      this.BillId = InsertRefundObj.BillId || 0;
      this.AdvanceId = InsertRefundObj.AdvanceId || 0;
      this.OPD_IPD_Type = InsertRefundObj.OPD_IPD_Type || 0;
      this.OPD_IPD_ID = InsertRefundObj.OPD_IPD_ID || 0;
      this.RefundAmount = InsertRefundObj.RefundAmount || 0;
      this.Remark = InsertRefundObj.Remark || '';
      this.TransactionId = InsertRefundObj.TransactionId || 0;
      this.AddedBy = InsertRefundObj.AddedBy || 0;
      this.IsCancelled = InsertRefundObj.IsCancelled || false;
      this.IsCancelledBy = InsertRefundObj.IsCancelledBy || 0;
      this.IsCancelledDate = InsertRefundObj.IsCancelledDate || '';
      this.RefundNo = InsertRefundObj.RefundNo || '';


    }
  }
} 
export class InsertRefundDetail {
  RefundID: any;;
  ServiceId: number;
  serviceName: any;
  ServiceAmount: number;
  refundAmount: number;
  doctorId: number;
  Remark: String;
  AddBy: number;
  chargesId: number;
  ChargesDate: Date;
  price: number;
  qty: number;
  TotalAmt: number;
  NetAmount: number;
  ChargesDocName: any;
  refundAmt: any;
  balanceAmount: any;
  refAmount: any;
  RefundAmt: any;
  balAmt: any;
  serviceWiseDisc:any;

  constructor(InsertRefundDetailObj) {
    {
      this.RefundID = InsertRefundDetailObj.RefundID || 0;
      this.ServiceId = InsertRefundDetailObj.ServiceId || 0;
      this.serviceName = InsertRefundDetailObj.serviceName || 0;
      this.ServiceAmount = InsertRefundDetailObj.ServiceAmount || 0;
      this.refundAmount = InsertRefundDetailObj.refundAmount || 0;
      this.doctorId = InsertRefundDetailObj.doctorId || 0;
      this.Remark = InsertRefundDetailObj.Remark || '';
      this.AddBy = InsertRefundDetailObj.AddBy || 0;
      this.chargesId = InsertRefundDetailObj.chargesId || 0;
      this.ChargesDate = InsertRefundDetailObj.ChargesDate || '';
      this.price = InsertRefundDetailObj.price || 0;
      this.qty = InsertRefundDetailObj.qty || 0;
      this.TotalAmt = InsertRefundDetailObj.TotalAmt || 0;
      this.NetAmount = InsertRefundDetailObj.NetAmount || '';
      this.ChargesDocName = InsertRefundDetailObj.ChargesDocName || 0;
      // this.Qty = InsertRefundDetailObj.ty || 0;
      this.refundAmt = InsertRefundDetailObj.refundAmt || 0;
      this.balanceAmount = InsertRefundDetailObj.balanceAmount || 0;
      this.refAmount = InsertRefundDetailObj.refAmount || 0;
      this.RefundAmt = InsertRefundDetailObj.RefundAmt || 0;
      this.balAmt = InsertRefundDetailObj.balAmt || 0;
      this.serviceWiseDisc = InsertRefundDetailObj.serviceWiseDisc || 0;
    }
  }
}  
