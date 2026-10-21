import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, Injector, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import Swal from 'sweetalert2';

import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDrawer } from '@angular/material/sidenav';
import { RequestcardpopupComponent } from 'app/main/canteenmanagement/patient-diet-reauest/requestcardpopup/requestcardpopup.component';
import { ToastrService } from 'ngx-toastr';
import { MenuItemPopupComponent } from 'app/main/canteenmanagement/patient-diet-reauest/menu-item-popup/menu-item-popup.component';
import { AddonMenuService } from './addon-menu.service';
import { DietReqWokflowComponent } from 'app/main/nursingstation/diet-request/diet-req-wokflow/diet-req-wokflow.component';
import { NewAddonDietComponent } from './new-addon-diet/new-addon-diet.component';


@Component({
  selector: 'app-patient-addon-menu',
  templateUrl: './patient-addon-menu.component.html',
  styleUrls: ['./patient-addon-menu.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations
})
export class PatientAddonMenuComponent {
 HeaderCancleTaskForm: FormGroup;
    DetailCancleTaskForm: FormGroup;
    myFilterform: FormGroup;
    fromDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    toDate = this.datePipe.transform(new Date().toISOString(), 'yyyy-MM-dd');
    regNo: any = '';
    fname = '%';
    lname = '%';
    WardId = '0';
    autocompleteModewardName: string = 'Room';
    @ViewChild('detailDrawer') detailDrawer: MatDrawer;

    ReqId = 0;
    ReqDetId = 0;
    CancleStatus: boolean = true;
    Accepted: boolean = false;
    Delivered: boolean = false;
    Acceptedcnt = 0;
    Deliveredcnt = 0;
    NotAcceptedcnt = 0;
    NotDeliveredcnt = 0;
    dataSource = new MatTableDataSource<RequestMaster>();

    VCancelcount = 0;
    VNewcount = 0;
    VAcceptcount = 0;
    VPendingcount = 0;

    // ---- popup state ----
    // Diet Menu Name popup
    private overlayRef: OverlayRef | null = null;
    private closeTimer: any = null;

    // Req No popup
    private ReqNoOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('IsCancelledBy') IsCancelledBy!: TemplateRef<any>;
    @ViewChild('status') status!: TemplateRef<any>;
    @ViewChild('isAccept') isAccept!: TemplateRef<any>;
    @ViewChild('isDelived') isDelived!: TemplateRef<any>;
    @ViewChild('detIsCancelled') detIsCancelled!: TemplateRef<any>;
    @ViewChild('HeaderCancleTask') HeaderCancleTask!: TemplateRef<any>;
    @ViewChild('DetailCancleTask') DetailCancleTask!: TemplateRef<any>;
    @ViewChild('ReqNopopover') ReqNopopover!: TemplateRef<any>;
    @ViewChild('ItemNopopover') ItemNopopover!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.IsCancelledBy;
        this.gridConfig.columnsList.find(col => col.key === 'dietReqNo')!.template = this.ReqNopopover;
        this.gridConfig.columnsList.find(col => col.key === 'dietMenuName')!.template = this.ItemNopopover;
    }

    allcolumns = [
        { heading: 'Status', key: 'isCancelled', sort: true, align: 'left', emptySign: 'NA', width: 80, type: gridColumnTypes.template },

        { heading: 'Request Date', key: 'date', sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        { heading: 'Request No', key: 'dietReqNo', sort: true, align: 'left', emptySign: 'NA', width: 50, type: gridColumnTypes.template },

        { heading: 'Diet Menu Name', key: 'dietMenuName', sort: true, align: 'left', emptySign: 'NA', width: 300, type: gridColumnTypes.template },

        { heading: 'Created By', key: 'userName', sort: true, align: 'left', emptySign: 'NA', width: 220 },
        { heading: 'Cancelled By', key: 'cancelledUser', sort: true, align: 'left', emptySign: 'NA', width: 240 },

        {
            heading: 'Action', key: 'action', align: 'right', width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate  // Assign ng-template to the column
        }
    ];

    constructor(public _DietRequestService: AddonMenuService,
        private _formBuilder: FormBuilder,
        private overlay: Overlay,
        private injector: Injector,
        private commonService: PrintserviceService,
        public _matDialog: MatDialog,
        private _loggedService: AuthenticationService,
        public toastr: ToastrService,
        public datePipe: DatePipe,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.myFilterform = this.filterForm();

        this.HeaderCancleTaskForm = this.CreateheaderCancleForm();
        this.DetailCancleTaskForm = this.CreatdetailCancleForm();
        this.Getrequestdetail();
    }

    CreateheaderCancleForm() {
        return this._formBuilder.group({
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            AdmissionTime: [''],
            Reason: ['', Validators.required]
        });
    }

    CreatdetailCancleForm() {
        return this._formBuilder.group({
            AdmissionDate: [(new Date()).toISOString(), Validators.required],
            AdmissionTime: [''],
            Reason: ['', Validators.required]
        });
    }

    filterForm(): FormGroup {
        return this._formBuilder.group({
            fromDate: [(new Date()).toISOString()],
            enddate: [(new Date()).toISOString()],
            DietReqId: ''
        });
    }

    gridConfig: gridModel = {
        apiUrl: 'DietPatientRequest/DietPatientRequestHeaderList',
        columnsList: this.allcolumns,
        sortField: 'DietReqId',
        sortOrder: 0,
        filters: [
            { fieldName: 'From_Dt', fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: 'To_Dt', fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: 'DietReqId', fieldValue: '0', opType: OperatorComparer.Equals }
        ]
    };

    selectChangeward(value) {
        if (value.value !== 0)
            this.WardId = value.value;
        else
            this.WardId = '0';

        this.onChangeFirst();
    }

    Clearfilter(event) {
        console.log(event);
        if (event == 'DietReqId')
            this.myFilterform.get('DietReqId').setValue('');

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.regNo = this.myFilterform.get('DietReqId').value;

        this.getfilterdata();
    }

    getfilterdata() {
        let fromDate1 = this.myFilterform.get('fromDate').value || '';
        let toDate1 = this.myFilterform.get('enddate').value || '';
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, 'yyyy-MM-dd') : '';
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, 'yyyy-MM-dd') : '';

        let Reqno = this.myFilterform.get('DietReqId').value || '';
        this.gridConfig = {
            apiUrl: 'DietPatientRequest/DietPatientRequestHeaderList',
            columnsList: this.allcolumns,
            sortField: 'DietReqId',
            sortOrder: 0,
            filters: [
                { fieldName: 'From_Dt ', fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: 'To_Dt', fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: 'DietReqId', fieldValue: Reqno, opType: OperatorComparer.Equals }
            ]
        };
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();

        if (this.gridConfig) {
            setTimeout(() => {
                this.Getrequestdetail();
            }, 500);
        }
    }

    gridConfig1: gridModel = new gridModel();

    isShowDetailTable: boolean = false;
    isDetailicon: boolean = true;

    onPrint(element) {
        console.log(element);
        this.commonService.Onprint('ReqId', element.reqId, 'CanteenRequestprint');
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
    private isTrue(v: any): boolean {
        return v === true || v === 1 || v === '1' || String(v).toLowerCase() === 'true';
    }

    canCancel(row: any): boolean {
        return !this.isTrue(row.isCancelled)
            && !this.isTrue(row.allAccepted)
            && !(Number(row.acceptedCount) > 0)
            && !(Number(row.deliveredCount) > 0);
    }
    openheadercancletask(contact): void {
        console.log(contact);
        this.ReqId = contact.dietReqId;

        this._matDialog.open(this.HeaderCancleTask, {
            width: '520px',
            maxWidth: '95vw',
            autoFocus: false,
            disableClose: true
        });
    }

    HeaderRequestCancle() {
        Swal.fire({
            icon: 'question',
            title: 'Do you want to Cancle Request',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    'dietReqId': this.ReqId,
                    'isCancelledBy': this._loggedService.currentUserValue.userId,
                    'cancelledReason': this.HeaderCancleTaskForm.get('Reason').value
                };
                console.log(submitData);
                this._DietRequestService.Requestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll();
                    this.HeaderCancleTaskForm.get('Reason').setValue('');
                    this.Getrequestdetail();
                    this.grid.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    opendetailcancletask(contact): void {
        console.log(contact);
        this.ReqDetId = contact.dietReqDetId;
        this._matDialog.open(this.DetailCancleTask, {
            width: '520px',
            maxWidth: '95vw',
            autoFocus: false,
            disableClose: true
        });
    }

    DetailRequestCancle(element?) {
        Swal.fire({
            icon: 'question',
            title: 'Do you want to Cancle Request',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, Cancel it!'
        }).then((flag) => {
            if (flag.isConfirmed) {
                const submitData = {
                    'dietReqDetId': this.ReqDetId,
                    'isCancelledBy': this._loggedService.currentUserValue.userId,
                    'cancelledReason': this.DetailCancleTaskForm.get('Reason').value
                };
                console.log(submitData);
                this._DietRequestService.DetailRequestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll();
                    this.DetailCancleTaskForm.get('Reason').setValue('');
                    this.grid1.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });
    }

    WorkFlow(element: any) {
        this._matDialog.open(DietReqWokflowComponent, {
            width: '90vw',
            maxWidth: '1100px',
            maxHeight: '90vh',
            data: { dietReqId: element.dietReqId }
        });
    }

    NewRequest() {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewAddonDietComponent, {
            width: '90%',
            maxWidth: '95vw',
            height: '98%',
            autoFocus: false
        });
        dialogRef.afterClosed().subscribe(result => {
            this.Getrequestdetail();
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    Edit(row) {
        const buttonElement = document.activeElement as HTMLElement;
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewAddonDietComponent, {
            width: '90%',
            maxWidth: '95vw',
            height: '98%',
            autoFocus: false,
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            this.Getrequestdetail();
            this.grid.bindGridData();
            console.log('The dialog was closed - Action', result);
        });
    }

    onClose() {
        this._matDialog.closeAll();
    }

    getValidationMessages() {
        return {
            WardName: [],
        };
    }

    reqNo: any = '';

    Getrequestdetail() {
        this.VNewcount = 0;
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
            { 'fieldName': 'From_Dt', 'fieldValue': String(this.fromDate), 'opType': 'Contains' },
            { 'fieldName': 'To_Dt', 'fieldValue': String(this.toDate), 'opType': 'Contains' },
            { 'fieldName': 'DietReqId', 'fieldValue': String(this.reqNo), 'opType': 'Equals' }
        );

        const data = {
            'first': 0,
            'rows': 999,
            'sortField': 'DietReqId',
            'sortOrder': 0,
            'filters': filters,
            'exportType': 'JSON',
            'columns': []
        };
        console.log(data);

        this._DietRequestService.getRequestlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data);
            if (this.dataSource.data.length > 0) {
                this.VNewcount = this.dataSource.data.length;
                this.VCancelcount = 0;

                this.dataSource.data.forEach(element => {
                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    }
                });
            }
        });
    }

    GetrequestdetailStatus(event) {
        this.ReqId = event.dietReqNo;
        this.VNewcount = 0;
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
            { 'fieldName': 'From_Dt', 'fieldValue': String(this.fromDate), 'opType': 'Contains' },
            { 'fieldName': 'To_Dt', 'fieldValue': String(this.toDate), 'opType': 'Contains' },
            { 'fieldName': 'DietReqId', 'fieldValue': String(this.ReqId), 'opType': 'Equals' }
        );

        const data = {
            'first': 0,
            'rows': 999,
            'sortField': 'DietReqId',
            'sortOrder': 0,
            'filters': filters,
            'exportType': 'JSON',
            'columns': []
        };
        console.log(data);
        this._DietRequestService.getRequestlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data);
            if (this.dataSource.data.length > 0) {
                this.Acceptedcnt = this.dataSource.data[0].acceptedCount;
                this.Deliveredcnt = this.dataSource.data[0].deliveredCount;
                this.NotAcceptedcnt = this.dataSource.data[0].notAcceptedCount;
                this.NotDeliveredcnt = this.dataSource.data[0].notDeliveredCount;

                this.dataSource.data.forEach(element => {
                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    }
                });
            }
        });
    }

    onRowClick(row: any) {
        this.GetDetails(row);
        this.detailDrawer.open();
    }

    detailList: any[] = [];

    GetDetails(data) {
        console.log(data);
        this.ReqId = data.dietReqId;
        const DietReqId = String(data.dietReqId);

        const requestData = {
            'first': 0,
            'rows': 999,
            'sortField': 'DietReqDetId',
            'sortOrder': 0,
            'filters': [
                { 'fieldName': 'DietReqId', 'fieldValue': DietReqId, 'opType': 'Equals' }
            ],
            'exportType': 'JSON',
            'columns': []
        };

        this._DietRequestService.getRequestdetaillist(requestData).subscribe((response) => {
            this.detailList = response.data || [];
            this.cdr.detectChanges();
        }, (error) => {
            this.toastr.error(error.message);
        });
    }

    // =====================================================================
    //  Req No hover popup (RequestcardpopupComponent)
    // =====================================================================

    openDetailsPopover(event: MouseEvent, doctorData: any) {
        event.stopPropagation();

        // capture now: event.currentTarget is null once we are inside setTimeout
        const target = event.currentTarget as HTMLElement;

        clearTimeout(this.hoverTimeout);
        clearTimeout(this.patientCloseTimeout);

        this.hoverTimeout = setTimeout(() => {
            this.disposePopover();          // close the Menu popup if it is open
            this.disposeReqNoPopover();     // replace any Req No popup that is already open

            const positionStrategy = this.overlay.position()
                .flexibleConnectedTo(target)
                .withPositions([
                    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' },     // below
                    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom' },     // above
                    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' },    // right
                    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' }     // left
                ])
                .withFlexibleDimensions(false)
                .withPush(true)              // keeps it inside the screen
                .withViewportMargin(8);

            this.ReqNoOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(RequestcardpopupComponent);
            const componentRef: ComponentRef<RequestcardpopupComponent> = this.ReqNoOverlayRef.attach(portal);
            componentRef.instance.doctorData = doctorData;

            // re-pick above/below once the cards have loaded and the popup has grown
            componentRef.instance.loaded.subscribe(() => {
                this.ReqNoOverlayRef?.updatePosition();
            });

            const overlayElement = this.ReqNoOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeDetailsPopover());
        }, 300);
    }

    closeDetailsPopover() {
        clearTimeout(this.hoverTimeout);            // cancel a pending open
        clearTimeout(this.patientCloseTimeout);
        // small delay so the mouse can travel from the link into the popup
        this.patientCloseTimeout = setTimeout(() => this.disposeReqNoPopover(), 200);
    }

    keepPopoverOpen() {
        clearTimeout(this.patientCloseTimeout);
        this.patientCloseTimeout = null;
    }

    private disposeReqNoPopover() {
        if (this.ReqNoOverlayRef) {
            this.ReqNoOverlayRef.dispose();
            this.ReqNoOverlayRef = null;
        }
    }

    // =====================================================================
    //  Diet Menu Name hover popup (MenuItemPopupComponent)
    // =====================================================================

    openMenuPopup(element: any, event: MouseEvent) {
        const target = event.currentTarget as HTMLElement;

        clearTimeout(this.closeTimer);
        this.disposeReqNoPopover();      // close the Req No popup if it is open
        this.disposePopover();           // replace any menu popup that is already open

        this.overlayRef = this.overlay.create({
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

        // MenuItemPopupComponent was written as a dialog, so it reads MAT_DIALOG_DATA
        // in the shape { menuName, detail } and may inject MatDialogRef.
        const popupData = { menuName: element.dietMenuName, detail: element.dietMenuDetails };

        const injector = Injector.create({
            parent: this.injector,
            providers: [
                { provide: MAT_DIALOG_DATA, useValue: popupData },
                { provide: MatDialogRef, useValue: { close: () => this.disposePopover() } },
            ],
        });

        this.overlayRef.attach(new ComponentPortal(MenuItemPopupComponent, null, injector));

        // keep it open while the mouse is over the popup itself
        const el = this.overlayRef.overlayElement;
        el.addEventListener('mouseenter', () => clearTimeout(this.closeTimer));
        el.addEventListener('mouseleave', () => this.closeDetailsPopover1());
    }

    closeDetailsPopover1() {
        clearTimeout(this.closeTimer);
        this.closeTimer = setTimeout(() => this.disposePopover(), 150);
    }

    private disposePopover() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
            this.overlayRef = null;
        }
    }

    // =====================================================================

    ngOnDestroy() {
        clearTimeout(this.hoverTimeout);
        clearTimeout(this.patientCloseTimeout);
        clearTimeout(this.closeTimer);
        this.disposeReqNoPopover();
        this.disposePopover();
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

    constructor(RequestMaster) {
        {
            this.visitId = RequestMaster.visitId || 0;
            this.isCancelled = RequestMaster.isCancelled || 0;
            this.isAccept = RequestMaster.isAccept || '';
            this.isDelived = RequestMaster.isDelived || '';
            this.detIsCancelled = RequestMaster.detIsCancelled || '';
            this.allAccepted = RequestMaster.allAccepted || 0;
            this.allDelivered = RequestMaster.allDelivered || '';
            this.acceptedCount = RequestMaster.acceptedCount || '';
            this.deliveredCount = RequestMaster.deliveredCount || '';
            this.notAcceptedCount = RequestMaster.notAcceptedCount || '';
            this.notDeliveredCount = RequestMaster.notDeliveredCount || '';
        }
    }
}