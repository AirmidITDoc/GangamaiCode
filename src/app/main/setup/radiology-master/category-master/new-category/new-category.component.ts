import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryMasterService } from '../category-master.service';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  constructor(
      public _CategorymasterService: CategoryMasterService,
      public dialogRef: MatDialogRef<NewCategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.categoryForm = this._CategorymasterService.createCategoryForm();
      var m_data = {
        categoryId: this.data?.categoryId,
        categoryName: this.data?.categoryName.trim(),
      //   printSeqNo: this.data?.printSeqNo,
      //   isconsolidated: JSON.stringify(this.data?.isconsolidated),
      //   isConsolidatedDR: JSON.stringify(this.data?.isConsolidatedDR),
      // isDeleted: JSON.stringify(this.data?.isActive),
      };
      this.categoryForm.patchValue(m_data);
  }
  onSubmit() {
    if (this.categoryForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
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
  }

  onClear(val: boolean) {
      this.categoryForm.reset();
      this.dialogRef.close(val);
  }
}
