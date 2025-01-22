import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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

@Component({
    selector: 'app-ip-bill-browse-list',
    templateUrl: './ip-bill-browse-list.component.html',
    styleUrls: ['./ip-bill-browse-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class IPBillBrowseListComponent implements OnInit {
    myFilterform:FormGroup;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    
    fromDate = "01/01/2021"//this.datePipe.transform(new Date(), "mm/ddyyyy")
    toDate = "12/10/2024"//this.datePipe.transform(new Date(), "mm/ddyyyy")
    allfilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        { fieldName: "IsIntrimOrFinal", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }

    ]

    gridConfig: gridModel = {
        apiUrl: "Billing/IPBillList",
        columnsList: [
            { heading: "Code", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "BillDate", key: "billTime", sort: true, align: 'left', emptySign: 'NA', width: 150,type:8 },
            { heading: "OpdIpdId", key: "opdIpdId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "OpdIpdType", key: "opdIpdType", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA', width: 150,type:8  },
            { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', width: 50 },

            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._IPBrowseBillService.deactivateTheStatus(data.PbillNo).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allfilters,

        //   [
        //       { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //       { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
        //      { fieldName: "From_Dt", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
        //       { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
        //       { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        //       { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
        //       { fieldName: "IsIntrimOrFinal", fieldValue: "0", opType: OperatorComparer.Equals },
        //       { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
        //       { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        //      // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        //   ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Billing/IPPaymentList",
        columnsList: [
            { heading: "Code", key: "paymentId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReceiptNo", key: "receiptNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "PaymentTime", key: "paymentTime", sort: true, align: 'left', emptySign: 'NA', width: 150 ,type:8 },
            { heading: "AdvanceId", key: "advanceId", sort: true, align: "center", width: 150 },
            { heading: "RefundId", key: "refundId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            // { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CashPay", key: "cashPay",sort: true, align: "center" },
            // { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CardPay", key: "cardPay", sort: true,align: "center" },
            // { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._IPBrowseBillService.deactivateTheStatuspayment(data.paymentId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "11/11/2024", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "ReceiptNo", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    gridConfig2: gridModel = {
        apiUrl: "Billing/IPRefundBillList",
        columnsList: [
            { heading: "Code", key: "refundId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "RefundDate", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150 ,type:8 },
            { heading: "BillId", key: "billId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "AdvanceId", key: "advanceId", sort: true, align: "center", width: 150 },
            // { heading: "BillAmount", key: "billAmount", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "BalanceAmt", key: "balanceAmt", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CashPay", key: "cashPay",sort: true, align: "center" },
            // { heading: "ChequePay", key: "chequePay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "CardPay", key: "cardPay", sort: true,align: "center" },
            // { heading: "AdvUsedPay", key: "advUsedPay", sort: true, align: 'left', emptySign: 'NA' },
            // { heading: "OnlinePay", key: "onlinePay", sort: true, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._IPBrowseBillService.deactivateTheStatus(data.RefundId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: "01/01/2021", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _IPBrowseBillService: IPBrowseBillService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe) { }
    ngOnInit(): void {
        this.myFilterform=this._IPBrowseBillService.filterForm_IpdBrowse();
    }

    onSave(row: any = null) {
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

}
