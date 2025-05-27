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

@Component({
    selector: 'app-requestforlabtest',
    templateUrl: './requestforlabtest.component.html',
    styleUrls: ['./requestforlabtest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class RequestforlabtestComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;

    hasSelectedContacts: boolean;
    @ViewChild('isStatusIcon') isStatusIcon!: TemplateRef<any>;
    @ViewChild('isTestCompletedIcon') isTestCompletedIcon!: TemplateRef<any>;

    ngAfterViewInit() {
        // this.gridConfig.columnsList.find(col => col.key === 'isStatus')!.template = this.isStatusIcon;
        // this.gridConfig.columnsList.find(col => col.key === 'isTestCompleted')!.template = this.isTestCompletedIcon;
    }

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    regNo: any = ""

    allColumns = [
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "WardName", key: "wardName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RequestType", key: "requestType", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsOnFileTest", key: "isOnFileTest", sort: true, align: 'left', emptySign: 'NA', width: 50 },

        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.print, callback: (data: any) => {
                        this.viewLabRequestPdf(data);
                        this.grid.bindGridData();
                    }
                }]
        }
    ]
    allFilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        apiUrl: "IPPrescription/LabRadRequestList",
        columnsList: this.allColumns,
        sortField: "RegNo",
        sortOrder: 0,
        filters: this.allFilters
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'RegNo')
            this._RequestforlabtestService.mySearchForm.get('RegNo').setValue("")
        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this._RequestforlabtestService.mySearchForm.get('RegNo').value
        this.getfilterdata();
    }

    getfilterdata() {
        debugger
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
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals }
            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    viewLabRequestPdf(data) {
        this.commonService.Onprint("RequestId", data.requestId, "NurLabRequestTest");
    }

    constructor(public _RequestforlabtestService: RequestforlabtestService, public _matDialog: MatDialog,
        public toastr: ToastrService, private commonService: PrintserviceService,
        public datePipe: DatePipe,) { }
    ngOnInit(): void {
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;

    getSelectedRow(row: any): void {

        console.log("Selected row : ", row);
        let vRequestId = row.requestId

        this.gridConfig1 = {
            apiUrl: "IPPrescription/LabRadRequestDetailList",
            columnsList: [
                {
                    heading: "IsBillingStatus", key: "isStatus", sort: true, align: 'left', type: gridColumnTypes.template,
                    template: this.isStatusIcon, width: 50
                },
                {
                    heading: "IsTestStatus", key: "isTestCompleted", sort: true, align: 'left', type: gridColumnTypes.template,
                    template: this.isTestCompletedIcon, width: 50
                },
                { heading: "ReqDate", key: "reqDate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ReqTime", key: "reqTime", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
                { heading: "AddedBy", key: "addedByName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Add Billing User", key: "billingUser", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "BillDateTime", key: "addedByDate", sort: true, align: 'left', emptySign: 'NA', width: 200 },
                { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },

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

    viewgetPathologyTemplateReportPdf() {

    }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewRequestforlabComponent,
            {
                // maxWidth: "95vw",
                maxHeight: '95vh',
                // height:'90%',
                width: '80%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            // if (result) {
            this.grid.bindGridData();
            // }
        });
    }

}
