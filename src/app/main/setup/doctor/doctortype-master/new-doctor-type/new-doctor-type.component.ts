import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DoctortypeMasterService } from '../doctortype-master.service';

@Component({
  selector: 'app-new-doctor-type',
  templateUrl: './new-doctor-type.component.html',
  styleUrls: ['./new-doctor-type.component.scss']
})
export class NewDoctorTypeComponent implements OnInit {

    doctortypeForm: FormGroup;
    isActive:boolean=true;

    constructor(
        public _DoctortypeMasterService: DoctortypeMasterService,
        public dialogRef: MatDialogRef<NewDoctorTypeComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
    
    ngOnInit(): void {
        this.doctortypeForm = this._DoctortypeMasterService.createDoctortypeForm();
        this.doctortypeForm.markAllAsTouched();
        if((this.data?.id??0) > 0)
        {
            this.isActive=this.data.isActive
            this.doctortypeForm.patchValue(this.data);
        }
    }

    onSubmit() {
        if (this.doctortypeForm.invalid) {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
        }else{
        if (this.doctortypeForm.valid) {

            console.log("Dr JSON :-",this.doctortypeForm.value);
            
            this._DoctortypeMasterService.doctortypeMasterSave(this.doctortypeForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        }    
    }

    onClear(val: boolean) {
        this.doctortypeForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            doctorType: [
                { name: "required", Message: "DoctorType Name is required" },
                { name: "maxlength", Message: "DoctorType name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
