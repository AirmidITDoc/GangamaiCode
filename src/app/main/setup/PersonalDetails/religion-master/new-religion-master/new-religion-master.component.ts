import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ReligionMasterService } from '../religion-master.service';

@Component({
    selector: 'app-new-religion-master',
    templateUrl: './new-religion-master.component.html',
    styleUrls: ['./new-religion-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewReligionMasterComponent implements OnInit {
  religionForm: FormGroup;
  isActive:boolean=true;

    constructor(   public _ReligionMasterService: ReligionMasterService,
        public dialogRef: MatDialogRef<NewReligionMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService)
    { }

    ngOnInit(): void {
        this.religionForm = this._ReligionMasterService.CreateReligionForm();
        this.religionForm.markAllAsTouched();
        console.log(this.data)
        if ((this.data?.religionId??0) > 0) 
        {   
            this.isActive=this.data.isActive
            this.religionForm.patchValue(this.data);
        }
    }
 
  onSubmit() {
    
     if (!this.religionForm.invalid) {
            console.log(this.religionForm.value)
            this._ReligionMasterService.religionMasterSave(this.religionForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.religionForm.invalid) {
                for (const controlName in this.religionForm.controls) {
                    if (this.religionForm.controls[controlName].invalid) {
                        invalidFields.push(`Religion Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }
    }
    getValidationMessages() {
        return {
            religionName: [
                { name: "required", Message: "Religion Name is required" },
                { name: "maxlength", Message: "Religion name should not be greater than 50 char." },
                { name: "pattern", Message: "Only Characters Allowed." }
            ]
        };
    }

    onClear(val: boolean) {
        this.religionForm.reset();
        this.dialogRef.close(val);
    }

}
