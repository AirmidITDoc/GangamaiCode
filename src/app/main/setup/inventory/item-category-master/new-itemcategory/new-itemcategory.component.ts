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
  isActive:boolean=true;
  Saveflag: boolean= false;

  autocompleteModeItem: string = "Item";

  constructor(
    public _CategorymasterService: ItemCategoryMasterService,
    public dialogRef: MatDialogRef<NewItemcategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
    this.categoryForm = this._CategorymasterService.createItemCategoryForm();
    if(this.data){
        this.isActive=this.data.isActive
        this.categoryForm.patchValue(this.data);
    }
  }

    
    onSubmit() {
        if(!this.categoryForm.invalid)
        {
            this.Saveflag=true

            console.log("ItemCategoryMaster Insert:",this.categoryForm.value)
        
            this._CategorymasterService.categoryMasterSave(this.categoryForm.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);}, 
            (error) => {
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
    
    itemId=0;

    selectChangeItem(obj: any){
        console.log(obj);
        this.itemId=obj
    }

    onClear(val: boolean) {
        this.categoryForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            itemCategoryName: [
                { name: "required", Message: "Category Name is required" },
                { name: "maxlength", Message: "Category name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            itemTypeId: [
                { name: "required", Message: "ItemType is required" }
            ],
        };
    }
}
