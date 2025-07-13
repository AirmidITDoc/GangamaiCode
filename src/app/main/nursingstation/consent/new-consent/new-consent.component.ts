import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from '../consent.service';

@Component({
  selector: 'app-new-consent',
  templateUrl: './new-consent.component.html',
  styleUrls: ['./new-consent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class NewConsentComponent {

  registerObj: any;
  vRegNo: any;
  vPatientName: any;
  vAdmissionDate: any;
  vMobileNo: any;
  vIPDNo: any;
  vTariffName: any;
  vCompanyName: any;
  vDoctorName: any;
  vRoomName: any;
  vBedName: any;
  vAge: any;
  vGenderName: any;
  vAdmissionTime: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartment: any;
  vRefDocName: any;
  vPatientType: any;
  vDOA: any;
  vRegId: any;
  OP_IPType: any = 0;
  vSelectedOption: any = 'OP';
  isButtonDisabled: boolean = false;
  selectedDepartment: string = '';
  selectedTemplate: string = '';
  selectedTemplateOption: any;
  vConsentText: any;
  vOPDNo: any;
  OP_IP_Id: any;

  ConsentinsertForm: FormGroup;

  autocompletedepartment: string = "Department";
  autocompleteModeTemplate: string = "ConsentMaster";

  @ViewChild('ddlTemplate') ddlTemplate: AirmidDropDownComponent;

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
    this.vConsentText = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }

  constructor(
    public _ConsentService: ConsentService,
    private _fuseSidebarService: FuseSidebarService,
    public _httpClient: HttpClient,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: UntypedFormBuilder,
    private _loggedService: AuthenticationService,
    public dialogRef: MatDialogRef<NewConsentComponent>,
    public datePipe: DatePipe,) { }

  ngOnInit(): void {
    this._ConsentService.myform.markAllAsTouched();
    this.ConsentinsertForm = this._ConsentService.CreateMyInsertform();
    this.ConsentinsertForm.markAllAsTouched();

    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if ((this.data?.consentId ?? 0) > 0) {
      this.vConsentText = this.data.consentText
      this.OP_IP_Id = this.data.opipid
      this.OP_IPType = this.data.opipType
      this.vdepartmentId = this.data.consentDeptId
      this.templateId = this.data.consentTempId
      this.ConsentinsertForm.patchValue(this.data);
      console.log(this.data)
      this.getSelectedObjOP(this.data)
      this.getSelectedObjIP(this.data)
    }
  }

  onChangePatientType(event) {
    if (event.value == 'OP') {
      this.OP_IPType = 0;
      this.vRegId = "";
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.vRegId = "";
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {
    console.log("Visite Patient:", obj)
    this.vRegNo = obj.regNo
    this.vDoctorName = obj.doctorName
    this.vDepartment = obj.departmentName
    this.vAdmissionDate = obj.admissionDate
    this.vAdmissionTime = obj.admissionTime
    this.vOPDNo = obj.opdNo
    this.vAge = obj.age
    this.vAgeMonth = obj.ageMonth
    this.vAgeDay = obj.ageDay
    this.vGenderName = obj.genderName
    this.vRefDocName = obj.refDocName
    this.vRoomName = obj.roomName
    this.vBedName = obj.bedName
    this.vPatientType = obj.patientType
    this.vTariffName = obj.tariffName
    this.vCompanyName = obj.companyName
    let nameField = obj.formattedText;
    let extractedName = nameField.split('|')[0].trim();
    this.vPatientName = extractedName;
    this.OP_IP_Id = obj.visitId
  }

  getSelectedObjIP(obj) {
    console.log("Admitted patient:", obj)
    this.vRegNo = obj.regNo
    this.vDoctorName = obj.doctorName
    this.vPatientName = obj.firstName + " " + obj.middleName + " " + obj.lastName
    this.vDepartment = obj.departmentName
    this.vAdmissionDate = obj.admissionDate
    this.vAdmissionTime = obj.admissionTime
    this.vIPDNo = obj.ipdNo
    this.vAge = obj.age
    this.vAgeMonth = obj.ageMonth
    this.vAgeDay = obj.ageDay
    this.vGenderName = obj.genderName
    this.vRefDocName = obj.refDocName
    this.vRoomName = obj.roomName
    this.vBedName = obj.bedName
    this.vPatientType = obj.patientType
    this.vTariffName = obj.tariffName
    this.vCompanyName = obj.companyName
    this.vDOA = obj.admissionDate
    this.OP_IP_Id = obj.admissionID
  }

  patientInfoReset() {
    this._ConsentService.myform.get('RegID').setValue('');
    this._ConsentService.myform.get('RegID').reset();
    this.vRegNo = '';
    this.vPatientName = '';
    this.vAdmissionDate = '';
    this.vAdmissionTime = '';
    this.vMobileNo = '';
    this.vIPDNo = '';
    this.vDoctorName = '';
    this.vTariffName = '';
    this.vCompanyName = '';
    this.vRoomName = '';
    this.vBedName = '';
    this.vGenderName = '';
    this.vAge = '';
    this.vDOA = '';
  }

  vdepartmentId = ""
  selectChangedepartment(obj: any) {
    console.log(obj)
    this.vdepartmentId = obj.value
    // template is dependent on department
    // this._ConsentService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
    //     this.ddlTemplate.options = data;
    //     this.ddlTemplate.bindGridAutoComplete();
    // });
  }

  templateId = "0"
  onTemplateSelect(option: any) {
    console.log("selectedTemplateOption:", option)
    this.templateId = option.value
    this.selectedTemplateOption = option.text; //details of template dd should pass
  }

  onSave() {

    if (this.ConsentinsertForm.get("consentId").value > 0) {
        this.ConsentinsertForm.get("modifiedBy").setValue(this._loggedService.currentUserValue.userId)
         this.ConsentinsertForm.removeControl('createdBy');

      } else {
        this.ConsentinsertForm.get("createdBy").setValue(this._loggedService.currentUserValue.userId)
         this.ConsentinsertForm.removeControl('modifiedBy');

      }
    if (!this.ConsentinsertForm.invalid) {
      // let data = this.ConsentinsertForm.value;
      // data.consentDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
      // data.consentTime = this.datePipe.transform(new Date(), 'shortTime');
      // data.opipid = this.OP_IP_Id
      // data.opiptype = this.OP_IPType
      // data.consentDeptId = Number(this.vdepartmentId)
      // data.consentTempId = Number(this.templateId)

      console.log(this.ConsentinsertForm.value)
      this.ConsentinsertForm.get("consentDate").setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'))
      this.ConsentinsertForm.get("consentTime").setValue(this.datePipe.transform(new Date(), 'shortTime'))
      this.ConsentinsertForm.get("opipid").setValue(this.OP_IP_Id)
      this.ConsentinsertForm.get("opiptype").setValue(Number(this.OP_IPType))
      this.ConsentinsertForm.get("consentTempId").setValue(Number(this.templateId))

      // const isUpdate = data.consentId && data.consentId > 0;
      

      // if (isUpdate) {
      //   data.modifiedBy = this._loggedService.currentUserValue.userId;
      // } else {
      //   data.createdBy = this._loggedService.currentUserValue.userId;
      // }
  console.log(this.ConsentinsertForm.value)
      this._ConsentService.ConsentSave(this.ConsentinsertForm.value).subscribe((response) => {
        this.onClose();
      });
    } else {
      let invalidFields = [];

      if (this.ConsentinsertForm.invalid) {
        for (const controlName in this.ConsentinsertForm.controls) {
          if (this.ConsentinsertForm.controls[controlName].invalid) {
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

  addTemplateDescription() {
    this.isButtonDisabled = false

    if (this.vRegNo == '' || this.vRegNo == null || this.vRegNo == undefined || this.vRegNo == 0) {
      this.toastr.warning('Please select patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const deptId = this.ConsentinsertForm.get('consentDeptId')?.value;
    if (deptId === null || deptId === 0 || deptId === '' || deptId === "0") {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    const tempId = this.ConsentinsertForm.get('consentTempId')?.value;
    if (tempId === null || tempId === 0 || tempId === '' || tempId === "0") {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.vConsentText = this.selectedTemplateOption || '';
    this.selectedTemplateOption = '';
  }

  onClose() {
    this._ConsentService.myform.reset({
      // start: this._ConsentService.myform.get('start')?.value,
      // end: this._ConsentService.myform.get('end')?.value,
      Language: '1',
      IsIPOrOP: '2'
    });
    this.ConsentinsertForm.reset({
      Language: '1',
      IsIPOrOP: '2'
    });
    this.dialogRef.close();
  }

  onClear() {
    this._ConsentService.myform.reset({ Language: '1' });
  }

  getValidationMessages() {
    return {
      consentDeptId: [
        { name: "required", Message: "Department is required" }
      ],
      consentTempId: [
        { name: "required", Message: "Template is required" }
      ]
    };
  }
}
