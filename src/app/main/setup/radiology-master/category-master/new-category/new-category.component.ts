import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CategoryMasterService } from '../category-master.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-category',
  templateUrl: './new-category.component.html',
  styleUrls: ['./new-category.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewCategoryComponent implements OnInit {

  categoryForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
      public _CategorymasterService: CategoryMasterService,
      public dialogRef: MatDialogRef<NewCategoryComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.categoryForm = this._CategorymasterService.createCategoryForm();
      if(this.data){
        this.isActive=this.data.isActive
        this.categoryForm.patchValue(this.data);
        }
  }

  
  onSubmit() {
        
      if(!this.categoryForm.invalid) {
        this.saveflag = true;
        
          this._CategorymasterService.categoryMasterSave(this.categoryForm.value).subscribe((response) => {
              this.toastr.success(response.message);
              this.onClear(true);
          }, (error) => {
              this.toastr.error(error.message);
          });
      }
      else
      {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
          });
          return;
      }

  }

    onClear(val: boolean) {
      this.categoryForm.reset();
      this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            categoryName: [
                { name: "required", Message: "Category Name is required" },
                { name: "maxlength", Message: "Category name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
