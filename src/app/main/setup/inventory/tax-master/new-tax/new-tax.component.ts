import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TaxMasterService } from '../tax-master.service';

@Component({
    selector: "app-new-tax",
    templateUrl: "./new-tax.component.html",
    styleUrls: ["./new-tax.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTaxComponent implements OnInit {

  taxForm: FormGroup;
  isActive:boolean=true;
  
  constructor(
      public _TaxMasterService: TaxMasterService,
      public dialogRef: MatDialogRef<NewTaxComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }

    ngOnInit(): void {
        this.taxForm = this._TaxMasterService.createTaxMasterForm();
        this.taxForm.markAllAsTouched();
        if((this.data?.id??0) > 0)
        {
            this.isActive = this.data.isActive;
            this.taxForm.patchValue(this.data);
        }
    }

    onSubmit() {
        ;
        if (!this.taxForm.invalid) {

            console.log("TaxMaster Insert:", this.taxForm.value);

            this._TaxMasterService.taxMasterSave(this.taxForm.value).subscribe(
                (response) => {
                    this.toastr.success(response.message);
                    this.onClear(true);
                },
                (error) => {
                    this.toastr.error(error.message);
                }
            );
        } else {
            this.toastr.warning("please check from is invalid", "Warning !", {
                toastClass: "tostr-tost custom-toast-warning",
            });
            return;
        }
    }

    onClear(val: boolean) {
        this.taxForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            taxNature: [
                { name: "required", Message: "TaxNature Name is required" },
                { name: "maxlength",Message: "TaxNature name should not be greater than 50 char."},
                { name: "pattern", Message: "Special char not allowed." },
            ],
        };
    }
}
