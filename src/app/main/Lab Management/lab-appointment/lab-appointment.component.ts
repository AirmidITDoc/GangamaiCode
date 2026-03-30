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
      // fromDate: [(new Date()).toISOString()],
      // enddate: [(new Date()).toISOString()],
      fromDate: [new Date()],
      enddate: [new Date()],
      categoryId: [0],
      refDocId: [0],
    });
  }

  ngOnInit(): void {
    this.unitId = this.accountService.currentUserValue.user.unitId

    // debugger
    const SelectQuery = {
      "searchFields": [{
        "fieldName": "LoginId",
        "fieldValue": String(this.accountService.currentUserValue.userId),
        "opType": "Equals"
      }],
      "mode": "LoginWiseAccessConfigList"
    }
    this._service.commonList(SelectQuery).subscribe(response => {
      const CategoryData = response.find(x => x.AccessValueName === 'IsSetCategoryId');
      console.log(CategoryData)
      this.categoryId = Number(CategoryData.AccessInputValue)
      this.myFilterform.get('categoryId').setValue(this.categoryId)
    });
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
    this.bindData();
    // this.searchRecords();
  }

  // selectChangeCategory(obj: any) {
  //   this.categoryId = obj.value
  //   this.CateName = obj.text
  //   this.bindData();
  //   // this.searchRecords();
  // }
  categoryTimeout: any;

  selectChangeCategory(obj: any) {
    clearTimeout(this.categoryTimeout);

    this.categoryTimeout = setTimeout(() => {
      this.categoryId = obj.value;
      this.CateName = obj.text;
      // this.bindData();
    }, 300); // 300ms delay
  }

  isLoading = false;
  bindData() {
    this.isLoading = true;
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
      this.isLoading = false;
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
              this.searchRecords();
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
    // this.handleEvent('Dropped or resized', event);
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
    // else if (action == "Dropped or resized") {
    //   debugger
    //   if (Number(event.id) > 0) {
    //     const data = {
    //       labAppId: event.id,
    //       startTime: event.start,
    //       endTime: event.end
    //     };
    //     this._service.getDateTimeChange(data).subscribe(response => {
    //       this.bindData();
    //       this._matDialog.closeAll();
    //     });
    //   }
    // }
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

  onCancel(row: any = null) {
    this.confirmDialogRef = this._matDialog.open(
      FuseConfirmDialogComponent,
      { disableClose: false }
    );

    this.confirmDialogRef.componentInstance.confirmMessage =
      "Are you sure you want to cancel this appointment?";

    this.confirmDialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._service.appointmentCancle(row.labAppId).subscribe((response: any) => {
          this.toastr.success(response.message);
          this.bindData();
          this.searchRecords();
        });
      }
      this.confirmDialogRef = null;
    });
  }

  ////////////////// Side List///////////////////////

  public dstable1 = new MatTableDataSource<any>();
  displayedServiceselected: string[] = [
    'status',
    'slot',
    'category',
    'name',
    'buttons'
  ]

  searchRecords() {
    let fromDate, toDate;
    fromDate = this.datePipe.transform(this.myFilterform.get('fromDate').value, "yyyy-MM-dd")
    toDate = this.datePipe.transform(this.myFilterform.get('enddate').value, "yyyy-MM-dd")

    const param = {
      "first": 0,
      "rows": 999,
      "sortField": "LabAppId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "FromDate",
          "fieldValue": fromDate,
          "opType": "StartsWith"
        },
        {
          "fieldName": "ToDate",
          "fieldValue": toDate,
          "opType": "StartsWith"
        },
        {
          "fieldName": "DoctorId",
          "fieldValue": "0",
          "opType": "Equals"
        },
        {
          "fieldName": "UnitId",
          "fieldValue": String(this.unitId),
          "opType": "Equals"
        },
        {
          "fieldName": "CategoryId",
          "fieldValue": "0",
          "opType": "Equals"
        }

      ],
      "exportType": "JSON",
      "columns": [
        {
          "data": "string",
          "name": "string"
        }
      ]
    }

    this._service.getAppoinmentsList(param).subscribe(Menu => {

      this.dstable1.data = Menu.data as LabRequest[];
      // this.dstable1.sort = this.sort;
      // this.dstable1.paginator = this.paginator;

    });
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
      // this.fromDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      // this.toDate = this.datePipe.transform(Date.now(), "yyyy-MM-dd")
      this.searchRecords();
    });
  }

  onEdit(row: any = null) {

    const dialogRef = this._matDialog.open(NewLabAppointmentComponent, {
      maxWidth: "95vw",
      height: '95%',
      width: '90%',
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      this.bindData();
      this.searchRecords();
    });
  }
}

export class LabRequest {
  firstName: any;
  category: number;
  appTime: any;
  ServiceId: any;
  CreditedtoDoctor: any;
  creditedtoDoctor: boolean;
  constructor(LabRequest) {
    this.firstName = LabRequest.firstName || '';
    this.category = LabRequest.category || 0;
    this.appTime = LabRequest.appTime || '';
    this.ServiceId = LabRequest.ServiceId || 0;
    this.CreditedtoDoctor = LabRequest.CreditedtoDoctor || 0;
    this.creditedtoDoctor = LabRequest.creditedtoDoctor || 0;
  }
}
