import { Component, ElementRef, EventEmitter, HostListener, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDataStored } from '../../advance';
import { DatePipe, Time } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { AdmissionService } from './admission.service';
import Swal from 'sweetalert2';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { MLCInformationComponent, MlcDetail } from './mlcinformation/mlcinformation.component';
import { AdmissionNewComponent } from './admission-new/admission-new.component';
import { AdmissionViewComponent } from './admission-view/admission-view.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { RegAdmissionComponent } from '../reg-admission/reg-admission.component';
import { OPIPPatientModel } from '../../ipdsearc-patienth/ipdsearc-patienth.component';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RFC_2822 } from 'moment';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';
import { IPBillingComponent } from '../../ip-search-list/ip-billing/ip-billing.component';
import { NewRegistrationComponent } from 'app/main/opd/registration/new-registration/new-registration.component';
import { RegistrationService } from 'app/main/opd/registration/registration.service';
import { EditRefraneDoctorComponent } from 'app/main/opd/appointment/edit-refrane-doctor/edit-refrane-doctor.component';
import { EditConsultantDoctorComponent } from 'app/main/opd/appointment/edit-consultant-doctor/edit-consultant-doctor.component';
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
import { CompanyInformationComponent } from '../../company-information/company-information.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { ThemeService } from 'ng2-charts';
import { AdvanceDetailObj } from '../../ip-search-list/ip-search-list.component';
import { OPIPFeedbackComponent } from '../../Feedback/opip-feedback/opip-feedback.component';


