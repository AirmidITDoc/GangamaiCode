import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SampleCollectionService } from './sample-collection.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SampleList, SampledetailtwoComponent } from './sampledetailtwo/sampledetailtwo.component';
import { fuseAnimations } from '@fuse/animations';
import { NursingPathRadRequestList } from '../sample-request/sample-request.component';
import Swal from 'sweetalert2';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-sample-collection',
    templateUrl: './sample-collection.component.html',
    styleUrls: ['./sample-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SampleCollectionComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    hasSelectedContacts: boolean;



    gridConfig: gridModel = {
        apiUrl: "Nursing/PrescriptionReturnList",
        columnsList: [
            { heading: "Code", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "OP_IP_No", key: "oP_IP_No", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "VATime", key: "vATime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Visit_Adm_ID", key: "visit_Adm_ID", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "PathDate", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CompanyName", key: "vompanyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "IsSampleCollection", key: "isSampleCollection", sort: true, align: 'left', emptySign: 'NA', width: 50 },

            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._SampleCollectionService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PresReId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
            { fieldName: "Reg_No", fieldValue: "30", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "01/01/2023", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Nursing/PrescriptionReturnList",
        columnsList: [
            { heading: "Code", key: "presReId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 450 },
            { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            // { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
            // { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' ,width:150},
            // { heading: "DepartmentName", key: "departmentName", sort: true, align: 'left', emptySign: 'NA' ,width:150},
            // { heading: "TotalAmt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA',width:50 },
            // { heading: "Net Pay", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA' ,width:50},

            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._SampleCollectionService.deactivateTheStatus(data.presReId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PresReId",
        sortOrder: 0,
        filters: [

            { fieldName: "PresReId", fieldValue: "8", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _SampleCollectionService: SampleCollectionService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
    ngOnInit(): void {
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(SampledetailtwoComponent,
            {
                maxWidth: "75vw",
                height: '75%',
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
