import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { NewAdvanceComponent } from './new-advance/new-advance.component';
import { NewIPRefundAdvanceComponent } from './new-iprefund-advance/new-iprefund-advance.component';
import { PharAdvanceService } from './phar-advance.service';

@Component({
    selector: 'app-phar-advance',
    templateUrl: './phar-advance.component.html',
    styleUrls: ['./phar-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PharAdvanceComponent implements OnInit {

    dateTimeObj: any;
    sIsLoading: string = '';
    isLoading = true;
    myFilterform: FormGroup;
    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('grid1', { static: false }) grid1: AirmidTableComponent;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    PBillNo: any = "0"
    storeId: any = this._loggedService.currentUserValue.user.storeId

    fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    f_name1: any = ""
    regNo1: any = "0"
    l_name1: any = ""
    storeId1: any = this._loggedService.currentUserValue.user.storeId

    allfilters1 = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
    ]
    allfiltersRefund = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.storeId1), opType: OperatorComparer.Equals }
    ]

    allColumns1 = [
        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Advance.No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 260 },
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "online Pay", key: "onlineAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "TDS Pay", key: "tdsAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "WF Pay", key: "wfAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Commects", key: "reason", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 80, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.commonService.Onprint("AdvanceDetailID", data.advanceDetailID, "PharamcyAdvanceReceipt");
                    }
                }]
        }
    ]
    allColumnsRefund = [
        { heading: "Refund Date", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
        { heading: "Refund No", key: "refundNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 260 },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "AddedBy", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", width: 80, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.commonService.Onprint("RefundId", data.refundId, "PharamcyAdvanceReturnReceipt");
                    }
                }]
        }
    ]

    gridConfig: gridModel = {
        apiUrl: "Sales/BrowseIPPharAdvanceReceiptList",
        columnsList: this.allColumns1,
        sortField: "StoreId",
        sortOrder: 0,
        filters: this.allfilters1
    }
    gridConfig1: gridModel = {
        apiUrl: "Sales/PhAdvRefundReceiptList",
        columnsList: this.allColumnsRefund,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allfiltersRefund
    }


    constructor(
        public _PharAdvanceService: PharAdvanceService,
        private _loggedService: AuthenticationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._PharAdvanceService.CreaterSearchForm();
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    onChangeGrid() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('AdvfromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('Advenddate').value, "yyyy-MM-dd")
        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.PBillNo = this.myFilterform.get('AdvanceNo').value || "0"
        // this.storeId = this.myFilterform.get('IsInterimOrFinal').value
        this.getfilterGridAdv();
    }
    getfilterGridAdv() {
        this.gridConfig = {
            apiUrl: "Sales/BrowseIPPharAdvanceReceiptList",
            columnsList: this.allColumns1,
            sortField: "StoreId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals },
                { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    ClearfilterGrid(event) {
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'AdvanceNo')
            this.myFilterform.get('AdvanceNo').setValue("")
        this.onChangeGrid();
    }
    onChangeGrid1() {
        this.fromDate1 = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate1 = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")
        this.f_name1 = this.myFilterform.get('FirstName').value + "%"
        this.l_name1 = this.myFilterform.get('LastName').value + "%"
        this.regNo1 = this.myFilterform.get('RegNo').value || "0"
        this.getfilterGridRefund();
    }
    getfilterGridRefund() {
        this.gridConfig1 = {
            apiUrl: "Sales/PhAdvRefundReceiptList",
            columnsList: this.allColumnsRefund,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name1, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name1, opType: OperatorComparer.StartsWith },
                { fieldName: "From_Dt", fieldValue: this.fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate1, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo1, opType: OperatorComparer.Equals },
                { fieldName: "StoreId", fieldValue: String(this.storeId1), opType: OperatorComparer.Equals }
            ]
        }
        console.log(this.gridConfig1)
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }
    ClearfilterGrid1(event) {
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'AdvanceNo')
            this.myFilterform.get('AdvanceNo').setValue("")
        this.onChangeGrid1();
    }

    newAdvance() {
        const dialogRef = this._matDialog.open(NewAdvanceComponent,
            {
                maxWidth: "95vw",
                maxHeight: '95vh',
                height: '90%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
            // this.getIPAdvanceList();
        });
    }
    newAdvanceRef() {
        const dialogRef = this._matDialog.open(NewIPRefundAdvanceComponent,
            {
                maxWidth: "95vw",
                maxHeight: '95vh',
                height: '90%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            // this.getIPAdvanceRefundList();
            this.grid1.bindGridData();
        });
    }
    viewgetIPAdvanceReportPdf(contact) {
        console.log(contact)
        this.commonService.Onprint("AdvanceDetailID", contact.advanceDetailId, "PharamcyAdvanceReceipt");
    }
    viewgetRefundofAdvanceReportPdf(contact) {
        this.commonService.Onprint("RefundId", contact.refundId, "PharamcyAdvanceReturnReceipt");
    }
    currentDate = new Date();
    getWhatsappsAdvance(el, vmono) {

        if (vmono != '' && vmono != "0") {
            const m_data = {
                "insertWhatsappsmsInfo": {
                    "mobileNumber": vmono || 0,
                    "smsString": '',
                    "isSent": 0,
                    "smsType": 'IPPharmaAdvance',
                    "smsFlag": 0,
                    "smsDate": this.currentDate,
                    "tranNo": el,
                    "PatientType": 2,//el.PatientType,
                    "templateId": 0,
                    "smSurl": "info@gmail.com",
                    "filePath": '',
                    "smsOutGoingID": 0
                }
            }
            this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
                if (response) {
                    this.toastr.success('IP Pharma Advance Receipt Sent on WhatsApp Successfully.', 'Save !', {
                        toastClass: 'tostr-tost custom-toast-success',
                    });
                } else {
                    this.toastr.error('API Error!', 'Error WhatsApp!', {
                        toastClass: 'tostr-tost custom-toast-error',
                    });
                }
            });
        }
    }
}
export class IPAdvanceList {
    Date: any;
    AdvanceNo: number;
    RegNo: number;
    PatientName: string;
    AdvanceAmount: number;
    CashPayAmount: number;
    ChequePayAmount: number;
    CardPayAmount: any;
    UserName: any;
    IGST: any;

