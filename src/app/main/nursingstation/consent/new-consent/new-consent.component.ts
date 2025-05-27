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
  OP_IPType: any=0;
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
  autocompleteModeTemplate: string = "Template";

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
    this.ConsentinsertForm=this._ConsentService.CreateMyInsertform();
    this.ConsentinsertForm.markAllAsTouched();

    this.vSelectedOption = this.OP_IPType === 1 ? 'IP' : 'OP';
    if (this.data) {
      this.registerObj = this.data.row;
      console.log("RegisterObj:", this.registerObj)
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

    if ((obj.regId ?? 0) > 0) {
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
  }

  getSelectedObjIP(obj) {

    if ((obj.regID ?? 0) > 0) {
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

  templateId="0"
  onTemplateSelect(option: any) {
    console.log("selectedTemplateOption:", option)
    this.templateId=option.value
    this.selectedTemplateOption = option.text; //details of template dd should pass
  }

  onSave() {
    debugger
  const currentDate = new Date();
    const datePipe = new DatePipe('en-US');
    const formattedTime = datePipe.transform(currentDate, 'dd-MM-yyyy hh:mm:ss a');
    const formattedDate = datePipe.transform(currentDate, 'yyyy-MM-dd');
    if (!this.ConsentinsertForm.get('consentDeptId')?.value) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.ConsentinsertForm.get('consentTempId')?.value) {
      this.toastr.warning('Please select Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.vConsentText || this.vConsentText.trim() === '') {
      this.toastr.warning('Please enter template description', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    if (!this.ConsentinsertForm.invalid) {
      console.log(this.ConsentinsertForm.value);
      let data=this.ConsentinsertForm.value;
      data.consentDate=formattedDate;
      data.consentTime=formattedTime
      data.opipid=this.OP_IP_Id
      data.opiptype=this.OP_IPType
      this._ConsentService.ConsentSave(data).subscribe((response) => {
        console.log(response)
        this.toastr.success(response.message);
        // this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    } else {
      let invalidFields = [];

      if (this._ConsentService.myform.invalid) {
        for (const controlName in this.ConsentinsertForm.controls) {
          if (this.ConsentinsertForm.controls[controlName].invalid) {
            invalidFields.push(`phoneapp Form: ${controlName}`);
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

    if (this.vRegNo == '' || this.vRegNo== null || this.vRegNo == undefined || this.vRegNo == 0) {
      this.toastr.warning('Please select patient ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }    
    if (!this.ConsentinsertForm.get('consentDeptId')?.value) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.ConsentinsertForm.get('consentTempId')?.value) {
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
