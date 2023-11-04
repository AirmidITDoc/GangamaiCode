import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OPSearhlistService } from '../op-searhlist.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IpPaymentInsert } from '../op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-op-payment-new',
  templateUrl: './op-payment-new.component.html',
  styleUrls: ['./op-payment-new.component.scss']
})
export class OpPaymentNewComponent implements OnInit {

  patientDetailsFormGrp: FormGroup;
  paymentArr1: any[] = this.opService.getPaymentArr();
  paymentArr2: any[] = this.opService.getPaymentArr();
  paymentArr3: any[] = this.opService.getPaymentArr();
  paymentArr4: any[] = this.opService.getPaymentArr();
  paymentArr5: any[] = this.opService.getPaymentArr();
  paymentRowObj = {
    cash: false,
    cheque: false,
    card: false,
    upi: false,
    neft: false,
  };

  PatientHeaderObj: any;

  selectedPaymnet1: string = '';
  selectedPaymnet2: string = '';
  selectedPaymnet3: string = '';
  selectedPaymnet4: string = '';
  selectedPaymnet5: string = '';

  netPayAmt: number = 0;
  nowDate: Date;
  amount1: any;
  amount2: any;
  amount3: any;
  amount4: any;
  amount5: any;

  dateTimeObj: any;
  screenFromString = 'payment-form';
  paidAmt: number;
  balanceAmt: number =0;
  BankNameList2: any = [];
  BankNameList3: any = [];
  BankNameList4: any = [];
  //latest
  advanceData: any = {};
  billNo: any;
  chequeNo: any;
  chequeAmt: any;
  cashAmt: any;
  cardNo: any;
  PatientName: any;
  BillDate: any;
  paytmTransNo: any;
  neftAmt: any;
  cardAmt: any;
  neftNo: any;
  paytmAmt: any;
  
