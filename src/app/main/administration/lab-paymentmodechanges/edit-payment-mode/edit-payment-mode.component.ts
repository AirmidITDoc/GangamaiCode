import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { LabPaymentmodechangesService } from '../lab-paymentmodechanges.service';


@Component({
  selector: 'app-edit-payment-mode',
  templateUrl: './edit-payment-mode.component.html',
  styleUrls: ['./edit-payment-mode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditPaymentModeComponent {

  paymentForm: FormGroup
  mainpaymentForm: FormGroup


  FromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  ToDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  StoreId1 = 2// this._Paymentmodesevice.tpayFormGroup.get('StoreId').value || 0;
  isShowDetailTable: boolean = false;
  OpIpType: any = "0";
  salesNo: any = "0";
  regNo: any = "0";
  firstName: any = "%";
  LastName: any = "%";
  vbalanceAmt = 0
  autocompleteModePaymentMode: string = "CommonpaymentMode";


  vnetPayAmt: any;
  vcashpay: any = 0;
  vcardpay: any = 0;
  vchequepay: any = 0;
  vneftpay: any = 0;
  vpaytmpay: any = 0;
  vPayTmtranNo: any;
  label: any;
  vPaidAmount: any;
  vCashCheckStatus: boolean = false;
  vCardCheckStatus: boolean = false;
  vCheckCheckStatus: boolean = false;
  vNFTPayCheckStatus: boolean = false;
  vPayTMCheckStatus: boolean = false;
  vCardNo: any;
  vchequeNo: any;
  vNeftno: any;
  public bankList: BankNames[] = [];
  filteredbankList: BankNames[] = [];
  selectedPaymnet1: string = '';


  public displayedColumn: string[] =
    [
      'billNo',
      'receiptNo',
      'paymentDate',
      'payAmount',
      'payMode',
      'payMode1',
      'updateAmt',
      'tranNo',
      // 'bankName1',
      'bankName',
      'action'
    ];

  salesForm: FormGroup;
  registerObj = new tPaymentChange({});
  vpaymentId: any = 0;
  vBillNo: any;
  opiptype = 1

  // public dsPayList = new MatTableDataSource<tPaymentChange>();
  dsPayList = new MatTableDataSource<any>([]);

  constructor(
    public _Paymentmodesevice: LabPaymentmodechangesService,
    private _loggedService: AuthenticationService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe, private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private _ActRoute: Router,
    public _formBuilder: FormBuilder, @Inject(MAT_DIALOG_DATA) public data: any,
    public _FormvalidationserviceService: FormvalidationserviceService, public _whatsppService: WhatsAppEmailService,
    private overlay: Overlay,
  ) { }

  ngOnInit(): void {
    this.mainpaymentForm = this.CreaeMainPayform()

    if (this.data) {
      this.registerObj = this.data.registerObj;

      console.log(this.data.registerObj)
      this.vpaymentId = this.registerObj.paymentId;
      this.vnetPayAmt = this.registerObj.payAmount;
      this.vBillNo = this.registerObj.billNo || 0;

    }

    this.getPaylist();
    this.getPaymodelist();
    this.getBanklist();

    this.tpaymentsArray.push(this.createpayFormarray());
  }

  CreaeMainPayform() {
    return this._formBuilder.group({
      tpaymentUpdate: this._formBuilder.array([])
    });
  }

  createpayFormarray(item: any = {}): FormGroup {
    console.log(item)
    const now = new Date();
    return this._formBuilder.group({
      paymentId: [item.paymentId, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: this._loggedService.currentUserValue.user.unitId,
      billNo: [this.vBillNo],
      opdipdtype: 4,
      receiptNo: [item.receiptNo],
      paymentDate: [now.toISOString().split('T')[0]],
      paymentTime: [now.toISOString()],
      payAmount: [item.payAmount],
      tranNo: [item.tranNo ?? 0],
      bankName: [item.bankName],
      validationDate: [now.toISOString().split('T')[0]],
      advanceUsedAmount: [0],
      comments: [''],
      payMode: [item.payMode || "CASH",
      [
        Validators.required, Validators.maxLength(50),
        this._FormvalidationserviceService.allowEmptyStringValidator()
      ]
      ],
      onlineTranNo: "0",
      onlineTranResponse: "0",
      companyId: 0,
      advanceId: 0,
      refundId: 0,
      cashCounterId: 0,
      transactionType: 0,
      transactionLabel: 'LAB_Bill',
      isSelfOrcompany: 0,
      tranMode: "HOSP",
      isCancelled: false,
      isCancelledBy: 0,
      isCancelledDate: "1900-01-01",
      createdBy: this._loggedService.currentUserValue.userId
    });
  }

  get tpaymentsArray(): FormArray {
    return this.mainpaymentForm.get('tpaymentUpdate') as FormArray;
  }

  chargelist: any = [];
  // getPaylist() {
  //   // debugger
  //   const vdata = {
  //     "first": 0,
  //     "rows": 100,
  //     "sortField": "BillNo",
  //     "sortOrder": 0,
  //     "filters": [
  //       { "fieldName": "BillNo", "fieldValue": this.vBillNo, "opType": OperatorComparer.Equals }
  //     ],
  //     "Columns": [],
  //     "exportType": "JSON"
  //   }
  //   this._Paymentmodesevice.getpaybBillBrowseList(vdata).subscribe(response => {
  //     this.chargelist = response.data
  //     console.log(this.chargelist)
  //     if (this.chargelist)
  //       this.dsPayList.data = this.chargelist
  //   })
  // }
  getPaylist() {
    const vdata = {
      first: 0,
      rows: 100,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "BillNo", fieldValue: this.vBillNo, opType: OperatorComparer.Equals }
      ],
      Columns: [],
      exportType: "JSON"
    };

    this._Paymentmodesevice.getpaybBillBrowseList(vdata).subscribe(response => {

      this.chargelist = response.data;

      if (this.chargelist) {

        // ✅ ADD YOUR EXTRA FIELDS HERE
        this.dsPayList.data = this.chargelist.map((row: any, index: number) => ({
          ...row,

          id: index + 1,                // ✅ unique id
          payMode1: '',                // for new paymode input
          updateAmt: null,             // for amount input
          filteredList: [...this.payList], // dropdown list
          isSplit: false,              // पहचान original vs split
          parentId: null               // for split tracking
        }));
      }
    });
  }

  keyPressDigitsOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  onAmountChange(contact: any) {
    if (!contact.updateAmt) return;

    let originalAmt = contact.payAmount || 0;
    let enteredAmt = Number(contact.updateAmt);

    if (enteredAmt > originalAmt) {
      // alert('Amount cannot be greater than original amount');
      this.toastr.warning('Amount cannot be greater than original amount');
      contact.updateAmt = null;
      return;
    }
  }

  splitPayment(contact: any) {

    let updateAmt = Number(contact.updateAmt);

    if (!updateAmt || updateAmt <= 0) return;
    if (!contact.payMode1) return;

    if (contact.payMode1 === contact.payMode) {
      this.toastr.warning('Same payment mode already selected');
      return;
    }

    if (updateAmt > contact.payAmount) return;

    const originalPaymentId = contact.paymentId;

    // 👉 Create new row (acts like ORIGINAL)
    let newRow = {
      id: new Date().getTime(),

      billNo: contact.billNo,
      paymentDate: contact.paymentDate,
      receiptNo: contact.receiptNo,

      payAmount: updateAmt,
      payMode: contact.payMode1,

      tranNo: contact.tranNo,
      bankName: contact.bankName,

      payMode1: '',
      updateAmt: null,

      parentId: contact.id,

      isSplit: false,              // ✅ behaves like original
      paymentId: contact.paymentId // ✅ take original paymentId
    };

    // 👉 Reduce original row amount
    contact.payAmount = contact.payAmount - updateAmt;

    // 👉 If original becomes ZERO → transfer paymentId
    if (contact.payAmount === 0) {
      contact.isSplit = true;          // show delete
      contact.paymentId = 0;           // remove from first row

      newRow.paymentId = originalPaymentId; // ✅ GIVE to new row
      newRow.isSplit = false;          // ✅ make it original
    } else {
      newRow.paymentId = 0;            // normal split case
      newRow.isSplit = true;
    }

    // 👉 Clear inputs
    contact.payMode1 = '';
    contact.updateAmt = null;
    contact.tranNo = '';
    contact.bankName = '';

    let data = [...this.dsPayList.data];

    data.push(newRow);

    this.dsPayList.data = data;
    this.dsPayList._updateChangeSubscription();
  }

  // splitPayment(contact: any) {

  //   let updateAmt = Number(contact.updateAmt);

  //   if (!updateAmt || updateAmt <= 0) return;
  //   if (!contact.payMode1) return;
  //   if (contact.payMode1 === contact.payMode) {
  //     this.toastr.warning('Same payment mode already selected');
  //     return;
  //   }
  //   if (updateAmt > contact.payAmount) return;

  //   // 👉 Create new row with SAME details
  //   let newRow = {
  //     id: new Date().getTime(),

  //     billNo: contact.billNo,
  //     paymentDate: contact.paymentDate,
  //     receiptNo: contact.receiptNo,

  //     payAmount: updateAmt,
  //     payMode: contact.payMode1,

  //     tranNo: contact.tranNo,
  //     bankName: contact.bankName,

  //     payMode1: '',
  //     updateAmt: null,

  //     parentId: contact.id,
  //     isSplit: true,
  //     paymentId: 0
  //   };

  //   // 👉 Reduce original amount
  //   contact.payAmount = contact.payAmount - updateAmt;

  //   // 👉 Clear input fields of original row
  //   contact.payMode1 = '';
  //   contact.updateAmt = null;
  //   contact.tranNo = '';
  //   contact.bankName = '';

  //   let data = [...this.dsPayList.data];

  //   data.push(newRow);

  //   this.dsPayList.data = data;
  //   this.dsPayList._updateChangeSubscription();
  // }

  deleteRow(contact: any, index: number) {

    let data = [...this.dsPayList.data];

    // 👉 If it's split row → restore amount
    if (contact.isSplit && contact.parentId) {

      let parent = data.find(x => x.id === contact.parentId);

      if (parent) {
        parent.payAmount += contact.payAmount;
      }
    }

    // Remove row
    data.splice(index, 1);

    this.dsPayList.data = data;
    this.dsPayList._updateChangeSubscription();
  }

  onTranNoInput(contact: any, value?: string) {
    // debugger
    const tranNo = contact.tranNo

    if (tranNo.length === 0) {
      contact.tranNoValid = false;
      this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + contact.receiptNo + '  Amount:' + contact.payAmount, {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } else if (tranNo.length < 4) {
      contact.tranNoValid = false;
      this.toastr.warning('Please enter a Tran No', 'Warning !--for ' + contact.receiptNo + '  Amount:' + contact.payAmount, {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } else {
      contact.tranNoValid = true;
      contact.tranNoError = null;
      // Further checks if needed (e.g., API validation)
    }
  }
  chkbank(contact, event) {
    console.log(contact)
    console.log(event)
  }

  onDisplayColumnChange(event: any, element: any) {
    if (!event.checked) {
      element.ReportColumnWidth = 0;
      element.ReportColumnAligment = "";
    }
  }
  setflag = false
  totalPayment = 0

  Save() {
    this.totalPayment = 0;
    this.setflag = true;
    for (let item of this.dsPayList.data) {

      // if (item.payAmount == 0) continue; // ✅ skip validation
      if (item.payMode1 === 'CASH') {
        item.tranNo = "0";
        item.bankName = '';
      }

      if (item.payMode1 == 'CARD' || item.payMode1 == 'CHEQUE' || item.payMode1 == 'NET BANKIN' || item.payMode1 == 'UPI') {

        // sachin sirs point to remove tranNo manditory
        // if (!item.tranNo || item.tranNo.length < 4) {
        //     this.toastr.warning(
        //         'Please enter a Tran No',
        //         'Warning !--for ' + item.receiptNo + ' Amount:' + item.payAmount
        //     );
        //     this.setflag = false;
        //     break;
        // }

        if (!item.bankName || item.bankName == '') {
          this.toastr.warning(
            'Please Select Bank Name',
            'Warning ! for ' + item.receiptNo + ' Amount:' + item.payAmount
          );
          this.setflag = false;
          break;
        }
      }

      this.totalPayment += item.payAmount;
    }

    if (!this.setflag) {
      return;
    }

    debugger
    // continue only if valid
    console.log(this.dsPayList.data)
    this.tpaymentsArray.clear();
    this.dsPayList.data.forEach(item => {
      if (item.payAmount > 0) {   // ✅ skip zero amount rows
        this.tpaymentsArray.push(this.createpayFormarray(item as tPaymentChange));
      }
    });

    const payload = {
      paymentModel: this.mainpaymentForm.value.tpaymentUpdate 
    };
    console.log(payload)

    this._Paymentmodesevice.TPaymentUpdate(this.vpaymentId, payload)
      .subscribe(() => {
        this._matDialog.closeAll();
      });
  }

  getselectObjPayMode(obj) {
    console.log(obj)
    this.selectedPaymnet1 = obj.text
    //  this.onChangePaymentType();
  }

  getBanklist() {
    // this.selectedRow = contact;
    this.bankList = [];
    this.filteredbankList = [];
    const SelectQuery = {
      searchFields: [
      ],
      mode: 'BankNameList'
    };

    this._Paymentmodesevice.getBankNameList(SelectQuery).subscribe((res: any) => {

      this.bankList = Array.isArray(res) ? res : [];
      this.filteredbankList = [...this.bankList];
      console.log(this.filteredbankList)
    });
  }

  filterbankList(value: string) {
    if (!value) {
      this.filteredbankList = [...this.bankList];
      return;
    }

    const searchValue = value.toLowerCase();

    this.filteredbankList = this.bankList.filter(item =>
      String(item.BankName ?? '').toLowerCase().includes(searchValue) ||

      String(item.BankName ?? '').toLowerCase().includes(searchValue)
    );
  }

  onOptionSelectedBank(contact, event: any) {
    debugger
    if (contact) {
      contact.bankName = event.option.value;
    }
  }


  public payList: Paymode[] = [];
  filteredpayList: Paymode[] = [];
  selectedRow: any;
  getPaymodelist() {
    // this.selectedRow = contact;
    this.payList = [];
    this.filteredpayList = [];
    const SelectQuery = {
      searchFields: [

      ],
      mode: 'PaymentMode'
    };

    this._Paymentmodesevice.getpaymodeList(SelectQuery).subscribe((res: any) => {

      this.payList = Array.isArray(res) ? res : [];
      this.filteredpayList = [...this.payList];
      console.log(this.filteredpayList)
    });
  }

  filterList(value: string) {
    if (!value) {
      this.filteredpayList = [...this.payList];
      return;
    }

    const searchValue = value.toLowerCase();

    this.filteredpayList = this.payList.filter(item =>
      String(item.Value ?? '').toLowerCase().includes(searchValue) ||

      String(item.Value ?? '').toLowerCase().includes(searchValue)
    );
  }

  onOptionSelected(contact, event: any) {
    debugger
    if (event.option.value == 'CARD' || event.option.value == 'CHEQUE' || event.option.value == 'NET BANKING') {
      contact.vCardCheckStatus = true
    }
  }

  onClose() {
    this._matDialog.closeAll()
  }

  getValidationMessages() {
    return {
      bankName1: [
        { name: "required", Message: "bankName is required" }
      ],
      consultantDocId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
      CompanyId: [
        { name: "required", Message: "Company is required" }
      ],
      paymentType1: [
        { name: "required", Message: "Payment Mode is required" }
      ],
    };
  }
}

export class Paymode {
  ConstantId: any;
  Value: any;
  constructor(Paymode) {
    this.ConstantId = Paymode.ConstantId || 0;
    this.Value = Paymode.Value || '';

  }

}
export class BankNames {
  BankId: any;
  BankName: any;
  constructor(BankNames) {
    this.BankId = BankNames.BankId || 0;
    this.BankName = BankNames.BankName || '';

  }

}

export class tPaymentChange {
  paymentId: any
  billNo: any
  receiptNo: any
  paymentDate: any
  payAmount: any
  payMode: any
  tranNo: any
  bankName: any
  validationDate: any
  advanceUsedAmount: any
  onlineTranNo: any
  onlineTranResponse: any
  payMode1: any
  id: any;
  // 'refundId',
  cashCounterId: any
  transactionType: any
  isSelfORCompany: any
  tranMode: any
  comments: any
  opdipdType: any
  patientName: any
  vCardCheckStatus: any

  constructor(tPaymentChange) {
    {

      this.paymentId = tPaymentChange.paymentId || 0;
      this.billNo = tPaymentChange.billNo || 0;
      this.receiptNo = tPaymentChange.receiptNo || '';
      this.paymentDate = tPaymentChange.paymentDate || '';
      this.payAmount = tPaymentChange.payAmount || "";
      this.payMode = tPaymentChange.payMode || '';
      this.tranNo = tPaymentChange.tranNo || '';
      this.bankName = tPaymentChange.bankName || '';
      this.validationDate = tPaymentChange.validationDate || '';
      this.advanceUsedAmount = tPaymentChange.advanceUsedAmount || 0;
      this.onlineTranNo = tPaymentChange.onlineTranNo || '';

      this.onlineTranResponse = tPaymentChange.onlineTranResponse || 0;
      this.cashCounterId = tPaymentChange.cashCounterId || 0;
      this.transactionType = tPaymentChange.transactionType || '';
      this.isSelfORCompany = tPaymentChange.isSelfORCompany || "";
      this.tranMode = tPaymentChange.tranMode || '';
      this.comments = tPaymentChange.comments || '';
      this.opdipdType = tPaymentChange.opdipdType || 0;
      this.patientName = tPaymentChange.patientName || '';
      this.payMode1 = tPaymentChange.payMode1 || '';
      this.vCardCheckStatus = tPaymentChange.vCardCheckStatus || true;
      this.id = tPaymentChange.id || 0
    }
  }

}

export class PaymentChange {
  PayDate: any;
  BillNo: any;
  RegNo: number;
  PatientName: string;
  BillAmt: any;
  PaidAmt: any;
  CashAmt: number;
  ChequeAmt: any;
  CardAmt: number;
  User: any;

  Date: number;
  ReceiptNo: number;
  SalesNo: number;
  patientName: string;
  paidAmount: number;
  cashPayAmount: number;
  chequePayAmount: number;
  ChequeNo: any;
  ChequeBankName: any;
  cardPayAmount: number;
  CardNo: any;
  CardBankName: any;
  neftPayAmount: any;
  NEFTNo: any;
  NEFTBankName: any;
  payTMAmount: any;
  PayTMTranNo: any;
  // PaymentId: any;
  TarrifName: any;
  NetAmount: any;
  paymentId: any;
  billNo: any;
  NeftPay: any;
  receiptNo: any;
  advanceUsedAmount: any;
  advanceId: any;
  refundId: any;
  transactionType: any;
  remark: any
  addBy: any
  chequeDate: any
  cardDate: any
  pBillNo: any
  cashCounterId: any

  isSelfOrcompany: any
  chCashPayAmount: any
  chChequePayAmount: any
  chCardPayAmount: any
  chAdvanceUsedAmount: any
  chNeftpayAmount: any
  chPayTmamount: any
  tranMode: any
  companyId: any
  wfamount: any;
  tdsamount: any
  strId: any
  opdipdtype: any
  PaymentId: any
  Neftdate: any

  bankName: any
  tranNo: any
  onlineTranNo: any
  payMode1: any
  currentDate = new Date().toISOString()
  salesId: any

  constructor(PaymentChange) {
    {
      this.PayDate = PaymentChange.PayDate || 0;
      this.BillNo = PaymentChange.BillNo || 0;
      this.RegNo = PaymentChange.RegNo || 0;
      this.PatientName = PaymentChange.PatientName || "";
      this.BillAmt = PaymentChange.BillAmt || 0;
      this.PaidAmt = PaymentChange.PaidAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.User = PaymentChange.User || '';

      this.Date = PaymentChange.Date || 0;
      this.ReceiptNo = PaymentChange.ReceiptNo || 0;
      this.SalesNo = PaymentChange.SalesNo || 0;
      this.patientName = PaymentChange.patientName || "";
      this.paidAmount = PaymentChange.paidAmount || 0;
      this.cashPayAmount = PaymentChange.cashPayAmount || 0;
      this.chequePayAmount = PaymentChange.chequePayAmount || 0;
      this.ChequeNo = PaymentChange.ChequeNo || 0;
      this.ChequeBankName = PaymentChange.ChequeBankName || 0;
      this.cardPayAmount = PaymentChange.cardPayAmount || 0;
      this.CardBankName = PaymentChange.CardBankName || '';
      this.CardNo = PaymentChange.CardNo || 0;
      this.neftPayAmount = PaymentChange.neftPayAmount || 0;
      this.NEFTNo = PaymentChange.NEFTNo || 0;
      this.NEFTBankName = PaymentChange.NEFTBankName || '';
      this.paymentId = PaymentChange.paymentId || 0;
      this.billNo = PaymentChange.billNo || 0;
      this.receiptNo = PaymentChange.receiptNo || 0;
      this.chequeDate = PaymentChange.chequeDate || this.currentDate;
      this.cardDate = PaymentChange.cardDate || this.currentDate;

      this.advanceUsedAmount = PaymentChange.advanceUsedAmount || 0;
      this.advanceId = PaymentChange.advanceId || 0;
      this.refundId = PaymentChange.refundId || 0;
      this.transactionType = PaymentChange.transactionType || 0;
      this.remark = PaymentChange.remark || 0;
      this.addBy = PaymentChange.addBy || 0;
      this.PaymentId = PaymentChange.PaymentId || 0;
      this.payTMAmount = PaymentChange.payTMAmount || 0;
      this.PayTMTranNo = PaymentChange.PayTMTranNo || 0;
      this.TarrifName = PaymentChange.TarrifName || 0;
      this.NetAmount = PaymentChange.NetAmount || 0;
      this.CashAmt = PaymentChange.CashAmt || 0;
      this.ChequeAmt = PaymentChange.ChequeAmt || 0;
      this.CardAmt = PaymentChange.CardAmt || 0;
      this.NeftPay = PaymentChange.NeftPay || 0;
      this.pBillNo = PaymentChange.pBillNo || 0;
      this.cashCounterId = PaymentChange.cashCounterId || 0;
      this.chChequePayAmount = PaymentChange.chChequePayAmount || 0;
      this.chCashPayAmount = PaymentChange.chCashPayAmount || 0;
      this.chCardPayAmount = PaymentChange.chCardPayAmount || 0;
      this.chAdvanceUsedAmount = PaymentChange.chAdvanceUsedAmount || 0;
      this.chNeftpayAmount = PaymentChange.chNeftpayAmount || 0;
      this.chPayTmamount = PaymentChange.chPayTmamount || 0;
      this.tranMode = PaymentChange.tranMode || '';
      this.companyId = PaymentChange.companyId || 0;
      this.wfamount = PaymentChange.wfamount || 0;
      this.tdsamount = PaymentChange.tdsamount || 0;
      this.Neftdate = PaymentChange.Neftdate || this.currentDate;
      this.strId = PaymentChange.strId || 0;
      this.opdipdtype = PaymentChange.opdipdtype || 1;
      this.bankName = PaymentChange.bankName || '';
      this.tranNo = PaymentChange.tranNo || '';
      this.onlineTranNo = PaymentChange.onlineTranNo || '';
      this.payMode1 = PaymentChange.payMode1 || '';
      this.salesId = PaymentChange.salesId || 0;
    }
  }

}