import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ConfigService } from 'app/core/services/config.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { map, Observable, startWith } from 'rxjs';
import Swal from 'sweetalert2';
import { ImageViewComponent } from '../../appointment-list/image-view/image-view.component';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { exists } from 'fs';
// import { PincodeSearchService } from 'app/main/shared/services/pincode-search.service';

@Component({
    selector: 'app-new-registration',
    templateUrl: './new-registration.component.html',
    styleUrls: ['./new-registration.component.scss'],
    // directives: [appCharmaxLength],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [DatePipe]
})
export class NewRegistrationComponent implements OnInit {
    personalFormGroup: FormGroup;
    searchFormGroup: FormGroup;

    screenFromString = 'registration';
    registerObj = new RegInsert({});
    now = Date.now();
    minDate = new Date();
    submitted = false;
    isRegSearchDisabled: boolean = true;
    Submitflag: boolean = false;
    isSaving: boolean = false;
    isEditMode: boolean = false;
    newRegSelected: any = 'registration';
    imagePreview!: string;
    msg: any = [];
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    matDialogRef: any;
    RegID: number = 0;
    regNo: any;
    ageYear = 0;
    ageMonth = 0;
    ageDay = 0;
    CityName = ""
    vFirstNameConfig: any;
    vmiddleNameConfig: any;
    vlastNameConfig: any;
    isProfileData = false;
    abhaForm: FormGroup;
    dateofBirth: any;
    prevResults: any[] = [];
    filteredOptions1: any[] = [];
    ABHAId = 0
    debounceTimers: { [key: string]: any } = {};

    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";
    autocompleteModerelationship: string = "Relationship";


    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;

    constructor(public _registerService: RegistrationService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<NewRegistrationComponent>,
        public datePipe: DatePipe,
        private _formBuilder: UntypedFormBuilder,
        private commonService: PrintserviceService,
        private readonly changeDetectorRef: ChangeDetectorRef,
        public _configue: ConfigService,
        // private _PincodeSearchService: PincodeSearchService
    ) { }

    ngAfterViewChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }
    options: string[]
    filteredOptions: Observable<string[]>;
    Is9_Digit_National_Id: boolean = false;
    pincode = '';
    ngOnInit(): void {


        this.personalFormGroup = this._registerService.createPesonalForm1();
        this.personalFormGroup.markAllAsTouched();
        this.minDate = new Date();

        this.abhaForm = this._registerService.createAbhaform();

        if ((this.data?.regId ?? 0) > 0) {
            setTimeout(() => {
                this._registerService.getRegistraionById(this.data.regId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                    this.isEditMode = true;
                    this.ABHAId = response.abhaTranId
                    this.regNo = this.registerObj.regNo
                    this.pincode = this.registerObj.pinNo
                    this.personalFormGroup.get("RegId").setValue(this.registerObj.regId)
                    this.value = this.registerObj.dateofBirth
                    this.onChangeDateofBirth(this.registerObj.dateofBirth)

                    this._registerService.getAbhaById(this.ABHAId).subscribe((response) => {
                        this.isProfileData = true;
                        this.abhaForm.patchValue({
                            abhaAddress: response.abhaAddress,
                            abhaNumber: response.abhaNumber,
                            abhaFullName: response.abhaFullName,
                            gender: response.gender,
                            yearOfBirth: this.datePipe.transform(response.yearOfBirth, 'yyyy-MM-dd')
                        });
                    });
                });
            }, 500);
        }

        if ((this.data?.abhaTranId ?? 0) > 0) {
            this.isProfileData = true;
            setTimeout(() => {
                this._registerService.getAbhaById(this.data.abhaTranId).subscribe((response) => {
                    console.log('Get ABHA DATA', response)

                    this.abhaForm.patchValue({
                        abhaAddress: response.abhaAddress,
                        abhaNumber: response.abhaNumber,
                        abhaFullName: response.abhaFullName,
                        gender: response.gender,
                        yearOfBirth: this.datePipe.transform(response.yearOfBirth, 'yyyy-MM-dd')
                    });
                });
            }, 500);
        }

        // this data will be common every time when reg form will open from abha
        if (this.data?.profile) {
            this.isProfileData = true;
            console.log('Profile data from ABHA', this.data.profile)

            this.personalFormGroup.patchValue({
                FirstName: this.data.profile.firstName,
                MiddleName: this.data.profile.middleName,
                LastName: this.data.profile.lastName,
                MobileNo: this.data.profile.mobile,
                Address: this.data.profile.address,
                PinNo: this.data.profile.pincode
            });

            this.abhaForm.patchValue({
                abhaAddress: this.data.profile.preferredAbhaAddress,
                abhaNumber: this.data.profile.abhaNumber,
                abhaFullName: this.data.profile.name,
                gender: this.data.profile.gender,
                yearOfBirth: `${this.data.profile.dayOfBirth}-${this.data.profile.monthOfBirth}-${this.data.profile.yearOfBirth}`
            });

            const now = new Date();

            const dobString =
                `${this.data.profile.yearOfBirth}-${String(this.data.profile.monthOfBirth).padStart(2, '0')}-${String(this.data.profile.dayOfBirth).padStart(2, '0')}` +
                `T${String(now.getHours()).padStart(2, '0')}:` +
                `${String(now.getMinutes()).padStart(2, '0')}:` +
                `${String(now.getSeconds()).padStart(2, '0')}`;

            if (dobString) {
                setTimeout(() => {
                    this.registerObj.dateofBirth = new Date(dobString)
                    this.onChangeDateofBirth(this.registerObj.dateofBirth);
                }, 1000);
            }
        }

        // this data will be used only to featch patientid
        if (this.data?.patient) {
            console.log('Patient data from ABHA', this.data?.patient)
            setTimeout(() => {
                this._registerService.getRegistraionById(this.data?.patient?.regId).subscribe((response) => {
                    // this.registerObj = response;
                    console.log("Reg Data:", response)
                    this.regNo = response.regNo
                    this.personalFormGroup.get("RegId").setValue(response.regId)
                });
            }, 500);
        }

        this.filteredOptions = this.personalFormGroup.get('AreaId').valueChanges.pipe(
            startWith(''),
            map(value => this._filter(value)),

        );
        //this code for Mediforte 9 digit national id
        const rawValue = this?._configue?.configParams?.Is9_Digit_NationalId || "";
        const [id, val] = rawValue.includes(":") ? rawValue.split(":") : [null, null];
        this.Is9_Digit_National_Id = id === "1";

        const firstValue = this?._configue?.configParams?.FirstNameMandatory || "";
        const [firstnameid, firstnameval] = rawValue.includes(":") ? firstValue.split(":") : [null, null];
        this.vFirstNameConfig = firstnameid

        const middleValue = this?._configue?.configParams?.MiddleNameMandatory || "";
        const [middlenameid, middlenameval] = rawValue.includes(":") ? middleValue.split(":") : [null, null];
        this.vmiddleNameConfig = middlenameid

        const lastValue = this?._configue?.configParams?.LastNameMandatory || "";
        const [lastnameid, lastnameval] = rawValue.includes(":") ? lastValue.split(":") : [null, null];
        this.vlastNameConfig = lastnameid

        this.setNameValidations();


        // this._PincodeSearchService.getCityFromPincode('413007').subscribe(result => {
        //     console.log(result);
        // })
        // this._PincodeSearchService.getCity(this.pincode).subscribe(result1 => {
        //     console.log(result1);


        // })
    }

    get getAbhaInfo(): FormArray {
        return this.personalFormGroup.get('tPatientAbhaInformations') as FormArray;
    }

    setNameValidations() {
        const fieldConfigs = [
            { field: 'FirstName', config: this.vFirstNameConfig },
            { field: 'MiddleName', config: this.vmiddleNameConfig },
            { field: 'LastName', config: this.vlastNameConfig }
        ];

        fieldConfigs.forEach(item => {
            const ctrl = this.personalFormGroup.get(item.field);
            if (!ctrl) return;

            if (item.config === '1') {
                ctrl.setValidators([Validators.required]);
            } else {
                ctrl.clearValidators();
            }

            ctrl.updateValueAndValidity();
        });
    }

    AreaList: any = [];
    private _filter(value: any): string[] {
        if (value) {
            const filterValue = value && value.AreaName ? value.areaName.toLowerCase() : value.toLowerCase();
            return this.AreaList.filter(option => option.areaName.toLowerCase().includes(filterValue));
        }
    }

    OnSubmit() {
        const DateOfBirth1 = this.personalFormGroup.get("DateOfBirth").value
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

        const Bdate = this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd")
        this.personalFormGroup.get("DateOfBirth").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd"))
        this.personalFormGroup.get('City').setValue(this.CityName)

        this.personalFormGroup.get('Age').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeYear').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeMonth').setValue(String(this.ageMonth))
        this.personalFormGroup.get('AgeDay').setValue(String(this.ageDay))
        this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'));
        this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time);
        this.personalFormGroup.get('medTourismVisaIssueDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaIssueDate").value, "yyyy-MM-dd") || this.registerObj.medTourismVisaIssueDate || '1900-01-01');
        this.personalFormGroup.get('medTourismVisaValidityDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaValidityDate").value, "yyyy-MM-dd") || this.registerObj.medTourismVisaValidityDate || '1900-01-01');
        this.personalFormGroup.get('medTourismDateOfEntry').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismDateOfEntry").value, "yyyy-MM-dd") || this.registerObj.medTourismDateOfEntry || '1900-01-01');

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

        // const abhaNumber = this.abhaForm.get('abhaNumber')?.value;

        // if (!abhaNumber || abhaNumber.trim() === '') {
        //     this.personalFormGroup.removeControl('tPatientAbhaInformations');
        // }
        // else {
        this.getAbhaInfo.clear();

        const hasAbha = !!this.abhaForm.get('abhaNumber')?.value;
        const dob = this.abhaForm.get('yearOfBirth')?.value;

        let formattedDob = '';

        if (dob) {
            const [day, month, year] = dob.split('-');
            formattedDob = `${year}-${month}-${day}`;
        }

        this.getAbhaInfo.push(
            this._formBuilder.group({
                abhaTranId: [this.abhaForm.get('abhaTranId')?.value],
                regId: [this.abhaForm.get('regId')?.value],
                abhaAddress: [this.abhaForm.get('abhaAddress')?.value],
                abhaNumber: [this.abhaForm.get('abhaNumber')?.value],
                abhaFullName: [this.abhaForm.get('abhaFullName')?.value],
                gender: [this.abhaForm.get('gender')?.value],
                yearOfBirth: [hasAbha ? formattedDob : '1900-01-01'],
                verified: [hasAbha],
                isActive: [hasAbha],
                verifiedDateTime: [hasAbha ? new Date() : "1900-01-01"],
                createdBy: [this.accountService.currentUserValue.userId]
            })
        );
        // }

        if (this.personalFormGroup.valid) {
            this.personalFormGroup.get('aadharCardNo').setValue(this.personalFormGroup.get('aadharCardNo')?.value || this.registerObj.aadharCardNo || '');
            this.personalFormGroup.get('emgAadharCardNo').setValue(this.aadharRaw1 || this.registerObj.emgAadharCardNo || '');
            console.log(this.personalFormGroup.get('aadharCardNo').value)
            this.personalFormGroup.removeControl('IsNRI')

            console.log(this.personalFormGroup.value)

            this._registerService.RegstrationtSaveData(this.personalFormGroup.value).subscribe((response) => {
                this.onClear(true);
                if (response)
                    this.OnPrint(response);
            });
        } else {
            const invalidFields = [];

            if (this.personalFormGroup.invalid) {
                for (const controlName in this.personalFormGroup.controls) {
                    if (this.personalFormGroup.controls[controlName].invalid) {
                        invalidFields.push(`Registartion Form: ${controlName}`);
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
    chkChange() {
        if (this.registerObj.dateOfBirth > this.minDate) {
            this.toastr.warning('Enter Proper Birth Date', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }
    openCamera(type: string, place: string) {
        const dialogRef = this._matDialog.open(ImageViewComponent,
            {
                width: '750px',
                height: '550px',

                data: {
                    docData: type == 'camera' ? 'camera' : '',
                    type: type == 'camera' ? 'camera' : '',
                    place: place
                }
            }
        );
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (place == "photo") {
                    this.imagePreview = result.url;
                }
                else {
                    // this.imgArr.push(result.name);
                    // this.images.push(result);
                    // this.imgDataSource.data = this.images;
                }
            }
        });
    }

    onChangedate(event) {
        // 
        const selectedDate = new Date(event);
        const vday = this.personalFormGroup.get("medTourismVisaIssueDate").value

        // selectedDate.setHours(0, 0, 0, 0);
        // vday.setHours(0, 0, 0, 0);
        if (selectedDate < vday)
            Swal.fire("VisaValidity Date Shoud Be Greater than IssueDate !........")
        return;
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
        this.dialogRef.close();
    }
    OnPrint(Param) {
        this.commonService.Onprint("RegId", Param.regId, "RegistrationForm");
    }
    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }

    // Change Registered or New Registration
    onChangeReg(event) {
        if (event.value == 'registration') {
            this.registerObj = new RegInsert({});
            this.personalFormGroup.reset();
            this.searchFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = true;
        } else {
            this.searchFormGroup.get('RegId').enable();
            this.isRegSearchDisabled = false;
            // this.personalFormGroup.reset();
        }

    }

    onChangestate(e) {
    }

    onChangecity(e) {
        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this._registerService.getstateId(e.stateId).subscribe((Response) => {
            this.ddlCountry.SetSelection(Response.countryId);
        });

    }

    getValidationMessages() {
        const maxLen = this.Is9_Digit_National_Id ? 9 : 12;
        const minLen = this.Is9_Digit_National_Id ? 7 : 12;

        return {
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
                { name: "minLength", Message: "10 digit required." },
                { name: "maxLength", Message: "More than 10 digits not allowed." }

            ],
            // aadharCardNo: [
            //     // { name: "pattern", Message: "Only numbers allowed" },
            //     { name: "required", Message: "AAdharcard No is required" },
            //     { name: "minLength", Message: "12 digit required." },
            //     { name: "maxLength", Message: "More than 12 digits not allowed." }

            // ],
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "Aadhaar / National ID is required" },
                // { name: "minLength", Message: `Minimum ${minLen} digits required.` },
                // { name: "maxLength", Message: `More than ${maxLen} digits not allowed.` }
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
            emgContactPersonName: [
                { name: "maxLength", Message: "Enter only upto 50 chars" },
                { name: "pattern", Message: "only char allowed." }],
            EmailId: [
                { name: "pattern", Message: "Enter valid Email Address" }
            ],
            PinNo: []
        };
    }


    area = ''
    onChangeArea(event) {
        console.log(event)
        debugger
        if (event.cityId) {
            this.pincode = event.pincode
            this.CityName = event.cityName
            this.area = event.area
            this.personalFormGroup.get('CityId').setValue(event.cityId)

            this.onChangecityDD(event.cityId)
        }
    }


    onChangePincode(obj: string) {
        // Call API only when exactly 6 digits are entered
        if (obj && obj.length === 6) {
            this._registerService.getbypincode(obj).subscribe((data: any) => {
                if (data && data.length > 0) {
                    console.log(data);

                    this.CityName = data[0].cityName;
                    this.area = data[0].area;

                    this.personalFormGroup.get('AreaId').setValue(data[0].areaId);
                    // this.personalFormGroup.get('CityId').setValue(data[0].cityId);

                    this.onChangecityDD(data[0].cityId);
                    this.registerObj.cityId = data[0].cityId;
                } else {
                    Swal.fire("Pincode does not exist.")
                }
            });
        }
    }
    onChangecityDD(obj) {
        debugger
        this._registerService.getstatebypincode(obj).subscribe((data: any) => {
            console.log(data)

            this.registerObj.stateId = data.stateId
            this._registerService.getstateId(data.stateId).subscribe((Response) => {
                this.ddlCountry.SetSelection(Response.countryId);
            });
        });
    }


    value = new Date()
    onChangeDateofBirth(DateOfBirth: Date | string) {
        debugger
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
            this.value = new Date(DateOfBirth);
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
        }
    }

    areaList: any[] = [];


    CalcDOB(mode, e) {
        // 
        const d = new Date();
        if (mode == "Day") {
            d.setDate(d.getDate() - Number(e.target.value));
            this.value = d;
            this.ageDay = Number(e.target.value);
        }
        else if (mode == "Month") {
            d.setMonth(d.getMonth() - Number(e.target.value));
            this.value = d;
            this.ageMonth = Number(e.target.value);
        }
        else if (mode == "Year") {
            d.setFullYear(d.getFullYear() - Number(e.target.value));
            this.value = d;
            this.ageYear = Number(e.target.value);
        }
        this.personalFormGroup.controls["DateOfBirth"].setValue(d);

        if (this.ageYear > 110) {
            this.ageYear = 0
            // Swal.fire("Please Enter Valid BirthDate..")
            this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }

    getDate(dateStr: string) {
        const dtStr = dateStr.split('-');
        const newDate = dtStr[1] + '/' + dtStr[0] + '/' + dtStr[2];
        return new Date(newDate);
    }
    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    aadharRaw = '';
    aadharRaw1 = '';

    onAadhaarInput(e: any) {
        const v = (e.target.value || '').replace(/\D/g, '').slice(0, 12); // only digits
        this.aadharRaw = v;

        const displayValue = (v.length === 12)
            ? 'xxxxxxxx' + v.slice(-4)
            : v;
        this.personalFormGroup.get('aadharCardNo')?.setValue(displayValue, { emitEvent: false });
    }
    onAadhaarInput1(e: any) {
        const v = (e.target.value || '').replace(/\D/g, '').slice(0, 12); // only digits
        this.aadharRaw1 = v;

        const displayValue = (v.length === 12)
            ? 'xxxxxxxx' + v.slice(-4)
            : v;
        this.personalFormGroup.get('emgAadharCardNo')?.setValue(displayValue, { emitEvent: false });
    }

    handleInputChange(changedField: string): void {
        // Get all current field values
        const firstName = this.personalFormGroup.get('FirstName').value?.trim() || '';
        const middleName = this.personalFormGroup.get('MiddleName').value?.trim() || '';
        const lastName = this.personalFormGroup.get('LastName').value?.trim() || '';
        const mobileNo = this.personalFormGroup.get('MobileNo').value?.trim() || '';

        // If all fields are empty, clear everything
        if (!firstName && !lastName && !mobileNo && !middleName) {
            this.resetFilteredOptions();
            return;
        }

        // Count how many fields are filled
        const filledFields = [firstName, mobileNo].filter(Boolean).length;

        // If only one field is filled, and it's FirstName or MobileNo, call API
        if (filledFields === 1 && (changedField === 'FirstName' || changedField === 'MobileNo')) {
            const keyword = firstName || mobileNo;
            this._registerService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                this.prevResults = results || [];
                this.filteredOptions1 = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            });
            return;
        }

        // If only one field is filled, and it's LastName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'LastName') {
            this.filteredOptions1 = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            return;
        }
        // If only one field is filled, and it's MiddleName, just filter prevResults (do not call API)
        if (filledFields === 1 && changedField === 'MiddleName') {
            this.filteredOptions1 = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
            return;
        }

        // If more than one field is filled, filter from prevResults
        if (this.prevResults.length > 0) {
            this.filteredOptions1 = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
        } else if (changedField === 'FirstName' || changedField === 'MobileNo') {
            // Fallback: if prevResults is empty, call API with the changed field (if allowed)
            const keyword = this.personalFormGroup.get(changedField).value?.trim();
            if (keyword) {
                this._registerService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
                    this.prevResults = results || [];
                    this.filteredOptions1 = this.filterResults(this.prevResults, { firstName, lastName, mobileNo, middleName });
                });
            }
        } else {
            // If changedField is LastName and prevResults is empty, do nothing
            this.filteredOptions1 = [];
        }
    }

    // Helper function to filter results by all non-empty fields
    filterResults(results: any[], fields: { firstName: string, lastName: string, mobileNo: string, middleName: string }) {
        const { firstName, lastName, mobileNo, middleName } = fields;
        return results.filter(item => {
            return (!firstName || item.patientName?.toLowerCase().includes(firstName.toLowerCase()))
                && (!lastName || item.patientName?.toLowerCase().includes(lastName.toLowerCase()))
                && (!middleName || item.patientName?.toLowerCase().includes(middleName.toLowerCase()))
                && (!mobileNo || item.mobileNo?.startsWith(mobileNo));
        });
    }
    onSelectPatient(row: any) {
        this.getSelectedObj(row);
        this.resetFilteredOptions();
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
    resetFilteredOptions() {
        this.filteredOptions1 = [];
        this.prevResults = [];
    }

    getSelectedObj(obj) {

        if ((obj?.regId ?? 0) > 0) {
            setTimeout(() => {
                this._registerService.getRegistraionById(obj?.regId).subscribe((response) => {
                    this.registerObj = response;
                    this.pincode = response.pinNo || ''
                    console.log(this.registerObj)
                    this.isEditMode = true;
                    this.regNo = this.registerObj.regNo
                    this.personalFormGroup.get("RegId").setValue(this.registerObj.regId)
                    this.value = this.registerObj.dateofBirth
                    this.onChangeDateofBirth(this.registerObj.dateofBirth)
                });
            }, 500);

        }
    }

}