import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { SpecalitymasterService } from '../specalitymaster.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-specality-master',
  templateUrl: './new-specality-master.component.html',
  styleUrls: ['./new-specality-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewSpecalityMasterComponent implements OnInit {
 
  myForm: FormGroup;
  isActive: boolean = true;
  constructor(
    public _specalitymasterService: SpecalitymasterService,
    public dialogRef: MatDialogRef<NewSpecalityMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myForm = this._specalitymasterService.createSpecalityForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    if ((this.data?.specialtyId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.myForm.patchValue(this.data);
    }
  }


  onSubmit() {
    if (!this.myForm.invalid) {
      console.log(this.myForm.value)
      this._specalitymasterService.specalitySave(this.myForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Specality Form: ${controlName}`);
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
      specialityName: [
        { name: "required", Message: "Speciality Name is required" },
        { name: "maxlength", Message: "Speciality Name should not be greater than 50 char." },
        { name: "pattern", Message: "Only char allowed." }
      ]
    };
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }
}
