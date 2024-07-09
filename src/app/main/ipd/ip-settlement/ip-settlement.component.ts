import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { Subscription } from 'rxjs';
import { IpBillBrowseList, ReportPrintObj } from '../ip-bill-browse-list/ip-bill-browse-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from '../advance';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { IPSearchListService } from '../ip-search-list/ip-search-list.service';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-search-list/ip-advance-payment/ip-advance-payment.component';
import { BrowseOpdPaymentReceipt } from 'app/main/opd/browse-payment-list/browse-payment-list.component';
import { IPSettlementViewComponent } from './ipsettlement-view/ipsettlement-view.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { IPSettlementService } from './ip-settlement.service';
import { IPpaymentWithadvanceComponent } from './ippayment-withadvance/ippayment-withadvance.component';
import { AdmissionPersonlModel } from '../Admission/admission/admission.component';
import * as converter from 'number-to-words';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { OPAdvancePaymentComponent } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { IpPaymentwithAdvanceComponent } from '../ip-search-list/ip-paymentwith-advance/ip-paymentwith-advance.component';


@Component({
  selector: 'app-ip-settlement',
  templateUrl: './ip-settlement.component.html',
  styleUrls: ['./ip-settlement.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {
  flagSubmit: boolean;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sIsLoading: string = '';
  selectedAdvanceObj: AdvanceDetailObj;
  regId: any;
  screenFromString = 'Ip-Settelment';
  reportPrintObj: ReportPrintObj;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: IpBillBrowseList[] = [];
  currentDate = new Date();
  FinalAmt: any;
  balanceamt: any;
  reportPrintbillObj: ReportPrintObj;
  reportPrintbillObjList: ReportPrintObj[] = [];

  searchFormGroup: FormGroup;
  registerObj = new AdmissionPersonlModel({});
  filteredOptions: any;
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;
  Regdisplay: boolean = false;
  PatientName: any;
  RegId: any;
  isRegIdSelected: boolean = false;
  vAdmissionID: any;
  vCompanyName: any;
  vTariif: any;
  RegNo: any;
  PatientHeaderObj: AdvanceDetailObj;

 
  displayedColumns: string[] = [ 
    'BillDate',
    'BillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'action', 
  ];
  displayedColumns1: string[] = [ 
    'BillDate',
    'BillNo',
    'TotalAmt',
    'ConcessionAmt',
    'NetPayableAmt',
    'PaidAmount',
    'BalanceAmt',
    'action' 
  ];
  dataSource = new MatTableDataSource<PaidBilldetail>();
  dataSource1 = new MatTableDataSource<CreditBilldetail>();
  @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;
  paymentFormGroup: FormGroup; 
  hasSelectedContacts: boolean;

  constructor(
    public _IpSearchListService: IPSettlementService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog, 
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    private formBuilder: FormBuilder, 
    private router: Router) { }

  ngOnInit(): void {
    debugger
    this.clearpatientinfo();
    if (this.advanceDataStored.storage) {

      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj)

      this.PatientHeaderObj = this.selectedAdvanceObj;
      console.log(this.PatientHeaderObj);
      this.vAdmissionID = this.PatientHeaderObj.OPD_IPD_Id;
      this.RegId = this.PatientHeaderObj.RegId;
      this.RegNo = this.PatientHeaderObj.RegNo;
      this.PatientName = this.PatientHeaderObj.PatientName;
      this.AgeYear= this.PatientHeaderObj.PatientAge;
      this.MobileNo= this.PatientHeaderObj.MobileNo;
      this.vCompanyName = this.PatientHeaderObj.CompanyName;
      this.vTariif = this.PatientHeaderObj.TariffName;
      this.getPaidBillDetails();
      this.getCreditBillDetails(); 
    } 
    else{
      this.clearpatientinfo();
    } 
    this.searchFormGroup = this.createSearchForm();
    this.Regdisplay = true; 

    this.searchFormGroup.get('RegId').enable();
    this.isRegSearchDisabled = false; 
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }], 
    });
  } 
  createForm() {
    this.paymentFormGroup = this.formBuilder.group({ 
      IsCompany: [0] 
    });
  }

  AgeYear:any;
  AgeDay:any;
  GenderName:any;
  AgeMonth:any;
  MobileNo:any; 
  getSelectedObj(obj) {
    console.log(obj)
    this.registerObj = obj; 
    this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
    this.RegId = obj.RegId;  
    this.vAdmissionID = obj.AdmissionID;
    this.RegNo = obj.RegNo;
    this.AgeYear = obj.AgeYear; 
    this.AgeDay = obj.AgeDay;
    this.AgeMonth = obj.AgeMonth;
   this.GenderName = obj.GenderName;
   this.MobileNo = obj.MobileNo; 
    this.getPaidBillDetails();
    this.getCreditBillDetails(); 
  }
 
  getSearchList() { 
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._IpSearchListService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    } 
  } 
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' ' + option.LastName ; 
  }
  clearpatientinfo(){
    this.PatientName = '';
    this.RegId =  '';
    this.vAdmissionID = '';
    this.RegNo = '';
    this.AgeYear = '' ;
    this.AgeDay = '';
    this.AgeMonth = '';
   this.GenderName = '';
   this.MobileNo = ''; 
  }
  

  onChangeReg(event) {
    if (event.value == 'registration') {
      //   this.personalFormGroup.get('RegId').reset();
      //   this.personalFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = true;
      this.registerObj = new AdmissionPersonlModel({});  
    } else {
      this.Regdisplay = true;

      this.searchFormGroup.get('RegId').enable();
      this.isRegSearchDisabled = false;  
    }
 
  }

  SpinLoading: boolean = false; 
  getPaidBillDetails() { 
    this.sIsLoading = 'loading-data'; 
    this.regId = this.RegId; 
    let query = "Select * from lvwBillIPD  where RegID=" + this.regId + " and BalanceAmt=0"; 

    this._IpSearchListService.getPaidBillList(query).subscribe(Visit => {
      this.dataSource.data = Visit as PaidBilldetail[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;  
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      }); 
  }

  // 106549
  getCreditBillDetails() { 
    this.sIsLoading = 'loading-data';
    this.regId = this.RegId;

    let query = "Select * from lvwBillIPD  where TransactionType =0 and companyId = 0 and RegID= " + this.regId + " and BalanceAmt>0";
    console.log(query);
    this._IpSearchListService.getCreditBillList(query).subscribe(Visit => {
      this.dataSource1.data = Visit as CreditBilldetail[];
      this.dataSource1.sort = this.sort;
      this.dataSource1.paginator = this.paginator; 
      this.sIsLoading = ''; 
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getCompanyCreditBillDetails(event) { 
    this.dataSource1.data = [];
    this.sIsLoading = 'loading-data';
    if (event == true) {
      let query = "Select * from lvwBill where companyId != 0  and BalanceAmt>0";
      console.log(query);
      this._IpSearchListService.getCreditBillList(query).subscribe(Visit => {
        this.dataSource1.data = Visit as CreditBilldetail[];
        this.dataSource1.sort = this.sort;
        this.dataSource1.paginator = this.paginator;
        //  console.log(this.dataSource.data);
        this.sIsLoading = ''; 
      },
        error => {
          this.sIsLoading = '';
        });
    }
  }

  addpayment(contact) {
   console.log(contact)
    this.FinalAmt = contact.NetPayableAmt; 
    let PatientHeaderObj = {}; 
    PatientHeaderObj['Date'] = this.dateTimeObj.date;
    PatientHeaderObj['PatientName'] = this.PatientName;
    PatientHeaderObj['OPD_IPD_Id'] =this.vAdmissionID;
    PatientHeaderObj['AdvanceAmount'] = contact.NetPayableAmt; 
    PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
    PatientHeaderObj['PBillNo'] = contact.PBillNo;
    PatientHeaderObj['BillTime'] = contact.BillTime;
    PatientHeaderObj['RegID'] = contact.RegID; 
    
    const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
      {
        maxWidth: "95vw",
        height: '640px',
        width: '100%',
        data: {
          advanceObj: PatientHeaderObj,
          FromName: "IP-Bill"
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result)
      let BillUpdateObj = {};

      BillUpdateObj['BillNo'] = contact.BillNo;
      BillUpdateObj['BillBalAmount'] = result.BalAmt;

      console.log("Procced with Payment Option");
      let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
      this.flagSubmit = result.IsSubmitFlag

      if (this.flagSubmit) {
        console.log(result);
        result.submitDataPay.ipPaymentInsert.TransactionType = 0;
        UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
        console.log(UpdateAdvanceDetailarr1);
 
        let UpdateAdvanceDetailarr = [];
        if (result.submitDataAdvancePay.length > 0) {
          result.submitDataAdvancePay.forEach((element) => {
            let UpdateAdvanceDetailObj = {};
            UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
            UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
            UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
          });

        }
        else {
          let UpdateAdvanceDetailObj = {};
          UpdateAdvanceDetailObj['AdvanceDetailID'] = 0,
            UpdateAdvanceDetailObj['UsedAmount'] = 0,
            UpdateAdvanceDetailObj['BalanceAmount'] = 0,
            UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
        }

        let UpdateAdvanceHeaderObj = {};
        if (result.submitDataAdvancePay.length > 0) {
          UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceNo'],
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UpdateAdvanceDetailarr1[0]['AdvanceAmount'],
            UpdateAdvanceHeaderObj['BalanceAmount'] = UpdateAdvanceDetailarr1[0]['BalanceAmount']
        }
        else {

          UpdateAdvanceHeaderObj['AdvanceId'] = 0,
            UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = 0,
            UpdateAdvanceHeaderObj['BalanceAmount'] = 0
        }
        let submitData = {
          "ipPaymentCreditUpdate": result.submitDataPay.ipPaymentInsert,
          "updateIpBill": BillUpdateObj,
          "iPsettlementAdvanceDetailUpdate": UpdateAdvanceDetailarr,
          "iPsettlementAdvanceHeaderUpdate": UpdateAdvanceHeaderObj

        };
        console.log(submitData);
        this._IpSearchListService.InsertIPSettlementPayment(submitData).subscribe(response => {
          if (response) {
            Swal.fire('Payment Done  !', 'Ip Settlemet Done Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {

                this.viewgetSettlementReportPdf(response, true);
                this._matDialog.closeAll();
              }
            });
          } else {
            Swal.fire('Error !', 'IP Settlement data not saved', 'error');
          }

        });
      }
    });
  }
  viewgetSettlementReportPdf(contact, flag) {
    console.log(contact)
    let PaymentId
    if (flag) {
      PaymentId = contact
    } else {
      PaymentId = contact.PaymentId
    }
    setTimeout(() => {
      this.SpinLoading = true;
      //  this.AdList=true;
      this._IpSearchListService.getSettlementview(
        PaymentId
      ).subscribe(res => {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Settlement Viewer"
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
      });

    }, 100);
  }

  getViewbill(contact) {
    console.log(contact);
    let xx = {
      AddedBy: 1,
      AdvBalanceAmount: contact.AdvBalanceAmount,
      AdvanceAmount: contact.AdvanceAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      BalanceAmt: contact.BalanceAmt,
      BillDate: contact.BillDate,
      BillNo: contact.BillNo,
      BillTime: contact.BillTime,
      CashCounterId: contact.CashCounterId,
      CompanyId: contact.CompanyId,
      ConcessionAmt: contact.ConcessionAmt,
      IsCancelled: contact.IsCancelled,
      NetPayableAmt: contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      PaymentBillNo: contact.PaymentBillNo,
      RegID: contact.RegID,
      RegNo: contact.RegNo,
      TotalAmt: contact.TotalAmt,
      TransactionType: contact.TransactionType,


    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);

    //   const dialogRef = this._matDialog.open(PaymentViewComponent, 
    //    {  maxWidth: "95vw",
    //       maxHeight: "130vh", width: '100%', height: "100%"
    //  });
    //  dialogRef.afterClosed().subscribe(result => {
    //   //  console.log('The dialog was closed - Insert Action', result);
    //   //  this.getRadiologytemplateMasterList();
    //  });
  }

  getViewbill1(contact) {
    console.log(contact);
    let xx = {
      AddedBy: 1,
      AdvBalanceAmount: contact.AdvBalanceAmount,
      AdvanceAmount: contact.AdvanceAmount,
      AdvanceUsedAmount: contact.AdvanceUsedAmount,
      BalanceAmt: contact.BalanceAmt,
      BillDate: contact.BillDate,
      BillNo: contact.BillNo,
      BillTime: contact.BillTime,
      CashCounterId: contact.CashCounterId,
      CompanyId: contact.CompanyId,
      ConcessionAmt: contact.ConcessionAmt,
      IsCancelled: contact.IsCancelled,
      NetPayableAmt: contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      PaymentBillNo: contact.PaymentBillNo,
      RegID: contact.RegID,
      RegNo: contact.RegNo,
      TotalAmt: contact.TotalAmt,
      TransactionType: contact.TransactionType,


    };

    this.advanceDataStored.storage = new BrowseOpdPaymentReceipt(xx);

    const dialogRef = this._matDialog.open(IPSettlementViewComponent,
      {
        maxWidth: "95vw",
        maxHeight: "130vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      //  console.log('The dialog was closed - Insert Action', result);
      //  this.getRadiologytemplateMasterList();
    });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
     this._matDialog.closeAll();
     this.searchFormGroup.reset();
     this.dataSource1.data =[];
     this.dataSource.data =[];
     this.clearpatientinfo();
  }

}



