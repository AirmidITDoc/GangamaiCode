import { Component, ElementRef, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { Admission, AdmissionPersonlModel, Bed } from '../admission.component';
import { Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { AdvanceDetailObj } from 'app/main/ipd/ip-search-list/ip-search-list.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { AdmissionService } from '../admission.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { IPDSearcPatienthComponent } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import Swal from 'sweetalert2';
import { MatSelect } from '@angular/material/select';
import { ToastrService } from 'ngx-toastr';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-new-admission',
  templateUrl: './new-admission.component.html',
  styleUrls: ['./new-admission.component.scss']
})
export class NewAdmissionComponent implements OnInit {

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
 
  newRegSelected: any = 'registration';

  options = []; 
  noOptionFound: boolean = false;
  registerObj = new AdmissionPersonlModel({});
  bedObj = new Bed({});
  selectedPrefixId: any;
 
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';

  @Input() panelWidth: string | number;
  @ViewChild('admissionFormStepper') admissionFormStepper: MatStepper;
  @ViewChild('multiUserSearch') multiUserSearchInput: ElementRef;

 

 

  constructor(public _AdmissionService: AdmissionService,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAdmissionComponent>,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private router: Router,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    dialogRef.disableClose = true;
  }


  personalFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  wardFormGroup: FormGroup;
  otherFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  registration: any;
  matDialogRef: any;  


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
 

  filteredOptionsCity: Observable<string[]>;
  filteredOptionsPrefix: Observable<string[]>;
  filteredOptionsReligion: Observable<string[]>;
  filteredOptionsMarital: Observable<string[]>;
  filteredOptionsArea: Observable<string[]>; 
  filteredOptionsCompany: Observable<string[]>;
  filteredOptionsSubCompany: Observable<string[]>;
  filteredOptionssearchDoctor: Observable<string[]>;
  filteredOptionsRegSearch: Observable<string[]>;
  filteredOptionsPatientType:any;
  filteredOptionsTarrif: Observable<string[]>;
  filteredOptionsRefrenceDoc: Observable<string[]>;
  filteredOptionsDep: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  filteredOptionsDoc1: Observable<string[]>;
  filteredOptionsRefDoc: Observable<string[]>;
  filteredOptionsWard: Observable<string[]>;
  filteredOptionsBed: Observable<string[]>;
  filteredOptionsDoc2: Observable<string[]>;
  filteredOptionsRelation: Observable<string[]>;
  filteredOptions: any;
  
  
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
  patienttype:any = 1;
  saveflag: boolean = false;
  currentDate = new Date();
  
  isRegIdSelected: boolean = false;
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
  ispatienttypeSelected: boolean = false;
  isTariffIdSelected: boolean = false;
  Regflag: boolean = false;
  showtable: boolean = false;
  Regdisplay: boolean = false;
  



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
  V_SearchRegList: any = [];


  ngOnInit(): void { 
  
    this.isAlive = true; 

    this.personalFormGroup = this.createPesonalForm();  
    this.hospitalFormGroup = this.createHospitalForm();  
    this.wardFormGroup = this.wardForm();  
    this.otherFormGroup = this.otherForm(); 


    this.searchFormGroup = this.createSearchForm();

    if (this.data) { 
        console.log(this.data)
        this.registerObj = this.data.row;
        console.log(this.registerObj)
       // this.registerObj.PrefixID=this.registerObj.PrefixID;  
 
    
    }


  
    this.getPrefixList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getGenderMasterList();
    // this.getDepartmentList();
    // this.getCompanyList();
    // this.getSubTPACompList();
    // this.getConfigCityList();
    this.getRelationshipList();
     this.getcityList1();
    // this.getDoctorList();

    // this.getDoctor1List();
    // this.getDoctor2List();
    // this.getWardList(); 
    // this.getHospitalList(); 
    // this.getPatientTypeList();
    // this.getTariffList();
    this.getAreaList(); 


    this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
      startWith(''),
      map(value => this._filterPrex(value)), 
    );

