import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CategorymasterService } from '../categorymaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss']
})
export class NewCategoryComponent implements OnInit {
  categoryForm: FormGroup;
  constructor(
      public _CategorymasterService: CategorymasterService,
      public dialogRef: MatDialogRef<NewCategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.categoryForm = this._CategorymasterService.createCategorymasterForm();
      var m_data = {
        categoryId: this.data?.categoryId,
        categoryName: this.data?.categoryName.trim(),
      };
      this.categoryForm.patchValue(m_data);
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
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
