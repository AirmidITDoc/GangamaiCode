import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { MatTableDataSource } from '@angular/material/table';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { LabSampleCollectionService } from './lab-sample-collection.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { NursingPathRadRequestList } from 'app/main/pathology/sample-request/sample-request.component';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { LabsampleCollFormComponent } from './labsample-coll-form/labsample-coll-form.component';
import { SampleCollOldMethodComponent } from './sample-coll-old-method/sample-coll-old-method.component';

@Component({
    selector: 'app-lab-sample-collection',
    templateUrl: './lab-sample-collection.component.html',
    styleUrls: ['./lab-sample-collection.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class LabSampleCollectionComponent {
    myformSearch: FormGroup;
    autocompleteModeunit: string = "Hospital";
    isShowDetailTable: boolean = false;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    status: any = "0"
    // Ptype: any = "5"
    Vtotalcount = 0
    VCompletedcount = 0
    Vpendingcount = 0
    dataSource = new MatTableDataSource<NursingPathRadRequestList>();
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    UnitId: any = this._loggedService.currentUserValue.user.unitId;
    isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;

    IsEdit: boolean = this.permissionService.getPermission(permissionCodes.ExternalInvestigation, permissionType.Edit);

    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('statusbtnTemplate') statusbtnTemplate!: TemplateRef<any>;
    @ViewChild('serviceNames') serviceNames!: TemplateRef<any>;
    @ViewChild('actionsPatientType') actionsPatientType!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action1')!.template = this.statusbtnTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'serviceNames')!.template = this.serviceNames;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsPatientType;
    }



    allcolumns = [
        {
            heading: "-", key: "action1", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.statusbtnTemplate
        },
        {
            heading: "Patient Type", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template,
            template: this.actionsPatientType
        },
        { heading: "SampleCollection Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        { heading: "Company Name", key: "cm", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        {
            heading: "Test Name", key: "serviceNames", align: "right", width: 450, sticky: true, type: gridColumnTypes.template,
            template: this.serviceNames
        },
        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];
    gridConfig: gridModel = {
        apiUrl: "LabPatientRegistration/LabSampleCollectionList",
        columnsList: this.allcolumns,
        sortField: "LabPatientId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _SampleCollectionService: LabSampleCollectionService,
        public _matDialog: MatDialog, private commonService: PrintserviceService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        private _loggedService: AuthenticationService,
        public permissionService: PagePermissionService,) { }

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

        // this.onChangeFirst();
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
        // this.Ptype = this.myformSearch.get('PatientTypeSearch').value
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
        this.gridConfig = {
            apiUrl: "LabPatientRegistration/LabSampleCollectionList",
            columnsList: this.allcolumns,
            sortField: "LabPatientId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
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
                "fieldName": "UnitId",
                "fieldValue": String(this.UnitId),
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
                    (element: any) => element.isSampleCollection == true
                ).length;

                this.Vpendingcount = this.dataSource.data.filter(
                    (element: any) => element.isSampleCollection == false
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
        const dialogRef = this._matDialog.open(SampleCollOldMethodComponent,
            {
                maxHeight: '80vh',
                width: '60%',
                data: { row: row, type: 'Lab' }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.grid1.bindGridData();
        });
    }

    onSavedemo(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(LabsampleCollFormComponent,
            {
                maxHeight: '80vh',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.grid1.bindGridData();
        });
    }

    // OnPrintPatientIcard(element) {
    //   this.commonService.OnThermalPrintNew("LabPatientId", element.labPatientId, "LabStickerPrint");
    // }

    OnPrintPatientIcard(data, serviceName) {
        const param = {
            searchFields: [
                {
                    fieldName: "LabPatientId",
                    fieldValue: String(data.labPatientId),
                    opType: "13"
                },
                {
                    fieldName: "ServiceName",
                    fieldValue: String(serviceName ?? "").trim(),
                    opType: "13"
                },
                {
                    fieldName: "OPD_IPD_Type",
                    fieldValue: "4",
                    opType: "13"
                }
            ],
            mode: "LabStickerPrint"
        };

        console.log(param);

        this._SampleCollectionService.getReportHtml(param).subscribe(res => {
            const matDialog = this._matDialog.open(HtmlviewerComponent,
                {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        html: res["html"] as string,
                        title: res["title"]
                    }
                });
            matDialog.afterClosed().subscribe(result => {
            });
        });

    }

}

export class SampleList {
  VADate: Date;
  VATime: Date;
  PathTestID: Number;
  ServiceName: String;
  IsSampleCollection: boolean;
  isSampleCollection: any;
  SampleCollectionTime: Date;
  PathReportID: any;
  SampleNo: any;
  RegNo: any;
  pathReportID: any;
  sampleNo: any;
  isApprovedByCamp: any;

  constructor(SampleList) {
    this.VADate = SampleList.VADate || '';
    this.VATime = SampleList.VATime || '';
    this.PathTestID = SampleList.PathTestID || 0;
    this.ServiceName = SampleList.ServiceName || '';
    this.IsSampleCollection = SampleList.IsSampleCollection || 0;
    this.isSampleCollection = SampleList.isSampleCollection || 0;
    this.SampleCollectionTime = SampleList.SampleCollectionTime || '';
    this.PathReportID = SampleList.PathReportID || 0;
    this.SampleNo = SampleList.SampleNo || 0;
    this.RegNo = SampleList.RegNo || 0;
    this.pathReportID = SampleList.pathReportID || 0;
    this.sampleNo = SampleList.sampleNo || 0;
    this.isApprovedByCamp = SampleList.isApprovedByCamp || 0;
  }
}