import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReportPrintObj } from '../../ip-bill-browse-list/ip-bill-browse-list.component';
import { Subscription } from 'rxjs';
import { ChargesList } from '../ip-search-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { IPSearchListService } from '../ip-search-list.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../../advance';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-advance-payment/ip-advance-payment.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import * as converter from 'number-to-words';
import { PrintPreviewService } from 'app/main/shared/services/print-preview.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { Cal_DiscAmount } from '../ip-billing/ip-billing.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-interim-bill',
  templateUrl: './interim-bill.component.html',
  styleUrls: ['./interim-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class InterimBillComponent implements OnInit {

  screenFromString = 'IP-billing';
  totalCount: any;
  netAmount: number = 0;
  netbillamt: number = 0;
  interimArray: any = [];
  isLoading: String = '';
  dateTimeObj: any;
  InterimFormGroup: FormGroup;
  BillNo: number;
  NetBillAmount: number;
  TotalRefundAmount: number;
  RefundBalAmount: number;
  BillDate: Date;
  RefundAmount: number;
  Remark: string;
  totalAmtOfNetAmt: any;
  netPaybleAmt: any = 0;
  ConcessionId: any;
  BalanceAmt: any;
  selectedAdvanceObj: Bill;
  vPatientHeaderObj: Bill;
  reportPrintObj: ReportPrintObj;
  reportPrintObjList: ReportPrintObj[] = [];
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  currentDate = new Date();

  vTotalBillAmt: any = 0;
  vDiscountAmt: any = 0;
  vNetAmount: any = 0;
  vUPINO: any;
  disamt: any;
  b_price = '0';
  b_qty = '1';
  b_totalAmount = '0';
  b_netAmount = '0';
  FinalAmountpay = 0;
  b_disAmount = 0;
  formDiscPersc: any;

  Consession: boolean = true;
  percentag: boolean = true;
  ConShow: boolean = false;
  onlineflag: boolean = false;


  CashCounterList: any = [];
  ConcessionReasonList: any = [];
  displayedColumns = [

    'ChargesDate',
    'ServiceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DiscPer',
    'DiscAmt',
    'NetAmount',
    'ChargeDoctorName',
    'ClassName',

  ];


  dataSource = new MatTableDataSource<ChargesList>();


  constructor(
    public _IpSearchListService: IPSearchListService,
    public _printpreview: PrintPreviewService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<InterimBillComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.InterimFormGroup = this.InterimForm();
    if (data) {
      console.log(data);
      this.interimArray = data;
      this.totalCount = data.length;
      data.filter(element => {
        this.netAmount = this.netAmount + parseInt(element.NetAmount);
      });


      if (this.advanceDataStored.storage) {
        this.selectedAdvanceObj = this.advanceDataStored.storage;
        console.log(this.selectedAdvanceObj)
        // this.PatientHeaderObj = this.advanceDataStored.storage;
      }
    }
  }

  ngOnInit(): void {
    this.dataSource.data = [];
    this.dataSource.data = this.interimArray;
    // console.log( this.dataSource.data);

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      // this.vPatientHeaderObj =this.advanceDataStored.storage;
      // this.ConcessionId=this.selectedAdvanceObj.concessionReasonId
      // console.log(this.selectedAdvanceObj);
    }

    this.getCashCounterComboList();
    this.getConcessionReasonList();
  }

  InterimForm(): FormGroup {
    return this.formBuilder.group({
      NetpayAmount: [Validators.pattern("^[0-9]*$")],
      TotalRefundAmount: [Validators.pattern("^[0-9]*$")],
      ConcessionId: [''],
      Remark: [''],
      // price: [Validators.required, Validators.pattern("^[0-9]*$")],
      // qty: [Validators.required, Validators.pattern("^[0-9]*$")],
      TotalAmount: [Validators.pattern("^[0-9]*$")],
      doctorId: [''],
      DoctorID: [''],
      discPer: [Validators.pattern("^[0-9]*$")],
      paidAmt: [''],
      discAmt: [Validators.pattern("^[0-9]*$")],
      balanceAmt: [''],
      netAmount: [''],
      // totalAmount: [Validators.required, Validators.pattern("^[0-9]*$")],
      discAmount: [''],
      BillDate: [''],
      BillRemark: [''],
      SrvcName: [''],
      TotalAmt: [0],
      concessionId: [0],
      FinalAmount: [0],
      ClassId: [],
      Percentage: [Validators.pattern("^[0-9]*$")],
      AdminCharges: [0],
      Amount: [Validators.pattern("^[0-9]*$")],
      concessionAmt: [''],
      GenerateBill: ['0'],
      CashCounterId: 0,
      paymode: ['cashpay'],
      UPINO: ['']
    });
  }

  getNetAmtSum(element) {
    let netAmt;
    netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    this.vTotalBillAmt = netAmt;
    this.vNetAmount = netAmt;
    return netAmt;
  }

  getCashCounterComboList() {
    this._IpSearchListService.getCashcounterList().subscribe(data => {
      this.CashCounterList = data
    });
  }

  // getNetAmount() {
  //   this.vNetAmount = this.vTotalBillAmt - this.vDiscountAmt
  //   this.InterimFormGroup.get('NetpayAmount').setValue(this.vNetAmount);
  // }

  getConcessionReasonList() {
    this._IpSearchListService.getConcessionCombo().subscribe(data => {
      this.ConcessionReasonList = data;
      // this.Ipbillform.get('ConcessionId').setValue(this.ConcessionReasonList[1]);
    })
  }

  public setFocus(nextElementId): void {
    document.querySelector<HTMLInputElement>(`#${nextElementId}`)?.focus();
  }

  // 183224

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }


  onChangeReg(event) {
    debugger
    if (event.value == 'onlinepay') {
      this.onlineflag = true;

      this.InterimFormGroup.get('UPINO').setValidators([Validators.required]);
      this.InterimFormGroup.get('UPINO').enable();
      this.InterimFormGroup.get('DoctorID').updateValueAndValidity();
    } else {
      this.onlineflag = false;
      this.InterimFormGroup.get('UPINO').reset();
      this.InterimFormGroup.get('UPINO').clearValidators();
      this.InterimFormGroup.get('UPINO').updateValueAndValidity();
    }
  }
  vConcessionId: any = 0
  vconflag: boolean = true;
  onSave() {

    if (this.formDiscPersc > 0 || this.b_disAmount > 0) {
      if (this.vConcessionId == 0) {
        this.toastr.warning('Please Enter ConcessionReason.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      else {
        this.vConcessionId = this.InterimFormGroup.get('ConcessionId').value.ConcessionId
        this.vconflag == true;
      }
    }

    if (this.vconflag) {
      this.isLoading = 'submit';
      let interimBillChargesobj = {};
      interimBillChargesobj['chargesID'] = 0// this.ChargesId;

      let insertBillUpdateBillNo1obj = {};
      insertBillUpdateBillNo1obj['billNo'] = 0;
      insertBillUpdateBillNo1obj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID;
      insertBillUpdateBillNo1obj['totalAmt'] = this.InterimFormGroup.get('TotalAmt').value //this.netAmount;
      insertBillUpdateBillNo1obj['concessionAmt'] = this.InterimFormGroup.get('concessionAmt').value || this.b_disAmount,
        insertBillUpdateBillNo1obj['netPayableAmt'] = this.InterimFormGroup.get('NetpayAmount').value, // this.netAmount;
        insertBillUpdateBillNo1obj['paidAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0,//this.advanceAmount;
        insertBillUpdateBillNo1obj['balanceAmt'] = 0;
      insertBillUpdateBillNo1obj['billDate'] = this.dateTimeObj.date;
      insertBillUpdateBillNo1obj['opD_IPD_Type'] = 1,
        insertBillUpdateBillNo1obj['AddedBy'] = this.accountService.currentUserValue.user.id;
      insertBillUpdateBillNo1obj['totalAdvanceAmount'] = 0;
      insertBillUpdateBillNo1obj['billTime'] = this.dateTimeObj.date;
      insertBillUpdateBillNo1obj['concessionReasonId'] = this.vConcessionId || 0,
        insertBillUpdateBillNo1obj['isSettled'] = 0,
        insertBillUpdateBillNo1obj['isPrinted'] = 1,
        insertBillUpdateBillNo1obj['isFree'] = 0,//this.advanceAmount;
        insertBillUpdateBillNo1obj['companyId'] = this.selectedAdvanceObj.companyId || 0,
        insertBillUpdateBillNo1obj['tariffId'] = this.selectedAdvanceObj.tariffId || 0,
        insertBillUpdateBillNo1obj['unitId'] = this.selectedAdvanceObj.unitId || 0;
      insertBillUpdateBillNo1obj['interimOrFinal'] = 1,
        insertBillUpdateBillNo1obj['companyRefNo'] = 0;
      insertBillUpdateBillNo1obj['concessionAuthorizationName'] = 0;
      insertBillUpdateBillNo1obj['taxPer'] = this.InterimFormGroup.get('Percentage').value || 0,
        insertBillUpdateBillNo1obj['taxAmount'] = this.InterimFormGroup.get('Amount').value || 0,
        insertBillUpdateBillNo1obj['DiscComments'] = this.InterimFormGroup.get('Remark').value || ''
      insertBillUpdateBillNo1obj['CashCounterId'] = this.InterimFormGroup.get('CashCounterId').value.CashCounterId || 0
      // insertBillUpdateBillNo1obj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || ''
      let billDetailsInsert = [];

      this.dataSource.data.forEach((element) => {
        let billDetailsInsert1Obj = {};

        billDetailsInsert1Obj['billNo'] = 0;
        billDetailsInsert1Obj['chargesId'] = element.ChargesId;

        billDetailsInsert.push(billDetailsInsert1Obj);
      });

      // let PatientHeaderObj = {};
      // PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
      // PatientHeaderObj['Date'] = this.dateTimeObj.date;
      // PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID || 0; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
      // PatientHeaderObj['NetPayAmount'] = this.netAmount;

      const interimBillCharge = new interimBill(interimBillChargesobj);
      const insertBillUpdateBillNo1 = new Bill(insertBillUpdateBillNo1obj);



      let Paymentobj = {};
      Paymentobj['BillNo'] = 0;
      Paymentobj['ReceiptNo'] = "";
      Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
        Paymentobj['CashPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0;
      Paymentobj['ChequePayAmount'] = 0;
      Paymentobj['ChequeNo'] = 0;
      Paymentobj['BankName'] = "";
      Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['CardPayAmount'] = 0;
      Paymentobj['CardNo'] = 0;
      Paymentobj['CardBankName'] = "";
      Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['AdvanceUsedAmount'] = 0;
      Paymentobj['AdvanceId'] = 0;
      Paymentobj['RefundId'] = 0;
      Paymentobj['TransactionType'] = 0;
      Paymentobj['Remark'] = "Cashpayment";
      Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        Paymentobj['IsCancelled'] = 0;
      Paymentobj['IsCancelledBy'] = 0;
      Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['CashCounterId'] = 0;
      Paymentobj['NEFTPayAmount'] = 0;
      Paymentobj['NEFTNo'] = 0;
      Paymentobj['NEFTBankMaster'] = "";
      Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['PayTMAmount'] = 0;
      Paymentobj['PayTMTranNo'] = 0;
      Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
        Paymentobj['PaidAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0;
      Paymentobj['BalanceAmt'] = 0;
      debugger

      if (this.InterimFormGroup.get('paymode').value != 'credit') {
        debugger
        if (this.InterimFormGroup.get('paymode').value == 'cashpay') {
          Paymentobj['CashPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0;

        }
        else if (this.InterimFormGroup.get('paymode').value == 'onlinepay') {

          if (this.InterimFormGroup.get('paymode').value == 'onlinepay' && this.vUPINO == '') {
            this.toastr.warning('Please Enter UPI No.', 'Warning !', {
              toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
          } else {
            Paymentobj['CashPayAmount'] = 0;
            Paymentobj['PayTMAmount'] = this.InterimFormGroup.get('NetpayAmount').value;

            Paymentobj['PayTMTranNo'] = this.InterimFormGroup.get('UPINO').value;
          }
        }

        const ipPaymentInsert = new IpPaymentInsert(Paymentobj);
        let submitData = {
          "interimBillChargesUpdate": interimBillCharge,
          "insertBillUpdateBillNo1": insertBillUpdateBillNo1,
          "billDetailsInsert1": billDetailsInsert,
          "ipIntremPaymentInsert": ipPaymentInsert,

        };

        console.log(submitData);
        this._IpSearchListService.InsertInterim(submitData).subscribe(response => {
          if (response) {

            if (this.InterimFormGroup.get('paymode').value == 'onlinepay') {
              Swal.fire('Congratulations !', 'Online Pay Interim data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  this.viewgetInterimBillReportPdf(response);

                  this._matDialog.closeAll();
                }
              });
            } else if (this.InterimFormGroup.get('paymode').value == 'cashpay') {
              Swal.fire('Congratulations !', 'Cash Pay Interim data saved Successfully !', 'success').then((result) => {
                if (result.isConfirmed) {
                  this.viewgetInterimBillReportPdf(response);

                  this._matDialog.closeAll();
                }
              });

            }

          } else {
            Swal.fire('Error !', 'Interim data not saved', 'error');
          }
          this.isLoading = '';
        });


      } 
      else {

        insertBillUpdateBillNo1obj['paidAmt'] = 0;
        insertBillUpdateBillNo1obj['balanceAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0;

        let Cal_DiscAmount_IPBillObj = {};
        Cal_DiscAmount_IPBillObj['BillNo'] = 0;

        let AdmissionIPBillingUpdateObj = {};
        AdmissionIPBillingUpdateObj['AdmissionID'] = this.selectedAdvanceObj.AdmissionID;

        const InsertBillUpdateBillNo = new Bill(insertBillUpdateBillNo1obj);
        const Cal_DiscAmount_IPBill = new Cal_DiscAmount(Cal_DiscAmount_IPBillObj);
        const AdmissionIPBillingUpdate = new AdmissionIPBilling(AdmissionIPBillingUpdateObj);
        //
        let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
        // UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
        // console.log(UpdateAdvanceDetailarr1);

        // new
        let UpdateBillBalAmtObj = {};
        UpdateBillBalAmtObj['BillNo'] = 0;
        UpdateBillBalAmtObj['BillBalAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0;


        let UpdateAdvanceDetailarr = [];

        let UpdateAdvanceDetailObj = {};
        UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
          UpdateAdvanceDetailObj['UsedAmount'] = 0,
          UpdateAdvanceDetailObj['BalanceAmount'] = 0,
          UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);

        let UpdateAdvanceHeaderObj = {};
        UpdateAdvanceHeaderObj['AdvanceId'] = 0,
          UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
          UpdateAdvanceHeaderObj['BalanceAmount'] = 0


        let submitData = {
          "insertBillcreditUpdateBillNo": InsertBillUpdateBillNo,
          "billDetailscreditInsert": billDetailsInsert,
          "cal_DiscAmount_IPBillcredit": Cal_DiscAmount_IPBill,
          "admissionIPBillingcreditUpdate": AdmissionIPBillingUpdate,
          "ipBillBalAmountcredit": UpdateBillBalAmtObj,
          "ipAdvanceDetailUpdatecedit": UpdateAdvanceDetailarr,
          "ipAdvanceHeaderUpdatecredit": UpdateAdvanceHeaderObj
        };
        console.log(submitData);
        this._IpSearchListService.InsertIPBillingCredit(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Bill successfully !', 'IP Interim bill Credited successfully !', 'success').then((result) => {
              if (result.isConfirmed) {

                this._matDialog.closeAll();

                this.viewgetInterimBillReportPdf(response);

              }
            });
          } else {
            Swal.fire('Error !', 'IP Interim Billing Credited data not saved', 'error');
          }
          this.isLoading = '';
        });

      }
    }
  }


  //paymentoption
  // onSave() {

  //   this.isLoading = 'submit';
  //   let interimBillChargesobj ={};
  //   interimBillChargesobj['chargesID']= 0// this.ChargesId;
  //   let insertBillUpdateBillNo1obj = {};
  //   insertBillUpdateBillNo1obj['billNo'] =0;
  //   insertBillUpdateBillNo1obj['OPD_IPD_ID'] = this.selectedAdvanceObj.AdmissionID; 
  //   insertBillUpdateBillNo1obj['totalAmt'] = this.InterimFormGroup.get('TotalAmt').value //this.netAmount;
  //   insertBillUpdateBillNo1obj['concessionAmt'] = this.InterimFormGroup.get('concessionAmt').value || this.b_disAmount,
  //   insertBillUpdateBillNo1obj['netPayableAmt'] =  this.InterimFormGroup.get('NetpayAmount').value, // this.netAmount;
  //   insertBillUpdateBillNo1obj['paidAmt'] =this.InterimFormGroup.get('NetpayAmount').value || 0,//this.advanceAmount;
  //   insertBillUpdateBillNo1obj['balanceAmt'] = 0;
  //   insertBillUpdateBillNo1obj['billDate'] = this.dateTimeObj.date;
  //   insertBillUpdateBillNo1obj['opD_IPD_Type'] = 1,
  //   insertBillUpdateBillNo1obj['AddedBy'] =  this.accountService.currentUserValue.user.id ;
  //   insertBillUpdateBillNo1obj['totalAdvanceAmount'] = 0;
  //   insertBillUpdateBillNo1obj['billTime'] = this.dateTimeObj.date;
  //   insertBillUpdateBillNo1obj['concessionReasonId'] = this.InterimFormGroup.get('ConcessionId').value.concessionReasonId || 0,
  //   insertBillUpdateBillNo1obj['isSettled']=0,
  //   insertBillUpdateBillNo1obj['isPrinted'] = 1,
  //   insertBillUpdateBillNo1obj['isFree'] = 0,//this.advanceAmount;
  //   insertBillUpdateBillNo1obj['companyId'] = this.selectedAdvanceObj.companyId || 0,
  //   insertBillUpdateBillNo1obj['tariffId'] = this.selectedAdvanceObj.tariffId ||0,
  //   insertBillUpdateBillNo1obj['unitId'] =this.selectedAdvanceObj.unitId || 0;
  //   insertBillUpdateBillNo1obj['interimOrFinal'] = 1,
  //   insertBillUpdateBillNo1obj['companyRefNo'] = 0;
  //   insertBillUpdateBillNo1obj['concessionAuthorizationName'] =0;
  //   insertBillUpdateBillNo1obj['taxPer'] = this.InterimFormGroup.get('Percentage').value || 0,
  //   insertBillUpdateBillNo1obj['taxAmount'] = this.InterimFormGroup.get('Amount').value || 0,
  //   insertBillUpdateBillNo1obj['DiscComments'] = this.InterimFormGroup.get('Remark').value || ''
  //   insertBillUpdateBillNo1obj['CashCounterId'] = this.InterimFormGroup.get('CashCounterId').value.CashCounterId || 0
  //  // insertBillUpdateBillNo1obj['CompDiscAmt'] = 0//this.InterimFormGroup.get('Remark').value || ''
  //   let billDetailsInsert = [];

  //   this.dataSource.data.forEach((element) => {
  //     let billDetailsInsert1Obj = {};

  //   billDetailsInsert1Obj['billNo'] =0;
  //   billDetailsInsert1Obj['chargesId'] = element.ChargesId;

  //   billDetailsInsert.push(billDetailsInsert1Obj);
  //   });  

  //   let PatientHeaderObj = {};
  //   PatientHeaderObj['PatientName'] = this.selectedAdvanceObj.PatientName;
  //   PatientHeaderObj['Date'] = this.dateTimeObj.date;
  //   PatientHeaderObj['OPD_IPD_Id'] = this.selectedAdvanceObj.AdmissionID || 0; // this._IpSearchListService.myShowAdvanceForm.get("AdmissionID").value;
  //   PatientHeaderObj['NetPayAmount'] = this.netAmount;

  //    const interimBillCharge = new interimBill(interimBillChargesobj);
  //    const insertBillUpdateBillNo1 = new Bill(insertBillUpdateBillNo1obj);
  //    if (!this.InterimFormGroup.get('cashpay').value) {
  //   const dialogRef = this._matDialog.open(IPAdvancePaymentComponent,
  //     {
  //       maxWidth: "85vw",
  //       height: '740px',
  //       width: '100%',
  //       data: {
  //         advanceObj: PatientHeaderObj,
  //         FromName: "IP-Bill"
  //       }
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //         console.log('==============================  Advance Amount ===========');
  //         let submitData = {
  //           "interimBillChargesUpdate": interimBillCharge,
  //           "insertBillUpdateBillNo1": insertBillUpdateBillNo1,
  //           "billDetailsInsert1" :billDetailsInsert,
  //           "ipIntremPaymentInsert": result.submitDataPay.ipPaymentInsert,
  //           // "billIPInterimBillingUpdate":billIPInterimBillingUpdate
  //         };
  //         debugger
  //       console.log(submitData);
  //         this._IpSearchListService.InsertInterim(submitData).subscribe(response => {
  //           if (response) {
  //             Swal.fire('Congratulations !', 'Interim data saved Successfully !', 'success').then((result) => {
  //               if (result.isConfirmed) {

  //              this.viewgetInterimBillReportPdf(response);

  //                 this._matDialog.closeAll();
  //               }
  //             });
  //           } else {
  //             Swal.fire('Error !', 'Interim data not saved', 'error');
  //           }
  //           this.isLoading = '';
  //         });

  //   });
  // }else{

  //   insertBillUpdateBillNo1obj['PaidAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0;



  //   let Paymentobj = {};
  //   Paymentobj['BillNo'] = 0;
  //   Paymentobj['ReceiptNo'] = "";
  //   Paymentobj['PaymentDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['PaymentTime'] = this.dateTimeObj.time || '01/01/1900',
  //     Paymentobj['CashPayAmount'] = this.InterimFormGroup.get('NetpayAmount').value || 0;
  //   Paymentobj['ChequePayAmount'] = 0;
  //   Paymentobj['ChequeNo'] = 0;
  //   Paymentobj['BankName'] = "";
  //   Paymentobj['ChequeDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['CardPayAmount'] = 0;
  //   Paymentobj['CardNo'] = 0;
  //   Paymentobj['CardBankName'] = "";
  //   Paymentobj['CardDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['AdvanceUsedAmount'] = 0;
  //   Paymentobj['AdvanceId'] = 0;
  //   Paymentobj['RefundId'] = 0;
  //   Paymentobj['TransactionType'] = 0;
  //   Paymentobj['Remark'] = "Cashpayment";
  //   Paymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
  //     Paymentobj['IsCancelled'] = 0;
  //   Paymentobj['IsCancelledBy'] = 0;
  //   Paymentobj['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['CashCounterId'] = 0;
  //   Paymentobj['NEFTPayAmount'] = 0;
  //   Paymentobj['NEFTNo'] = 0;
  //   Paymentobj['NEFTBankMaster'] = "";
  //   Paymentobj['NEFTDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['PayTMAmount'] = 0;
  //   Paymentobj['PayTMTranNo'] = 0;
  //   Paymentobj['PayTMDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
  //     Paymentobj['PaidAmt'] = this.InterimFormGroup.get('NetpayAmount').value || 0;
  //   Paymentobj['BalanceAmt'] = 0;

  //   const ipPaymentInsert = new IpPaymentInsert(Paymentobj);


  //     let submitData = {
  //       "interimBillChargesUpdate": interimBillCharge,
  //       "insertBillUpdateBillNo1": insertBillUpdateBillNo1,
  //       "billDetailsInsert1" :billDetailsInsert,
  //       "ipIntremPaymentInsert": ipPaymentInsert,
  //       // "billIPInterimBillingUpdate":billIPInterimBillingUpdate
  //     };
  //   console.log(submitData);
  //     this._IpSearchListService.InsertInterim(submitData).subscribe(response => {
  //       if (response) {
  //         Swal.fire('Congratulations !', 'Interim data CashPay saved Successfully !', 'success').then((result) => {
  //           if (result.isConfirmed) {

  //          this.viewgetInterimBillReportPdf(response);

  //             this._matDialog.closeAll();
  //           }
  //         });
  //       } else {
  //         Swal.fire('Error !', 'Interim data not saved', 'error');
  //       }
  //       this.isLoading = '';
  //     });

  // }
  // }


  calculateTotalAmt() {
    if (this.b_price && this.b_qty) {
      this.b_totalAmount = Math.round(parseInt(this.b_price) * parseInt(this.b_qty)).toString();
      this.b_netAmount = this.b_totalAmount;
      this.calculatePersc();
    }
  }

  calculatePersc() {
    debugger

    if (this.InterimFormGroup.get("discPer").value > 0) {
      let discAmt = Math.round((this.vTotalBillAmt * parseInt(this.formDiscPersc)) / 100);
      this.b_disAmount = discAmt;
      this.vNetAmount = (this.vTotalBillAmt - discAmt).toString();
      this.InterimFormGroup.get('NetpayAmount').setValue(this.vNetAmount);
      this.ConShow = true;
      this.InterimFormGroup.get('ConcessionId').reset();
      this.InterimFormGroup.get('ConcessionId').setValidators([Validators.required]);
      this.InterimFormGroup.get('ConcessionId').enable;
      // this.Consession = false;
    }
    if (this.InterimFormGroup.get("discPer").value == 0 || this.InterimFormGroup.get("discPer").value == '') {
      this.b_disAmount = 0;
      this.vNetAmount = this.vTotalBillAmt;
    }
  }

  calculatechargesDiscamt() {
    // let d = this.Ipbillform.get('discAmount').value;
    this.disamt = this.InterimFormGroup.get('concessionAmt').value;
    let Netamt = parseInt(this.vNetAmount);

    if (parseInt(this.disamt) > 0 && this.disamt < this.b_totalAmount) {
      this.ConShow = true;
      let tot = 0;
      if (Netamt > 0) {
        tot = Netamt - parseInt(this.disamt);
        this.vNetAmount = tot.toString();
        this.InterimFormGroup.get('NetpayAmount').setValue(tot);
      }
      this.InterimFormGroup.get('ConcessionId').reset();
      this.InterimFormGroup.get('ConcessionId').setValidators([Validators.required]);
      this.InterimFormGroup.get('ConcessionId').enable;
      this.Consession = false;
    } else if (this.InterimFormGroup.get('NetpayAmount').value == null) {
      this.InterimFormGroup.get('NetpayAmount').setValue(this.b_totalAmount);
      this.Consession = true;
      this.ConShow = false;
      this.InterimFormGroup.get('ConcessionId').reset();
      this.InterimFormGroup.get('ConcessionId').clearValidators();
      this.InterimFormGroup.get('ConcessionId').updateValueAndValidity();
    }
    if (parseInt(this.disamt) == 0 || parseInt(this.disamt) == null) {
      this.b_disAmount = 0;
      this.vNetAmount = this.vTotalBillAmt;
      this.InterimFormGroup.get('ConcessionId').reset();
      this.InterimFormGroup.get('ConcessionId').clearValidators();
      this.InterimFormGroup.get('ConcessionId').updateValueAndValidity();
    }


  }

  viewgetInterimBillReportPdf(BillNo) {

    this._IpSearchListService.getIpInterimBillReceipt(
      BillNo
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Ip Interim Bill  Viewer"
          }
        });
    });
  }



  getDateTime(dateTimeObj) {

    this.dateTimeObj = dateTimeObj;
  }



  onClose() {
    this.dialogRef.close();
  }
}

