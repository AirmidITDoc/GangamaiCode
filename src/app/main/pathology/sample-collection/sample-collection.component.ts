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
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    gridConfig: gridModel = {
        apiUrl: "Pathology/SampleCollectionList",
        columnsList: [
            { heading: "-", key: "type", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Date", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
            { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "PresReId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "100", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    gridConfig1: gridModel = {
        apiUrl: "Nursing/PrescriptionReturnList",
        columnsList: [
            { heading: "Completed", key: "completed", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "SampleNo", key: "sampleno", sort: true, align: 'left', emptySign: 'NA', width: 450 },
            { heading: "TestName", key: "testName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "CollectionDate/Time", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 150 },
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

    constructor(public _SampleCollectionService: SampleCollectionService,
         public _matDialog: MatDialog,
         public datePipe: DatePipe,
        public toastr: ToastrService,) { }
    ngOnInit(): void {
    }

    exportReportPdf() {
        // let actualData = [];
        // this.dataSource.data.forEach(e => {
        //   var tempObj = [];
        //   tempObj.push(e.RegNo);
        //   tempObj.push(e.PatientName);
        //   tempObj.push(e.AdmDate);
        //   tempObj.push(e.ReqDate);
        //   tempObj.push(e.WardName);
        //   tempObj.push(e.BedName);
        //   tempObj.push(e.IsTestCompted);
        //   tempObj.push(e.IsOnFileTest);

        //   // tempObj.push(e.PathAmount);
        //   actualData.push(tempObj);
        // });
        // let headers = [['RegNo','PatientName', 'AdmDate', 'ReqDate', 'WardName', 'BedName','IsTestCompted', 'IsOnFileTest' ]];
        // this.reportDownloadService.exportPdfDownload(headers, actualData, 'Sample Request');
    }

    exportSamplerequstReportExcel() {
        // this.sIsLoading == 'loading-data'
        // let exportHeaders = ['ReqDate', 'ReqTime', 'ServiceName', 'AddedByName', 'IsStatus','PBillNo','IsPathology','IsRadiology','IsTestCompted'];
        // this.reportDownloadService.getExportJsonData(this.dataSource1.data, exportHeaders, 'Sample Request Detail');
        // this.dataSource1.data = [];
        // this.sIsLoading = '';
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(SampledetailtwoComponent,
            {
                // maxWidth: "75vw",
                maxHeight: '75vh',
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
