import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { PrefixMasterService } from '../prefix-master.service';


@Component({
    selector: 'app-new-prefix',
    templateUrl: './new-prefix.component.html',
    styleUrls: ['./new-prefix.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewPrefixComponent implements OnInit {
    prefixForm: FormGroup;
    isActive: boolean = true;
    autocompleteModegender: string = "Gender";
    isSaving : boolean = false;

    constructor(
        public _PrefixMasterService: PrefixMasterService,
        public dialogRef: MatDialogRef<NewPrefixComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {

        this.prefixForm = this._PrefixMasterService.createPrefixForm();
        this.prefixForm.markAllAsTouched();
        if ((this.data?.prefixId??0) > 0){
            this.isActive=this.data.isActive
            this.prefixForm.patchValue(this.data);
        }
    }


    onSubmit() {
        if (!this.prefixForm.invalid) {
            this.isSaving  = true;
            this._PrefixMasterService.prefixMasterSave(this.prefixForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
                this.isSaving  = false;
            }, (error) => {
                this.toastr.error(error.message);
                this.isSaving  = false;
            });
        }
        else {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

    }


    getValidationMessages() {
        return {
            prefixName: [
                { name: "required", Message: "Prefix Name is required" },
                { name: "maxlength", Message: "Prefix name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ],
            sexId: [
                { name: "required", Message: "Gender is required" }
            ]
        };
    }

    onClear(val: boolean) {
        this.prefixForm.reset();
        this.dialogRef.close(val);
    }
}
