import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { NursingnoteService } from '../nursingnote.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup } from '@angular/forms';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
    selector: 'app-new-template',
    templateUrl: './new-template.component.html',
    styleUrls: ['./new-template.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {

    myform: FormGroup;
    myTemplateform: FormGroup;
    vTemplateDesc: any;
    vTemplateName: any;
    isActive: boolean = true;
    
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
        public _NursingnoteService: NursingnoteService,
        private accountService: AuthenticationService,
        public dialogRef: MatDialogRef<NewTemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.myform = this._NursingnoteService.createtemplateForm();
        this.myTemplateform = this._NursingnoteService.templateForm();
        if ((this.data?.templateId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.myTemplateform.patchValue(this.data);
        }
    }

    onSubmit() {
        debugger
        if (!this.myTemplateform.invalid) {

            this.myTemplateform.get('addedBy').setValue(this.accountService.currentUserValue.userId)
            this.myTemplateform.get('updatedBy').setValue(this.accountService.currentUserValue.userId)
            console.log("template json:", this.myTemplateform.value);

            this._NursingnoteService.templateMasterSave(this.myTemplateform.value).subscribe((response) => {
                this.toastr.success(response.message);
                this.onClear(true);
            }, (error) => {
                this.toastr.error(error.message);
            });
        }
        else {
            this.toastr.warning('please check from is invalid', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
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
        this.myform.reset();
        this.dialogRef.close();
    }

    onClear(val: boolean) {
        this.myTemplateform.reset();
        this.myform.reset();
        this.dialogRef.close(val);
    }
}
