import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SubGroupMasterService } from '../sub-group-master.service';

@Component({
    selector: 'app-new-subgroup',
    templateUrl: './new-subgroup.component.html',
    styleUrls: ['./new-subgroup.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewSubgroupComponent implements OnInit {

    autocompleteModegroupName: string = "GroupName";

    subgroupForm: FormGroup;
    isActive: boolean = true;

    constructor(
        public _SubGroupMasterService: SubGroupMasterService,
        public dialogRef: MatDialogRef<NewSubgroupComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.subgroupForm = this._SubGroupMasterService.createSubgroupForm();
        this.subgroupForm.markAllAsTouched();

        if ((this.data?.subGroupId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.subgroupForm.patchValue(this.data);
        }
    }


    onSubmit() {

        if (!this.subgroupForm.invalid) {
            console.log(this.subgroupForm.value)
            this._SubGroupMasterService.SubGroupMasterSave(this.subgroupForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.subgroupForm.invalid) {
                for (const controlName in this.subgroupForm.controls) {
                    if (this.subgroupForm.controls[controlName].invalid) {
                        invalidFields.push(`subgroup Form: ${controlName}`);
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
        this.subgroupForm.reset();
        this.dialogRef.close(val);
    }

    //new api

    groupId = 0;

    selectChangegroupName(obj: any) {
        this.groupId = obj.value;
    }

    getValidationMessages() {
        return {
            subGroupName: [
                { name: "required", Message: "SubGroup Name is required" },
                { name: "maxlength", Message: "SubGroup name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            groupId: [
                { name: "required", Message: "Group Name is required" }
            ]
        };
    }

}
