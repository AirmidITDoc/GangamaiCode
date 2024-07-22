import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { OPSearhlistService } from '../op-searhlist.service';
import { takeUntil } from 'rxjs/operators';
import { InvalidDataValidator } from 'app/main/shared/validators/invalide-validators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-op-advance-payment',
  templateUrl: './op-advance-payment.component.html',
  styleUrls: ['./op-advance-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class OPAdvancePaymentComponent implements OnInit {


  chipsElements = [
    { name: 'Cash', state: true, value: 0 },
    { name: 'Card', state: false, value: 0 },
    { name: 'Cheque', state: false, value: 0 },
    { name: 'NEFT', state: false, value: 0 },
    { name: 'UPI', state: false, value: 0 },
    { name: 'Wrf Option', state: false, value: 0 }
  ];

  paidamt: any;
  balanceamt: any;

  paymentForm: FormGroup;
  billNo: number = 0;
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
  PatientHeaderObj:any;
  PatientHeaderObj1:any;


  vage:any=0
  vtariff:any=''
  vcompany:any=''
  vdoctorname:any=''
  vCategory:any=''
  OPD_IPD_Id:any=''
  Cashflag:boolean=false;
  RegNo:any;
  DoctorName:any;
  IPDNo:any;


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
    private ipSearchService: OPSearhlistService,
    private accountService: AuthenticationService,
    private dialogRef: MatDialogRef<OPAdvancePaymentComponent>,
    private authServie: AuthenticationService,

  ) {
    dialogRef.disableClose = true;
    
    this.advanceData = data;
    this.PatientHeaderObj = this.data.advanceObj;
    this.PatientHeaderObj1=this.data.vPatientHeaderObj;
    console.log(this.data.selectedAdvanceObj)
   
   
    // this.vage=this.data.selectedAdvanceObj.
    // this.vtariff=this.data.selectedAdvanceObj.TariffName
    // this.vcompany=this.data.selectedAdvanceObj.CompanyName
    // this.vdoctorname=this.data.selectedAdvanceObj.Doctorname
    // this.vCategory=this.data.selectedAdvanceObj.PatientType

    console.log(this.PatientHeaderObj1);
    this.OPD_IPD_Id=this.advanceData.advanceObj.OPD_IPD_Id
    if (this.advanceData.FromName == "Advance-Refund") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.RefundAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.RegNo = this.advanceData.advanceObj.UHIDNO;
      this.DoctorName = this.advanceData.advanceObj.Doctorname;
      this.BillDate = this.advanceData.advanceObj.Date;
      this.IPDNo = this.advanceData.advanceObj.IPDNo;
    }
    if (this.advanceData.FromName == "OP-Bill") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.RegNo = this.advanceData.advanceObj.UHIDNO;
      this.DoctorName =this.advanceData.advanceObj.Doctorname;
      this.BillDate = this.advanceData.advanceObj.Date;
      this.OPD_IPD_Id = this.PatientHeaderObj1.OPD_IPD_ID;
    }
    if (this.advanceData.FromName == "IP-Bill") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId) || 0;
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.RegNo = this.advanceData.advanceObj.UHIDNO;
      this.BillDate = this.advanceData.advanceObj.Date;
      this.IPDNo = this.advanceData.advanceObj.IPDNo
      this.DoctorName = this.advanceData.advanceObj.DoctorName;

    }
    if (this.advanceData.FromName == "Advance") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId);
      this.PatientName = this.advanceData.advanceObj.PatientName;
    }
    if (this.advanceData.FromName == "IP-Pharma-Advance" || this.advanceData.FromName == "IP-Pharma-Refund") {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.billNo = parseInt(this.advanceData.advanceObj.BillId) || 0;
      this.PatientName = this.advanceData.advanceObj.PatientName;
      this.RegNo = this.advanceData.advanceObj.UHIDNO;
      this.BillDate = this.advanceData.advanceObj.Date;
      this.IPDNo = this.advanceData.advanceObj.OPD_IPD_Id
      this.DoctorName = this.advanceData.advanceObj.DoctorName; 
    }
    else {
      this.netPayAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.cashAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.paidAmt = parseInt(this.advanceData.advanceObj.NetPayAmount);
      this.PatientName = this.advanceData.advanceObj.PatientName;
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
    
    this.chipsElements = [
      { name: 'Cash', state: true, value: this.cashAmt },
      { name: 'Card', state: false, value: this.cardAmt },
      { name: 'Cheque', state: false, value: this.chequeAmt },
      { name: 'NEFT', state: false, value: this.neftAmt },
      { name: 'UPI', state: false, value: this.paytmAmt },
      { name: 'Wrf Option', state: false, value: this.wrfAmt }
    ];
  }



  createForm() {
    return this.formBuilder.group({
      // cashAmountController: ['', []],
      cardAmountController: ['', []],
      cardNumberController: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
        Validators.maxLength(12),]],
      cardBankNameController: ['', []],
      cardDateController: [(new Date()).toISOString()],
      chequeAmountController: ['', []],
      chequeNumberController: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
        Validators.maxLength(12),]],
      chequeBankNameController: ['', []],
      chequeDateController: [(new Date()).toISOString()],
      neftAmountController: ['', []],
      neftNumberController: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
        Validators.minLength(4),
        Validators.maxLength(12),]],
      neftBankNameController: ['', []],
      neftDateController: [(new Date()).toISOString()],
      paytmAmountController: ['', []],
      paytmMobileNoController: ['', [Validators.required,Validators.pattern("^[0-9]*$"),
      Validators.minLength(4),
      Validators.maxLength(12),]], 
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
            break;
          }
          case 'Cheque':
            this.chequeAmt = 0;
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
            this.Cashflag=false;
            this.paytmAmt = 0;
            this.paymentForm.get('paytmAmountController').setValidators([
              // Validators.required,
              // Validators.pattern("^[0-9]*$")
            ]);
            this.paymentForm.controls['paytmAmountController'].updateValueAndValidity();
            this.paymentForm.get('paytmMobileNoController').setValidators([
              Validators.required,
              Validators.pattern("^[0-9]*$"),
              Validators.minLength(12),
              Validators.maxLength(12)
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
            break;
        }
        this.calculatePaidAmt();
        this.setValues();
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
            this.paymentForm.controls["cardAmountController"].clearValidators();
            this.paymentForm.controls["cardAmountController"].updateValueAndValidity();
            this.paymentForm.controls["cardNumberController"].clearValidators();
            this.paymentForm.controls["cardNumberController"].updateValueAndValidity();
            this.paymentForm.patchValue({ cardNumberController: '' });
            this.paymentForm.controls["cardBankNameController"].clearValidators();
            this.paymentForm.controls["cardBankNameController"].updateValueAndValidity();
            this.paymentForm.patchValue({ cardBankNameController: '' });
            this.paymentForm.patchValue({ cardDateController: new Date() });
            break;
          }
          case 'Cheque':
            this.chequeAmt = 0;
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
    console.log('==', event, '\n chipsElements==', this.chipsElements);
    // this.cdr.detectChanges();
  }



  calculatePaidAmt(controlNameParam?) {

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

   
    paidAmtLocal = this.getPaidAmt();
    console.log(paidAmtLocal)
    console.log(this.balanceAmt1)

    // if (this.cashAmt <=paidAmtLocal){*****************************first time not work
    // debugger;
    // if(chipName)
    //  if( paidAmtLocal > this.balanceAmt1){
    // Swal.fire("Amount chk")
    //   }
    if (paidAmtLocal > this.netPayAmt) {
      this.paidAmt = this.paidAmtPrev;
      this.balanceAmt = this.balanceAmtPrev;
      if(controlNameParam) {
        var val = this.paymentForm.get(controlNameParam).value;
      }
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
    // const controlValidation = this.ipSearchService.fieldValidations();
    // const controlRule = controlValidation.find(row => row.key === 'cash_controller');
    // const validation = controlRule.validation;
    // console.log(validation)
    // if (value) {
    //   validation.push(InvalidDataValidator(true));
    // }
    // else {
    //   validation.push(InvalidDataValidator(false));
    // }
    // console.log(validation)
    // return validation;
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
    if (this.balanceAmt == 0) {
      let Paymentobj = {};
      if (this.advanceData.FromName == "OP-Payment") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['tdsAmount'] = 0;
      }
      else if (this.advanceData.FromName == "OP-Bill") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['tdsAmount'] = 0;
      }
      else if (this.advanceData.FromName == "Advance") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['tdsAmount'] = 0;
      }
      else if (this.advanceData.FromName == "Advance-Refund") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['TransactionType'] = 2;
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
        Paymentobj['tdsAmount'] = 0;
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
        Paymentobj['tdsAmount'] = 0;
      }
      else if (this.advanceData.FromName == "IP-Pharma-Advance") {
        // Paymentobj['PaymentId'] = 0;
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['TransactionType'] = 8;
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
        Paymentobj['tdsAmount'] = 0;
      }
      else if (this.advanceData.FromName == "IP-Pharma-Refund") { 
        Paymentobj['BillNo'] = this.billNo;
        Paymentobj['ReceiptNo'] = '';
        Paymentobj['PaymentDate'] = this.dateTimeObj.date;
        Paymentobj['PaymentTime'] = this.dateTimeObj.time;
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
        Paymentobj['TransactionType'] = 9;
        Paymentobj['Remark'] = this.paymentForm.get('commentsController').value;
        Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        Paymentobj['IsCancelled'] = 0;
        Paymentobj['IsCancelledBy'] = 0;
        Paymentobj['IsCancelledDate'] = this.dateTimeObj.date; 
        Paymentobj['NEFTPayAmount'] = parseInt(this.neftAmt.toString());
        Paymentobj['NEFTNo'] = this.neftNo;
        Paymentobj['NEFTBankMaster'] = this.paymentForm.get('neftBankNameController').value.BankName;
        Paymentobj['NEFTDate'] = this.dateTimeObj.date;
        Paymentobj['PayTMAmount'] = parseInt(this.paytmAmt.toString());
        Paymentobj['PayTMTranNo'] = this.paytmTransNo;
        Paymentobj['PayTMDate'] = this.dateTimeObj.date; 
      }
      const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
      let submitDataPay = {
        ipPaymentInsert,
      };
      let IsSubmit = {
        "submitDataPay": submitDataPay,
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
      Paymentobj['CashPayAmount'] =  parseInt(this.cashAmt.toString());
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
      Paymentobj['tdsAmount'] = 0;

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

  setValues() {
    let selectedValues = this.chipsElements.filter((element) => element.state === true);
    let trueValuesLength = selectedValues.length;
    let latestElement = trueValuesLength - 1;
    let latestChipName = selectedValues[latestElement].name;
    this.chipsElements[0].value = this.cashAmt;
    this.chipsElements[1].value = this.cardAmt;
    this.chipsElements[2].value = this.chequeAmt;
    this.chipsElements[3].value = this.neftAmt;
    this.chipsElements[4].value = this.wrfAmt;
    let totalAddedAmt = 0;
    switch (latestChipName) {
      case 'Card':
        this.cardAmt = this.netPayAmt - parseInt(this.cashAmt.toString());
        break;
      case 'Cheque':
        totalAddedAmt = selectedValues.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        this.chequeAmt = this.netPayAmt - totalAddedAmt;
        break;

      case 'NEFT':
        totalAddedAmt = selectedValues.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        this.neftAmt = this.netPayAmt - totalAddedAmt;
        break;

      case 'UPI':
        totalAddedAmt = selectedValues.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        this.paytmAmt = this.netPayAmt - totalAddedAmt;
        break;

      case 'Wrf Option':
        totalAddedAmt = selectedValues.reduce((accumulator, object) => {
          return accumulator + object.value;
        }, 0);
        this.wrfAmt = this.netPayAmt - totalAddedAmt;
        break;


      default:
        break;
    }
    this.paidAmt = this.getPaidAmt();
    this.getBalanceAmt();
  }

  getPaidAmt(): number {
    let sum = 0;
    sum = (this.cashAmt ? parseInt(this.cashAmt.toString()) : 0)
    + (this.cardAmt ? parseInt(this.cardAmt.toString()) : 0)
    + (this.chequeAmt ? parseInt(this.chequeAmt.toString()) : 0)
    + (this.neftAmt ? parseInt(this.neftAmt.toString()) : 0)
    + (this.paytmAmt ? parseInt(this.paytmAmt.toString()) : 0)
    + (this.wrfAmt ? parseInt(this.wrfAmt.toString()) : 0);
    return sum;
  }
}

