import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../advance';
import { IPBrowseBillService } from './ip-browse-bill.service';
import { DatePipe } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { SmsEmailTemplateComponent } from 'app/main/shared/componets/sms-email-template/sms-email-template.component';
import { ViewIPBillComponent } from './view-ip-bill/view-ip-bill.component';
import * as converter from 'number-to-words';
import { IPAdvancePaymentComponent, IpPaymentInsert } from '../ip-search-list/ip-advance-payment/ip-advance-payment.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { IPSettlementComponent } from '../ip-settlement/ip-settlement.component';
import { Advheaderdetail, UpdateBill } from 'app/main/opd/op-search-list/op-advance-payment/op-advance-payment.component';
import { Router } from '@angular/router';
import { OpPaymentNewComponent } from 'app/main/opd/op-search-list/op-payment-new/op-payment-new.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AdvanceDetailObj } from '../ip-search-list/ip-search-list.component';
import { RefundMaster } from '../Refund/ip-refund/ip-browse-refundof-bill/ip-browse-refundof-bill.component';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { DiscountAfterFinalBillComponent } from '../ip-search-list/discount-after-final-bill/discount-after-final-bill.component';


import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { IPAdvanceComponent } from '../ip-search-list/ip-advance/ip-advance.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { NewSettlementComponent } from 'app/main/opd/companysettlement/new-settlement/new-settlement.component';
import { OpPaymentVimalComponent } from 'app/main/opd/op-search-list/op-payment-vimal/op-payment-vimal.component';

