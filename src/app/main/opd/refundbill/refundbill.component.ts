import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../registration/registration.component';
import { RefundbillService } from './refundbill.service';
import { RefundMaster } from 'app/main/ipd/Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.component';
import { Observable, Subscription } from 'rxjs';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { OpPaymentComponent } from '../op-search-list/op-payment/op-payment.component';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { fuseAnimations } from '@fuse/animations';
import { OpPaymentNewComponent } from '../op-search-list/op-payment-new/op-payment-new.component';
import { VisitMaster1 } from '../appointment-list/appointment-list.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PaymentInsert } from '../appointment-list/appointment-billing/appointment-billing.component';
type NewType = Observable<any[]>;
@Component({
  selector: 'app-refundbill',
  templateUrl: './refundbill.component.html',
  styleUrls: ['./refundbill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class RefundbillComponent implements OnInit {

  screenFromString = 'app-op-refund-bill';
  RefundOfBillFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  myRefundBillForm: FormGroup;
  myserviceForm: FormGroup;
  isLoading: String = '';
  selectedAdvanceObj: AdvanceDetailObj;
  filteredOptions: NewType;
  myControl = new FormControl();
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
  billingServiceList = [];
  showAutocomplete = false;
  BillingClassCmbList: any = [];
  b_netAmount = '0';
  b_disAmount = '0';
  b_DoctorName = '';
  b_traiffId = '';
  b_isPath = '';
  b_isRad = '';
  b_IsEditable = '';
  b_IsDocEditable = '';
  serviceId: number;
  serviceName: any;
  ServiceAmount: number;
  ChargeId: any;
  isFilteredDateDisabled: boolean = true;
  currentDate = new Date();
  doctorNameCmbList: any = [];
  serviceNameCmbList: any = [];
  refundremain: any = [];
  isLoadingStr: string = '';
  reportPrintObj: RefundMaster;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
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
  Regflag: boolean = false;
  RegDate: any;
  City: any;
  CompanyName: any;
  Tarrifname: any;
  Doctorname: any;
  Paymentdata: any;
  vOPIPId: any = 0;
  vOPDNo: any = 0;
  vTariffId: any = 0;
  vClassId: any = 0;
  BalanceAmount = 0;
  PatientListfilteredOptions: any;
  isRegIdSelected: boolean = false;
  noOptionFound: boolean = false;
  vBillBalanceAmt = 0;
  vFinalrefundbamt = 0;
  RegNo: any;
  vMobileNo: any;
  patientDetail1 = new VisitMaster1({});
  Paymentdataobj: PaymentInsert[] = [];
  public isModal = false;

  @ViewChild('picker') datePickerElement = MatDatepicker;
  displayedColumns1 = [
    'serviceName',
    'qty',
    'price',
    'netAmount',
    'chargesDocName',
    'refAmount',
    'balanceAmount',
    'refundAmount'
  ];

  displayedColumns = [
    'billDate',
    'billNo',
    'netPayableAmt',
    'refundAmount'
    // 'action'
  ];

  displayedColumns2 = [
    'RefundDate',
    'RefundAmount'
  ];



  dataSource = new MatTableDataSource<InsertRefundDetail>();
  dataSource3 = new MatTableDataSource<RegRefundBillMaster>();
  dataSource1 = new MatTableDataSource<BillRefundMaster>();

  dataSource2 = new MatTableDataSource<InsertRefundDetail>();


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

  ) { }

  ngOnInit(): void {
    this.RefundOfBillFormGroup = this.refundForm();
    this.searchFormGroup = this.createSearchForm();
  }

  createSearchForm() {
    return this.formBuilder.group({
      RegId: ['']
    });
  }

  refundForm(): FormGroup {
    return this.formBuilder.group({
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillNo: [''],
      NetBillAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: [Validators.pattern("^[0-9]*$")],
      RefundBalAmount: [Validators.pattern("^[0-9]*$")],
      BillDate: [''],
      RefundAmount: [Validators.pattern("^[0-9]*$")],
      Remark: [''],
      RegNo: [''],
      PatientName: [''],
      serviceName: [''],
      serviceId: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],

    });
  }

  refundBillForm() {
    this.myRefundBillForm = this.formBuilder.group({
      BillId: [''],
      billId: [''],
      ServiceId: [''],
      serviceId: [''],
      serviceName: [''],
      ServiceName: [''],
      Price: [Validators.pattern("^[0-9]*$")],
      Qty: [Validators.pattern("^[0-9]*$")],
      totalAmount: [Validators.pattern("^[0-9]*$")],
      advanceAmt: [Validators.pattern("^[0-9]*$")],
      BillingClassId: [''],
      price: [Validators.pattern("^[0-9]*$")],
      qty: [Validators.pattern("^[0-9]*$")],
      DoctorId: [''],
      DoctorName: [''],
    });
  }

  //Give BillNumber For List
  getRefundofBillOPDListByReg(RegId) {

    var m_data = {
      "first": 0,
      "rows": 10,
      "sortField": "BillNo",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "RegId",
          "fieldValue": String(RegId),
          "opType": "Equals"
        }
      ],
      "Columns":[],
      "exportType": "JSON"
    }

    console.log(m_data);

    this._RefundbillService.getRefundofBillOPDList(m_data).subscribe(Visit => {
      console.log(Visit);
      this.dataSource3.data = Visit.data
      console.log(this.dataSource3.data);
      this.vOPIPId = this.dataSource3.data
    });


  }

  TServiceamt = 0;
  TRefundamt = 0;

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
      "Columns":[],
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

    this.getRefundofBillOPDListByReg(obj.value);

  }


  gettablecalculation(element, RefundAmt) {

    console.log(element)
    if (RefundAmt > 0 && RefundAmt <= element.balAmt) {
      element.balanceAmount = ((element.balAmt) - (RefundAmt));
      element.PrevRefAmount = RefundAmt;
      this.BalanceAmount = element.balanceAmount
    }
    else if (RefundAmt > element.balAmt) {
      this.toastr.warning('Enter Refund Amount Less than Balance Amount ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      element.RefundAmt = '';
      element.balanceAmount = element.balAmt;
    }
    else if (RefundAmt == 0 || RefundAmt == '' || RefundAmt == null || RefundAmt == undefined) {
      element.RefundAmt = '';
      element.balanceAmount = element.balAmt;
    }
    else if (this.RefundAmount < this.NetBillAmount) {
      this.toastr.warning('Bill Amount Already Refund .', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      element.RefundAmt = '';
      element.balanceAmount = element.balAmt;
    }
  }
  RefundAmt: any;
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

  onSave() {
if (this.vOPIPId !== 0 && this.TotalRefundAmount !== "0.00") {

      if (this.TotalRefundAmount <= this.RefundBalAmount) {
        let InsertRefundObj = {};

        InsertRefundObj['refundNo'] = '';
        InsertRefundObj['refundDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          InsertRefundObj['refundTime'] = this.dateTimeObj.time;
        InsertRefundObj['refundNo'] = "",
          InsertRefundObj['billId'] = this.BillNo,//parseInt(this.RefundOfBillFormGroup.get('BillNo').value);
          InsertRefundObj['advanceId'] = 0;
        InsertRefundObj['opdipdtype'] = 0;
        InsertRefundObj['opdipdid'] = this.vOPIPId,
          InsertRefundObj['refundAmount'] = parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
        InsertRefundObj['remark'] = this.RefundOfBillFormGroup.get('Remark').value || "";
        InsertRefundObj['transactionId'] = 2;
        InsertRefundObj['addedBy'] = this.accountService.currentUserValue.userId,
          InsertRefundObj['isCancelled'] = 0;
        InsertRefundObj['isCancelledBy'] = 0;
        InsertRefundObj['isCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          InsertRefundObj['refundId'] = 0;


        let RefundDetailarr = [];
        this.dataSource2.data.forEach((element) => {

          let InsertRefundDetailObj = {};
          console.log(element)
          InsertRefundDetailObj['refundId'] = 0;
          InsertRefundDetailObj['serviceId'] = element.ServiceId || 0;
          InsertRefundDetailObj['serviceAmount'] = element.NetAmount || 0;
          InsertRefundDetailObj['refundAmount'] = element.RefundAmt || 0;
          InsertRefundDetailObj['doctorId'] = element.doctorId
          InsertRefundDetailObj['remark'] = this.RefundOfBillFormGroup.get('Remark').value || '';
          InsertRefundDetailObj['addBy'] = this.accountService.currentUserValue.userId,
            InsertRefundDetailObj['chargesId'] = element.chargesId
          RefundDetailarr.push(InsertRefundDetailObj);
        })

        let AddchargesRefundAmountarr = [];
        this.dataSource2.data.forEach((element) => {
          console.log(this.dataSource2.data)
          let AddchargesRefundAmountObj = {};
          AddchargesRefundAmountObj['chargesId'] = element.chargesId || 0;
          AddchargesRefundAmountObj['refundAmount'] = parseFloat(element.RefundAmt) || 0;// parseInt(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);
          AddchargesRefundAmountarr.push(AddchargesRefundAmountObj);
        });


        //Patient info 
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '01/01/1900',
          PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['RegNo'] = this.RegNo;
        PatientHeaderObj['DoctorName'] = this.Doctorname;
        PatientHeaderObj['CompanyName'] = this.CompanyName;
        PatientHeaderObj['Age'] = this.AgeYear;
        PatientHeaderObj['NetPayAmount'] = Math.round(this.RefundOfBillFormGroup.get('TotalRefundAmount').value);



        const dialogRef = this._matDialog.open(OpPaymentNewComponent,
          {
            maxWidth: "90vw",
            height: '650px',
            width: '80%',
            data: {
              vPatientHeaderObj: PatientHeaderObj,
              FromName: "OP-RefundOfBill",
              advanceObj: PatientHeaderObj,
            }
          });

        dialogRef.afterClosed().subscribe(result => {
          this.Paymentdataobj = result.submitDataPay.ipPaymentInsert;
          console.log(this.Paymentdataobj)
          let Paymentobj = {};
          Paymentobj['billNo'] = 0,
            Paymentobj['receiptNo'] = "",
            Paymentobj['paymentDate'] = result.submitDataPay.ipPaymentInsert.PaymentDate,
            Paymentobj['paymentTime'] = result.submitDataPay.ipPaymentInsert.PaymentTime,
            Paymentobj['cashPayAmount'] = result.submitDataPay.ipPaymentInsert.CashPayAmount,
            Paymentobj['chequePayAmount'] = result.submitDataPay.ipPaymentInsert.ChequePayAmount,
            Paymentobj['chequeNo'] = result.submitDataPay.ipPaymentInsert.ChequeNo,
            Paymentobj['bankName'] = result.submitDataPay.ipPaymentInsert.BankName,
            Paymentobj['chequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate,
            Paymentobj['cardPayAmount'] = result.submitDataPay.ipPaymentInsert.CardPayAmount,
            Paymentobj['cardNo'] = result.submitDataPay.ipPaymentInsert.CardNo,
            Paymentobj['cardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName,
            Paymentobj['cardDate'] = result.submitDataPay.ipPaymentInsert.CardDate,
            Paymentobj['advanceUsedAmount'] = result.submitDataPay.ipPaymentInsert.AdvanceUsedAmount,
            Paymentobj['advanceId'] = result.submitDataPay.ipPaymentInsert.AdvanceId,
            Paymentobj['refundId'] = 0,
            Paymentobj['transactionType'] = result.submitDataPay.ipPaymentInsert.TransactionType,
            Paymentobj['remark'] = result.submitDataPay.ipPaymentInsert.Remark,
            Paymentobj['addBy'] = result.submitDataPay.ipPaymentInsert.AddBy,
            Paymentobj['isCancelled'] = false,
            Paymentobj['isCancelledBy'] = result.submitDataPay.ipPaymentInsert.IsCancelledBy,
            Paymentobj['isCancelledDate'] = result.submitDataPay.ipPaymentInsert.IsCancelledDate,
            Paymentobj['neftpayAmount'] = result.submitDataPay.ipPaymentInsert.NEFTPayAmount,
            Paymentobj['neftno'] = result.submitDataPay.ipPaymentInsert.NEFTNo,
            Paymentobj['neftbankMaster'] = result.submitDataPay.ipPaymentInsert.NEFTBankMaster,
            Paymentobj['neftdate'] = result.submitDataPay.ipPaymentInsert.NEFTDate,
            Paymentobj['payTmamount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount,
            Paymentobj['payTmtranNo'] = result.submitDataPay.ipPaymentInsert.PayTMTranNo,
            Paymentobj['payTmdate'] = result.submitDataPay.ipPaymentInsert.PayTMDate,
            Paymentobj['tdsamount'] = result.submitDataPay.ipPaymentInsert.tdsAmount
          // console.log('============================== Return Adv ===========');
          let submitData = {
            "refund": InsertRefundObj,
            "tRefundDetails": RefundDetailarr,
            "addCharges": AddchargesRefundAmountarr,
            "payment": Paymentobj,// result.submitDataPay.ipPaymentInsert
          };

          console.log(submitData)
          this._RefundbillService.InsertOPRefundBilling(submitData).subscribe(response => {
            this.toastrService.success(response.message);
            this.viewgetOPRefundBillReportPdf(response)
          }, (error) => {
            this.toastrService.error(error.message);
          });

        });
        
      }
      else {
        Swal.fire("Refund Amount is More than RefundBalance")
      }
      this.cleardata();
}
    else {
      Swal.fire("Please Add Refund Amount!")
    }

    
  }

  cleardata() {
    this.dataSource.data = [];
    this.dataSource1.data = [];
    this.dataSource2.data = [];
    this.dataSource3.data = [];
    this.RefundOfBillFormGroup.reset();
    this.searchFormGroup.get('RegId').setValue("");
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

  // updatedVal(e) {
  //   if (e && e.length >= 2) {
  //     this.showAutocomplete = true;
  //   } else {
  //     this.showAutocomplete = false;
  //   }
  //   if (e.length == 0) { this.b_price = ''; this.b_totalAmount = '0'; this.b_netAmount = '0'; this.b_disAmount = '0'; this.b_isPath = ''; this.b_isRad = ''; this.b_IsEditable = '0'; }
  // }


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

  getServiceListCombobox() {
    let tempObj;
    var m_data = {
      SrvcName: "%",
      TariffId: this.selectedAdvanceObj.TariffId,
      ClassId: this.selectedAdvanceObj.ClassId
    };
    this._RefundbillService.getBillingServiceList(m_data).subscribe(data => {
      this.dataSource2.data = data as InsertRefundDetail[];
      console.log(data);
      this.billingServiceList = tempObj;

    });
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
    this.BillDate = datePipe.transform(row.BillDate, 'dd/MM/yyyy hh:mm a');
    this.NetBillAmount = row.netPayableAmt;
    this.RefundAmount = row.refundAmount;
    this.RefundBalAmount = (parseInt(this.NetBillAmount.toString()) - parseInt(this.RefundAmount.toString()));
    this.vFinalrefundbamt = this.RefundBalAmount
    this.vOPIPId = row.visitId;
    //Testing
    if (row.refundAmount < row.netPayableAmt) {
      var m_data1 = {
        "BillNo": row.billNo
      }
      this.getservicedtailList(row);

      this.RefAmt1 = this.RefundBalAmount;

    } else {
      Swal.fire("Already Refund")
      this.refund = 1;
    }

  }


  populateiprefund(employee) {
    this.RefundOfBillFormGroup.patchValue(employee);

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
