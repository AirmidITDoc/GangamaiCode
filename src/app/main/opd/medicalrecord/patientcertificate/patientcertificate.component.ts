import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../../appointment-list/appointmentlist.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-patientcertificate',
  templateUrl: './patientcertificate.component.html',
  styleUrls: ['./patientcertificate.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PatientcertificateComponent {

  registerObj: any;
  vOPDNo: any;
  vPatientName: any;
  vDoctorName: any;
  vAgeYear: any;
  vAgeMonth: any;
  vAgeDay: any;
  vDepartmentName: any;
  vOP_MobileNo: any;
  vTariffName: any;
  vCompanyName: any;
  vWardName: any;
  vBedNo: any;
  vGenderName: any;
  RegId: any;
  vVisitedId: any;
  vAge: any;
  vRegNo: any;
  vRefDocName: any;
  mycertificateForm: FormGroup;
  vCertificateId: any;
  vcertificateText: any;
  isButtonDisabled: boolean = false;
  selectedTemplate: string = ''
  registerObjDet: any;

  dsCertficateTemp = new MatTableDataSource<certificateTemp>();
  displayedColumns: string[] = [
    'CertificateDate',
    'CertificateName',
    'CertificateText',
    'Action'
  ]
  autocompleteModeTemplate: string = 'Template' //'OPDEMR'

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
    this.vcertificateText = e.target.innerHTML;
    throw new Error('Method not implemented.');
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  constructor(
    public _AppointmentServiceService: AppointmentlistService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public dialogRef: MatDialogRef<PatientcertificateComponent>,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.mycertificateForm = this.CreatePatientCertiform();
    this.mycertificateForm.markAllAsTouched()

    if (this.data) {
      this.registerObj = this.data;
      this.vWardName = this.registerObj.RoomName;
      this.vBedNo = this.registerObj.BedName;
      this.vGenderName = this.registerObj.GenderName;
      this.vPatientName = this.registerObj.patientName;
      this.vAgeYear = this.registerObj.ageYear;
      this.vAgeMonth = this.registerObj.ageMonth
      this.vAgeDay = this.registerObj.ageDay
      this.RegId = this.registerObj.regId;
      this.vVisitedId = this.registerObj.visitId
      this.vAge = this.registerObj.Age;
      this.vRegNo = this.registerObj.regNoWithPrefix;
      this.vOPDNo = this.registerObj.opdNo;
      this.vCompanyName = this.registerObj.companyName;
      this.vTariffName = this.registerObj.tariffName;
      this.vOP_MobileNo = this.registerObj.mobileNo;
      this.vDoctorName = this.registerObj.doctorname;
      this.vDepartmentName = this.registerObj.departmentName;
      this.vRefDocName = this.registerObj.refDocName
      this.selectedTemplate = this.registerObj.ConsentTempId;
      this.getCertificateList();
    }

  }

  CreatePatientCertiform() {
    return this._formBuilder.group({
      certificateId: [0],
      certificateDate: [new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date().getDate())).toISOString()],
      certificateTime: [(new Date()).toISOString()],
      visitId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      CertificateTemplateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      certificateName: ['', [this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      certificateText: ['', [Validators.required, this._FormvalidationserviceService.allowEmptyStringValidator()]],
      Language: ['1'],
    })
  }

  onSave() {
    if (!this.mycertificateForm.invalid) {
      this.mycertificateForm.get('visitId').setValue(this.vVisitedId)
      this.mycertificateForm.get('certificateId').setValue(this.certiID ?? 0);
      const payload = this.mycertificateForm.getRawValue();
      delete payload.Language;
      console.log(payload)
      this._AppointmentServiceService.CertificateInsertUpdate(payload).subscribe((response) => {
        this.onSubList()
        this.mycertificateForm.reset();
        this.mycertificateForm.patchValue(this.CreatePatientCertiform().value);
      });
    }
    else {
      let invalidFields: string[] = [];
      if (this.mycertificateForm.invalid) {
        for (const controlName in this.mycertificateForm.controls) {
          if (this.mycertificateForm.controls[controlName].invalid) {
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

  onSubList() {
    this.getCertificateList();
    this.mycertificateForm.reset({ Language: '1' });
  }

  onClose() {
    this.mycertificateForm.reset({ Language: '1' });
    this.dialogRef.close();
  }

  addTemplateDescription() {
    this.isButtonDisabled = false;
    if (!this.mycertificateForm.get('CertificateTemplateId').value) {
      this.toastr.warning('Please select Certificate Template ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (this.registerObjDet) {
      this.vcertificateText = this.registerObjDet;
      this.registerObjDet = '';
    }
  }

  selectChangeTemplate(data) {
    this.registerObjDet = data.certificateDesc;
    this.mycertificateForm.get('certificateName').setValue(data.certificateName)
  }

  getCertificateList() {
    const D_data = {
      "first": 0,
      "rows": 10,
      "sortField": "VisitedID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "VisitedID",
          "fieldValue": String(this.vVisitedId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    this._AppointmentServiceService.getCertificateList(D_data).subscribe(Visit => {
      this.dsCertficateTemp.data = Visit.data as certificateTemp[];
      this.dsCertficateTemp.sort = this.sort;
      this.dsCertficateTemp.paginator = this.paginator;
      console.log('check:', this.dsCertficateTemp.data)
    })
  }
  
    selectedTabIndex = 0;
    certiID=0;
   OnEdit(row) {
    console.log('Row data received:', row);
    this.certiID=row.certificateId
    this.mycertificateForm.get('certificateName').setValue(row.certificateName)
    this.mycertificateForm.patchValue({
      CertificateTemplateId: row.certificateTemplateId,
      certificateText: row.certificateText
    });
    this.selectedTabIndex = 1;
  }

   getWhatsappshareSales(el, vmono) {

    
  }
}
export class certificateTemp {

  CertificateDate: Date;
  CreatedBy: any;
  CetificateName: any;
  CertificateText: any;

  constructor(certificateTemp) {

    this.CertificateDate = certificateTemp.CertificateDate || '';
    this.CreatedBy = certificateTemp.CreatedBy || '';
    this.CetificateName = certificateTemp.CetificateName || '';
    this.CertificateText = certificateTemp.CertificateText || '';
  }
}
