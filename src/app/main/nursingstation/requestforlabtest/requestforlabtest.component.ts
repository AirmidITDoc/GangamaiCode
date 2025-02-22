import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { RequestforlabtestService } from './requestforlabtest.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { NewRequestforlabComponent } from './new-requestforlab/new-requestforlab.component';
import { Subscription } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-requestforlabtest',
    templateUrl: './requestforlabtest.component.html',
    styleUrls: ['./requestforlabtest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    gridConfig: gridModel = {
        apiUrl: "Nursing/LabRequestList",
        columnsList: [
            { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "RequestType", key: "requestType", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IsOnFileTest", key: "isOnFileTest", sort: true, align: 'left', emptySign: 'NA', width: 50 },

            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._RequestforlabtestService.deactivateTheStatus(data.requestId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "requestId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    gridConfig1: gridModel = {
        apiUrl: "Nursing/LabRequestDetailsList",
        columnsList: [
            { heading: "IsBillingStatus", key: "isBillingStatus", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IsTestStatus", key: "patientName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ReqDate", key: "reqDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ReqTime", key: "reqTime", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "AddedBy", key: "addedby", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Add Billing User", key: "billingUser", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "BillDateTime", key: "billdatetime", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "PBill No", key: "pBillno", sort: true, align: 'left', emptySign: 'NA'},

            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._RequestforlabtestService.deactivateTheStatus(data.RequestId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "RequestId",
        sortOrder: 0,
        filters: [
            { fieldName: "RequestId", fieldValue: "29475", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "30", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _RequestforlabtestService: RequestforlabtestService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        public datePipe: DatePipe,) { }
    ngOnInit(): void {
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewRequestforlabComponent,
            {
                // maxWidth: "95vw",
                maxHeight: '95vh',
                // height:'90%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}
