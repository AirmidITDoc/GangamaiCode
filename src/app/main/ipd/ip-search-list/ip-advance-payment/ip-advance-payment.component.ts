import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { IPSearchListService } from '../ip-search-list.service';
import { takeUntil } from 'rxjs/operators';
import { InvalidDataValidator } from 'app/main/shared/validators/invalide-validators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-ip-advance-payment',
  templateUrl: './ip-advance-payment.component.html',
  styleUrls: ['./ip-advance-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPAdvancePaymentComponent implements OnInit {


  chipsElements = [
    { name: 'Cash', state: true },
    { name: 'Card', state: false },
    { name: 'Cheque', state: false },
    { name: 'NEFT', state: false },
    { name: 'UPI', state: false },
    { name: 'Wrf Option', state: false }
  ];

  paidamt: any;
  balanceamt: any;

  paymentForm: FormGroup;
  billNo: number;
  advanceData: any = {};
  now: Date;
  netPayAmt: number = 0;
  cashAmt: number = 0;
  cardAmt: number = 0;
  cardNo: any;
  refundId: number;
  cardBankName: any;
  BankNameList: any = [];
  BankNameList1: any = [];
  BankNameList2: any = [];
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
  balanceAmt1: number = 0;
  paidAmtPrev: number = 0;
  balanceAmtPrev: number = 0;
  screenFromString = 'payment-form';
  isLoading: string = '';
  balAmt: any = [];
  dateTimeObj: any;
  PatientName: any;
  BillDate: any;

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

  constructor(
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private ipSearchService: IPSearchListService,
    private accountService: AuthenticationService,
    private dialogRef: MatDialogRef<IPAdvancePaymentComponent>,
    private authServie: AuthenticationService,

  ) {
   
    this.advanceData = data;
    console.log(this.advanceData.advanceObj);

    if (this.advanceData.FromName == "Advance-Refund") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.OPD_IPD_Id);
      this.PatientName = this.advanceData.advanceObj.PatientName;

    }
    if (this.advanceData.FromName == "OP-Bill") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);

    }
    if (this.advanceData.FromName == "IP-Bill") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.BillDate = this.advanceData.advanceObj.Date;

    }
    if (this.advanceData.FromName == "Advance") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.BillDate = this.advanceData.advanceObj.Date;

    }
    if (this.advanceData.FromName == "SETTLEMENT") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.BillDate = this.advanceData.advanceObj.Date;

    }
    else {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.getBalanceAmt();
    }
  }

  bankNameData: any;
  checkAmt(netPayAmt, cashAmt, cardAmt, neftAmt, paytmAmt, wrfAmt) {
    if (parseInt(netPayAmt) < (parseInt(cashAmt) + parseInt(cardAmt) + parseInt(neftAmt) + parseInt(paytmAmt) + parseInt(wrfAmt))) {
      return true;
    }
    else {
      return false;
    }
  }

  ngOnInit(): void {

    this.paymentForm = this.createForm();
    this.getBankNameList();
    this.getBankNameList1();
    this.getBankNameList2();
    if (this.cashAmt) {
      this.calculatePaidAmt();
      const controllers = this.paymentForm.controls;
      Object.keys(controllers).forEach(controlName => {
        const controlValue = this.paymentForm.get(controlName);
        console.log(controlName);
        if (controlValue.untouched) {
          controlValue.markAsUntouched();
          controlValue.clearValidators();
          controlValue.updateValueAndValidity();
        }
      });
    }

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
    return this.formBuilder.group({
      // cashAmountController: ['', []],
      cardAmountController: ['', []],
      cardNumberController: ['', []],
      cardBankNameController: ['', []],
      cardDateController: [(new Date()).toISOString()],
      chequeAmountController: ['', []],
      chequeNumberController: ['', []],
      chequeBankNameController: ['', []],
      chequeDateController: [(new Date()).toISOString()],
      neftAmountController: ['', []],
      neftNumberController: ['', []],
      neftBankNameController: ['', []],
      neftDateController: [(new Date()).toISOString()],
      paytmAmountController: ['', []],
      paytmMobileNoController: ['', []],
      paytmDateController: [(new Date()).toISOString()],
      wrfAmountController: ['', []],

      cashAmountController: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")

      ]],

      paidAmountController: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      balanceAmountController: ['', [Validators.pattern('^[0-9]{2,8}$')]],
      commentsController: [''],
      Iscredited: [1]

    });
  }

  get f() { return this.paymentForm.controls }


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
  async chipsSelectionChanged(event: any) {
    if (this.cashAmt < this.netPayAmt) {
      this.calculatePaidAmt();
      const controllers = this.paymentForm.controls;
      Object.keys(controllers).forEach(controlName => {
        const controlValue = this.paymentForm.get(controlName);
        console.log(controlName);
        if (controlValue.untouched) {
          controlValue.markAsUntouched();
          controlValue.clearValidators();
          controlValue.updateValueAndValidity();
        }
      });
      console.log(event)
      let chipName = event.name;
      event.state = !event.state;
      if (event.state) {
        switch (chipName) {
          case 'Cash': {
            this.cashAmt = 0;
            this.paymentForm.get('cashAmountController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")]);
            this.paymentForm.controls['cashAmountController'].updateValueAndValidity();
            break;
          }

          case 'Card': {
            this.cardAmt = 0;
            console.log("378")
            this.paymentForm.controls["cardAmountController"].setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")
            ]);
            this.paymentForm.controls["cardAmountController"].updateValueAndValidity();

            this.paymentForm.controls["cardNumberController"].setValidators([Validators.required,
            Validators.pattern("^[0-9]*$"),
              //   Validators.minLength(16),
              //   Validators.maxLength(16)
            ]);
            this.paymentForm.controls["cardNumberController"].updateValueAndValidity();

            this.paymentForm.controls["cardBankNameController"].setValidators([
              Validators.required,
              // Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]);
            this.paymentForm.controls["cardBankNameController"].updateValueAndValidity();
            this.paymentForm.patchValue({ cardDateController: new Date() });
            console.log("Line 398", this.paymentForm);
            break;
          }
          case 'Cheque':
            this.chequeAmt = 0;
            console.log("406")
            this.paymentForm.controls['chequeAmountController'].setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")
            ]); this.paymentForm.controls['chequeAmountController'].updateValueAndValidity();

            this.paymentForm.get('chequeNumberController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")
            ]); this.paymentForm.get('chequeNumberController').updateValueAndValidity();

            this.paymentForm.controls['chequeBankNameController'].setValidators([
              Validators.required,
              // Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]); this.paymentForm.controls['chequeBankNameController'].updateValueAndValidity();
            this.paymentForm.patchValue({ chequeDateController: new Date() });
            break;

          case 'NEFT':
            this.neftAmt = 0;
            this.paymentForm.get('neftAmountController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")
            ]); this.paymentForm.controls['neftAmountController'].updateValueAndValidity();
            this.paymentForm.get('neftNumberController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")
            ]); this.paymentForm.controls['neftNumberController'].updateValueAndValidity();
            this.paymentForm.get('neftBankNameController').setValidators([
              Validators.required,
              // Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
            ]); this.paymentForm.controls['neftBankNameController'].updateValueAndValidity();
            this.paymentForm.patchValue({ neftDateController: new Date() });
            break;

          case 'UPI':
            this.paytmAmt = 0;
            this.paymentForm.get('paytmAmountController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")]);
            this.paymentForm.controls['paytmAmountController'].updateValueAndValidity();
            this.paymentForm.get('paytmMobileNoController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              Validators.minLength(10),
              Validators.maxLength(10)
            ]);
            
            this.paymentForm.controls['paytmMobileNoController'].updateValueAndValidity();
            this.paymentForm.patchValue({ paytmDateController: new Date() });
            break;

          case 'Wrf Option':
            this.wrfAmt = 0;
            this.paymentForm.get('wrfAmountController').setValidators([Validators.required, Validators.pattern('^[0-9]{2,8}$')]);
            this.paymentForm.controls['wrfAmountController'].updateValueAndValidity();
            break;

          default:
            console.log(460)
            break;
        }
        this.calculatePaidAmt();
      }
      else {
        switch (chipName) {
          case 'Cash': {
            this.cashAmt = 0;
            this.paymentForm.get('cashAmountController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$")]);
            this.paymentForm.controls['cashAmountController'].updateValueAndValidity();
            break;
          }

          case 'Card': {
            this.cardAmt = 0;
            console.log("378")
            this.paymentForm.controls["cardAmountController"].clearValidators();
            this.paymentForm.controls["cardAmountController"].updateValueAndValidity();
            this.paymentForm.controls["cardNumberController"].clearValidators();
            this.paymentForm.controls["cardNumberController"].updateValueAndValidity();
            this.paymentForm.patchValue({ cardNumberController: '' });
            this.paymentForm.controls["cardBankNameController"].clearValidators();
            this.paymentForm.controls["cardBankNameController"].updateValueAndValidity();
            this.paymentForm.patchValue({ cardBankNameController: '' });
            this.paymentForm.patchValue({ cardDateController: new Date() });
            console.log("Line 398", this.paymentForm);
            break;
          }
          case 'Cheque':
            this.chequeAmt = 0;
            console.log("406")
            this.paymentForm.controls['chequeAmountController'].clearValidators();
            this.paymentForm.controls['chequeAmountController'].updateValueAndValidity();

            this.paymentForm.get('chequeNumberController').clearValidators();
            this.paymentForm.get('chequeNumberController').updateValueAndValidity();
            this.paymentForm.patchValue({ chequeNumberController: '' });
            this.paymentForm.controls['chequeBankNameController'].clearValidators();
            this.paymentForm.controls['chequeBankNameController'].updateValueAndValidity();
            this.paymentForm.patchValue({ chequeBankNameController: '' });
            this.paymentForm.patchValue({ chequeDateController: new Date() });
            break;

          case 'NEFT':
            this.neftAmt = 0;
            this.paymentForm.get('neftAmountController').clearValidators();
            this.paymentForm.controls['neftAmountController'].updateValueAndValidity();
            this.paymentForm.get('neftNumberController').clearValidators();
            this.paymentForm.controls['neftNumberController'].updateValueAndValidity();
            this.paymentForm.patchValue({ neftNumberController: '' });
            this.paymentForm.get('neftBankNameController').clearValidators();
            this.paymentForm.controls['neftBankNameController'].updateValueAndValidity();
            this.paymentForm.patchValue({ neftBankNameController: '' });
            this.paymentForm.patchValue({ neftDateController: new Date() });
            break;

          case 'PayTM':
            this.paytmAmt = 0;
            this.paymentForm.get('paytmAmountController').clearValidators();
            this.paymentForm.controls['paytmAmountController'].updateValueAndValidity();
            this.paymentForm.get('paytmMobileNoController').clearValidators();
            this.paymentForm.controls['paytmMobileNoController'].updateValueAndValidity();
            this.paymentForm.patchValue({ paytmMobileNoController: '' });
            this.paymentForm.patchValue({ paytmDateController: new Date() });
            break;

          case 'Wrf Option':
            this.wrfAmt = 0;
            this.paymentForm.get('wrfAmountController').clearValidators();
            this.paymentForm.controls['wrfAmountController'].updateValueAndValidity();
            break;
        }
        this.calculatePaidAmt();
      }
    }
    // event.state = !event.state;
    console.log('==', event);
    // this.cdr.detectChanges();
  }



  calculatePaidAmt(controlNameParam?) {
    // console.log(controlNameParam != 'cashAmountController');
    Object.keys(this.paymentForm.controls).forEach(controlName => {
      if (controlNameParam == controlName) {
        this.paymentForm.get(controlNameParam).markAsTouched();
      } else {
        this.paymentForm.get(controlName).markAsUntouched();
      }


    });

    let cashAmtLocal = '0';
    let cardAmtLocal = '0';
    let chequeAmtLocal = '0';
    let neftAmtLocal = '0';
    let paytmAmtLocal = '0';
    let wrfAmtLocal = '0';
    let paidAmtLocal;
    // if (this.cashAmt) {
    this.paidAmt = null;
    this.balanceAmt1 = this.paymentForm.get('balanceAmountController').value;
    this.balanceAmt = null;

    // if(paidAmtLocal < this.balanceAmt1)
    // {
    //   Swal.fire('CHK');
    // }

    paidAmtLocal = parseInt(this.cashAmt ? this.cashAmt.toString() : cashAmtLocal)
      + parseInt(this.cardAmt ? this.cardAmt.toString() : cardAmtLocal)
      + parseInt(this.chequeAmt ? this.chequeAmt.toString() : chequeAmtLocal)
      + parseInt(this.neftAmt ? this.neftAmt.toString() : neftAmtLocal)
      + parseInt(this.paytmAmt ? this.paytmAmt.toString() : paytmAmtLocal)
      + parseInt(this.wrfAmt ? this.wrfAmt.toString() : wrfAmtLocal);
    console.log(paidAmtLocal)
    console.log(this.balanceAmt1)

    debugger;


    console.log(this.balanceAmt1);
    console.log(paidAmtLocal);
    console.log(this.paidAmt);

    // if (this.cashAmt <=paidAmtLocal){*****************************first time not work
    debugger;
    // if(chipName)
    //  if( paidAmtLocal > this.balanceAmt1){
    // Swal.fire("Amount chk")
    //   }
    if (paidAmtLocal > this.netPayAmt) {
      this.paidAmt = this.paidAmtPrev;
      this.balanceAmt = this.balanceAmtPrev;
      var val = this.paymentForm.get(controlNameParam).value;

      // this.paymentForm.patchValue({controlNameParam:val.toString().substr(0, val.length - 1)});
      // return;
      // const controllers = this.paymentForm.controls;
      // Object.keys(controllers).forEach(controlName => {
      //   const controlValue = this.paymentForm.get(controlName);
      //   if (controlValue && controlValue.touched) {
      //     controlValue.setValidators(this.rangevalidation(true));
      //     controlValue.updateValueAndValidity();
      //     return;
      //   } else if (controlValue.untouched) {
      //     controlValue.markAsUntouched();
      //     controlValue.clearValidators();
      //     controlValue.updateValueAndValidity();
      //   }
      // });

    } else {
      this.paidAmt = paidAmtLocal;
      this.getBalanceAmt();
      this.paidAmtPrev = this.paidAmt;
      const controllers = this.paymentForm.controls;
      Object.keys(controllers).forEach(controlName => {
        const controlValue = this.paymentForm.get(controlName); //controls[controlName].value;
        // controlValue.markAsUntouched();
        // console.log("controlValue",controlName)
        // controlValue.clearValidators();
        // controlValue.updateValueAndValidity();
      });
    }
    // }
    // else{
    //   Swal.fire("Enter validate Amount");
    // }
    // }

    // }
  }

  rangevalidation(value) {
    console.log(value)
    const controlValidation = this.ipSearchService.fieldValidations();
    const controlRule = controlValidation.find(row => row.key === 'cash_controller');
    const validation = controlRule.validation;
    console.log(validation)
    if (value) {
      validation.push(InvalidDataValidator(true));
    }
    else {
      validation.push(InvalidDataValidator(false));
    }
    console.log(validation)
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
    debugger
    if (this.balanceAmt == 0) {
      let Paymentobj = {};
      if (this.advanceData.FromName == "OP-Payment") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.date;
        Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
        Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
        Paymentobj['ChequeNo'] = this.chequeNo;
        Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
        Paymentobj['ChequeDate'] = this.dateTimeObj.date;
        Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
        Paymentobj['CardNo'] = this.cardNo;
        Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
        Paymentobj['CardDate'] = this.dateTimeObj.date;
        Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
        Paymentobj['CashCounterId'] = 0;
        Paymentobj['IsSelfORCompany'] = 0;
        Paymentobj['CompanyId'] = 0;
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date;
        Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
      }
      else if (this.advanceData.FromName == "OP-Bill") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.date;
        Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
        Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
        Paymentobj['ChequeNo'] = this.chequeNo;
        Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
        Paymentobj['ChequeDate'] = this.dateTimeObj.date;
        Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
        Paymentobj['CardNo'] = this.cardNo;
        Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
        Paymentobj['CardDate'] = this.dateTimeObj.date;
        Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
        Paymentobj['CashCounterId'] = 0;
        Paymentobj['IsSelfORCompany'] = 0;
        Paymentobj['CompanyId'] = 0;
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date;
        Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
      }
      else if (this.advanceData.FromName == "IP-Bill") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.date;
        Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
        Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
        Paymentobj['ChequeNo'] = this.chequeNo;
        Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
        Paymentobj['ChequeDate'] = this.dateTimeObj.date;
        Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
        Paymentobj['CardNo'] = this.cardNo;
        Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
        Paymentobj['CardDate'] = this.dateTimeObj.date;
        Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
        Paymentobj['CashCounterId'] = 0;
        Paymentobj['IsSelfORCompany'] = 0;
        Paymentobj['CompanyId'] = 0;
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date;
        Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
      }
      else if (this.advanceData.FromName == "Advance") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.date;
        Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
        Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
        Paymentobj['ChequeNo'] = this.chequeNo;
        Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
        Paymentobj['ChequeDate'] = this.dateTimeObj.date;
        Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
        Paymentobj['CardNo'] = this.cardNo;
        Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
        Paymentobj['CardDate'] = this.dateTimeObj.date;
        Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 1;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
        Paymentobj['CashCounterId'] = 0;
        Paymentobj['IsSelfORCompany'] = 0;
        Paymentobj['CompanyId'] = 0;
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date;
        Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
      }
      else if (this.advanceData.FromName == "Advance-Refund") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.date;
        Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
        Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
        Paymentobj['ChequeNo'] = this.chequeNo;
        Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
        Paymentobj['ChequeDate'] = this.dateTimeObj.date;
        Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
        Paymentobj['CardNo'] = this.cardNo;
        Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
        Paymentobj['CardDate'] = this.dateTimeObj.date;
        Paymentobj['AdvanceUsedAmount'] = 0;
        Paymentobj['AdvanceId'] = 0;
        Paymentobj['RefundId'] = 0;
        Paymentobj['TransactionType'] = 0;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
          Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
        Paymentobj['CashCounterId'] = 0;
        Paymentobj['IsSelfORCompany'] = 0;
        Paymentobj['CompanyId'] = 0;
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date;
        Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
      }

      const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
      let submitDataPay = {
        ipPaymentInsert,
      };
      let IsSubmit = {
        "submitDataPay": submitDataPay,
        // "submitDataAdvancePay":ipAdvanceInsert,
        "IsSubmitFlag": true
      }
      console.log(IsSubmit);
      this.dialogRef.close(IsSubmit);
      // console.log('======================= Payment ======');
      // console.log(IsSubmit);
    }
    else {
      Swal.fire('Error !', 'Balance Amount Have to Zero', 'error')
    }
  }



  onClose() {
    debugger
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
      Paymentobj['TransactionType'] = 2;
      Paymentobj['Remark'] = '',//'REMArk';
      Paymentobj['AddBy'] = '',// this.accountService.currentUserValue.user.id,
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
      Paymentobj['PaidAmt'] = 0,//this.paymentForm.get('paidAmountController').value;
      Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

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

  onClose1() {
    this.dialogRef.close();
  }




  // saveClicked() {
  //   debugger
  //   let Paymentobj = {};
  //   if (this.balanceAmt == 0) {


  //       Paymentobj['BillNo'] = this.billNo;
  //       Paymentobj['ReceiptNo'] = '';
  //       Paymentobj['PaymentDate'] = this.dateTimeObj.date;
  //       Paymentobj['PaymentTime'] = this.dateTimeObj.date;
  //       Paymentobj['CashPayAmount'] = parseInt(this.cashAmt.toString());
  //       Paymentobj['ChequePayAmount'] = parseInt(this.chequeAmt.toString());
  //       Paymentobj['ChequeNo'] = this.chequeNo;
  //       Paymentobj['BankName'] = this.paymentForm.get('chequeBankNameController').value.BankName;
  //       Paymentobj['ChequeDate'] = this.dateTimeObj.date;
  //       Paymentobj['CardPayAmount'] = parseInt(this.cardAmt.toString());
  //       Paymentobj['CardNo'] = this.cardNo;
  //       Paymentobj['CardBankName'] = this.paymentForm.get('cardBankNameController').value.BankName;
  //       Paymentobj['CardDate'] = this.dateTimeObj.date;
  //       Paymentobj['AdvanceUsedAmount'] = 0;
  //       Paymentobj['AdvanceId'] = 0;
  //       Paymentobj['RefundId'] = 0;
  //       Paymentobj['TransactionType'] = 0;
  //       Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
  //       Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
  //       Paymentobj['IsCancelled'] = 0;
  //       Paymentobj['IsCancelledBy'] = 0;
  //       Paymentobj['IsCancelledDate'] = this.dateTimeObj.date;
  //       Paymentobj['CashCounterId'] = 0;
  //       Paymentobj['IsSelfORCompany'] = 0;
  //       Paymentobj['CompanyId'] = 0;
  //       Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
  //       Paymentobj['NEFTNo'] = this.neftNo;
  //       Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
  //       Paymentobj['NEFTDate'] = this.dateTimeObj.date;
  //       Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
  //       Paymentobj['PayTMTranNo'] = this.paytmTransNo;
  //       Paymentobj['PayTMDate'] = this.dateTimeObj.date;
  //       Paymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
  //       Paymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;

  //     const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
  //     let submitDataPay = {
  //       ipPaymentInsert:ipPaymentInsert,
  //     };
  //     let IsSubmit = {
  //       "submitDataPay": submitDataPay,
  //       "IsSubmitFlag": true
  //     }
  //     console.log(IsSubmit);
  //     this.dialogRef.close(IsSubmit);
  //     // console.log('======================= Payment ======');
  //     // console.log(IsSubmit);
  //   }
  //   else {
  //     Swal.fire('Error !', 'Balance Amount Have to Zero', 'error')
  //   }
  // }
}




