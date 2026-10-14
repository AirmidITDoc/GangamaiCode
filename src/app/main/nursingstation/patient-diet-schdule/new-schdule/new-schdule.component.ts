import { Component, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-schdule',
  templateUrl: './new-schdule.component.html',
  styleUrls: ['./new-schdule.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations
})
export class NewSchduleComponent {


  patient = {
    name: 'Mr. Ramesh Patil', uhid: 'UHID-100234', ipNo: 'IP-2026-0456',
    age: 54, gender: 'Male', ward: 'Ward 3', bed: 'B-12',
    doctor: 'Dr. Kulkarni', admitDate: new Date()
  };

  a: any = {
    heightCm: null, weightKg: null, usualWeightKg: null,
    diagnosis: '', comorbidities: [] as string[],
    appetite: 'Good', mealsPerDay: 3, foodHabit: 'Non-Veg',
    swallowing: 'Normal', allergies: '', intolerances: '',
    recentWeightLoss: 'No', reducedIntake: 'No', severelyIll: 'No',
    albumin: null, hb: null, sodium: null, potassium: null, creatinine: null, bloodSugar: null,
    dietType: '', texture: 'Normal', route: 'Oral',
    calories: null, proteinG: null, fluidMl: null,
    restrictions: [] as string[], notes: ''
  };

  comorbidityList = ['Diabetes', 'Hypertension', 'Renal Disease', 'Cardiac Disease',
                     'Liver Disease', 'Cancer', 'COPD', 'Obesity'];
  restrictionList = ['Low Salt', 'Low Sugar', 'Low Fat', 'High Protein',
                     'Low Potassium', 'Fluid Restricted', 'Low Residue', 'Gluten Free'];
  dietTypes = ['Normal', 'Diabetic', 'Renal', 'Cardiac', 'Liquid', 'Soft', 'Bland', 'High Protein', 'NPO'];

  get bmi(): number | null {
    const h = this.a.heightCm / 100;
    return h && this.a.weightKg ? +(this.a.weightKg / (h * h)).toFixed(1) : null;
  }

  get bmiCategory(): string {
    const b = this.bmi;
    if (!b) return '-';
    if (b < 18.5) return 'Underweight';
    if (b < 25)   return 'Normal';
    if (b < 30)   return 'Overweight';
    return 'Obese';
  }

  get bmiClass(): string {
    return { Underweight: 'warn', Normal: 'good', Overweight: 'warn', Obese: 'bad' }[this.bmiCategory] || '';
  }

  // simple screening score (MUST-style)
  get riskScore(): number {
    let s = 0;
    if (this.bmi && this.bmi < 18.5) s += 2;
    else if (this.bmi && this.bmi < 20) s += 1;
    if (this.a.recentWeightLoss === 'Yes') s += 1;
    if (this.a.reducedIntake === 'Yes') s += 1;
    if (this.a.severelyIll === 'Yes') s += 2;
    return s;
  }

  get riskLevel(): string {
    return this.riskScore >= 3 ? 'High' : this.riskScore >= 1 ? 'Medium' : 'Low';
  }

  toggle(list: string[], item: string) {
    const i = list.indexOf(item);
    i > -1 ? list.splice(i, 1) : list.push(item);
  }

  save() { console.log({ patient: this.patient, assessment: this.a, risk: this.riskLevel }); }
  reset() { /* reset this.a */ }
}