    constructor(IPAdvanceList) {
        {
            this.Date = IPAdvanceList.Date || 0;
            this.AdvanceNo = IPAdvanceList.AdvanceNo || 0;
            this.RegNo = IPAdvanceList.RegNo || 0;
            this.PatientName = IPAdvanceList.PatientName || '';
            this.AdvanceAmount = IPAdvanceList.AdvanceAmount || 0;
            this.CashPayAmount = IPAdvanceList.CashPayAmount || 0;
            this.ChequePayAmount = IPAdvanceList.ChequePayAmount || 0;
            this.CardPayAmount = IPAdvanceList.CardPayAmount || 0;
            this.UserName = IPAdvanceList.UserName || '';
            this.IGST = IPAdvanceList.IGST || 0;
        }
    }
}
export class IPAdvanceRefList {
    RefundDate: any;
    RefundNo: any;
    RegNo: any;
    PatientName: string;
    RefundAmount: number;
    CashPayAmount: number;
    ChequePayAmount: number;
    CardPayAmount: any;
    Remark: any;
    AddedBy: any;

    constructor(IPAdvanceRefList) {
        {
            this.RefundDate = IPAdvanceRefList.RefundDate || 0;
            this.RefundNo = IPAdvanceRefList.RefundNo || 0;
            this.RegNo = IPAdvanceRefList.RegNo || 0;
            this.PatientName = IPAdvanceRefList.PatientName || '';
            this.RefundAmount = IPAdvanceRefList.RefundAmount || 0;
            this.CashPayAmount = IPAdvanceRefList.CashPayAmount || 0;
            this.ChequePayAmount = IPAdvanceRefList.ChequePayAmount || 0;
            this.CardPayAmount = IPAdvanceRefList.CardPayAmount || 0;
            this.Remark = IPAdvanceRefList.Remark || '';
            this.AddedBy = IPAdvanceRefList.AddedBy || '';
        }
    }
}
