import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvalidDataValidator } from 'app/main/shared/validators/invalide-validators';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { IPSearchListService } from '../ip-search-list.service';

@Component({
  selector: 'app-ip-paymentwith-advance',
  templateUrl: './ip-paymentwith-advance.component.html',
  styleUrls: ['./ip-paymentwith-advance.component.scss']
})
export class IpPaymentwithAdvanceComponent implements OnInit {


  chipsElements = [
    { name: 'Advance', state: true },
    { name: 'Cash', state: false },
    { name: 'Card', state: false },
    { name: 'Cheque', state: false },
    { name: 'NEFT', state: false },
    { name: 'UPI', state: false },
    { name: 'Wrf Option', state: false }
  ];

  paymentForm: FormGroup;
  advanceData: any;
  now: Date;
  netPayAmt: number = 0;
  cashAmt: number = 0;
  cardAmt: number = 0;
  cardNo: any;
  cardBankName: any;
  cardDate: Date;
  chequeAmt: number = 0;
  chequeNo: any;
  chequeBankName: any;
  chequeDate: Date;
  neftAmt: number = 0;
  neftNo: any;
  neftBankName: any;
  neftDate: Date;
  paytmAmt: number = 0;
  paytmTransNo: any;
  paytmDate: Date;
  wrfAmt: number = 0;
  paidAmt: number = 0;
  balanceAmt: number = 0;
  paidAmtPrev: number = 0;
  balanceAmtPrev: number = 0;
  advanceAmt: number = 0;
  screenFromString = 'payment-form';
  isLoading: string = '';
  dateTimeObj: any;
  AdvanceId: any;
  BankNameList: any = [];
  BankNameList1: any = [];
  BankNameList2: any = [];

  
  displayedColumns = [
    'Date',
    'AdvanceNo',
    'AdvanceAmount',
    'UsedAmount',
    'BalanceAmount',
    'RefundAmount'
  ];
  dataSource = new MatTableDataSource<any>();
  //bANK filter
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredBank: ReplaySubject<any> = new ReplaySubject<any>(1);


  //cheque filter
  public chequebankFilterCtrl: FormControl = new FormControl();
  public filteredChequebank: ReplaySubject<any> = new ReplaySubject<any>(1);


