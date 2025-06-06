import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OPSearhlistService } from '../op-searhlist.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IpPaymentInsert } from '../op-advance-payment/op-advance-payment.component';
import Swal from 'sweetalert2';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SnackBarService } from 'app/main/shared/services/snack-bar.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IpdAdvanceBrowseModel } from 'app/main/ipd/browse-ipadvance/browse-ipadvance.component';
import { IPSettlementService } from 'app/main/ipd/ip-settlement/ip-settlement.service';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';

@Component({
    selector: 'app-op-payment',
    templateUrl: './op-payment-vimal.component.html',
    styleUrls: ['./op-payment-vimal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OpPaymentVimalComponent implements OnInit {

    currentDate = new Date();
    patientDetailsFormGrp: FormGroup;
    selectedPaymnet1: string = '';
    paymentArr1: any[] = this.opService.getPaymentArr();
    IsAdv: boolean = false;
    BindPaymentTypes() {
        let full = this.opService.getPaymentArr();
        let final = [];
        full.forEach((item) => {
            if (!this.Payments.data.find(x => x.PaymentType == item.value)) {
                final.push(item);
            }
        });
        this.paymentArr1 = final;
    }

    onChangePaymentType() {
        if (this.selectedPaymnet1 == 'cash') {
            this.patientDetailsFormGrp.get('referenceNo1').clearValidators();
            this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('regDate1').clearValidators();
            this.patientDetailsFormGrp.get('regDate1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('bankName1').clearValidators();
            this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
        }
        else if (this.selectedPaymnet1 == 'tds') {
            this.patientDetailsFormGrp.get('referenceNo1').clearValidators();
            this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('regDate1').clearValidators();
            this.patientDetailsFormGrp.get('regDate1').updateValueAndValidity();
            this.patientDetailsFormGrp.get('bankName1').clearValidators();
            this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
            }
        else {
            this.patientDetailsFormGrp.get('referenceNo1').setValidators([Validators.required]);
            this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
            if (this.selectedPaymnet1 == 'cheque') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
            else if (this.selectedPaymnet1 == 'card') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
            else if (this.selectedPaymnet1 == 'net banking') {
                this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
            }
         
            else {
                this.patientDetailsFormGrp.get('bankName1').clearValidators();
                this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
            }
        }
    }
    Payments = new MatTableDataSource<PaymentList>();
    selectedSaleDisplayedCol = [
        'PaymentType',
        'Amount',
        'BankName',
        'RefNo',
        'RegDate',
        'buttons'
    ];
    netPayAmt: any = 0;
    nowDate: Date;
    amount1: number;
    screenFromString = 'payment-form';
    paidAmt: number;
    balanceAmt: number = 0;
    advanceData: any = {};
    PatientName: any;
    filteredOptionsBank1: Observable<string[]>;
    optionsBank1: any[] = [];
    BankNameList1: any = [];
    isSaveDisabled: boolean = false;
    submitted: boolean = false;
    get f(): { [key: string]: AbstractControl } {
        return this.patientDetailsFormGrp.controls;
    }
    IsAllowAdd() {
        return this.netPayAmt > ((this.paidAmt || 0) + Number(this.amount1));
    }
    GetBalanceAmt() { 
        this.IsMoreAmt = Number(this.netPayAmt || 0) - (Number(this.paidAmt || 0) + Number(this.amount1 || 0)) < 0;
        this.balanceAmt = Number(this.netPayAmt || 0) - ((Number(this.paidAmt || 0) + Number(this.amount1 || 0)));
       // this.balanceAmt = (Number(this.netPayAmt || 0) -  Number(this.amount1 || 0));
    }
    GetAmt() {
        if (this.amount1 > this.netPayAmt) {
            this.toastr.warning('Amount should not be greater than Net Amount', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            })
            this.amount1 = 0
            this.setPaidAmount();
            this.GetBalanceAmt()
            return;
        } 
        this.setPaidAmount();
        this.GetBalanceAmt();
    }
    IsMoreAmt = false;
    onAddPayment() { 
        this.submitted = true;
        debugger
        if (this.patientDetailsFormGrp.invalid) { 
            return;
        }
        if(this.IsMoreAmt){   
                this.toastr.warning('Amount should not be greater than Balance Amount', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            })
         return;
        }
        let tmp = this.Payments.data;
        tmp.push({
            Id: this.getNewId(),
            PaymentType: this.selectedPaymnet1, Amount: this.amount1,
            RefNo: this.patientDetailsFormGrp.get("referenceNo1")?.value ?? "",
            BankId: this.patientDetailsFormGrp.get("bankName1").value?.BankId ?? 0,
            BankName: this.patientDetailsFormGrp.get("bankName1").value?.BankName ?? "",
            RegDate: this.patientDetailsFormGrp.get("regDate1")?.value ?? ""
        });
        this.Payments.data = tmp;
        this.setPaidAmount();
        //this.balanceAmt = this.netPayAmt - this.paidAmt;
        // this.patientDetailsFormGrp.reset();
        // this.patientDetailsFormGrp.get('paidAmountController').setValue(this.paidAmt);
        this.patientDetailsFormGrp.get('balanceAmountController').setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("referenceNo1").setValue('');
        this.patientDetailsFormGrp.get("bankName1").setValue(null);
        //this.patientDetailsFormGrp.get("regDate1").setValue(null);
        this.patientDetailsFormGrp.get("amount1").setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("paymentType1").setValue(null);
        this.BindPaymentTypes();
        this.GetBalanceAmt();  
       
    }
    setPaidAmount() {
        debugger
        this.paidAmt = this.Payments.data.reduce(function (a, b) { return a + Number(b['Amount']); }, 0);
    }
    onKeyAdv(a, b) {
        a.UsedAmount = Number(b.target.value);
        this.SetAdvanceRow();
        this.setPaidAmount();
        this.GetBalanceAmt();
        this.getAdvanceAmt(a,b);
    }
    AdvanceId:any;
    getAdvanceAmt(element, index) {  
        debugger
      
        if (element.UsedAmount > element.balamt){
          Swal.fire(' Amount is less than Balance Amount:' + element.balamt);
          element.UsedAmount = '';
          element.BalanceAmount = element.balamt;
          element.UsedAmount = '';
        }
      else if(element.UsedAmount > 0){
        element.BalanceAmount = element.balamt - element.UsedAmount 
      } else if(element.UsedAmount == '' || element.UsedAmount == null || element.UsedAmount == undefined || element.UsedAmount == '0' ){
        element.UsedAmount = '';
        element.BalanceAmount = element.balamt;
      }  
      }
    getNewId() {
        return Math.max(...this.Payments.data.filter(x => x.Id > 0).map(o => o.Id), 0) + 1;
    }
    deletePayment(payment) {
        Swal.fire({
            title: "Are you sure to remove this payment?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                let tmp = this.Payments.data;
                tmp.splice(this.Payments.data.findIndex(x => x.Id == payment.Id), 1);
                if (payment.Id == -1)
                    this.IsAdv = false;
                this.Payments.data = tmp;
                this.paidAmt = this.Payments.data.reduce(function (a, b) { return a + Number(b['Amount']); }, 0);
                this.balanceAmt = this.netPayAmt - this.paidAmt;
                this.BindPaymentTypes();
            }
        });
    }
    RegNo: any;
    DoctorName: any;
    CompanyName: any;
    Date: any;
    DepartmentName: any;
    Age: any;
    OPD_IPD_Id: any;
    TariffName: any;
    MulPaySettleAmt: boolean =false;
    AdvanceFlag: boolean =true;
    displayedColumns = [
        'Date',
        'AdvanceNo',
        'AdvanceAmount',
        'UsedAmount',
        'BalanceAmount',
        'RefundAmount'
    ];
    dataSource = new MatTableDataSource<IpdAdvanceBrowseModel>();
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpPaymentVimalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private opService: OPSearhlistService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        private ipSearchService: IPSettlementService, 
            public toastr: ToastrService,
        // private snackBarService: SnackBarService
    ) {
        this.nowDate = new Date();
        if (data) {
            this.advanceData = this.data.vPatientHeaderObj;
            console.log(this.advanceData)
        }
        if (this.data.FromName == "Advance") {

            this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
            this.amount1 = parseInt(this.advanceData.NetPayAmount);
            this.Paymentobj['TransactionType'] = 1;
        }
        if (this.data.FromName == "OP-Bill" || this.data.FromName == "IP-Bill") {

            this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.amount1 = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.PatientName = this.advanceData.PatientName;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.DoctorName;
            this.CompanyName = this.advanceData.CompanyName;
            this.Date = this.advanceData.Date;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName;
            this.Paymentobj['TransactionType'] = 0;
            this.selectedPaymnet1 = 'cash';
        }
        if (this.data.FromName == "IP-RefundOfAdvance" || this.data.FromName == "IP-Advance" || this.data.FromName == "IP-RefundOfBill") {
            this.IsAdv = true;
            let Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + ""
            this.ipSearchService.getAdvcanceDetailslist(Query).subscribe(data => {
                this.dataSource.data = data as [];
            },
                (error) => {
                });
            this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
            this.amount1 = parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.Doctorname;
            this.CompanyName = this.advanceData.CompanyName;
            this.Date = this.advanceData.Date;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName;
            this.Paymentobj['TransactionType'] = 0;
            this.selectedPaymnet1 = 'cash';
        }

        if (this.data.FromName == "OP-RefundOfBill") {
            this.netPayAmt = parseInt(this.advanceData.NetPayAmount);
            this.amount1 = parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.Doctorname;
            this.CompanyName = this.advanceData.CompanyName;
            this.Date = this.advanceData.Date;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName;
            this.Paymentobj['TransactionType'] = 0;
            this.selectedPaymnet1 = 'cash';
        } 
        if (this.data.FromName == "SETTLEMENT") {
            this.netPayAmt = parseInt(this.advanceData.NetPayableAmt) || this.advanceData.NetPayAmount;
            this.amount1 = parseInt(this.advanceData.NetPayableAmt) || this.advanceData.NetPayAmount;
            this.PatientName = this.advanceData.PatientName;
            this.Paymentobj['TransactionType'] = 0;
        }
        if (this.data.FromName == "SalesSETTLEMENT") {
            this.netPayAmt = parseInt(this.advanceData.NetAmount);
            this.PatientName = this.advanceData.PatientName;
            this.Paymentobj['TransactionType'] = 2;
        } else if (this.data.FromName == "Phar-SalesPay") {
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Paymentobj['TransactionType'] = 2;
        }
        else if (this.data.FromName == "Advance-Refund") {
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Paymentobj['TransactionType'] = 2;
        }
      //Ip-Settlemet
        if (this.data.FromName == "IP-SETTLEMENT") {
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.paidAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Date = this.advanceData.Date;
        }
        //Op-Settlemet
        if (this.data.FromName == "OP-SETTLEMENT") {
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.paidAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Date = this.advanceData.Date; 
        }
        //IP-Pharmacy-Settlemet 
        if (this.data.FromName == "IP-Pharma-SETTLEMENT") { 
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.paidAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Date = this.advanceData.Date; 
             this.MulPaySettleAmt = true
             this.AdvanceFlag = false
        }
              //IP-Pharmacy-Settlemet 
        if (this.data.FromName == "IP-Pharma-SETTLEMENT In Browse List") { 
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.paidAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Date = this.advanceData.Date;  
        }
        //IP-Interim Bill
        if (this.data.FromName == "IP-IntrimBIll") {
            this.netPayAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.amount1 = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.paidAmt = this.advanceData.NetPayAmount; // parseInt(this.advanceData.NetPayAmount);
            this.PatientName = this.advanceData.PatientName;
            this.selectedPaymnet1 = 'cash';
            this.Date = this.advanceData.Date;
            this.AdvanceFlag = false
        }
    }

    ngOnInit(): void {
        this.patientDetailsFormGrp = this.createForm();
       
        if (this.data.FromName == "SalesSETTLEMENT") {
            this.data = this.data.vPatientHeaderObj;
            this.advanceData = this.data.vPatientHeaderObj; 
            this.selectedPaymnet1 = this.paymentArr1[0].value;
            this.amount1 = this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.PatientName = "SAS",//this.advanceData.PatientName;
            this.amount1 = parseInt(this.advanceData.NetAmount);
            this.Paymentobj['TransactionType'] = 4;
        }
        this.getAdvcanceDetails(false);
        this.getBankNameList1();
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    createForm() {
        return this.formBuilder.group({
            paymentType1: ['', Validators.required],
            amount1: [this.netPayAmt, Validators.min(0.1)],
            referenceNo1: [''],
            bankName1: [''],
            regDate1: [(new Date()).toISOString()],
            paidAmountController: [this.paidAmt],
            balanceAmountController: [this.balanceAmt]
        });
    }

    private _filterBank1(value: any): string[] {
        if (value) {
            const filterValue = value && value.BankName ? value.BankName.toLowerCase() : value.toLowerCase();
            return this.optionsBank1.filter(option => option.BankName.toLowerCase().includes(filterValue));
        }

    }

    getBankNameList1() {
        this.opService.getBankMasterCombo().subscribe(data => {
            this.BankNameList1 = data;
            this.optionsBank1 = this.BankNameList1.slice();
            this.filteredOptionsBank1 = this.patientDetailsFormGrp.get('bankName1').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterBank1(value) : this.BankNameList1.slice()),
            );

        });
    }
   
    getOptionTextBank1(option) {
        return option && option.BankName ? option.BankName : '';
    }
    onClose() {
        this.dialogRef.close();
    }

    Paymentobj = {}; 
    RemainingAmt:any=[];
    onSubmit() { 
        // this.Paymentobj['BillNo'] = this.data.billNo;
        // this.Paymentobj['ReceiptNo'] = '';
        // this.Paymentobj['PaymentDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
        // this.Paymentobj['PaymentTime'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
        // this.Paymentobj['AdvanceUsedAmount'] = 0;
        // this.Paymentobj['AdvanceId'] = 0;
        // this.Paymentobj['RefundId'] = 0;
        // this.Paymentobj['TransactionType'] = 0;
        // this.Paymentobj['Remark'] = "" //this.patientDetailsFormGrp.get('commentsController').value;
        // this.Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
        // this.Paymentobj['IsCancelled'] = 0;
        // this.Paymentobj['IsCancelledBy'] = 0;
        // this.Paymentobj['IsCancelledDate'] = "01/01/1900" //this.dateTimeObj.date;
        // this.Paymentobj['CashCounterId'] = 0;
        // this.Paymentobj['IsSelfORCompany'] = 0;
        // this.Paymentobj['CompanyId'] = 0;
        // this.Paymentobj['PaidAmt'] = this.patientDetailsFormGrp.get('paidAmountController').value+Number(this.amount1);
        // this.Paymentobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;
        // this.Paymentobj["CashPayAmount"] = this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
        // this.Paymentobj["ChequePayAmount"] = this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
        // this.Paymentobj["ChequeNo"] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? 0;
        // this.Paymentobj["PayTMAmount"] = this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
        // this.Paymentobj["NEFTPayAmount"] = this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
        // this.Paymentobj["CardPayAmount"] = this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
        // console.log(JSON.stringify(this.Paymentobj));
        
         if(this.amount1 > 0){
            if(this.patientDetailsFormGrp.get('paymentType1').value == undefined || this.patientDetailsFormGrp.get('paymentType1').value == null){
                this.toastr.warning('Please select payment mode or remove amount..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                  });
                  return 
            } 

             if (this.patientDetailsFormGrp.get('paymentType1').value) {
                 if (this.patientDetailsFormGrp.get('paymentType1').value != "cash" && this.patientDetailsFormGrp.get('paymentType1').value != "tds") {

                     if (this.patientDetailsFormGrp.get('referenceNo1').value == undefined || this.patientDetailsFormGrp.get('referenceNo1').value == '0' ||
                         this.patientDetailsFormGrp.get('referenceNo1').value == null || this.patientDetailsFormGrp.get('referenceNo1').value == '') {
                         this.toastr.warning('Please enter Referance Number..', 'warning !', {
                             toastClass: 'tostr-tost custom-toast-warning',
                         });
                         return
                     }
                     if (this.patientDetailsFormGrp.get('paymentType1').value != "upi") {
                         if (this.patientDetailsFormGrp.get('bankName1').value == undefined || this.patientDetailsFormGrp.get('bankName1').value == null
                             || this.patientDetailsFormGrp.get('bankName1').value == '') {
                             this.toastr.warning('Please select bank name..', 'warning !', {
                                 toastClass: 'tostr-tost custom-toast-warning',
                             });
                             return
                         }
                         if (this.patientDetailsFormGrp.get('bankName1').value) {
                             if (!this.BankNameList1.some(item => item.BankId == this.patientDetailsFormGrp.get('bankName1').value.BankId)) {
                                 this.toastr.warning('Please select valid bank name..', 'warning !', {
                                     toastClass: 'tostr-tost custom-toast-warning',
                                 });
                                 return
                             }
                         }
                     }

                 }
             }  
         }
        this.onAddPayment();
        // if (this.balanceAmt != 0) {
        //     Swal.fire('Please select payment mode, Balance Amount is' + this.balanceAmt)
        //     return
        // }
        // if (this.amount1 != 0) {
        //     let balamt = this.netPayAmt - this.paidAmt
        //     Swal.fire('Please pay remaing amount, Balance Amount is ' + balamt)
        //     return
        // } 

        if (this.data.FromName == "IP-SETTLEMENT" || this.data.FromName == "OP-SETTLEMENT") {
            this.Paymentobj['PaymentId'] = '0';
            this.Paymentobj['billNo'] = this.advanceData.BillNo;
            this.Paymentobj['PaymentDate'] = this.dateTimeObj.date; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PaymentTime'] = this.dateTimeObj.time; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
            this.Paymentobj['ChequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
            this.Paymentobj['ChequeNo'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? 0;
            this.Paymentobj['BankName'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.BankName ?? "";
            this.Paymentobj['ChequeDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
            this.Paymentobj['CardNo'] = this.Payments.data.find(x => x.PaymentType == "card")?.RefNo ?? 0;
            this.Paymentobj['CardBankName'] = this.Payments.data.find(x => x.PaymentType == "card")?.BankName ?? "";
            this.Paymentobj['CardDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            if(this.IsAdv){
            this.Paymentobj['AdvanceUsedAmount'] = this.advanceUsedAmt || 0; 
            this.Paymentobj['AdvanceId'] =   this.AdvanceId || 0; 
            }else{
            this.Paymentobj['AdvanceUsedAmount'] = 0;
            this.Paymentobj['AdvanceId'] = 0;
            } 
            this.Paymentobj['RefundId'] = 0;
            this.Paymentobj['TransactionType'] = 0;
            this.Paymentobj['Remark'] = '';
            this.Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id || 0;
            this.Paymentobj['IsCancelled'] = 'false';
            this.Paymentobj['IsCancelledBy'] = '0';
            this.Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            let OP_IP_Type;
            if (this.advanceData.FromName == "OP-SETTLEMENT") {
                OP_IP_Type = 0;
            } else {
                OP_IP_Type = 1;
            }
            this.Paymentobj['opD_IPD_Type'] = OP_IP_Type;
            this.Paymentobj['NEFTPayAmount'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
            this.Paymentobj['NEFTNo'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.RefNo ?? 0;
            this.Paymentobj['NEFTBankMaster'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.BankName ?? "";
            this.Paymentobj['NEFTDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PayTMAmount'] = this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
            this.Paymentobj['PayTMTranNo'] = this.Payments.data.find(x => x.PaymentType == "upi")?.RefNo ?? 0;
            this.Paymentobj['PayTMDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['tdsAmount'] =  this.Payments.data.find(x => x.PaymentType == "tds")?.Amount ?? 0;
        }
        else if(this.data.FromName == "IP-Pharma-SETTLEMENT"){  
            let PaymentMul = []; 
debugger
            let PayCashAmt,PayChequeAmt,PayCardAmt,PayNeftAmt,PyaPytmAmt,PyaTDSAmt
            let CashAmount =  this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
            let ChequeAmt =  this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
            let CardAmt =  this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
            let NeftAmt =  this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
            let PaytmAmt =  this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
            let PayTds =  this.Payments.data.find(x => x.PaymentType == "tds")?.Amount ?? 0;
            
            this.data.ArrayList.forEach(element=>{   
                    if(CashAmount == this.netPayAmt){ 
                       PayCashAmt = element.BalanceAmount
                    }
                    else if(ChequeAmt == this.netPayAmt){ 
                        PayChequeAmt = element.BalanceAmount
                    }
                    else if(CardAmt == this.netPayAmt){ 
                        PayCardAmt = element.BalanceAmount
                    }
                    else if(NeftAmt == this.netPayAmt){ 
                       PayNeftAmt = element.BalanceAmount
                    }
                    else if(PaytmAmt == this.netPayAmt){ 
                       PyaPytmAmt = element.BalanceAmount
                    }
                    else if(PayTds == this.netPayAmt){ 
                        PayTds = element.BalanceAmount
                     }
                    else{ 
                        if(CashAmount < this.netPayAmt && CashAmount > 0){
                            if(CashAmount > element.BalanceAmount){
                                let Cashpay1= CashAmount + element.BalanceAmount
                                PayCashAmt = Cashpay1 - CashAmount 
                                CashAmount =CashAmount - PayCashAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(CashAmount <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - CashAmount
                                PayCashAmt = element.BalanceAmount - Cashpay1  
                                CashAmount = CashAmount - PayCashAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                        if(ChequeAmt < this.netPayAmt && ChequeAmt > 0){
                            if(ChequeAmt > element.BalanceAmount){
                                let Cashpay1= ChequeAmt + element.BalanceAmount
                                PayChequeAmt = Cashpay1 - ChequeAmt 
                                ChequeAmt =ChequeAmt - PayChequeAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(ChequeAmt <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - ChequeAmt
                                PayChequeAmt = element.BalanceAmount - Cashpay1  
                                ChequeAmt = ChequeAmt - PayChequeAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                        if(CardAmt < this.netPayAmt && CardAmt > 0){
                            if(CardAmt > element.BalanceAmount){
                                let Cashpay1= CardAmt + element.BalanceAmount
                                PayCardAmt = Cashpay1 - CardAmt 
                                CardAmt =CardAmt - PayCardAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(CardAmt <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - CardAmt
                                PayCardAmt = element.BalanceAmount - Cashpay1  
                                CardAmt = CardAmt - PayCardAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                        if(NeftAmt < this.netPayAmt && NeftAmt > 0){
                            if(NeftAmt > element.BalanceAmount){
                                let Cashpay1= NeftAmt + element.BalanceAmount
                                PayNeftAmt = Cashpay1 - NeftAmt 
                                NeftAmt =NeftAmt - PayNeftAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(NeftAmt <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - NeftAmt
                                PayNeftAmt = element.BalanceAmount - Cashpay1  
                                NeftAmt = NeftAmt - PayNeftAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                        if(PaytmAmt < this.netPayAmt && PaytmAmt > 0){
                            if(PaytmAmt > element.BalanceAmount){
                                let Cashpay1= PaytmAmt + element.BalanceAmount
                                PyaPytmAmt = Cashpay1 - PaytmAmt 
                                PaytmAmt =PaytmAmt - PyaPytmAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(PaytmAmt <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - PaytmAmt
                                PyaPytmAmt = element.BalanceAmount - Cashpay1  
                                PaytmAmt = PaytmAmt - PyaPytmAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                        if(PayTds < this.netPayAmt && PayTds > 0){
                            if(PayTds > element.BalanceAmount){
                                let Cashpay1= PayTds + element.BalanceAmount
                                PyaTDSAmt = Cashpay1 - PayTds 
                                PayTds =PayTds - PyaTDSAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }else if(PayTds <= element.BalanceAmount){
                                let Cashpay1= element.BalanceAmount - PayTds
                                PyaTDSAmt = element.BalanceAmount - Cashpay1  
                                PayTds = PayTds - PyaTDSAmt
                                this.RemainingAmt.push( 
                                    {
                                        SalesId:element.SalesId,
                                        BalAmt:Cashpay1
                                    }
                                )
                            }   
                        } 
                    } 
             
                let MultiplePay = {} 
                MultiplePay['BillNo'] = element.SalesId || 0; //this.advanceData.BillNo;
                MultiplePay['PaymentDate'] =  this.dateTimeObj.date; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['PaymentTime'] =  this.dateTimeObj.time; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['CashPayAmount'] = PayCashAmt || 0
                MultiplePay['ChequePayAmount'] =PayChequeAmt || 0
                MultiplePay['ChequeNo'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? 0;
                MultiplePay['BankName'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.BankName ?? "";
                MultiplePay['ChequeDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['CardPayAmount'] = PayCardAmt || 0;
                MultiplePay['CardNo'] = this.Payments.data.find(x => x.PaymentType == "card")?.RefNo ?? 0;
                MultiplePay['CardBankName'] = this.Payments.data.find(x => x.PaymentType == "card")?.BankName ?? "";
                MultiplePay['CardDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                if(this.IsAdv){
                    MultiplePay['AdvanceUsedAmount'] = this.advanceUsedAmt || 0; 
                    MultiplePay['AdvanceId'] =   this.AdvanceId || 0; 
                }else{
                    MultiplePay['AdvanceUsedAmount'] = 0;
                    MultiplePay['AdvanceId'] = 0;
                } 
                MultiplePay['TransactionType'] = 4;  
                MultiplePay['Remark'] = '';
                MultiplePay['AddBy'] = this._loggedService.currentUserValue.user.id || 0;
                MultiplePay['IsCancelled'] = 0;
                MultiplePay['IsCancelledBy'] = 0; 
                MultiplePay['IsCancelledDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['opD_IPD_Type'] =3;
                MultiplePay['NEFTPayAmount'] = PayNeftAmt || 0;
                MultiplePay['NEFTNo'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.RefNo ?? 0;
                MultiplePay['NEFTBankMaster'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.BankName ?? "";
                MultiplePay['NEFTDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['PayTMAmount'] =PyaPytmAmt || 0;
                MultiplePay['PayTMTranNo'] = this.Payments.data.find(x => x.PaymentType == "upi")?.RefNo ?? 0;
                MultiplePay['PayTMDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
                MultiplePay['paymentId'] = PyaTDSAmt || 0;
                PaymentMul.push(MultiplePay)
            }) 
            this.Paymentobj = PaymentMul
          }
        else if (this.data.FromName == "OP-RefundOfBill" || this.data.FromName == "IP-RefundOfBill" || this.data.FromName == "IP-RefundOfAdvance" || this.data.FromName == "IP-Advance") {
            this.Paymentobj['BillNo'] = this.advanceData.BillNo;
            this.Paymentobj['ReceiptNo'] = "";
            this.Paymentobj['PaymentDate'] =  this.dateTimeObj.date; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PaymentTime'] =  this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
            this.Paymentobj['ChequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
            this.Paymentobj['ChequeNo'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? 0;
            this.Paymentobj['BankName'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.BankName ?? "";
            this.Paymentobj['ChequeDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
            this.Paymentobj['CardNo'] = this.Payments.data.find(x => x.PaymentType == "card")?.RefNo ?? 0;
            this.Paymentobj['CardBankName'] = this.Payments.data.find(x => x.PaymentType == "card")?.BankName ?? "";
            this.Paymentobj['CardDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['AdvanceUsedAmount'] = 0;
            this.Paymentobj['AdvanceId'] = 0;
            this.Paymentobj['RefundId'] = 0;
            let TransactionType;
            if (this.data.FromName == "OP-Bill") {
                TransactionType = 0;
            } else if (this.data.FromName == "OP-RefundOfBill" || this.data.FromName == "IP-RefundOfBill" || this.data.FromName == "IP-RefundOfAdvance") {
                TransactionType = 2;
            } else if (this.data.FromName == "IP-Advance") {
                TransactionType = 1;
            }
            this.Paymentobj['TransactionType'] = TransactionType;
            this.Paymentobj['Remark'] = " ";
            this.Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
            this.Paymentobj['IsCancelled'] = 0;
            this.Paymentobj['IsCancelledBy'] = 0;
            this.Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashCounterId'] = 0;
            this.Paymentobj['NEFTPayAmount'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
            this.Paymentobj['NEFTNo'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.RefNo ?? 0;
            this.Paymentobj['NEFTBankMaster'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.BankName ?? "";
            this.Paymentobj['NEFTDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PayTMAmount'] = this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
            this.Paymentobj['PayTMTranNo'] = this.Payments.data.find(x => x.PaymentType == "upi")?.RefNo ?? 0;
            this.Paymentobj['PayTMDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PaidAmt'] = this.paidAmt;// this.patientDetailsFormGrp.get('paidAmountController').value +Number(this.amount1);
            this.Paymentobj['BalanceAmt'] = this.patientDetailsFormGrp.get('balanceAmountController').value;
            this.Paymentobj['tdsAmount'] =  this.Payments.data.find(x => x.PaymentType == "tds")?.Amount ?? 0; 
        }
        else if(this.data.FromName == "IP-IntrimBIll" || this.data.FromName == "IP-Bill"){ 
            this.Paymentobj['billNo'] = 0;
            this.Paymentobj['receiptNo'] = '0';
            this.Paymentobj['PaymentDate'] =  this.dateTimeObj.date; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PaymentTime'] =  this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
            this.Paymentobj['ChequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
            this.Paymentobj['ChequeNo'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? 0;
            this.Paymentobj['BankName'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.BankName ?? "";
            this.Paymentobj['ChequeDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
            this.Paymentobj['CardNo'] = this.Payments.data.find(x => x.PaymentType == "card")?.RefNo ?? 0;
            this.Paymentobj['CardBankName'] = this.Payments.data.find(x => x.PaymentType == "card")?.BankName ?? "";
            this.Paymentobj['CardDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            if(this.IsAdv){
                this.Paymentobj['AdvanceUsedAmount'] = this.advanceUsedAmt || 0; 
                this.Paymentobj['AdvanceId'] =   this.AdvanceId || 0; 
                }else{
                this.Paymentobj['AdvanceUsedAmount'] = 0;
                this.Paymentobj['AdvanceId'] = 0;
                } 
            this.Paymentobj['RefundId'] = 0;
            this.Paymentobj['TransactionType'] = 0;
            this.Paymentobj['Remark'] = '';
            this.Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
            this.Paymentobj['IsCancelled'] = 0;
            this.Paymentobj['IsCancelledBy'] = 0;
            this.Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashCounterId'] = 0;
            this.Paymentobj['NEFTPayAmount'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
            this.Paymentobj['NEFTNo'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.RefNo ?? 0;
            this.Paymentobj['NEFTBankMaster'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.BankName ?? "";
             this.Paymentobj['NEFTDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PayTMAmount'] = this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
            this.Paymentobj['PayTMTranNo'] = this.Payments.data.find(x => x.PaymentType == "upi")?.RefNo ?? 0;
            this.Paymentobj['PayTMDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
             this.Paymentobj['tdsAmount'] =  this.Payments.data.find(x => x.PaymentType == "tds")?.Amount ?? 0; 
          } 
        else if (this.data.FromName == "IP-Pharma-SETTLEMENT In Browse List") {

            if(this.patientDetailsFormGrp.get('balanceAmountController').value != 0 ){
                  this.toastr.warning('Please check balance amount..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                  });
                  return  
            }

            this.Paymentobj['BillNo'] = this.advanceData.BillNo;
            this.Paymentobj['PaymentDate'] = this.dateTimeObj.date; //this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PaymentTime'] = this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "cash")?.Amount ?? 0;
            this.Paymentobj['ChequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.Amount ?? 0;
            this.Paymentobj['ChequeNo'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.RefNo ?? "";
            this.Paymentobj['BankName'] = this.Payments.data.find(x => x.PaymentType == "cheque")?.BankName ?? "";
            this.Paymentobj['ChequeDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['CardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "card")?.Amount ?? 0;
            this.Paymentobj['CardNo'] = this.Payments.data.find(x => x.PaymentType == "card")?.RefNo ?? "";
            this.Paymentobj['CardBankName'] = this.Payments.data.find(x => x.PaymentType == "card")?.BankName ?? "";
            this.Paymentobj['CardDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            if (this.IsAdv) {
                this.Paymentobj['AdvanceUsedAmount'] = this.advanceUsedAmt || 0;
                this.Paymentobj['AdvanceId'] = this.AdvanceId || 0;
            } else {
                this.Paymentobj['AdvanceUsedAmount'] = 0;
                this.Paymentobj['AdvanceId'] = 0;
            }
            this.Paymentobj['RefundId'] = 0;
            this.Paymentobj['TransactionType'] = 4;
            this.Paymentobj['Remark'] = '';
            this.Paymentobj['AddBy'] = this._loggedService.currentUserValue.user.id,
                this.Paymentobj['IsCancelled'] = false;
            this.Paymentobj['IsCancelledBy'] = 0;
            this.Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['opD_IPD_Type'] = 3;
            this.Paymentobj['NEFTPayAmount'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.Amount ?? 0;
            this.Paymentobj['NEFTNo'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.RefNo ?? "";
            this.Paymentobj['NEFTBankMaster'] = this.Payments.data.find(x => x.PaymentType == "net banking")?.BankName ?? "";
            this.Paymentobj['NEFTDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
            this.Paymentobj['PayTMAmount'] = this.Payments.data.find(x => x.PaymentType == "upi")?.Amount ?? 0;
            this.Paymentobj['PayTMTranNo'] = this.Payments.data.find(x => x.PaymentType == "upi")?.RefNo ?? "";
            this.Paymentobj['PayTMDate'] = this.datePipe.transform(this.currentDate, 'MM/dd/yyyy') || this.datePipe.transform(this.currentDate, 'MM/dd/yyyy')
             this.Paymentobj['paymentId'] = 0; 
        } 
        console.log(JSON.stringify(this.Paymentobj));

        //const ipPaymentInsert = new IpPaymentInsert(this.Paymentobj);

        let submitDataPay = {
            ipPaymentInsert:this.Paymentobj
        };
        let IsSubmit
        if(this.data.FromName == "IP-SETTLEMENT" || this.data.FromName == "OP-SETTLEMENT" || this.data.FromName == "IP-Pharma-SETTLEMENT In Browse List" || this.data.FromName == "IP-Bill" || this.data.FromName == "IP-Pharma-SETTLEMENT"){

            let Advancesarr = [];
            this.dataSource.data.forEach((element) => {
                let Advanceobj = {};
                console.log(element);
                Advanceobj['AdvanceId'] = element.AdvanceId;
                Advanceobj['AdvanceDetailID'] = element.AdvanceDetailID;
                Advanceobj['AdvanceAmount'] = element.AdvanceAmount;
                Advanceobj['UsedAmount'] = element.UsedAmount;
                Advanceobj['Date'] = element.Date;
                Advanceobj['BalanceAmount'] = element.BalanceAmount;
                Advanceobj['RefundAmount'] = element.RefundAmount;
                Advancesarr.push(Advanceobj);
            }); 
            let BalAmt 
            if(this.data.FromName == "IP-Pharma-SETTLEMENT"){
                BalAmt = this.RemainingAmt
            }else{
                BalAmt = this.patientDetailsFormGrp.get('balanceAmountController').value
            }
             IsSubmit = {
                "submitDataPay": submitDataPay,
                "submitDataAdvancePay": Advancesarr,
                "PaidAmt":this.paidAmt, // this.patientDetailsFormGrp.get('paidAmountController').value,
                "BalAmt": BalAmt,
                "IsSubmitFlag": true,
            }
        }else{
             IsSubmit = {
                "submitDataPay": submitDataPay,
                "IsSubmitFlag": true
            }
        }
      
        console.log(IsSubmit);
        this.dialogRef.close(IsSubmit);
    }

    onClose1() {

        let IsSubmit = {
            "IsSubmitFlag": false,
            "BalAmt": this.netPayAmt
        }
        this.dialogRef.close(IsSubmit);
    }
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    keyPressCharater(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/^\d*\.?\d*$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    getAdvcanceDetails(isReset?: any) {
        debugger 
        this.dataSource.data = [];
        let Query
        if(this.data.FromName != "IP-IntrimBIll" && this.data.FromName != "IP-Pharma-SETTLEMENT"){
            if (this.data.FromName == "IP-Pharma-SETTLEMENT In Browse List") {
                Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from T_PHAdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + " and IsCancelled=0"
            } else {
                Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + " and IsCancelled=0"
            }
            // Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + ""

            this.ipSearchService.getAdvcanceDetailslist(Query).subscribe(data => {
                this.dataSource.data = data as [];
                console.log(data);
                if (this.dataSource.data.length > 0) {
                    this.IsAdv = true
                    this.AdvanceId = this.dataSource.data[0].AdvanceId
                    console.log(this.dataSource.data)
                    this.calculateBalance();
                    this.SetAdvanceRow();
                    this.setPaidAmount();
                    this.GetBalanceAmt();
                }
            },
                (error) => {
                });
        } 
    }
    
    OnAdvAmt(e) {
        this.IsAdv = e.checked;
        if (this.IsAdv) {
            let Query
             if (this.data.FromName == "IP-Pharma-SETTLEMENT In Browse List") {
                Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from T_PHAdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + " and IsCancelled=0"
            } else {
                Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + " and IsCancelled=0"
            }
            // Query = "select AdvanceDetailID,convert(Char(10),Date,103)as Date,AdvanceId,OPD_IPD_Id,AdvanceAmount,UsedAmount,BalanceAmount,RefundAmount,BalanceAmount as balamt from AdvanceDetail where OPD_IPD_Id=" + this.advanceData.OPD_IPD_Id + ""

            this.ipSearchService.getAdvcanceDetailslist(Query).subscribe(data => {
                this.dataSource.data = data as [];
                this.AdvanceId = this.dataSource.data[0].AdvanceId
                console.log(this.dataSource.data)
                this.calculateBalance();
                this.SetAdvanceRow();
                this.setPaidAmount();
                this.GetBalanceAmt();
            },
                (error) => {
                });
        }else{
            this.Payments.data = []; 
            this.dataSource.data = []; 
            this.amount1 = this.netPayAmt;
            this.setPaidAmount();
            this.GetBalanceAmt();
        }  
    }
    advanceUsedAmt:any=0;
    calculateBalance() {
        if (this.dataSource.data && this.dataSource.data.length > 0) {
          let totalAdvanceAmt = 0;
          let netAmtLocal = this.netPayAmt;
          this.dataSource.data.forEach(element => {
            if (netAmtLocal > element.BalanceAmount) {
              element.UsedAmount = element.BalanceAmount;
              element.BalanceAmount = element.BalanceAmount - element.UsedAmount;
              netAmtLocal = netAmtLocal - element.UsedAmount;
            } else if (netAmtLocal <= element.BalanceAmount) {
              element.BalanceAmount = element.BalanceAmount - netAmtLocal;
              element.UsedAmount = netAmtLocal;
              netAmtLocal = netAmtLocal - element.UsedAmount;
            }
            totalAdvanceAmt += element.UsedAmount;
          }); 
        }
      }
      getAdvanceSum(element) {
        let netAmt; 
        netAmt = element.reduce((sum, { UsedAmount }) => sum += +(UsedAmount || 0), 0);
        this.advanceUsedAmt = netAmt; 
        return netAmt
      }
    SetAdvanceRow() { 
        let adv = this.dataSource.data.reduce(function (a, b) { return a + Number(b['UsedAmount']); }, 0);
        let tmp = this.Payments.data.find(x => x.Id == -1);
        if (tmp) {
            tmp.Amount = adv;
        }
        else {
            let tmp1 = this.Payments.data;
            tmp1.push({
                Id: -1,
                PaymentType: "Advance Amount", Amount: adv,
                RefNo: "",
                BankId: 0,
                BankName: "",
                RegDate: new Date()
            });
            this.Payments.data = tmp1;
        }
        this.amount1 = 0;
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
    OPD_IPD_Type: any;
    // CashCounterId: number;
    // IsSelfORCompany: number;
    // CompanyId: any;
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

        this.OPD_IPD_Type = PharPaymentInsert.OPD_IPD_Type || 0;
        // this.IsSelfORCompany = PharPaymentInsert.IsSelfORCompany || 0;
        // this.CompanyId = PharPaymentInsert.CompanyId || 0;

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
export class PaymentList {
    PaymentType: string;
    Amount: number;
    RefNo: string;
    BankName: string;
    RegDate: Date;
    Id: number;
    BankId: number;
}