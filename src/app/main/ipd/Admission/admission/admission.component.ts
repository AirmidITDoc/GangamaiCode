import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AdvanceDetailObj } from 'app/main/opd/appointment/appointment.component';
import { EditAdmissionComponent } from './edit-admission/edit-admission.component';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { SubCompanyTPAInfoComponent } from './sub-company-tpainfo/sub-company-tpainfo.component';
import { MLCInformationComponent } from './mlcinformation/mlcinformation.component';
import { AdmissionNewComponent } from './admission-new/admission-new.component';
import { AdmissionViewComponent } from './admission-view/admission-view.component';
import { NewAdmissionComponent } from './new-admission/new-admission.component';
import { RegAdmissionComponent } from '../reg-admission/reg-admission.component';
import { OPIPPatientModel } from '../../ipdsearc-patienth/ipdsearc-patienth.component';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RFC_2822 } from 'moment';

@Component({
  selector: 'app-admission',
  templateUrl: './admission.component.html',
  styleUrls: ['./admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionComponent implements OnInit {

  reportPrintObj: Admission;
  searchFormGroup: FormGroup;
  isLoadings = false;

  subscriptionArr: Subscription[] = [];
  printTemplate: any;
  reportPrintObjList: Admission[] = [];
  AdmittedPatientList: any;
  msg: any;
  sIsLoading: string = '';
  screenFromString = 'admission-form';
  doctorNameCmbList: any = [];
  hasSelectedContacts: boolean;
  disabled = false;
  isAlive = false;
  savedValue: number = null;
  isOpen = false;
  loadID = 0;

  isRegIdSelected: boolean = false;
  isWardSelected: boolean = false;
  isPrefixSelected: boolean = false;
  isCitySelected: boolean = false;
  isCompanySelected: boolean = false;
  isCompanyselected: boolean = false;
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

  selectedAdvanceObj: AdvanceDetailObj;
  submitted = false;
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
  WardList: any = [];
  BedList: any = [];
  BedClassList: any = [];
  Todate: any;
  ConfigCityId = 2;
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

  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  isLinear = true;
  personalFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  registration: any;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  DoctorId: any = 0;

  options = [];
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

  filteredOptions: any;
  showtable: boolean = false;
  noOptionFound: boolean = false;
  Regdisplay: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  bedObj = new Bed({});
  selectedPrefixId: any;

  filteredOptionsPrefix: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
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
    'IsMLC',
    'RegNo',
    'PatientName',
    'DOA',
    'DOT',
    'Doctorname',
    'RefDocName',
    'IPNo',
    'PatientType',
    'WardName',
    'TariffName',
    'ClassName',
    'CompanyName',
    'RelativeName',
    'buttons'
  ];

  displayedColumns1: string[] = [
    'RegNo',
    'PatientName',
    'AgeYear',
    'GenderName',
    'PhoneNo',
    'MobileNo'
  ];

  dataSource = new MatTableDataSource<Admission>();

  dataSource1 = new MatTableDataSource<OPIPPatientModel>();

  menuActions: Array<string> = [];
  centered = false;
  unbounded = false;

  radius: number;
  color: string;
  filteredDoctor: any;
  dialogRef: any;
  isLoading: string;

  constructor(public _AdmissionService: AdmissionService,
    public _matDialog: MatDialog,
    private _ActRoute: Router,
    private _fuseSidebarService: FuseSidebarService,
    private accountService: AuthenticationService,
    public datePipe: DatePipe,
    private router: Router,
    private formBuilder: FormBuilder,
    private advanceDataStored: AdvanceDataStored) {
    this.getAdmittedPatientList();
  }

  ngOnInit(): void {


    if (this.data) {

      this.registerObj = this.data.registerObj;
      this.DoctorId = this.data.registerObj.DoctorId;
   
    }

    this.isAlive = true;

    this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();

    this.hospitalFormGroup = this.createHospitalForm();
    this.hospitalFormGroup.markAllAsTouched();

    this.wardFormGroup = this.wardForm();
    this.wardFormGroup.markAllAsTouched();

    this.otherFormGroup = this.otherForm();
    this.otherFormGroup.markAllAsTouched()

    this.searchFormGroup = this.createSearchForm();

    this.getAdmittedDoctorCombo();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();

      });

    this.getAdmittedPatientList();
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
    this.getcityList1();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getWardList();
    this.getCompanyList();
    this.getSubTPACompList();


    if (this._ActRoute.url == '/ipd/admission') {

      this.menuActions.push('Edit Admission');
      this.menuActions.push('View Admission');
      this.menuActions.push('Update MLC Information');
      this.menuActions.push('Update TPA Company Information');
      this.menuActions.push('Print Patient Card');
      this.menuActions.push('Print Patient Sticker');
      this.menuActions.push('Prefix Demo');
      this.menuActions.push('Emergency');
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
          Validators.pattern("^[a-zA-Z._ -]+$"),
        ]],
      MiddleName:
        ['', [

          Validators.maxLength(50),
          Validators.pattern('^[a-zA-Z ]*$')
        ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
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
      AadharCardNo: [''],
      Pancardno: '',
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
      HospitalId: 0,
      PatientTypeID: 0,
      TariffId: 0,
      DoctorId: '',
      DoctorID:'',
      Departmentid: '',
      CompanyId:0,
      SubCompanyId:0,
      admittedDoctor1:0,
      admittedDoctor2:0,
      refDoctorId:0
    });
  }

  wardForm() {
    return this.formBuilder.group({
      RoomId: '',
      BedId: ['',[Validators.required]],
      ClassId:['',[Validators.required]],
    });
  }

  otherForm() {
    return this.formBuilder.group({
      RelativeName: '',
      RelativeAddress: '',
      RelatvieMobileNo: ['', [ Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      RelationshipId: '',
    });
  }
  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }],
      HospitalId:[0,[Validators.required]]
    });
  }


  getSearchList() {
    var m_data = {
      "Keyword": `${this.searchFormGroup.get('RegId').value}%`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }

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
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
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

  private _filterSearchdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      return this.optionsSearchDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }

  }


  private _filterdoc2(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsDoc2.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
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
      return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
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

  getSelectedObj(obj) {
    
    this.registerObj = new AdmissionPersonlModel({});
       obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
    this.setDropdownObjs();
  }

  setDropdownObjs() {
    debugger;
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
    this.onChangeCityList(this.registerObj);

    this.personalFormGroup.updateValueAndValidity();
  }

  getOptionTextPrefix(option) {
    return option && option.PrefixName ? option.PrefixName : '';
  }

  getOptionTextCity(option) {
    return option.CityName;
  }

  getOptionTextDep(option) {
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextRefDoc(option) {
    return option && option.DoctorName ? option.DoctorName : '';
  }

  
  getOptionTextDoc(option) {
    return option && option.Doctorname ? option.Doctorname : '';
  }


  getOptionTextWard(option) {
    return option && option.RoomName ? option.RoomName : '';
  }

  getOptionTextDoc2(option) {
    return option && option.DoctorName ? option.DoctorName : '';
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

  // getOPIPPatientList() {
  //   let data;
  //   if ((this._AdmissionService.myFilterform.get('RegNo').value != "") || (this._AdmissionService.myFilterform.get('FirstName').value !== "") || (this._AdmissionService.myFilterform.get('LastName').value != "")) {
  //     this.sIsLoading = 'loading-data';
  //     var m_data = {
  //       "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || '%',
  //       "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || '%',
  //       "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || 0,
  //       "From_Dt": '01/01/1900',// this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  //       "To_Dt": '01/01/1900',// this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
  //       "MobileNo": '%'
  //     }
  //     data = m_data;
  //   }
  //   else {
  //     var m_data1 = {
  //       "F_Name": '1',//this._opappointmentService.myFilterform.get("FirstName").value + '%' || '%',
  //       "L_Name": '2',//this._opappointmentService.myFilterform.get("LastName").value + '%' || '%',
  //       "Reg_No": 0, //this._opappointmentService.myFilterform.get("RegNo").value || 0,
  //       "From_Dt": '01/01/1900',
  //       "To_Dt": '01/01/1900',
  //       "MobileNo": '%'
  //     }
  //     data = m_data1;
  //   }
  //   setTimeout(() => {
  //     this.sIsLoading = 'loading-data';
  //     this._AdmissionService.getOPPatient(data).subscribe(Visit => {
  //     this.dataSource1.data = Visit as OPIPPatientModel[];
  //     this.dataSource.sort = this.sort;
  //     this.dataSource.paginator = this.paginator;
  //      this.sIsLoading = ' ';
  //     },
  //       error => {
  //         this.sIsLoading = '';
  //       });
  //   }, 50);

  // }

  onChangeReg(event) {
    if (event.value == 'registration') {
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

      this.getHospitalList();
      this.getPrefixList();
      this.getPatientTypeList();
      this.getTariffList();

      this.getcityList1();
      this.Regdisplay = false;
      this.showtable = false;

    } else {
      this.Regdisplay = true;

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
   
      this.getHospitalList();
      this.getPatientTypeList();
      this.getTariffList();
      this.getPrefixList();

      this.getDepartmentList();
      this.getcityList1();
      this.getWardList();
      this.AreaList();
      this.getMaritalStatusList();
      this.ReligionList();
      
      // this.getRegistrationList();

      this.showtable = true;
    }

   
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
      this.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
    });
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
      console.log(data)
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
      this.optionsRefDoc = this.Doctor1List.slice();
      this.filteredOptionsRefDoc = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
      );
    });
  }



  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.optionsDoc2 = this.Doctor2List.slice();
      this.filteredOptionsDoc2 = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.Doctor2List.slice()),
      );

    });
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

  getPatientTypeList() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
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
    this.isDepartmentSelected = true;
    this._AdmissionService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
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
    debugger
    this._AdmissionService.getBedCombo(wardObj.RoomId).subscribe(data => {
      this.BedList = data;
      this.optionsBed = this.BedList.slice();
      this.filteredOptionsBed = this.wardFormGroup.get('BedId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterBed(value) : this.BedList.slice()),
      );
    });
      this._AdmissionService.getBedClassCombo(wardObj.RoomId).subscribe(data => {
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
    if (value.PatientTypeId == 2) {
      this.hospitalFormGroup.get('CompanyId').clearValidators();
      this.hospitalFormGroup.get('SubCompanyId').clearValidators();
      this.hospitalFormGroup.get('CompanyId').updateValueAndValidity();
      this.hospitalFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this.hospitalFormGroup.get('CompanyId').setValidators([Validators.required]);
       this.isCompanySelected = false;
    }
  }

  onClose() {
    this._AdmissionService.mySaveForm.reset();
    this.dialogRef.close();
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
      this.submitAdmissionForm();
      return;
    }
    this.admissionFormStepper.next();
  }


  submitAdmissionForm() {
    
    if (this.searchFormGroup.get('regRadio').value == "registration") {
      //Api
      this.isLoading = 'submit';
      let submissionObj = {};
      let regInsert = {};
      let admissionNewInsert = {};
      regInsert['RegId'] = 0;
      regInsert['regDate'] = this.dateTimeObj.date; //this.registerObj.RegDate;
      regInsert['regTime'] = this.dateTimeObj.time;
      regInsert['prefixId'] = this.personalFormGroup.get('PrefixID').value.PrefixID;
      regInsert['firstName'] = this.registerObj.FirstName || '';
      regInsert['middleName'] = this.registerObj.MiddleName || '';
      regInsert['lastName'] = this.registerObj.LastName || '';
      regInsert['address'] = this.registerObj.Address || '';
      regInsert['city'] = this.personalFormGroup.get('CityId').value.CityName;
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
      regInsert['isCharity'] = false;
      regInsert['religionId'] = this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
      regInsert['areaId'] = this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0;
      regInsert['IsSeniorCitizen'] = 1;//this.personalFormGroup.get('IsSeniorCitizen').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0;
      // regInsert['aadharCardNo'] = this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0;
      // regInsert['panCardNo'] = this.personalFormGroup.get('Pancardno').value ? this.personalFormGroup.get('Pancardno').value : 0;

      submissionObj['regInsert'] = regInsert;

      admissionNewInsert['admissionID'] = 0;
      admissionNewInsert['regId'] = 0; //this.registerObj.RegId;
      admissionNewInsert['admissionDate'] = this.dateTimeObj.date;
      admissionNewInsert['admissionTime'] = this.dateTimeObj.time;

      admissionNewInsert['patientTypeId'] = this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId || 0;//tTypeId ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      admissionNewInsert['hospitalID'] = this.searchFormGroup.get('HospitalId').value.HospitalId || 0;  //? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 0;
      admissionNewInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionNewInsert['refDocNameId'] = this.hospitalFormGroup.get('refDoctorId').value.DoctorID || 0 ;//? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      admissionNewInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
      admissionNewInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
      admissionNewInsert['dischargeDate'] = '01/01/1900';
      admissionNewInsert['dischargeTime'] = '01/01/1900';

      admissionNewInsert['isDischarged'] = 0;
      admissionNewInsert['isBillGenerated'] = 0;
      admissionNewInsert['CompanyId'] = this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
      admissionNewInsert['tariffId'] = this.hospitalFormGroup.get('TariffId').value.TariffId ? this.hospitalFormGroup.get('TariffId').value.TariffId : 0;

      admissionNewInsert['classId'] = this.wardFormGroup.get('ClassId').value.ClassId ? this.wardFormGroup.get('ClassId').value.ClassId : 0;
      admissionNewInsert['departmentId'] = this.hospitalFormGroup.get('Departmentid').value.Departmentid;// ? this.hospitalFormGroup.get('DepartmentId').value.DepartmentId : 0;
      admissionNewInsert['relativeName'] = this.otherFormGroup.get('RelativeName').value ? this.otherFormGroup.get('RelativeName').value : '';
      admissionNewInsert['relativeAddress'] = this.otherFormGroup.get('RelativeAddress').value ? this.otherFormGroup.get('RelativeAddress').value : '';

      admissionNewInsert['phoneNo'] = this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
      admissionNewInsert['mobileNo'] = this.otherFormGroup.get('RelatvieMobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
      admissionNewInsert['relationshipId'] = this.otherFormGroup.get('RelationshipId').value.RelationshipId ? this.otherFormGroup.get('RelationshipId').value.RelationshipId : 0;
      admissionNewInsert['addedBy'] = this.accountService.currentUserValue.user.id;

      admissionNewInsert['isMLC'] = false;
      admissionNewInsert['motherName'] = '';
      admissionNewInsert['admittedDoctor1'] = this.hospitalFormGroup.get('admittedDoctor1').value.DoctorID ? this.hospitalFormGroup.get('admittedDoctor1').value.DoctorID : 0;
      admissionNewInsert['admittedDoctor2'] = this.hospitalFormGroup.get('admittedDoctor2').value.DoctorID ? this.hospitalFormGroup.get('admittedDoctor2').value.DoctorID : 0;
      admissionNewInsert['RefByTypeId'] = 0;
      admissionNewInsert['RefByName'] = 0;
      admissionNewInsert['SubTpaComId'] = this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId ? this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId : 0;
      admissionNewInsert['PolicyNo'] = 0;
      admissionNewInsert['AprovAmount'] = 0;
      admissionNewInsert['CompDOD'] = this.dateTimeObj.date;
      admissionNewInsert['IsPackagePatient'] = 0;

      submissionObj['admissionNewInsert'] = admissionNewInsert;


      let query = "Update BedMaster set IsAvailible=0 where BedId=" + this.wardFormGroup.get('BedId').value.BedId;
      
         this._AdmissionService.AdmissionInsert(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Admission save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              let m = response;
              this.getPrint(m);
              this._matDialog.closeAll();

            }
          });
        } else {
          Swal.fire('Error !', 'Admission not saved', 'error');
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
      admissionInsert['admissionDate'] = this.dateTimeObj.date;
      admissionInsert['admissionTime'] = this.dateTimeObj.time;

      admissionInsert['patientTypeId'] = this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeId : 0;
      admissionInsert['hospitalID'] = this.searchFormGroup.get('HospitalId').value.HospitalId || 0;  //? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 0;
      admissionInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId ? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionInsert['refDocNameId'] = this.hospitalFormGroup.get('refDoctorId').value.DoctorID ? this.hospitalFormGroup.get('refDoctorId').value.DoctorID : 0;

      admissionInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
      admissionInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
      admissionInsert['dischargeDate'] = '01/01/1900';
      admissionInsert['dischargeTime'] = '01/01/1900';

      admissionInsert['isDischarged'] = 0;
      admissionInsert['isBillGenerated'] = 0;
      admissionInsert['CompanyId'] = this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
      admissionInsert['tariffId'] = this.hospitalFormGroup.get('TariffId').value.TariffId ? this.hospitalFormGroup.get('TariffId').value.TariffId : 0;

      admissionInsert['classId'] = this.wardFormGroup.get('ClassId').value.ClassId ? this.wardFormGroup.get('ClassId').value.ClassId : 0;
      admissionInsert['departmentId'] = this.hospitalFormGroup.get('Departmentid').value.Departmentid ? this.hospitalFormGroup.get('Departmentid').value.Departmentid : 0;
      admissionInsert['relativeName'] = this.otherFormGroup.get('RelativeName').value ? this.otherFormGroup.get('RelativeName').value : '';
      admissionInsert['relativeAddress'] = this.otherFormGroup.get('RelativeAddress').value ? this.otherFormGroup.get('RelativeAddress').value : '';

      admissionInsert['phoneNo'] = this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
      admissionInsert['mobileNo'] = this.otherFormGroup.get('RelatvieMobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
      admissionInsert['relationshipId'] = this.otherFormGroup.get('RelationshipId').value.RelationshipId ? this.otherFormGroup.get('RelationshipId').value.RelationshipId : 0;
      admissionInsert['addedBy'] = this.accountService.currentUserValue.user.id;

      admissionInsert['isMLC'] = false;
      admissionInsert['motherName'] = '';
      admissionInsert['admittedDoctor1'] = this.hospitalFormGroup.get('admittedDoctor1').value.DoctorIdOne ? this.hospitalFormGroup.get('admittedDoctor1').value.DoctorId : 0;
      admissionInsert['admittedDoctor2'] = this.hospitalFormGroup.get('admittedDoctor2').value.DoctorIdTwo ? this.hospitalFormGroup.get('admittedDoctor2').value.DoctorId : 0;

      admissionInsert['RefByTypeId'] = 0;
      admissionInsert['RefByName'] = 0;
      admissionInsert['SubTpaComId'] = 0;
      admissionInsert['PolicyNo'] = 0; //this.hospitalFormGroup.get('PolicyNo').value.DoctorIdOne ? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorId : 0;
      admissionInsert['AprovAmount'] = 0; //this.hospitalFormGroup.get('DoctorIdTwo').value.DoctorIdTwo ? this.hospitalFormGroup.get('DoctorIdTwo').value.DoctorId : 0;

      admissionInsert['CompDOD'] = this.dateTimeObj.date;
      admissionInsert['IsPackagePatient'] = 0;


      submissionObj['admissionInsert'] = admissionInsert;
      submissionObj['bedUpdate'] = { bedId: this.bedObj.BedId ? this.bedObj.BedId : 0 };
      console.log(submissionObj);
      this._AdmissionService.RegisteredAdmissionInsert(submissionObj).subscribe(response => {
        console.log(submissionObj);
        if (response) {
            Swal.fire('Congratulations !', 'Admission Of Registered Patient Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();

            }
          });
        } else {
          Swal.fire('Error !', 'Admission not saved', 'error');
        }
        this.isLoading = '';
      });

    }

  }


  onEdit(row) {
    console.log(row);
    this.registerObj = row;
    this.getSelectedObj(row);
  }

  getAdmittedDoctorCombo() {
    debugger;
    this._AdmissionService.getAdmittedDoctorCombo().subscribe(data => {
      this.doctorNameCmbList = data;
      console.log(data);
      this.filtereddoctor.next(this.doctorNameCmbList.slice());
    });
  }


  ngOnChanges(changes: SimpleChanges) {

    this.dataSource.data = changes.dataArray.currentValue as Admission[];
    // this.isLoading = false;
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  onDoctorOneChange(value) {
    console.log(this.hospitalFormGroup.get('DoctorIdOne').value);
  }

  backClicked() {
    this.admissionFormStepper.previous();
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  getAdmittedPatientList() {
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || "%",
      "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || "%",
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || "0",
      "Doctor_Id": this._AdmissionService.myFilterform.get("searchDoctorId").value.DoctorId || "0",
      "From_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "MM-dd-yyyy") || "01/01/1900",
      "To_Dt": this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value, "MM-dd-yyyy") || "01/01/1900",
      "Admtd_Dschrgd_All": "0",
      "M_Name": this._AdmissionService.myFilterform.get("MiddleName").value + '%' || "%",
      "IPNo": this._AdmissionService.myFilterform.get("IPDNo").value + '%' || "%",
    }
  
    setTimeout(() => {
      this.sIsLoading = 'loading-data';
      this._AdmissionService.getAdmittedPatientList(D_data).subscribe(data => {
        this.dataSource.data = data as Admission[];
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        // let x = {};
        // this.sentCountsToParent.emit(x);
        this.sIsLoading = '';
      },
        error => {
          this.sIsLoading = '';
        });
    }, 200);


  }
  // AdmissionNewComponent
  addNewAdmission() {
    const dialogRef = this._matDialog.open(RegAdmissionComponent,
      {
        maxWidth: "90vw",
        height: '850px',
        width: '100%',

      });
    dialogRef.afterClosed().subscribe(result => {
      
      this.getAdmittedPatientList();
    });
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

  getRecord(contact, m): void {
    console.log(contact);

    debugger
    if (m == "Edit Admission") {
      let Regdata;
      this._AdmissionService.getRegdata(contact.RegID).subscribe(data => {
        Regdata = data as RegInsert[];
        console.log(Regdata);

      },
        error => {
          this.sIsLoading = '';
        });

      const dialogRef = this._matDialog.open(NewAdmissionComponent,
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
    if (m == "View Admission") {
      this.getViewbAdmission(contact);
    }
    else if (m == "Update MLC Information") {
      let xx = {

        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        HospitalAddress: contact.HospitalAddress,
        BDate: contact.BDate,
        BalanceAmt: contact.BalanceAmt,
        TotalAmt: contact.TotalAmt,
        BillDate: contact.BillDate,
        BillNo: contact.BillNo,
        ConcessionAmt: contact.ConcessionAmt,
        HospitalName: contact.HospitalName,
        NetPayableAmt: contact.NetPayableAmt,
        OPD_IPD_ID: contact.OPD_IPD_ID,
        OPD_IPD_Type: contact.OPD_IPD_Type,
        PBillNo: contact.PBillNo,
        PaidAmount: contact.PaidAmount,
        VisitDate: contact.VisitDate,
        TotalBillAmount: contact.TotalBillAmount,
        TransactionType: contact.TransactionType,
        ConsultantDocName: contact.ConsultantDocName,
        DepartmentName: contact.DepartmentName,
        AddedByName: contact.AddedByName,
        NetAmount: contact.NetAmount,
        ServiceName: contact.ServiceName,
        Price: contact.Price,
        Qty: contact.Qty,
        IsMLC: contact.IsMLC

      };
      console.log(xx);

      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      this._AdmissionService.populateForm(xx);
      const dialogRef = this._matDialog.open(MLCInformationComponent,
        {
          maxWidth: '85vw',

          height: '400px', width: '100%',
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
    else if (m == "Update TPA Company Information") {

      let xx = {

        RegNo: contact.RegId,
        AdmissionID: contact.AdmissionID,
        PatientName: contact.PatientName,
        Doctorname: contact.Doctorname,
        AdmDateTime: contact.AdmDateTime,
        AgeYear: contact.AgeYear,
        ClassId: contact.ClassId,
        TariffName: contact.TariffName,
        TariffId: contact.TariffId,
        HospitalAddress: contact.HospitalAddress,
        BDate: contact.BDate,
        BalanceAmt: contact.BalanceAmt,
        TotalAmt: contact.TotalAmt,
        BillDate: contact.BillDate,
        BillNo: contact.BillNo,
        ConcessionAmt: contact.ConcessionAmt,
        HospitalName: contact.HospitalName,
        NetPayableAmt: contact.NetPayableAmt,
        OPD_IPD_ID: contact.OPD_IPD_ID,
        OPD_IPD_Type: contact.OPD_IPD_Type,
        PBillNo: contact.PBillNo,
        PaidAmount: contact.PaidAmount,
        VisitDate: contact.VisitDate,
        TotalBillAmount: contact.TotalBillAmount,
        TransactionType: contact.TransactionType,
        ConsultantDocName: contact.ConsultantDocName,
        DepartmentName: contact.DepartmentName,
        AddedByName: contact.AddedByName,
        NetAmount: contact.NetAmount,
        ServiceName: contact.ServiceName,
        Price: contact.Price,
        Qty: contact.Qty,
        IsMLC: contact.IsMLC,
        SubCompanyId: contact.SubTpaComId

      };
      console.log(xx);

      this.advanceDataStored.storage = new AdvanceDetailObj(xx);
      this._AdmissionService.populateForm(xx);
      const dialogRef = this._matDialog.open(SubCompanyTPAInfoComponent,
        {
          maxWidth: '85vw',

          height: '600px', width: '100%',
        });

      dialogRef.afterClosed().subscribe(result => {
        console.log('The dialog was closed - Insert Action', result);
      });
    }
   
  }

  getViewbAdmission(contact) {
    console.log(contact);
    let xx = {

      RegNo: contact.RegId,
      AdmissionID: contact.AdmissionID,
      PatientName: contact.PatientName,
      Doctorname: contact.Doctorname,
      AdmDateTime: contact.AdmDateTime,
      AgeYear: contact.AgeYear,
      ClassId: contact.ClassId,
      TariffName: contact.TariffName,
      TariffId: contact.TariffId,
      HospitalAddress: contact.HospitalAddress,
      BDate: contact.BDate,
      BalanceAmt: contact.BalanceAmt,
      TotalAmt: contact.TotalAmt,
      BillDate: contact.BillDate,
      BillNo: contact.BillNo,
      ConcessionAmt: contact.ConcessionAmt,
      HospitalName: contact.HospitalName,
      NetPayableAmt: contact.NetPayableAmt,
      OPD_IPD_ID: contact.OPD_IPD_ID,
      OPD_IPD_Type: contact.OPD_IPD_Type,
      PBillNo: contact.PBillNo,
      PaidAmount: contact.PaidAmount,
      VisitDate: contact.VisitDate,
      TotalBillAmount: contact.TotalBillAmount,
      TransactionType: contact.TransactionType,
      ConsultantDocName: contact.ConsultantDocName,
      DepartmentName: contact.DepartmentName,
      AddedByName: contact.AddedByName,
      NetAmount: contact.NetAmount,
      ServiceName: contact.ServiceName,
      Price: contact.Price,
      Qty: contact.Qty,



    };
    this.advanceDataStored.storage = new AdmissionPersonlModel(xx);
    const dialogRef = this._matDialog.open(AdmissionViewComponent,
      {
        maxWidth: "90vw",
        maxHeight: "100vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=32';//13
    this._AdmissionService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;

      let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'EmailId', 'FirstName', 'MiddleName', 'LastName', 'AdmissionId', 'RegNo', 'PatientName', 'Age', 'AgeDay', 'AgeMonth', 'GenderName', 'MaritalStatusName', 'Address', 'MobileNo', 'IsMLC', 'PhoneNo', 'AdmissionTime', 'IPDNo', 'CompanyName', 'DepartmentName', 'AdmittedDoctorName', 'AdmittedDoctor1', 'RoomName', 'BedName', 'AdmittedDoctor2',
        'AdmittedDoctorName', 'RelationshipName', 'RefDoctorName', 'RelativePhoneNo', 'IsReimbursement', 'TariffName', 'RelativeName', 'Aadharcardno', 'RelativeAddress']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      /// this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));
      //  this.printTemplate = this.printTemplate.replace('StrAdvanceAmount','₹' + (this.reportPrintObj.AdvanceAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.reportPrintObj.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(this.reportPrintObj.AdmissionTime));

      this.printTemplate = this.printTemplate.replace(/{{.*}}/g, '');

      setTimeout(() => {
        this.print();
      }, 1000);
    });

  }

  transform1(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    return value;
  }

  transform2(value: string) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform((new Date), 'dd/MM/yyyy h:mm a');
    return value;
  }

  getPrint(el) {
    console.log(el);
    debugger;
    var D_data = {
      "AdmissionId": el.AdmissionID
    }
    
    let printContents; 
    this.subscriptionArr.push(
      this._AdmissionService.getAdmissionPrint(D_data).subscribe(res => {
        this.reportPrintObj = res[0] as Admission;
        this.getTemplate();
        console.log(this.reportPrintObj);

      })
    );
  }

  // PRINT 
  print() {
   
    let popupWin, printContents;
  
    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    
    popupWin.document.write(` <html>
    <head><style type="text/css">`);
    popupWin.document.write(`
      </style>
          <title></title>
      </head>
    `);
    popupWin.document.write(`<body onload="window.print();window.close()">${this.printTemplate}</body>
    </html>`);
    popupWin.document.close();
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
  DOA: Date;
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
  RelativePhoneNo: number;
  MaritalStatusName: string;
  IsMLC: any;
  CompanyName: any;
  RelationshipName: string;
  RefDoctorName: string;
  AdmittedDoctor2: any;
  AdmittedDoctor1: any;
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
  RefDocName: any;
  /**
* Constructor
*
* @param AdmissionPersonl
*/
  constructor(AdmissionPersonl) {
    {
      this.Departmentid = AdmissionPersonl.Departmentid || '';
      this.AadharCardNo = AdmissionPersonl.AadharCardNo || '';
      this.Address = AdmissionPersonl.Address || '';
      this.Age = AdmissionPersonl.Age || '';
      this.AgeDay = AdmissionPersonl.AgeDay || 0;
      this.AgeMonth = AdmissionPersonl.AgeMonth || 0;
      this.AgeYear = AdmissionPersonl.AgeYear || 0;
      this.AreaId = AdmissionPersonl.AreaId || '';
      this.CityName = AdmissionPersonl.CityName || '';
      this.CityId = AdmissionPersonl.CityId || '';
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
      this.AdmittedDoctor1ID = AdmissionPersonl.AdmittedDoctor1ID || '';
      this.AdmittedDoctor2ID = AdmissionPersonl.AdmittedDoctor2ID || '';
      this.RelationshipId = AdmissionPersonl.RelationshipId || '';
      this.AdmissionID = AdmissionPersonl.AdmissionID || '';
      this.AdmissionDate = AdmissionPersonl.AdmissionDate || '';
      this.AdmissionTime = AdmissionPersonl.AdmissionTime || '';
      this.DoctorId = AdmissionPersonl.DoctorId || '';
      this.RelativePhoneNo = AdmissionPersonl.RelativePhoneNo || 0;
      this.MaritalStatusName = AdmissionPersonl.MaritalStatusName || '';
      this.IsMLC = AdmissionPersonl.IsMLC || '';
      this.CompanyName = AdmissionPersonl.CompanyName || '';
      this.RelationshipName = AdmissionPersonl.RelationshipName || '';
      this.RefDoctorName = AdmissionPersonl.RefDoctorName || '';
      this.AdmittedDoctor2 = AdmissionPersonl.AdmittedDoctor2 || '';
      this.AdmittedDoctor1 = AdmissionPersonl.AdmittedDoctor1 || '';
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
      //  this.AgeYear = AdvanceDetailObj.AgeYear || '';
      //  this.ClassId = AdvanceDetailObj.ClassId || '';
      //  this.ClassName = AdvanceDetailObj.ClassName || '';
      //  this.TariffName = AdvanceDetailObj.TariffName || '';
      //  this.TariffId = AdvanceDetailObj.TariffId || '';
      //  this.IsDischarged =AdvanceDetailObj.IsDischarged || 0 ;
      //  this.opD_IPD_Type = AdvanceDetailObj.opD_IPD_Type | 0;
    }
  }
}