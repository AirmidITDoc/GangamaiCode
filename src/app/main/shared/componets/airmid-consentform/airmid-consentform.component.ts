import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { FormvalidationserviceService } from '../../services/formvalidationservice.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { AirmidDropDownComponent } from '../airmid-dropdown/airmid-dropdown.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-airmid-consentform',
  templateUrl: './airmid-consentform.component.html',
  styleUrls: ['./airmid-consentform.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AirmidConsentformComponent {
  myForm: FormGroup;

  autocompletedepartment: string = "Department";
  @ViewChild('ddlTemplate') ddlTemplate: AirmidDropDownComponent;

  vdepartmentId: any;
  vTemplateDesc: any;
  selectedTemplateOption: any;
  isButtonDisabled: boolean = false;
  templateId = "0"
  templateName = ''
  vRefType: any;

  constructor(
    public dialogRef: MatDialogRef<AirmidConsentformComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _service: ApiCaller,
    private _formBuilder: UntypedFormBuilder,
    public datePipe: DatePipe,
    private _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.myForm = this.createConsentForm();
    this.myForm.markAllAsTouched();

    console.log(this.data)
    if ((this.data?.consentId ?? 0) > 0) {
      this.vTemplateDesc = this.data.ConsentDescription
      this.myForm.patchValue(this.data);
      console.log(this.myForm.value)
      this.isButtonDisabled = true
    }
  }

  createConsentForm(): FormGroup {
    return this._formBuilder.group({
      consentId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      consentDate: [(new Date()).toISOString()],
      consentTime: [(new Date()).toISOString()],
      refId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      opipid: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator()]],
      opiptype: [0],
      ConsentTempId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentName: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      ConsentDepartment: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      ConsentDescription: ["", [Validators.required]],
    });
  }

  onTemplateSelect(option: any) {
    this.isButtonDisabled = false
    this.templateId = option.consentId
    this.templateName = option.consentName
    this.vRefType = option.consentType
    this.selectedTemplateOption = option.consentDesc;
  }

  onEditorValueChange(content: string) {
    this.myForm.get('ConsentDescription')?.setValue(content);
  }

  selectChangedepartment(obj: any) {
    if (obj.value) {
      this.vdepartmentId = obj.value
      this._service.GetData("NursingConsent/GetMConsentMasterList?DeptId=" + obj.value).subscribe((data: any[]) => {
        const mapped = data.map(item => ({
          ...item,
          value: item.consentId,
          text: item.consentName
        }))
        this.ddlTemplate.options = mapped;
        this.ddlTemplate.bindGridAutoComplete();
      });
    } else {
      this._service.GetData("NursingConsent/GetMConsentMasterList?DeptId=" + obj.consentDeptId).subscribe((data: any[]) => {
        const mapped = data.map(item => ({
          ...item,
          value: item.consentId,
          text: item.consentName
        }))
        this.ddlTemplate.options = mapped;

        const incomingTempId = obj.consentTempId;
        setTimeout(() => {
          debugger

          this.ddlTemplate.bindGridAutoComplete();
          if (incomingTempId) {
            const matchedTemp = mapped.find(temp => temp.value === incomingTempId);
            if (matchedTemp) {
              this.ddlTemplate.SetSelection(matchedTemp.value);
            }
          }
        }, 100);
      });
    }
  }

  addTemplateDescription() {
    const deptId = this.myForm.get('ConsentDepartment')?.value;
    if (deptId === null || deptId === 0 || deptId === '' || deptId === "0") {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const tempId = this.myForm.get('ConsentTempId')?.value;
    if (tempId === null || tempId === 0 || tempId === '' || tempId === "0") {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vTemplateDesc = this.selectedTemplateOption || '';
    this.myForm.get('ConsentDescription')?.setValue(this.vTemplateDesc);
    this.selectedTemplateOption = '';
    this.isButtonDisabled = true
  }

  onSubmit() {
    const now = new Date();

    const formattedDate = this.datePipe.transform(now, "yyyy-MM-dd");
    const formattedTime = this.datePipe.transform(now, "shortTime");

    this.myForm.get('consentDate')?.setValue(formattedDate);
    this.myForm.get('consentTime')?.setValue(`${formattedDate} ${formattedTime}`);

    this.myForm.get("opipid").setValue(this.data?.opipId)
    this.myForm.get("opiptype").setValue(Number(this.data?.opipType))
    this.myForm.get("refId").setValue(Number(this.data?.refId))
    this.myForm.get("refType").setValue(Number(this.vRefType))
    this.myForm.get("consentTempId").setValue(Number(this.templateId))
    this.myForm.get("ConsentName").setValue(this.templateName)

    if (!this.myForm.invalid) {

      console.log(this.myForm.value)
      this._service.PostData("", this.myForm.value).subscribe((response) => {
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`My Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }

  onClear(val: boolean) {
    this.myForm.reset();
    this.dialogRef.close(val);
  }

  onClose() {
    this.dialogRef.close();
  }
}
