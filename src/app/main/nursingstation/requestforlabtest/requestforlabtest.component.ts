import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { NewRequestforlabComponent } from './new-requestforlab/new-requestforlab.component';
import { RequestforlabtestService } from './requestforlabtest.service';
import Swal from 'sweetalert2';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';

@Component({
    selector: 'app-requestforlabtest',
    templateUrl: './requestforlabtest.component.html',
    styleUrls: ['./requestforlabtest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.Prescription, permissionType.Add);

    hasSelectedContacts: boolean;
    fname = "%"
    lname = "%"
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('isStatusIcon') isStatusIcon!: TemplateRef<any>;
    @ViewChild('isTestCompletedIcon') isTestCompletedIcon!: TemplateRef<any>;
    @ViewChild('isOnFileTestIcon') isOnFileTestIcon!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;


    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isOnFileTest')!.template = this.isOnFileTestIcon;
        // this.gridConfig.columnsList.find(col => col.key === 'isTestCompleted')!.template = this.isTestCompletedIcon;
        // this.gridConfig.columnsList.find(col => col.key === 'isStatus')!.template = this.isStatusIcon;
    }

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    regNo: any = ""

    allColumns = [

        { heading: "No.", key: "reqNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IsFileON", key: "isOnFileTest", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 80 },
        { heading: "Request Date", key: "reqTime", sort: true, align: 'left', emptySign: 'NA', width: 180, type: 8 },
        { heading: "DOA", key: "admDate", sort: true, align: 'left', emptySign: 'NA', width: 110 },
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "IPD No", key: "ipdNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward Name | Bed No", key: "wardName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Payer Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Request Type", key: "requestType", sort: true, align: 'left', emptySign: 'NA', width: 150 },

        {
            heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]
    allFilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
        { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.Prescription,
        apiUrl: "IPPrescription/LabRadRequestList",
        columnsList: this.allColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter1(event) {
        if (event == 'RegNo')
            this._RequestforlabtestService.mySearchForm.get('RegNo').setValue("")
        if (event == 'fName')
            this._RequestforlabtestService.mySearchForm.get('fName').setValue("")

        if (event == 'lName')
            this._RequestforlabtestService.mySearchForm.get('lName').setValue("")

        this.onChangeFirst1();
    }

    onChangeFirst1() {
        this.regNo = this._RequestforlabtestService.mySearchForm.get('RegNo').value || '0'
        this.fname = this._RequestforlabtestService.mySearchForm.get('fName').value + "%"
        this.lname = this._RequestforlabtestService.mySearchForm.get('lName').value + "%"

        this.getfilterdata();
    }


    getfilterdata() {
        this.isShowDetailTable = false;

        let fromDate1 = this._RequestforlabtestService.mySearchForm.get("startdate").value || "";
        let toDate1 = this._RequestforlabtestService.mySearchForm.get("enddate").value || "";
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";
        this.gridConfig = {
            apiUrl: "IPPrescription/LabRadRequestList",
            columnsList: this.allColumns,
            sortField: "RegNo",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "ToDate", fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "F_Name", fieldValue: this.fname, opType: OperatorComparer.Equals },
                { fieldName: "L_Name", fieldValue: this.lname, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    viewLabRequestPdf(data) {
        this.commonService.Onprint("RequestId", data.requestId, "NurLabRequestTest");
    }

    constructor(public _RequestforlabtestService: RequestforlabtestService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService, public permissionService: PagePermissionService,
        public datePipe: DatePipe,) { }
    ngOnInit(): void {
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;

    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;

    getSelectedRow(row: any): void {

        console.log("Selected row : ", row);
        const vRequestId = row.requestId
        // debugger
        this.gridConfig1 = {
            apiUrl: "IPPrescription/LabRadRequestDetailList",
            columnsList: [

                { heading: "Status", key: "isStatus", type: gridColumnTypes.status, align: "center", width: 70 },
                {
                    heading: "Completed", key: "isTestCompleted", sort: true, align: 'left', type: gridColumnTypes.template,
                    template: this.iconisCompeleted, width: 50
                },
                { heading: "Request Date ", key: "reqDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 450 },
                { heading: "BillNo | User | DateTime", key: "addedByDate", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            ],
            sortField: "RequestId",
            sortOrder: 0,
            filters: [
                { fieldName: "RequestId", fieldValue: String(vRequestId), opType: OperatorComparer.Equals }
            ]
        }

        this.isShowDetailTable = true;

        setTimeout(() => {
            this.grid1.gridConfig = this.gridConfig1;
            this.grid1.bindGridData();
        });
    }

    onSave(row: any = null) {
        const dialogRef = this._matDialog.open(NewRequestforlabComponent,
            {
                maxHeight: '95vh',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
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

    Labrequestcancle(data) {
        // debugger
        console.log(data)
        Swal.fire({
            title: 'Do you want to cancel the Lab Request?',
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"
        }).then((flag) => {
            if (flag.isConfirmed) {
                const sub = {
                    "requestId": data.requestId
                }
                this._RequestforlabtestService.labreqCancle(sub).subscribe((response: any) => {
                    this.toastr.success(response.message);
                    this.grid.bindGridData();
                });
            }
        });
    }

    // Print part ///

    getPrint(contact) {

        console.log(contact)

        Swal.fire({
            title: 'Select Report Format',
            text: "Choose how you want to view the report:",
            icon: "warning",
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            denyButtonColor: "#6c757d",
            cancelButtonColor: "#d33",
            confirmButtonText: "With Header",
            denyButtonText: "Without Header",
        }).then((result) => {

            if (result.isConfirmed) {
                this.Printresultentrywithheader(contact);
            } else if (result.isDenied) {
                this.Printresultentry(contact);
            }
        });
    }

    Printresultentry(row) {
        // debugger
        console.log("WithHeader", row);
        const pathologyDelete = [{
            pathReportId: row.pathReportID
        }];

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._RequestforlabtestService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportPdf(row.opipType)
            }
        });
    }

    viewgetPathologyTestReportPdf(data) {
        this.commonService.Onprint("OP_IP_Type", data, "PathologyReportWithOutHeader");
    }

    Printresultentrywithheader(row: any) {

        console.log("WithHeader", row);
        const pathologyDelete = [{
            pathReportId: row.pathReportID
        }];

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._RequestforlabtestService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportwithheaderPdf(row.opipType)
            }
        });
    }

    viewgetPathologyTestReportwithheaderPdf(data) {
        this.commonService.Onprint("OP_IP_Type", data, "PathologyReportWithHeader");
    }
}
