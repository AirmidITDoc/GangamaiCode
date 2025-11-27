import { DatePipe } from '@angular/common';
import { Component, ElementRef, Inject, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel, RegInsert } from '../admission.component';
import { AdmissionService } from '../admission.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { MatTableDataSource } from '@angular/material/table';
import { VisitMaster1 } from 'app/main/opd/appointment-list/appointment-list.component';
import { ConfigService } from 'app/core/services/config.service';

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
  EmergencyFormGroup: FormGroup;
  MedicalFormGroup: FormGroup;


  // options = [];
  // subscriptionArr: Subscription[] = [];

  // matDialogRef: any;
  vRegNo = 0
  patienttype: any;
  AdmissionId: any = 0;
  isCompanySelected: boolean = false;
  Regflag: boolean = false;
  Regdisplay: boolean = false;
  ageYear = 0
  ageMonth = 0
  ageDay = 0
  CityName = ""
  noOptionFound: boolean = false;
  isRegSearchDisabled: boolean = true;
  registredflag: boolean = true;
  EmgId: any
  // printTemplate: any;
  selectedAdvanceObj: AdvanceDetailObj;
  newRegSelected: any = 'registration';
  filteredOptionsRegSearch: Observable<string[]>;
  registerObj1 = new AdmissionPersonlModel({});
  registerObj = new RegInsert({});
  companyDet = new RegInsert({});
  RegId: any;
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
  @ViewChild('ddlBedName') ddlBedName: AirmidDropDownComponent;


    Is9_Digit_National_Id: boolean = false;
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
    private _configue: ConfigService,
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
  showEmergencyFlag: boolean = false;
  showOPtoIPFlag: boolean = false;
  public opdList: OpList[] = [];
  colstatus = 0
  ngOnInit(): void {

    this.searchFormGroup = this.createSearchForm();
    this.personalFormGroup.markAllAsTouched();
    this.admissionFormGroup.markAllAsTouched();
    this.searchFormGroup.markAllAsTouched();

    if (this.AdmissionId)
      this.searchFormGroup.get("regRadio").setValue("registrered")


    if ((this.data?.emgId) > 0) {
      this.showEmergencyFlag = true
      this._AdmissionService.getEmergencyById(this.data.emgId).subscribe((response) => {
        this.registerObj = response;
        this.registerObj1 = response;
        this.RegId = this.registerObj.regId;
        this.EmgId = this.registerObj.emgId;
        console.log("Emg Data:", this.registerObj)
        if (this.RegId > 0) {
          this.searchFormGroup.get('regRadio')?.setValue('registrered');
          this.Regflag = true;
        } else {
          this.searchFormGroup.get('regRadio')?.setValue('registration');
          this.Regflag = false;
        }
        this.personalFormGroup.patchValue({
          MiddleName: this.registerObj.middleName || '',
        });
        this.selectChangedepartment(this.registerObj1)
      });
      // this.dsOpList = new MatTableDataSource(this.opdList);
    }
const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null]; 
this.Is9_Digit_National_Id = id === "1";
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId: [this.accountService.currentUserValue.user.unitId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
    });
  }
  FlagAdmittedCheck: any = 0;
  // getSelectedObj(obj) {
  //   console.log(obj)    
  //   debugger;
  //   // check Patient is already admiited or not 
  //   //  ----------------------------------------------------------------------------- 
  //   this.RegId = obj.value;
  //   var param = {
  //     "searchFields": [
  //       {
  //         "fieldName": "RegId",
  //         "fieldValue": String(obj.value),
  //         "opType": "Equals"
  //       }
  //     ],
  //     "mode": "CheckPatientAdmitted"
  //   }
  //   this._AdmissionService.getCheckAdmittedPatient(param).subscribe((response) => {
  //     this.FlagAdmittedCheck= response;
  //     console.log("Admitted:", this.FlagAdmittedCheck[0].Admitted);
  //   });

  //   if (this.FlagAdmittedCheck[0].Admitted == 1) {
  //     Swal.fire({
  //       icon: 'warning',
  //       title: `Admission for the selected patient has already been completed.`,
  //       text: `This patient already admitted.`,
  //       confirmButtonText: 'OK',
  //       confirmButtonColor: '#3085d6'

  //     });
  //     return;
  //   }
  //   //  -----------------------------------------------------------------------------

  //   if ((obj.value ?? 0) > 0) {

  //     // console.log(this.data)
  //     setTimeout(() => {
  //       this.searchFormGroup.get('regRadio')?.setValue('registrered');
  //       this.onChangeReg({ value: 'registrered' });
  //       this._AdmissionService.getRegistraionById(obj.value).subscribe((response) => {
  //         this.registerObj = response;
  //         this.value = response.dateofBirth
  //         this.onChangeDateofBirth(response.dateofBirth)
  //         // console.log(this.registerObj)
  //         // this.personalFormGroup.get('MaritalStatusId').setValue(this.registerObj.maritalStatusId)
  //         this.personalFormGroup.patchValue({
  //           FirstName: this.registerObj.firstName.trim(),
  //           middleName: this.registerObj.middleName.trim(),
  //           LastName: this.registerObj.lastName.trim(),
  //           MobileNo: this.registerObj.mobileNo.trim(),
  //           address: this.registerObj.address.trim(),
  //           // MaritalStatusId: this.registerObj.maritalStatusId,
  //           emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
  //           emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
  //           emgMobileNo: this.registerObj?.emgMobileNo ?? '',
  //           emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
  //           engAddress: this.registerObj?.engAddress ?? '',
  //           emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
  //           emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
  //           medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
  //           medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? new Date(),
  //           medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? new Date(),
  //           medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
  //           medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? '',
  //           medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
  //           medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? new Date(),
  //           medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
  //           medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
  //         });

  //       });

  //     }, 500);
  //   }
  // }

  getSelectedObj(obj: any) {
    // debugger
    console.log(obj);
    this.RegId = obj.value;

    const param = {
      searchFields: [
        {
          fieldName: "RegId",
          fieldValue: String(obj.value),
          opType: "Equals"
        }
      ],
      mode: "CheckPatientAdmitted"
    };

    this._AdmissionService.getCheckAdmittedPatient(param).subscribe((response) => {
      this.FlagAdmittedCheck = response;
      console.log("Admitted:", this.FlagAdmittedCheck[0].Admitted);

      // ✅ check inside subscribe
      if (this.FlagAdmittedCheck[0].Admitted == 1) {
        Swal.fire({
          icon: 'warning',
          title: `Admission for the selected patient has already been completed.`,
          text: `This patient is already admitted.`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6'
        });
        return;
      }

      // ✅ continue only if not admitted
      if ((obj.value ?? 0) > 0) {

        // console.log(this.data)
        setTimeout(() => {
          this.searchFormGroup.get('regRadio')?.setValue('registrered');
          this.onChangeReg({ value: 'registrered' });
          this._AdmissionService.getRegistraionById(obj.value).subscribe((response) => {
            this.registerObj = response;
            this.value = response.dateofBirth
            this.vRegNo = response.regNo
            this.onChangeDateofBirth(response.dateofBirth)
            this.personalFormGroup.patchValue({
              FirstName: this.registerObj.firstName.trim(),
              MiddleName: this.registerObj.middleName.trim(),
              LastName: this.registerObj.lastName.trim(),
              MobileNo: this.registerObj.mobileNo.trim(),
              Address: this.registerObj.address.trim(),
              // MaritalStatusId: this.registerObj.maritalStatusId,
              emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
              emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
              emgMobileNo: this.registerObj?.emgMobileNo ?? '',
              emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
              engAddress: this.registerObj?.engAddress ?? '',
              emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
              emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
              medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
              medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? new Date(),
              medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? new Date(),
              medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
              medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? '',
              medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
              medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? new Date(),
              medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
              medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
            });

          });

        }, 500);
      }
    });
  }

  // getSelectedObj1(obj) {
  //   // console.log(obj)
  //   debugger

  //   this.RegId = obj;
  //   if ((obj ?? 0) > 0) {

  //     // console.log(this.data)
  //     setTimeout(() => {
  //       this._AdmissionService.getRegistraionById(this.RegId).subscribe((response) => {
  //         this.registerObj = response;
  //         this.value = response.dateofBirth
  //         this.onChangeDateofBirth(response.dateofBirth)
  //         // console.log(this.registerObj)
  //         // this.personalFormGroup.get('MaritalStatusId').setValue(this.registerObj.maritalStatusId)
  //         this.personalFormGroup.patchValue({
  //           FirstName: this.registerObj.firstName.trim(),
  //           LastName: this.registerObj.lastName.trim(),
  //           MobileNo: this.registerObj.mobileNo.trim(),
  //           // MaritalStatusId: this.registerObj.maritalStatusId,
  //           emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
  //           emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
  //           emgMobileNo: this.registerObj?.emgMobileNo ?? '',
  //           emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
  //           engAddress: this.registerObj?.engAddress ?? '',
  //           emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
  //           emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
  //           medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
  //           medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? new Date(),
  //           medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? new Date(),
  //           medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
  //           medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? '',
  //           medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
  //           medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? new Date(),
  //           medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
  //           medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
  //         });

  //       });

  //     }, 500);
  //   }

  // }

  chkHealthcard(e) { }
  Patientnewold: any = 1;
  onChangeReg(event) {
    if (event.value === 'registration') {
      this.personalFormGroup.reset();
      this.personalFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = false;
      this.Patientnewold = 1;

      // Instead of reassigning, update controls one by one
      const newPersonalForm = this._AdmissionService.createPesonalForm();
      this.resetFilteredOptions();
      Object.keys(newPersonalForm.controls).forEach(key => {
        if (this.personalFormGroup.contains(key)) {
          this.personalFormGroup.setControl(key, newPersonalForm.get(key));
        } else {
          this.personalFormGroup.addControl(key, newPersonalForm.get(key));
        }
      });

      const newadmissionForm = this._AdmissionService.createAdmissionForm();
      Object.keys(newadmissionForm.controls).forEach(key => {
        if (this.admissionFormGroup.contains(key)) {
          this.admissionFormGroup.setControl(key, newadmissionForm.get(key));
        } else {
          this.admissionFormGroup.addControl(key, newadmissionForm.get(key));
        }
      });

      this.personalFormGroup.markAllAsTouched();
      this.admissionFormGroup.markAllAsTouched();

      this.Regflag = false;

    } else if (event.value === 'registrered') {

      this.personalFormGroup.get('RegId').enable();
      this.searchFormGroup.get('RegId').enable();
      this.searchFormGroup.get('RegId').reset();
      this.personalFormGroup.reset();
      this.Patientnewold = 2;

      const newPersonalForm = this._AdmissionService.createPesonalForm();
      this.resetFilteredOptions();
      Object.keys(newPersonalForm.controls).forEach(key => {
        if (this.personalFormGroup.contains(key)) {
          this.personalFormGroup.setControl(key, newPersonalForm.get(key));
        } else {
          this.personalFormGroup.addControl(key, newPersonalForm.get(key));
        }
      });

      const newadmissionForm = this._AdmissionService.createAdmissionForm();
      Object.keys(newadmissionForm.controls).forEach(key => {
        if (this.admissionFormGroup.contains(key)) {
          this.admissionFormGroup.setControl(key, newadmissionForm.get(key));
        } else {
          this.admissionFormGroup.addControl(key, newadmissionForm.get(key));
        }
      });

      this.personalFormGroup.markAllAsTouched();
      this.admissionFormGroup.markAllAsTouched();

      this.Regflag = true;
      this.isRegSearchDisabled = true;
    }
  }
  //   onChangeReg(event,registerObj?: any) {
  //   if (event.value === 'registration') {
  //     this.personalFormGroup.reset();
  //     this.personalFormGroup.get('RegId').reset();
  //     this.searchFormGroup.get('RegId').disable();
  //     this.isRegSearchDisabled = false;
  //     this.Patientnewold = 1;

  //     // Instead of reassigning, update controls one by one
  //     const newPersonalForm = this._AdmissionService.createPesonalForm();
  //     this.resetFilteredOptions();
  //     Object.keys(newPersonalForm.controls).forEach(key => {
  //       if (this.personalFormGroup.contains(key)) {
  //         this.personalFormGroup.setControl(key, newPersonalForm.get(key));
  //       } else {
  //         this.personalFormGroup.addControl(key, newPersonalForm.get(key));
  //       }
  //     });

  //     const newadmissionForm = this._AdmissionService.createAdmissionForm();
  //     Object.keys(newadmissionForm.controls).forEach(key => {
  //       if (this.admissionFormGroup.contains(key)) {
  //         this.admissionFormGroup.setControl(key, newadmissionForm.get(key));
  //       } else {
  //         this.admissionFormGroup.addControl(key, newadmissionForm.get(key));
  //       }
  //     });

  //     this.personalFormGroup.markAllAsTouched();
  //     this.admissionFormGroup.markAllAsTouched();

  //     this.Regflag = false;

  //   } else if (event.value === 'registrered') {

  //     this.personalFormGroup.get('RegId').enable();
  //     this.searchFormGroup.get('RegId').enable();
  //     this.searchFormGroup.get('RegId').reset();
  //     this.personalFormGroup.reset();
  //     this.Patientnewold = 2;

  //     const newPersonalForm = this._AdmissionService.createPesonalForm();
  //     this.resetFilteredOptions();
  //     Object.keys(newPersonalForm.controls).forEach(key => {
  //       if (this.personalFormGroup.contains(key)) {
  //         this.personalFormGroup.setControl(key, newPersonalForm.get(key));
  //       } else {
  //         this.personalFormGroup.addControl(key, newPersonalForm.get(key));
  //       }
  //     });

  //     const newadmissionForm = this._AdmissionService.createAdmissionForm();
  //     Object.keys(newadmissionForm.controls).forEach(key => {
  //       if (this.admissionFormGroup.contains(key)) {
  //         this.admissionFormGroup.setControl(key, newadmissionForm.get(key));
  //       } else {
  //         this.admissionFormGroup.addControl(key, newadmissionForm.get(key));
  //       }
  //     });

  //      if (registerObj) {
  //   if (this.personalFormGroup.get('FirstName')) {
  //     this.personalFormGroup.get('FirstName')!.setValue(registerObj.firstName || '');
  //   }
  //   if (this.personalFormGroup.get('MiddleName')) {
  //     this.personalFormGroup.get('MiddleName')!.setValue(registerObj.middleName || '');
  //   }
  //   if (this.personalFormGroup.get('LastName')) {
  //     this.personalFormGroup.get('LastName')!.setValue(registerObj.lastName || '');
  //   }
  // }

  //     this.personalFormGroup.markAllAsTouched();
  //     this.admissionFormGroup.markAllAsTouched();

  //     this.Regflag = true;
  //     this.isRegSearchDisabled = true;
  //   }
  // }
  prevResults: any[] = [];
  filteredOptions: any[] = [];
  resetFilteredOptions() {
    this.filteredOptions = [];
    this.prevResults = [];
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
        this.toastr.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      debugger
      console.log(this.personalFormGroup.value)
      if (!this.personalFormGroup.invalid && !this.admissionFormGroup.invalid && !this.searchFormGroup.invalid) {
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
        if (this.searchFormGroup.invalid) {
          for (const controlName in this.searchFormGroup.controls) {
            if (this.searchFormGroup.controls[controlName].invalid) {
              invalidFields.push(`Hospital Form: ${controlName}`);
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

  onChangeCompany(value) {
    this._AdmissionService.getCompanyById(value.value).subscribe((response) => {
      this.companyDet = response;
      console.log("Company Data:", this.companyDet)
      this.admissionFormGroup.get('TariffId').setValue(this.companyDet.traiffId);
    });
  }

  rawDate1: Date | string = '1900-01-01';
  rawDate2: Date | string = '1900-01-01';
  rawDate3: Date | string = '1900-01-01';

  onVisaDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Visa date selected:', event.value);
    this.rawDate1 = event.value || '1900-01-01';
  }

  onValidityDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Validity date selected:', event.value);
    this.rawDate2 = event.value || '1900-01-01';
    if (this.rawDate1 instanceof Date && this.rawDate2 instanceof Date && this.rawDate1 > this.rawDate2) {
      this.toastr.warning('Visa Issue Date cannot be greater than Visa Validity Date.', 'Warning!', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      this.personalFormGroup.get('medTourismVisaValidityDate')?.setValue('');
      return;
    }
  }

  onEntryDateChange(event: MatDatepickerInputEvent<Date>) {
    console.log('Entry date selected:', event.value);
    this.rawDate3 = event.value || '1900-01-01';
  }

  onIsMLCChange(event: any) {
    this.admissionFormGroup.patchValue({ IsMLC: event.checked });
  }

  onISCharChange(event: any) {
    this.admissionFormGroup.patchValue({ IsCharity: event.checked });
  }

  onIsSeniorChange(event: any) {
    // this.admissionFormGroup.patchValue({ IsSenior: event.checked });
  }

  OnSaveAdmission() {
    debugger
    if (this.EmgId > 0) {
      this.admissionFormGroup.get('convertId').setValue(this.EmgId)
      this.admissionFormGroup.get('AdmissionType').setValue(2)
    }
    if (this.VvisitId > 0) {
      this.admissionFormGroup.get('convertId').setValue(this.VvisitId)
      this.admissionFormGroup.get('AdmissionType').setValue(1)
    }
    this.personalFormGroup.get('Age').setValue(String(this.ageYear))
    this.personalFormGroup.get('AgeYear').setValue(String(this.ageYear))
    this.personalFormGroup.get('AgeMonth').setValue(String(this.ageMonth))
    this.personalFormGroup.get('AgeDay').setValue(String(this.ageDay))
    this.personalFormGroup.get("DateOfBirth").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd"))
    this.personalFormGroup.get('City').setValue(this.CityName)
    console.log(this.searchFormGroup.get("HospitalId").value)
    this.admissionFormGroup.get('hospitalId').setValue(this.searchFormGroup.get("HospitalId").value)
    this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.personalFormGroup.get('RegDate').value, 'yyyy-MM-dd'))
    this.admissionFormGroup.get('AdmissionDate').setValue(this.datePipe.transform(this.admissionFormGroup.get('AdmissionDate').value, 'yyyy-MM-dd'))
    this.personalFormGroup.get('medTourismVisaIssueDate').setValue(this.datePipe.transform(this.rawDate1, "yyyy-MM-dd") || this.rawDate1);
    this.personalFormGroup.get('medTourismVisaValidityDate').setValue(this.datePipe.transform(this.rawDate2, "yyyy-MM-dd") || this.rawDate2);
    this.personalFormGroup.get('medTourismDateOfEntry').setValue(this.datePipe.transform(this.rawDate3, "yyyy-MM-dd") || this.rawDate3);

    if (this.isCompanySelected && this.admissionFormGroup.get('CompanyId').value == 0) {
      this.toastr.warning('Please select valid Company ', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }

    this.personalFormGroup.get('medTourismCitizenship').setValue(Number(this.personalFormGroup.get('medTourismCitizenship').value) ?? 0)
    this.personalFormGroup.removeControl('IsNRI')

    console.log(this.admissionFormGroup.value)
    if (!this.admissionFormGroup.invalid) {
      // let submitData = {
      //   "AdmissionReg": this.personalFormGroup.value,
      //   "ADMISSION": this.admissionFormGroup.value
      // };

      if (this.searchFormGroup.get('regRadio').value == "registration" && this.AdmissionId == 0) {
        let submitData = {
          "admissionReg": this.personalFormGroup.value,
          "admission": this.admissionFormGroup.value
        };

        debugger
        console.log(submitData);
        this._AdmissionService.AdmissionNewInsert(submitData).subscribe(response => {
          this.getAdmittedPatientCasepaperview(response);
          console.log(response)
          if (this.EmgId > 0) {
            this.AddChargesFromEmg(response);
            return
          }
          this.onClear();
          this._matDialog.closeAll();
        });
      }
      else {
        // console.log(submitData);
        let submitData = {
          // "AdmissionReg": this.personalFormGroup.value,
          "admission": this.admissionFormGroup.value
        };
        console.log(submitData);
        this._AdmissionService.AdmissionRegisteredInsert(submitData).subscribe(response => {
          console.log(response)
          if (this.EmgId > 0) {
            this.AddChargesFromEmg(response);
            return
          }
          this.getAdmittedPatientCasepaperview(response);
          this.onClear();
          this._matDialog.closeAll();
        });
      }
    } else {
      let invalidFields = [];
      if (this.personalFormGroup.invalid) {
        for (const controlName in this.personalFormGroup.controls) {
          if (this.personalFormGroup.controls[controlName].invalid) { invalidFields.push(`Personal Form: ${controlName}`); }
        }
      }
      if (this.admissionFormGroup.invalid) {
        for (const controlName in this.admissionFormGroup.controls) { if (this.admissionFormGroup.controls[controlName].invalid) { invalidFields.push(`Admission Form: ${controlName}`); } }
      }

      if (invalidFields.length > 0) {
        invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
      }

    }

  }

  AddChargesFromEmg(admissionId) {
    Swal.fire({
      title: 'Do You want to add all Charges in IPD?',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
      cancelButtonText: 'No'
    }).then((flag) => {
      if (flag.isConfirmed) {
        let submitData = {
          "emgId": this.EmgId,
          "newAdmissionId": admissionId
        }
        console.log(submitData);
        this._AdmissionService.UpdateAddChargesFromEmg(submitData).subscribe((res) => {
          // this.grid.bindGridData();
          this.getAdmittedPatientCasepaperview(admissionId);
          this._matDialog.closeAll();
        })
      } else {
        this._matDialog.closeAll();
      }
    })
  }

  selectChangedepartment(obj: any) {
    // debugger
    if (obj.value) {
      this._AdmissionService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
        console.log(data)
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
      });
    } else {
      this._AdmissionService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
        console.log(data)
        this.ddlDoctor.options = data;
        this.ddlDoctor.bindGridAutoComplete();
        const incomingDoctorId = obj.docNameId || obj.doctorId;
        if (incomingDoctorId) {
          const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
          if (matchedDoctor) {
            this.admissionFormGroup.get('DocNameId')?.setValue(matchedDoctor.value);
          }
        }
      });
    }
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
  RoomId = 0
  onChangeWard(e) {
    // debugger
    this.RoomId = e.roomId
    this.ddlClassName.SetSelection(e.classId);
    this.selectChangeward(e)
  }

  selectChangeward(obj: any) {
    // debugger
    if (obj.roomId) {
      this._AdmissionService.getBedByWard(obj.roomId).subscribe((data: any) => {
        console.log(data)
        this.ddlBedName.options = data;
        this.ddlBedName.bindGridAutoComplete();
      });
      // } else {
      //   this._AdmissionService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
      //     // console.log(data)
      //     this.ddlDoctor.options = data;
      //     this.ddlDoctor.bindGridAutoComplete();
      //     const incomingDoctorId = obj.docNameId || obj.doctorId;
      //     if (incomingDoctorId) {
      //       const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
      //       if (matchedDoctor) {
      //         this.admissionFormGroup.get('DocNameId')?.setValue(matchedDoctor.value);
      //       }
      //     }
      //   });
    }
  }
  onChangecity(e) {
    this.CityName = e.cityName
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
             const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
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
      // aadharCardNo: [
      //   { name: "pattern", Message: "Only numbers allowed" },
      //   { name: "required", Message: "AadharCard No is required" },
      //   { name: "minLength", Message: "12 digit required." },
      //   { name: "maxLength", Message: "More than 12 digits not allowed." }
      // ],
       aadharCardNo: [
      { name: "pattern", Message: "Only numbers allowed" },
      { name: "required", Message: "Aadhaar / National ID is required" },
      { name: "minLength", Message: `${maxLen} digits required.` },
      { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
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
      emgDrivingLicenceNo: [
        { name: "pattern", Message: "e.g., MH14-20210001234" },
        { name: "minLength", Message: "16 digit required." },
        { name: "maxLength", Message: "More than 16 digits not allowed." }
      ],
      medTourismPassportNo: [
        { name: "pattern", Message: "e.g., A1234567" },
        { name: "minLength", Message: "8 digit required." },
        { name: "maxLength", Message: "More than 8 digits not allowed." }
      ],
      medTourismNationalityId: [
        { name: "pattern", Message: "Only alphanumeric, 10 to 15 characters" },
        { name: "minLength", Message: "Minimum 10 characters required." },
        { name: "maxLength", Message: "Maximum 15 characters allowed." }
      ]
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


  minDate = new Date();
  value = new Date()
  onChangeDateofBirth(DateOfBirth: Date) {
    if (DateOfBirth > this.minDate) {
      this.toastr.warning('Enter Proper Birth Date..', 'warning !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      return;
    }
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());

      this.ageYear = todayDate.getFullYear() - dob.getFullYear();
      this.ageMonth = (todayDate.getMonth() - dob.getMonth());
      this.ageDay = (todayDate.getDate() - dob.getDate());

      if (this.ageDay < 0) {
        this.ageMonth--;
        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
        this.ageDay += previousMonth.getDate(); // Days in previous month
        // this.ageDay =this.ageDay +1;
      }

      if (this.ageMonth < 0) {
        this.ageYear--;
        this.ageMonth += 12;
      }
      this.value = DateOfBirth;
      this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
      if (this.ageYear > 110)
        this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
          toastClass: 'tostr-tost custom-toast-success',
        });
    }
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

  //////////////////////// op to ip convert code ////////////////////////
  @ViewChild('opTable') opTable!: TemplateRef<any>;
  public dsIPConvertPatientList = new MatTableDataSource<VisitMaster1>();
  @ViewChild('IPConvertTable') IPConvertTable!: TemplateRef<any>;
  ListdialogRef: any
  VvisitId: any;
  dataSource = new MatTableDataSource<VisitMaster1>();
  openPatientTable() {
    this.ListdialogRef = this._matDialog.open(this.IPConvertTable, {
      width: '80%',
      height: '60%',
    });
    this.ListdialogRef.afterClosed().subscribe((selectedRow) => {
      if (selectedRow) {
        this.VvisitId = selectedRow.visitId
        if ((this.VvisitId) > 0) { //140267
          this._AdmissionService.getRegistraionById(selectedRow.regID).subscribe((response) => {
            this.registerObj = response;
            console.log("Visit Data:", this.registerObj)
            this.personalFormGroup.patchValue({
              FirstName: this.registerObj.firstName.trim(),
              LastName: this.registerObj.lastName.trim(),
              MobileNo: this.registerObj.mobileNo.trim()
            });
            if (this.registerObj.regId?.valueOf() > 0) {
              this.searchFormGroup.get('regRadio')?.setValue('registrered');
              this.Regflag = true;
            } else {
              this.searchFormGroup.get('regRadio')?.setValue('registration');
              this.Regflag = false;
            }
            // this.selectChangedepartment(this.registerObj1)
          });
        }
      }
    });

    let Data = {
      "first": 0,
      "rows": 100,
      "sortField": "IsConvertRequestForIP",
      "sortOrder": 0,
      "filters": [],
      "exportType": "JSON",
      "columns": []
    }

    this._AdmissionService.getOPDToIpConvertList(Data).subscribe((response) => {
      this.dataSource.data = response.data;
      if (this.dataSource.data.length > 0)
        this.colstatus = 1
    });
  }

  public displayedColumns =
    ['UHID', 'vistDateTime', 'patientName', 'PatientType', 'opdNo', 'doctorName', 'RefDoctorName', 'ConvertId'];

  onRowClick(contact) {

    if (contact.convertId !== "0") {
      const name = contact.patientName?.trim();
      Swal.fire({
        icon: 'warning',
        title: `Admission for the selected patient ${name} has already been completed.`,
        text: `This patient ${name} already admitted.`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6'
      });
      return;
    }
    this.ListdialogRef.close(contact);
  }
  //////////////////////// op to ip convert code end ////////////////////////

  debounceTimers: { [key: string]: any } = {};
  handleInputChange(changedField: string): void {
    // Get all current field values
    const firstName = this.personalFormGroup.get('FirstName').value?.trim() || '';
    const lastName = this.personalFormGroup.get('LastName').value?.trim() || '';
    const mobileNo = this.personalFormGroup.get('MobileNo').value?.trim() || '';

    // If all fields are empty, clear everything
    if (!firstName && !lastName && !mobileNo) {
      this.resetFilteredOptions();
      return;
    }

    // Count how many fields are filled
    const filledFields = [firstName, mobileNo].filter(Boolean).length;

    // If only one field is filled, and it's FirstName or MobileNo, call API
    if (filledFields === 1 && (changedField === 'FirstName' || changedField === 'MobileNo')) {
      const keyword = firstName || mobileNo;
      this._AdmissionService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
        this.prevResults = results || [];
        this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      });
      return;
    }

    // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
    if (filledFields === 1 && changedField === 'LastName') {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
      return;
    }

    // If more than one field is filled, filter from prevResults
    if (this.prevResults.length > 0) {
      this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
    } else if (changedField === 'FirstName' || changedField === 'MobileNo') {
      // Fallback: if prevResults is empty, call API with the changed field (if allowed)
      const keyword = this.personalFormGroup.get(changedField).value?.trim();
      if (keyword) {
        this._AdmissionService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
          this.prevResults = results || [];
          this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        });
      }
    } else {
      // If changedField is LastName and prevResults is empty, do nothing
      this.filteredOptions = [];
    }
  }
  // Helper function to filter results by all non-empty fields
  filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
    const { firstName, lastName, mobileNo } = fields;
    return results.filter(item => {
      return (!firstName || item.patientName?.toLowerCase().includes(firstName.toLowerCase()))
        && (!lastName || item.patientName?.toLowerCase().includes(lastName.toLowerCase()))
        && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
    });
  }
  handleInputChangeDebounced(changedField: string): void {
    // Clear any existing timer for this field
    if (this.debounceTimers[changedField]) {
      clearTimeout(this.debounceTimers[changedField]);
    }
    // Set a new timer
    this.debounceTimers[changedField] = setTimeout(() => {
      this.handleInputChange(changedField);
    }, 300); // 300ms debounce
  }
  onSelectPatient(row: any) {
    this.getSelectedObj(row);
    this.resetFilteredOptions();
  }
}

export class OpList {
  DoctorId: number;
  departmentId: number;
  patientName: string;
  ChargeDoctorName: String;
  ClassId: number;
  ClassName: string;
  DoctorName: any;
  OpdIpdId: any;
  doctorName: any;
  doctorId: any;
  userName: any;
  regNo: number;
  regId: number;
  constructor(OpList) {
    this.DoctorId = OpList.DoctorId || 0;
    this.DoctorName = OpList.DoctorName || '';
    this.ChargeDoctorName = OpList.ChargeDoctorName || '';
    this.ClassId = OpList.ClassId || 0;
    this.ClassName = OpList.ClassName || '';
    this.OpdIpdId = OpList.OpdIpdId || '';
    this.doctorName = OpList.doctorName || 0;
    this.doctorId = OpList.doctorId || 0;
    this.userName = OpList.userName || '';
    this.patientName = OpList.patientName || '';
    this.departmentId = OpList.departmentId || '';
    this.regId = OpList.regId || '';
    this.regNo = OpList.regNo || '';
  }
}