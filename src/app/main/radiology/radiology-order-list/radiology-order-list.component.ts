import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Subscription } from 'rxjs';
import { RadioloyOrderlistService } from './radioloy-orderlist.service';
import { ResultEntryComponent } from './result-entry/result-entry.component';
import { RadiologyTemplateReportComponent } from './radiology-template-report/radiology-template-report.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ToastrService } from 'ngx-toastr';
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { template } from 'lodash';

@Component({
    selector: 'app-radiology-order-list',
    templateUrl: './radiology-order-list.component.html',
    styleUrls: ['./radiology-order-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RadiologyOrderListComponent implements OnInit {

    myformSearch: FormGroup;
    f_name: any = ""
    regNo: any = "0"
    l_name: any = ""
    status: any = "0"
    opipType: any = "2";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionsIPOP') actionsIPOP!: TemplateRef<any>;
    @ViewChild('actionsCompleted') actionsCompleted!: TemplateRef<any>;
    @ViewChild('actionsType') actionsType!: TemplateRef<any>;

    // fromDate = this.myformSearch.get("start").value || "";
    // toDate = this.myformSearch.get("end").value || "";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
    todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'opdipdtype')!.template = this.actionsIPOP;
        this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.actionsCompleted;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsType;
    }

    allColumns = [
        {
            heading: "-", key: "opdipdtype", type: gridColumnTypes.template, align: 'center', width: 50,
            template: this.actionsIPOP
        },
        {
            heading: "-", key: "isCompleted", type: gridColumnTypes.template, align: "center", width: 50,
            template: this.actionsCompleted
        },
        {
            heading: "-", key: "patientType", type: gridColumnTypes.template, align: "center", width: 50,
            template: this.actionsType
        },
        { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 9 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "AgeYear", key: "ageYear", type: gridColumnTypes.status, align: "center", width: 150 },
        { heading: "GenderName", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "TestName", key: "serviceName", type: gridColumnTypes.status, align: "center", width: 150 },
        { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "RefDoctorName", key: "refdoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    allFilters = [
        { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: "", opType: OperatorComparer.Equals },
        { fieldName: "From_Dt", fieldValue: this.fromdate, opType: OperatorComparer.Equals },
        { fieldName: "To_Dt", fieldValue: this.todate, opType: OperatorComparer.Equals },
        { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_Type", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: "1", opType: OperatorComparer.Equals },
    ]

    gridConfig: gridModel = {
        apiUrl: "RadiologyTest/RadiologyList",
        columnsList: this.allColumns,
        sortField: "RadReportId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _RadioloyOrderlistService: RadioloyOrderlistService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        //private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._RadioloyOrderlistService.filterForm()
    }

    searchRecords(data) {

        let regno = this.myformSearch.get("RegNoSearch").value || "";
        let fromDatee = this.myformSearch.get("start").value || "";
        let toDatee = this.myformSearch.get("end").value || "";
        fromDatee = fromDatee ? this.datePipe.transform(fromDatee, "yyyy-MM-dd") : "";
        toDatee = toDatee ? this.datePipe.transform(toDatee, "yyyy-MM-dd") : "";
        let patientType = this.myformSearch.get("PatientTypeSearch").value || "2";
        let status = this.myformSearch.get("StatusSearch").value || "1";
        // Update the filters dynamically
        this.gridConfig = {
            apiUrl: "RadiologyTest/RadiologyList",
            columnsList: [
                {
                    heading: "-", key: "opdipdtype", type: gridColumnTypes.template, align: 'center', width: 50,
                    template: this.actionsIPOP
                },
                {
                    heading: "-", key: "isCompleted", type: gridColumnTypes.template, align: "center", width: 50,
                    template: this.actionsCompleted
                },
                {
                    heading: "-", key: "patientType", type: gridColumnTypes.template, align: "center", width: 50,
                    template: this.actionsType
                },
                { heading: "RadDate", key: "radTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
                { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "AgeYear", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "GenderName", key: "genderName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "BillNo", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "MobileNo", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "CompanyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "RefDoctorName", key: "refdoctorName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                {
                    heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
                    template: this.actionButtonTemplate
                }
            ],
            sortField: "RadReportId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.Equals },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: String(regno), opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: fromDatee, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: toDatee, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: status, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: patientType, opType: OperatorComparer.Equals },
                { fieldName: "CategoryId", fieldValue: "1", opType: OperatorComparer.Equals },
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    onChangeFirst() {

        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstNameSearch').value + "%"
        this.l_name = this.myformSearch.get('LastNameSearch').value + "%"
        this.status = this.myformSearch.get('StatusSearch').value
        this.opipType = this.myformSearch.get('PatientTypeSearch').value
        this.regNo = this.myformSearch.get('RegNoSearch').value || ""
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "RadiologyTest/RadiologyList",
            columnsList: this.allColumns,
            sortField: "RadReportId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: this.opipType, opType: OperatorComparer.Equals },
                { fieldName: "CategoryId", fieldValue: "1", opType: OperatorComparer.Equals },
            ]

        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'RegNoSearch')
            this.myformSearch.get('RegNoSearch').setValue("")

        this.onChangeFirst();
    }

    onSave(row: any = null) {

        let that = this;
        const dialogRef = this._matDialog.open(ResultEntryComponent,
            {
                // maxWidth: "90vw",
                maxHeight: '95vh',
                width: '100%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
            this.grid.bindGridData();
            // }
        });
    }

    viewgetRadioloyTemplateReportPdf(contact) {
        debugger
        setTimeout(() => {
            let param = {
                "searchFields": [
                    {
                        "fieldName": "RadReportId",
                        "fieldValue": String(contact.radReportId),
                        "opType": "Equals"
                    },
                    {
                        "fieldName": "OP_IP_Type",
                        "fieldValue": String(contact.opdipdtype),
                        "opType": "Equals"
                    }
                ],
                "mode": "RadiologyTemplateReport"
            }

            this._RadioloyOrderlistService.getReportView(param).subscribe(res => {

                const matDialog = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Template Report" + " " + "Viewer"
                        }
                    });
                matDialog.afterClosed().subscribe(result => {
                });
            });
        }, 100);
    }

    getView(row: any = null) {

        let that = this;
        const dialogRef = this._matDialog.open(RadiologyTemplateReportComponent,
            {
                maxWidth: "75vw",
                height: '75%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
            this.grid.bindGridData();
            // }
        });
    }

    onClear() {
        this.myformSearch.get('RegNoSearch').setValue("0");
        this.myformSearch.get('StatusSearch').setValue("0");
        this.myformSearch.get('PatientTypeSearch').setValue("2");
    }
}


