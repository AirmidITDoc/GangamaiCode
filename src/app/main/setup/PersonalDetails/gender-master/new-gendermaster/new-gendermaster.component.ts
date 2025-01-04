import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GenderMasterService } from '../gender-master.service';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
    selector: "app-new-gendermaster",
    templateUrl: "./new-gendermaster.component.html",
    styleUrls: ["./new-gendermaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewGendermasterComponent implements OnInit {
    genderForm: FormGroup;
    isActive:boolean=true
    saveflag : boolean = false;
    constructor(
        public _GenderMasterService: GenderMasterService,
        public dialogRef: MatDialogRef<NewGendermasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.genderForm = this._GenderMasterService.createGenderForm();
        if(this.data)
      this.isActive=this.data.isActive
        this.genderForm.patchValue(this.data);
    }

    
    onSubmit() {
        debugger
        if (this.genderForm.valid) {
            this.saveflag = true;
            console.log("json :- ",this.genderForm.value);
            this._GenderMasterService.genderMasterSave(this.genderForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }



    getValidationMessages() {
        return {
            genderName: [
                { name: "required", Message: "Gender Name is required" },
                { name: "maxlength", Message: "Gender name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
    onClear(val: boolean) {
        this.genderForm.reset();
        this.dialogRef.close(val);
    }
}
