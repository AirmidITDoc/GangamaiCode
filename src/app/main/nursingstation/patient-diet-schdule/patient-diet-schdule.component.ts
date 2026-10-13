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
import { NewSchduleComponent } from './new-schdule/new-schdule.component';
import { DietSchduleService } from './diet-schdule.service';
import { RequestcardpopupComponent } from 'app/main/canteenmanagement/patient-diet-reauest/requestcardpopup/requestcardpopup.component';
import { NewDietPlanComponent } from './new-diet-plan/new-diet-plan.component';
import { NewDietAessessmentComponent } from './new-diet-aessessment/new-diet-aessessment.component';
import { permissionCodes } from 'app/main/shared/model/permission.model';


@Component({
    selector: 'app-patient-diet-schdule',
    templateUrl: './patient-diet-schdule.component.html',
    styleUrls: ['./patient-diet-schdule.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientDietSchduleComponent {
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
    autocompleteModedeptdoc: string = "ConDoctor";
    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('iconPatientCategory') iconPatientCategory!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.iconPatientCategory;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;

    }

    allcolumns = [
        { heading: "", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, width: 50 },
        { heading: "RegNo", key: "regNo", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "IPD No", key: "ipdno", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Doctor Name", key: "doctorname", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Ward / Bed No", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.template, width: 200,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }

    ];
    gridConfig: gridModel = {
        permissionCode: permissionCodes.Admission,
        apiUrl: "Admission/AdmissionList",
        columnsList: this.allcolumns,
        sortField: "AdmissionId",
        sortOrder: 1,
        filters: [
            { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: "", opType: OperatorComparer.Equals },
            { fieldName: "Admtd_Dschrgd_All", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "M_Name", fieldValue: "%", opType: OperatorComparer.Contains },
            { fieldName: "IPNo", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Id", fieldValue: "0", opType: OperatorComparer.Equals },
        ],
        row: 25
    }
    constructor(public _DietRequestService: DietSchduleService,
        private _formBuilder: FormBuilder, private overlay: Overlay,
        private commonService: PrintserviceService, public _matDialog: MatDialog, private _loggedService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe,
        private cdr: ChangeDetectorRef) { }
    ngOnInit(): void {
        this.myFilterform = this._DietRequestService.filterForm();
        this.myFilterform.get('fromDate').setValue('');
        this.myFilterform.get('enddate').setValue('');

    }


    onChangeFirst(event) {
        console.log(event)

        this.getfilterdata();
    }
    getchangeDate() {

        this.f_name = this.myFilterform.get('FirstName').value + "%"
        this.l_name = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.m_name = this.myFilterform.get('MiddleName').value + "%"
        this.IPDNo = this.myFilterform.get('IPDNo').value || "0"

        this.fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd") || "1900-01-01"
        this.toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd") || "1900-01-01"


        this.getfilterdata();

    }
    getfilterdata() {
        debugger
        this.gridConfig = {
            apiUrl: "Admission/AdmissionList",
            columnsList: this.allcolumns,
            sortField: "AdmissionId",
            sortOrder: 0,
            filters: [
                { fieldName: "F_Name", fieldValue: this.f_name, opType: OperatorComparer.Contains },
                { fieldName: "L_Name", fieldValue: this.l_name, opType: OperatorComparer.Contains },
                { fieldName: "Reg_No", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "Doctor_Id", fieldValue: "0", opType: OperatorComparer.Equals },
                { fieldName: "WardId", fieldValue: "0", opType: OperatorComparer.Equals },

                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                { fieldName: "Admtd_Dschrgd_All", fieldValue: this.status, opType: OperatorComparer.Equals },
                { fieldName: "M_Name", fieldValue: this.m_name, opType: OperatorComparer.Equals },
                { fieldName: "IPNo", fieldValue: this.IPDNo, opType: OperatorComparer.Equals }

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
            else
                if (event == 'MiddleName')
                    this.myFilterform.get('MiddleName').setValue("")
        if (event == 'RegNo')
            this.myFilterform.get('RegNo').setValue("")
        if (event == 'IPDNo')
            this.myFilterform.get('IPDNo').setValue("")

        this.onChangeFirst(event);
    }


    NewRequest() {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewSchduleComponent,
            {
                width: '90%',
                maxWidth: '95vw',
                height: '98%',
                autoFocus: false
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }
    NewDietPlanCreate(element) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietPlanComponent,
            {
                width: '90%',
                height: '90vh',
                autoFocus: false,
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }
    NewDietPlanAessessment(element) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewDietAessessmentComponent,
            {
                width: '90%',
                height: '90vh',
                autoFocus: false,
                data: element
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }
    Edit(row) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();
        debugger
        const that = this;
        const dialogRef = this._matDialog.open(NewSchduleComponent,
            {
                width: '90%',
                maxWidth: '95vw',
                height: '98%',
                autoFocus: false,
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    onClose() {
        this._matDialog.closeAll()
    }

    getValidationdoctorMessages() {
        return {
            searchDoctorId: [
                { name: "required", Message: "Doctor Name is required" }
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
