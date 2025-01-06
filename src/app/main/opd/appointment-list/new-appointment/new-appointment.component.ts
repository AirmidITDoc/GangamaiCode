import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
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
import { AppointmentSreviceService } from '../../appointment/appointment-srevice.service';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { Router } from '@angular/router';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { RegInsert } from '../../registration/registration.component';
import { fuseAnimations } from '@fuse/animations';
import { PatientDocument } from '../../appointment/appointment.component';
import { ImageViewComponent } from '../image-view/image-view.component';
import { AirmidAutocompleteComponent } from 'app/main/shared/componets/airmid-autocomplete/airmid-autocomplete.component';

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
    TempKeys: any[] = [];
    doclist: any = [];
    images: any[] = [];
    docs: any[] = [];
    dataArray = {};
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
    Bedname: any = '';
    wardname: any = '';
    classname: any = '';
    tariffname: any = '';
    ipno: any = '';
    patienttype: any = 1;
    Adm_Vit_ID: any = 0;
    OTTableID: any;
    AnestheticsDr: any;
    OTTableName: any;
    RegAppoint = 0;
    docData;
    docType;
    docViewType: any;
    sStatus: any = '';
    minDate = new Date();
    sysImage = '';
    Filename: any;
    RegNo: any = 0;
    title = 'file-upload';
    CompanyId: any = 0;
    VisitId: any;
    FimeName: any;
    VisitFlag = 0;
    vPhoneFlage = 0;
    vPhoneAppId: any = 0;
    vOPDNo: any = 0;
    vTariffId = 0;
    DoctorId: any;
    PrefixID: any = 0;
    MaritalStatusId: any = 0;
    ReligionId: any = 0;
    AreaId: any = 0;
    CityId: any = 0;
    PatientTypeID: any = 0;
    Tariff: any = 0;
    vDoctorId: any = 0;
    DoctorID: any = 0;
    Departmentid: any = 0;
    vCompanyId: any = 0;
    SubCompanyId: any = 0;
    vadmittedDoctor1: any = 0;
    RefDocId: any = 0;

    @ViewChild('attachments') attachment: any;

    imageForm = new UntypedFormGroup({
        imageFile: new UntypedFormControl('', [Validators.required]),
        imgFileSource: new UntypedFormControl('', [Validators.required])
    });

    docsForm = new UntypedFormGroup({
        docFile: new UntypedFormControl('', [Validators.required]),
        docFileSource: new UntypedFormControl('', [Validators.required])
    });



    menuActions: Array<string> = [];
    pdfDataSource = new MatTableDataSource<any>();
    imgDataSource = new MatTableDataSource<any>();
   
    public height: string;
    sanitizeImagePreview;
    displayedColumns1 = [
        'DocumentName',
        'DocumentPath',
        'buttons'
    ];


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
    autocompleteModedepartment: string = "Department";
    autocompleteModedeptdoc: string = "ConDoctor";
    autocompleteModerefdoc: string = "RefDoctor";
    autocompleteModepurpose: string = "Purpose";
   @ViewChild('ddlGender') ddlGender: AirmidAutocompleteComponent;
    @ViewChild('ddlState') ddlState: AirmidAutocompleteComponent;
    @ViewChild('ddlCountry') ddlCountry: AirmidAutocompleteComponent;

   

    constructor(
        public _AppointmentlistService: AppointmentlistService,

        public dialogRef: MatDialogRef<NewAppointmentComponent>,
        public _matDialog: MatDialog,
        private _ActRoute: Router,
        private _fuseSidebarService: FuseSidebarService,
        public _WhatsAppEmailService: WhatsAppEmailService,
        public datePipe: DatePipe,
        private formBuilder: UntypedFormBuilder,
        public matDialog: MatDialog,
        public toastr: ToastrService, @Inject(MAT_DIALOG_DATA) public data: any

    ) {

    }


    ngOnInit(): void {

        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAsUntouched();
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAsUntouched();
        this.searchFormGroup = this.createSearchForm();
        this.searchFormGroup.markAsUntouched();

       
        if (this.data)
            this.registerObj = this.data;
        console.log(this.registerObj)

        this.data.tariffId = 1
        this.data.patientTypeId = 1
    }




    // createPesonalForm() {

    //     return this.formBuilder.group({
    //         registration:[{
    //         RegId: [0],
    //         RegNo: '1',
    //         PrefixId: ['', [Validators.required]],
    //         FirstName:['', [
    //           Validators.required,
    //           Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
    //         ]],
    //         MiddleName: ['', [
    //           Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
    //         ]],
    //         LastName: ['', [
    //           Validators.required,
    //           Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
    //         ]],
    //         GenderId: new FormControl('', [Validators.required]),
    //         Address: '',
    //         DateOfBirth: [(new Date()).toISOString()],
    //         Age: ['0'],
    //         AgeYear: ['0', [
    //           // Validators.required,
    //           Validators.maxLength(3),
    //           Validators.pattern("^[0-9]*$")]],
    //         AgeMonth: ['0', [
    //           Validators.pattern("^[0-9]*$")]],
    //         AgeDay: ['0', [
    //           Validators.pattern("^[0-9]*$")]],
    //         PhoneNo: ['', [Validators.minLength(10),
    //         Validators.maxLength(10),
    //         Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
    //         ]],
    //         MobileNo: ['', [Validators.required,
    //         Validators.minLength(10),
    //         Validators.maxLength(10),
    //         Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
    //         ]],
    //         aadharCardNo: ['', Validators.compose([Validators.minLength(12),
    //         Validators.maxLength(12), Validators.pattern("^[0-9]*$")
    //         ])],
    //         panCardNo: 'ds',
    //         MaritalStatusId: '',
    //         ReligionId: 0,
    //         AreaId: '',
    //         CityId: '',
    //         City: ['d'],
    //         StateId: '',
    //         CountryId: '',
    //         IsCharity: false,
    //         IsSeniorCitizen: false,
    //         AddedBy: 1,
    //         updatedBy: 1,
    //         RegDate: [],
    //         RegTime: [(new Date()).toISOString()],
    //         Photo: [''],
    //         PinNo: [''],
    //     }],
    //         // IsHealthCard: '',
    //         // Days: '',
    //         // HealthcardDate: [new Date().toISOString()],
    //         // HealthCardNo: '',
    //         visit: [{
    //             visitId: 0,
    //             regId: 0,
    //             visitDate: [(new Date()).toISOString()],
    //             visitTime:[(new Date()).toISOString()],
    //             unitId: 0,
    //             patientTypeId: 0,
    //             consultantDocId: 0,
    //             refDocId: 0,
    //             tariffId: 0,
    //             companyId: 0,
    //             addedBy: 0,
    //             updatedBy: 0,
    //             isCancelledBy: 0,
    //             isCancelled: true,
    //             isCancelledDate: [(new Date()).toISOString()],
    //             classId: 0,
    //             departmentId: 0,
    //             patientOldNew: 0,
    //             firstFollowupVisit: 0,
    //             appPurposeId: 0,
    //             followupDate: [(new Date()).toISOString()],
    //             crossConsulFlag: 0,
    //             phoneAppId: 0
    //         }]

    //     });

    // }

    createPesonalForm() {

        return this.formBuilder.group({
            RegId: [0],
            RegNo: '1',
            PrefixId: ['', [Validators.required]],
            FirstName:['', [
              Validators.required,
              Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            MiddleName: ['', [
              Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
            ]],
            LastName: ['', [
              Validators.required,
              Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
            ]],
            GenderId: new FormControl('', [Validators.required]),
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
            aadharCardNo: ['', [Validators.required,
                Validators.minLength(12),
                Validators.maxLength(12),
                Validators.pattern("^[0-9]*$")
                ]],
            panCardNo: 'ds',
            MaritalStatusId: '',
            ReligionId: 0,
            AreaId: '',
            CityId: '',
            City: ['d'],
            StateId: '',
            CountryId: '',
            IsCharity: false,
            IsSeniorCitizen: false,
            AddedBy: 1,
            updatedBy: 1,
            RegDate:  [(new Date()).toISOString()],
            RegTime: [(new Date()).toISOString()],
            Photo: [''],
            PinNo: [''],
       

        });

    }
    createVisitdetailForm() {
        return this.formBuilder.group({
          
            visitId: 0,
            regId: 0,
            visitDate: [(new Date()).toISOString()],
            visitTime:[(new Date()).toISOString()],
            UnitId: 1,
            PatientTypeId: 0,
            ConsultantDocId: 0,
            RefDocId: 0,
            TariffId: 0,
            CompanyId: 0,
            addedBy: 0,
            updatedBy: 0,
            isCancelledBy: 0,
            isCancelled: true,
            isCancelledDate: [(new Date()).toISOString()],
            ClassId: 0,
            DepartmentId: 0,
            patientOldNew: 0,
            firstFollowupVisit: 0,
            AppPurposeId: 0,
            followupDate: [(new Date()).toISOString()],
            crossConsulFlag: 0,
            phoneAppId: 0
          
        });
    }
    IsPhoneAppflag: boolean = true;

    // toggle sidebar
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    onChangeReg(event) {
        //
        if (event.value == 'registration') {
            // this.registerObj = new RegInsert({});
            this.personalFormGroup.reset();
            this.personalFormGroup.get('RegId').reset();
            this.searchFormGroup.get('RegId').disable();
            this.isRegSearchDisabled = false;

            this.personalFormGroup = this.createPesonalForm();
            this.personalFormGroup.markAllAsTouched();
            this.VisitFormGroup = this.createVisitdetailForm();
            this.VisitFormGroup.markAllAsTouched();
            // this.Regdisplay = false;
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
            this.personalFormGroup.markAllAsTouched();
            this.VisitFormGroup = this.createVisitdetailForm();
            this.VisitFormGroup.markAllAsTouched();
            this.Regflag = true;
            this.IsPhoneAppflag = false;
            this.isRegSearchDisabled = true;

        }


    }

    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: ['']
        });
    }



    onChangePatient(value) {
        var mode = "Company"
        if (value.text == "Company") {
            this._AppointmentlistService.getMaster(mode, 1);
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.text != "Company") {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('CompanyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
            this.patienttype = 1;
        }


    }

    isRowDisabled: boolean = false

    chkdisabled(contact) {

        if (contact.IsCancelled)
            this.isRowDisabled = true
        else
            this.isRowDisabled = false
    }

    Vtotalcount = 0;
    VNewcount = 0;
    VFollowupcount = 0;
    VBillcount = 0;
    VCrossConscount = 0;
    Appointdetail(data) {
        this.Vtotalcount = 0;
        this.VNewcount = 0;
        this.VFollowupcount = 0;
        this.VBillcount = 0;
        this.VCrossConscount = 0;
        // console.log(data)
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

    @ViewChild('appointmentFormStepper') appointmentFormStepper: MatStepper;
    @Input() panelWidth: string | number;
    selectedPrefixId: any;

    public now: Date = new Date();
    screenFromString = 'admission-form';


    editor: string;


    getSearchList() {
        var m_data = {
            "Keyword": `${this.searchFormGroup.get('RegId').value}`
        }
        // this._AppointmentlistService.getRegistrationList(m_data).subscribe(data => {
        //     this.PatientListfilteredOptions = data;
        //     if (this.PatientListfilteredOptions.length == 0) {
        //         this.noOptionFound = true;
        //     } else {
        //         this.noOptionFound = false;
        //     }
        // });

    }


    getSearchDocuploadPatientList() {

        var m_data = {
            "Keyword": `${this.personalFormGroup.get('RegId').value}%`
        }

        // this._AppointmentlistService.getDocPatientRegList(m_data).subscribe(data => {
        //     this.filteredOptions = data;
        //     if (this.filteredOptions.length == 0) {
        //         this.noOptionFound1 = true;
        //     } else {
        //         this.noOptionFound1 = false;
        //     }
        // });
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

    getPhoneAppointmentList() {
        var m_data = {
            "Keyword": `${this.searchFormGroup.get('PhoneRegId').value}`
        }
        if (this.searchFormGroup.get('PhoneRegId').value.length >= 1) {
            // this._AppointmentlistService.getPhoneAppointmentList1(m_data).subscribe(resData => {
            //     this.filteredOptions = resData;
            //     this.PatientListfilteredOptions = resData;
            //     if (this.filteredOptions.length == 0) {
            //         this.noOptionFound = true;
            //     } else {
            //         this.noOptionFound = false;
            //     }

            // });
        }

    }

    getOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
    }

    RegOrPhoneflag = '';

    getSelectedObjPhone(obj) {
        this.RegOrPhoneflag = 'Entry From Phone Appointment'
        this.vPhoneFlage = 1;
        // this.registerObj = obj;
        // this.registerObj.MobileNo = obj.MobileNo.trim();
        // this.registerObj.DateofBirth = this.currentDate;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;
        this.RegNo = obj.RegNo;
        this.vPhoneAppId = obj.PhoneAppId;
        // this.vReligionId = obj.ReligionId;
        // this.vAreaId = obj.AreaId
        // this.vMaritalStatusId = obj.MaritalStatusId;



        // this.setDropdownObjs();

        this.VisitFlagDisp = true;
        let todayDate = new Date();
        const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        // this.registerObj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        // this.registerObj.ageMonth = Math.abs(todayDate.getMonth() - this.registerObj.dateofBirth.getMonth());
        // this.registerObj.ageDay = Math.abs(todayDate.getDate() - this.registerObj.dateofBirth.getDate());
    }

    getSelectedObj(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Registration';
        let todayDate = new Date();
        const d = new Date(obj.DateofBirth);
        const timeDiff = Math.abs(Date.now() - d.getTime());
        obj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        obj.ageMonth = Math.abs(todayDate.getMonth() - d.getMonth());
        obj.ageDay = Math.abs(todayDate.getDate() - d.getDate());
        //this.registerObj = obj;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;
        this.VisitFlagDisp = true;
    }


    getValidationMessages() {
        return {
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
            ]
        };
    }

    onNewSave() {

        if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {

            if (this.searchFormGroup.get('regRadio').value == "registration") {
                //if (this.vPhoneAppId == 0 && this.Regflag == false) {
                this.OnsaveNewRegister();

            }
            else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                this.onSaveRegistered();
                this.onClose();
            }
        }

    }

    onSave() {

        var Ageflag = false
        // if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {
        if (this.registerObj.ageYear != 0 || this.registerObj.ageMonth != 0 || this.registerObj.ageDay != 0) {

            if (this.searchFormGroup.get('regRadio').value == "registration") {
                //if (this.vPhoneAppId == 0 && this.Regflag == false) {
                this.OnsaveNewRegister();

            }
            else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                this.onSaveRegistered();
                this.onClose();
            }

        } else {
            Swal.fire("Enter Age Properly ..")
        }

    }


    OnsaveNewRegister() {
       
        console.log(this.VisitFormGroup.value);
        console.log(this.personalFormGroup.value);
        
        let submitData = {
            "registration": this.personalFormGroup.value,
            "visit":this.VisitFormGroup.value
        };
        console.log(submitData);
        this._AppointmentlistService.NewappointmentSave(submitData).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            this._matDialog.closeAll();
        }, (error) => {
            this.toastr.error(error.message);
        });
    }
    onSaveRegistered() {
        console.log(this.personalFormGroup.value);

        this._AppointmentlistService.RregisteredappointmentSave(this.personalFormGroup.value).subscribe((response) => {
            this.toastr.success(response.message);
            this.onClear(true);
            this._matDialog.closeAll();
        }, (error) => {
            this.toastr.error(error.message);
        });


    }

    // OnsaveNewRegister1() {

    //     var m_data = {

    //         "Registration":this.personalFormGroup.value,
    //         "Visit": this.VisitFormGroup.value
    //     }


    //     console.log(m_data);
    //     // console.log(this.personalFormGroup.value);
    //     // console.log(this.VisitFormGroup.value);
    //     // this.personalFormGroup.get("Visit").setValue(this.VisitFormGroup.value);
    //     // console.log(this.personalFormGroup.value);
    //     // this._AppointmentlistService.NewappointmentSave(this.personalFormGroup.value).subscribe((response) => {
    //     this._AppointmentlistService.NewappointmentSave(m_data).subscribe((response) => {
    //         this.toastr.success(response.message);
    //         this.onClear(true);
    //         this._matDialog.closeAll();
    //     }, (error) => {
    //         this.toastr.error(error.message);
    //     });
    // }

    // onSaveRegistered1() {

    //     let Areaid = 0;
    //     if (this.personalFormGroup.get('AreaId').value)
    //         Areaid = this.personalFormGroup.get('AreaId').value.value;

    //     let MaritalStatusId = 0;
    //     if (this.personalFormGroup.get('MaritalStatusId').value)
    //         MaritalStatusId = this.personalFormGroup.get('MaritalStatusId').value.value;

    //     let ReligionId = 0;
    //     if (this.personalFormGroup.get('ReligionId').value)
    //         ReligionId = this.personalFormGroup.get('ReligionId').value.value;

    //     let RefDocId = 0;
    //     if (this.VisitFormGroup.get('RefDocId').value)
    //         RefDocId = this.VisitFormGroup.get('RefDocId').value.value;

    //     let PurposeId = 0;
    //     if (this.VisitFormGroup.get('PurposeId').value)
    //         PurposeId = this.VisitFormGroup.get('PurposeId').value.value;


    //     if (this.patienttype != 2) {
    //         this.CompanyId = 0;

    //     } else if (this.patienttype == 2) {
    //         this.CompanyId = this.VisitFormGroup.get('CompanyId').value.value;
    //     }

    //     var m_data = {

    //         "Registration": this.personalFormGroup.value,
    //         "Visit": this.VisitFormGroup.value
    //     }


    //     console.log(m_data);

    //     this._AppointmentlistService.RregisteredappointmentSave(m_data).subscribe((response) => {
    //         this.toastr.success(response.message);
    //         this.onClear(true);
    //         this._matDialog.closeAll();
    //     }, (error) => {
    //         this.toastr.error(error.message);
    //     });
    // }



    objICard = {};
    QrCode = "";



    PatientAppointment() {
        // const dialogRef = this._matDialog.open(PatientAppointmentComponent,
        //     {
        //         maxWidth: "95vw",
        //         maxHeight: "95vh", width: '100%', height: "100%"
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     console.log('The dialog was closed - Insert Action', result);

        // });
    }

    // field validation
    // get f() {
    //     return this._AppointmentlistService.myFilterform.controls;
    // }
    selectRow(row) {
        this.selectRow = row;
    }




    // Image Upload

    b64toBlob(b64Data: string, contentType = '', sliceSize = 512) {
        const byteCharacters = atob(b64Data);
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            const slice = byteCharacters.slice(offset, offset + sliceSize);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            byteArrays.push(byteArray);
        }
        const blob = new Blob(byteArrays, { type: contentType });
        const Url = URL.createObjectURL(blob);
        // return this.safe.transform(Url);
    }

    public getSnapshot(): void {
        // this.trigger.next(void 0);
    }
    // public captureImg(webcamImage: WebcamImage): void {
    //   this.webcamImage = webcamImage;
    //   this.sysImage = webcamImage!.imageAsDataUrl;
    //   console.info('got webcam image', this.sysImage);
    // }
    // public get invokeObservable(): Observable<any> {
    //   return this.trigger.asObservable();
    // }
    // public get nextWebcamObservable(): Observable<any> {
    //   return this.nextWebcam.asObservable();
    // }
    // public handleInitError(error: WebcamInitError): void {
    //   this.errors.push(error);
    // }

    onUpload() {
        // this.dialogRef.close({url: this.sysImage});
    }




    onImageFileChange(events: any) {


        if (events.target.files && events.target.files[0]) {
            let filesAmount = events.target.files.length;
            for (let i = 0; i < filesAmount; i++) {
                this.imgArr.push(events.target.files[i].name);
                this.readFile(events.target.files[i], events.target.files[i].name);
            }
            this.attachment.nativeElement.value = '';
        }
    }
    readFile(f: File, name: string) {
        var reader = new FileReader();
        reader.onload = (event: any) => {
            this.images.push({ url: event.target.result, name: name, Id: 0 });
            this.imgDataSource.data = this.images;
            this.imageForm.patchValue({
                imgFileSource: this.images
            });
        }
        reader.readAsDataURL(f);
    }
    dataURItoBlob(dataURI) {
        var byteString;
        if (dataURI.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(dataURI.split(',')[1]);
        else
            byteString = unescape(dataURI.split(',')[1]);
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
        var ia = new Uint8Array(byteString.length);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return new Blob([ia], { type: mimeString });
    }


    onSubmitImgFiles() {
        let data: PatientDocument[] = [];
        for (let i = 0; i < this.imgDataSource.data.length; i++) {
            if (this.imgDataSource.data[i].name.endsWith('.pdf')) {
                let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
                    type: "'application/pdf'"
                });
                data.push({
                    Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
                });
            }
            else {
                let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
                    type: "'image/" + this.imgDataSource.data[i].name.split('.')[this.imgDataSource.data[i].name.split('.').length - 1] + "'"
                });
                data.push({
                    Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
                });
            }
        }
        const formData = new FormData();
        let finalData = { Files: data };
        this.CreateFormData(finalData, formData);
        this._AppointmentlistService.documentuploadInsert(formData).subscribe((data) => {
            if (data) {
                Swal.fire("Images uploaded Successfully  ! ");
            }
        });
    }


    //Image Upload
    imgArr: string[] = [];
    docArr: string[] = [];


    ageyearcheck(event) {

        if (parseInt(event) > 100) {
            this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });

            this.agey.nativeElement.focus();
        }
        return;
        // else{
        //   this.agem.nativeElement.focus();
        // }
    }


    onClose() {
        this.dialogRef.close();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    get showNameEditor() {
        return this.editor === 'name';
    }
    // removeImage(url: string) {
    //     let index = this.images.indexOf(url);
    //     this.images.splice(index, 1);
    // }

    // removeDoc(ele: DocData) {
    //     let index = this.docsArray.indexOf(ele);
    //     this.docsArray.splice(index, 1);
    // }

    // onViewImage(ele: any, type: string) {

    //     let fileType;
    //     if (ele) {

    //         const dialogRef = this.matDialog.open(ImageViewComponent,
    //             {
    //                 width: '900px',
    //                 height: '900px',
    //                 data: {
    //                     docData: type == 'img' ? ele : ele.doc,
    //                     type: type == 'img' ? "image" : ele.type
    //                 }
    //             }
    //         );
    //         dialogRef.afterClosed().subscribe(result => {

    //         });
    //     }
    // }



    CreateFormData(obj: any, formData: FormData, subKeyStr = '') {
        for (const i in obj) {
            const value = obj[i]; let subKeyStrTrans = i;
            if (subKeyStr) {
                if (i.indexOf(' ') > -1 || !isNaN(parseInt(i)))
                    subKeyStrTrans = subKeyStr + '[' + i + ']';
                else
                    subKeyStrTrans = subKeyStr + '.' + i;
            }
            if (typeof (value) === 'object' && !(value instanceof Date) && !(value instanceof File)) {
                this.CreateFormData(value, formData, subKeyStrTrans);
            }
            else {
                formData.append(subKeyStrTrans, value ?? '');
            }
        }
    }


    //   CameraComponent

    openCamera(type: string, place: string) {
        let fileType;
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
                    this.sanitizeImagePreview = result.url;
                }
                else {
                    this.imgArr.push(result.name);
                    this.images.push(result);
                    this.imgDataSource.data = this.images;
                }
            }
        });
    }



    onAddDocument(name, type) {


        // this.isLoading = 'save';

        this.pdfDataSource.data = [];
        this.doclist.push(
            {
                DocumentName: name,// this.imageForm.get('imgFileSource')?.value,
                DocumentPath: type// this.imageForm.get('imgFileSource')?.value,

            });
        // this.isLoading = '';
        this.pdfDataSource.data = this.doclist;

    }

    // }

    deleteImage(element) {
        let index = this.images.indexOf(element);
        if (index >= 0) {
            this.images.splice(index, 1);
            this.imgDataSource.data = this.images;
        }

        this.FimeName = element.name;

        let query = "delete FROM T_MRD_AdmFile WHERE OPD_IPD_ID= " + this.VisitId + " AND FileName=" + "'" + this.FimeName + "'" + " ";

        // this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
        //     if (resData) {
        //         Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
        //     }
        // });
    }

    deleteTableRow(element) {
        let index = this.doclist.indexOf(element);
        if (index >= 0) {
            this.doclist.splice(index, 1);
            this.pdfDataSource.data = [];
            this.pdfDataSource.data = this.doclist;
        }
        this.FimeName = element.name;
        let query = "delete FROM T_MRD_AdmFile WHERE OPD_IPD_ID= " + this.VisitId + " AND FileName=" + "'" + this.FimeName + "'" + " ";

        // this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
        //     if (resData) {
        //         Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
        //     }
        // });
    }




    VitalInfo(contact) {
        let xx = {
            RegId: contact.RegId,
            OPD_IPD_ID: contact.OPD_IPD_ID,
            RegNo: contact.RegNoWithPrefix,
            VisitId: contact.VisitId,
            PatientName: contact.PatientName,
            Doctorname: contact.Doctorname,
            AdmDateTime: contact.AdmDateTime,
            AgeYear: contact.AgeYear,
            AgeMonth: contact.AgeMonth,
            AgeDay: contact.AgeDay,
            DepartmentName: contact.DepartmentName,
            ClassId: contact.ClassId,
            OPDNo: contact.OPDNo,
            PatientType: contact.PatientType,
            ClassName: contact.ClassName,
            TariffName: contact.TariffName,
            TariffId: contact.TariffId,
            CompanyId: contact.CompanyId,
            CompanyName: contact.CompanyName,
            RefDocName: contact.RefDocName,
            MobileNo: contact.MobileNo,
            Lbl: "PatientVitalInfo"
        };
        console.log(xx)
        //console.log(contact)
        // this.advanceDataStored.storage = new SearchInforObj(xx);
        // const dialogRef = this._matDialog.open(PatientVitalInformationComponent,
        //     {
        //         maxWidth: '80%',
        //         height: '58%',
        //         data: {
        //             registerObj: xx,
        //         },
        //     });

        // dialogRef.afterClosed().subscribe(result => {
        //     this.getVisitList1();
        // });

    }
    vhealthCardNo: any;
    Healthcardflag: boolean = false;
    vDays: any = 0;
    HealthCardExpDate: any;
    followUpDate: string;
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

    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    onChangeDateofBirth(DateOfBirth) {
        debugger
        console.log(DateOfBirth)
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.registerObj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.registerObj.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.registerObj.ageDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.registerObj.dateofBirth = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
        }

    }

    get f() {
        return this.personalFormGroup.controls;
    }
    onChangePrefix(e) {
        debugger
        this.ddlGender.SetSelection(e.sexId);
    }

    onChangestate(e) {
        this.ddlCountry.SetSelection(e.stateId);
    }

    onChangecity(e) {
        this.ddlState.SetSelection(e.cityId);
        this.ddlCountry.SetSelection(e.stateId);
    }

    @ViewChild('fname') fname: ElementRef;
    @ViewChild('mname') mname: ElementRef;
    @ViewChild('lname') lname: ElementRef;
    @ViewChild('agey') agey: ElementRef;
    @ViewChild('aged') aged: ElementRef;
    @ViewChild('agem') agem: ElementRef;
    @ViewChild('phone') phone: ElementRef;
    @ViewChild('mobile') mobile: ElementRef;
    @ViewChild('address') address: ElementRef;
    @ViewChild('pan') pan: ElementRef;
    @ViewChild('area') area: ElementRef;
    @ViewChild('AadharCardNo') AadharCardNo: ElementRef;

    @ViewChild('bday') bday: ElementRef;



    // @ViewChild('dept') dept: MatSelect;

    add: boolean = false;
    @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;


    public onEnterfname(event): void {
        if (event.which === 13) {
            this.mname.nativeElement.focus();
        }
    }
    public onEntermname(event): void {
        if (event.which === 13) {
            this.lname.nativeElement.focus();
        }
    }
    public onEnterlname(event): void {
        if (event.which === 13) {
            this.agey.nativeElement.focus();

        }
    }

    public onEnterbday(event): void {
        if (event.which === 13) {
            this.agey.nativeElement.focus();

        }
    }


    public onEnteragey(event, value): void {
        if (event.which === 13) {
            this.agem.nativeElement.focus();

            this.ageyearcheck(value);
        }
    }
    public onEnteragem(event): void {
        if (event.which === 13) {
            this.aged.nativeElement.focus();
        }
    }
    public onEnteraged(event): void {
        if (event.which === 13) {
            this.AadharCardNo.nativeElement.focus();
        }
    }

    public onEnterAadharCardNo(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }
    public onEnterphone(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }


    public onEntermobile(event): void {
        if (event.which === 13) {
            this.phone.nativeElement.focus();
        }
    }

    public onEnteraddress(event): void {
        if (event.which === 13) {
            this.area.nativeElement.focus();
        }
    }

    departmentId: any;
    DosctorId: any;
    getVisitRecord(row) {
        this.departmentId = row.DepartmentId;
        this.DosctorId = row.DoctorId;
        Swal.fire(this.departmentId, this.DoctorId)
        this.VisitFlagDisp = false;
    }

    onClear(val: boolean) {
        this.personalFormGroup.reset();
        this.dialogRef.close(val);
    }


    // new Api?


    selectChangeprefix(obj: any) {
        console.log(obj);
      
    }

    selectChangegender(obj: any) {
        console.log(obj);
        // this.genderId = obj.value
    }

    selectChangearea(obj: any) {
        console.log(obj);
        // this.areaId = obj
    }

    selectChangecity(obj: any) {
        console.log(obj);
        // this.cityId = obj
        // this.cityName = obj.text
    }
    selectChangestate(obj: any) {
        console.log(obj);
        // this.stateId = obj
    }

    selectChangecountry(obj: any) {
        console.log(obj);
        // this.countryId = obj
    }

    selectChangemstatus(obj: any) {
        console.log(obj);
        // this.mstausId = obj
    }

    selectChangereligion(obj: any) {
        console.log(obj);
        // this.regilionId = obj
    }

    //  visitform?
    selectChangeunit(obj: any) {
        console.log(obj);
        // this.patienttypeId = obj.value

    }
    selectChangepatienttype(obj: any) {
        console.log(obj);
        // this.patientTypeId = obj

    }
    selectChangetariff(obj: any) {
        console.log(obj);
        // this.tariffId = obj
    }

    selectChangecompany(obj: any) {
        console.log(obj);
        // this.companyId = obj
    }


    selectChangesubcompany(obj: any) {
        console.log(obj);
        // this.subcompanyId = obj.value

    }
    selectChangedepartment(obj: any) {
        console.log(obj);
        this.departmentId = obj
    }

    selectChangedeptdoc(obj: any) {
        console.log(obj);
        // this.doctorID = obj
    }

    selectChangerefdoc(obj: any) {
        console.log(obj);
        // this.refDocId = obj
    }

    selectChangepurpose(obj: any) {
        console.log(obj);
        // this.purposeId = obj
    }
}
