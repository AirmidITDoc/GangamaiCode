import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-op-payment-new',
  templateUrl: './op-payment-new.component.html',
  styleUrls: ['./op-payment-new.component.scss']
})
export class OpPaymentNewComponent implements OnInit {
  patientDetailsFormGrp: FormGroup;
  paymentArr: any[] = [
    {value: 'cash', viewValue: 'Cash'},
    {value: 'cheque', viewValue: 'Cheque'},
    {value: 'upi', viewValue: 'UPI'},
  ];
  paymentRowObj = {
    card: false,
    upi: false,
    cheque: false,
    netbanking: false
  };
  paymentData: any;
  selectedPaymnet: string = '';
  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<OpPaymentNewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

  ) { }

  ngOnInit(): void {
    this.patientDetailsFormGrp = this.createForm();
    this.paymentData = this.data.advanceObj;
    this.selectedPaymnet = this.paymentArr[0].value;
    this.patientDetailsFormGrp.get('amount1').setValue(this.paymentData.amount);
    console.log(this.paymentData);
  }

  createForm() {
    return this.formBuilder.group({
      paymentTyp1: [],
      amount1: [],
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
    console.log(event.value);
    console.log(this.patientDetailsFormGrp.get('paymentTyp1').value);
  }

  onAddClick(caseId: string) {
    this.paymentRowObj[caseId] = true;
  }

  onRemoveClick(caseId: string) {
    this.paymentRowObj[caseId] = false;
  }

  onClose() {
    this.dialogRef.close();
  }

}
