import { Component } from '@angular/core';
import { addDays, DietService, startOfWeek } from '../diet.service';
import { MEAL_SLOTS, MealSlot, VIEW_DAY_COLORS } from '../diet.models';

@Component({ selector: 'app-diet-view', templateUrl: './diet-view.component.html', styleUrls: ['./diet-view.component.scss'] })
export class DietViewComponent {
  slots = MEAL_SLOTS;
  colors = VIEW_DAY_COLORS;
  patients = this.diet.patients;
  patient = this.patients[0];
  weekStart = startOfWeek(new Date());
  constructor(private diet: DietService) {}
  get days() { return Array.from({ length: 7 }, (_, i) => addDays(this.weekStart, i)); }
  get weekEnd() { return addDays(this.weekStart, 6); }
  entry(d: Date, s: MealSlot) { return this.diet.getEntry(this.patient.regNo, d, s.key); }
  shift(n: number) { this.weekStart = addDays(this.weekStart, n * 7); }
  isToday(d: Date) { return d.toDateString() === new Date().toDateString(); }
  print() { window.print(); }
}