export class IpPaymentInsert {
  PaymentId: number;
  BillNo: number;
  ReceiptNo: any;
  PaymentDate: Date;
  PaymentTime: any;
  CashPayAmount: number;
  ChequePayAmount: number;
  ChequeNo: any;
  BankName: any;
  ChequeDate: Date;
  CardPayAmount: number;
  CardNo: any;
  CardBankName: any;
  CardDate: Date;
  AdvanceUsedAmount: number;
  AdvanceId: any;
  RefundId: any;
  TransactionType: any;
  Remark: any;
  AddBy: any;
  IsCancelled: boolean;
  IsCancelledBy: any;
  IsCancelledDate: Date;
  CashCounterId: number;
  IsSelfORCompany: number;
  CompanyId: any;
  NEFTPayAmount: number;
  NEFTNo: any;
  NEFTBankMaster: any;
  NEFTDate: any;
  PayTMAmount: number;
  PayTMTranNo: any;
  PayTMDate: Date;
  PaidAmt: number;
  BalanceAmt: number;

  constructor(IpPayment) {
    this.PaymentId = IpPayment.PaymentId || 0;
    this.BillNo = IpPayment.BillNo || 0;
    this.ReceiptNo = IpPayment.ReceiptNo || '';
    this.PaymentDate = IpPayment.PaymentDate || '01/01/1900';
    this.PaymentTime = IpPayment.PaymentTime || '01/01/1900';
    this.CashPayAmount = IpPayment.CashPayAmount || 0;
    this.ChequePayAmount = IpPayment.ChequePayAmount || 0;
    this.ChequeNo = IpPayment.ChequeNo || '';

    this.BankName = IpPayment.BankName || '';
    this.ChequeDate = IpPayment.ChequeDate || '01/01/1900';
    this.CardPayAmount = IpPayment.CardPayAmount || 0;
    this.CardNo = IpPayment.CardNo || '';
    this.CardBankName = IpPayment.CardBankName || '';

    this.CardDate = IpPayment.CardDate || '01/01/1900';
    this.AdvanceUsedAmount = IpPayment.AdvanceUsedAmount || 0;
    this.AdvanceId = IpPayment.AdvanceId || 0;
    this.RefundId = IpPayment.RefundId || 0;
    this.TransactionType = IpPayment.TransactionType || 0;
    this.Remark = IpPayment.Remark || '';

    this.AddBy = IpPayment.AddBy || 0;
    this.IsCancelled = IpPayment.IsCancelled || 0;
    this.IsCancelledBy = IpPayment.IsCancelledBy || 0;
    this.IsCancelledDate = IpPayment.IsCancelledDate || '01/01/1900';

    this.CashCounterId = IpPayment.CashCounterId || 0;
    this.IsSelfORCompany = IpPayment.IsSelfORCompany || 0;
    this.CompanyId = IpPayment.CompanyId || 0;

    this.NEFTPayAmount = IpPayment.NEFTPayAmount || 0;
    this.NEFTNo = IpPayment.NEFTNo || '';
    this.NEFTBankMaster = IpPayment.NEFTBankMaster || '';
    this.NEFTDate = IpPayment.NEFTDate || '01/01/1900';

    this.PayTMAmount = IpPayment.PayTMAmount || 0;
    this.PayTMTranNo = IpPayment.PayTMTranNo || '';
    this.PayTMDate = IpPayment.PayTMDate || '01/01/1900';

    this.PaidAmt = IpPayment.PaidAmt || 0;
    this.BalanceAmt = IpPayment.BalanceAmt || 0;
  }

}
