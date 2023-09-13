import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OPSearhlistService } from '../op-searhlist.service';
import { AuthenticationService } from 'app/core/services/authentication.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OpPaymentNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opService: OPSearhlistService,
    private accountService: AuthenticationService,
  ) {
    this.nowDate = new Date();
  }

  ngOnInit(): void {

    this.patientDetailsFormGrp = this.createForm();
    this.PatientHeaderObj = this.data.vPatientHeaderObj;
    // console.log(this.PatientHeaderObj);

    this.selectedPaymnet1 = this.paymentArr1[0].value;
    this.amount1 = this.netPayAmt = parseInt(this.PatientHeaderObj.NetPayableAmt);
    // this.patientDetailsFormGrp.get('amount1').setValue(this.netPayAmt);

    // console.log(this.PatientHeaderObj);
    this.onPaymentChange(1, 'cash');
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
      // regDate2: [(new Date()).toISOString()],

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

      paymentType6: [],
      amount6: [],
      bankName6: [],
      regDate6: [(new Date()).toISOString()],
      referenceNo6: []
    });
  }

  onChangePaymnt(event: any) {
    let value = event.value;
    if (value != 'cash') {
      this.patientDetailsFormGrp.get('referenceNumber').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('registrationDate').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else {
      this.patientDetailsFormGrp.get('referenceNumber').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName').clearAsyncValidators();
      this.patientDetailsFormGrp.get('registrationDate').clearAsyncValidators();
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
        this.setThirdRowValidators(paymentOption);
        break;

      case 'neft':
        this.setThirdRowValidators(paymentOption);
        break;

      case 'cheque':
        this.setFourthRowValidators(paymentOption);
        break;

      case 'card':
        this.setFifthRowValidators(paymentOption);
        break;

      default:
        break;
    }

    // if (paymentOption && paymentOption == 'upi') {

    // }
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
      this.patientDetailsFormGrp.get('referenceNo1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo1').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName1').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setThirdRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('amount3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('referenceNo2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.removeThirdValidators();
    }
  }

  setFourthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate2').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo3').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName3').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate2').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  setFifthRowValidators(paymentOption: any) {
    if (this.selectedPaymnet2 && this.selectedPaymnet2 != 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('bankName4').setValidators([Validators.required]);
      this.patientDetailsFormGrp.get('regDate3').setValidators([Validators.required]);
      this.patientDetailsFormGrp.updateValueAndValidity();
    } else if (this.selectedPaymnet2 && this.selectedPaymnet2 == 'cash') {
      this.patientDetailsFormGrp.get('referenceNo4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('bankName4').clearAsyncValidators();
      this.patientDetailsFormGrp.get('regDate3').clearAsyncValidators();
      this.patientDetailsFormGrp.updateValueAndValidity();
    }
  }

  removeThirdValidators() {
    this.patientDetailsFormGrp.get('amount3').clearAsyncValidators();
    this.patientDetailsFormGrp.get('referenceNo2').clearAsyncValidators();
    this.patientDetailsFormGrp.get('bankName2').clearAsyncValidators();
    this.patientDetailsFormGrp.get('regDate1').clearAsyncValidators();
    this.patientDetailsFormGrp.updateValueAndValidity();
  }

  amountChange1(controlName) {
    let value = this.patientDetailsFormGrp.get(controlName).value;
    if (value && value > 0) {
      this.amount2 = this.netPayAmt - this.amount1;
    }
  }
  amountChange2(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount3 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2));
    }
  }
  amountChange3(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount4 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3));
    }
  }
  amountChange4(controlName) {
    let value = parseInt(this.patientDetailsFormGrp.get(controlName).value);
    if (value && value > 0) {
      this.amount5 = this.netPayAmt - (parseInt(this.amount1) + parseInt(this.amount2) + parseInt(this.amount3) + parseInt(this.amount4));
    }
  }

  onSubmit() {
    console.log(this.patientDetailsFormGrp);
    let Paymentobj = {};
    Paymentobj['BillNo'] = this.PatientHeaderObj.billNo;
    Paymentobj['ReceiptNo'] = '';
    Paymentobj['PaymentDate'] = ""; //this.dateTimeObj.date;
    Paymentobj['PaymentTime'] = "";//this.dateTimeObj.date;
    // if (this.patientDetailsFormGrp.get("paymentType1").value == "cash") {
    //   Paymentobj['CashPayAmount'] = parseInt(this.amount1.toString());
    // } else {
    //   Paymentobj['CashPayAmount'] = 0
    // }
    Paymentobj['CashPayAmount'] = this.getAmount("cash");// parseInt(this.cashAmount.toString());
    Paymentobj['ChequePayAmount'] = this.getAmount("cheque");
    Paymentobj['CardPayAmount'] = this.getAmount("card");
    Paymentobj['NEFTPayAmount'] = this.getAmount("neft");
    Paymentobj['PayTMAmount'] = this.getAmount("upi");
    if (this.patientDetailsFormGrp.get("paymentType1").value == "cheque") {
      // Paymentobj['ChequePayAmount'] = 0;
      Paymentobj['ChequeNo'] = 0;
      Paymentobj['BankName'] = "";
      Paymentobj['ChequeDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['ChequePayAmount'] = 0;
      Paymentobj['ChequeNo'] = "";
      Paymentobj['BankName'] = "";//this.paymentForm.get('chequeBankNameController').value.BankName;
      Paymentobj['ChequeDate'] = "01/01/1900";
    }
    if (this.patientDetailsFormGrp.get("paymentType1").value == "card") {
      // Paymentobj['CardPayAmount'] = 0;
      Paymentobj['CardNo'] = 0;
      Paymentobj['CardBankName'] = "";//this.paymentForm.get('cardBankNameController').value.BankName;
      Paymentobj['CardDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['CardPayAmount'] = 0;
      Paymentobj['CardNo'] = "";
      Paymentobj['CardBankName'] = "";//this.paymentForm.get('cardBankNameController').value.BankName;
      Paymentobj['CardDate'] = "01/01/1900";
    }
    Paymentobj['AdvanceUsedAmount'] = 0;
    Paymentobj['AdvanceId'] = 0;
    Paymentobj['RefundId'] = 0;
    Paymentobj['TransactionType'] = 0;
    Paymentobj['Remark'] = "" //this.paymentForm.get('commentsController').value;
    Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
      Paymentobj['IsCancelled'] = 0;
    Paymentobj['IsCancelledBy'] = 0;
    Paymentobj['IsCancelledDate'] = "01/01/1900" //this.dateTimeObj.date;
    Paymentobj['CashCounterId'] = 0;
    Paymentobj['IsSelfORCompany'] = 0;
    Paymentobj['CompanyId'] = 0;
    if (this.patientDetailsFormGrp.get("paymentType1").value == "neft") {
      // Paymentobj['NEFTPayAmount'] = 0;//parseInt(this.neftAmt.toString());
      Paymentobj['NEFTNo'] = ""; // this.neftNo;
      Paymentobj['NEFTBankMaster'] = "";//this.patientDetailsFormGrp.get('neftBankNameController').value.BankName;
      Paymentobj['NEFTDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['NEFTPayAmount'] = 0;
      Paymentobj['NEFTNo'] = "";
      Paymentobj['NEFTBankMaster'] = "";
      Paymentobj['NEFTDate'] = '01/01/1900'
    }
    if (this.patientDetailsFormGrp.get("paymentType1").value == "upi") {
      // Paymentobj['PayTMAmount'] = 0; // parseInt(this.paytmAmt.toString());
      Paymentobj['PayTMTranNo'] = 0;//this.paytmTransNo;
      Paymentobj['PayTMDate'] = this.dateTimeObj.date;
    } else {
      // Paymentobj['PayTMAmount'] = 0;
      Paymentobj['PayTMTranNo'] = '';
      Paymentobj['PayTMDate'] = '01/01/1900'
    }
    Paymentobj['PaidAmt'] = 0;//this.paymentForm.get('paidAmountController').value;
    Paymentobj['BalanceAmt'] = 0; //this.paymentForm.get('balanceAmountController').value;

    console.log(Paymentobj);

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

  getAmount(type: string) {
    if(this.patientDetailsFormGrp.get("paymentType1").value == type) {
      return this.amount1;
    }
    if(this.patientDetailsFormGrp.get("paymentType2").value == type) {
      return this.amount2;
    }
    if(this.patientDetailsFormGrp.get("paymentType3").value == type) {
      return this.amount3;
    }
    if(this.patientDetailsFormGrp.get("paymentType4").value == type) {
      return this.amount4;
    }
    if(this.patientDetailsFormGrp.get("paymentType5").value == type) {
      return this.amount5;
    } 
    return 0;
  }

}
