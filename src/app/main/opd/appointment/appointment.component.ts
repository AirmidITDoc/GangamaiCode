import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { AppointmentSreviceService } from "./appointment-srevice.service";
import Swal from "sweetalert2";
import { fuseAnimations } from "@fuse/animations";
import { NewRegistrationComponent } from "../registration/new-registration/new-registration.component";
import { EditConsultantDoctorComponent } from "./edit-consultant-doctor/edit-consultant-doctor.component";
import { EditRefraneDoctorComponent } from "./edit-refrane-doctor/edit-refrane-doctor.component";
import { EditRegistrationComponent } from "../registration/edit-registration/edit-registration.component";
import { CasepaperVisitDetails } from "../op-search-list/op-casepaper/op-casepaper.component";
import { FeedbackComponent } from "./feedback/feedback.component";
import { PatientAppointmentComponent } from "./patient-appointment/patient-appointment.component";
import { ImageViewComponent } from "./image-view/image-view.component";
import { CameraComponent } from "./camera/camera.component";
import { map, startWith, takeUntil } from "rxjs/operators";
import { OPBillingComponent } from "../op-search-list/op-billing/op-billing.component";
import { ChargesList, SearchInforObj } from "../op-search-list/opd-search-list/opd-search-list.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { OPIPPatientModel } from "../op-search-list/search-page/search-page.component";
import { MatStepper } from "@angular/material/stepper";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HeaderComponent } from "app/main/shared/componets/header/header.component";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { AnyCnameRecord } from "dns";
import { PdfviewerComponent } from "app/main/pdfviewer/pdfviewer.component";
import { ImageCropComponent } from "app/main/shared/componets/image-crop/image-crop.component";
import { ImageCroppedEvent } from "ngx-image-cropper";
import { VisitDetailsComponent } from "./visit-details/visit-details.component";
import { ConfigService } from "app/core/services/config.service";
import { MatDrawer } from "@angular/material/sidenav";
import { MatAccordion } from "@angular/material/expansion";
import { CrossConsultationComponent } from "./cross-consultation/cross-consultation.component";
import { ThisReceiver } from "@angular/compiler";
import { ToastrService } from "ngx-toastr";
import { NewOPBillingComponent } from "../OPBilling/new-opbilling/new-opbilling.component";
import { Table } from "jspdf-autotable";
import moment, { invalid } from "moment";
import { values } from "lodash";
import { WhatsAppEmailService } from "app/main/shared/services/whats-app-email.service";
import { PatientVitalInformationComponent } from "./patient-vital-information/patient-vital-information.component";
import { CompanyInformationComponent } from "app/main/ipd/company-information/company-information.component";
import { UpdateRegisteredPatientInfoComponent } from "./update-registered-patient-info/update-registered-patient-info.component";
import { NewCasepaperComponent } from "../new-casepaper/new-casepaper.component";
import { AdmissionPersonlModel } from "app/main/ipd/Admission/admission/admission.component";

export class DocData {
    doc: any;
    type: string = '';
};


