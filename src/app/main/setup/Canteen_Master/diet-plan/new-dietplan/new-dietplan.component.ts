import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-dietplan',
  templateUrl: './new-dietplan.component.html',
  styleUrls: ['./new-dietplan.component.scss']
})
export class NewDietplanComponent {
  patientForm: FormGroup;
  goalsForm: FormGroup;
  restrictionsForm: FormGroup;
  mealPlanForm: FormGroup;
  registerObj: any
  fullForm: FormGroup;

  vWardName: any
  vBedName: any
  vTariffName: any
  vCompanyName: any
  vPatientType: any
vRefDocName: any
vDOA: any
vPatientName: any
  // Common options
  mealFrequencies = ['3 meals + 2 snacks', '3 meals + 3 snacks', '6 small meals', 'Intermittent fasting style'];
  activityLevels = ['Sedentary', 'Lightly active', 'Moderately active', 'Very active'];
  dietTypes = ['General balanced', 'Diabetic (controlled carb)', 'Weight loss (calorie deficit)', 'High protein', 'Renal-friendly', 'Vegetarian', 'Vegan', 'Gluten-free'];

  constructor(private fb: FormBuilder) {
    this.patientForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      age: ['', [Validators.required, Validators.min(18), Validators.max(120)]],
      gender: [''],
      heightCm: ['', Validators.min(100)],
      weightKg: ['', Validators.min(30)],
      contact: ['', Validators.pattern('^[0-9]{10}$')],
      diagnosis: ['', Validators.maxLength(200)]
    });

    this.goalsForm = this.fb.group({
      primaryGoal: ['', Validators.required],
      targetWeightKg: [''],
      dailyCalories: ['', Validators.min(1000)],
      activityLevel: ['', Validators.required],
      mealsPerDay: ['', Validators.required]
    });

    this.restrictionsForm = this.fb.group({
      allergies: [''],
      intolerances: [''],
      avoidFoods: [''],
      preferredCuisine: ['']
    });

    this.mealPlanForm = this.fb.group({
      breakfast: ['', Validators.required],
      midMorningSnack: [''],
      lunch: ['', Validators.required],
      eveningSnack: [''],
      dinner: ['', Validators.required],
      bedtimeSnack: [''],
      totalCarbsG: [''],
      totalProteinG: [''],
      totalFatG: [''],
      notes: ['']
    });

    // Combine all into one form (optional – for easy submission)
    this.fullForm = this.fb.group({
      patient: this.patientForm,
      goals: this.goalsForm,
      restrictions: this.restrictionsForm,
      plan: this.mealPlanForm
    });
  }

  ngOnInit() { }

  onSubmit() {
    if (this.fullForm.valid) {
      console.log('Diet Plan Submitted:', this.fullForm.value);
      // Here: send to backend, generate PDF, show success message, etc.
      alert('Diet plan saved successfully!');
    } else {
      this.fullForm.markAllAsTouched();
    }
  }

  closeDialog(){}

  get f() { return this.fullForm.controls; } // shortcut for template
}