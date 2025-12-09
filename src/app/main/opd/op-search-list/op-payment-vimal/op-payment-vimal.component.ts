import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { IpdAdvanceBrowseModel } from 'app/main/ipd/browse-ip-advance/browse-ip-advance.component';
import { IPSearchListService } from 'app/main/ipd/ip-search-list/ip-search-list.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { OPSearhlistService } from '../op-searhlist.service';

@Component({
    selector: 'app-op-payment',
    templateUrl: './op-payment-vimal.component.html',
    styleUrls: ['./op-payment-vimal.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OpPaymentVimalComponent implements OnInit {
    Payments = new MatTableDataSource<PaymentList>();
    selectedSaleDisplayedCol = [
        'PaymentType',
        'Amount',
        'BankName',
        'RefNo',
        'RegDate',
        'buttons'
    ];
    autocompleteModebank: string = "Bank";
    autocompleteModecompany: string = "Company"; 
      autocompleteModePaymentMode: string = "CommonpaymentMode";
    currentDate = new Date();
    patientDetailsFormGrp: FormGroup;
    selectedPaymnet1: string = '';
    paymentArr1: any[] = this.opService.getPaymentArr();
    IsAdv: boolean = false;
        RegNo: any;
    DoctorName: any;
    CompanyName: any;
    Date: any;
    DepartmentName: any;
    Age: any;
    OPD_IPD_Id: any; 
    netPayAmt: any = 0; 
    nowDate: Date;
    amount1: number;
    screenFromString = 'payment-form';
    paidAmt: number;
    balanceAmt: number = 0;
    advanceData: any = {};
    PatientName: any;    
    submitted: boolean = false;
    displayedColumns = [
        'Date',
        'AdvanceNo',
        'AdvanceAmount',
        'UsedAmount',
        'BalanceAmount',
        'RefundAmount'
    ];
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
getselectObjPayMode(obj){
  console.log(obj)
   this.selectedPaymnet1 = obj.text
   this.onChangePaymentType();
} 
  onChangePaymentType() {
    if (this.selectedPaymnet1 == 'CASH') {
      this.patientDetailsFormGrp.get('referenceNo1').clearValidators();
      this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
      this.patientDetailsFormGrp.get('regDate1').clearValidators();
      this.patientDetailsFormGrp.get('regDate1').updateValueAndValidity();
      this.patientDetailsFormGrp.get('bankName1').clearValidators();
      this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
    }
    else if (this.selectedPaymnet1 == 'TDS' || this.selectedPaymnet1 == 'WF') {
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
      if (this.selectedPaymnet1 == 'CHEQUE') {
        this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
      }
      else if (this.selectedPaymnet1 == 'CARD') {
        this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
      }
      else if (this.selectedPaymnet1 == 'NET BANKING') {
        this.patientDetailsFormGrp.get('bankName1').setValidators([Validators.required]);
      }
      else if (this.selectedPaymnet1 == 'UPI') {
        this.patientDetailsFormGrp.get('referenceNo1').setValidators([Validators.required]);
        this.patientDetailsFormGrp.get('regDate1').setValidators([Validators.required]);
        this.patientDetailsFormGrp.get('referenceNo1').updateValueAndValidity();
        this.patientDetailsFormGrp.get('bankName1').clearValidators();
        this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
          // Optionally revalidate the whole form
        this.patientDetailsFormGrp.updateValueAndValidity(); 
      }
      else {
        this.patientDetailsFormGrp.get('bankName1').clearValidators();
        this.patientDetailsFormGrp.get('bankName1').updateValueAndValidity();
      }
    }
    this.patientDetailsFormGrp.markAllAsTouched();
    this.patientDetailsFormGrp.updateValueAndValidity();
  }

    get f(): { [key: string]: AbstractControl } {
        return this.patientDetailsFormGrp.controls;
    }
    IsAllowAdd() {
        return this.netPayAmt > ((this.paidAmt || 0) + Number(this.amount1));
    }
    GetBalanceAmt() { 
        debugger
        this.IsMoreAmt = Number(this.netPayAmt || 0) - (Number(this.paidAmt || 0) + Number(this.amount1 || 0)) < 0;
        this.balanceAmt = Number(this.netPayAmt || 0) - ((Number(this.paidAmt || 0) + Number(this.amount1 || 0)));
           if (this.balanceAmt < 0) {
            this.toastr.warning('Balance amt should not be nagative', 'warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            })
            this.amount1 = 0
            this.setPaidAmount();
            this.GetBalanceAmt()
            return;
        }
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
        if (this.patientDetailsFormGrp.invalid) {
            return;
        }
        const isDuplicate = this.Payments.data.some(item => item?.PaymentType === this.selectedPaymnet1 &&
              item.RefNo?.trim().toLowerCase() === this.patientDetailsFormGrp.get("referenceNo1")?.value?.trim().toLowerCase() &&
              item.BankName?.trim().toLowerCase() === this.BankNam?.trim().toLowerCase() &&
              Number(item.Amount) === Number(this.amount1)
            );  
          if (isDuplicate) {
          Swal.fire('Already record added with same details');
          return;
        } 

        let tmp = this.Payments.data;
        tmp.push({
            Id: this.getNewId(),
            PaymentType: this.selectedPaymnet1, Amount: this.amount1,
            RefNo: this.patientDetailsFormGrp.get("referenceNo1")?.value ?? "",
            BankId: this.BankId,
            BankName: this.BankNam,
            RegDate: this.patientDetailsFormGrp.get("regDate1")?.value ?? "",
            AdvanceID:0,
            AdvUsedAmt:0

        });
        this.Payments.data = tmp;
        this.setPaidAmount();
        this.patientDetailsFormGrp.get('balanceAmountController').setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("referenceNo1").setValue('');
        this.patientDetailsFormGrp.get("bankName1").setValue(null);
        this.patientDetailsFormGrp.get("amount1").setValue(this.balanceAmt);
        this.patientDetailsFormGrp.get("paymentType1").setValue(null);  
        this.BankNam = ''; 
        this.BankId = 0;
        this.BindPaymentTypes();
        this.GetBalanceAmt();

    }
    setPaidAmount() { 
        debugger
        this.paidAmt = this.Payments.data.reduce(function (a, b) { return a + Number(b['Amount']); }, 0);
    }
    onKeyAdv(a, b) {
        a.usedAmount = Number(b.target.value);
        this.SetAdvanceRow();
        this.setPaidAmount();
        this.GetBalanceAmt();
        this.getAdvanceAmt(a, b);
    }
    AdvanceId: any = 0;
    selectedRow: any = [];
    filteredadvlist:any =[];
    getAdvanceAmt(element, index) {
        this.filteredadvlist = this.selectedRow.filter(item => item.advanceDetailID == element.advanceDetailID)
        const balAmt = this.filteredadvlist[0]?.balanceAmount
        if (element.usedAmount > balAmt) {
            Swal.fire('Enter Amount less than Balance Amount:' + element.balanceAmount);
            element.usedAmount = '';
            element.balanceAmount = balAmt;
            element.usedAmount = '';
        }
        else if (element.usedAmount > 0) {
            element.balanceAmount = balAmt - element.usedAmount
        } else if (element.usedAmount == '' || element.usedAmount == null || element.usedAmount == undefined || element.usedAmount == '0') {
            element.usedAmount = '';
            element.balanceAmount = balAmt;
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

    dataSource = new MatTableDataSource<IpdAdvanceBrowseModel>();
    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<OpPaymentVimalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private opService: OPSearhlistService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _IpSearchListService: IPSearchListService,
    ) {
        this.patientDetailsFormGrp = this.createForm();
        this.nowDate = new Date();
        if (data) {
            this.advanceData = this.data.vPatientHeaderObj;
            this.patientDetailsFormGrp.get('paymentType1')?.setValue('CASH')
            this.selectedPaymnet1 = 'CASH'
            console.log(this.advanceData)
        }
        //IP bill
        if (this.data.FromName == "IP-Bill") {
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
        }
        //Ip-Settlemet
        if (this.data.FromName == "IP-SETTLEMENT") {
            this.netPayAmt = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.amount1 = parseInt(this.advanceData.NetPayAmount) || this.advanceData.NetPayableAmt;
            this.PatientName = this.advanceData.PatientName;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.DoctorName;
            this.Date = this.advanceData.Date;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName; 
        }
        //IP-Pharmacy-Settlemet 
        if (this.data.FromName == "IP-Pharma-SETTLEMENT") {
            this.netPayAmt = this.advanceData.NetPayAmount;
            this.amount1 = this.advanceData.NetPayAmount;
            this.paidAmt = this.advanceData.NetPayAmount;
            this.PatientName = this.advanceData.PatientName; 
            this.Date = this.advanceData.Date;
            this.RegNo = this.advanceData.RegNo;
            this.DoctorName = this.advanceData.DoctorName;
            this.Age = this.advanceData.Age;
            this.OPD_IPD_Id = this.advanceData.OPD_IPD_Id;
            this.DepartmentName = this.advanceData.DepartmentName;
        }
        this.getAdvcanceDetails(false);
    }

    ngOnInit(): void {
        // this.patientDetailsFormGrp = this.createForm();
        //Advance Calculation need balAmt
        var vdata = {
            "first": 0,
            "rows": 10,
            "sortField": "AdmissionID",
            "sortOrder": 0,
            "filters": [{"fieldName": "AdmissionID","fieldValue": String(this.advanceData.OPD_IPD_Id), "opType": "Equals"}],
            "Columns": [],
            "exportType": "JSON"
        }
        if(this.data.FromName == "IP-Pharma-SETTLEMENT"){
        this.opService.AdvancePharamcylist(vdata).subscribe((response) => {
            this.selectedRow = response.data;
        });
        }else{ 
        this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
             this.selectedRow = response.data;
        });
        } 
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
            balanceAmountController: [this.balanceAmt],
            CompanyId:[0]
        });
    }
    onClose() {
        this.dialogRef.close();
    }
      OnCheckFormValidity(): number {
    this.patientDetailsFormGrp.markAllAsTouched();
    this.patientDetailsFormGrp.updateValueAndValidity();

    if (this.patientDetailsFormGrp.invalid && this.amount1 != 0) {

      let invalidFields = [];
      if (this.patientDetailsFormGrp.invalid) {
        for (const controlName in this.patientDetailsFormGrp.controls) {
          const control = this.patientDetailsFormGrp.get(controlName);
          if (control?.invalid) {
            invalidFields.push(`Payment From: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
          );
        });
        return 0
      }
    }
    return 1;
  }
    Paymentobj = {};
    RemainingAmt: any = [];
    ModePaymentObj:any =[];
    onSubmit() {
        debugger
        let transactionType = 0;
        let opdipdtype = 1;
        let result = this.OnCheckFormValidity(); 
        this.onAddPayment();
         if (result === 0) return; // stop execution if invalid
        if (this.data.FromName != "IP-Bill" && this.data.FromName != "IP-SETTLEMENT") {
            if (this.patientDetailsFormGrp.get('balanceAmountController').value != 0) {
                Swal.fire({
                    title: 'Balance Amount is : ' + this.balanceAmt,
                    text: "Please pay remaing amount",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok"
                }).then((result) => {
                })
                return
            }
            if (this.amount1 != 0) {
                let balamt = this.netPayAmt - this.paidAmt
                Swal.fire({
                    title: 'Balance Amount is : ' + balamt,
                    text: "select payment mode and pay remaing amount",
                    icon: "warning",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "Ok"
                }).then((result) => {
                })
                return
            }
        }
        if (this.data.FromName == "IP-SETTLEMENT") {
            this.Paymentobj['paymentId'] = 0;
            this.Paymentobj['billNo'] = this.advanceData.BillNo || 0;
            this.Paymentobj['paymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['paymentTime'] = this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['cashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CASH")?.Amount ?? 0;
            this.Paymentobj['chequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.Amount ?? 0;
            this.Paymentobj['chequeNo'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.RefNo ?? "0";
            this.Paymentobj['bankName'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.BankName ?? "";
            this.Paymentobj['chequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['cardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.Amount ?? 0;
            this.Paymentobj['cardNo'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.RefNo ?? "0";
            this.Paymentobj['cardBankName'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.BankName ?? "";
            this.Paymentobj['cardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['advanceUsedAmount'] = this.advanceUsedAmt || 0;
            this.Paymentobj['advanceId'] = this.AdvanceId || 0;
            this.Paymentobj['refundId'] = 0;
            this.Paymentobj['transactionType'] = 0;
            this.Paymentobj['remark'] = '';
            this.Paymentobj['addBy'] = this._loggedService.currentUserValue.userId,
            this.Paymentobj['isCancelled'] = false;
            this.Paymentobj['isCancelledBy'] = 0;
            this.Paymentobj['isCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['opdipdType'] = 1;
            this.Paymentobj['neftpayAmount'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.Amount ?? 0;
            this.Paymentobj['neftno'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.RefNo ?? "0";
            this.Paymentobj['neftbankMaster'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.BankName ?? "";
            this.Paymentobj['neftdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['payTmamount'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.Amount ?? 0;
            this.Paymentobj['payTmtranNo'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.RefNo ?? "0";
            this.Paymentobj['payTmdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['tdsAmount'] = this.Payments.data.find(x => x.PaymentType == "TDS")?.Amount ?? 0; 
            this.Paymentobj['unitId'] = this._loggedService.currentUserValue.user.unitId
            this.Paymentobj['wfamount'] = this.Payments.data.find(x => x.PaymentType == "WF")?.Amount ?? 0; 
            this.Paymentobj['companyId'] = this.patientDetailsFormGrp.get('CompanyId')?.value || 0
        }
        else if (this.data.FromName == "IP-Pharma-SETTLEMENT") {
            this.Paymentobj['paymentId'] = 0;
            this.Paymentobj['billNo'] = this.advanceData.BillNo || 0;
            this.Paymentobj['paymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['paymentTime'] = this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['cashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CASH")?.Amount ?? 0;
            this.Paymentobj['chequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.Amount ?? 0;
            this.Paymentobj['chequeNo'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.RefNo ?? "0";
            this.Paymentobj['bankName'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.BankName ?? "";
            this.Paymentobj['chequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['cardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.Amount ?? 0;
            this.Paymentobj['cardNo'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.RefNo ?? "0";
            this.Paymentobj['cardBankName'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.BankName ?? "";
            this.Paymentobj['cardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['advanceUsedAmount'] = this.advanceUsedAmt || 0;
            this.Paymentobj['advanceId'] = this.AdvanceId || 0;
            this.Paymentobj['refundId'] = 0;
            this.Paymentobj['transactionType'] = 4;
            this.Paymentobj['remark'] = '';
            this.Paymentobj['addBy'] = this._loggedService.currentUserValue.userId,
            this.Paymentobj['isCancelled'] = false;
            this.Paymentobj['isCancelledBy'] = 0;
            this.Paymentobj['isCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['opdipdType'] = 3;
            this.Paymentobj['neftpayAmount'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.Amount ?? 0;
            this.Paymentobj['neftno'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.RefNo ?? "0";
            this.Paymentobj['neftbankMaster'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.BankName ?? "";
            this.Paymentobj['neftdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['payTmamount'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.Amount ?? 0;
            this.Paymentobj['payTmtranNo'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.RefNo ?? "0";
            this.Paymentobj['payTmdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['tdsamount'] = this.Payments.data.find(x => x.PaymentType == "TDS")?.Amount ?? 0; 
            this.Paymentobj['unitId'] = this._loggedService.currentUserValue.user.unitId
            this.Paymentobj['wfamount'] = this.Payments.data.find(x => x.PaymentType == "WF")?.Amount ?? 0; 
        }
        else if (this.data.FromName == "IP-Bill") {
            transactionType = 0
            this.Paymentobj['billNo'] = 0;
            this.Paymentobj['receiptNo'] = '0';
            this.Paymentobj['paymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['paymentTime'] = this.dateTimeObj.time; // this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
            this.Paymentobj['cashPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CASH")?.Amount ?? 0;
            this.Paymentobj['chequePayAmount'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.Amount ?? 0;
            this.Paymentobj['chequeNo'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.RefNo ?? "0";
            this.Paymentobj['bankName'] = this.Payments.data.find(x => x.PaymentType == "CHEQUE")?.BankName ?? "";
            this.Paymentobj['chequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['cardPayAmount'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.Amount ?? 0;
            this.Paymentobj['cardNo'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.RefNo ?? "0";
            this.Paymentobj['cardBankName'] = this.Payments.data.find(x => x.PaymentType == "CARD")?.BankName ?? "";
            this.Paymentobj['cardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['advanceUsedAmount'] = this.advanceUsedAmt || 0;
            this.Paymentobj['advanceId'] = this.AdvanceId || 0;
            this.Paymentobj['refundId'] = 0;
            this.Paymentobj['transactionType'] = 0;
            this.Paymentobj['remark'] = '';
            this.Paymentobj['addBy'] = this._loggedService.currentUserValue.userId,
                this.Paymentobj['isCancelled'] = false;
            this.Paymentobj['isCancelledBy'] = 0;
            this.Paymentobj['isCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['neftpayAmount'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.Amount ?? 0;
            this.Paymentobj['neftno'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.RefNo ?? "0";
            this.Paymentobj['neftbankMaster'] = this.Payments.data.find(x => x.PaymentType == "NET BANKING")?.BankName ?? "";
            this.Paymentobj['neftdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['payTmamount'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.Amount ?? 0;
            this.Paymentobj['payTmtranNo'] = this.Payments.data.find(x => x.PaymentType == "UPI")?.RefNo ?? "0";
            this.Paymentobj['payTmdate'] = this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01';
            this.Paymentobj['tdsAmount'] = this.Payments.data.find(x => x.PaymentType == "TDS")?.Amount ?? 0; 
            this.Paymentobj['unitId'] = this._loggedService.currentUserValue.user.unitId
            this.Paymentobj['wfAmount'] = this.Payments.data.find(x => x.PaymentType == "WF")?.Amount ?? 0; 
        }
          this.Payments.data.forEach(element => {
        this.ModePaymentObj.push({
          paymentId: 0,
          unitId: this._loggedService.currentUserValue.user.unitId,
          billNo: this.advanceData?.BillNo || 0,
          opdipdtype:  opdipdtype || 1,
          paymentDate: this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd') || '1999-01-01',
          paymentTime: this.dateTimeObj.time,
          payAmount: element.Amount ?? 0,
          tranNo: element.RefNo ?? "",
          bankName: element.BankName ?? "",
          validationDate: this.datePipe.transform(element.RegDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd'),
          advanceUsedAmount:element.AdvUsedAmt || 0,
          comments: "",
          payMode: element.PaymentType ?? "",
          onlineTranNo: '0',
          onlineTranResponse: '0',
          companyId: this.patientDetailsFormGrp.get('CompanyId')?.value || 0,
          advanceId:  element.AdvanceID || 0,
          refundId: 0,
          cashCounterId: this.advanceData?.CashCounterId || 0,
          transactionType: transactionType,
          isSelfOrcompany: this.advanceData?.CompanyId ? 1 : 0,
          tranMode: "HOSP",
          createdBy: this._loggedService.currentUserValue?.userId ?? 0,
          transactionLabel:this.advanceData?.TransactionLabel || 0,
        });
      });
        console.log(JSON.stringify(this.Paymentobj));

        let submitDataPay = {
            ipPaymentInsert: this.Paymentobj,
            ipModePaymentInsert:this.ModePaymentObj
        };
        let IsSubmit
        if (this.data.FromName == "IP-SETTLEMENT" || this.data.FromName == "IP-Pharma-SETTLEMENT" || this.data.FromName == "IP-Bill") {
            let Advancesarr = [];
            this.dataSource.data.forEach((element) => {
                let Advanceobj = {};
                Advanceobj['AdvanceId'] = element?.advanceId;
                Advanceobj['AdvanceDetailID'] = (element?.advanceDetailId ?? element?.advanceDetailID) || 0;
                Advanceobj['AdvanceAmount'] = element?.advanceAmount || 0;
                Advanceobj['UsedAmount'] = element?.usedAmount || 0;
                Advanceobj['Date'] = element?.date;
                Advanceobj['BalanceAmount'] = element?.balanceAmount || 0;
                Advanceobj['RefundAmount'] = element?.refundAmount || 0;
                Advancesarr.push(Advanceobj);
            });
             let balamt = 0; 
            if(this.data.FromName == "IP-Bill" || this.data.FromName == "IP-SETTLEMENT"){
                if(this.patientDetailsFormGrp.get('balanceAmountController')?.value > 0){
                balamt = this.patientDetailsFormGrp.get('balanceAmountController')?.value || 0;
                }else{ 
                balamt = this.amount1 || 0;
                } 
            }else{
               balamt = this.patientDetailsFormGrp.get('balanceAmountController')?.value || 0;
            }
            IsSubmit = {
                "submitDataPay": submitDataPay,
                "submitDataAdvancePay": Advancesarr,
                "PaidAmt": this.paidAmt, // this.patientDetailsFormGrp.get('paidAmountController').value,
                "BalAmt":balamt, // this.patientDetailsFormGrp.get('balanceAmountController').value,
                "IsSubmitFlag": true,
            }
        } else {
            IsSubmit = {
                "submitDataPay": submitDataPay,
                "IsSubmitFlag": true
            }
        }
        console.log(IsSubmit);
        this.dialogRef.close(IsSubmit);
        this.advanceData =null
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
    selectedAdvanceData: any = [];
    getAdvcanceDetails(isReset?: any) {
        this.dataSource.data = [];
        var vdata = {  
             "first": 0,
            "rows": 10,
            "sortField": "AdmissionID",
            "sortOrder": 0,
            "filters": [{"fieldName": "AdmissionID","fieldValue": String(this.advanceData.OPD_IPD_Id), "opType": "Equals"}],
            "Columns": [],
            "exportType": "JSON"
        } 
        setTimeout(() => {
        if(this.data.FromName == "IP-Pharma-SETTLEMENT"){
        this.opService.AdvancePharamcylist(vdata).subscribe((response) => { 
                this.dataSource.data = response.data; 
                    this.IsAdv = true 
                    this.AdvanceId = this.dataSource?.data[0]?.advanceId || 0;
                    this.calculateBalance(); 
                    this.SetAdvanceRow();
                    this.setPaidAmount();
                    this.GetBalanceAmt(); 
        });
        }else{ 
        this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => { 
                this.dataSource.data = response.data; 
                    this.IsAdv = true 
                    this.AdvanceId = this.dataSource?.data[0]?.advanceId || 0
                    this.calculateBalance(); 
                    this.SetAdvanceRow();
                    this.setPaidAmount();
                    this.GetBalanceAmt(); 
        });
        }  
        }, 500);
    }
    OnAdvAmt(e) {
        this.IsAdv = e.checked;
        if (this.IsAdv) {
            var vdata = {
                "first": 0,
                "rows": 10,
                "sortField": "AdmissionID",
                "sortOrder": 0,
                "filters": [{ "fieldName": "AdmissionID", "fieldValue": String(this.advanceData.OPD_IPD_Id), "opType": "Equals" }],
                "Columns": [],
                "exportType": "JSON"
            }
            setTimeout(() => {
                if (this.data.FromName == "IP-Pharma-SETTLEMENT") {
                    this.opService.AdvancePharamcylist(vdata).subscribe((response) => {
                        this.dataSource.data = response.data;
                        this.AdvanceId = this.dataSource?.data[0]?.advanceId || 0;
                        this.calculateBalance(); 
                        this.SetAdvanceRow();
                        this.setPaidAmount();
                        this.GetBalanceAmt();
                    });
                } else {
                    this._IpSearchListService.AdvanceHeaderlist(vdata).subscribe((response) => {
                        console.log(response)
                        this.dataSource.data = response.data;
                        this.AdvanceId = this.dataSource?.data[0]?.advanceId || 0
                        this.calculateBalance(); 
                        this.SetAdvanceRow();
                        this.setPaidAmount();
                        this.GetBalanceAmt();
                    });
                }
            }, 500);
        } else {
            this.Payments.data = [];
            this.dataSource.data = [];
            this.amount1 = this.netPayAmt;
            this.setPaidAmount();
            this.GetBalanceAmt();
        }
    }
    advanceUsedAmt: any = 0;
    calculateBalance() { 
        debugger
        if (this.dataSource.data && this.dataSource.data.length > 0) {
            let totalAdvanceAmt = 0;
            let netAmtLocal = this.netPayAmt;
            this.dataSource.data.forEach(element => {
                if (netAmtLocal > element.balanceAmount) {
                    element.usedAmount = element.balanceAmount;
                    element.balanceAmount = element.balanceAmount - element.usedAmount;
                    netAmtLocal = netAmtLocal - element.usedAmount;
                } else if (netAmtLocal <= element.balanceAmount) {
                    element.balanceAmount = element.balanceAmount - netAmtLocal;
                    element.usedAmount = netAmtLocal;
                    netAmtLocal = netAmtLocal - element.usedAmount;
                }
                totalAdvanceAmt += element.usedAmount;
            });
        }
    }
    getAdvanceSum(element) {
        let netAmt;
        netAmt = element.reduce((sum, { usedAmount }) => sum += +(usedAmount || 0), 0);
        this.advanceUsedAmt = netAmt;
        return netAmt
    }
    SetAdvanceRow() {
        let adv = this.dataSource.data.reduce(function (a, b) { return a + Number(b['usedAmount']); }, 0);
        let tmp = this.Payments.data.find(x => x.Id == -1);
        if (tmp) {
            tmp.Amount = adv;
            tmp.AdvUsedAmt = adv;
        }
        else {
            let tmp1 = this.Payments.data;
            tmp1.push({
                Id: -1,
                PaymentType: "ADVANCE_USED", Amount: adv,
                RefNo: "",
                BankId: 0,
                BankName: "",
                RegDate: new Date(),
                AdvanceID:this.AdvanceId || 0,
                AdvUsedAmt:adv
            });
            this.Payments.data = tmp1;
        }
        this.amount1 = 0;
    }
    BankId = 0
    BankNam: any;
    selectChangebank(event) {
        this.BankId = event.value
        this.BankNam = event.text
    }
    getValidationMessages() {
        return {
            bankName1: [
                { name: "required", Message: "bankName is required" }
            ],
            consultantDocId: [
                { name: "required", Message: "Doctor Name is required" }
            ],
              CompanyId: [
                { name: "required", Message: "Company is required" }
            ],
             paymentType1: [
                { name: "required", Message: "Payment Mode is required" }
            ],
        };
    }
        onChangeCompany(value) {
            console.log(value) 
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
    AdvanceID:any;
    AdvUsedAmt:any;
}