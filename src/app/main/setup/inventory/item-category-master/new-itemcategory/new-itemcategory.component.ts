import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemCategoryMasterService } from '../item-category-master.service';

@Component({
  selector: 'app-new-itemcategory',
  templateUrl: './new-itemcategory.component.html',
  styleUrls: ['./new-itemcategory.component.scss']
})
export class NewItemcategoryComponent implements OnInit {

  categoryForm: FormGroup;
  constructor(
      public _CategorymasterService: ItemCategoryMasterService,
      public dialogRef: MatDialogRef<NewItemcategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.categoryForm = this._CategorymasterService.createItemCategoryForm();
      var m_data = {
        itemCategoryId: this.data?.itemCategoryId,
        itemCategoryName: this.data?.itemCategoryName.trim(),
        itemTypeId: this.data?.itemTypeId,
      //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
      //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
      // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.categoryForm.patchValue(m_data);
  }
  onSubmit() {
      if (this.categoryForm.valid) {
        debugger
          this._CategorymasterService.categoryMasterSave(this.categoryForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
  }

  onClear(val: boolean) {
      this.categoryForm.reset();
      this.dialogRef.close(val);
  }
}