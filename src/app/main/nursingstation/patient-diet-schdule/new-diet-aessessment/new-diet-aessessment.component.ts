import { DatePipe } from '@angular/common';
import { Component, Inject, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type NutritionRisk = 'Low' | 'Medium' | 'High';

@Component({
  selector: 'app-new-diet-aessessment',
  templateUrl: './new-diet-aessessment.component.html',
  styleUrls: ['./new-diet-aessessment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewDietAessessmentComponent {
  searchFormGroup: FormGroup;
  DietForm: FormGroup
  screenFromString = 'Common-form';
  patient = 0
  bmi: number | null = null;
  nutritionRisk: NutritionRisk = 'Low';
  saving = false;
  regObj: any
  registerObj: any
  vBMI: any; vHeight: any;
  vWeight: any;
  vassessmentDate = new Date()
  autocompleteModedeptdoc: string = "ConDoctor";
  autocompleteModeSeverity: string = 'TypesOfSeverity'
  nutritionalStatusList: string[] = [
    'Normal',
    'Mild Malnutrition',
    'Moderate Malnutrition',
    'Severe Malnutrition',
    'Overweight',
    'Obese',
  ];

  foodPreferenceList: string[] = ['Vegetarian', 'Non-Vegetarian', 'Eggetarian', 'Vegan'];

  assessorList: { id: number; name: string }[] = []; // fill from your API
  private destroy$ = new Subject<void>();

  constructor(private fb: FormBuilder, public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _FormvalidationserviceService: FormvalidationserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.DietForm = this.fb.group({
      height: [168, [Validators.required, Validators.min(30), Validators.max(250)]],
      weight: [62, [Validators.required, Validators.min(1), Validators.max(400)]],
      bmi: [62, [Validators.required, Validators.min(1), Validators.max(400)]],
      assessmentDate: [this.today(), Validators.required],
      assessedBy: [0, Validators.required],
      allergies: ['None'],
      foodPreference: ['Vegetarian', Validators.required],
      specialInstructions: ['Low salt, no sugar'],
      nutritionalStatus: ['Normal', Validators.required],
      dietitianNotes: [
        'Patient has moderate risk due to diabetes. Needs controlled carbohydrate diet with regular monitoring.',
      ],
    });
    if (this.data)
      this.registerObj = this.data
    this.searchFormGroup = this.createSearchForm();
  }


  createSearchForm() {
    return this.fb.group({
      RegID: 0,

    });
  }

  vPatientName = ''
  getSelectedObjIP(obj) {

    console.log(obj)
    if ((obj.regID ?? 0) > 0) {
      console.log("Admitted patient:", obj)
      this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
      this.data=obj;
      this.registerObj = obj;
      console.log(obj)
    }

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
      nutritionalStatus: [
        { name: "required", Message: "nutritionalStatus is required" }
      ],
      specialInstructions: [
        { name: "required", Message: "specialInstructions is required" }
      ],
      dietitianNotes: [
        { name: "required", Message: "dietitianNotes is required" }
      ],
      nutritionRisk: [
        { name: "required", Message: "nutritionRisk is required" }
      ]
    };


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

  onSave() { }
}
