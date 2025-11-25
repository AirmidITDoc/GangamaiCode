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

  TemplateSaveForm: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  templateId = 0;
  categoryName: any;
  autocompleteModeTemplateCat: string = "TemplateDescCategory";

  constructor(
    public _TemplatedescriptionService: TemplatedescriptionService, private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {

    this.TemplateSaveForm = this.createSaveTemplateForm();
    this.TemplateSaveForm.markAllAsTouched();

    if (this.data?.templateId > 0) {
      console.log(this.data)
      this.templateId = this.data.templateId
      this.vTemplateName = this.data.templateName
      this.vTemplateDesc = this.data.templateDescription
      // this.TemplateSaveForm.get('CategoryId')?.setValue(this.data.categoryName);
      this.categoryName = this.data.categoryName
      this.TemplateSaveForm.get('isTemplateWithHeader')?.setValue(this.data.isTemplateWithHeader);
      this.TemplateSaveForm.get('isTemplateHeaderWithImage')?.setValue(this.data.isTemplateHeaderWithImage);
      this.TemplateSaveForm.get('templateDescription')?.setValue(this.data.templateDescription);
      this.TemplateSaveForm.patchValue(this.data);
    }

    if (this.data?.categoryName == "DischargeSummaryTemplate") {
      this.getCategoryData(this.data.categoryId)
    }

    this.TemplateSaveForm.get('isTemplateHeaderWithImage')?.valueChanges.subscribe((value: boolean) => {
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

  getCategoryData(categoryId) {
    var m_data2 = {
      "first": 0,
      "rows": 10,
      "sortField": "TemplateId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "CategoryId",
          "fieldValue": String(categoryId),// "40622",	
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._TemplatedescriptionService.getCategoryById(m_data2).subscribe((value) => {
      debugger
      console.log(value);
      this.TemplateSaveForm.get('hospitalHeader')?.setValue(value.data[0].hospitalHeader);
      this.TemplateSaveForm.get('templateHeader')?.setValue(value.data[0].templateHeader);
    });
  }

  onEditorValueChange(content: string) {
    this.TemplateSaveForm.get('hospitalHeader')?.setValue(content);
  }

  onEditorValueChange1(content: string) {
    this.TemplateSaveForm.get('templateHeader')?.setValue(content);
  }

  onEditorValueChange2(content: string) {
    this.TemplateSaveForm.get('templateDescription')?.setValue(content);
  }

  createSaveTemplateForm() {
    return this._formBuilder.group({
      templateId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      templateName: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
      hospitalHeader: ['', Validators.required],
      templateHeader: ['', Validators.required],
      templateDescription: ['', Validators.required],
      categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      categoryName: ['', [Validators.required]],
      isTemplateWithHeader: [false],
      isTemplateHeaderWithImage: [false],
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
    this.TemplateSaveForm.patchValue({ templateId: this.templateId, categoryName: this.categoryName });
    if (this.TemplateSaveForm.valid) {

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
    this.TemplateSaveForm.reset();
    this.dialogRef.close();
  }
  onClear() {
    this.TemplateSaveForm.reset();
    this.dialogRef.close();
  }
  selectChangeTemplate(obj: any) {
    if (obj.value) {
      this.categoryName = obj.text
    }

    if (obj.text == "DischargeSummaryTemplate") {
      this.getCategoryData(obj.value)
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