export class PaidBilldetail {

  BillNo: any;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PaidAmount: number;
  BalanceAmt: number;
  BillDate: Date;

  constructor(PaidBilldetail) {
    this.BillDate = PaidBilldetail.BillDate || '';
    this.BillNo = PaidBilldetail.BillNo || '';
    this.TotalAmt = PaidBilldetail.TotalAmt || 0;
    this.ConcessionAmt = PaidBilldetail.ConcessionAmt || '';
    this.NetPayableAmt = PaidBilldetail.NetPayableAmt || 0;
    this.PaidAmount = PaidBilldetail.PaidAmount || 0;
    this.BalanceAmt = PaidBilldetail.BalanceAmt || '';

  }
}

export class CreditBilldetail {

  BillNo: any;
  TotalAmt: number;
  ConcessionAmt: number;
  NetPayableAmt: number;
  PaidAmount: number;
  BalanceAmt: number;
  BillDate: Date;

  constructor(CreditBilldetail) {
    this.BillDate = CreditBilldetail.BillDate || '';
    this.BillNo = CreditBilldetail.BillNo || '';
    this.TotalAmt = CreditBilldetail.TotalAmt || 0;
    this.ConcessionAmt = CreditBilldetail.ConcessionAmt || '';
    this.NetPayableAmt = CreditBilldetail.NetPayableAmt || 0;
    this.PaidAmount = CreditBilldetail.PaidAmount || 0;
    this.BalanceAmt = CreditBilldetail.BalanceAmt || '';

  }

}
