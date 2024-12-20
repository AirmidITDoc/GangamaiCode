import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { PrefixMasterService } from '../prefix-master.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { gridModel } from 'app/core/models/gridRequest';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { isatty } from 'tty';


@Component({
    selector: 'app-new-prefix',
    templateUrl: './new-prefix.component.html',
    styleUrls: ['./new-prefix.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewPrefixComponent implements OnInit {
    prefixForm: FormGroup;
    isActive:boolean=false;
    autocompleteModegender: string = "Gender";
    constructor(
        public _PrefixMasterService: PrefixMasterService,
        public dialogRef: MatDialogRef<NewPrefixComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }


    ngOnInit(): void {
        this.prefixForm = this._PrefixMasterService.createPrefixForm();
        debugger
        if (this.data) {
            var m_data = {
                prefixId: this.data?.prefixId,
                prefixName: this.data?.prefixName,
                sexId: this.data?.sexId,
                isActive: JSON.stringify(this.data?.isActive),
            };
            this.isActive=this.data.isActive;
            this.prefixForm.patchValue(m_data);
        } else {
            var m_data1 = {
                prefixId: 0,
                prefixName: "",
                sexId: 0,
                isActive: 1,
            };
            this.prefixForm.patchValue(m_data1);
        }

    }

    saveflag: boolean = false;
    onSubmit() {
        this.saveflag = true;

        if (this.prefixForm.invalid) {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            })
            return;
        } else {
            var mdata =
            {
                "prefixId": this.prefixForm.value?.prefixId || 0,
                "prefixName": this.prefixForm.value?.prefixName,
                "sexId": parseInt(this.prefixForm.value?.sexId)
            }
            console.log("prefix json:", mdata);

            this._PrefixMasterService.prefixMasterSave(mdata).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
    genderId = 0;

    selectChangegender(obj: any) {
        console.log(obj)
        this.genderId = obj.value;
    }

    getValidationGenderMessages() {
        return {
            GenderId: [
                { name: "required", Message: "Gender is required" }
            ]
        };
    }

    onClear(val: boolean) {
        this.prefixForm.reset();
        this.dialogRef.close(val);
    }
}
