
import { ChangeDetectorRef, Component, ElementRef, HostListener, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs"; 
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router"; 
import Swal from "sweetalert2";
import { fuseAnimations } from "@fuse/animations"; 
import { map, startWith, takeUntil } from "rxjs/operators"; 
import { AdvanceDataStored } from "app/main/ipd/advance"; 
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
import { ConfigService } from "app/core/services/config.service";
import { MatDrawer } from "@angular/material/sidenav";
import { MatAccordion } from "@angular/material/expansion"; 
import { ThisReceiver } from "@angular/compiler";
import { ToastrService } from "ngx-toastr"; 
import { Table } from "jspdf-autotable";
import moment, { invalid } from "moment";
import { values } from "lodash";
import { WhatsAppEmailService } from "app/main/shared/services/whats-app-email.service";  
import { CompanyInformationComponent } from "app/main/ipd/company-information/company-information.component"; 
import { AppointmentSreviceService } from "../appointment-srevice.service";
import { RegistrationService } from "../../registration/registration.service";
import { ImageViewComponent } from "../image-view/image-view.component";
import { RegInsert } from "../appointment.component";


@Component({
  selector: 'app-update-registered-patient-info',
  templateUrl: './update-registered-patient-info.component.html',
  styleUrls: ['./update-registered-patient-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class UpdateRegisteredPatientInfoComponent implements OnInit {
 
    dateStyle?: string = 'Date';
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }
    CalcDOB(mode, e) {
        let d = new Date();
        if (mode == "Day") {
            d.setDate(d.getDate() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
            //this.personalFormGroup.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
        }
        else if (mode == "Month") {
            d.setMonth(d.getMonth() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
        }
        else if (mode == "Year") {
            d.setFullYear(d.getFullYear() - Number(e.target.value));
            this.registerObj.DateofBirth = d;
        }
        let todayDate = new Date();
        const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
        this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
    }
    msg: any;
    // isLoading = true;
    isRateLimitReached = false;
    hasSelectedContacts: boolean;
    currentDate = new Date();
    subscriptions: Subscription[] = []; 
    printTemplate: any;
    TempKeys: any[] = []; 
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


 
    sanitizeImagePreview;
    filterReligion: any;
    filterMaritalstatus: any;
    filterArea: any;
    filterHospital: any;

 
    constructor(
        public _AppointmentSreviceService: AppointmentSreviceService,
        public _opappointmentService: AppointmentSreviceService,
        private dialogRef: MatDialogRef<UpdateRegisteredPatientInfoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private accountService: AuthenticationService,
        public _registerService: RegistrationService,
        public _matDialog: MatDialog,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder, 
        public configService : ConfigService,
        public matDialog: MatDialog,
        public toastr: ToastrService,   
        public _WhatsAppEmailService: WhatsAppEmailService, 
    ) { }


    ngOnInit(): void { 
        this.personalFormGroup = this.createPesonalForm();
        this.personalFormGroup.markAsUntouched();
        this.VisitFormGroup = this.createVisitdetailForm();
        this.VisitFormGroup.markAsUntouched(); 
        if(this.data){
          this.registerObj = this.data.obj;
          console.log(   this.registerObj ) 
          this.PatientName =  this.data.obj.PatientName;
          this.RegId =  this.registerObj.RegId;

          let todayDate = new Date();
          const d = new Date(this.registerObj.DateofBirth);
          const timeDiff = Math.abs(Date.now() - d.getTime());
          this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
          this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - d.getMonth());
          this.registerObj.AgeDay = Math.abs(todayDate.getDate() - d.getDate());
           
          this.setDropdownObjs();
          this.VisitFlagDisp = true; 
        }  
        // this.getVisitList();
        this.getDoctorNameCombobox(); 
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
        this.RegOrPhoneflag = 'Entry from Registration'
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
            template:''

        });
    }
    IsPhoneAppflag: boolean = true;  

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
    } 
    
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
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.registerObj.DateofBirth = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
        } 
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

    getDoctorNameCombobox() {
        this._AppointmentSreviceService.getDoctorMasterComboA().subscribe(data => {
            this.doctorNameCmbList = data;
            this.optionsDoctor = this.doctorNameCmbList.slice();
            this.filteredOptionsDoctor = this._AppointmentSreviceService.myFilterform.get('DoctorId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
            ); 
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
               
                    this.onSaveRegistered(); 
                    this.onClose(); 
            }
        } else {
            Swal.fire("Enter Age Properly ..")
        }
       
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
                        this.viewgetPatientAppointmentReportPdf(response, false);
                        debugger 
                    } 
                });
            } else {
                Swal.fire('Error !', 'Appointment not Updated', 'error');
            }
            this.isLoading = '';
        }); 
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
 
 
    get f() {
        return this._AppointmentSreviceService.myFilterform.controls;
    }
  
    getHospitalList1() {
        this._opappointmentService.getHospitalCombo().subscribe(data => {
            this.HospitalList1 = data;
            this.VisitFormGroup.get('HospitalId').setValue(this.HospitalList1[0]);
        })
    } 
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
    }
    RegOrPhoneflag = '';
    onClose() {

        this.registerObj = new RegInsert({});
        this.personalFormGroup.reset();
        this.personalFormGroup.get('RegId').reset(); 
       

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
        this._matDialog.closeAll()
    }


    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
    }
 
    OnChangeDoctorList1(departmentObj) { 
        this.isDepartmentSelected = true;
        this._opappointmentService.getDoctorMasterCombo(departmentObj).subscribe(
            data => {
                this.DoctorList = data;

                this.optionsDoc = this.DoctorList.slice();
                this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
                    startWith(''),
                    map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
                );
            })

        if (this.configService.configParams.DoctorId) {

            const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
            this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
        }

    } 
    OnChangeDoctorList(departmentObj) {
        
        this.isDepartmentSelected = true;
        this._opappointmentService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
            data => {
                this.DoctorList = data;
                console.log(data)
                this.optionsDoc = this.DoctorList.slice();
                this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
                    startWith(''),
                    map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
                );
            })

        if (this.configService.configParams.DoctorId) {

            // this.configService.configParams.DoctorId = 269;
            // const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
            // this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
            this.doctorset();
        }
    }

    doctorset() {

        this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
        const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
        this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
    }
 

    //   CameraComponent

     openCamera(type: string, place: string) {
    //     let fileType;
    //     const dialogRef = this.matDialog.open(ImageViewComponent,
    //         {
    //             width: '750px',
    //             height: '550px',

    //             data: {
    //                 docData: type == 'camera' ? 'camera' : '',
    //                 type: type == 'camera' ? 'camera' : '',
    //                 place: place
    //             }
    //         }
    //     );
    //     dialogRef.afterClosed().subscribe(result => {
    //         if (result) {
    //             if (place == "photo") {
    //                 this.sanitizeImagePreview = result.url;
    //             }
    //             else {
    //                 this.imgArr.push(result.name);
    //                 this.images.push(result);
    //                 this.imgDataSource.data = this.images;
    //             }
    //         }
    //     });
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
}
 
 