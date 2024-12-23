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
  isActive:boolean=true;

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

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
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
