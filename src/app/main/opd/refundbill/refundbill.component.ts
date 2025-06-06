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
import { RefundMaster } from 'app/main/ipd/Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.component';
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

  screenFromString = 'app-op-refund-bill';
  RefundOfBillFormFooter: FormGroup;
  searchFormGroup: FormGroup;
  vRefundOfBillFormGroup: FormGroup;
  isLoading: String = '';
  // selectedAdvanceObj: AdvanceDetailObj;
  dateTimeObj: any;
  billNo: number;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount: any = 0;
  RefundBalAmount: number;
  BillDate: any;
  RefundAmount: number = 0;
  Remark: string;
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '0';
  // billingServiceList = [];
  // showAutocomplete = false;
  b_netAmount = '0';
  b_disAmount = '0';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  serviceId: number;
  serviceName: any;
  ServiceAmount: number;
  ChargeId: any;
  currentDate = new Date();
  isLoadingStr: string = '';
  totalAmtOfNetAmt: any;
  netPaybleAmt: any;
  totalAmtOfNetAmt1: any;
  netPaybleAmt1: any;
  serselamttot: any = 0;
  RefAmt: any = 0;
  RefAmt1: any = 0;
  AgeYear: any = 0;
  registerObj = new RegInsert({});
  PatientName: any = "";
  RegId: any;
  CompanyName: any;
  Doctorname: any;
  vOPIPId: any = 0;
  BalanceAmount = 0;
  vFinalrefundbamt = 0;
  RegNo: any;
  public isModal = false;
  RefundAmt: any;


  @ViewChild('picker') datePickerElement = MatDatepicker;
  
  displayedColumns1 = [
    'serviceName',
    'price',
    'qty',
    'netAmount',
    'chargesDocName',
    'refAmount',
    'balanceAmount',
    'refundAmount'
  ];

  dataSource2 = new MatTableDataSource<InsertRefundDetail>();
  public chargeList: InsertRefundDetail[] = [];
  @ViewChild('grid') grid: AirmidTableComponent;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public _RefundbillService: RefundbillService,
    private _ActRoute: Router,
    public _matDialog: MatDialog,
    private toastrService: ToastrService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    private changeDetectorRefs: ChangeDetectorRef,
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
        isCancelledDate: ['1900-01-01', [this._FormvalidationserviceService.notBlankValidator, this._FormvalidationserviceService.validDateValidator]],
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
      TotalRefundAmount: [Validators.pattern("^[0-9]*$"),Validators.required],
      RefundBalAmount: [Validators.pattern("^[0-9]*$"),Validators.required],
      Remark: [''],
    });
  }

  allColumns1 = [
    { heading: "Bill Date", key: "billDate", sort: true, align: 'left', emptySign: 'NA' , type: 6},
    { heading: "Bill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Disc Amt", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Bill Amount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' , type: 22 },
    { heading: "Refund Amount", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: 22}
  ]

  allFilters1 = [
    { fieldName: "RegId", fieldValue: '0', opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    apiUrl: "RefundOfBill/OPBilllistforrefundList",
    columnsList: this.allColumns1,
    sortField: "BillNo",
    sortOrder: 0,
    filters: this.allFilters1
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

    console.log(m_data)

    this._RefundbillService.getRefundofBillServiceList(m_data).subscribe(Visit => {
      this.dataSource2.data = Visit.data as InsertRefundDetail[];
      this.dataSource2.sort = this.sort;
      this.dataSource2.paginator = this.paginator;
      console.log(Visit);
      this.isLoadingStr = this.dataSource2.data.length == 0 ? 'no-data' : '';
    });
    this.dataSource2.data["BalanceAmount"] = 0;
  }

  getSelectedObj(obj) {
    if ((obj.value ?? 0) > 0) {
      console.log(obj)
      setTimeout(() => {
        this._RefundbillService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          this.RegId = this.registerObj.regId
          this.RegNo = this.registerObj.regNo
          this.PatientName = this.registerObj.firstName + " " + this.registerObj.middleName + " " + this.registerObj.lastName
          console.log(response)
        });
      }, 500);
    }
    this.getfilterdata(obj.value)
  }

   
  onPriceOrQtyChange(row : InsertRefundDetail = null, RefundAmt): void {
    if (!row) return;
    row.RefundAmt = Math.abs(row.refundAmt);
    const BalanceAmount = row.balAmt - RefundAmt;
    row.balanceAmount = BalanceAmount;
    this.calculateTotalAmount();
  }

  calculateTotalAmount(): void {
    let RefundAmount = this.dataSource2.data.reduce((sum, charge) => sum + (+charge.RefundAmt), 0);
    let RefBalAmount = this.dataSource2.data.reduce((sum, charge) => sum + (+charge.balanceAmount), 0);

    this.RefundOfBillFormFooter.patchValue({
      TotalRefundAmount: RefundAmount,
      RefundBalAmount: Math.round(RefBalAmount),
    }, { emitEvent: false });
  }
  
  // gettablecalculation(element, RefundAmt) {
  //   console.log(element)
  //   if (RefundAmt > 0 && RefundAmt <= element.balAmt) {
  //     element.balanceAmount = ((element.balAmt) - (RefundAmt));
  //     element.PrevRefAmount = RefundAmt;
  //     this.BalanceAmount = element.balanceAmount
  //   }
  //   else if (RefundAmt > element.balAmt) {
  //     this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     element.RefundAmt = '';
  //     element.balanceAmount = element.balAmt;
  //   }
  //   else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == null || RefundAmt == undefined) {
  //     element.RefundAmt = '';
  //     element.balanceAmount = element.balAmt;
  //   }
  //   else if (this.RefundAmount < this.NetBillAmount) {
  //     this.toastr.warning('Bill Amount Already Refund .', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     element.RefundAmt = '';
  //     element.balanceAmount = element.balAmt;
  //   }
  // }
  
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onOptionSelected(selectedItem) {
    this.b_price = selectedItem.Price
    this.b_totalAmount = selectedItem.Price  //* parseInt(this.b_qty)
    this.b_disAmount = '0';
    this.b_netAmount = selectedItem.Price
    this.b_IsEditable = selectedItem.IsEditable
    this.b_IsDocEditable = selectedItem.IsDocEditable
    this.b_isPath = selectedItem.IsPathology
    this.b_isRad = selectedItem.IsRadiology
    this.serviceId = selectedItem.ServiceId;
    this.serviceName = selectedItem.ServiceName;
    this.calculateTotalAmt();
  }

  calculateTotalAmt() {
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = (parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
      // this.calculatePersc();
    }
  }

  getSelectedServicetotSum(element) {
    let netAmt1;
    netAmt1 = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.totalAmtOfNetAmt1 = netAmt1;
    this.netPaybleAmt1 = netAmt1;
    return netAmt1;
  }

  getRefundtotSum(element) {
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
  }

  getRefundtotSum1(element) {
    let netAmt1;
    netAmt1 = element.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    return netAmt1;
  }

  getServicetotSum(element) {
    this.TotalRefundAmount = element.reduce((sum, { RefundAmt }) => sum += +(RefundAmt || 0), 0).toFixed(2);
    let netAmt;
    netAmt = element.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0).toFixed(2);
    this.totalAmtOfNetAmt = netAmt;
    this.netPaybleAmt = netAmt;
    return netAmt;
  }

  // new save method date:5/6/25
  onSave() {

    this.vRefundOfBillFormGroup.get("refund.refundAmount")?.setValue(parseInt(this.RefundOfBillFormFooter.get('TotalRefundAmount')?.value))
    this.vRefundOfBillFormGroup.get("refund.remark")?.setValue(this.RefundOfBillFormFooter.get('Remark').value || '')
    
    if (!this.RefundOfBillFormFooter.invalid && !this.vRefundOfBillFormGroup.invalid) {
      
      // console.log("FormValue", this.vRefundOfBillFormGroup.value)

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
        DoctorName: this.Doctorname,
        CompanyName: this.CompanyName,
        Age: this.AgeYear,
        NetPayAmount: Math.round(this.RefundOfBillFormFooter.get('TotalRefundAmount').value)
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
          this._RefundbillService.InsertOPRefundBilling(this.vRefundOfBillFormGroup.value).subscribe(response => {
            this.viewgetOPRefundBillReportPdf(response);
            setTimeout(() => {
              this.grid.bindGridData();              
              this.cleardata();
            }, 100);
            this._matDialog.closeAll();
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
    this.TotalRefundAmount = 0;
    this.RefundBalAmount = 0;
    this.RegNo = '';
    this.registerObj.regId = 0
    this.registerObj.firstName = ""
    this.registerObj.lastName = ""
    this.registerObj.ageYear = ""
    this.registerObj.genderId = ""
  }

  viewgetOPRefundBillReportPdf(data) {

    this.commonService.Onprint("RefundId", data, "OPRefundReceipt");
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

  onClose() { this._matDialog.closeAll(); }

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

  Serviceselect(row, event) {

    this.RefAmt = this.RefundBalAmount;

    this.TotalRefundAmount = 0;
    this.Remark = '';
    this.serviceId = row.ServiceId;
    this.ServiceAmount = row.NetAmount;
    this.ChargeId = row.ChargeId;

    this.serselamttot = parseInt(row.NetAmount) + parseInt(this.serselamttot);

    if (this.RefAmt1 >= this.serselamttot) {
      this.TotalRefundAmount = row.Price;
      this.RefundBalAmount = (parseInt(this.RefundBalAmount.toString()) - parseInt(this.TotalRefundAmount.toString()));
      this.TotalRefundAmount = this.serselamttot;
    }
    else {
      Swal.fire("Select service total more than Bill Amount");
      this.TotalRefundAmount = 0;
      this.serselamttot = 0;
      this.RefundBalAmount = this.RefAmt1;
    }

    this.vFinalrefundbamt = this.RefundBalAmount
  }
  //
  refund: any = 0;
  onEdit(row) {
    this.TotalRefundAmount = 0
    this.RefundBalAmount = 0
    console.log(row);
    var datePipe = new DatePipe("en-US");
    this.BillNo = row.billNo;
    this.vRefundOfBillFormGroup.get("refund.billId")?.setValue(row.billNo)
    this.BillDate = datePipe.transform(row.BillDate, 'dd/MM/yyyy hh:mm a');
    this.NetBillAmount = row.netPayableAmt;
    this.RefundAmount = row.refundAmount;
    this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));
    this.vFinalrefundbamt = this.RefundBalAmount
    this.vOPIPId = row.visitId;
    this.vRefundOfBillFormGroup.get("refund.opdipdid")?.setValue(row.visitId)
    //Testing
    if (row.refundAmount < row.netPayableAmt) {
      this.getservicedtailList(row);
      this.RefAmt1 = this.RefundBalAmount;
    } else {
      Swal.fire("Already Refund")
      this.refund = 1;
    }
  }

  populateiprefund(employee) {
    this.RefundOfBillFormFooter.patchValue(employee);
  }

  calculateTotalRefund() {
    this.RefundBalAmount = this.RefundAmount - this.TotalRefundAmount;
    this.vFinalrefundbamt = this.RefundBalAmount
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
  // BillNo: number;
  // BillDate: any;
  // PatientName: String;
  // IsRefundFlag : boolean;

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
    }
  }
}

