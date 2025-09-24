import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { TemplatedescriptionService } from '../templatedescription.service';

@Component({
  selector: 'app-new-template',
  templateUrl: './new-template.component.html',
  styleUrls: ['./new-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewTemplateComponent implements OnInit {
  templateForm: FormGroup;
  vTemplateDesc: any;
  vTemplateName: any;
  templateId=0;

  constructor(
    public _TemplatedescriptionService: TemplatedescriptionService, private _formBuilder: UntypedFormBuilder,
    public dialogRef: MatDialogRef<NewTemplateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.templateForm = this.createRadiologytemplateForm();

    console.log(this.data)
    this.templateId=this.data.templateId
    this.vTemplateName = this.data.templateName
    this.vTemplateDesc = this.data.templateDescription
    this.templateForm.patchValue(this.data);
  }

  createRadiologytemplateForm(): FormGroup {
    return this._formBuilder.group({
      templateId: [0],
      templateName: ['',[
          Validators.required,
          // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$")
        ]
      ],
      templateDesc: this.vTemplateDesc,
      isActive: [true]
    });
  }


  onSubmit() {
    console.log(this.templateForm.value)
  
    if (this.templateForm.valid) {
     
     var mdata = {
          "templateId": this.templateId,
          "templateName": this.templateForm.get("templateName").value,
          "templateDescription": this.templateForm.get("templateDesc").value,
          "isActive": true
        }
        console.log('json mdata:', mdata);
        
        this._TemplatedescriptionService.TemplateSave(mdata).subscribe((response) => {
          this.onClose();
        });
      }  else {
        let invalidFields = [];
        if (this.templateForm.invalid) {
            for (const controlName in this.templateForm.controls) {
                if (this.templateForm.controls[controlName].invalid) { invalidFields.push(`Template Form: ${controlName}`); }
            }
        }
       
        if (invalidFields.length > 0) {
            invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
        }

      }
  }
  onClose() {
    this.templateForm.reset();
    this.dialogRef.close();
  }
  onBlur(e: any) {
    this.vTemplateDesc = e.target.innerHTML;
  }
  onClear() {
    this.templateForm.reset();
    this.dialogRef.close();
  }
}
