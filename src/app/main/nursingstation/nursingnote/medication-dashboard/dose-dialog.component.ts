import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-dose-dialog',
  template: `
    <h2 mat-dialog-title>Update Dose</h2>

    <!-- <mat-dialog-content>
      <p>{{data.medicine.name}} - {{data.time}}</p>

      <textarea placeholder="Enter remark" [(ngModel)]="remark"></textarea>

      <div class="actions">
        <button mat-button color="primary">Done</button>
        <button mat-button color="accent">Remind 2h</button>
        <button mat-button color="warn">Missed</button>
        <button mat-button>Hold</button>
        <button mat-button>Postpone</button>
      </div>
    </mat-dialog-content> -->
  `,
})
export class DoseDialogComponent {
  remark = '';

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}
}