export class AddchargesRefundAmount {
  chargesId: number;
  refundAmount: number;

  constructor(AddchargesRefundAmountObj) {
    {
      this.chargesId = AddchargesRefundAmountObj.chargesId || 0;
      this.refundAmount = AddchargesRefundAmountObj.refundAmount || 0;

    }
  }
}

export class DocShareGroupwise {
  refundId: number;

  constructor(DocShareGroupwiseObj) {
    {
      this.refundId = DocShareGroupwiseObj.refundId || 0;

    }
  }
}

export class BillMaster {
  BillNo: number;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PBillNo: number;
  RefundAmount: number;
  OPD_IPD_Type: number;
  OPD_IPD_ID: number;
  AdmissionID: number;
  ChargesID: number;
  BillDate: Date;
  PaidAmt: number;
  BalanceAmt: number;
  IsCancelled: number;
  RegID: number;
  RegId: number;

  constructor(BillMaster) {
    {
      this.BillNo = BillMaster.BillNo || 0;
      this.TotalAmt = BillMaster.TotalAmt || 0;
      this.ConcessionAmt = BillMaster.ConcessionAmt || 0;
      this.NetPayableAmt = BillMaster.NetPayableAmt || 0;
      this.PBillNo = BillMaster.PBillNo || 0;
      this.RefundAmount = BillMaster.RefundAmount || 0;
      this.OPD_IPD_Type = BillMaster.OPD_IPD_Type || 0;
      this.OPD_IPD_ID = BillMaster.OPD_IPD_ID || 0;
      this.AdmissionID = BillMaster.AdmissionID || 0;
      this.ChargesID = BillMaster.ChargesID || 0;
      this.BillDate = BillMaster.BillDate || 0;
      this.PaidAmt = BillMaster.PaidAmt || 0;
      this.BalanceAmt = BillMaster.BalanceAmt || 0;
      this.IsCancelled = BillMaster.IsCancelled || '';
      this.RegID = BillMaster.RegID || 0;
      this.RegId = BillMaster.RegId || 0;

    }
  }
}

export class RegRefundBillMaster {

  netPayableAmt: number;
  refundAmount: number;
  billDate: any;
  billNo: any;

  constructor(RegRefundBillMaster) {
    {

      this.netPayableAmt = RegRefundBillMaster.netPayableAmt || 0;
      this.refundAmount = RegRefundBillMaster.refundAmount || 0;
      this.billDate = RegRefundBillMaster.billDate || 0;
      this.billNo = RegRefundBillMaster.billNo || 0;

    }
  }
}

export class BillRefundMaster {

  RefundDate: Date;
  RefundAmount: number;


  constructor(BillRefundMaster) {
    {
      this.RefundDate = BillRefundMaster.RefundDate || '';
      this.RefundAmount = BillRefundMaster.RefundAmount || 0;
    }
  }
}
