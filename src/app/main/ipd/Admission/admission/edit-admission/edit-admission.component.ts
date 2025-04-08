///
import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe, Time } from '@angular/common';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatStepper } from '@angular/material/stepper';
import { MatTableDataSource } from '@angular/material/table';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
import { Console } from 'console';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';


@Component({
  selector: 'app-edit-admission',
  templateUrl: './edit-admission.component.html',
  styleUrls: ['./edit-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditAdmissionComponent implements OnInit {
  personalFormGroup: FormGroup;
  admissionFormGroup: FormGroup;
  patienttype: any;

  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  showtable: boolean = false;
  Regdisplay: boolean = false;
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;

  reportPrintObj: AdmissionPersonlModel;
  printTemplate: any;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj2 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  bedObj = new Bed({});
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;


  currentDate = new Date();
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';


  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<EditAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    public toastr: ToastrService,
    private commonService: PrintserviceService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
  }

  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;

  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModeSubCompany: string = "SubCompany";

  ngOnInit(): void {
    this.admissionFormGroup = this._AdmissionService.createEditAdmissionForm();
    this.admissionFormGroup.markAllAsTouched();

    console.log(this.data)
    // this.registerObj1 = this.data



    if ((this.data?.regId ?? 0) > 0) {
      setTimeout(() => {
        this._AdmissionService.getRegistraionById(this.data.regId).subscribe((response) => {
          this.registerObj = response;

        });

        // this._AdmissionService.getAdmissionById(this.data.admissionId).subscribe((response) => {
        //   this.registerObj1 = response;
        //   console.log(response)
        //   if (this.registerObj1) {
        //     this.registerObj1.phoneNo = this.registerObj1.phoneNo.trim()
        //     this.registerObj1.mobileNo = this.registerObj1.mobileNo.trim()
        //     if (this.registerObj1.patientTypeId !== 1) {
        //       this.isCompanySelected = true
        //       this.admissionFormGroup.get("DepartmentId").setValue(this.registerObj1.departmentId
        //       )
        //       this.admissionFormGroup.get("CompanyId").setValue(this.registerObj1.companyId)
        //     }
        //   }

        // });
      }, 500);
    }

  }

  selectChangedepartment(obj: any) {
    this._AdmissionService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
  }


  onChangePatient(value) {

    var mode = "Company"
    if (value.text != "Self") {
      this._AdmissionService.getMaster(mode, 1);
      this.admissionFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
      this.patienttype = 2;
    } else if (value.text == "Self") {
      this.isCompanySelected = false;
      this.admissionFormGroup.get('CompanyId').clearValidators();
      this.admissionFormGroup.get('SubCompanyId').clearValidators();
      this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
      this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.patienttype = 1;
    }
  }


  OnSaveAdmission() {
    this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.admissionFormGroup.get('AdmissionDate').value, 'yyyy-MM-dd'))
    console.log(this.admissionFormGroup.value)

    if (this.isCompanySelected && this.admissionFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.admissionFormGroup.invalid) {
      console.log(this.registerObj)
      let submitData = {
        "AdmissionReg": this.registerObj,// this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);

      this._AdmissionService.AdmissionUpdate(this.registerObj1.admissionId, submitData).subscribe(response => {
        this.toastr.success(response.message);
        // this.onClear();
      this.getAdmittedPatientCasepaperview(response);
        this._matDialog.closeAll();
      }, (error) => {
        this.toastr.error(error.message);

      });
    }  else {
      let invalidFields = [];

  if (this.admissionFormGroup.invalid) {
          for (const controlName in this.admissionFormGroup.controls) {
              if (this.admissionFormGroup.controls[controlName].invalid) {
                  invalidFields.push(`Admission Form: ${controlName}`);
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
  getAdmittedPatientCasepaperview(AdmissionId) {
    this.commonService.Onprint("AdmissionId", AdmissionId, "IpCasepaperReport");
  }

  getValidationMessages() {
    return {
      RegId: [],
      AdmittedDoctor1: [
        { name: "required", Message: "AdmittedDoctor1 is required" }
      ],
      AdmittedDoctor2: [
        { name: "required", Message: "AdmittedDoctor2 is required" }
      ],
      RefDocNameId: [
        { name: "pattern", Message: "Ref.DocName allowed" },

      ],
      CompanyId: [
        { name: "pattern", Message: "Company Only numbers allowed" },

      ],
      SubTpaComId: [
        { name: "pattern", Message: "Only numbers allowed" },
      ],
      RelativeName: [
        { name: "required", Message: "RelativeName is required" }
      ],
      RelativeAddress: [
        { name: "required", Message: "RelativeAddress is required" }
      ],

      RelationshipId: [
        { name: "required", Message: "Relationship is required" }
      ],
      DepartmentId: [
        { name: "required", Message: "Department is required" }
      ],
      DocNameId: [
        { name: "required", Message: "DocName Name is required" }
      ],
      TariffId: [
        { name: "required", Message: "Tariff Name is required" }
      ],
      PatientTypeId: [
        { name: "required", Message: "PatientType Name is required" }
      ],
      HospitalId: [
        { name: "required", Message: "Hospital Name is required" }
      ],
      phoneNo: [
        { name: "required", Message: "Relatvie MobileNo  is required" }
      ],
      docNameId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
    };
  }
  Close() {
    this._matDialog.closeAll();
  }
  onClear() { }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onReset() {
    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
    this.isCompanySelected = false;
    // this.admissionFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();


  }

}