export class RadioPatientList {
    RadDate: Date;
    RadTime: Date;
    RegNo: any;
    PatientName: String;
    PatientType: number;
    TestName: String;
    ConsultantDoctor: any;
    CategoryName: String;
    AgeYear: number;
    GenderName: String;
    PBillNo: number;
    OPD_IPD_ID: any;
    OP_Ip_Type: any;
    IsCompleted: any;
    DoctorName: any;
    AgeGender: any;
    ServiceId: any;
    ServiceName: any;
    MobileNo: any;
    CompanyName: any;
    RefDoctorName: any;
    Doctorname: any;
    IsActive: any;

    constructor(RadioPatientList) {
        this.RadDate = RadioPatientList.RadDate || '';
        this.RadTime = RadioPatientList.RadTime;
        this.RegNo = RadioPatientList.RegNo;
        this.PatientName = RadioPatientList.PatientName;
        this.PBillNo = RadioPatientList.PBillNo;
        this.PatientType = RadioPatientList.PatientType || '0';
        this.ConsultantDoctor = RadioPatientList.ConsultantDoctor || '';
        this.TestName = RadioPatientList.TestName || '0';
        this.CategoryName = RadioPatientList.CategoryName || '';
        this.AgeYear = RadioPatientList.AgeYear;
        this.GenderName = RadioPatientList.GenderName;
        this.OPD_IPD_ID = RadioPatientList.OPD_IPD_ID || '';

        this.OP_Ip_Type = RadioPatientList.OP_Ip_Type || '';
        this.IsCompleted = RadioPatientList.IsCompleted || '0';
        this.DoctorName = RadioPatientList.DoctorName || '';
        this.AgeGender = RadioPatientList.AgeGender;
        this.ServiceId = RadioPatientList.ServiceId || 0;
        this.ServiceName = RadioPatientList.ServiceName;
        this.MobileNo = RadioPatientList.MobileNo || '';
        this.CompanyName = RadioPatientList.CompanyName;
        this.RefDoctorName = RadioPatientList.RefDoctorName || '';
        this.Doctorname = RadioPatientList.Doctorname || ''
        this.IsActive = RadioPatientList.IsActive || '';
    }

}

export class Templateinfo {

    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: String;