export class UpdateBill {
  BillNo: number;
  BillBalAmount: number;
 
  constructor(UpdateBill) {
    this.BillNo = UpdateBill.BillNo || 0;
    this.BillBalAmount = UpdateBill.BillBalAmount || 0;
   
  }
}


export class Advheaderdetail {
  
  advanceDetailID:any;
  usedAmount:any;
  balanceAmount:any;

  constructor(Advheaderdetail) {
   
    this.advanceDetailID = Advheaderdetail.advanceDetailID || 0;
    this.usedAmount = Advheaderdetail.usedAmount || 0;
    this.balanceAmount = Advheaderdetail.balanceAmount || 0;
  }
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
    this.PaymentTime = IpPayment.PaymentTime || '';
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
export class PharPaymentInsert {
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

  constructor(PharPaymentInsert) {
    this.PaymentId = PharPaymentInsert.PaymentId || 0;
    this.BillNo = PharPaymentInsert.BillNo || 0;
    this.ReceiptNo = PharPaymentInsert.ReceiptNo || '';
    this.PaymentDate = PharPaymentInsert.PaymentDate || '01/01/1900';
    this.PaymentTime = PharPaymentInsert.PaymentTime || '';
    this.CashPayAmount = PharPaymentInsert.CashPayAmount || 0;
    this.ChequePayAmount = PharPaymentInsert.ChequePayAmount || 0;
    this.ChequeNo = PharPaymentInsert.ChequeNo || '';

    this.BankName = PharPaymentInsert.BankName || '';
    this.ChequeDate = PharPaymentInsert.ChequeDate || '01/01/1900';
    this.CardPayAmount = PharPaymentInsert.CardPayAmount || 0;
    this.CardNo = PharPaymentInsert.CardNo || '';
    this.CardBankName = PharPaymentInsert.CardBankName || '';

    this.CardDate = PharPaymentInsert.CardDate || '01/01/1900';
    this.AdvanceUsedAmount = PharPaymentInsert.AdvanceUsedAmount || 0;
    this.AdvanceId = PharPaymentInsert.AdvanceId || 0;
    this.RefundId = PharPaymentInsert.RefundId || 0;
    this.TransactionType = PharPaymentInsert.TransactionType || 0;
    this.Remark = PharPaymentInsert.Remark || '';

    this.AddBy = PharPaymentInsert.AddBy || 0;
    this.IsCancelled = PharPaymentInsert.IsCancelled || 0;
    this.IsCancelledBy = PharPaymentInsert.IsCancelledBy || 0;
    this.IsCancelledDate = PharPaymentInsert.IsCancelledDate || '01/01/1900';

    this.CashCounterId = PharPaymentInsert.CashCounterId || 0;
    this.IsSelfORCompany = PharPaymentInsert.IsSelfORCompany || 0;
    this.CompanyId = PharPaymentInsert.CompanyId || 0;

    this.NEFTPayAmount = PharPaymentInsert.NEFTPayAmount || 0;
    this.NEFTNo = PharPaymentInsert.NEFTNo || '';
    this.NEFTBankMaster = PharPaymentInsert.NEFTBankMaster || '';
    this.NEFTDate = PharPaymentInsert.NEFTDate || '01/01/1900';

    this.PayTMAmount = PharPaymentInsert.PayTMAmount || 0;
    this.PayTMTranNo = PharPaymentInsert.PayTMTranNo || '';
    this.PayTMDate = PharPaymentInsert.PayTMDate || '01/01/1900';

    this.PaidAmt = PharPaymentInsert.PaidAmt || 0;
    this.BalanceAmt = PharPaymentInsert.BalanceAmt || 0;
  }

}