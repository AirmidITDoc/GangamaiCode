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
 
 
  filteredOptionsRegSearch: Observable<string[]>;  
  filteredOptionsDoc1: Observable<string[]>; 
  filteredOptionsDoc2: Observable<string[]>; 
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
  isAdmittedDoctor1Selected: boolean = false;
  isAdmittedDoctor2Selected: boolean = false; 
  isSearchdoctorSelected: boolean = false;
  isRegSearchDisabled: boolean = true; 
  isCompanySelected: boolean = true; 
  Regflag: boolean = false;
  showtable: boolean = false;
  Regdisplay: boolean = false;  
  
  optionRegSearch: any[] = []; 
  optionsAdDoc1: any[] = [];
  optionsAdDoc2: any[] = [];
 

  autocompleteModeprefix: string = "Prefix";
  autocompleteModemaritalstatus: string = "MaritalStatus";
  autocompleteModearea: string = "Area";
  autocompleteModecity: string = "City";
  autocompleteModereligion: string = "Religion";
  autocompleteModegender: string = "GenderByPrefix";
  autocompleteModestatus: string = "StateByCity";
  autocompleteModecountry: string = "CountryByState";
  autocompleteModerelationship: string = "Relationship";
  autocompleteModepatienttype: string = "PatientType";
  autocompleteModetariff: string = "Tariff";
  autocompleteModeDepartment: string = "Department";
  autocompleteModeRefDoctor: string = "RefDoctor";
  autocompleteModeDoctor: string = "ConDoctor";
  autocompleteModeCompany: string = "Company";
  autocompleteModeSubCompany: string = "SubCompany";
  autocompleteModeWardName: string = "Room";
  autocompleteModeBedName: string = "Bed";
  autocompleteModeClass: string = "Class";
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
  prefixId = 0;
  MaritalStatusId = 0;
  areaId = 0;
  cityId = 0;
  religionId = 0;
  genderId = 0;
  stateId = 0;
  CountryId = 0;
  RelationshipId = 0;
  PatientTypeId = 0;
  TariffId = 0;
  DepartmentId = 0;
  RefDoctorId = 0;
  ConDoctorId = 0;
  CompanyID =0;
  SubCompanyID=0;
  RoomId=0;
  BedId=0;
  ClassId=0;
  selectChangeprefix(obj: any){
    console.log(obj);
    this.prefixId=obj.value
  }
  selectChangemarital(obj: any){
    console.log(obj);
    this.MaritalStatusId=obj.value
  }
  selectChangearea(obj: any){
    console.log(obj);
    this.areaId=obj.value
  }
  selectChangecity(obj: any){
    console.log(obj);
    this.cityId=obj.value
  }
  selectChangereligion(obj: any){
    console.log(obj);
    this.religionId=obj.value
  }
  selectChangegender(obj: any){
    console.log(obj);
    this.genderId=obj.value
  }
  selectChangestate(obj: any){
    console.log(obj);
    this.stateId=obj.value
  }
  selectChangeCountry(obj: any){
    console.log(obj);
    this.CountryId=obj.value
  }
  selectChangeRelationship(obj: any){
    console.log(obj);
    this.RelationshipId=obj.value
  }
  selectChangePatientType(obj: any){
    console.log(obj);
    this.PatientTypeId=obj.value
  }
  selectChangeTariff(obj: any){
    console.log(obj);
    this.TariffId=obj.value
  }
  selectChangeDepartment(obj: any){
    console.log(obj);
    this.DepartmentId=obj.value
  }
  selectChangeRefDoctor(obj: any){
    console.log(obj);
    this.RefDoctorId=obj.value
  }
  selectChangeConDoctor(obj: any){
    console.log(obj);
    this.ConDoctorId=obj.value
  }
  selectChangeCompany(obj: any){
    console.log(obj);
    this.CompanyID=obj.value
  }
  selectChangeSubCompany(obj: any){
    console.log(obj);
    this.SubCompanyID=obj.value
  }
  selectChangeRoom(obj: any){
    console.log(obj);
    this.RoomId=obj.value
  }
  selectChangeBed(obj: any){
    console.log(obj);
    this.BedId=obj.value
  }
  selectChangeClass(obj: any){
    console.log(obj);
    this.ClassId=obj.value
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

  
    this.getDoctor1List();
    this.getDoctor2List(); 


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

  
 
    this.getDoctor1List();
    this.getDoctor2List(); 

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
      console.log(this.filteredOptions)
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
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
 
getDoctor1List() {
  this._AdmissionService.getDoctorMaster1Combo().subscribe(data => {
    this.Doctor1List = data;
    this.optionsAdDoc1 = this.Doctor1List.slice();
    // this.filteredOptionsDoc1 = this.hospitalFormGroup.get('admittedDoctor1').valueChanges.pipe(
    //   startWith(''),
    //   map(value => value ? this._filteradmittedDoctor1(value) : this.Doctor1List.slice()),
    // );
  });
}
getDoctor2List() {
  this._AdmissionService.getDoctorMaster2Combo().subscribe(data => {
    this.Doctor2List = data;
    this.optionsAdDoc2 = this.Doctor2List.slice();
    // this.filteredOptionsDoc2 = this.hospitalFormGroup.get('admittedDoctor2').valueChanges.pipe(
    //   startWith(''),
    //   map(value => value ? this._filteradmittedDoctor2(value) : this.Doctor2List.slice()),
    // ); 
  });
  } 
 
onBedChange(value) {
  this.bedObj = value;
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
 
onNewSave(){
  // if ((this.vPrefixID == '' || this.vPrefixID == null || this.vPrefixID == undefined)) {
  //   this.toastr.warning('Please select valid Prefix ', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if ((this.vCityId == '' || this.vCityId == null || this.vCityId == undefined)) {
  //   this.toastr.warning('Please select valid City', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if ((this.vPatientTypeID == '' || this.vPatientTypeID == null || this.vPatientTypeID == undefined)) {
  //   this.toastr.warning('Please select PatientType', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }

  // if ((this.vDepartmentid == '' || this.vDepartmentid == null || this.vDepartmentid == undefined)) {
  //   this.toastr.warning('Please Select Department', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if ((this.vDoctorId == '' || this.vDoctorId == null || this.vDoctorId == undefined)) {
  //   this.toastr.warning('Please Select Doctor', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // const ischeckprefix = this.PrefixList.some(item => item.PrefixName ===this.personalFormGroup.get('PrefixID').value.PrefixName)
  // if(!ischeckprefix){
  //   this.toastr.warning('Please Select valid Prefix', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if(this.personalFormGroup.get('AreaId').value){
  //   if(!this.AreaList.some(item => item.AreaName ===this.personalFormGroup.get('AreaId').value.AreaName)){
  //     this.toastr.warning('Please Select valid AreaName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(!this.cityList.some(item => item.CityName ===this.personalFormGroup.get('CityId').value.CityName)){
  //   this.toastr.warning('Please Select valid City', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if(this.personalFormGroup.get('MaritalStatusId').value){
  //   if(!this.MaritalStatusList.some(item => item.MaritalStatusName ===this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusName)){
  //     this.toastr.warning('Please Select valid MaritalStatus', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.personalFormGroup.get('ReligionId').value){
  //   if(!this.ReligionList.some(item => item.ReligionName ===this.personalFormGroup.get('ReligionId').value.ReligionName)){
  //     this.toastr.warning('Please Select valid ReligionName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }

  // if(!this.TariffList.some(item => item.TariffName ===this.hospitalFormGroup.get('TariffId').value.TariffName)){
  //   this.toastr.warning('Please Select valid TariffName', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
 
  // if(!this.DepartmentList.some(item => item.departmentName ===this.hospitalFormGroup.get('Departmentid').value.departmentName)){
  //   this.toastr.warning('Please Select valid departmentName', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if(!this.DoctorList.some(item => item.Doctorname ===this.hospitalFormGroup.get('DoctorId').value.Doctorname)){
  //   this.toastr.warning('Please Select valid Doctorname', 'Warning !', {
  //     toastClass: 'tostr-tost custom-toast-warning',
  //   });
  //   return;
  // }
  // if(this.hospitalFormGroup.get('admittedDoctor1').value){
  //   if(!this.Doctor1List.some(item => item.Doctorname ===this.hospitalFormGroup.get('admittedDoctor1').value.Doctorname)){
  //     this.toastr.warning('Please Select valid AdmitDoctorName11', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.hospitalFormGroup.get('admittedDoctor2').value){
  //   if(!this.Doctor2List.some(item => item.Doctorname ===this.hospitalFormGroup.get('admittedDoctor2').value.Doctorname)){
  //     this.toastr.warning('Please Select valid AdmitDoctorName2', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.hospitalFormGroup.get('refDoctorId').value){
  //   if(!this.Doctor1List.some(item => item.Doctorname ===this.hospitalFormGroup.get('refDoctorId').value.Doctorname)){
  //     this.toastr.warning('Please Select valid RefDoctor', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
 
  // if(this.hospitalFormGroup.get('CompanyId').value){
  //   if(!this.CompanyList.some(item => item.CompanyName ===this.hospitalFormGroup.get('CompanyId').value.CompanyName)){
  //     this.toastr.warning('Please Select valid CompanyName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.hospitalFormGroup.get('SubCompanyId').value){
  //   if(!this.SubTPACompList.some(item => item.CompanyName ===this.hospitalFormGroup.get('SubCompanyId').value.CompanyName)){
  //     this.toastr.warning('Please Select valid SubCompany', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.wardFormGroup.get('RoomId').value){
  //   if(!this.WardList.some(item => item.RoomName ===this.wardFormGroup.get('RoomId').value.RoomName)){
  //     this.toastr.warning('Please Select valid WardName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }

  // if(!this.wardFormGroup.get('BedId').value){
  //   if(this.vBedId == '' || this.vBedId == null || this.vBedId == undefined || this.vBedId == 0){
  //     this.toastr.warning('Please Select BedName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }  
  // if(this.wardFormGroup.get('BedId').value){
  //   if(!this.BedList.some(item => item.BedName ===this.wardFormGroup.get('BedId').value.BedName)){
  //     this.toastr.warning('Please Select valid BedName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // }
  // if(this.otherFormGroup.get('RelationshipId').value){
  //   if(!this.RelationshipList.some(item => item.RelationshipName ===this.otherFormGroup.get('RelationshipId').value.RelationshipName)){
  //     this.toastr.warning('Please Select valid RelationshipName', 'Warning !', {
  //       toastClass: 'tostr-tost custom-toast-warning',
  //     });
  //     return;
  //   }
  // } 
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
      regInsert['addedBy'] = this.accountService.currentUserValue.userId;
      regInsert['UpdatedBy'] = 0,// this.accountService.currentUserValue.userId;
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
      admissionNewInsert['addedBy'] = this.accountService.currentUserValue.userId;

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
  
  
      admissionInsert['admissionId'] = 0;
      admissionInsert['regId'] = this.registerObj.RegId;
      admissionInsert['admissionDate'] = this.dateTimeObj.date || '01/01/1900',
      admissionInsert['admissionTime'] = this.dateTimeObj.time || '01/01/1900',
      admissionInsert['patientTypeId'] = this.PatientTypeId || 0;//tTypeId ? this.hospitalFormGroup.get('PatientTypeID').value.PatientTypeID : 0;       
      admissionInsert['hospitalId'] =  1;  //? this.hospitalFormGroup.get('HospitalId').value.HospitalId : 0;
      admissionInsert['docNameId'] = this.ConDoctorId || 0;//? this.hospitalFormGroup.get('DoctorId').value.DoctorId : 0;
      admissionInsert['refDocNameId'] =    this.RefDoctorId  || 0;
      admissionInsert['wardId'] =   this.RoomId  || 0;
      admissionInsert['bedId'] =   this.BedId  || 0;
      admissionInsert['dischargeDate'] = '01/01/1900';
      admissionInsert['dischargeTime'] = '01/01/1900';
      admissionInsert['isDischarged'] = 0;
      admissionInsert['isBillGenerated'] = 0;
      admissionInsert['ipdno'] = 0;
      admissionInsert['isCancelled'] = 0;
      admissionInsert['CompanyId'] =  this.CompanyID  || 0; 
      admissionInsert['tariffId'] =   this.TariffId  || 0;
      admissionInsert['classId'] =   this.ClassId  || 0;
      admissionInsert['departmentId'] = this.DepartmentId  || 0;
      admissionInsert['relativeName'] = this.otherFormGroup.get('RelativeName').value ? this.otherFormGroup.get('RelativeName').value : '';
      admissionInsert['relativeAddress'] = this.otherFormGroup.get('RelativeAddress').value ? this.otherFormGroup.get('RelativeAddress').value : '';
      admissionInsert['phoneNo'] = this.personalFormGroup.get('MobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
      admissionInsert['mobileNo'] = this.otherFormGroup.get('RelatvieMobileNo').value ? this.otherFormGroup.get('RelatvieMobileNo').value : '';
      admissionInsert['relationshipId'] =  this.RelationshipId  || 0;
      admissionInsert['addedBy'] = 1;
     // console.log(this.otherFormGroup.get('IsMLC').value)
      admissionInsert['isMLC'] =  false;
      admissionInsert['motherName'] = '';
      admissionInsert['admittedDoctor1'] = 0//this.hospitalFormGroup.get('admittedDoctor1').value.value ? this.hospitalFormGroup.get('admittedDoctor1').value.value : 0;
      admissionInsert['admittedDoctor2'] = 0//this.hospitalFormGroup.get('admittedDoctor2').value.value ? this.hospitalFormGroup.get('admittedDoctor2').value.value : 0;
      admissionInsert['isProcessing'] = '';
      admissionInsert['ischarity'] = false;
      admissionInsert['refByTypeId'] = 0;
      admissionInsert['refByName'] = 0;  
      admissionInsert['isMarkForDisNur'] = false;;
      admissionInsert['isMarkForDisNurId'] = 0;
      admissionInsert['isMarkForDisNurDateTime'] = '01/01/1900';
      admissionInsert['isCovidFlag'] = 0;
      admissionInsert['isCovidUserId'] = 0;
      admissionInsert['isCovidUpdateDate'] = '01/01/1900';
      admissionInsert['isUpdatedBy'] = 0;
      admissionInsert['subTpaComId'] = this.SubCompanyID  || 0; 
      admissionInsert['policyNo'] = 0;
      admissionInsert['aprovAmount'] = 0;
      admissionInsert['compDod'] = this.dateTimeObj.date || '01/01/1900',
      admissionInsert['isPharClearance'] = false;  
      admissionInsert['ipnumber'] = 0;
      admissionInsert['estimatedAmount'] = 0;
      admissionInsert['approvedAmount'] = 0;
      admissionInsert['hosApreAmt'] = 0;
      admissionInsert['pathApreAmt'] = 0;
      admissionInsert['pharApreAmt'] = 0;
      admissionInsert['radiApreAmt'] = 0;
      admissionInsert['pharDisc'] = 0;
      admissionInsert['compBillNo'] = 0;
      admissionInsert['compBillDate'] = '01/01/1900';
      admissionInsert['compDisDate'] = '01/01/1900';
      admissionInsert['compDiscount'] = 0;
      admissionInsert['cBillNo'] = 0;
      admissionInsert['cFinalBillAmt'] = 0;
      admissionInsert['cDisallowedAmt'] = 0;
      admissionInsert['claimNo'] = ''; 
      admissionInsert['hdiscAmt'] = 0;  
      admissionInsert['cOutsideInvestAmt'] = 0;
      admissionInsert['recoveredByPatient'] = 0;
      admissionInsert['hChargeAmt'] = 0;
      admissionInsert['hAdvAmt'] = 0;
      admissionInsert['hBillId'] = 0;
      admissionInsert['hBillDate'] = '01/01/1900'
      admissionInsert['hBillNo'] = 0;
      admissionInsert['hTotalAmt'] = 0;
      admissionInsert['hDiscAmt1'] = 0;
      admissionInsert['hNetAmt'] = 0;
      admissionInsert['hPaidAmt'] = 0;
      admissionInsert['hBalAmt'] = 0;
      admissionInsert['isOpToIpconv'] = 0//this.otherFormGroup.get('OPIPChange').value,
      admissionInsert['refDoctorDept'] =   this.DepartmentId   || 0 ;
      admissionInsert['admissionType'] = 0;
      admissionInsert['medicalApreAmt'] = 0;  

      submissionObj['admission'] = admissionInsert; 

      console.log(submissionObj); 
      this._AdmissionService.InsertNewAdmission(submissionObj).subscribe((response) => {
        this.toastr.success(response.message); 
        this.onClose();
        this._matDialog.closeAll();
        this.getAdmittedPatientCasepaperview(response, true);
        this.onReset();
    
      }, (error) => {
        this.toastr.error(error.message);
      });
    
   }
  }
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

