import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ItemCompanyMasterService } from '../item-company-master.service';

@Component({
  selector: 'app-new-item-company-master',
  templateUrl: './new-item-company-master.component.html',
  styleUrls: ['./new-item-company-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewItemCompanyMasterComponent {
  ItemCompanyForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _ItemCompanyMasterService: ItemCompanyMasterService,
    public dialogRef: MatDialogRef<NewItemCompanyMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.ItemCompanyForm = this._ItemCompanyMasterService.createItemCompanyForm();
    this.ItemCompanyForm.markAllAsTouched();
    if ((this.data?.companyId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.ItemCompanyForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.ItemCompanyForm.invalid) {
      console.log(this.ItemCompanyForm.value)
      this._ItemCompanyMasterService.itemCompanyMasterSave(this.ItemCompanyForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.ItemCompanyForm.invalid) {
        for (const controlName in this.ItemCompanyForm.controls) {
          if (this.ItemCompanyForm.controls[controlName].invalid) {
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
    this.ItemCompanyForm.reset();
    this.dialogRef.close(val);
  }
}
