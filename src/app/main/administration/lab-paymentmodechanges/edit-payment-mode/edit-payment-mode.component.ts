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
import { element } from 'protractor';
import { concat } from 'lodash';


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
      //'payAmount', 
     // 'payMode',
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
  totalBalAmt:any=0;

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
      this.totalBalAmt = this.registerObj.payAmount || 0 
    } 
    this.getPaylist();
    this.getPaymodelist();
    this.getBanklist();

    this.tpaymentsArray.push(this.createpayFormarray());
  } 
  CreaeMainPayform() {
    return this._formBuilder.group({
      paymentModel: this._formBuilder.array([])
    });
  }

  createpayFormarray(item: any = {}): FormGroup { 
    return this._formBuilder.group({
      paymentId: [item?.paymentId || 0 , [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId:[this._loggedService.currentUserValue.user.unitId,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      billNo: [this.vBillNo,[this._FormvalidationserviceService.onlyNumberValidator()]],
      opdipdtype: [4,[this._FormvalidationserviceService.onlyNumberValidator()]],
      receiptNo: [item?.receiptNo ,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      paymentDate: [item?.paymentDate || '1900-01-01'],
      paymentTime: [item?.paymentTime],
      payAmount: [item.updateAmt,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      tranNo: [item.tranNo || '0'],
      bankName: [item.bankName,[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      validationDate: [item?.paymentDate || '1900-01-01'],
      advanceUsedAmount: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      comments: ['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],  
      payMode: [item.payMode1 || "", [this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      onlineTranNo: "0",
      onlineTranResponse: "0",
      companyId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      advanceId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      refundId: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      cashCounterId: [item?.cashCounterId || 0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionType:  [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      transactionLabel: 'LAB_Bill',
      isSelfOrcompany: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      tranMode: "HOSP",
      isCancelled: false,
      isCancelledBy: [0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      isCancelledDate: "1900-01-01",
      createdBy:[this._loggedService.currentUserValue.userId,[this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  } 
  get tpaymentsArray(): FormArray {
    return this.mainpaymentForm.get('paymentModel') as FormArray;
  }

  chargelist: any = []; 
  temparorylist:any=[];
  getPaylist() {
    const vdata = {
      first: 0,
      rows: 100,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [ { fieldName: "BillNo", fieldValue: this.vBillNo, opType: OperatorComparer.Equals }  ],
      Columns: [],
      exportType: "JSON"
    }; 
    this._Paymentmodesevice.getpaybBillBrowseList(vdata).subscribe(response => {
debugger
      this.temparorylist = response.data; 
      this.vnetPayAmt = this.temparorylist.reduce((sum: number, item: any) => {
      return sum + (Number(item.payAmount) || 0);
       }, 0);
       this.totalBalAmt =  this.vnetPayAmt

      this.chargelist = response.data; 

const list :any = [];
 list.push({
        ...this.chargelist[0], 
    payMode1:'', 
    updateAmt: null,
    filteredList: [...this.payList],
    tranNo: '',
    bankName: '', 
    isSplit: false,
   }) 

if(this.chargelist.length){ 
  this.chargelist.forEach(element=>{ 
    const balaAmt  = this.totalBalAmt - element.payAmount
    this.totalBalAmt = balaAmt
   list.push({
    ...element,

    paymentId: element?.paymentId || 0, 
    payMode1:element.payMode,
    updateAmt: element.payAmount,
    tranNo: element.tranNo || '',
    isSplit: true,
    bankName: element.bankName || '',
    billNo:element.billNo || 0,
   }) 
  })
  this.dsPayList.data = list
  this.chargelist = this.dsPayList.data
}
    });
  }  
onAmountChange(contact: any) {   
    // Step 1: Calculate total of all rows
    debugger
   const updateAmt = +contact.updateAmt || 0
   contact.updateAmt = updateAmt;
  let totalUsed = 0; 

  if (updateAmt > this.totalBalAmt && contact.isSplit == false) {
    this.toastr.warning('Amount cannot be greater than balance amount');
    contact.updateAmt = null; 
    return;
  }
 
  this.dsPayList.data.forEach((c: any) => {
  if (c.isSplit === true) {
    totalUsed += Number(c.updateAmt) || 0;
  }
});

  // Step 2: Validate
  if (totalUsed > this.vnetPayAmt) {
    this.toastr.warning('Amount cannot be greater than balance amount');
    contact.updateAmt = null;
    this.totalBalAmt = totalUsed
    return;
  }

  // Step 3: Update balance
  this.totalBalAmt = this.vnetPayAmt - totalUsed;
}
  splitPayment(contact: any) {
debugger
    let updateAmt = Number(contact.updateAmt);
    const  totalBalAmt = Number(this.totalBalAmt);
    if (!this.totalBalAmt){
     this.toastr.warning('Balacne Amount is 0');
      return;
    } 
    if (!updateAmt || updateAmt <= 0 || !contact.payMode1) return; 
 

    if(contact.payMode1 == 'UPI' || contact.payMode1 == 'CHEQUE' || contact.payMode1 == 'CARD'){
    if(!(contact?.tranNo || 0)){ let msg = '';
    if (contact.payMode1 == 'UPI') {msg = 'Enter UPI transaction number';} 
    else if (contact.payMode1 == 'CARD') {msg = 'Enter Card transaction number';} 
    else if (contact.payMode1 == 'CHEQUE') {msg = 'Enter Cheque number'; } 
    this.toastr.warning(msg);
    return;}
    } 
 
    if(contact.payMode1 == 'NET BANKING'){
      if(!(contact?.tranNo || 0)){ 
      this.toastr.warning('Enter transaction number');
      return;}
      if(!(contact?.bankName || '')){ 
      this.toastr.warning('Please Select Bank Name');
      return;}
    }

    //need to check duplicate records
    const checkmode = this.dsPayList.data.some(item=> item.payMode1 === contact.payMode1 && item.isSplit == true)
        if (checkmode) {
      this.toastr.warning('Same payment mode already selected');
      return;
    } 
    // need to check paymentid
   // const checkpaymentid = this.temparorylist.filter(item=> item.payMode === contact.payMode1) 
 
    // 👉 Create new row (acts like ORIGINAL)
    let newRow = { 
      billNo: contact.billNo,
      paymentDate: contact.paymentDate,
      paymentTime:contact.paymentTime,
      receiptNo: contact.receiptNo, 
      payAmount: updateAmt,
      //payMode: contact.payMode1, 
      tranNo: contact.tranNo,
      bankName: contact.bankName,  
      payMode1:  contact.payMode1,
      updateAmt: updateAmt, 
     // parentId: contact.id, 
      isSplit: true,            
      paymentId: 0 ,
      cashCounterId:contact.cashCounterId
    }; 
    // 👉 Clear inputs
    contact.payMode1 = '';
    contact.updateAmt = null;
    contact.tranNo = '';
    contact.bankName = ''; 
    let data = [...this.dsPayList.data]; 
    data.push(newRow); 
    this.dsPayList.data = data;
    this.chargelist = this.dsPayList.data
    this.dsPayList._updateChangeSubscription();
    const addbalAmt = totalBalAmt - updateAmt
    this.totalBalAmt = addbalAmt;
    this.getPaymodelist();
    this.getBanklist();
  } 
  deleteTableRow(element: any) {
    //  const payamt = +element?.payAmount || 0
    // let data={
    //  "paymentId": element?.paymentId || 0,
    //  "isCancelledBy": this._loggedService.currentUserValue.userId
    // }
    // this._Paymentmodesevice.Deletepaymentmode(data).subscribe(data=>{
    //   if(data){
    //     const addbalamt = this.totalBalAmt + payamt 
    //     this.totalBalAmt = addbalamt;
    //     this.getPaylist();
    //   }
    // }) 

        const payamt = +element?.payAmount || 0
        const index = this.chargelist.indexOf(element);
        if (index >= 0) {
            this.chargelist.splice(index, 1);
            this.dsPayList.data = [];
            this.dsPayList.data = this.chargelist;
        }
        this.toastr.warning('Success !', 'Record Deleted Successfully'); 
        const addbalamt = this.totalBalAmt + payamt 
        this.totalBalAmt = addbalamt;
        this.dsPayList._updateChangeSubscription();
  } 
  onTranNoInput(contact: any, value?: string) {
    // debugger
    const tranNo = contact.tranNo 
    if (tranNo.length === 0) {
      contact.tranNoValid = false;
      this.toastr.warning('Please enter a Tran No', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } else if (tranNo.length < 4) {
      contact.tranNoValid = false;
      this.toastr.warning('Please enter a Tran No', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    } else {
      contact.tranNoValid = true;
      contact.tranNoError = null;
      // Further checks if needed (e.g., API validation)
    }
  }   
  Save() {
    debugger
    if(!this.dsPayList.data) {
      this.toastr.warning('Please check list is blank');
      return;
    }  
    if (this.totalBalAmt > 0){
    this.toastr.warning(`Please check Balance Amount: ${this.totalBalAmt}`);
    return;
    }
    if (!this.isValidForm()) {
      return;
    } 
    let savePayList: any = [];
    savePayList = this.dsPayList.data.filter(item => item.isSplit === true) 
    this.tpaymentsArray.clear();
    savePayList.forEach(item => {
      this.tpaymentsArray.push(this.createpayFormarray(item as tPaymentChange));
    });
    console.log(this.mainpaymentForm.value)
    this._Paymentmodesevice.TPaymentUpdate(this.vpaymentId, this.mainpaymentForm.value).subscribe(() => {
      this.onClose();
    });
  }
  onClose() {
    this.chargelist = [];
    this.dsPayList.data = [];
    this.temparorylist = [];
    this._matDialog.closeAll() 
  } 
  isValidForm(): boolean {
    let savePayList: any = [];
    savePayList = this.dsPayList.data.filter(item => item.isSplit === true) 
    const invalidItem = savePayList.find((item, index) => { 
      if (item.payMode1 == '') {
        this.toastr.warning(
          `PayMode cannot be null`,
          'Warning !',
          { toastClass: 'tostr-tost custom-toast-warning' }
        );
        return true;
      }
      if (item.receiptNo <= 0 || item.receiptNo == '' || item.receiptNo == null) {
        this.toastr.warning(
          `Receiption cannot be  0`,
          'Warning !', { toastClass: 'tostr-tost custom-toast-warning' }
        );
        return true;
      }
      if (item.billNo <= 0 || item.billNo == '' || item.billNo == null) {
        this.toastr.warning(
          `Bill No cannot be  0`,
          'Warning !', { toastClass: 'tostr-tost custom-toast-warning' }
        );
        return true;
      }
      return false;
    });
    return !invalidItem; // valid only if no invalid row
  }


  getselectObjPayMode(obj) {
    console.log(obj)
    this.selectedPaymnet1 = obj.text
    //  this.onChangePaymentType();
  } 
  getBanklist() { 
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
    this.getPaymodelist();
    this.getBanklist();
  }


  public payList: Paymode[] = [];
  filteredpayList: Paymode[] = [];
  selectedRow: any;
  getPaymodelist() { 
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
    if(event.option.value == 'UPI' || event.option.value == 'CHEQUE' || event.option.value == 'CARD'){
    if(!(contact?.tranNo || 0)){ let msg = '';
    if (contact.payMode1 == 'UPI') {msg = 'Enter UPI transaction number';} 
    else if (contact.payMode1 == 'CARD') {msg = 'Enter Card transaction number';} 
    else if (contact.payMode1 == 'CHEQUE') {msg = 'Enter Cheque number'; } 
    this.toastr.warning(msg);
    return;}
    }  
    else if(event.option.value == 'NET BANKING'){
      if(!(contact?.tranNo || 0)){ 
      this.toastr.warning('Enter transaction number');
      return;}
      if(!(contact?.bankName || '')){ 
      this.toastr.warning('Please Select Bank Name');
      return;}
    }
    else if(event.option.value == 'CASH' || event.option.value == 'TDS' || event.option.value == 'WF'){
      contact.tranNo = ''
      contact.bankName = '' 
    }
    this.getPaymodelist();
    this.getBanklist();
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
    keyPressDigitsOnly(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
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