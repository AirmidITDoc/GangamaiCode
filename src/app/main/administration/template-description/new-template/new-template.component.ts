import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TemplatedescriptionService } from '../templatedescription.service';
import { ToastrService } from 'ngx-toastr';
import { RadiologyTemplateFormComponent } from 'app/main/setup/radiology-master/radiology-template-master/radiology-template-form/radiology-template-form.component';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {
  templateForm: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  templateId=0;
  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: '20rem',
    minHeight: '20rem',
    translate: 'yes',
    placeholder: 'Enter text here...',
    enableToolbar: true,
    showToolbar: true,

  };

  constructor(
    public _TemplatedescriptionService: TemplatedescriptionService, private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.templateForm = this.createRadiologytemplateForm();

    console.log(this.data)
    this.templateId=this.data.templateId
    this.vTemplateName = this.data.templateName
    this.vTemplateDesc = this.data.templateDescription
    this.templateForm.patchValue(this.data);
  }

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      templateId: [0],
      templateName: ['',
        [
          // Validators.required,
          // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
        ]
      ],
      templateDesc: this.vTemplateDesc,
      isActive: [1]
    });
  }


  onSubmit() {
    console.log(this.templateForm.value)
    debugger
    if (this.templateForm.invalid) {
      this.toastr.warning('please check from is invalid', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      })
      return;
    } else {
     var mdata = {
          "templateId": this.templateId,
          "templateName": this.templateForm.get("templateName").value,
          "templateDescription": this.templateForm.get("templateDesc").value,
          "isActive": true
        }
        console.log('json mdata:', mdata);
        
        this._TemplatedescriptionService.TemplateSave(mdata).subscribe((response) => {
          this.toastr.success(response.message);
          this.onClear();
        }, (error) => {
          this.toastr.error(error.message);
        });
      }
    
    this.onClose();
  }
  onClose() {
    this.templateForm.reset();
    this.dialogRef.close();
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  onClear() {
    this.templateForm.reset();
    this.dialogRef.close();
  }
}
