import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, ViewEncapsulation, ChangeDetectorRef, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMinutes, endOfWeek, } from 'date-fns';
import { finalize, fromEvent, Subject, takeUntil } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView, } from 'angular-calendar';
import { EventColor, WeekViewHourSegment } from 'calendar-utils';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { calendarFormat } from 'moment';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { LabAppointmentService } from './lab-appointment.service';
import { NewLabAppointmentComponent } from './new-lab-appointment/new-lab-appointment.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { MatTableDataSource } from '@angular/material/table';
import { NewLabPatientRegComponent } from '../lab-patient-reg/new-lab-patient-reg/new-lab-patient-reg.component';

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
  selector: 'app-lab-appointment',
  templateUrl: './lab-appointment.component.html',
  styleUrls: ['./lab-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabAppointmentComponent {
  myFilterform: FormGroup;
  @ViewChild('modalContent', { static: true }) modalContent: TemplateRef<any>;
  view: CalendarView = CalendarView.Week;
  dragToCreateActive = false;
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  weekStartsOn: 0 = 0;
  vRefDocId = 0
  vRefDocName = ''
  categoryId = 0
  CateName = ''
  CalendarView = CalendarView;
  unitId = 0

  viewDate: Date = new Date();
  @ViewChild('dateDisplay', { read: ElementRef }) dateDisplay: ElementRef;
  radiologyTests = ['CT SCAN', 'MRI', 'XRAY', 'USG', 'ECG'];
  autocompleteRadioDD: string = "RadioCategory";
  autocompleteRefDoctorDD: string = "RefDoctor";
  now: Date = new Date();
  modalData: {
    action: string;
    event: CalendarEvent;
  };
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  activeDayIsOpen: boolean = true;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(private _formBuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private _service: LabAppointmentService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog, private cdr: ChangeDetectorRef, public toastr: ToastrService,
    public datePipe: DatePipe
  ) {
    this.myFilterform = this._formBuilder.group({
      fromDate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      categoryId: [0],
      refDocId: [0],
    });
  }

  ngOnInit(): void {
    this.unitId = this.accountService.currentUserValue.user.unitId
  }
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

  hourSegmentModifier: Function = (segment: WeekViewHourSegment): void => {
    debugger
    const now = new Date();
    const segDate = new Date(segment.date);

    if (segDate < now) {
      segment.cssClass = 'cal-disabled-segment';
    }
  };

  onChangeRefdoc(value) {
    // this.vRefDocId = value.doctorId
    // this.vRefDocName = value.doctorName
    this.vRefDocId = value.value
    this.vRefDocName = value.text
  }

  selectChangeCategory(obj: any) {
    this.categoryId = obj.value
    this.CateName = obj.text
  }

  bindData() {
    debugger
    // let fromDate, toDate;
    // fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    // toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")

    // let fromDate, toDate;
    // if (this.dateDisplay) {
    //   const dates = this.dateDisplay.nativeElement.textContent.split('-');
    //   if (this.view == CalendarView.Week) {
    //     fromDate = new Date(dates[0].split(',').length > 1 ? dates[0].split(',')[1] : dates[1].split(',')[1], this.months[dates[0].split(' ')[0]], dates[0].split(' ')[1].split(',')[0]);
    //     toDate = new Date(dates[1].split(',')[1], this.months[dates[1].trim().split(' ')[0]], dates[1].trim().split(' ')[1].split(',')[0]);
    //   }
    //   else if (this.view == CalendarView.Day) {
    //     fromDate = new Date(dates[0].split(',')[2], this.months[dates[0].split(',')[1].trim().split(' ')[0].substring(0, 3)], dates[0].split(',')[1].trim().split(' ')[1]);
    //   }
    //   else {
    //     fromDate = new Date(dates[0].split(' ')[1], this.months[dates[0].split(' ')[0].substring(0, 3)], 1);
    //     toDate = new Date(dates[0].split(' ')[1], this.months[dates[0].split(' ')[0].substring(0, 3)] + 1, 0);
    //   }
    // }
    // else {
    //   const d = this.getWeekRange();
    //   fromDate = d.sunday; toDate = d.saturday;
    // }

    let fromDate: any;
    let toDate: any;

    if (this.view === CalendarView.Week) {
      const startOfWeek = new Date(this.viewDate);
      const day = startOfWeek.getDay(); // 0 = Sunday

      // Get Sunday
      startOfWeek.setDate(startOfWeek.getDate() - day);

      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);

      fromDate = startOfWeek;
      toDate = endOfWeek;
    }
    else if (this.view === CalendarView.Day) {
      fromDate = new Date(this.viewDate);
      toDate = new Date(this.viewDate);
    }
    else {
      // Month view
      const year = this.viewDate.getFullYear();
      const month = this.viewDate.getMonth();

      fromDate = new Date(year, month, 1);
      toDate = new Date(year, month + 1, 0);
    }

    // ✅ Remove time
    fromDate.setHours(0, 0, 0, 0);
    toDate.setHours(0, 0, 0, 0);

    // ✅ Convert to only date format
    fromDate = this.datePipe.transform(fromDate, 'yyyy-MM-dd');
    toDate = this.datePipe.transform(toDate, 'yyyy-MM-dd');

    console.log(fromDate, toDate);

    this._service.getAppoinments(this.vRefDocId, fromDate, toDate, this.categoryId).subscribe((data) => {
      this.events = data;
      console.log(this.events)
      this.events = this.events.map(obj => ({
        ...obj,
        start: new Date(obj.start),
        end: new Date(obj.end),
        // draggable: false,
        // resizable: {
        //   beforeStart: false,
        //   afterEnd: false,
        // },
        actions: this.actions.filter(x => x.a11yLabel == "Delete"),
      }));

    });
  }

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-plus"></i>',
      a11yLabel: 'Add',
      onClick: ({ event, sourceEvent }) => {
        sourceEvent.stopPropagation();   // ✅ ADD THIS
        this.handleEvent('CellClicked', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event, sourceEvent }) => {
        sourceEvent.stopPropagation();   // ✅ ADD THIS
        this.handleEvent('CellClicked', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event, sourceEvent }) => {
        sourceEvent.stopPropagation();   // ✅ VERY IMPORTANT

        this.confirmDialogRef = this._matDialog.open(
          FuseConfirmDialogComponent,
          { disableClose: false }
        );

        this.confirmDialogRef.componentInstance.confirmMessage =
          "Are you sure you want to cancel this appointment?";

        this.confirmDialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this._service.appointmentCancle(event.id).subscribe((response: any) => {
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
  ];

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
      const buttonElement = document.activeElement as HTMLElement;
      buttonElement?.blur();

      const fromDate = new Date(event.start);
      let toDate: Date;

      if (event.end) {
        toDate = new Date(event.end);
      } else {
        toDate = new Date(fromDate);
        toDate.setMinutes(toDate.getMinutes() + 2);
      }

      const dialogRef = this._matDialog.open(NewLabAppointmentComponent, {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: {
          fromDate: fromDate,
          toDate: toDate,
          categoryId: this.categoryId,
          refDoctorId: this.vRefDocId,
        }
      });

      dialogRef.afterClosed().subscribe(result => {
        // if (result) {
        this.bindData();
        this.searchRecords();
        // }
      });
    }
    else if (action == "Dropped or resized") {
      debugger
      if (Number(event.id) > 0) {
        const data = {
          labAppId: event.id,
          startTime: event.start,
          endTime: event.end
        };
        this._service.getDateTimeChange(data).subscribe(response => {
          this.bindData();
          this._matDialog.closeAll();
        });
      }
    }
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

  ////////////////// Side List///////////////////////

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allcolumns = [
    { heading: "Slot Date", key: "appTime", sort: true, align: 'left', emptySign: 'NA', width: 200, type: 8 },
    { heading: "Category", key: "categoryName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
    apiUrl: "LabAppointment/LabAppointmentList",
    columnsList: this.allcolumns,
    sortField: "LabAppId",
    sortOrder: 0,
    filters: [
      { fieldName: "FromDate ", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith }, //"2024-01-01"
      { fieldName: "ToDate ", fieldValue: this.toDate, opType: OperatorComparer.StartsWith }, //"2024-10-01"
      { fieldName: "DoctorId ", fieldValue: "0", opType: OperatorComparer.StartsWith },
      { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
      { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals }
    ]
  }

  searchRecords() {
    let fromDate, toDate;
    fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")

    this.gridConfig = {
      apiUrl: "LabAppointment/LabAppointmentList",

      columnsList: this.allcolumns,
      sortField: "LabAppId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate ", fieldValue: fromDate, opType: OperatorComparer.StartsWith }, //"2024-01-01"
        { fieldName: "ToDate ", fieldValue: toDate, opType: OperatorComparer.StartsWith }, //"2024-10-01"
        { fieldName: "DoctorId ", fieldValue: "0", opType: OperatorComparer.StartsWith },
        { fieldName: "UnitId", fieldValue: String(this.unitId), opType: OperatorComparer.Equals },
        { fieldName: "CategoryId", fieldValue: "0", opType: OperatorComparer.Equals }
      ]
    }
    if (this.grid) {
      this.grid.gridConfig = this.gridConfig;
      this.grid.bindGridData();
    }
  }

  onBillProcess(row: any = null) {
    const dialogRef = this._matDialog.open(NewLabPatientRegComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: { mode: 'appointment', row }
      });
    dialogRef.afterClosed().subscribe(result => {
      debugger
      // if (result == 'home') {
      //   this.router.navigate(['/LabManagement/lab-patientreg']);
      // }
      this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.grid.bindGridData();
      // this.GetAppointdetail();
    });
  }

  demoOpen(event: CalendarEvent) {

    const dialogRef = this._matDialog.open(NewLabAppointmentComponent, {
      maxWidth: "95vw",
      height: '95%',
      width: '90%',
      data: {
        fromDate: "",
        toDate: "",
        categoryId: this.categoryId,
        refDoctorId: this.vRefDocId,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      // if (result) {
      this.bindData();
      // }
    });
  }
}
