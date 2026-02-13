import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { SpecContainerMasterService } from '../spec-container-master.service';

@Component({
  selector: 'app-new-spec-container-master',
  templateUrl: './new-spec-container-master.component.html',
  styleUrls: ['./new-spec-container-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSpecContainerMasterComponent {
  specimenForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _specimenService: SpecContainerMasterService,
    public dialogRef: MatDialogRef<NewSpecContainerMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.specimenForm = this._specimenService.createSpecmasterForm();
    this.specimenForm.markAllAsTouched();
    if ((this.data?.specimenContainerId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.specimenForm.patchValue(this.data);
    }
  }

  onSubmit() {

    if (!this.specimenForm.invalid) {
      console.log(this.specimenForm.value)
      this._specimenService.specMasterSave(this.specimenForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.specimenForm.invalid) {
        for (const controlName in this.specimenForm.controls) {
          if (this.specimenForm.controls[controlName].invalid) {
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

  getValidationMessages() {
    return {
      containerType: [
        { name: "required", Message: "Container Type is required" },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    };
  }

  onClear(val: boolean) {
    this.specimenForm.reset();
    this.dialogRef.close(val);
  }
}
