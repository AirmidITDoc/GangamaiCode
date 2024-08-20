import { DatePipe } from "@angular/common";
import {
    Component,
    Inject,
    LOCALE_ID,
    OnInit,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import {
    CalendarView,
    DateAdapter
} from "angular-calendar";
import {
    addPeriod,
    CalendarSchedulerEvent,
    CalendarSchedulerEventAction,
    CalendarSchedulerEventStatus,
    CalendarSchedulerViewComponent,
    endOfPeriod,
    SchedulerEventTimesChangedEvent,
    SchedulerViewDay,
    SchedulerViewHour,
    SchedulerViewHourSegment,
    startOfPeriod,
    subPeriod
} from "angular-calendar-scheduler";
import { addDays, addHours, addMonths, endOfDay, startOfHour } from "date-fns";
import { Subject } from "rxjs";
import { GeturlService } from "../geturl.service";
import { PhoneAppointListService } from "../phone-appoint-list.service";
import { AppService } from "./app.service";
import { AddSchedulerAppointmentComponent } from "./add-scheduler-appointment/add-scheduler-appointment.component";

@Component({
    selector: "app-view-phone-appointment",
    templateUrl: "./view-phone-appointment.component.html",
    styleUrls: ["./view-phone-appointment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ViewPhoneAppointmentComponent implements OnInit {
    title: string = "Angular Calendar Scheduler Demo";

    CalendarView = CalendarView;
    view: CalendarView = CalendarView.Week;
    viewDate: Date = new Date();
    viewDays: number = 7;
    refresh: Subject<any> = new Subject();
    locale: string = "en";
    hourSegments: number = 4;
    weekStartsOn: number = 1;
    startsWithToday: boolean = false;
    activeDayIsOpen: boolean = true;
    excludeDays: number[] = []; // [0];
    dayStartHour: number = 0;
    dayEndHour: number = 23;

    minDate: Date = new Date();
    maxDate: Date = endOfDay(addMonths(new Date(), 1));
    dayModifier: Function;
    hourModifier: Function;
    segmentModifier: Function;
    eventModifier: Function;
    prevBtnDisabled: boolean = false;
    nextBtnDisabled: boolean = false;

    actions: CalendarSchedulerEventAction[] = [
        {
            when: "enabled",
            label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">cancel</i></span>',
            title: "Delete",
            onClick: (event: CalendarSchedulerEvent): void => {
                console.log("Pressed action 'Delete' on event " + event.id);
            },
        },
        {
            when: "cancelled",
            label: '<span class="valign-center"><i class="material-icons md-18 md-red-500">autorenew</i></span>',
            title: "Restore",
            onClick: (event: CalendarSchedulerEvent): void => {
                console.log("Pressed action 'Restore' on event " + event.id);
            },
        },
    ];

    events: CalendarSchedulerEvent[];

    @ViewChild(CalendarSchedulerViewComponent)
    calendarScheduler: CalendarSchedulerViewComponent;

    constructor(
        public _phoneAppointService: PhoneAppointListService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        public _geturl: GeturlService,
        @Inject(LOCALE_ID) locale: string,
        private appService: AppService,
        private dateAdapter: DateAdapter
    ) {
        this.locale = locale;

        // this.dayModifier = ((day: SchedulerViewDay): void => {
        //     day.cssClass = this.isDateValid(day.date) ? '' : 'cal-disabled';
        // }).bind(this);

        // this.hourModifier = ((hour: SchedulerViewHour): void => {
        //     hour.cssClass = this.isDateValid(hour.date) ? '' : 'cal-disabled';
        // }).bind(this);

        this.segmentModifier = ((segment: SchedulerViewHourSegment): void => {
            //segment.isDisabled = !this.isDateValid(segment.date);
            segment.isDisabled = false;
        }).bind(this);

        this.eventModifier = ((event: CalendarSchedulerEvent): void => {
            //event.isDisabled = !this.isDateValid(event.start);
            event.isDisabled = false;
        }).bind(this);

        this.dateOrViewChanged();
    }

    ngOnInit(): void {
        //     this.appService
        //       .getEvents(this.actions)
        //       .then((events: CalendarSchedulerEvent[]) => {
        //         this.events = events
        //         debugger
        //         console.log(this.events)
        //   });
        this.getAppointmentList();
    }
    getAppointmentList() {
        var D_data = {
            F_Name: "%",
            L_Name: "%",
            Doctor_Id: 0,
            From_Dt: "01/01/1900",
            To_Dt: "01/01/1900",
        };
        this._phoneAppointService.getPhoneAppointmentlist(D_data).subscribe(
            (events: CalendarSchedulerEvent[]) => {
                let eventsList = [];
                events.forEach((element: any) => {
                    var parts = element.AppDate.split("/");
                    var d = parts[1] + "/" + parts[0] + "/" + parts[2];
                    let timestempStr =
                        d +
                        element.AppTime.substr(0, element.AppTime.length - 2) +
                        " " +
                        element.AppTime.slice(-2);
                    let sTime = addDays(startOfHour(new Date(timestempStr)), 1);
                    let eTime = addDays(
                        addHours(startOfHour(new Date(timestempStr)), 1),
                        1
                    );
                    let estatus = element.IsCancelled ? "danger" : "ok";
                    let estatusbg = element.IsCancelled ? "#ffd6d6" : "#deffde";
                    eventsList.push({
                        id: element.PhoneAppId,
                        start: sTime,
                        end: eTime,
                        title: element.PatientName,
                        content: "Appointment",
                        color: { primary: "#E0E0E0", secondary: estatusbg },
                        actions: this.actions,
                        status: estatus as CalendarSchedulerEventStatus,
                        isClickable: true,
                        isDisabled: false,
                        draggable: true,
                        resizable: {
                            beforeStart: true,
                            afterEnd: true,
                        },
                    });
                });
                console.log(eventsList);
                this.events = eventsList as CalendarSchedulerEvent[];
            },
            (error) => {}
        );
    }
    // toggle sidebar
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    viewDaysOptionChanged(viewDays: number): void {
        console.log("viewDaysOptionChanged", viewDays);
        this.calendarScheduler.setViewDays(viewDays);
    }

    changeDate(date: Date): void {
        console.log("changeDate", date);
        this.viewDate = date;
        this.dateOrViewChanged();
    }

    changeView(view: CalendarView): void {
        console.log("changeView", view);
        this.view = view;
        this.dateOrViewChanged();
    }

    dateOrViewChanged(): void {
        if (this.startsWithToday) {
            this.prevBtnDisabled = !this.isDateValid(
                subPeriod(
                    this.dateAdapter,
                    CalendarView.Day /*this.view*/,
                    this.viewDate,
                    1
                )
            );
            this.nextBtnDisabled = !this.isDateValid(
                addPeriod(
                    this.dateAdapter,
                    CalendarView.Day /*this.view*/,
                    this.viewDate,
                    1
                )
            );
        } else {
            this.prevBtnDisabled = !this.isDateValid(
                endOfPeriod(
                    this.dateAdapter,
                    CalendarView.Day /*this.view*/,
                    subPeriod(
                        this.dateAdapter,
                        CalendarView.Day /*this.view*/,
                        this.viewDate,
                        1
                    )
                )
            );
            this.nextBtnDisabled = !this.isDateValid(
                startOfPeriod(
                    this.dateAdapter,
                    CalendarView.Day /*this.view*/,
                    addPeriod(
                        this.dateAdapter,
                        CalendarView.Day /*this.view*/,
                        this.viewDate,
                        1
                    )
                )
            );
        }

        if (this.viewDate < this.minDate) {
            this.changeDate(this.minDate);
        } else if (this.viewDate > this.maxDate) {
            this.changeDate(this.maxDate);
        }
    }

    private isDateValid(date: Date): boolean {
        return (
            /*isToday(date) ||*/ date >= this.minDate && date <= this.maxDate
        );
    }

    viewDaysChanged(viewDays: number): void {
        console.log("viewDaysChanged", viewDays);
        this.viewDays = viewDays;
        alert("viewDays " + viewDays);
    }

    dayHeaderClicked(day: SchedulerViewDay): void {
        console.log("dayHeaderClicked Day", day);
        alert("day " + day);
    }

    hourClicked(hour: SchedulerViewHour): void {
        console.log("hourClicked Hour", hour);
        alert("hourClicked Hour " + hour);
    }

    segmentClicked(action: string, segment: SchedulerViewHourSegment): void {
        console.log("segmentClicked Action", action);
        console.log("segmentClicked Segment", segment);
        //alert("Segment" + segment + '  Action' + action )
        const dialogRef = this._matDialog.open(AddSchedulerAppointmentComponent, {
            maxWidth: "85vw",
            height: "65%",
            width: "70%",
        });
        dialogRef.afterClosed().subscribe((result) => {
            console.log("The dialog was closed - Insert Action", result);
            this.getAppointmentList();
        });
    }

    eventClicked(action: string, event: CalendarSchedulerEvent): void {
        console.log("eventClicked Action", action);
        console.log("eventClicked Event", event);
        alert("Event " + event + " Action" + action);
    }

    eventTimesChanged({
        event,
        newStart,
        newEnd,
        type,
    }: SchedulerEventTimesChangedEvent): void {
        console.log("eventTimesChanged Type", type);
        console.log("eventTimesChanged Event", event);
        console.log("eventTimesChanged New Times", newStart, newEnd);
        const ev: CalendarSchedulerEvent = this.events.find(
            (e) => e.id === event.id
        );
        ev.start = newStart;
        ev.end = newEnd;
        this.refresh.next();
    }
}
