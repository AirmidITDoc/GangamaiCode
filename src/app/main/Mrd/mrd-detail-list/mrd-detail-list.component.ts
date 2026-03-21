import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { MrdDetailsService } from './mrd-details.service';
import { NewINMrdComponent } from './new-in-mrd/new-in-mrd.component';
import { NewMrdComponent } from './new-mrd/new-mrd.component';
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
    }

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;

    allcolumns = [
        { heading: "IsInOut", key: "isInOut", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 70 },
        { heading: "mrdno", key: "mrdno", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Patient Name | Age", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        // { heading: "DOD", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
        { heading: "IPNo", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "InFile Info", key: "inFileInfo", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "OutFile Info", key: "outFileInfo", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Location", key: "location", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "createdBy", key: "createdBy", sort: true, align: 'left', emptySign: 'NA', width: 100 },
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

