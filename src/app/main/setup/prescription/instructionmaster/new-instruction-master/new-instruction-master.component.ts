import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { InstructionmasterService } from '../instructionmaster.service';

@Component({
  selector: 'app-new-instruction-master',
  templateUrl: './new-instruction-master.component.html',
  styleUrls: ['./new-instruction-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewInstructionMasterComponent implements OnInit {
  instructionForm: FormGroup;
  isActive: boolean = true;

  constructor(
    public _InstructionMasterService: InstructionmasterService,
    public dialogRef: MatDialogRef<NewInstructionMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService) { }

  ngOnInit(): void {
    this.instructionForm = this._InstructionMasterService.createInstructionForm();
    this.instructionForm.markAllAsTouched();
    if ((this.data?.instructionId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.instructionForm.patchValue(this.data);
    }
  }


  onSubmit() {

    if (!this.instructionForm.invalid) {
      console.log(this.instructionForm.value)
      this._InstructionMasterService.instructionMasterInsert(this.instructionForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.instructionForm.invalid) {
        for (const controlName in this.instructionForm.controls) {
          if (this.instructionForm.controls[controlName].invalid) {
            invalidFields.push(`instruction Form: ${controlName}`);
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
    this.instructionForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      instructionDescription: [
        { name: "required", Message: "Instruction Name is required" },
        { name: "maxlength", Message: "Instruction name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    }
  }

}
