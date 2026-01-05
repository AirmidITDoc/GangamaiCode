import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { SubquestionMasterService } from '../subquestion-master.service';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-subquestion',
  templateUrl: './new-subquestion.component.html',
  styleUrls: ['./new-subquestion.component.scss'],
   encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewSubquestionComponent {

  SubQuestionForm: FormGroup;
  isActive: boolean = true;
autocompleteModesQuesiontatus: string = "QuestionMaster";
  constructor(
    public _SubquestionMasterService: SubquestionMasterService,
    public dialogRef: MatDialogRef<NewSubquestionComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.SubQuestionForm = this._SubquestionMasterService.createSubQuestionForm();
    this.SubQuestionForm.markAllAsTouched();
    if ((this.data?.subQuestionId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.SubQuestionForm.patchValue(this.data);
    }
  }

  onSubmit() {
    if (!this.SubQuestionForm.invalid) {
      console.log(this.SubQuestionForm.value)
      this._SubquestionMasterService.SubQuestionMasterSave(this.SubQuestionForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      let invalidFields = [];
      if (this.SubQuestionForm.invalid) {
        for (const controlName in this.SubQuestionForm.controls) {
          if (this.SubQuestionForm.controls[controlName].invalid) {
            invalidFields.push(`SubQuesion Form: ${controlName}`);
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
    this.SubQuestionForm.reset();
    this.dialogRef.close(val);
  }

  getValidationMessages() {
    return {
      subQuestionName: [
        { name: "required", Message: "subQuestionName is required" },
        { name: "maxlength", Message: "subQuestionName should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ],
       questionId:[ ],
    };
  }
}

