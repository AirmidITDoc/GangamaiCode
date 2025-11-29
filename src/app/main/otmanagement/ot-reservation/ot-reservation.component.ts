import { ChangeDetectorRef, Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { FormArray, FormBuilder, FormGroup } from "@angular/forms";
import { NewReservationComponent } from "./new-reservation/new-reservation.component";
import { OtReservationService } from "./ot-reservation.service";
import { DatePipe } from "@angular/common";
import { PrintserviceService } from "app/main/shared/services/printservice.service";
import { FormvalidationserviceService } from "app/main/shared/services/formvalidationservice.service";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { OtPopupComponent } from "./ot-popup/ot-popup.component";
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, CalendarMonthViewDay } from "angular-calendar";
import { finalize, fromEvent, Subject, takeUntil } from "rxjs";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import Swal from "sweetalert2";
import { AuthenticationService } from "app/core/services/authentication.service";
import { EventColor, WeekViewHourSegment } from "calendar-utils";
import { addDays, addMinutes, endOfDay, endOfWeek, isSameDay, endOfMonth, isSameMonth, startOfDay } from "date-fns";
import { NewCheckinComponent } from "../patient-otmovement-tracking/new-checkin/new-checkin.component";
import { NewOtPreoperationComponent } from "../ot-preoperation/new-ot-preoperation/new-ot-preoperation.component";
import { NewOtPostOperationComponent } from "../ot-preoperation/new-ot-post-operation/new-ot-post-operation.component";
import { NewTheaterInComponent } from "../theater-in/new-theater-in/new-theater-in.component";
import { NewInOperationComponent } from "../in-operation/new-in-operation/new-in-operation.component";
import { NewAnesthesiaRecordComponent } from "../anesthesia-record/new-anesthesia-record/new-anesthesia-record.component";

const colors: Record<string, EventColor> = {
    red: {
        primary: '#ad2121',
        secondary: '#FAE3E3',
    },
    blue: {
        primary: '#1e90ff',
        secondary: '#D1E8FF',
    },
    yellow: {
        primary: '#e3bc08',
        secondary: '#FDF1BA',
    },
};

