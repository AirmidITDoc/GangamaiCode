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

@Component({
    selector: 'app-ip-bill-browse-list',
    templateUrl: './ip-bill-browse-list.component.html',
    styleUrls: ['./ip-bill-browse-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {
    myFilterform: FormGroup;
    myFilterFormIPBrowsePayment:FormGroup;
    menuActions: Array<string> = [];
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

   
    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue:this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsIntrimOrFinal", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }

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
            { heading: "", key: "patientTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50},
            { heading: "", key: "interimOrFinal", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            { heading: "", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 50 },
            
            { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width:200, type:9},
            { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width:150},
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width:300},
            { heading: "Age", key: "age", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Mobile", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width:200,type:9},
            { heading: "DOD", key: "dischargeDate", sort: true, align: 'left', emptySign: 'NA', width:200,type:9},
            { heading: "IPDNO", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:200 },
            { heading: "RefDoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "TariffName", key: "tariffName", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "UnitName", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA',width:200 },
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
        filters: this.allfilters,

        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Billing/BrowseIPPaymentList",
        columnsList: [

            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA' ,width:300},
            { heading: "TotalAmount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "BalAmount", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Date", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA',type:9 },
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
            { fieldName: "ReceiptNo", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig2: gridModel = {
        apiUrl: "Billing/BrowseIPRefundlist",
        columnsList: [
            { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width:200 },
            { heading: "UHID", key: "uhidNo", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA',width:300 },
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
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _IPBrowseBillService: IPBrowseBillService, public _matDialog: MatDialog, private _ActRoute: Router,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._IPBrowseBillService.filterForm_IpdBrowse();
        this.myFilterFormIPBrowsePayment=this._IPBrowseBillService.filterForm_IpdpaymentBrowse()

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

    getRecord1(contact, m): void {
        debugger
        if (m == "Print Final Bill Groupwise") 
          if (!contact.InterimOrFinal)
            this.viewgetBillReportPdf(contact.BillNo)
          else
            this.viewgetInterimBillReportPdf(contact.BillNo)
      
      if (m == "Print FinalBill Classwise") 
        this.viewgetBillReportclasswisePdf(contact)
        if (m == "Print FinalBill ClassService") 
          this.viewgetBillReportclassservicewisePdf(contact)
          // if (m == "Print FinalBill WardWise") 
          //   this.viewgetBillReportwardwisePdf(contact)
    
             if (m == "Print IP Final Bill") 
            this.viewgetFinalBillReportNewPdf(contact.BillNo)
      }

      viewgetBillReportPdf(e){}
      viewgetInterimBillReportPdf(e){}
      viewgetBillReportclasswisePdf(e){}
      viewgetBillReportclassservicewisePdf(e){}
      viewgetFinalBillReportNewPdf(e){}


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
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
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
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }]
        }
    }


    Billpayment(contact) {

        console.log(contact)
        let PatientHeaderObj = {};
    
        PatientHeaderObj['Date'] = contact.BillDate;
        PatientHeaderObj['PatientName'] = contact.PatientName;
        PatientHeaderObj['OPD_IPD_Id'] = contact.OPD_IPD_ID;
        PatientHeaderObj['MobileNo'] = contact.MobileNo;
        PatientHeaderObj['PatientAge'] = contact.PatientAge;
        PatientHeaderObj['NetPayAmount'] = contact.NetPayableAmt;
        PatientHeaderObj['BillId'] = contact.BillNo;
        PatientHeaderObj['CompanyName'] = contact.CompanyName;
        PatientHeaderObj['RegNo'] = contact.RegNo;
        PatientHeaderObj['RegId'] = contact.RegId;
        // this.advanceDataStored.storage = new AdvanceDetailObj(contact);
    
    console.log(PatientHeaderObj)
    
    
        const dialogRef = this._matDialog.open(IPSettlementComponent,
          {
            maxWidth: "95vw",
            height: '740px',
            width: '100%',
            data: {
    
              registerObj: contact,
              FromName: "IP-Bill"
            }
          });
    
        dialogRef.afterClosed().subscribe(result => {
    
        //   let updateIpBillobj = {};
    
    
        //   updateIpBillobj['BillNo'] = contact.BillNo;
        //   updateIpBillobj['BillBalAmount'] = result.submitDataPay.BalAmt || 0;
    
        //   const updateIpBill = new UpdateBill(updateIpBillobj);
    
    
        //   let iPsettlementAdvanceDetailUpdateobj = {};
        //   // need loop here
    
        //   iPsettlementAdvanceDetailUpdateobj['advanceDetailID'] = contact.BillNo;
        //   iPsettlementAdvanceDetailUpdateobj['usedAmount'] = 0;
        //   iPsettlementAdvanceDetailUpdateobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController
    
        //   const iPsettlementAdvanceDetailUpdate = new Advheaderdetail(iPsettlementAdvanceDetailUpdateobj);
    
    
        //   let iPsettlementAdvanceHeaderUpdateobj = {};
    
        //   iPsettlementAdvanceHeaderUpdateobj['advanceId'] = contact.BillNo;
        //   iPsettlementAdvanceHeaderUpdateobj['advanceUsedAmount'] = 0;
        //   iPsettlementAdvanceHeaderUpdateobj['balanceAmount'] = result.submitDataPay.ipPaymentInsert.balanceAmountController
    
        //   const iPsettlementAdvanceHeaderUpdate = new UpdateBill(iPsettlementAdvanceHeaderUpdateobj);
    
        //   let CreditPaymentobj = {};
        //   CreditPaymentobj['paymentId'] = 0;
        //   CreditPaymentobj['BillNo'] = contact.BillNo;
        //   // CreditPaymentobj['ReceiptNo'] = '';
        //   CreditPaymentobj['PaymentDate'] = this.currentDate || '01/01/1900';
        //   CreditPaymentobj['PaymentTime'] = this.currentDate || '01/01/1900';
        //   CreditPaymentobj['CashPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CashPayAmount) || 0;
        //   CreditPaymentobj['ChequePayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.ChequePayAmount) || 0;
        //   CreditPaymentobj['ChequeNo'] = result.submitDataPay.ipPaymentInsert.ChequeNo || '';
        //   CreditPaymentobj['BankName'] = result.submitDataPay.ipPaymentInsert.BankName || '';
        //   CreditPaymentobj['ChequeDate'] = result.submitDataPay.ipPaymentInsert.ChequeDate || '01/01/1900';
        //   CreditPaymentobj['CardPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.CardPayAmount) || 0;
        //   CreditPaymentobj['CardNo'] = result.submitDataPay.ipPaymentInsert.CardNo || '';
        //   CreditPaymentobj['CardBankName'] = result.submitDataPay.ipPaymentInsert.CardBankName || '';
        //   CreditPaymentobj['CardDate'] = result.submitDataPay.ipPaymentInsert.CardDate || '01/01/1900';
        //   CreditPaymentobj['AdvanceUsedAmount'] = 0;
        //   CreditPaymentobj['AdvanceId'] = 0;
        //   CreditPaymentobj['RefundId'] = 0;
        //   CreditPaymentobj['TransactionType'] = 0;
        //   CreditPaymentobj['Remark'] = result.submitDataPay.ipPaymentInsert.Remark || '';
        //   CreditPaymentobj['AddBy'] = this.accountService.currentUserValue.user.id,
        //     CreditPaymentobj['IsCancelled'] = 0;
        //   CreditPaymentobj['IsCancelledBy'] = 0;
        //   CreditPaymentobj['IsCancelledDate'] = this.currentDate;
        //   // CreditPaymentobj['CashCounterId'] = 0;
        //   // CreditPaymentobj['IsSelfORCompany'] = 0;
        //   // CreditPaymentobj['CompanyId'] = 0;
        //   CreditPaymentobj['opD_IPD_Type'] = 0;
        //   CreditPaymentobj['neftPayAmount'] = parseInt(result.submitDataPay.ipPaymentInsert.neftPayAmount) || 0;
        //   CreditPaymentobj['neftNo'] = result.submitDataPay.ipPaymentInsert.neftNo || '';
        //   CreditPaymentobj['neftBankMaster'] = result.submitDataPay.ipPaymentInsert.neftBankMaster || '';
        //   CreditPaymentobj['neftDate'] = result.submitDataPay.ipPaymentInsert.neftDate || '01/01/1900';
        //   CreditPaymentobj['PayTMAmount'] = result.submitDataPay.ipPaymentInsert.PayTMAmount || 0;
        //   CreditPaymentobj['PayTMTranNo'] = result.submitDataPay.ipPaymentInsert.paytmTransNo || '';
        //   CreditPaymentobj['PayTMDate'] = result.submitDataPay.ipPaymentInsert.PayTMDate || '01/01/1900'
        //   // CreditPaymentobj['PaidAmt'] = this.paymentForm.get('paidAmountController').value;
        //   // CreditPaymentobj['BalanceAmt'] = this.paymentForm.get('balanceAmountController').value;
    
        //   console.log(CreditPaymentobj)
        //   const ipPaymentInsert = new IpPaymentInsert(CreditPaymentobj);
    
        //   let Data = {
        //     "updateIpBill": updateIpBill,
        //     "ipPaymentCreditUpdat": ipPaymentInsert,
        //     "iPsettlementAdvanceDetailUpdate": iPsettlementAdvanceDetailUpdate,
        //     "iPsettlementAdvanceHeaderUpdate": iPsettlementAdvanceHeaderUpdate
        //   };
    
        //   console.log(Data)
        //   this._IpBillBrowseListService.InsertIPCreditBillingPayment(Data).subscribe(response => {
        //     if (response) {
        //       Swal.fire('IP Bill With Settlement!', 'Bill Payment Successfully !', 'success').then((result) => {
        //         if (result) {
    
        //           this.viewgetBillReportPdf(response)
        //           this._matDialog.closeAll();
        //           this.onShow_IpdBrowse();
        //           this.getWhatsappshareIPPaymentRec(response,this.vMobileNo)
        //         }
        //       });
        //     } else {
        //       Swal.fire('Error !', 'IP Billing Payment not saved', 'error');
        //     }
    
        //   });
        });
    
      }

    getFinalBillview(Id) {
        setTimeout(() => {

            let param = {
                "searchFields": [
                    {
                        "fieldName": "BillNo",
                        "fieldValue": Id,
                        "opType": "13"
                    }
                ],
                "mode": "IpFinalBill"
            }

            debugger
            console.log(param)
            this._IPBrowseBillService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Bill  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }

    getPaymentreceiptview(Id) {
        debugger
        setTimeout(() => {

            let param = {

                "searchFields": [
                    {
                        "fieldName": "PaymentId",
                        "fieldValue": Id,
                        "opType": "13"
                    }
                ],
                "mode": "IpPaymentReceipt"
            }

            debugger
            console.log(param)
            this._IPBrowseBillService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Payment  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
    }

    getRefundreceiptview(AdmissionId) {
        setTimeout(() => {

            let param = {
                "searchFields": [
                    {
                        "fieldName": "BillNo",
                        "fieldValue": "50848",
                        "opType": "13"
                    }
                ],
                "mode": "IpFinalBill"
            }

            debugger
            console.log(param)
            this._IPBrowseBillService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "IP Bill  Viewer"

                        }

                    });

                matDialog.afterClosed().subscribe(result => {

                });
            });

        }, 100);
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
