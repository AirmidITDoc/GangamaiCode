import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, ComponentRef, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from "@angular/material/dialog";
import { MatDrawer } from '@angular/material/sidenav';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { ComponentPortal } from '@angular/cdk/portal';
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import Swal from 'sweetalert2';
import { DietRequestService } from './diet-request.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DietDetailListComponent } from './diet-detail-list/diet-detail-list.component';
import { MatTableDataSource } from '@angular/material/table';
import { RequestcardpopupComponent } from './requestcardpopup/requestcardpopup.component';
// TODO: update this path to wherever RequestcardpopupComponent actually lives


@Component({
    selector: 'app-patient-diet-reauest',
    templateUrl: './patient-diet-reauest.component.html',
    styleUrls: ['./patient-diet-reauest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class PatientDietReauestComponent implements OnInit, OnDestroy {
    HeaderCancleTaskForm: FormGroup
    DetailCancleTaskForm: FormGroup
    myFilterform: FormGroup;
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    reqNo: any = ""
    fname = "%"
    lname = "%"
    WardId = "0"
    autocompleteModewardName: string = "Room";

    ReqId = 0
    ReqDetId = 0
    Accepted: boolean = false
    Delivered: boolean = false
    Acceptedcnt = 0
    Deliveredcnt = 0
    NotAcceptedcnt = 0
    NotDeliveredcnt = 0
    dataSource = new MatTableDataSource<RequestMaster>();

    VCancelcount = 0;
    VNewcount = 0;
    VAcceptcount = 0;
    VPendingcount = 0;
    @ViewChild('doctorNameWithPopoverTemplate') doctorNameWithPopoverTemplate!: TemplateRef<any>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
    @ViewChild('isCancelled') isCancelled!: TemplateRef<any>;
    @ViewChild('status') status!: TemplateRef<any>;
    @ViewChild('isAccept') isAccept!: TemplateRef<any>;
    @ViewChild('isDelived') isDelived!: TemplateRef<any>;
    @ViewChild('HeaderCancleTask') HeaderCancleTask!: TemplateRef<any>;
    @ViewChild('DetailCancleTask') DetailCancleTask!: TemplateRef<any>;

    // reference to the detail drawer
    @ViewChild('detailDrawer') detailDrawer: MatDrawer;

    private overlayRef: OverlayRef | null = null;
    private patientOverlayRef: OverlayRef | null = null;
    private doctorOverlayRef: OverlayRef | null = null;
    private hoverTimeout: any = null;
    private patientCloseTimeout: any = null;
    private doctorCloseTimeout: any = null;

    ngAfterViewInit() {
        // Header/list grid templates
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'isCancelled')!.template = this.isCancelled;
        this.gridConfig.columnsList.find(col => col.key === 'dietReqNo')!.template = this.doctorNameWithPopoverTemplate;

        // Detail grid templates (drawer)
        // this.gridConfig1.columnsList.find(col => col.key === 'isAccept')!.template = this.isAccept;
        // this.gridConfig1.columnsList.find(col => col.key === 'isDelived')!.template = this.isDelived;
        // this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
    }

    allcolumns = [
        { heading: "Status", key: "isCancelled", sort: true, align: 'left', emptySign: 'NA', width: 80, type: gridColumnTypes.template },
        // { heading: "Accepted", key: "acceptedCount", sort: true, align: 'center', emptySign: '0', width: 70 },
        // { heading: "Not Accepted", key: "notAcceptedCount", sort: true, align: 'center', emptySign: '0', width: 70 },
        // { heading: "Delivered", key: "deliveredCount", sort: true, align: 'center', emptySign: '0', width: 70 },
        // { heading: "Not Delivered", key: "notDeliveredCount", sort: true, align: 'center', emptySign: '0', width: 70 },

        { heading: "Request Date", key: "date", sort: true, align: 'left', emptySign: 'NA', width: 170, type: 8 },
        // { heading: "Req No", key: "dietReqNo", sort: true, align: 'left', emptySign: 'NA', width: 70 },
        { heading: "Req No", key: "dietReqNo", sort: true, align: 'left', emptySign: 'NA', width: 90, type: gridColumnTypes.template },

        { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Created By", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 220 },
        { heading: "Cancelled By", key: "cancelledUser", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        // { heading: "Cancelled Date", key: "isCancelledDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },

        {
            heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ]

    detailColumns = [
        {
            heading: "Status", key: "isAccept", sort: true, align: 'left', emptySign: 'NA', width: 130,
            type: gridColumnTypes.template, template: this.isAccept
        },
        {
            heading: "IsDelived", key: "isDelived", sort: true, align: 'left', emptySign: 'NA', width: 130,
            type: gridColumnTypes.template, template: this.isDelived
        },
        { heading: "Order Time", key: "orderTime", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Room Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        { heading: "Meal Name", key: "mealName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
        { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Comments", key: "comments", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Accepted DateTime", key: "isAcceptedDateTime", sort: true, align: 'left', emptySign: 'NA', width: 210, type: 8 },
        { heading: "Delived DateTime", key: "isDelivedDateTime", sort: true, align: 'left', emptySign: 'NA', width: 210, type: 8 },
        { heading: "Cancelled", key: "detIsCancelledBy", sort: true, align: 'left', emptySign: 'NA', width: 120, type: gridColumnTypes.template },
        { heading: "Cancelled By", key: "cancelledUser", sort: true, align: 'left', emptySign: 'NA', width: 210 },
        { heading: "Cancelled Reason", key: "cancelledReason", sort: true, align: 'left', emptySign: 'NA', width: 140 },
        // {
        //     heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
        //     template: this.actionButtonTemplate1
        // }
    ];

    constructor(public _DietRequestService: DietRequestService,
        private _formBuilder: FormBuilder, private overlay: Overlay,
        private commonService: PrintserviceService, public _matDialog: MatDialog, private _loggedService: AuthenticationService,
        public toastr: ToastrService, public datePipe: DatePipe,
        private cdr: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.myFilterform = this.filterForm()

        this.HeaderCancleTaskForm = this.CreateheaderCancleForm()
        this.DetailCancleTaskForm = this.CreatdetailCancleForm()
        this.Getrequestdetailcount()

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
        apiUrl: "DietPatientRequest/DietPatientRequestHeaderList",
        columnsList: this.allcolumns,
        sortField: "DietReqId",
        sortOrder: 0,
        filters: [
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
            { fieldName: "DietReqId", fieldValue: "0", opType: OperatorComparer.Equals }

        ]
    }

    // DETAIL grid config — a persistent class field (previously rebuilt from
    // scratch inside GetDetails on every click). Only its filter value changes now.
    gridConfig1: gridModel = {
        apiUrl: "DietPatientRequest/DietPatientRequestDetailsList",
        columnsList: this.detailColumns,
        sortField: "DietReqDetId",
        sortOrder: 0,
        filters: [
            { fieldName: "DietReqId", fieldValue: "0", opType: OperatorComparer.Equals }
        ]
    };

    isShowDetailTable: boolean = false;


    selectChangeward(value) {
        if (value.value !== 0)
            this.WardId = value.value
        else
            this.WardId = "0"

        this.onChangeFirst();
    }

    Clearfilter(event) {
        console.log(event)
        if (event == 'DietReqId')
            this.myFilterform.get('DietReqId').setValue("")

        this.onChangeFirst();
    }

    onChangeFirst() {
        this.reqNo = this.myFilterform.get('DietReqId').value

        this.getfilterdata();
    }

    getfilterdata() {

        let fromDate1 = this.myFilterform.get("fromDate").value || "";
        let toDate1 = this.myFilterform.get("enddate").value || "";
        fromDate1 = fromDate1 ? this.datePipe.transform(fromDate1, "yyyy-MM-dd") : "";
        toDate1 = toDate1 ? this.datePipe.transform(toDate1, "yyyy-MM-dd") : "";

        let Reqno = this.myFilterform.get("DietReqId").value || "";
        this.gridConfig = {
            apiUrl: "DietPatientRequest/DietPatientRequestHeaderList",
            columnsList: this.allcolumns,
            sortField: "DietReqId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt ", fieldValue: fromDate1, opType: OperatorComparer.Equals },
                { fieldName: "To_Dt", fieldValue: toDate1, opType: OperatorComparer.Equals },
                { fieldName: "DietReqId", fieldValue: Reqno, opType: OperatorComparer.Equals }

            ]
        }
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
        if (this.gridConfig) {
            setTimeout(() => {
                this.Getrequestdetailcount()

            }, 500);
        }
    }


    // NEW: plain array backing the card list in the drawer
    detailList: any[] = [];

    // Populates detailList by calling the detail API directly
    // (replaces grid1 binding since we no longer render a table in the drawer)
    GetDetails(data) {
        console.log(data);
        this.ReqId = data.dietReqId;
        const DietReqId = String(data.dietReqId);

        this.gridConfig1.filters[0].fieldValue = DietReqId;

        const requestData = {
            "first": 0,
            "rows": 999,
            "sortField": "DietReqDetId",
            "sortOrder": 0,
            "filters": [
                { "fieldName": "DietReqId", "fieldValue": DietReqId, "opType": "Equals" }
            ],
            "exportType": "JSON",
            "columns": []
        };

        this._DietRequestService.getRequestdetaillist(requestData).subscribe((response) => {
            this.detailList = response.data || [];
            this.cdr.detectChanges();
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    onRowClick(row: any) {
        this.GetDetails(row);
        this.detailDrawer.open();
    }

    // close the drawer manually (e.g. its own close button)
    closeDetailDrawer() {
        this.detailDrawer.close();
    }

    // reset detail table visibility when the drawer finishes closing
    // (via backdrop click, Esc, or closeDetailDrawer())
    onDrawerOpenedChange(isOpen: boolean) {
        if (!isOpen) {
            this.isShowDetailTable = false;
        }
    }

    onPrint(element) {
        console.log(element)
        this.commonService.Onprint("ReqId", element.reqId, "CanteenRequestprint");
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
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqId": this.ReqId,
                    "isCancelledBy": this._loggedService.currentUserValue.userId,
                    "cancelledReason": this.HeaderCancleTaskForm.get('Reason').value
                };
                console.log(submitData);
                this._DietRequestService.Requestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll()
                    this.grid.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                }
                );
            }
        });

    }

    opendetailcancletask(contact): void {
        console.log(contact)
        this.ReqDetId = contact.dietReqId

        this._matDialog.open(this.DetailCancleTask, {
            width: '520px',
            maxWidth: '95vw',
            autoFocus: false,
            disableClose: true
        })

    }
    DetailRequestCancle(element) {

        Swal.fire({
            icon: 'question',
            title: 'Do you want to Cancle Request',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!"

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isCancelledBy": this._loggedService.currentUserValue.userId,
                    "cancelledReason": this.DetailCancleTaskForm.get('Reason').value

                };
                console.log(submitData);
                this._DietRequestService.DetailRequestcancle(submitData).subscribe(response => {
                    this._matDialog.closeAll()
                    this.grid1.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                }
                );
            }
        });

    }

    AcceptRequest(element) {
        console.log(element)
        Swal.fire({
            title: 'Do you want to Accept Request',
            showCancelButton: true,
            confirmButtonText: 'OK',


        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {
                    "dietReqDetId": element.dietReqDetId,
                    "isAccept": true,
                    "isAcceptedBy": this._loggedService.currentUserValue.userId,
                    "isAcceptedDateTime": this.datePipe.transform(new Date(), "yyyy-MM-dd"),
                };
                console.log(submitData);
                this._DietRequestService.RequestAccept(submitData).subscribe(response => {
                    this.toastr.success('Request accepted');
                    this._matDialog.closeAll()
                    this.grid1.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });

    }
    DeliverRequest(element) {
        console.log(element)
        Swal.fire({
            title: 'Do you want to Deliver Request',
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {

            if (flag.isConfirmed) {
                const submitData = {

                    "dietReqDetId": element.dietReqDetId,
                    "isDelived": true,
                    "isDelivedBy": this._loggedService.currentUserValue.userId,
                    "isDelivedDateTime": this.datePipe.transform(new Date(), "yyyy-MM-dd"),

                };
                console.log(submitData);
                this._DietRequestService.RequestDeliver(submitData).subscribe(response => {
                    this.toastr.success('Request Deliver');
                    this._matDialog.closeAll()
                    this.grid1.bindGridData();
                }, (error) => {
                    this.toastr.error(error.message);
                });
            }
        });

    }

    onEdit(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const that = this;
        const dialogRef = this._matDialog.open(DietDetailListComponent,
            {
                width: '90%',
                maxWidth: '95vw',
                height: '98%',   // add this if missing — without it the dialog sizes to content and can overflow the viewport, causing the page-level scrollbar
                autoFocus: false,
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }

    onClose() {
        this._matDialog.closeAll()
    }

    getValidationMessages() {
        return {

            WardName: [],

        }
    }

    Getrequestdetailcount() {

        this.VNewcount = 0;
        this.VAcceptcount = 0;
        this.VPendingcount = 0;
        this.VCancelcount = 0;

        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];

        // Handle date range
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }


        filters.push(

            {
                "fieldName": "From_Dt",
                "fieldValue": String(this.fromDate),
                "opType": "Contains"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": String(this.toDate),
                "opType": "Contains"
            },
            {
                "fieldName": "DietReqId",
                "fieldValue": String(this.reqNo),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "DietReqId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._DietRequestService.getRequestlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data)
            if (this.dataSource.data.length > 0) {
                this.VNewcount = this.dataSource.data.length
                this.VCancelcount = 0;
                // this.Accepted = this.dataSource.data[0].allAccepted
                // this.Delivered = this.dataSource.data[0].allDelivered

                // this.Acceptedcnt = this.dataSource.data[0].acceptedCount
                // this.Deliveredcnt = this.dataSource.data[0].deliveredCount
                // this.NotAcceptedcnt = this.dataSource.data[0].notAcceptedCount
                // this.NotDeliveredcnt = this.dataSource.data[0].notDeliveredCount

                this.dataSource.data.forEach(element => {

                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    }

                });

            }
        });
    }

    GetrequestdetailStatus(event) {
        this.ReqId = event.dietReqNo
        this.VNewcount = 0;
        this.VAcceptcount = 0;
        this.VPendingcount = 0;
        this.VCancelcount = 0;

        const fromDateControl = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd");
        const toDateControl = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd");

        const filters: any[] = [];

        // Handle date range
        if (fromDateControl && toDateControl) {
            this.fromDate = this.datePipe.transform(fromDateControl, "yyyy-MM-dd");
            this.toDate = this.datePipe.transform(toDateControl, "yyyy-MM-dd");
        }


        filters.push(

            {
                "fieldName": "From_Dt",
                "fieldValue": String(this.fromDate),
                "opType": "Contains"
            },
            {
                "fieldName": "To_Dt",
                "fieldValue": String(this.toDate),
                "opType": "Contains"
            },
            {
                "fieldName": "DietReqId",
                "fieldValue": String(this.ReqId),
                "opType": "Equals"
            }
        );

        const data = {
            "first": 0,
            "rows": 999,
            "sortField": "DietReqId",
            "sortOrder": 0,
            "filters": filters,
            "exportType": "JSON",
            "columns": []
        };
        console.log(data)
        this._DietRequestService.getRequestlist(data).subscribe((response) => {
            this.dataSource.data = response.data;
            console.log(this.dataSource.data)
            if (this.dataSource.data.length > 0) {

                this.Accepted = this.dataSource.data[0].allAccepted
                this.Delivered = this.dataSource.data[0].allDelivered

                this.Acceptedcnt = this.dataSource.data[0].acceptedCount
                this.Deliveredcnt = this.dataSource.data[0].deliveredCount
                this.NotAcceptedcnt = this.dataSource.data[0].notAcceptedCount
                this.NotDeliveredcnt = this.dataSource.data[0].notDeliveredCount

                this.dataSource.data.forEach(element => {

                    if (element.isCancelled) {
                        this.VCancelcount = this.VCancelcount + 1;
                    }

                });

            }
        });
    }
    //

    openDoctorDetailsPopover(event: MouseEvent, doctorData: any) {

        event.stopPropagation();

        // Clear any existing timeout
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }

        // Add small delay to prevent flickering
        this.hoverTimeout = setTimeout(() => {
            // Close any existing doctor popover
            if (this.doctorOverlayRef) {
                this.doctorOverlayRef.dispose();
                this.doctorOverlayRef = null;
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

            this.doctorOverlayRef = this.overlay.create({
                positionStrategy,
                scrollStrategy: this.overlay.scrollStrategies.close(),
                hasBackdrop: false,
            });

            const portal = new ComponentPortal(RequestcardpopupComponent);
            const componentRef: ComponentRef<RequestcardpopupComponent> = this.doctorOverlayRef.attach(portal);
            componentRef.instance.doctorData = doctorData;

            // Handle mouse events on the overlay element
            const overlayElement = this.doctorOverlayRef.overlayElement;
            overlayElement.addEventListener('mouseenter', () => this.keepDoctorPopoverOpen());
            overlayElement.addEventListener('mouseleave', () => this.closeDoctorDetailsPopover());
        }, 300); // 300ms delay before showing popover
    }

    closeDoctorDetailsPopover() {
        // Clear timeout if popover hasn't opened yet
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
            this.hoverTimeout = null;
        }

        // Clear any existing close timeout
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
        }

        // Add delay before closing to allow moving mouse to popover
        this.doctorCloseTimeout = setTimeout(() => {
            if (this.doctorOverlayRef) {
                this.doctorOverlayRef.dispose();
                this.doctorOverlayRef = null;
            }
        }, 200);
    }

    keepDoctorPopoverOpen() {
        // Clear close timeout when hovering over popover
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
            this.doctorCloseTimeout = null;
        }
    }

    ngOnDestroy() {
        if (this.overlayRef) {
            this.overlayRef.dispose();
        }
        if (this.patientOverlayRef) {
            this.patientOverlayRef.dispose();
        }
        if (this.doctorOverlayRef) {
            this.doctorOverlayRef.dispose();
        }
        if (this.hoverTimeout) {
            clearTimeout(this.hoverTimeout);
        }
        if (this.patientCloseTimeout) {
            clearTimeout(this.patientCloseTimeout);
        }
        if (this.doctorCloseTimeout) {
            clearTimeout(this.doctorCloseTimeout);
        }
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