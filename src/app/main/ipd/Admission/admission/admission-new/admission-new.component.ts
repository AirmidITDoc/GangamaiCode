import { Component, ElementRef, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { MatStepper } from '@angular/material/stepper';
import { UntypedFormBuilder, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdmissionService } from '../admission.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Admission, AdmissionPersonlModel, Bed } from '../admission.component';
import { fuseAnimations } from '@fuse/animations';
import { IPDSearcPatienthComponent } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';

@Component({
  selector: 'app-admission-new',
  templateUrl: './admission-new.component.html',
  styleUrls: ['./admission-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class AdmissionNewComponent implements OnInit {

  isAlive = false;
  savedValue: number = null;
  isLoadings = false;
  isOpen = false;
  loadID = 0;

  reportPrintObj: Admission;
  subscriptionArr: Subscription[] = [];
  printTemplate: any;

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
  personalFormGroup: UntypedFormGroup;
  hospitalFormGroup: UntypedFormGroup;
  wardFormGroup: UntypedFormGroup;
  otherFormGroup: UntypedFormGroup;
  searchFormGroup: UntypedFormGroup;
  registration: any;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';

  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  bedObj = new Bed({});
  selectedPrefixId: any;

  isCompanySelected: boolean = false;
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;


  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredPrefix: ReplaySubject<any> = new ReplaySubject<any>(1);

  public cityFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

  public departmentFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  //religion filter
  public religionFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredReligion: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public maritalstatusFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredMaritalstatus: ReplaySubject<any> = new ReplaySubject<any>(1);

  //area filter
  public areaFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredArea: ReplaySubject<any> = new ReplaySubject<any>(1);

  //ward filter
  public wardFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredWard: ReplaySubject<any> = new ReplaySubject<any>(1);

  //company filter
  public companyFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);


  //hospital filter
  public hospitalFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredHospital: ReplaySubject<any> = new ReplaySubject<any>(1);

  //hospital filter
  public bedFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBed: ReplaySubject<any> = new ReplaySubject<any>(1);

  //doctorone filter
  public doctoroneFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctortwoFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredDoctortwo: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();
  toastr: any;

  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<AdmissionNewComponent>,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: any
    //public _regIns: RegInsert
  ) {
    dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    
    
    this.isAlive = true;
    // this.personalFormGroup = this.createPesonalForm();
    // this.hospitalFormGroup = this.createHospitalForm();
    // this.wardFormGroup = this.wardForm();
    // this.otherFormGroup = this.otherForm();

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
    this.getConfigCityList();
    this.getRelationshipList();
    this.getCityList();
    this.getDoctorList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getWardList();

    this.bankFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPrefix();

      });

    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCity();
      });



    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(serviceData => {
        if (serviceData && this.isLoading) {
          this.filteredDepartment = serviceData.filteredDepartment === null ? [] : serviceData.filteredDepartment;
          this.isLoadings = false;
          if (this.filteredDepartment && this.filteredDepartment && this.savedValue !== null && this.filteredDepartment) {
            this.departmentFilterCtrl.setValue(this.savedValue);
          }
          if (serviceData.error) {
            this.departmentFilterCtrl.setValue(this.savedValue);
            this.departmentFilterCtrl.setErrors({ 'serviceFail': serviceData.error });

          }
        }
        this.filterDepartment();
      });


    this.religionFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterReligion();
      });

    this.maritalstatusFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterMaritalstatus();
      });

    this.areaFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterArea();
      });

    this.wardFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterWard();
      });


    this.hospitalFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterHospital();
      });

    this.bedFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterBed();
      });

    this.companyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompany();
      });

    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });

    this.doctortwoFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctortwo();
      });

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

      if (this.data) {

        this.registerObj = this.data.registerObj;
  
        console.log(this.registerObj);
  
        // this.setDropdownObjs1();
      }
  }

  private filterPrefix() {

    if (!this.PrefixList) {
      return;
    }
    // get the search keyword
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredPrefix.next(this.PrefixList.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredPrefix.next(
      this.PrefixList.filter(bank => bank.PrefixName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterCity() {
    // debugger;
    if (!this.cityList) {
      return;
    }
    // get the search keyword
    let search = this.cityFilterCtrl.value;
    if (!search) {
      this.filteredCity.next(this.cityList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredCity.next(
      this.cityList.filter(bank => bank.CityName.toLowerCase().indexOf(search) > -1)
    );
  }

  private filterDepartment() {
    // debugger;

    if (!this.DepartmentList) {
      return;
    }
    // get the search keyword
    let search = this.departmentFilterCtrl.value;
    if (!search) {
      this.filteredDepartment.next(this.DepartmentList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDepartment.next(
      this.DepartmentList.filter(bank => bank.DepartmentName.toLowerCase().indexOf(search) > -1)
    );

  }


  getOptionsText(option) {
    // debugger;
    if (!option)
      return '';
    return option.ServiceName + ' ' + option.Price + ' (' + option.TariffId + ')';


  }

  // religion filter code
  private filterReligion() {

    if (!this.ReligionList) {
      return;
    }
    // get the search keyword
    let search = this.religionFilterCtrl.value;
    if (!search) {
      this.filteredReligion.next(this.ReligionList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredReligion.next(
      this.ReligionList.filter(bank => bank.ReligionName.toLowerCase().indexOf(search) > -1)
    );
  }
  // maritalstatus filter code
  private filterMaritalstatus() {

    if (!this.MaritalStatusList) {
      return;
    }
    // get the search keyword
    let search = this.maritalstatusFilterCtrl.value;
    if (!search) {
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredMaritalstatus.next(
      this.MaritalStatusList.filter(bank => bank.MaritalStatusName.toLowerCase().indexOf(search) > -1)
    );

  }
  // area filter code  
  private filterArea() {

    if (!this.AreaList) {
      return;
    }
    // get the search keyword
    let search = this.areaFilterCtrl.value;
    if (!search) {
      this.filteredArea.next(this.AreaList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredArea.next(
      this.AreaList.filter(bank => bank.AreaName.toLowerCase().indexOf(search) > -1)
    );

  }

  // ward filter code  
  private filterWard() {

    if (!this.WardList) {
      return;
    }
    // get the search keyword
    let search = this.wardFilterCtrl.value;
    if (!search) {
      this.filteredWard.next(this.WardList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredWard.next(
      this.WardList.filter(bank => bank.RoomName.toLowerCase().indexOf(search) > -1)
    );

  }

  // bed filter code  
  private filterBed() {

    if (!this.BedList) {
      return;
    }
    // get the search keyword
    let search = this.bedFilterCtrl.value;
    if (!search) {
      this.filteredBed.next(this.BedList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredBed.next(
      this.BedList.filter(bank => bank.BedName.toLowerCase().indexOf(search) > -1)
    );

  }

  // company filter code  
  private filterCompany() {

    if (!this.CompanyList) {
      return;
    }
    // get the search keyword
    let search = this.companyFilterCtrl.value;
    if (!search) {
      this.filteredCompany.next(this.CompanyList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredCompany.next(
      this.CompanyList.filter(bank => bank.CompanyName.toLowerCase().indexOf(search) > -1)
    );

  }

  // hospital filter code  
  private filterHospital() {

    if (!this.HospitalList) {
      return;
    }
    // get the search keyword
    let search = this.hospitalFilterCtrl.value;
    if (!search) {
      this.filteredHospital.next(this.HospitalList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredHospital.next(
      this.HospitalList.filter(bank => bank.HospitalName.toLowerCase().indexOf(search) > -1)
    );

  }


  // doctorone filter code  
  private filterDoctor() {
    if (!this.DoctorList) {
      return;
    }
    // get the search keyword
    let search = this.doctorFilterCtrl.value;
    if (!search) {
      this.filteredDoctor.next(this.DoctorList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctor.next(
      this.DoctorList.filter(bank => bank.Doctorname.toLowerCase().indexOf(search) > -1)
    );
  }

  // doctorone filter code  
  private filterDoctorone() {

    if (!this.Doctor1List) {
      return;
    }
    // get the search keyword
    let search = this.doctoroneFilterCtrl.value;
    if (!search) {
      this.filteredDoctorone.next(this.Doctor1List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctorone.next(
      this.Doctor1List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
  }


  // doctorone filter code  
  private filterDoctortwo() {

    if (!this.Doctor2List) {
      return;
    }
    // get the search keyword
    let search = this.doctortwoFilterCtrl.value;
    if (!search) {
      this.filteredDoctortwo.next(this.Doctor2List.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredDoctortwo.next(
      this.Doctor2List.filter(bank => bank.DoctorName.toLowerCase().indexOf(search) > -1)
    );
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
          Validators.pattern("[a-zA-Z][a-zA-Z ]+")
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
      CountryId: ''
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
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }]
    });
  }

  // getSearchList() {
  //   if (this.searchFormGroup.get('RegId').value.length >= 3) {
  //     this.filteredOptions = this.searchFormGroup.get('RegId').valueChanges.pipe(
  //       startWith(''),
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       switchMap(val => {
  //         return this.filterData(val || '')
  //       })
  //     );
  //   }
  // }

  getSearchList() {
    var m_data = {
      "F_Name": `${this.searchFormGroup.get('RegId').value}%`,
      "L_Name": '%',
      "Reg_No": '0',
      "From_Dt": '01/01/1900',
      "To_Dt": '01/01/1900',
      "MobileNo": '%'
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

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }
  getSelectedObj(obj) {
    console.log('obj==', obj);
    this.registerObj = new AdmissionPersonlModel({});
    let a, b, c;

    a = obj.AgeDay.trim();;
    b = obj.AgeMonth.trim();
    c = obj.AgeYear.trim();
    console.log(a, b, c);
    obj.AgeDay = a;
    obj.AgeMonth = b;
    obj.AgeYear = c;
    this.registerObj = obj;
    this.setDropdownObjs();
  }

  // getSelectedObj(obj) {
  //   // console.log('obj==', obj);

  //   let a,b,c ;

  //   a =obj.AgeDay.trim();;
  //   b =obj.AgeMonth.trim();
  //   c =obj.AgeYear.trim();
  //   console.log(a,b,c);
  //   obj.AgeDay=a;
  //   obj.AgeMonth=b;
  //   obj.AgeYear=c;
  //   this.registerObj = new AdmissionPersonlModel({});
  //   let a,b,c ;

  //   a =obj.AgeDay.trim();;
  //   b =obj.AgeMonth.trim();
  //   c =obj.AgeYear.trim();
  //   console.log(a,b,c);
  //   obj.AgeDay=a;
  //   obj.AgeMonth=b;
  //   obj.AgeYear=c;
  //   this.registerObj = obj;
  //   this.setDropdownObjs();
  // }

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

  setGenderObj() {

  }


  onChangeReg(event) {
    if (event.value == 'registration') {
      this.searchFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
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

    } else {
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
      this.getPrefixList();
      this.getPatientTypeList();
      this.getTariffList();
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
    this._AdmissionService.getCompanyCombo().subscribe(data => { this.CompanyList = data; })
  }
  getSubTPACompList() {
    this._AdmissionService.getSubTPACompCombo().subscribe(data => { this.SubTPACompList = data; })
  }
  getRelationshipList() {
    this._AdmissionService.getRelationshipCombo().subscribe(data => { this.RelationshipList = data; })
  }
  getPrefixList() {
    this._AdmissionService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.filteredPrefix.next(this.PrefixList.slice());
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
      this.filteredArea.next(this.AreaList.slice());
      this.filteredArea.next(this.AreaList.slice());

    })
  }

  getMaritalStatusList() {
    this._AdmissionService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
    })
  }

  getReligionList() {
    this._AdmissionService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      this.filteredReligion.next(this.ReligionList.slice());
    })

  }

  getDepartmentList() {
    let cData = this._AdmissionService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  getCityList() {
    let cData = this._AdmissionService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
    });
  }

  getDoctorList() {
    this._AdmissionService.getDoctorMaster().subscribe(
      data => {
        this.DoctorList = data;
        console.log(data)
        // data => {
        //   this.DoctorList = data;
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }

  getDoctor1List() {
    this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      console.log(this.Doctor1List);
      this.filteredDoctorone.next(this.Doctor1List.slice());
    })
  }
  getDoctor2List() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.Doctor2List = data;
      this.filteredDoctortwo.next(this.Doctor2List.slice())
    })
  }

  getWardList() {
    this._AdmissionService.getWardCombo().subscribe(data => {
      this.WardList = data;
      this.filteredWard.next(this.WardList.slice());
    })
  }

  // getPatientTypeList() {
  //   this._AdmissionService.getPatientTypeCombo().subscribe(data => {
  //     this.PatientTypeList = data;
  //     this.hospitalFormGroup.get('PatientTypeId').setValue(this.PatientTypeList[0]);
  //     this.onChangePatient(this.PatientTypeList[0]);
  //   });
  // }

  getPatientTypeList() {
    this._AdmissionService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.hospitalFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }


  onChangeCityList(CityId) {
    if (CityId > 0) {
      this._AdmissionService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
        // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
        this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
        this.onChangeCountryList(this.selectedStateID);
      });
    } else {
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
    const dialogRef = this._matDialog.open(IPDSearcPatienthComponent,
      {
        maxWidth: "80vw",
        height: '630px', width: '100%',
      });

    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      if (result) {
        this.registerObj = result as AdmissionPersonlModel;
        // this.setDropdownObjs();
        this._matDialog.closeAll();
      }
      //this.getRegistrationList();
    });
  }

  getConfigCityList() {

    this._AdmissionService.getHospitalCombo().subscribe(data => {
      this.ConfigcityList = data;
      this.selectedHName = this.ConfigcityList[0].HospitalName

    });
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
    // debugger;
    console.log("departmentObj", departmentObj)
    this._AdmissionService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList);
        this.filteredDoctor.next(this.DoctorList.slice());
      })
  }


  openChanged(event) {
    this.isOpen = event;
    this.isLoading = event;
    if (event) {
      this.savedValue = this.departmentFilterCtrl.value;
      this.options = [];
      this.departmentFilterCtrl.reset();
      this._AdmissionService.getDepartmentCombo();
    }
  }

  OnChangeBedList(wardObj) {
    debugger
    console.log(wardObj);
    this._AdmissionService.getBedCombo(wardObj.RoomId).subscribe(data => {
      this.BedList = data;
      this.filteredBed.next(this.BedList.slice());
    })
    this._AdmissionService.getBedClassCombo(wardObj.RoomId).subscribe(data => {
      this.BedClassList = data;
      this.wardFormGroup.get('ClassId').setValue(this.BedClassList[0]);
    })
  }

  onBedChange(value) {
    this.bedObj = value;
  }

  getRegistrationList() {
    //this.parentFunction.emit("Rachana Sungar");

    var m_data = {

      "F_Name": 'p%',
      "L_Name": '%',
      "Reg_No": '0',

    }
    console.log(m_data);
    this._AdmissionService.getRegistrationList(m_data).subscribe(Visit => {

    });
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
    console.log(value);

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



  //   - New Admission 
  // 1. insert_Registration_1_1
  // 2.insert_Admission_1
  // 3. Insert_IPSMSTemplete_1  ===IP Admission Msg For Patient
  // 4. Insert_IPSMSTemplete_1 === 'IP Admission Msg For Doctor
  // 5. Insert_IPSMSTemplete_1 === '  IP Admission Msg For RefDoctor
  // 6. UpdateQuery = "Update BedMaster set IsAvailible=0 where Bedid=" + txtBedID.Text.Trim + ""


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
      regInsert['addedBy'] = this.accountService.currentUserValue.userId;
      regInsert['UpdatedBy'] = 0,// this.accountService.currentUserValue.userId;
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
      admissionNewInsert['addedBy'] = this.accountService.currentUserValue.userId;

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
      this._AdmissionService.AdmissionNewInsert(submissionObj).subscribe(response => {
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
      admissionInsert['addedBy'] = this.accountService.currentUserValue.userId;

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
      this._AdmissionService.AdmissionRegisteredInsert(submissionObj).subscribe(response => {
        console.log(submissionObj);
        if (response) {
          this.toastr.success('Congratulations !', 'Admission save Successfully !');
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
