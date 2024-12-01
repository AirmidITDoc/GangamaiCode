import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TemplateServieService } from '../template-servie.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
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
        if (this.templateForm.valid) {
          debugger
            this._TemplateServieService.templateMasterSave(this.templateForm.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear();
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
    }
    onClose(){}
    onClear(){}
    // onClear(val: boolean) {
    //     this.templateForm.reset();
    //     this.dialogRef.close(val);
    // }
  }
  