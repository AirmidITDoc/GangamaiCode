import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../../mrd.service';

@Component({
  selector: 'app-new-mrd-template',
  templateUrl: './new-mrd-template.component.html',
  styleUrls: ['./new-mrd-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewMrdTemplateComponent {
  templateForm: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  vcertificateName: any;
  isActive: boolean = true;

  constructor(
    public _MrdService: MrdService,
    public dialogRef: MatDialogRef<NewMrdTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.templateForm = this._MrdService.createRadiologytemplateForm();
    this.templateForm.markAllAsTouched();
    if ((this.data?.templateId ?? 0) > 0) {
      // this.isActive = this.data.isActive
      this.vTemplateDesc = this.data.templateDesc
      this.templateForm.get('templateDesc').setValue(this.vTemplateDesc)
      this.templateForm.patchValue({
        templateId: this.data.templateId,
        templateName: this.data.templateName,
      });
    }
  }

  onEditorValueChange(content: string) {
    this.templateForm.get('templateDesc')?.setValue(content);
  }

  onSubmit() {
    if (!this.templateForm.invalid) {
      this.templateForm.get('templateName')?.setValue(this.templateForm.get('templateName')?.value ?? this.data.templateName);
      console.log(this.templateForm.value)
      this._MrdService.templateMasterSave(this.templateForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } {
      const invalidFields = [];
      if (this.templateForm.invalid) {
        for (const controlName in this.templateForm.controls) {
          if (this.templateForm.controls[controlName].invalid) {
            invalidFields.push(`template Form: ${controlName}`);
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
      templateName: [
        { name: "required", Message: "TemplateName is required" },
        { name: "maxlength", Message: "templateName name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    }
  }

  onClose() {
    this.templateForm.reset();
    this.dialogRef.close();
  }

  onClear(val: boolean) {
    this.templateForm.reset();
    this.dialogRef.close(val);
  }
}
