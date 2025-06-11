import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { ItemClassMasterService } from '../item-class-master.service';

@Component({
  selector: 'app-new-item-class',
  templateUrl: './new-item-class.component.html',
  styleUrls: ['./new-item-class.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewItemClassComponent implements OnInit {

  classForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _ItemClassMasterService: ItemClassMasterService,
    public dialogRef: MatDialogRef<NewItemClassComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }


  ngOnInit(): void {
    this.classForm = this._ItemClassMasterService.createItemclassForm();
    this.classForm.markAllAsTouched();
    if ((this.data?.itemClassId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.classForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.classForm.invalid) {
      console.log(this.classForm.value)
      this._ItemClassMasterService.itemclassMasterSave(this.classForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.classForm.invalid) {
        for (const controlName in this.classForm.controls) {
          if (this.classForm.controls[controlName].invalid) {
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
    this.classForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      itemClassName: [
        { name: "required", Message: "itemClassName  is required" },
        { name: "maxlength", Message: "itemClassName  should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }

}