  filteredOptionsBank2: Observable<string[]>;
  optionsBank2: any[] = [];
  isBank1elected2: boolean = false;
  filteredOptionsBank3: Observable<string[]>;
  optionsBank3: any[] = [];
  isBank1elected3: boolean = false;
  filteredOptionsBank4: Observable<string[]>;
  optionsBank4: any[] = [];
  isBank1elected4: boolean = false


IsCreditflag : boolean=false

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OpPaymentNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opService: OPSearhlistService,
    private accountService: AuthenticationService,
  ) {
    this.nowDate = new Date();
    this.PatientHeaderObj = data;
    
    this.advanceData = this.data.vPatientHeaderObj;
    

    if (this.data.FromName == "Advance") {
      this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.NetPayAmount);
      this.billNo = parseInt(this.advanceData.BillId);
      this.Paymentobj['TransactionType'] = 1;
      this.getBalanceAmt();
      this.IsCreditflag=true;
    }
    if (this.data.FromName == "OP-Bill" || this.PatientHeaderObj.FromName == "IP-Bill") {

      this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
      this.cashAmt = parseInt(this.advanceData.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.NetPayAmount);
      this.billNo = parseInt(this.advanceData.BillId);
      this.PatientName = this.advanceData.PatientName;
      this.BillDate = this.advanceData.Date;
      this.getBalanceAmt();
      this.Paymentobj['TransactionType'] = 0;
      this.IsCreditflag=false
    }
    if (this.PatientHeaderObj.FromName == "SETTLEMENT") {
      this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
      this.cashAmt = parseInt(this.advanceData.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.NetPayAmount);
      this.billNo = parseInt(this.advanceData.BillId);
      this.PatientName = this.advanceData.PatientName;
      this.BillDate = this.advanceData.Date;
      this.getBalanceAmt();
      this.Paymentobj['TransactionType'] = 0;
      this.IsCreditflag=true;
    }
    if (this.PatientHeaderObj.FromName == "SalesSETTLEMENT") {
      this.netPayAmt = parseInt(this.advanceData.TotalAmount);
      this.cashAmt = parseInt(this.advanceData.TotalAmount);
      this.paidAmt = parseInt(this.advanceData.TotalAmount);
      this.billNo = parseInt(this.advanceData.SalesId);
      this.PatientName = this.advanceData.PatientName;
      this.BillDate = this.advanceData.Date;
      this.getBalanceAmt();
      this.Paymentobj['TransactionType'] = 2;
      this.IsCreditflag=true;
    }
    else {
      this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.NetPayAmount);
      this.Paymentobj['TransactionType'] = 2;
      this.getBalanceAmt();
    }
  }

  ngOnInit(): void {
    debugger
    this.patientDetailsFormGrp = this.createForm();
    if(this.PatientHeaderObj.FromName == "SalesSETTLEMENT"){
      this.PatientHeaderObj=this.data.vPatientHeaderObj;
    this.advanceData=this.data.vPatientHeaderObj;
    console.log( this.PatientHeaderObj)
  
    this.selectedPaymnet1 = this.paymentArr1[0].value;
    this.amount1 = this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
    this.getBalanceAmt();
    this.paymentRowObj["cash"] = true;
    this.onPaymentChange(1, 'cash');
    this.paidAmt = this.netPayAmt;

    this.netPayAmt = parseInt(this.advanceData.TotalAmount);
    this.cashAmt = parseInt(this.advanceData.TotalAmount);
    this.paidAmt = parseInt(this.advanceData.TotalAmount);
    this.billNo = parseInt(this.advanceData.SalesId);
    this.PatientName = "SAS",//this.advanceData.PatientName;
    this.BillDate = this.advanceData.Date;
    this.amount1=parseInt(this.advanceData.TotalAmount);
    this.getBalanceAmt();
    this.Paymentobj['TransactionType'] = 4;
    }
    this.onAddClick('cash');
    this.getBankNameList2();
    this.getBankNameList3();
    this.getBankNameList4();
  }

  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  createForm() {
    return this.formBuilder.group({
      paymentType1: [],
      amount1: [this.netPayAmt],
      referenceNumber1: [],
      bankName1: [],
      regDate1: [(new Date()).toISOString()],
      
      paymentType2: [],
      amount2: [],
      referenceNo2: [],
      bankName2: [],
      regDate2: [(new Date()).toISOString()],

      paymentType3: [],
      amount3: [],
      bankName3: [],
      referenceNo3: [],
      regDate3: [(new Date()).toISOString()],

      paymentType4: [],
      amount4: [],
      referenceNo4: [],
      bankName4: [],
      regDate4: [(new Date()).toISOString()],

      paymentType5: [],
      amount5: [],
      bankName5: [],
      regDate5: [(new Date()).toISOString()],
      referenceNo5: [],

      paidAmountController: [],
      balanceAmountController: []

      // paymentType6: [],
      // amount6: [],
      // bankName6: [],
      // regDate6: [(new Date()).toISOString()],
      // referenceNo6: []
    });
  }

  onChangePaymnt(event: any) {
    let value = event.value;
    if (value != 'cash') {
      this.patientDetailsFormGrp.get('referenceNumber1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else {
      this.patientDetailsFormGrp.get('referenceNumber1').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName1').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate1').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  onAddClick(paymentOption: string) {
    this.paymentRowObj[paymentOption] = true;
    switch (paymentOption) {
      case 'cash':
        this.setSecRowValidators(paymentOption);
        break;

      case 'upi':
        this.amount2 = this.netPayAmt - this.amount1;
        this.getBalanceAmt();
        this.setThirdRowValidators(paymentOption);
        break;

      case 'neft':
        this.amount5 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3) + parseInt(this.amount4));
        this.getBalanceAmt();
        this.setThirdRowValidators(paymentOption);
        break;

      case 'cheque':
        this.amount3 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2));
        this.getBalanceAmt();
        this.setFourthRowValidators(paymentOption);
        break;

      case 'card':
        this.amount4 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3));
        this.getBalanceAmt();
        this.setFifthRowValidators(paymentOption);
        break;

      default:
        break;
    }

    // if (paymentOption && paymentOption == 'upi') {

    // }
  }
 
  private _filterBank2(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
       return this.optionsBank2.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }

    
  private _filterBank3(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
       return this.optionsBank3.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }

     
  private _filterBank4(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
       return this.optionsBank4.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }

  }
  getBankNameList2() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList2 = data;
      this.optionsBank2 = this.BankNameList2.slice();
      this.filteredOptionsBank2 = this.patientDetailsFormGrp.get('bankName2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank2(value) : this.BankNameList2.slice()),
      );
      
    });
  }

  getBankNameList3() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList3 = data;
      this.optionsBank3 = this.BankNameList3.slice();
      this.filteredOptionsBank3 = this.patientDetailsFormGrp.get('bankName3').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank3(value) : this.BankNameList3.slice()),
      );
      
    });
  }

  getBankNameList4() {
    this.opService.getBankMasterCombo().subscribe(data => {
      this.BankNameList4 = data;
      this.optionsBank4 = this.BankNameList4.slice();
      this.filteredOptionsBank4 = this.patientDetailsFormGrp.get('bankName4').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank4(value) : this.BankNameList4.slice()),
      );
      
    });
  }


  getOptionTextBank2(option){
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank3(option){
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank4(option){
    return option && option.BankName ? option.BankName : '';
  }


  onRemoveClick(caseId: string) {
    this.paymentRowObj[caseId] = false;
    switch (caseId) {
      case 'upi':
        this.removeThirdValidators();
        break;

      default:
        break;
    }
  }

  onClose() {
    this.dialogRef.close();
  }

  onPaymentChange(rowId: number, value: string) {
    debugger
    switch (rowId) {
      case 1:
        this.paymentArr2 = this.opService.getPaymentArr();
        let element = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr2.splice(element, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let element1 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr3.splice(element1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let element2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr4.splice(element2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let element3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet1);
        this.paymentArr5.splice(element3, 1);
        break;

      case 2:
        this.paymentArr1 = this.opService.getPaymentArr();
        let ele = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr1.splice(ele, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let ele1 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr3.splice(ele1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let ele2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr4.splice(ele2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let ele3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet2);
        this.paymentArr5.splice(ele3, 1);
        this.setSecRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 3:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elem = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr1.splice(elem, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elem1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr2.splice(elem1, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let elem2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr4.splice(elem2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let elem3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet3);
        this.paymentArr5.splice(elem3, 1);
        this.setThirdRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 4:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elemen = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr1.splice(elemen, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elemen1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr2.splice(elemen1, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let elemen2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr3.splice(elemen2, 1);

        this.paymentArr5 = this.opService.getPaymentArr();
        let elemen3 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet4);
        this.paymentArr5.splice(elemen3, 1);
        this.setFourthRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      case 5:
        this.paymentArr1 = this.opService.getPaymentArr();
        let elemnt = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr1.splice(elemnt, 1);

        this.paymentArr2 = this.opService.getPaymentArr();
        let elemnt1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr2.splice(elemnt1, 1);

        this.paymentArr3 = this.opService.getPaymentArr();
        let elemnt2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr3.splice(elemnt2, 1);

        this.paymentArr4 = this.opService.getPaymentArr();
        let elemnt3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet5);
        this.paymentArr4.splice(elemnt3, 1);
        this.setFifthRowValidators(value);
        this.patientDetailsFormGrp.updateValueAndValidity();
        break;

      // case 6:
      //   this.paymentArr1 = this.opService.getPaymentArr();
      //   let elemnt = this.paymentArr1.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr1.splice(elemnt, 1);

      //   this.paymentArr2 = this.opService.getPaymentArr();
      //   let elemnt1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr2.splice(elemnt1, 1);

      //   this.paymentArr3 = this.opService.getPaymentArr();
      //   let elemnt2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr3.splice(elemnt2, 1);

      //   this.paymentArr4 = this.opService.getPaymentArr();
      //   let elemnt3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet5);
      //   this.paymentArr4.splice(elemnt3, 1);
      //   this.setFifthRowValidators(value);
      //   this.patientDetailsFormGrp.updateValueAndValidity();
      //   break;

      default:
        break;
    }
  }

  setPaymentOption() {
    if (this.selectedPaymnet1) {
      let element1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr2.splice(element1, 1);

      let element2 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr3.splice(element2, 1);

      let element3 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr4.splice(element3, 1);

      let element4 = this.paymentArr5.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr5.splice(element4, 1);
    }
  }

  setSecRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo2').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName2').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate2').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setThirdRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('amount3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('referenceNo3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.removeThirdValidators();
    }
  }

  setFourthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate4').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setFifthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate5').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo5').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName5').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate5').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  removeThirdValidators() {
    this.patientDetailsFormGrp.get('amount3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('referenceNo3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('bankName3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('regDate3').clearAsyncValidators();
    this.patientDetailsFormGrp.updateValueAndValidity();
  }
  /**
  amountChange1(controlName) {
    let value = this.patientDetailsFormGrp.get(controlName).value;
    if (value && value > 0) {
      this.amount2 = this.netPayAmt - this.amount1;
    }
    this.getBalanceAmt();
  }
  amountChange2(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount3 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2));
    }
    this.getBalanceAmt();
  }
  amountChange3(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount4 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3));
    }
    this.getBalanceAmt();
  }
  amountChange4(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount5 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3) + parseInt(this.amount4));
    }
    this.getBalanceAmt();
  }
  amountChange5(controlName) {
    this.getBalanceAmt();
  } */
  Paymentobj = {};
  onSubmit() {
  
    this.Paymentobj['BillNo'] = this.PatientHeaderObj.billNo;
    this.Paymentobj['ReceiptNo'] = '';
    this.Paymentobj['PaymentDate'] = ""; //this.dateTimeObj.date;
    this.Paymentobj['PaymentTime'] = "";//this.dateTimeObj.date;
    // if (this.patientDetailsFormGrp.get("paymentType1").value == "cash") {
    //   Paymentobj['CashPayAmount'] = parseInt(this.amount1.toString());
    // } else {
    //   Paymentobj['CashPayAmount'] = 0
    // }
    this.getCashObj('cash');
    this.getChequeObj('cheque');
    this.getCardObj('card');
    this.getNeftObj('neft');
    this.getUpiObj('upi');
    // this.Paymentobj['CashPayAmount'] = this.getAmount("cash");// parseInt(this.cashAmount.toString());
    // this.Paymentobj['ChequePayAmount'] = this.getAmount("cheque");
    // this.Paymentobj['CardPayAmount'] = this.getAmount("card");
    // this.Paymentobj['NEFTPayAmount'] = this.getAmount("neft");
    // this.Paymentobj['PayTMAmount'] = this.getAmount("upi");
    /*if (this.patientDetailsFormGrp.get("paymentType1").value == "cheque") {
      // Paymentobj['ChequePayAmount'] = 0;
      this.Paymentobj['ChequeNo'] = 0;
      // this.Paymentobj['BankName'] = "";
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['ChequePayAmount'] = 0;
      this.Paymentobj['ChequeNo'] = "";
      // this.Paymentobj['BankName'] = "";//this.patientDetailsFormGrp.get('chequeBankNameController').value.BankName;
      this.Paymentobj['ChequeDate'] = "01/01/1900";
    } */
    /*if (this.patientDetailsFormGrp.get("paymentType1").value == "card") {
      // Paymentobj['CardPayAmount'] = 0;
      this.Paymentobj['CardNo'] = 0;
      // this.Paymentobj['CardBankName'] = "";//this.patientDetailsFormGrp.get('cardBankNameController').value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['CardPayAmount'] = 0;
      this.Paymentobj['CardNo'] = "";
      // this.Paymentobj['CardBankName'] = "";//this.patientDetailsFormGrp.get('cardBankNameController').value.BankName;
      this.Paymentobj['CardDate'] = "01/01/1900";
    } */
    this.Paymentobj['AdvanceUsedAmount'] = 0;
    this.Paymentobj['AdvanceId'] = 0;
    this.Paymentobj['RefundId'] = 0;
    this.Paymentobj['TransactionType'] = 0;
    this.Paymentobj['Remark'] = "" //this.patientDetailsFormGrp.get('commentsController').value;
    this.Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
      this.Paymentobj['IsCancelled'] = 0;
    this.Paymentobj['IsCancelledBy'] = 0;
    this.Paymentobj['IsCancelledDate'] = "01/01/1900" //this.dateTimeObj.date;
    this.Paymentobj['CashCounterId'] = 0;
    this.Paymentobj['IsSelfORCompany'] = 0;
    this.Paymentobj['CompanyId'] = 0;
    /*if (this.patientDetailsFormGrp.get("paymentType1").value == "neft") {
      // this.Paymentobj['NEFTPayAmount'] = 0;//parseInt(this.neftAmt.toString());
      this.Paymentobj['NEFTNo'] = ""; // this.neftNo;
      this.Paymentobj['NEFTBankMaster'] = "";//this.patientDetailsFormGrp.get('neftBankNameController').value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
    } else {
      // this.Paymentobj['NEFTPayAmount'] = 0;
      this.Paymentobj['NEFTNo'] = "";
      this.Paymentobj['NEFTBankMaster'] = "";
      this.Paymentobj['NEFTDate'] = '01/01/1900'
    }*/
    /*if (this.patientDetailsFormGrp.get("paymentType1").value == "upi") {
      // this.Paymentobj['PayTMAmount'] = 0; // parseInt(this.paytmAmt.toString());
      this.Paymentobj['PayTMTranNo'] = 0;//this.paytmTransNo;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
    } else {
      // this.Paymentobj['PayTMAmount'] = 0;
      this.Paymentobj['PayTMTranNo'] = '';
      this.Paymentobj['PayTMDate'] = '01/01/1900'
    } */
    this.Paymentobj['PaidAmt'] = this.patientDetailsFormGrp.get('paidAmountController').value;
    this.Paymentobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;

    console.log(this.Paymentobj);

    // if (this.patientDetailsFormGrp.invalid) {
    //   const controls = this.patientDetailsFormGrp.controls;
    //   Object.keys(controls).forEach(controlsName => {
    //     const controlField = this.patientDetailsFormGrp.get(controlsName);
    //     if (controlField && controlField.invalid) {
    //       controlField.markAsTouched({ onlySelf: true });
    //     }
    //   });
    //   return;
    // } else {
    //   console.log('valid...');
    // }
  }

  cashAmount: number = 0;
  chequeAmount: number = 0;
  cardAmount: number = 0;
  upiAmount: number = 0;
  netBankingAmount: number = 0;

  getCashObj(type: string) {
   
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount1.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount2.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount3.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount4.toString());
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['CashPayAmount'] = parseInt(this.amount5.toString());
      return;
    }
    debugger
    console.log(this.Paymentobj)
    return;
  }

  getChequeObj(type: string) {
    debugger
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount1;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName1").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount2;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount3;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount4;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['ChequePayAmount'] = this.amount5;
      this.Paymentobj['ChequeNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['BankName'] = this.patientDetailsFormGrp.get("bankName5").value.BankName;
      this.Paymentobj['ChequeDate'] = this.dateTimeObj.date;
      return;
    }
    console.log(this.Paymentobj)
    return;
   
  }

  getCardObj(type: string) {
    debugger
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount1;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount2;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount3;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount4;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['CardPayAmount'] = this.amount5;
      this.Paymentobj['CardNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['CardBankName'] = this.patientDetailsFormGrp.get("bankName5").value.BankName;
      this.Paymentobj['CardDate'] = this.dateTimeObj.date;
      return;
    }
    console.log(this.Paymentobj)
    return;
  }

  getNeftObj(type: string) {
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount1;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount2;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName2").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount3;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName3").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount4;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName4").value.BankName;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['NEFTPayAmount'] = this.amount5;
      this.Paymentobj['NEFTNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName5").value;
      this.Paymentobj['NEFTDate'] = this.dateTimeObj.date;
      return;
    }
    console.log(this.Paymentobj)
    return;
  }

  getUpiObj(type: string) {
    if (this.patientDetailsFormGrp.get("paymentType1").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount1;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo1").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName1").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType2").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount2;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo2").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName2").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType3").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount3;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo3").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName3").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType4").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount4;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo4").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName4").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    if (this.patientDetailsFormGrp.get("paymentType5").value == type) {
      this.Paymentobj['PayTMAmount'] = this.amount5;
      this.Paymentobj['PayTMTranNo'] = this.patientDetailsFormGrp.get("referenceNo5").value;
      // this.Paymentobj['NEFTBankMaster'] = this.patientDetailsFormGrp.get("bankName5").value;
      this.Paymentobj['PayTMDate'] = this.dateTimeObj.date;
      return;
    }
    console.log(this.Paymentobj)
    return;
  }

  secondAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) < this.netPayAmt ? true : false;
  }

  thirdAddEnable() {
    return parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) < this.netPayAmt ? true : false;
  }

  fourthAddEnable() {
    if ((parseInt(this.amount1.toString()) + parseInt(this.amount2.toString()) + parseInt(this.amount3.toString()) + parseInt(this.amount4.toString())) < this.netPayAmt) {
      return true;
    } else {
      return false;
    }
  }


  saveClicked() {
    debugger
    if(this.patientDetailsFormGrp.get('balanceAmountController').value==0){

    this.getCashObj('cash');
    this.getChequeObj('cheque');
    this.getCardObj('card');
    this.getNeftObj('neft');
    this.getUpiObj('upi');
    this.Paymentobj['PaidAmt'] = this.patientDetailsFormGrp.get('paidAmountController').value;
    this.Paymentobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;
    
    this.Paymentobj['PaymentDate'] = this.dateTimeObj.date;
    this.Paymentobj['PaymentTime'] = this.dateTimeObj.date;

    const ipPaymentInsert = new IpPaymentInsert(this.Paymentobj);
    let submitDataPay = {
      ipPaymentInsert,
    };
    let IsSubmit = {
      "submitDataPay": submitDataPay,
      "IsSubmitFlag": true,
      "BalAmt":this.balanceAmt 
    }
    console.log(IsSubmit);
    this.dialogRef.close(IsSubmit);
  
  }else{
    Swal.fire("Chk Balance Amount")
  }
}

  onClose1() {
    debugger

    if (this.data.FromName == "OP-Bill" || this.PatientHeaderObj.FromName == "IP-Bill") {

    let Paymentobj = {};
    
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
      Paymentobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;

    const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
    let submitDataPay1 = {
      ipPaymentInsert,
    };

    let IsSubmit = {
      "submitDataPay": submitDataPay1,
      "IsSubmitFlag": this.IsCreditflag
    }
    this.dialogRef.close(IsSubmit);
  }
  else{
    let IsSubmit = {
      // "submitDataPay": submitDataPay1,
      "IsSubmitFlag": this.IsCreditflag
    }
    this.dialogRef.close(IsSubmit);
  }
  }

  getBalanceAmt() {
    debugger
    this.balanceAmt = this.netPayAmt - ((this.amount1 ? parseInt(this.amount1) : 0)
      + (this.amount2 ? parseInt(this.amount2) : 0)
      + (this.amount3 ? parseInt(this.amount3) : 0)
      + (this.amount4 ? parseInt(this.amount4) : 0)
      + (this.amount5 ? parseInt(this.amount5) : 0));
  }

}
