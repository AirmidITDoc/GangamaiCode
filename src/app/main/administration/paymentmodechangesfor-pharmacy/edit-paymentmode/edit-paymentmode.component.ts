import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PaymentmodechangesforpharmacyService } from '../paymentmodechangesfor-pharmacy.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PaymentPharmayList } from '../paymentmodechangesfor-pharmacy.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-edit-paymentmode',
  templateUrl: './edit-paymentmode.component.html',
  styleUrls: ['./edit-paymentmode.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditPaymentmodeComponent implements OnInit {

  filteredOptionsStorename: Observable<string[]>;
  filteredOptionsDoctorName: Observable<string[]>;
  isStoreSelected: boolean = false;
  isDoctorSelected: boolean = false;
  registerObj = new PaymentPharmayList({});
  vpaymentId: any = 0;
  filteredOptionsBank1: Observable<string[]>;
  optionsBank1: any[] = [];
  isBank1elected: boolean = false;
  filteredOptionsBank2: Observable<string[]>;
  optionsBank2: any[] = [];
  isBank2elected: boolean = false;
  filteredOptionsBank3: Observable<string[]>;
  optionsBank3: any[] = [];
  isBank1elected3: boolean = false;
  filteredOptionsBank4: Observable<string[]>;
  optionsBank4: any[] = [];
  isBank1elected4: boolean = false;
  isBank3elected: boolean = false;
  BankNameList1: any = [];
  BankNameList2: any = [];
  BankNameList3: any = [];
  BankNameList4: any = [];
  BankNameList5: any = [];
  chkcash: boolean = false;
  chkcheque: boolean = false;
  chkcard: boolean = false;
  chkneft: boolean = false;
  chkpaytm: boolean = false;

  isSaveDisabled: boolean = false;
  vbalanceAmt: any = 0;
  vnetPayAmt: any;
  vcashpay: any = 0;
  vcardpay: any = 0;
  vchequepay: any = 0;
  vneftpay: any = 0;
  vpaytmpay: any = 0;
  vPayTMTranNo: any;
  label: any;
  vPaidAmount: any;
  vCashCheckStatus: boolean = false;
  vCardCheckStatus: boolean = false;
  vCheckCheckStatus: boolean = false;
  vNFTPayCheckStatus: boolean = false;
  vPayTMCheckStatus: boolean = false;
  vCardNo: any;
  vchequeNo: any;
  vNEFTNo: any;

  constructor(
    public _Paymentmodesevice: PaymentmodechangesforpharmacyService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<EditPaymentmodeComponent>,
    private _formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    this.getBankNameList1();
    this.getBankNameList2();
    this.getBankNameList4();


    if (this.data) {
      this.registerObj = this.data.registerObj;
      console.log(this.registerObj)
      console.log(this.data)
      this.vpaymentId = this.registerObj.PaymentId;
      this.vnetPayAmt = this.registerObj.PaidAmount;
      this.vbalanceAmt = this.registerObj.PaidAmount;
    }
    if (this.registerObj.CashPayAmount > 0) {
      this.label = 'CashPayAmount'
      this.vPaidAmount = this.registerObj.CashPayAmount;
    } else if (this.registerObj.CardPayAmount > 0) {
      this.label = 'CardPayAmount'
      this.vPaidAmount = this.registerObj.CardPayAmount;
    } else if (this.registerObj.ChequePayAmount > 0) {
      this.label = 'ChequePayAmount'
      this.vPaidAmount = this.registerObj.ChequePayAmount;
    } else if (this.registerObj.NEFTPayAmount > 0) {
      this.label = 'NEFTPayAmount'
      this.vPaidAmount = this.registerObj.NEFTPayAmount;
    } else if (this.registerObj.PayTMAmount > 0) {
      this.label = 'PayTMAmount'
      this.vPaidAmount = this.registerObj.PayTMAmount;
    }
  }

  getBankNameList1() {
    this._Paymentmodesevice.getBankMasterCombo().subscribe(data => {
      this.BankNameList1 = data;
      this.optionsBank1 = this.BankNameList1.slice();
      this.filteredOptionsBank1 = this._Paymentmodesevice.paymentform.get('CardBankName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank1(value) : this.BankNameList1.slice()),
      );

    });
  }
  private _filterBank1(value: any): string[] {
    if (value) {
      const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
      return this.optionsBank1.filter(option => option.BankName.toLowerCase().includes(filterValue));
    }
  }

  getOptionTextBank1(option) {
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank2(option) {
    return option && option.BankName ? option.BankName : '';
  }
  getOptionTextBank3(option) {
    return option && option.BankName ? option.BankName : '';
  }

  getBankNameList2() {
    this._Paymentmodesevice.getBankMasterCombo().subscribe(data => {
      this.BankNameList2 = data;
      this.optionsBank2 = this.BankNameList2.slice();
      this.filteredOptionsBank2 = this._Paymentmodesevice.paymentform.get('ChequeBankName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank2(value) : this.BankNameList2.slice()),
      );

    });
  }
  getBankNameList4() {
    this._Paymentmodesevice.getBankMasterCombo().subscribe(data => {
      this.BankNameList4 = data;
      this.optionsBank4 = this.BankNameList4.slice();
      this.filteredOptionsBank3 = this._Paymentmodesevice.paymentform.get('NEFTBankName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank4(value) : this.BankNameList4.slice()),
      );
    });
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
  balAmount:any=0;
  totalAmountAdded:any=0;
  TotalpaidAmt:any=0;
  getbalAmt(){ 
   
   let totalAmountAdded:any = ((this.vcashpay ? parseFloat(this.vcashpay) : 0)
      + (this.vcardpay ? parseFloat(this.vcardpay) : 0)
      + (this.vchequepay ? parseFloat(this.vchequepay) : 0)
      + (this.vneftpay ? parseFloat(this.vneftpay) : 0)
      + (this.vpaytmpay ? parseFloat(this.vpaytmpay) : 0));
      // let cashpay = this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(cashpay)).toFixed(2);
  
      // let chardPay = this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(chardPay)).toFixed(2);
  
      // let chequePay = this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(chequePay)).toFixed(2);
  
      // let NEFTPay =this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(NEFTPay)).toFixed(2);

      // let PaytmPay =this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0;
      if(totalAmountAdded > this.vnetPayAmt){
        Swal.fire('Amount is greater than Paid amount', 'warning!',)
        // this.toastr.warning('Amount is greater than Paid amount', 'warning!', {
        //   toastClass: 'tostr-tost custom-toast-warning', 
        // });
        this.vbalanceAmt = this.vnetPayAmt;
      } 
      else{
        let balamt = (parseFloat(this.vnetPayAmt) - parseFloat(totalAmountAdded)).toFixed(2);
        this.vbalanceAmt = balamt;
        this.amount =parseInt(balamt)
      }
   
      // return this.vbalanceAmt;
  }

  onClose() {
    this.dialogRef.close();
  }

  
  Save(){
  if(this.data.FromName == 'IP-PaymentModeChange'){
    if (this._Paymentmodesevice.paymentform.get('BalAmount').value == 0){
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentform.get('CardBankName').value)
      CardBank = this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentform.get('ChequeBankName').value)
      ChequeBank = this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentform.get('NEFTBankName').value)
      NFTBank = this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName;

      if(this._Paymentmodesevice.paymentform.get('CardPayAmt').value){
        if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
          this.toastr.warning('Please enter a Card No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }  
        if(!this._Paymentmodesevice.paymentform.get('CardBankName').value){
          this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(!this.BankNameList1.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName)){
          this.toastr.warning('Please Select valid Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
      } 
      if(this._Paymentmodesevice.paymentform.get('ChequePayAmt').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankId){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(!this.BankNameList2.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName)){
          this.toastr.warning('Please Select valid Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
      }
      if(this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value){
        if ((this.vNEFTNo == '' || this.vNEFTNo == null || this.vNEFTNo == undefined)) {
          this.toastr.warning('Please enter a NEFT No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankId){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
          if(!this.BankNameList3.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName)){
            this.toastr.warning('Please Select valid NEFT Bank Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
      }
      if(this._Paymentmodesevice.paymentform.get('PayTMAmount').value){
        if ((this.vPayTMTranNo == '' || this.vPayTMTranNo == null || this.vPayTMTranNo == undefined)) {
          this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 
  
  
      let paymentModeUpdateObj = {};
      paymentModeUpdateObj['paymentId'] = this.registerObj.PaymentId;
      paymentModeUpdateObj['cashPayAmt'] = this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0;
      paymentModeUpdateObj['cardPayAmt'] = this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0;
      paymentModeUpdateObj['cardNo'] = this._Paymentmodesevice.paymentform.get('CardNo').value || 0;
      paymentModeUpdateObj['cardBankName'] = CardBank || '' //this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName || "";
      paymentModeUpdateObj['chequePayAmt'] = this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0;
      paymentModeUpdateObj['chequeNo'] = this._Paymentmodesevice.paymentform.get('ChequeNo').value || 0;
      paymentModeUpdateObj['chequeBankName'] = ChequeBank || ''//this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName || "";
      paymentModeUpdateObj['neftPayAmount'] = this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0;
      paymentModeUpdateObj['neftNo'] = this._Paymentmodesevice.paymentform.get('NEFTNo').value || 0;
      paymentModeUpdateObj['neftBankMaster'] = NFTBank || ''//this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName || "";
      paymentModeUpdateObj['payTMAmount'] = this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0;
      paymentModeUpdateObj['payTMTranNo'] = this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || 0;
  
      let submitData = {
        "paymentModeUpdate": paymentModeUpdateObj
      }
      console.log(submitData);
      this._Paymentmodesevice.PaymentmodeForIPD(submitData).subscribe(response => {
        console.log(response);
        if (response) {
          this.toastr.success('Payment Mode Detail Updated', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.dialogRef.close();
          this.Reset();
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }else{
      this.toastr.error('Please check Balance Amount', 'Check !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }else if(this.data.FromName == 'Pharma-PaymentModeChange'){
    if (this._Paymentmodesevice.paymentform.get('BalAmount').value == 0){
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentform.get('CardBankName').value)
      CardBank = this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentform.get('ChequeBankName').value)
      ChequeBank = this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentform.get('NEFTBankName').value)
      NFTBank = this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName;

      if(this._Paymentmodesevice.paymentform.get('CardPayAmt').value){
        if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
          this.toastr.warning('Please enter a Card No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }  
        if(!this._Paymentmodesevice.paymentform.get('CardBankName').value){
          this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(!this.BankNameList1.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName)){
          this.toastr.warning('Please Select valid Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
      } 
      if(this._Paymentmodesevice.paymentform.get('ChequePayAmt').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankId){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
        if(!this.BankNameList2.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName)){
          this.toastr.warning('Please Select valid Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        } 
      }
      if(this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value){
        if ((this.vNEFTNo == '' || this.vNEFTNo == null || this.vNEFTNo == undefined)) {
          this.toastr.warning('Please enter a NEFT No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankId){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
          if(!this.BankNameList3.some(item => item.BankName ===this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName)){
            this.toastr.warning('Please Select valid NEFT Bank Name', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          }  
      }
      if(this._Paymentmodesevice.paymentform.get('PayTMAmount').value){
        if ((this.vPayTMTranNo == '' || this.vPayTMTranNo == null || this.vPayTMTranNo == undefined)) {
          this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 
  
      let paymentModeUpdateObj = {};
      paymentModeUpdateObj['paymentId'] = this.registerObj.PaymentId;
      paymentModeUpdateObj['cashPayAmt'] = this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0;
      paymentModeUpdateObj['cardPayAmt'] = this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0;
      paymentModeUpdateObj['cardNo'] = this._Paymentmodesevice.paymentform.get('CardNo').value || 0;
      paymentModeUpdateObj['cardBankName'] = CardBank || '' //this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName || "";
      paymentModeUpdateObj['chequePayAmt'] = this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0;
      paymentModeUpdateObj['chequeNo'] = this._Paymentmodesevice.paymentform.get('ChequeNo').value || 0;
      paymentModeUpdateObj['chequeBankName'] = ChequeBank || ''//this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName || "";
      paymentModeUpdateObj['neftPayAmount'] = this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0;
      paymentModeUpdateObj['neftNo'] = this._Paymentmodesevice.paymentform.get('NEFTNo').value || 0;
      paymentModeUpdateObj['neftBankMaster'] = NFTBank || ''//this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName || "";
      paymentModeUpdateObj['payTMAmount'] = this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0;
      paymentModeUpdateObj['payTMTranNo'] = this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || 0;
  
      let submitData = {
        "paymentModeUpdate": paymentModeUpdateObj
      }
      console.log(submitData);
      this._Paymentmodesevice.PaymentmodeUpdate(submitData).subscribe(response => {
        console.log(response);
        if (response) {
          this.toastr.success('Payment Mode Detail Updated', 'Save !', {
            toastClass: 'tostr-tost custom-toast-success',
          });
          this.dialogRef.close();
          this.Reset();
        } else {
          this.toastr.error('API Error!', 'Error !', {
            toastClass: 'tostr-tost custom-toast-error',
          });
        }
      });
    }else{
      this.toastr.error('Please check Balance Amount', 'Check !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }else{
    this.toastr.error('API Error!', 'Error !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
    return;
  }
}
  Reset() {
    this._Paymentmodesevice.paymentform.reset();
  }
  amount:any = 0;
 
  getPaidAmount(event) {
    let amount = this.registerObj.PaidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NEFTPayAmount || this.registerObj.PayTMAmount;
    if (event.checked == true) {
      this.vCashCheckStatus = true;
      if(this.amount > 0){
        this.vcashpay = this.amount;
      }else{
        this.vcashpay = amount
      } 
   
      if(!this.vcardpay){
        this.vcardpay = 0
        this.vCardNo = 0
        this._Paymentmodesevice.paymentform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNEFTNo = 0
        this._Paymentmodesevice.paymentform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTMTranNo = 0
      } 
      this.getbalAmt();
    } else {
      this.vcashpay = 0;
      this.getbalAmt();
    }
  }
  getCardPayAmount(event) {
    let amount = this.registerObj.PaidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NEFTPayAmount || this.registerObj.PayTMAmount;
    if (event.checked == true) {
      this.vCardCheckStatus = true;
      if(this.amount > 0){
        this.vcardpay = this.amount;
      }else{
        this.vcardpay = amount;
      } 
       
      if(!this.vcashpay){
        this.vcashpay = 0 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNEFTNo = 0
        this._Paymentmodesevice.paymentform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTMTranNo = 0
      } 
      this.getbalAmt();
      if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
        this.toastr.warning('Please enter a Card No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      // this.CardNo.nativeElement.focus();
   
    } else {
      this.vcardpay = 0;
      this.getbalAmt();
    }
   
  }
  getCheckPayAmount(event) {
    let amount = this.registerObj.PaidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NEFTPayAmount || this.registerObj.PayTMAmount;
    if (event.checked == true) {
      this.vCheckCheckStatus = true;
      if(this.amount > 0){
        this.vchequepay = this.amount;
      }else{
        this.vchequepay = amount;
      } 

      if(!this.vcashpay){
        this.vcashpay = 0 
      }
      if(!this.vcardpay){
        this.vcardpay = 0
        this.vCardNo = 0
        this._Paymentmodesevice.paymentform.get('CardBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNEFTNo = 0
        this._Paymentmodesevice.paymentform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTMTranNo = 0
      } 
      this.getbalAmt(); 
      if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
        this.toastr.warning('Please enter a Cheque No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      
      // this.ChequeNo.nativeElement.focus(); 
    } else {
      this.vchequepay = 0;
      this.getbalAmt();
    }
  
  }
  getNFTPayAmount(event) {
    let amount = this.registerObj.PaidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NEFTPayAmount || this.registerObj.PayTMAmount;
    if (event.checked == true) {
      this.vNFTPayCheckStatus = true;
      if(this.amount > 0){
        this.vneftpay = this.amount;
      }else{
        this.vneftpay = amount;
      }  
      if(!this.vcashpay){
        this.vcashpay = 0 
      }
      if(!this.vcardpay){
        this.vcardpay = 0
        this.vCardNo = 0
        this._Paymentmodesevice.paymentform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTMTranNo = 0
      } 
      this.getbalAmt(); 
      if ((this.vNEFTNo == '' || this.vNEFTNo == null || this.vNEFTNo == undefined)) {
        this.toastr.warning('Please enter a NEFT No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    
      // this.NEFTNo.nativeElement.focus(); 
    } else {
      this.vneftpay = 0;
      this.getbalAmt();
    }

  }
  getPayTMPayAmount(event) {
    let amount = this.registerObj.PaidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NEFTPayAmount || this.registerObj.PayTMAmount;
    if (event.checked == true) {
      this.vPayTMCheckStatus = true;
      if(this.amount > 0){
        this.vpaytmpay = this.amount;
      }else{
        this.vpaytmpay = amount;
      }  
      if(!this.vcashpay){
        this.vcashpay = 0 
      }
      if(!this.vcardpay){
        this.vcardpay = 0
        this.vCardNo = 0
        this._Paymentmodesevice.paymentform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNEFTNo = 0
        this._Paymentmodesevice.paymentform.get('NEFTBankName').setValue(''); 
      }
      this.getbalAmt();
      if ((this.vPayTMTranNo == '' || this.vPayTMTranNo == null || this.vPayTMTranNo == undefined)) {
        this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this._Paymentmodesevice.paymentform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentform.get('NEFTBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('NEFTBankName').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentform.get('CardBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('CardBankName').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentform.get('ChequeBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('ChequeBankName').updateValueAndValidity();
      // this.PayTMTranNo.nativeElement.focus();
   
    } else {
      this.vpaytmpay = 0;
      this.getbalAmt();
    }
 
  }
  @ViewChild('cashpay') cashpay: ElementRef;
  @ViewChild('CardPayAmt') CardPayAmt: ElementRef;
  @ViewChild('CardNo') CardNo : ElementRef;
  @ViewChild('CardBankName') CardBankName: ElementRef;
  @ViewChild('ChequeNo') ChequeNo: ElementRef;
  @ViewChild('chequebank') chequebank: ElementRef;
  @ViewChild('NEFTNo') NEFTNo: ElementRef;
  @ViewChild('nftbank') nftbank: ElementRef;
  @ViewChild('PayTMTranNo') PayTMTranNo: ElementRef;
  onEnterCashpay(event) {
    if (event.which === 13) {
      this.CardPayAmt.nativeElement.focus();
    }
  }
  onEnterCardPayAmt(event) {
    if (event.which === 13) {
      this.CardNo.nativeElement.focus();
    }
  }
  onEnterCardNo(event) {
    if (event.which === 13) {
     this.CardBankName.nativeElement.focus();
    }
  }
  onEnterCheckPayAmt(event) {
    if (event.which === 13) {
      this.ChequeNo.nativeElement.focus(); 
    }
  }
  onEnterChequeNo(event) {
    if (event.which === 13) {
     this.chequebank.nativeElement.focus(); 
    }
  }
  onEnterNFTPayAmt(event) {
    if (event.which === 13) {
     this.NEFTNo.nativeElement.focus(); 
    }
  }
  onEnterNEFTNo(event) {
    if (event.which === 13) {
     this.nftbank.nativeElement.focus();
    }
  }
  onEnterPayTMamt(event) {
    if (event.which === 13) {
     this.PayTMTranNo.nativeElement.focus();
    }
  }



  chkcashpay(event) {
    if (event.checked == true) {
      this.chkcash = true;
      this._Paymentmodesevice.paymentform.get('CashPayAmt').reset();
      this._Paymentmodesevice.paymentform.get('CashPayAmt').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('CashPayAmt').enable();
    } else {
      this.chkcash = false;
      this._Paymentmodesevice.paymentform.get('CashPayAmt').reset();
      this._Paymentmodesevice.paymentform.get('CashPayAmt').clearValidators();
      this._Paymentmodesevice.paymentform.get('CashPayAmt').updateValueAndValidity();

    }

  }

  chkcardpay(event) {
    if (event.checked == true) {
      this.chkcard = true;
      this._Paymentmodesevice.paymentform.get('CardPayAmt').reset();
      this._Paymentmodesevice.paymentform.get('CardPayAmt').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('CardPayAmt').enable();

      this._Paymentmodesevice.paymentform.get('CardNo').reset();
      this._Paymentmodesevice.paymentform.get('CardNo').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('CardNo').enable();

      this._Paymentmodesevice.paymentform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentform.get('CardBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('CardBankName').enable();

    } else {
      this.chkcard = false;
      this._Paymentmodesevice.paymentform.get('CardPayAmt').reset();
      this._Paymentmodesevice.paymentform.get('CardPayAmt').clearValidators();
      this._Paymentmodesevice.paymentform.get('CardPayAmt').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('CardNo').reset();
      this._Paymentmodesevice.paymentform.get('CardNo').clearValidators();
      this._Paymentmodesevice.paymentform.get('CardNo').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentform.get('CardBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('CardBankName').updateValueAndValidity();
    }


  }

  chkchequepay(event) {
    if (event.checked == true) {
      this.chkcheque = true;
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').reset();
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').enable();


      this._Paymentmodesevice.paymentform.get('ChequeNo').reset();
      this._Paymentmodesevice.paymentform.get('ChequeNo').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('ChequeNo').enable();


      this._Paymentmodesevice.paymentform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentform.get('ChequeBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('ChequeBankName').enable();

    } else {
      this.chkcheque = false;
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').reset();
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').clearValidators();
      this._Paymentmodesevice.paymentform.get('ChequePayAmt').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('ChequeNo').reset();
      this._Paymentmodesevice.paymentform.get('ChequeNo').clearValidators();
      this._Paymentmodesevice.paymentform.get('ChequeNo').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentform.get('ChequeBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('ChequeBankName').updateValueAndValidity();

    }

  }


  chkNeftpay(event) { 
    if (event.checked == true) {
      this.chkneft = true;
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').reset();
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').enable();


      this._Paymentmodesevice.paymentform.get('NEFTNo').reset();
      this._Paymentmodesevice.paymentform.get('NEFTNo').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('NEFTNo').enable();


      this._Paymentmodesevice.paymentform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentform.get('NEFTBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('NEFTBankName').enable();

    } else {
      this.chkneft = false;
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').reset();
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').clearValidators();
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('NEFTNo').reset();
      this._Paymentmodesevice.paymentform.get('NEFTNo').clearValidators();
      this._Paymentmodesevice.paymentform.get('NEFTNo').updateValueAndValidity();

      this._Paymentmodesevice.paymentform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentform.get('NEFTBankName').clearValidators();
      this._Paymentmodesevice.paymentform.get('NEFTBankName').updateValueAndValidity();

    }

  }

  chkpayTmpay(event) {
    if (event.checked == true) {
      this.chkpaytm = true
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').reset();
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentform.get('NEFTPayAmount').enable();
    } else {
      this.chkpaytm = false
      this._Paymentmodesevice.paymentform.get('NEFTBankMaster').reset();
      this._Paymentmodesevice.paymentform.get('NEFTBankMaster').clearValidators();
      this._Paymentmodesevice.paymentform.get('NEFTBankMaster').updateValueAndValidity();
    }
  }
}
// "url":"http://117.216.212.131:2020/api"