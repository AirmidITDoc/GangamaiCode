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
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';
import { DiscountAfterFinalBillComponent } from '../ip-search-list/discount-after-final-bill/discount-after-final-bill.component';


@Component({
    selector: 'app-ip-settlement',
    templateUrl: './ip-settlement.component.html',
    styleUrls: ['./ip-settlement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPSettlementComponent implements OnInit {
    flagSubmit: boolean;
    sIsLoading: string = '';
    selectedAdvanceObj: AdvanceDetailObj;
    screenFromString = 'Ip-Settelment';
    currentDate = new Date();
    FinalAmt: any;
    balanceamt: any;
    searchFormGroup: FormGroup;
    registerObj: any;
    filteredOptions: any;
    noOptionFound: boolean = false;
    PatientName: any;
    RegId: any;
    isRegIdSelected: boolean = false;
    vAdmissionID: any;
    vCompanyName: any;
    vTariif: any;
    RegNo: any;
    PatientHeaderObj: AdvanceDetailObj;
    AgeYear: any;
    AgeDay: any;
    GenderName: any;
    AgeMonth: any;
    Doctorname: any;
    SpinLoading: boolean = false;
    DepartmentName:any;
    AdmDateTime:any;
    IPDNo:any;
    PatientType:any;
    RefDocName:any;
    RoomName:any;
    BedName:any;

    displayedColumns1: string[] = [
        'button',
        'CompanyName',
        'PatientType',
        'BillDate',
        'BillNo',
        'TotalAmt',
        'ConcessionAmt',
        'NetPayableAmt',
        'PaidAmount',
        'BalanceAmt',
        'action'
    ];
    dataSource1 = new MatTableDataSource<CreditBilldetail>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _IpSearchListService: IPSettlementService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private advanceDataStored: AdvanceDataStored,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit(): void {
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
            this.AgeYear = this.PatientHeaderObj.PatientAge;
            this.Doctorname = this.PatientHeaderObj.Doctorname;
            this.vCompanyName = this.PatientHeaderObj.CompanyName;
            this.vTariif = this.PatientHeaderObj.TariffName;
            this.DepartmentName = this.PatientHeaderObj.DepartmentName;
            this.AdmDateTime = this.PatientHeaderObj.AdmDateTime;
            this.IPDNo = this.PatientHeaderObj.IPDNo;
            this.AgeMonth = this.PatientHeaderObj.AgeMonth;
            this.AgeDay = this.PatientHeaderObj.AgeDay;
            this.GenderName = this.PatientHeaderObj.GenderName;
            this.PatientType = this.PatientHeaderObj.PatientType;
            this.RefDocName  = this.PatientHeaderObj.RefDocName;
            this.RoomName =  this.PatientHeaderObj.RoomName;
            this.BedName = this.PatientHeaderObj.BedName;
            this.getCreditBillDetails();
        }
        else {
            this.clearpatientinfo();
        }
        this.searchFormGroup = this.createSearchForm();
    }

    createSearchForm() {
        return this.formBuilder.group({
            RegId: [''],
        });
    }

    getSearchList() {
        var m_data = {
            "Keyword": `${this.searchFormGroup.get('RegId').value}`
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
    getSelectedObj(obj) {
        console.log(obj)
        this.registerObj = obj;
        this.selectedAdvanceObj = obj;
        this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
        this.RegId = obj.RegId;
        this.vAdmissionID = obj.AdmissionID;
        this.RegNo = obj.RegNo;
        this.AgeYear = obj.AgeYear;
        this.AgeDay = obj.AgeDay;
        this.AgeMonth = obj.AgeMonth;
        this.GenderName = obj.GenderName;
        this.Doctorname = obj.MobileNo;
        this.DepartmentName = obj.DepartmentName;
        this.AdmDateTime = obj.AdmDateTime
        this.IPDNo = obj.IPDNo ;
        this.vCompanyName = obj.CompanyName;
        this.vTariif = obj.TariffName;
        this.PatientType = obj.PatientType;
        this.RefDocName = obj.RefDocName;
        this.RoomName = obj.RoomName;
        this.BedName = obj.BedName;
        this.getCreditBillDetails();
    }

    getOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' ' + option.LastName;
    }
    clearpatientinfo() {
        this.PatientName = '';
        this.RegId = '';
        this.vAdmissionID = '';
        this.RegNo = '';
        this.AgeYear = '';
        this.AgeDay = '';
        this.AgeMonth = '';
        this.GenderName = '';
        this.Doctorname = '';
        this.DepartmentName = '';
        this.AdmDateTime = '';
        this.IPDNo = '';
        this.vCompanyName  = '';
        this.vTariif = '';
        this.PatientType = '';
        this.RefDocName = '';
        this.RoomName = '';
        this.BedName = '';
    }
    getCreditBillDetails() {
        this.sIsLoading = 'loading-data';
        var Vdata = {
            'RegId': this.RegId
        }
        console.log(Vdata)
        this._IpSearchListService.getCreditBillList(Vdata).subscribe(Visit => {
            this.dataSource1.data = Visit as CreditBilldetail[];
            console.log(this.dataSource1.data);
            this.dataSource1.sort = this.sort;
            this.dataSource1.paginator = this.paginator;
            this.sIsLoading = '';
        },
            error => {
                this.sIsLoading = '';
            });
    }

    addpayment(contact) {
        console.log(contact)
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.FinalAmt = contact.NetPayableAmt;

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['AdvanceAmount'] = contact.NetPayableAmt;
        PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
        PatientHeaderObj['PBillNo'] = contact.PBillNo;
        PatientHeaderObj['IPDNo'] = contact.IPDNo;
        PatientHeaderObj['RegNo'] = contact.RegNo;

        const dialogRef = this._matDialog.open(IPpaymentWithadvanceComponent,
            {
                maxWidth: "95vw",
                height: '650px',
                width: '85%',
                data: {
                    advanceObj: PatientHeaderObj,
                    FromName: "IP-SETTLEMENT"
                }
            });

        dialogRef.afterClosed().subscribe(result => {
            console.log(result)
            let BillUpdateObj = {};

            BillUpdateObj['BillNo'] = contact.BillNo || 0;
            BillUpdateObj['BillBalAmount'] = result.BalAmt || 0;

            console.log("Procced with Payment Option");
            let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
            this.flagSubmit = result.IsSubmitFlag

            if (this.flagSubmit) {
                console.log(result);
                result.submitDataPay.ipPaymentInsert.TransactionType = 0;
                UpdateAdvanceDetailarr1 = result.submitDataAdvancePay;
                console.log(UpdateAdvanceDetailarr1);

                let UpdateAdvanceDetailarr = [];
                let BalanceAmt = 0;
                let UsedAmt = 0;
                if (result.submitDataAdvancePay.length > 0) {
                    result.submitDataAdvancePay.forEach((element) => {
                        let UpdateAdvanceDetailObj = {};
                        UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID || 0;
                        UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount || 0;
                        UsedAmt += element.UsedAmount;
                        UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount || 0;
                        BalanceAmt += element.BalanceAmount;
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
                    UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'] || 0;
                        UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UsedAmt || 0;
                        UpdateAdvanceHeaderObj['BalanceAmount'] = BalanceAmt || 0;
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
                                this.getCreditBillDetails();
                            }
                        });
                    } else {
                        Swal.fire('Error !', 'IP Settlement data not saved', 'error');
                    }

                });
            }
        });
    }
