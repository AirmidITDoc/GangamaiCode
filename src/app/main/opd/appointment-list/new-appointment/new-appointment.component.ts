import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit {
  dateStyle?: string = 'Date';
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  

  
  registerObj = new RegInsert({});
    OnChangeDobType(e) {
        this.dateStyle = e.value;
    }
    CalcDOB(mode, e) {
        // let d = new Date();
        // if (mode == "Day") {
        //     d.setDate(d.getDate() - Number(e.target.value));
        //     this.registerObj.DateofBirth = d;
        //     //this.personalFormGroup.get('DateOfBirth').setValue(moment().add(Number(e.target.value), 'days').format("DD-MMM-YYYY"));
        // }
        // else if (mode == "Month") {
        //     d.setMonth(d.getMonth() - Number(e.target.value));
        //     this.registerObj.DateofBirth = d;
        // }
        // else if (mode == "Year") {
        //     d.setFullYear(d.getFullYear() - Number(e.target.value));
        //     this.registerObj.DateofBirth = d;
        // }
        // let todayDate=new Date();
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
   
    TempKeys: any[] = [];
   
    VisitID: any;

    showtable: boolean = false;

    Regflag: boolean = false;

   
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
    // private trigger: Subject<any> = new Subject();
    // // public webcamImage!: WebcamImage;
    // private nextWebcam: Subject<any> = new Subject();
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
    // docsArray: DocData[] = [];
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

   
 
    menuActions: Array<string> = [];
    pdfDataSource = new MatTableDataSource<any>();
    imgDataSource = new MatTableDataSource<any>();
    filterReligion: any;
    filterMaritalstatus: any;
    filterArea: any;
    filterHospital: any;

    public height: string;
    sanitizeImagePreview;
    constructor(
        public _AppointmentlistService: AppointmentlistService,
        public _opappointmentService: AppointmentSreviceService,
        public dialogRef: MatDialogRef<NewAppointmentComponent>,
              public _matDialog: MatDialog,
              private _ActRoute: Router,
              public _WhatsAppEmailService: WhatsAppEmailService,
        public datePipe: DatePipe,
        private formBuilder: FormBuilder,
        public matDialog: MatDialog,
        public toastr: ToastrService,
       
    ) {
        
    }


    ngOnInit(): void {

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

        // this.getDoctor1List();
        this.getDoctor2List();

        this.getConDoctorList();
        this.getRefDoctorList();

        this.getPurposeList();

        // this.OnChangeDoctorList1(this.configService.configParams.DepartmentId);

        this.hospitalFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterHospital();
            });

      
    this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
        startWith(''),
        map(value => this._filterPrex(value)),
  
      );

        this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
        );


        this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
        );

        this.filteredOptionsRefDoc = this.VisitFormGroup.get('RefDocId').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterRefdoc(value) : this.Doctor2List.slice()),
        );

        this.filteredOptionsPatientType = this.VisitFormGroup.get('PatientTypeID').valueChanges.pipe(
            startWith(''),
            map(value => this._filterPtype(value)),

        );
        this.filteredOptionsTarrif = this.VisitFormGroup.get('TariffId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterTariffId(value)),

        );

        this.filteredOptionsPurpose = this.VisitFormGroup.get('PurposeId').valueChanges.pipe(
            startWith(''),
            map(value => this._filterTariffId(value)),

        );
        this.CalcDOB('',null);
    }


    

    
    getDoctorList() {
        var mode="ConDoctor"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.Doctor1List = data;
            this.optionsRefDoc = this.Doctor1List.slice();
            this.filteredOptionsRefDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
            );

        });
    }

    getConDoctorList() {
        var mode="ConDoctor"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.Doctor1List = data;
            this.optionsRefDoc = this.Doctor1List.slice();
            this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
            );

        });
    }

    getRefDoctorList() {
        var mode="RefDoctor"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.Doctor2List = data;
            this.optionsRefDoc = this.Doctor2List.slice();
            this.filteredOptionsRefDoc = this.VisitFormGroup.get('RefDocId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterRefdoc(value) : this.Doctor2List.slice()),
            );

        });
    }

    DocSelectdelete() {

        this.VisitFormGroup.get('RefDocId').setValue(null);

        // this.getDoctor1List();
    }


    getDoctor2List() {
         var mode="RefDoctor"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => { this.Doctor2List = data; })
    }


    getOptionTextPrefix(option) {
        return option && option.text ? option.text : '';
    }

    getOptionTextpatienttype(option) {
        return option && option.text ? option.text : '';
    }

    getOptionTextTariff(option) {
        return option && option.text ? option.text : '';
    }


    getOptionTextDep(option) {

        return option && option.text ? option.text : '';
    }



    getOptionTextCity(option) {
        return option && option.text ? option.text : '';

    }

    getOptionTextDoc(option) {

        return option && option.text ? option.text : '';

    }

    getOptionTextRefDoc(option) {

        return option && option.text ? option.text : '';

    }

    getOptionTextRelation(option) {

        return option && option.text ? option.text : '';

    }
    getOptionTextPurpose(option) {

        return option && option.text ? option.text : '';
    }


    private _filterPrex(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.PrefixList.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterDep(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.DepartmentList.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }



    private _filterSubCompany(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.SubTPACompList.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }


    private _filterCity(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.cityList.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterDoc(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            this.isDoctorSelected = false;
            return this.Doctor1List.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterRefdoc(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.Doctor2List.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterPurpose(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsPurpose.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterPatientType(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsPatientType.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterTariff(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsTariff.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }
    private _filterArea(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsArea.filter(option => option.text.toLowerCase().includes(filterValue));
        }
    }


    private _filterReligion(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsReligion.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    private _filterMstatus(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsMstatus.filter(option => option.text.toLowerCase().includes(filterValue));
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
            DateOfBirth: [''],
            AgeYear: ['', [
                Validators.required,
                Validators.pattern("^[0-9]*$")]],
            AgeMonth: ['', Validators.pattern("[0-9]+")],
            AgeDay: ['', Validators.pattern("[0-9]+")],
            PhoneNo: ['', [
                Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
                Validators.minLength(10),
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
            IsHealthCard:'',
            Days:'',
            HealthcardDate:[new Date().toISOString()],
            HealthCardNo:''

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
            PurposeId: ''
        });
    }
    IsPhoneAppflag: boolean = true;

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
        var mode="Prefix"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.PrefixList = data;
            this.optionsPrefix = this.PrefixList.slice();
            this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterPrex(value) : this.PrefixList.slice()),
            );

        });
    }


    getcityList1() {
  var mode="City"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.cityList = data;
            this.optionsCity = this.cityList.slice();
            this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterCity(value) : this.cityList.slice()),
            );

        });

    }

    getPurposeList() {
          var mode="Purpose"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
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
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.PatientTypeList.filter(option => option.text.toLowerCase().includes(filterValue));
        }
    }

    getPatientTypeList() {
        var mode="PatientType"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.PatientTypeList = data;
            this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
        });
    }


    private _filterTariffId(value: any): string[] {
        if (value) {
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
            return this.TariffList.filter(option => option.text.toLowerCase().includes(filterValue));
        }
    }

    getTariffCombo() {
         var mode="Tariff"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.TariffList = data;
            this.VisitFormGroup.get('TariffId').setValue(this.TariffList[0]);
        });
    }


    onChangePatient(value) {
debugger
        // if (value.PatientTypeId == 2) {
            if (value.text == "Company") {
            this._opappointmentService.getCompanyCombo();
            this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
            this.isCompanySelected = true;
            this.patienttype = 2;
        // } else if (value.PatientTypeId !== 2) {
          } else if (value.text != "Company") {
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
  

  

    // AppointmentCancle(contact) {
    //     Swal.fire({
    //         title: 'Do you want to Cancle Appointment',
    //         // showDenyButton: true,
    //         showCancelButton: true,
    //         confirmButtonText: 'OK',

    //     }).then((flag) => {


    //         if (flag.isConfirmed) {
    //             let appointmentcancle = {};
    //             appointmentcancle['visitId'] = contact.VisitId;

    //             let submitData = {
    //                 "appointmentcancle": appointmentcancle

    //             };
    //             console.log(submitData);
    //             this._AppointmentSreviceService.Appointmentcancle(submitData).subscribe(response => {
    //                 if (response) {
    //                     Swal.fire('Appointment cancelled !', 'Appointment cancelled Successfully!', 'success').then((result) => {

    //                     });
    //                     this.getVisitList1();
    //                 } else {
    //                     Swal.fire('Error !', 'Appointment cancelled data not saved', 'error');
    //                 }
    //                 this.isLoading = '';
    //             });
    //         }
    //     });
    //     this.getVisitList1();
    // }
    getClassList() {
        var mode="Class"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => { this.ClassList = data; })
    }


    getAreaList() {
  var mode="Area"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.AreaList = data;
            this.optionsArea = this.AreaList.slice();
            this.filteredOptionsArea = this.personalFormGroup.get('AreaId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterArea(value) : this.AreaList.slice()),
            );

        });
    }


    getMaritalStatusList() {
          var mode="MaritalStatus"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.MaritalStatusList = data;
            this.optionsMstatus = this.MaritalStatusList.slice();
            this.filteredOptionsMstatus = this.personalFormGroup.get('MaritalStatusId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterMstatus(value) : this.MaritalStatusList.slice()),
            );

        });
    }


    getReligionList() {
          var mode="Religion"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.ReligionList = data;
            this.optionsReligion = this.ReligionList.slice();
            this.filteredOptionsReligion = this.personalFormGroup.get('ReligionId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterReligion(value) : this.ReligionList.slice()),
            );

        });
    }



    getCompanyList() {
         var mode="Company"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
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
            const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();

            return this.optionsCompany.filter(option => option.text.toLowerCase().includes(filterValue));
        }

    }

    getSubTPACompList() {
          var mode="SubCompany"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.SubTPACompList = data;
            this.optionsSubCompany = this.SubTPACompList.slice();
            this.filteredOptionsSubCompany = this.VisitFormGroup.get('SubCompanyId').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterSubCompany(value) : this.SubTPACompList.slice()),
            );

        });
    }


    getDepartmentList() {
var mode="Department"
        this._AppointmentlistService.getMaster(mode,1).subscribe(data => {
            this.DepartmentList = data;
            console.log(data)
            this.optionsDep = this.DepartmentList.slice();
            this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
                startWith(''),
                map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
            );
            // if (this.configService.configParams.DepartmentId) {

            //     const ddValue = this.DepartmentList.filter(c => c.DepartmentId == this.configService.configParams.DepartmentId);
            //     this.VisitFormGroup.get('Departmentid').setValue(ddValue[0]);
            //     this.OnChangeDoctorList(ddValue[0]);
            //     this.VisitFormGroup.updateValueAndValidity();
            //     return;
            // }
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
var mode="CountryByState"
StateId.value=1
            this._AppointmentlistService.getMaster(mode,StateId.value).subscribe(data => {
                this.countryList = data;
                this.selectedCountry = this.countryList[0].CountryName;
                this.personalFormGroup.get('CountryId').setValue(this.countryList[0]);
                this.personalFormGroup.updateValueAndValidity();
            });
        }
    }

    onChangeDateofBirth(DateOfBirth) {
        // console.log(DateOfBirth)
        if (DateOfBirth) {
            const todayDate = new Date();
            const dob = new Date(DateOfBirth);
            const timeDiff = Math.abs(Date.now() - dob.getTime());
            this.registerObj.ageYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
            this.registerObj.ageMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
            this.registerObj.ageDay = Math.abs(todayDate.getDate() - dob.getDate());
            this.registerObj.DateofBirth = DateOfBirth;
            this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
        }

    }
    // VisitList
    resultsLength = 0;

    // getVisitList() {

    //     var D_data = {
    //         F_Name: this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
    //         L_Name: this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
    //         Reg_No: this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
    //         Doctor_Id: this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorID || 0,
    //         From_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("startdate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
    //         To_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("enddate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
    //         IsMark: this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
    //     };
    //     setTimeout(() => {
    //         this._AppointmentSreviceService.getAppointmentListold(D_data).subscribe(
    //             (Visit) => {

    //                 this.dataSource.data = Visit as VisitMaster[];

    //             },
    //             (error) => {
    //                 this.isLoading = 'list-loaded';
    //             }
    //         );
    //     }, 1000);
    // }
    isRowDisabled: boolean = false

    chkdisabled(contact) {

        if (contact.IsCancelled)
            this.isRowDisabled = true
        else
            this.isRowDisabled = false
    }



    // getVisitList1() {
    //     debugger

    //     console.log(this._AppointmentSreviceService.myFilterform.get("DoctorId").value)
    //     var D_data = {
    //         F_Name: this._AppointmentSreviceService.myFilterform.get("FirstName").value.trim() + "%" || "%",
    //         L_Name: this._AppointmentSreviceService.myFilterform.get("LastName").value.trim() + "%" || "%",
    //         Reg_No: this._AppointmentSreviceService.myFilterform.get("RegNo").value || 0,
    //         Doctor_Id: this._AppointmentSreviceService.myFilterform.get("DoctorId").value.DoctorId || 0,
    //         From_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("startdate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
    //         To_Dt: this.datePipe.transform(this._AppointmentSreviceService.myFilterform.get("enddate").value, "yyyy-MM-dd 00:00:00.000") || "01/01/1900",
    //         IsMark: this._AppointmentSreviceService.myFilterform.get("IsMark").value || 0,
    //         Start: (this.paginator?.pageIndex ?? 0),
    //         Length: (this.paginator?.pageSize ?? 10),
    //         Sort: this.sort?.active ?? 'VisitId',
    //         Order: this.sort?.direction ?? 'desc'
    //     };
    //     console.log(D_data)
    //     setTimeout(() => {

    //         this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
    //             (Visit) => {
    //                 this.dataSource.data = Visit["Table1"] ?? [] as VisitMaster[];
    //                 console.log(this.dataSource.data)
    //                 if (this.dataSource.data.length > 0) {
    //                     this.Appointdetail(this.dataSource.data);
    //                 }
    //                 this.dataSource.sort = this.sort;
    //                 this.resultsLength = Visit["Table"][0]["total_row"];
    //                 // this.dataSource.paginator = this.paginator;
    //                 this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
    //             },
    //             (error) => {
    //                 // this.isLoading = 'list-loaded';
    //             }
    //         );
    //     }, 1000);

    //     console.log(this.dataSource.data)
    // }

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
        // this._AppointmentSreviceService.getDoctorMasterComboA().subscribe(data => {
        //     this.doctorNameCmbList = data;
        //     this.optionsDoctor = this.doctorNameCmbList.slice();
        //     this.filteredOptionsDoctor = this._AppointmentSreviceService.myFilterform.get('DoctorId').valueChanges.pipe(
        //         startWith(''),
        //         map(value => value ? this._filterDoctor(value) : this.doctorNameCmbList.slice()),
        //     );

        // });
    }


    getOptionTextDoctor(option) {
        return option && option.text ? option.text : '';
    }

    getOptionTextCompany(option) {
        return option && option.text ? option.text : '';
    }

    getOptionTextSubCompany(option) {

        return option && option.text ? option.text : '';
    }

    getOptionTextArea(option) {

        return option && option.text ? option.text : '';
    }

    getOptionTextReligion(option) {

        return option && option.text ? option.text : '';
    }

    getOptionTextMstatus(option) {

        return option && option.text ? option.text : '';
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
        // this.registerObj = obj;
        // this.registerObj.MobileNo = obj.MobileNo.trim();
        // this.registerObj.DateofBirth = this.currentDate;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;
        this.RegNo = obj.RegNo;
        this.vPhoneAppId = obj.PhoneAppId;
        this.vReligionId = obj.ReligionId;
        this.vAreaId = obj.AreaId
        this.vMaritalStatusId = obj.MaritalStatusId;



        // this.setDropdownObjs();

        this.VisitFlagDisp = true;
        let todayDate=new Date();
        // const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
        // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
        // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
    }

    getSelectedObj(obj) {
        console.log(obj)
        this.RegOrPhoneflag = 'Entry from Registration';
        let todayDate=new Date();
        const d=new Date(obj.DateofBirth);
        const timeDiff = Math.abs(Date.now() -d.getTime());
        obj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
        obj.AgeMonth = Math.abs(todayDate.getMonth() - d.getMonth());
        obj.AgeDay = Math.abs(todayDate.getDate() - d.getDate());
        //this.registerObj = obj;
        this.PatientName = obj.PatientName;
        this.RegId = obj.RegId;
        this.VisitFlagDisp = true;
    }
  

    onChangeGenderList(prefixObj) {
        if (prefixObj) {
            prefixObj.value=1
            var mode="GenderByPrefix"
            this._AppointmentlistService.getMaster(mode,prefixObj.value).subscribe(data => {
                this.GenderList = data;
                this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
                this.selectedGenderID = this.GenderList[0].GenderId;
            });
        }
    }

    // onNewSave() {
    //     if ((this.vPrefixID == '' || this.vPrefixID == null || this.vPrefixID == undefined)) {
    //         this.toastr.warning('Please select valid Prefix ', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vCityId == '' || this.vCityId == null || this.vCityId == undefined)) {
    //         this.toastr.warning('Please select valid City', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vPatientTypeID == '' || this.vPatientTypeID == null || this.vPatientTypeID == undefined)) {
    //         this.toastr.warning('Please select PatientType', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vTariff == '' || this.vTariff == null || this.vTariff == undefined)) {
    //         this.toastr.warning('Please select Tariff', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vDepartmentid == '' || this.vDepartmentid == null || this.vDepartmentid == undefined)) {
    //         this.toastr.warning('Please Select Department', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if ((this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined)) {
    //         this.toastr.warning('Please Select Doctor', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     const ischeckprefix = this.PrefixList.some(item => item.text === this.personalFormGroup.get('PrefixID').value.value)
    //     if (!ischeckprefix) {
    //         this.toastr.warning('Please Select valid Prefix', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (this.personalFormGroup.get('AreaId').value) {
    //         if (!this.AreaList.some(item => item.AreaName === this.personalFormGroup.get('AreaId').value.AreaName)) {
    //             this.toastr.warning('Please Select valid AreaName', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //     }
    //     if (!this.cityList.some(item => item.CityName === this.personalFormGroup.get('CityId').value.CityName)) {
    //         this.toastr.warning('Please Select valid City', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (this.personalFormGroup.get('MaritalStatusId').value) {
    //         if (!this.MaritalStatusList.some(item => item.MaritalStatusName === this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusName)) {
    //             this.toastr.warning('Please Select valid MaritalStatus', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //     }
    //     if (this.personalFormGroup.get('ReligionId').value) {
    //         if (!this.ReligionList.some(item => item.ReligionName === this.personalFormGroup.get('ReligionId').value.ReligionName)) {
    //             this.toastr.warning('Please Select valid ReligionName', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //     }
    //     if (!this.PatientTypeList.some(item => item.PatientType === this.VisitFormGroup.get('PatientTypeID').value.PatientType)) {
    //         this.toastr.warning('Please Select valid PatientType', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (!this.TariffList.some(item => item.TariffName === this.VisitFormGroup.get('TariffId').value.TariffName)) {
    //         this.toastr.warning('Please Select valid TariffName', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }

    //     if (!this.DepartmentList.some(item => item.departmentName === this.VisitFormGroup.get('Departmentid').value.departmentName)) {
    //         this.toastr.warning('Please Select valid departmentName', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (!this.DoctorList.some(item => item.Doctorname === this.VisitFormGroup.get('DoctorID').value.Doctorname)) {
    //         this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }
    //     if (this.VisitFormGroup.get('RefDocId').value) {
    //         if (!this.Doctor1List.some(item => item.DoctorName === this.VisitFormGroup.get('RefDocId').value.DoctorName)) {
    //             this.toastr.warning('Please Select valid RefDoctorName', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //     }
    //     if (this.VisitFormGroup.get('PurposeId').value) {
    //         if (!this.PurposeList.some(item => item.PurposeName === this.VisitFormGroup.get('PurposeId').value.PurposeName)) {
    //             this.toastr.warning('Please Select valid PurposeName', 'Warning !', {
    //                 toastClass: 'tostr-tost custom-toast-warning',
    //             });
    //             return;
    //         }
    //     }

    //     if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {

    //         if (this.searchFormGroup.get('regRadio').value == "registration") {
    //             //if (this.vPhoneAppId == 0 && this.Regflag == false) {
    //             this.OnsaveNewRegister();

    //         }
    //         else if (this.searchFormGroup.get('regRadio').value == "registrered") {
    //             // this.onSaveRegistered();
    //             this.onClose();
    //         }
    //     }
    //     // this.getVisitList1();
    // }

    onSave() {

        let DoctorID = this.VisitFormGroup.get('DoctorID').value.DoctorId

        if (DoctorID == undefined) {
            this.toastr.warning('Please Enter Valid DoctorName.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        else {
            if ((!this.personalFormGroup.invalid && !this.VisitFormGroup.invalid)) {
              
                if (this.searchFormGroup.get('regRadio').value == "registration") {
                    //if (this.vPhoneAppId == 0 && this.Regflag == false) {
                    this.OnsaveNewRegister();
                    this.onClose();
                }
                else if (this.searchFormGroup.get('regRadio').value == "registrered") {
                    this.onSaveRegistered();
                    this.onClose();
                }

            }

        }
        
    }


    OnsaveNewRegister() {
      debugger
            let Areaid = 0;
        if (this.personalFormGroup.get('AreaId').value)
            Areaid = this.personalFormGroup.get('AreaId').value.value;

        let MaritalStatusId = 0;
        if (this.personalFormGroup.get('MaritalStatusId').value)
            MaritalStatusId = this.personalFormGroup.get('MaritalStatusId').value.value;

        let ReligionId = 0;
        if (this.personalFormGroup.get('ReligionId').value)
            ReligionId = this.personalFormGroup.get('ReligionId').value.value;

        let RefDocId = 0;
        if (this.VisitFormGroup.get('RefDocId').value)
            RefDocId = this.VisitFormGroup.get('RefDocId').value.value;

        let PurposeId = 0;
        if (this.VisitFormGroup.get('PurposeId').value)
            PurposeId = this.VisitFormGroup.get('PurposeId').value.value;


        if (this.patienttype != 2) {
            this.CompanyId = 0;

        } else if (this.patienttype == 2) {
            this.CompanyId = this.VisitFormGroup.get('CompanyId').value.value;
        }

      // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){
    this.CompanyId = this.VisitFormGroup.get('CompanyId').value.value || 0;
      var m_data = {
        
          "Registration": {
            "regID": 0,
            "regDate":  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "regTime":this.dateTimeObj.time,
            "prefixId": this.personalFormGroup.get('PrefixID').value.value || 0,
            "firstName":  this.personalFormGroup.get('FirstName').value || '',
            "middleName":  this.personalFormGroup.get('MiddleName').value || '',
            "lastName":  this.personalFormGroup.get('LastName').value || '',
            "address":  this.personalFormGroup.get('Address').value || '',
            "city": this.personalFormGroup.get('CityId').value.text || 0,
            "pinNo": "",//this.personalFormGroup.get('PhoneNo').value || '',
            "dateofBirth":  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "age":  this.personalFormGroup.get('AgeYear').value.toString() || '',
            "genderID": this.personalFormGroup.get('GenderId').value.value || 0,
            "phoneNo": this.personalFormGroup.get('PhoneNo').value || '',
            "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
            "addedBy": 0,
            "updatedBy": 0,
            "ageYear":  this.personalFormGroup.get('AgeYear').value.toString() || '',
            "ageMonth":  this.personalFormGroup.get('AgeMonth').value.toString() || '',
            "ageDay":  this.personalFormGroup.get('AgeDay').value.toString() || '',
            "countryId": this.personalFormGroup.get('CountryId').value.value || 0,
            "stateId":this.personalFormGroup.get('StateId').value.value || 0,
            "cityId":this.personalFormGroup.get('CityId').value.value || 0,
            "maritalStatusId": this.personalFormGroup.get('MaritalStatusId').value.value || 0,
            "isCharity": true,
            "religionId": this.personalFormGroup.get('ReligionId').value.value || 0,
            "areaId":this.personalFormGroup.get('AreaId').value.value || 0,
            "isSeniorCitizen": true,
            "aadharCardNo": this.personalFormGroup.get('AadharCardNo').value.toString() || '',
            "panCardNo": this.personalFormGroup.get('PanCardNo').value.toString() || '',
            "photo":  " "
          },
          "Visit": {
            "visitID": 0,
            "regId": 0,
            "visitDate":this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "visitTime":this.dateTimeObj.time,
            "unitId": this.VisitFormGroup.get('HospitalId').value.value ? this.VisitFormGroup.get('HospitalId').value.value : 0,
            "patientTypeId": this.VisitFormGroup.get('PatientTypeID').value.value ? this.VisitFormGroup.get('PatientTypeID').value.value : 0,
            "consultantDocId":  this.VisitFormGroup.get('DoctorID').value.value ? this.VisitFormGroup.get('DoctorID').value.value : 0,
            "refDocId": this.VisitFormGroup.get('RefDocId').value.value ? this.VisitFormGroup.get('RefDocId').value.value : 0,
            "tariffId": this.VisitFormGroup.get('TariffId').value.value ? this.VisitFormGroup.get('TariffId').value.value : 0,
            "companyId": this.CompanyId,//  this.VisitFormGroup.get('HospitalId').value.value ? this.VisitFormGroup.get('HospitalId').value.value : 0,
            "addedBy": 0,
            "updatedBy": 0,
            "isCancelledBy": 0,
            "isCancelled": true,
            "isCancelledDate": "2024-09-18T11:24:02.656Z",
            "classId": 1,//this.VisitFormGroup.get('ClassId').value.value ? this.VisitFormGroup.get('ClassId').value.value : 0,
            "departmentId": this.VisitFormGroup.get('Departmentid').value.value ? this.VisitFormGroup.get('Departmentid').value.value : 0,
            "patientOldNew": 0,
            "firstFollowupVisit": 0,
            "appPurposeId": this.VisitFormGroup.get('PurposeId').value.value ? this.VisitFormGroup.get('PurposeId').value.value : 0,
            "followupDate": "2024-09-18T11:24:02.656Z",
            "crossConsulFlag": 0,
            "phoneAppId": 0
          }
        }
  
      
      console.log(m_data);
      let that = this;
      this._AppointmentlistService.appointmentSave(m_data).subscribe((response) => {
        this.toastr.success(response.message);
      this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    }
   
    onSaveRegistered() {
        debugger
        let Areaid = 0;
    if (this.personalFormGroup.get('AreaId').value)
        Areaid = this.personalFormGroup.get('AreaId').value.value;

    let MaritalStatusId = 0;
    if (this.personalFormGroup.get('MaritalStatusId').value)
        MaritalStatusId = this.personalFormGroup.get('MaritalStatusId').value.value;

    let ReligionId = 0;
    if (this.personalFormGroup.get('ReligionId').value)
        ReligionId = this.personalFormGroup.get('ReligionId').value.value;

    let RefDocId = 0;
    if (this.VisitFormGroup.get('RefDocId').value)
        RefDocId = this.VisitFormGroup.get('RefDocId').value.value;

    let PurposeId = 0;
    if (this.VisitFormGroup.get('PurposeId').value)
        PurposeId = this.VisitFormGroup.get('PurposeId').value.value;


    if (this.patienttype != 2) {
        this.CompanyId = 0;

    } else if (this.patienttype == 2) {
        this.CompanyId = this.VisitFormGroup.get('CompanyId').value.value;
    }

  // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){
this.CompanyId = this.VisitFormGroup.get('CompanyId').value.value || 0;
  var m_data = {
    
      "Registration": {
        "regID": this.RegId,
        "regDate":  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
        "regTime":this.dateTimeObj.time,
        "prefixId": this.personalFormGroup.get('PrefixID').value.value || 0,
        "firstName":  this.personalFormGroup.get('FirstName').value || '',
        "middleName":  this.personalFormGroup.get('MiddleName').value || '',
        "lastName":  this.personalFormGroup.get('LastName').value || '',
        "address":  this.personalFormGroup.get('Address').value || '',
        "city": this.personalFormGroup.get('CityId').value.text || 0,
        "pinNo": "",//this.personalFormGroup.get('PhoneNo').value || '',
        "dateofBirth":  this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
        "age":  this.personalFormGroup.get('AgeYear').value.toString() || '',
        "genderID": this.personalFormGroup.get('GenderId').value.value || 0,
        "phoneNo": this.personalFormGroup.get('PhoneNo').value || '',
        "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
        "addedBy": 0,
        "updatedBy": 0,
        "ageYear":  this.personalFormGroup.get('AgeYear').value.toString() || '',
        "ageMonth":  this.personalFormGroup.get('AgeMonth').value.toString() || '',
        "ageDay":  this.personalFormGroup.get('AgeDay').value.toString() || '',
        "countryId": this.personalFormGroup.get('CountryId').value.value || 0,
        "stateId":this.personalFormGroup.get('StateId').value.value || 0,
        "cityId":this.personalFormGroup.get('CityId').value.value || 0,
        "maritalStatusId": this.personalFormGroup.get('MaritalStatusId').value.value || 0,
        "isCharity": true,
        "religionId": this.personalFormGroup.get('ReligionId').value.value || 0,
        "areaId":this.personalFormGroup.get('AreaId').value.value || 0,
        "isSeniorCitizen": true,
        "aadharCardNo": this.personalFormGroup.get('AadharCardNo').value.toString() || '',
        "panCardNo": this.personalFormGroup.get('PanCardNo').value.toString() || '',
        "photo":  " "
      },
      "Visit": {
        "visitID": 0,
        "regId": 0,
        "visitDate":this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
        "visitTime":this.dateTimeObj.time,
        "unitId": this.VisitFormGroup.get('HospitalId').value.value ? this.VisitFormGroup.get('HospitalId').value.value : 0,
        "patientTypeId": this.VisitFormGroup.get('PatientTypeID').value.value ? this.VisitFormGroup.get('PatientTypeID').value.value : 0,
        "consultantDocId":  this.VisitFormGroup.get('DoctorID').value.value ? this.VisitFormGroup.get('DoctorID').value.value : 0,
        "refDocId": this.VisitFormGroup.get('RefDocId').value.value ? this.VisitFormGroup.get('RefDocId').value.value : 0,
        "tariffId": this.VisitFormGroup.get('TariffId').value.value ? this.VisitFormGroup.get('TariffId').value.value : 0,
        "companyId": this.CompanyId,//  this.VisitFormGroup.get('HospitalId').value.value ? this.VisitFormGroup.get('HospitalId').value.value : 0,
        "addedBy": 0,
        "updatedBy": 0,
        "isCancelledBy": 0,
        "isCancelled": true,
        "isCancelledDate": "2024-09-18T11:24:02.656Z",
        "classId": 1,//this.VisitFormGroup.get('ClassId').value.value ? this.VisitFormGroup.get('ClassId').value.value : 0,
        "departmentId": this.VisitFormGroup.get('Departmentid').value.value ? this.VisitFormGroup.get('Departmentid').value.value : 0,
        "patientOldNew": 0,
        "firstFollowupVisit": 0,
        "appPurposeId": this.VisitFormGroup.get('PurposeId').value.value ? this.VisitFormGroup.get('PurposeId').value.value : 0,
        "followupDate": "2024-09-18T11:24:02.656Z",
        "crossConsulFlag": 0,
        "phoneAppId": 0
      }
    }

  
  console.log(m_data);
  let that = this;
  this._AppointmentlistService.appointmentUpdate(m_data).subscribe((response) => {
    this.toastr.success(response.message);
  
    this.onClear(true);
  }, (error) => {
    this.toastr.error(error.message);
  });
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
        debugger
        if (CityObj) {
            var mode="StateByCity"
            CityObj.value=1
            this._AppointmentlistService.getMaster(mode,CityObj.value).subscribe((data: any) => {
                this.stateList = data;
                this.selectedState = this.stateList[0].StateName;
                // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
                this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
                this.selectedStateID = this.stateList[0].StateId;
                this.onChangeCountryList(this.selectedStateID);
            });

        }
    }

    
    feedback() {
        // const dialogRef = this._matDialog.open(FeedbackComponent, {
        //     maxWidth: "80vw",
        //     height: "90%",
        //     width: "100%",

        // });
    }

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
debugger
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
debugger
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


    // onSubmitImgFiles() {
    //     // let data: PatientDocument[] = [];
    //     for (let i = 0; i < this.imgDataSource.data.length; i++) {
    //         if (this.imgDataSource.data[i].name.endsWith('.pdf')) {
    //             let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
    //                 type: "'application/pdf'"
    //             });
    //             data.push({
    //                 Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
    //             });
    //         }
    //         else {
    //             let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
    //                 type: "'image/" + this.imgDataSource.data[i].name.split('.')[this.imgDataSource.data[i].name.split('.').length - 1] + "'"
    //             });
    //             data.push({
    //                 Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
    //             });
    //         }
    //     }
    //     const formData = new FormData();
    //     let finalData = { Files: data };
    //     this.CreateFormData(finalData, formData);
    //     this._AppointmentSreviceService.documentuploadInsert(formData).subscribe((data) => {
    //         if (data) {
    //             Swal.fire("Images uploaded Successfully  ! ");
    //         }
    //     });
    // }


    //Image Upload
    imgArr: string[] = [];
    docArr: string[] = [];

    viewPdf(data: any) {
        // const dialogRef = this._matDialog.open(PdfviewerComponent,
        //     {
        //         maxWidth: "95vw",
        //         height: '1000px',
        //         width: '100%',
        //         data: {
        //             base64: data.url.split('application/pdf;base64,')[1] as string,
        //             title: "Appointment Document"
        //         }
        //     });
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

    // onClose() {

    //     // this.registerObj = new RegInsert({});
    //     this.personalFormGroup.reset();
    //     this.personalFormGroup.get('RegId').reset();

    //     this.searchFormGroup.get('RegId').reset();

    //     this.personalFormGroup = this.createPesonalForm();
    //     this.personalFormGroup.markAllAsTouched();
    //     this.VisitFormGroup = this.createVisitdetailForm();
    //     this.VisitFormGroup.markAllAsTouched();

    //     this.getHospitalList1();
    //     this.getHospitalList();
    //     this.getTariffCombo();
    //     this.getPatientTypeList();
    //     this.getPrefixList();
    //     this.getDepartmentList();
    //     this.getcityList1();
    //     this.getCompanyList();
    //     this.getSubTPACompList();

    //     this.isCompanySelected = false;
    //     this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    //     this.VisitFormGroup.get('CompanyId').clearValidators();
    //     this.VisitFormGroup.get('SubCompanyId').clearValidators();
    //     this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
    //     this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
    //     this.patienttype = 1;

    //     const todayDate = new Date();
    //     const dob = new Date(this.currentDate);
    //     const timeDiff = Math.abs(Date.now() - dob.getTime());
    //     // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    //     // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
    //     // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
    //     // this.registerObj.DateofBirth = this.currentDate;
    //     this.personalFormGroup.get('DateOfBirth').setValue(this.currentDate);

    //     this.personalFormGroup.get('PhoneNo').clearValidators();
    //     this.VisitFormGroup.get('PhoneNo').updateValueAndValidity();
    // }
    onClose(){
        this.dialogRef.close();
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

        // if (this.configService.configParams.DoctorId) {

        //     const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
        //     this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
        // }

    }

    OnChangeDoctorList(departmentObj) {
debugger
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

        // if (this.configService.configParams.DoctorId) {

            // this.configService.configParams.DoctorId = 269;
            // const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
            // this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
            this.doctorset();
        // }
    }

    doctorset() {

        this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
            startWith(''),
            map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
        // const toSelectDoc = this.DoctorList.find(c => c.DoctorId == this.configService.configParams.DoctorId);
        // this.VisitFormGroup.get('DoctorID').setValue(toSelectDoc);
    }


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
        // let fileType;
        // const dialogRef = this.matDialog.open(ImageViewComponent,
        //     {
        //         width: '750px',
        //         height: '550px',

        //         data: {
        //             docData: type == 'camera' ? 'camera' : '',
        //             type: type == 'camera' ? 'camera' : '',
        //             place: place
        //         }
        //     }
        // );
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         if (place == "photo") {
        //             this.sanitizeImagePreview = result.url;
        //         }
        //         else {
        //             this.imgArr.push(result.name);
        //             this.images.push(result);
        //             this.imgDataSource.data = this.images;
        //         }
        //     }
        // });
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
    vhealthCardNo:any;
    Healthcardflag:boolean=false;
    vDays:any=0;
    HealthCardExpDate:any;
    followUpDate:string;
    chkHealthcard(event){
        if(event.checked){
            this.Healthcardflag = true;  
            this.personalFormGroup.get('HealthCardNo').setValidators([Validators.required]);
        }else{
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

  onClear(val: boolean) {
   this.personalFormGroup.reset();
   this.VisitFormGroup.reset();
    this.dialogRef.close(val);
  }

}
