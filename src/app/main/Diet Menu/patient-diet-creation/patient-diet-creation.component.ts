import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { result } from 'lodash';

import { RequestcardpopupComponent } from 'app/main/canteenmanagement/patient-diet-reauest/requestcardpopup/requestcardpopup.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { NewDietCreationComponent } from './new-diet-creation/new-diet-creation.component';
import { DietCreationService } from './diet-creation.service';


@Component({
    selector: 'app-patient-diet-creation',
    templateUrl: './patient-diet-creation.component.html',
    styleUrls: ['./patient-diet-creation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientDietCreationComponent {

    HeaderCancleTaskForm: FormGroup
    DetailCancleTaskForm: FormGroup
    myFilterform: FormGroup;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    vOPIPId = 0;
    f_name: any = "%"
    regNo: any = "0"
    l_name: any = "%"
    m_name: any = "%"
    IPDNo: any = "0"
    status = "0"
    DietPlanId = "0"
    DietTypeId = "0"
    autocompleteModedietType = 'MDietTypeMaster';

    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    allcolumns = [
        { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "OPIPNo", key: "opipid", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 8 },
        { heading: "Patient Name", key: "patient", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Plan Date", key: "planDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "Diet Name", key: "dietName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Plan Start Date", key: "planStartDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 110 },
        { heading: "Plan End Date", key: "planEndDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 110 },
        { heading: "Instruction", key: "instruction", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comment", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.template, width: 170,
            template: this.actionButtonTemplate
        }

    ];
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Admission,
        apiUrl: "DietPlanSchedule/List",
        columnsList: this.allcolumns,
        sortField: "DietPlanId",
        sortOrder: 1,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Date", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "DietPlanId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "DietTypeId", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
            { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        ],
        row: 25
    }
    constructor(public _DietCreationService: DietCreationService,
        private _formBuilder: FormBuilder, private overlay: Overlay,
        private commonService: PrintserviceService, public _matDialog: MatDialog, private _loggedService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe,
    ) { }
    ngOnInit(): void {
        this.myFilterform = this._DietCreationService.filterForm();
    }


    onChangeFirst() {
        this.getfilterdata();
    }
    getchangeDate() {

        this.getfilterdata();

    }

    getfilterdata() {
        debugger
        const f = this.myFilterform.value;

        const from = f.start ?? f.fromDate;
        const to = f.end ?? f.enddate;

        this.fromDate = this.datePipe.transform(from, 'yyyy-MM-dd') || this.fromDate;
        this.toDate = this.datePipe.transform(to, 'yyyy-MM-dd') || this.toDate;
        this.f_name = (f.FirstName ?? '').trim() + '%';
        this.l_name = (f.LastName ?? '').trim() + '%';
        this.DietPlanId = f.dietPlanId || "0"
        this.DietTypeId = f.dietTypeId || "0"

        this.gridConfig = {
            apiUrl: "DietPlanSchedule/List",
            columnsList: this.allcolumns,
            sortField: "DietPlanId",
            sortOrder: 1,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Date", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "DietPlanId", fieldValue: this.DietPlanId, opType: OperatorComparer.Equals },
                { fieldName: "DietTypeId", fieldValue: this.DietTypeId, opType: OperatorComparer.Contains },
                { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },

            ],
            row: 25
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }

    ListView(value) {
        console.log(value)
        if (value.value !== 0)
            this.DietTypeId = String(value.value)
        else
            this.DietTypeId = "0"

        this.onChangeFirst();
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'DietTypeId')
            this.myFilterform.get('DietTypeId').setValue("")
        if (event == 'DietTypeId')
            this.myFilterform.get('DietTypeId').setValue("")
        else if (event == 'FirstName')
            this.myFilterform.get('FirstName').setValue("")
        else
            if (event == 'LastName')
                this.myFilterform.get('LastName').setValue("")

        this.onChangeFirst();
    }


    NewDietPlan() {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietCreationComponent,
            {
                width: '90vw',
                height: '98vh',
                autoFocus: false,
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }


    Edit(element) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietCreationComponent,
            {
                width: '90%',
                maxWidth: '95vw',
                height: '98%',
                autoFocus: false,
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    DietplanCancel() {
        Swal.fire({
            icon: 'question',
            title: 'Do you want to Cancle Diet Plan',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    // 'dietReqDetId': this.ReqDetId,
                    // 'isCancelledBy': this._loggedService.currentUserValue.userId,
                    // 'cancelledReason': this.DetailCancleTaskForm.get('Reason').value
                };
                console.log(submitData);
                this._DietCreationService.dietplancancle(submitData).subscribe(response => {
                    this._matDialog.closeAll();
                    // this._DietAssessmentService.get('Reason').setValue('');
                    this.grid.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }


    onClose() {
        this._matDialog.closeAll()
    }

    getValidationdoctorMessages() {
        return {
            searchDoctorId: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            dietTypeId: [
                { name: "required", Message: "dietType Name is required" }
            ]
        };
    }


}


export class RequestMaster {
    visitId: number;
    isCancelled: any;
    isAccept: any;
    isDelived: any;
    detIsCancelled: any;
    allAccepted: any;
    allDelivered: any;
    acceptedCount: any;
    deliveredCount: any;
    notAcceptedCount: any;
    notDeliveredCount: any;
    /**
     * Constructor
     *
     * @param RequestMaster
     */
    constructor(RequestMaster) {
        {
            this.visitId = RequestMaster.visitId || 0;
            this.isCancelled = RequestMaster.isCancelled || 0;
            this.isAccept = RequestMaster.isAccept || '';
            this.isDelived = RequestMaster.isDelived || "";
            this.detIsCancelled = RequestMaster.detIsCancelled || "";
            this.allAccepted = RequestMaster.allAccepted || 0;
            this.allDelivered = RequestMaster.allDelivered || '';
            this.acceptedCount = RequestMaster.acceptedCount || "";
            this.deliveredCount = RequestMaster.deliveredCount || "";
            this.notAcceptedCount = RequestMaster.notAcceptedCount || "";
            this.notDeliveredCount = RequestMaster.notDeliveredCount || "";

        }
    }

}