    /**
    * Constructor
    *
    * @param Templateinfo
    */
    constructor(Templateinfo) {
        {
            this.RegNo = Templateinfo.RegNo || '';
            this.AdmissionID = Templateinfo.AdmissionID || '';
            this.PatientName = Templateinfo.PatientName || '';
            this.Doctorname = Templateinfo.Doctorname || '';
            this.AdmDateTime = Templateinfo.AdmDateTime || '';
            this.AgeYear = Templateinfo.AgeYear || '';
            this.RadReportId = Templateinfo.RadReportId || '';
            this.RadTestID = Templateinfo.RadTestID || '';
        }
    }
}


export class RadiologyPrint {
    RegNo: Number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    AdmDateTime: string;
    AgeYear: number;
    RadReportId: number;
    RadTestID: String;
    RadDate: Date;
    RadTime: Date;
    PatientType: any;
    TestName: String;
    ConsultantDoctor: any;
    CategoryName: String;
    GenderName: String;
    PBillNo: number;
    AdmissionDate: Date;
    VisitDate: Date;
    VisitTime: Date;
    OPDNo: number;
    IPDNo: number;
    ReportDate: Date;
    ReportTime: Date;
    ResultEntry: String;
    RadiologyDocName: string;
    RefDoctorName: any;
    SuggestionNotes: string;
    UserName: string;
    PrintTestName: string;
    Education: string;
    AgeDay: any;
    ChargeId: number;
    ServiceName: String;
    OP_IP_Type: any;
    OP_IP_Number: any;
    CompanyName: any;
    DepartmentName: any;
    AgeMonth: any;
    ServiceId: any;
    TemplateId: any;
    OPD_IPD_Type: any;

    constructor(RadiologyPrint) {
        this.RadDate = RadiologyPrint.RadDate || '';
        this.CompanyName = RadiologyPrint.CompanyName || '';
        this.DepartmentName = RadiologyPrint.DepartmentName || '';
        this.RefDoctorName = RadiologyPrint.RefDoctorName || '';
        this.RadTime = RadiologyPrint.RadTime;
        this.RegNo = RadiologyPrint.RegNo;
        this.OP_IP_Number = RadiologyPrint.OP_IP_Number || '';
        this.RadTime = RadiologyPrint.RadTime;
        this.PatientName = RadiologyPrint.PatientName;
        this.PBillNo = RadiologyPrint.PBillNo;
        this.PatientType = RadiologyPrint.PatientType || '0';
        this.ConsultantDoctor = RadiologyPrint.ConsultantDoctor || '';
        this.TestName = RadiologyPrint.TestName || '0';
        this.CategoryName = RadiologyPrint.CategoryName || '';
        this.AgeYear = RadiologyPrint.AgeYear;
        this.GenderName = RadiologyPrint.GenderName;
        this.AdmissionDate = RadiologyPrint.AdmissionDate || '';
        this.VisitDate = RadiologyPrint.VisitDate || '';
        this.VisitTime = RadiologyPrint.VisitTime;
        this.OPDNo = RadiologyPrint.OPDNo;
        this.IPDNo = RadiologyPrint.IPDNo;
        this.ReportDate = RadiologyPrint.ReportDate;
        this.ReportTime = RadiologyPrint.ReportTime || '';
        this.ResultEntry = RadiologyPrint.ResultEntry || '';
        this.RadiologyDocName = RadiologyPrint.RadiologyDocName || '0';
        this.AgeMonth = RadiologyPrint.AgeMonth || '0';
        this.SuggestionNotes = RadiologyPrint.SuggestionNotes || '';
        this.UserName = RadiologyPrint.UserName;
        this.RadReportId = RadiologyPrint.RadReportId;

        this.PrintTestName = RadiologyPrint.PrintTestName;
        this.ChargeId = RadiologyPrint.ChargeId;
        this.Education = RadiologyPrint.Education;
        this.AgeDay = RadiologyPrint.AgeDay;
        this.ServiceName = RadiologyPrint.ServiceName;
        this.OP_IP_Type = RadiologyPrint.OP_IP_Type;
        this.TemplateId = RadiologyPrint.TemplateId || 0;
        this.AdmissionID = RadiologyPrint.AdmissionID || '';

        this.Doctorname = RadiologyPrint.Doctorname || '';
        this.AdmDateTime = RadiologyPrint.AdmDateTime || '';

        this.RadTestID = RadiologyPrint.RadTestID || '';
        this.ServiceId = RadiologyPrint.ServiceId || 0;
        this.OPD_IPD_Type = RadiologyPrint.OPD_IPD_Type || 0;
    }

}