@Component({
    selector: 'app-ot-reservation',
    templateUrl: './ot-reservation.component.html',
    styleUrls: ['./ot-reservation.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class OTReservationComponent implements OnInit {
    myFilterform: FormGroup
    msg: any;
    RequestName: any = "";
    tOtbookingRequestsForm: FormGroup;
    autocompleteModeOTTable: String = "OttableMaster";

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    FirstName: any = ""
    regNo: any = "0"
    LastName: any = ""
    opipType: any = "2"

    votbookingId: any = ""
    registerobj: any;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
    @ViewChild('firstActionButtonTemplate') firstActionButtonTemplate!: TemplateRef<any>;
    @ViewChild('clearanceMedicalCode') clearanceMedicalCode!: TemplateRef<any>;
    @ViewChild('clearanceFinancialCode') clearanceFinancialCode!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'opiptype')!.template = this.actionsTemplate;
        this.gridConfig.columnsList.find(col => col.key === 'otRequestId')!.template = this.actionsTemplate1;
        this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
        // this.gridConfig.columnsList.find(col => col.key === 'clearanceMedical')!.template = this.clearanceMedicalCode;
        // this.gridConfig.columnsList.find(col => col.key === 'clearanceFinancial')!.template = this.clearanceFinancialCode;
        this.gridConfig.columnsList.find(col => col.key === 'firstAction')!.template = this.firstActionButtonTemplate;
    }

    @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
    @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;

    allcolumns = [
        { heading: "-", key: "opiptype", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "-", key: "otRequestId", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        {
            heading: "", key: "firstAction", width: 300, align: 'left', type: gridColumnTypes.template,
            template: this.firstActionButtonTemplate
        },
        // { heading: "-", key: "clearanceMedical", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        // { heading: "-", key: "clearanceFinancial", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        // { heading: "", key: "isNewRecord", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 40 },
        { heading: "OTReser-Date&Time", key: "otReservationDateTime", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Surgery Date", key: "surgeryDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "Estimate Time", key: "estimateTime", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        // { heading: "Operation Date-Time", key: "opstartTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 180 },
        { heading: "UHID NO", key: "regNo", sort: true, align: 'left', emptySign: 'NA', },
        { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
        // { heading: "Blood Group", key: "bloodGroup", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Category Type", key: "typeName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "Theater Name", key: "otTableName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
        { heading: "UserName", key: "userName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
        {
            heading: "Action", key: "action", align: "right", width: 120, sticky: true, type: gridColumnTypes.template,
            template: this.actionButtonTemplate
        }
    ];

    allFilters = [
        { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
        { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
        { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
    ]

    gridConfig: gridModel = {
        apiUrl: "OTReservation/OTReservationlist",
        columnsList: this.allcolumns,
        sortField: "OtreservationId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _OtReservationService: OtReservationService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        private commonService: PrintserviceService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private _formBuilder: FormBuilder,
        private _loggedService: AuthenticationService,
        private cdr: ChangeDetectorRef,
        public datePipe: DatePipe
    ) { }

    ngOnInit(): void {
        this.myFilterform = this._OtReservationService.createSearchForm();
    }

    onChangeStartDate(value) {
        this.gridConfig.filters[1].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }
    onChangeEndDate(value) {
        this.gridConfig.filters[2].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
    }

    onNewotReservation(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        let that = this;
        const dialogRef = this._matDialog.open(NewReservationComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.grid.bindGridData();
            }
        });
    }

    tOTBookingDateChange(contact) {
        const dialogRef = this._matDialog.open(OtPopupComponent,
            {
                maxWidth: "90vh",
                height: '45%',
                width: '100%',
                data: contact
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    checkInForm(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewCheckinComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '85%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    preOperationForm(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewOtPreoperationComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    theaterIn(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewTheaterInComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '85%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    onInOperation(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewInOperationComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                // height: '90%',
                width: '85%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    onAnesthesiaRecord(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewAnesthesiaRecordComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    postOperationForm(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur();

        const dialogRef = this._matDialog.open(NewOtPostOperationComponent,
            {
                maxWidth: "90vw",
                maxHeight: '90vh',
                width: '90%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }

    OnEdit(row) {
        this._OtReservationService.populateForm(row);
        const dialogRef = this._matDialog.open(NewReservationComponent,
            {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: row
            }
        );
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.grid.bindGridData();
        });
    }
    OnPrint(Param) {
        const param = {
            searchFields: [
                {
                    fieldName: "OTReservationId",
                    fieldValue: String(Param.OTReservationId),
                    opType: "Equals"
                },
                {
                    fieldName: "OPIPType",
                    fieldValue: String(Param.opIpType),
                    opType: "Equals"
                }
            ],
            mode: "OTReservationReport"
        };

        console.log(param);

        this._OtReservationService.getReportView(param).subscribe(res => {
            const matDialog = this._matDialog.open(PdfviewerComponent, {
                maxWidth: "85vw",
                height: '750px',
                width: '100%',
                data: {
                    base64: res["base64"] as string,
                    title: "OtReservation Report Viewer"
                }
            });

            matDialog.afterClosed().subscribe(result => {

            });
        });
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this.myFilterform.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this.myFilterform.get('end').value, "yyyy-MM-dd")
        this.FirstName = this.myFilterform.get('FirstName').value + "%"
        this.LastName = this.myFilterform.get('LastName').value + "%"
        this.regNo = this.myFilterform.get('RegNo').value || "0"
        this.opipType = this.myFilterform.get('opipType').value
        this.getfilterdata();
    }
    getfilterdata() {
        this.gridConfig = {
            apiUrl: "OTReservation/OTReservationlist",
            columnsList: this.allcolumns,
            sortField: "OtreservationId",
            sortOrder: 0,
            filters: [
                { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "FirstName", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "LastName", fieldValue: "%", opType: OperatorComparer.StartsWith },
                { fieldName: "RegNo", fieldValue: this.regNo, opType: OperatorComparer.Equals },
                { fieldName: "OPIPType", fieldValue: this.opipType, opType: OperatorComparer.Equals },
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

    selectChange(obj: any) {
        console.log(obj);
    }

    OnCancel(data: any) {
        Swal.fire({
            title: 'Do you want to cancel OT Reservation?',
            text: "Please provide a reason for cancellation",
            icon: "warning",
            input: 'text',
            inputPlaceholder: 'Enter cancellation reason...',
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Cancel it!",
            preConfirm: (reason) => {
                if (!reason || reason.trim() === '') {
                    Swal.showValidationMessage('Reason is required');
                }
                return reason;
            }
        }).then((result) => {
            if (result.isConfirmed) {
                let submitData = {
                    otReservationId: data.otReservationId,
                    reason: result.value,
                    isCancelledBy: this._loggedService.currentUserValue.userId
                };
                console.log(submitData);
                this._OtReservationService.OnCancel(submitData).subscribe((res) => {
                    this.toastr.success(res.message);
                    this.grid.bindGridData();
                });
            }
        });
    }

    /////////////////////// calendar part /////////////////////////

    TableId: number = 0;
    objTable: any;
    @ViewChild('dateDisplay', { read: ElementRef }) dateDisplay: ElementRef;
    view: CalendarView = CalendarView.Week;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    viewDate: Date = new Date();
    dragToCreateActive = false;
    weekStartsOn: 0 = 0;
    activeDayIsOpen: boolean = true;
    CalendarView = CalendarView;
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    getWeekRange(date = new Date()) {
        // Clone the date to avoid modifying the original
        const d = new Date(date);

        // Get day of week (0 = Sunday, 6 = Saturday)
        const day = d.getDay();

        // Calculate Sunday (start of week)
        const sunday = new Date(d);
        sunday.setDate(d.getDate() - day);

        // Calculate Saturday (end of week)
        const saturday = new Date(d);
        saturday.setDate(d.getDate() + (6 - day));

        return { sunday, saturday };
    }

    months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    selectChangeTable(obj: any) {
        this.TableId = obj.value;
        this.objTable = obj;
        this.bindData();
    }

    now: Date = new Date();
    hourSegmentModifier: Function = (segment: WeekViewHourSegment): void => {
        debugger
        const now = new Date();
        const segDate = new Date(segment.date);

        if (segDate < now) {
            segment.cssClass = 'cal-disabled-segment';
        }
    };

    bindData() {
        debugger
        let fromDate, toDate;
        if (this.dateDisplay) {
            var dates = this.dateDisplay.nativeElement.textContent.split('-');
            if (this.view == CalendarView.Week) {
                fromDate = new Date(dates[0].split(',').length > 1 ? dates[0].split(',')[1] : dates[1].split(',')[1], this.months[dates[0].split(' ')[0]], dates[0].split(' ')[1].split(',')[0]);
                toDate = new Date(dates[1].split(',')[1], this.months[dates[1].trim().split(' ')[0]], dates[1].trim().split(' ')[1].split(',')[0]);
            }
            else if (this.view == CalendarView.Day) {
                fromDate = new Date(dates[0].split(',')[2], this.months[dates[0].split(',')[1].trim().split(' ')[0].substring(0, 3)], dates[0].split(',')[1].trim().split(' ')[1]);
            }
            else {
                fromDate = new Date(dates[0].split(' ')[1], this.months[dates[0].split(' ')[0].substring(0, 3)], 1);
                toDate = new Date(dates[0].split(' ')[1], this.months[dates[0].split(' ')[0].substring(0, 3)] + 1, 0);
            }
        }
        else {
            var d = this.getWeekRange();
            fromDate = d.sunday; toDate = d.saturday;
        }
        // this._service.getAppoinments(this.TableId, fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]).subscribe((data) => {
        //     this.events = data;
        //     this.events = this.events.map(obj => ({
        //         ...obj,
        //         start: new Date(obj.start),
        //         end: new Date(obj.end),
        //         actions: this.actions.filter(x => x.a11yLabel == "Delete"),
        //     }));

        // });
    }

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-plus"></i>',
            a11yLabel: 'Add',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('CellClicked', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('CellClicked', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.confirmDialogRef = this._matDialog.open(
                    FuseConfirmDialogComponent,
                    {
                        disableClose: false,
                    }
                );
                this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to cancel this appointment?";
                this.confirmDialogRef.afterClosed().subscribe((result) => {
                    if (result) {
                        // let submitData = {
                        //     otReservationId: event.id,
                        //     reason: result.value || result,
                        //     isCancelledBy: this._loggedService.currentUserValue.userId
                        // };
                        // this._OtReservationService.OnCancel(submitData).subscribe((response: any) => {
                        //     this.toastr.success(response.message);
                        //     this.bindData();
                        // });
                        this.OnCancel(event)
                    }
                    this.confirmDialogRef = null;
                });
            },
        },
    ];

    refresh = new Subject<void>();
    events: CalendarEvent[] = [
        // {
        //     start: subDays(startOfDay(new Date()), 1),
        //     end: addDays(new Date(), 1),
        //     title: 'A 3 day event',
        //     color: { ...colors.red },
        //     actions: this.actions,
        //     allDay: true,
        //     resizable: {
        //         beforeStart: true,
        //         afterEnd: true,
        //     },
        //     draggable: true,
        // },
        // {
        //     start: startOfDay(new Date()),
        //     title: 'An event with no end date',
        //     color: { ...colors.yellow },
        //     actions: this.actions,
        // },
        // {
        //     start: subDays(endOfMonth(new Date()), 3),
        //     end: addDays(endOfMonth(new Date()), 3),
        //     title: 'A long event that spans 2 months',
        //     color: { ...colors.blue },
        //     allDay: true,
        // },
        // {
        //     start: addHours(startOfDay(new Date()), 2),
        //     end: addHours(new Date(), 2),
        //     title: 'A draggable and resizable event',
        //     color: { ...colors.yellow },
        //     actions: this.actions,
        //     resizable: {
        //         beforeStart: true,
        //         afterEnd: true,
        //     },
        //     draggable: true,
        // },
    ];

    handleEvent(action: string, event: CalendarEvent): void {
        if (action == "CellClicked") {
            const buttonElement = document.activeElement as HTMLElement;
            buttonElement?.blur();

            const fromDate = new Date(event.start);
            let toDate: Date;

            if (event.end) {
                toDate = new Date(event.end);
            } else {
                toDate = new Date(fromDate);
                toDate.setMinutes(toDate.getMinutes() + 10);
            }

            // calculate duration in hours (decimal, e.g. 1.5)
            const durationMinutes = (toDate.getTime() - fromDate.getTime()) / (1000 * 60);
            const durationHours = +(durationMinutes / 60).toFixed(2); // round to 2 decimals

            const dialogRef = this._matDialog.open(NewReservationComponent, {
                maxWidth: "90vw",
                height: '90%',
                width: '90%',
                data: {
                    opDate: fromDate,
                    startTime: fromDate,
                    endTime: toDate,
                    duration: durationHours,
                    tableName: this.objTable.text,
                    otTableId: this.objTable.value
                }
            });

            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.bindData();
                }
            });
        }
        else if (action == "Dropped or resized") {
            if (Number(event.id) > 0) {
                // const data = {
                //     phoneAppId: event.id,
                //     startDate: event.start,
                //     endDate: event.end
                // };
                // this._OtReservationService.getDateTimeChange(data).subscribe(response => {
                //     this.bindData();
                //     this._matDialog.closeAll();
                // });
            }
        }
    }

    pad(num: number) {
        return num.toString().padStart(2, '0');
    }

    startDragToCreate(
        segment: WeekViewHourSegment,
        mouseDownEvent: MouseEvent,
        segmentElement: HTMLElement
    ) {
        const dragToSelectEvent: CalendarEvent = {
            id: 0,
            title: 'New event',
            start: segment.date,
            actions: this.actions.filter(x => x.a11yLabel == "Add"),
            meta: {
                tmpEvent: true,
            },
            resizable: {
                beforeStart: true,
                afterEnd: true,
            },
            draggable: true,
        };
        this.events = this.events.filter(x => Number(x.id) > 0);
        this.events = [...this.events, dragToSelectEvent];
        const segmentPosition = segmentElement.getBoundingClientRect();
        this.dragToCreateActive = true;
        const endOfView = endOfWeek(this.viewDate, {
            weekStartsOn: this.weekStartsOn,
        });

        fromEvent(document, 'mousemove')
            .pipe(
                finalize(() => {
                    delete dragToSelectEvent.meta.tmpEvent;
                    this.dragToCreateActive = false;
                    this.refreshData();
                }),
                takeUntil(fromEvent(document, 'mouseup'))
            )
            .subscribe((mouseMoveEvent: MouseEvent) => {
                const minutesDiff = this.ceilToNearest(
                    mouseMoveEvent.clientY - segmentPosition.top,
                    10
                );

                const daysDiff =
                    this.floorToNearest(
                        mouseMoveEvent.clientX - segmentPosition.left,
                        segmentPosition.width
                    ) / segmentPosition.width;

                const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
                if (newEnd > segment.date && newEnd < endOfView) {
                    dragToSelectEvent.end = newEnd;
                }
                this.refreshData();
            });
    }

    floorToNearest(amount: number, precision: number) {
        return Math.floor(amount / precision) * precision;
    }

    ceilToNearest(amount: number, precision: number) {
        return Math.ceil(amount / precision) * precision;
    }

    refreshData() {
        this.events = [...this.events];
        this.cdr.detectChanges();
    }
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
            this.viewDate = date;
        }
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
    }: CalendarEventTimesChangedEvent): void {
        event.start = newStart;
        event.end = newEnd;
        this.handleEvent('Dropped or resized', event);
    }

    addEvent(): void {
        this.events = [
            ...this.events,
            {
                title: 'New event',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true,
                },
            },
        ];
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter((event) => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
        setTimeout(() => {
            this.bindData();
        }, 100);
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
        setTimeout(() => {
            this.bindData();
        }, 100);
    }
}

export class OtReserInsert {
    regId: Number;
    regDate: Date;
    patientName: string;
    prefixId: number;
    firstName: string;
    middleName: string;
    lastName: string;
    address: string;
    city: string;
    regNo: string;
    dateOfBirth: Date;
    dateofBirth: Date;
    age: any;
    GenderId: Number;
    genderId: any;
    PhoneNo: string;
    phoneNo: string;
    MobileNo: string;
    mobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    ageYear: any;
    ageMonth: any;
    ageDay: any;
    CountryId: number;
    countryId: number;
    StateId: number;
    stateId: number;
    CityId: number;
    cityId: number;
    MaritalStatusId: number;
    maritalStatusId: number;
    religionId: number;
    areaId: number;
    aadharCardNo: string;
    currentDate = new Date();
    VisitId: any;
    isSeniorCitizen: boolean
    doctorName: any;
    departmentName: any;
    UnitId: any;
    billNo: any;
    departmentId: any;
    doctorId: any;
    emgId: any
    ipdNo: any;
    genderName: any;
    admissionDate: any
    roomName: any;
    bedName: any;
    patientType: any;
    companyName: any;
    tariffName: any;
    surgeryType: any;
    surgeryName: any;
    duration: any;
    fromTime: any;
    toTime: any;
    isprimary: any;
    surgeonName: any;
    anestheticsName: any;
    anesthesiaType: any;
    anestheticsName1: any;
    part: any;
    otrequestId: any;
    opipid: any;
    opdNo: any;
    opiptype: any;
    otRequestTime: any;
    categoryType: any;
    surgeryCategoryId: any;
    estimateTime: any;
    requestType: any;
    pacrequired: any;
    equipmentsRequired: any;
    infective: any;
    locationId: any;
    otReservationId: any;
    otreservationId: any;
    reservationType: any;
    surgeryDate: any
    discPer: any;
    InfectivePer: any;
    surgeryAmt: any;
    ConcAmt: any;
    infectiveAmt: any;
    netAmt: any;
    ottable: any;
    otCheckInId: any;
    otRequestId: any;
    otcheckInTime: any;
    bloodArg: any;
    /**
     * Constructor
     *
     * @param OtReserInsert
     */

    constructor(OtReserInsert) {
        {
            this.regId = OtReserInsert.regId || 0;
            this.regDate = OtReserInsert.regDate || this.currentDate;
            this.patientName = OtReserInsert.patientName;
            this.prefixId = OtReserInsert.prefixId || 0;
            this.firstName = OtReserInsert.firstName || '';
            this.middleName = OtReserInsert.middleName || '%';
            this.lastName = OtReserInsert.lastName || '';
            this.regNo = OtReserInsert.regNo || '';
            this.dateOfBirth = OtReserInsert.dateOfBirth || this.currentDate;
            this.dateofBirth = OtReserInsert.dateofBirth || this.currentDate;
            this.genderId = OtReserInsert.genderId || 0;
            this.phoneNo = OtReserInsert.phoneNo || '';
            this.mobileNo = OtReserInsert.mobileNo || '';
            this.ageYear = OtReserInsert.ageYear || '0';
            this.ageMonth = OtReserInsert.ageMonth || '0';
            this.ageDay = OtReserInsert.ageDay || '0';
            this.countryId = OtReserInsert.countryId || 0;
            this.stateId = OtReserInsert.stateId || 0;
            this.cityId = OtReserInsert.cityId || 0;
            this.religionId = OtReserInsert.religionId || 0;
            this.areaId = OtReserInsert.areaId || 0;
            this.aadharCardNo = OtReserInsert.aadharCardNo || '';
            this.VisitId = OtReserInsert.VisitId || 0;
            this.isSeniorCitizen = OtReserInsert.isSeniorCitizen || 0
            this.maritalStatusId = OtReserInsert.maritalStatusId || 0;
            this.doctorName = OtReserInsert.doctorName || "";
            this.departmentName = OtReserInsert.departmentName || "";
            this.UnitId = OtReserInsert.UnitId || 0;
            this.billNo = OtReserInsert.billNo || 0;
            this.departmentId = OtReserInsert.departmentId || 0;
            this.doctorId = OtReserInsert.doctorId || 0;
            this.emgId = OtReserInsert.emgId || 0
            this.ipdNo = OtReserInsert.ipdNo || 0
            this.genderName = OtReserInsert.genderName || ''
            this.admissionDate = OtReserInsert.admissionDate || ''
            this.roomName = OtReserInsert.roomName || ''
            this.bedName = OtReserInsert.bedName || ''
            this.patientType = OtReserInsert.patientType || ''
            this.companyName = OtReserInsert.companyName || ''
            this.tariffName = OtReserInsert.tariffName || ''
            this.surgeryType = OtReserInsert.surgeryType || ''
            this.surgeryName = OtReserInsert.surgeryName || ''
            this.duration = OtReserInsert.duration || ''
            this.fromTime = OtReserInsert.fromTime || ''
            this.toTime = OtReserInsert.toTime || ''
            this.isprimary = OtReserInsert.isprimary || ''
            this.surgeonName = OtReserInsert.surgeonName || ''
            this.anestheticsName = OtReserInsert.anestheticsName || ''
            this.anesthesiaType = OtReserInsert.anesthesiaType || ''
            this.anestheticsName1 = OtReserInsert.anestheticsName1 || ''
            this.part = OtReserInsert.part || ''
            this.otrequestId = OtReserInsert.otrequestId || ''
            this.opipid = OtReserInsert.opipid || ''
            this.opdNo = OtReserInsert.opdNo || ''
            this.opiptype = OtReserInsert.opiptype || ''
            this.otRequestTime = OtReserInsert.otRequestTime || ''
            this.categoryType = OtReserInsert.categoryType || ''
            this.surgeryCategoryId = OtReserInsert.surgeryCategoryId || ''
            this.estimateTime = OtReserInsert.estimateTime || ''
            this.requestType = OtReserInsert.requestType || ''
            this.pacrequired = OtReserInsert.pacrequired || ''
            this.equipmentsRequired = OtReserInsert.equipmentsRequired || ''
            this.infective = OtReserInsert.infective || ''
            this.locationId = OtReserInsert.locationId || ''
            this.otReservationId = OtReserInsert.otReservationId || ''
            this.reservationType = OtReserInsert.reservationType || ''
            this.surgeryDate = OtReserInsert.surgeryDate || ''
            this.otreservationId = OtReserInsert.otreservationId || ''
            this.discPer = OtReserInsert.discPer || ''
            this.InfectivePer = OtReserInsert.InfectivePer || ''
            this.surgeryAmt = OtReserInsert.surgeryAmt || ''
            this.ConcAmt = OtReserInsert.ConcAmt || ''
            this.infectiveAmt = OtReserInsert.infectiveAmt || ''
            this.netAmt = OtReserInsert.netAmt || ''
            this.ottable = OtReserInsert.ottable || ''
            this.otCheckInId = OtReserInsert.otCheckInId || ''
            this.otRequestId = OtReserInsert.otRequestId || ''
            this.otcheckInTime = OtReserInsert.otcheckInTime || ''
            this.bloodArg = OtReserInsert.bloodArg || ''
            // this.requestType = OtReqInsert.requestType || ''
            // this.pacrequired = OtReqInsert.pacrequired || ''
            // this.equipmentsRequired = OtReqInsert.equipmentsRequired || ''
            // this.infective = OtReqInsert.infective || ''
            // this.locationId = OtReqInsert.locationId || ''
            // this.OTPreOperationId = OtReqInsert.OTPreOperationId || ''
        }
    }
}