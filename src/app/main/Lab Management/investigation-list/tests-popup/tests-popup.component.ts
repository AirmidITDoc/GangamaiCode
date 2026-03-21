import { Component, Input, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { OperatorComparer, gridModel } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { InvestigationListService } from '../investigation-list.service';

@Component({
    selector: 'app-tests-popup',
    templateUrl: './tests-popup.component.html',
    styleUrls: ['./tests-popup.component.scss']
})
export class TestsPopupComponent {
    @Input() patientData: any;

    policyFormGroup: FormGroup;
    policyHistory: any[] = [];
    vBillNo: any = 0
    formattedDate: any;
    OpdIpdID: any;
    registerObj = new TestDetails({});

    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('Testcolors') Testcolors!: TemplateRef<any>;

    constructor(
        private _investListService: InvestigationListService,
        public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        console.log("Test data:", this.patientData)
        this.registerObj = this.patientData
        this.OpdIpdID = this.registerObj.labPatientId
        this.vBillNo = this.registerObj.billNo

        const rawDate = this.registerObj.pathDate;
        const day = rawDate.split("T")[0];
        const rest = rawDate.split("T")[1].split("-");
        const month = rest[0];
        const year = rest[1];

        this.formattedDate = `${day}`

        this.getfilterdata(this.patientData);
    }

    onClose() {
        this._matDialog.closeAll();
    }
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'specimenColorName')!.template = this.Testcolors;
    }

    allColumns = [
        {
            heading: "Specimen Color", key: "specimenColorName", sort: true, align: 'left', type: gridColumnTypes.template,
            template: this.Testcolors
        },
        { heading: "Test Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    gridConfig: gridModel = {
        apiUrl: "LabPatientRegistration/LabSampleCollectionDetailList",
        columnsList: this.allColumns,
        sortField: "BillNo",
        sortOrder: 0,
        filters: [
            { fieldName: "BillNo", fieldValue: String(this.vBillNo), opType: OperatorComparer.Equals },
            { fieldName: "BillDate", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
        ]
    }

    getfilterdata(row) {
        console.log("selectedRow:", row)

        this.gridConfig = {
            apiUrl: "LabPatientRegistration/LabSampleCollectionDetailList",
            columnsList: this.allColumns,
            sortField: "BillNo",
            sortOrder: 0,
            filters: [
                { fieldName: "BillNo", fieldValue: String(this.vBillNo), opType: OperatorComparer.Equals },
                { fieldName: "BillDate", fieldValue: this.formattedDate, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
            ]
        }
        setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }, 100);
    }

    OnPrintPatientIcard(data) {
        const param = {
            searchFields: [
                {
                    fieldName: "LabPatientId",
                    fieldValue: String(data.visit_Adm_ID),
                    opType: "13"
                },
                {
                    fieldName: "ServiceName",
                    fieldValue: String(data.serviceName ?? "").trim(),
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

        this._investListService.getReportHtml(param).subscribe(res => {
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

export class TestDetails {
    labPatientId: any;
    pathDate: any;
    admissionTime: any;
    billNo: any;
    /**
     * Constructor
     *
     * @param TestDetails
     */

    constructor(TestDetails) {
        {
            this.labPatientId = TestDetails.labPatientId || '';
            this.pathDate = TestDetails.pathDate || new Date()
            this.billNo = TestDetails.billNo || 0
            // this.AreaName = TestDetails.AreaName || '';
            // this.AadharCardNo = TestDetails.AadharCardNo || '';
            // this.PanCardNo = TestDetails.PanCardNo || '';
        }
    }
}
