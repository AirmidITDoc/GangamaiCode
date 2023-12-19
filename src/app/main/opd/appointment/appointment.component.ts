import { Component, ElementRef, Inject, Input, OnInit, SimpleChanges, ViewChild, ViewEncapsulation, } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Observable, ReplaySubject, Subject, Subscription } from "rxjs";
import { RegistrationService } from "../registration/registration.service";
import { DatePipe, Time } from "@angular/common";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { Router } from "@angular/router";
import { AppointmentSreviceService } from "./appointment-srevice.service";
// import * as XLSX from 'xlsx';
import Swal from "sweetalert2";
import { NewAppointmentComponent } from "./new-appointment/new-appointment.component";
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
import { SearchInforObj } from "../op-search-list/opd-search-list/opd-search-list.component";
import { AdvanceDataStored } from "app/main/ipd/advance";
import { OPIPPatientModel } from "../op-search-list/search-page/search-page.component";
import { MatStepper } from "@angular/material/stepper";
import { AuthenticationService } from "app/core/services/authentication.service";
import { HeaderComponent } from "app/main/shared/componets/header/header.component";
import { ExcelDownloadService } from "app/main/shared/services/excel-download.service";
import { MatAutocompleteSelectedEvent } from "@angular/material/autocomplete";
import { MatSelect } from "@angular/material/select";
import { AnyCnameRecord } from "dns";


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
  msg: any;
  sIsLoading: string = "";
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

  showReg: boolean = false;

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
  isRegSearchDisabled: boolean = true;
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
  patienttype: any = '';
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


  filteredOptionsDoctor: Observable<string[]>;
  filteredOptionsReligion: Observable<string[]>;
  filteredOptionsMstatus: Observable<string[]>;
  isDoctorSelected: boolean = false;
  isCompanySelected: boolean = false;
  filteredOptionsCompany: Observable<string[]>;
  filteredOptionsSubCompany: Observable<string[]>;
  filteredOptionsArea: Observable<string[]>;
  isSubCompanySelected: boolean = false;
  isAreaSelected: boolean = false;
  isMstatusSelected: boolean = false;
  isreligionSelected: boolean = false;

  VisitId: any;
  FimeName: any;

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
    "MPbillNo",
    "Edit",
    "Bill",
    "RegNoWithPrefix",
    "PatientName",
    "DVisitDate",
    "VisitTime",
    "OPDNo",
    "Doctorname",
    "RefDocName",
    "PatientType",
    // 'HospitalName',
    "action",
  ];

  dataSource = new MatTableDataSource<VisitMaster>();
  menuActions: Array<string> = [];

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
  filterCompany: any;
  filterHospital: any;

  public height: string;

  constructor(
    public _AppointmentSreviceService: AppointmentSreviceService,
    public _opappointmentService: AppointmentSreviceService,
    private accountService: AuthenticationService,
    public _registerService: RegistrationService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private _ActRoute: Router,

    private _fuseSidebarService: FuseSidebarService,
    public _registrationService: RegistrationService,
    public matDialog: MatDialog,

    private advanceDataStored: AdvanceDataStored,
    private reportDownloadService: ExcelDownloadService

  ) {
    this.getVisitList();

  }

  ngOnInit(): void {

    this.personalFormGroup = this.createPesonalForm();
    // this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAsUntouched();
    this.VisitFormGroup = this.createVisitdetailForm();
    this.VisitFormGroup.markAsUntouched();
    this.searchFormGroup = this.createSearchForm();
    this.searchFormGroup.markAsUntouched();

    if (this._ActRoute.url == "/opd/appointment") {

      this.menuActions.push("Update Registration");
      this.menuActions.push("Update Consultant Doctor");
      this.menuActions.push("Update Referred Doctor");
      this.menuActions.push("Upload Documents");
      this.menuActions.push("Capture Photo");
      this.menuActions.push("Generate Patient Barcode");

    }

    this.getVisitList();
    this.getDoctorNameCombobox();

    this.getHospitalList1();
    this.getHospitalList();

    this.getPrefixList();
    this.getPatientTypeList();
    this.getTariffList();
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

    this.getSearchList();
    this.getSearchDocuploadPatientList();

    this.hospitalFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterHospital();
      });

    this.FirstName.markAsTouched();
    this.AreaId.markAsTouched();


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


  getOptionTextDep(option) {

    return option && option.departmentName ? option.departmentName : '';
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
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }



  private _filterSubCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();

      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }

  private _filterCompany(value: any): string[] {
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
        Validators.pattern("^[a-zA-Z._ -]+$"),
      ]],
      MiddleName: ['', [

        // Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        // Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      GenderId: '',
      Address: '',
      DateOfBirth: [{ value: this.registerObj.DateofBirth }],
      AgeYear: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['', Validators.pattern("[0-9]+")],
      AgeDay: ['', Validators.pattern("[0-9]+")],
      // PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{15}$")]] , 
      PhoneNo: ['', [
        Validators.pattern("^[- +()]*[0-9][- +()0-9]*$"),
        Validators.minLength(10),
        Validators.maxLength(10),
      ]],
      MobileNo: ['', [Validators.required, Validators.pattern("^[0-9]*$"),
      Validators.minLength(10),
      Validators.maxLength(10),]],
      AadharCardNo: [''],
      PanCardNo: '',
      MaritalStatusId: '',
      ReligionId: '',
      AreaId: '',
      CityId: '',
      StateId: '',
      CountryId: ''

    });

  }

  createVisitdetailForm() {
    return this.formBuilder.group({
      HospitalID: '',
      UnitId: '',
      PatientTypeID: '',
      PatientTypeId: '',
      PatientType: '',
      TariffId: '',
      CompanyId: '',
      SubCompanyId: '',
      DoctorId: '',
      DoctorID: '',
      DepartmentId: '',
      Departmentid: '',
      DoctorIdOne: '',
      DoctorIdTwo: '',
      VisitId: '',
      PrefixId: '',
      RegNoWithPrefix: '',
      PatientName: '',
      VisitDate: '',
      VisitTime: '',
      HospitalId: '',
      HospitalName: '',
      OPDNo: '',
      TariffName: '',
      ConsultantDocId: '',
      RefDocId: '',
      Doctorname: '',
      RefDocName: '',
      ClassId: '',
      PurposeId: ''
    });
  }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.personalFormGroup.reset();
      this.personalFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      // this.isRegSearchDisabled = false;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();
      this.VisitFormGroup = this.createVisitdetailForm();
      this.VisitFormGroup.markAllAsTouched();
      // this.Regdisplay = false;
      // this.showtable = false;


    } else {
      this.isRegSearchDisabled = false;
      this.personalFormGroup.get('RegId').enable();
      this.personalFormGroup.reset();
      this.Patientnewold = 2;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();
      this.VisitFormGroup = this.createVisitdetailForm();
      this.VisitFormGroup.markAllAsTouched();

    }

    this.getHospitalList1();
    this.getHospitalList();
    this.getTariffList();
    this.getPatientTypeList();
    this.getPrefixList();
    this.getDepartmentList();
    this.getcityList1();
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],

      RegId: ['']
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

  getPatientTypeList() {
    this._opappointmentService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }

  onChangePatient(value) {
    if (value.PatientTypeId !== 1) {
      this._opappointmentService.getCompanyCombo();
      this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.isCompanySelected = true;
    } else {
      this.isCompanySelected = false;
      this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
      this.VisitFormGroup.get('CompanyId').clearValidators();
      this.VisitFormGroup.get('SubCompanyId').clearValidators();
      this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
      this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
    }
  }
  onEdit(row) {
    this.registerObj = row;
    this.getSelectedObj(row);
  }

  getClassList() {
    this._opappointmentService.getClassMasterCombo().subscribe(data => { this.ClassList = data; })
  }

  getTariffList() {
    this._opappointmentService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      this.VisitFormGroup.get('TariffId').setValue(this.TariffList[0]);
    })
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
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );

    });
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
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.VisitFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );

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
  // VisitList

  getVisitList() {
    this.sIsLoading = "loading-data";
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
      this.isLoadingStr = 'loading';
      this._AppointmentSreviceService.getAppointmentList(D_data).subscribe(
        (Visit) => {
          this.dataSource.data = Visit as VisitMaster[];
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator;
          this.isLoadingStr = this.dataSource.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
          this.isLoading = 'list-loaded';
        }
      );
    }, 1000);
  }


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
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoctor.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
    }

  }

  //religion filter
  public religionFilterCtrl: FormControl = new FormControl();
  public filteredReligion: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public maritalstatusFilterCtrl: FormControl = new FormControl();
  public filteredMaritalstatus: ReplaySubject<any> = new ReplaySubject<any>(1);

  //area filter
  public areaFilterCtrl: FormControl = new FormControl();
  public filteredArea: ReplaySubject<any> = new ReplaySubject<any>(1);

  // //purpose filter
  // public purposeFilterCtrl: FormControl = new FormControl();
  // public filteredPurpose: ReplaySubject<any> = new ReplaySubject<any>(1);


  //hospital filter
  public hospitalFilterCtrl: FormControl = new FormControl();
  public filteredHospital: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);

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

  visitObj = new VisitMaster({});

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
    return option && option.DoctorName ? option.DoctorName : '';
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


  /** getSearchList() {
    debugger
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._opappointmentService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.PatientListfilteredOptions=resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
 
      });
    }
 
  } */

  getSearchList() {

    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
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
    debugger
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
            this._AppointmentSreviceService.getfile(currentValue.Id).subscribe((resFile: any) => {
              if (resFile.file)
                currentValue.url ='data:image/jpg;base64,'+ resFile.file;
            });
          }
        });
      }
      setTimeout(() => {
      }, 1000);
    });

  }




  getPhoneAppointmentList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._opappointmentService.getPhoneAppointmentList(m_data).subscribe(resData => {
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


  getSelectedObj(obj) {
    obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeDay.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
    this.PatientName = obj.PatientName;
    this.RegId = obj.RegId;

    this.setDropdownObjs();
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
        // this.selectedGender = this.GenderList[0];
        this.selectedGenderID = this.GenderList[0].GenderId;
      });
    }
  }

  OnSaveAppointment() {

    if (this.searchFormGroup.get('regRadio').value == "registration") {

      this.isLoading = 'submit';
      let submissionObj = {};
      let registrationSave = {};
      let visitSave = {};
      let tokenNumberWithDoctorWiseInsert = {};

      registrationSave['regId'] = 0;
      registrationSave['regDate'] = this.dateTimeObj.date //this.registerObj.RegDate;
      registrationSave['regTime'] = this.dateTimeObj.time;
      registrationSave['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
      registrationSave['firstName'] = this.registerObj.FirstName;
      registrationSave['middleName'] = this.registerObj.MiddleName || '';
      registrationSave['lastName'] = this.registerObj.LastName;
      registrationSave['address'] = this.registerObj.Address || '';
      registrationSave['City'] = this.personalFormGroup.get('CityId').value.CityName || '';
      registrationSave['pinNo'] = '';
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
      registrationSave['maritalStatusId'] = this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
      registrationSave['isCharity'] = false;
      registrationSave['religionId'] = this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
      registrationSave['areaId'] = this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
      // registrationSave['Aadharcardno'] =this.registerObj.AadharCardNo; // this.personalFormGroup.get('Aadharcardno').value || '';
      // registrationSave['Pancardno'] =this.registerObj.PanCardNo;// this.personalFormGroup.get('Pancardno').value || '';
      registrationSave['isSeniorCitizen'] = true; //this.personalFormGroup.get('isSeniorCitizen').value ? this.personalFormGroup.get('VillageId').value.VillageId : 0; //this.registerObj.VillageId;

      submissionObj['registrationSave'] = registrationSave;

      visitSave['VisitId'] = 0;
      visitSave['RegID'] = 0;
      visitSave['VisitDate'] = this.dateTimeObj.date;
      visitSave['VisitTime'] = this.dateTimeObj.time;

      visitSave['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
      visitSave['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      visitSave['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      visitSave['RefDocId'] = this.VisitFormGroup.get('RefDocId').value.DoctorId || 0;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitSave['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitSave['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitSave['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitSave['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
        visitSave['IsCancelled'] = 0;
      visitSave['IsCancelledBy'] = 0;
      visitSave['IsCancelledDate'] = this.dateTimeObj.date;

      visitSave['ClassId'] = 1; //this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitSave['DepartmentId'] = this.VisitFormGroup.get('Departmentid').value.Departmentid;//? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      visitSave['PatientOldNew'] = this.Patientnewold;
      visitSave['FirstFollowupVisit'] = 0,// this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
        visitSave['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId;// ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitSave['FollowupDate'] = this.dateTimeObj.date;// this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
      //  visitSave['IsMark'] = 0,// this.VisitFormGroup.get('RelatvieMobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';

      submissionObj['visitSave'] = visitSave;

      tokenNumberWithDoctorWiseInsert['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseSave'] = tokenNumberWithDoctorWiseInsert;

      console.log(submissionObj)
      this._opappointmentService.appointregInsert(submissionObj).subscribe(response => {
        if (response) {
          debugger
          Swal.fire('Congratulations !', 'New Appoinment save Successfully !', 'success').then((result) => {
            // if (result.isConfirmed) {
            // this._matDialog.closeAll();
            this.getPrint(result);
            // this.getVisitList();
            // }
          });
        } else {
          Swal.fire('Error !', 'Appoinment not saved', 'error');
        }
        this.isLoading = '';
      });
    }
    else {

      this.isLoading = 'submit';
      let submissionObj = {};
      let registrationUpdate = {};
      let visitUpdate = {};

      let tokenNumberWithDoctorWiseUpdate = {};

      registrationUpdate['regId'] = this.registerObj.RegId;
      registrationUpdate['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
      registrationUpdate['firstName'] = this.registerObj.FirstName;
      registrationUpdate['middleName'] = this.registerObj.MiddleName || '';
      registrationUpdate['lastName'] = this.registerObj.LastName;
      registrationUpdate['address'] = this.registerObj.Address;
      registrationUpdate['City'] = this.personalFormGroup.get('CityId').value.CityName;
      registrationUpdate['pinNo'] = '';
      registrationUpdate['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"); //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
      registrationUpdate['age'] = this.registerObj.AgeYear || 0; //this.registerObj.Age;
      registrationUpdate['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
      registrationUpdate['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
      registrationUpdate['mobileNo'] = this.registerObj.MobileNo || 0;
      registrationUpdate['updatedBy'] = this.accountService.currentUserValue.user.id;
      registrationUpdate['ageYear'] = this.registerObj.AgeYear || 0;
      registrationUpdate['ageMonth'] = this.registerObj.AgeMonth || 0;
      registrationUpdate['ageDay'] = this.registerObj.AgeDay || 0;
      registrationUpdate['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
      registrationUpdate['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
      registrationUpdate['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
      registrationUpdate['maritalStatusId'] = this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
      registrationUpdate['isCharity'] = false;

      submissionObj['registrationUpdate'] = registrationUpdate;
      // visit detail
      visitUpdate['VisitId'] = 0;
      visitUpdate['RegID'] = this.registerObj.RegId;
      visitUpdate['VisitDate'] = this.dateTimeObj.date;
      visitUpdate['VisitTime'] = this.dateTimeObj.time;

      visitUpdate['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0;
      visitUpdate['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      visitUpdate['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId || 0;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      visitUpdate['RefDocId'] = this.VisitFormGroup.get('DoctorIdOne').value.DoctorId;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitUpdate['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitUpdate['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitUpdate['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitUpdate['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
        visitUpdate['IsCancelled'] = 0;
      visitUpdate['IsCancelledBy'] = 0;
      visitUpdate['IsCancelledDate'] = this.dateTimeObj.date;

      visitUpdate['ClassId'] = 1; //this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitUpdate['DepartmentId'] = this.VisitFormGroup.get('DoctorID').value.DepartmentId; //? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      visitUpdate['PatientOldNew'] = this.Patientnewold;
      visitUpdate['FirstFollowupVisit'] = 0, // this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
        visitUpdate['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId; // ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitUpdate['FollowupDate'] = this.dateTimeObj.date; // this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';

      submissionObj['visitUpdate'] = visitUpdate;


      tokenNumberWithDoctorWiseUpdate['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseUpdate'] = tokenNumberWithDoctorWiseUpdate;


      this._opappointmentService.appointregupdate(submissionObj).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Registered Appoinment Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
              this.getPrint(response);
              this._matDialog.closeAll();
            }
            this.getVisitList();
          });
        } else {
          Swal.fire('Error !', 'Appointment not Updated', 'error');
        }
        this.isLoading = '';
      });

    }

    //Reset Page
    this.onClose();
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
    if (m == "CasePaper Print") {
      this.getPrint(contact);
    }
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
              AadharCardNo: this.dataArray[0].AadharCardNo || 0,
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
            const dialogRef = this._matDialog.open(NewAppointmentComponent,
              {
                maxWidth: "85vw",
                height: "550px",
                width: "100%",
                data: {
                  registerObj: m_data,
                },
              }
            );
            dialogRef.afterClosed().subscribe((result) => {
              console.log(
                "The dialog was closed - Insert Action",
                result
              );
              this.getVisitList();
            });
          },
          (error) => {
            this.sIsLoading = "";
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
      this._registrationService.populateFormpersonal(m_data2);
      const dialogRef = this._matDialog.open(
        EditConsultantDoctorComponent,
        {
          maxWidth: "70vw",
          height: "410px",
          width: "70%",
          data: {
            registerObj: m_data2,
          },
        }
      );
      dialogRef.afterClosed().subscribe((result) => {

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
      this._registrationService.populateFormpersonal(m_data3);
      const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
        maxWidth: "70vw",
        height: "410px",
        width: "70%",
        data: {
          registerObj: m_data3,
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed - Insert Action", result);
      });
    }

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

  getTemplate() {
    let query =
      "select TempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp where TempId=12";
    this._AppointmentSreviceService
      .getTemplate(query)
      .subscribe((resData: any) => {
        this.printTemplate = resData[0].TempDesign;
        this.TempKeys = resData[0].TempKeys;

        let keysArray1 = this.TempKeys;

        let keysArray = [
          'HospitalName', 'HospitalAddress', 'Phone', 'EmailId',
          "RegNo",
          "PrecriptionId",
          "PatientName",
          "OPDNo",
          "Diagnosis",
          "PatientName",
          "Weight",
          "Pluse",
          "BP",
          "BSL",
          "DoseName",
          "Days",
          "GenderName",
          "AgeYear",
          "DrugName",
          "ConsultantDocName",
          "RefDocName",
          "SecondRefDoctorName",
          "MobileNo",
          "Address",
          "VisitDate",
          "PreviousVisitDate"
        ]; // resData[0].TempKeys;


        ;
        for (let i = 0; i < keysArray.length; i++) {
          let reString = "{{" + keysArray[i] + "}}";
          let re = new RegExp(reString, "g");
          this.printTemplate = this.printTemplate.replace(
            re,
            this.reportPrintObj[keysArray[i]]
          );
        }
        let strabc = '<div style="display:flex"><img class="logo-print" src="../../../../assets/images/logos/Hospital_logo.jpg" width="110" height="110"> <div> <div  style="font-weight:700;font-size:30px;text-align:left;width:1100px;margin-left:290px;font-family:serif;font-size:x-large;padding-top:10px">  {{HospitalName}}</div> <div   style="color:#464343;text-align:left;font-size:18px;width:1100px;margin-left:90px;font-family:serif;font-weight:700">   {{HospitalAddress}}</div> <div style="color:#464343;text-align:left;font-size:18px;width:900px;margin-left:180px;font-family:serif;font-weight:700"> Call:- {{Phone}}, EmailId : {{EmailId}}</div> </div> </div>'

        this.printTemplate = this.printTemplate.replace("StrPrintDate", this.transform2(this.currentDate.toString()));
        this.printTemplate = this.printTemplate.replace('StrVisitDate', this.transform2(this.reportPrintObj.VisitDate));
        this.printTemplate = this.printTemplate.replace('StrPreviousVisitDate', this.transform2(this.reportPrintObj.PreviousVisitDate));
        this.printTemplate = this.printTemplate.replace('Strheader', strabc);
        this.printTemplate = this.printTemplate.replace(/{{.*}}/g, "");
        setTimeout(() => {
          this.print();
        }, 1000);
      });
  }

  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, "dd/MM/yyyy hh:mm a");
    return value;
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(new Date(), "dd/MM/yyyy h:mm a");
    return value;
  }

  getPrint(contact) {
    var D_data = {
      VisitId: contact.VisitId || 0,
    };

    let printContents;
    this.subscriptionArr.push(
      this._AppointmentSreviceService
        .getOPDPrecriptionPrint(D_data)
        .subscribe((res) => {
          this.reportPrintObjList = res as CasepaperVisitDetails[];

          this.reportPrintObj = res[0] as CasepaperVisitDetails;
          this.getTemplate();
        })
    );
  }

  // PRINT
  print() {

    let popupWin, printContents;

    popupWin = window.open(
      "",
      "_blank",
      "top=0,left=0,height=800px !important,width=auto,width=2200px !important"
    );
    // popupWin.document.open();
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);

    popupWin.document
      .write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
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




  onImageFileChange(events: any) {
    this.images = [];
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
      let file = new File([this.dataURItoBlob(this.imgDataSource.data[i].url)], this.imgDataSource.data[i].name, {
        type: "'image/" + this.imgDataSource.data[i].name.split('.')[this.imgDataSource.data[i].name.split('.').length - 1] + "'"
      });
      data.push({
        Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.imgDataSource.data[i].name
      });
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


  onDocFileChange(events: any) {
    debugger

    if (events.target.files && events.target.files[0]) {
      let filesAmount = events.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        var reader = new FileReader();
        debugger
        this.docArr.push(events.target.files[i].name);
        reader['fileName'] = events.target.files[i].name;
        reader.onload = (event: any) => {
          console.log(this.docArr);
          // this.images.push({ url: event.target.result, name: reader['fileName'] });
          this.docs.push({ DocumentPath: event.target.result, DocumentName: this.docArr });
          this.pdfDataSource.data = [];
          this.pdfDataSource.data = this.docs;
          this.docsForm.patchValue({
            pdfDataSource: this.docs
          });
        }
        console.log(this.docs);
        reader.readAsDataURL(events.target.files[i]);
      }
      this.attachment.nativeElement.value = '';
    }
  }

  onSubmitDocFiles() {
    debugger
    let data: PatientDocument[] = [];
    for (let i = 0; i < this.pdfDataSource.data.length; i++) {
      let file = new File([
        new Blob([this.pdfDataSource.data[i].DocumentPath])
      ], this.pdfDataSource.data[i].DocumentName, { type: 'image/jpeg' });
      data.push({
        Id: "0", OPD_IPD_ID: this.VisitId, OPD_IPD_Type: 0, DocFile: file, FileName: this.pdfDataSource.data[i].name
      });
    }
    const formData = new FormData();
    let finalData = { Files: data };
    this.CreateFormData(finalData, formData);
    this._AppointmentSreviceService.documentuploadInsert(formData).subscribe((data) => {
      console.log(data)
      if (data) {
        Swal.fire("Document uploaded Successfully  ! ");
      }

    });
    this.pdfDataSource.data = [];
    //clear doc afetr upload
    let l = this.docs.length;
    for (let i = 0; i < l; i++) {
      this.docs.splice(i, 1);
    }
  }
  getHospitalList1() {
    this._opappointmentService.getHospitalCombo().subscribe(data => {
      this.HospitalList1 = data;
      this.VisitFormGroup.get('HospitalId').setValue(this.HospitalList1[0]);
    })
  }
  nextClicked(formGroupName) {
    if (formGroupName.invalid) {
      const controls = formGroupName.controls;
      Object.keys(controls).forEach(controlsName => {
        const controlField = formGroupName.get(controlsName);
        if (controlField && controlField.invalid) {
          //  Swal.fire('Error !', controlsName, 'error');
          controlField.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    if (formGroupName == this.VisitFormGroup) {
      if (!this.isDepartmentSelected) {
        return;
      }
      this.OnSaveAppointment();
      return;
    }
    this.appointmentFormStepper.next();
  }

  onDoctorOneChange(value) {
    console.log(this.VisitFormGroup.get('DoctorIdOne').value.reset(''));
  }

  backClicked() {
    this.appointmentFormStepper.previous();
  }


  onClose() {

    this.registerObj = new RegInsert({});
    this.personalFormGroup.reset();
    this.personalFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();

    this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();
    this.VisitFormGroup = this.createVisitdetailForm();
    this.VisitFormGroup.markAllAsTouched();

    this.getHospitalList1();
    this.getHospitalList();
    this.getTariffList();
    this.getPatientTypeList();
    this.getPrefixList();
    this.getDepartmentList();
    this.getcityList1();

    this.isCompanySelected = false;
    this.VisitFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.VisitFormGroup.get('CompanyId').clearValidators();
    this.VisitFormGroup.get('SubCompanyId').clearValidators();
    this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
    this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();

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

  OnChangeDoctorList(departmentObj) {

    this.isDepartmentSelected = true;
    this._opappointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;

        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.VisitFormGroup.get('DoctorID').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
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

  openCamera(type: string) {
    let fileType;
    const dialogRef = this.matDialog.open(ImageViewComponent,
      {
        width: '800px',
        height: '550px',
        data: {
          docData: type == 'camera' ? 'camera' : '',
          type: type == 'camera' ? 'camera' : ''
        }
      }
    );
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.imgArr.push(result.name);
        this.images.push(result);
        this.imgDataSource.data = this.images;
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
    console.log(query);
    this._AppointmentSreviceService.getdeleteddocument(query).subscribe((resData: any) => {
      if (resData) {
        Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');

      }
      setTimeout(() => {
      }, 1000);
    });
  }

  deleteTableRow(element) {
    let index = this.doclist.indexOf(element);
    if (index >= 0) {
      this.doclist.splice(index, 1);
      this.pdfDataSource.data = [];
      this.pdfDataSource.data = this.doclist;
    }
    Swal.fire('Success !', 'Document Row Deleted Successfully', 'success');
  }


  Billpayment(contact) {
    let xx = {
      RegNo: contact.RegId,
      // RegId: contact.RegId,
      AdmissionID: contact.VisitId,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      ClassName: contact.ClassName,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId
    };
    this.advanceDataStored.storage = new SearchInforObj(xx);

    const dialogRef = this._matDialog.open(OPBillingComponent,
      {
        maxWidth: "90%",

        height: '695px !important',

      });

    dialogRef.afterClosed().subscribe(result => {

    });

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

  @ViewChild('bday') bday: ElementRef;
  @ViewChild('gender') gender: MatSelect;
  @ViewChild('mstatus') mstatus: ElementRef;
  @ViewChild('religion') religion: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('hname') hname: MatSelect;
  @ViewChild('ptype') ptype: MatSelect;
  @ViewChild('tariff') tariff: MatSelect;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('refdoc') refdoc: ElementRef;
  @ViewChild('purpose') purpose: ElementRef;
  // @ViewChild('dept') dept: MatSelect;

  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;



  public onEnterprefix(event): void {
    if (event.which === 13) {
      this.fname.nativeElement.focus();
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
      this.mstatus.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }
  }

  // public onEntergendere(event): void {
  //   if (event.which === 13) {
  //   // this.gender.nativeElement.focus();
  //   if(this.mstatus) this.mstatus.focus();
  //   }
  // }


  public onEntermstatus(event): void {
    if (event.which === 13) {
      this.religion.nativeElement.focus();
      // if(this.religion) this.religion.focus();
    }
  }

  public onEnterreligion(event): void {
    if (event.which === 13) {
      this.bday.nativeElement.focus();
      // if(this.religion) this.religion.focus();
    }
  }
  public onEnterbday(event): void {
    if (event.which === 13) {
      this.agey.nativeElement.focus();

    }
  }


  public onEnteragey(event): void {
    if (event.which === 13) {
      this.agem.nativeElement.focus();
      // this.addbutton.focus();
    }
  }
  public onEnteragem(event): void {
    if (event.which === 13) {
      this.aged.nativeElement.focus();
    }
  }
  public onEnteraged(event): void {
    if (event.which === 13) {
      this.pan.nativeElement.focus();
    }
  }
  public onEnterpan(event): void {
    if (event.which === 13) {
      this.phone.nativeElement.focus();
    }
  }

  public onEnterphone(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
    }
  }
  public onEntermobile(event): void {
    if (event.which === 13) {
      this.address.nativeElement.focus();
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

  public onEntercity(event): void {
    if (event.which === 13) {
      if (this.hname) this.hname.focus();

    }
  }

  public onEnterhname(event): void {
    if (event.which === 13) {
      if (this.ptype) this.ptype.focus();

    }
  }


  public onEnterptype(event): void {
    if (event.which === 13) {
      if (this.tariff) this.tariff.focus();

    }
  }

  public onEnterptariff(event): void {
    if (event.which === 13) {
      // if(this.dept) this.dept.focus();
      this.dept.nativeElement.focus();

    }
  }

  public onEnterdept(event): void {
    if (event.which === 13) {
      // if(this.deptdoc) this.deptdoc.focus();
      this.deptdoc.nativeElement.focus();
    }
  }
  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      // if(this.refdoc) this.refdoc.focus();
      this.refdoc.nativeElement.focus();
    }
  }

  public onEnterrefdoc(event): void {
    if (event.which === 13) {
      // if(this.purpose) this.purpose.focus();
      this.purpose.nativeElement.focus();
    }
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
  WardId: any;
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
      this.AgeYear = RegInsert.AgeYear || "";
      this.AgeMonth = RegInsert.AgeMonth || "";
      this.AgeDay = RegInsert.AgeDay || "";
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
      this.PanCardNo = RegInsert.PanCardNo || "";
      this.AdmissionID = RegInsert.AdmissionID || 0;
      this.WardId = RegInsert.WardId || 0;
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
    }
  }
}
