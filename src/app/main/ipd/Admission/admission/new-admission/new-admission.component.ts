import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AdmissionPersonlModel, Bed, RegInsert } from '../admission.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdmissionService } from '../admission.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { IPDSearcPatienthComponent } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { fuseAnimations } from '@fuse/animations';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewAdmissionComponent implements OnInit {

  personalFormGroup: FormGroup;
  admissionFormGroup: FormGroup;

  searchFormGroup: FormGroup;


  // options = [];
  // subscriptionArr: Subscription[] = [];

  // matDialogRef: any;
  patienttype: any;
  AdmissionId: any = 0;
  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  Regdisplay: boolean = false;
  ageYear = 0
  ageMonth = 0
  ageDay = 0
  CityName=""
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;
  registredflag: boolean = true;

  // printTemplate: any;
  selectedAdvanceObj: AdvanceDetailObj;
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  RegId=0;
  currentDate = new Date();
  public now: Date = new Date();
  // isLoading: string = '';
  screenFromString = 'admission-form';

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;

  @ViewChild('ddlClassName') ddlClassName: AirmidDropDownComponent;

  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    private commonService: PrintserviceService,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    dialogRef.disableClose = true;
    this.personalFormGroup = this._AdmissionService.createPesonalForm();
    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
  }

  autocompleteModeprefix: string = "Prefix";
  autocompleteModemaritalstatus: string = "MaritalStatus";
  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModereligion: string = "Religion";
  autocompleteModegender: string = "Gender";
  autocompleteModestatus: string = "StateByCity";
  autocompleteModecountry: string = "Country";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModeSubCompany: string = "SubCompany";
  autocompleteModeWardName: string = "Room";
  autocompleteModeBedName: string = "Bed";
  autocompleteModeClass: string = "Class";
  autocompleteModemstatus: string = "MaritalStatus";
  autocompleteModestate: string = "State";

  autocompleteModehospital: string = "Hospital";

  ngOnInit(): void {
    
    this.searchFormGroup = this.createSearchForm();
    this.personalFormGroup.markAllAsTouched();
    this.admissionFormGroup.markAllAsTouched();

    if (this.AdmissionId)
      this.searchFormGroup.get("regRadio").setValue("registrered")
   
  }


  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId:[this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }

  getSelectedObj(obj) {
    console.log(obj)
    this.RegId = obj.value;
    if ((obj.value ?? 0) > 0) {

      console.log(this.data)
      setTimeout(() => {
        this._AdmissionService.getRegistraionById(obj.value).subscribe((response) => {
          this.registerObj = response;
          console.log(this.registerObj)

        });

      }, 500);
    }

  }

  chkHealthcard(e) { }
  Patientnewold: any = 1;
  onChangeReg(event) {
    if (event.value == 'registration') {
      this.Regflag = false;
      this.personalFormGroup.get('RegId').reset();
      this.personalFormGroup.get('RegId').disable();
      // this.isRegSearchDisabled = true;
      this.registerObj1 = new AdmissionPersonlModel({});
      this.personalFormGroup.reset();
      this.Patientnewold = 1;

      this.personalFormGroup = this._AdmissionService.createPesonalForm();
      this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
      this.Regdisplay = false;

    } else {
      this.Regdisplay = true;
      this.Regflag = true;
      this.searchFormGroup.get('RegId').enable();
      this.personalFormGroup = this._AdmissionService.createPesonalForm();
      this.Patientnewold = 2;

    }

    this.personalFormGroup.markAllAsTouched();
    this.admissionFormGroup.markAllAsTouched();
  }

  onNewSave() {
    if (this.Patientnewold == 2 && this.RegId == 0)
      this.toastr.warning("Please Select Registered Patient  ...");
  else {
    let DateOfBirth1 = this.personalFormGroup.get("DateOfBirth").value
    if (DateOfBirth1) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth1);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      this.ageYear = (todayDate.getFullYear() - dob.getFullYear());
      this.ageMonth = (todayDate.getMonth() - dob.getMonth());
      this.ageDay = (todayDate.getDate() - dob.getDate());

      if (this.ageDay < 0) {
        (this.ageMonth)--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        this.ageDay += previousMonth.getDate(); // Days in previous month
      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }
    }
    if (
      (!this.ageYear || this.ageYear == 0) &&
      (!this.ageMonth || this.ageMonth == 0) &&
      (!this.ageDay || this.ageDay == 0)
    ) {
      this.toastr.warning('Please select Date of Birth', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if (!this.personalFormGroup.invalid && !this.admissionFormGroup.invalid) {

      Swal.fire({
        title: 'Do you want to Save the Admission ',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save!"

      }).then((result) => {
      if (result.isConfirmed) {
          this.OnSaveAdmission();
        }
      })
    }
    else {
      let invalidFields = [];

      if (this.personalFormGroup.invalid) {
        for (const controlName in this.personalFormGroup.controls) {
          if (this.personalFormGroup.controls[controlName].invalid) {
            invalidFields.push(`Personal Form: ${controlName}`);
          }
        }
      }
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
    
    this.personalFormGroup.get('Age').setValue(String(this.ageYear))
    this.personalFormGroup.get('AgeYear').setValue(String(this.ageYear))
    this.personalFormGroup.get('AgeMonth').setValue(String(this.ageMonth))
    this.personalFormGroup.get('AgeDay').setValue(String(this.ageDay))
    this.personalFormGroup.get("DateOfBirth").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value,"yyyy-MM-dd"))
    this.personalFormGroup.get('City').setValue(this.CityName)
   console.log(this.searchFormGroup.get("HospitalId").value)
    this.admissionFormGroup.get('hospitalId').setValue(this.searchFormGroup.get("HospitalId").value)

    this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.personalFormGroup.get('RegDate').value, 'yyyy-MM-dd'))
    this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.admissionFormGroup.get('AdmissionDate').value, 'yyyy-MM-dd'))

    if (this.isCompanySelected && this.admissionFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
      let submitData = {
        "AdmissionReg": this.personalFormGroup.value,
        "ADMISSION": this.admissionFormGroup.value
      };
      console.log(submitData);
      if (this.searchFormGroup.get('regRadio').value == "registration" && this.AdmissionId == 0) {
        this._AdmissionService.AdmissionNewInsert(submitData).subscribe(response => {
          this.getAdmittedPatientCasepaperview(response);
          this.onClear();
          this._matDialog.closeAll();
        });
      }
      else {
          console.log(submitData);
          this._AdmissionService.AdmissionRegisteredInsert(submitData).subscribe(response => {
          this.toastr.success(response.message);
          this.getAdmittedPatientCasepaperview(response);
          this.onClear();
          this._matDialog.closeAll();
        });
      }
  }


  selectChangedepartment(obj: any) {

    this._AdmissionService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
  }


  getAdmittedPatientCasepaperview(AdmissionId) {
    this.commonService.Onprint("AdmissionId", AdmissionId, "IpCasepaperReport");
  }

  displayFn(user: any): string {
    return user.text;
  }
  onChangePrefix(e) {
    this.ddlGender.SetSelection(e.sexId);
  }

  onChangestate(e) {
    // this.ddlCountry.SetSelection(e.stateId);
  }

  onChangeWard(e) {
    this.ddlClassName.SetSelection(e.classId);
  }

  onChangecity(e) {
    this.CityName=e.cityName
    this.registerObj.stateId = e.stateId
    this._AdmissionService.getstateId(e.stateId).subscribe((Response) => {
      console.log(Response)
      this.ddlCountry.SetSelection(Response.countryId);
    });

  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  getValidationMessages() {
    return {
      RegId: [],
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },

      ],
      prefixId: [
        { name: "required", Message: "Prefix Name is required" }
      ],
      genderId: [
        { name: "required", Message: "Gender is required" }
      ],
      areaId: [
        { name: "required", Message: "Area Name is required" }
      ],
      cityId: [
        { name: "required", Message: "City Name is required" }
      ],
      religionId: [
        { name: "required", Message: "Religion Name is required" }
      ],
      countryId: [
        { name: "required", Message: "Country Name is required" }
      ],
      maritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      stateId: [
        { name: "required", Message: "State Name is required" }
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      phoneNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        // { name: "required", Message: "phoneNo No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ],
      aadharCardNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "AadharCard No is required" },
        { name: "minLength", Message: "12 digit required." },
        { name: "maxLength", Message: "More than 12 digits not allowed." }
      ],
      MaritalStatusId: [
        { name: "required", Message: "Mstatus Name is required" }
      ],
      AdmittedDoctor1: [
        { name: "required", Message: "AdmittedDoctor1 is required" }
      ],
      AdmittedDoctor2: [
        { name: "required", Message: "AdmittedDoctor2 is required" }
      ],
      RefDocNameId: [
        { name: "pattern", Message: "Ref.DoctorName allowed" },

      ],
      CompanyId: [
        { name: "pattern", Message: "Company Only numbers allowed" },

      ],
      SubTpaComId: [
        { name: "pattern", Message: "Only numbers allowed" },
      ],
      bedId: [
        { name: "required", Message: "Bed is required" }
      ],
      wardId: [
        { name: "required", Message: "ward is required" }
      ],
      ClassId: [
        { name: "required", Message: "Class Name is required" }
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
        { name: "required", Message: "DoctorName Name is required" }
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
      RphoneNo: [
        { name: "required", Message: "RelatvieMobileNo Name is required" }
      ],
      docNameId: [
        { name: "required", Message: "Doctor Name is required" }
      ],
    };
  }
  onClear() { }
  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();
    this.isCompanySelected = false;
    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();
    this.patienttype = 1;
    this.personalFormGroup.get('CityId').reset();
  }
  onReset() {

    this.personalFormGroup.get('RegId').reset();
    this.personalFormGroup.get('RegId').disable();

    if (this.searchFormGroup.get('regRadio').value == "registration")
      this.searchFormGroup.get('RegId').disable();
    else
      this.searchFormGroup.get('RegId').enable();

    this.registerObj1 = new AdmissionPersonlModel({});
    this.personalFormGroup.reset();

    this.personalFormGroup = this._AdmissionService.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();

    this.admissionFormGroup = this._AdmissionService.createAdmissionForm();
    this.admissionFormGroup.markAllAsTouched();

    this.admissionFormGroup.get('CompanyId').clearValidators();
    this.admissionFormGroup.get('SubCompanyId').clearValidators();
    this.admissionFormGroup.get('CompanyId').updateValueAndValidity();
    this.admissionFormGroup.get('SubCompanyId').updateValueAndValidity();


  }

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
        return true;
    } else {
        event.preventDefault();
        return false;
    }
}
}