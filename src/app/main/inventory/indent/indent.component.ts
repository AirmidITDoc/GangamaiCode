import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IndentService } from './indent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Action } from 'rxjs/internal/scheduler/Action';
import { ToastrService } from 'ngx-toastr';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { MatTabGroup } from '@angular/material/tabs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { NewIndentComponent } from './new-indent/new-indent.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
    selector: 'app-indent',
    templateUrl: './indent.component.html',
    styleUrls: ['./indent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IndentComponent implements OnInit {
    hasSelectedContacts: boolean;
    IndentSearchGroup: FormGroup;
    autocompletestore: string = "Store";
    Status="1"
    FromStore:any="0"
    Tostore:any="0"
    fromDate = "2025-01-01"//this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate =this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;


    allcolumns = [

        { heading: "Verify", key: "isverify", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IndentNo", key: "indentNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Indent Date", key: "indentDate", sort: true, align: 'left', emptySign: 'NA',type:6 },
        { heading: "From Store Name", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "To Store Name", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Added By", key: "addedby", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._IndentService.deactivateTheStatus(data.IndentId).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.grid.bindGridData();
                        });
                    }
                }]
        } 
    ]

    gridConfig: gridModel = {
        apiUrl: "Indent/IndentList",
        columnsList: this.allcolumns,
        sortField: "IndentId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Status", fieldValue: this.Status, opType: OperatorComparer.Equals }
        ]
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    GetDetails1(data) {
        let IndentId = data.indentId
        this.gridConfig1 = {
            apiUrl: "Indent/IndentList",
            columnsList: this.allcolumns,
            sortField: "IndentId",
            sortOrder: 0,
            filters: [
                { fieldName: "IndentId", fieldValue:IndentId, opType: OperatorComparer.Equals },
              
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    constructor(
        public _IndentService: IndentService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.IndentSearchGroup = this._IndentService.IndentSearchFrom();
    }

    ListView(value) {
        if (value.value !== 0)
            this.FromStore = value.value
        else
            this.FromStore = "0"
        this.onChangeFirst(value);
    }

    ListView1(value) {
        if (value.value !== 0)
            this.Tostore = value.value
        else
            this.Tostore = "0"
        this.onChangeFirst(value);
    }

    onChangeFirst(value) {
        if(this.IndentSearchGroup.get('Status').value)
            this.Status="0"
          else
          this.Status="1"
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.IndentSearchGroup.get('startdate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.IndentSearchGroup.get('enddate').value, "yyyy-MM-dd")
        this.FromStore = this.IndentSearchGroup.get("FromStoreId").value || this.FromStore
        this.Tostore = this.IndentSearchGroup.get("ToStoreId").value || this.Tostore
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "Indent/IndentList",
            columnsList: this.allcolumns,
            sortField: "IndentId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromStoreId", fieldValue: this.FromStore, opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: this.Tostore, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "Status", fieldValue: this.Status, opType: OperatorComparer.Equals }
            ],
            row: 25
        }

        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }


    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewIndentComponent,
            {
                // maxWidth: "95vw",
                maxHeight: '75vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    selectChangeStore(obj: any) {
        this.gridConfig.filters[2].fieldValue = obj.value
    }
}