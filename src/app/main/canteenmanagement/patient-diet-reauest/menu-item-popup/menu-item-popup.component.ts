import { Component, EventEmitter, Inject, Input, Output, ViewEncapsulation } from '@angular/core';
import { DietRequestService } from '../diet-request.service';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
interface FoodItem { name: string; quantity: string; unit: string; }
@Component({
  selector: 'app-menu-item-popup',
  templateUrl: './menu-item-popup.component.html',
  styleUrls: ['./menu-item-popup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MenuItemPopupComponent {
 items: FoodItem[];

  constructor(
    public dialogRef: MatDialogRef<MenuItemPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { menuName: string; detail: string }
  ) {
    this.items = (data?.detail ?? '')
      .split('|')
      .map(s => s.trim())
      .filter(Boolean)
      .map(s => {
        const [name = '', quantity = '', unit = ''] = s.split('~').map(p => p.trim());
        return { name, quantity, unit };
      })
      .filter(i => i.name);
  }
}