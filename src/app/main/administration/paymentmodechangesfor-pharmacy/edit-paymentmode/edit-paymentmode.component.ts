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
  vpaymentId:any=0;
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

  chkcash:boolean=false;
  chkcheque:boolean=false;
  chkcard:boolean=false;
  chkneft:boolean=false;
  chkpaytm:boolean=false;

  
  isSaveDisabled: boolean = false;
  vbalanceAmt:any=0;
  vnetPayAmt:any;
  vcashpay:any=0;
  vcardpay:any=0;
  vchequepay:any=0;
  vneftpay:any=0;
  vpaytmpay:any=0;
  vPayTMTranNo:any;

  constructor(
    public _Paymentmodesevice: PaymentmodechangesforpharmacyService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
      // public _matDialog: MatDialog,
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
      console.log(this.registerObj);
      this.vpaymentId = this.registerObj.PaymentId;
      this.vnetPayAmt=this.registerObj.PaidAmount;
      this.vbalanceAmt=this.registerObj.PaidAmount;
    }
  }


  @ViewChild('cashpay') cashpay: ElementRef;
  @ViewChild('CardPayAmt') CardPayAmt: ElementRef;
  @ViewChild('CardBankName') CardBankName: ElementRef;
  @ViewChild('ChequeNo') ChequeNo: ElementRef;
  @ViewChild('NEFTNo') NEFTNo: ElementRef;
  @ViewChild('NEFTPayAmount') NEFTPayAmount: ElementRef;
 
  @ViewChild('PayTMAmount') PayTMAmount: ElementRef;
  @ViewChild('PayTMTranNo') PayTMTranNo: ElementRef;

  @ViewChild('onEnterCardPayAmt') Fax: ElementRef;

  

  onEnterCashpay(event){
    if (event.which === 13) {
      this.CardPayAmt.nativeElement.focus();
     
    }
  }

  onEnterCardPayAmt(event){
    if (event.which === 13) {
      this.CardBankName.nativeElement.focus();
     
    }
  }

  onEnterCardNo(event){
    if (event.which === 13) {
      // this.password.nativeElement.focus();
     
    }
  }

  onEnterCardBankName(event){
    if (event.which === 13) {
      // this.mailid.nativeElement.focus();
     
    }
  }

  onEnterChequeNo(event){
    if (event.which === 13) {
      // this.mailid.nativeElement.focus();
     
    }
  }
  onEnterPayTMAmount(event){
    if (event.which === 13) {
      // this.mailid.nativeElement.focus();
     
    }
  }

  onEnterPayTMTranNo(event){
    if (event.which === 13) {
      // this.mailid.nativeElement.focus();
     
    }
  }


  onEntermailid(event){
    if (event.which === 13) {
      // this.role.nativeElement.focus();
     
    }
  }

  onEnterNEFTNo(event){
    if (event.which === 13) {
      // this.role.nativeElement.focus();
     
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
  // getOptionTextBank4(option) {
  //   return option && option.BankName ? option.BankName : '';
  // }
  // getOptionTextBank5(option) {
  //   return option && option.BankName ? option.BankName : '';
  // }

  
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
      console.log(this.BankNameList1)
      this.filteredOptionsBank3 = this._Paymentmodesevice.paymentform.get('NEFTBankName').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBank4(value) : this.BankNameList4.slice()),
      );

    });
  }


  // getBankNameList5() {
  //   this.opService.getBankMasterCombo().subscribe(data => {
  //     this.BankNameList5 = data;
  //     this.optionsBank4 = this.BankNameList5.slice();
  //     this.filteredOptionsBank5 = this._Paymentmodesevice.paymentform.get('bankName5').valueChanges.pipe(
  //       startWith(''),
  //       map(value => value ? this._filterBank4(value) : this.BankNameList5.slice()),
  //     );

  //   });
  // }

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
  
  
  getBalanceAmt() {

    debugger
    let totalAmountAdded: any = ((this.vcashpay ? parseFloat(this.vcashpay) : 0)
      + (this.vcardpay ? parseFloat(this.vcardpay) : 0)
      + (this.vchequepay ? parseFloat(this.vchequepay) : 0)
      + (this.vneftpay ? parseFloat(this.vneftpay) : 0)
      + (this.vpaytmpay ? parseFloat(this.vpaytmpay) : 0));
    if ((this.vnetPayAmt - totalAmountAdded) < 0) {
     Swal.fire('Amout should be less than Balance amount', 'Done');
      this.isSaveDisabled = true;
      return;
    }

    this.vbalanceAmt = this.vnetPayAmt - parseFloat(totalAmountAdded);
    if (this.vbalanceAmt > 0) {
      this.isSaveDisabled = true;
      return;
    }
    this.isSaveDisabled = false;
  }

  onClose(){
    this.dialogRef.close();
  }
  // var m_data = {
  //   "loginInsert": {
  //     "paymentId ": this._Paymentmodesevice.paymentform.get('PaymentId').value || '',
  //     "cashPayAmt ": this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0,
  //     "cardPayAmt ": this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0,
  //     "cardNo ": this._Paymentmodesevice.paymentform.get('CardNo').value || 0,
  //     "cardBankName ": this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName || 0,
  //     "chequePayAmt ": this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0,
  //     "chequeNo ":  this._Paymentmodesevice.paymentform.get('ChequeNo').value || 0,
  //     "chequeBankName ": this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName || '',
  //     "neftPayAmount ": this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0,
  //     "neftNo ": this._Paymentmodesevice.paymentform.get('NEFTNo').value || 0,
  //     "neftBankMaster ": this._Paymentmodesevice.paymentform.get('NEFTBankMaster').value.BankName || 0,
  //     "payTMAmount ":  this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0,
  //     "payTMTranNo ": this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || 0,
      
  //   }
  // }
 
  Save(){
    debugger
    let paymentModeUpdateObj = {};
    paymentModeUpdateObj['paymentId']= this.registerObj.PaymentId;
    paymentModeUpdateObj['cashPayAmt']= this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0;
    paymentModeUpdateObj['cardPayAmt']= this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0;
    paymentModeUpdateObj['cardNo']= this._Paymentmodesevice.paymentform.get('CardNo').value || 0;
    paymentModeUpdateObj['cardBankName']= this._Paymentmodesevice.paymentform.get('CardBankName').value.BankName, "%" || " ";
    paymentModeUpdateObj['chequePayAmt']= this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0;
    paymentModeUpdateObj['chequeNo']= this._Paymentmodesevice.paymentform.get('ChequeNo').value || 0;
    paymentModeUpdateObj['chequeBankName']= this._Paymentmodesevice.paymentform.get('ChequeBankName').value.BankName, "%" ||  " ";
    paymentModeUpdateObj['neftPayAmount']= this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0;
    paymentModeUpdateObj['neftNo']=  this._Paymentmodesevice.paymentform.get('NEFTNo').value || 0;
    paymentModeUpdateObj['neftBankMaster']= this._Paymentmodesevice.paymentform.get('NEFTBankName').value.BankName, "%"  || " ";
    paymentModeUpdateObj['payTMAmount']= this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0;
    paymentModeUpdateObj['payTMTranNo']= this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || 0;
 
  let submitData ={
    "paymentModeUpdate" : paymentModeUpdateObj
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
      }
 Reset(){
  this._Paymentmodesevice.paymentform.reset();
 }
vCashCheckStatus :boolean=false;
vCardCheckStatus:boolean=false;
vCheckCheckStatus:boolean= false;
vNFTPayCheckStatus:boolean=false;
vPayTMCheckStatus:boolean=false;

getPaidAmount(event){
  let amount = this.registerObj.CashPayAmount;
  if(event.checked==true){
    this.vCashCheckStatus = true;
    this.vcashpay = amount;
    this.vcardpay = 0
    this.vchequepay = 0
    this.vneftpay = 0
    this.vpaytmpay = 0
    this.vCardCheckStatus = false;
    this.vCheckCheckStatus = false;
    this.vNFTPayCheckStatus = false;
    this.vPayTMCheckStatus = false;
    this.vCardNo = 0
    this.vchequeNo = 0
    this.vNEFTNo = 0
    this.vPayTMTranNo = 0
  }else{
    this.vcashpay = 0;
  }
}
vCardNo:any;

getCardPayAmount(event){
  let amount = this.registerObj.CashPayAmount;
  if(event.checked==true){
    this.vCardCheckStatus = true;
    this.vcardpay = amount;
    this.vcashpay = 0
    this.vchequepay = 0
    this.vneftpay = 0
    this.vpaytmpay = 0
    this.vCashCheckStatus = false;
    this.vCheckCheckStatus = false;
    this.vNFTPayCheckStatus = false;
    this.vPayTMCheckStatus = false;
    this.vchequeNo = 0
    this.vNEFTNo = 0
    this.vPayTMTranNo = 0
    
    if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
      this.toastr.warning('Please enter a Card No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }else{
    this.vcardpay = 0;
  }
}
vchequeNo:any;
getCheckPayAmount(event){
  let amount = this.registerObj.CashPayAmount;
  if(event.checked==true){
    this.vCheckCheckStatus = true;
    this.vchequepay = amount;
    this.vcashpay = 0
    this.vcardpay = 0
    this.vneftpay = 0
    this.vpaytmpay = 0
    this.vCashCheckStatus = false;
    this.vCardCheckStatus = false;
    this.vNFTPayCheckStatus = false;
    this.vPayTMCheckStatus = false;
    this.vCardNo = 0
    this.vNEFTNo = 0
    this.vPayTMTranNo = 0
    if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
      this.toastr.warning('Please enter a Card No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }else{
    this.vchequepay = 0;
  }
}
vNEFTNo:any;
getNFTPayAmount(event){
  let amount = this.registerObj.CashPayAmount;
  if(event.checked==true){
    this.vNFTPayCheckStatus = true;
    this.vneftpay = amount;
    this.vcashpay = 0
    this.vcardpay = 0
    this.vchequepay = 0
    this.vpaytmpay = 0
    this.vCashCheckStatus = false;
    this.vCardCheckStatus = false;
    this.vCheckCheckStatus = false;
    this.vPayTMCheckStatus = false;
    this.vCardNo = 0
    this.vchequeNo = 0
    this.vPayTMTranNo = 0
    if ((this.vNEFTNo == '' || this.vNEFTNo == null || this.vNEFTNo == undefined)) {
      this.toastr.warning('Please enter a Card No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }else{
    this.vneftpay = 0;
  }
}
getPayTMPayAmount(event){
  let amount = this.registerObj.CashPayAmount;
  if(event.checked==true){
    this.vPayTMCheckStatus = true;
    this.vpaytmpay = amount;
    this.vcashpay = 0
    this.vcardpay = 0
    this.vchequepay = 0
    this.vneftpay = 0
    this.vCashCheckStatus = false;
    this.vCardCheckStatus = false;
    this.vCheckCheckStatus = false;
    this.vNFTPayCheckStatus = false;
    this.vCardNo = 0
    this.vchequeNo = 0
    this.vNEFTNo = 0
    if ((this.vPayTMTranNo == '' || this.vPayTMTranNo == null || this.vPayTMTranNo == undefined)) {
      this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }else{
    this.vpaytmpay = 0;
  }
}




      chkcashpay(event){
        if(event.checked==true){
        this.chkcash = true;
        this._Paymentmodesevice.paymentform.get('CashPayAmt').reset();
        this._Paymentmodesevice.paymentform.get('CashPayAmt').setValidators([Validators.required]);
        this._Paymentmodesevice.paymentform.get('CashPayAmt').enable();
        }else{
          this.chkcash = false;
          this._Paymentmodesevice.paymentform.get('CashPayAmt').reset();
          this._Paymentmodesevice.paymentform.get('CashPayAmt').clearValidators();
          this._Paymentmodesevice.paymentform.get('CashPayAmt').updateValueAndValidity();
    
        }
       
      }

      chkcardpay(event){
        if(event.checked==true){
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

          }else{
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

      chkchequepay(event){
        if(event.checked==true){
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

          }else{
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


      chkNeftpay(event){
        debugger
        if(event.checked==true){
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

          }else{
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
   
      chkpayTmpay(event){
        if(event.checked==true){
          this.chkpaytm=true
          this._Paymentmodesevice.paymentform.get('NEFTPayAmount').reset();
          this._Paymentmodesevice.paymentform.get('NEFTPayAmount').setValidators([Validators.required]);
          this._Paymentmodesevice.paymentform.get('NEFTPayAmount').enable();
        }else{
          this.chkpaytm=false
          this._Paymentmodesevice.paymentform.get('NEFTBankMaster').reset();
          this._Paymentmodesevice.paymentform.get('NEFTBankMaster').clearValidators();
          this._Paymentmodesevice.paymentform.get('NEFTBankMaster').updateValueAndValidity();
    
        }
       
      }

      
   
}
 // "url":"http://117.216.212.131:2020/api"