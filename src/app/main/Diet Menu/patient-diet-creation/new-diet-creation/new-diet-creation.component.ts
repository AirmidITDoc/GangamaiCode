import { Component, ChangeDetectionStrategy, ViewChild, TemplateRef, ElementRef, ViewEncapsulation, ChangeDetectorRef, Inject, } from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours, addMinutes, endOfWeek, } from 'date-fns';
import { finalize, fromEvent, Subject, takeUntil } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarMonthViewDay, CalendarView, } from 'angular-calendar';
import { EventColor, WeekViewHourSegment } from 'calendar-utils';
import { FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { calendarFormat } from 'moment';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { fuseAnimations } from '@fuse/animations';
import { Overlay, ToastrService } from 'ngx-toastr';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { MatTableDataSource } from '@angular/material/table';

import { ConfigService } from 'app/core/services/config.service';
import { DietCreationService } from '../diet-creation.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { MatDrawer } from '@angular/material/sidenav';

interface MealRow {
  mealTypeId: number;
  mealName: string;
  form: FormGroup;
}


@Component({
  selector: 'app-new-diet-creation',
  templateUrl: './new-diet-creation.component.html',
  styleUrls: ['./new-diet-creation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDietCreationComponent {
  patientName = '';
  dietTypeName = '';
  dietMenuName = '';
  autocompleteModedietMenu = 'MDietMenuMaster';
  autocompleteModemealType = 'MMealTypeMaster';
  autocompleteModedietType = 'MDietTypeMaster';
  Statement: boolean = false
  readonly MAX_DAYS = 31;

  dateColumns: { key: string; date: Date }[] = [];
  mealRows: MealRow[] = [];
  @ViewChild('historyDrawer') historyDrawer: MatDrawer;
  @ViewChild('grid1Ref') grid1: AirmidTableComponent;
  // optional: fill from the MMealTypeMaster API so meal names can be looked up by id
  mealTypeList: { value: number; text: string }[] = [];

  searchFormGroup: FormGroup;
  myFilterform: FormGroup;

  dietPlanId = 0;
  vPatientName = '';
  vAdmissionId = 0;
  registerObj: any;
  //Assessment


  allcolumns = [

    { heading: "Assessment Date", key: "assessmentDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },

    // { heading: "UHID", key: "RegId", sort: true, align: 'left', emptySign: 'NA', width: 70 },

    { heading: "OPIPID", key: "opipId", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "DOA", key: "admissionTime", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 150 },
    { heading: "FoodPreference", key: "foodPreferenceName", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Height", key: "height", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Weight", key: "weight", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Allergies", key: "allergies", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Nutrition Status", key: "nutritionStatus", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Special Instructions", key: "specialInstructions", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    { heading: "Dietition Notes", key: "dietitionNotes", sort: true, align: 'left', emptySign: 'NA', width: 100 },

    { heading: "Assess By", key: "assessByName", sort: true, align: 'left', emptySign: 'NA', width: 80 },

  ]

  allfilters = [
    { fieldName: "AdmissionId", fieldValue: this.vAdmissionId, opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    apiUrl: "DietAssessmentInfo/PatientAssessmentList",
    columnsList: this.allcolumns,
    sortField: "DietAssessmentId",
    sortOrder: 0,
    filters: [{ fieldName: "AdmissionId", fieldValue: String(this.vAdmissionId), opType: OperatorComparer.Equals }],
    row: 25
  };


  constructor(
    public _DietCreationService: DietCreationService,
    private _formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.myFilterform = this._formBuilder.group({
      dietTypeId: [0],
      mealTypeId: [0],
      dietMenuId: [0],
      instruction: [''],
      comment: [''],
      fromDate: [new Date()],
      endDate: [new Date()],
      planDate: [new Date()],
    });
  }

  ngOnInit(): void {
    this.patientName = this.data?.patientName || this.data?.firstName || '';

    // Diet type title: update only when the user picks or clears a value.
    // A plain id (written by loadPlan / the dropdown's init) keeps the name already set.
    this.myFilterform.get('dietTypeId')?.valueChanges.subscribe(v => {
      if (v && typeof v === 'object') {
        this.dietTypeName = v.text || '';
      } else if (!v) {
        this.dietTypeName = '';
      }
    });

    // add a row each time a meal type is selected
    this.myFilterform.get('mealTypeId')?.valueChanges.subscribe(v => this.onMealTypeChange(v));

    this.searchFormGroup = this.createSearchForm();

    this.mealRows = [];         // rows are generated from Meal Type selection
    this.onDateRangeChange();   // date columns

    // edit mode: only when a saved plan was passed in
    if (this.data?.dietPlanId) {
      this.registerObj = this.data;
      this.dietPlanId = this.data.dietPlanId;
      this.vAdmissionId = this.data.admissionId || this.data.opipid || this.data.opipId || 0;
      this.GetdietplanbyId();
    }
  }

  createSearchForm() {
    return this._formBuilder.group({ RegID: 0 });
  }

  // ---------- Patient details (edit mode) ----------

  private loadPatient(): void {
    if (!(this.vAdmissionId > 0)) return;

    this._DietCreationService.getAdmissionById(this.vAdmissionId).subscribe((adm: any) => {
      if (!adm) return;
      this._DietCreationService.getRegistraionById(adm.regId).subscribe((reg: any) => {
        this.registerObj = reg;
        this.data = reg;
        this.vPatientName = [reg?.firstName, reg?.middleName, reg?.lastName].filter(Boolean).join(' ');
        this.cdr.detectChanges();
      });
    });
  }

  // ---------- Edit mode: fetch + fill ----------

  GetdietplanbyId() {
    const param = {
      first: 0, rows: 20, sortField: 'DietPlanId', sortOrder: 0,
      filters: [{ fieldName: 'dietPlanId', fieldValue: String(this.dietPlanId), opType: 'Equals' }],
      exportType: 'JSON',
      columns: []
    };

    this._DietCreationService.getdietplanById(param).subscribe((res: any) => {
      this.loadPlan(res);
    });
  }

  loadPlan(res: any) {
    const list: any[] = Array.isArray(res) ? res : (res?.data ?? [res]);
    if (!list.length) return;

    const first = list[0];
    const toDate = (s: string) => new Date(s);   // no-timezone ISO string parses as local time
    const key = (s: string) => this.datePipe.transform(toDate(s), 'yyyy-MM-dd')!;

    // patient id for Save (edit mode) + patient card
    this.vAdmissionId = this.vAdmissionId || first.opipid || 0;
    this.loadPatient();

    // 1. Filters. emitEvent:false so the subscriptions don't fire.
    //    mealTypeId is NOT patched: it is only the "add a row" picker.
    this.myFilterform.patchValue({
      fromDate: toDate(first.planStartDate),
      endDate: toDate(first.planEndDate),
      dietTypeId: first.dietTypeId,
      instruction: first.instruction,
      comment: first.comment
    }, { emitEvent: false });
    this.dietTypeName = first.dietName || '';
    this.dietMenuName = first.dietMenuName || '';

    // 2. Date columns from the plan range
    this.onDateRangeChange();

    // 3. One row per meal type
    const rows = new Map<number, MealRow>();
    list.forEach(r => {
      if (!rows.has(r.dietMealTypeId)) {
        rows.set(r.dietMealTypeId, {
          mealTypeId: r.dietMealTypeId,
          mealName: r.mealName,   // "Lunch"
          form: new FormGroup({})
        });
      }
    });
    this.mealRows = Array.from(rows.values());

    // 4. Add a control per date to every row
    this.syncControls();

    // 5. Set cell values BEFORE the dropdowns render, so each
    //    airmid-dropdown gets its id in the first writeValue
    const cellValues = new Map<string, { value: number; text: string }>();
    list.forEach(r =>
      cellValues.set(`${r.dietMealTypeId}|${key(r.planDate)}`,
        { value: r.dietMenuId, text: r.dietMenuName })   // { value: 3, text: 'Maharashtrian Mutton Thali' }
    );

    this.mealRows.forEach(row => {
      this.dateColumns.forEach(d => {
        const cell = cellValues.get(`${row.mealTypeId}|${d.key}`);
        if (cell) {
          row.form.get(d.key)?.setValue(cell, { emitEvent: false });
        }
      });
    });

    // plan rows whose date is outside the generated range
    list.forEach(r => {
      if (!rows.get(r.dietMealTypeId)?.form.get(key(r.planDate))) {
        console.warn('No cell for', r.dietMealTypeId, key(r.planDate));
      }
    });

    this.cdr.detectChanges();   // renders the cell dropdowns

    setTimeout(() => {
      this.mealRows.forEach(row => {
        this.dateColumns.forEach(d => {
          const cell = cellValues.get(`${row.mealTypeId}|${d.key}`);
          if (cell) {
            row.form.get(d.key)?.setValue(cell);   // no emitEvent:false, so the dropdown reacts
          }
        });
      });
      this.cdr.detectChanges();
    }, 1000);


  }
  dietMenuList: { value: number; text: string }[] = [];

  private addMenus(items: { value: number; text: string }[]) {
    const seen = new Set(this.dietMenuList.map(m => m.value));
    items.forEach(m => {
      if (m.value && !seen.has(m.value)) {
        this.dietMenuList.push(m);
        seen.add(m.value);
      }
    });
    this.dietMenuList = [...this.dietMenuList];
  }


  private mealNameOf(id: number, r?: any): string {
    return r?.mealName
      || r?.dietMealTypeName
      || r?.mealTypeName
      || this.mealTypeList?.find(m => m.value === id)?.text
      || `Meal ${id}`;
  }

  // ---------- Grid ----------

  trackByMeal = (_: number, r: MealRow) => r.mealTypeId;
  trackByDate = (_: number, c: { key: string }) => c.key;

  // Meal Type dropdown -> add a row (no duplicates)
  private onMealTypeChange(v: any) {
    const id = (v && typeof v === 'object') ? v.value : v;
    const name = (v && typeof v === 'object') ? (v.text || '') : '';
    if (!id || !name) return;

    // 1. already in the table? (match by id OR by name)
    const cleanName = name.trim().toLowerCase();
    const exists = this.mealRows.some(r =>
      String(r.mealTypeId) === String(id) ||
      r.mealName.trim().toLowerCase() === cleanName
    );
    if (exists) {
      this.toastr.warning(`${name} is already added`);
      return;
    }

    // 2. patient must be selected
    if (!this.vAdmissionId) {
      this.toastr.warning('Please select a patient first');
      return;
    }

    // 3. diet type must be selected
    if (!this.getId(this.myFilterform.get('dietTypeId')?.value)) {
      this.toastr.warning('Please select a diet type first');
      return;
    }

    // 4. date range must be valid (at least one date column)
    if (!this.dateColumns.length) {
      this.toastr.warning('Please select a valid schedule date range');
      return;
    }

    // all checks passed -> add the row
    this.mealRows = [
      ...this.mealRows,
      { mealTypeId: id, mealName: name, form: new FormGroup({}) }   // new group per row, never shared
    ];
    this.syncControls();   // add a control for every date column to the new row
    this.clearMealType();
  }
  private clearMealType() {
    // reset after the current change event finishes, so the dropdown doesn't fight its own emit
    setTimeout(() => {
      this.myFilterform.get('mealTypeId')?.reset(null);   // use your actual control name
    });
  }
  // Delete -> remove the row
  onCancelRow(row: MealRow) {
    this.mealRows = this.mealRows.filter(r => r !== row);

    // clear the Meal Type filter if it still shows the deleted meal,
    // otherwise picking the same meal again wouldn't add the row back
    const ctrl = this.myFilterform.get('mealTypeId');
    if (this.getId(ctrl?.value) === row.mealTypeId) {
      ctrl?.setValue(0, { emitEvent: false });
    }
  }

  onDateRangeChange() {
    const from = this.myFilterform.get('fromDate').value;
    const to = this.myFilterform.get('endDate').value;
    if (!from || !to) return;

    const cols: { key: string; date: Date }[] = [];
    const d = new Date(from);
    d.setHours(0, 0, 0, 0);
    const last = new Date(to);
    last.setHours(0, 0, 0, 0);

    while (d <= last && cols.length < this.MAX_DAYS) {
      cols.push({ key: this.datePipe.transform(d, 'yyyy-MM-dd')!, date: new Date(d) });
      d.setDate(d.getDate() + 1);
    }
    this.dateColumns = cols;
    this.syncControls();
  }

  // add controls for new dates, remove controls for dates no longer in range
  private syncControls() {
    const keys = this.dateColumns.map(c => c.key);
    this.mealRows.forEach(row => {
      keys.forEach(k => {
        if (!row.form.contains(k)) row.form.addControl(k, new FormControl(null));
      });
      Object.keys(row.form.controls).forEach(k => {
        if (!keys.includes(k)) row.form.removeControl(k);
      });
    });
  }

  getSelectedObjIP(obj) {
    this.vAdmissionId = obj.admissionID;
    if ((obj.regID ?? 0) > 0) {
      this.vPatientName = [obj.firstName, obj.middleName, obj.lastName].filter(Boolean).join(' ');
      this.data = obj;
      this.registerObj = obj;
    }
    if (this.vAdmissionId)
      this.checkHistory();
  }
  registerObj1: any
  checkHistory(): void {

    const param = {
      first: 0, rows: 20, sortField: 'DietAssessmentId', sortOrder: 0,
      filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: 'Equals' }],
      exportType: 'JSON',
      columns: [{ data: 'DietAssessmentId', name: 'DietAssessmentId' }]
    };

    this._DietCreationService.getassessmentById(param).subscribe((res) => {
      this.registerObj1 = res;
      this.Statement = (res?.data ?? []).length > 0;
      if (!this.Statement) { this.historyDrawer?.close(); }
    });
  }


  // ---------- Save ----------

  // read a dropdown value: object { value, text } or a plain id
  private getId(v: any): number {
    return (v && typeof v === 'object') ? (v.value ?? 0) : (v ?? 0);
  }

  // local calendar date -> "2026-10-13T00:00:00.000Z" (no timezone shift)
  private toIso(d: Date): string {
    return new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate())).toISOString();
  }

  // one flat object per meal row x date cell that has a menu selected
  private buildPayload() {
    debugger
    const f = this.myFilterform.value;
    const planStartDate = this.toIso(new Date(f.fromDate));
    const planEndDate = this.toIso(new Date(f.endDate));
    const dietTypeId = this.getId(f.dietTypeId);

    const payload: any[] = [];

    this.mealRows.forEach(row => {
      this.dateColumns.forEach(col => {
        const dietMenuId = this.getId(row.form.get(col.key)?.value);
        if (dietMenuId > 0 || this.dietPlanId) {
          payload.push({
            dietPlanId: this.dietPlanId,
            opipid: this.vAdmissionId,
            opiptype: 1,
            planStartDate: planStartDate,
            planEndDate: planEndDate,
            planDate: f.planDate,// this.toIso(col.date),     // the date column of this cell
            dietTypeId,
            dietMealTypeId: row.mealTypeId,     // the meal row
            dietMenuId,                         // the selected menu in the cell
            instruction: f.instruction || '',
            comment: f.comment || ''
          });
        }
      });
    });

    return payload;
  }

  onSave() {
    if (!this.vAdmissionId) {
      this.toastr.warning('Please select a patient');
      return;
    }
    if (!this.getId(this.myFilterform.value.dietTypeId)) {
      this.toastr.warning('Please select a diet type');
      return;
    }
    if (!this.mealRows.length) {
      this.toastr.warning('Please add at least one meal type');
      return;
    }

    const payload = this.buildPayload();
    if (!payload.length) {
      this.toastr.warning('Please select a diet menu for at least one date');
      return;
    }

    console.log(payload);

    this._DietCreationService.SaveDietCreation(payload).subscribe(() => {
      this._matDialog.closeAll();
    });
  }

  onHistoryDrawerChange(opened: boolean) {
    if (!opened) { return; }
    setTimeout(() => {
      this.grid1.gridConfig = {
        ...this.gridConfig,
        filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: OperatorComparer.Equals }]
      };
      this.grid1.bindGridData();
    });
  }

}
