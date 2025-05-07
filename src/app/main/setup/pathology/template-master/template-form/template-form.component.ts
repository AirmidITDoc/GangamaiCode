import { ChangeDetectionStrategy, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TemplateServieService } from '../template-servie.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-template-form',
    templateUrl: './template-form.component.html',
    styleUrls: ['./template-form.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TemplateFormComponent implements OnInit {

    templateForm: FormGroup;
    vTemplateName: any;
    TemplateId = 0;
    vTemplateDescInHtml='';
    vTemplateDesc='';
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
    
         
           onBlur(e: any) {
             this.vTemplateDesc = e.target.innerHTML;
             throw new Error('Method not implemented.');
           }
    constructor(
        public _TemplateServieService: TemplateServieService,
        public dialogRef: MatDialogRef<TemplateFormComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
          private _formBuilder: FormBuilder,
          private _formBuilder1: UntypedFormBuilder,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.templateForm = this.createTemplateForm();
        this.templateForm.markAllAsTouched();

        console.log(this.data)
        if (this.data) {
            this.vTemplateName = this.data.templateName;
            this.vTemplateDesc = this.data.templateDesc;
            this.TemplateId = this.data.templateId;
            this.vTemplateDescInHtml = this.data.templateDescInHtml;
            // this.templateForm.patchValue(this.data)
        }
    }

    createTemplateForm(): FormGroup {
        return this._formBuilder1.group({
            templateId: this.TemplateId,
            templateName: '',
            templateDesc: this.vTemplateDesc,
            templateDescInHtml: ''
            // IsDeleted: ['true']
        });
    }

add(){
    this.vTemplateDesc =""
}
    onSubmit() {
        debugger
        console.log(this.templateForm.value)
        var mdata = {
            "templateId": 0,
            "templateName": this.templateForm.get("templateName").value,
            "templateDesc": this.templateForm.get("templateDesc").value,
            "templateDescInHtml": this.templateForm.get("templateDesc").value
        }
        console.log('json mdata:', mdata);

        this._TemplateServieService.templateMasterSave(mdata).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear();
        }, (error) => {
            this.toastr.error(error.message);
        });

        this.onClose();
    }
    onClose() {
        this.templateForm.reset();
        this.dialogRef.close();
    }

    onClear() { }

}
