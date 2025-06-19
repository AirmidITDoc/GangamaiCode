import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, } from 'date-fns';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView, } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { calendarFormat } from 'moment';

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
    styleUrls: ['./new-phone-appoinment-calendar.component.scss']
})
export class NewPhoneAppoinmentCalendarComponent {
    myFilterform: FormGroup;
    DoctorId: number = 0;
    @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;

    view: CalendarView = CalendarView.Week;

    CalendarView = CalendarView;

    viewDate: Date = new Date();

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
    selectChangedeptdoc(obj: any) {
        this.DoctorId = obj.value;
        this.bindData();
    }
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
                actions: this.actions,
            }));

        });
    }
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fas fa-fw fa-pencil-alt"></i>',
            a11yLabel: 'Edit',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            },
        },
        {
            label: '<i class="fas fa-fw fa-trash-alt"></i>',
            a11yLabel: 'Delete',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter((iEvent) => iEvent !== event);
                this.handleEvent('Deleted', event);
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

    constructor(private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService, private _service: PhoneAppointListService) {
        this.myFilterform = this._formBuilder.group({
            DoctorId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
        });
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
        this.events = this.events.map((iEvent) => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd,
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
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
