import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { SampleCollectionService } from './sample-collection.service';
import { SampledetailtwoComponent } from './sampledetailtwo/sampledetailtwo.component';

import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { SamplecollectionPageComponent } from './samplecollection-page/samplecollection-page.component';
import { NursingPathRadRequestList } from '../sample-request/sample-request.component';
import { MatTableDataSource } from '@angular/material/table';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';


@Component({
    selector: 'app-sample-collection',
    templateUrl: './sample-collection.component.html',
    styleUrls: ['./sample-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class SampleCollectionComponent implements OnInit {
    myformSearch: FormGroup;
    isShowDetailTable: boolean = false;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    status: any = "0"
    Ptype: any = "5"
    Vtotalcount = 0
    VCompletedcount = 0
    Vpendingcount = 0
    dataSource = new MatTableDataSource<NursingPathRadRequestList>();
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    UnitId: any = this._loggedService.currentUserValue.user.unitId;
    isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;
    autocompleteModeunit: string = "Hospital";

    IsEdit: boolean = this.permissionService.getPermission(permissionCodes.PathologyResultlist, permissionType.Edit);

    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;
    @ViewChild('iconPatientType') iconPatientType!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('statusbtnTemplate') statusbtnTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action1')!.template = this.statusbtnTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.iconPatientType;
    }

    gridConfig1: gridModel = new gridModel();

    allcolumns = [
        {
            heading: "-", key: "action1", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.statusbtnTemplate
        },
        { heading: "Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 6 },
        // { heading: "DOA", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Admission No", key: "oP_IP_No", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        {
            heading: "Patient Type", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template,
            template: this.iconPatientType, width: 180
        },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Company Name", key: "cm", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Ward Name", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];
    gridConfig: gridModel = {
        permissionCode: permissionCodes.PathologyResultlist,
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
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OPIPType", fieldValue: "5", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _SampleCollectionService: SampleCollectionService,
        public _matDialog: MatDialog, private commonService: PrintserviceService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public permissionService: PagePermissionService,
        private _loggedService: AuthenticationService,) { }

    ngOnInit(): void {
        this.myformSearch = this._SampleCollectionService.createSearchForm()
        this.GetSampleCollectiondetail()
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = 0

        this.onChangeFirst();
    }
    getSelectedRow(row: any): void {
        // debugger
        console.log("selectedRow:", row)
        let billNo = row.billNo;

        let rawDate = row.pathDate;
        let day = rawDate.split("T")[0];
        let rest = rawDate.split("T")[1].split("-");
        let month = rest[0];
        let year = rest[1];

        let formattedDate = `${day}`

        console.log(formattedDate);

        let opipType = row.lbl === 'OP' ? 0 : 1;
        if (row.lbl == 'Lab')
            opipType = 4

        this.gridConfig1 = {
            apiUrl: "PathlogySampleCollection/SampleCollectionTestList",
            columnsList: [
                {
                    heading: "Status", key: "isCompleted", sort: true, align: 'left', type: gridColumnTypes.template,
                    template: this.iconisCompeleted, width: 50
                },
                { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 400 },
                { heading: "Sample No | Collected By", key: "sampleNo", sort: true, align: 'left', emptySign: 'NA', width: 300 },
                { heading: "Collection Date/Time", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                {
                    heading: "Action", key: "action", align: "right", width: 250, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate1
                }
            ],
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: String(billNo), opType: OperatorComparer.Equals },
                { fieldName: "BillDate", fieldValue: formattedDate, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: String(opipType), opType: OperatorComparer.Equals },
            ]
        };

        this.isShowDetailTable = true;

        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();


        });
        console.log(this.gridConfig1)
    }

    onChangeFirst() {
        // debugger
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value || "0"
        this.status = this.myformSearch.get('StatusSearch').value
        this.Ptype = this.myformSearch.get('PatientTypeSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
        this.gridConfig = {
            apiUrl: "PathlogySampleCollection/SampleCollectionPatientList",
            columnsList: this.allcolumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "OPIPType", fieldValue: this.Ptype, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        this.GetSampleCollectiondetail()

    }

    GetSampleCollectiondetail() {

        let fromDateControl = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd");
        let toDateControl = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd");

        this.Vtotalcount = 0;
        this.VCompletedcount = 0;
        this.Vpendingcount = 0;
        // debugger
        let filters: any[] = [];

        // Handle date range
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.f_name),
                "opType": "Contains"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.l_name),
                "opType": "Contains"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.regNo),
                "opType": "Equals"
            },

            {
                "fieldName": "From_Dt",
                "fieldValue": this.fromDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.toDate,
                "opType": "GreaterThanOrEqual"
            },
            {
                "fieldName": "IsCompleted",
                "fieldValue": String(this.status),
                "opType": "Equals"
            },
            {
                "fieldName": "OPIPType",
                "fieldValue": String(this.Ptype),
                "opType": "Equals"
            }
        );

        let data = {
            "first": 0,
            "rows": 999999,
            "sortField": "RegNo",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._SampleCollectionService.getSampleCollectionlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data)
            if (this.dataSource.data.length > 0) {
                // debugger
                this.Vtotalcount = this.dataSource.data.length
                this.VCompletedcount = this.dataSource.data.filter(
                    (element: any) => element.isSampleCollection == 'True'
                ).length;

                this.Vpendingcount = this.dataSource.data.filter(
                    (element: any) => element.isSampleCollection == 'False'
                ).length;

                console.log(this.dataSource.data)
            }
        });
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myformSearch.get('RegNo').setValue("0")

        this.onChangeFirst();
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(SamplecollectionPageComponent,
            {
                maxHeight: '85vh',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.grid1.bindGridData();

        });
    }
    OnPrintPatientIcard(element) {
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("AdmissionId", element.visit_Adm_ID, "IPStickerPrint");
    }

}
