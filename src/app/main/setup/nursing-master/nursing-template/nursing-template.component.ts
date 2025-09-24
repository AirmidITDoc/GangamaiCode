import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
// import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { NursingMasterService } from '../nursing-master.service';

@Component({
  selector: 'app-nursing-template',
  templateUrl: './nursing-template.component.html',
  styleUrls: ['./nursing-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NursingTemplateComponent {

  myform: FormGroup;
  myTemplateform: FormGroup;
  vTemplateDesc: any;
  isActive: boolean = true;

  constructor(
    public _NursingService: NursingMasterService,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NursingTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.myTemplateform = this._NursingService.templateForm();
    if ((this.data?.nursingId ?? 0) > 0) {
      this.isActive = this.data.isActive
      this.vTemplateDesc=this.data.templateDesc
      this.myTemplateform.get('templateDesc').setValue(this.vTemplateDesc)
      this.myTemplateform.get('nursTempName').setValue(this.data?.nursTempName)
    }
  }

  onEditorValueChange(content: string) {
    this.myTemplateform.get('templateDesc')?.setValue(content);
  }

  onSubmit() {
    if (!this.myTemplateform.invalid) {
      this.myTemplateform.get('nursingId').setValue(this.data?.nursingId ?? 0)
      this.myTemplateform.get('addedBy').setValue(this.accountService.currentUserValue.userId)
      this.myTemplateform.get('updatedBy').setValue(this.accountService.currentUserValue.userId)
      this._NursingService.templateMasterSave(this.myTemplateform.value).subscribe((response) => {
        this.onClear(true);
      });
    } else {
      let invalidFields = [];

      if (this.myTemplateform.invalid) {
        for (const controlName in this.myTemplateform.controls) {
          if (this.myTemplateform.controls[controlName].invalid) {
            invalidFields.push(`Template Form: ${controlName}`);
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
      nursTempName: [
        { name: "required", Message: "templateName Name is required" },
        { name: "maxlength", Message: "templateName name should not be greater than 50 char." },
        { name: "pattern", Message: "Special char not allowed." }
      ]
    }
  }

  onClose() {
    this.myTemplateform.reset();
    this.dialogRef.close();
  }

  onClear(val: boolean) {
    this.myTemplateform.reset();
    this.dialogRef.close(val);
  }
}