    this.filteredOptionsArea = this.personalFormGroup.get('AreaId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterArea(value)), 
    );

    this.filteredOptionsMarital = this.personalFormGroup.get('MaritalStatusId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterMarital(value)),
    ); 
    
    this.filteredOptionsReligion = this.personalFormGroup.get('ReligionId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterReligion(value)),
    );  

    this.filteredOptionsRelation = this.otherFormGroup.get('RelationshipId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterRelationship(value)), 
    );

    this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterCity(value)),
    );

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
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

///New Admission 
//Radio btn
onChangeReg(event) {
  if (event.value == 'registration') {
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
    // this.getDoctorList();
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
    //this.getDoctorList();
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
//register patient list

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
//Hospital list
getHospitalList() {
  this._AdmissionService.getHospitalCombo().subscribe(data => {
    this.HospitalList = data;
    this.searchFormGroup.get('HospitalId').setValue(this.HospitalList[0]);
  });
}
//prefix 
getPrefixList() { 
   var mode="Prefix"; 

  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.PrefixList = data;
    console.log(data)
    // if (this.data) {
    //   const ddValue = this.PrefixList.filter(c => c.PrefixID == this.registerObj.PrefixID);
    //   this.personalFormGroup.get('PrefixID').setValue(ddValue[0]);
    //   this.personalFormGroup.updateValueAndValidity();
    //   return;
    // }
  });
 // this.onChangeGenderList(this.registerObj);
}

getGenderMasterList() {
  var mode="GenderByPrefix";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.GenderList = data;
    console.log(data)
    // const ddValue = this.GenderList.find(c => c.GenderId == this.data.registerObj.GenderId);
    // this.personalFormGroup.get('GenderId').setValue(ddValue);
  })
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
//Date 
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
//marital status
getMaritalStatusList() { 
  var mode="MaritalStatus";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.MaritalStatusList = data;
    console.log(this.MaritalStatusList) 
  }) 
}
//Religion
getReligionList() {
  var mode="Religion";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.ReligionList = data;
    console.log(this.ReligionList) 
  }) 
}
//Area 
getAreaList() { 
  var mode="Area";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.AreaList = data;
    console.log(this.AreaList) 
  }) 
}
//City
getcityList1() {
  var mode="City";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.cityList = data;
    console.log(this.cityList) 
  })  
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
//PatientType 
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
//Tariff
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
//Department
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
// Adm Doc
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
  //Ref Doc
  getRefDoctorList() {
    this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
      this.RefDoctorList = data;
      this.optionsRefDoc = this.RefDoctorList.slice();
      this.filteredOptionsRefrenceDoc = this.hospitalFormGroup.get('refDoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterRefdoc(value) : this.RefDoctorList.slice()),
      ); 
    });
    }


//Company and sub compnay 
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
// WardName
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
// Bed Name
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
//RelativeName
getRelationshipList() { 
  var mode="Relationship";
  this._AdmissionService.getMaster(mode,1).subscribe(data => {
    this.RelationshipList = data;
    console.log(this.RelationshipList) 
  })
}

