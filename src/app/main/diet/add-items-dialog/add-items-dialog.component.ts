import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FOOD_CATALOG, FoodItem, MealEntry, MealSlot, Patient } from '../diet.models';

export interface AddItemsData { patient: Patient; slot: MealSlot; date: Date; entry?: MealEntry; }
export interface AddItemsResult { items: FoodItem[]; notes: string; applyAll: boolean; }

@Component({ selector: 'app-add-items-dialog', templateUrl: './add-items-dialog.component.html', styleUrls: ['./add-items-dialog.component.scss'] })
export class AddItemsDialogComponent {
  items: FoodItem[];
  notes: string;
  applyAll = false;
  name = ''; qty = ''; instruction = '';

  constructor(public ref: MatDialogRef<AddItemsDialogComponent, AddItemsResult>, @Inject(MAT_DIALOG_DATA) public data: AddItemsData) {
    this.items = (data.entry?.items ?? []).map(i => ({ ...i }));
    this.notes = data.entry?.notes ?? '';
  }

  get suggestions() {
    const q = this.name.trim().toLowerCase();
    return FOOD_CATALOG.filter(f => !q || f.toLowerCase().includes(q)).slice(0, 8);
  }
  add() {
    if (!this.name.trim()) return;
    this.items.push({ name: this.name.trim(), qty: this.qty.trim() || '1 serving', instruction: this.instruction.trim() });
    this.name = this.qty = this.instruction = '';
  }
  remove(i: number) { this.items.splice(i, 1); }
  save() { this.add(); this.ref.close({ items: this.items, notes: this.notes, applyAll: this.applyAll }); }
}