//new payment form
    addpayment1(contact) {
        console.log(contact)
        const currentDate = new Date();
        const datePipe = new DatePipe('en-US');
        const formattedTime = datePipe.transform(currentDate, 'shortTime');
        const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
        this.FinalAmt = contact.NetPayableAmt;

        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = formattedDate;
        PatientHeaderObj['PatientName'] = this.PatientName; 
        PatientHeaderObj['AdvanceAmount'] = contact.BalanceAmt;
        PatientHeaderObj['NetPayAmount'] = contact.BalanceAmt;
        PatientHeaderObj['BillNo'] = contact.BillNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['IPDNo'] = contact.IPDNo;
        PatientHeaderObj['RegNo'] = contact.RegNo; 

        const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
            {
                maxWidth: "95vw",
                height: '650px',
                width: '85%',
                //  data: {
                //    advanceObj: PatientHeaderObj,
                //    FromName: "IP-SETTLEMENT"
                //  }
                data: {
                    vPatientHeaderObj: PatientHeaderObj,
                    FromName: "IP-SETTLEMENT",
                    advanceObj: PatientHeaderObj,
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
                let BalanceAmt = 0;
                let UsedAmt = 0;
                if (result.submitDataAdvancePay.length > 0) {
                    result.submitDataAdvancePay.forEach((element) => {
                        let UpdateAdvanceDetailObj = {};
                        UpdateAdvanceDetailObj['AdvanceDetailID'] = element.AdvanceDetailID;
                        UpdateAdvanceDetailObj['UsedAmount'] = element.UsedAmount;
                        UsedAmt += element.UsedAmount;
                        UpdateAdvanceDetailObj['BalanceAmount'] = element.BalanceAmount;
                        BalanceAmt += element.BalanceAmount;
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
                    UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
                        UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UsedAmt,
                        UpdateAdvanceHeaderObj['BalanceAmount'] = BalanceAmt
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
                                this.getCreditBillDetails();
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
        this.dataSource1.data = [];
        this.clearpatientinfo();
    }
    getFinalDisc(contact){
        console.log(contact);
        const dialogRef = this._matDialog.open(DiscountAfterFinalBillComponent,
          {
            maxWidth: "100%",
            height: '76%',
            width: '60%',
            data: contact
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
          this.getCreditBillDetails();
        });
      } 
}
export class CreditBilldetail {

    BillNo: any;
    CompanyName: any;
    PatientType: any;
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
        this.CompanyName = CreditBilldetail.CompanyName || '';
        this.PatientType = CreditBilldetail.PatientType || '';
    }

}
