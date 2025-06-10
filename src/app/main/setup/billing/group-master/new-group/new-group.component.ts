import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { GroupMasterService } from '../group-master.service';

@Component({
    selector: 'app-new-group',
    templateUrl: './new-group.component.html',
    styleUrls: ['./new-group.component.scss']
})
export class NewGroupComponent implements OnInit {

    groupForm: FormGroup;
    isActive: boolean = true;
    isconsolidated: boolean = true;

    constructor(
        public _GroupMasterService: GroupMasterService,
        public dialogRef: MatDialogRef<NewGroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.groupForm = this._GroupMasterService.createGroupForm();
        this.groupForm.markAllAsTouched();
        if ((this.data?.groupId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.isconsolidated = this.data.isconsolidated
            this.groupForm.patchValue(this.data);
        }
    }

    onSubmit() {

        if (!this.groupForm.invalid) {
            console.log(this.groupForm.value)
            this._GroupMasterService.GroupMasterSave(this.groupForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.groupForm.invalid) {
                for (const controlName in this.groupForm.controls) {
                    if (this.groupForm.controls[controlName].invalid) {
                        invalidFields.push(`group Form: ${controlName}`);
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
    onClear(val: boolean) {
        this.groupForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            groupName: [
                { name: "required", Message: "Group Name is required" },
                { name: "maxlength", Message: "Group name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }
}
