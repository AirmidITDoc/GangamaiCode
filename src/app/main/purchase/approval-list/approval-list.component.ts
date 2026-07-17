import { DatePipe } from '@angular/common';
import { Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs/internal/Observable';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ConfigService } from 'app/core/services/config.service';
import { ApprovalListService } from './approval-list.service';
import { NewPurchaseorderComponent } from '../purchase-order/new-purchaseorder/new-purchaseorder.component';


@Component({
    selector: 'app-approval-list',
    templateUrl: './approval-list.component.html',
    styleUrls: ['./approval-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ApprovalListComponent implements OnInit {

    dateTimeObj: any;
    Status: any = "0";
    screenFromString = 'admission-form';
    fromDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")


    @ViewChild('grid') grid: AirmidTableComponent;


    @ViewChild('actionTemplate') actionTemplate!: TemplateRef<any>;
    @ViewChild('approvalStatus') approvalStatus!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'approvalStatus')!.template = this.approvalStatus;
    }


    allColumns = [
        {
            heading: "-", key: "approvalStatus", sort: true, align: 'left', emptySign: 'NA', width: 50, type: gridColumnTypes.template,
            template: this.approvalStatus
        },
        { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 70, type: 6 },
        { heading: "", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 60, type: 7 },
        { heading: "Approval No", key: "approvalNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Approval Assign To", key: "authorizedBy", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Transaction Type", key: "transactionType", sort: true, align: 'left', emptySign: 'NA', width: 220 },
        { heading: "Approval Date", key: "approvedDateTime", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 9 },
        { heading: "AddedBy", key: "createdBy", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Remark", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionTemplate
        }
    ]
    // {
    //     "approvalId": 8,
    //     "approvalNo": "129",
    //     "date": "2026-07-14T00:00:00",
    //     "time": "2026-07-14T17:48:00",
    //     "tranId": 170323,
    //     "transactionType": "PURCHASE ORDER",
    //     "approvalStatus": 0,
    //     "approvedDateTime": "1900-01-01T00:00:00",
    //     "comment": "Admin",
    //     "createdBy": "Shalini Pandit",
    //     "createdDate": "2026-07-14T17:47:52.977",
    //     "modifiedBy": "Shalini Pandit",
    //     "modifiedDate": "2026-07-14T17:47:52.977",
    //     "authorizedBy": "Subhash Subhash"
    // }
    allFilters = [
        { fieldName: "ApprovalStatus", fieldValue: String(this.Status), opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        //  permissionCode: permissionCodes.GRNReturn,
        apiUrl: "Approval/ApprovalList",
        columnsList: this.allColumns,
        sortField: "ApprovalId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _ApprovalListService: ApprovalListService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _ConfigService: ConfigService,
        private accountService: AuthenticationService,
        public toastr: ToastrService,
        private commonService: PrintserviceService,
    ) { }
    ngOnInit(): void {

    }
    onChangeFirst() {
        if (this._ApprovalListService.ApprovalForm.get('Status').value == true) {
            this.Status = "1"
        } else {
            this.Status = "0"
        }
        this.fromDate = this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this._ApprovalListService.ApprovalForm.get('end').value, "yyyy-MM-dd")
        this.getfilterdata();
    }
    getfilterdata() {
        this.gridConfig = {
            apiUrl: "Approval/ApprovalList",
            columnsList: this.allColumns,
            sortField: "ApprovalId",
            sortOrder: 0,
            filters: [
                { fieldName: "ApprovalStatus", fieldValue: String(this.Status), opType: OperatorComparer.Equals },
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    onPrint(row) {
        this.commonService.Onprint("GRNReturnId", row.grnReturnId, "GRNReturnReport");
    }
    
    OnEdit(contact) {
        console.log(contact)

        const dialogRef = this._matDialog.open(NewPurchaseorderComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    Obj: contact,
                    FromName: 'PurchaseApproved',

                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.grid.bindGridData();
            debugger
            if(result != true){
                this.onVerify(contact);
            }
     
        }); 
    }
    CommanList:any;
    //Purchase Header list 
        getCommanApprovalDateList(contact) {
        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "PurchaseId",
            "sortOrder": 0,
            "filters": [{ "fieldName": "PurchaseId", "fieldValue": String(contact?.tranId || 0), "opType": "Equals" }],
            "exportType": "JSON",
            "columns": [{ "data": "string", "name": "string" }]
        }
        this._ApprovalListService.getPurchaseheaderlist(data).subscribe(res => {
            console.log(data);
            this.CommanList = res.data[0] 
            if((this.CommanList?.purchaseID || 0) > 0){
                this.OnEdit(this.CommanList); 
            }
        });
    }

        onVerify(row) {
            debugger
        const submitData = {
            "purchaseId": row?.purchaseID,
            "isVerifiedId": 1
        };
        this._ApprovalListService.getVerifyPurchaseOrdert(submitData).subscribe(response => {
            this.grid.bindGridData()
        });
    }
}

