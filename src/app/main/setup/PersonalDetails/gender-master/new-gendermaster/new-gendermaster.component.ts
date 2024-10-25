import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GenderMasterService } from '../gender-master.service';

@Component({
    selector: "app-new-gendermaster",
    templateUrl: "./new-gendermaster.component.html",
    styleUrls: ["./new-gendermaster.component.scss"],
})
export class NewGendermasterComponent implements OnInit {
    constructor(
        public _GenderMasterService: GenderMasterService,
        public dialogRef: MatDialogRef<NewGendermasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) {}

    genderNameValidation = [
        { name: "required", Message: "Gender Name is required" },
        { name: "maxlength", Message: "Gender name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
    ];

    ngOnInit(): void {
        var m_data = {
            genderId: this.data?.genderId,
            genderName: this.data?.genderName.trim(),
            isDeleted: JSON.stringify(this.data?.isActive),
        };
        this._GenderMasterService.populateForm(m_data);
    }

    onSubmit() {
        // GENDER NAME NOT GET
        if (this._GenderMasterService.myform.valid) {
            var m_data = {
                genderName: this._GenderMasterService.myform.value.genderName,
                isDeleted: Boolean(
                    JSON.parse(this._GenderMasterService.myform.value.isDeleted)
                ),
            };
            this._GenderMasterService
                .genderMasterSave(
                    m_data,
                    this._GenderMasterService.myform.value.genderId || ""
                )
                .subscribe(
                    (response) => {
                        if (response.statusCode == 200) {
                            this.toastr.success(response.message);
                            this.onClear(true);
                        } else {
                            this.toastr.error(response.message);
                        }
                    },
                    (error) => {
                        this.toastr.error(error.message);
                    }
                );
        }
    }

    onClear(val: boolean) {
        this._GenderMasterService.myform.reset({ isDeleted: "false" });
        this._GenderMasterService.initializeFormGroup();
        this.dialogRef.close(val);
    }
}
