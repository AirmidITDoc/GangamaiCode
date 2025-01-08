import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TemplateServieService } from '../template-servie.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-template-form',
    templateUrl: './template-form.component.html',
    styleUrls: ['./template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TemplateFormComponent implements OnInit {
    
    templateForm: FormGroup;

    vTemplateDesc:any;
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

    vTemplateName:any;
    TemplateId = 0;
    constructor(
        public _TemplateServieService: TemplateServieService,
        public dialogRef: MatDialogRef<TemplateFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }
   
    ngOnInit(): void {
        this.templateForm = this._TemplateServieService.createTemplateForm();
        var m_data = {
            templateId: this.data?.templateId,
            templateName: this.data?.templateName.trim(),
            templateDesc: this.data?.templateDesc.trim(),
            templateDescInHtml: this.data?.templateDescInHtml.trim(),
        };
        this.templateForm.patchValue(m_data);
    }
    onSubmit() {

            if (!this.templateForm.get("templateId").value) {
                
                var mdata={
                      "templateId": 0,
                      "templateName": this.templateForm.get("templateName").value,
                      "templateDesc": this.templateForm.get("templateDesc").value,
                      "templateDescInHtml": "string"              
                }
                console.log('json mdata:',mdata);

                  this._TemplateServieService.templateMasterSave(mdata).subscribe((response) => {
                      this.toastr.success(response.message);
                      this.onClear();
                  }, (error) => {
                      this.toastr.error(error.message);
                  });
              }
        
        this.onClose();
    }
    onClose(){
        this.templateForm.reset();
        this.dialogRef.close();
    }

    onClear(){}

    onBlur($event: any) {
    throw new Error('Method not implemented.');
    }
}
  