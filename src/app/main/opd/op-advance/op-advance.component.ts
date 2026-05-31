import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewOpAdvanceComponent } from './new-op-advance/new-op-advance.component';
import { NewRefundOfAdvanceComponent } from './new-refund-of-advance/new-refund-of-advance.component';
import { OpAdvanceService } from './op-advance.service';

@Component({
    selector: 'app-op-advance',
    templateUrl: './op-advance.component.html',
    styleUrls: ['./op-advance.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OpAdvanceComponent {
    constructor(
        public _BrowseIpAdvanceService: OpAdvanceService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService,
        private commonService: PrintserviceService,
    ) { }

    ngOnInit(): void { }

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")


    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplateone') actionButtonTemplateone!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplateone;
    }


    @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
    @ViewChild('ipRefund', { static: false }) grid1: AirmidTableComponent;

    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    PBillNo: any = "0"

    af_name: any = ""
    aregNo: any = "0"
    al_name: any = ""
    afromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    atoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    allAdvanceFilter = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allAdvanceColumns = [
        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', type: 6 , width: 150 },
        { heading: "Advance No", key: "advanceNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "IPDNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ref DoctorName", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200},
        { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' , width: 100},
        { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Advance Amt", key: "advanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Online Pay", key: "payTMAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "User Name", key: "userName", sort: true, align: 'left', emptySign: 'NA' , width: 150},
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplateone  // Assign ng-template to the column
        }
    ]

    allRefundOfAdvanceFilters = [
        { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals }
    ]

    allRefundOfAdvanceColumns = [
        { heading: "UHIDNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Date", key: "refundDate", sort: true, align: 'left', emptySign: 'NA', width: 150, type: 6 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Advance Amt", key: "advanceUsedAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Advance UsedAmt", key: "advanceUsedAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 150 },
        { heading: "Balance Amt", key: "balanceAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Pay Date", key: "paymentDate", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 6 },
        { heading: "Cash Pay", key: "cashPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Cheque Pay", key: "chequePayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Card Pay", key: "cardPayAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount },
        { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.Advance,
        apiUrl: "Advance/BrowseAdvanceList",
        columnsList: this.allAdvanceColumns,
        sortField: "RegID",
        sortOrder: 0,
        filters: this.allAdvanceFilter
    }

    gridConfig1: gridModel = {
        permissionCode: permissionCodes.Advance,
        apiUrl: "Advance/BrowseRefundOfAdvanceList",
        columnsList: this.allRefundOfAdvanceColumns,
        sortField: "RegId",
        sortOrder: 0,
        filters: this.allRefundOfAdvanceFilters
    }

    onChangeAdvance() {
        this.fromDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this._BrowseIpAdvanceService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
        this.f_name = this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').value + "%"
        this.l_name = this._BrowseIpAdvanceService.UserFormGroup.get('LastName').value + "%"
        this.regNo = this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').value || "0"
        this.PBillNo = this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').value || "0"
        this.getfilterAdvanceList();
    }

    getfilterAdvanceList() {

        this.gridConfig = {
            apiUrl: "Advance/BrowseAdvanceList",
            columnsList: this.allAdvanceColumns,
            sortField: "RegID",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: this.PBillNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    ClearfilterAdvance(event) {
        console.log(event)
        if (event == 'FirstName')
            this._BrowseIpAdvanceService.UserFormGroup.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this._BrowseIpAdvanceService.UserFormGroup.get('LastName').setValue("")
        if (event == 'RegNo')
            this._BrowseIpAdvanceService.UserFormGroup.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this._BrowseIpAdvanceService.UserFormGroup.get('PBillNo').setValue("")

        this.onChangeAdvance();
    }

    onChangeAdvanceOfRefund() {
        this.afromDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('fromDate').value, "yyyy-MM-dd")
        this.atoDate = this.datePipe.transform(this._BrowseIpAdvanceService.AdvanceOfRefund.get('enddate').value, "yyyy-MM-dd")
        this.af_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').value + "%"
        this.al_name = this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').value + "%"
        this.aregNo = this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').value || "0"
        this.getfilterAdvanceOfRefundList();
    }

    getfilterAdvanceOfRefundList() {

        this.gridConfig1 = {
            apiUrl: "Advance/BrowseRefundOfAdvanceList",
            columnsList: this.allRefundOfAdvanceColumns,
            sortField: "RegId",
            sortOrder: 0,
            filters: [{ fieldName: "F_Name", fieldValue: this.af_name, opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: this.al_name, opType: OperatorComparer.Contains },
            { fieldName: "From_Dt", fieldValue: this.afromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.atoDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: this.aregNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    ClearfilterAdvanceOfRefund(event) {
        console.log(event)
        if (event == 'FirstName')
            this._BrowseIpAdvanceService.AdvanceOfRefund.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this._BrowseIpAdvanceService.AdvanceOfRefund.get('LastName').setValue("")
        if (event == 'RegNo')
            this._BrowseIpAdvanceService.AdvanceOfRefund.get('RegNo').setValue("")

        this.onChangeAdvanceOfRefund();
    }

    OnAdvanceViewReportPdf(element) {
        console.log(element)
        this.commonService.Onprint("AdvanceDetailID", element.advanceDetailID, "IpAdvanceReceipt");
    }


    getAdvreturnview(element) {
        console.log(element)
        this.commonService.Onprint("RefundId", element.refundId, "IpAdvanceRefundReceipt");
    }
    whatsappAppoitment(data) { }



    getSelectedRow(row: any): void {
        console.log("Selected row : ", row);
    }

    onNew1() {
        const dialogRef = this._matDialog.open(NewOpAdvanceComponent,
            {
                maxWidth: "100%",
                maxHeight: '95%',
                width: '80%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }

    onNew2() {
        const dialogRef = this._matDialog.open(NewRefundOfAdvanceComponent,
            {
                maxWidth: "100%",
                maxHeight: '95%',
                width: '80%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
        });
    }
}
