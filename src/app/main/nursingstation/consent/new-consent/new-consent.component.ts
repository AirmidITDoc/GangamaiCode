import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { UntypedFormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { IndentList } from 'app/main/inventory/patient-material-consumption/patient-material-consumption.component';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { ToastrService } from 'ngx-toastr';
import { ConsentService } from '../consent.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';

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
  OP_IPType: any;
  vSelectedOption: any = 'OP';
  isButtonDisabled: boolean = false;
  selectedDepartment: string = '';
  selectedTemplate: string = '';
  selectedTemplateOption: any;
  vConsentText: any;
  vOPDNo:any;

  autocompletedepartment: string = "Department";
  @ViewChild('ddlTemplate') ddlTemplate: AirmidDropDownComponent;

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

  onBlur(e: any) {
    // this.vConsentText = e.target.innerHTML;
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
      // this.paymethod = true;
      this._ConsentService.myform.get('MobileNo').clearValidators();
      this._ConsentService.myform.get('PatientName').clearValidators();
      this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
      this._ConsentService.myform.get('PatientName').updateValueAndValidity();
    }
    else if (event.value == 'IP') {
      this.OP_IPType = 1;
      this.vRegId = "";

      this._ConsentService.myform.get('MobileNo').clearValidators();
      this._ConsentService.myform.get('PatientName').clearValidators();
      this._ConsentService.myform.get('MobileNo').updateValueAndValidity();
      this._ConsentService.myform.get('PatientName').updateValueAndValidity();
    } else {
      this._ConsentService.myform.get('MobileNo').reset();
      this._ConsentService.myform.get('MobileNo').setValidators([Validators.required]);
      this._ConsentService.myform.get('MobileNo').enable();
      this._ConsentService.myform.get('PatientName').reset();
      this._ConsentService.myform.get('PatientName').setValidators([Validators.required]);
      this._ConsentService.myform.get('PatientName').enable();
      this._ConsentService.myform.updateValueAndValidity();

      this.OP_IPType = 2;
    }
    this.patientInfoReset();
  }

  getSelectedObjOP(obj) {
    debugger
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
      setTimeout(() => {
        this._ConsentService.getVisitById(obj.regId).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
        });

      }, 500);
    }
  }

  getSelectedObjIP(obj) {
    debugger
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
      setTimeout(() => {
        this._ConsentService.getAdmittedpatientlist(obj.regID).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)
        });

      }, 500);
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
  }

  selectChangedepartment(obj: any) {
    debugger
    console.log(obj)
    // template is dependent on department
    // this._ConsentService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
    //     this.ddlTemplate.options = data;
    //     this.ddlTemplate.bindGridAutoComplete();
    // });
  }

  onTemplateSelect(option: any) {
    debugger
    console.log("selectedTemplateOption:", option)
    this.selectedTemplateOption = option.ConsentDesc;

  }

  onSave() {

  }

  addTemplateDescription() {
    this.isButtonDisabled = false
    debugger
    if (this._ConsentService.myform.get('Department')?.value) {
      this.toastr.warning('Please select Department ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this._ConsentService.myform.get('Template')?.value) {
      this.toastr.warning('Please enter select Template ', 'Warning !', {
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
    this.dialogRef.close();
  }

  onClear() {
    this._ConsentService.myform.reset({ Language: '1' });
  }

  getValidationMessages() {
    return {
      Department: [],
      Template: []
    };
  }
}
