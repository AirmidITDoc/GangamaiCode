import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, FormGroup, Validators, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../appointmentlist.service';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { MatStepper } from '@angular/material/stepper';
import Swal from 'sweetalert2';
import { MatTableDataSource } from '@angular/material/table';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Router } from '@angular/router';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RegInsert } from '../../registration/registration.component';
import { fuseAnimations } from '@fuse/animations';
import { ImageViewComponent } from '../image-view/image-view.component';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PatientvitalInformationComponent } from './patientvital-information/patientvital-information.component';
import { values } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',
    styleUrls: ['./new-appointment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class NewAppointmentComponent implements OnInit {
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }

    dateStyle?: string = 'Date';
    personalFormGroup: FormGroup;
    VisitFormGroup: FormGroup;
    searchFormGroup: FormGroup;
    currentDate = new Date();

    registerObj = new RegInsert({});
    isRegSearchDisabled: boolean = false;
    Regdisplay: boolean = false;
    Regflag: boolean = false;
    submitted = false;
    isLinear = true;
    showtable: boolean = false;
    isRateLimitReached = false;
    isLoadings = false;
    isOpen = false;
    savedValue: number = null;
    noOptionFound: boolean = false;
    noOptionFound1: boolean = false;
    AdList: boolean = false;
    chkprint: boolean = false;
    VisitFlagDisp: boolean = false;
    hasSelectedContacts: boolean;
    isCompanySelected: boolean = false;
    IsPhoneAppflag: boolean = true;

    loadID = 0;
    VisitTime: String;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    capturedImage: any;
    VisitID: any;
    msg: any;
    registration: any;
    newRegSelected: any = 'registration';
    Patientnewold: any = 1;
    IsPathRad: any;
    PatientName: any = '';
    RegId: any = 0;
    OPIP: any = '';
    VisitId = 0;
    patienttype = 0
    UnitId = 1;
    ClassId = 1;
    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;

    RegOrPhoneflag = '';
    vPhoneFlage = 0;
    vPhoneAppId: any;
    RegNo = 0;
    departmentId: any;
    DosctorId: any;
    DoctorId: any;
    vhealthCardNo: any;
    Healthcardflag: boolean = false;
    vDays: any = 0;
    HealthCardExpDate: any;
    followUpDate: string;
    ageYear="0"
    ageMonth="0"
    ageDay="0"

    screenFromString = 'appointment';
    @ViewChild('attachments') attachment: any;
    @ViewChild('ddlGender') ddlGender: AirmidDropDownComponent;
    @ViewChild('ddlState') ddlState: AirmidDropDownComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidDropDownComponent;
    @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;


    menuActions: Array<string> = [];

    // New Api
    autocompleteModeprefix: string = "Prefix";
    autocompleteModegender: string = "Gender";
    autocompleteModearea: string = "Area";
    autocompleteModecity: string = "City";
    autocompleteModestate: string = "State";
    autocompleteModecountry: string = "Country";
    autocompleteModemstatus: string = "MaritalStatus";
    autocompleteModereligion: string = "Religion";

    autocompleteModeunit: string = "Hospital";
    autocompleteModepatienttype: string = "PatientType";
    autocompleteModetariff: string = "Tariff";
    autocompleteModecompany: string = "Company";
    autocompleteModesubcompany: string = "SubCompany";
    autocompletedepartment: string = "Department";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModepurpose: string = "Purpose";
    autocompleteModeClass: string = "Class";

    public imagePreview!: string;

    constructor(
        public _AppointmentlistService: AppointmentlistService,
        private _formBuilder: UntypedFormBuilder,
        public dialogRef: MatDialogRef<NewAppointmentComponent>,
        public _matDialog: MatDialog,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        private accountService: AuthenticationService,
        public matDialog: MatDialog,
        private commonService: PrintserviceService,
        public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

    ) {

    }
    ngOnInit(): void {

        this.personalFormGroup = this.createPesonalForm();
        this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
        this.personalFormGroup.markAllAsTouched();
        this.VisitFormGroup.markAllAsTouched();

        this.searchFormGroup = this.createSearchForm();

    }
    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: [''],
            UnitId: [1]
        });
    }
    onChangeReg(event) {
        //
        if (event.value == 'registration') {
            this.personalFormGroup.reset();
            this.personalFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = false;

            this.personalFormGroup = this.createPesonalForm();

            this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
            // // this.Regdisplay = false;
            // this.showtable = false;
            this.Regflag = false;
            this.IsPhoneAppflag = true;

        } else if (event.value == 'registrered') {

            this.personalFormGroup.get('RegId').enable();
            this.searchFormGroup.get('RegId').enable();
            this.searchFormGroup.get('RegId').reset();
            this.personalFormGroup.reset();
            this.Patientnewold = 2;

            this.personalFormGroup = this.createPesonalForm();
            this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();

            this.Regflag = true;
            this.IsPhoneAppflag = false;
            this.isRegSearchDisabled = true;
        }

        this.personalFormGroup.markAllAsTouched();
        this.VisitFormGroup.markAllAsTouched();

    }
    OnViewReportPdf(element) {
        this.commonService.Onprint("VisitId", element, "AppointmentReceipt");
    }

    onChangePatient(value) {

        var mode = "Company"
        if (value.text != "Self") {
            this._AppointmentlistService.getMaster(mode, 1);
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.text == "Self") {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('CompanyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
            this.patienttype = 1;
        }


    }


    getregdetails() {

        let RegId = this.searchFormGroup.get("RegId").value
        if (RegId > 0) {
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                });
            }, 500);
        }
        else {
            this.searchFormGroup.reset();

        }
    }


    Appointdetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;

        this.Vtotalcount;

        for (var i = 0; i < data.length; i++) {
            if (data[i].PatientOldNew == 1) {
                this.VNewcount = this.VNewcount + 1;
            }
            else if (data[i].PatientOldNew == 2) {
                this.VFollowupcount = this.VFollowupcount + 1;
            }
            if (data[i].MPbillNo == 1 || data[i].MPbillNo == 2) {
                this.VBillcount = this.VBillcount + 1;
            }
            if (data[i].CrossConsulFlag == 1) {
                this.VCrossConscount = this.VCrossConscount + 1;
            }

            this.Vtotalcount = this.Vtotalcount + 1;
        }

    }


    WhatsAppAppointmentSend(el, vmono) {
        var m_data = {
            "insertWhatsappsmsInfo": {
                "mobileNumber": vmono || 0,
                "smsString": '',
                "isSent": 0,
                "smsType": 'Appointment',
                "smsFlag": 0,
                "smsDate": this.currentDate,
                "tranNo": el,
                "PatientType": 2,//el.PatientType,
                "templateId": 0,
                "smSurl": "info@gmail.com",
                "filePath": '',
                "smsOutGoingID": 0
            }
        }
        this._WhatsAppEmailService.InsertWhatsappSales(m_data).subscribe(response => {
            if (response) {
                this.toastr.success('Bill Sent on WhatsApp Successfully.', 'Save !', {
                    toastClass: 'tostr-tost custom-toast-success',
                });
            } else {
                this.toastr.error('API Error!', 'Error WhatsApp!', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
        // this.IsLoading = false;
    }

    // getOptionText(option) {
    //     if (!option) return '';
    //     return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
    // }

    getSelectedObj(obj) {
        this.PatientName = obj.PatientName;
        this.RegId = obj.value;
        this.VisitFlagDisp = true;
        if ((this.RegId ?? 0) > 0) {
            console.log(this.data)
            setTimeout(() => {
                this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                });

            }, 500);
        }

    }
    getSelectedObjphone(obj) {

        this.PatientName = obj.text;
        this.RegId = obj.value;
        this.vPhoneAppId = obj.value;
        this.VisitFlagDisp = false;
        this.registerObj = obj;
        console.log(obj)
        if ((this.RegId ?? 0) > 0) {
            setTimeout(() => {
                this._AppointmentlistService.getPhoneappById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    console.log(this.registerObj)
                    this.registerObj.religionId = 0;
                    this.registerObj.areaId = 0
                    this.registerObj.regId = 0
                    this.registerObj.phoneNo = ''
                    this.registerObj.aadharCardNo = ''
                    this.registerObj.mobileNo = this.registerObj.mobileNo.trim()
                });
            }, 500);
        }

    }
   
    onSave() {
// console.log(this.registerObj.dateOfBirth)

        let DateOfBirth1 = this.personalFormGroup.get("DateOfBirth").value
        if (DateOfBirth1) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth1);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.ageYear = String(Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25))
            this.ageMonth = String(Math.abs(todayDate.getMonth() - dob.getMonth()))
            this.ageDay = String(Math.abs(todayDate.getDate() - dob.getDate()))

        }
        if (!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid) {

            if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
                this.toastr.warning('Please select valid Company ', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }

            this.personalFormGroup.get('Age').setValue(this.ageYear)
            this.personalFormGroup.get('AgeYear').setValue(this.ageYear)
            this.personalFormGroup.get('AgeMonth').setValue(this.ageMonth)
            this.personalFormGroup.get('AgeDay').setValue(this.ageDay)

            this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
            this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time)
            this.VisitFormGroup.get('visitDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
            this.VisitFormGroup.get('visitTime').setValue(this.dateTimeObj.time)

            if (this.searchFormGroup.get('regRadio').value == "registration")
                this.OnsaveNewRegister();
            else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                this.onSaveRegistered();
                this.onClose();
            }

        } else {
            let invalidFields = [];
            if (this.personalFormGroup.invalid) {
                for (const controlName in this.personalFormGroup.controls) {
                    if (this.personalFormGroup.controls[controlName].invalid) { invalidFields.push(`Personal Form: ${controlName}`); }
                }
            }
            if (this.VisitFormGroup.invalid) {
                for (const controlName in this.VisitFormGroup.controls) { if (this.VisitFormGroup.controls[controlName].invalid) { invalidFields.push(`Visit Form: ${controlName}`); } }
            }

            if (invalidFields.length > 0) {
                invalidFields.forEach(field => { this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',); });
            }

        }
    }

    OnsaveNewRegister() {
        console.log(this.personalFormGroup.value)
        this.personalFormGroup.get("RegId").setValue(0)
        this.VisitFormGroup.get("regId").setValue(0)
        if (this.vPhoneAppId)
            this.VisitFormGroup.get("phoneAppId").setValue(this.vPhoneAppId)

        let submitData = {
            "registration": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        };
        console.log(submitData);

        this._AppointmentlistService.NewappointmentSave(submitData).subscribe((response) => {
            this.toastr.success(response.message);
            this.OnViewReportPdf(response)
            this.onClear(true);
            this._matDialog.closeAll();
        });
    }

    onSaveRegistered() {
        this.VisitFormGroup.get("regId").setValue(this.registerObj.regId)
        this.VisitFormGroup.get("patientOldNew").setValue(2)
        let submitData = {
            "appReistrationUpdate": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        };
        console.log(submitData);

        this._AppointmentlistService.RregisteredappointmentSave(submitData).subscribe((response) => {
            this.toastr.success(response.message);
            if (response) {
                this.OnViewReportPdf(response)
                this.onClear(true);
                this._matDialog.closeAll();
            }
        });


    }

    

    chkHealthcard(event) {
        if (event.checked) {
            this.Healthcardflag = true;
            this.personalFormGroup.get('HealthCardNo').setValidators([Validators.required]);
        } else {
            this.Healthcardflag = false;
            this.personalFormGroup.get('HealthCardNo').reset();
            this.personalFormGroup.get('HealthCardNo').clearValidators();
            this.personalFormGroup.get('HealthCardNo').updateValueAndValidity();
        }
    }


    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangecity(e) {
       this.registerObj.stateId = e.stateId
        this._AppointmentlistService.getstateId(e.stateId).subscribe((Response) => {
            console.log(Response)
            this.ddlCountry.SetSelection(Response.countryId);
        });

    }

    onChangestate(e) {
    }
    getVisitRecord(row) {
        this.departmentId = row.DepartmentId;
        this.DosctorId = row.DoctorId;
        this.VisitFlagDisp = false;
    }

    selectChangedepartment(obj: any) {

        console.log(obj)
        this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
            this.ddlDoctor.options = data;
            this.ddlDoctor.bindGridAutoComplete();
        });
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
            CompanyId: [
                { name: "required", Message: "Company Name is required" }
            ],
            SubCompanyId: [
                { name: "required", Message: "SubCompany Name is required" }
            ],
            bedId: [
                { name: "required", Message: "Bed Name is required" }
            ],
            wardId: [
                { name: "required", Message: "Ward Name is required" }
            ],


        };
    }
    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }

    onClose() {
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
    openCamera(type: string, place: string) {
        const dialogRef = this.matDialog.open(ImageViewComponent,
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


    createPesonalForm() {
        return this._formBuilder.group({
            RegId: [0],
            RegNo: "0",
            PrefixId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"), 
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            LastName: ['', [
                Validators.required,
                // Validators.pattern("^[A-Za-z0-9 () ] *[a-zA-Z0-9 () ]*[0-9 ]*$"),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: new FormControl('', [Validators.required, notEmptyOrZeroValidator()]),
            Address: '',
            DateOfBirth: [(new Date()).toISOString()],
            Age: ['0'],
            AgeYear: ['0', [
                // Validators.required,
                Validators.maxLength(3),
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['0', [
                Validators.pattern("^[0-9]*$")]],
            AgeDay: ['0', [
                Validators.pattern("^[0-9]*$")]],
            PhoneNo: ['', [Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
            ]],
            aadharCardNo: ['', [
                Validators.minLength(12),
                Validators.maxLength(12),
                Validators.pattern("^[0-9]*$")
            ]],

            panCardNo: '',
            MaritalStatusId: 0,
            ReligionId: 0,
            AreaId: 0,
            CityId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            City: [''],
            StateId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            CountryId:[0, [Validators.required, notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: this.accountService.currentUserValue.userId,
            updatedBy: this.accountService.currentUserValue.userId,
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: ['']

        });

    }

}
function notEmptyOrZeroValidator(): any {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;
        return value > 0 ? null : { greaterThanZero: { value: value } };
      };
}