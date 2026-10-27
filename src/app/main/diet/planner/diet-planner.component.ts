import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AddItemsDialogComponent, AddItemsResult } from '../add-items-dialog/add-items-dialog.component';
import { addDays, DietService, startOfWeek } from '../diet.service';
import { MEAL_SLOTS, MEAL_STATUSES, MealSlot, MealStatus, PLANNER_DAY_COLORS } from '../diet.models';

@Component({ selector: 'app-diet-planner', templateUrl: './diet-planner.component.html', styleUrls: ['./diet-planner.component.scss'] })
export class DietPlannerComponent {
  slots = MEAL_SLOTS;
  colors = PLANNER_DAY_COLORS;
  statuses = MEAL_STATUSES;
  patients = this.diet.patients;
  patient = this.patients[0];
  weekStart = startOfWeek(new Date());
  selected: { date: Date; slot: MealSlot } | null = null;

  constructor(private diet: DietService, private dialog: MatDialog, private snack: MatSnackBar) {}

  get days() { return Array.from({ length: 7 }, (_, i) => addDays(this.weekStart, i)); }
  get weekEnd() { return addDays(this.weekStart, 6); }
  get selEntry() { return this.selected ? this.entry(this.selected.date, this.selected.slot) : undefined; }

  entry(d: Date, s: MealSlot) { return this.diet.getEntry(this.patient.regNo, d, s.key); }
  isSelected(d: Date, s: MealSlot) { return !!this.selected && +this.selected.date === +d && this.selected.slot.key === s.key; }
  shift(n: number) { this.weekStart = addDays(this.weekStart, n * 7); this.selected = null; }
  goToday() { this.weekStart = startOfWeek(new Date()); this.selected = null; }
  select(date: Date, slot: MealSlot) { this.selected = { date, slot }; }
  onPatient() { this.selected = null; }

  edit(date: Date, slot: MealSlot) {
    debugger
    this.select(date, slot);
    this.dialog.open<AddItemsDialogComponent, any, AddItemsResult>(AddItemsDialogComponent, {
      width: '820px', maxWidth: '95vw', data: { patient: this.patient, slot, date, entry: this.entry(date, slot) },
    }).afterClosed().subscribe(res => {
      if (!res) return;
      (res.applyAll ? this.days : [date]).forEach(d => {
        const prev = this.entry(d, slot);
        this.diet.saveEntry(this.patient.regNo, d, slot.key,
          res.items.length ? { items: res.items.map(i => ({ ...i })), notes: res.notes, status: prev?.status ?? 'Pending' } : null);
      });
      this.snack.open(res.items.length ? `${slot.label} saved` : `${slot.label} cleared`, 'OK', { duration: 2500 });
    });
  }

  setStatus(status: MealStatus) {
    const e = this.selEntry; if (!e || !this.selected) return;
    this.diet.saveEntry(this.patient.regNo, this.selected.date, this.selected.slot.key, { ...e, status });
  }
  clear() { if (this.selected) this.diet.saveEntry(this.patient.regNo, this.selected.date, this.selected.slot.key, null); }
}
