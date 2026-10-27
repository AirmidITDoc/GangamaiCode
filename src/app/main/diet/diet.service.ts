import { Injectable } from '@angular/core';
import { MealEntry, MealKey, Patient, PatientPlan } from './diet.models';

export const addDays = (d: Date, n: number) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
export const startOfWeek = (d: Date) => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const w = (x.getDay() + 6) % 7; return addDays(x, -w); };
export const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

/** Static/mock service (localStorage). Replace the bodies with HttpClient calls to your API. */
@Injectable({ providedIn: 'root' })
export class DietService {
  private readonly LS = 'diet.plans.v1';

  readonly patients: Patient[] = [
    { regNo: 'REG-10025', name: 'Rahul Sharma', type: 'IP', admissionNo: 'ADM-2026-001', ward: 'General Ward / B-12', age: 45, gender: 'Male', dietType: 'Regular Diet', allergies: 'None' },
    { regNo: 'REG-10031', name: 'Meena Patel', type: 'IP', admissionNo: 'ADM-2026-004', ward: 'Private / P-03', age: 62, gender: 'Female', dietType: 'Diabetic Diet', allergies: 'Peanuts' },
    { regNo: 'REG-10047', name: 'Amit Desai', type: 'OP', admissionNo: '-', ward: 'Day Care', age: 33, gender: 'Male', dietType: 'Low Salt Diet', allergies: 'None' },
  ];

  private plans: Record<string, PatientPlan> = this.load();

  key(date: Date, meal: MealKey) { return `${dateKey(date)}|${meal}`; }

  getEntry(patientId: string, date: Date, meal: MealKey): MealEntry | undefined {
    return this.plans[patientId]?.[this.key(date, meal)];
  }

  saveEntry(patientId: string, date: Date, meal: MealKey, entry: MealEntry | null) {
    const plan = (this.plans[patientId] ??= {});
    entry ? (plan[this.key(date, meal)] = entry) : delete plan[this.key(date, meal)];
    localStorage.setItem(this.LS, JSON.stringify(this.plans));
  }

  private load(): Record<string, PatientPlan> {
    try { const raw = localStorage.getItem(this.LS); if (raw) return JSON.parse(raw); } catch { /* ignore */ }
    return this.seed();
  }

  private seed(): Record<string, PatientPlan> {
    const plan: PatientPlan = {};
    const ws = startOfWeek(new Date());
    const menu: Record<string, { name: string; qty: string }[]> = {
      earlyMorning: [{ name: 'Warm Milk', qty: '200 ml' }],
      breakfast: [{ name: 'Idli', qty: '2 pcs' }, { name: 'Sambar', qty: '1 bowl' }],
      lunch: [{ name: 'Rice', qty: '1 bowl' }, { name: 'Dal', qty: '1 bowl' }, { name: 'Roti', qty: '2 pcs' }],
      dinner: [{ name: 'Khichdi', qty: '1 bowl' }],
    };
    for (let i = 0; i < 70; i++)
      for (const k of Object.keys(menu))
        plan[this.key(addDays(ws, i), k as MealKey)] = { items: menu[k], status: 'Pending', notes: k === 'lunch' ? 'Low salt diet. Avoid spicy food.' : '' };
    return { 'REG-10025': plan };
  }
}
