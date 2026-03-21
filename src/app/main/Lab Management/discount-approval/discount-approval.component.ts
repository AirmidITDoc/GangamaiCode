import { Overlay } from '@angular/cdk/overlay';
import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { DiscountApprovalService } from './discount-approval.service';

@Component({
    selector: 'app-discount-approval',
    templateUrl: './discount-approval.component.html',
    styleUrls: ['./discount-approval.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class DiscountApprovalComponent {
    myformSearch: FormGroup;
    autocompleteModeunit: string = "Hospital";
    autocompleteModecompany: string = "Company";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    status: any = "0"
    vCompanyId: any = "0"
    VPBillNo = "%"
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    UnitId: any = this._loggedService.currentUserValue.user.unitId;
    isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;
    approvalFormFinal: FormGroup;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.firstActionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isApproval')!.template = this.isApprovalstatus;
    }
    @ViewChild('isApprovalstatus') isApprovalstatus!: TemplateRef<any>;
    @ViewChild('firstActionButtonTemplate') firstActionButtonTemplate!: TemplateRef<any>;
    @ViewChild('statusForm') statusForm!: TemplateRef<any>;

    allcolumns = [
        { heading: "Status", key: "isApproval", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
        { heading: "PBill No", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Date-Time", key: "refundTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Patient Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Refund Amt", key: "refundAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 120 },
        { heading: "Comment", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Approved Date", key: "approvalDatetime", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        { heading: "Approved By", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.firstActionButtonTemplate
        }
    ];

    gridConfig: gridModel = {
        apiUrl: "",
        columnsList: this.allcolumns,
        sortField: "RefundId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsApproved", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _discApprovalService: DiscountApprovalService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe, private _formBuilder: UntypedFormBuilder,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        public permissionService: PagePermissionService,
        private overlay: Overlay,) { }

    ngOnInit(): void {
        this.myformSearch = this._discApprovalService.createSearchForm()
        // this.GetSampleCollectiondetail()
        this.approvalFormFinal = this._discApprovalService.CreateForm();

        this.myformSearch.get('UnitId').setValue(this._loggedService.currentUserValue.user.unitId)
    }

    ListViewcompany(value) {
        console.log(value)
        if (value.value !== 0)
            this.vCompanyId = value.value
        else
            this.vCompanyId = 0

        this.onChangeFirst();
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = 0

        // this.onChangeFirst();
    }

    onChangeFirst() {
        // debugger
        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value || "0"
        this.status = this.myformSearch.get('StatusSearch').value
        this.VPBillNo = this.myformSearch.get('PBillNo').value || "%"
        this.vCompanyId = this.myformSearch.get('CompanyId').value || "0"
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
        this.gridConfig = {
            apiUrl: "",
            columnsList: this.allcolumns,
            sortField: "RefundId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsApproved", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
                { fieldName: "PBillNo", fieldValue: String(this.VPBillNo), opType: OperatorComparer.StartsWith },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }


    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("")
        if (event == 'PBillNo')
            this.myformSearch.get('PBillNo').setValue("")

        this.onChangeFirst();
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    openStatus() {

    }
}
