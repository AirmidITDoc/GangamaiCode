import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
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
  vTemplateDesc:any;
  vTemplateName:any;
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
      public _TemplatedescriptionService: TemplatedescriptionService,
      public dialogRef: MatDialogRef<NewTemplateComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 
  ngOnInit(): void {
      this.templateForm = this._TemplatedescriptionService.createRadiologytemplateForm();
      var m_data = {
          templateId: this.data?.templateId,
          templateName: this.data?.templateName.trim(),
          templateDesc: this.data?.templateDesc.trim(),
      };
      this.templateForm.patchValue(m_data);
  }
  onSubmit() {

    if(this.templateForm.invalid){
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass:'tostr-tost custom-toast-warning',
        })
        return;
    }else{
        if (!this.templateForm.get("templateId").value) {
            
            var mdata={
                  "templateId": 0,
                  "templateName": this.templateForm.get("templateName").value,
                  "templateDesc": this.templateForm.get("templateDesc").value        
            }
            console.log('json mdata:',mdata);

              this._TemplatedescriptionService.TemplateSave(mdata).subscribe((response) => {
                  this.toastr.success(response.message);
                  this.onClear();
              }, (error) => {
                  this.toastr.error(error.message);
              });
          }
    }
    this.onClose();
}
onClose(){
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
