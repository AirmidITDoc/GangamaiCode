import { DatePipe } from "@angular/common";
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from "app/main/shared/services/printservice.service";
import { ToastrService } from "ngx-toastr";
import { NewPatientTemporaryMovementComponent } from "./new-patient-temporary-movement/new-patient-temporary-movement.component";
import { PatientTemporaryMovementService } from "./patient-temporary-movement.service";


@Component({
    selector: 'app-patient-temporary-movement',
    templateUrl: './patient-temporary-movement.component.html',
    styleUrls: ['./patient-temporary-movement.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientTemporaryMovementComponent {
    myFilterform: FormGroup
    msg: any;
    RequestName: any = "";

    FromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    ToDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    RegNo: any = "0"
    LastName: any = ""

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    ngAfterViewInit() {
        // Assign the template to the column dynamically
        this.gridConfig.columnsList.find(col => col.key === 'opIpType')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'surgeryTypeId')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }
    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    allcolumns = [
        { heading: "", key: "opIpType", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "", key: "surgeryTypeId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },

        { heading: "Manage", key: "otbookingTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
        { heading: "Movement", key: "otRequestTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 200 },
        { heading: "Movement-Type", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Movement Date", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "To Department", key: "departmentName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Purpose", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Transfer Mode", key: "surgeryName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Employees", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Equipments", key: "siteDescriptionName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "PurposeDesc", key: "addedBy", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "To Location Point", key: "aa", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Transfer Out By", key: "bb", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "OT Status", key: "ss", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        {
            heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    allFilters = [
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: "0", opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
    ]
    gridConfig: gridModel = {
        apiUrl: "",
        columnsList: this.allcolumns,
        sortField: "DoctorId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _PatientTemMoveService: PatientTemporaryMovementService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private commonService: PrintserviceService,
        private _loggedService: AuthenticationService,
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._PatientTemMoveService.createSearchForm();
    }

    onChangeFirst() {
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.RegNo = this.myFilterform.get('RegNo').value || "0"
        this.getfilterdata();
    }

    getfilterdata() {
        this.FromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
        this.ToDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
        this.gridConfig = {
            apiUrl: "",
            columnsList: this.allcolumns,
            sortField: "DoctorId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.FromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.ToDate, opType: OperatorComparer.StartsWith },
                { fieldName: "FirstName", fieldValue: this.FirstName, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.LastName, opType: OperatorComparer.StartsWith },
                { fieldName: "RegNo", fieldValue: this.RegNo, opType: OperatorComparer.Equals },
            ],
            row: 25
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }
    Clearfilter(event) {
        console.log(event)
        if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")

        this.onChangeFirst();
    }

    onNew(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewPatientTemporaryMovementComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '90%',
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}
