import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { NewSiteDescriptionMasterComponent } from '../../site-description/new-site-description-master/new-site-description-master.component';
import { ConsentMasterService } from '../consent-master.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
    selector: 'app-new-consent-master',
    templateUrl: './new-consent-master.component.html',
    styleUrls: ['./new-consent-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewConsentMasterComponent {
    myForm: FormGroup;
    isActive: boolean = true;
    vTemplateDesc: any;
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
        public _ConsentMasterService: ConsentMasterService,
        public dialogRef: MatDialogRef<NewSiteDescriptionMasterComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    autocompleteModeDepartment: string = "Department";

    talukaId = 0;

    ngOnInit(): void {
        this.myForm = this._ConsentMasterService.createConsentForm();
        this.myForm.markAllAsTouched();
   
        console.log(this.data)
        if ((this.data?.consentId ?? 0) > 0) {
            this.isActive = this.data.isActive
            this.vTemplateDesc=this.data.consentDesc
            this.myForm.patchValue(this.data);
            console.log(this.myForm.value)
        }
    }


    onSubmit() {
        if (!this.myForm.invalid) {
            console.log(this.myForm.value);
            this._ConsentMasterService.stateMasterSave(this.myForm.value).subscribe((response) => {
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
            consentName: [
                { name: "required", Message: "consent Name is required" }
            ],
            consentDesc: [
                { name: "required", Message: "consentDesc Name is required" }
            ],
            departmentId: [
                { name: "required", Message: "department Name is required" },
                { name: "maxlength", Message: "Taluka Name should not be greater than 50 char." },
                { name: "pattern", Message: "Only char allowed." }
            ]
        };
    }


    selectChangecountry(obj: any) {
        console.log(obj);
        this.talukaId = obj.value
    }

    onClear(val: boolean) {
        this.myForm.reset();
        this.dialogRef.close(val);
    }
}