export class interimBill {
  chargesId: number;

  constructor(interimBill) {
    {
      this.chargesId = interimBill.chargesId || 0;
    }
  }
}

export class Bill {
  AdmissionID: any;
  billNo: number;
  OPD_IPD_ID: any;
  totalAmt: any;
  concessionAmt: number;
  netPayableAmt: number;
  paidAmt: number;
  balanceAmt: number;
  billDate: Date;
  opD_IPD_Type: any;
  addedBy: number;
  totalAdvanceAmount: any;
  billTime: Date;
  concessionReasonId: any;
  isSettled: boolean;
  isPrinted: boolean;
  isFree: boolean;
  companyId: any;
  tariffId: any;
  unitId: any;
  interimOrFinal: boolean;
  companyRefNo: String;
  concessionAuthorizationName: String;
  taxPer: any;
  taxAmount: any;
  discComments: String;
  CashCounterId: any;
  CompDiscAmt: any;
  PatientName: any;
  constructor(Bill) {
    {
      this.AdmissionID = Bill.AdmissionID || 0;
      this.billNo = Bill.billNo || 0;
      this.OPD_IPD_ID = Bill.OPD_IPD_ID || 0;
      this.totalAmt = Bill.totalAmt || 0;
      this.concessionAmt = Bill.concessionAmt || 0;
      this.netPayableAmt = Bill.netPayableAmt || 0;
      this.paidAmt = Bill.paidAmt || 0;
      this.balanceAmt = Bill.balanceAmt || 0;
      this.billDate = Bill.billDate || '01/01/1900';
      this.opD_IPD_Type = Bill.opD_IPD_Type || 1;
      this.addedBy = Bill.addedBy || 0;
      this.totalAdvanceAmount = Bill.totalAdvanceAmount || 0;
      this.billTime = Bill.billTime || '01/01/1900';
      this.concessionReasonId = Bill.concessionReasonId || 0;
      this.isSettled = Bill.isSettled || true;
      this.isPrinted = Bill.isPrinted || true;
      this.isFree = Bill.isFree || true;
      this.companyId = Bill.companyId || 0;
      this.tariffId = Bill.tariffId || 0;
      this.unitId = Bill.unitId || 0;
      this.interimOrFinal = Bill.interimOrFinal || 0;
      this.companyRefNo = Bill.companyRefNo || 0;
      this.concessionAuthorizationName = Bill.concessionAuthorizationName || 0;
      this.taxPer = Bill.taxPer || 0;
      this.taxAmount = Bill.taxAmount || 0;
      this.discComments = Bill.discComments || '';
      this.CashCounterId = Bill.CashCounterId || 0;
      this.CompDiscAmt = Bill.CompDiscAmt || 0;
      this.PatientName = Bill.PatientName || '';
    }
  }
}

export class billDetails {
  billNo: number;
  chargesID: number;

  constructor(billDetails) {
    {
      this.billNo = billDetails.billNo || 0;
      this.chargesID = billDetails.chargesID || 0;
    }
  }
}


export class AdmissionIPBilling {
  AdmissionID: number;

  constructor(AdmissionIPBilling) {
    {
      this.AdmissionID = AdmissionIPBilling.AdmissionID || 0;

    }
  }
}

