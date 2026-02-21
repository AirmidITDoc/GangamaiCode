import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { ToastrService } from 'ngx-toastr';
import { MatTabChangeEvent } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { ConfigService } from 'app/core/services/config.service';
import { LabPatientList } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { ApiCaller } from 'app/core/services/apiCaller';

@Component({
  selector: 'app-edit-labreg',
  templateUrl: './edit-labreg.component.html',
  styleUrls: ['./edit-labreg.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditLabregComponent {
  myForm: FormGroup
  registerObj = new LabPatientList({});

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModeDepartment: string = "Department";
  autocompleteModerefdoc: string = "RefDoctor";
  autocompleteModeunit: string = "Hospital";
  autocompleteModeClass: string = "Class";
  autocompleteModetariff: string = "Tariff";
  autocompleteModecompany: string = "Company";
  autocompleteModesubcompany: string = "SubCompany";
  autocompleteModecamp: string = "CampMaster";
  autocompleteModedoctor: string = "ConDoctor";
  autocompleteModeConcession: string = "Concession";
  screenFromString = 'ExternalLab-form';

  VlabPatRegId: any;
  dateTimeObj: any;
  departmentname = '';
  companyId = 0;
  companyName = '';
  isCompanySelected: boolean = false;
  patienttype = 0
  doctorId = 0;
  doctorname = '';

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  constructor(public _labPatientRegService: LabPatientRegService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditLabregComponent>,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public _formbuilder: UntypedFormBuilder,
    private _FormvalidationserviceService: FormvalidationserviceService,
    private accountService: AuthenticationService,
    private hospitalconfigservice: HospitalConfigService,
    public toastr: ToastrService, public _ConfigService: ConfigService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private apiCaller: ApiCaller
  ) { }

  ngOnInit(): void {
    this.myForm = this.CreateMyForm();
    this.myForm.markAllAsTouched();

    // this.loadDropdownOptions();

    if (this.data?.labPatientId) {

      this._labPatientRegService.getLabRegistraionById(this.data?.labPatientId).subscribe((response) => {
        this.registerObj = response;

        if (response.companyId > 0) {
          this.isCompanySelected = true
        }
        this.selectChangedepartment(this.registerObj)

        this.VlabPatRegId = this.registerObj.labPatRegId
        this.myForm.get("companyId")?.setValue(this.registerObj?.companyId)
        this.myForm.get("subCompanyId")?.setValue(this.registerObj?.subCompanyId)

        console.log("retrive Data:", this.registerObj)
      });
    }
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  CreateMyForm() {
    return this._formbuilder.group({
      labPatientId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      regDate: [new Date()],
      regTime: [],
      unitId: this.accountService.currentUserValue.user.unitId,
      patientTypeId: [1],
      tariffId: [1],//this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId], // need to ask sir what value to pass
      classId: [1],// [this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId],
      departmentId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      refDocId: [0],
      companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      subCompanyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      campId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
    })
  }

  onChangePatient(value) {
    var mode = "Company"
    if (value.text != "Self") {
      this._labPatientRegService.getMaster(mode, 1);
      this.myForm.get('companyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
    } else if (value.text == "Self") {
      this.isCompanySelected = false;
      this.myForm.get('companyId').clearValidators();
      this.myForm.get('subCompanyId').clearValidators();
      this.myForm.get('companyId').updateValueAndValidity();
      this.myForm.get('subCompanyId').updateValueAndValidity();
      this.patienttype = 1;
    }
  }

  departmentId = 0
  selectChangedepartment(obj: any) {
    // console.log(obj)
    this.departmentId = obj.value
    this.departmentname = obj.text

    if (obj.value) {
      this._labPatientRegService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        // console.log(data)
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    }
    else {
      this._labPatientRegService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        // 
        this.ddlDoctor.options = data;
        const incomingDoctorId = obj.doctorId ?? obj.consultantDocId;
        console.log("Id:", incomingDoctorId)
        setTimeout(() => {
          this.ddlDoctor.bindGridAutoComplete();
          if (incomingDoctorId) {
            const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
            if (matchedDoctor) {
              this.ddlDoctor.SetSelection(matchedDoctor.value);
            }
          }
        }, 100);
      });
    }

    // this.myForm.get('departmentId').setValue(this.departmentId)
    // this.myForm.get('doctorId').setValue(parseInt(this.myForm.get('refDocId').value))
  }

  chkDoctor(event) {
    console.log(event)
    this.doctorname = event.text
  }

  onSave() {

  }

  onClose() {
    this.myForm.reset();
    this.dialogRef.close();
  }
}
