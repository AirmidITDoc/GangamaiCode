import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { PatienttypeMasterService } from '../patienttype-master.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-patient-type',
  templateUrl: './new-patient-type.component.html',
  styleUrls: ['./new-patient-type.component.scss']
})
export class NewPatientTypeComponent implements OnInit {

  patienttypeForm: FormGroup;
  isActive:boolean=true
  constructor(
      public _PatienttypeMasterService: PatienttypeMasterService,
      public dialogRef: MatDialogRef<NewPatientTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }


  ngOnInit(): void {
      this.patienttypeForm = this._PatienttypeMasterService.createPatientTypeForm();
      if(this.data)
        this.isActive=this.data.isActive
      this.patienttypeForm.patchValue(this.data);
  }

  saveflag : boolean = false;
  onSubmit() {
    this.saveflag = true;
    
    if (this.patienttypeForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
          toastClass:'tostr-tost custom-toast-warning',
      })
      return;
    }else{
        if (this.patienttypeForm.valid) {
            this._PatienttypeMasterService.patienttypeMasterSave(this.patienttypeForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
}

  onClear(val: boolean) {
      this.patienttypeForm.reset();
      this.dialogRef.close(val);
  }
}
