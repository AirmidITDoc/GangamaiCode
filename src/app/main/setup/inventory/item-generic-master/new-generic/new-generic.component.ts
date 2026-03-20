import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ItemGenericMasterService } from '../item-generic-master.service';

@Component({
  selector: 'app-new-generic',
  templateUrl: './new-generic.component.html',
  styleUrls: ['./new-generic.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewGenericComponent implements OnInit {
  genericForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _ItemGenericMasterService: ItemGenericMasterService,
    public dialogRef: MatDialogRef<NewGenericComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.genericForm = this._ItemGenericMasterService.createItemgenericForm();
    if ((this.data?.itemGenericNameId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.genericForm.get('itemGenericName').setValue(this.data.itemGenericName)
      this.genericForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (this.genericForm.valid) {

      console.log(this.genericForm.value);

      this._ItemGenericMasterService.genericMasterSave(this.genericForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } else {
      const invalidFields = [];
      if (this.genericForm.invalid) {
        for (const controlName in this.genericForm.controls) {
          if (this.genericForm.controls[controlName].invalid) {
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
    this.genericForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      itemGenericName: [
        { name: "required", Message: "ItemGeneric Name is required" },
        { name: "maxlength", Message: "ItemGeneric name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }
}

