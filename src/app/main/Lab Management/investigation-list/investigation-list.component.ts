import { animate, state, style, transition, trigger } from '@angular/animations';
import { SelectionModel } from '@angular/cdk/collections';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { DatePipe } from '@angular/common';
import { Component, ComponentRef, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, gridRequest, gridResponseType, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { HtmlviewerComponent } from 'app/main/htmlviewer/htmlviewer.component';
import { AdmissionPersonlModel } from 'app/main/ipd/Admission/admission/admission.component';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { PatientDetailsPopoverComponent } from 'app/main/opd/appointment-list/patient-details-popover/patient-details-popover.component';
import { OutsourceDetailsPopoverComponent } from 'app/main/pathology/result-entry/outsource-details-popover/outsource-details-popover.component';
import { OutsourceDetailsComponent } from 'app/main/pathology/result-entry/outsource-details/outsource-details.component';
import { PatientList, SampleDetailObj, SampleList } from 'app/main/pathology/result-entry/result-entry.component';
import { NursingPathRadRequestList } from 'app/main/pathology/sample-request/sample-request.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { EmailSendComponent } from 'app/main/shared/componets/email-send/email-send.component';
import { SMSDetailsPopupOverComponent } from 'app/main/shared/componets/email-send/smsdetails-popup-over/smsdetails-popup-over.component';
import { WhatsappDetPopUpOverComponent } from 'app/main/shared/componets/email-send/whatsapp-det-pop-up-over/whatsapp-det-pop-up-over.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { LabTrackingDetailsComponent } from '../lab-patient-reg/lab-tracking-details/lab-tracking-details.component';
import { NewLabresultEntryComponent } from '../lab-result-list/new-labresult-entry/new-labresult-entry.component';
import { NewLabtemplateComponent } from '../lab-result-list/new-labtemplate/new-labtemplate.component';
import { LabsampleNewFromComponent } from '../lab-sample-collection/labsample-new-from/labsample-new-from.component';
import { SampleCollOldMethodComponent } from '../lab-sample-collection/sample-coll-old-method/sample-coll-old-method.component';
import { InvestigationListService } from './investigation-list.service';
import { TestsPopupComponent } from './tests-popup/tests-popup.component';

function formatDate(rawDate: string): string {
    if (!rawDate) return '';

    // Case 1: ISO format with T → 2026-01-15T00:00:00
    if (rawDate.includes('T')) {
        return rawDate.split('T')[0]; // 2026-01-15
    }

    // Case 2: Space format → 15-01-2026 00:00:00
    if (rawDate.includes(' ')) {
        const datePart = rawDate.split(' ')[0]; // 15-01-2026
        const [day, month, year] = datePart.split('-');
        return `${year}-${month}-${day}`; // 2026-01-15
    }

    return '';
}

@Component({
    selector: 'app-investigation-list',
    templateUrl: './investigation-list.component.html',
    styleUrls: ['./investigation-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    // animations: fuseAnimations,
    animations: [
        ...fuseAnimations,
        trigger('detailExpand', [
            state('collapsed', style({ height: '0px', minHeight: '0' })),
            state('expanded', style({ height: '*' })),
            transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
        ]),
    ]
})

export class InvestigationListComponent {
    constructor(public _InvestListService: InvestigationListService, public _matDialog: MatDialog,
        public toastr: ToastrService, public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public _ConfigService: ConfigService,
        public _whatsppService: WhatsAppEmailService,
        public _FormvalidationserviceService: FormvalidationserviceService,
        private overlay: Overlay,
        public formBuilder: UntypedFormBuilder,
        private advanceDataStored: AdvanceDataStored,
        public accountService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.myformSearch = this._InvestListService.createSearchForm()
        this.GetSampleCollectiondetail()
        this.bindSampleParentGridData();
        this.isSuperAdmin = this.accountService.currentUserValue.user.isAdminMultiview;
        setInterval(() => {
            this.sampleDetailDS.data = [...this.sampleDetailDS.data];
        }, 1000);

        ////////// Sample Recevied    
        this.ReceviedformSearch = this._InvestListService.createReceiveSearchForm();
        this.ReceFormGroup = this.RecevicedFormInsert();

        this.ReceviedfromDate = this.ReceviedformSearch.get("start").value || "";
        this.ReceviedtoDate = this.ReceviedformSearch.get("end").value || "";
        this.GetSampleRecevicedetail();

        ////////// Result Entry
        this.ResultmyformSearch = this._InvestListService.ResultcreateSearchForm()
        this.ResultfromDate = this.ResultmyformSearch.get("start").value || "";
        this.ResulttoDate = this.ResultmyformSearch.get("end").value || "";
        this.GetResultdetail();
        this.bindParentGridData();

        ///////// Approval
        this.ApprovalmyformSearch = this._InvestListService.ApprovalcreateSearchForm()
        this.ApprovalfromDate = this.ApprovalmyformSearch.get("start").value || "";
        this.ApprovaltoDate = this.ApprovalmyformSearch.get("end").value || "";
        this.GetApprovaldetail();

        ///////// Print
        this.PrintmyformSearch = this._InvestListService.PrintcreateSearchForm()
        this.PrintfromDate = this.PrintmyformSearch.get("start").value || "";
        this.PrinttoDate = this.PrintmyformSearch.get("end").value || "";
        this.reportlogFormGroup = this.createReportlogForm();

        ///////// Print completed
        this.PrintCompletedmyformSearch = this._InvestListService.printCompletedSearchForm()
        this.PrintCompletedfromDate = this.PrintCompletedmyformSearch.get("start").value || "";
        this.PrintCompletedtoDate = this.PrintCompletedmyformSearch.get("end").value || "";

    }

    ///////////////// Sample Collection //////////////////////
    myformSearch: FormGroup;
    autocompleteModeunit: string = "Hospital";
    autocompleteModecompany: string = "Company";
    isShowDetailTable: boolean = false;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    status: any = "0"
    vCompanyId: any = "0"
    VPBillNo = "%"
    // Ptype: any = "5"
    Vtotalcount = 0
    VCompletedcount = 0
    Vpendingcount = 0
    dataSource = new MatTableDataSource<NursingPathRadRequestList>();
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    UnitId: any = this.accountService.currentUserValue.user.unitId;
    isSuperAdmin: any = 0;

    // IsEdit: boolean = this.permissionService.getPermission(permissionCodes.ExternalInvestigation, permissionType.Edit);

    @ViewChild('iconisCompeleted') iconisCompeleted!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('statusbtnTemplate') statusbtnTemplate!: TemplateRef<any>;
    @ViewChild('serviceNames') serviceNames!: TemplateRef<any>;
    @ViewChild('actionsPatientType') actionsPatientType!: TemplateRef<any>;
    @ViewChild('patientNameWithPopoverTemplate') patientNameWithPopoverTemplate!: TemplateRef<any>;

    @ViewChild('isCompletedstatus') isCompletedstatus!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'action1')!.template = this.statusbtnTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'serviceNames')!.template = this.serviceNames;
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsPatientType;
        this.gridConfig.columnsList.find(col => col.key === 'patientName')!.template = this.patientNameWithPopoverTemplate;

        // Result
        this.ResultgridConfig.columnsList.find(col => col.key === 'Resultaction')!.template = this.ResultactionButtonTemplate;

        // Approval
        this.ApprovalgridConfig.columnsList.find(col => col.key === 'Approvalaction')!.template = this.ApprovalactionButtonTemplate;
        this.PrintgridConfig.columnsList.find(col => col.key === 'Printaction')!.template = this.printactionButtonTemplate;
        this.ApprovalgridConfig.columnsList.find(col => col.key === 'isCompleted')!.template = this.isCompletedstatus;
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
        { heading: "SampleCollection Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', type: 8 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA' },
        {
            heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA',
            type: gridColumnTypes.template
        },

        { heading: "Company Name", key: "cm", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA' },
        // {
        //   heading: "Test Name", key: "serviceNames", align: "right", width: 450, sticky: true, type: gridColumnTypes.template,
        //   template: this.serviceNames
        // },
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
            { fieldName: "CompanyId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "PBillNo", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
        ]
    }

    ListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.UnitId = value.value
        else
            this.UnitId = 0

        // this.onChangeFirst();
    }

    onChangeFirst(row: any = null) {
        // debugger
        this.isShowDetailTable = false;
        this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.f_name = this.myformSearch.get('FirstName').value + "%"
        this.l_name = this.myformSearch.get('LastName').value + "%"
        this.regNo = this.myformSearch.get('RegNo').value || "0"
        this.status = this.myformSearch.get('SampleStatusSearch').value
        this.VPBillNo = this.myformSearch.get('PBillNo').value || "%"
        this.vCompanyId = this.myformSearch.get('CompanyId').value || "0"
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
                { fieldName: "CompanyId", fieldValue: String(this.vCompanyId), opType: OperatorComparer.Equals },
                { fieldName: "PBillNo", fieldValue: String(this.VPBillNo), opType: OperatorComparer.StartsWith },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
            ]
        }
        setTimeout(() => {
            this.grid.gridConfig = this.gridConfig;
            this.grid.bindGridData();
        }, 100);
        this.GetSampleCollectiondetail()
        this.bindSampleParentGridData();
    }

    GetSampleCollectiondetail() {

        const fromDateControl = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd");

        this.Vtotalcount = 0;
        this.VCompletedcount = 0;
        this.Vpendingcount = 0;
        // debugger
        const filters: any[] = [];

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
                "fieldName": "CompanyId",
                "fieldValue": String(this.vCompanyId),
                "opType": "Equals"
            },
            {
                "fieldName": "PBillNo",
                "fieldValue": String(this.VPBillNo),
                "opType": "Contains"
            },
            {
                "fieldName": "UnitId",
                "fieldValue": String(this.UnitId),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "RegNo",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._InvestListService.getSampleCollectionlist(data).subscribe((response) => {
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
        if (event == 'RegNo') {
            this.myformSearch.get('RegNo').setValue("")
            this.regNo = 0
        }
        if (event == 'PBillNo') {
            this.myformSearch.get('PBillNo').setValue("")
            this.VPBillNo = '%'
        }

        this.onChangeFirst();
    }

    ListViewcompany(value) {
        console.log(value)
        if (value.value !== 0)
            this.vCompanyId = value.value
        else
            this.vCompanyId = 0

        this.onChangeFirst();
    }

    dataSourceSampleParent = new MatTableDataSource<any>();
    sampleDetailDS = new MatTableDataSource<SampleList>();

    parentSampleColumns: string[] = ['status', 'pathDate', 'labRequestNo', 'patientName', 'cm', 'pBillNo', 'action'];
    parentSampleDetColumns: string[] = ['status', 'color', 'serviceName', 'tat', 'sampleNo', 'outSourceLabName', 'action'];
    columnsToDisplayWithSampleExpand = [...this.parentSampleColumns];
    expandedSampleElement: any | null = null;
    parentSampleLength = 0;
    @ViewChild('parentSamplePaginator') parentSamplePaginator: MatPaginator;

    bindSampleParentGridData() {
        const gridDataRequest: gridRequest = {
            sortField: this.gridConfig.sortField,
            sortOrder: this.gridConfig.sortOrder,
            filters: this.gridConfig.filters,
            columns: this.gridConfig.columnsList.map(x => ({ Name: x.heading, Data: x.key })),
            first: (this.parentSamplePaginator?.pageIndex ?? 0),
            rows: (this.parentSamplePaginator?.pageSize ?? 25),
            exportType: gridResponseType.JSON
        };

        this._InvestListService.getSampleDetlist(gridDataRequest).subscribe((data: any) => {
            this.dataSourceSampleParent.data = data.data as [];
            this.parentSampleLength = data["recordsFiltered"];
        });
    }

    toggleSampleRow(element: any) {
        if (this.expandedSampleElement === element) {
            this.expandedSampleElement = null;
        } else {
            this.expandedSampleElement = element;
            this.getSampleSelectedRow(element);
        }
    }

    getSpecimenColor(contact: any): string {
        if (!contact?.specimenColorName) {
            return '#ccc';
        }
        return contact.specimenColorName.replace(/\s+/g, '').toLowerCase();
    }

    getSampleSelectedRow(row: any): void {
        console.log("Selected row : ", row);

        this.dataSource1.data = [];
        this.selection.clear();

        this.reportPrintObj = row
        this.reportPrintObj["DOA"] = row.pathDate

        this.PatientName = row.patientName;
        this.OPD_IPD = row.oP_IP_No
        this.Age = row.ageYear
        this.PatientType = row.patientType
        this.Mobileno = row.mobileNo
        this.SBillNo = row.billNo;
        this.SOPIPtype = row.opdipdtype;

        this.getSampledetailList(row);
    }

    getSampledetailList(row) {
        this.sampleDetailDS.data = [];
        const formattedDate = formatDate(row.pathDate);
        // let formattedDate = `${day}`

        console.log(formattedDate);

        const m_data = {
            "first": 0,
            "rows": 20,
            "sortField": "BillNo",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "BillNo",
                    "fieldValue": String(row.billNo),
                    "opType": "Equals"
                },
                {
                    "fieldName": "BillDate",
                    "fieldValue": formattedDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "OP_IP_Type",
                    "fieldValue": "4",
                    "opType": "Equals"
                },
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        console.log(m_data);
        this._InvestListService.PathSampleDetailList(m_data).subscribe(Visit => {
            this.sampleDetailDS.data = Visit.data as SampleList[];
            console.log("ResultList:", this.sampleDetailDS.data)
            this.sampleDetailDS.sort = this.sort;
            this.sampleDetailDS.paginator = this.paginator;

        });
    }

    onSave(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(SampleCollOldMethodComponent,
            {
                maxHeight: '80vh',
                width: '60%',
                data: { row: row, type: 'Lab' }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            // this.grid1.bindGridData();
            this.GetSampleCollectiondetail();
            this.getSampledetailList(row);
        });
    }

    onSavedemo(row: any = null) {
        const that = this;
        const dialogRef = this._matDialog.open(LabsampleNewFromComponent,
            {
                height: '85vh',
                width: '85%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.GetSampleCollectiondetail();
            this.getSampledetailList(row);
        });
    }

    OnPrintPatientIcard(data, serviceName) {
        const labId = data.visit_Adm_ID ?? data.labPatientId
        const param = {
            searchFields: [
                {
                    fieldName: "LabPatientId",
                    fieldValue: String(labId),
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

        this._InvestListService.getReportHtml(param).subscribe(res => {
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

    trackingdetail(element) {
        console.log(element)
        const dialogRef = this._matDialog.open(LabTrackingDetailsComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '60%',
                data: element

            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.GetSampleCollectiondetail();
        });

    }

    openPolicyInfoPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Close any existing popover
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
            return;
        }

        const positionStrategy = this.overlay.position()
            .flexibleConnectedTo(event.target as HTMLElement)
            .withPositions([
                {
                    // Prefer bottom position
                    originX: 'center',
                    originY: 'bottom',
                    overlayX: 'center',
                    overlayY: 'top',
                },
                {
                    // Fallback to top if no space below
                    originX: 'center',
                    originY: 'top',
                    overlayX: 'center',
                    overlayY: 'bottom',
                },
                {
                    // Fallback to right
                    originX: 'end',
                    originY: 'center',
                    overlayX: 'start',
                    overlayY: 'center',
                },
                {
                    // Fallback to left
                    originX: 'start',
                    originY: 'center',
                    overlayX: 'end',
                    overlayY: 'center',
                }
            ]);

        this.overlayRef = this.overlay.create({
            positionStrategy,
            scrollStrategy: this.overlay.scrollStrategies.close(),
            hasBackdrop: true,
            backdropClass: 'cdk-overlay-transparent-backdrop'
        });

        const portal = new ComponentPortal(TestsPopupComponent);
        const componentRef: ComponentRef<TestsPopupComponent> = this.overlayRef.attach(portal);
        componentRef.instance.patientData = patientData;

        this.overlayRef.backdropClick().subscribe(() => {
            this.overlayRef?.dispose();
            this.overlayRef = null;
        });
    }

    getSampleDateTime(doa: string, dot: string): Date | null {
        if (!doa || !dot) return null;

        const [day, month, year] = doa.trim().split('/');

        const time = dot.trim().toUpperCase();

        const match = time.match(/(\d+):(\d+)\s*(AM|PM)/);

        if (!match) {
            console.log('Invalid time format:', dot);
            return null;
        }

        let hours = parseInt(match[1], 10);
        const minutes = parseInt(match[2], 10);
        const period = match[3];

        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;

        return new Date(+year, +month - 1, +day, hours, minutes);
    }

    // getRemainingTime(contact: any): string {
    //     const tatDay = Number(contact.tatday || 0);
    //     const tatHour = Number(contact.tathour || 0);
    //     const tatMin = Number(contact.tatmin || 0);

    //     const tatMinutes = (tatDay * 24 * 60) + (tatHour * 60) + tatMin;

    //     const sampleDateTime = this.getSampleDateTime(contact.doa, contact.dot);

    //     if (!sampleDateTime || isNaN(sampleDateTime.getTime())) {
    //         return 'Invalid';
    //     }

    //     const endTime = new Date(sampleDateTime.getTime() + tatMinutes * 60000);

    //     const diff = endTime.getTime() - new Date().getTime();

    //     if (diff <= 0) return 'Expired';

    //     const totalMinutes = Math.floor(diff / 60000);

    //     const days = Math.floor(totalMinutes / (24 * 60));
    //     const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    //     const mins = totalMinutes % 60;

    //     return `${days}d ${hours}h ${mins}m`;
    // }
    getRemainingTime(contact: any): string {
        const tatDay = Number(contact.tatday || 0);
        const tatHour = Number(contact.tathour || 0);
        const tatMin = Number(contact.tatmin || 0);

        const tatMinutes = (tatDay * 24 * 60) + (tatHour * 60) + tatMin;

        // ✅ ADD THIS
        if (tatMinutes === 0) {
            return 'No TAT'; // or '' if you want empty
        }

        const sampleDateTime = this.getSampleDateTime(contact.doa, contact.dot);

        if (!sampleDateTime || isNaN(sampleDateTime.getTime())) {
            return 'Invalid';
        }

        const endTime = new Date(sampleDateTime.getTime() + tatMinutes * 60000);

        const diff = endTime.getTime() - new Date().getTime();

        if (diff <= 0) return 'Expired';

        const totalMinutes = Math.floor(diff / 60000);

        const days = Math.floor(totalMinutes / (24 * 60));
        const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
        const mins = totalMinutes % 60;

        return `${days}d ${hours}h ${mins}m`;
    }

    getTatProgress(contact: any): number {
        const tatDay = Number(contact.tatday || 0);
        const tatHour = Number(contact.tathour || 0);
        const tatMin = Number(contact.tatmin || 0);

        const totalMinutes = (tatDay * 24 * 60) + (tatHour * 60) + tatMin;

        const sampleDateTime = this.getSampleDateTime(contact.doa, contact.dot);
        if (!sampleDateTime) return 0;

        const now = new Date();

        const elapsedMinutes = Math.floor(
            (now.getTime() - sampleDateTime.getTime()) / 60000
        );

        if (elapsedMinutes <= 0) return 0;
        if (elapsedMinutes >= totalMinutes) return 100;

        return Math.floor((elapsedMinutes / totalMinutes) * 100);
    }
    ///////////////// Sample Recevied  //////////////////////
    ReceviedformSearch: FormGroup;
    ReceFormGroup: FormGroup;

    ReceviedfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ReceviedtoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    Receviedf_name: any = "%"
    Receviedl_name: any = "%"
    Receviedstatus: any = "0"
    ReceviedCompanyId: any = "0"
    ReceviedregNo: any = "0"
    ReceviedPBillNo = "%"
    ReceviedUnitId: any = this.accountService.currentUserValue.user.unitId;
    RecevieddataSource = new MatTableDataSource<ReceSampleList>();

    RecevieddisplayedColumns = [
        'CheckBox',
        'datetime',
        'samplecollectiondatetime',
        'patientName',
        'serviceName',
        'outSourceLabName',
        'Recevieddate',
        'ReceviedBy',
    ];

    ReceviedListViewcompany(value) {
        console.log(value)
        if (value.value !== 0)
            this.ReceviedCompanyId = value.value
        else
            this.ReceviedCompanyId = 0

        this.ReceviedonChangeFirst()
    }

    ReceviedListView1(value) {
        console.log(value)
        if (value.value !== 0)
            this.ReceviedUnitId = value.value
        else
            this.ReceviedUnitId = 0

        this.ReceviedonChangeFirst();
    }

    ReceviedonChangeFirst(row: any = null) {
        // debugger
        this.ReceviedfromDate = this.datePipe.transform(this.ReceviedformSearch.get('start').value, "yyyy-MM-dd")
        this.ReceviedtoDate = this.datePipe.transform(this.ReceviedformSearch.get('end').value, "yyyy-MM-dd")
        this.Receviedf_name = this.ReceviedformSearch.get('FirstName').value + "%"
        this.Receviedl_name = this.ReceviedformSearch.get('LastName').value + "%"
        this.ReceviedregNo = this.ReceviedformSearch.get('RegNo').value || "0"
        this.Receviedstatus = this.ReceviedformSearch.get('ReceiveStatusSearch').value
        this.ReceviedPBillNo = this.ReceviedformSearch.get('PBillNo').value || "%"
        this.ReceviedCompanyId = this.ReceviedformSearch.get('CompanyId').value || "0"
        this.GetSampleRecevicedetail();
    }

    ReceviedClearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.ReceviedformSearch.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.ReceviedformSearch.get('LastName').setValue("")
        if (event == 'RegNo')
            this.ReceviedformSearch.get('RegNo').setValue("0")
        if (event == 'PBillNo')
            this.ReceviedformSearch.get('PBillNo').setValue("")

        this.ReceviedonChangeFirst();
    }

    Receviedselection = new SelectionModel<ReceSampleList>(true, []);
    SelectedList: any = [];
    isCheckboxDisabled(row: any): boolean {
        return row.isSampleReceivedStatus === true;
    }
    areAllRowsDisabled(): boolean {
        return this.RecevieddataSource?.data?.length
            ? this.RecevieddataSource.data.every(row => this.isCheckboxDisabled(row))
            : true;
    }
    ReceviedmasterToggle() {
        if (this.ReceviedisAllSelected()) {
            this.Receviedselection.clear();
        } else {
            this.RecevieddataSource.data
                .filter(row => !row.isSampleReceivedStatus) // ✅ only remaining 3
                .forEach(row => this.Receviedselection.select(row));
        }
    }
    ReceviedisAllSelected() {
        const selectableRows = this.RecevieddataSource.data.filter(
            row => !row.isSampleReceivedStatus
        );

        return this.Receviedselection.selected.length === selectableRows.length;
    }
    ReceviedisSomeSelected() {
        return this.Receviedselection.selected.length > 0 && !this.ReceviedisAllSelected();
    }

    GetSampleRecevicedetail() {

        // let fromDateControl = this.datePipe.transform(this.ReceviedformSearch.get('start').value, "yyyy-MM-dd");
        // let toDateControl = this.datePipe.transform(this.ReceviedformSearch.get('end').value, "yyyy-MM-dd");
        // debugger
        const filters: any[] = [];

        // Handle date range
        // if (fromDateControl && toDateControl) {
        //   this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
        //   this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        // }
        filters.push(
            {
                "fieldName": "F_Name",
                "fieldValue": String(this.Receviedf_name),
                "opType": "StartsWith"
            },
            {
                "fieldName": "L_Name",
                "fieldValue": String(this.Receviedl_name),
                "opType": "StartsWith"
            },
            {
                "fieldName": "Reg_No",
                "fieldValue": String(this.ReceviedregNo),
                "opType": "Equals"
            },
            {
                "fieldName": "From_Dt",
                "fieldValue": this.ReceviedfromDate,
                "opType": "Equals"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": this.ReceviedtoDate,
                "opType": "Equals"
            },
            {
                "fieldName": "IsReceived",
                "fieldValue": String(this.Receviedstatus),
                "opType": "Equals"
            },
            {
                "fieldName": "PBillNo",
                "fieldValue": String(this.ReceviedPBillNo),
                "opType": "Equals"
            },
            {
                "fieldName": "CompanyId",
                "fieldValue": String(this.ReceviedCompanyId),
                "opType": "Equals"
            },
            {
                "fieldName": "UnitId",
                "fieldValue": String(this.ReceviedUnitId),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999999,
            "sortField": "LabPatientId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._InvestListService.getSampleRecivedlist(data).subscribe((response) => {
            this.RecevieddataSource.data = response.data;
            console.log("RecevieddataSource:", this.RecevieddataSource.data)
        });
    }

    RecevicedFormInsert(): FormGroup {
        return this.formBuilder.group({
            pathologyLabReport: this.formBuilder.array([])// FormArray for details
        });
    }

    createReceviedDetail(item: any = {}): FormGroup {
        return this.formBuilder.group({
            pathReportId: [item.pathReportID, [this._FormvalidationserviceService.onlyNumberValidator()]],
            sampleReceviedDateTime: [this.getNow()],//new Date()],
            sampleReceviedUserId: this.accountService.currentUserValue.userId,
            isSampleReceivedStatus: true
        });
    }

    get receivedDetailsArray(): FormArray {
        return this.ReceFormGroup.get('pathologyLabReport') as FormArray;
    }

    getNow(): string {
        const d = new Date();
        return (
            d.getFullYear() + '-' +
            String(d.getMonth() + 1).padStart(2, '0') + '-' +
            String(d.getDate()).padStart(2, '0') + 'T' +
            String(d.getHours()).padStart(2, '0') + ':' +
            String(d.getMinutes()).padStart(2, '0')
        );
    }

    OnSave() {
        if (this.Receviedselection.selected.length === 0) {
            Swal.fire('Error!', 'Please select sample data', 'error');
            return;
        }
        debugger
        this.receivedDetailsArray.clear();
        this.Receviedselection.selected.forEach(item => {
            this.receivedDetailsArray.push(this.createReceviedDetail(item));
        });
        console.log(this.ReceFormGroup.value);

        this._InvestListService.UpdateSampleRecived(this.ReceFormGroup.value).subscribe(() => {
            // this._matDialog.closeAll();
            this.GetSampleRecevicedetail();
        });
    }
    OnReset() {
        // this.getSupplierList();
        this.SelectedList = [];
        this.Receviedselection.clear();
        this.ReceviedformSearch.reset({
            ReceiveStatusSearch: "0",
            start: [new Date().toISOString()],
            end: [new Date().toISOString()],
            UnitId: [this.accountService.currentUserValue.user.unitId]
        });
    }

    // Patient popup

    private patOverlayRef: OverlayRef | null = null;
    private PatihoverTimeout: any = null;
    private RecepatientCloseTimeout: any = null;

    openDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.PatihoverTimeout) {
            clearTimeout(this.PatihoverTimeout);
        }

        // Add small delay to prevent flickering
        this.PatihoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.patOverlayRef) {
                this.patOverlayRef.dispose();
                this.patOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.patOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(PatientDetailsPopoverComponent);
            const componentRef: ComponentRef<PatientDetailsPopoverComponent> = this.patOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.patOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.RecekeepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closeDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.PatihoverTimeout) {
            clearTimeout(this.PatihoverTimeout);
            this.PatihoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.RecepatientCloseTimeout) {
            clearTimeout(this.RecepatientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.RecepatientCloseTimeout = setTimeout(() => {
            if (this.patOverlayRef) {
                this.patOverlayRef.dispose();
                this.patOverlayRef = null;
            }
        }, 200);
    }

    RecekeepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.outSourceCloseTimeout) {
            clearTimeout(this.outSourceCloseTimeout);
            this.outSourceCloseTimeout = null;
        }
    }
    //////////////////////////// Result Entry ////////////////////////////////
    SpinLoading: boolean = false;
    ResultVtotalcount = 0
    ResultVCompletedcount = 0
    ResultVpendingcount = 0

    reportPrintObjList: SampleDetailObj[] = [];
    reportPrintObjs: SampleDetailObj;
    currentDate = new Date();
    click: boolean = false;
    printTemplate: any;
    MouseEvent = true;
    screenFromString = 'opd-casepaper';
    PatientTypeList: any = [];
    ResultmyformSearch: FormGroup;
    isLoading = true;
    msg: any;
    step = 0;
    dataArray = {};
    sIsLoading: string = '';
    isSampleCollection: boolean = true;
    ServiceIdList: any = [];
    PathReportID: any;
    PathTestId: any
    subscriptionArr: Subscription[] = [];
    reportPrintObj: AdmissionPersonlModel;
    SBillNo: any;
    SOPIPtype: any;
    SFromDate: any;
    PatientName: any;
    OPD_IPD: any;
    Age: any;
    PatientType: any;
    dateTimeObj: any;
    chargeslist = [];
    resultSource = [];
    printdata = [];
    Mobileno: any;
    setStep(index: number) {
        this.step = index;
    }
    SearchName: string;
    OP_IPType: any;
    Iscompleted: any;
    reportIdData: any = [];
    ServiceIdData: any = [];

    ResultfromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ResulttoDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    searchregNo: any;
    // vOPIPId = 0;
    Resultf_name: any = "%"
    ResultregNo: any = "0"
    Resultl_name: any = "%"

    age = ''
    gendername = ''

    vStatusSearch: any = "0";
    vApproStatusSearch: any = "0";
    patientName: 'RK'
    title: 'Reports'
    page: PageNames = PageNames.PATIENT;
    pathFiles: PageNames = PageNames.PATIENT_PATHFILES;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // dataSource = new MatTableDataSource<PatientList>();
    dataSource1 = new MatTableDataSource<SampleList>();
    // resultSource = new MatTableDataSource<SampleList>();

    @ViewChild(MatPaginator) PathTestpaginator: MatPaginator;

    displayedColumns1: string[] = [
        'select',
        // 'IsCompleted',
        // 'IsTemplateTest',
        // 'outSourceStatus',
        // 'isVerifyid',
        // 'action1',
        'status',
        'verify',
        'CategoryName',
        'TestName',
        'color',
        'tat',
        'SampleNo',
        'outSourceLabName',
        'action'
    ];

    hasSelectedContacts: boolean;
    // UnitId: any = this._loggedService.currentUserValue.user.unitId;
    // isSuperAdmin: any = this._loggedService.currentUserValue.user.isAdminMultiview;

    @ViewChild('Resultgrid', { static: false }) Resultgrid: AirmidTableComponent;
    @ViewChild('ResultactionButtonTemplate') ResultactionButtonTemplate!: TemplateRef<any>;

    // IsEdit: boolean = this.permissionService.getPermission(permissionCodes.ExternalInvestigation, permissionType.Edit);

    fromdate = this.fromDate ? this.datePipe.transform(this.fromDate, "yyyy-MM-dd") : "";
    todate = this.toDate ? this.datePipe.transform(this.toDate, "yyyy-MM-dd") : "";

    Resultallcolumns = [
        { heading: "Test Date", key: "doa", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        // { heading: "DOA", key: "vaTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Age | Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Unit Name", key: "hospitalName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "PBill No", key: "pBillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        {
            heading: "Action", key: "Resultaction", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.ResultactionButtonTemplate  // Assign ng-template to the column
        }
    ];

    ResultgridConfig: gridModel = {
        // permissionCode: permissionCodes.ExternalInvestigation,
        apiUrl: "LabPatientRegistration/LabResultList",
        columnsList: this.Resultallcolumns,
        sortField: "PresReId",
        sortOrder: 0,
        filters: [

            { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt ", fieldValue: this.ResultfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt ", fieldValue: this.ResulttoDate, opType: OperatorComparer.Equals },
            { fieldName: "IsCompleted", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
        ]
    }


    searchRecords(data) {
        debugger
        this.dataSource1.data = [];
        this.selection.clear();

        const regno = this.ResultmyformSearch.get("RegNoSearch").value || "0";
        let fromDate = this.ResultmyformSearch.get("start").value || "";
        let toDate = this.ResultmyformSearch.get("end").value || "";
        fromDate = fromDate ? this.datePipe.transform(fromDate, "yyyy-MM-dd") : "";
        toDate = toDate ? this.datePipe.transform(toDate, "yyyy-MM-dd") : "";
        const status = this.ResultmyformSearch.get("ResultStatusSearch").value || "0";

        this.GetResultdetail()
        // Update the filters dynamically
        this.ResultgridConfig = {
            apiUrl: "LabPatientRegistration/LabResultList",

            columnsList: this.Resultallcolumns,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [

                { fieldName: "F_Name ", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: regno, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt ", fieldValue: fromDate, opType: OperatorComparer.Equals }, //"2024-01-01"
                { fieldName: "To_Dt ", fieldValue: toDate, opType: OperatorComparer.Equals }, //"2024-10-01"
                { fieldName: "IsCompleted", fieldValue: status, opType: OperatorComparer.Equals },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
            ]
        }
        setTimeout(() => {
            this.Resultgrid.gridConfig = this.ResultgridConfig;
            this.Resultgrid.bindGridData();
        }, 100);
        this.bindParentGridData();
    }

    getSelectedRow(row: any): void {
        console.log("Selected row : ", row);

        this.dataSource1.data = [];
        this.selection.clear();

        this.reportPrintObj = row
        this.reportPrintObj["DOA"] = row.pathDate

        this.PatientName = row.patientName;
        this.OPD_IPD = row.oP_IP_No
        this.Age = row.ageYear
        this.PatientType = row.patientType
        this.Mobileno = row.mobileNo
        this.SBillNo = row.billNo;
        this.SOPIPtype = row.opdipdtype;

        this.getSampledetailList1(row);
    }

    @ViewChild('parentPaginator') parentPaginator: MatPaginator;
    dataSourceParent = new MatTableDataSource<any>();
    parentColumns: string[] = ['dot', 'labRequestNo', 'patientName', 'genderName', 'hospitalName', 'pBillNo', 'doctorName', 'action'];
    columnsToDisplayWithExpand = [...this.parentColumns];
    expandedElement: any | null = null;
    parentResultsLength = 0;

    bindParentGridData() {
        const gridDataRequest: gridRequest = {
            sortField: this.ResultgridConfig.sortField,
            sortOrder: this.ResultgridConfig.sortOrder,
            filters: this.ResultgridConfig.filters,
            columns: this.ResultgridConfig.columnsList.map(x => ({ Name: x.heading, Data: x.key })),
            first: (this.parentPaginator?.pageIndex ?? 0),
            rows: (this.parentPaginator?.pageSize ?? 25),
            exportType: gridResponseType.JSON
        };

        this._InvestListService.getresultenterylist(gridDataRequest).subscribe((data: any) => {
            this.dataSourceParent.data = data.data as [];
            this.parentResultsLength = data["recordsFiltered"];
        });
    }

    toggleRow(element: any) {
        if (this.expandedElement === element) {
            this.expandedElement = null;
        } else {
            this.expandedElement = element;
            this.getSelectedRow(element);
        }
    }

    getSampledetailList1(row) {
        this.dataSource1.data = [];
        const rawDate = row.pathDate;
        const formattedDate = rawDate.split(' ')[0];
        console.log(formattedDate);

        const m_data = {
            "first": 0,
            "rows": 20,
            "sortField": "PathDate",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "BillNo",
                    "fieldValue": String(row.billNo),
                    "opType": "Equals"
                },
                {
                    "fieldName": "OP_IP_Type",
                    "fieldValue": "4",
                    "opType": "Equals"
                },
                {
                    "fieldName": "From_Dt",
                    "fieldValue": formattedDate,
                    "opType": "Equals"
                }
            ],
            "Columns": [],
            "exportType": "JSON"
        }

        console.log(m_data);
        this._InvestListService.PathResultentryDetailList(m_data).subscribe(Visit => {
            this.dataSource1.data = Visit.data as SampleList[];
            console.log("ResultList:", this.dataSource1.data)
            this.dataSource1.sort = this.sort;
            this.dataSource1.paginator = this.paginator;

        });
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    Resultstatus: any = "0"
    // opipType: any = "3";
    ResultonChangeFirst() {
        this.dataSource1.data = [];

        this.ResultfromDate = this.datePipe.transform(this.ResultmyformSearch.get('start').value, "yyyy-MM-dd")
        this.ResulttoDate = this.datePipe.transform(this.ResultmyformSearch.get('end').value, "yyyy-MM-dd")
        this.Resultf_name = this.ResultmyformSearch.get('FirstNameSearch').value + "%"
        this.Resultl_name = this.ResultmyformSearch.get('LastNameSearch').value + "%"
        this.Resultstatus = this.ResultmyformSearch.get('ResultStatusSearch').value
        this.ResultregNo = this.ResultmyformSearch.get('RegNoSearch').value || "0"

        this.GetResultdetail();
        this.Resultgetfilterdata();
    }

    Resultgetfilterdata() {
        // debugger
        this.ResultgridConfig = {
            apiUrl: "LabPatientRegistration/LabResultList",
            columnsList: this.Resultallcolumns,
            sortField: "PresReId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: this.Resultf_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.Resultl_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.ResultregNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.ResultfromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.ResulttoDate, opType: OperatorComparer.Equals },
                { fieldName: "IsCompleted", fieldValue: this.Resultstatus, opType: OperatorComparer.Equals },
                { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals }
            ]
        }
        setTimeout(() => {
            this.Resultgrid.gridConfig = this.ResultgridConfig;
            this.Resultgrid.bindGridData();
        }, 100);
        this.bindParentGridData();
    }


    ResultClearfilter(event) {
        console.log(event)
        if (event == 'RegNoSearch')
            this.ResultmyformSearch.get('RegNoSearch').setValue("0")

        if (event == 'FirstNameSearch')
            this.ResultmyformSearch.get('FirstNameSearch').setValue("")

        if (event == 'LastNameSearch')
            this.ResultmyformSearch.get('LastNameSearch').setValue("")

        this.ResultonChangeFirst();
    }

    // onSampleCollSave(row: any = null) {
    //   const dialogRef = this._matDialog.open(SampleCollOldMethodComponent,
    //     {
    //       // maxWidth: "75vw",
    //       maxHeight: '75vh',
    //       width: '70%',
    //       data: { row: row, type: 'Lab' }
    //     });
    //   dialogRef.afterClosed().subscribe(result => {
    //     this.grid.bindGridData();
    //     this.getSelectedRow(event);
    //   });
    // }

    chkresultentry(contact, flag) {
        // debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];

        if (flag)
            this.IsTemplateTest = contact[0]["isTemplateTest"]
        else
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 0) {
            if (this.selection.selected.length == 0) {

                this.toastr.warning('CheckBox Select !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            else {
                setTimeout(() => {
                    const data = [];

                    this.selection.selected.forEach(element => {
                        console.log(element)
                        data.push({
                            PathReportId: element["pathReportID"].toString(),
                            ServiceId: element["serviceId"].toString(),
                            IsCompleted: element["isCompleted"].toString()
                        });
                        this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                    });

                    console.log(this.printdata)
                    data.forEach((element) => {
                        console.log('aaaaaa:', element)
                        this.reportIdData.push(element.PathReportId)
                        this.ServiceIdData.push(element.ServiceId)
                        if (element.IsCompleted == "true")
                            this.Iscompleted = 1;
                    });

                    const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
                        {
                            maxWidth: "96vw",
                            height: "96vh",
                            width: "96%",
                            data: {
                                RIdData: data,
                                patientdata: this.reportPrintObj,
                                type: 'Lab',
                                sampleNo: contact[0].sampleNo
                            }
                        });
                    dialogRef.afterClosed().subscribe(result => {
                        this.Resultgrid.bindGridData();
                        this.getSelectedRow(event);
                        this.bindParentGridData();
                    });
                }, 100);
                return;
            }
        }
        else if (contact.isTemplateTest == 1) {
            this.advanceDataStored.storage = new SampleDetailObj(contact);
            const dialogRef = this._matDialog.open(NewLabtemplateComponent,
                {
                    maxWidth: "75vw",
                    height: '95%',
                    width: '96%',
                    data: {
                        data: contact,
                        verifyCheck: false,
                        viewCheck: false,
                    }
                });

            dialogRef.afterClosed().subscribe(result => {
                this.Resultgrid.bindGridData();
                this.bindParentGridData();
            });
            return;
        }
        this.searchRecords(contact)
        // this.selection.clear(); // Clears all selected items
        // this.dataSource1.data = [];
    }

    chkresultentryEdit(contact, flag) {
        // debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];

        if (flag)
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 0) {
            setTimeout(() => {
                const data = [];
                const contactArray = Array.isArray(contact) ? contact : [contact];
                contactArray.forEach(element => {
                    console.log(element)
                    data.push({
                        PathReportId: element["pathReportID"].toString(),
                        ServiceId: element["serviceId"].toString(),
                        IsCompleted: element["isCompleted"].toString()
                    });
                    this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                });

                console.log(this.printdata)
                data.forEach((element) => {
                    console.log('aaaaaa:', element)
                    this.reportIdData.push(element.PathReportId)
                    this.ServiceIdData.push(element.ServiceId)
                    if (element.IsCompleted == "true")
                        this.Iscompleted = 1;
                });

                const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
                    {
                        maxWidth: "96vw",
                        height: "96vh",
                        width: "96%",
                        data: {
                            RIdData: data,
                            patientdata: this.reportPrintObj,
                            type: 'Lab',
                            sampleNo: contact.sampleNo
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.Resultgrid.bindGridData();
                    this.getSelectedRow(event);
                    this.bindParentGridData();
                });
            }, 100);
            return;
        }
        this.searchRecords(contact)
        // this.selection.clear(); // Clears all selected items
        // this.dataSource1.data = [];
    }

    OPIPID: any = 0;
    onresultentryshow(event, m) {
        // debugger
        console.log("2nd Table Data:", m)
        this.OPIPID = m.opdipdid //m.OPD_IPD_ID
        this.advanceDataStored.storage = new SampleDetailObj(m);
        if (event.checked) {
            if (m.pathTestID == 0) {
                this.toastr.warning('This Test Not Created !', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

        }

        if (!m || typeof m !== 'object' || !('isTemplateTest' in m) || m.isTemplateTest == null) {

            this.toastr.warning('This Test Not Created!', 'Warning!', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            console.log('isTemplateTest not found or null, dataSource1 cleared.');
            return;
        }
    }

    Cancleresult(row) {
        Swal.fire({
            title: 'Confirm Result cancellation ',
            text: 'Are you sure you want to Cancel the result?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, deactivate!'

        }).then((flag) => {
            // debugger
            if (flag.isConfirmed) {

                const submitData = {
                    "pathReportID": row.pathReportID
                };
                console.log(submitData);
                this._InvestListService.RoolbackStatus(submitData).subscribe(response => {
                    if (response) {
                        Swal.fire('Congratulations !', 'Data Updated Successfully !', 'success').then((result) => {
                            this._matDialog.closeAll();
                            this.grid.bindGridData();
                            this.dataSource1.data = [];
                        });
                    } else {
                        Swal.fire('Error !', 'Pathology Resulentry data not Updated', 'error');
                    }

                });
            }
        });
        // this.onEdit(row);
    }

    viewgetPathologyTemplateReportPdf1(contact: any, mode: string) {
        this.OnPrintReportLogSave('Lab Print', contact) // log save

        setTimeout(() => {
            const param = {
                searchFields: [
                    {
                        fieldName: "PathReportId",
                        fieldValue: String(contact.pathReportID),
                        opType: "Equals"
                    },
                    {
                        fieldName: "OP_IP_Type",
                        fieldValue: String(contact.opdIpdType),
                        opType: "Equals"
                    }
                ],
                mode: mode  // dynamic
            };
            console.log(param)
            this._InvestListService.getReportView(param).subscribe(res => {
                const matDialog = this._matDialog.open(PdfviewerComponent, {
                    maxWidth: "85vw",
                    height: '750px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Template Report Viewer"
                    }
                });
                matDialog.afterClosed().subscribe(result => { });
            });
        }, 100);
    }

    getPrint(contact) {
        console.log(contact)

        if (contact.isTemplateTest) {

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
                    this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithHeader");
                } else if (result.isDenied) {
                    this.viewgetPathologyTemplateReportPdf1(contact, "PathologyReportTemplateWithOutHeader");
                }
            });
        } else {
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
    }

    CompletdFlag = 1
    selectedItem: any;

    PrintresultentryTop(row: any = null) {
        debugger
        console.log(row);
        const pathologyDelete = [];

        this.selectedItem = this.selection.selected[0];
        this.OnPrintReportLogSave('Lab Print', this.selectedItem)  // log save

        this.selection.selected.forEach((element) => {
            pathologyDelete.push({ pathReportId: element.pathReportID });
        });
        if (this.selectedItem.isCompleted)
            this.CompletdFlag = 1
        else
            this.CompletdFlag = 0

        pathologyDelete.push({ pathReportId: this.selectedItem.pathReportID });

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);
        if (this.CompletdFlag) {
            this._InvestListService.PathPrintResultentryInsert(submitData).subscribe(res => {
                if (res) {
                    this.viewgetPathologyTestReportPdf(row)
                }
            });
        }
    }

    Printresultentry(row: any = null) {
        // debugger
        console.log(row);
        this.OnPrintReportLogSave('Lab Print', row) // log save
        const pathologyDelete = [];

        pathologyDelete.push({ pathReportId: row.pathReportID });

        if (row.isCompleted)
            this.CompletdFlag = 1
        else
            this.CompletdFlag = 0

        pathologyDelete.push({ pathReportId: row.pathReportID });

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);
        if (this.CompletdFlag) {
            this._InvestListService.PathPrintResultentryInsert(submitData).subscribe(res => {
                if (res) {
                    this.viewgetPathologyTestReportPdf(row)
                }
            });
        }
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

        this._InvestListService.getReportView(param).subscribe(res => {
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

    PrintresultentrywithheaderTop(row: any = null) {
        debugger
        const pathologyDelete = [];

        this.selectedItem = this.selection.selected[0];
        this.OnPrintReportLogSave('Lab Print', this.selectedItem) // log save

        this.selection.selected.forEach((element) => {
            pathologyDelete.push({ pathReportId: element.pathReportID });
        });

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._InvestListService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportwithheaderPdf(row)
            }
        });
    }

    Printresultentrywithheader(row: any = null) {
        this.OnPrintReportLogSave('Lab Print', row) // log save
        const pathologyDelete = [];

        pathologyDelete.push({ pathReportId: row.pathReportID });

        const submitData = {
            pathPrintResultEntry: pathologyDelete
        };

        console.log(submitData);

        this._InvestListService.PathPrintResultentryInsert(submitData).subscribe(res => {
            if (res) {
                this.viewgetPathologyTestReportwithheaderPdf(row)
            }
        });
    }

    viewgetPathologyTestReportwithheaderPdf(data) {

        console.log(this.selection.selected);
        const param = {
            searchFields: [
                {
                    fieldName: "OP_IP_Type",
                    fieldValue: "4",
                    opType: "Equals"
                }
            ],
            mode: "PathologyReportWithHeader"
        };

        this._InvestListService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "Pathology Test Report With Header Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
        // });
    }

    AdList: boolean = false;

    whatsappresultentry() {
        console.log(this.selection.selected)
        const pathologyDelete = [];
        this.selection.selected.forEach((element) => {
            this.SOPIPtype = element["OPD_IPD_Type"]
            const pathologyDeleteObj = {};
            pathologyDeleteObj['pathReportId'] = element["PathReportID"]
            pathologyDelete.push(pathologyDeleteObj);
        });
        const submitData = {
            "printInsert": pathologyDelete,
        };
        console.log(submitData);
        this._InvestListService.PathPrintResultentryInsert(submitData).subscribe(response => {
        });
        // this.selection.clear();
    }

    onsamplecolltion(contact) {
        console.log(contact)
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const dialogRef1 = this._matDialog.open(NewLabtemplateComponent,
            {
                maxWidth: "75vw",
                height: '95%',
                width: '96%',
                data: {

                    regobj: contact
                }
            });

        dialogRef1.afterClosed().subscribe(result => {
            this.bindParentGridData();
        });
    }

    Editoutsoucedata(row) {
        console.log(row)

        this.advanceDataStored.storage = new AdvanceDetailObj(row);

        const dialogRef1 = this._matDialog.open(OutsourceDetailsComponent,
            {
                maxWidth: "80vw",
                // height: '60vh',
                // width: '100%',
                width: "45%",
                height: "60%",
                data: row
            });

        dialogRef1.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            this.getSelectedRow(event);
        });
    }

    ResultdataSource = new MatTableDataSource<PatientList>();
    GetResultdetail() {

        this.ResultfromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
        this.ResulttoDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
        this.ResultVtotalcount = 0;
        this.ResultVCompletedcount = 0;
        this.ResultVpendingcount = 0;

        const data =
        {
            "first": 0,
            "rows": 150,
            "sortField": "PresReId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "F_Name",
                    "fieldValue": String(this.Resultf_name),
                    "opType": "Contains"
                },
                {
                    "fieldName": "L_Name",
                    "fieldValue": String(this.Resultl_name),
                    "opType": "Contains"
                },
                {
                    "fieldName": "Reg_No",
                    "fieldValue": String(this.ResultregNo),
                    "opType": "Equals"
                },

                {
                    "fieldName": "From_Dt",
                    "fieldValue": this.ResultfromDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "To_Dt",
                    "fieldValue": this.ResulttoDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "IsCompleted",
                    "fieldValue": String(this.Resultstatus),
                    "opType": "Equals"
                },
                {
                    "fieldName": "UnitId",
                    "fieldValue": String(this.UnitId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": []
        }


        console.log(data)
        this._InvestListService.getresultenterylist(data).subscribe((response) => {
            this.ResultdataSource.data = response.data;
            console.log(this.ResultdataSource.data)
            if (this.ResultdataSource.data.length > 0) {
                this.ResultVtotalcount = this.ResultdataSource.data.length
                this.ResultdataSource.data.forEach(element => {
                    // debugger
                    if (element.isCompleted == true) {
                        this.ResultVCompletedcount = this.ResultVCompletedcount + 1;
                    } else if (element.isCompleted == false) {
                        this.ResultVpendingcount = this.ResultVpendingcount + 1;
                    }

                });
                console.log(this.ResultdataSource.data)
            }
        });
    }

    OnResultPrintPatientIcard(element) {
        console.log('Third action clicked for:', element);
        this.commonService.Onprint("AdmissionId", element.visit_Adm_ID, "IPStickerPrint");
    }
    selection = new SelectionModel<SampleList>(true, []);

    getSelectableRows() {
        return this.dataSource1.data.filter(
            (row: any) =>
                row.isSampleCollection === 'True' &&
                row.isVerifySign === false &&
                row.isTemplateTest != '1'
        );
    }

    masterToggle() {

        // 🔴 1. Sample collection pending check
        const notCollected = this.dataSource1.data.filter(
            (row: any) => row.isSampleCollection === 'False'
        );

        if (notCollected.length > 0) {
            Swal.fire(
                'Sample Pending',
                `${notCollected.length} test(s) remaining to collect sample`,
                'warning'
            );
            return;
        }

        // 🔴 2. Get selectable (pending & not verified) rows
        const selectableRows = this.dataSource1.data.filter(
            (row: any) =>
                row.isSampleCollection === 'True' &&
                row.isVerifySign === false &&
                row.isTemplateTest != '1'
        );

        // 🔴 3. All tests already verified
        if (selectableRows.length === 0) {
            Swal.fire(
                'No Pending Tests',
                'All tests are already verified',
                'info'
            );
            return;
        }

        // 🔁 Toggle selection
        if (this.isAllSelected()) {
            selectableRows.forEach(row => this.selection.deselect(row));
        } else {
            selectableRows.forEach(row => this.selection.select(row));
        }

        this.resultSource = [...this.selection.selected];
    }

    isSomeSelected() {
        // console.log(this.selection.selected);
        return this.selection.selected.length > 0;
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

    onSearchClear() {
        this.ResultmyformSearch.reset({ RegNoSearch: '', FirstNameSearch: '', LastNameSearch: '', PatientTypeSearch: '', StatusSearch: '' });
    }

    isAllSelected() {
        const selectableRows = this.dataSource1.data.filter(
            (row: any) =>
                row.isSampleCollection === 'True' &&
                row.isVerifySign === false &&
                row.isTemplateTest != '1'
        );

        return (
            selectableRows.length > 0 &&
            selectableRows.every(row => this.selection.isSelected(row))
        );
    }

    onClear() {
        this.ResultmyformSearch.get('RegNoSearch').setValue("0");
        this.ResultmyformSearch.get('ResultStatusSearch').setValue("0");
        this.ResultmyformSearch.get('PatientTypeSearch').setValue("3");
    }

    getVerifyTooltip(contact: any): string {
        if (contact.isVerifyid) {
            return `Verified On : ${contact.isVerifyedDate}\nVerified By : ${contact.verifiedUserName}`;
        }

        return contact.isCompleted
            ? 'Verify Report'
            : 'Test is Pending';
    }

    getCompleteTooltip(contact: any): string {
        if (contact.isCompleted) {
            return `Completed On : ${contact.reportDate}\nCompleted By : ${contact.reportCompletedUser}`;
        }
        // ${contact.reportDate} 
        return contact.isCompleted
            ? 'Completed Report'
            : 'Test is Pending';
    }
    //whatsapp
    private overlayRef: OverlayRef | null = null;
    private EmailOverlayRef: OverlayRef | null = null;
    private whatsappOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;

    openEmailDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.EmailOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(SMSDetailsPopupOverComponent);
            const componentRef: ComponentRef<SMSDetailsPopupOverComponent> = this.EmailOverlayRef.attach(portal);
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.EmailOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeEmailDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeEmailDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.EmailOverlayRef) {
                this.EmailOverlayRef.dispose();
                this.EmailOverlayRef = null;
            }
        }, 200);
    }
    openWhatsappDetailsPopover(event: MouseEvent, patientData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.whatsappOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(WhatsappDetPopUpOverComponent);
            const componentRef: ComponentRef<WhatsappDetPopUpOverComponent> = this.whatsappOverlayRef.attach(portal);
            console.log(patientData)
            componentRef.instance.patientData = patientData;

            // Handle mouse events on the overlay element
            const overlayElement = this.whatsappOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeWhatsappDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }
    closeWhatsappDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.patientCloseTimeout = setTimeout(() => {
            if (this.whatsappOverlayRef) {
                this.whatsappOverlayRef.dispose();
                this.whatsappOverlayRef = null;
            }
        }, 200);
    }
    keepPatientPopoverOpenReport() {
        // Clear close timeout when hovering over popover
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
            this.patientCloseTimeout = null;
        }
    }

    getWhatsappshareReport(el) {
        console.log(el);
        this._whatsppService.OnWhatsAppMsgSent({
            mobileNo: el.mobileNo,
            patientName: el.patientName,
            billNo: el.pathTestID,
            smsType: "PathResultEntry",
            patientId: el.regNo
        })
    }

    Onemail(contact) {
        const dialogRef = this._matDialog.open(EmailSendComponent,
            {
                maxWidth: "100%",
                height: '75%',
                width: '55%',
                data: {
                    Obj: contact,
                    emailType: 'PathResultEntry'
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    // ////////////// outsource popup //////////////////////
    // private overlayRef: OverlayRef | null = null;
    private patientOverlayRef: OverlayRef | null = null;
    // private hoverTimeout: any = null;
    private outSourceCloseTimeout: any = null;

    openPatientDetailsPopover(event: MouseEvent, outSourceData: any) {
        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing patient popover
            if (this.patientOverlayRef) {
                this.patientOverlayRef.dispose();
                this.patientOverlayRef = null;
            }

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(event.target as HTMLElement)
                .withPositions([
                    {
                        originX: 'start',
                        originY: 'bottom',
                        overlayX: 'start',
                        overlayY: 'top',
                    },
                    {
                        originX: 'start',
                        originY: 'top',
                        overlayX: 'start',
                        overlayY: 'bottom',
                    },
                    {
                        originX: 'end',
                        originY: 'center',
                        overlayX: 'start',
                        overlayY: 'center',
                    },
                    {
                        originX: 'start',
                        originY: 'center',
                        overlayX: 'end',
                        overlayY: 'center',
                    }
                ]);

            this.patientOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(OutsourceDetailsPopoverComponent);
            const componentRef: ComponentRef<OutsourceDetailsPopoverComponent> = this.patientOverlayRef.attach(portal);
            componentRef.instance.outSourceData = outSourceData;

            // Handle mouse events on the overlay element
            const overlayElement = this.patientOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPatientPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closePatientDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closePatientDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.outSourceCloseTimeout) {
            clearTimeout(this.outSourceCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.outSourceCloseTimeout = setTimeout(() => {
            if (this.patientOverlayRef) {
                this.patientOverlayRef.dispose();
                this.patientOverlayRef = null;
            }
        }, 200);
    }

    keepPatientPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.outSourceCloseTimeout) {
            clearTimeout(this.outSourceCloseTimeout);
            this.outSourceCloseTimeout = null;
        }
    }

    //////////// Approval List //////////////

    ApprovalVtotalcount = 0
    ApprovalVCompletedcount = 0
    ApprovalVpendingcount = 0
    // MouseEvent = true;
    ApprovalmyformSearch: FormGroup;
    // PathReportID: any;
    // PathTestId: any
    Approvalf_name: any = "%"
    Approvall_name: any = "%"
    ApprovalreportPrintObj: AdmissionPersonlModel;

    ApprovalfromDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    ApprovaltoDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    // vOPIPId = 0;
    Category = '%'
    autocompleteModeCategoryId: string = "PathCategory";

    @ViewChild('Approvalgrid', { static: false }) grid3: AirmidTableComponent;
    @ViewChild('ApprovalactionButtonTemplate') ApprovalactionButtonTemplate!: TemplateRef<any>;

    Approvalallcolumns = [

        { heading: "Status", key: "isCompleted", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template },
        { heading: "Test Date", key: "doa", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "CategoryName", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SampleCollectionTime", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        {
            heading: "Action", key: "Approvalaction", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.ApprovalactionButtonTemplate  // Assign ng-template to the column
        }
    ];

    ApprovalgridConfig: gridModel = {
        // permissionCode: permissionCodes.ExternalInvestigation,
        apiUrl: "LabApproval/LabResultCompletedList",
        columnsList: this.Approvalallcolumns,
        sortField: "PathTestID",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.ApprovalfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.ApprovaltoDate, opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
            { fieldName: "ApprovalStatus", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "F_Name ", fieldValue: this.Approvalf_name, opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: this.Approvall_name, opType: OperatorComparer.StartsWith },
        ]
    }

    Approvalstatus: any = "1"
    // opipType: any = "3";
    ApprovalonChangeFirst() {

        this.ApprovalfromDate = this.datePipe.transform(this.ApprovalmyformSearch.get('start').value, 'MM/dd/yyyy')
        this.ApprovaltoDate = this.datePipe.transform(this.ApprovalmyformSearch.get('end').value, 'MM/dd/yyyy')
        this.Approvalf_name = this.ApprovalmyformSearch.get('FirstNameSearch').value + "%"
        this.Approvall_name = this.ApprovalmyformSearch.get('LastNameSearch').value + "%"
        this.Approvalstatus = this.ApprovalmyformSearch.get('ApprovalStatusSearch').value || 0
        // this.regNo = this.myformSearch.get('RegNoSearch').value || "0"

        this.GetApprovaldetail();
        this.Approvalgetfilterdata();
    }

    Approvalgetfilterdata() {

        this.ApprovalgridConfig = {
            apiUrl: "LabApproval/LabResultCompletedList",
            columnsList: this.Approvalallcolumns,
            sortField: "PathTestID",
            sortOrder: 0,
            filters: [
                // { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.ApprovalfromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.ApprovaltoDate, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
                { fieldName: "ApprovalStatus", fieldValue: this.Approvalstatus, opType: OperatorComparer.Equals },
                { fieldName: "F_Name ", fieldValue: this.Approvalf_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.Approvall_name, opType: OperatorComparer.StartsWith },
                // { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
                // { fieldName: "Category", fieldValue: this.Category, opType: OperatorComparer.StartsWith }
            ]
        }
        this.grid3.gridConfig = this.ApprovalgridConfig;
        this.grid3.bindGridData();
    }

    ApprovalClearfilter(event) {

        if (event == 'FirstNameSearch')
            this.ApprovalmyformSearch.get('FirstNameSearch').setValue("")

        if (event == 'LastNameSearch')
            this.ApprovalmyformSearch.get('LastNameSearch').setValue("")

        this.ApprovalonChangeFirst();
    }

    ApprovalonClear() {
        this.ApprovalmyformSearch.get('RegNoSearch').setValue("0");
        this.ApprovalmyformSearch.get('ApprovalStatusSearch').setValue("1");
        this.ApprovalmyformSearch.get('PatientTypeSearch').setValue("3");
    }

    ApprovaldataSource = new MatTableDataSource<PatientList>();
    GetApprovaldetail() {

        this.ApprovalfromDate = this.datePipe.transform(this.ApprovalmyformSearch.get('start').value, 'MM/dd/yyyy')
        this.ApprovaltoDate = this.datePipe.transform(this.ApprovalmyformSearch.get('end').value, 'MM/dd/yyyy')
        this.ApprovalVtotalcount = 0;
        this.ApprovalVCompletedcount = 0;
        this.ApprovalVpendingcount = 0;

        const data =
        {
            "first": 0,
            "rows": 150,
            "sortField": "PathTestID",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "From_Dt",
                    "fieldValue": this.ApprovalfromDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "To_Dt",
                    "fieldValue": this.ApprovaltoDate,
                    "opType": "Equals"
                },
                {
                    "fieldName": "OP_IP_Type",
                    "fieldValue": "4",
                    "opType": "Equals"
                },
                {
                    "fieldName": "ApprovalStatus",
                    "fieldValue": String(this.Approvalstatus),
                    "opType": "Equals"
                },
                { fieldName: "F_Name ", fieldValue: this.Approvalf_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.Approvall_name, opType: OperatorComparer.StartsWith },
            ],
            "exportType": "JSON",
            "columns": []
        }

        console.log(data)
        this._InvestListService.getarrovallist(data).subscribe((response) => {
            this.ApprovaldataSource.data = response.data;
            console.log(this.ApprovaldataSource.data)
            if (this.ApprovaldataSource.data.length > 0) {
                this.ApprovalVtotalcount = this.ApprovaldataSource.data.length
                this.ApprovaldataSource.data.forEach(element => {
                    // debugger
                    if (element.isCompleted == true) {
                        this.ApprovalVCompletedcount = this.ApprovalVCompletedcount + 1;
                    } else if (element.isCompleted == false) {
                        this.ApprovalVpendingcount = this.ApprovalVpendingcount + 1;
                    }

                });
                console.log(this.ApprovaldataSource.data)
            }
        });
    }

    chkresultentryVerify(contact, flag) {
        debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];
        this.reportPrintObj = contact

        if (flag)
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 0) {
            setTimeout(() => {
                const data = [];
                const contactArray = Array.isArray(contact) ? contact : [contact];
                contactArray.forEach(element => {
                    console.log(element)
                    data.push({
                        PathReportId: element["pathReportID"].toString(),
                        ServiceId: element["serviceId"].toString(),
                        IsCompleted: element["isCompleted"].toString()
                    });
                    this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                });

                console.log(this.printdata)
                data.forEach((element) => {
                    console.log('aaaaaa:', element)
                    this.reportIdData.push(element.PathReportId)
                    this.ServiceIdData.push(element.ServiceId)
                    if (element.IsCompleted == "true")
                        this.Iscompleted = 1;
                });

                const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
                    {
                        maxWidth: "96vw",
                        height: "96vh",
                        width: "96%",
                        data: {
                            RIdData: data,
                            patientdata: this.reportPrintObj,
                            verifyCheck: true,
                            viewCheck: false,
                            sampleNo: contact.sampleNo
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.grid3.bindGridData();
                    this.bindParentGridData();
                });
            }, 100);
            return;
        }
    }

    IsTemplateTest: any;
    chkTemplateVerify(contact, flag) {
        debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];

        if (flag)
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 1) {
            setTimeout(() => {
                const data = [];
                const contactArray = Array.isArray(contact) ? contact : [contact];
                contactArray.forEach(element => {
                    console.log(element)
                    data.push({
                        PathReportId: element["pathReportID"].toString(),
                        ServiceId: element["serviceId"].toString(),
                        IsCompleted: element["isCompleted"].toString()
                    });
                    this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                });

                console.log(this.printdata)
                data.forEach((element) => {
                    console.log('aaaaaa:', element)
                    this.reportIdData.push(element.PathReportId)
                    this.ServiceIdData.push(element.ServiceId)
                    if (element.IsCompleted == "true")
                        this.Iscompleted = 1;
                });

                const dialogRef = this._matDialog.open(NewLabtemplateComponent,
                    {
                        maxWidth: "75vw",
                        height: '95%',
                        width: '96%',
                        data: {
                            data: contact,
                            verifyCheck: true,
                            viewCheck: false,
                        }
                    });

                dialogRef.afterClosed().subscribe(result => {
                    this.grid3.bindGridData();
                    this.bindParentGridData();
                });
                return;
            }, 100);
            return;
        }
    }

    //////////// Print List //////////////

    PrintfromDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    PrinttoDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    @ViewChild('Printgrid', { static: false }) grid4: AirmidTableComponent;
    @ViewChild('printactionButtonTemplate') printactionButtonTemplate!: TemplateRef<any>;
    PrintmyformSearch: FormGroup;
    reportlogFormGroup: FormGroup

    createReportlogForm(): FormGroup {
        return this.formBuilder.group({
            logId: [0],
            opipid: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            opiptype: [4],
            logTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            logTypeName: ['', [Validators.required]]
        });
    }

    Printallcolumns = [

        { heading: "Test Date", key: "doa", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SampleCollectionTime", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        {
            heading: "Action", key: "Printaction", align: "right", sticky: true, type: gridColumnTypes.template,
            template: this.printactionButtonTemplate  // Assign ng-template to the column
        }
    ];

    PrintgridConfig: gridModel = {
        // permissionCode: permissionCodes.ExternalInvestigation,
        apiUrl: "LabApproval/LabResultCompletedList",
        columnsList: this.Printallcolumns,
        sortField: "PathTestID",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.PrintfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.PrinttoDate, opType: OperatorComparer.Equals },
            { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
            { fieldName: "ApprovalStatus", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "F_Name ", fieldValue: this.Approvalf_name, opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: this.Approvall_name, opType: OperatorComparer.StartsWith },
        ]
    }

    PrintonChangeFirst() {
        this.PrintfromDate = this.datePipe.transform(this.PrintmyformSearch.get('start').value, 'MM/dd/yyyy')
        this.PrinttoDate = this.datePipe.transform(this.PrintmyformSearch.get('end').value, 'MM/dd/yyyy')

        this.Printgetfilterdata();
    }

    Printgetfilterdata() {

        this.PrintgridConfig = {
            apiUrl: "LabApproval/LabResultCompletedList",
            columnsList: this.Printallcolumns,
            sortField: "PathTestID",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.PrintfromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.PrinttoDate, opType: OperatorComparer.Equals },
                { fieldName: "OP_IP_Type", fieldValue: "4", opType: OperatorComparer.Equals },
                { fieldName: "ApprovalStatus", fieldValue: "2", opType: OperatorComparer.Equals },
                { fieldName: "F_Name ", fieldValue: this.Approvalf_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.Approvall_name, opType: OperatorComparer.StartsWith },
            ]
        }
        this.grid4.gridConfig = this.PrintgridConfig;
        this.grid4.bindGridData();
    }

    chkPrintViewResultVerify(contact, flag) {
        // debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];
        this.reportPrintObj = contact

        if (flag)
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 0) {
            setTimeout(() => {
                const data = [];
                const contactArray = Array.isArray(contact) ? contact : [contact];
                contactArray.forEach(element => {
                    console.log(element)
                    data.push({
                        PathReportId: element["pathReportID"].toString(),
                        ServiceId: element["serviceId"].toString(),
                        IsCompleted: element["isCompleted"].toString()
                    });
                    this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                });

                console.log(this.printdata)
                data.forEach((element) => {
                    console.log('aaaaaa:', element)
                    this.reportIdData.push(element.PathReportId)
                    this.ServiceIdData.push(element.ServiceId)
                    if (element.IsCompleted == "true")
                        this.Iscompleted = 1;
                });

                const dialogRef = this._matDialog.open(NewLabresultEntryComponent,
                    {
                        maxWidth: "96vw",
                        height: "96vh",
                        width: "96%",
                        data: {
                            RIdData: data,
                            patientdata: this.reportPrintObj,
                            verifyCheck: false,
                            viewCheck: true,
                            sampleNo: contact.sampleNo
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.grid3.bindGridData();
                    this.bindParentGridData();
                });
            }, 100);
            return;
        }
    }

    chkPrintViewTemplateVerify(contact, flag) {
        // debugger
        this.printdata = [];
        this.reportIdData = [];
        this.ServiceIdData = [];

        if (flag)
            this.IsTemplateTest = contact.isTemplateTest

        console.log(contact)
        if (this.IsTemplateTest == 1) {
            setTimeout(() => {
                const data = [];
                const contactArray = Array.isArray(contact) ? contact : [contact];
                contactArray.forEach(element => {
                    console.log(element)
                    data.push({
                        PathReportId: element["pathReportID"].toString(),
                        ServiceId: element["serviceId"].toString(),
                        IsCompleted: element["isCompleted"].toString()
                    });
                    this.printdata.push({ PathReportId: element["pathReportID"].toString() });
                });

                console.log(this.printdata)
                data.forEach((element) => {
                    console.log('aaaaaa:', element)
                    this.reportIdData.push(element.PathReportId)
                    this.ServiceIdData.push(element.ServiceId)
                    if (element.IsCompleted == "true")
                        this.Iscompleted = 1;
                });

                const dialogRef = this._matDialog.open(NewLabtemplateComponent,
                    {
                        maxWidth: "75vw",
                        height: '95%',
                        width: '96%',
                        data: {
                            data: contact,
                            verifyCheck: false,
                            viewCheck: true,
                        }
                    });

                dialogRef.afterClosed().subscribe(result => {
                    this.grid3.bindGridData();
                    this.bindParentGridData();
                });
                return;
            }, 100);
            return;
        }
    }

    onViewReport(element: any) {
        // Condition check
        if (element.isCompleted && !element.isVerifyid) {
            this.OnPrintReportLogSave('Lab View', element);

            if (element.isTemplateTest == 1) {
                this.chkPrintViewTemplateVerify(element, true);
            } else {
                this.chkPrintViewResultVerify(element, true);
            }
        }
    }

    OnPrintReportLogSave(type: any, data: any) {
        // debugger
        const src = Array.isArray(data) ? data[0] : data;
        const opipid = src?.opdipdId ?? src?.opdIpdId ?? src?.opdipdId;
        if (type == 'Lab Print') {
            this.reportlogFormGroup.get('logTypeId').setValue(1);
            this.reportlogFormGroup.get('logTypeName').setValue('Lab Print');
        }
        if (type == 'Lab View') {
            this.reportlogFormGroup.get('logTypeId').setValue(2);
            this.reportlogFormGroup.get('logTypeName').setValue('Lab View');
        }
        this.reportlogFormGroup.get('opipid').setValue(opipid);

        if (!this.reportlogFormGroup.invalid) {
            console.log(this.reportlogFormGroup.value);

            this._InvestListService.getReportLog(this.reportlogFormGroup.value).subscribe(() => {
                // this.GetSampleCollectiondetail();
            });
        } else {
            const invalidFields = [];
            if (this.reportlogFormGroup.invalid) {
                for (const controlName in this.reportlogFormGroup.controls) {
                    const control = this.reportlogFormGroup.get(controlName);

                    if (control instanceof FormGroup || control instanceof FormArray) {
                        for (const nestedKey in control.controls) {
                            if (control.get(nestedKey)?.invalid) {
                                invalidFields.push(`Report Data : ${controlName}.${nestedKey}`);
                            }
                        }
                    } else if (control?.invalid) {
                        invalidFields.push(`Report Data: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                    );
                });
                return
            }
        }
    }

    //////////// Print Completed List //////////////

    PrintCompletedmyformSearch: FormGroup;
    PrintCompletedfromDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    PrintCompletedtoDate = this.datePipe.transform(new Date().toISOString(), 'MM/dd/yyyy')
    PrintCompletedf_name: any = "%"
    PrintCompletedregNo: any = "0"
    PrintCompletedl_name: any = "%"
    @ViewChild('PrintCompgrid', { static: false }) grid5: AirmidTableComponent;

    printComallcolumns = [
        { heading: "Test Date", key: "pathDate", sort: true, align: 'left', emptySign: 'NA', type: 8 },
        { heading: "UHID", key: "labRequestNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "TestName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RefDoctor Name", key: "refDoctorName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "SampleCollectionTime", key: "sampleCollectionTime", sort: true, align: 'left', emptySign: 'NA', type: 8 },
        // {
        //   heading: "Action", key: "Approvalaction", align: "right", sticky: true, type: gridColumnTypes.template,
        //   template: this.ApprovalactionButtonTemplate  // Assign ng-template to the column
        // }
    ];

    printComgridConfig: gridModel = {
        // permissionCode: permissionCodes.ExternalInvestigation,
        apiUrl: "LabPatientRegistration/LabResultPrintedList",
        columnsList: this.printComallcolumns,
        sortField: "LabPatientId",
        sortOrder: 0,
        filters: [
            { fieldName: "F_Name ", fieldValue: this.PrintCompletedf_name, opType: OperatorComparer.StartsWith },
            { fieldName: "L_Name", fieldValue: this.PrintCompletedl_name, opType: OperatorComparer.StartsWith },
            { fieldName: "Reg_No", fieldValue: this.PrintCompletedregNo, opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.PrintCompletedfromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.PrintCompletedtoDate, opType: OperatorComparer.Equals },
        ]
    }

    printComponChangeFirst() {

        this.PrintCompletedfromDate = this.datePipe.transform(this.PrintCompletedmyformSearch.get('start').value, 'MM/dd/yyyy')
        this.PrintCompletedtoDate = this.datePipe.transform(this.PrintCompletedmyformSearch.get('end').value, 'MM/dd/yyyy')
        this.PrintCompletedf_name = this.PrintCompletedmyformSearch.get('FirstNameSearch').value + "%"
        this.PrintCompletedl_name = this.PrintCompletedmyformSearch.get('LastNameSearch').value + "%"
        this.PrintCompletedregNo = this.PrintCompletedmyformSearch.get('RegNo').value || "0"

        this.printCompgetfilterdata();
    }

    printCompgetfilterdata() {

        this.printComgridConfig = {
            apiUrl: "LabPatientRegistration/LabResultPrintedList",
            columnsList: this.printComallcolumns,
            sortField: "LabPatientId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name ", fieldValue: this.PrintCompletedf_name, opType: OperatorComparer.StartsWith },
                { fieldName: "L_Name", fieldValue: this.PrintCompletedl_name, opType: OperatorComparer.StartsWith },
                { fieldName: "Reg_No", fieldValue: this.PrintCompletedregNo, opType: OperatorComparer.Equals },
                { fieldName: "From_Dt", fieldValue: this.PrintCompletedfromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.PrintCompletedtoDate, opType: OperatorComparer.Equals },
            ]
        }
        setTimeout(() => {
            this.grid5.gridConfig = this.printComgridConfig;
            this.grid5.bindGridData();
        }, 100);
    }

    printComClearfilter(event) {
        console.log(event)
        if (event == 'RegNo') {
            this.PrintCompletedmyformSearch.get('RegNo').setValue("")
            this.PrintCompletedregNo = "0"
        }

        if (event == 'FirstNameSearch')
            this.PrintCompletedmyformSearch.get('FirstNameSearch').setValue("")

        if (event == 'LastNameSearch')
            this.PrintCompletedmyformSearch.get('LastNameSearch').setValue("")

        this.printComponChangeFirst();
    }
}

export class ReceSampleList {
    VADate: Date;
    VATime: Date;
    PathTestID: number;
    ServiceName: string;
    IsSampleCollection: boolean;
    isSampleCollection: any;
    SampleCollectionTime: Date;
    PathReportID: any;
    SampleNo: any;
    RegNo: any;
    pathReportID: any;
    sampleNo: any;
    isApprovedByCamp: any;
    pBillNo: any;
    pathDate: any;
    sampleCollectionTime: any;
    labRequestNo: any;
    patientName: any;
    genderName: any;
    mobileNo: any;
    serviceName: any;
    outSourceLabName: any;
    SampleReceviedDateTime: any;
    userName: any;
    isSampleReceivedStatus: any;

    constructor(ReceSampleList) {
        this.VADate = ReceSampleList.VADate || '';
        this.VATime = ReceSampleList.VATime || '';
        this.PathTestID = ReceSampleList.PathTestID || 0;
        this.ServiceName = ReceSampleList.ServiceName || '';
        this.IsSampleCollection = ReceSampleList.IsSampleCollection || 0;
        this.isSampleCollection = ReceSampleList.isSampleCollection || 0;
        this.SampleCollectionTime = ReceSampleList.SampleCollectionTime || '';
        this.PathReportID = ReceSampleList.PathReportID || 0;
        this.SampleNo = ReceSampleList.SampleNo || 0;
        this.RegNo = ReceSampleList.RegNo || 0;
        this.pathReportID = ReceSampleList.pathReportID || 0;
        this.sampleNo = ReceSampleList.sampleNo || 0;
        this.isApprovedByCamp = ReceSampleList.isApprovedByCamp || 0;
        this.pBillNo = ReceSampleList.pBillNo || 0;
        this.pathDate = ReceSampleList.pathDate || 0;
        this.sampleCollectionTime = ReceSampleList.sampleCollectionTime || 0;
        this.labRequestNo = ReceSampleList.labRequestNo || 0;
        this.patientName = ReceSampleList.patientName || 0;
        this.genderName = ReceSampleList.genderName || 0;
        this.mobileNo = ReceSampleList.mobileNo || 0;
        this.serviceName = ReceSampleList.serviceName || 0;
        this.outSourceLabName = ReceSampleList.outSourceLabName || 0;
        this.SampleReceviedDateTime = ReceSampleList.SampleReceviedDateTime || 0;
        this.userName = ReceSampleList.userName || 0;
        this.isSampleReceivedStatus = ReceSampleList.isSampleReceivedStatus || 0
    }
}