@Component({
    selector: "app-appointment",
    templateUrl: "./appointment.component.html",
    styleUrls: ["./appointment.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AppointmentComponent implements OnInit {
    // events: string[] = [];
    // opened: boolean;

    // shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

    dateStyle?: string = 'Date';
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }
    CalcDOB(mode, e) {
        debugger
        let d = new Date();
        if (mode == "Day") {
            d.setDate(d.getDate() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
            this.personalFormGroup.get('AgeDay').setValue(e.target.value)
            //this.personalFormGroup.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
        }
        else if (mode == "Month") {
            d.setMonth(d.getMonth() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
            this.personalFormGroup.get('AgeMonth').setValue(e.target.value)
        }
        else if (mode == "Year") {
            d.setFullYear(d.getFullYear() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
            this.personalFormGroup.get('AgeYear').setValue(e.target.value)
        }
      
        // let todayDate = new Date();
        // const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
        // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
    }
    msg: any;
    // isLoading = true;
    isRateLimitReached = false;
    hasSelectedContacts: boolean;
    currentDate = new Date();
    subscriptions: Subscription[] = [];
    reportPrintObj: CasepaperVisitDetails;
    printTemplate: any;
    TempKeys: any[] = [];
    reportPrintObjList: CasepaperVisitDetails[] = [];
    subscriptionArr: Subscription[] = [];
    isLoadingStr: string = '';
    isLoading: String = '';

    VisitID: any;

    showtable: boolean = false;

    Regflag: boolean = false;

    registerObj = new RegInsert({});
    registerObj1 = new RegInsert({});
    name = new FormControl('');
    FirstName = new FormControl('');
    AreaId = new FormControl('');
    submitted = false;
    year = 10;
    month = 5;
    day = 30;
    VisitTime: String;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    DateofBirth: Date;
    HospitalList: any = [];
    PatientTypeList: any = [];
    TariffList: any = [];
    AreaList: any = [];
    MaritalStatusList: any = [];
    PrefixList: any = [];
    RelationshipList: any = [];
    ReligionList: any = [];
    DepartmentList: any = [];
    CompanyList: any = [];
    SubTPACompList: any = [];
    GenderList: any = [];
    PurposeList: any = [];
    DoctorList: any = [];
    Doctor1List: any = [];
    Doctor2List: any = [];
    WardList: any = [];
    BedList: any = [];
    BedClassList: any = [];
    ConfigCityId = 2;
    ConfigcityList: any = [];
    _cityList: any = [];
    cityList: any = [];
    stateList: any = [];
    countryList: any = [];
    ClassList: any = [];
    selectedState = "";
    selectedStateID: any;
    selectedCountry: any;
    selectedCountryID: any;
    selectedHName: any;
    seelctedHospID: any;
    selectedGender = "";
    selectedGenderID: any;
    capturedImage: any;
    isLinear = true;
    VisitFormGroup: FormGroup;
    searchFormGroup: FormGroup;
    registration: any;
    isRegSearchDisabled: boolean = false;
    Regdisplay: boolean = false;
    newRegSelected: any = 'registration';
    dataArray = {};
    HospitalList1: any = [];
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

    isLoadings = false;
    isOpen = false;
    loadID = 0;
    savedValue: number = null;
    // Image upload
    docData;
    docType;
    docViewType: any;
    sStatus: any = '';
    // public errors: WebcamInitError[] = [];
    minDate = new Date();
    private trigger: Subject<any> = new Subject();
    // public webcamImage!: WebcamImage;
    private nextWebcam: Subject<any> = new Subject();
    sysImage = '';

    // upload document
    doclist: any = [];
    Filename: any;
    noOptionFound: boolean = false;
    noOptionFound1: boolean = false;
    RegNo: any = 0;
    // Document Upload
    personalFormGroup: FormGroup;
    title = 'file-upload';
    images: any[] = [];
    docs: any[] = [];
    docsArray: DocData[] = [];
    filteredOptions: any;
    showOptions: boolean = false;

    doctorNameCmbList: any = [];

    optionsDoctor: any[] = [];
    optionsArea: any[] = [];
    optionsMstatus: any[] = [];
    optionsReligion: any[] = [];
    optionsPatientType: any[] = [];
    optionsTariff: any[] = [];


    filteredOptionsDoctor: Observable<string[]>;
    filteredOptionsReligion: Observable<string[]>;
    filteredOptionsMstatus: Observable<string[]>;
    // filteredOptionsPatientType: Observable<string[]>;
    filteredOptionsPatientType: any;
    filteredOptionsTarrif: Observable<string[]>;
    isDoctorSelected: boolean = false;
    isCompanySelected: boolean = false;
    isCompanySelected1: boolean = false;
    ispatienttypeSelected: boolean = false;
    isTariffIdSelected: boolean = false;
    filteredOptionsCompany: Observable<string[]>;
    filteredOptionsSubCompany: Observable<string[]>;
    filteredOptionsArea: Observable<string[]>;
    isSubCompanySelected: boolean = false;
    isAreaSelected: boolean = false;
    isMstatusSelected: boolean = false;
    isreligionSelected: boolean = false;

    CompanyId: any = 0;
    VisitId: any;
    FimeName: any;
    VisitFlag = 0;
    vPhoneFlage = 0;
    vPhoneAppId: any = 0;
    vOPDNo: any = 0;
    vTariffId = 0;


    VisitFlagDisp: boolean = false;
    DoctorId: any;
    AdList: boolean = false;
    chkprint: boolean = false;


    vPrefixID: any = 0;
    vMaritalStatusId: any = 0;
    vReligionId: any = 0;
    vAreaId: any = 0;
    vCityId: any = 0;

    vPatientTypeID: any = 0;
    vTariff: any = 0;
    vDoctorId: any = 0;
    vDoctorID: any = 0;
    vDepartmentid: any = 0;
    vCompanyId: any = 0;
    vSubCompanyId: any = 0;
    vadmittedDoctor1: any = 0;


    @ViewChild('attachments') attachment: any;

    imageForm = new FormGroup({
        imageFile: new FormControl('', [Validators.required]),
        imgFileSource: new FormControl('', [Validators.required])
    });

    docsForm = new FormGroup({
        docFile: new FormControl('', [Validators.required]),
        docFileSource: new FormControl('', [Validators.required])
    });

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;


    displayedColumns = [
        "PatientOldNew",
        "RegNoWithPrefix",
        "PatientName",
        "DVisitDate",
        "OPDNo",
        'DepartmentName',
        "Doctorname",
        "RefDocName",
        "PatientType",
        'TariffName',
        "CompanyName",
        'MobileNo',
        "action",
    ];

    dataSource = new MatTableDataSource<VisitMaster>();
    dataSource1 = new MatTableDataSource<CasepaperVisitDetails>();
    menuActions: Array<string> = [];
    tableColumns = [

        'VisitId',
        'VisitTime',
        'DocName'

    ];
    @ViewChild('drawer') public drawer: MatDrawer;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    displayedColumns1 = [
        'DocumentName',
        'DocumentPath',
        'buttons'
    ];

    pdfDataSource = new MatTableDataSource<any>();
    imgDataSource = new MatTableDataSource<any>();
    filterReligion: any;
    filterMaritalstatus: any;
    filterArea: any;
    filterHospital: any;
    UserLoginDOctorID: any;

    public height: string;
    sanitizeImagePreview;
    constructor(
        public _AppointmentSreviceService: AppointmentSreviceService,
        public _opappointmentService: AppointmentSreviceService,
        private accountService: AuthenticationService,
        public _registerService: RegistrationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder,
        private _ActRoute: Router,
        private configService: ConfigService,
        private _fuseSidebarService: FuseSidebarService,
        public _registrationService: RegistrationService,
        public matDialog: MatDialog,
        public toastr: ToastrService,
        private advanceDataStored: AdvanceDataStored,
        private reportDownloadService: ExcelDownloadService,
        private _Activatedroute: ActivatedRoute,
        private changeDetectorRefs: ChangeDetectorRef,
        public _WhatsAppEmailService: WhatsAppEmailService
    ) {
        /// this.UserLoginDOctorID = this.accountService.currentUserValue.user.doctorID 
        this.getVisitList1();
    }


    ngOnInit(): void {
        this.getVisitList1();
        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAsUntouched();
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAsUntouched();
        this.searchFormGroup = this.createSearchForm();
        this.searchFormGroup.markAsUntouched();

        if (this._ActRoute.url == "/opd/appointment") {

            // this.menuActions.push("Update Registration");
            this.menuActions.push("Update Consultant Doctor");
            this.menuActions.push("Update Referred Doctor");
            this.menuActions.push("Medical Record");
        }

        // this.getVisitList();
        // this.getDoctorNameCombobox();

        this.getHospitalList1();
        this.getHospitalList();

        this.getPrefixList();
        this.getPatientTypeList();
        this.getTariffCombo();
        this.getAreaList();
        this.getMaritalStatusList();
        this.getReligionList();
        this.getcityList1();
        this.getCompanyList();
        this.getSubTPACompList();
        this.getDepartmentList();

        this.getDoctor1List();
        this.getDoctor2List();
        this.getPurposeList();

        // this.OnChangeDoctorList1(this.configService.configParams.DepartmentId);

        this.hospitalFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterHospital();
            });

        this.FirstName.markAsTouched();
        this.AreaId.markAsTouched();

        this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
        );


        this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );



        this.filteredOptionsPatientType = this.VisitFormGroup.get('PatientTypeID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPtype(value)),

        );
        this.filteredOptionsTarrif = this.VisitFormGroup.get('TariffId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterTariffId(value)),

        );
        this.CalcDOB('', null);
        this.getDoctorNameCombobox()

    }


    NewCrossConsultation(contact) {

        const dialogRef = this._matDialog.open(CrossConsultationComponent,
            {
                maxWidth: '75vw',
                height: '400px', width: '100%',
                data: contact,

            });
        dialogRef.afterClosed().subscribe(result => {
            this.getVisitList1();
        });

    }



    onImageChange(event) {
        let Imgflag = "";
        if (!event.target.files.length) return;
        const file = event.target.files[0];


        this._matDialog.open(ImageCropComponent, { data: { file } }).afterClosed().subscribe(

            (event: ImageCroppedEvent) => (this.sanitizeImagePreview = event.base64,
                Imgflag = event.base64
            )

        );




        if (Imgflag != " ") {
            let filesAmount = event.target.files.length;
            // for (let i = 0; i < filesAmount; i++) {
            // this.imgArr.push(file.name);
            this.images.push({ url: file, name: file.name, Id: 0 });
            this.imgDataSource.data = this.images;
            this.imageForm.patchValue({
                imgFileSource: this.images
            });
            // }
            this.attachment.nativeElement.value = '';
        }
    }
    onPhotoChange(event) {
        let Imgflag = "";

        if (!event.target.files.length) return;
        const file = event.target.files[0];

        this._matDialog.open(ImageCropComponent, { data: { file } }).afterClosed().subscribe(

            (event: ImageCroppedEvent) => (this.sanitizeImagePreview = event.base64,
                Imgflag = event.base64
            )

        );

        if (Imgflag != " ") {
            let filesAmount = event.target.files.length;
            // for (let i = 0; i < filesAmount; i++) {
            // this.imgArr.push(file.name);
            this.images.push({ url: file, name: file.name, Id: 0 });
            this.imgDataSource.data = this.images;
            this.imageForm.patchValue({
                imgFileSource: this.images
            });
            // }
            this.attachment.nativeElement.value = '';
        }
    }


    getPrint(contact) {

    }



    public handleKeyboardEvent(event: MatAutocompleteSelectedEvent): void {
        if (event.source.isOpen) {
            ((event.option as any)
                ._element as ElementRef).nativeElement.scrollIntoView();
        }
    }
    getDoctor1List() {
        this._opappointmentService.getDoctorMaster1Combo().subscribe(data => {
            this.Doctor1List = data;
            this.optionsRefDoc = this.Doctor1List.slice();
            this.filteredOptionsRefDoc = this.VisitFormGroup.get('RefDocId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
            );

        });
    }


    DocSelectdelete() {

        this.VisitFormGroup.get('RefDocId').setValue(null);

        this.getDoctor1List();
    }


    getDoctor2List() {
        this._opappointmentService.getDoctorMaster2Combo().subscribe(data => { this.Doctor2List = data; })
    }


    getOptionTextPrefix(option) {
        return option && option.PrefixName ? option.PrefixName : '';
    }

    getOptionTextpatienttype(option) {
        return option && option.PatientType ? option.PatientType : '';
    }

    getOptionTextTariff(option) {
        return option && option.TariffName ? option.TariffName : '';
    }


    getOptionTextDep(option) {

        return option && option.DepartmentName ? option.DepartmentName : '';
    }



    getOptionTextCity(option) {
        return option && option.CityName ? option.CityName : '';

    }

    getOptionTextDoc(option) {

        return option && option.Doctorname ? option.Doctorname : '';

    }

    getOptionTextRefDoc(option) {

        return option && option.DoctorName ? option.DoctorName : '';

    }

    getOptionTextRelation(option) {

        return option && option.DoctorName ? option.DoctorName : '';

    }
    getOptionTextPurpose(option) {

        return option && option.PurposeName ? option.PurposeName : '';
    }


    private _filterPrex(value: any): string[] {
        if (value) {
            const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();
            return this.optionsPrefix.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
        }

    }

    private _filterDep(value: any): string[] {
        if (value) {
            const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
            return this.DepartmentList.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
        }

    }



    private _filterSubCompany(value: any): string[] {
        if (value) {
            const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();

            return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
        }

    }


    private _filterCity(value: any): string[] {
        if (value) {
            const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();

            return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
        }

    }

    private _filterDoc(value: any): string[] {
        if (value) {
            const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
            this.isDoctorSelected = false;
            return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
        }

    }

    private _filterRefdoc(value: any): string[] {
        if (value) {
            const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();

            return this.optionsRefDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
        }

    }

    private _filterPurpose(value: any): string[] {
        if (value) {
            const filterValue = value && value.PurposeName ? value.PurposeName.toLowerCase() : value.toLowerCase();

            return this.optionsPurpose.filter(option => option.PurposeName.toLowerCase().includes(filterValue));
        }

    }

    private _filterPatientType(value: any): string[] {
        if (value) {
            const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();

            return this.optionsPatientType.filter(option => option.PatientType.toLowerCase().includes(filterValue));
        }

    }

    private _filterTariff(value: any): string[] {
        if (value) {
            const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();

            return this.optionsTariff.filter(option => option.TariffName.toLowerCase().includes(filterValue));
        }

    }
    private _filterArea(value: any): string[] {
        if (value) {
            const filterValue = value && value.AreaName ? value.AreaName.toLowerCase() : value.toLowerCase();

            return this.optionsArea.filter(option => option.AreaName.toLowerCase().includes(filterValue));
        }
    }


    private _filterReligion(value: any): string[] {
        if (value) {
            const filterValue = value && value.ReligionName ? value.ReligionName.toLowerCase() : value.toLowerCase();

            return this.optionsReligion.filter(option => option.ReligionName.toLowerCase().includes(filterValue));
        }

    }

    private _filterMstatus(value: any): string[] {
        if (value) {
            const filterValue = value && value.MaritalStatusName ? value.MaritalStatusName.toLowerCase() : value.toLowerCase();

            return this.optionsMstatus.filter(option => option.MaritalStatusName.toLowerCase().includes(filterValue));
        }
    }

    createPesonalForm() {

        return this.formBuilder.group({
            RegId: '',

            PrefixId: '',
            PrefixID: '',
            FirstName: ['', [
                Validators.required,
                Validators.maxLength(50),
                // Validators.pattern("^[a-zA-Z._ -]*$"),
                Validators.pattern('^[a-zA-Z () ]*$')
            ]],
            MiddleName: ['', [
            ]],
            LastName: ['', [
                Validators.required,
            ]],
            GenderId: '',
            Address: '',
            DateOfBirth: [{ value: this.registerObj.DateofBirth }],
            AgeYear: ['', [
                Validators.required,
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['', Validators.pattern("[0-9]+")],
            AgeDay: ['', Validators.pattern("[0-9]+")],
            PhoneNo: ['', [
                Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                Validators.minLength(0),
                Validators.maxLength(10)
            ]],
            MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
            Validators.minLength(10),
            Validators.maxLength(10),]],
            AadharCardNo: [''],
            PanCardNo: ["", [Validators.pattern("/^([A-Z]){5}([0-9]){4}([A-Z]){1}$/"),
            Validators.minLength(10),
            Validators.maxLength(10)]],
            MaritalStatusId: '',
            ReligionId: '',
            AreaId: '',
            CityId: '',
            StateId: '',
            CountryId: '',
            IsHealthCard: '',
            Days: '',
            HealthcardDate: [new Date().toISOString()],
            HealthCardNo: '',

        });

    }

    createVisitdetailForm() {
        return this.formBuilder.group({
            HospitalID: '',
            UnitId: '',
            PatientTypeID: ['', [
                Validators.required]],
            // PatientTypeId: '',
            PatientType: '',
            TariffId: ['', [
                Validators.required]],
            CompanyId: '',
            SubCompanyId: '',
            // DoctorId: '',
            DoctorID: ['', [
                Validators.required]],
            // DepartmentId: '',
            Departmentid: ['', [
                Validators.required]],
            DoctorIdOne: '',
            DoctorIdTwo: '',
            VisitId: '',
            // PrefixId: '',
            // RegNoWithPrefix: '',
            // PatientName: '',
            VisitDate: '',
            VisitTime: '',
            HospitalId: '',
            HospitalName: '',
            OPDNo: '',
            // TariffName: '',
            // ConsultantDocId: '',
            RefDocId: '',
            // Doctorname: '',
            // RefDocName: '',
            // ClassId: '',
            PurposeId: '',
            template: ''

        });
    }
    IsPhoneAppflag: boolean = true;

    onChangeReg(event) {
        //
        if (event.value == 'registration') {
            this.registerObj = new RegInsert({});
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

        this.getHospitalList1();
        this.getHospitalList();
        this.getTariffCombo();
        this.getPatientTypeList();
        this.getPrefixList();
        this.getDepartmentList();

        this.getcityList1();
    }

    createSearchForm() {
        return this.formBuilder.group({
            regRadio: ['registration'],
            regRadio1: ['registration1'],
            RegId: [''],
            PhoneRegId: ['']
        });
    }

    getHospitalList() {
        this._opappointmentService.getHospitalCombo().subscribe(data => {
            this.HospitalList = data;
            this.filteredHospital.next(this.HospitalList.slice());
            this.VisitFormGroup.get('HospitalID').setValue(this.HospitalList[0]);
        })
    }


    getPrefixList() {
        this._registerService.getPrefixCombo().subscribe(data => {
            this.PrefixList = data;
            this.optionsPrefix = this.PrefixList.slice();
            this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterPrex(value) : this.PrefixList.slice()),
            );

        });
    }


    getcityList1() {

        this._opappointmentService.getCityList().subscribe(data => {
            this.cityList = data;
            this.optionsCity = this.cityList.slice();
            this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCity(value) : this.cityList.slice()),
            );

        });

    }

    getPurposeList() {
        this._opappointmentService.getPurposeList().subscribe(data => {
            this.PurposeList = data;
            this.optionsPurpose = this.PurposeList.slice();
            this.filteredOptionsPurpose = this.VisitFormGroup.get('PurposeId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterPurpose(value) : this.PurposeList.slice()),
            );
        });
    }


    // reg fetch issue 
    // getPatientTypeList() {
    //   this._opappointmentService.getPatientTypeCombo().subscribe(data => {
    //     this.PatientTypeList = data;
    //     this.optionsPatientType = this.PatientTypeList.slice();
    //     this.filteredOptionsPatientType = this.VisitFormGroup.get('PatientTypeID').valueChanges.pipe(
    //       startWith(''),
    //       map(value => value ? this._filterPatientType(value) : this.PatientTypeList.slice()),
    //     );

    //   });
    //   this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    // }



    private _filterPtype(value: any): string[] {
        if (value) {
            const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();
            return this.PatientTypeList.filter(option => option.PatientType.toLowerCase().includes(filterValue));
        }
    }

    getPatientTypeList() {
        this._opappointmentService.getPatientTypeCombo().subscribe(data => {
            this.PatientTypeList = data;
            this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
        });
    }


    private _filterTariffId(value: any): string[] {
        if (value) {
            const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
            return this.TariffList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
        }
    }

    getTariffCombo() {
        this._opappointmentService.getTariffCombo().subscribe(data => {
            this.TariffList = data;
            this.VisitFormGroup.get('TariffId').setValue(this.TariffList[0]);
        });
    }


    onChangePatient(value) {

        if (value.PatientTypeId == 2) {
            this._opappointmentService.getCompanyCombo();
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        } else if (value.PatientTypeId !== 2) {
            this.isCompanySelected = false;
            this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
            this.VisitFormGroup.get('CompanyId').clearValidators();
            this.VisitFormGroup.get('SubCompanyId').clearValidators();
            this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
            this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
            this.patienttype = 1;
        }

        // if (value.PatientTypeId == 2) {
        //   this.patienttype = 2;
        // } else if (value.PatientTypeId !== 2) {
        //   this.patienttype = 1;
        // }

    }
    onEdit(row) {

        // console.log(row)
        // let Query = "Select * from Registration where  RegId=" + row.RegId + " ";
        // this._AppointmentSreviceService.getRegIdDetail(Query).subscribe(data => {
        //   this.registerObj = data[0];
        //   console.log(this.registerObj);
        // });

        // this.registerObj["VisitId"] = row.VisitId;
        // this.registerObj["RegId"]=row.RegId;
        // this.registerObj["RegID"]=row.RegId;
        // 
        console.log(row)
        this.registerObj = row;
        this.registerObj["RegId"] = row.RegId;
        this.registerObj["RegID"] = row.RegId;
        this.registerObj["PrefixId"] = row.PrefixID;
        // this.EditRegistration();
    }

    EditRegistration(row) {
        this.registerObj = row;
        this.registerObj["RegId"] = row.RegId;
        this.registerObj["RegID"] = row.RegId;
        // this.registerObj["PrefixId"] = row.PrefixID;
        this.advanceDataStored.storage = new AdvanceDetailObj(row);
        console.log(row)

        this._registrationService.populateFormpersonal(row);

        const dialogRef = this._matDialog.open(NewRegistrationComponent,
            {
                maxWidth: "85vw",
                height: "450px",
                width: "100%",
                data: {
                    registerObj: row,
                    Submitflag: false
                },
            }
        );

        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getVisitList1();
        });
    }

    AppointmentCancle(contact) {
        Swal.fire({
            title: 'Do you want to Cancle Appointment',
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: 'OK',

        }).then((flag) => {


            if (flag.isConfirmed) {
                let appointmentcancle = {};
                appointmentcancle['visitId'] = contact.VisitId;

                let submitData = {
                    "appointmentcancle": appointmentcancle

                };
                console.log(submitData);
                this._AppointmentSreviceService.Appointmentcancle(submitData).subscribe(response => {
                    if (response) {
                        Swal.fire('Appointment cancelled !', 'Appointment cancelled Successfully!', 'success').then((result) => {

                        });
                        this.getVisitList1();
                    } else {
                        Swal.fire('Error !', 'Appointment cancelled data not saved', 'error');
                    }
                    this.isLoading = '';
                });
            }
        });
        this.getVisitList1();
    }
    getClassList() {
        this._opappointmentService.getClassMasterCombo().subscribe(data => { this.ClassList = data; })
    }




    // getTariffList() {
    //   this._opappointmentService.getTariffCombo().subscribe(data => {
    //     this.TariffList = data;
    //     this.optionsTariff = this.TariffList.slice();
    //     this.filteredOptionsTarrif = this.VisitFormGroup.get('TariffId').valueChanges.pipe(
    //       startWith(''),
    //       map(value => value ? this._filterTariff(value) : this.TariffList.slice()),
    //     );

    //   });
    //   this.VisitFormGroup.get('TariffId').setValue(this.TariffList[0]);
    // }

    getAreaList() {
        this._opappointmentService.getAreaCombo().subscribe(data => {
            this.AreaList = data;
            this.optionsArea = this.AreaList.slice();
            this.filteredOptionsArea = this.personalFormGroup.get('AreaId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterArea(value) : this.AreaList.slice()),
            );

        });
    }


    getMaritalStatusList() {
        this._opappointmentService.getMaritalStatusCombo().subscribe(data => {
            this.MaritalStatusList = data;
            this.optionsMstatus = this.MaritalStatusList.slice();
            this.filteredOptionsMstatus = this.personalFormGroup.get('MaritalStatusId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterMstatus(value) : this.MaritalStatusList.slice()),
            );

        });
    }


    getReligionList() {
        this._opappointmentService.getReligionCombo().subscribe(data => {
            this.ReligionList = data;
            this.optionsReligion = this.ReligionList.slice();
            this.filteredOptionsReligion = this.personalFormGroup.get('ReligionId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterReligion(value) : this.ReligionList.slice()),
            );

        });
    }



    getCompanyList() {
        this._opappointmentService.getCompanyCombo().subscribe(data => {
            this.CompanyList = data;
            this.optionsCompany = this.CompanyList.slice();
            this.filteredOptionsCompany = this.VisitFormGroup.get('CompanyId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this.filterCompany(value) : this.CompanyList.slice()),
            );

        });
    }


    private filterCompany(value: any): string[] {
        if (value) {
            const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();

            return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
        }

    }

    getSubTPACompList() {
        this._opappointmentService.getSubTPACompCombo().subscribe(data => {
            this.SubTPACompList = data;
            this.optionsSubCompany = this.SubTPACompList.slice();
            this.filteredOptionsSubCompany = this.VisitFormGroup.get('SubCompanyId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterSubCompany(value) : this.SubTPACompList.slice()),
            );

        });
    }


    getDepartmentList() {

        this._opappointmentService.getDepartmentCombo().subscribe(data => {
            this.DepartmentList = data;
            console.log(data)
            this.optionsDep = this.DepartmentList.slice();
            this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
            );
            if (this.configService.configParams.DepartmentId) {

                const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.configService.configParams.DepartmentId);
                this.VisitFormGroup.get('Departmentid').setValue(ddValue[0]);
                this.OnChangeDoctorList(ddValue[0]);
                this.VisitFormGroup.updateValueAndValidity();
                return;
            }
        });

    }



    onChangeStateList(CityId) {

        this._opappointmentService.getStateList(CityId).subscribe(data => {
            this.stateList = data;
            this.selectedState = this.stateList[0].StateName;

        });
        // }
    }



    onChangeCountryList(StateId) {
        if (StateId > 0) {

            this._opappointmentService.getCountryList(StateId).subscribe(data => {
                this.countryList = data;
                this.selectedCountry = this.countryList[0].CountryName;
                this.personalFormGroup.get('CountryId').setValue(this.countryList[0]);
                this.personalFormGroup.updateValueAndValidity();
            });
        }
    }

    onChangeDateofBirth(DateOfBirth) {
        // console.log(DateOfBirth)
        debugger
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
            // this.registerObj.DateofBirth = DateOfBirth;
            // this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);

              this.registerObj.AgeYear  = todayDate.getFullYear() - dob.getFullYear();
           this.registerObj.AgeMonth =(todayDate.getMonth() - dob.getMonth());
            this.registerObj.AgeDay = (todayDate.getDate() - dob.getDate());
         
            if ( this.registerObj.AgeDay < 0) {
                this.registerObj.AgeMonth--;
                const previousMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 0);
                this.registerObj.AgeDay  += previousMonth.getDate(); // Days in previous month
              }
            
              if (this.registerObj.AgeMonth< 0) {
               this.registerObj.AgeYear --;
                this.registerObj.AgeMonth += 12;
              }
          //  this.value = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
                if(this.registerObj.AgeYear  > 110)
                Swal.fire("Please Enter Valid BirthDate..")
        }

    }
    // VisitList
    resultsLength = 0;

    getVisitList() {

        var D_data = {
            F_Name: this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
            L_Name: this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
            Reg_No: this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
            Doctor_Id: this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorID || 0,
            From_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("startdate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            To_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("enddate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            IsMark: this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
        };
        setTimeout(() => {
            this._AppointmentSreviceService.getAppointmentListold(D_data).subscribe(
                (Visit) => {

                    this.dataSource.data = Visit as VisitMaster[];

                },
                (error) => {
                    this.isLoading = 'list-loaded';
                }
            );
        }, 1000);
    }
    isRowDisabled: boolean = false

    chkdisabled(contact) {

        if (contact.IsCancelled)
            this.isRowDisabled = true
        else
            this.isRowDisabled = false
    }



    getVisitList1() {


        console.log(this._AppointmentSreviceService.myFilterform.get("DoctorId").value)
        var D_data = {
            F_Name: this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
            L_Name: this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
            Reg_No: this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
            Doctor_Id: this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorId || 0,
            From_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("startdate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            To_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("enddate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
            IsMark: this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
            Start: (this.paginator?.pageIndex ?? 0),
            Length: (this.paginator?.pageSize ?? 10),
            Sort: this.sort?.active ?? 'VisitId',
            Order: this.sort?.direction ?? 'desc'
        };
        console.log(D_data)
        setTimeout(() => {

            this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
                (Visit) => {
                    this.dataSource.data = Visit["Table1"] ?? [] as VisitMaster[];
                    console.log(this.dataSource.data)
                    if (this.dataSource.data.length > 0) {
                        this.Appointdetail(this.dataSource.data);
                    }
                    this.dataSource.sort = this.sort;
                    this.resultsLength = Visit["Table"][0]["total_row"];
                    // this.dataSource.paginator = this.paginator;
                    this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
                },
                (error) => {
                    // this.isLoading = 'list-loaded';
                }
            );
        }, 1000);

        console.log(this.dataSource.data)

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




    // getVisitDetails() {

    // const dialogRef = this._matDialog.open(VisitDetailsComponent,
    //     {
    //         maxWidth: "800px",
    //         minWidth: '800px',
    //         width: '800px',
    //         height: '380px',
    //         disableClose: true,
    //         data: {
    //             "VisitId": this.VisitId// 159641

    //         }
    //     });
    // dialogRef.afterClosed().subscribe(result => {

    //     this.VisitFlag = 1;
    //     this.DoctorId = result.DoctorId;

    //     const toSelectDept = this.DepartmentList.find(c => c.Departmentid == result.DepartmentId);
    //     this.VisitFormGroup.get('Departmentid').setValue(toSelectDept);

    //     this.OnChangeDoctorList(result);
    //     this.dept.nativeElement.focus();
    // });


    // this.isLoading = '';
    // this.Quantity.nativeElement.focus();
    // }


    // toggle sidebar
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    onClear() {
        this._AppointmentSreviceService.myFilterform.reset({
            start: [(new Date()).toISOString()],
            end: [(new Date()).toISOString()],
        });
        this._opappointmentService.mySaveForm.reset({ IsDeleted: 'false' });
        this._opappointmentService.initializeFormGroup();


    }


    private _filterDoctor(value: any): string[] {
        if (value) {
            const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
            return this.optionsDoctor.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
        }

    }


    //hospital filter
    public hospitalFilterCtrl: FormControl = new FormControl();
    public filteredHospital: ReplaySubject<any> = new ReplaySubject<any>(1);


    private _onDestroy = new Subject<void>();

    options = [];
    options1 = [];
    PatientListfilteredOptions: any;
    PatientDocfilteredOptions: any;
    @ViewChild('appointmentFormStepper') appointmentFormStepper: MatStepper;
    @Input() panelWidth: string | number;
    selectedPrefixId: any;

    public now: Date = new Date();
    screenFromString = 'admission-form';


    editor: string;

    isPrefixSelected: boolean = false;
    isDepartmentSelected: boolean = false;
    isCitySelected: boolean = false;
    isRegIdSelected: boolean = false;
    isRegIdSelected1: boolean = false;
    isRefDoctorSelected: boolean = false;
    isPurposeSelected: boolean = false;

    optionsPrefix: any[] = [];
    optionsCompany: any[] = [];
    optionsSubCompany: any[] = [];
    optionsDep: any[] = [];
    optionsCity: any[] = [];
    optionsDoc: any[] = [];
    optionsRefDoc: any[] = [];
    optionsPurpose: any[] = [];

    filteredOptionsDep: Observable<string[]>;

    filteredOptionsDoc: Observable<string[]>;
    filteredOptionsRefDoc: Observable<string[]>;
    filteredOptionsPrefix: Observable<string[]>;
    filteredOptionsCity: Observable<string[]>;
    filteredOptionsPurpose: Observable<string[]>;
    filteredOptionsDoctorsearch: any;
    getDoctorNameCombobox() {
        var vdata = {
            "@Keywords": `${this._AppointmentSreviceService.myFilterform.get('DoctorId').value}%`
        }
        console.log(vdata)
        this._AppointmentSreviceService.getDoctorMasterComboList(vdata).subscribe(data => {
            this.filteredOptionsDoctorsearch = data;
            console.log(this.filteredOptionsDoctorsearch)
            if (this.filteredOptionsDoctorsearch.length == 0) {
                this.noOptionFound = true;
            } else {
                this.noOptionFound = false;
            }
        });
    }
    getOptionTextDoctor(option) {
        return option && option.Doctorname ? option.Doctorname : '';
    }

    getOptionTextCompany(option) {
        return option && option.CompanyName ? option.CompanyName : '';
    }

    getOptionTextSubCompany(option) {

        return option && option.CompanyName ? option.CompanyName : '';
    }

    getOptionTextArea(option) {

        return option && option.AreaName ? option.AreaName : '';
    }

    getOptionTextReligion(option) {

        return option && option.ReligionName ? option.ReligionName : '';
    }

    getOptionTextMstatus(option) {

        return option && option.MaritalStatusName ? option.MaritalStatusName : '';
    }



    getSearchList() {
        var m_data = {
            "Keyword": `${this.searchFormGroup.get('RegId').value}`
        }
        this._opappointmentService.getRegistrationList(m_data).subscribe(data => {
            this.PatientListfilteredOptions = data;
            if (this.PatientListfilteredOptions.length == 0) {
                this.noOptionFound = true;
            } else {
                this.noOptionFound = false;
            }
        });

    }


    getSearchDocuploadPatientList() {

        var m_data = {
            "Keyword": `${this.personalFormGroup.get('RegId').value}%`
        }

        this._opappointmentService.getDocPatientRegList(m_data).subscribe(data => {
            this.filteredOptions = data;
            if (this.filteredOptions.length == 0) {
                this.noOptionFound1 = true;
            } else {
                this.noOptionFound1 = false;
            }
        });
    }



    getPatientOptionText(option) {
        if (!option) return '';
        return option.FirstName + ' ' + option.LastName + ' (' + option.RegNo + ')';
    }

    getPatientSelectedObj(obj) {
        this.PatientName = obj.FirstName + ' ' + obj.MiddleName + ' ' + obj.LastName;
        this.RegId = obj.RegID;
        this.VisitId = obj.VisitId;

        this.getdocumentList(this.VisitId);
    }


    getdocumentList(VisitId) {
        this.images = [];
        let query = "SELECT * FROM T_MRD_AdmFile WHERE OPD_IPD_ID= " + VisitId + " AND OPD_IPD_Type=0";
        this._AppointmentSreviceService.getuploadeddocumentsList(query).subscribe((resData: any) => {
            if (resData.length > 0) {
                Swal.fire("Documents Already Uploaded");
                for (let i = 0; i < resData.length; i++) {
                    this.images.push({ url: "", name: resData[i].FileName, Id: resData[i].ID });
                }
                this.imgDataSource.data = this.images;
                this.imgDataSource.data.forEach((currentValue, index) => {
                    if (currentValue.Id > 0) {
                        if (currentValue.name.endsWith('.pdf')) {
                            this._AppointmentSreviceService.getfile(currentValue.Id).subscribe((resFile: any) => {
                                if (resFile.file)
                                    currentValue.url = 'data:application/pdf;base64,' + resFile.file;
                            });
                        }
                        else {
                            this._AppointmentSreviceService.getfile(currentValue.Id).subscribe((resFile: any) => {
                                if (resFile.file)
                                    currentValue.url = 'data:image/jpg;base64,' + resFile.file;
                            });
                        }
                    }
                });
            }
        });
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
            this._opappointmentService.getPhoneAppointmentList1(m_data).subscribe(resData => {
                this.filteredOptions = resData;
                this.PatientListfilteredOptions = resData;
                if (this.filteredOptions.length == 0) {
                    this.noOptionFound = true;
                } else {
                    this.noOptionFound = false;
                }

            });
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
        this.registerObj = obj;
        this.registerObj.MobileNo = obj.MobileNo.trim();
        this.registerObj.DateofBirth = this.currentDate;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;
        this.RegNo = obj.RegNo;
        this.vPhoneAppId = obj.PhoneAppId;
        this.vReligionId = obj.ReligionId;
        this.vAreaId = obj.AreaId
        this.vMaritalStatusId = obj.MaritalStatusId;



        this.setDropdownObjs();

        this.VisitFlagDisp = true;
        let todayDate = new Date();
        const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
        this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
    }

    getSelectedObj(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Registration';
        let todayDate = new Date();
        const d = new Date(obj.DateofBirth);
        const timeDiff = Math.abs(Date.now() - d.getTime());
        obj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        obj.AgeMonth = Math.abs(todayDate.getMonth() - d.getMonth());
        obj.AgeDay = Math.abs(todayDate.getDate() - d.getDate());
        this.registerObj = obj;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;

        this.setDropdownObjs();

        this.VisitFlagDisp = true;
    }
    getSelectedObjNew(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Registration';
        let todayDate = new Date();
        const d = new Date(obj.DateofBirth);
        const timeDiff = Math.abs(Date.now() - d.getTime());
        obj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        obj.AgeMonth = Math.abs(todayDate.getMonth() - d.getMonth());
        obj.AgeDay = Math.abs(todayDate.getDate() - d.getDate());
        this.registerObj = obj;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;

        this.setDropdownObjs();

        this.VisitFlagDisp = true;
        this.updateRegisteredPatientInfo(obj);
    }
    setDropdownObjs() {

        const toSelect = this.PrefixList.find(c => c.PrefixID == this.registerObj.PrefixID);
        this.personalFormGroup.get('PrefixID').setValue(toSelect);

        const toSelectMarital = this.MaritalStatusList.find(c => c.MaritalStatusId == this.registerObj.MaritalStatusId);
        this.personalFormGroup.get('MaritalStatusId').setValue(toSelectMarital);

        const toSelectReligion = this.ReligionList.find(c => c.ReligionId == this.registerObj.ReligionId);
        this.personalFormGroup.get('ReligionId').setValue(toSelectReligion);

        const toSelectArea = this.AreaList.find(c => c.AreaId == this.registerObj.AreaId);
        this.personalFormGroup.get('AreaId').setValue(toSelectArea);

        const toSelectCity = this.cityList.find(c => c.CityId == this.registerObj.CityId);
        this.personalFormGroup.get('CityId').setValue(toSelectCity);

        this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
        this.onChangeCityList(this.personalFormGroup.get('CityId').value);
        this.personalFormGroup.updateValueAndValidity();
    }

    onChangeGenderList(prefixObj) {
        if (prefixObj) {
            this._opappointmentService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
                this.GenderList = data;
                this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
                this.selectedGenderID = this.GenderList[0].GenderId;
            });
        }
    }
    Istemplate = false;
    chkTemplate(event) {
        if (event.checked)
            this.Istemplate = true
        else
            this.Istemplate = true
    }

    onNewSave() {
        if ((this.vPrefixID == '' || this.vPrefixID == null || this.vPrefixID == undefined)) {
            this.toastr.warning('Please select valid Prefix ', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vCityId == '' || this.vCityId == null || this.vCityId == undefined)) {
            this.toastr.warning('Please select valid City', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vPatientTypeID == '' || this.vPatientTypeID == null || this.vPatientTypeID == undefined)) {
            this.toastr.warning('Please select PatientType', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vTariff == '' || this.vTariff == null || this.vTariff == undefined)) {
            this.toastr.warning('Please select Tariff', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vDepartmentid == '' || this.vDepartmentid == null || this.vDepartmentid == undefined)) {
            this.toastr.warning('Please Select Department', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if ((this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined)) {
            this.toastr.warning('Please Select Doctor', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        const ischeckprefix = this.PrefixList.some(item => item.PrefixName === this.personalFormGroup.get('PrefixID').value.PrefixName)
        if (!ischeckprefix) {
            this.toastr.warning('Please Select valid Prefix', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.personalFormGroup.get('AreaId').value) {
            if (!this.AreaList.some(item => item.AreaName === this.personalFormGroup.get('AreaId').value.AreaName)) {
                this.toastr.warning('Please Select valid AreaName', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (!this.cityList.some(item => item.CityName === this.personalFormGroup.get('CityId').value.CityName)) {
            this.toastr.warning('Please Select valid City', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.personalFormGroup.get('MaritalStatusId').value) {
            if (!this.MaritalStatusList.some(item => item.MaritalStatusName === this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusName)) {
                this.toastr.warning('Please Select valid MaritalStatus', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (this.personalFormGroup.get('ReligionId').value) {
            if (!this.ReligionList.some(item => item.ReligionName === this.personalFormGroup.get('ReligionId').value.ReligionName)) {
                this.toastr.warning('Please Select valid ReligionName', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (!this.PatientTypeList.some(item => item.PatientType === this.VisitFormGroup.get('PatientTypeID').value.PatientType)) {
            this.toastr.warning('Please Select valid PatientType', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.TariffList.some(item => item.TariffName === this.VisitFormGroup.get('TariffId').value.TariffName)) {
            this.toastr.warning('Please Select valid TariffName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }

        if (!this.DepartmentList.some(item => item.departmentName === this.VisitFormGroup.get('Departmentid').value.departmentName)) {
            this.toastr.warning('Please Select valid departmentName', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (!this.DoctorList.some(item => item.Doctorname === this.VisitFormGroup.get('DoctorID').value.Doctorname)) {
            this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        if (this.VisitFormGroup.get('RefDocId').value) {
            if (!this.Doctor1List.some(item => item.DoctorName === this.VisitFormGroup.get('RefDocId').value.DoctorName)) {
                this.toastr.warning('Please Select valid RefDoctorName', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        if (this.VisitFormGroup.get('PurposeId').value) {
            if (!this.PurposeList.some(item => item.PurposeName === this.VisitFormGroup.get('PurposeId').value.PurposeName)) {
                this.toastr.warning('Please Select valid PurposeName', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        if (this.registerObj.AgeYear != 0 || this.registerObj.AgeMonth != 0 || this.registerObj.AgeDay != 0) {
            if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {

                if (this.searchFormGroup.get('regRadio').value == "registration") {
                    //if (this.vPhoneAppId == 0 && this.Regflag == false) {
                    this.OnsaveNewRegister();
                    this.getVisitList1();
                }
                else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                    this.onSaveRegistered();
                    this.getVisitList1();
                    this.onClose();
                }
            }
        } else {
            Swal.fire("Enter Age Properly ..")
        }

    }

    // onSave() {

    //     let DoctorID = this.VisitFormGroup.get('DoctorID').value.DoctorId

    //     if (DoctorID == undefined) {
    //         this.toastr.warning('Please Enter Valid DoctorName.', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     else {
    //         if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {
    //             if (this.registerObj.AgeYear != 0 || this.registerObj.AgeMonth != 0 || this.registerObj.AgeDay != 0) {
    //                 this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
    //                     toastClass: 'tostr-tost custom-toast-warning',
    //                 });
    //                 return;
    //             }


    //             if (this.searchFormGroup.get('regRadio').value == "registration") {
    //                 //if (this.vPhoneAppId == 0 && this.Regflag == false) {
    //                 this.OnsaveNewRegister();

    //             }
    //             else if (this.searchFormGroup.get('regRadio').value == "registrered") {
    //                 this.onSaveRegistered();
    //                 this.onClose();
    //             }

    //         }

    //     }
    //     // this.getVisitList1();
    // }



    OnsaveNewRegister() {

        let Areaid = 0;
        if (this.personalFormGroup.get('AreaId').value)
            Areaid = this.personalFormGroup.get('AreaId').value.AreaId;

        let MaritalStatusId = 0;
        if (this.personalFormGroup.get('MaritalStatusId').value)
            MaritalStatusId = this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId;

        let ReligionId = 0;
        if (this.personalFormGroup.get('ReligionId').value)
            ReligionId = this.personalFormGroup.get('ReligionId').value.ReligionId;

        let RefDocId = 0;
        if (this.VisitFormGroup.get('RefDocId').value)
            RefDocId = this.VisitFormGroup.get('RefDocId').value.DoctorId;

        let PurposeId = 0;
        if (this.VisitFormGroup.get('PurposeId').value)
            PurposeId = this.VisitFormGroup.get('PurposeId').value.PurposeId;


        if (this.patienttype != 2) {
            this.CompanyId = 0;
        } else if (this.patienttype == 2) {
            this.CompanyId = this.VisitFormGroup.get('CompanyId').value.CompanyId;
            // this.vTariffId=2;
        }




        if (this.searchFormGroup.get('regRadio').value == "registration") {

            this.isLoading = 'submit';
            let submissionObj = {};
            let registrationSave = {};
            let visitSave = {};
            let tokenNumberWithDoctorWiseInsert = {};

            registrationSave['regID'] = 0;
            registrationSave['regDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                registrationSave['regTime'] = this.dateTimeObj.time,
                registrationSave['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
            registrationSave['firstName'] = this.registerObj.FirstName;
            registrationSave['middleName'] = this.registerObj.MiddleName || '';
            registrationSave['lastName'] = this.registerObj.LastName;
            registrationSave['address'] = this.registerObj.Address || '';
            registrationSave['City'] = this.personalFormGroup.get('CityId').value.CityName || '';
            registrationSave['pinNo'] = '123';

            registrationSave['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"), //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
                registrationSave['age'] = this.registerObj.AgeYear;
            registrationSave['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
            registrationSave['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
            registrationSave['mobileNo'] = this.registerObj.MobileNo || 0;
            registrationSave['addedBy'] = this.accountService.currentUserValue.user.id;
            registrationSave['ageYear'] = this.registerObj.AgeYear || 0;
            registrationSave['ageMonth'] = this.registerObj.AgeMonth || 0;
            registrationSave['ageDay'] = this.registerObj.AgeDay || 0;
            registrationSave['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
            registrationSave['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
            registrationSave['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
            registrationSave['maritalStatusId'] = MaritalStatusId; //this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
            registrationSave['isCharity'] = false;
            registrationSave['religionId'] = ReligionId; //this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
            registrationSave['areaId'] = Areaid; //this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
            registrationSave['Aadharcardno'] = this.personalFormGroup.get('AadharCardNo').value || '';
            registrationSave['Pancardno'] = this.registerObj.PanCardNo || '';// this.personalFormGroup.get('Pancardno').value || '';
            registrationSave['isSeniorCitizen'] = true; //this.personalFormGroup.get('isSeniorCitizen').value ? this.personalFormGroup.get('VillageId').value.VillageId : 0; //this.registerObj.VillageId;
            registrationSave['Photo'] = '';

            submissionObj['RegistrationSave'] = registrationSave;

            visitSave['VisitId'] = 0;
            visitSave['RegID'] = 0;
            visitSave['VisitDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                visitSave['VisitTime'] = this.dateTimeObj.time,
                visitSave['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
            visitSave['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;
            visitSave['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;
            visitSave['RefDocId'] = RefDocId; // this.VisitFormGroup.get('RefDocId').value.DoctorId || 0;
            visitSave['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
            visitSave['CompanyId'] = this.CompanyId;
            visitSave['AddedBy'] = this.accountService.currentUserValue.user.id;
            //visitSave['updatedBy'] = 0,
            visitSave['IsCancelled'] = false;
            visitSave['IsCancelledBy'] = 0;
            visitSave['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                visitSave['ClassId'] = 1; //this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
            visitSave['DepartmentId'] = this.VisitFormGroup.get('Departmentid').value.DepartmentId;
            visitSave['PatientOldNew'] = this.Patientnewold;
            visitSave['FirstFollowupVisit'] = 0,
                visitSave['appPurposeId'] = PurposeId; // this.VisitFormGroup.get('PurposeId').value.PurposeId || 0;
            visitSave['FollowupDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
                visitSave['crossConsulFlag'] = 0,
                visitSave['phoneAppId'] = this.vPhoneAppId || 0;

            submissionObj['visitSave'] = visitSave;

            tokenNumberWithDoctorWiseInsert['patVisitID'] = 0;
            submissionObj['tokenNumberWithDoctorWiseSave'] = tokenNumberWithDoctorWiseInsert;

            console.log(submissionObj)
            const formData = new FormData();
            this._opappointmentService.appointregInsert(submissionObj).subscribe(response => {
                if (response) {
                    //  
                    if (this.vPhoneAppId !== 0) {
                        Swal.fire('Congratulations !', 'New Appoinment from Phone save Successfully !', 'success').then((result) => {

                        });
                        this.getVisitList1();
                    } else {
                        Swal.fire('Congratulations !', 'New Appoinment save Successfully !', 'success').then((result) => {
                        });

                        // this.viewgetPatientAppointmentReportPdf(response, false);
                        debugger

                        this.viewgetPatientAppointmentTemplateReportPdf(response, false);
                    }
                } else {
                    Swal.fire('Error !', 'Appoinment not saved', 'error');
                }
                this.isLoading = '';
            });
        }
        this.onClose();

        this.getVisitList1();
    }

    onSaveRegistered() {

        let Areaid = 0;
        if (this.personalFormGroup.get('AreaId').value)
            Areaid = this.personalFormGroup.get('AreaId').value.AreaId;

        let MaritalStatusId = 0;
        if (this.personalFormGroup.get('MaritalStatusId').value)
            MaritalStatusId = this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId;

        let ReligionId = 0;
        if (this.personalFormGroup.get('ReligionId').value)
            ReligionId = this.personalFormGroup.get('ReligionId').value.ReligionId;

        let RefDocId = 0;
        if (this.VisitFormGroup.get('RefDocId').value)
            RefDocId = this.VisitFormGroup.get('RefDocId').value.DoctorId;

        let PurposeId = 0;
        if (this.VisitFormGroup.get('PurposeId').value)
            PurposeId = this.VisitFormGroup.get('PurposeId').value.PurposeId;


        if (this.patienttype != 2) {
            this.CompanyId = 0;

        } else if (this.patienttype == 2) {
            this.CompanyId = this.VisitFormGroup.get('CompanyId').value.CompanyId;
        }

        this.isLoading = 'submit';
        let submissionObj = {};
        let registrationUpdate = {};
        let visitUpdate = {};

        let tokenNumberWithDoctorWiseUpdate = {};
        registrationUpdate['regID'] = this.registerObj.RegId;
        registrationUpdate['regDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
            registrationUpdate['regTime'] = this.dateTimeObj.time,
            registrationUpdate['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
        registrationUpdate['firstName'] = this.registerObj.FirstName;
        registrationUpdate['middleName'] = this.registerObj.MiddleName || '';
        registrationUpdate['lastName'] = this.registerObj.LastName;
        registrationUpdate['address'] = this.registerObj.Address || '';
        registrationUpdate['City'] = this.personalFormGroup.get('CityId').value.CityName || '';
        registrationUpdate['pinNo'] = '';
        registrationUpdate['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy") || this.personalFormGroup.get('DateofBirth').value.DateofBirth;
        registrationUpdate['age'] = this.registerObj.AgeYear;
        registrationUpdate['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
        registrationUpdate['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
        registrationUpdate['mobileNo'] = this.registerObj.MobileNo || 0;
        registrationUpdate['addedBy'] = this.accountService.currentUserValue.user.id;
        registrationUpdate['ageYear'] = this.registerObj.AgeYear || 0;
        registrationUpdate['ageMonth'] = this.registerObj.AgeMonth || 0;
        registrationUpdate['ageDay'] = this.registerObj.AgeDay || 0;
        registrationUpdate['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
        registrationUpdate['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
        registrationUpdate['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
        registrationUpdate['maritalStatusId'] = MaritalStatusId;// this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
        registrationUpdate['isCharity'] = false;
        registrationUpdate['religionId'] = ReligionId;//this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
        registrationUpdate['areaId'] = Areaid;//this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
        registrationUpdate['Aadharcardno'] = this.personalFormGroup.get('AadharCardNo').value || '';
        registrationUpdate['Pancardno'] = this.personalFormGroup.get('PanCardNo').value || '';
        registrationUpdate['isSeniorCitizen'] = true; //this.personalFormGroup.get('isSeniorCitizen').value ? this.personalFormGroup.get('VillageId').value.VillageId : 0; //this.registerObj.VillageId;
        registrationUpdate['Photo'] = ''

        // this.CompanyId = this.VisitFormGroup.get('CompanyId').value.CompanyId || 0;
        submissionObj['registrationUpdate'] = registrationUpdate;
        // visit detail
        visitUpdate['VisitId'] = 0;
        visitUpdate['RegID'] = this.registerObj.RegId;
        visitUpdate['VisitDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
            visitUpdate['VisitTime'] = this.dateTimeObj.time,
            visitUpdate['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
        visitUpdate['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
        visitUpdate['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
        visitUpdate['RefDocId'] = RefDocId; // this.VisitFormGroup.get('DoctorIdOne').value.DoctorId || 0;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;
        visitUpdate['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
        visitUpdate['CompanyId'] = this.CompanyId || 0;
        visitUpdate['AddedBy'] = this.accountService.currentUserValue.user.id;
        visitUpdate['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
            visitUpdate['IsCancelled'] = 0;
        visitUpdate['IsCancelledBy'] = 0;
        visitUpdate['IsCancelledDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900',
            visitUpdate['ClassId'] = 1; //this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
        visitUpdate['DepartmentId'] = this.VisitFormGroup.get('Departmentid').value.DepartmentId; //? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
        visitUpdate['PatientOldNew'] = this.Patientnewold;
        visitUpdate['FirstFollowupVisit'] = 0, // this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
            visitUpdate['appPurposeId'] = PurposeId; //this.VisitFormGroup.get('PurposeId').value.PurposeId || 0; // ? this.VisitFormGroup.get('RelativeAddress').value : '';
        visitUpdate['FollowupDate'] = this.datePipe.transform(this.dateTimeObj.date, 'MM/dd/yyyy') || '01/01/1900', // this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
            visitUpdate['crossConsulFlag'] = 0,
            visitUpdate['phoneAppId'] = this.vPhoneAppId || 0;

        submissionObj['visitSave'] = visitUpdate;


        tokenNumberWithDoctorWiseUpdate['patVisitID'] = 0;
        submissionObj['tokenNumberWithDoctorWiseSave'] = tokenNumberWithDoctorWiseUpdate;

        console.log(submissionObj);
        this._opappointmentService.appointregupdate(submissionObj).subscribe(response => {
            if (response) {
                Swal.fire('Congratulations !', 'Registered Appoinment Saved Successfully  !', 'success').then((result) => {
                    if (result.isConfirmed) {
                        // this.viewgetPatientAppointmentReportPdf(response, false);
                        debugger
                        // if(!this.Istemplate)
                        //     this.viewgetPatientAppointmentReportPdf(response, false);
                        //   else
                        this.viewgetPatientAppointmentTemplateReportPdf(response, false);
                    }
                    this.getVisitList1();
                });
            } else {
                Swal.fire('Error !', 'Appointment not Updated', 'error');
            }
            this.isLoading = '';
        });
        this.RegOrPhoneflag = "";
        this.getVisitList1();
    }



    objICard = {};
    QrCode = "";
    printIcard(row) {

        this.objICard = row;
        this.QrCode = row.RegId.toString();
        setTimeout(() => {
            this.OnPrint();
        }, 100);
    }
    OnPrint() {

        const printContents = document.getElementById("i-card").innerHTML;
        const pageContent = `<!DOCTYPE html><html><head></head><body onload="window.print()">${printContents}</html>`;
        let popupWindow: Window;
        if (navigator.userAgent.toLowerCase().indexOf('chrome') > -1) {
            popupWindow = window.open(
                '',
                '_blank',
                'width=600,height=600,scrollbars=no,menubar=no,toolbar=no,location=no,status=no,titlebar=no'
            );
            popupWindow.window.focus();
            popupWindow.document.write(pageContent);
            popupWindow.document.close();
            popupWindow.onbeforeunload = event => {
                popupWindow.close();
            };
            popupWindow.onabort = event => {
                popupWindow.document.close();
                popupWindow.close();
            };
        } else {
            popupWindow = window.open('', '_blank', 'width=600,height=600');
            popupWindow.document.open();
            popupWindow.document.write(pageContent);
            popupWindow.document.close();
        }

    }
    onChangeCityList(CityObj) {
        if (CityObj) {
            this._opappointmentService.getStateList(CityObj.CityId).subscribe((data: any) => {
                this.stateList = data;
                this.selectedState = this.stateList[0].StateName;
                // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
                this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
                this.selectedStateID = this.stateList[0].StateId;
                this.onChangeCountryList(this.selectedStateID);
            });

        }
    }

    getRecord(contact, m): void {
        ;
        // this.VisitID = contact.VisitId;
        // if (m == "CasePaper Print") {
        //     this.getPrint(contact);
        // }
        if (m == "Update Registration") {
            var D_data = {
                RegId: contact.RegId,
            };

            this._AppointmentSreviceService
                .getregisterListByRegId(D_data)
                .subscribe(
                    (reg) => {
                        this.dataArray = reg;
                        var m_data = {
                            RegNo: this.dataArray[0].RegNo,
                            RegId: this.dataArray[0].RegId,
                            PrefixID: this.dataArray[0].PrefixId,
                            PrefixName: this.dataArray[0].PrefixName,
                            FirstName: this.dataArray[0].FirstName,
                            MiddleName: this.dataArray[0].MiddleName,
                            LastName: this.dataArray[0].LastName,
                            PatientName: this.dataArray[0].PatientName,
                            DateofBirth: this.dataArray[0].DateofBirth,
                            MaritalStatusId: this.dataArray[0].MaritalStatusId,
                            AadharCardNo: this.dataArray[0].AadharCardNo || '',
                            Age: this.dataArray[0].Age.trim(),
                            AgeDay: this.dataArray[0].AgeDay,
                            AgeMonth: this.dataArray[0].AgeMonth,
                            AgeYear: this.dataArray[0].AgeYear,
                            Address: this.dataArray[0].Address,
                            AreaId: this.dataArray[0].AreaId,
                            City: this.dataArray[0].City,
                            CityId: this.dataArray[0].CityId,
                            StateId: this.dataArray[0].StateId,
                            CountryId: this.dataArray[0].CountryId,
                            PhoneNo: this.dataArray[0].PhoneNo,
                            MobileNo: this.dataArray[0].MobileNo,
                            GenderId: this.dataArray[0].GenderId,
                            GenderName: this.dataArray[0].GenderName,
                            ReligionId: this.dataArray[0].ReligionId,
                            IsCharity: 0,
                            PinNo: this.dataArray[0].PinNo,
                            RegDate: this.dataArray[0].RegDate,
                            RegNoWithPrefix: this.dataArray[0].RegNoWithPrefix,
                            RegTime: this.dataArray[0].RegTime,
                        };
                        this._registrationService.populateFormpersonal(m_data);
                        // const dialogRef = this._matDialog.open(NewAppointmentComponent,
                        //   {
                        //     maxWidth: "85vw",
                        //     height: "80%",
                        //     width: "80%",
                        //     data: {
                        //       registerObj: m_data,
                        //     },
                        //   }
                        // );
                        // dialogRef.afterClosed().subscribe((result) => {
                        //   console.log(
                        //     "The dialog was closed - Insert Action",
                        //     result
                        //   );
                        //   this.getVisitList();
                        // });
                    },
                    (error) => {
                    }
                );
        } else if (m == "Update Consultant Doctor") {

            var m_data2 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                DoctorId: contact.DoctorId,
                DoctorName: contact.Doctorname,
            };
            this._registrationService.populateFormpersonal(contact);
            const dialogRef = this._matDialog.open(
                EditConsultantDoctorComponent,
                {
                    maxWidth: "70vw",
                    height: "410px",
                    width: "70%",
                    data: {
                        registerObj: contact,
                        FormName: "Appointment"
                    },
                }
            );
            dialogRef.afterClosed().subscribe((result) => {
                this.getVisitList1();
            });
        } else if (m == "Update Referred Doctor") {
            var m_data3 = {
                RegId: contact.RegId,
                PatientName: contact.PatientName,
                VisitId: contact.VisitId,
                OPD_IPD_Id: contact.OPD_IPD_Id,
                RefDoctorId: contact.RefDocId,
                RefDocName: contact.RefDocName,
            };
            this._registrationService.populateFormpersonal(contact);
            const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
                maxWidth: "70vw",
                height: "390px",
                width: "50%",
                data: {
                    registerObj: contact,
                    FormName: "Appointment"
                },
            });
            dialogRef.afterClosed().subscribe((result) => {
                console.log("The dialog was closed - Insert Action", result);
                this.getVisitList1();
            });
         } 
        // else if (m == "Medical Record") {
        //     var m_data3 = {
        //         RegId: contact.RegId,
        //         PatientName: contact.PatientName,
        //         VisitId: contact.VisitId,
        //         OPD_IPD_Id: contact.OPD_IPD_Id,
        //         RefDoctorId: contact.RefDocId,
        //         RefDocName: contact.RefDocName,
        //     };
        //    // this._registrationService.populateFormpersonal(contact);
        //     this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
        //     const dialogRef = this._matDialog.open(NewCasepaperComponent, {
        //         maxWidth: "90vw",
        //         height: "90vw",
        //         width: "90%",
        //         // data: {
        //         //     Obj: contact,
        //         //     FormName: "Medical Record"
        //         // },
        //     });
        //     dialogRef.afterClosed().subscribe((result) => {
        //         console.log("The dialog was closed - Insert Action", result);
        //         this.getVisitList1();
        //     });
        // }
        // else if (m == "Cancle Appointment") {
        //     // console.log(contact)
        //     this.AppointmentCancle(contact.VisitId);
        // }
        this.getVisitList1();
    }

    newappointment() {
        const dialogRef = this._matDialog.open(HeaderComponent, {
            maxWidth: "110vw",
            height: "850px",
            width: "100%",

        });
        dialogRef.afterClosed().subscribe((result) => {

            this.getVisitList();
        });
    }
    feedback() {
        const dialogRef = this._matDialog.open(FeedbackComponent, {
            maxWidth: "80vw",
            height: "90%",
            width: "100%",

        });
    }

    PatientAppointment() {
        const dialogRef = this._matDialog.open(PatientAppointmentComponent,
            {
                maxWidth: "95vw",
                maxHeight: "95vh", width: '100%', height: "100%"
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }

    // field validation
    get f() {
        return this._AppointmentSreviceService.myFilterform.controls;
    }
    selectRow(row) {
        this.selectRow = row;
    }



    //

    // createCDKPortal(data, windowInstance) {
    //   if (windowInstance) {
    //     const outlet = new DomPortalOutlet(windowInstance.document.body, this.componentFactoryResolver, this.applicationRef, this.injector);
    //     const injector = this.createInjector(data);
    //     let componentInstance;
    //     componentInstance = this.attachHeaderContainer(outlet, injector);
    //     // console.log(windowInstance.document)
    //     let template = windowInstance.document.createElement('div'); // is a node
    //     template.innerHTML = this.printTemplate;
    //     windowInstance.document.body.appendChild(template);
    //   }
    // }
    // createInjector(data): any {
    //   const injectionTokens = new WeakMap();
    //   injectionTokens.set({}, data);
    //   return new PortalInjector(this.injector, injectionTokens);
    // }

    // attachHeaderContainer(outlet, injector) {
    //   const containerPortal = new ComponentPortal(HeaderComponent, null, injector);
    //   const containerRef: ComponentRef<HeaderComponent> = outlet.attach(containerPortal);
    //   return containerRef.instance;
    // }


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



    viewgetPatientAppointmentReportPdf(obj, Pflag) {

        this.chkprint = true;
        let VisitId;
        if (Pflag) {
            VisitId = obj.VisitId
        } else {
            VisitId = obj
        }

        setTimeout(() => {
            this.AdList = true;
            this._opappointmentService.getAppointmentReport(
                VisitId
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Appointment  Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.AdList = false;
                });
            });

        }, 100);
        this.chkprint = false;
    }


    viewgetPatientAppointmentTemplateReportPdf(obj, Pflag) {

        this.chkprint = true;
        let VisitId;
        if (Pflag) {
            VisitId = obj.VisitId
        } else {
            VisitId = obj
        }

        setTimeout(() => {
            this.AdList = true;
            this._opappointmentService.getAppointmenttemplateReport(
                VisitId
            ).subscribe(res => {
                const dialogRef = this._matDialog.open(PdfviewerComponent,
                    {
                        maxWidth: "85vw",
                        height: '750px',
                        width: '100%',
                        data: {
                            base64: res["base64"] as string,
                            title: "Appointment  Viewer"
                        }
                    });
                dialogRef.afterClosed().subscribe(result => {
                    this.AdList = false;
                });
            });

        }, 100);
        this.chkprint = false;
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
        this._AppointmentSreviceService.documentuploadInsert(formData).subscribe((data) => {
            if (data) {
                Swal.fire("Images uploaded Successfully  ! ");
            }
        });
    }


    //Image Upload
    imgArr: string[] = [];
    docArr: string[] = [];

    viewPdf(data: any) {
        const dialogRef = this._matDialog.open(PdfviewerComponent,
            {
                maxWidth: "95vw",
                height: '1000px',
                width: '100%',
                data: {
                    base64: data.url.split('application/pdf;base64,')[1] as string,
                    title: "Appointment Document"
                }
            });
    }
    getHospitalList1() {
        this._opappointmentService.getHospitalCombo().subscribe(data => {
            this.HospitalList1 = data;
            this.VisitFormGroup.get('HospitalId').setValue(this.HospitalList1[0]);
        })
    }
    // nextClicked(formGroupName) {
    //   if (formGroupName.invalid) {
    //     const controls = formGroupName.controls;
    //     Object.keys(controls).forEach(controlsName => {
    //       const controlField = formGroupName.get(controlsName);
    //       if (controlField && controlField.invalid) {
    //         //  Swal.fire('Error !', controlsName, 'error');
    //         controlField.markAsTouched({ onlySelf: true });
    //       }
    //     });
    //     return;
    //   }
    //   if (formGroupName == this.VisitFormGroup) {
    //     if (!this.isDepartmentSelected) {
    //       return;
    //     }
    //     this.OnSaveAppointment();
    //     return;
    //   }
    //   this.appointmentFormStepper.next();
    // }

    onDoctorOneChange(value) {
        console.log(this.VisitFormGroup.get('DoctorIdOne').value.reset(''));
    }

    backClicked() {
        this.appointmentFormStepper.previous();
    }

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

        this.registerObj = new RegInsert({});
        this.personalFormGroup.reset();
        this.personalFormGroup.get('RegId').reset();

        this.searchFormGroup.get('RegId').reset();

        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAllAsTouched();
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAllAsTouched();

        this.getHospitalList1();
        this.getHospitalList();
        this.getTariffCombo();
        this.getPatientTypeList();
        this.getPrefixList();
        this.getDepartmentList();
        this.getcityList1();
        this.getCompanyList();
        this.getSubTPACompList();

        this.isCompanySelected = false;
        this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
        this.VisitFormGroup.get('CompanyId').clearValidators();
        this.VisitFormGroup.get('SubCompanyId').clearValidators();
        this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
        this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
        this.patienttype = 1;

        const todayDate = new Date();
        const dob = new Date(this.currentDate);
        const timeDiff = Math.abs(Date.now() - dob.getTime());
        this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
        this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
        this.registerObj.DateofBirth = this.currentDate;
        this.personalFormGroup.get('DateOfBirth').setValue(this.currentDate);

        this.personalFormGroup.get('PhoneNo').clearValidators();
        // this.VisitFormGroup.get('PhoneNo').updateValueAndValidity();
    }


    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }

    ngOnDestroy() {
        this._onDestroy.next();
        this._onDestroy.complete();
    }

    get showNameEditor() {
        return this.editor === 'name';
    }
    removeImage(url: string) {
        let index = this.images.indexOf(url);
        this.images.splice(index, 1);
    }

    removeDoc(ele: DocData) {
        let index = this.docsArray.indexOf(ele);
        this.docsArray.splice(index, 1);
    }

    onViewImage(ele: any, type: string) {

        let fileType;
        if (ele) {

            const dialogRef = this.matDialog.open(ImageViewComponent,
                {
                    width: '900px',
                    height: '900px',
                    data: {
                        docData: type == 'img' ? ele : ele.doc,
                        type: type == 'img' ? "image" : ele.type
                    }
                }
            );
            dialogRef.afterClosed().subscribe(result => {

            });
        }
    }

    // OnChangeDoctorList1(departmentObj) {

    //     this.isDepartmentSelected = true;
    //     this._opappointmentService.getDoctorMasterCombo(departmentObj).subscribe(
    //         data => {
    //             this.DoctorList = data;

    //             this.optionsDoc = this.DoctorList.slice();
    //             this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
    //                 startWith(''),
    //                 map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
    //             );
    //         })

    //     if (this.configService.configParams.DoctorId) {

    //         const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
    //         this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
    //     }

    // }

    OnChangeDoctorList(departmentObj) {
        this.isDepartmentSelected = true;
        var vdata = {
            "Id": departmentObj.DepartmentId
        }
        this._opappointmentService.getDoctorMasterCombo(vdata).subscribe(data => {
            this.DoctorList = data;
            console.log(data)
            this.optionsDoc = this.DoctorList.slice();
            this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
            );
        })

        /// if (this.configService.configParams.DoctorId) {

        // this.configService.configParams.DoctorId = 269;
        // const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
        // this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
        //this.doctorset();
        // }
    }

    // doctorset() {

    //     this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
    //         startWith(''),
    //         map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
    //     );
    //     const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
    //     this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
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


        this.isLoading = 'save';

        this.pdfDataSource.data = [];
        this.doclist.push(
            {
                DocumentName: name,// this.imageForm.get('imgFileSource')?.value,
                DocumentPath: type// this.imageForm.get('imgFileSource')?.value,

            });
        this.isLoading = '';
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

        this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
            if (resData) {
                Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
            }
        });
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

        this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
            if (resData) {
                Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
            }
        });
    }


    Billpayment(contact) {
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
            Lbl: "AppointmentBill"
        };
        console.log(xx)
        //console.log(contact)
        this.advanceDataStored.storage = new SearchInforObj(xx);
        const dialogRef = this._matDialog.open(NewOPBillingComponent,
            {
                maxWidth: '90%',
                height: '95%',
                data: {
                    registerObj: xx,
                },
            });

        dialogRef.afterClosed().subscribe(result => {
            this.getVisitList1();
        });

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
        this.advanceDataStored.storage = new SearchInforObj(xx);
        const dialogRef = this._matDialog.open(PatientVitalInformationComponent,
            {
                maxWidth: '80%',
                height: '58%',
                data: {
                    registerObj: xx,
                },
            });

        dialogRef.afterClosed().subscribe(result => {
            this.getVisitList1();
        });

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
    // onDaysChange(){
    //     if (this.vDays > 0) {
    //         const today = new Date();
    //         const todaydays = today.getDate()
    //         const followDays = ((todaydays) + parseInt(this.vDays))
    //         console.log(followDays)
    //         const followUp = new Date();
    //         followUp.setDate((todaydays) + parseInt(this.vDays));
    //         this.followUpDate = this.datePipe.transform(followUp.toDateString(), 'MM/dd/YYYY');
    //         this.HealthCardExpDate = new Date(this.followUpDate);
    //         console.log(this.followUpDate)
    //       }else{
    //         if(this.vDays == '' || this.vDays == 0 || this.vDays == null || this.vDays == undefined)
    //             this.HealthCardExpDate = new Date();
    //       }
    // }
    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }
    exportReportExcel() {
        let exportHeaders = ['RegNoWithPrefix', 'PatientName', 'DVisitDate', 'VisitTime', 'OPDNo', 'Doctorname', 'RefDocName', 'PatientType'];
        this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'appointment');
    }

    exportReportPdf() {
        let actualData = [];
        this.dataSource.data.forEach(e => {
            var tempObj = [];
            tempObj.push(e.RegNoWithPrefix);
            tempObj.push(e.PatientName);
            // tempObj.push(e.DVisitDate);
            tempObj.push(e.VisitTime);
            tempObj.push(e.OPDNo);
            tempObj.push(e.Doctorname);
            tempObj.push(e.RefDocName);
            tempObj.push(e.PatientType);
            actualData.push(tempObj);
        });
        let headers = [['Reg No', 'Patient Name', 'Visit Time', 'OPD No', 'Doctor Name', 'Ref Doc Name', 'Patient Type']];
        this.reportDownloadService.exportPdfDownload(headers, actualData, 'appointment');
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
    @ViewChild('gender') gender: MatSelect;
    @ViewChild('mstatus') mstatus: ElementRef;
    @ViewChild('religion') religion: ElementRef;
    @ViewChild('city') city: ElementRef;
    @ViewChild('hname') hname: MatSelect;

    @ViewChild('ptype') ptype: ElementRef;
    @ViewChild('tariff') tariff: ElementRef;
    @ViewChild('dept') dept: ElementRef;
    @ViewChild('deptdoc') deptdoc: ElementRef;
    @ViewChild('refdoc') refdoc: ElementRef;
    @ViewChild('purpose') purpose: ElementRef;


    // @ViewChild('dept') dept: MatSelect;

    add: boolean = false;
    @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;


    public onEnterprefix(event, value): void {

        if (event.which === 13) {

            console.log(value)
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Prefix.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.fname.nativeElement.focus();
            }
        }


    }
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


    public onEntermstatus(event): void {
        if (event.which === 13) {
            this.mobile.nativeElement.focus();
        }

    }

    public onEnterreligion(event): void {

        if (event.which === 13) {
            this.ptype.nativeElement.focus();
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
    // public onEnterpan(event): void {
    //   if (event.which === 13) {
    //     this.address.nativeElement.focus();
    //   }
    // }

    public onEnterAadharCardNo(event): void {
        if (event.which === 13) {
            this.address.nativeElement.focus();
        }
    }

    public onEnterphone(event): void {
        if (event.which === 13) {
            this.religion.nativeElement.focus();


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

    public onEnterarea(event): void {


        if (event.which === 13) {
            this.city.nativeElement.focus();
        }
    }



    public onEntercity(event, value): void {
        if (event.which === 13) {

            if (value == undefined) {
                this.toastr.warning('Please Enter Valid City.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.mstatus.nativeElement.focus();

            }
        }
    }

    public onEnterhname(event): void {
        if (event.which === 13) {
            // if (this.ptype) this.ptype.focus();

        }
    }


    public onEnterptype(event, value): void {
        if (event.which === 13) {
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid PType.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.tariff.nativeElement.focus()

            }
        }
    }

    public onEnterptariff(event, value): void {
        if (event.which === 13) {

            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Tariff.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.dept.nativeElement.focus();

            }
        }
    }

    public onEnterdept(event, value): void {
        if (event.which === 13) {
            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.deptdoc.nativeElement.focus();
            }
        }
    }
    public onEnterdeptdoc(event, value): void {
        if (event.which === 13) {

            if (value == undefined) {
                this.toastr.warning('Please Enter Valid Doctor.', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            } else {
                this.refdoc.nativeElement.focus();
            }
        }
    }

    public onEnterrefdoc(event): void {
        if (event.which === 13) {
            // if(this.purpose) this.purpose.focus();
            this.purpose.nativeElement.focus();
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


    @HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
        //   
        // f10
        // if (event.keyCode === 121) {
        //     this.NewOPBill();
        // }
        // f8
        if (event.keyCode === 119) {
            this.NewOPBill();
        }
    }

    NewOPBill() {

        const dialogRef = this._matDialog.open(NewOPBillingComponent,
            {
                maxWidth: "99%",

                height: '1195px !important',

            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    updateRegisteredPatientInfo(obj) {
        const dialogRef = this._matDialog.open(UpdateRegisteredPatientInfoComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
                data: {
                    obj: obj
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            this.getVisitList1();
            this.searchFormGroup.get('RegId').setValue('');
        });
    }

    getNewPatient(element1) {
        let Newcount = 0;
        // netAmt = element.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
        // this.b_TotalChargesAmount = netAmt;
        // this.TotalnetPaybleAmt = this.b_TotalChargesAmount;
        this.dataSource.data.forEach((element) => {
            // console.log(element)
            if (element.patientOldNew) {
                Newcount + 1;
            }
        });
        console.log(Newcount)
        return Newcount;
    }
    getEditCompany(row) {

        this.advanceDataStored.storage = new VisitMaster(row);
        console.log(row)
        this._registrationService.populateFormpersonal(row);
        this.registerObj["RegId"] = row.RegID;
        this.registerObj["RegID"] = row.RegID;

        const dialogRef = this._matDialog.open(CompanyInformationComponent,
            {
                maxWidth: "70vw",
                height: '730px',
                width: '100%',
                data: {
                    registerObj: row,
                    Submitflag: true
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getVisitList1();
        });
    }
}

export class DocumentUpload {
    DocumentName: any;
    DocumentPath: string;

    constructor(DocumentUpload) {
        {
            this.DocumentName = DocumentUpload.DocumentName || '';
            this.DocumentPath = DocumentUpload.DocumentPath || '';

        }
    }
}

export class PatientDocument {
    Id: string;
    OPD_IPD_ID: Number;
    OPD_IPD_Type: Number;
    FileName: string;
    DocFile: File;
    constructor(PatientDocument) {
        {
            this.Id = PatientDocument.Id || "";
            this.OPD_IPD_ID = PatientDocument.OPD_IPD_ID || 0;
            this.OPD_IPD_Type = PatientDocument.opD_IPD_Type || 0;
            this.FileName = PatientDocument.Filename || "";
            this.DocFile = PatientDocument.DocFile || null;
        }
    }
}

export class VisitMaster {
    VisitId: Number;
    PrefixId: number;
    RegNoWithPrefix: number;
    PatientName: string;
    VisitDate: Date;
    VisitTime: Time;
    HospitalID: number;
    HospitalName: string;
    PatientTypeID: number;
    PatientTypeId: number;
    PatientType: string;
    CompanyId: number;
    OPDNo: string;
    TariffId: number;
    TariffName: string;
    ConsultantDocId: number;
    RefDocId: number;
    Doctorname: string;
    RefDocName: string;
    DepartmentId: number;
    appPurposeId: number;
    patientOldNew: Boolean;
    isMark: boolean;
    isXray: boolean;
    AddedBy: number;
    MPbillNo: number;
    RegNo: any;
    PhoneAppId: any;
    IsCancelled: any;
    /**
     * Constructor
     *
     * @param VisitMaster
     */
    constructor(VisitMaster) {
        {
            this.VisitId = VisitMaster.VisitId || "";
            (this.PrefixId = VisitMaster.PrefixId || ""),
                (this.RegNoWithPrefix = VisitMaster.RegNoWithPrefix || "");
            this.PatientName = VisitMaster.PatientName || "";
            this.VisitDate = VisitMaster.VisitDate || "";
            this.VisitTime = VisitMaster.VisitTime || "";
            this.HospitalID = VisitMaster.HospitalID || "";
            this.HospitalName = VisitMaster.HospitalName || "";
            this.PatientTypeID = VisitMaster.PatientTypeID || "";
            this.PatientTypeId = VisitMaster.PatientTypeId || "";
            this.PatientType = VisitMaster.PatientType || "";
            this.CompanyId = VisitMaster.CompanyId || "";
            this.TariffId = VisitMaster.TariffId || "";
            this.OPDNo = VisitMaster.OPDNo || "";
            this.ConsultantDocId = VisitMaster.ConsultantDocId || "";
            this.Doctorname = VisitMaster.Doctorname || "";
            this.RefDocId = VisitMaster.VisitTime || "";
            this.RefDocName = VisitMaster.RefDocName || "";
            this.DepartmentId = VisitMaster.DepartmentId || "";
            this.patientOldNew = VisitMaster.patientOldNew || "";
            this.isXray = VisitMaster.isXray || "";
            this.AddedBy = VisitMaster.AddedBy || "";
            this.MPbillNo = VisitMaster.MPbillNo || "";
            this.RegNo = VisitMaster.RegNo || "";
            this.PhoneAppId = VisitMaster.PhoneAppId || 0
            this.IsCancelled = VisitMaster.IsCancelled || 0
        }
    }
}

export class RegInsert {
    RegId: Number;
    RegDate: Date;
    RegTime: Time;
    PrefixId: number;
    PrefixID: number;
    FirstName: string;
    MiddleName: string;
    LastName: string;
    Address: string;
    City: string;
    PinNo: string;
    RegNo: string;
    DateofBirth: Date;
    Age: any;
    GenderId: Number;
    PhoneNo: string;
    MobileNo: string;
    AddedBy: number;
    AgeYear: any;
    AgeMonth: any;
    AgeDay: any;
    CountryId: number;
    StateId: number;
    CityId: number;
    MaritalStatusId: number;
    IsCharity: Boolean;
    ReligionId: number;
    AreaId: number;
    VillageId: number;
    TalukaId: number;
    PatientWeight: number;
    AreaName: string;
    AadharCardNo: string;
    PanCardNo: string;
    currentDate = new Date();
    AdmissionID: any;
    VisitId: any;
    WardId: any;
    BedId: any;
    /**
     * Constructor
     *
     * @param RegInsert
     */

    constructor(RegInsert) {
        {
            this.RegId = RegInsert.RegId || "";
            this.RegDate = RegInsert.RegDate || "";
            this.RegTime = RegInsert.RegTime || "";
            this.PrefixId = RegInsert.PrefixId || "";
            this.PrefixID = RegInsert.PrefixID || "";
            this.FirstName = RegInsert.FirstName || "";
            this.MiddleName = RegInsert.MiddleName || "";
            this.LastName = RegInsert.LastName || "";
            this.Address = RegInsert.Address || "";
            this.City = RegInsert.City || "";
            this.PinNo = RegInsert.PinNo || "";
            this.DateofBirth = RegInsert.DateofBirth || this.currentDate;
            this.Age = RegInsert.Age || "";
            this.GenderId = RegInsert.GenderId || "";
            this.PhoneNo = RegInsert.PhoneNo || "";
            this.MobileNo = RegInsert.MobileNo || "";
            this.AddedBy = RegInsert.AddedBy || "";
            this.AgeYear = RegInsert.AgeYear || 0;
            this.AgeMonth = RegInsert.AgeMonth || 0;
            this.AgeDay = RegInsert.AgeDay || 0;
            this.CountryId = RegInsert.CountryId || "";
            this.StateId = RegInsert.StateId || "";
            this.CityId = RegInsert.CityId || "";
            this.MaritalStatusId = RegInsert.MaritalStatusId || "";
            this.IsCharity = RegInsert.IsCharity || "";
            this.ReligionId = RegInsert.ReligionId || "";
            this.AreaId = RegInsert.AreaId || "";
            this.VillageId = RegInsert.VillageId || "";
            this.TalukaId = RegInsert.TalukaId || "";
            this.PatientWeight = RegInsert.PatientWeight || "";
            this.AreaName = RegInsert.AreaName || "";
            this.AadharCardNo = RegInsert.AadharCardNo || "";
            this.PanCardNo = RegInsert.PanCardNo || '';
            this.AdmissionID = RegInsert.AdmissionID || 0;
            this.VisitId = RegInsert.VisitId || 0;
            this.WardId = RegInsert.WardId || 0;
            this.BedId = RegInsert.BedId || 0;
        }
    }
}

export class AdvanceDetailObj {
    RegNo: Number;
    RegId: number;
    AdmissionID: Number;
    PatientName: string;
    Doctorname: string;
    DoctorName: string;
    AdmDateTime: string;
    AgeYear: number;
    ClassId: number;
    TariffName: String;
    TariffId: number;
    opD_IPD_Type: number;
    VisitId: number;
    storage: any;
    IPDNo: any;
    RefDoctorId: any;
    DoctorId: any;
    OPD_IPD_ID: any;
    RefDocName: any;
    WardName: any;
    BedName: any;
    VisitDate: any;
    VisitTime: any;
    PatientTypeId: any;
    CompanyId: any;
    HospitalId: any;
    VistDateTime: any;
    AadharCardNo: any;
    DepartmentId: any;
    Departmentid: any;
    /**
     * Constructor
     *
     * @param AdvanceDetailObj
     */
    constructor(AdvanceDetailObj) {
        {
            this.RegNo = AdvanceDetailObj.RegNo || "";
            this.RegId = AdvanceDetailObj.RegId || "";
            this.VisitId = AdvanceDetailObj.VisitId || "";
            this.AdmissionID = AdvanceDetailObj.AdmissionID || "";
            this.PatientName = AdvanceDetailObj.PatientName || "";
            this.Doctorname = AdvanceDetailObj.Doctorname || "";
            this.DoctorName = AdvanceDetailObj.DoctorName || "";
            this.AdmDateTime = AdvanceDetailObj.AdmDateTime || "";
            this.AgeYear = AdvanceDetailObj.AgeYear || "";
            this.ClassId = AdvanceDetailObj.ClassId || "";
            this.TariffName = AdvanceDetailObj.TariffName || "";
            this.TariffId = AdvanceDetailObj.TariffId || "";
            this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type || 0;
            this.IPDNo = AdvanceDetailObj.IPDNo || "";
            this.RefDoctorId = AdvanceDetailObj.RefDoctorId || 0;
            this.DoctorId = AdvanceDetailObj.DoctorId || 0;
            this.OPD_IPD_ID = AdvanceDetailObj.OPD_IPD_ID || 0;
            this.RefDocName = AdvanceDetailObj.RefDocName || "";
            this.WardName = AdvanceDetailObj.WardName || "";
            this.BedName = AdvanceDetailObj.BedName || "";
            this.VisitDate = AdvanceDetailObj.VisitDate || "";
            this.VisitTime = AdvanceDetailObj.VisitTime || "";
            this.PatientTypeId = AdvanceDetailObj.PatientTypeId || 0;
            this.CompanyId = AdvanceDetailObj.CompanyId || 0;
            this.HospitalId = AdvanceDetailObj.HospitalId || 0;
            this.VistDateTime = AdvanceDetailObj.VistDateTime || ''
            this.AadharCardNo = AdvanceDetailObj.AadharCardNo || '';
            this.DepartmentId = AdvanceDetailObj.DepartmentId || 0;
            this.Departmentid = AdvanceDetailObj.Departmentid || 0;
        }
    }
}