import { DatePipe } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, SimpleChanges, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { ReplaySubject, Subject } from 'rxjs';
import { MrdService } from '../mrd.service';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { NewMrdComponent } from './new-mrd/new-mrd.component';
import { MrdDetailsService } from './mrd-details.service';
import { NewINMrdComponent } from './new-in-mrd/new-in-mrd.component';
import { NewOutMrdComponent } from './new-out-mrd/new-out-mrd.component';

@Component({
    selector: 'app-mrd-detail-list',
    templateUrl: './mrd-detail-list.component.html',
    styleUrls: ['./mrd-detail-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class MrdDetailListComponent {
    myFilterform: FormGroup;
    IsInout = 0
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(
        public _MrdService: MrdDetailsService,
        public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, public datePipe: DatePipe) { }

    ngOnInit(): void {
        this.myFilterform = this._MrdService.filterForm();
    }

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isInOut')!.template = this.actionsTemplate1;
        // this.gridConfig.columnsList.find(col => col.key === 'priority')!.template = this.actionsTemplate2;
        // this.gridConfig.columnsList.find(col => col.key === 'isverify')!.template = this.isverifyTemplate;


    }

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;

    allcolumns = [
        { heading: "IsInOut", key: "isInOut", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },
        { heading: "Patient Name | Age", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "OPIP Id", key: "opipid", sort: true, align: 'left', emptySign: 'NA', width: 100 },

        { heading: "Admission Time", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        // { heading: "Person Name", key: "personName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "InFile Info", key: "inFileInfo", sort: true, align: 'left', emptySign: 'NA', width: 300 },

        { heading: "OutFile Info", key: "outFileInfo", sort: true, align: 'left', emptySign: 'NA', width: 300 },



        // { heading: "Out FileId", key: "outFileId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "Out Time", key: "outTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "Out Reason", key: "outReason", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "In No", key: "inNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        //  { heading: "Return PersonName", key: "returnPersonName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "In Reason", key: "inReason", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Location", key: "location", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

    ];




    IsInOut = "0"
    gridConfig: gridModel = {
        apiUrl: "MRDFile/MRDFileReceivedList",
        columnsList: this.allcolumns,
        sortField: "RMDRecordId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
            { fieldName: "IsInOut", fieldValue: this.IsInOut, opType: OperatorComparer.Equals },

        ]
    }


    OnNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const that = this;
        const dialogRef = this._matDialog.open(NewMrdComponent,
            {
                maxWidth: "95vw",
                height: '90%',
                width: '95%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    OnEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const that = this;
        const dialogRef = this._matDialog.open(NewMrdComponent,
            {
                maxWidth: "95vw",
                height: '85%',
                width: '100%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }


    OnInFile(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const that = this;
        const dialogRef = this._matDialog.open(NewINMrdComponent,
            {
                maxWidth: "55vw",
                height: '55%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }


    OnOutFile(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button 
        const that = this;
        const dialogRef = this._matDialog.open(NewOutMrdComponent,
            {
               maxWidth: "55vw",
                height: '55%',
                width: '90%',
                data: row

            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();
        });
    }

    OnPrint(element) { }
    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")

        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "MRDFile/MRDFileReceivedList",
            columnsList: this.allcolumns,
            sortField: "RMDRecordId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "IsInOut", fieldValue: this.IsInOut, opType: OperatorComparer.Equals },

            ],
            row: 25
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
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

    onChangeIsInout(element) {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")

        if (this.myFilterform.get('IsInout').value == false) {
            this.IsInOut = "0"

        } else {
            this.IsInOut = "1"

        }
        this.getfilterdata();
    }
}

