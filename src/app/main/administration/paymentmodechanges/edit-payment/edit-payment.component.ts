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
    debugger
    const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'shortTime');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd'); 
  if(this.data.FromName == 'IP-PaymentModeChange'){
    if (this._Paymentmodesevice.paymentform.get('BalAmount').value == 0){
    

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
      } 
      if(this._Paymentmodesevice.paymentform.get('ChequePayAmt').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('ChequeBankName').value){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
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
        if(!this._Paymentmodesevice.paymentform.get('NEFTBankName').value){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
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
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentform.get('CardBankName').value)
      CardBank = this._Paymentmodesevice.paymentform.get('CardBankName').value;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentform.get('ChequeBankName').value)
      ChequeBank = this._Paymentmodesevice.paymentform.get('ChequeBankName').value;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentform.get('NEFTBankName').value)
      NFTBank = this._Paymentmodesevice.paymentform.get('NEFTBankName').value;
      let paymentModeUpdateObj = {
          "PaymentId": this.registerObj.paymentId || 0,         
          "BillNo": this.vBillNo || 0,    
          "ReceiptNo": this.registerObj.receiptNo || "0",    
          "PaymentDate": formattedDate,    
          "PaymentTime": formattedTime,    
          "CashPayAmount": this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0,    
          "ChequePayAmount": this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0,  
          "ChequeNo": this._Paymentmodesevice.paymentform.get('ChequeNo').value || "",    
          "BankName": ChequeBank || "",    
          "ChequeDate": this.registerObj.chequeDate || "1900-01-01",    
          "CardPayAmount": this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0,    
          "CardNo": this._Paymentmodesevice.paymentform.get('CardNo').value || "",    
          "CardBankName": CardBank || "",    
          "CardDate": this.registerObj.cardDate || "1900-01-01",    
          "AdvanceUsedAmount": this.registerObj.advanceUsedAmount || 0,    
          "AdvanceId": this.registerObj.advanceId || 0,    
          "RefundId": this.registerObj.refundId || 0,    
          "TransactionType": this.registerObj.transactionType || 0,    
          "Remark": this.registerObj.remark || "",    
          "AddBy": this.registerObj.addBy || 0,    
          "IsCancelled": true,    
          "IsCancelledBy": 0,    
          "IsCancelledDate": "1900-01-01",    
          "NeftpayAmount": this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0,    
          "Neftno": this._Paymentmodesevice.paymentform.get('NEFTNo').value || "",    
          "NeftbankMaster": NFTBank || "",    
          "Neftdate": "1900-01-01",    
          "PayTmamount": this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0,    
          "PayTmtranNo": this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || "",    
          "PayTmdate": "1900-01-01",    
          "Tdsamount": 0
        
      };
      console.log(paymentModeUpdateObj);
      this._Paymentmodesevice.PaymentUpdate(paymentModeUpdateObj).subscribe(response => {
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
      } 
      if(this._Paymentmodesevice.paymentform.get('ChequePayAmt').value){
        if ((this.vchequeNo == '' || this.vchequeNo == null || this.vchequeNo == undefined)) {
          this.toastr.warning('Please enter a Cheque No', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
        }
        if(!this._Paymentmodesevice.paymentform.get('ChequeBankName').value){
          this.toastr.warning('Please Select Cheque Bank Name', 'Warning !', {
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
        if(!this._Paymentmodesevice.paymentform.get('NEFTBankName').value){
          this.toastr.warning('Please Select NEFT Bank Name', 'Warning !', {
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
      let CardBank = 0;
      if (this._Paymentmodesevice.paymentform.get('CardBankName').value)
      CardBank = this._Paymentmodesevice.paymentform.get('CardBankName').value;
  
      let ChequeBank = 0;
      if (this._Paymentmodesevice.paymentform.get('ChequeBankName').value)
      ChequeBank = this._Paymentmodesevice.paymentform.get('ChequeBankName').value;
  
      let NFTBank = 0;
      if (this._Paymentmodesevice.paymentform.get('NEFTBankName').value)
      NFTBank = this._Paymentmodesevice.paymentform.get('NEFTBankName').value;
      let paymentModeUpdateObj = {
        "PaymentId": this.registerObj.paymentId || 0,    
          "BillNo": this.vBillNo || 0,    
          "ReceiptNo": this.registerObj.receiptNo || "0",    
          "PaymentDate": formattedDate,    
          "PaymentTime": formattedTime,    
          "CashPayAmount": this._Paymentmodesevice.paymentform.get('CashPayAmt').value || 0,    
          "ChequePayAmount": this._Paymentmodesevice.paymentform.get('ChequePayAmt').value || 0,  
          "ChequeNo": this._Paymentmodesevice.paymentform.get('ChequeNo').value || "",    
          "BankName": ChequeBank || "",    
          "ChequeDate": "2024-08-10",    
          "CardPayAmount": this._Paymentmodesevice.paymentform.get('CardPayAmt').value || 0,    
          "CardNo": this._Paymentmodesevice.paymentform.get('CardNo').value || "",    
          "CardBankName": CardBank || "",    
          "CardDate": "2024-08-10",    
          "AdvanceUsedAmount": this.registerObj.advanceUsedAmount || 0,    
          "AdvanceId": this.registerObj.advanceId || 0,    
          "RefundId": this.registerObj.refundId || 0,    
          "TransactionType": this.registerObj.transactionType || 0,    
          "Remark": this.registerObj.remark || "",    
          "AddBy": this.registerObj.addBy || 0,    
          "IsCancelled": true,    
          "IsCancelledBy": 0,    
          "IsCancelledDate": "2024-08-10",    
          "NeftpayAmount": this._Paymentmodesevice.paymentform.get('NEFTPayAmount').value || 0,    
          "Neftno": this._Paymentmodesevice.paymentform.get('NEFTNo').value || "",    
          "NeftbankMaster": NFTBank || "",    
          "Neftdate": "2024-08-10",    
          "PayTmamount": this._Paymentmodesevice.paymentform.get('PayTMAmount').value || 0,    
          "PayTmtranNo": this._Paymentmodesevice.paymentform.get('PayTMTranNo').value || "",    
          "PayTmdate": "2024-08-10",    
          "Tdsamount": 0
      };
      console.log(paymentModeUpdateObj);
      this._Paymentmodesevice.PaymentUpdate(paymentModeUpdateObj).subscribe(response => {
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

selectChangeBankName(obj: any){
console.log(obj)
}
getValidationMessages(){
  return{
    CardBankName:[],
    ChequeBankName:[],
    NEFTBankName:[]
  }
}
  Reset() {
    this._Paymentmodesevice.paymentform.reset();
  }
  amount:any = 0;
 
  getPaidAmount(event) {
    let amount = this.registerObj.paidAmount 
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
    let amount = this.registerObj.paidAmount 
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
    let amount = this.registerObj.paidAmount 
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
    let amount = this.registerObj.paidAmount 
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
    let amount = this.registerObj.paidAmount 
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
