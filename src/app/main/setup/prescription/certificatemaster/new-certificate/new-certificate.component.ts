import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { ToastrService } from 'ngx-toastr';
import { CertificateserviceService } from '../certificateservice.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-new-certificate',
  templateUrl: './new-certificate.component.html',
  styleUrls: ['./new-certificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations
})
export class NewCertificateComponent implements OnInit {
    templateForm: FormGroup;
    vTemplateDesc:any;
    vTemplateName:any;
    isActive:boolean=true;
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
      public _CertificateserviceService: CertificateserviceService,
      public dialogRef: MatDialogRef<NewCertificateComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any,
      public toastr: ToastrService
  ) { }
 

    ngOnInit(): void {
        this.templateForm = this._CertificateserviceService.createRadiologytemplateForm();
        if((this.data?.templateId??0) > 0)
        {
            this.isActive = this.data.isActive
            this.templateForm.patchValue(this.data);
        }
    }

    onSubmit() {
            
        if(!this.templateForm.invalid)
        {
        
        console.log("template json:", this.templateForm.value);

        this._CertificateserviceService.templateMasterSave(this.templateForm.value).subscribe((response)=>{
            this.toastr.success(response.message);
            this.onClear(true);
        }, (error)=>{
            this.toastr.error(error.message);
        });
        } 
        else
        {
        this.toastr.warning('please check from is invalid', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }             
    }

    getValidationMessages(){
        return{
            templateName: [
                { name: "required", Message: "templateName Name is required" },
                { name: "maxlength", Message: "templateName name should not be greater than 50 char." },
                { name: "pattern", Message: "Special char not allowed." }
            ]
        }
    }

    onClose(){
        this.templateForm.reset();
        this.dialogRef.close();
    }
    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
    }

    onClear(val: boolean) {
        this.templateForm.reset();
        this.dialogRef.close(val);
    }
}
