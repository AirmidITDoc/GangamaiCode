import { Component, Inject, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { template } from 'lodash';


@Component({
    selector: 'app-sample-collection',
    templateUrl: './sample-collection.component.html',
    styleUrls: ['./sample-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SampleCollectionComponent implements OnInit {
    myformSearch:FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    @ViewChild('iconlbl') iconlbl!: TemplateRef<any>;
    @ViewChild('iconcompanyName') iconcompanyName!: TemplateRef<any>;
    @ViewChild('iconisSampleCollection') iconisSampleCollection!: TemplateRef<any>;
    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'lbl')!.template = this.iconlbl;
        this.gridConfig.columnsList.find(col => col.key === 'companyName')!.template = this.iconcompanyName;
        this.gridConfig.columnsList.find(col => col.key === 'isSampleCollection')!.template = this.iconisSampleCollection;
        this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.iconisCompeleted;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    hasSelectedContacts: boolean;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name:any = "" 
    regNo:any="0"
    l_name:any="" 

    status:any="1"
    Ptype:any="2"
    allcolumns=[
        { heading: "-", key: "lbl", width: 30, sort: true, align: 'left', type: gridColumnTypes.template },
        { heading: "-", key: "companyName", width: 30, sort: true, align: 'left', type: gridColumnTypes.template },
        { heading: "-", key: "isSampleCollection", width: 50, sort: true, align: 'left', type: gridColumnTypes.template },
        { heading: "Date", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "UHID No", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PBillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PatientType", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "CompanyName", key: "cm", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
        // {
        //     heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate  // Assign ng-template to the column
        // } 
    ];
    gridConfig: gridModel = {
        apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
        columnsList: this.allcolumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "1", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "2", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _SampleCollectionService: SampleCollectionService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public toastr: ToastrService,) { }

    ngOnInit(): void {
this.myformSearch=this._SampleCollectionService.createSearchForm()
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;

    getSelectedRow(row: any): void {
        console.log("selectedRow:",row)
        let billNo = row.billNo;
        let inputDate = row.vaDate;
        let parts = inputDate.split(' ')[0].split('-');
        let date = `${parts[2]}-${parts[1]}-${parts[0]}`;
        let opipType = row.lbl === 'OP' ? 0 : 1;

        this.gridConfig1 = {
            apiUrl: "PathlogySampleCollection/SampleCollectionTestList",
            columnsList: [
                { heading: "Completed", key: "isCompleted", sort: true, align: 'left',type: gridColumnTypes.template, 
                    template:this.iconisCompeleted, width: 50 },
                { heading: "SampleNo", key: "sampleNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 400 },
                { heading: "CollectionDate/Time", key: "time", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            ],
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: String(billNo), opType: OperatorComparer.Equals },
                { fieldName: "BillDate", fieldValue: date, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: String(opipType), opType: OperatorComparer.Equals },
            ]
        };

        this.isShowDetailTable = true;

        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        });
    }

     onChangeFirst() {
        debugger
    this.isShowDetailTable = false;
            this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
            this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
            this.f_name = this.myformSearch.get('FirstName').value + "%"
            this.l_name = this.myformSearch.get('LastName').value + "%"
            this.regNo = this.myformSearch.get('RegNo').value || ""
            this.status = this.myformSearch.get('StatusSearch').value 
            this.Ptype = this.myformSearch.get('PatientTypeSearch').value 

            this.getfilterdata();
        }
    
    getfilterdata(){
        
        this.gridConfig = {
            apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
            columnsList:this.allcolumns , 
            sortField: "RegNo",
            sortOrder: 0,
            filters:  [
                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue:  this.Ptype, opType: OperatorComparer.Equals }
        
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
       
        this.onChangeFirst();
      }

    exportReportPdf() {
    
    }

    
    exportSamplerequstReportExcel(){}

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
            // if (result) {
                this.grid.bindGridData();
            // }
        });
    }

}
