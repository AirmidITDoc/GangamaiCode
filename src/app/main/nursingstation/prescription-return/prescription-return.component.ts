import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PrescriptionReturnService } from './prescription-return.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { NewPrescriptionreturnComponent } from './new-prescriptionreturn/new-prescriptionreturn.component';
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
    selector: 'app-prescription-return',
    templateUrl: './prescription-return.component.html',
    styleUrls: ['./prescription-return.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PrescriptionReturnComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    gridConfig: gridModel = {
        apiUrl: "IPPrescription/PrescriptionReturnList",
        columnsList: [            
            { heading: "Date", key: "date", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Reg No", key: "regNo", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Patient Name", key: "patientname", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Adm Date", key: "admDate", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA'},
            { heading: "IPMedID", key: "ipMedId", sort: true, align: 'left', emptySign: 'NA'},   
            {
                heading: "Action", key: "action",width: 50,align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._PrescriptionReturnService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            },//Action 1-view, 2-Edit,3-delete
            
        ],
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "1008", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _PrescriptionReturnService: PrescriptionReturnService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        public datePipe: DatePipe) { }
    ngOnInit(): void {
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    GetDetails1(data){
        this.gridConfig1 = {
            apiUrl: "IPPrescription/PrescriptionDetailList",
            columnsList: [
                { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "BatchNo", key: "medicalRecoredId", sort: true, align: 'left', emptySign: 'NA'},
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA'},
            ],
            sortField: "IPMedID",
            sortOrder: 0,
            filters: [
                { fieldName: "IPMedID", fieldValue: "334", opType: OperatorComparer.Equals }
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewPrescriptionreturnComponent,
            {
                maxWidth: "80vw",
                height: '90%',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

}
