import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDetailObj } from '../../ip-search-list/ip-search-list.component';
import { Admission, AdmissionPersonlModel, Bed } from '../admission/admission.component';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AdmissionService } from '../admission/admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { OPIPPatientModel } from '../../ipdsearc-patienth/ipdsearc-patienth.component';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-reg-admission',
  templateUrl: './reg-admission.component.html',
  styleUrls: ['./reg-admission.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class RegAdmissionComponent implements OnInit {

 
  isAlive = false;
  savedValue: number = null;
  isLoadings = false;
  isOpen = false;
  loadID = 0;

  reportPrintObj: Admission;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;

  isRegIdSelected: boolean = false;
  isWardSelected:boolean= false;
  isPrefixSelected: boolean = false;
  isCitySelected: boolean = false;
  isCompanySelected: boolean = false;
  isSubCompanySelected: boolean = false;
  isDepartmentSelected: boolean = false;
  isRefDoctorSelected: boolean = false;
  isRefDoctor2Selected:boolean =false;
  isDoctorSelected: boolean = false;
  isAreaSelected: boolean = false;
  isReligionSelected:boolean = false;
  isMaritalSelected:boolean = false;
  isRelationshipSelected:boolean = false;

  selectedAdvanceObj: AdvanceDetailObj;
  sIsLoading: string = '';
  submitted = false;
  msg: any = [];
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
  searchFormGroup: FormGroup;
  registration: any;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
DoctorId:any=0;

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

  filteredOptions: any;
  showtable:boolean=false;
  noOptionFound: boolean = false;
  Regdisplay:boolean = false;
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

  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';

  displayedColumns: string[] = [
    'RegNo',
    'PatientName',
    'AgeYear',
    'GenderName',
    'PhoneNo',
    'MobileNo'
    ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  dataSource = new MatTableDataSource<OPIPPatientModel>();
  
  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;

  
  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

 
  private _onDestroy = new Subject<void>();

  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<RegAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    
    if (this.data) {

      this.registerObj = this.data.registerObj;
      this.DoctorId=this.data.registerObj.DoctorId;
      // console.log(this.registerObj);

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

    this.getHospitalList();
    this.getPrefixList();
    this.getPatientTypeList();
    this.getTariffList();
    this.getAreaList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getDepartmentList();
    this.getCompanyList();
    this.getSubTPACompList();
    // this.getConfigCityList();
    this.getRelationshipList();
    this.getcityList1();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getWardList();

    

     
  }


 
  getOptionsText(option) {
        if (!option)
      return '';
    return option.ServiceName + ' ' + option.Price + ' (' + option.TariffId + ')';


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
      RegId:''
    });
  }

  createHospitalForm() {
    return this.formBuilder.group({
      HospitalID: '',
      HospitalId: '',
      PatientTypeID: '',
      PatientTypeId: '',
      TariffId: '',
      CompanyId: '',
      SubCompanyId: '',
      DoctorId: '',
      DepartmentId: '',
      Departmentid: '',
      DoctorID: '',
      DoctorIdOne: '',
      DoctorIdTwo: ''
    });
  }

  wardForm() {
    return this.formBuilder.group({
      RoomId: '',
      BedId: '',
      ClassId: '',
    });
  }

  otherForm() {
    return this.formBuilder.group({
      RelativeName: '',
      RelativeAddress: '',
      RelatvieMobileNo: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      RelationshipId: '',
    });
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      regRadio1: ['registration1'],
      RegId:['']
    });
  }
  
  getSearchList() {
    debugger

    var m_data={
      "Keyword":`${this.searchFormGroup.get('RegId').value}%`
    }
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._AdmissionService.getRegistrationList(m_data).subscribe(resData => {
        // debugger;

        this.filteredOptions = resData;
        console.log(resData);
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }

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
    // const filterValue = value.toLowerCase();
    // this.isDoctorSelected = false;
    // return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  }


  private _filterRefdoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.DoctorName ? value.DoctorName.toLowerCase() : value.toLowerCase();
      return this.optionsRefDoc.filter(option => option.DoctorName.toLowerCase().includes(filterValue));
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

    
  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
       return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }

  private _filterSubCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
      return this.optionsSubCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }
  
  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }
  getSelectedObj(obj) {
    // console.log('obj==', obj);
    this.registerObj = new AdmissionPersonlModel({});
    // let a, b, c;

    // a = obj.AgeDay.trim();
    // b = obj.AgeMonth.trim();
    // c = obj.AgeYear.trim();
    // console.log(a, b, c);
    obj.AgeDay = obj.AgeDay.trim();
    obj.AgeMonth = obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();
    this.registerObj = obj;
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
    this.onChangeCityList(this.registerObj.CityId);

    this.personalFormGroup.updateValueAndValidity();
  }


  getOptionTextPrefix(option){
    
    return option && option.PrefixName ? option.PrefixName : '';
  }

  getOptionTextCity(option) {
    
    return option && option.CityName ? option.CityName : '';
  }

  getOptionTextCompany(option) {
    
    return option && option.CompanyName ? option.CompanyName : '';
  }


  getOptionTextDep(option) {
    
    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextRefDoc(option){
    return option && option.DoctorName ? option.DoctorName : '';
    
  }

  getOptionTextDoc(option) {
    return option.Doctorname;
  }

  getOptionTextWard(option) {
    
    return option && option.RoomName ? option.RoomName : '';
  }

  getOptionTextDoc2(option){
    return option && option.DoctorName ? option.DoctorName : '';
  }

  getOptionTextArea(option){
    return option && option.AreaName ? option.AreaName : '';
    
  }

  getOptionTextReligion(option){
    return option && option.ReligionName ? option.ReligionName : '';
  }

  getOptionTextMarital(option){
    return option && option.MaritalStatusName ? option.MaritalStatusName : '';
    
  }

  getOptionTextSubCompany(option){
    return option && option.CompanyName ? option.CompanyName : '';
    
  }

  getOptionTextBed(option){

    return option && option.BedName ? option.BedName : '';
  }
  getOptionTextRelationship(option){

    return option && option.RelationshipName ? option.RelationshipName : '';
  }

  getOPIPPatientList() {

    let data ;
    if((this._AdmissionService.myFilterform.get('RegNo').value !="") || (this._AdmissionService.myFilterform.get('FirstName').value !=="") || (this._AdmissionService.myFilterform.get('LastName').value !="") ){
    this.sIsLoading = 'loading-data';
    var m_data = {
      "F_Name": this._AdmissionService.myFilterform.get("FirstName").value + '%' || '%',
      "L_Name": this._AdmissionService.myFilterform.get("LastName").value + '%' || '%',
      "Reg_No": this._AdmissionService.myFilterform.get("RegNo").value || 0,
      "From_Dt":'01/01/1900',// this.datePipe.transform(this._AdmissionService.myFilterform.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt":'01/01/1900',// this.datePipe.transform(this._AdmissionService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "MobileNo": '%'
    }
    data=m_data;
     }
  else{
    var m_data1 = {
      "F_Name": '1',//this._opappointmentService.myFilterform.get("FirstName").value + '%' || '%',
      "L_Name": '2',//this._opappointmentService.myFilterform.get("LastName").value + '%' || '%',
      "Reg_No": 0, //this._opappointmentService.myFilterform.get("RegNo").value || 0,
      "From_Dt":'01/01/1900',
      "To_Dt": '01/01/1900',
      "MobileNo": '%'
    }
    data=m_data1;
   
  }
  console.log(data);
  
  setTimeout(() => {
    this.sIsLoading = 'loading-data';
    this._AdmissionService.getOPPatient(data).subscribe(Visit => {
      this.dataSource.data = Visit as OPIPPatientModel[];
      console.log(this.dataSource.data);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
      this.sIsLoading = ' ';
    },
      error => {
        this.sIsLoading = '';
      });
  }, 50);
       
  }

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
    this.Regdisplay=false;
    this.showtable=false;

    } else {
      this.Regdisplay=true;

      this.personalFormGroup.get('RegId').enable();
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
      this.getPrefixList();
      this.getDepartmentList();
      this.getcityList1();
      this.getWardList();
      this.AreaList();
      this.getMaritalStatusList();
      this.ReligionList();
      this.getCompanyList();
      this.getSubTPACompList();
      this.getRegistrationList();
      this.getPatientTypeList();
      this.getTariffList();
      this.showtable=true;
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
      this.hospitalFormGroup.get('HospitalId').setValue(this.HospitalList[0]);
    });
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
      this.filteredOptionsSubCompany= this.hospitalFormGroup.get('SubCompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSubCompany(value) : this.SubTPACompList.slice()),
              
      );
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
      // this.filteredDepartment.next(this.DepartmentList.slice());
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
      // this.filteredDepartment.next(this.DepartmentList.slice());
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


  getDoctorList() {
    this._AdmissionService.getDoctorMaster().subscribe(
      data => {
        this.DoctorList = data;
        
        data => {
          this.DoctorList = data;
        this.filteredDoctor.next(this.DoctorList.slice());
        }
      })
  }

  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.optionsRefDoc = this.Doctor1List.slice();
      this.filteredOptionsRefDoc = this.hospitalFormGroup.get('DoctorID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.Doctor1List.slice()),
      );
          });
  }



  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.optionsDoc2 = this.Doctor2List.slice();
      this.filteredOptionsDoc2 = this.hospitalFormGroup.get('DoctorIdTwo').valueChanges.pipe(
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

 getRegistrationList() {
    
    var m_data = {

      "F_Name": 'p%',
      "L_Name": '%',
      "Reg_No": '0',

    }
    console.log(m_data);
    this._AdmissionService.getRegistrationList(m_data).subscribe(Visit => {

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

    debugger
    if (CityObj) {
      this._AdmissionService.getStateList(CityObj.CityId).subscribe((data: any) => {
           this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
     
        this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
        this.selectedStateID = this.stateList[0].StateId;
        this.onChangeCountryList(this.selectedStateID);
        
      });
    
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
 
    this.showtable=true;
    // this.getOPIPPatientList()
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
    // ;
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

  takePicture() {
    // debugger;
    // const dialogRef = this._matDialog.open(CameraComponent, {
    //   width: '600px',
    //   height: '400px',
    //   disableClose: true
    // });
    // dialogRef.afterClosed().subscribe(result => {
    //   //  console.log('The dialog was closed - Insert Action', result._imageAsDataUrl);
    //   this.capturedImage = result && result.imageAsBase64 ? 'data:image/jpeg;base64,' + result.imageAsBase64 : '';
    //   //  this.getRadiologytemplateMasterList();
    // });
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
      // this.VisitFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.isCompanySelected = false;
    }
  }

  onClose() {
    this._AdmissionService.mySaveForm.reset();
    this.dialogRef.close();
  }

  nextClicked(formGroupName) {
    // debugger;
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
    // debugger;
    if (this.searchFormGroup.get('regRadio').value == "registration") {
      //Api
      this.isLoading = 'submit';
      let submissionObj = {};
      let regInsert = {};
      let admissionNewInsert = {};
      regInsert['RegId'] = 0;
      regInsert['regDate'] = this.dateTimeObj.date //this.registerObj.RegDate;
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
      admissionNewInsert['hospitalID'] = this.hospitalFormGroup.get('HospitalId').value.HospitalId ? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 1;
      admissionNewInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId || 0;//? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionNewInsert['refDocNameId'] = this.hospitalFormGroup.get('DoctorID').value.DoctorID || 0;// ? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      admissionNewInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
      admissionNewInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
      admissionNewInsert['dischargeDate'] = '01/01/1900';
      admissionNewInsert['dischargeTime'] = '01/01/1900';

      admissionNewInsert['isDischarged'] = 0;
      admissionNewInsert['isBillGenerated'] = 0;
      admissionNewInsert['companyId'] = this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
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
      admissionNewInsert['admittedDoctor1'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId ? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionNewInsert['admittedDoctor2'] = this.hospitalFormGroup.get('DoctorID').value.DoctorID ? this.hospitalFormGroup.get('DoctorID').value.DoctorID : 0;
      admissionNewInsert['RefByTypeId'] = 0;
      admissionNewInsert['RefByName'] = 0;
      admissionNewInsert['SubTpaComId'] = this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId ? this.hospitalFormGroup.get('SubCompanyId').value.SubCompanyId : 0;
      admissionNewInsert['PolicyNo'] = 0;
      admissionNewInsert['AprovAmount'] = 0;
      admissionNewInsert['CompDOD'] = this.dateTimeObj.date;
      admissionNewInsert['IsPackagePatient'] = 0;



      submissionObj['admissionNewInsert'] = admissionNewInsert;

      // let Query="Update M_DischargeTypeMaster set IsDeleted=1 where DischargeTypeId="+DischargeTypeId;

      let query = "Update BedMaster set IsAvailible=0 where BedId=" + this.wardFormGroup.get('BedId').value.BedId;
      console.log(submissionObj);

      // this._AdmissionService.deactivateTheStatus(Query).subscribe(data => this.msg =data);


      // submissionObj['bedUpdate'] = { bedId: this.bedObj.BedId ? this.bedObj.BedId : 0 };
      // console.log(submissionObj);
      this._AdmissionService.AdmissionInsert(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Admission save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              let m = response;
              this.getPrint(m);
              // console.log( this.getPrint(m));
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

      //      submissionObj['regUpdate'] = RegistraionUpdate;
      // debugger;
      admissionInsert['admissionID'] = 0;
      admissionInsert['regId'] = this.registerObj.RegId;
      admissionInsert['admissionDate'] = this.dateTimeObj.date;
      admissionInsert['admissionTime'] = this.dateTimeObj.time;

      admissionInsert['patientTypeId'] = this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      admissionInsert['hospitalID'] = this.hospitalFormGroup.get('HospitalID').value.HospitalID ? this.hospitalFormGroup.get('HospitalID').value.HospitalID : 0;
      admissionInsert['docNameId'] = this.hospitalFormGroup.get('DoctorId').value.DoctorId ? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionInsert['refDocNameId'] = this.hospitalFormGroup.get('DoctorID').value.DoctorID ? this.hospitalFormGroup.get('DoctorID').value.DoctorID : 0;

      admissionInsert['wardID'] = this.wardFormGroup.get('RoomId').value.RoomId ? this.wardFormGroup.get('RoomId').value.RoomId : 0;
      admissionInsert['bedid'] = this.wardFormGroup.get('BedId').value.BedId ? this.wardFormGroup.get('BedId').value.BedId : 0;
      admissionInsert['dischargeDate'] = '01/01/1900';
      admissionInsert['dischargeTime'] = '01/01/1900';

      admissionInsert['isDischarged'] = 0;
      admissionInsert['isBillGenerated'] = 0;
      admissionInsert['companyId'] = this.hospitalFormGroup.get('CompanyId').value.CompanyId ? this.hospitalFormGroup.get('CompanyId').value.CompanyId : 0;
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
      admissionInsert['admittedDoctor1'] = this.hospitalFormGroup.get('DoctorIdOne').value.DoctorIdOne ? this.hospitalFormGroup.get('DoctorIdOne').value.DoctorId : 0;
      admissionInsert['admittedDoctor2'] = this.hospitalFormGroup.get('DoctorIdTwo').value.DoctorIdTwo ? this.hospitalFormGroup.get('DoctorIdTwo').value.DoctorId : 0;

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
          // this.toastr.success('Congratulations !', 'Admission save Successfully !');
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
   




  getTemplate() {
    let query = 'select tempId,TempDesign,TempKeys as TempKeys from Tg_Htl_Tmp a where TempId=13';
    this._AdmissionService.getTemplate(query).subscribe((resData: any) => {
      this.printTemplate = resData[0].TempDesign;

      let keysArray = ['HospitalName', 'HospitalAddress', 'Phone', 'EmailId', 'FirstName', 'MiddleName', 'LastName',
        'AdmissionId', 'RegNo', 'PatientName', 'AgeDay', 'AgeMonth', 'Age', 'GenderName', 'MaritalStatusName', 'Address',
        'MobileNo', 'IsMLC', 'PhoneNo', 'AdmissionTime', 'IPDNo', 'CompanyName',
        'DepartmentName', 'AdmittedDoctorName', 'AdmittedDoctor1', 'BedName', 'AdmittedDoctor2',
        'RelationshipName', 'RefDoctorName', 'RelativePhoneNo', 'IsReimbursement', 'TariffName',
        'RelativeName', 'Aadharcardno', 'RelativeAddress']; // resData[0].TempKeys;
      for (let i = 0; i < keysArray.length; i++) {
        let reString = "{{" + keysArray[i] + "}}";
        let re = new RegExp(reString, "g");
        this.printTemplate = this.printTemplate.replace(re, this.reportPrintObj[keysArray[i]]);
      }
      /// this.printTemplate = this.printTemplate.replace('StrTotalPaidAmountInWords', this.convertToWord(this.reportPrintObj.AdvanceAmount));
      //  this.printTemplate = this.printTemplate.replace('StrAdvanceAmount','₹' + (this.reportPrintObj.AdvanceAmount.toFixed(2)));
      this.printTemplate = this.printTemplate.replace('StrPrintDate', this.transform2(this.reportPrintObj.AdmissionDate));
      this.printTemplate = this.printTemplate.replace('StrAdmissionDate', this.transform1(this.reportPrintObj.AdmissionDate));

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
      "AdmissionId": el,
      // "AdmissionId": 5,
    }
    // console.log(D_data);
    let printContents; //`<div style="padding:20px;height:550px"><div><div style="display:flex"><img src="http://localhost:4200/assets/images/logos/Airmid_NewLogo.jpeg" width="90"><div><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="color:#464343">6158, Siddheshwar peth, near zilla parishad, solapur-3 phone no.: (0217) 2323001 / 02</div><div style="color:#464343">www.yashodharahospital.org</div></div></div><div style="border:1px solid grey;border-radius:16px;text-align:center;padding:8px;margin-top:5px"><span style="font-weight:700">IP ADVANCE RECEIPT</span></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex;justify-content:space-between"><div style="display:flex"><div style="width:100px;font-weight:700">Advance No</div><div style="width:10px;font-weight:700">:</div><div>6817</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Reg. No</div><div style="width:10px;font-weight:700">:</div><div>117399</div></div><div style="display:flex"><div style="width:60px;font-weight:700">Date</div><div style="width:10px;font-weight:700">:</div><div>26/06/2019&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3:15:49PM</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex;width:477px"><div style="width:100px;font-weight:700">Patient Name</div><div style="width:10px;font-weight:700">:</div><div>Mrs. Suglabai Dhulappa Waghmare</div></div><div style="display:flex"><div style="width:60px;font-weight:700">IPD No</div><div style="width:10px;font-weight:700">:</div><div>IP/53757/2019</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:100px;font-weight:700">DOA</div><div style="width:10px;font-weight:700">:</div><div>30/10/2019</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:100px;font-weight:700">Patient Type</div><div style="width:10px;font-weight:700">:</div><div>Self</div></div></div></div><hr style="border-color:#a0a0a0"><div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Advacne Amount</div><div style="width:10px;font-weight:700">:</div><div>4,000.00</div></div></div><div style="display:flex;margin:8px 0"><div style="display:flex"><div style="width:150px;font-weight:700">Amount in Words</div><div style="width:10px;font-weight:700">:</div><div>FOUR THOUSANDS RUPPEE ONLY</div></div></div><div style="display:flex"><div style="display:flex"><div style="width:150px;font-weight:700">Reason of Advance</div><div style="width:10px;font-weight:700">:</div><div></div></div></div></div><div style="position:relative;top:100px;text-align:right"><div style="font-weight:700;font-size:16px">YASHODHARA SUPER SPECIALITY HOSPITAL PVT. LTD.</div><div style="font-weight:700;font-size:16px">Cashier</div><div>Paresh Manlor</div></div></div>`;
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
    // HospitalName, HospitalAddress, AdvanceNo, PatientName
    let popupWin, printContents;
    // printContents =this.printTemplate; // document.getElementById('print-section').innerHTML;

    popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
    // popupWin.document.open();
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
}
//
