import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DosemasterService } from '../dosemaster.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: 'app-new-dose-master',
    templateUrl: './new-dose-master.component.html',
    styleUrls: ['./new-dose-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewDoseMasterComponent implements OnInit {

    doseForm:FormGroup;
    isActive:boolean=true;

    constructor(
        public _doseMasterService: DosemasterService,
        public dialogRef: MatDialogRef<NewDoseMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.doseForm=this._doseMasterService.createDoseForm();
        this.doseForm.markAllAsTouched();
        if((this.data?.doseId??0) > 0)
            {
            this.isActive=this.data.isActive
            this.doseForm.patchValue(this.data);
        }
    }


    
    onSubmit() {
    
    if(!this.doseForm.invalid){
   
      console.log("dose json:", this.doseForm.value);

      this._doseMasterService.doseMasterInsert(this.doseForm.value).subscribe((response)=>{
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error)=>{
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
        this.doseForm.reset();
        this.dialogRef.close(val);
    }

     getValidationMessages(){
        return{
            doseName: [
                { name: "required", Message: "Dose Name is required" },
                { name: "maxlength", Message: "Dose name should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            doseNameInEnglish: [
                { name: "required", Message: "DoseName In English is required" },
                { name: "maxlength", Message: "DoseName In English should not be greater than 50 char." },
                // { name: "pattern", Message: "Special char not allowed." }
            ],
            doseQtyPerDay: [
                { name: "required", Message: "Dose Qty Per Day is required" },
                { name: "pattern", Message: "Special char not allowed, only Digits." }
            ],
            // doseNameInMarathi: [
            //     { name: "required", Message: "DoseName In Marathi is required" },
            //     { name: "maxlength", Message: "DoseName In Marathi should not be greater than 50 char." },
            //     { name: "pattern", Message: "Special char not allowed." }
            // ]
        }
    }

}