@Component({
    selector: 'app-ip-bill-browse-list',
    templateUrl: './ip-bill-browse-list.component.html',
    styleUrls: ['./ip-bill-browse-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {
    myFilterform: FormGroup;
    myFilterFormIPBrowsePayment: FormGroup;
    menuActions: Array<string> = [];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsIntrimOrFinal", fieldValue: "0", opType: OperatorComparer.Equals }

    ]
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIP;
        this.gridConfig.columnsList.find(col => col.key === 'patientTypeId')!.template = this.patientTypetemp;
        this.gridConfig.columnsList.find(col => col.key === 'interimOrFinal')!.template = this.Billstatus;
        this.gridConfig.columnsList.find(col => col.key === 'balanceAmt')!.template = this.balancestatus;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.isCancelledstatus;

        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplatepayment;
        this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateIPRefund;

    }
    @ViewChild('actionButtonTemplateIP') actionButtonTemplateIP!: TemplateRef<any>;
    @ViewChild('actionButtonTemplatepayment') actionButtonTemplatepayment!: TemplateRef<any>;


    @ViewChild('patientTypetemp') patientTypetemp!: TemplateRef<any>;
    @ViewChild('Billstatus') Billstatus!: TemplateRef<any>;
    @ViewChild('balancestatus') balancestatus!: TemplateRef<any>;
    @ViewChild('isCancelledstatus') isCancelledstatus!: TemplateRef<any>;

    @ViewChild('actionButtonTemplateIPRefund') actionButtonTemplateIPRefund!: TemplateRef<any>;

    gridConfig: gridModel = {
        apiUrl: "Billing/BrowseIPBillList",
        columnsList: [
            { heading: "", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },

            { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
            { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
            { heading: "DOD", key: "dischargeDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
            { heading: "IPDNO", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', },
            { heading: "DiscAmount", key: "concessionAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CompanyDiscAmt", key: "compDiscAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NetAmount", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalanceAmt", key: "bAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CashPay", key: "cashPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CardPay", key: "cardPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NEFTPay", key: "neftPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "AdvUSedAmount", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PayCount", key: "paycount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "RefundAmout", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CashcounterName", key: "cashCounterName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplateIP  // Assign ng-template to the column
            }
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allfilters
    }

    gridConfig1: gridModel = {
        apiUrl: "Billing/BrowseIPPaymentList",
        columnsList: [

            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "TotalAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', type: 9 },
            { heading: "CashPay", key: "cashPay", sort: true, align: "center" },
            { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CardPay", key: "cardPay", sort: true, align: "center" },
            { heading: "AdvanceUsed", key: "advused", sort: true, align: "center" },
            { heading: "PaidAmount", key: "paidAmount", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "NEFTPayAmt", key: "nEFTPayAmount", sort: true, align: "center", emptySign: 'NA' },
            { heading: "PayTMAmt", key: "payTmPay", sort: true, align: "center", emptySign: 'NA' },
            { heading: "Remark ", key: "remark0", sort: true, align: "center", emptySign: 'NA' },
            { heading: "User Name", key: "userName", sort: true, align: "center", emptySign: 'NA' },
            {
                heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplatepayment  // Assign ng-template to the column
            }
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }

    gridConfig2: gridModel = {
        apiUrl: "Billing/BrowseIPRefundlist",
        columnsList: [
            { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
            { heading: "UHID", key: "uhidNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
            { heading: "RefundAmount", key: "refundId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CashPay", key: "cashPay", sort: true, align: "center" },
            { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "CardPay", key: "cardPay", sort: true, align: "center" },
            { heading: "Remark", key: "remark", sort: true, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
                template: this.actionButtonTemplateIPRefund  // Assign ng-template to the column
            }//Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _IPBrowseBillService: IPBrowseBillService,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog, private _ActRoute: Router,
         private accountService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._IPBrowseBillService.filterForm_IpdBrowse();
        this.myFilterFormIPBrowsePayment = this._IPBrowseBillService.filterForm_IpdpaymentBrowse()

        if (this._ActRoute.url == '/ipd/ipd-bill-browse-list') {
            this.menuActions.push('Print Final Bill Groupwise');
            this.menuActions.push('Print FinalBill Classwise');
            this.menuActions.push('Print FinalBill ClassService');
            this.menuActions.push('Print IP Final Bill');
            // this.menuActions.push('Print FinalBill WardWise');
        }

    }

    onSave(row: any = null) {
    }

    OngetRecord(contact, m): void {
        console.log(contact)
        if (m == "Print Final Bill Groupwise")
            if (!contact.InterimOrFinal)
                this.viewgetFinalBillReportGroupwisePdf(contact.billNo)
            else
                this.viewgetInterimBillReportPdf(contact.billNo)

        if (m == "Print FinalBill Classwise")
            this.viewgetBillReportclasswisePdf(contact.billNo)
        if (m == "Print FinalBill ClassService")
            this.viewgetBillReportclassservicewisePdf(contact.billNo)

        if (m == "Print IP Final Bill")
            this.viewgetFinalBillReportNewPdf(contact.billNo)
    }

    // viewgetBillReportPdf(billNo) {
    //     this.commonService.Onprint("BillNo", billNo, "IpFinalBill");
    // }
    viewgetInterimBillReportPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpInterimBill");
    }
    viewgetBillReportclasswisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpFinalClasswiseBill");
    }
    viewgetBillReportclassservicewisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpFinalBillClassservicewise");
    }
    viewgetFinalBillReportNewPdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpFinalBill");
    }
    viewgetFinalBillReportGroupwisePdf(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpFinalGroupwiseBill");
    }


    getValidationMessages() {
        return {
            FirstName: [
                { name: "required", Message: "First Name is required" },
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            LastName: [
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            RegNo: [],
            PBillNo: []

        }
    }

    onChangeDate(selectDate) {
        if (selectDate) {

            this.fromDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.fromDate);
            this.gridConfig.filters[2].fieldValue = this.fromDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }
            ]
        }

    }
    onChangeDate1(selectDate) {
        if (selectDate) {

            this.toDate = this.datePipe.transform(selectDate, "MM/dd/yyyy")
            console.log(this.toDate);
            this.gridConfig.filters[3].fieldValue = this.toDate

            this.gridConfig.filters = [{ fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals }]
        }
    }


    Billpayment(contact) {

        console.log(contact)
        let PatientHeaderObj = {};
        PatientHeaderObj['Date'] = contact.billDate;
        PatientHeaderObj['PatientName'] = contact.patientName;
        PatientHeaderObj['AdvanceAmount'] = contact.advUsedPay;
        PatientHeaderObj['NetPayAmount'] = contact.netPayableAmt;
        PatientHeaderObj['BillNo'] = contact.billNo;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['IPDNo'] = contact.opD_IPD_ID;
        PatientHeaderObj['RegNo'] = contact.regNo;



        console.log(PatientHeaderObj)

         const dialogRef = this._matDialog.open(OpPaymentVimalComponent,
                  {
                      maxWidth: "95vw",
                      height: '750px',
                      width: '85%',
      
                      data: {
                          vPatientHeaderObj: PatientHeaderObj,
                          FromName: "IP-SETTLEMENT",
                          advanceObj: PatientHeaderObj,
                      }
                  });
      
      
              dialogRef.afterClosed().subscribe(result => {
                   let NeftNo="0"
                  console.log(result.submitDataPay.ipPaymentInsert)
                  
                  if(result.submitDataPay.ipPaymentInsert.NEFTNo =="undefined")
                      NeftNo="0"
                  else
                  NeftNo=result.submitDataPay.ipPaymentInsert.NEFTNo
                  if (result.IsSubmitFlag) {
                      let Paymentobj = {};
      
                      Paymentobj['PaymentId'] = '0';
                      Paymentobj['billNo'] = contact.billNo;
                      Paymentobj['PaymentDate'] = result.submitDataPay.ipPaymentInsert.PaymentDate;
                      Paymentobj['PaymentTime'] = result.submitDataPay.ipPaymentInsert.PaymentTime; //this.datePipe.transform(this.currentDate, 'yyyy-MM-dd') || this.datePipe.transform(this.currentDate, 'yyyy-MM-dd')
                      Paymentobj['CashPayAmount'] = result.submitDataPay.ipPaymentInsert.CashPayAmount ?? 0;
                      Paymentobj['ChequePayAmount'] = result.submitDataPay.ipPaymentInsert.ChequePayAmount ?? 0;
                      Paymentobj['ChequeNo'] = String(result.submitDataPay.ipPaymentInsert.ChequeNo) ?? "0";
                      Paymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName ?? "";
                      Paymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate;
                      Paymentobj['CardPayAmount'] = result.submitDataPay.ipPaymentInsert.CardPayAmount
                      Paymentobj['CardNo'] = result.submitDataPay.ipPaymentInsert.CardNo;
                      Paymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName
                      Paymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate
                      Paymentobj['AdvanceUsedAmount'] = result.submitDataPay.ipPaymentInsert.AdvanceUsedAmount
                      Paymentobj['AdvanceId'] = result.submitDataPay.ipPaymentInsert.AdvanceId
                      Paymentobj['RefundId'] = 0;
                      Paymentobj['TransactionType'] = 0;
                      Paymentobj['Remark'] = '';
                      Paymentobj['AddBy'] =this.accountService.currentUserValue.userId,
                      Paymentobj['IsCancelled'] = false;
                      Paymentobj['IsCancelledBy'] = '0';
                      Paymentobj['IsCancelledDate'] = result.submitDataPay.ipPaymentInsert.IsCancelledDate
                      Paymentobj['opdipdType'] = 1;
                      Paymentobj['neftpayAmount'] = result.submitDataPay.ipPaymentInsert.NEFTPayAmount
                      Paymentobj['neftno'] =NeftNo;
                      Paymentobj['neftbankMaster'] = result.submitDataPay.ipPaymentInsert.NEFTBankMaster
                      Paymentobj['neftdate'] = result.submitDataPay.ipPaymentInsert.NEFTDate
                      Paymentobj['payTmamount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount
                      Paymentobj['payTmtranNo'] = "0",//result.submitDataPay.ipPaymentInsert.PayTMTranNo || 0
                          Paymentobj['payTmdate'] = result.submitDataPay.ipPaymentInsert.PayTMDate
                      Paymentobj['tdsAmount'] = result.submitDataPay.ipPaymentInsert.tdsAmount
      
                      let BillUpdateObj = {};
      
                      BillUpdateObj['billNo'] = contact.billNo;
                      BillUpdateObj['balanceAmt'] = result.BalAmt;
      
                      console.log("Procced with Payment Option");
                      let UpdateAdvanceDetailarr1: IpPaymentInsert[] = [];
      
                      if (result.IsSubmitFlag) {
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
                                  UpdateAdvanceDetailObj['advanceDetailID'] = element.AdvanceDetailID;
                                  UpdateAdvanceDetailObj['usedAmount'] = element.UsedAmount;
                                  UsedAmt += element.UsedAmount;
                                  UpdateAdvanceDetailObj['balanceAmount'] = element.BalanceAmount;
                                  BalanceAmt += element.BalanceAmount;
                                  UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                              });
                          }
                          else {
                              let UpdateAdvanceDetailObj = {};
                              UpdateAdvanceDetailObj['advanceDetailID'] = 0,
                                  UpdateAdvanceDetailObj['usedAmount'] = 0,
                                  UpdateAdvanceDetailObj['balanceAmount'] = 0,
                                  UpdateAdvanceDetailarr.push(UpdateAdvanceDetailObj);
                          }
      
      
                          let UpdateAdvanceHeaderObj = {};
                          if (result.submitDataAdvancePay.length > 0) {
                              UpdateAdvanceHeaderObj['AdvanceId'] = UpdateAdvanceDetailarr1[0]['AdvanceId'],
                                  UpdateAdvanceHeaderObj['AdvanceUsedAmount'] = UsedAmt,
                                  UpdateAdvanceHeaderObj['BalanceAmount'] = BalanceAmt
                          }
                          else {
                              UpdateAdvanceHeaderObj['advanceId'] = 0,
                                  UpdateAdvanceHeaderObj['advanceUsedAmount'] = 0,
                                  UpdateAdvanceHeaderObj['balanceAmount'] = 0
                          }
      
                          let submitData = {
                              "payment":Paymentobj,// result.submitDataPay.ipPaymentInsert,
                              "billupdate": BillUpdateObj,
                              "advanceDetailupdate": UpdateAdvanceDetailarr,
                              "advanceHeaderupdate": UpdateAdvanceHeaderObj 
                          };
                          let data={
                              submitDataPay:submitData
                          }
                          console.log(submitData);
                          this._IPBrowseBillService.InsertIPSettlementPayment(submitData).subscribe(response => {
                              this.toastr.success(response.message);
                            
                             this.viewgetIPPayemntPdf(response.data)
                              // this._matDialog.closeAll();
                             
                          }, (error) => {
                              this.toastr.error(error.message);
                          });
                         
                      }
      
                  }
              });

    }

    viewgetIPPayemntPdf(data) {
        
        this.commonService.Onprint("PaymentId", data.paymentId, "IpPaymentReceipt");
    }

    getFinalBillview(billNo) {
        this.commonService.Onprint("BillNo", billNo, "IpFinalBill");
    }

    OnViewReportPdf(element) {
        this.commonService.Onprint("PaymentId", element.paymentId, "IpPaymentReceipt");
    }

    getPaymentreceiptview(element) {
        this.commonService.Onprint("PaymentId", element.paymentId, "IpPaymentReceipt");
    }

    getRefundreceiptview(element) {
        this.commonService.Onprint("RefundId", element.refundId, "IpBillRefundReceipt");
    }

    IPAdvanceComponent() {

        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(IPAdvanceComponent,
            {
                maxWidth: "100%",
                maxHeight: '95%',
                width: '80%',
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
            console.log('The dialog was closed - Action', result);
        });
    }

}
