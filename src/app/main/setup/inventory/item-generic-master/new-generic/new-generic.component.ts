import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ItemGenericMasterService } from '../item-generic-master.service';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-generic',
    templateUrl: './new-generic.component.html',
    styleUrls: ['./new-generic.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewGenericComponent implements OnInit {
  genericForm: FormGroup;
  isActive:boolean=true;
  Saveflag:boolean=false;

    constructor(
      public _ItemGenericMasterService: ItemGenericMasterService,
      public dialogRef: MatDialogRef<NewGenericComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
    ) { }


    ngOnInit(): void {
      this.genericForm = this._ItemGenericMasterService.createItemgenericForm();
      if((this.data?.genericId??0) > 0)
        {
        this.isActive=this.data.isActive
        this.genericForm.patchValue(this.data);
     }
    }

    onSubmit() {
      if(this.genericForm.valid) 
       {
        this.Saveflag = true;

        console.log(this.genericForm.value);
        
        this._ItemGenericMasterService.genericMasterSave(this.genericForm.value).subscribe((response) => {
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
        this.genericForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            itemGenericName: [
                { name: "required", Message: "ItemGeneric Name is required" },
                { name: "maxlength", Message: "ItemGeneric name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}

