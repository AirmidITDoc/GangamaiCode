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
    saveflag: boolean = false;
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
        this.prefixForm = this._PrefixMasterService.createPrefixForm();
        if(this.data)
      this.isActive=this.data.isActive
        this.prefixForm.patchValue(this.data);
    }

 
    onSubmit() {
        // if(this.prefixForm.invalid){
        this.saveflag = true;
debugger
            this._PrefixMasterService.prefixMasterSave(this.prefixForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        // }
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