///Filters
private _filterPrex(value: any): string[] {
  if (value) {
    const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
    return this.PrefixList.filter(option => option.text.toLowerCase().includes(filterValue));
  }
} 
private _filterReligion(value: any): string[] {
  if (value) {
    const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
    return this.ReligionList.filter(option => option.text.toLowerCase().includes(filterValue));
  } 
} 
private _filterMarital(value: any): string[] {
  if (value) {
    const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
    return this.MaritalStatusList.filter(option => option.text.toLowerCase().includes(filterValue));
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
    const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
    return this.RelationshipList.filter(option => option.text.toLowerCase().includes(filterValue));
  } 
} 
private _filterArea(value: any): string[] {
  if (value) {
    const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
    return this.AreaList.filter(option => option.text.toLowerCase().includes(filterValue));
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
private _filterDep(value: any): string[] {
  if (value) {
    const filterValue = value && value.DepartmentName ? value.DepartmentName.toLowerCase() : value.toLowerCase();
    return this.optionsDep.filter(option => option.DepartmentName.toLowerCase().includes(filterValue));
  } 
}
private _filteradmittedDoctor1(value: any): string[] {
  if (value) {
    const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
    return this.optionsAdDoc1.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  } 
} 
private _filteradmittedDoctor2(value: any): string[] {
if (value) {
  const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
  return this.optionsAdDoc2.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
} 
} 
private _filterRefdoc(value: any): string[] {
if (value) {
  const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
  return this.optionsRefDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
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

 
//getOptions
getOptionTextDropdown(option) {
  return option && option.text ? option.text : '';
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
  return option && option.text ? option.text : '';
} 
getOptionTextReligion(option) {
  return option && option.ReligionName ? option.ReligionName : '';
} 
getOptionTextMarital(option) {
  return option && option.text ? option.text : ''; 
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
getOptionTextpatienttype(option) {
  return option && option.PatientType ? option.PatientType : '';
} 
getOptionTextTariff(option) {
  return option && option.TariffName ? option.TariffName : '';
}
getOptionText(option) {
  if (!option) return '';
  return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
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
getSelectedObj(obj) { 
  this.registerObj = new AdmissionPersonlModel({}); 
  obj.AgeDay = obj.AgeDay.trim();
  obj.AgeMonth = obj.AgeMonth.trim();
  obj.AgeYear = obj.AgeYear.trim();
  this.registerObj = obj;
  console.log(this.registerObj ); 
  // this.PatientName = obj.PatientName;
  // this.RegId = obj.RegId;
  // this.RegNo = obj.RegNo;
  this.vReligionId=obj.ReligionId;
  this.vAreaId=obj.AreaId
  this.vMaritalStatusId=obj.MaritalStatusId; 
  this.onChangeDateofBirth(this.registerObj.DateofBirth)
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
  this.onChangeCityList(this.registerObj);

  this.personalFormGroup.updateValueAndValidity();
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
@ViewChild('savebutton', { static: true }) savebutton: HTMLButtonElement;




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
    this.agey.nativeElement.focus();
    // if(this.mstatus) this.mstatus.focus();
  }
} 

public onEntermstatus(event): void {
  if (event.which === 13) { 
    this.mobile.nativeElement.focus(); 
  }
}

public onEnterreligion(event): void {
  if (event.which === 13) {

    // this.ptype.nativeElement.focus();
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

public onEntercity(event): void {
  if (event.which === 13) {
    // if (this.hname) this.hname.focus();

    this.mstatus.nativeElement.focus();
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
}
 
public onEnterpan(event): void {
  if (event.which === 13) {
    this.AadharCardNo.nativeElement.focus();
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
    this.relation.nativeElement.focus(); 
  } 
} 
public onEnterrelation(event): void { 
  if (event.which === 13 || this.otherFormGroup.get('RelationshipId').value) {
    if(!this.personalFormGroup.invalid && !this.hospitalFormGroup.invalid && !this.wardFormGroup.invalid && !this.otherFormGroup.invalid)
   this.saveflag=true;
  } 
  if(this.savebutton) this.savebutton.focus();
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
  }
}
 
CompanyId: any = 0;
SubCompanyId: any = 0;
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
              this.getAdmittedPatientCasepaperview(response, true);
              this.onReset(); 
        } else {
          this.toastr.success('Admission not saved', 'error', {
            toastClass: 'tostr-tost custom-toast-success',
          }); 
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
              this.getAdmittedPatientCasepaperview(response, true);
              this.onReset();
        } else {
          this.toastr.success('Admission not saved', 'error', {
            toastClass: 'tostr-tost custom-toast-success',
          }); 
        }
        this.isLoading = '';
      });

    }
  }
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
  // this.getHospitalList();
  this.getPrefixList();
  this.getPatientTypeList();
  this.getTariffList();
  this.getAreaList();
  this.getMaritalStatusList();
  this.getReligionList();
  this.getDepartmentList();
  this.getRelationshipList();

  // this.getDoctorList();
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
AdList: boolean = false;
SpinLoading: boolean = false;
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




 
 
 
}

