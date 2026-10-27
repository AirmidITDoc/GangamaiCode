import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, Injector, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
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

import { permissionCodes } from 'app/main/shared/model/permission.model';
import { NewDietCreationComponent } from './new-diet-creation/new-diet-creation.component';
import { DietCreationService } from './diet-creation.service';
import { SchdulepopupComponent } from './schdulepopup/schdulepopup.component';


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

    private closeTimer: any = null;
    StausChangeFlg: any;
    VCancelcount = 0;
    VdraftNewcount = 0; VfinalNewcount = 0;
    VAcceptcount = 0;
    VPendingcount = 0; VTotalcount = 0
    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('ItemNopopover') ItemNopopover!: TemplateRef<any>;
    @ViewChild('draftorFinal') draftorFinal!: TemplateRef<any>;
    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'patient')!.template = this.ItemNopopover;
        this.gridConfig.columnsList.find(col => col.key === 'draftorFinal')!.template = this.draftorFinal;

    }
    @ViewChild('isAccept') isAccept!: TemplateRef<any>;
    allcolumns = [
        {
            heading: 'Status',
            key: 'draftorFinal',
            sort: true,
            align: 'center',
            type: gridColumnTypes.template,
            width: 140            // wide enough for icon + "Final"
        },
        { heading: "Plan Date", key: "planDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
        { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 8 },
        // { heading: "Patient Name", key: "patient", sort: true, align: 'left', emptySign: 'NA', width: 350 },

        { heading: "Patient Name", key: "patient", sort: true, align: 'left', emptySign: 'NA', width: 550, type: gridColumnTypes.template },

        { heading: "Diet Name", key: "dietName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        // { heading: "Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Plan Start Date", key: "planStartDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 110 },
        { heading: "Plan End Date", key: "planEndDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 110 },
        { heading: "Instruction", key: "instruction", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comment", key: "comment", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Accepted user", key: "acceptuser", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Prepared user", key: "progressuser", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Delivered user", key: "deliveruser", sort: true, align: 'left', emptySign: 'NA', width: 180 },

        { heading: "Canclled user", key: "cancleuser", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Cancelled Reason", key: "cancelledReason", sort: true, align: 'left', emptySign: 'NA', width: 140 },

        { heading: "Created user", key: "createdByName", sort: true, align: 'left', emptySign: 'NA', width: 210 },

        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.template, width: 170,
            template: this.actionButtonTemplate
        }

    ];
    gridConfig: gridModel = {
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
        public toastr: ToastrService, public datePipe: DatePipe, private injector: Injector,
    ) { }
    ngOnInit(): void {
        this.myFilterform = this._DietCreationService.filterForm();
        this.Getschduledetail()
    }


    onChangeFirst() {
        this.getfilterdata();
    }
    getchangeDate() {

        this.getfilterdata();

    }

    getfilterdata() {

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

           if (this.gridConfig) {
            setTimeout(() => {
                this.Getschduledetail();
            }, 500);
        }
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

    DietplanCancel(element) {
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
                    "dietPlanId": element.dietPlanId,
                    "isCancelledBy": this._loggedService.currentUserValue.userId,
                };
                console.log(submitData);
                this._DietCreationService.dietplancancle(submitData).subscribe(response => {
                    this._matDialog.closeAll();
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

            dietTypeId: [
                { name: "required", Message: "dietType Name is required" }
            ]
        };
    }
    //card popup
    private overlayRef: OverlayRef | null = null;
    openMenuPopup(element: any, event: MouseEvent): void {
        const target = event.currentTarget as HTMLElement;

        clearTimeout(this.closeTimer);

        this.disposeMenuPopover();

        this.overlayRef = this.overlay.create({
            panelClass: 'menu-popover',
            positionStrategy: this.overlay.position()
                .flexibleConnectedTo(target)
                .withPositions([
                    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },     // below
                    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },    // above if no room
                ])
                .withFlexibleDimensions(false)
                .withPush(true)
                .withViewportMargin(8),
            scrollStrategy: this.overlay.scrollStrategies.close(),
        });

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: { dietPlanId: element.dietPlanId } },
                { provide: MatDialogRef, useValue: { close: () => this.disposeMenuPopover() } },
            ],
        });

        this.overlayRef.attach(new ComponentPortal(SchdulepopupComponent, null, injector));

        // keep it open while the mouse is over the popup itself
        const el = this.overlayRef.overlayElement;
        el.addEventListener('mouseenter', () => clearTimeout(this.closeTimer));
        el.addEventListener('mouseleave', () => this.closeDetailsPopover1());
    }

    closeDetailsPopover1(): void {
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => this.disposeMenuPopover(), 150);   // lets the mouse travel into the popup
    }

    private disposeMenuPopover(): void {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    Changefinal() {
        Swal.fire({
            icon: 'question',
            title: 'Do you want to Final Canteen Request',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Send it!'
        }).then((flag) => {
            if (!flag.isConfirmed) return;
            var payload = {

            }

            this._DietCreationService.DietPlanConvert(payload).subscribe({
                next: () => {
                    this.toastr.success('Diet Plan Confirm');
                    this._matDialog.closeAll();
                },
                error: (error) => this.toastr.error(error.message)
            });

        });
    }
    dataSource = new MatTableDataSource<dietschduleMaster>();
    Getschduledetail() {
        this.VdraftNewcount = 0;
        this.VfinalNewcount = 0;
        this.VAcceptcount = 0;
        this.VPendingcount = 0;
        this.VCancelcount = 0;

        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, 'yyyy-MM-dd');
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, 'yyyy-MM-dd');

        const filters: any[] = [];
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, 'yyyy-MM-dd');
            this.toDate = this.datePipe.transform(toDateControl, 'yyyy-MM-dd');
        }

        filters.push(
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Date", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "DietPlanId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "DietTypeId", fieldValue: "0", opType: OperatorComparer.Contains },
            { fieldName: "FirstName", fieldValue: this.f_name, opType: OperatorComparer.StartsWith },
            { fieldName: "LastName", fieldValue: this.l_name, opType: OperatorComparer.StartsWith },
        );

        const data = {
            'first': 0,
            'rows': 999,
            'sortField': 'DietPlanId',
            'sortOrder': 0,
            'filters': filters,
            'exportType': 'JSON',
            'columns': []
        };
        console.log(data);

        this._DietCreationService.getDietplanlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data);
            if (this.dataSource.data.length > 0) {
                this.VTotalcount = this.dataSource.data.length;
                this.VCancelcount = 0;

                this.dataSource.data.forEach(element => {
                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    } else if (element.draftorFinal) {
                        this.VfinalNewcount = this.VfinalNewcount + 1;
                    } if (!element.draftorFinal) {
                        this.VdraftNewcount = this.VdraftNewcount + 1;
                    }
                });
            }
        });
    }

}
export class dietschduleMaster {
    visitId: number;
    isCancelled: any;
    isAccept: any;
    isDelived: any;
    draftorFinal: any;
    allAccepted: any;
    allDelivered: any;
    acceptedCount: any;
    deliveredCount: any;
    notAcceptedCount: any;
    notDeliveredCount: any;

    constructor(dietschduleMaster) {
        {
            this.visitId = dietschduleMaster.visitId || 0;
            this.isCancelled = dietschduleMaster.isCancelled || 0;
            this.isAccept = dietschduleMaster.isAccept || '';
            this.isDelived = dietschduleMaster.isDelived || '';
            this.draftorFinal = dietschduleMaster.draftorFinal || '';
            this.allAccepted = dietschduleMaster.allAccepted || 0;
            this.allDelivered = dietschduleMaster.allDelivered || '';
            this.acceptedCount = dietschduleMaster.acceptedCount || '';
            this.deliveredCount = dietschduleMaster.deliveredCount || '';
            this.notAcceptedCount = dietschduleMaster.notAcceptedCount || '';
            this.notDeliveredCount = dietschduleMaster.notDeliveredCount || '';
        }
    }
}

