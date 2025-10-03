import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TemplatedescriptionService } from '../templatedescription.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {
  templateForm: FormGroup;
  TemplateSaveForm: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  templateId=0;
    autocompleteModeDepartment: string = "Department";

  constructor(
    public _TemplatedescriptionService: TemplatedescriptionService, private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.templateForm = this.createRadiologytemplateForm(); 
    this.TemplateSaveForm = this.createSaveTemplateForm();
    if((this.data?.Obj ?? 0)>0){
    console.log(this.data)
    this.templateId=this.data.templateId
    this.vTemplateName = this.data.templateName
    this.vTemplateDesc = this.data.templateDescription
    this.templateForm.patchValue(this.data);
    } 
  }
  onEditorValueChange(content: string) {
    console.log("Got from editor:", content);
    //this.templateForm.get('doctorsNotes')?.setValue(content);
  }
  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      templateId: [0], 
      DepartmentId: [0], 
      CategoryId: [0],
      templateName: ['',[ Validators.required]],
      templateDesc: this.vTemplateDesc,
      isActive: [true],
      TemplateContent:[''],
      Templateheader:[''],
      TemplateFooter:[''],
      isTemplateWithHeader:[false],
      isTemplateHeaderWithImage:[false],
      isTemplateWithFooter:[false],
      isTemplateFooterWithImage:[false] 
    });
  }

  createSaveTemplateForm(){
    return this._formBuilder.group({ 
      templateId:[0,[this._FormvalidationserviceService.onlyNumberValidator()]],
      templateName:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      templateDescription:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      departmentId:[0,[this._FormvalidationserviceService.onlyNumberValidator(),this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      categoryName:['',[this._FormvalidationserviceService.allowEmptyStringValidator()]],
      templateHeader:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      templateFooter:['',[this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      isTemplateWithHeader:[false],
      isTemplateHeaderWithImage:[false],
      isTemplateWithFooter:[false],
      isTemplateFooterWithImage:[false] 
    })
  }  
  onSubmit() {
    console.log(this.templateForm.value)
   const formValue = this.templateForm.getRawValue();
    this.TemplateSaveForm.patchValue({
      templateId: formValue?.templateId,
      templateName: formValue?.templateName,
      templateDescription: formValue?.TemplateContent,
      departmentId: formValue?.DepartmentId,
      categoryName: formValue?.CategoryId,
      templateHeader: formValue?.Templateheader,
      templateFooter: formValue?.TemplateFooter,
      isTemplateWithHeader: formValue?.isTemplateWithHeader,
      isTemplateHeaderWithImage: formValue?.isTemplateHeaderWithImage,
      isTemplateWithFooter: formValue?.isTemplateWithFooter,
      isTemplateFooterWithImage: formValue?.isTemplateFooterWithImage,
    })
  
    if (this.TemplateSaveForm.valid) { 
    
        this.TemplateSaveForm.patchValue({templateId:this.templateId});
      console.log('json mdata:', this.TemplateSaveForm.value); 
        this._TemplatedescriptionService.TemplateSave( this.TemplateSaveForm.value).subscribe((response) => {
          this.onClose();
        });
      }  else {
        let invalidFields = [];
        if (this.TemplateSaveForm.invalid) {
            for (const controlName in this.TemplateSaveForm.controls) {
                if (this.TemplateSaveForm.controls[controlName].invalid) { invalidFields.push(`Template Form: ${controlName}`); }
            }
        } 
        if (invalidFields.length > 0) {
            invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
        } 
      }
  }
  onClose() {
    this.templateId = 0;
    this.templateForm.reset();
    this.dialogRef.close();
  } 
  onClear() {
    this.templateForm.reset();
    this.dialogRef.close();
  }
   selectChangedepartment(obj: any) { 
    if (obj.value) {
      console.log(obj) 
    }   
  }
  getTemplatedetails(){
    
  }
    getValidationMessages() {
    return { 
      DepartmentId: [
        { name: "pattern", Message: "only char allowed." }
      ],
      templateName: [ 
        { name: "pattern", Message: "only char allowed." }
      ], 
      CategoryId: [
        { name: "required", Message: "Country Name is required" }
      ]
    };
  }
}
