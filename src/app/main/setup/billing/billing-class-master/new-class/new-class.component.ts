import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BillingClassMasterService } from '../billing-class-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-class',
    templateUrl: './new-class.component.html',
    styleUrls: ['./new-class.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewClassComponent implements OnInit {

    classForm: FormGroup;
    isActive:boolean=true;
    saveflag : boolean = false;

    constructor(
        public _BillingClassMasterService: BillingClassMasterService,
        public dialogRef: MatDialogRef<NewClassComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
 
    ngOnInit(): void {
        this.classForm = this._BillingClassMasterService.createClassForm();
        if(this.data){
            this.isActive=this.data.isActive
            this.classForm.patchValue(this.data);
        }
    }

    onSubmit() {
    debugger
        if(!this.classForm.invalid) 
        {
            this.saveflag = true;
        
            console.log("WardMaster Insert:",this.classForm.value);
            
            this._BillingClassMasterService.classMasterSave(this.classForm.value).subscribe((response) => {
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
      this.classForm.reset();
      this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            className: [
                { name: "required", Message: "Class Name is required" },
                { name: "maxlength", Message: "Class name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }

}
