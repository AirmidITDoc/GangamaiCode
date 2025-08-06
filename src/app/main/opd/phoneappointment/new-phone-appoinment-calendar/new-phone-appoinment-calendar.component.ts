import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, ViewEncapsulation, ChangeDetectorRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMinutes, endOfWeek, } from 'date-fns';
import { finalize, fromEvent, Subject, takeUntil } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView, } from 'angular-calendar';
import { EventColor, WeekViewHourSegment } from 'calendar-utils';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { calendarFormat } from 'moment';
import { NewPhoneAppointmentComponent } from '../new-phone-appointment/new-phone-appointment.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';

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
    selector: 'app-new-phone-appoinment-calendar',
    templateUrl: './new-phone-appoinment-calendar.component.html',
    styleUrls: ['./new-phone-appoinment-calendar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewPhoneAppoinmentCalendarComponent {
    myFilterform: FormGroup;
    DoctorId: number = 0;
    DepartmentId: number = 0;
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
    objDoctor: any;
    view: CalendarView = CalendarView.Week;
    dragToCreateActive = false;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    weekStartsOn: 0 = 0;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

    // raksha date:20/6/25    
    autocompletedepartment: string = "Department";
    autocompleteModedoctor: string = "ConDoctor";
    // 
    modalData: {
        action: string;
        event: CalendarEvent;
    };
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
    @ViewChild('dateDisplay', { read: ElementRef }) dateDisplay: ElementRef;
    months = {
        Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
        Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11
    };

    // raksha date:20/6/25
    depId = 0
    depName: any;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    selectChangedepartment(obj: any) {
        this.depId = obj.value
        this.depName = obj.text
        this._service.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
            this.ddlDoctor.options = data;
            console.log(data)
            this.ddlDoctor.bindGridAutoComplete();
        });
    }
    // 
    selectChangedeptdoc(obj: any) {
        this.DoctorId = obj.value;
        this.objDoctor = obj;
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
        this._service.getAppoinments(this.DoctorId, fromDate.toISOString().split('T')[0], toDate.toISOString().split('T')[0]).subscribe((data) => {
            this.events = data;
            this.events = this.events.map(obj => ({
                ...obj,
                start: new Date(obj.start),
                end: new Date(obj.end),
                actions: this.actions.filter(x => x.a11yLabel == "Delete"),
            }));

        });
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
                        this._service.phoneMasterCancle(event.id).subscribe((response: any) => {
                            this.toastr.success(response.message);
                            this.bindData();
                        });
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

    activeDayIsOpen: boolean = true;

    constructor(private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService, private _service: PhoneAppointListService,
        public _matDialog: MatDialog, private cdr: ChangeDetectorRef, public toastr: ToastrService,
        public datePipe: DatePipe
    ) {
        this.myFilterform = this._formBuilder.group({
            DoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            DepartmentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }
    floorToNearest(amount: number, precision: number) {
        return Math.floor(amount / precision) * precision;
    }

    ceilToNearest(amount: number, precision: number) {
        return Math.ceil(amount / precision) * precision;
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

    handleEvent(action: string, event: CalendarEvent): void {
        if (action == "CellClicked") {
            const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
            buttonElement.blur(); // Remove focus from the button
            if (!event["end"]) {
                event["end"] = event["start"];
                event["end"].setMinutes(event["end"].getMinutes() + 10);
            }
            let that = this;
            const dialogRef = this._matDialog.open(NewPhoneAppointmentComponent,
                {
                    maxWidth: "95vw",
                    maxHeight: '80%',
                    width: '90%',
                    data: { fromDate: event["start"], toDate: event["end"], deptNames: this.depName, departmentId: this.depId, doctorName: this.objDoctor.text, doctorId: this.objDoctor.value }
                });
            dialogRef.afterClosed().subscribe(result => {
                if (result) {
                    this.bindData();
                }
            });
        }
        else if (action == "Dropped or resized") {
            if (Number(event.id) > 0) {
                var data = {
                    "phoneAppId": event.id,
                    "startDate": event.start,
                    "endDate": event.end
                }
                this._service.getDateTimeChange(data).subscribe(response => {
                    this.bindData();
                    this._matDialog.closeAll();
                });
            }
        }
        //this.modalData = { event, action };
        //this.modal.open(this.modalContent, { size: 'lg' });
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
