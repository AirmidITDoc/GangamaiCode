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
  templateId = 0;
  autocompleteModeTemplateCat: string = "TemplateDescCategory";

  constructor(
    public _TemplatedescriptionService: TemplatedescriptionService, private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.templateForm = this.createRadiologytemplateForm();
    this.templateForm.markAllAsTouched();
    this.TemplateSaveForm = this.createSaveTemplateForm();
    if (this.data?.templateId > 0) {
      console.log(this.data)
      this.templateId = this.data.templateId
      this.vTemplateName = this.data.templateName
      this.vTemplateDesc = this.data.templateDescription
      this.templateForm.get('DepartmentId')?.setValue(this.data.departmentId);
      this.templateForm.get('CategoryId')?.setValue(this.data.categoryName);
      this.templateForm.get('isTemplateWithHeader')?.setValue(this.data.isTemplateWithHeader);
      this.templateForm.get('isTemplateHeaderWithImage')?.setValue(this.data.isTemplateHeaderWithImage);
      this.templateForm.get('TemplateContent')?.setValue(this.data.templateDescription);
      this.templateForm.patchValue(this.data);
    }

    this.templateForm.get('isTemplateHeaderWithImage')?.valueChanges.subscribe((value: boolean) => {
      if (!value) {
        // Clear file selection when toggle is turned OFF
        this.selectedFileName = null;
        this.selectedImage = null;

        // Optionally clear the input element
        const fileInput = document.getElementById('fileInput') as HTMLInputElement;
        if (fileInput) {
          fileInput.value = '';
        }
      }
    });
  }
  onEditorValueChange(content: string) {
    this.templateForm.get('TemplateContent')?.setValue(content);
  }
  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      templateId: [0],
      DepartmentId: [0],
      CategoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      templateName: ['', [Validators.required]],
      templateDesc: this.vTemplateDesc,
      isActive: [true],
      TemplateContent: ['', [Validators.required]],
      Templateheader: [''],
      TemplateFooter: [''],
      isTemplateWithHeader: [false],
      isTemplateHeaderWithImage: [false],
      isTemplateWithFooter: [false],
      isTemplateFooterWithImage: [false]
    });
  }

  createSaveTemplateForm() {
    return this._formBuilder.group({
      templateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      templateName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      templateDescription: [''],
      departmentId: [0],
      categoryName: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      templateHeader: ['string'],
      templateFooter: ['string'],
      isTemplateWithHeader: [false],
      isTemplateHeaderWithImage: [false],
      isTemplateWithFooter: [false],
      isTemplateFooterWithImage: [false]
    })
  }

  selectedImage: string | ArrayBuffer | null = null;
  selectedFileName: string | null = null;

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    console.log(this.templateForm.value)
    const formValue = this.templateForm.getRawValue();
    this.TemplateSaveForm.patchValue({
      templateId: formValue?.templateId,
      templateName: formValue?.templateName,
      templateDescription: formValue?.TemplateContent,
      categoryName: formValue?.CategoryId,
      // templateHeader: this.selectedImage,
      // templateFooter: formValue?.TemplateFooter,
      isTemplateWithHeader: formValue?.isTemplateWithHeader,
      isTemplateHeaderWithImage: formValue?.isTemplateHeaderWithImage,
      // isTemplateWithFooter: formValue?.isTemplateWithFooter,
      // isTemplateFooterWithImage: formValue?.isTemplateFooterWithImage,
    })

    if (this.TemplateSaveForm.valid) {

      this.TemplateSaveForm.patchValue({ templateId: this.templateId });
      console.log('json mdata:', this.TemplateSaveForm.value);
      this._TemplatedescriptionService.TemplateSave(this.TemplateSaveForm.value).subscribe((response) => {
        this.onClose();
      });
    } else {
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
