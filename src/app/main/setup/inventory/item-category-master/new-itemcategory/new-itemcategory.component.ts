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

  autocompleteModeItem: string = "Item";

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
      };
      this.categoryForm.patchValue(m_data);
  }

  Saveflag: boolean= false;
  onSubmit() {
    this.Saveflag=true
        if (this.categoryForm.invalid) {
            this.toastr.warning('please check form is invalid', 'Warning !', {
              toastClass:'tostr-tost custom-toast-warning',
          })
          return;
        }else{
        var m_data =
        {
            "itemCategoryId": 0,
            "itemCategoryName": this.categoryForm.get("itemCategoryName").value,
            "itemTypeId": this.categoryForm.get("itemTypeId").value,  
        }

        console.log("ItemCategoryMaster Insert:",m_data)
        
        this._CategorymasterService.categoryMasterSave(m_data).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
        }, (error) => {
        this.toastr.error(error.message);
        });
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
}
