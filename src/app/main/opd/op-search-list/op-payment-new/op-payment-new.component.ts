import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OPSearhlistService } from '../op-searhlist.service';

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
    upi: false,
    cheque: false,
    netbanking: false
  };
  paymentData: any;
  selectedPaymnet1: string = '';
  selectedPaymnet2: string = '';
  selectedPaymnet3: string = '';
  selectedPaymnet4: string = '';
  selectedPaymnet5: string = '';
  
  netPayAmt: number = 0;
  nowDate: Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OpPaymentNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private opService: OPSearhlistService

  ) { }

  ngOnInit(): void {
    this.patientDetailsFormGrp = this.createForm();
    this.paymentData = this.data.advanceObj;
    this.selectedPaymnet1 = this.paymentArr1[0].value;
    this.netPayAmt = parseInt(this.paymentData.advanceObj.NetPayAmount);
    this.patientDetailsFormGrp.get('amount1').setValue(this.netPayAmt);
    console.log(this.paymentData);
    this.setPaymentOption();
  }

  createForm() {
    return this.formBuilder.group({
      paymentTyp1: [],
      amount1: [],
      referenceNumber: [],
      bankName: [],
      registrationDate: [],
      paymentType2: [],
      amount2: [],
      referenceNo1: [],
      bankName1: [],
      regDate: [],
      paymentType3: [],
      amount3: [],
      upi: [],
      referenceNo2: [],
      paymentType4: [],
      amount4: [],
      bankName2: [],
      regDate1: [],
      eferenceNo3: [],
      paymentType5: [],
      amount5: [],
      bankName3: [],
      regDate2: [],
      eferenceNo4: [],
    });
  }

  onChangePaymnt(event: any) {
    let value = event.value;
    if(value != 'cash') {
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
    this.changePaymentOptions();
  }

  onAddClick(paymentOption: string) {
    this.paymentRowObj[paymentOption] = true;
    if(paymentOption && paymentOption == 'upi') {

    }
  }

  onRemoveClick(caseId: string) {
    this.paymentRowObj[caseId] = false;
  }

  onClose() {
    this.dialogRef.close();
  }

  changePaymentOptions() {
    if(this.selectedPaymnet1) {
      this.paymentArr2 = this.opService.getPaymentArr();
      
      let element = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr2.splice(element, 1);
      this.paymentArr2 = this.opService.getPaymentArr();
      let element1 = this.paymentArr2.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr2.splice(element1, 1);

      // this.paymentArr2 = this.paymentArr2;
    }
  }

  onChangePaymnt1(value: string) {
    console.log(this.selectedPaymnet2);
    console.log(value);
    if(value) {
      this.paymentArr3 = this.opService.getPaymentArr();
      let element = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet1);
      this.paymentArr3.splice(element, 1);

      let element1 = this.paymentArr3.findIndex(ele => ele.value == this.selectedPaymnet2);
      this.paymentArr3.splice(element1, 1);
      let element2 = this.paymentArr4.findIndex(ele => ele.value == this.selectedPaymnet2);
      this.paymentArr4.splice(element2, 1);


      // this.paymentArr2 = this.paymentArr2;
    }
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
    
      default:
        break;
    }
  }

  setPaymentOption() {
    if(this.selectedPaymnet1) {
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

}
