import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ExpensesService } from '../../expenses.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCategoryComponent {
  CategoryForm: FormGroup;
  isActive: boolean = true;
  headName: any;

  constructor(
    public _ExpensesService: ExpensesService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {

    this.CategoryForm = this._ExpensesService.createCategoryMasterForm();
    this.CategoryForm.markAllAsTouched();
debugger
    if ((this.data?.expCatId ?? 0) > 0) { 
      this.isActive = this.data.isActive
      this.data.categoryName = this.data.categoryName.trim()
      this.CategoryForm.patchValue(this.data);
      console.log(this.data)
    }
  }

  onSubmit() {
    if (!this.CategoryForm.invalid) {
      console.log(this.CategoryForm.value)
      this._ExpensesService.CategoryMasterSave(this.CategoryForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.CategoryForm.invalid) {
        for (const controlName in this.CategoryForm.controls) {
          if (this.CategoryForm.controls[controlName].invalid) {
            invalidFields.push(`Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }
    }
  }

  onClear(val: boolean) {
    this.CategoryForm.reset();
    this._matDialog.closeAll()
  }

   onClose(val: boolean) {
    this.CategoryForm.reset();
    this.dialogRef.close()
  }

}

