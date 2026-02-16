import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ItemDrugMasterService } from '../item-drug-master.service';

@Component({
  selector: 'app-newitem-drug-master',
  templateUrl: './newitem-drug-master.component.html',
  styleUrls: ['./newitem-drug-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewitemDrugMasterComponent {
  drugTypeForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _ItemDrugTypeMasterService: ItemDrugMasterService,
    public dialogRef: MatDialogRef<NewitemDrugMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.drugTypeForm = this._ItemDrugTypeMasterService.createItemclassForm();
    this.drugTypeForm.markAllAsTouched();
    if ((this.data?.itemDrugTypeId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.drugTypeForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.drugTypeForm.invalid) {
      console.log(this.drugTypeForm.value)
      this._ItemDrugTypeMasterService.ItemDrugTypeMasterSave(this.drugTypeForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.drugTypeForm.invalid) {
        for (const controlName in this.drugTypeForm.controls) {
          if (this.drugTypeForm.controls[controlName].invalid) {
            invalidFields.push(`class Form: ${controlName}`);
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
    this.drugTypeForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      drugTypeName: [
        { name: "required", Message: "drugTypeName is required" },
        { name: "maxlength", Message: "drugTypeName should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }
}
