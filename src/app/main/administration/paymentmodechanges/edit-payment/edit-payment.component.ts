import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
// import { PaymentmodechangesService } from '../paymentmodechanges.service'; 
import { DatePipe } from '@angular/common';
import { UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { PaymentmodechangesforpharmacyService } from '../../paymentmodechangesfor-pharmacy/paymentmodechangesfor-pharmacy.service';
import { PaymentChange } from '../paymentmodechanges.component';

@Component({
  selector: 'app-edit-payment',
  templateUrl: './edit-payment.component.html',
  styleUrls: ['./edit-payment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EditPaymentComponent implements OnInit {

  filteredOptionsStorename: Observable<string[]>;
  filteredOptionsDoctorName: Observable<string[]>;
  isStoreSelected: boolean = false;
  isDoctorSelected: boolean = false;
  registerObj = new PaymentChange({});
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
  vBillNo:any;
  autocompleteModeBankName: string = "Bank";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  constructor(
    public _Paymentmodesevice: PaymentmodechangesforpharmacyService,
    private accountService: AuthenticationService,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<EditPaymentComponent>,
    private _formBuilder: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {
    
    if (this.data) {
      this.registerObj = this.data.registerObj;
      console.log("EditData:",this.registerObj)
      console.log(this.data)
      this.vpaymentId = this.registerObj.paymentId;
      this.vnetPayAmt = this.registerObj.paidAmount;
      this.vbalanceAmt = this.registerObj.paidAmount;
      this.vPaidAmount = this.registerObj.paidAmount;
      this.vBillNo=this.registerObj.billNo;
    }

    if (this.registerObj.cashPayAmount > 0) {
      this.vCashCheckStatus = true;
      this.vcashpay = this.registerObj.cashPayAmount; 
      this.getbalAmt();
    }if (this.registerObj.cardPayAmount > 0) {
      this.vCardCheckStatus = true;
      this.vcardpay = this.registerObj.cardPayAmount; 
      this.getbalAmt(); 
    }if (this.registerObj.chequePayAmount > 0) {
      this.vCheckCheckStatus = true;
      this.vchequepay = this.registerObj.chequePayAmount;
      this.getbalAmt();
    }if (this.registerObj.neftPayAmount > 0) {
      this.vNFTPayCheckStatus = true;
      this.vneftpay = this.registerObj.neftPayAmount;
      this.getbalAmt();
    }if (this.registerObj.payTMAmount > 0) {
      this.vPayTMCheckStatus = true;
      this.vpaytmpay = this.registerObj.payTMAmount;
      this.getbalAmt();
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
      // let cashpay = this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(cashpay)).toFixed(2);
  
      // let chardPay = this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(chardPay)).toFixed(2);
  
      // let chequePay = this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(chequePay)).toFixed(2);
  
      // let NEFTPay =this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').value || 0;
      // this.vbalanceAmt = (parseFloat(this.vbalanceAmt) - parseFloat(NEFTPay)).toFixed(2);

      // let PaytmPay =this._Paymentmodesevice.paymentInsertform.get('PayTmamount').value || 0;
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

  CardBankdd:any;
  ChequeBankdd:any;
  NFTBankdd:any

  Save(){
    debugger
    const datePipe = new DatePipe('en-US');
  if(this.data.FromName == 'IP-PaymentModeChange'){
    if (this._Paymentmodesevice.paymentInsertform.get('BalAmount').value == 0){
    

      if(this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').value){
        if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
          this.toastr.warning('Please enter a Card No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }  
        if(!this._Paymentmodesevice.paymentInsertform.get('CardBankName').value){
          this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
      } 
      if(this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').value){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
      }
      if(this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').value){
        if ((this.vNeftno == '' || this.vNeftno == null || this.vNeftno == undefined)) {
          this.toastr.warning('Please enter a NEFT No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').value){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        } 
      }
      if(this._Paymentmodesevice.paymentInsertform.get('PayTmamount').value){
        if ((this.vPayTmtranNo == '' || this.vPayTmtranNo == null || this.vPayTmtranNo == undefined)) {
          this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      }  
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('CardBankName').value)
      CardBank = this.CardBankdd;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').value)
      ChequeBank = this.ChequeBankdd;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').value)
      NFTBank = this.NFTBankdd

      this._Paymentmodesevice.paymentInsertform.get('PaymentId').setValue(this.registerObj.paymentId || 0)
      this._Paymentmodesevice.paymentInsertform.get('BillNo').setValue(this.vBillNo)
      this._Paymentmodesevice.paymentInsertform.get('ReceiptNo').setValue(String(this.registerObj.receiptNo) || '0')
      this._Paymentmodesevice.paymentInsertform.get('PaymentDate').setValue(datePipe.transform(new Date(), 'yyyy-MM-dd'))
      this._Paymentmodesevice.paymentInsertform.get('PaymentTime').setValue(datePipe.transform(new Date(), 'shortTime'))
      this._Paymentmodesevice.paymentInsertform.get('BankName').setValue(ChequeBank || '')
      this._Paymentmodesevice.paymentInsertform.get('ChequeDate').setValue(this.registerObj.chequeDate || "1900-01-01")
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(CardBank || "")
      this._Paymentmodesevice.paymentInsertform.get('CardDate').setValue(this.registerObj.cardDate || "1900-01-01")
      this._Paymentmodesevice.paymentInsertform.get('AdvanceUsedAmount').setValue(this.registerObj.advanceUsedAmount || 0)
      this._Paymentmodesevice.paymentInsertform.get('AdvanceId').setValue(this.registerObj.advanceId || 0)
      this._Paymentmodesevice.paymentInsertform.get('RefundId').setValue(this.registerObj.refundId || 0)
      this._Paymentmodesevice.paymentInsertform.get('TransactionType').setValue(this.registerObj.transactionType || 0)
      this._Paymentmodesevice.paymentInsertform.get('Remark').setValue(this.registerObj.remark || '')
      this._Paymentmodesevice.paymentInsertform.get('AddBy').setValue(this.registerObj.addBy || 0)
      this._Paymentmodesevice.paymentInsertform.get('NeftbankMaster').setValue( NFTBank || "")
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').setValue( this._Paymentmodesevice.paymentInsertform.get('ChequeNo').value || "")
      this._Paymentmodesevice.paymentInsertform.get('CardNo').setValue( this._Paymentmodesevice.paymentInsertform.get('CardNo').value || "")
      this._Paymentmodesevice.paymentInsertform.get('Neftno').setValue( this._Paymentmodesevice.paymentInsertform.get('Neftno').value || "")
      this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').setValue( this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').value || "")

      const controlsToRemove = ['PaidAmount', 'BalAmount', 'IsPayTMpay', 'RefundBalAmount','NEFTBankName','IsNEFTpay','IsCardpay','IsChequepay','ChequeBankName','IsCashpay'];
      controlsToRemove.forEach(controlName => {
        const ctrl = this._Paymentmodesevice.paymentInsertform.get(controlName);
        if (ctrl) {
          ctrl.disable();
        }
      });

      console.log(this._Paymentmodesevice.paymentInsertform.value);
      this._Paymentmodesevice.PaymentUpdate(this._Paymentmodesevice.paymentInsertform.value).subscribe(response => {
          this.dialogRef.close();
          this.Reset();
      });
    }else{
      this.toastr.error('Please check Balance Amount', 'Check !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
    }
  }else if(this.data.FromName == 'Pharma-PaymentModeChange'){
    if (this._Paymentmodesevice.paymentInsertform.get('BalAmount').value == 0){
    
      if(this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').value){
        if ((this.vCardNo == '' || this.vCardNo == null || this.vCardNo == undefined)) {
          this.toastr.warning('Please enter a Card No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }  
        if(!this._Paymentmodesevice.paymentInsertform.get('CardBankName').value){
          this.toastr.warning('Please Select Card Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
      } 
      if(this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').value){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
      }
      if(this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').value){
        if ((this.vNeftno == '' || this.vNeftno == null || this.vNeftno == undefined)) {
          this.toastr.warning('Please enter a NEFT No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').value){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return; 
        }
      }
      if(this._Paymentmodesevice.paymentInsertform.get('PayTmamount').value){
        if ((this.vPayTmtranNo == '' || this.vPayTmtranNo == null || this.vPayTmtranNo == undefined)) {
          this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
      } 
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('CardBankName').value)
      CardBank = this.CardBankdd;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').value)
      ChequeBank = this.ChequeBankdd;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').value)
      NFTBank = this.NFTBankdd
      this._Paymentmodesevice.paymentInsertform.get('PaymentId').setValue(this.registerObj.paymentId || 0)
      this._Paymentmodesevice.paymentInsertform.get('BillNo').setValue(this.vBillNo || 0)
      this._Paymentmodesevice.paymentInsertform.get('ReceiptNo').setValue(String(this.registerObj.receiptNo) || '0')
      this._Paymentmodesevice.paymentInsertform.get('PaymentDate').setValue(datePipe.transform(new Date(), 'yyyy-MM-dd'))
      this._Paymentmodesevice.paymentInsertform.get('PaymentTime').setValue(datePipe.transform(new Date(), 'shortTime'))
      this._Paymentmodesevice.paymentInsertform.get('BankName').setValue(ChequeBank || '')
      this._Paymentmodesevice.paymentInsertform.get('ChequeDate').setValue("2024-08-10")
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(CardBank || "")
      this._Paymentmodesevice.paymentInsertform.get('CardDate').setValue("2024-08-10")
      this._Paymentmodesevice.paymentInsertform.get('AdvanceUsedAmount').setValue(this.registerObj.advanceUsedAmount || 0)
      this._Paymentmodesevice.paymentInsertform.get('AdvanceId').setValue(this.registerObj.advanceId || 0)
      this._Paymentmodesevice.paymentInsertform.get('RefundId').setValue(this.registerObj.refundId || 0)
      this._Paymentmodesevice.paymentInsertform.get('TransactionType').setValue(this.registerObj.transactionType || 0)
      this._Paymentmodesevice.paymentInsertform.get('Remark').setValue(this.registerObj.remark || '')
      this._Paymentmodesevice.paymentInsertform.get('AddBy').setValue(this.registerObj.addBy || 0)
      this._Paymentmodesevice.paymentInsertform.get('NeftbankMaster').setValue( NFTBank || "")
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').setValue( this._Paymentmodesevice.paymentInsertform.get('ChequeNo').value || "")
      this._Paymentmodesevice.paymentInsertform.get('CardNo').setValue( this._Paymentmodesevice.paymentInsertform.get('CardNo').value || "")
      this._Paymentmodesevice.paymentInsertform.get('Neftno').setValue( this._Paymentmodesevice.paymentInsertform.get('Neftno').value || "")
      this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').setValue( this._Paymentmodesevice.paymentInsertform.get('PayTmtranNo').value || "")
      const controlsToRemove = ['PaidAmount', 'BalAmount', 'IsPayTMpay', 'RefundBalAmount','NEFTBankName','IsNEFTpay','IsCardpay','IsChequepay','ChequeBankName','IsCashpay'];
      controlsToRemove.forEach(controlName => {
        const ctrl = this._Paymentmodesevice.paymentInsertform.get(controlName);
        if (ctrl) {
          ctrl.disable(); // will not be submitted
        }
      });
      console.log(this._Paymentmodesevice.paymentInsertform.value);
      this._Paymentmodesevice.PaymentPhyUpdate(this._Paymentmodesevice.paymentInsertform.value).subscribe(response => {
          this.dialogRef.close();
          this.Reset();    
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

selectChangeBankName(obj: any){
console.log(obj)
this.CardBankdd=obj.text
this.ChequeBankdd=obj.text
this.NFTBankdd=obj.text
}
getValidationMessages(){
  return{
    CardBankName:[],
    ChequeBankName:[],
    NEFTBankName:[]
  }
}
  Reset() {
    this._Paymentmodesevice.paymentInsertform.reset();
    const controlsToRemove = ['PaidAmount', 'BalAmount', 'IsPayTMpay', 'RefundBalAmount', 'NEFTBankName', 'IsNEFTpay', 'IsCardpay', 'IsChequepay', 'ChequeBankName', 'IsCashpay'];
    controlsToRemove.forEach(controlName => {
      const ctrl = this._Paymentmodesevice.paymentInsertform.get(controlName);
      if (ctrl) {
        ctrl.enable();
      }
    });

    this._Paymentmodesevice.paymentInsertform.get('IsCancelled').setValue(false)
    this._Paymentmodesevice.paymentInsertform.get('IsCancelledBy').setValue(0)
    this._Paymentmodesevice.paymentInsertform.get('IsCancelledDate').setValue('1900-01-01')
    this._Paymentmodesevice.paymentInsertform.get('Neftdate').setValue('1900-01-01')
    this._Paymentmodesevice.paymentInsertform.get('PayTmdate').setValue('1900-01-01')
    this._Paymentmodesevice.paymentInsertform.get('Tdsamount').setValue(0)
  }
  amount:any = 0;
 
  getPaidAmount(event) {
    let amount = this.registerObj.paidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
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
        this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNeftno = 0
        this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTmtranNo = 0
      } 
      this.getbalAmt();
    } else {
      this.vcashpay = 0;
      this.getbalAmt();
    }
  }
  getCardPayAmount(event) {
    let amount = this.registerObj.paidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
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
        this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNeftno = 0
        this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTmtranNo = 0
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
    let amount = this.registerObj.paidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
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
        this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNeftno = 0
        this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTmtranNo = 0
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
    let amount = this.registerObj.paidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
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
        this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vpaytmpay){
        this.vpaytmpay = 0
        this.vPayTmtranNo = 0
      } 
      this.getbalAmt(); 
      if ((this.vNeftno == '' || this.vNeftno == null || this.vNeftno == undefined)) {
        this.toastr.warning('Please enter a NEFT No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    
      // this.Neftno.nativeElement.focus(); 
    } else {
      this.vneftpay = 0;
      this.getbalAmt();
    }

  }
  getPayTMPayAmount(event) {
    let amount = this.registerObj.paidAmount 
    // this.registerObj.CashPayAmount || this.registerObj.CardPayAmount
    //   || this.registerObj.ChequePayAmount || this.registerObj.NeftpayAmount || this.registerObj.PayTmamount;
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
        this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValue(''); 
      }
      if(!this.vchequepay){
        this.vchequepay = 0
        this.vchequeNo = 0
        this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValue(''); 
      }
      if(!this.vneftpay){
        this.vneftpay = 0
        this.vNeftno = 0
        this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValue(''); 
      }
      this.getbalAmt();
      if ((this.vPayTmtranNo == '' || this.vPayTmtranNo == null || this.vPayTmtranNo == undefined)) {
        this.toastr.warning('Please enter a vPayTMTran No', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').updateValueAndValidity();
      // this.PayTmtranNo.nativeElement.focus();
   
    } else {
      this.vpaytmpay = 0;
      this.getbalAmt();
    }
 
  }
  @ViewChild('cashpay') cashpay: ElementRef;
  @ViewChild('CardPayAmount') CardPayAmount: ElementRef;
  @ViewChild('CardNo') CardNo : ElementRef;
  @ViewChild('CardBankName') CardBankName: ElementRef;
  @ViewChild('ChequeNo') ChequeNo: ElementRef;
  @ViewChild('chequebank') chequebank: ElementRef;
  @ViewChild('Neftno') Neftno: ElementRef;
  @ViewChild('nftbank') nftbank: ElementRef;
  @ViewChild('PayTmtranNo') PayTmtranNo: ElementRef;
  onEnterCashpay(event) {
    if (event.which === 13) {
      this.CardPayAmount.nativeElement.focus();
    }
  }
  onEnterCardPayAmount(event) {
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
     this.Neftno.nativeElement.focus(); 
    }
  }
  onEnterNeftno(event) {
    if (event.which === 13) {
     this.nftbank.nativeElement.focus();
    }
  }
  onEnterPayTMamt(event) {
    if (event.which === 13) {
     this.PayTmtranNo.nativeElement.focus();
    }
  }

  chkcashpay(event) {
    if (event.checked == true) {
      this.chkcash = true;
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').enable();
    } else {
      this.chkcash = false;
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('CashPayAmount').updateValueAndValidity();

    }

  }

  chkcardpay(event) {
    if (event.checked == true) {
      this.chkcard = true;
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').enable();

      this._Paymentmodesevice.paymentInsertform.get('CardNo').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardNo').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('CardNo').enable();

      this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').enable();

    } else {
      this.chkcard = false;
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('CardPayAmount').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('CardNo').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardNo').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('CardNo').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('CardBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('CardBankName').updateValueAndValidity();
    }


  }

  chkchequepay(event) {
    if (event.checked == true) {
      this.chkcheque = true;
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').enable();


      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').enable();


      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').enable();

    } else {
      this.chkcheque = false;
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('ChequePayAmount').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('ChequeNo').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('ChequeBankName').updateValueAndValidity();

    }

  }


  chkNeftpay(event) { 
    if (event.checked == true) {
      this.chkneft = true;
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').enable();


      this._Paymentmodesevice.paymentInsertform.get('Neftno').reset();
      this._Paymentmodesevice.paymentInsertform.get('Neftno').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('Neftno').enable();


      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').enable();

    } else {
      this.chkneft = false;
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('Neftno').reset();
      this._Paymentmodesevice.paymentInsertform.get('Neftno').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('Neftno').updateValueAndValidity();

      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').reset();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankName').updateValueAndValidity();

    }

  }

  chkpayTmpay(event) {
    if (event.checked == true) {
      this.chkpaytm = true
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').reset();
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').setValidators([Validators.required]);
      this._Paymentmodesevice.paymentInsertform.get('NeftpayAmount').enable();
    } else {
      this.chkpaytm = false
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').reset();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').clearValidators();
      this._Paymentmodesevice.paymentInsertform.get('NEFTBankMaster').updateValueAndValidity();
    }
  }
}
