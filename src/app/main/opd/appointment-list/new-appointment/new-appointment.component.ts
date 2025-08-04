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
import { RegInsert } from '../../registration/registration.component';
import { AppointmentlistService } from '../appointmentlist.service';
import { ImageViewComponent } from '../image-view/image-view.component';
import { PreviousDeptListComponent } from '../update-reg-patient-info/previous-dept-list/previous-dept-list.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import Swal from 'sweetalert2';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ConfigService } from 'app/core/services/config.service';
import { MatTableDataSource } from '@angular/material/table';
import { VisitMaster1 } from '../appointment-list.component';
import { AreaMasterComponent } from 'app/main/setup/PersonalDetails/area-master/area-master.component';
import { NewAreaComponent } from 'app/main/setup/PersonalDetails/area-master/new-area/new-area.component';

@Component({
    selector: 'app-new-appointment',
    templateUrl: './new-appointment.component.html',  //'<app-form-validation  [formGroup]="personalFormGroup"></app-form-validation >',

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
    abhaForm: FormGroup;

    currentDate = new Date();
    minDate = new Date();
    registerObj = new RegInsert({});
    isRegSearchDisabled: boolean = false;
    Regdisplay: boolean = false;
    Regflag: boolean = false;
    showtable: boolean = false;
    savedValue: number = null;
    VisitFlagDisp: boolean = false;
    hasSelectedContacts: boolean;
    isCompanySelected: boolean = false;
    IsPhoneAppflag: boolean = true;
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
    CityName = ""
    RegOrPhoneflag = '';
    vPhoneFlage = 0;
    vPhoneAppId: any = 0;
    RegNo = 0;
    departmentId: any;
    DosctorId: any;
    DoctorId: any;
    vhealthCardNo: any;
    vDays: any = 0;
    HealthCardExpDate: any;
    followUpDate: string;
    ageYear = 0
    ageMonth = 0
    ageDay = 0
 value=new Date()
    // <mat-expansion-panel> default to closed,
    isExpanded = false; // Defaults to closed

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
    autocompleteModerelationship: string = "Relationship";
    autocompleteModecamp: string = "CampMaster";
    selectedTabIndex = 0;
    imagePreview!: string;
    sidebarName = 'patient-sidebar';
    prevResults: any[] = [];
    filteredOptions: any[] = [];
    debounceTimers: { [key: string]: any } = {};
    showEmergencyFlag: boolean = false;
    EmgId: any;

     

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
         private _configue: ConfigService,
        private _FormvalidationserviceService: FormvalidationserviceService,
        public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

    ) { }
    FromRegistration: any;
    chkregisterd: boolean = false;
    ngOnInit(): void {

      console.log(this._configue.configParams.OPDDefaultDepartment)
       console.log(this._configue.configParams.OPDDefaultDoctor)


        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAllAsTouched();

        this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
        this.VisitFormGroup.markAllAsTouched();

        this.abhaForm = this._AppointmentlistService.createAbhadetailForm();

        this.searchFormGroup = this.createSearchForm();

        if (this.data) {
            this.FromRegistration = this.data?.Obj
            // console.log(this.FromRegistration) 
            if (this.data?.FormName == 'Registration-Page' || this.data?.FormName == 'Registration-Dropdown') {
                this.chkregisterd = true
                this.searchFormGroup.get('regRadio').setValue('registrered')
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
                //this.registerObj = this.FromRegistration;
                this.getSelectedObj(this.FromRegistration)
            }
        }

        if ((this.data?.emgId) > 0) {
            this.showEmergencyFlag = true
            this._AppointmentlistService.getEmergencyById(this.data.emgId).subscribe((response) => {
                this.registerObj = response;
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
                this.selectChangedepartment(this.registerObj)
            });
        }

        this.VisitFormGroup.get("DepartmentId").setValue(this._configue.configParams.OPDDefaultDepartment)
        this.VisitFormGroup.get("ConsultantDocId").setValue(this._configue.configParams.OPDDefaultDoctor)
       
    }
    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: [''],
            UnitId: [this.accountService.currentUserValue.user.unitId]
        });
    }
    // onChangeReg(event) {
    //     //
    //     if (event.value == 'registration') {
    //         this.personalFormGroup.reset();
    //         this.personalFormGroup.get('RegId').reset();
    //         this.searchFormGroup.get('RegId').disable();
    //         this.isRegSearchDisabled = false;
    //         this.Patientnewold = 1;

    //         this.personalFormGroup = this.createPesonalForm();
    //         this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();
    //         this.Regflag = false;
    //         this.IsPhoneAppflag = true;

    //     } else if (event.value == 'registrered') {

    //         this.personalFormGroup.get('RegId').enable();
    //         this.searchFormGroup.get('RegId').enable();
    //         this.searchFormGroup.get('RegId').reset();
    //         this.personalFormGroup.reset();
    //         this.Patientnewold = 2;

    //         this.personalFormGroup = this.createPesonalForm();
    //         this.VisitFormGroup = this._AppointmentlistService.createVisitdetailForm();

    //         this.Regflag = true;
    //         this.IsPhoneAppflag = false;
    //         this.isRegSearchDisabled = true;
    //     }

    //     this.personalFormGroup.markAllAsTouched();
    //     this.VisitFormGroup.markAllAsTouched();

    // }

    onChangeReg(event) {
        if (event.value === 'registration') {
            this.personalFormGroup.reset();
            this.personalFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = false;
            this.Patientnewold = 1;

            // Instead of reassigning, update controls one by one
            const newPersonalForm = this.createPesonalForm();
            this.resetFilteredOptions();
            Object.keys(newPersonalForm.controls).forEach(key => {
                if (this.personalFormGroup.contains(key)) {
                    this.personalFormGroup.setControl(key, newPersonalForm.get(key));
                } else {
                    this.personalFormGroup.addControl(key, newPersonalForm.get(key));
                }
            });

            const newVisitForm = this._AppointmentlistService.createVisitdetailForm();
            Object.keys(newVisitForm.controls).forEach(key => {
                if (this.VisitFormGroup.contains(key)) {
                    this.VisitFormGroup.setControl(key, newVisitForm.get(key));
                } else {
                    this.VisitFormGroup.addControl(key, newVisitForm.get(key));
                }
            });

            this.personalFormGroup.markAllAsTouched();
            this.VisitFormGroup.markAllAsTouched();

            this.Regflag = false;
            this.IsPhoneAppflag = true;

        } else if (event.value === 'registrered') {

            this.personalFormGroup.get('RegId').enable();
            this.searchFormGroup.get('RegId').enable();
            this.searchFormGroup.get('RegId').reset();
            this.personalFormGroup.reset();
            this.Patientnewold = 2;

            const newPersonalForm = this.createPesonalForm();
            this.resetFilteredOptions();
            Object.keys(newPersonalForm.controls).forEach(key => {
                if (this.personalFormGroup.contains(key)) {
                    this.personalFormGroup.setControl(key, newPersonalForm.get(key));
                } else {
                    this.personalFormGroup.addControl(key, newPersonalForm.get(key));
                }
            });

            const newVisitForm = this._AppointmentlistService.createVisitdetailForm();
            Object.keys(newVisitForm.controls).forEach(key => {
                if (this.VisitFormGroup.contains(key)) {
                    this.VisitFormGroup.setControl(key, newVisitForm.get(key));
                } else {
                    this.VisitFormGroup.addControl(key, newVisitForm.get(key));
                }
            });

            this.personalFormGroup.markAllAsTouched();
            this.VisitFormGroup.markAllAsTouched();

            this.Regflag = true;
            this.IsPhoneAppflag = false;
            this.isRegSearchDisabled = true;
        }
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
                    // console.log(this.registerObj)
                });
            }, 500);
        }
        else {
            this.searchFormGroup.reset();
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

    }
    getSelectedObj(obj) {

        debugger
        if (this.data?.FormName == 'Registration-Page') {
            this.PatientName = obj.firstName + ' ' + obj.lastName;
            this.RegId = obj.regId;
            this.VisitFlagDisp = true;
            if ((this.RegId ?? 0) > 0) {
                console.log(obj)
                setTimeout(() => {
                    this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                        this.registerObj = response;
                            this.value=response.dateofBirth
                         this.onChangeDateofBirth(response.dateofBirth)
                        console.log(response)
                        this.getLastDepartmetnNameList(this.registerObj)
                        this.personalFormGroup.patchValue({
                            FirstName: this.registerObj.firstName,
                            LastName: this.registerObj.lastName,
                            MobileNo: this.registerObj.mobileNo,
                            // DateOfBirth:this.registerObj.dateofBirth,
                            emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
                            emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
                            emgMobileNo: this.registerObj?.emgMobileNo ?? '',
                            emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
                            engAddress: this.registerObj?.engAddress ?? '',
                            emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
                            emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
                            medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
                            medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? '',
                            medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? '',
                            medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
                            medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
                            medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
                            medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? '',
                            medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
                            medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
                        });
                        console.log(this.registerObj)
                    });

                }, 100);
            }
           
        } else {
            this.PatientName = obj.PatientName;
            this.RegId = obj.value;
            this.VisitFlagDisp = true;
            if ((this.RegId ?? 0) > 0) {
                console.log(obj)
                setTimeout(() => {
                    this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                        this.registerObj = response;
                        console.log(response)
                         this.value=response.dateofBirth
                         this.onChangeDateofBirth(response.dateofBirth)
                        this.getLastDepartmetnNameList(this.registerObj)
                        this.personalFormGroup.patchValue({
                            FirstName: this.registerObj.firstName,
                            LastName: this.registerObj.lastName,
                            MobileNo: this.registerObj.mobileNo,
                            // DateOfBirth:this.registerObj.dateofBirth,
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
                            medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
                            medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
                            medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? new Date(),
                            medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
                            medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
                        });
                        // console.log(this.registerObj)
                    });

                }, 100);
            }
        }
        debugger
                    // this.value=this.registerObj.dateofBirth
                    console.log('Bdate',this.value)
                    // this.personalFormGroup.get("DateOfBirth").setValue(this.registerObj.dateofBirth)
                    this.onChangeDateofBirth(this.registerObj.dateofBirth)
    }
    PrevregisterObj: any;
    getLastDepartmetnNameList(row) {
       const dialogRef = this._matDialog.open(PreviousDeptListComponent,
            {
                maxWidth: "45vw",
                height: '45%',
                width: '100%',
                data: {
                    Obj: row,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
              console.log('The dialog was closed - Insert Action', result);
            this.PrevregisterObj = result
            this.VisitFormGroup.get("DepartmentId").setValue(this.PrevregisterObj.departmentId)
            this.selectChangedepartment(this.PrevregisterObj)

        });
    }

    //   changed by raksha date:17/6/25
    getSelectedObjphone(obj) {
        console.log("Phone data:", obj)

        if (obj.phAppId > 0) {
            const name = obj.text?.split('|')[0]?.trim();
            Swal.fire({
                icon: 'warning',
                title: 'Appointment Already Done',
                text: `This ${name} already has an appointment.`,
                confirmButtonText: 'OK',
                confirmButtonColor: '#3085d6'
            });
            return;
        }
        this.PatientName = obj.text;
        this.RegId = obj.regId;
        this.vPhoneAppId = obj.value;
        this.VisitFormGroup.get("phoneAppId")?.setValue(this.vPhoneAppId);
        this.VisitFlagDisp = false;
        this.registerObj = obj;
        // console.log(obj)
        if ((this.RegId ?? 0) > 0) {
            setTimeout(() => {
                this.searchFormGroup.get('regRadio')?.setValue('registrered');
                this.onChangeReg({ value: 'registrered' });
                this._AppointmentlistService.getRegistraionById(this.RegId).subscribe((response) => {
                    this.registerObj = response;
                    this.getLastDepartmetnNameList(this.registerObj)
                    this.personalFormGroup.patchValue({
                        FirstName: this.registerObj.firstName,
                        MiddleName: this.registerObj.middleName,
                        LastName: this.registerObj.lastName,
                        MobileNo: this.registerObj.mobileNo,
                        emgContactPersonName: this.registerObj?.emgContactPersonName ?? '',
                        emgRelationshipId: this.registerObj?.emgRelationshipId ?? 0,
                        emgMobileNo: this.registerObj?.emgMobileNo ?? '',
                        emgLandlineNo: this.registerObj?.emgLandlineNo ?? '',
                        engAddress: this.registerObj?.engAddress ?? '',
                        emgAadharCardNo: this.registerObj?.emgAadharCardNo ?? '',
                        emgDrivingLicenceNo: this.registerObj?.emgDrivingLicenceNo ?? '',
                        medTourismPassportNo: this.registerObj?.medTourismPassportNo ?? '',
                        medTourismVisaIssueDate: this.registerObj?.medTourismVisaIssueDate ?? 0,
                        medTourismVisaValidityDate: this.registerObj?.medTourismVisaValidityDate ?? '',
                        medTourismNationalityId: this.registerObj?.medTourismNationalityId ?? '',
                        medTourismCitizenship: this.registerObj?.medTourismCitizenship ?? 0,
                        medTourismPortOfEntry: this.registerObj?.medTourismPortOfEntry ?? '',
                        medTourismDateOfEntry: this.registerObj?.medTourismDateOfEntry ?? '',
                        medTourismResidentialAddress: this.registerObj?.medTourismResidentialAddress ?? '',
                        medTourismOfficeWorkAddress: this.registerObj?.medTourismOfficeWorkAddress ?? '',
                    })
                });

            }, 100);
        } else {
            setTimeout(() => {
                this._AppointmentlistService.getPhoneappById(this.vPhoneAppId).subscribe((response) => {
                    this.registerObj = response;
                    // console.log(this.registerObj)
                    this.registerObj.religionId = 0;
                    this.VisitFormGroup.get('DepartmentId').setValue(this.registerObj.departmentId)
                    this.selectChangedepartment(this.registerObj) //to set doctorid
                    this.personalFormGroup.patchValue({
                        FirstName: this.registerObj.firstName,
                        MiddleName: this.registerObj.middleName,
                        LastName: this.registerObj.lastName,
                        MobileNo: this.registerObj.mobileNo.trim()
                    });
                    this.registerObj.maritalStatusId = 0;
                    this.registerObj.areaId = 0
                    this.registerObj.regId = 0
                    this.registerObj.phoneNo = ''
                    this.registerObj.aadharCardNo = ''
                    this.registerObj.dateOfBirth = new Date();
                    this.registerObj.mobileNo = this.registerObj.mobileNo.trim()
                });
            }, 500);
        }
    }

    onSave() {


        if (this.Patientnewold == 2 && this.RegId == 0) {
            this.toastr.warning("Kindly select a patient from the list of registered patients.");
            return;
        }

        debugger
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
                // this.ageDay = this.ageDay+1
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
        this.VisitFormGroup.get('visitDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.VisitFormGroup.get('visitTime').setValue(this.dateTimeObj.time)
        //  this.VisitFormGroup.get('UnitId').setValue(this.accountService.currentUserValue.user.unitId)
        // this.VisitFormGroup.get('ClassId').setValue(this.ClassId)
        this.personalFormGroup.get('City').setValue(this.CityName)
        this.personalFormGroup.get('Age').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeYear').setValue(String(this.ageYear))
        this.personalFormGroup.get('AgeMonth').setValue(String(this.ageMonth))
        this.personalFormGroup.get('AgeDay').setValue(String(this.ageDay))
        this.personalFormGroup.get("DateOfBirth").setValue(this.datePipe.transform(this.personalFormGroup.get("DateOfBirth").value, "yyyy-MM-dd"))
        this.personalFormGroup.get('RegDate').setValue(this.datePipe.transform(this.dateTimeObj.date, 'yyyy-MM-dd'))
        this.personalFormGroup.get('RegTime').setValue(this.dateTimeObj.time)

        console.log('Personal Form : ',this.personalFormGroup.value)
        console.log('Visit Form : ',this.VisitFormGroup.value)
        if (!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid) {

            if (this.isCompanySelected && this.VisitFormGroup.get('CompanyId').value == 0) {
                this.toastr.warning('Please select valid Company ', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
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
        debugger
        this.personalFormGroup.get("RegId").setValue(0)
        this.VisitFormGroup.get("regId").setValue(0)
         this.VisitFormGroup.get("patientOldNew").setValue(this.Patientnewold)
        this.personalFormGroup.get("GenderId").setValue(Number(this.personalFormGroup.get('GenderId').value))
        this.personalFormGroup.get("ReligionId").setValue(Number(this.personalFormGroup.get('ReligionId').value))
        this.personalFormGroup.get("AreaId").setValue(Number(this.personalFormGroup.get('AreaId').value))
        this.personalFormGroup.get("StateId").setValue(Number(this.personalFormGroup.get('StateId').value))
        this.personalFormGroup.get("CountryId").setValue(Number(this.personalFormGroup.get('CountryId').value))
        this.VisitFormGroup.get("DepartmentId").setValue(Number(this.VisitFormGroup.get('DepartmentId').value))
        this.VisitFormGroup.get("RefDocId").setValue(Number(this.VisitFormGroup.get('RefDocId').value))
        this.VisitFormGroup.get("AppPurposeId").setValue(Number(this.VisitFormGroup.get('AppPurposeId').value))
        this.VisitFormGroup.get("phoneAppId")?.setValue(this.vPhoneAppId ? this.vPhoneAppId : 0);
        this.personalFormGroup.get('medTourismVisaIssueDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaIssueDate").value, "yyyy-MM-dd") || '1900-01-01');
        this.personalFormGroup.get('medTourismVisaValidityDate').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismVisaValidityDate").value, "yyyy-MM-dd") || '1900-01-01');
        this.personalFormGroup.get('medTourismDateOfEntry').setValue(this.datePipe.transform(this.personalFormGroup.get("medTourismDateOfEntry").value, "yyyy-MM-dd") || '1900-01-01');
        this.personalFormGroup.removeControl('updatedBy')

        let submitData = {
            "registration": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        }
        console.log(submitData);
        this._AppointmentlistService.NewappointmentSave(submitData).subscribe((response) => {
            this.OnViewReportPdf(response)
            this.onClear(true);
            this._matDialog.closeAll();
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

    onSaveRegistered() {

        debugger
        this.VisitFormGroup.get("regId")?.setValue(this.registerObj.regId)
        this.VisitFormGroup.get("patientOldNew").setValue(2)
        this.personalFormGroup.get("PrefixId").setValue(Number(this.personalFormGroup.get('PrefixId').value))
        this.personalFormGroup.get("GenderId").setValue(Number(this.personalFormGroup.get('GenderId').value))
        this.personalFormGroup.get("MaritalStatusId").setValue(Number(this.personalFormGroup.get('MaritalStatusId').value))
        this.personalFormGroup.get("ReligionId").setValue(Number(this.personalFormGroup.get('ReligionId').value))
        this.personalFormGroup.get("AreaId").setValue(Number(this.personalFormGroup.get('AreaId').value))
        this.personalFormGroup.get("CityId").setValue(Number(this.personalFormGroup.get('CityId').value))
        this.personalFormGroup.get("StateId").setValue(Number(this.personalFormGroup.get('StateId').value))
        this.personalFormGroup.get("CountryId").setValue(Number(this.personalFormGroup.get('CountryId').value))

        this.personalFormGroup.get('medTourismVisaIssueDate').setValue(this.datePipe.transform(this.rawDate1, "yyyy-MM-dd") || this.rawDate1);
        this.personalFormGroup.get('medTourismVisaValidityDate').setValue(this.datePipe.transform(this.rawDate2, "yyyy-MM-dd") || this.rawDate2);
        this.personalFormGroup.get('medTourismDateOfEntry').setValue(this.datePipe.transform(this.rawDate3, "yyyy-MM-dd") || this.rawDate3);
        //  this.personalFormGroup.get("StateId").setValue(Number(this.personalFormGroup.get('StateId').value))
        //     this.personalFormGroup.get("CountryId").setValue(Number(this.personalFormGroup.get('CountryId').value))

        this.VisitFormGroup.get("DepartmentId").setValue(Number(this.VisitFormGroup.get('DepartmentId').value))
        this.VisitFormGroup.get("RefDocId").setValue(Number(this.VisitFormGroup.get('RefDocId').value))
        this.VisitFormGroup.get("AppPurposeId").setValue(Number(this.VisitFormGroup.get('AppPurposeId').value))
        this.VisitFormGroup.get("phoneAppId")?.setValue(this.vPhoneAppId ? this.vPhoneAppId : 0);
        this.VisitFormGroup.removeControl('SubCompanyId');
        ['AddedBy', 'ReligionId', 'AreaId', 'IsSeniorCitizen'].forEach(control => {
            this.personalFormGroup.removeControl(control)
        })

        let submitData = {
            "appReistrationUpdate": this.personalFormGroup.value,
            "visit": this.VisitFormGroup.value
        };
        console.log(submitData)
        this._AppointmentlistService.RregisteredappointmentSave(submitData).subscribe((response) => {
            this.OnViewReportPdf(response)
            this.onClear(true);
            this._matDialog.closeAll();
        });
    }

    onChangeDate(value) {
        // console.log(value)
    }

    onChangePrefix(e) {
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangecity(e) {
        this.CityName = e.cityName
        this.registerObj.stateId = e.stateId
        this._AppointmentlistService.getstateId(e.stateId).subscribe((Response) => {
            // console.log(Response)
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
        if (obj.value) {
            this._AppointmentlistService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
            });
        } else {
            this._AppointmentlistService.getDoctorsByDepartment(obj.departmentId).subscribe((data: any) => {
                // console.log(data)
                this.ddlDoctor.options = data;
                this.ddlDoctor.bindGridAutoComplete();
                const incomingDoctorId = obj.consultantDocId || obj.doctorId;
                if (incomingDoctorId) {
                    const matchedDoctor = data.find(doc => doc.value === incomingDoctorId);
                    if (matchedDoctor) {
                        this.VisitFormGroup.get('ConsultantDocId')?.setValue(matchedDoctor.value);
                    }
                }
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
            aadharCardNo: [
                { name: "pattern", Message: "Only numbers allowed" },
                { name: "required", Message: "AadharCard No is required" },
                { name: "minLength", Message: "12 digit required." },
                { name: "maxLength", Message: "More than 12 digits not allowed." }
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
            CompanyId: [
                { name: "required", Message: "Company Name is required" }
            ],
            SubCompanyId: [
                { name: "required", Message: "SubCompany Name is required" }
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
            // wardId: [
            //     { name: "required", Message: "Ward Name is required" }
            // ],
        };
    }

    onTabChange(event: MatTabChangeEvent) {
        this.selectedTabIndex = event.index;
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
            RegId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            // RegNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            PrefixId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            FirstName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            MiddleName: ['', [
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$"),
                this._FormvalidationserviceService.allowEmptyStringValidator()
            ]],
            LastName: ['', [
                Validators.required,
                Validators.minLength(1),
                Validators.maxLength(100),
                Validators.pattern("^[A-Za-z/() ]*$")
            ]],
            GenderId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            Address: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(200)]],
            DateOfBirth: [(new Date()).toISOString(), this._FormvalidationserviceService.validDateValidator()],// [(new Date()).toISOString()],
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
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],

            MobileNo: ['', [Validators.required,
            Validators.minLength(10),
            Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"),
            this._FormvalidationserviceService.onlyNumberValidator()
            ]],
            aadharCardNo: ['', [
                Validators.minLength(12),
                Validators.maxLength(12),
                Validators.pattern("^[0-9]*$"),
                this._FormvalidationserviceService.onlyNumberValidator()
            ]],

            panCardNo: ['', [this._FormvalidationserviceService.allowEmptyStringValidator()]],
            MaritalStatusId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            ReligionId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            AreaId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            CityId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            City: [''],
            StateId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            CountryId: [0, [Validators.required, this._FormvalidationserviceService.onlyNumberValidator(), this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            updatedBy: [this.accountService.currentUserValue.userId, this._FormvalidationserviceService.onlyNumberValidator()],
            RegDate: [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
            // CourtesyId:[0, [this._FormvalidationserviceService.onlyNumberValidator()]],

            //emergency form
            emgContactPersonName: ['', [Validators.maxLength(50), this._FormvalidationserviceService.allowEmptyStringValidator()]],
            emgRelationshipId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            emgMobileNo: ['', [Validators.minLength(10), Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            emgLandlineNo: ['', [Validators.minLength(10), Validators.maxLength(10),
            Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            engAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            emgAadharCardNo: ['', [Validators.minLength(12), Validators.maxLength(12),
            Validators.pattern("^[0-9]*$"), this._FormvalidationserviceService.onlyNumberValidator()]],
            emgDrivingLicenceNo: ['', [Validators.minLength(16), Validators.maxLength(16),
            Validators.pattern(/^[A-Za-z0-9\- ]{5,16}$/)]],
            //Validators.pattern(/^[A-Z]{2}-\d{2}-\d{7,11}$/) eg:MH14-20210001234

            // medical tourisum
            medTourismPassportNo: ['', [Validators.minLength(8), Validators.maxLength(8), Validators.pattern(/^[A-Z][0-9]{7}$/),]], //Validators.pattern(/^[A-Z][0-9]{7}$/) eg:A1234567
            medTourismVisaIssueDate: [''],// [(new Date()).toISOString()],
            medTourismVisaValidityDate: [''],// [(new Date()).toISOString()],
            medTourismNationalityId: ['', [Validators.minLength(10), Validators.maxLength(20)]],
            medTourismCitizenship: [0, [this._FormvalidationserviceService.onlyNumberValidator()]],
            medTourismPortOfEntry: ['', [Validators.maxLength(20)]],
            medTourismDateOfEntry: [''],// [(new Date()).toISOString()],
            medTourismResidentialAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
            medTourismOfficeWorkAddress: ['', [this._FormvalidationserviceService.allowEmptyStringValidator(), Validators.maxLength(100)]],
        });
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
            this._AppointmentlistService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
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
                this._AppointmentlistService.getSuggestions("OutPatient/auto-complete?Keyword=", keyword).subscribe(results => {
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
        this.filteredOptions = [];
        this.prevResults = [];
    }

   
       onChangeDateofBirth(DateOfBirth: Date) {
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
            
            this.value = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
            if (this.ageYear > 110)
                this.toastr.warning('Please Enter Valid BirthDate..', 'warning !', {
                toastClass: 'tostr-tost custom-toast-success',
            });
        }
    }

    onSaveArea() {
            const dialogRef = this._matDialog.open(NewAreaComponent,
                {  maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                    // data: element
                });
    
            dialogRef.afterClosed().subscribe(result => {
               
            });
        }
}
