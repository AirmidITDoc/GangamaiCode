import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { UnitmasterService } from '../unitmaster.service';

@Component({
  selector: 'app-new-unit',
  templateUrl: './new-unit.component.html',
  styleUrls: ['./new-unit.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewUnitComponent implements OnInit {
  
    unitForm: FormGroup;
    isActive:boolean=true;

    constructor(
        public _UnitmasterService: UnitmasterService,
        public dialogRef: MatDialogRef<NewUnitComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.unitForm = this._UnitmasterService.createUnitmasterForm();
        this.unitForm.markAllAsTouched();
        if((this.data?.unitId??0) > 0)
            {
            this.isActive=this.data.isActive
            this.unitForm.patchValue(this.data);
        }
    }

    
    onSubmit() {
        
    if (!this.unitForm.invalid){
    
        console.log("unit JSON :-",this.unitForm.value);

        this._UnitmasterService.unitMasterSave(this.unitForm.value).subscribe((response) => {
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
        this.unitForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            unitName: [
                { name: "required", Message: "Unit Name is required" },
                { name: "maxlength", Message: "Unit name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
