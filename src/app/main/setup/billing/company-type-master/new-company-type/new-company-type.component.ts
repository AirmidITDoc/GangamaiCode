import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { CompanyTypeMasterService } from '../company-type-master.service';

@Component({
    selector: 'app-new-company-type',
    templateUrl: './new-company-type.component.html',
    styleUrls: ['./new-company-type.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewCompanyTypeComponent implements OnInit {

  companttypeForm: FormGroup;
  isActive:boolean=true;

  constructor(
      public _CompanyTypeMasterService: CompanyTypeMasterService,
      public dialogRef: MatDialogRef<NewCompanyTypeComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.companttypeForm = this._CompanyTypeMasterService.createcompanytypeForm();
      this.companttypeForm.markAllAsTouched();
      if((this.data?.companyTypeId??0) > 0){
        this.isActive=this.data.isActive
        this.companttypeForm.patchValue(this.data);
    }
  }

    onSubmit() {
        
       if (!this.companttypeForm.invalid) {
            console.log(this.companttypeForm.value)
            this._CompanyTypeMasterService.companytypeMasterSave(this.companttypeForm.value).subscribe((response) => {
                this.onClear(true);
            });
        } {
            let invalidFields = [];
            if (this.companttypeForm.invalid) {
                for (const controlName in this.companttypeForm.controls) {
                    if (this.companttypeForm.controls[controlName].invalid) {
                        invalidFields.push(`companttype Form: ${controlName}`);
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
        this.companttypeForm.reset();
        this.dialogRef.close(val);
    }

    getValidationMessages() {
        return {
            typeName: [
                { name: "required", Message: "Company type Name is required" },
                { name: "maxlength", Message: "Company type name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        };
    }


}
