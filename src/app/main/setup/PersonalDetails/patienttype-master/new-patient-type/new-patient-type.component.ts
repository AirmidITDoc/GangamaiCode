import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatienttypeMasterService } from '../patienttype-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-patient-type',
  templateUrl: './new-patient-type.component.html',
  styleUrls: ['./new-patient-type.component.scss'],
   encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewPatientTypeComponent implements OnInit {

  patienttypeForm: FormGroup;
  isActive:boolean=true;
  saveflag : boolean = false;

  constructor(
      public _PatienttypeMasterService: PatienttypeMasterService,
      public dialogRef: MatDialogRef<NewPatientTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.patienttypeForm = this._PatienttypeMasterService.createPatientTypeForm();
      if((this.data?.patientTypeId??0) > 0)
      {
        this.isActive=this.data.isActive
      this.patienttypeForm.patchValue(this.data);
    }
    }

  
  onSubmit() {
   
    
    if (this.patienttypeForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
        if (this.patienttypeForm.valid) {
            this.saveflag = true;
            console.log("json :- ",this.patienttypeForm.value);
            this._PatienttypeMasterService.patienttypeMasterSave(this.patienttypeForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
}

getValidationMessages() {
    return {
        patientType: [
            { name: "required", Message: "PatientType Name is required" },
            { name: "maxlength", Message: "PatientType name should not be greater than 50 char." },
            { name: "pattern", Message: "Special char not allowed." }
        ]
    };
}

  onClear(val: boolean) {
      this.patienttypeForm.reset();
      this.dialogRef.close(val);
  }
}
