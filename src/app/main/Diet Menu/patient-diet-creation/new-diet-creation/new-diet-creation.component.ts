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
import Swal from 'sweetalert2';

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
  autocompleteModedietType = 'MDietTypeMaster';
  Statement: boolean = false;
  readonly MAX_DAYS = 31;

  dateColumns: { key: string; date: Date }[] = [];
  mealRows: MealRow[] = [];
  InsertStatus: boolean = true;

  // "mealTypeId|yyyy-MM-dd" -> dietPlanDetId (so save can update / clear existing rows)
  private savedCells = new Map<string, number>();

  @ViewChild('historyDrawer') historyDrawer: MatDrawer;
  @ViewChild('grid1Ref') grid1: AirmidTableComponent;

  searchFormGroup: FormGroup;
  myFilterform: FormGroup;

  dietPlanId = 0;
  vPatientName = '';
  vAdmissionId = 0;
  registerObj: any;
  registerObj1: any;
  assessmentList: any[] = [];
  fitLimit = 4;

  // ---------- Assessment history grid ----------

  allcolumns = [
    { heading: "Assessment Date", key: "assessmentDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 100 },
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
  ];

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
      dietMenuId: [0],
      instruction: [''],
      comment: [''],
      fromDate: [new Date()],
      endDate: [new Date()],
      planDate: [new Date()],
      draftOrFinal: false
    });
  }

  ngOnInit(): void {
    this.patientName = this.data?.patientName || this.data?.firstName || '';

    this.myFilterform.get('dietTypeId')?.valueChanges.subscribe(v => {
      if (v && typeof v === 'object') {
        this.dietTypeName = v.text || '';
      } else if (!v) {
        this.dietTypeName = '';
      }
    });

    this.searchFormGroup = this.createSearchForm();

    this.onDateRangeChange();   // date columns

    if (this.data?.dietPlanId) {
      debugger
      this.InsertStatus = false;
      this.registerObj = this.data;
      this.dietPlanId = this.data.dietPlanId;
      this.vAdmissionId = this.data.admissionId || this.data.opipid || this.data.opipId || 0;

      // patch the header fields from the grid row
      const d = this.data;
      const patch: any = {
        instruction: d.instruction || '',
        comment: d.comment || ''
      };
      if (d.planStartDate) patch.fromDate = new Date(d.planStartDate);
      if (d.planEndDate) patch.endDate = new Date(d.planEndDate);
      if (d.planDate) patch.planDate = new Date(d.planDate);
      if (d.dietTypeId != null) patch.dietTypeId = d.dietTypeId;

      this.myFilterform.patchValue(patch, { emitEvent: false });
      this.dietTypeName = d.dietName || '';
      this.GetdietplanbyId();
      this.onDateRangeChange();   // rebuild the date columns for the patched range
    }

    this.loadMealTypes();

    if ((this.vAdmissionId ?? 0) > 0) {
      setTimeout(() => {
        this._DietCreationService.getAdmissionById(this.vAdmissionId).subscribe((response) => {
          this.registerObj1 = response;
          if (response) {
            this._DietCreationService.getRegistraionById(response.regId).subscribe((reg) => {
              this.registerObj = reg;
              this.data = reg;
            });
          }
        });
      }, 500);
    }
  }

  ngAfterViewInit() {
    this.checkHistory();   // shows the history icon in edit mode; skipped when no patient yet
  }

  createSearchForm() {
    return this._formBuilder.group({ RegID: 0 });
  }

  // ---------- Meal rows (all meal types, loaded on init) ----------

  private loadMealTypes() {
    const data = {
      first: 0,
      rows: 15,
      sortField: 'mealId',
      sortOrder: 0,
      filters: [
        { fieldName: "mealName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
      ],
      exportType: 'JSON',
      columns: []
    };

    this._DietCreationService.getMealTypeList(data).subscribe((res: any) => {
      const list: any[] = Array.isArray(res) ? res : (res?.data ?? []);

      const seen = new Set<number>();
      this.mealRows = [];

      list.forEach(m => {
        const id = m.value ?? m.mealId ?? m.id;
        const name = m.text ?? m.mealName;
        if (id == null || seen.has(id)) return;   // one row per meal type
        seen.add(id);
        this.mealRows.push({
          mealTypeId: id,
          mealName: name,
          form: new FormGroup({})
        });
      });

      this.syncControls();
      this.cdr.detectChanges();

      // edit mode: meal rows exist now, so the plan can be placed into them
      if (this.dietPlanId) {
        this.GetdietplanbyId();
      }
    });
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
    console.log('1 GetdietplanbyId called, dietPlanId =', this.dietPlanId);

    const requestData = {
      first: 0,
      rows: 999,
      sortField: "DietPlanId",
      sortOrder: 0,
      filters: [{ fieldName: "DietPlanId", fieldValue: String(this.dietPlanId), opType: "Equals" }],
      exportType: "JSON",
      columns: []
    };

    this._DietCreationService.getRequestdetaillist(requestData).subscribe({
      next: (res: any) => {
        console.log('2 API response', res);
        try {
          this.loadPlan(res);
          console.log('3 loadPlan finished, meals =', this.mealRows.length, 'cols =', this.dateColumns.length);
        } catch (e) {
          console.error('3 loadPlan THREW', e);
        }
      },
      error: (e) => console.error('2 API ERROR', e)
    });
  }

  loadPlan(res: any) {
    const list: any[] = Array.isArray(res) ? res : (res?.data ?? [res]);
    if (!list.length) return;
    debugger
    const first = list[0];
    const toDate = (s: any) => (s ? new Date(s) : null);
    const key = (s: any) => this.datePipe.transform(toDate(s), 'yyyy-MM-dd')!;
    const mealIdOf = (r: any) => r.dietMealTypeId ?? r.mealTypeId ?? r.mealId;

    // ---------- 1. Only the dates / meals that exist in the data ----------
    const dateKeys = Array.from(new Set(list.map(r => key(r.planDate)))).sort();

    const mealMap = new Map<number, string>();
    list.forEach(r => {
      const id = mealIdOf(r);
      if (id != null && !mealMap.has(id)) {
        mealMap.set(id, r.mealName || r.dietMealTypeName || `Meal ${id}`);
      }
    });
    const mealEntries = Array.from(mealMap.entries()).sort((a, b) => a[0] - b[0]);

    // ---------- 2. Patient / header ----------
    this.vAdmissionId = this.vAdmissionId || first.opipid || first.opipId || 0;
    this.loadPatient();

    const patch: any = {
      fromDate: new Date(dateKeys[0] + 'T00:00:00'),
      endDate: new Date(dateKeys[dateKeys.length - 1] + 'T00:00:00'),
      planDate: first.planDate ? toDate(first.planDate) : new Date(),
      instruction: first.instruction || '',
      comment: first.comment || ''
    };
    if (first.dietTypeId != null) {
      patch.dietTypeId = first.dietTypeId;   // plain id - airmid-dropdown resolves the text
    }
    this.myFilterform.patchValue(patch, { emitEvent: false });
    this.dietTypeName = first.dietName || first.dietTypeName || '';

    // ---------- 3. Destroy old rows first so every dropdown is re-created with its new FormGroup ----------
    this.mealRows = [];
    this.dateColumns = [];
    this.cdr.detectChanges();

    // ---------- 4. Build columns + rows from data only ----------
    this.dateColumns = dateKeys.map(k => ({ key: k, date: new Date(k + 'T00:00:00') }));
    this.mealRows = mealEntries.map(([id, name]) => ({
      mealTypeId: id,
      mealName: name,
      form: new FormGroup({})
    }));
    this.syncControls();

    // ---------- 5. Cell map: "mealId|yyyy-MM-dd" -> menu id ----------
    this.savedCells.clear();
    const cellValues = new Map<string, number>();

    list.forEach(r => {
      const mealId = mealIdOf(r);
      if (mealId == null) return;

      const cellKey = `${mealId}|${key(r.planDate)}`;
      const menuId = Number(r.dietMenuId ?? r.menuId ?? 0);

      if (menuId > 0) {
        cellValues.set(cellKey, menuId);   // plain id, same as dietTypeId
      }
      this.savedCells.set(cellKey, r.dietPlanDetId ?? r.dietPlanDetailId ?? 0);
    });

    // ---------- 6. Render, then set values ----------
    this.cdr.detectChanges();

    const applyValues = () => {
      this.mealRows.forEach(row => {
        this.dateColumns.forEach(d => {
          const id = cellValues.get(`${row.mealTypeId}|${d.key}`);
          row.form.get(d.key)?.setValue(id ?? null);
        });
      });
      this.cdr.detectChanges();
      console.log('cols', this.dateColumns.map(c => c.key), 'meals', this.mealRows.length,
        'values', JSON.stringify(this.mealRows.map(r => r.form.value)));
    };

    applyValues();
    setTimeout(applyValues, 300);   // second pass in case dropdown options load late
  }

  // ---------- Grid ----------

  trackByMeal = (_: number, r: MealRow) => r.mealTypeId;
  trackByDate = (_: number, c: { key: string }) => c.key;
  trackByAssess = (_: number, a: any) => a.dietAssessmentId ?? a.assessmentDate;

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

  // ---------- Patient selection + assessment history ----------

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

  checkHistory(): void {
    const param = {
      first: 0, rows: 50, sortField: 'DietAssessmentId', sortOrder: 0,
      filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: 'Equals' }],
      exportType: 'JSON',
      columns: [{ data: 'DietAssessmentId', name: 'DietAssessmentId' }]
    };

    this._DietCreationService.getassessmentById(param).subscribe((res: any) => {
      this.registerObj1 = res;
      this.assessmentList = res?.data ?? [];
      this.Statement = this.assessmentList.length > 0;
      if (!this.Statement) { this.historyDrawer?.close(); }
      this.cdr.detectChanges();
    });
  }

  onHistoryDrawerChange(opened: boolean) {
    if (!opened) { return; }
    setTimeout(() => {
      if (!this.grid1) { return; }
      this.grid1.gridConfig = {
        ...this.gridConfig,
        filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: OperatorComparer.Equals }]
      };
      this.grid1.bindGridData();
    });
  }

  // ---------- Save ----------

  // read a dropdown value: object { value, text } or a plain id
  private getId(v: any): number {
    const raw = (v && typeof v === 'object') ? v.value : v;
    const n = Number(raw);
    return isNaN(n) ? 0 : n;
  }

  // local calendar date -> "2026-10-24T00:00:00" (matches the API payload, no timezone)
  private toLocalIso(d: Date): string {
    return this.datePipe.transform(d, "yyyy-MM-dd'T'00:00:00")!;
  }

  // header object + one detail row per meal row x date cell that has a menu selected
  // (or a cell that was saved earlier and may now be cleared, so the backend can remove it)
  private buildPayload(isFinal: boolean) {
    const f = this.myFilterform.value;
    const planStartDate = this.toLocalIso(new Date(f.fromDate));
    const planEndDate = this.toLocalIso(new Date(f.endDate));
    const dietTypeId = this.getId(f.dietTypeId);
    const instruction = f.instruction || '';
    const comment = f.comment || '';
    const planDate = this.toLocalIso(new Date(f.planDate));

    const details: any[] = [];

    this.mealRows.forEach(row => {
      this.dateColumns.forEach(col => {
        const cellKey = `${row.mealTypeId}|${col.key}`;
        const dietMenuId = this.getId(row.form.get(col.key)?.value);
        const wasSaved = this.savedCells.has(cellKey);

        if (dietMenuId > 0 || wasSaved) {
          details.push({
            dietPlanDetId: this.savedCells.get(cellKey) ?? 0,
            dietPlanId: this.dietPlanId,
            opipid: this.vAdmissionId,
            opiptype: 1,
            planStartDate,
            planEndDate,
            planDate: this.toLocalIso(col.date),
            dietTypeId,
            dietMealTypeId: row.mealTypeId,
            dietMenuId,
            instruction,
            comment
          });
        }
      });
    });

    const first = details[0];

    return {
      dietPlanId: this.dietPlanId,
      opipid: this.vAdmissionId,
      opiptype: 1,
      planStartDate,
      planEndDate,
      planDate,
      dietTypeId,
      dietMealTypeId: first?.dietMealTypeId ?? 0,
      dietMenuId: first?.dietMenuId ?? 0,
      instruction,
      comment,
      draftOrFinal: this.myFilterform.get('draftOrFinal').value ? true : false,
      tDietPlanScheduleDetails: details
    };
  }

  onSave(isFinal: boolean = false) {
    if (!this.vAdmissionId) {
      this.toastr.warning('Please select a patient');
      return;
    }
    if (!this.getId(this.myFilterform.value.dietTypeId)) {
      this.toastr.warning('Please select a diet type');
      return;
    }
    if (!this.mealRows.length) {
      this.toastr.warning('No meal types available');
      return;
    }

    const payload = this.buildPayload(isFinal);
    if (!payload.tDietPlanScheduleDetails.length) {
      this.toastr.warning('Please select a diet menu for at least one date');
      return;
    }

    // SaveDietCreation in diet-creation.service.ts must accept `any` (an object), not any[]
    this._DietCreationService.SaveDietCreation(payload).subscribe(() => {
      if (this.myFilterform.get('draftOrFinal').value)
        this.onSaveFinal();
      this._matDialog.closeAll();
    });
  }

  private buildCanteenPayload() {
    const f = this.myFilterform.value;
    const now = new Date();
    const date = this.datePipe.transform(now, 'yyyy-MM-dd')!;
    const time = now.toISOString();
    const dietTypeId = this.getId(f.dietTypeId);

    const tDietPatReqDetails: any[] = [];

    this.mealRows.forEach(row => {
      this.dateColumns.forEach(col => {
        const dietMenuId = this.getId(row.form.get(col.key)?.value);
        if (dietMenuId <= 0) return;   // skip empty cells

        tDietPatReqDetails.push({
          dietReqDetId: 0,
          dietReqId: 0,
          orderDate: col.key,
          orderTime: time,
          opipid: this.vAdmissionId,
          opiptype: 1,
          dietMenuId: String(dietMenuId),
          mealTypeId: row.mealTypeId,
          dietTypeId,
          dietRestrictionId: 0,
          allergyId: 0,
          nutritionistId: 1,   // replace with the logged-in user id if needed
          isPriority: true,
          comments: f.comment || '',
          status: 0,
          isAccept: false,
          isAcceptedBy: 0,
          isAcceptedDateTime: '1900-01-01',
          isDelived: false,
          isDelivedBy: 0,
          isDelivedDateTime: '1900-01-01'
        });
      });
    });

    return {
      dietReqId: 0,
      date,
      time,
      unitId: 1,
      dietReqNo: '1',
      dietMenuId: tDietPatReqDetails[0]?.dietMenuId ?? '0',
      tDietPatReqDetails
    };
  }

  onSaveFinal() {
    if (!this.vAdmissionId) {
      this.toastr.warning('Please select a patient');
      return;
    }

    const payload = this.buildCanteenPayload();
    if (!payload.tDietPatReqDetails.length) {
      this.toastr.warning('Please select a diet menu for at least one date');
      return;
    }

    Swal.fire({
      icon: 'question',
      title: 'Do you want to Send Canteen Request',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Send it!'
    }).then((flag) => {
      if (!flag.isConfirmed) return;   // Cancel does nothing

      this._DietCreationService.CanteenRequest(payload).subscribe({
        next: () => {
          this.toastr.success('Canteen Request Final');
          this._matDialog.closeAll();
        },
        error: (error) => this.toastr.error(error.message)
      });
    });
  }

  deleteMealRow(index: number): void {
    this.mealRows = this.mealRows.filter((_, i) => i !== index);
  }

  get tableWidth(): number {
    return 80 + 150 + (this.dateColumns?.length || 0) * 240;   // keep in sync with SCSS
  }
}