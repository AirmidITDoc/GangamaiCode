import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ExpensesService } from '../../expenses.service';

@Component({
    selector: 'app-new-head-master',
    templateUrl: './new-head-master.component.html',
    styleUrls: ['./new-head-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewHeadMasterComponent {
    HeadForm: FormGroup;
    isActive: boolean = true;
    headName: any;

    constructor(
        public _ExpensesService: ExpensesService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<NewHeadMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {

        this.HeadForm = this._ExpensesService.createHeadMasterForm();
        this.HeadForm.markAllAsTouched();

        if ((this.data?.expHedId ?? 0) > 0) {

            this.isActive = this.data.isActive
            this.data.headName = this.data.headName.trim()
            this.HeadForm.patchValue(this.data);
            console.log(this.data)
        }
    }

    onSubmit() {
        if (!this.HeadForm.invalid) {
            console.log(this.HeadForm.value)
            this._ExpensesService.headMasterSave(this.HeadForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            const invalidFields = [];
            if (this.HeadForm.invalid) {
                for (const controlName in this.HeadForm.controls) {
                    if (this.HeadForm.controls[controlName].invalid) {
                        invalidFields.push(`Form: ${controlName}`);
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
        this.HeadForm.reset();
        this._matDialog.closeAll()
    }

    onClose(val: boolean) {
        this.HeadForm.reset();
        this.dialogRef.close()
    }

}
