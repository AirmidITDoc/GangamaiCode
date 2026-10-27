import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DietAssessmentService } from '../diet-assessment.service';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatDrawer } from '@angular/material/sidenav';

export type NutritionRisk = 'Low' | 'Medium' | 'High';

@Component({
  selector: 'app-new-assessment',
  templateUrl: './new-assessment.component.html',
  styleUrls: ['./new-assessment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAssessmentComponent {

  searchFormGroup: FormGroup;
  DietForm: FormGroup
  screenFromString = 'Common-form';
  patient = 0
  bmi: number | null = null;
  nutritionRisk: NutritionRisk = 'Low';

  regObj: any
  registerObj: any
  vBMI: any; vHeight: any;
  vWeight: any;
  Createddate: any
  dietAssessmentId = 0
  vAdmissionId = 0
  vPatientName = ''
  registerObj1: any
  VitalsInfo: any
  vassessmentDate = new Date()
  Statement: boolean = false
  InsertStatus: boolean = true
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeSeverity: string = 'TypesOfSeverity'
  autocompleteModefoodpref: string = 'FoodPreference'
  autocompleteModenutritionStatus: string = 'Nutritional_Status'
  @Output() dataLoaded = new EventEmitter<number>();
  @ViewChild('grid1Ref') grid1: AirmidTableComponent;
  @ViewChild('historyDrawer') historyDrawer: MatDrawer;


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

  ngAfterViewInit() {
    this.checkHistory();            // shows the history icon in edit mode; skipped when no patient yet
  }

  assessorList: { id: number; name: string }[] = [];
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, public _matDialog: MatDialog, public _DietAssessmentService: DietAssessmentService,
    public datePipe: DatePipe, public toastr: ToastrService, private accountService: AuthenticationService,
    private _FormvalidationserviceService: FormvalidationserviceService, private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.DietForm = this.fb.group({
      dietAssessmentId: this.dietAssessmentId,
      opipid: this.vAdmissionId,
      opiptype: 1,
      nutritionRiskId: 0,
      height: [this.vHeight, [Validators.required, Validators.min(30), Validators.max(250)]],
      weight: [this.vWeight, [Validators.required, Validators.min(1), Validators.max(400)]],
      bmi: [this.vBMI, [Validators.required, Validators.min(1), Validators.max(400)]],
      assessmentDate: [new Date(), Validators.required],
      assessmentTime: [new Date(), Validators.required],
      assessmentById: [parseInt(this.accountService.currentUserValue.user.userId), Validators.required],
      allergies: [''],
      foodPerferenceId: [0, Validators.required],
      specialInstructions: [''],
      nutritionStatus: [0, Validators.required],
      dietitionNotes: ['']
    });
    if (this.data) {
      this.InsertStatus = false;
      this.registerObj = this.data
      console.log(this.registerObj)
      this.vAdmissionId = this.data.admissionId;

      this.vHeight = this.data.height
      this.vWeight = this.data.weight
      this.vBMI = this.data.bmi
      this.DietForm.patchValue({
        dietAssessmentId: this.data.dietAssessmentId,
        opipid: this.data.opipId,
        opiptype: this.data.opipType,
        nutritionRiskId: this.data.nutritionRiskId,
        height: this.data.height,
        weight: this.data.weight,
        bmi: this.data.bmi,
        assessmentDate: new Date(this.data.assessmentDate),
        assessmentTime: new Date(this.data.assessmentTime),
        assessmentById: this.data.assessmentById,
        allergies: this.data.allergies,
        foodPerferenceId: this.data.foodPerferenceId,
        specialInstructions: this.data.specialInstructions,
        nutritionStatus: this.data.nutritionStatus,
        dietitionNotes: this.data.dietitionNotes
      });
    }

    if ((this.vAdmissionId ?? 0) > 0) {
      setTimeout(() => {
        this._DietAssessmentService.getAdmissionById(this.vAdmissionId).subscribe((response) => {
          this.registerObj1 = response;
          console.log(this.registerObj1)
          if (response) {
            this._DietAssessmentService.getRegistraionById(response.regId).subscribe((response) => {
              this.registerObj = response;
              this.data = response
              console.log(this.data)
            });
          }

        });
      }, 500);
    }

    this.searchFormGroup = this.createSearchForm();
  }


  createSearchForm() {
    return this.fb.group({
      RegID: 0,

    });
  }


  getSelectedObjIP(obj) {

    console.log(obj)
    this.vAdmissionId = obj.admissionID
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.data = obj;
      this.registerObj = obj;
      console.log(obj)
    }
    // close any drawer left open from the previous patient
    this.historyDrawer?.close();

    if (this.vAdmissionId) {
      this.getvitals()
      this.checkHistory()
    }
  }

  getvitals(): void {
    const param = {
      first: 0, rows: 20, sortField: 'AdmissionId', sortOrder: 0,
      filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: 'Contains' }],
      exportType: 'JSON',
      columns: []
    };

    this._DietAssessmentService.getVitalById(param).subscribe((res) => {
      console.log(res.data[0])
      this.VitalsInfo = res.data[0];
      if (this.VitalsInfo) {
        debugger
        this.vHeight = res.data[0].height
        this.vWeight = res.data[0].weight
        this.vBMI = res.data[0].bmi
        this.Createddate = res.data[0].createddate

      }
    });
  }


  assessmentList: any[] = [];
  trackByAssess = (_: number, a: any) => a.dietAssessmentId ?? a.assessmentDate;

  checkHistory(): void {
    const param = {
      first: 0, rows: 50, sortField: 'DietAssessmentId', sortOrder: 0,
      filters: [{ fieldName: 'AdmissionId', fieldValue: String(this.vAdmissionId), opType: 'Equals' }],
      exportType: 'JSON',
      columns: [{ data: 'DietAssessmentId', name: 'DietAssessmentId' }]
    };

    this._DietAssessmentService.getassessmentById(param).subscribe((res: any) => {
      this.registerObj1 = res;
      this.assessmentList = res?.data ?? [];
      this.Statement = this.assessmentList.length > 0;
      if (!this.Statement) { this.historyDrawer?.close(); }
      this.cdr.detectChanges();
    });
  }

  // Load the history grid each time the drawer opens
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

  getBMIcalculation() {
    const height = this.DietForm.get('height')?.value;
    const weight = this.DietForm.get('weight')?.value;

    if (height > 0 && weight > 0) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      this.DietForm.get('bmi')?.setValue(Math.round(bmi));

    } else {
      this.DietForm.get('bmi')?.setValue(0);
      // this.toastr.warning('Please enter valid height (above 30 cm) and weight.');
    }
  }
  onEnter(event: KeyboardEvent, nextInputId: string) {
    if (event.key === "Enter") {
      event.preventDefault();  // prevent form submit
      document.getElementById(nextInputId)?.focus();
    }
  }
  private today(): string {
    return new Date().toISOString().substring(0, 10); // yyyy-MM-dd for <input type="date">
  }
  keyPressNumeric(event: KeyboardEvent): void {
    const allowed = /[0-9.]/;
    if (!allowed.test(event.key)) {
      event.preventDefault();
    }
  }


  getValidationMessages() {
    return {
      height: [
        { name: "required", Message: "height is required" }
      ],
      weight: [
        { name: "required", Message: "weight is required" }
      ],
      bmi: [
        { name: "required", Message: "bmi is required" }
      ],
      assessedBy: [
        { name: "required", Message: "assessedBy is required" }
      ],
      allergies: [
        { name: "required", Message: "allergies is required" }
      ],
      foodPreference: [
        { name: "required", Message: "foodPreference is required" }
      ],
      nutritionStatus: [
        { name: "required", Message: "nutritionStatus is required" }
      ],
      specialInstructions: [
        { name: "required", Message: "specialInstructions is required" }
      ],
      dietitianNotes: [
        { name: "required", Message: "dietitianNotes is required" }
      ],
      nutritionRisk: [
        { name: "required", Message: "nutritionRisk is required" }
      ],
      foodPerferenceId: [
        { name: "required", Message: "foodPerferenceId is required" }
      ],
    };
  }

  date: any;

  onSave() {

    const dietFormValue = this.DietForm.value;

    // declare these first
    const assessmentDate = this.datePipe.transform(dietFormValue.assessmentDate, 'yyyy-MM-dd');
    const assessmentTime = this.datePipe.transform(new Date(), 'HH:mm:ss');

    // dropdowns may give { value, text } or a plain id
    const toInt = (v: any) =>
      parseInt(String((v && typeof v === 'object') ? v.value : v), 10) || 0;

    this.DietForm.patchValue({
      opipid: this.vAdmissionId,
      foodPerferenceId: toInt(dietFormValue.foodPerferenceId || 0),
      assessmentById: toInt(dietFormValue.assessmentById),
      nutritionRiskId: toInt(dietFormValue.nutritionRiskId || 0),
      nutritionStatus: toInt(dietFormValue.nutritionStatus || 0),
      bmi: String(dietFormValue.bmi ?? ''),
      assessmentDate: assessmentDate,
      assessmentTime: `${assessmentDate}T${assessmentTime}`
    });

    console.log(this.DietForm.value)
    if (!this.DietForm.invalid) {
      this._DietAssessmentService.SaveDietassessment(this.DietForm.value).subscribe(() => {
        this._matDialog.closeAll();
      });
    }
    else {
      const invalidFields = [];

      if (this.DietForm.invalid) {
        for (const controlName in this.DietForm.controls) {
          if (this.DietForm.controls[controlName].invalid) {
            invalidFields.push(`Diet  Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }
  ChangedietType($event) {
    console.log($event)
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
  onClose(): void {
    this._matDialog.closeAll();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  // showing color for vitals
  getVitalColorClass(vital: string, value: any): string {
    const num = parseFloat(value);
    switch (vital) {
      case 'BMI':
        if (num < 18.5) return 'orange'; // Yellow
        if (num <= 24.9) return 'green'; // Green
        return 'red'; // Red

      case 'SpO2':
        return num < 95 ? 'orange' : 'green';

      case 'Pulse':
        if (num < 60) return 'orange';
        if (num <= 100) return 'green';
        return 'red';

      case 'BP':
        if (!value || typeof value !== 'string' || !value.includes('/')) return '';
        const [sys, dia] = value.split('/').map(Number);
        if (sys < 90 || dia < 60) return 'orange';
        if (sys > 120 || dia > 80) return 'red';
        return 'green';

      case 'Temp':
        if (num < 97) return 'orange';
        if (num <= 99) return 'green';
        return 'red';

      default:
        return '';
    }
  }
}