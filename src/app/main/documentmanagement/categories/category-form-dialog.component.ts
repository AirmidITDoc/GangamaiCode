import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface CategoryFormResult {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-category-form-dialog',
  templateUrl: './category-form-dialog.component.html',
  styleUrls: ['./category-form-dialog.component.scss'],
})
export class CategoryFormDialogComponent {
  name = '';
  icon = 'folder';

  iconChoices = [
    'folder', 'folder_special', 'description', 'assignment_ind', 'account_balance',
    'request_quote', 'fact_check', 'edit_document', 'stethoscope', 'bed',
    'summarize', 'radiology', 'biotech', 'bloodtype', 'science', 'medication',
    'medical_services', 'checklist', 'content_cut', 'healing', 'masks',
    'health_and_safety', 'vaccines', 'analytics', 'ecg', 'gavel', 'balance',
    'monitor_heart', 'psychology', 'accessibility_new',
  ];

  constructor(
    public dialogRef: MatDialogRef<CategoryFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { parentName: string | null }
  ) {}

  submit(): void {
    if (!this.name.trim()) return;
    const result: CategoryFormResult = { name: this.name.trim(), icon: this.icon };
    this.dialogRef.close(result);
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
