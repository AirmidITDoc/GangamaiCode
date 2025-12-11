import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
    selector: 'app-lab-reg-bill-deatils',
    templateUrl: './lab-reg-bill-deatils.component.html',
    styleUrls: ['./lab-reg-bill-deatils.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LabRegBillDeatilsComponent {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    BillNo = "0"
    doctorName = ""
   
    // @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('iconisPathology') iconisPathology!: TemplateRef<any>;
    @ViewChild('iconisRadiology') iconisRadiology!: TemplateRef<any>;
    @ViewChild('icons') icons!: TemplateRef<any>;
    // @ViewChild('isCompleted') iconisCompleted!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'icon')!.template = this.icons;
        // this.gridConfig.columnsList.find(col => col.key === 'isPathology')!.template = this.iconisPathology;
        this.gridConfig.columnsList.find(col => col.key === 'isRadiology')!.template = this.iconisRadiology;
        // this.gridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.iconisCompleted;
//   this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    }

    allcolumns = [

        // { heading: "--", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:10 },

        { heading: "--", key: "icon",align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:80,template: this.icons  },
        // { heading: "--", key: "isPathology",align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:30 },
        // { heading: "--", key: "isRadiology", align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width:30 },
        { heading: "BillNo", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "isCompleted", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        {
            heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
             template: this.actionButtonTemplate
        }

    ];
    gridConfig: gridModel = {
        apiUrl: "LabPatientRegistration/LabBillDetailList",
        columnsList: this.allcolumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
        ]
    }

    ngOnInit(): void {
        if (this.data) {
            debugger
            this.BillNo = this.data.billNo
            this.doctorName = this.data.doctorName
            this.getBilldetail()
        }
    }

    constructor(public _labPatientRegService: LabPatientRegService,
        private _loggedService: AuthenticationService,
        public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        private commonService: PrintserviceService,) { }

    getBilldetail() {
        this.getfilterdata()
    }

    getfilterdata() {
        this.gridConfig = {
            apiUrl: "LabPatientRegistration/LabBillDetailList",
            columnsList: this.allcolumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: this.BillNo, opType: OperatorComparer.Equals }
            ]
        }
        // debugger
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

    }


    viewgetPathologyTestReportPdf(data) {
        const param = {
            searchFields: [
                {
                    fieldName: "OP_IP_Type",
                    fieldValue: "4",
                    opType: "Equals"
                }
            ],
            mode: "PathologyReportWithOutHeader"
        };

        console.log(param);

        this._labPatientRegService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "Pathology Test Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });

    }

    onClose() {
        this._matDialog.closeAll()
    }
}