@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionComponent implements OnInit {


  currentDate = new Date();
  // reportPrintObj: Admission;
  searchFormGroup: FormGroup;
  personalFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  
  screenFromString = 'admission-form';
  selectedAdvanceObj: AdmissionPersonlModel;
  newRegSelected: any = 'registration';

  hasSelectedContacts: boolean;
  SpinLoading: boolean = false;
  isLoadings = false;
  disabled = false;
  isAlive = false;
  isOpen = false;
  isRegIdSelected: boolean = false;
  isEmgIdSelected: boolean = false;
  isWardSelected: boolean = false;
  isPrefixSelected: boolean = false;
  isCitySelected: boolean = false;
  isCompanySelected: boolean = false;
  isSubCompanySelected: boolean = false;
  isDepartmentSelected: boolean = false;
  isAdmittedDoctor1Selected: boolean = false;
  isAdmittedDoctor2Selected: boolean = false;
  isRefDoctorSelected: boolean = false;
  isDoctorSelected: boolean = false;
  isAreaSelected: boolean = false;
  isReligionSelected: boolean = false;
  isMaritalSelected: boolean = false;
  isRelationshipSelected: boolean = false;
  isSearchdoctorSelected: boolean = false;
  isRegSearchDisabled: boolean = true;
  filteredOptions: any;
  EmgfilteredOptions: any;
  showtable: boolean = false;
  noOptionFound: boolean = false;
  noEmgOptionFound: boolean = false;
  Regdisplay: boolean = false;
  ispatienttypeSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  isLinear = true;
  submitted = false;
  AdList: boolean = false;
  saveflag: boolean = false;
 
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
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  RefDoctorList: any = [];
  WardList: any = [];
  BedList: any = [];
  BedClassList: any = [];
  doctorNameCmbList: any = [];
  ConfigcityList: any = [];
  _cityList: any = [];
  cityList: any = [];
  stateList: any = [];
  countryList: any = [];
  searchDoctorList: any = [];

  selectedState = "";
  selectedStateID: any;
  selectedCountry: any;
  selectedCountryID: any;
  selectedHName: any;
  seelctedHospID: any;
  selectedPrefixId: any;
  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  registration: any;

 
 Vtotalcount = 0;
 VNewcount = 0;
 VFollowupcount = 0;
 VBillcount = 0;
 VOPtoIPcount = 0;
 vIsDischarg = 0;
 VAdmissioncount = 0;
 PatientName:any;
 RegId:any;
 RegNo:any;
 DoctorId: any = 0;
 AdmittedPatientList: any;
 msg: any;
 sIsLoading: string = '';
 savedValue: number = null;
 loadID = 0;
 Todate: any;
 ConfigCityId = 2;

 
  
  options = [];
  V_SearchRegList: any = [];
  optionsPrefix: any[] = [];
  optionsDep: any[] = [];
  optionsCity: any[] = [];
  optionsDoc: any[] = [];
  optionsDoc2: any[] = [];
  optionsRefDoc: any[] = [];
  optionsWard: any[] = [];
  optionsBed: any[] = [];
  optionsRelation: any[] = [];
  optionsArea: any[] = [];
  optionsReligion: any[] = [];
  optionsMarital: any[] = [];
  optionsCompany: any[] = [];
  optionsSubCompany: any[] = [];
  optionsSearchDoc: any[] = [];
  optionRegSearch: any[] = [];
  optionsubCompany: any[] = [];
  optionsPatientType: any[] = [];
  optionsTariff: any[] = [];
  RefoptionsDoc: any[] = [];
  optionsAdDoc1: any[] = [];
  optionsAdDoc2: any[] = [];

  registerObj = new AdmissionPersonlModel({});
  MlcObj=new MlcDetail({})
  bedObj = new Bed({});


  filteredOptionsPrefix: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  filteredOptionsDoc1: Observable<string[]>;
  filteredOptionsRefDoc: Observable<string[]>;
  filteredOptionsWard: Observable<string[]>;
  filteredOptionsBed: Observable<string[]>;
  filteredOptionsDoc2: Observable<string[]>;
  filteredOptionsArea: Observable<string[]>;
  filteredOptionsRelation: Observable<string[]>;

  filteredOptionsReligion: Observable<string[]>;
  filteredOptionsMarital: Observable<string[]>;
  filteredOptionsCompany: Observable<string[]>;
  filteredOptionsSubCompany: Observable<string[]>;
  filteredOptionssearchDoctor: Observable<string[]>;
  filteredOptionsRegSearch: Observable<string[]>;
  filteredOptionsPatientType:any;
  filteredOptionsTarrif: Observable<string[]>;
  filteredOptionsRefrenceDoc: Observable<string[]>;



  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @Input() dataArray: any;
  @Output() sentCountsToParent = new EventEmitter<any>();

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;

  // filter for doctor
  public doctorFilterCtrl: FormControl = new FormControl();
  public filtereddoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  @Inject(MAT_DIALOG_DATA) public data: any;

  private _onDestroy = new Subject<void>();

  displayedColumns = [
    'useraction',
    'IsMLC',
    'RegNo',
    'PatientName',
    'DOA',
    // 'DOT',
    'Doctorname',
    'RefDocName',
    'IPNo',
    'PatientType',
    'WardName',
    'TariffName',
    'ClassName',
    'CompanyName',
    'RelativeName',
    // 'IsMLC',
    'buttons'
  ];

  // displayedColumns1: string[] = [
  //   'RegNo',
  //   'PatientName',
  //   'AgeYear',
  //   'GenderName',
  //   'PhoneNo',
  //   'MobileNo'
  // ];

  dataSource = new MatTableDataSource<Admission>();

  dataSource1 = new MatTableDataSource<OPIPPatientModel>();

  menuActions: Array<string> = [];
  centered = false;
  unbounded = false;

  // Checking dropdown validation
  vPrefixID: any = 0;
  vMaritalStatusId: any = 0;
  vReligionId: any = 0;
  vAreaId: any = 0;
  vCityId: any = 0;

  vPatientTypeID: any = 0;
  vTariffId: any = 0;
  vDoctorId: any = 0;
  vDoctorID: any = 0;
  vDepartmentid: any = 0;
  vCompanyId: any = 0;
  vSubCompanyId: any = 0;
  vadmittedDoctor1: any = 0;
  vadmittedDoctor2: any = 0;
  vrefDoctorId: any = 0;
  vRoomId: any = 0;
  vBedId: any = 0;
  vClassId: any = 0;
  vRelationshipId: any = 0;


  radius: number;
  color: string;
  filteredDoctor: any;
  dialogRef: any;
  isLoading: string;
  Regflag: boolean = false;
  NewRegflag:boolean=true;
  constructor(public _AdmissionService: AdmissionService,
    public _registrationService: RegistrationService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    private router: Router,
    private reportDownloadService: ExcelDownloadService,
    private formBuilder: FormBuilder,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored) {
    
    this.getRegSearchList();
  }

  ngOnInit(): void {
    this.getAdmittedPatientList_1()

    if (this.data) {

      this.registerObj = this.data.registerObj;
      this.DoctorId = this.data.registerObj.DoctorId;

    }

    this.isAlive = true;

    this.personalFormGroup = this.createPesonalForm();
    
    this.hospitalFormGroup = this.createHospitalForm();
    
    this.wardFormGroup = this.wardForm();
    
    this.otherFormGroup = this.otherForm();
    
    this.searchFormGroup = this.createSearchForm();

    this.getAdmittedDoctorCombo();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();

      });

    
    this.getPrefixList();
    this.getHospitalList();
    this.getPrefixList();
    this.getAreaList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getDepartmentList();
    this.getRelationshipList();
    this.getcityList1();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getWardList();
    this.getCompanyList();
    this.getSubTPACompList();
    this.getRefDoctorList();
    this.getPtypeCombo()
    this.getTariffCombo()


    
    this.filteredOptionsPatientType = this.hospitalFormGroup.get('PatientTypeID').valueChanges.pipe(
      startWith(''),
      map(value => this._filterPtype(value)),

    );
     
    this.filteredOptionsTarrif = this.hospitalFormGroup.get('TariffId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterTariffId(value)),

    );

    this.filteredOptionsRelation = this.otherFormGroup.get('RelationshipId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterRelationship(value)),

    );
  }

  public _filterPtype(value: any): string[] {
    if (value) {
      const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();
      return this.PatientTypeList.filter(option => option.PatientType.toLowerCase().includes(filterValue));
    }

  
  }

  getPtypeCombo() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    });
  }

  
  private _filterTariffId(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();
      return this.TariffList.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }
  }

  getTariffCombo(){
    this._AdmissionService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      this.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
    });
  }

  
  Admissiondetail(data) {
    this.Vtotalcount = 0;
    this.VNewcount = 0;
    this.VFollowupcount = 0;
    this.VBillcount = 0;
    this.vIsDischarg = 0;
    this.VOPtoIPcount= 0;
    console.log(data)
    this.Vtotalcount;
    
    for (var i = 0; i < data.length; i++) {
    
       if (data[i].IsOpToIPconv ==true) {
        this.VOPtoIPcount = this.VOPtoIPcount + 1;
        console.log( this.VOPtoIPcount )
      } else if (data[i].IsDischarged == 1) {
        this.vIsDischarg = this.vIsDischarg + 1;
      }
      this.Vtotalcount = this.Vtotalcount + 1;
    }
   
  }

  ngOnDestroys() {
    this.isAlive = false;
  }

  createPesonalForm() {
    return this.formBuilder.group({
      PrefixID: '',
      FirstName:
        ['', [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z () ]*$')
        ]],
      MiddleName:
        ['', [

          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z() ]*[a-zA-z() ]*$"),
      ]],
      GenderId: '',
      Address: '',
      DateOfBirth: [{ value: this.registerObj.DateofBirth }],
      AgeYear: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: [''],
      AgeDay: [''],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      MobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],

      AadharCardNo:
        ['', [
          Validators.minLength(12),
          Validators.maxLength(12),
          Validators.pattern("^[0-9]*$")
        ]],
      Pancardno: ["", [
        Validators.minLength(10),
        Validators.maxLength(10),
        Validators.pattern("[A-Z]{5}[0-9]{4}[A-Z]{1}")]],
      MaritalStatusId: '',
      ReligionId: '',
      AreaId: '',
      CityId: '',
      StateId: '',
      StateName: '',
      CountryId: '',
      RegId: '',
    });
  }

  createHospitalForm() {
    return this.formBuilder.group({
      HospitalId:'',
      PatientTypeID:'',
      TariffId: '',
      DoctorId: '',
      DoctorID: '',
      Departmentid: '',
      CompanyId:'',
      SubCompanyId:'',
      admittedDoctor1: '',
      admittedDoctor2:'',
      refDoctorId:'',
    });
  }

  wardForm() {
    return this.formBuilder.group({
      RoomId: '',
      BedId: ['', [Validators.required]],
      ClassId: ['', [Validators.required]],
    });
  }

  otherForm() {
    return this.formBuilder.group({
      RelativeName: '',
      RelativeAddress: '',
      RelatvieMobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      RelationshipId: '',
      IsMLC: [false],
      OPIPChange: [false],
      IsCharity: [false],
      IsSenior: [false],
      Citizen: [false],
      Emergancy: [false],
      template:[false]
    });
  }
  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId: [0, [Validators.required]],
      EmgId:['']
    });
  }


  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%` || '%'
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        this.V_SearchRegList = this.filteredOptions;
        console.log(this.V_SearchRegList)
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  
  }
  getSearchListEmg() {
    debugger
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('EmgId').value}%`
    }
    console.log("EmgList:", m_data)
    this._AdmissionService.getEmergencyList(m_data).subscribe(data => {
      this.EmgfilteredOptions = data;
      console.log(this.EmgfilteredOptions)
      if (this.EmgfilteredOptions.length == 0) {
        this.noEmgOptionFound = true;
      } else {
        this.noEmgOptionFound = false;
      }
    });
  
  }




  getRegSearchList() {
    var m_data = {
      "Keyword": 'z%'// `${this.searchFormGroup.get('RegId').value}%` || '%'
    }
    this._AdmissionService.getRegistrationList(m_data).subscribe(data => {
      this.V_SearchRegList = data;
      this.optionRegSearch = this.V_SearchRegList.slice();
      this.filteredOptionsRegSearch = this.searchFormGroup.get('RegId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRegsearch(value) : this.V_SearchRegList.slice()),
      );

    });
  }

  private _filterRegsearch(value: any): string[] {
    if (value) {
      const filterValue = value && value.FirstName ? value.FirstName.toLowerCase() : value.toLowerCase();
      return this.optionRegSearch.filter(option => option.FirstName.toLowerCase().includes(filterValue));
    }

  }

  Regsearchtext($event) {

  }

  private filterDoctor() {

    if (!this.doctorNameCmbList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filtereddoctor.next(
      this.doctorNameCmbList.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
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
      return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
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


 
  
  private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }


 
  private _filterWard(value: any): string[] {
    if (value) {
      const filterValue = value && value.RoomName ? value.RoomName.toLowerCase() : value.toLowerCase();
      return this.optionsWard.filter(option => option.RoomName.toLowerCase().includes(filterValue));
    }

  }

  private _filterBed(value: any): string[] {
    if (value) {
      const filterValue = value && value.BedName ? value.BedName.toLowerCase() : value.toLowerCase();
      return this.optionsBed.filter(option => option.BedName.toLowerCase().includes(filterValue));
    }

  }

  private _filterRelationship(value: any): string[] {
    if (value) {
      const filterValue = value && value.RelationshipName ? value.RelationshipName.toLowerCase() : value.toLowerCase();
      return this.optionsRelation.filter(option => option.RelationshipName.toLowerCase().includes(filterValue));
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

  private _filterMarital(value: any): string[] {
    if (value) {
      const filterValue = value && value.MaritalStatusName ? value.MaritalStatusName.toLowerCase() : value.toLowerCase();
      return this.optionsMarital.filter(option => option.MaritalStatusName.toLowerCase().includes(filterValue));
    }

  }


  private _filterSubCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsSubCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }

  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }


  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.optionsCompany = this.CompanyList.slice();
      this.filteredOptionsCompany = this.hospitalFormGroup.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );

    });
  }



  getSubTPACompList() {
    this._AdmissionService.getSubTPACompCombo().subscribe(data => {
      this.SubTPACompList = data;
      this.optionsSubCompany = this.SubTPACompList.slice();
      this.filteredOptionsSubCompany = this.hospitalFormGroup.get('SubCompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSubCompany(value) : this.SubTPACompList.slice()),
      );

    });
  }



  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }

  getOptionTextEmg(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.EmgId + ')';
  }


  getSelectedObj(obj) {

    this.registerObj = new AdmissionPersonlModel({});
  
    obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
    console.log(this.registerObj );

    this.PatientName = obj.PatientName;
    this.RegId = obj.RegId;
    this.RegNo = obj.RegNo;
    this.vReligionId=obj.ReligionId;
    this.vAreaId=obj.AreaId
    this.vMaritalStatusId=obj.MaritalStatusId;

    this.onChangeDateofBirth(this.registerObj.DateofBirth)
    this.setDropdownObjs();

  }

  AdmittedRegId: any = 0;
  chekAdmittedpatient(obj) {
    
    this.AdmittedRegId = obj.RegId;
 
    let Query = "select isnull(RegID,0) as RegID from Admission where RegID =  " + this.AdmittedRegId + " and Admissionid not in(select Admissionid from Discharge) "
    console.log(Query)
    this._AdmissionService.getRegIdDetailforAdmission(Query).subscribe(data => {
      this.registerObj = data[0];
      console.log(this.registerObj);
      if (this.registerObj != undefined) {
        this.AdmittedRegId = 0;
        Swal.fire("selected patient is already admitted!!..")
        this.onReset();
        this.personalFormGroup.get('RegId').reset();
        this.regno.nativeElement.focus();
              } else {
        this.getSelectedObj(obj);
      }
    });

  }
  chekEmergencypatient(obj){
    console.log("EmergencyList:",obj)
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

    // this.hospitalFormGroup.get("PatientTypeID").reset();





    this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
    this.onChangeCityList(this.registerObj);

    this.personalFormGroup.updateValueAndValidity();
  }

  getOptionTextPrefix(option) {
    return option && option.PrefixName ? option.PrefixName : '';
  }

  getOptionTextCity1(option) {
    return option && option.CityName ? option.CityName : '';
  }

  getOptionTextDep(option) {
    return option && option.DepartmentName ? option.DepartmentName : '';
  }

  getOptionTextRefDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextAdDoc1(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextWard(option) {
    return option && option.RoomName ? option.RoomName : '';
  }

  getOptionTextDoc2(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getOptionTextArea(option) {
    return option && option.AreaName ? option.AreaName : '';
  }

  getOptionTextReligion(option) {
    return option && option.ReligionName ? option.ReligionName : '';
  }

  getOptionTextMarital(option) {
    return option && option.MaritalStatusName ? option.MaritalStatusName : '';

  }


  getOptionTextBed(option) {
    return option && option.BedName ? option.BedName : '';
  }
  getOptionTextRelationship(option) {

    return option && option.RelationshipName ? option.RelationshipName : '';
  }

  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }

  getOptionTextSubCompany(option) {

    return option && option.CompanyName ? option.CompanyName : '';
  }



  onChangeReg(event) {
    if (event.value == 'registration') {
      this.NewRegflag=true;
      this.Regflag = false;
      this.personalFormGroup.get('RegId').reset();
      this.personalFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = true;
      this.registerObj = new AdmissionPersonlModel({});
      this.personalFormGroup.reset();

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();

      this.hospitalFormGroup = this.createHospitalForm();
      this.hospitalFormGroup.markAllAsTouched();

      this.wardFormGroup = this.wardForm();
      this.wardFormGroup.markAllAsTouched();

      this.otherFormGroup = this.otherForm();
      this.otherFormGroup.markAllAsTouched()

      this.getPrefixList();
      this.getHospitalList();
      this.getPrefixList();
      this.getPatientTypeList();
      this.getTariffList();
      this.getAreaList();
      this.getMaritalStatusList();
      this.getReligionList();
      this.getDepartmentList();
      this.getRelationshipList();

      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getWardList();
      this.getCompanyList();
      this.getSubTPACompList();
      this.getcityList1();


      this.Regdisplay = false;
      this.showtable = false;

    } else {
      this.Regdisplay = true;
      this.Regflag = true;      
      this.NewRegflag=false;
      this.searchFormGroup.get('RegId').enable();
      this.isRegSearchDisabled = false;

      this.personalFormGroup = this.createPesonalForm();
      this.personalFormGroup.markAllAsTouched();

      this.hospitalFormGroup = this.createHospitalForm();
      this.hospitalFormGroup.markAllAsTouched();

      this.wardFormGroup = this.wardForm();
      this.wardFormGroup.markAllAsTouched();

      this.otherFormGroup = this.otherForm();
      this.otherFormGroup.markAllAsTouched();

      this.getPrefixList();
      this.getHospitalList();
      this.getPrefixList();
      this.getPatientTypeList();
      this.getTariffList();
      this.getAreaList();
      this.getMaritalStatusList();
      this.getReligionList();
      this.getDepartmentList();
      this.getRelationshipList();

      this.getDoctorList();
      this.getDoctor1List();
      this.getDoctor2List();
      this.getWardList();
      this.getCompanyList();
      this.getSubTPACompList();
      this.getcityList1();

         this.showtable = true;
    }

    const todayDate = new Date();
    const dob = new Date(this.currentDate);
    const timeDiff = Math.abs(Date.now() - dob.getTime());
    this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
    this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
    this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
    this.registerObj.DateofBirth = this.currentDate;
    this.personalFormGroup.get('DateOfBirth').setValue(this.currentDate);

  }

  item1: any;
  item2: any;
  onClick(event: any) {
    this.item1 = "";
    event.stopPropagation();
  }

  getHospitalList() {
    this._AdmissionService.getHospitalCombo().subscribe(data => {
      this.HospitalList = data;
      this.searchFormGroup.get('HospitalId').setValue(this.HospitalList[0]);
    });
  }

  getRelationshipList() {
    this._AdmissionService.getRelationshipCombo().subscribe(data => {
      this.RelationshipList = data;
      this.optionsRelation = this.RelationshipList.slice();
      this.filteredOptionsRelation = this.otherFormGroup.get('RelationshipId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRelationship(value) : this.RelationshipList.slice()),

      );
    });
  }


  getPrefixList() {
    this._AdmissionService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.optionsPrefix = this.PrefixList.slice();
      this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPrex(value) : this.PrefixList.slice()),

      );

      if (this.data) {
        const toSelect = this.PrefixList.find(c => c.PrefixID == this.registerObj.PrefixID);
        this.personalFormGroup.get('PrefixID').setValue(toSelect);
        this.getOptionTextPrefix(this.data);

        this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
      }
    });
  }


  getTariffList() {
    this._AdmissionService.getTariffCombo().subscribe(data => {
      this.TariffList = data;
      this.optionsTariff = this.TariffList.slice();
      this.filteredOptionsTarrif = this.hospitalFormGroup.get('TariffId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterTariff(value) : this.TariffList.slice()),
      );

    });
    this.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
  }

  getOptionTextpatienttype(option) {
    return option && option.PatientType ? option.PatientType : '';
  }

  getOptionTextTariff(option) {
    return option && option.TariffName ? option.TariffName : '';
  }

  getAreaList() {

    this._AdmissionService.getAreaCombo().subscribe(data => {
      this.AreaList = data;
      this.optionsArea = this.AreaList.slice();
      this.filteredOptionsArea = this.personalFormGroup.get('AreaId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterArea(value) : this.AreaList.slice()),
      );

    });
  }

  getMaritalStatusList() {

    this._AdmissionService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      this.optionsMarital = this.MaritalStatusList.slice();
      this.filteredOptionsMarital = this.personalFormGroup.get('MaritalStatusId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterMarital(value) : this.MaritalStatusList.slice()),
      );

    });
  }

  getReligionList() {
    this._AdmissionService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      this.optionsReligion = this.ReligionList.slice();
      this.filteredOptionsReligion = this.personalFormGroup.get('ReligionId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterReligion(value) : this.ReligionList.slice()),
      );

    });

  }


  getDepartmentList() {
    this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.hospitalFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );

    });
  }


  getcityList1() {
    this._AdmissionService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
    });

  }

  getOptionTextsearchDoctor(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }

  getDoctorList() {
    this._AdmissionService.getDoctorMaster().subscribe(data => {
      this.searchDoctorList = data;
      this.optionsSearchDoc = this.searchDoctorList.slice();
      this.filteredOptionssearchDoctor = this._AdmissionService.myFilterform.get('searchDoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSearchdoc(value) : this.searchDoctorList.slice()),
      );
    });
  }

  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.optionsAdDoc1 = this.Doctor1List.slice();
      this.filteredOptionsDoc1 = this.hospitalFormGroup.get('admittedDoctor1').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filteradmittedDoctor1(value) : this.Doctor1List.slice()),
      );
    });
  }
  
  


    private _filteradmittedDoctor1(value: any): string[] {
      if (value) {
        const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
        return this.optionsAdDoc1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
      }
  
    }


  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.optionsAdDoc2 = this.Doctor2List.slice();
      this.filteredOptionsDoc2 = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filteradmittedDoctor2(value) : this.Doctor2List.slice()),
      );

    });
  }

  
  private _filteradmittedDoctor2(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsAdDoc2.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }


  getRefDoctorList() {
    this._AdmissionService.geReftDoctorMaster2().subscribe(data => {
      this.RefDoctorList = data;
      this.optionsRefDoc = this.RefDoctorList.slice();
      this.filteredOptionsRefrenceDoc = this.hospitalFormGroup.get('refDoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.RefDoctorList.slice()),
      ); 
    });
  }

  private _filterRefdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsRefDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }


  getWardList() {
    this._AdmissionService.getWardCombo().subscribe(data => {
      this.WardList = data;
      this.optionsWard = this.WardList.slice();
      this.filteredOptionsWard = this.wardFormGroup.get('RoomId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterWard(value) : this.WardList.slice()),
      );

    });
  }

  // getPatientTypeList() {
  //   this._AdmissionService.getPatientTypeCombo().subscribe(data => {
  //     this.PatientTypeList = data;
  //     this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
  //   })
  // }

  getPatientTypeList() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.optionsPatientType = this.PatientTypeList.slice();
      this.filteredOptionsPatientType = this.hospitalFormGroup.get('PatientTypeID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPatientType(value) : this.PatientTypeList.slice()),
        
      );

    });
    this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    this.hospitalFormGroup.updateValueAndValidity();

  }

  private _filterPatientType(value: any): string[] {
    if (value) {
      const filterValue = value && value.PatientType ? value.PatientType.toLowerCase() : value.toLowerCase();
      return this.optionsPatientType.filter(option => option.PatientType.toLowerCase().includes(filterValue));

    }
    // this.setptype();

  }



  private _filterTariff(value: any): string[] {
    if (value) {
      const filterValue = value && value.TariffName ? value.TariffName.toLowerCase() : value.toLowerCase();

      return this.optionsTariff.filter(option => option.TariffName.toLowerCase().includes(filterValue));
    }

  }

  onChangeStateList(CityId) {
    if (CityId > 0) {
      if (this.registerObj.StateId != 0) {
        CityId = this.registerObj.CityId
      }
      this._AdmissionService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;

      });
    }
  }


  onChangeCityList(CityObj) {
    if (CityObj) {
      this._AdmissionService.getStateList(CityObj.CityId).subscribe((data: any) => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
        this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
        this.selectedStateID = this.stateList[0].StateId;
        this.onChangeCountryList(this.selectedStateID);
      });
    }
    else {
      this.selectedState = null;
      this.selectedStateID = null;
      this.selectedCountry = null;
      this.selectedCountryID = null;
    }
  }

  onChangeCountryList(StateId) {
    if (StateId > 0) {
      this._AdmissionService.getCountryList(StateId).subscribe(data => {
        this.countryList = data;
        this.selectedCountry = this.countryList[0].CountryName;
        this.personalFormGroup.get('CountryId').setValue(this.countryList[0]);
        this.personalFormGroup.updateValueAndValidity();
      });
    }
  }
  // RegistrationListComponent
  searchRegList() {
    this.showtable = true;
    this.setDropdownObjs();
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


  onChangeGenderList(prefixObj) {
    if (prefixObj) {
      this._AdmissionService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
        this.GenderList = data;
        this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
        this.selectedGenderID = this.GenderList[0].GenderId;
      });
    }
  }


  OnChangeDoctorList(departmentObj) {
    
    
    this.hospitalFormGroup.get('DoctorId').reset();

    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(
      data => {
        this.DoctorList = data;
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.hospitalFormGroup.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
  }



  OnChangeBedList(wardObj) {
    
    this._AdmissionService.getBedCombo(wardObj.RoomId).subscribe(data => {
      this.BedList = data;
      this.optionsBed = this.BedList.slice();
      this.filteredOptionsBed = this.wardFormGroup.get('BedId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBed(value) : this.BedList.slice()),
      );
    });
    this._AdmissionService.getBedClassCombo(wardObj.ClassID).subscribe(data => {
      this.BedClassList = data;
      this.wardFormGroup.get('ClassId').setValue(this.BedClassList[0]);
    })
  }

  onBedChange(value) {
    this.bedObj = value;
  }

  onSubmit() {
    this.submitted = true;
  }


  onChangePatient(value) {

    if (value.PatientTypeId != 2) {
      this.isCompanySelected = false;
      this.hospitalFormGroup.get('CompanyId').clearValidators();
      this.hospitalFormGroup.get('SubCompanyId').clearValidators();
      this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
      this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
      
      this.patienttype = 1;

    } 
     if (value.PatientTypeId == 2) {
      this.isCompanySelected = true;
      this.hospitalFormGroup.get('CompanyId').reset();
      this.hospitalFormGroup.get('CompanyId').setValidators([Validators.required]);
      this.hospitalFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.patienttype = 2;
      
    }

  }

  onReset() {
    // this._AdmissionService.mySaveForm.reset();
    this.personalFormGroup.get('RegId').reset();
    this.personalFormGroup.get('RegId').disable();

    if (this.searchFormGroup.get('regRadio').value == "registration")
      this.searchFormGroup.get('RegId').disable();
    else
      this.searchFormGroup.get('RegId').enable();


    this.registerObj = new AdmissionPersonlModel({});
    this.personalFormGroup.reset();

    this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();

    this.hospitalFormGroup = this.createHospitalForm();
    this.hospitalFormGroup.markAllAsTouched();

    this.wardFormGroup = this.wardForm();
    this.wardFormGroup.markAllAsTouched();

    this.otherFormGroup = this.otherForm();
    this.otherFormGroup.markAllAsTouched()

    this.getPrefixList();
    this.getHospitalList();
    this.getPrefixList();
    this.getPatientTypeList();
    this.getTariffList();
    this.getAreaList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getDepartmentList();
    this.getRelationshipList();

    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getWardList();
    this.getCompanyList();
    this.getSubTPACompList();
    this.getcityList1();

   
    this.isCompanySelected = false;
    this.hospitalFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.hospitalFormGroup.get('CompanyId').clearValidators();
    this.hospitalFormGroup.get('SubCompanyId').clearValidators();
    this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
    this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();


  }

  nextClicked(formGroupName) {

    if (formGroupName.invalid) {
      const controls = formGroupName.controls;
      Object.keys(controls).forEach(controlsName => {
        const controlField = formGroupName.get(controlsName);
        if (controlField && controlField.invalid) {
          controlField.markAsTouched({ onlySelf: true });
        }
      });
      return;
    }
    
    if (formGroupName == this.otherFormGroup) {
      if (this.vRoomId && isNaN(this.vBedId)) {
        this.onNewSave();
      }
      else {
        this.toastr.warning('Please select Ward and Bed.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      return;
    }
    this.admissionFormStepper.next();
  }

  patienttype: any = 1;
  CompanyId: any = 0;
  SubCompanyId: any = 0;

  onNewSave(){
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
    const ischeckprefix = this.PrefixList.some(item => item.PrefixName ===this.personalFormGroup.get('PrefixID').value.PrefixName)
    if(!ischeckprefix){
      this.toastr.warning('Please Select valid Prefix', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.personalFormGroup.get('AreaId').value){
      if(!this.AreaList.some(item => item.AreaName ===this.personalFormGroup.get('AreaId').value.AreaName)){
        this.toastr.warning('Please Select valid AreaName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(!this.cityList.some(item => item.CityName ===this.personalFormGroup.get('CityId').value.CityName)){
      this.toastr.warning('Please Select valid City', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.personalFormGroup.get('MaritalStatusId').value){
      if(!this.MaritalStatusList.some(item => item.MaritalStatusName ===this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusName)){
        this.toastr.warning('Please Select valid MaritalStatus', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.personalFormGroup.get('ReligionId').value){
      if(!this.ReligionList.some(item => item.ReligionName ===this.personalFormGroup.get('ReligionId').value.ReligionName)){
        this.toastr.warning('Please Select valid ReligionName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
 
    if(!this.TariffList.some(item => item.TariffName ===this.hospitalFormGroup.get('TariffId').value.TariffName)){
      this.toastr.warning('Please Select valid TariffName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   
    if(!this.DepartmentList.some(item => item.departmentName ===this.hospitalFormGroup.get('Departmentid').value.departmentName)){
      this.toastr.warning('Please Select valid departmentName', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(!this.DoctorList.some(item => item.Doctorname ===this.hospitalFormGroup.get('DoctorId').value.Doctorname)){
      this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if(this.hospitalFormGroup.get('admittedDoctor1').value){
      if(!this.Doctor1List.some(item => item.Doctorname ===this.hospitalFormGroup.get('admittedDoctor1').value.Doctorname)){
        this.toastr.warning('Please Select valid AdmitDoctorName11', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('admittedDoctor2').value){
      if(!this.Doctor2List.some(item => item.Doctorname ===this.hospitalFormGroup.get('admittedDoctor2').value.Doctorname)){
        this.toastr.warning('Please Select valid AdmitDoctorName2', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('refDoctorId').value){
      if(!this.Doctor1List.some(item => item.Doctorname ===this.hospitalFormGroup.get('refDoctorId').value.Doctorname)){
        this.toastr.warning('Please Select valid RefDoctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
   
    if(this.hospitalFormGroup.get('CompanyId').value){
      if(!this.CompanyList.some(item => item.CompanyName ===this.hospitalFormGroup.get('CompanyId').value.CompanyName)){
        this.toastr.warning('Please Select valid CompanyName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.hospitalFormGroup.get('SubCompanyId').value){
      if(!this.SubTPACompList.some(item => item.CompanyName ===this.hospitalFormGroup.get('SubCompanyId').value.CompanyName)){
        this.toastr.warning('Please Select valid SubCompany', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.wardFormGroup.get('RoomId').value){
      if(!this.WardList.some(item => item.RoomName ===this.wardFormGroup.get('RoomId').value.RoomName)){
        this.toastr.warning('Please Select valid WardName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
  
    if(!this.wardFormGroup.get('BedId').value){
      if(this.vBedId == '' || this.vBedId == null || this.vBedId == undefined || this.vBedId == 0){
        this.toastr.warning('Please Select BedName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }  
    if(this.wardFormGroup.get('BedId').value){
      if(!this.BedList.some(item => item.BedName ===this.wardFormGroup.get('BedId').value.BedName)){
        this.toastr.warning('Please Select valid BedName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }
    if(this.otherFormGroup.get('RelationshipId').value){
      if(!this.RelationshipList.some(item => item.RelationshipName ===this.otherFormGroup.get('RelationshipId').value.RelationshipName)){
        this.toastr.warning('Please Select valid RelationshipName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

   
  
    if ((!this.personalFormGroup.invalid && !this.hospitalFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid)) {
   
      Swal.fire({
        title: 'Do you want to Save the Admission ',
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, Save!" 

      }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) { 
         this.OnSaveAdmission();
        }
      }) 
    }else{
      this.getAdmittedPatientList_1();
    }

  }
  OnSaveAdmission() {

 
    if (this.patienttype != 2) {
      this.CompanyId = 0;
      this.SubCompanyId = 0;
    } else if (this.patienttype == 2) {
      
      this.CompanyId = this.hospitalFormGroup.get('CompanyId').value.CompanyId;
      this.SubCompanyId = this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId;

      if ((this.CompanyId == 0 || this.CompanyId == undefined || this.SubCompanyId == 0)) {
        this.toastr.warning('Please select Company.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
    }

    if (!this.personalFormGroup.invalid && !this.hospitalFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid) {
      if (this.searchFormGroup.get('regRadio').value == "registration") {
        //Api
        this.isLoading = 'submit';
        let submissionObj = {};
        let regInsert = {};
        let admissionNewInsert = {};
        regInsert['RegId'] = 0;
        regInsert['regDate'] = this.dateTimeObj.date || '01/01/1900',
          regInsert['regTime'] = this.dateTimeObj.time || '01/01/1900',
          regInsert['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
        regInsert['firstName'] = this.registerObj.FirstName || '';
        regInsert['middleName'] = this.registerObj.MiddleName || '';
        regInsert['lastName'] = this.registerObj.LastName || '';
        regInsert['address'] = this.registerObj.Address || '';
        regInsert['city'] = this.personalFormGroup.get('CityId').value.CityId;
        regInsert['PinNo'] = '';
        regInsert['dateOfBirth'] = this.registerObj.DateofBirth;
        regInsert['age'] = this.registerObj.AgeYear;//this.registerObj.Age;
        regInsert['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
        regInsert['phoneNo'] = this.registerObj.PhoneNo || '';
        regInsert['mobileNo'] = this.registerObj.MobileNo || '';
        regInsert['addedBy'] = this.accountService.currentUserValue.user.id;
        regInsert['UpdatedBy'] = 0,// this.accountService.currentUserValue.user.id;
          regInsert['ageYear'] = this.registerObj.AgeYear || '';
        regInsert['ageMonth'] = this.registerObj.AgeMonth || '';
        regInsert['ageDay'] = this.registerObj.AgeDay || '';
        regInsert['countryId'] = this.personalFormGroup.get('CountryId').value.CountryId;
        regInsert['stateId'] = this.personalFormGroup.get('StateId').value.StateId;
        regInsert['cityId'] = this.personalFormGroup.get('CityId').value.CityId;
        regInsert['maritalStatusId'] = this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0;
        regInsert['isCharity'] = this.otherFormGroup.get('IsCharity').value ? this.otherFormGroup.get('IsCharity').value : false;
        regInsert['religionId'] = this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
        regInsert['areaId'] = this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
        regInsert['IsSeniorCitizen'] = this.otherFormGroup.get('IsSenior').value ? this.otherFormGroup.get('IsSenior').value : 0;
        regInsert['aadharCardNo'] = this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0;
        regInsert['panCardNo'] = this.personalFormGroup.get('Pancardno').value ? this.personalFormGroup.get('Pancardno').value : 0;
        // regInsert['Photo']=''

        submissionObj['regInsert'] = regInsert;

        admissionNewInsert['admissionID'] = 0;
        admissionNewInsert['regId'] = 0; //this.registerObj.RegId;
        admissionNewInsert['admissionDate'] = this.dateTimeObj.date || '01/01/1900',
          admissionNewInsert['admissionTime'] = this.dateTimeObj.time || '01/01/1900',

          admissionNewInsert['patientTypeId'] = this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//tTypeId ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
        admissionNewInsert['hospitalID'] = this.searchFormGroup.get('HospitalId').value.HospitalId || 1;  //? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 0;
        admissionNewInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
        admissionNewInsert['refDocNameId'] = this.hospitalFormGroup.get('refDoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

        admissionNewInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
        admissionNewInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
        admissionNewInsert['dischargeDate'] = '01/01/1900';
        admissionNewInsert['dischargeTime'] = '01/01/1900';

        admissionNewInsert['isDischarged'] = 0;
        admissionNewInsert['isBillGenerated'] = 0;
        admissionNewInsert['CompanyId'] = this.CompanyId;//this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
        admissionNewInsert['tariffId'] = this.hospitalFormGroup.get('TariffId').value.TariffId ? this.hospitalFormGroup.get('TariffId').value.TariffId : 0;

        admissionNewInsert['classId'] = this.wardFormGroup.get('ClassId').value.ClassId ? this.wardFormGroup.get('ClassId').value.ClassId : 0;
        admissionNewInsert['departmentId'] = this.hospitalFormGroup.get('Departmentid').value.DepartmentId;// ? this.hospitalFormGroup.get('DepartmentId').value.DepartmentId : 0;
        admissionNewInsert['relativeName'] = this.otherFormGroup.get('RelativeName').value ? this.otherFormGroup.get('RelativeName').value : '';
        admissionNewInsert['relativeAddress'] = this.otherFormGroup.get('RelativeAddress').value ? this.otherFormGroup.get('RelativeAddress').value : '';

        admissionNewInsert['phoneNo'] = this.personalFormGroup.get('MobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
        admissionNewInsert['mobileNo'] = this.otherFormGroup.get('RelatvieMobileNo').value ? this.otherFormGroup.get('RelatvieMobileNo').value : '';
        admissionNewInsert['relationshipId'] = this.otherFormGroup.get('RelationshipId').value.RelationshipId || 0;
        admissionNewInsert['addedBy'] = this.accountService.currentUserValue.user.id;

        admissionNewInsert['isMLC'] = this.otherFormGroup.get('IsMLC').value || false;
        admissionNewInsert['motherName'] = '';
        admissionNewInsert['admittedDoctor1'] = this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId ? this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId : 0;
        admissionNewInsert['admittedDoctor2'] = this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId ? this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId : 0;
        admissionNewInsert['RefByTypeId'] = 0;
        admissionNewInsert['RefByName'] = 0;
        admissionNewInsert['SubTpaComId'] = this.SubCompanyId;//this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId ? this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId : 0;
        admissionNewInsert['PolicyNo'] = 0;
        admissionNewInsert['AprovAmount'] = 0;
        admissionNewInsert['CompDOD'] = this.dateTimeObj.date || '01/01/1900',
          admissionNewInsert['IsPackagePatient'] = 0;
        admissionNewInsert['isOpToIPConv'] = this.otherFormGroup.get('OPIPChange').value,
          admissionNewInsert['RefDoctorDept'] = this.hospitalFormGroup.get('Departmentid').value.DepartmentName || '';
        submissionObj['admissionNewInsert'] = admissionNewInsert;

        let BedStatusUpdate = {};
        BedStatusUpdate['BedId'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;

        submissionObj['bedStatusUpdate'] = BedStatusUpdate;

        console.log(submissionObj);
        this._AdmissionService.AdmissionNewInsert(submissionObj).subscribe(response => {

          if (response) { 
            this.toastr.success('Admission save Successfully !', 'Congratulations !', {
              toastClass: 'tostr-tost custom-toast-success',
            });   
            // this.getAdmittedPatientCasepaperview(response, true);
              this.getAdmittedPatientList_1();
              this.getAdmittedPatientCasepaperTempview(response, true);
                this.onReset(); 
          } else {
            this.toastr.success('Admission not saved', 'error', {
              toastClass: 'tostr-tost custom-toast-success',
            }); 
            this.getAdmittedPatientList_1();
          }
          this.isLoading = '';
        });


      }
      else {

        this.isLoading = 'submit';
        let submissionObj = {};
        let admissionInsert = {};


        admissionInsert['admissionID'] = 0;
        admissionInsert['regId'] = this.registerObj.RegId;
        admissionInsert['admissionDate'] = this.dateTimeObj.date || '01/01/1900',
          admissionInsert['admissionTime'] = this.dateTimeObj.time || '01/01/1900',

          admissionInsert['patientTypeId'] = this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//tTypeId ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
        admissionInsert['hospitalID'] = this.searchFormGroup.get('HospitalId').value.HospitalId || 1;  //? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 0;
        admissionInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
        admissionInsert['refDocNameId'] = this.hospitalFormGroup.get('refDoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

        admissionInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
        admissionInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
        admissionInsert['dischargeDate'] = '01/01/1900';
        admissionInsert['dischargeTime'] = '01/01/1900';

        admissionInsert['isDischarged'] = 0;
        admissionInsert['isBillGenerated'] = 0;
        admissionInsert['CompanyId'] = this.CompanyId;//this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
        admissionInsert['tariffId'] = this.hospitalFormGroup.get('TariffId').value.TariffId ? this.hospitalFormGroup.get('TariffId').value.TariffId : 0;

        admissionInsert['classId'] = this.wardFormGroup.get('ClassId').value.ClassId ? this.wardFormGroup.get('ClassId').value.ClassId : 0;
        admissionInsert['departmentId'] = this.hospitalFormGroup.get('Departmentid').value.DepartmentId;// ? this.hospitalFormGroup.get('DepartmentId').value.DepartmentId : 0;
        admissionInsert['relativeName'] = this.otherFormGroup.get('RelativeName').value ? this.otherFormGroup.get('RelativeName').value : '';
        admissionInsert['relativeAddress'] = this.otherFormGroup.get('RelativeAddress').value ? this.otherFormGroup.get('RelativeAddress').value : '';

        admissionInsert['phoneNo'] = this.personalFormGroup.get('MobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
        admissionInsert['mobileNo'] = this.otherFormGroup.get('RelatvieMobileNo').value ? this.otherFormGroup.get('RelatvieMobileNo').value : '';
        admissionInsert['relationshipId'] = this.otherFormGroup.get('RelationshipId').value.RelationshipId || 0;
        admissionInsert['addedBy'] = this.accountService.currentUserValue.user.id;

        admissionInsert['isMLC'] = this.otherFormGroup.get('IsMLC').value || false;
        admissionInsert['motherName'] = '';
        admissionInsert['admittedDoctor1'] = this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId ? this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId : 0;
        admissionInsert['admittedDoctor2'] = this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId ? this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId : 0;
        admissionInsert['RefByTypeId'] = 0;
        admissionInsert['RefByName'] = 0;
        admissionInsert['SubTpaComId'] = this.SubCompanyId;//this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId ? this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId : 0;
        admissionInsert['PolicyNo'] = 0;
        admissionInsert['AprovAmount'] = 0;
        admissionInsert['CompDOD'] = this.dateTimeObj.date || '01/01/1900',
          admissionInsert['IsPackagePatient'] = 0;
        admissionInsert['isOpToIPConv'] = this.otherFormGroup.get('OPIPChange').value,

          admissionInsert['RefDoctorDept'] = this.hospitalFormGroup.get('Departmentid').value.DepartmentName || '';

        submissionObj['admissionNewInsert'] = admissionInsert;

        let BedStatusUpdate = {};
        BedStatusUpdate['BedId'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;

        submissionObj['bedStatusUpdate'] = BedStatusUpdate;


        console.log(submissionObj);
        this._AdmissionService.AdmissionRegisteredInsert(submissionObj).subscribe(response => {

        
          if (response) { 
            this.toastr.success('Admission Of Registered Patient Successfully !', 'Congratulations !', {
              toastClass: 'tostr-tost custom-toast-success',
            });   
                this._matDialog.closeAll();
                this.getAdmittedPatientList_1();
                this.getAdmittedPatientCasepaperTempview(response, true);
                this.onReset();
          } else {
            this.toastr.success('Admission not saved', 'error', {
              toastClass: 'tostr-tost custom-toast-success',
            }); 
            this.getAdmittedPatientList_1();
          }
          this.isLoading = '';
        });

      }
    }
this.getAdmittedPatientList_1()
    this.onClose();
  }

  onClose() {

    this.searchFormGroup.get('RegId').reset();
    this.searchFormGroup.get('RegId').disable();


    this.isCompanySelected = false;
    this.hospitalFormGroup.get('CompanyId').setValue(this.CompanyList[-1]);
    this.hospitalFormGroup.get('CompanyId').clearValidators();
    this.hospitalFormGroup.get('SubCompanyId').clearValidators();
    this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
    this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
    this.patienttype = 1;
    this.personalFormGroup.get('CityId').reset();
  }
  onEdit(row) {

    this.registerObj = row;
    this.getSelectedObj(row);
  }

  getAdmittedDoctorCombo() {

    this._AdmissionService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
  }


  ngOnChanges(changes: SimpleChanges) {

    this.dataSource.data = changes.dataArray.currentValue as Admission[];
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDoctorOneChange(value) {

  }

  backClicked() {
    this.admissionFormStepper.previous();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  // getAdmittedPatientList() {
  //   this.sIsLoading = 'loading-data';
  //   var D_data = {
  //     "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || "%",
  //     "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || "%",
  //     "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || "0",
  //     "Doctor_Id": this._AdmissionService.myFilterform.get("searchDoctorId").value.DoctorId || "0",
  //     "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
  //     "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
  //     "Admtd_Dschrgd_All": 0,
  //     "M_Name": this._AdmissionService.myFilterform.get("MiddleName").value + '%' || "%",
  //     "IPNo": this._AdmissionService.myFilterform.get("IPDNo").value || 0,
  //   }
  // console.log(D_data)
  //   setTimeout(() => {
  //     this.sIsLoading = 'loading-data';
  //     this._AdmissionService.getAdmittedPatientList(D_data).subscribe(data => {
  //       this.dataSource.data = data as Admission[];
  //       this.dataSource.sort = this.sort;
  //       this.dataSource.paginator = this.paginator;
  //       // let x = {};
  //       // this.sentCountsToParent.emit(x);
  //       this.sIsLoading = '';
  //     },
  //       error => {
  //         this.sIsLoading = '';
  //       });
  //   }, 200);


  // }
  resultsLength = 0;
  getAdmittedPatientList_1() {
    
    var Param = {
      "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || "%",
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || "0",
      "Doctor_Id": this._AdmissionService.myFilterform.get("searchDoctorId").value.DoctorId || "0",
      "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Admtd_Dschrgd_All": 0,
      "M_Name": this._AdmissionService.myFilterform.get("MiddleName").value + '%' || "%",
      "IPNo": this._AdmissionService.myFilterform.get("IPDNo").value || '0',
      Start: (this.paginator?.pageIndex ?? 0),
      Length: (this.paginator?.pageSize ?? 35),
    }
    console.log(Param);
    this._AdmissionService.getAdmittedPatientList_1(Param).subscribe(data => {
      this.dataSource.data = data["Table1"] ?? [] as Admission[];
      if (this.dataSource.data.length > 0) {
        this.Admissiondetail(this.dataSource.data);
      }
      this.dataSource.sort = this.sort;
      console.log(this.dataSource.data)
      this.resultsLength = data["Table"][0]["total_row"];
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }




  getAdmittedPatientListview() {
    // this.sIsLoading = 'loading-data';

    setTimeout(() => {

      this.AdList = true;
      this._AdmissionService.getAdmittedPatientListView(

        this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
        this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
        0, 0,0
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Admission List  Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);

  }

  
  


  getAdmittedPatientListExcelview(){
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['IsMLC','RegNo', 'DOA', 'PatientName', 'Doctorname', 'RefDocName', 'IPNo', 'PatientType', 'WardName','TariffName','ClassName','CompanyName','RelativeName'];
    this.reportDownloadService.getExportJsonData(this.dataSource.data, exportHeaders, 'Ip Admitted Patient List Datewise');
    this.dataSource.data = [];
    this.sIsLoading = '';
  }

  getAdmittedPatientCasepaperview(AdmissionId, flag) {
    this.sIsLoading = 'loading-data';
    debugger
    let AdmissionID
    if (flag) {
      AdmissionID = AdmissionId
    } else {
      AdmissionID = AdmissionId.AdmissionID
    }

    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._AdmissionService.getAdmittedPatientCasepaaperView(
        AdmissionID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Admission Paper  Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);




  }

  
  
  getAdmittedPatientCasepaperTempview(AdmissionId, flag) {
    this.sIsLoading = 'loading-data';
    debugger
    let AdmissionID
    if (flag) {
      AdmissionID = AdmissionId
    } else {
      AdmissionID = AdmissionId.AdmissionID
    }

    setTimeout(() => {
      this.SpinLoading = true;
      this.AdList = true;
      this._AdmissionService.getAdmittedPatientCasepaapertemplateView(
        AdmissionID
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "Admission Paper  Viewer"
            }
          });

        matDialog.afterClosed().subscribe(result => {
          this.AdList = false;
          this.sIsLoading = ' ';
        });
      });

    }, 100);
  }

  onClear() {
    this._AdmissionService.myFilterform.reset(
      {
        start: [],
        end: []
      }
    );
  }

  // toggle sidebar
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

  // field validation 
  get f() { return this._AdmissionService.myFilterform.controls; }


  NewMLc(contact) {
    
    this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
    this._AdmissionService.populateForm(contact);
       const dialogRef = this._matDialog.open(MLCInformationComponent,
      {
        maxWidth: '85vw',
        height: '600px', width: '100%',
        data: {
          registerObj: contact,
        },
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }


  getMLCdetailview(Id) {
    // this.sIsLoading = 'loading-data';
  
    setTimeout(() => {
  
      this._AdmissionService.getMLCDetailView(Id
      ).subscribe(res => {
        const matDialog = this._matDialog.open(PdfviewerComponent,
          {
            maxWidth: "85vw",
            height: '750px',
            width: '100%',
            data: {
              base64: res["base64"] as string,
              title: "MLC Detail Viewer"
            }
          });
  
        matDialog.afterClosed().subscribe(result => {
          // this.AdList = false;
          // this.sIsLoading = ' ';
        });
      });
  
    }, 100);
  
  }

  
  
  getRecord(contact, m): void {

    if (m == "Edit Admission") {
      let Regdata;
      this._AdmissionService.getRegdata(contact.RegID).subscribe(data => {
        Regdata = data as RegInsert[];

      },
        error => {
          this.sIsLoading = '';
        });

      const dialogRef = this._matDialog.open(RegAdmissionComponent,
        {
          maxWidth: '95vw',

          height: '900px', width: '100%',
          data: {
            PatObj: Regdata
          }
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
 
    else if (m == "Update TPA Company Information") {


      this.advanceDataStored.storage = new AdmissionPersonlModel(contact);
      this._AdmissionService.populateForm(contact);
      const dialogRef = this._matDialog.open(SubCompanyTPAInfoComponent,
        {
          maxWidth: '85vw',
          height: '600px', width: '100%',
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    } else if (m == "Update Consultant Doctor") {

      var m_data2 = {
        RegId: contact.RegID,
        PatientName: contact.PatientName,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_Id: contact.AdmissionID,
        DoctorId: contact.DoctorId,
        DoctorName: contact.Doctorname,
      };
      this._registrationService.populateFormpersonal(m_data2);
      const dialogRef = this._matDialog.open(EditConsultantDoctorComponent,
        {
          maxWidth: "70vw",
          height: "410px",
          width: "70%",
          data: {
            registerObj: m_data2,
            FormName:"Admission"
          },
        }
      );
      dialogRef.afterClosed().subscribe((result) => {

      });
    } else if (m == "Update Referred Doctor") {
      
      var m_data3 = {
        RegId: contact.RegID,
        PatientName: contact.PatientName,
        AdmissionID: contact.AdmissionID,
        OPD_IPD_Id: contact.AdmissionID,
        RefDoctorId: contact.RefDocId,
        RefDocName: contact.RefDocName,
        VisitId: contact.VisitId,
      };
      this._registrationService.populateFormpersonal(m_data3);
      const dialogRef = this._matDialog.open(EditRefraneDoctorComponent, {
        maxWidth: "70vw",
        height: "410px",
        width: "70%",
        data: {
          registerObj: m_data3,
          FormName:"Admission"
        },
      });
      dialogRef.afterClosed().subscribe((result) => {
        console.log("The dialog was closed - Insert Action", result);
      });
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

  @ViewChild('bday') bday: ElementRef;
  // @ViewChild('AadharCardNo') AadharCardNo: MatSelect;
  @ViewChild('AadharCardNo') AadharCardNo: ElementRef;
  @ViewChild('mstatus') mstatus: ElementRef;
  @ViewChild('religion') religion: ElementRef;
  @ViewChild('city') city: ElementRef;
  @ViewChild('admitdoc1') admitdoc1: ElementRef;
  @ViewChild('ptype') ptype: ElementRef;
  @ViewChild('tariff') tariff: ElementRef;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('deptdoc') deptdoc: ElementRef;
  @ViewChild('refdoc') refdoc: ElementRef;
  @ViewChild('admitdoc2') admitdoc2: ElementRef;
  @ViewChild('admitdoc3') admitdoc3: MatSelect;


  @ViewChild('ward') ward: ElementRef;
  @ViewChild('bed') bed: ElementRef;
  @ViewChild('class') class: MatSelect;
  @ViewChild('relativename') relativename: ElementRef;
  @ViewChild('relativeadd') relativeadd: ElementRef;
  @ViewChild('relativemobile') relativemobile: ElementRef;
  @ViewChild('relation') relation: ElementRef;
  @ViewChild('regno') regno: ElementRef;



  add: boolean = false;
  @ViewChild('addbutton', { static: true }) addbutton: HTMLButtonElement;
  // @ViewChild('savebutton', { static: true }) savebutton: HTMLButtonElement;
  @ViewChild('savebutton') savebutton: ElementRef;

  // isNaN(value
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
      this.mstatus.nativeElement.focus();
      // if(this.mstatus) this.mstatus.focus();
    }
  }

  public onEntermstatus(event): void {
    if (event.which === 13) {
     
      this.religion.nativeElement.focus();
    }
  }
  // }

  public onEnterreligion(event): void {
    if (event.which === 13) {
     
      this.bday.nativeElement.focus();

    }
  }
  

  public onEnterbday(event): void {
    if (event.which === 13) {
      this.agey.nativeElement.focus();

    }
  }


  public onEnteragey(event,value): void {
    
    if (event.which === 13) {
      this.agem.nativeElement.focus();
      this.ageyearcheck(value);
    }

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
      this.AadharCardNo.nativeElement.focus();
    }
  }

  public onEnterAadharCardNo(event): void {
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

        this.ptype.nativeElement.focus();
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
        this.tariff.nativeElement.focus();

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




  public onEnterdeptdoc(event): void {
    if (event.which === 13) {
      
        this.admitdoc1.nativeElement.focus();
      
    }

  }


  public onEnteradmitdoc1(event): void {
    if (event.which === 13) {

      this.admitdoc2.nativeElement.focus();
      
    }
  }
  public onEnteradmitdoc2(event): void {
    if (event.which === 13) {

      this.refdoc.nativeElement.focus();
      
    }
  }
  public onEnterrefdoc(event): void {
    if (event.which === 13) {

      this.ward.nativeElement.focus();
      
    }
  }

  public onEnterward(event, value): void {
    if (event.which === 13) {

      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Ward', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.bed.nativeElement.focus();
      }
    }
  }

  public onEnterbed(event, value): void {
    if (event.which === 13) {
      this.relativename.nativeElement.focus();
    }
  }
  public onEnterclass(event): void {
    // if (event.which === 13) {

    //   this.relativename.nativeElement.focus();
    // }
  }
  public onEnterrelativename(event): void {
    if (event.which === 13) {

      this.relativeadd.nativeElement.focus();
    }
  }

  public onEnterrelativeadd(event): void {
    if (event.which === 13) {

      this.relativemobile.nativeElement.focus();
    }
  }

  public onEnterrelativemobile(event): void {
    if (event.which === 13) {
      // if(this.purpose) this.purpose.focus();
      this.relation.nativeElement.focus();

      // this.registration.nativeElement.focus();
    }
    // this.saveflag=true;
  }

  public onEnterrelation(event): void {
    
    if (event.which === 13 || this.otherFormGroup.get('RelationshipId').value) {
      if(!this.personalFormGroup.invalid && !this.hospitalFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid)
     this.saveflag=true;
    }
    
    // if(this.savebutton) this.savebutton.focus();

    if(this.savebutton) this.savebutton.nativeElement.focus();
  }
  setSaveflag(){
    
    if(this.otherFormGroup.get('RelationshipId').value){
      if(!this.RelationshipList.some(item => item.RelationshipName ===this.otherFormGroup.get('RelationshipId').value.RelationshipName)){
        this.toastr.warning('Please Select valid RelationshipName', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      }
      
    }
    this.saveflag=true;
  }



  // ageyearcheck(event) {

  //   if (event > 100) {
  //     this.toastr.warning('Please Enter Valid Age.', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //     this.agey.nativeElement.focus();
  //   }
  // }

  agemonthcheck(event) {

    if (event > 12) {
      this.toastr.warning('Please Enter Valid Month.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }

  agedaycheck(event) {

    if (event > 31) {
      this.toastr.warning('Please Enter Valid Ageday.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }



  EditRegistration(row) {
    
    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"]=row.RegID;
    this.registerObj["RegID"]=row.RegID;
    this.registerObj["PrefixID"]=row.PrefixId;
    
    const dialogRef = this._matDialog.open(NewRegistrationComponent,
      {
        maxWidth: "90vw",
        height: '450px',
        width: '100%',
        data: {
          registerObj: row,
          Submitflag: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this.getAdmittedPatientList_1();
       
      });
     
  }
  getEditAdmission(row) {
    
    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"]=row.RegID;
    this.registerObj["RegID"]=row.RegID;
    const dialogRef = this._matDialog.open(EditAdmissionComponent,
      {
        maxWidth: "90vw",
        height: '650px',
        width: '100%',
        data: {
          registerObj: row,
         }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this. getAdmittedPatientList_1();
       
      });
     
  }

  getEditCompany(row) {
    
    this.advanceDataStored.storage = new AdmissionPersonlModel(row);
    console.log(row)
    this._registrationService.populateFormpersonal(row);
    this.registerObj["RegId"]=row.RegID;
    this.registerObj["RegID"]=row.RegID;
    
    const dialogRef = this._matDialog.open(CompanyInformationComponent,
      {
        maxWidth: "70vw",
        height: '740px',
        width: '100%',
        data: {
          registerObj: row,
          Submitflag: true
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
        this. getAdmittedPatientList_1();
       
      });
  }
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
      let todayDate=new Date();
      const timeDiff = Math.abs(Date.now() - this.registerObj.DateofBirth.getTime());
      this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - this.registerObj.DateofBirth.getMonth());
      this.registerObj.AgeDay = Math.abs(todayDate.getDate() - this.registerObj.DateofBirth.getDate());
  }
  
  feedback(contact){
    
        this.advanceDataStored.storage = new AdvanceDetailObj(contact);
        this._AdmissionService.populateForm(contact);
        const dialogRef = this._matDialog.open(OPIPFeedbackComponent,
          {
           maxWidth: "95vw",
          maxHeight: "115vh", width: '100%', height: "100%",
            data: {
              Obj: contact
            }
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
          
        });
      
       
  }
}

export class Admission {
  AdmissionID: Number;
  RegID: number;
  AdmissionDate: any;
  RegNo: number;
  AdmissionTime: any;
  PatientTypeID: number;
  HospitalID: number;
  HospitalName: any;
  HospitalAddress: any;

  Phone: number;
  EmailId: any;
  DocNameID: number;
  RefDocNameID: number;
  RefDoctorName: any;
  RoomId: number;
  BedId: number;
  DischargeDate: Date;
  DischargeTime: Time;
  IsDischarged: number;
  IsBillGenerated: number;
  CompanyId: number;
  TariffId: number;
  ClassId: number;
  DepartmentId: number;
  RelativeName: string;
  RelativeAddress: string;
  RelativePhoneNo: string;
  PhoneNo: string;
  RelationshipId: number;
  AdmittedDoctor1: number;
  AdmittedDoctor2: number;
  SubTPAComp: number;
  IsReimbursement: boolean;
  MobileNo: number;
  PrefixID: number;
  PrefixName: string;
  AddedBy: number;
  PatientName: string;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  DoctorId: number;
  DoctorName: string;
  IPDNo: number;
  DOA: any;
  DOT: Time;
  IsMLC: boolean;
  MotherName: string;
  RefDocName: string;
  PatientType: string;
  RegNoWithPrefix: number;
  CompanyName: string;
  AdmittedDoctor1ID: number;
  TariffName: string;
  RelationshipName: string;
  RoomName: string;
  DepartmentName: any;
  BedName: string;
  GenderId: number;
  GenderName: string;
  AdmDateTime: Date;
  ChargesAmount: number;
  AdvanceAmount: number;
  AdmittedPatientBalanceAmount: number;
  Age: number;
  AgeDay: number;
  AgeMonth: number;
  SubCompanyId: any;
  AdmittedDoctorName: any;
  PatientTypeId: any;
  IsOpToIPconv: any;

  /**
* Constructor
*
* @param Admission
*/
  constructor(Admission) {
    {
      this.AdmissionID = Admission.AdmissionID || '';
      this.RegID = Admission.RegID || '';
      this.AdmissionDate = Admission.AdmissionDate || '';
      this.AdmissionTime = Admission.AdmissionTime || '';
      this.PatientTypeID = Admission.PatientTypeID || '';
      this.HospitalID = Admission.HospitalID || '';
      this.EmailId = Admission.EmailId || '';
      this.Phone = Admission.Phone || 0;
      this.DocNameID = Admission.DocNameID || '';
      this.RefDocNameID = Admission.RefDocNameID || '';
      this.DischargeDate = Admission.DischargeDate || '';
      this.DischargeTime = Admission.DischargeTime || '';
      this.IsDischarged = Admission.IsDischarged || '';
      this.IsBillGenerated = Admission.IsBillGenerated || '';
      this.CompanyId = Admission.CompanyId || 0;
      this.ClassId = Admission.ClassId || 0;
      this.DepartmentId = Admission.DepartmentId || 0;
      this.RelativeName = Admission.RelativeName || '';
      this.RelativeAddress = Admission.RelativeAddress || '';
      this.RelativePhoneNo = Admission.RelativePhoneNo || 0;
      this.PhoneNo = Admission.PhoneNo || '';
      this.MobileNo = Admission.MobileNo || '';
      this.RelationshipId = Admission.RelationshipId || '';
      this.AddedBy = Admission.AddedBy || '';
      this.IsMLC = Admission.IsMLC || '';
      this.MotherName = Admission.MotherName || '';
      this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
      this.AdmittedDoctor2 = Admission.AdmittedDoctor2 || '';
      this.SubTPAComp = Admission.SubTPAComp || '';
      this.IsReimbursement = Admission.IsReimbursement || '';
      this.RefDoctorName = Admission.RefDoctorName || '';
      this.PrefixID = Admission.PrefixID || 0;
      this.PrefixName = Admission.PrefixName || '';
      this.PatientName = Admission.PatientName || '';
      this.FirstName = Admission.FirstName || '';
      this.MiddleName = Admission.MiddleName || '';
      this.LastName = Admission.LastName || '';
      this.DoctorId = Admission.DoctorId || '';
      this.DoctorName = Admission.DoctorName || '';
      this.IPDNo = Admission.IPDNo || '';

      this.GenderId = Admission.GenderId || '';
      this.GenderName = Admission.GenderName || '';

      this.DOA = Admission.DOA || '';
      this.DOT = Admission.DOT || '';
      // this.PatientTypeId = Admission.PatientTypeId || '';
      this.PatientType = Admission.PatientType || '';

      this.RefDocName = Admission.RefDocName || '';
      this.RegNoWithPrefix = Admission.RegNoWithPrefix || '';
      this.HospitalName = Admission.HospitalName || '';
      this.DepartmentName = Admission.DepartmentName || '';
      this.AdmittedDoctor1ID = Admission.AdmittedDoctor1ID || '';
      this.AdmittedDoctor1 = Admission.AdmittedDoctor1 || '';
      this.TariffId = Admission.TariffId || '';
      this.TariffName = Admission.TariffName || '';
      this.RoomId = Admission.WardId || '';
      this.RoomName = Admission.RoomName || '';
      this.BedId = Admission.BedId || '';
      this.BedName = Admission.BedName || '';
      this.AdmDateTime = Admission.AdmDateTime || '';
      this.CompanyName = Admission.CompanyName || '';
      this.RelationshipName = Admission.RelationshipName || '';
      this.HospitalAddress = Admission.HospitalAddress || '';
      this.ChargesAmount = Admission.ChargesAmount || '';
      this.AdvanceAmount = Admission.AdvanceAmount || '';
      this.AdmittedPatientBalanceAmount = Admission.AdmittedPatientBalanceAmount || '';
      this.RegNo = Admission.RegNo || '';
      this.Age = Admission.Age || '';
      this.AgeDay = Admission.AgeDay || '';
      this.AgeMonth = Admission.AgeMonth || '';
      this.SubCompanyId = Admission.SubCompanyId || 0;
      this.AdmittedDoctorName = Admission.AdmittedDoctorName || ''
      this.PatientTypeId = Admission.PatientTypeId || ''
      this.IsOpToIPconv = Admission.IsOpToIPconv || 0;
    }
  }
}

export class RegInsert {
  RegId: Number;
  RegDate: Date;
  RegTime: Time;
  PrefixId: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  Address: string;
  City: string;
  CityName: string;
  PinNo: string;
  DateofBirth: Date;
  Age: string;
  GenderId: Number;
  PhoneNo: string;
  MobileNo: string;
  AddedBy: number;
  AgeYear: string;
  AgeMonth: string;
  AgeDay: string;
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

  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(RegInsert) {
    {
      this.RegId = RegInsert.RegId || '';
      this.RegDate = RegInsert.RegDate || '';
      this.RegTime = RegInsert.RegTime || '';
      this.PrefixId = RegInsert.PrefixId || '';
      this.FirstName = RegInsert.FirstName || '';
      this.MiddleName = RegInsert.MiddleName || '';
      this.LastName = RegInsert.LastName || '';
      this.Address = RegInsert.Address || '';
      this.City = RegInsert.City || '';
      this.PinNo = RegInsert.PinNo || '';
      this.DateofBirth = RegInsert.DateofBirth || '';
      this.Age = RegInsert.Age || '';
      this.GenderId = RegInsert.GenderId || '';
      this.PhoneNo = RegInsert.PhoneNo || '';
      this.MobileNo = RegInsert.MobileNo || '';
      this.AddedBy = RegInsert.AddedBy || '';
      this.AgeYear = RegInsert.AgeYear || '';
      this.AgeMonth = RegInsert.AgeMonth || '';
      this.AgeDay = RegInsert.AgeDay || '';
      this.CountryId = RegInsert.CountryId || '';
      this.StateId = RegInsert.StateId || '';
      this.CityId = RegInsert.CityId || '';
      this.MaritalStatusId = RegInsert.MaritalStatusId || '';
      this.IsCharity = RegInsert.IsCharity || '';
      this.ReligionId = RegInsert.ReligionId || '';
      this.AreaId = RegInsert.AreaId || '';
      this.VillageId = RegInsert.VillageId || '';
      this.TalukaId = RegInsert.TalukaId || '';
      this.PatientWeight = RegInsert.PatientWeight || '';
      this.AreaName = RegInsert.AreaName || '';
      this.AadharCardNo = RegInsert.AadharCardNo || '';
      this.PanCardNo = RegInsert.PanCardNo || '';
    }
  }
}

export class Bed {
  BedId: Number;
  BedName: string;

  /**
   * Constructor
   *
   * @param Bed
   */
  constructor(Bed) {
    {
      this.BedId = Bed.BedId || '';
      this.BedName = Bed.BedName || '';
    }
  }
}

export class AdmissionPersonlModel {
  AadharCardNo: any;
  Address: any;
  opD_IPD_Type:any;
  Age: Number;
  AgeDay: any;
  AgeMonth: any;
  AgeYear: any;
  AreaId: Number;
  CityName: string;
  CityId: Number;
  CountryId: Number;
  DateofBirth: any;
  Expr1: any;
  FirstName: string;
  GenderId: Number;
  GenderName: string;
  IsCharity: any;
  LastName: String;
  MaritalStatusId: Number;
  MiddleName: string;
  MobileNo: string;
  PanCardNo: any;
  PatientName: string;
  PhoneNo: string;
  PinNo: string;
  PrefixID: number;
  PrefixName: string;
  RDate: any;
  RegDate: any;
  RegId: Number;
  RegNo: Number;
  RegNoWithPrefix: string;
  RegTime: string;
  RegTimeDate: string;
  ReligionId: Number;
  StateId: Number;
  TalukaId: Number;
  TalukaName: string;
  VillageId: Number;
  VillageName: string;
  Departmentid: any;
  currentDate = new Date();
  AdmittedDoctor1ID: any;
  AdmittedDoctor2ID: any;
  RelationshipId: any;
  AdmissionID: any;
  AdmissionDate: Date;
  AdmissionTime: Date;
  RelativeName: String;
  DoctorId: number;
  RelatvieMobileNo: any;
  MaritalStatusName: string;
  IsMLC: any;
  CompanyName: any;
  RelationshipName: string;
  RefDoctorName: string;
  AdmittedDoctor2: any;
  AdmittedDoctor1: any;
  RefDocName:any;
  BedId:any;
  BedName: any;
  IPDNo: any;
  TariffName: any;
  DepartmentName: any;
  RefDoctorId: any;
  VisitId: any;
  CompanyId: any;
  HospitalId: any;
  PatientTypeID: any;
  PatientType: any;
  SubCompanyId: any;
  Aadharcardno: any;
  Pancardno: any;
  RelativePhoneNo: any;
  DepartmentId:any;
  IsOpToIPconv:any;
  ClassName:any;
  IsBillGenerated:any;
  RoomId:any;
  RoomName:any;
  Doctorname:any;
  AdmDateTime:any;
  TariffId:any;
  RefDocNameId:any;
  RefDocNameID:any;
  DocNameID:any;
RelativeAddress:any;
IsSeniorCitizen:any;
RegID:any;
ClassId:any;
WardId:any;
PolicyNo: any;
MemberNo: any;
// WardName:any;
AprovAmount
CompDOD
IsPharClearance
IPNumber
EstimatedAmount
ApprovedAmount
HosApreAmt
PathApreAmt
PharApreAmt
RadiApreAmt
PharDisc

ClaimNo: any;
CompBillNo: any;
CompBillDate: any;
CompDiscount: any;
CompDisDate: any;
C_BillNo: any;
C_FinalBillAmt: any;
C_DisallowedAmt: any;
HDiscAmt: any;
C_OutsideInvestAmt: any;
RecoveredByPatient: any;
H_ChargeAmt: any;
H_AdvAmt: any;
H_BillId: any;
H_BillDate: any;
H_BillNo: any;
H_TotalAmt: any;
H_DiscAmt: any;
H_NetAmt: any;
H_PaidAmt: any;
H_BalAmt: any;
DoctorName:any;
vOPDNo:any;
TarrifName:any
OPDNo:any;
WardName:any;
Remark:any;
DetailGiven:any;
OP_IP_No:any;
OPD_IPD_ID:any;
OPD_IPD_Type:any;
PathReportID:any;
AdmDocId:any;
PathResultDr1:any;
ServiceId:any;
PathTestID:any;
Adm_Visit_docId:any;
TemplateResultInHTML:any;
EmgId:any;
  /**
* Constructor
*
* @param AdmissionPersonl
*/
  constructor(AdmissionPersonl) {
    {
      this.Departmentid = AdmissionPersonl.Departmentid || 0;
      this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
      this.opD_IPD_Type=AdmissionPersonl.opD_IPD_Type || 0
      this.Address = AdmissionPersonl.Address || '';
      this.Age = AdmissionPersonl.Age || '';
      this.AgeDay = AdmissionPersonl.AgeDay || '';
      this.AgeMonth = AdmissionPersonl.AgeMonth || '';
      this.AgeYear = AdmissionPersonl.AgeYear || '';
      this.AreaId = AdmissionPersonl.AreaId || '';
      this.CityName = AdmissionPersonl.CityName || '';
      this.CityId = AdmissionPersonl.CityId || 0;
      this.CountryId = AdmissionPersonl.CountryId || '';
      this.DateofBirth = AdmissionPersonl.DateOfBirth || this.currentDate;
      this.Expr1 = AdmissionPersonl.Expr1 || '';
      this.FirstName = AdmissionPersonl.FirstName || '';
      this.GenderId = AdmissionPersonl.GenderId || '';
      this.GenderName = AdmissionPersonl.GenderName || '';
      this.IsCharity = AdmissionPersonl.IsCharity || '';
      this.LastName = AdmissionPersonl.LastName || '';
      this.MaritalStatusId = AdmissionPersonl.MaritalStatusId || '';
      this.MiddleName = AdmissionPersonl.MiddleName || '';
      this.MobileNo = AdmissionPersonl.MobileNo || '';
      this.PanCardNo = AdmissionPersonl.PanCardNo || '';
      this.PatientName = AdmissionPersonl.PatientName || '';
      this.PhoneNo = AdmissionPersonl.PhoneNo || '';
      this.PinNo = AdmissionPersonl.PinNo || '';
      this.PrefixID = AdmissionPersonl.PrefixID || '';
      this.PrefixName = AdmissionPersonl.PrefixName || '';
      this.RDate = AdmissionPersonl.RDate || '';
      this.RegDate = AdmissionPersonl.RegDate || '';
      this.RegId = AdmissionPersonl.RegId || '';
      this.RegNo = AdmissionPersonl.RegNo || '';
      this.RegNoWithPrefix = AdmissionPersonl.RegNoWithPrefix || '';
      this.RegTime = AdmissionPersonl.RegTime || '';
      this.RegTimeDate = AdmissionPersonl.RegTimeDate || '';
      this.ReligionId = AdmissionPersonl.ReligionId || '';
      this.StateId = AdmissionPersonl.StateId || '';
      this.TalukaId = AdmissionPersonl.TalukaId || '';
      this.TalukaName = AdmissionPersonl.TalukaName || '';
      this.VillageId = AdmissionPersonl.VillageId || '';
      this.VillageName = AdmissionPersonl.VillageName || '';
      this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || 0;
      this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || 0;
      this.RefDocName=AdmissionPersonl.RefDocName || '';
      this.RelationshipId = AdmissionPersonl.RelationshipId || 0;
      this.AdmissionID = AdmissionPersonl.AdmissionID || 0;
      this.AdmissionDate = AdmissionPersonl.AdmissionDate || '';
      this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
      this.DoctorId = AdmissionPersonl.DoctorId || 0;
      this.RelatvieMobileNo = AdmissionPersonl.RelatvieMobileNo || '';
      this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
      this.IsMLC = AdmissionPersonl.IsMLC || 0;
      this.CompanyName = AdmissionPersonl.CompanyName || '';
      this.RelationshipName = AdmissionPersonl.RelationshipName || '';
      this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
      this.AdmittedDoctor2 = AdmissionPersonl.AdmittedDoctor2 || 0;
      this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || 0;
      this.BedName = AdmissionPersonl.BedName || '';
      this.IPDNo = AdmissionPersonl.IPDNo || '';
      this.TariffName = AdmissionPersonl.TariffName || '';
      this.DepartmentName = AdmissionPersonl.DepartmentName || '';
      this.RefDoctorId = AdmissionPersonl.RefDoctorId || 0;
      this.VisitId = AdmissionPersonl.VisitId || 0;
      this.HospitalId = AdmissionPersonl.HospitalId || 0;
      this.CompanyId = AdmissionPersonl.CompanyId || 0;
      this.PatientTypeID = AdmissionPersonl.PatientTypeID || 0;
      this.PatientType = AdmissionPersonl.PatientType || '';
      this.SubCompanyId = AdmissionPersonl.SubCompanyId || 0;
      this.Aadharcardno = AdmissionPersonl.Aadharcardno || ''
      this.Pancardno = AdmissionPersonl.Pancardno || '';
      this.RefDocName = AdmissionPersonl.RefDocName || '';
      this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || '';
      this.DepartmentId=AdmissionPersonl.DepartmentId || 0;
      this.IsOpToIPconv=AdmissionPersonl.IsOpToIPconv || 0;
      this.RelativeName=AdmissionPersonl.RelativeName || '';
      this.RelativeAddress=AdmissionPersonl.RelativeAddress || ''
      this.ClassName=AdmissionPersonl.ClassName || ''
      this.IsBillGenerated=AdmissionPersonl.IsBillGenerated || 0
      this.RoomName=AdmissionPersonl.RoomName || ''
      this.Doctorname=AdmissionPersonl.Doctorname || ''
      this.DoctorName=AdmissionPersonl.DoctorName || ''
      this.AdmDateTime=AdmissionPersonl.AdmDateTime || ''
      this.TariffId=AdmissionPersonl.TariffId || 0;
      this.RefDocNameId=AdmissionPersonl.RefDocNameId || 0
      this.RefDocNameID=AdmissionPersonl.RefDocNameID || 0
      this.DocNameID=AdmissionPersonl.DocNameID || 0
      this.IsSeniorCitizen=AdmissionPersonl.IsSeniorCitizen || 0
      this.BedId=AdmissionPersonl.BedId || 0;
      this.RegID=AdmissionPersonl.RegID || 0;
      this.ClassId=AdmissionPersonl.ClassId || 0
      this.RoomId=AdmissionPersonl.RoomId || 0;
      this.WardId =AdmissionPersonl.WardId ||0;
      this.PolicyNo = AdmissionPersonl.PolicyNo || '';
      this.MemberNo = AdmissionPersonl.MemberNo || '';

      this.AprovAmount = AdmissionPersonl.AprovAmount || '';
      this.CompDOD = AdmissionPersonl.CompDOD || '';
      this.IsPharClearance = AdmissionPersonl.IsPharClearance || '';
      this.IPNumber = AdmissionPersonl.IPNumber || '';
      this.EstimatedAmount = AdmissionPersonl.EstimatedAmount || '';
      this.ApprovedAmount = AdmissionPersonl.ApprovedAmount || '';
      this.HosApreAmt = AdmissionPersonl.HosApreAmt || '';
      this.PathApreAmt = AdmissionPersonl.PathApreAmt || '';
      this.PharApreAmt = AdmissionPersonl.PharApreAmt || '';
      this.RadiApreAmt = AdmissionPersonl.RadiApreAmt || '';
      this.PharDisc = AdmissionPersonl.HDiscAmt || '';

      this.ClaimNo = AdmissionPersonl.ClaimNo || '';
      this.CompBillNo = AdmissionPersonl.CompBillNo || '';
      this.CompBillDate = AdmissionPersonl.CompBillDate || '';
      this.CompDiscount = AdmissionPersonl.CompDiscount || '';
      this.CompDisDate = AdmissionPersonl.CompDisDate || '';
      this.C_BillNo = AdmissionPersonl.C_BillNo || '';
      this.C_FinalBillAmt = AdmissionPersonl.C_FinalBillAmt || '';
      this.C_DisallowedAmt = AdmissionPersonl.C_DisallowedAmt || '';
      this.HDiscAmt = AdmissionPersonl.HDiscAmt || '';
      this.C_OutsideInvestAmt = AdmissionPersonl.C_OutsideInvestAmt || '';
      this.RecoveredByPatient = AdmissionPersonl.RecoveredByPatient || '';
      this.H_ChargeAmt = AdmissionPersonl.H_ChargeAmt || '';
      this.H_AdvAmt = AdmissionPersonl.H_AdvAmt || '';
      this.H_BillId = AdmissionPersonl.H_BillId || '';
      this.H_BillDate = AdmissionPersonl.H_BillDate || '';
      this.H_BillNo = AdmissionPersonl. H_BillNo || '';
      this.H_TotalAmt = AdmissionPersonl. H_TotalAmt || '';
      this.H_DiscAmt = AdmissionPersonl.H_DiscAmt || '';
      this.H_NetAmt = AdmissionPersonl.H_NetAmt || '';
      this.H_PaidAmt = AdmissionPersonl.H_PaidAmt || '';
      this.H_BalAmt = AdmissionPersonl.H_BalAmt || '';
      this.vOPDNo=AdmissionPersonl.vOPDNo || ''
      this.TarrifName=AdmissionPersonl.TarrifName || ''
      this.WardName =AdmissionPersonl.WardName || ''
      this.OPDNo=AdmissionPersonl.OPDNo || ''
      this.Remark =AdmissionPersonl.Remark || ''
      this.DetailGiven=AdmissionPersonl.DetailGiven || ''
      this.OP_IP_No=AdmissionPersonl.OP_IP_No ||''
       this.OPD_IPD_ID=AdmissionPersonl.OPD_IPD_ID || ''
      this.OPD_IPD_Type=AdmissionPersonl.OPD_IPD_Type ||''
      this.PathReportID=AdmissionPersonl.PathReportID || 0
      this.AdmDocId=AdmissionPersonl.AdmDocId || 0
      this.PathResultDr1=AdmissionPersonl.PathResultDr1 || 0
      this.ServiceId=AdmissionPersonl.ServiceId || 0;
      this.PathTestID=AdmissionPersonl.PathTestID || 0
      this.Adm_Visit_docId=AdmissionPersonl.Adm_Visit_docId || 0;
      this.TemplateResultInHTML=AdmissionPersonl.TemplateResultInHTML || '';
      this.EmgId=AdmissionPersonl.EmgId || ''
    }
  }
}

export class Editdetail {
  Departmentid: Number;
  CityId: Number;
  PatientName: string;
  RegNo: any;
  AdmDateTime: string;
  AgeYear: number;
  ClassId: number;
  ClassName: String;
  TariffName: String;
  TariffId: number;
  IsDischarged: boolean;
  opD_IPD_Type: number;
  AdmissionDate: Date;
  OPD_IPD_ID: any;
  /**
  * Constructor
  *
  * @param Editdetail
  */
  constructor(Editdetail) {
    {
      this.Departmentid = Editdetail.Departmentid || '';
      this.CityId = Editdetail.CityId || '';
      this.TariffId = Editdetail.TariffId || '';
      this.AdmissionDate = Editdetail.AdmissionDate || '';
      this.RegNo = Editdetail.RegNo || '';
      this.OPD_IPD_ID = Editdetail.OPD_IPD_ID || '';
      //  this.AgeYear = AdmissionPersonl.AgeYear || '';
      //  this.ClassId = AdmissionPersonl.ClassId || '';
      //  this.ClassName = AdmissionPersonl.ClassName || '';
      //  this.TariffName = AdmissionPersonl.TariffName || '';
      //  this.TariffId = AdmissionPersonl.TariffId || '';
      //  this.IsDischarged =AdmissionPersonl.IsDischarged || 0 ;
      //  this.opD_IPD_Type = AdmissionPersonl.opD_IPD_Type | 0;
    }
  }
}