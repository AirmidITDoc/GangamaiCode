import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IssueToDepartmentService } from './issue-to-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, indexOf, round, values } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from "rxjs/operators";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { IssueToDeparmentAgainstIndentComponent } from './issue-to-deparment-against-indent/issue-to-deparment-against-indent.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
    selector: 'app-issue-to-department',
    templateUrl: './issue-to-department.component.html',
    styleUrls: ['./issue-to-department.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedContacts: boolean;
   
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "IssueToDepartment/IssueToDepttList",
    columnsList: [
        { heading: "Code", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width:100 },
        { heading: "From StoreId", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA', width:150 },
        { heading: "To StoreId", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width:150 },
        { heading: "FromStoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width:700 },
          //  { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width:50, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._IssueToDepartmentService.deactivateTheStatus(data.IssueId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: "10003", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "11/11/2024", opType: OperatorComparer.Equals },
            { fieldName: "IsVerify ", fieldValue: "0", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    gridConfig1: gridModel = {
        apiUrl: "IssueToDepartment/IssueToDepttList",
    columnsList: [
        { heading: "Code", key: "issueNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "From StoreId", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "To StoreId", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "FromStoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA' },
          //  { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._IssueToDepartmentService.deactivateTheStatus(data.IssueId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: "10003", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: "1009", opType: OperatorComparer.Equals },
           { fieldName: "From_Dt", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "11/11/2024", opType: OperatorComparer.Equals },
            { fieldName: "IsVerify ", fieldValue: "0", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
   
    constructor(
        public _IssueToDepartmentService: IssueToDepartmentService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}