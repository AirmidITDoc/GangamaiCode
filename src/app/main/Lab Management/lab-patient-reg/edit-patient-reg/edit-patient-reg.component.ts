import { DatePipe } from '@angular/common';
import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
// import { AdvanceDetailObj, ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { ApiCaller } from 'app/core/services/apiCaller';
import { ConfigService } from 'app/core/services/config.service';
import { HospitalConfigService } from 'app/core/services/hospital-config.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { LabPatientList } from '../lab-patient-reg.component';
import { LabPatientRegService } from '../lab-patient-reg.service';

@Component({
    selector: 'app-edit-patient-reg',
    templateUrl: './edit-patient-reg.component.html',
    styleUrls: ['./edit-patient-reg.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class EditPatientRegComponent {
    myForm: FormGroup
    abhaForm: FormGroup;
    FinalForm: FormGroup;
    screenFromString = 'ExternalLab-form';
    registerObj = new LabPatientList({});

    autocompleteModepatienttype: string = "PatientType";
    autocompleteModegender: string = "Gender";
    autocompleteModecountry: string = "Country";
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
    autocompleteModeLabPatientType: string = "LabPatientType";

    vFirstNameConfig: any;
    vmiddleNameConfig: any;
    vlastNameConfig: any;
    patientTypeList: any = [];
    VlabPatRegId: any;
    vTariffId: any = 1;
    vClassId: any = 1;
    dateTimeObj: any;
    isExpanded2 = false;

    isCompanySelected: boolean = false;
    isTariffSelect: boolean = false;
    patienttype = 0
    UnitId: any = this.accountService.currentUserValue.user.unitId;
    vRefDocId: any = 0
    vRefDocName: any = ''
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
    doctorID = 0
    refDocID = 0

    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
    @ViewChild('ddlcompanyExec') ddlcompanyExec: AirmidDropDownComponent;

    constructor(public _labPatientRegService: LabPatientRegService,
        public _matDialog: MatDialog,
        public dialogRef: MatDialogRef<EditPatientRegComponent>,
        public datePipe: DatePipe,
        private commonService: PrintserviceService,
        public _formbuilder: UntypedFormBuilder,
        private _FormvalidationserviceService: FormvalidationserviceService,
        private accountService: AuthenticationService,
        private hospitalconfigservice: HospitalConfigService,
        public toastrService: ToastrService, public _ConfigService: ConfigService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private _configue: ConfigService,
        private apiCaller: ApiCaller,
    ) { }

    ngOnInit(): void {
        this.myForm = this.CreateMyForm();
        this.myForm.markAllAsTouched();
        this.FinalForm = this.createFinalFormView();

        this.abhaForm = this._labPatientRegService.createAbhadetailForm();

        const Type = 'LabPatientType'
        this._labPatientRegService.getPatientType(Type).subscribe(res => {
            this.patientTypeList = res;
            const normalType = this.patientTypeList.find(
                (item: any) => item.name === 'Normal'
            );

            if (normalType) {
                this.FinalForm.get('patientType')?.setValue(normalType.constantId);
            }
        });

        this.FinalForm.get('Comments').setValue(this.data?.comments);
        this.FinalForm.get('ReferByName').setValue(this.data?.referByName);
        this.FinalForm.get('tariffId').setValue(this.data?.tariffId ?? 1);
        this.FinalForm.get('doctorId').setValue(this.data?.doctorId);

        console.log("retrive Data:", this.data)

        if (this.data?.patientType1 == "Self") {
            this.FinalForm.get('refDocId').enable()
            this.FinalForm.get('refDocId').setValue(this.data?.refDocId);
            this.FinalForm.get('patientTypeId').setValue(this.data?.patientTypeId1);
            this.FinalForm.get('companyId').disable()
            this.FinalForm.get('companyId').setValue(0)
        } else {
            this.FinalForm.get('companyId').enable()
            this.FinalForm.get('companyId').setValue(this.data?.companyId);
            this.FinalForm.get('patientTypeId').setValue(this.data?.patientTypeId1);
            this.FinalForm.get('refDocId').disable()
            this.FinalForm.get('refDocId').setValue(0)
        }

        this.VlabPatRegId = this.data.labPatRegId
        this.labPatientId = this.data.labPatientId

        if (this.data?.labPatRegId) {
            this._labPatientRegService.getLabRegistraionById(this.data?.labPatRegId).subscribe((response) => {
                this.registerObj = response;
                this.doctorID = response.doctorId
                this.refDocID = response.refDocId
                console.log("Doc", this.doctorID + '' + "RedDoc", this.refDocID)
                this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log("Master Data:", this.registerObj)
                    // this.myForm.patchValue(this.registerObj)
                    this.myForm.patchValue({
                        ...this.registerObj,
                        firstName: this.registerObj.firstName?.toUpperCase(),
                        middleName: this.registerObj.middleName?.toUpperCase(),
                        lastName: this.registerObj.lastName?.toUpperCase()
                    });
                });
            });
        }

        // console.log(this.hospitalconfigservice.HospitalconfigParams)
        // console.log(this._ConfigService.configParams)

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

    createFinalFormView() {
        return this._formbuilder.group({
            labPatientId: [''],
            unitId: this.accountService.currentUserValue.user.unitId,
            patientTypeId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            tariffId: [this.vTariffId, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],//this.hospitalconfigservice.HospitalconfigParams?.IPD_Billing_CounterId], // need to ask sir what value to pass
            doctorId: [0],
            refDocId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            companyId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            patientType: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Comments: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            ReferByName: ['', [Validators.maxLength(255), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            modifiedBy: this.accountService.currentUserValue.userId
        });
    }

    CreateMyForm() {
        return this._formbuilder.group({
            LabPatRegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            regDate: [new Date()],
            regTime: [],
            unitId: this.accountService.currentUserValue.user.unitId,
            prefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            firstName: ['', [Validators.required, Validators.maxLength(50)]],
            middleName: ['', [Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$"), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            lastName: ['', [Validators.required, Validators.maxLength(50), Validators.pattern("^[A-Za-z/() ]*$")]],
            genderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(15), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],
            ageYear: ['', [Validators.maxLength(3), Validators.pattern("^[0-9]*$")]],
            ageMonth: ['', [Validators.pattern("^[0-9]*$")]],
            ageDay: ['', [Validators.pattern("^[0-9]*$")]],
            address: ['', [Validators.maxLength(100), this._FormvalidationserviceService.allowEmptyStringValidatorOnly()]],
            adharCardNo: [0, [
                Validators.minLength(12),  //     Validators.minLength(12),
                Validators.maxLength(12), //     Validators.maxLength(12),
                Validators.pattern("^[0-9]*$"),
                this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            cityId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            stateId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            countryId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            modifiedBy: this.accountService.currentUserValue.userId,
        })
    }

    BillSave() {

        Swal.fire({
            title: 'Confirm Save',
            text: 'Are you sure you want to update registration?',
            icon: 'warning', // or 'question'
            showCancelButton: true,
            confirmButtonColor: '#3085d6', // Blue
            cancelButtonColor: '#d33',     // Red
            confirmButtonText: 'Yes, save it!',
            cancelButtonText: 'No, cancel'
        }).then((result) => {
            if (result.isConfirmed) {
                const DateOfBirth1 = this.myForm.get('DateOfBirth')?.value;
                if (DateOfBirth1) {

                    const todayDate = new Date();
                    const dob = new Date(DateOfBirth1);
                    let ageYear = (todayDate.getFullYear() - dob.getFullYear());
                    let ageMonth = (todayDate.getMonth() - dob.getMonth());
                    let ageDay = (todayDate.getDate() - dob.getDate());

                    this.ageYear = ageYear
                    this.ageMonth = ageMonth
                    this.ageDay = ageDay

                    if (ageDay < 0) {
                        (ageMonth)--;
                        const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                        ageDay += previousMonth.getDate();
                    }

                    if (ageMonth < 0) {
                        ageYear--;
                        ageMonth += 12;
                    }
                    if (
                        (!ageYear || ageYear == 0) &&
                        (!ageMonth || ageMonth == 0) &&
                        (!ageDay || ageDay == 0)
                    ) {
                        this.toastrService.warning('Please select the birthdate or enter the age of the patient.', 'Warning!', {
                            toastClass: 'tostr-tost custom-toast-warning',
                        });
                        return;
                    }
                    this.myForm.get('ageYear')?.setValue(String(ageYear), { emitEvent: false });
                    this.myForm.get('ageMonth')?.setValue(String(ageMonth), { emitEvent: false });
                    this.myForm.get('ageDay')?.setValue(String(ageDay), { emitEvent: false });

                }

                this.myForm.get('LabPatRegId').setValue(this.VlabPatRegId);
                this.FinalForm.get('labPatientId').setValue(this.labPatientId);
                this.myForm.get('adharCardNo').setValue('000000000000');

                const payload = {
                    labPatientRegistrationMaster: this.myForm.getRawValue(),
                    labPatientRegModel: this.FinalForm.getRawValue()
                };

                console.log(payload);
                if (!this.myForm.invalid && !this.FinalForm.invalid) {
                    this._labPatientRegService.labPatientSave(payload).subscribe((response) => {
                        this._matDialog.closeAll();
                    });
                }
                else {
                    const invalidFields = [];
                    if (this.myForm.invalid) {
                        for (const controlName in this.myForm.controls) {
                            const control = this.myForm.get(controlName);

                            if (control instanceof FormGroup || control instanceof FormArray) {
                                for (const nestedKey in control.controls) {
                                    if (control.get(nestedKey)?.invalid) {
                                        invalidFields.push(`Lab Register Edit Data : ${controlName}.${nestedKey}`);
                                    }
                                }
                            } else if (control?.invalid) {
                                invalidFields.push(`Lab Register Edit From: ${controlName}`);
                            }
                        }
                    }
                    if (invalidFields.length > 0) {
                        invalidFields.forEach(field => {
                            this.toastrService.warning(`Please Check this field "${field}" is invalid.`, 'Warning',
                            );
                        });
                        return
                    }
                }
            }
        });
    }

    onChangePatient(value) {
        const mode = "Company"
        if (value.text != "Self") {
            this._labPatientRegService.getMaster(mode, 1);
            this.FinalForm.get('companyId').setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
            // this.isCompanySelected = true;
            this.FinalForm.get('companyId').enable()
            this.FinalForm.get('refDocId').setValue(0);
            this.patienttype = 2;
            this.FinalForm.get('refDocId').disable()
            this.FinalForm.get('refDocId').clearValidators();
            this.FinalForm.get('refDocId').updateValueAndValidity();

        } else if (value.text == "Self") {
            // this.isCompanySelected = false;      
            this.patienttype = 1;
            this.FinalForm.get('refDocId').setValidators([Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]);
            this.FinalForm.get('refDocId').enable()
            this.FinalForm.get('companyId').setValue(0);
            this.FinalForm.get('tariffId').setValue(1);
            this.isTariffSelect = false //tariff not readonly
            this.FinalForm.get('companyId').disable()
            this.FinalForm.get('companyId').clearValidators();
            this.FinalForm.get('companyId').updateValueAndValidity();
        }
    }

    onChangeCompany(value) {
        this.companyId = value.companyId
        this.companyName = value.companyName
        if (this.companyId) {
            this.isTariffSelect = true
        }
        this._labPatientRegService.getCompanyById(value.companyId).subscribe((response) => {
            this.companyDet = response;
            this.FinalForm.get('tariffId').setValue(this.companyDet.traiffId);
            this.vTariffId = this.companyDet.traiffId
        });
    }

    onChangeRefdoc(value) {
        this.vRefDocId = value.doctorId
        this.vRefDocName = value.doctorName
        this.FinalForm.get('refDocId').setValue(value.doctorId);
    }

    onChangeTariff(value) {
        this.vTariffId = value.value
    }

    filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string }) {
        const { firstName, lastName, mobileNo } = fields;
        return results.filter(item => {
            return (!firstName || item.firstName?.toLowerCase().includes(firstName.toLowerCase()))
                && (!lastName || item.lastName?.toLowerCase().includes(lastName.toLowerCase()))
                && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
        });
    }

    ChangeToUpperCase(changedField: string) {
        const control = this.myForm.get(changedField);
        if (control && control.value) {
            control.setValue(control.value.toUpperCase(), { emitEvent: false });
        }
    }

    handleInputChange(changedField: string): void {
        // Get all current field values

        const control = this.myForm.get(changedField);
        if (control && control.value) {
            control.setValue(control.value.toUpperCase(), { emitEvent: false });
        }

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
            this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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
                this._labPatientRegService.getlabSuggestions(`LabPatientRegistration/search-patient-1?UnitId=${this.UnitId}&Keyword=`, keyword).subscribe(results => {
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

    prefixName: any;
    onChangePrefix(e) {
        this.prefixName = e.prefixName
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangecity(e) {
        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this.stateId = e.stateId
        this._labPatientRegService.getstateId(e.stateId).subscribe((Response) => {
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
                this._labPatientRegService.getLabRegistraionMasterById(this.VlabPatRegId).subscribe((response) => {
                    console.log(response)
                    this.registerObj = response;
                    this.counryId = response.countryId
                    this.stateId = response.stateId
                    this.value = response.dateofBirth
                    this.regNo = response.labRequestNo
                    this.onChangeDateofBirth(response.dateofBirth)
                    this.regflag = true
                    this.myForm.patchValue({
                        firstName: this.registerObj.firstName.trim().toUpperCase() || '',
                        middleName: this.registerObj.middleName.trim().toUpperCase() || '',
                        lastName: this.registerObj.lastName.trim().toUpperCase() || '',
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
            adharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Aadhaar / National ID is required" }
            ],
            MaritalStatusId: [
                { Message: "Mstatus Name is required" }
            ],
            patientTypeId: [
                { name: "required", Message: "Country Name is required" }
            ],
            tariffId: [
                { name: "required", Message: "Mstatus Name is required" }
            ],
            departmentId: [
                { name: "required", Message: "Department Name is required" }
            ],
            DoctorID: [
                { name: "required", Message: "Doctor Name is required" }
            ],
            refDocId: [
                { name: "required", Message: "Ref Doctor Name is required" }
            ],
            PurposeId: [
                { name: "required", Message: "Purpose Name is required" }
            ],
            companyId: [
                { name: "required", Message: "Company Name is required" }
            ],
            subCompanyId: [
                { name: "required", Message: "SubCompany Name is required" }
            ],
            patientTypeValue: [
                { name: "required", Message: "PatientType is required" }
            ],
            Comments: [
                { name: "pattern", Message: "only char allowed." }
            ],
            ReferByName: [
                { name: "pattern", Message: "only char allowed." }
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
            ],
            UnitId: [
                { name: "required", Message: "Unit Name is required" }
            ],
            ClassId: [
                { name: "required", Message: "Class Name is required" }
            ],
        };
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
    onClose() {
        this.myForm.reset();
        this.FinalForm.reset();
        this.dialogRef.close();
    }
}
