import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ChargesList, LabPatientList } from '../../lab-patient-reg/lab-patient-reg.component';
import { LabAppointmentService } from '../lab-appointment.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
    selector: 'app-new-lab-appointment',
    templateUrl: './new-lab-appointment.component.html',
    styleUrls: ['./new-lab-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewLabAppointmentComponent {
    myForm: FormGroup
    abhaForm: FormGroup;
    screenFromString = 'ExternalLab-form';
    registerObj = new LabPatientList({});

    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";

  vFirstNameConfig: any;
  vmiddleNameConfig: any;
  vlastNameConfig: any;
  patientTypeList: any = [];
  VlabPatRegId: any;
  ApiURL: any = '';
  vTariffId: any = 1;
  vClassId: any = 1;
  dateTimeObj: any;
  isExpanded2 = true;

  isCompanySelected: boolean = false;
  isTariffSelect: boolean = false;
  patienttype = 0
  UnitId: any = this.accountService.currentUserValue.user.unitId;
  vdoctorId: any = 0
  vdoctorName: any = ''
  companyId = 0;
  companyName = '';
  companyDet = new LabPatientList({});
  ageYear: any;
  ageMonth: any;
  ageDays: any;
  stateId = 0
  counryId = 0
  filteredOptions: any[] = [];
  prevResults: any[] = [];
  debounceTimers: { [key: string]: any } = {};
  PatientName: any;
  regNo: any;
  ageDay = 0;
  minDate = new Date();
  CityName: '';
  labPatientId = 0
  timeflag = 0
  isTimeChanged: boolean = false;
  phdatetime: any;
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  fromDate: Date;
  toDate: Date;
  isEditMode: boolean = false;
  public now: Date = new Date();

  @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
  @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
  @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
  @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;
  autocompleteRadioDD: string = "RadioCategory";
  autocompleteRefDoctorDD: string = "RefDoctor";

  displayedServiceselected: string[] = [
    'ServiceName',
    'Price',
    'buttons'
  ]

    constructor(public _appointmentService: LabAppointmentService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<NewLabAppointmentComponent>,
        public datePipe: DatePipe,
        public _formbuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        private hospitalconfigservice: HospitalConfigService,
        public toastrService: ToastrService, public _ConfigService: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _configue: ConfigService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.myForm = this.CreateMyForm();
        this.myForm.markAllAsTouched();
        this.minDate = new Date();

        console.log("retrive Data:", this.data)

        if (this.data) {
            this.isEditMode = true;
            console.log(this.data)
            this.myForm.get('labAppDate').setValue(this.datePipe.transform(this.data.fromDate, 'yyyy-MM-dd'));
            this.myForm.get('labAppTime').setValue(this.data.fromDate);
            this.myForm.get('startTime').setValue(this.data.fromDate);
            this.myForm.get('endTime').setValue(this.data.toDate);
            this.myForm.get('categoryId').setValue(this.data.categoryId);
            this.myForm.get('doctorId').setValue(this.data.refDoctorId);
            this.fromDate = this.data.fromDate;
            this.toDate = this.data.toDate;
        } else {
            this.isEditMode = false;
            const currentDateTime = new Date();
            const today = new Date();
            const utcMidnight = new Date(Date.UTC(today.getFullYear(), today.getMonth(), today.getDate()));
            this.myForm.get('labAppDate').setValue(utcMidnight.toISOString());
            this.myForm.get('labAppTime')?.setValue(currentDateTime);
            this.myForm.get('endTime')?.setValue(currentDateTime);
            this.myForm.get('startTime').setValue(currentDateTime);

        }

    // var rawValue=this?._configue?.configParams?.Is9_Digit_NationalId || "";
    const firstValue = this?._configue?.configParams?.FirstNameMandatory || "";
    const [firstnameid, firstnameval] = firstValue.includes(":") ? firstValue.split(":") : [null, null];
    this.vFirstNameConfig = firstnameid

        const middleValue = this?._configue?.configParams?.MiddleNameMandatory || "";
        const [middlenameid, middlenameval] = middleValue.includes(":") ? middleValue.split(":") : [null, null];
        this.vmiddleNameConfig = middlenameid

        const lastValue = this?._configue?.configParams?.LastNameMandatory || "";
        const [lastnameid, lastnameval] = lastValue.includes(":") ? lastValue.split(":") : [null, null];
        this.vlastNameConfig = lastnameid

        this.setNameValidations();
    }

    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    setNameValidations() {
        const fieldConfigs = [
            { field: 'firstName', config: this.vFirstNameConfig },
            { field: 'middleName', config: this.vmiddleNameConfig },
            { field: 'lastName', config: this.vlastNameConfig }
        ];

        fieldConfigs.forEach(item => {
            const ctrl = this.myForm.get(item.field);
            if (!ctrl) return;

            if (item.config === '1') {
                ctrl.setValidators([Validators.required]);
            } else {
                ctrl.clearValidators();
            }

            ctrl.updateValueAndValidity();
        });
    }

  CreateMyForm() {
    return this._formbuilder.group({
      labAppId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
      unitId: this.accountService.currentUserValue.user.unitId,
      appDate: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      appTime: [''],
      prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
      DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
      doctorId: [0],
      categoryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      labAppDate: [(new Date()).toISOString(), [Validators.required, this._FormvalidationserviceService.validDateValidator()]],
      labAppTime: ['', [Validators.required]],
      addedBy: this.accountService.currentUserValue.userId,
      updatedBy: 0,
      isCancelled: false,
      isCancelledBy: [0],
      isCancelledDate: ['1900-01-01'],
      labPatRegId: [0],
      startTime: ['', [Validators.required]],
      endTime: ['', [Validators.required]],
    })
  }

    prefixName: any;
    onChangePrefix(e) {
        this.prefixName = e.prefixName
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangeRefdoc(value) {
        // this.vRefDocId = value.doctorId
        // this.vRefDocName = value.doctorName
        this.vdoctorId = value.value
        this.vdoctorName = value.text
    }

    selectChangeCategory(obj: any) {
        // this.categoryId = obj.value
        // this.CateName = obj.text
    }

    onChangecity(e) {
        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this.stateId = e.stateId
        this._appointmentService.getstateId(e.stateId).subscribe((Response) => {
            // this.ddlState.SetSelection(Response.stateId)
            // this.ddlCountry.SetSelection(Response.countryId);
            this.counryId = Response.countryId
        });
    }

  regflag = false
  showPrevBtn: boolean = false
  getSelectedObj(obj) {
    console.log(obj)
    // this.PatientName = obj.patientName;
    this.PatientName = obj.firstName + ' ' + obj.lastName;
    this.VlabPatRegId = obj.visitId;
    if (this.VlabPatRegId) {
      setTimeout(() => {
        this._appointmentService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
          console.log(response)
          this.registerObj = response;
          this.counryId = response.countryId
          this.stateId = response.stateId
          this.value = response.dateofBirth
          this.regNo = response.labRequestNo
          this.onChangeDateofBirth(response.dateofBirth)
          this.regflag = true
          this.myForm.patchValue({
            firstName: this.registerObj.firstName.trim(),
            middleName: this.registerObj.middleName.trim(),
            LastName: this.registerObj.lastName.trim(),
            MobileNo: this.registerObj.mobileNo.trim(),
            address: this.registerObj.address.trim(),
            // DateOfBirth:this.registerObj.dateofBirth,
          });

                });
            }, 100);
        }

        if (this.VlabPatRegId) {
            this.showPrevBtn = true
        }
    }

    value = new Date()
    onChangeDateofBirth(DateOfBirth: Date) {

        if (DateOfBirth > this.minDate) {
            this.toastrService.warning('Enter Proper Birth Date..', 'warning !', {
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
            this.myForm.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                this.toastrService.warning('Please Enter Valid BirthDate..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
        }
    }

    filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
        const { firstName, lastName, mobileNo } = fields;
        return results.filter(item => {
            return (!firstName || item.firstName?.toLowerCase().includes(firstName.toLowerCase()))
                && (!lastName || item.lastName?.toLowerCase().includes(lastName.toLowerCase()))
                && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
        });
    }

    handleInputChange(changedField: string): void {
        // Get all current field values
        // debugger
        const firstName = this.myForm.get('firstName').value?.trim() || '';
        const lastName = this.myForm.get('lastName').value?.trim() || '';
        const mobileNo = this.myForm.get('mobileNo').value?.trim() || '';

        if (mobileNo && mobileNo.length !== 10) {
            this.filteredOptions = [];
            return;
        }

        // If all fields are empty, clear everything
        if (!firstName && !lastName && !mobileNo) {
            this.resetFilteredOptions();
            return;
        }

        // Count how many fields are filled
        const filledFields = [firstName, mobileNo].filter(Boolean).length;

        // If only one field is filled, and it's FirstName or MobileNo, call API
        if (filledFields === 1 && (changedField === 'firstName' || (changedField === 'mobileNo' && mobileNo.length === 10))) {
            const keyword = firstName || mobileNo;
            this._appointmentService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
                this.prevResults = results || [];
                // console.log(results)
                this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            });
            return;
        }

        // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'lastName') {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
            return;
        }

        // If more than one field is filled, filter from prevResults
        if (this.prevResults.length > 0) {
            this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
        } else if (changedField === 'firstName' || changedField === 'mobileNo') {
            // Fallback: if prevResults is empty, call API with the changed field (if allowed)
            const keyword = this.myForm.get(changedField).value?.trim();
            if (keyword) {
                this._appointmentService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
                    this.prevResults = results || [];
                    this.filteredOptions = this.filterResults(this.prevResults, { firstName, lastName, mobileNo });
                });
            }
        } else {
            // If changedField is LastName and prevResults is empty, do nothing
            this.filteredOptions = [];
        }
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
    resetFilteredOptions() {
        this.filteredOptions = [];
        this.prevResults = [];
    }
    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onChangeDate(value: any) {
        debugger;
        if (value) {
            const inputDate = new Date(value);

            const dateOfReg = new Date(Date.UTC(
                inputDate.getFullYear(),
                inputDate.getMonth(),
                inputDate.getDate()
            ));

            // Optional: Emit localized date and time
            const [datePart, timePart] = dateOfReg
                .toLocaleString("en-US")
                .split(',')
                .map(part => part.trim());

            this.eventEmitForParent(datePart, timePart);

            const isoDateString = dateOfReg.toISOString();
            this.myForm.get('labAppDate').setValue(isoDateString);
        }
    }

    onChangeTime(event: any) {
        this.timeflag = 1;

        if (event) {
            const selectedTime = new Date(event);

            const localeString = selectedTime.toLocaleString("en-US");
            const [datePart, timePart] = localeString.split(',').map(part => part.trim());

            this.isTimeChanged = true;
            this.phdatetime = timePart;
            console.log(this.phdatetime);

            this.myForm.get('labAppTime').setValue(selectedTime);
            this.myForm.get('startTime').setValue(selectedTime);

            this.eventEmitForParent(datePart, timePart);
        }
    }

    onChangeTime1(event: any) {
        this.timeflag = 1;

        if (event) {
            const selectedTime = new Date(event);

            const localeString = selectedTime.toLocaleString("en-US");
            const [datePart, timePart] = localeString.split(',').map(part => part.trim());

            this.isTimeChanged = true;
            this.phdatetime = timePart;
            console.log(this.phdatetime);
            this.myForm.get('endTime').setValue(selectedTime);
            this.eventEmitForParent(datePart, timePart);
        }
    }

    eventEmitForParent(actualDate, actualTime) {
        const localaDateValues = actualDate.split('/');
        const localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
        this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
    }

  OnSubmit() {
    debugger
    this.myForm.get('appDate').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd'));
    this.myForm.get('appTime').setValue(this.datePipe.transform(this.now, 'HH:mm'));
    this.myForm.get('labPatRegId').setValue(this.VlabPatRegId ?? 0);
    this.myForm.get('stateId').setValue(this.stateId)
    this.myForm.get('countryId').setValue(String(this.counryId))
    console.log(this.myForm.value);

    if (!this.myForm.invalid) {
      this._appointmentService.appointmentMasterSave(this.myForm.value).subscribe((response) => {
        this.onClose();
      });
    } else {
      const invalidFields = [];
      if (this.myForm.invalid) {
        for (const controlName in this.myForm.controls) {
          if (this.myForm.controls[controlName].invalid) {
            invalidFields.push(`Appointment Form: ${controlName}`);
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

    onClose() {
        this.myForm.reset();
        this.dialogRef.close();
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
                // { name: "required", Message: "Middle Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }
            ],
            lastName: [
                { name: "required", Message: "Last Name is required" },
                // { name: "maxLength", Message: "Enter only upto 50 chars" },
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
            MaritalStatusId: [
                { Message: "Mstatus Name is required" }
            ],
            UnitId: [
                { name: "required", Message: "Unit Name is required" }
            ]
        };
    }
}
