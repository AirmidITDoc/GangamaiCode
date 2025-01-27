import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ItemTypeMasterService } from '../item-type-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-itemtype',
  templateUrl: './new-itemtype.component.html',
  styleUrls: ['./new-itemtype.component.scss']
})
export class NewItemtypeComponent implements OnInit {

  itemtypeForm: FormGroup;
  isActive:boolean=true;

  constructor(
      public _ItemTypeMasterService: ItemTypeMasterService,
      public dialogRef: MatDialogRef<NewItemtypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }


  ngOnInit(): void {
      this.itemtypeForm = this._ItemTypeMasterService.createItemtypeForm();
      if((this.data?.itemTypeId??0) > 0)
        {
        this.isActive=this.data.isActive
        this.itemtypeForm.patchValue(this.data);
        }
    }

  
  onSubmit() 
  {
    if (!this.itemtypeForm.invalid) 
    {

        console.log("itemtype json :-",this.itemtypeForm.value);

        this._ItemTypeMasterService.itemtypeMasterSave(this.itemtypeForm.value).subscribe((response) => {
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

  onClear(val: boolean) 
  {
    this.itemtypeForm.reset();
    this.dialogRef.close(val);
  }

    getValidationMessages() {
        return {
            itemTypeName: [
                { name: "required", Message: "Item Type Name is required" },
                { name: "maxlength", Message: "Item Type name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