  //Card filter
  public cardbankFilterCtrl: FormControl = new FormControl();
  public filteredCardbank: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  balAmountValues: any[] = [];
  constructor(
    private formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ipSearchService: IPSearchListService,
    private dialogRef: MatDialogRef<IpPaymentwithAdvanceComponent>,
    private authServie: AuthenticationService
  ) {
    this.advanceData = data;
    console.log('this.advanceData===', this.advanceData);
    if (this.advanceData.FromName == "IP-Bill") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
      // this.cashAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
      this.getBalanceAmt();
    }
    ;
    if (this.advanceData.FromName == "IP-Payment") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
    
    }
  }

  ngOnInit(): void {
    this.createForm();
    this.getAdvcanceDetails(false);
    console.log(this.authServie.currentUserValue);
    this.getBankNameList();
    this.getBankNameList1();
    this.getBankNameList2();

    
    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBank();
      });

    this.chequebankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filtercardbank();
      });

    this.cardbankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterchequebank();
      });
  }



  createForm() {
    this.paymentForm = this.formBuilder.group({
      advanceAmountController: [''],

      cashAmountController: ['', Validators.required],

      cardAmountController: [''],
      cardNumberController: ['', Validators.required],
      cardBankNameController: ['', Validators.required],
      cardDateController: [(new Date()), Validators.required],
      chequeAmountController: ['', Validators.required],
      chequeNumberController: ['', Validators.required],
      chequeBankNameController: ['', Validators.required],
      chequeDateController:[(new Date()).toISOString()],
      neftAmountController: ['', Validators.required],
      neftNumberController: ['', Validators.required],
      neftBankNameController: ['', Validators.required],
      neftDateController: [(new Date()).toISOString()],

      paytmAmountController: ['', Validators.required],
      paytmMobileNoController: ['', Validators.required],
      paytmDateController:[(new Date()).toISOString()], 

      wrfAmountController: ['', Validators.required],

      paidAmountController: ['', Validators.required],
      balanceAmountController: ['', Validators.required],
      commentsController: ['', Validators.required],
      Iscredited: [0]
    });
  }

  
  // bank filter code
  private filterBank() {

    if (!this.BankNameList) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBank.next(this.BankNameList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredBank.next(
      this.BankNameList.filter(bank => bank.BankName.toLowerCase().indexOf(search) > -1)
    );
  }


  // bank filter code
  private filtercardbank() {

    if (!this.BankNameList) {
      return;
    }
    // get the search keyword
    let search = this.chequebankFilterCtrl.value;
    if (!search) {
      this.filteredChequebank.next(this.BankNameList2.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredChequebank.next(
      this.BankNameList2.filter(bank => bank.BankName.toLowerCase().indexOf(search) > -1)
    );
  }


  // bank filter code
  private filterchequebank() {

    if (!this.BankNameList) {
      return;
    }
    // get the search keyword
    let search = this.cardbankFilterCtrl.value;
    if (!search) {
      this.filteredCardbank.next(this.BankNameList1.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredCardbank.next(
      this.BankNameList1.filter(bank => bank.BankName.toLowerCase().indexOf(search) > -1)
    );
  }



  getBankNameList() {
    this.ipSearchService.getBankMasterCombo().subscribe(data => {
      this.BankNameList = data;
      this.filteredBank.next(this.BankNameList.slice());


    });
  }

  getBankNameList1() {
    this.ipSearchService.getBankMasterCombo().subscribe(data => {
      this.BankNameList1 = data;
      this.filteredCardbank.next(this.BankNameList1.slice());
    });
  }


  getBankNameList2() {
    this.ipSearchService.getBankMasterCombo().subscribe(data => {
      this.BankNameList2 = data;
      this.filteredChequebank.next(this.BankNameList2.slice());
    });
  }

  getAdvcanceDetails(isReset?: any) {
    this.dataSource.data = [];
    this.isLoading = 'loading';
    let Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.advanceObj.OPD_IPD_Id + ""
    this.ipSearchService.getAdvcanceDetails(Query).subscribe(data => {
      // this.chargeslist = data as ChargesList[];
      this.dataSource.data = data as [];
      console.log(data);
      if (!isReset) {
        this.calculateBalance();
      }
      this.isLoading = '';
      if (this.dataSource.data.length == 0) {
        this.isLoading = 'no-data';
        this.chipsElements[0].state = false;
        this.chipsElements[1].state = true;

        this.cashAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
      } else {
        this.dataSource.data.forEach((element, index) => {
          this.balAmountValues[index] = element.BalanceAmount;
          console.log(typeof element.BalanceAmount);
        });
      }
    },
      (error) => {
        this.isLoading = 'no-data';
      });
  }

  calculateBalance() {
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      let totalAdvanceAmt = 0;
      let netAmtLocal = this.netPayAmt;
      this.dataSource.data.forEach(element => {
        if (netAmtLocal > element.BalanceAmount) {
          element.UsedAmount = element.BalanceAmount;
          element.BalanceAmount = element.BalanceAmount - element.UsedAmount;
          netAmtLocal = netAmtLocal - element.UsedAmount;
        } else if (netAmtLocal <= element.BalanceAmount) {
          element.BalanceAmount = element.BalanceAmount - netAmtLocal;
          element.UsedAmount = netAmtLocal;
          netAmtLocal = netAmtLocal - element.UsedAmount;
        }
        totalAdvanceAmt += element.UsedAmount;
      });
      this.advanceAmt = totalAdvanceAmt;
      this.calculatePaidAmt();
    }

  }

  chipsSelectionChanged(event: any) {
    let chipName = event.name;
    if (event.state) {
      switch (chipName) {
        case 'Advance':
          this.advanceAmt = 0;
          this.resetAdvance();
          break;

        case 'Cash':
          this.cashAmt = 0;
          break;

        case 'Card':
          this.cardAmt = 0;
          break;

        case 'Cheque':
          this.chequeAmt = 0;
          break;

        case 'NEFT':
          this.neftAmt = 0;
          break;

        case 'UPI':
          this.paytmAmt = 0;
          break;

        case 'Wrf Option':
          this.wrfAmt = 0;
          break;

        default:
          break;
      }
      this.calculatePaidAmt();
    }
    event.state = !event.state;
    console.log('==', event);
    // this.cdr.detectChanges();
  }

  resetAdvance() {
    this.netPayAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
    // this.cashAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
    this.paidAmt = parseInt(this.advanceData.advanceObj.AdvanceAmount);
    this.getBalanceAmt();
    this.getAdvcanceDetails(true);
  }

  calculatePaidAmt(controlNameParam?) {
    Object.keys(this.paymentForm.controls).forEach(controlName => {
      if (controlNameParam == controlName) {
        this.paymentForm.get(controlNameParam).markAsTouched();
      } else {
        this.paymentForm.get(controlName).markAsUntouched();
      }

    });
    let advanceAmtLocal = '0';
    let cashAmtLocal = '0';
    let cardAmtLocal = '0';
    let chequeAmtLocal = '0';
    let neftAmtLocal = '0';
    let paytmAmtLocal = '0';
    let wrfAmtLocal = '0';
    let paidAmtLocal;
    // if (this.cashAmt) {
    this.paidAmt = null;
    this.balanceAmt = null;
    paidAmtLocal = parseInt(this.advanceAmt.toString() ? this.advanceAmt.toString() : advanceAmtLocal)
      + parseInt(this.cashAmt.toString() ? this.cashAmt.toString() : cashAmtLocal)
      + parseInt(this.cardAmt.toString() ? this.cardAmt.toString() : cardAmtLocal)
      + parseInt(this.chequeAmt.toString() ? this.chequeAmt.toString() : chequeAmtLocal)
      + parseInt(this.neftAmt.toString() ? this.neftAmt.toString() : neftAmtLocal)
      + parseInt(this.paytmAmt.toString() ? this.paytmAmt.toString() : paytmAmtLocal)
      + parseInt(this.wrfAmt.toString() ? this.wrfAmt.toString() : wrfAmtLocal);
    if (paidAmtLocal > this.netPayAmt) {
      const controllers = this.paymentForm.controls;
      Object.keys(controllers).forEach(controlName => {
        const controlValue = this.paymentForm.get(controlName);
        if (controlValue && controlValue.touched) {
          controlValue.setValidators(this.rangevalidation(true));
          controlValue.updateValueAndValidity();
          return;
        } else if (controlValue.untouched) {
          controlValue.markAsUntouched();
          controlValue.clearValidators();
          controlValue.updateValueAndValidity();
        }
      });
      this.paidAmt = this.paidAmtPrev;
      this.balanceAmt = this.balanceAmtPrev;
    } else {
      this.paidAmt = paidAmtLocal;
      this.getBalanceAmt();
      this.paidAmtPrev = this.paidAmt;
      const controllers = this.paymentForm.controls;
      Object.keys(controllers).forEach(controlName => {
        const controlValue = this.paymentForm.get(controlName); //controls[controlName].value;
        controlValue.markAsUntouched();
        controlValue.clearValidators();
        controlValue.updateValueAndValidity();
      });
    }
    // }
  }

  getAdvanceAmt(element, index) {
    // console.log(index);
    // console.log(element.UsedAmount);
    if (element.UsedAmount == "") {
      element.BalanceAmount = this.balAmountValues[index] - 0;
    } else if (parseInt(element.UsedAmount) <= this.balAmountValues[index]) {
      element.BalanceAmount = this.balAmountValues[index] - parseInt(element.UsedAmount);
      this.calculateBalance2();
      // this.calculateBalance();
    }
    // else if(parseInt(element.UsedAmount) > this.balAmountValues[index]){
    //   element.UsedAmount = balTem;
    // }
  }

  calculateBalance2() {
    if (this.dataSource.data && this.dataSource.data.length > 0) {
      let totalAdvanceAmt = 0;
      let usedAmtTemp = 0;

      let netAmtLocal = this.netPayAmt;
      this.dataSource.data.forEach((element: any) => {
        if (element.UsedAmount == "") {
          usedAmtTemp = 0;
        } else {
          usedAmtTemp = parseInt(element.UsedAmount);
        }
        if (netAmtLocal >= usedAmtTemp) {
          totalAdvanceAmt = totalAdvanceAmt + usedAmtTemp;
        }
      });
      this.advanceAmt = totalAdvanceAmt;
      this.calculatePaidAmt();
    }
  }

  rangevalidation(value) {
    const controlValidation = this.ipSearchService.fieldValidations();
    const controlRule = controlValidation.find(row => row.key === 'cash_controller');
    const validation = controlRule.validation;
    if (value) {
      validation.push(InvalidDataValidator(true));
    }
    return validation;
  }

  getBalanceAmt() {
    this.balanceAmt = this.netPayAmt - this.paidAmt;
    this.balanceAmtPrev = this.balanceAmt;
  }

  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  saveClicked() {
    if (this.dataSource.data.length > 0) {
      this.AdvanceId = this.dataSource.data[0]['AdvanceId'];
    } else {
      this.AdvanceId = 0;
    }
    ;
    let Paymentobj = {};
    Paymentobj['PaymentId'] = '0';
    Paymentobj['ReceiptNo'] = '';
    Paymentobj['PaymentDate'] = this.dateTimeObj.date;
    Paymentobj['PaymentTime'] = this.dateTimeObj.time;
    Paymentobj['CashPayAmount'] = this.cashAmt;
    Paymentobj['ChequePayAmount'] = this.chequeAmt;
    Paymentobj['ChequeNo'] = this.chequeNo;
    Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName || '';
    Paymentobj['ChequeDate'] = this.dateTimeObj.date;
    Paymentobj['CardPayAmount'] = this.cardAmt;
    Paymentobj['CardNo'] = this.cardNo;
    Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName || '';
    Paymentobj['CardDate'] = this.dateTimeObj.date;
    Paymentobj['AdvanceUsedAmount'] = this.advanceAmt;
    Paymentobj['AdvanceId'] = this.AdvanceId,
      Paymentobj['RefundId'] = '0';
    Paymentobj['TransactionType'] = 0;
    Paymentobj['Remark'] = '';
    Paymentobj['AddBy'] = '1';
    Paymentobj['IsCancelled'] = 'false';
    Paymentobj['IsCancelledBy'] = '0';

    Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
    Paymentobj['CashCounterId'] = '0';
    Paymentobj['IsSelfORCompany'] = '0';
    Paymentobj['CompanyId'] = '0';
    Paymentobj['NEFTPayAmount'] = this.neftAmt;
    Paymentobj['NEFTNo'] = this.neftNo;
    Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName || '';
    Paymentobj['NEFTDate'] = this.dateTimeObj.date;
    Paymentobj['PayTMAmount'] = this.paytmAmt;
    Paymentobj['PayTMTranNo'] = this.paytmTransNo;
    Paymentobj['PayTMDate'] = this.dateTimeObj.date;

    const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
    let submitDataPay = {
      ipPaymentInsert
    };
    console.log(submitDataPay);

    //
    let Advancesarr = [];

    this.dataSource.data.forEach((element) => {
      let Advanceobj = {};
      console.log(element);
      Advanceobj['AdvanceNo'] = this.dataSource.data[0].AdvanceId;
      Advanceobj['AdvanceDetailID'] = this.dataSource.data[0].AdvanceDetailID;
      Advanceobj['AdvanceAmount'] = this.dataSource.data[0].AdvanceAmount;
      Advanceobj['UsedAmount'] = this.dataSource.data[0].UsedAmount;
      Advanceobj['Date'] = this.dataSource.data[0].Date;
      Advanceobj['BalanceAmount'] = this.dataSource.data[0].BalanceAmount;
      Advanceobj['RefundAmount'] = this.dataSource.data[0].RefundAmount;
      Advancesarr.push(Advanceobj);
    });


    let IsSubmit = {
      "submitDataPay": submitDataPay,
      "submitDataAdvancePay": Advancesarr,
      "PaidAmt":this.paymentForm.get('paidAmountController').value,
      "BalAmt" :this.paymentForm.get('balanceAmountController').value,
      "IsSubmitFlag": true,
      "Iscredited": this.paymentForm.get('Iscredited').value
    }

    console.log(IsSubmit);

    this.dialogRef.close(IsSubmit);
    // console.log('======================= Payment ======');
    // console.log(IsSubmit);
  }


  onClose() {


    let Paymentobj = {};
    // Paymentobj['PaymentId'] = 0;
    Paymentobj['BillNo'] = 0,// this.billNo;
      Paymentobj['ReceiptNo'] = '',//'RE';
      Paymentobj['PaymentDate'] = '',//this.dateTimeObj.date;
      Paymentobj['PaymentTime'] = '',//this.dateTimeObj.time;
      Paymentobj['CashPayAmount'] = 0,// parseInt(this.cashAmt.toString());
      Paymentobj['ChequePayAmount'] = 0,// parseInt(this.chequeAmt.toString());
      Paymentobj['ChequeNo'] = 0,//this.chequeNo;
      Paymentobj['BankName'] = '',//this.paymentForm.get('chequeBankNameController').value.BankName;
      Paymentobj['ChequeDate'] = '',//this.dateTimeObj.date;
      Paymentobj['CardPayAmount'] = '',//parseInt(this.cardAmt.toString());
      Paymentobj['CardNo'] = '',//this.cardNo;
      Paymentobj['CardBankName'] = '',// this.paymentForm.get('cardBankNameController').value.BankName;
      Paymentobj['CardDate'] = '',//this.dateTimeObj.date;
      Paymentobj['AdvanceUsedAmount'] = 0;
    Paymentobj['AdvanceId'] = 0;
    Paymentobj['RefundId'] = 0;
    Paymentobj['TransactionType'] = 0;
    Paymentobj['Remark'] = '',//'REMArk';
      Paymentobj['AddBy'] = '',// this.accountService.currentUserValue.userId,
      Paymentobj['IsCancelled'] = 0;
    Paymentobj['IsCancelledBy'] = 0;
    Paymentobj['IsCancelledDate'] = '',//this.dateTimeObj.date;
      Paymentobj['CashCounterId'] = 0;
    Paymentobj['IsSelfORCompany'] = 0;
    Paymentobj['CompanyId'] = 0;
    Paymentobj['NEFTPayAmount'] = '',//parseInt(this.neftAmt.toString());
      Paymentobj['NEFTNo'] = '',// this.neftNo;
      Paymentobj['NEFTBankMaster'] = '',//this.paymentForm.get('neftBankNameController').value.BankName;
      Paymentobj['NEFTDate'] = '',//this.dateTimeObj.date;
      Paymentobj['PayTMAmount'] = '',//parseInt(this.paytmAmt.toString());
      Paymentobj['PayTMTranNo'] = '',// this.paytmTransNo;
      Paymentobj['PayTMDate'] = '',// this.dateTimeObj.date;
      Paymentobj['PaidAmt'] = '',//this.paymentForm.get('paidAmountController').value;
      Paymentobj['BalanceAmt'] = ''//this.paymentForm.get('balanceAmountController').value;

    const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
    let submitDataPay1 = {
      ipPaymentInsert,
    };
    let IsSubmit = {

      "submitDataPay": submitDataPay1,
      "IsSubmitFlag": false
    }
    this.dialogRef.close(IsSubmit);
  }

  // getAdvanceHeaderObj() {
  //   const x = {
  //     AdvanceDetailID: 0,
  //     TransactionID: 0,
  //     Date: this.dateTimeObj.date,
  //     Time: this.dateTimeObj.time,
  //     UsedAmount: '0',
  //     RefundAmount: '0',
  //     ReasonOfAdvanceId: '0',
  //     Reason: 'sada'
  //   };
  //   // let xx = {advanceHeaderInsert: x}
  //   const y = new AdvanceDetails(x);
  //   return y;
  // }

}

export class IpPaymentInsert {
  PaymentId: number;
  BillNo: number;
  ReceiptNo: any;
  PaymentDate: any;
  PaymentTime: any;
  CashPayAmount: any;
  ChequePayAmount: any;
  ChequeNo: any;
  BankName: any;
  ChequeDate: any;
  CardPayAmount: any;
  CardNo: any;
  CardBankName: any;
  CardDate: any;
  AdvanceUsedAmount: any;
  AdvanceId: any;
  RefundId: any;
  TransactionType: any;
  Remark: any;
  AddBy: any;
  IsCancelledBy: any;
  IsCancelledDate: any;
  CashCounterId: any;
  IsSelfORCompany: any;
  CompanyId: any;
  NEFTPayAmount: any;
  NEFTNo: any;
  NEFTBankMaster: any;
  NEFTDate: any;
  PayTMAmount: any;
  PayTMTranNo: any;
  PayTMDate: any;

  constructor(IpPayment) {
    this.PaymentId = IpPayment.PaymentId || '0';
    this.BillNo = IpPayment.BillNo || '0';
    this.ReceiptNo = IpPayment.ReceiptNo || '';
    this.PaymentDate = IpPayment.PaymentDate || '';
    this.PaymentTime = IpPayment.PaymentTime || '';
    this.CashPayAmount = IpPayment.CashPayAmount || '0';
    this.ChequePayAmount = IpPayment.ChequePayAmount || '0';
    this.ChequeNo = IpPayment.ChequeNo || '';

    this.BankName = IpPayment.BankName || '';
    this.ChequeDate = IpPayment.ChequeDate || '';
    this.CardPayAmount = IpPayment.CardPayAmount || '0';
    this.CardNo = IpPayment.CardNo || '';
    this.CardBankName = IpPayment.CardBankName || '';

    this.CardDate = IpPayment.CardDate || '';
    this.AdvanceUsedAmount = IpPayment.AdvanceUsedAmount || 0;
    this.AdvanceId = IpPayment.AdvanceId || 0;
    this.RefundId = IpPayment.RefundId || 0;
    this.TransactionType = IpPayment.TransactionType || 1;
    this.Remark = IpPayment.Remark || '';

    this.AddBy = IpPayment.AddBy || 0;
    this.IsCancelledBy = IpPayment.IsCancelledBy || 0;
    this.IsCancelledDate = IpPayment.IsCancelledDate || '01/01/1900';

    this.CashCounterId = IpPayment.CashCounterId || 0;
    this.IsSelfORCompany = IpPayment.IsSelfORCompany || '';
    this.CompanyId = IpPayment.CompanyId || 0;

    this.NEFTPayAmount = IpPayment.NEFTPayAmount || 0;
    this.NEFTNo = IpPayment.NEFTNo || '';
    this.NEFTBankMaster = IpPayment.NEFTBankMaster || '';
    this.NEFTDate = IpPayment.NEFTDate || '';

    this.PayTMAmount = IpPayment.PayTMAmount || 0;
    this.PayTMTranNo = IpPayment.PayTMTranNo || '';
    this.PayTMDate = IpPayment.PayTMDate || '';
  }

}

export class IpAdvancePaymentInsert {
  AdvanceNo: number;
  AdvanceAmount: number;
  UsedAmount: any;
  Date: any;
  BalanceAmount: any;
  RefundAmount: any;


  constructor(IpAdvancePaymentInsert) {
    this.AdvanceNo = IpAdvancePaymentInsert.AdvanceNo || '0';
    this.AdvanceAmount = IpAdvancePaymentInsert.AdvanceAmount || '0';
    this.UsedAmount = IpAdvancePaymentInsert.UsedAmount || '';
    this.Date = IpAdvancePaymentInsert.Date || '';
    this.BalanceAmount = IpAdvancePaymentInsert.BalanceAmount || '0';
    this.RefundAmount = IpAdvancePaymentInsert.RefundAmount || '0';

  }

}

