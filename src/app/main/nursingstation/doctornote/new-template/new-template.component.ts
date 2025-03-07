import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { DoctornoteService } from '../doctornote.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {
    
    myform: FormGroup;
    vTemplateDesc:any;
    vTemplateName:any;
    isActive:boolean=true;
    editorConfig: AngularEditorConfig = {
        editable: true,
        spellcheck: true,
        height: '24rem',
        minHeight: '24rem',
        translate: 'yes',
        placeholder: 'Enter text here...',
        enableToolbar: true,
        showToolbar: true,
    };


    constructor(
        public _DoctornoteService: DoctornoteService,
        public dialogRef: MatDialogRef<NewTemplateComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService
    ) { }

    ngOnInit(): void {
        this.myform = this._DoctornoteService.createtemplateForm();
        if((this.data?.templateId??0) > 0)
        {
            this.isActive = this.data.isActive
            this.myform.patchValue(this.data);
        }
    }

    onChangePatientType(event) {
            // if (event.value == 'OP') {
            //     this.OP_IPType = 0;
            //     this.RegId = "";
            //     this.paymethod = true;
            //     this.myform.get('MobileNo').clearValidators();
            //     this.myform.get('PatientName').clearValidators();
            //     this.myform.get('MobileNo').updateValueAndValidity();
            //     this.myform.get('PatientName').updateValueAndValidity();
            // }
            // else if (event.value == 'IP') {
            //     this.OP_IPType = 1;
            //     this.RegId = "";
    
            //     this.myform.get('MobileNo').clearValidators();
            //     this.myform.get('PatientName').clearValidators();
            //     this.myform.get('MobileNo').updateValueAndValidity();
            //     this.myform.get('PatientName').updateValueAndValidity();
            // } else {
            //     this.myform.get('MobileNo').reset();
            //     this.myform.get('MobileNo').setValidators([Validators.required]);
            //     this.myform.get('MobileNo').enable();
            //     this.myform.get('PatientName').reset();
            //     this.myform.get('PatientName').setValidators([Validators.required]);
            //     this.myform.get('PatientName').enable();
            //     this.myform.updateValueAndValidity();
    
            //     this.OP_IPType = 2;
            // }
        }

    onSubmit() {
            
        if(!this.myform.invalid)
        {
        
        console.log("template json:", this.myform.value);

        this._DoctornoteService.templateMasterSave(this.myform.value).subscribe((response)=>{
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
        this.myform.reset();
        this.dialogRef.close();
    }
    onBlur(e: any) {
        this.vTemplateDesc = e.target.innerHTML;
    }

    onClear(val: boolean) {
        this.myform.reset();
        this.dialogRef.close(val);
    }
}
