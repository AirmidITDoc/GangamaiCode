import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GenderMasterService } from '../gender-master.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: "app-new-gendermaster",
    templateUrl: "./new-gendermaster.component.html",
    styleUrls: ["./new-gendermaster.component.scss"],
})
export class NewGendermasterComponent implements OnInit {
    genderForm: FormGroup;
    constructor(
        public _GenderMasterService: GenderMasterService,
        public dialogRef: MatDialogRef<NewGendermasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.genderForm = this._GenderMasterService.createGenderForm();
        var m_data = {
            genderId: this.data?.genderId,
            genderName: this.data?.genderName.trim(),
            isDeleted: JSON.stringify(this.data?.isActive),
        };
        this.genderForm.patchValue(m_data);
    }
    onSubmit() {
        debugger
        // GENDER NAME NOT GET
        if (this.genderForm.valid) {
            this._GenderMasterService.genderMasterSave(this.genderForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            },
                (error) => {
                    this.toastr.error(error.message);
                }
            );
        }
    }

    onClear(val: boolean) {
        this.genderForm.reset();
        this.dialogRef.close(val);
    }
}
