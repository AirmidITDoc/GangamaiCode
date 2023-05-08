import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ReplaySubject, Subject } from 'rxjs';
import { RegInsert, VisitMaster } from '../appointment.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AppointmentSreviceService } from '../appointment-srevice.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { MatStepper } from '@angular/material/stepper';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { RegistrationService } from '../../registration/registration.service';
import { OPIPPatientModel, SearchPageComponent } from '../../op-search-list/search-page/search-page.component';


@Component({
  selector: 'app-new-appointment',
  templateUrl: './new-appointment.component.html',
  styleUrls: ['./new-appointment.component.scss']
})
export class NewAppointmentComponent implements OnInit {

  registerObj = new RegInsert({});
  registerObj1 = new OPIPPatientModel({});
  name = new FormControl('');
  FirstName = new FormControl('');
  AreaId = new FormControl('');
  submitted = false;
  year = 10;
  month = 5;
  day = 30;
  VisitTime: String;
  msg: any = [];
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
  sIsLoading: string = '';
  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  isLinear = true;
  personalFormGroup: FormGroup;
  VisitFormGroup: FormGroup;
  searchFormGroup: FormGroup;
  registration: any;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  dataArray = {};
  HospitalList1: any = [];
  Patientnewold:any  = 1;

  
  IsPathRad: any;
  PatientName: any = '';
  OPIP: any = '';
  Bedname: any = '';
  wardname: any = '';
  classname: any = '';
  tariffname: any = '';
    ipno: any = '';
  patienttype: any = '';
  Adm_Vit_ID: any = 0;

  OTTableID:any;
  AnestheticsDr:any;
  OTTableName :any;



  // prefix filter
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredPrefix: ReplaySubject<any> = new ReplaySubject<any>(1);

  // city filter
  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  //religion filter
  public religionFilterCtrl: FormControl = new FormControl();
  public filteredReligion: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public maritalstatusFilterCtrl: FormControl = new FormControl();
  public filteredMaritalstatus: ReplaySubject<any> = new ReplaySubject<any>(1);

  //area filter
  public areaFilterCtrl: FormControl = new FormControl();
  public filteredArea: ReplaySubject<any> = new ReplaySubject<any>(1);

  //purpose filter
  public purposeFilterCtrl: FormControl = new FormControl();
  public filteredPurpose: ReplaySubject<any> = new ReplaySubject<any>(1);

  //company filter
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);


  //hospital filter
  public hospitalFilterCtrl: FormControl = new FormControl();
  public filteredHospital: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctoroneFilterCtrl: FormControl = new FormControl();
  public filteredDoctorone: ReplaySubject<any> = new ReplaySubject<any>(1);


  //doctorone filter
  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);


  private _onDestroy = new Subject<void>();

  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  @ViewChild('appointmentFormStepper') appointmentFormStepper: MatStepper;
  @Input() panelWidth: string | number;
  selectedPrefixId: any;

  isCompanySelected: boolean = false;
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  dataSource = new MatTableDataSource<VisitMaster>();
  
  visitObj = new VisitMaster({});

  
  @ViewChild(MatSort) sort:MatSort;
  @ViewChild(MatPaginator) paginator:MatPaginator;
  editor: string;

  constructor(public _opappointmentService: AppointmentSreviceService,
    private accountService: AuthenticationService,
    public _registerService:RegistrationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<NewAppointmentComponent>,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    // dialogRef.disableClose = true;
  }

  ngOnInit(): void {

    this.personalFormGroup = this.createPesonalForm();
    this.personalFormGroup.markAllAsTouched();
    this.VisitFormGroup = this.createVisitdetailForm();
    this.VisitFormGroup.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
    this.searchFormGroup.markAllAsTouched();

    this.getHospitalList1();
    this.getHospitalList();
    this.getPrefixList();
    this.getPatientTypeList();
    this.getTariffList();
    this.getAreaList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getcityList();
    // this.getGendorMasterList();
    this.getCompanyList();
    this.getSubTPACompList();
    this.getDepartmentList();
    this.getDoctor1List();
    this.getDoctor2List();
    this.getPurposeList();

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
      .subscribe(() => {
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

    this.purposeFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterPurpose();
      });

    this.companyFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCompany();
      });

    this.hospitalFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterHospital();
      });

    this.doctoroneFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctorone();
      });

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

      this.FirstName.markAsTouched();
      this.AreaId.markAsTouched();
  }

  createPesonalForm() {
    return this.formBuilder.group({
      RegId: '',
      PrefixId: '',
      PrefixID: '',
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      MiddleName: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-z]*$"),
      ]],
      GenderId: '',
      Address: '',
      DateOfBirth:[{ value: this.registerObj.DateofBirth }],
      AgeYear: ['', [
        Validators.required,
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['',Validators.pattern("[0-9]+")],
      AgeDay:['',Validators.pattern("[0-9]+")],
      // PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{15}$")]] , 
      PhoneNo: [''] , 
      MobileNo: ['', [Validators.required,Validators.pattern("^((\\+91-?)|0)?[7-9]{1}[0-9]{9}$")]], 
      AadharCardNo: ['', [
        Validators.required,
      //  ("^[2-9]{1}[0-9]{11}$")
        Validators.pattern("^[2-9]{1}[0-9]{11}$")]],
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
      UnitId:'',
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
      HospitalId:'',
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
  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled },]
      // [Validators.required]]
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
    this._opappointmentService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.filteredPrefix.next(this.PrefixList.slice());
    });
  }

  getPatientTypeList() {
    this._opappointmentService.getPatientTypeCombo().subscribe(data => {
      this.PatientTypeList = data;
      this.VisitFormGroup.get('PatientTypeID').setValue(this.PatientTypeList[0]);
    })
  }

  onChangePatient(value) {
    console.log(value);

    if (value.PatientTypeId == 2) {
      this.VisitFormGroup.get('CompanyId').clearValidators();
      this.VisitFormGroup.get('SubCompanyId').clearValidators();
      this.VisitFormGroup.get('CompanyId').updateValueAndValidity();
      this.VisitFormGroup.get('SubCompanyId').updateValueAndValidity();
      this.isCompanySelected = true;
    } else {
      this.VisitFormGroup.get('CompanyId').setValidators([Validators.required]);
      // this.VisitFormGroup.get('SubCompanyId').setValidators([Validators.required]);
      this.isCompanySelected = false;
    }
  }
  // getGendorMasterList() {
  //   this._opappointmentService.getGenderMasterCombo().subscribe(data => {
  //     this.GenderList = data;
  //   })
  // }

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
      this.filteredArea.next(this.AreaList.slice());
    });
  }

  getPurposeList() {
    this._opappointmentService.getPurposeList().subscribe(data => {
      this.PurposeList = data;
      this.filteredPurpose.next(this.PurposeList.slice());
    });
  }

  getMaritalStatusList() {
    this._opappointmentService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
    });
  }

  getReligionList() {
    this._opappointmentService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      this.filteredReligion.next(this.ReligionList.slice());
    });
  }


  getCompanyList() {
    this._opappointmentService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.filteredCompany.next(this.CompanyList.slice());
    });
  }
  getDepartmentList() {
    this._opappointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  getcityList() {
    
    this._opappointmentService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
    });
  }

  onChangeStateList(CityId) {
    if (CityId > 0) {
      this._opappointmentService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        //  this._AdmissionService.myFilterform.get('StateId').setValue(this.selectedState);
      });
    }
  }
  onChangeCityList(CityId) {
    if (CityId > 0) {
      this._opappointmentService.getStateList(CityId).subscribe(data => {
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
      // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
      // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
      // this.registerObj.DateofBirth = DateOfBirth;
      this.personalFormGroup.get('DateOfBirth').setValue(DateOfBirth);
    }

  }

  // prefix filter
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
  // City filter code
  private filterCity() {

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

  // department filter code
  private filterDepartment() {

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
      this.DepartmentList.filter(bank => bank.departmentName.toLowerCase().indexOf(search) > -1)
    );
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

  // purpose filter code  
  private filterPurpose() {

    if (!this.PurposeList) {
      return;
    }
    // get the search keyword
    let search = this.purposeFilterCtrl.value;
    if (!search) {
      this.filteredPurpose.next(this.PurposeList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredPurpose.next(
      this.PurposeList.filter(bank => bank.PurposeName.toLowerCase().indexOf(search) > -1)
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
  onClear() {
    this._opappointmentService.mySaveForm.reset({ IsDeleted: 'false' });
    this._opappointmentService.initializeFormGroup();
  }

  OnChangeDoctorList(departmentObj) {
    //debugger;
    console.log(departmentObj);
    this._opappointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(data => { this.DoctorList = data; })
  }

  getDoctor1List() {
    // this._opappointmentService.getDoctorMaster1Combo().subscribe(data => { this.Doctor1List = data; })
    this._opappointmentService.getDoctorMaster1Combo().subscribe(data => {
      this.Doctor1List = data;
      this.filteredDoctorone.next(this.Doctor1List.slice());
    });

  }
  getDoctor2List() {
    this._opappointmentService.getDoctorMaster2Combo().subscribe(data => { this.Doctor2List = data; })
  }

    // RegId of Patient Searching 
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
      this._opappointmentService.getRegistrationList(m_data).subscribe(resData => {
                this.filteredOptions = resData;

        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
    }

  }

  searchRegList() {
    debugger;
    const dialogRef = this._matDialog.open(SearchPageComponent,
      {
        maxWidth: "90vw",
        maxHeight: "540px", width: '100%'
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      if (result) {
        let a,b,c ;

        a =result.AgeDay.trim();;
        b =result.AgeMonth.trim();
        c =result.AgeYear.trim();
        
        result.AgeDay=a;
        result.AgeMonth=b;
        result.AgeYear=c;
        this.registerObj = result as RegInsert;
        this.setDropdownObjs();
      }
      //this.getRegistrationList();
    });
  }

  
  searchPatientList() {
    debugger;
    const dialogRef = this._matDialog.open(SearchPageComponent,
      {
        maxWidth: "90%",
        height: "530px !important ", width: '100%',
      });

    dialogRef.afterClosed().subscribe(result => {
      
      if (result) {
        this.registerObj1 = result as OPIPPatientModel;
        if (result) {
          this.PatientName = this.registerObj1.PatientName;
          this.OPIP = this.registerObj1.IP_OP_Number;
          this.AgeYear = this.registerObj1.AgeYear;
          this.classname = this.registerObj1.ClassName;
          this.tariffname = this.registerObj1.TariffName;
          this.ipno = this.registerObj1.IPNumber;
          this.Bedname = this.registerObj1.Bedname;
          this.wardname = this.registerObj1.WardId;
          this.Adm_Vit_ID = this.registerObj1.Adm_Vit_ID;
        }
      }
      // console.log(this.registerObj);
    });
  }


  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }

  getSelectedObj(obj) {
  debugger;
    console.log('obj==', obj);
    let a,b,c ;

    a =obj.AgeDay.trim();;
    b =obj.AgeMonth.trim();
    c =obj.AgeYear.trim();
    console.log(a,b,c);
    obj.AgeDay=a;
    obj.AgeMonth=b;
    obj.AgeYear=c;
    this.registerObj = obj;
    this.setDropdownObjs();
  }

  getVisitList() {
  //  debugger;
    this.sIsLoading = 'loading-data';
    var D_data = {
      "F_Name": this._opappointmentService.myFilterform.get("FirstName").value.trim() + '%' || '%',
      "L_Name": this._opappointmentService.myFilterform.get("LastName").value.trim() + '%'|| '%',
      "Reg_No": this._opappointmentService.myFilterform.get("RegNo").value || 0,
      "Doctor_Id": this._opappointmentService.myFilterform.get("DoctorId").value || 0,
      "From_Dt" :this.datePipe.transform(this._opappointmentService.myFilterform.get("start").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900', 
      "To_Dt" :  this.datePipe.transform(this._opappointmentService.myFilterform.get("end").value,"yyyy-MM-dd 00:00:00.000") || '01/01/1900',  
      "IsMark": this._opappointmentService.myFilterform.get("IsMark").value || 0,
       
    }
    console.log(D_data);
    this._opappointmentService.getAppointmentList(D_data).subscribe(Visit => {
    this.dataArray = Visit;
    this.sIsLoading ='';
  },
  error => {
    this.sIsLoading = '';
  });
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


  submitAppointForm() {

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
      registrationSave['middleName'] = this.registerObj.MiddleName;
      registrationSave['lastName'] = this.registerObj.LastName;
      registrationSave['address'] = this.registerObj.Address;
      registrationSave['City'] = this.personalFormGroup.get('CityId').value.CityName;
      registrationSave['pinNo'] = '';
      registrationSave['dateOfBirth'] = this.datePipe.transform(this.registerObj.DateofBirth,"MM-dd-yyyy"), //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
      registrationSave['age'] = this.registerObj.AgeYear;//this.registerObj.Age;
      registrationSave['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
      registrationSave['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
      registrationSave['mobileNo'] = this.registerObj.MobileNo;
      registrationSave['addedBy'] = this.accountService.currentUserValue.user.id;
    // registrationSave['RegNo'] = 0;//this.registerObj.RegId;
      registrationSave['ageYear'] = this.registerObj.AgeYear;
      registrationSave['ageMonth'] = this.registerObj.AgeMonth;
      registrationSave['ageDay'] = this.registerObj.AgeDay;
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
      visitSave['RefDocId'] = this.VisitFormGroup.get('DoctorIdOne').value.DoctorId ||0;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitSave['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitSave['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitSave['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitSave['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
      visitSave['IsCancelled'] = 0;
      visitSave['IsCancelledBy'] = 0;
      visitSave['IsCancelledDate'] = this.dateTimeObj.date;

      visitSave['ClassId'] = 1; // this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitSave['DepartmentId'] = this.VisitFormGroup.get('DoctorID').value.DepartmentId;//? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      debugger;
     console.log(this.Patientnewold);
      visitSave['PatientOldNew'] = this.Patientnewold;
      visitSave['FirstFollowupVisit'] = 0,// this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitSave['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId;// ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitSave['FollowupDate'] = this.dateTimeObj.date;// this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
    //  visitSave['IsMark'] = 0,// this.VisitFormGroup.get('RelatvieMobileNo').value ? this.personalFormGroup.get('MobileNo').value : '';
      
        

      submissionObj['visitSave'] = visitSave;

      tokenNumberWithDoctorWiseInsert['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseSave'] = tokenNumberWithDoctorWiseInsert;
      console.log(submissionObj);
      this._opappointmentService.appointregInsert(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'New Appoinment save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              // debugger;
            this.getVisitList();
            }
           
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
      registrationUpdate['middleName'] = this.registerObj.MiddleName;
      registrationUpdate['lastName'] = this.registerObj.LastName;
      registrationUpdate['address'] = this.registerObj.Address;
      registrationUpdate['City'] = this.personalFormGroup.get('CityId').value.CityName;
      registrationUpdate['pinNo'] = '';
      registrationUpdate['dateOfBirth'] =  this.datePipe.transform(this.registerObj.DateofBirth,"MM-dd-yyyy"); //this.personalFormGroup.get('DateofBirth').value.DateofBirth;
      registrationUpdate['age'] = this.registerObj.AgeYear;//this.registerObj.Age;
      registrationUpdate['genderID'] = this.personalFormGroup.get('GenderId').value.GenderId;
      registrationUpdate['phoneNo'] = this.personalFormGroup.get('PhoneNo').value || 0;
      registrationUpdate['mobileNo'] = this.registerObj.MobileNo;
      registrationUpdate['updatedBy'] = this.accountService.currentUserValue.user.id;
      registrationUpdate['ageYear'] = this.registerObj.AgeYear;
      registrationUpdate['ageMonth'] = this.registerObj.AgeMonth;
      registrationUpdate['ageDay'] = this.registerObj.AgeDay;
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

      visitUpdate['UnitId'] = this.VisitFormGroup.get('HospitalId').value.HospitalId ? this.VisitFormGroup.get('HospitalId').value.HospitalId : 0; // this.VisitFormGroup.get('UnitId').value.UnitId ? this.VisitFormGroup.get('UnitId').value.UnitId: 0;
      visitUpdate['PatientTypeId'] = this.VisitFormGroup.get('PatientTypeID').value.PatientTypeId;//.PatientTypeID;//? this.VisitFormGroup.get('PatientTypeID').value.PatientTypeID : 0;
      visitUpdate['ConsultantDocId'] = this.VisitFormGroup.get('DoctorID').value.DoctorId;//? this.VisitFormGroup.get('DoctorId').value.DoctorId : 0;
      visitUpdate['RefDocId'] = this.VisitFormGroup.get('DoctorIdOne').value.DoctorId;// ? this.VisitFormGroup.get('DoctorIdOne').value.DoctorIdOne : 0;

      visitUpdate['TariffId'] = this.VisitFormGroup.get('TariffId').value.TariffId ? this.VisitFormGroup.get('TariffId').value.TariffId : 0;
      visitUpdate['CompanyId'] = this.VisitFormGroup.get('CompanyId').value.CompanyId ? this.VisitFormGroup.get('CompanyId').value.CompanyId : 0;
      visitUpdate['AddedBy'] = this.accountService.currentUserValue.user.id;
      visitUpdate['updatedBy'] = 0,//this.VisitFormGroup.get('RelationshipId').value.RelationshipId ? this.VisitFormGroup.get('RelationshipId').value.RelationshipId : 0;
      visitUpdate['IsCancelled'] = 0;
      visitUpdate['IsCancelledBy'] = 0;
      visitUpdate['IsCancelledDate'] = this.dateTimeObj.date;

      visitUpdate['ClassId'] = 1; // this.VisitFormGroup.get('ClassId').value.ClassId ? this.VisitFormGroup.get('ClassId').value.ClassId : 0;
      visitUpdate['DepartmentId'] = this.VisitFormGroup.get('DoctorID').value.DepartmentId;//? this.VisitFormGroup.get('DepartmentId').value.DepartmentId : 0;
      debugger;
      console.log(this.Patientnewold);
      
      visitUpdate['PatientOldNew'] = this.Patientnewold;
      visitUpdate['FirstFollowupVisit'] = 0,// this.VisitFormGroup.get('RelativeAddress').value ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitUpdate['appPurposeId'] = this.VisitFormGroup.get('PurposeId').value.PurposeId;// ? this.VisitFormGroup.get('RelativeAddress').value : '';
      visitUpdate['FollowupDate'] = this.dateTimeObj.date;// this.personalFormGroup.get('PhoneNo').value ? this.personalFormGroup.get('PhoneNo').value : '';
   
      submissionObj['visitUpdate'] = visitUpdate;

      
      tokenNumberWithDoctorWiseUpdate['patVisitID'] = 0;
      submissionObj['tokenNumberWithDoctorWiseUpdate'] = tokenNumberWithDoctorWiseUpdate;

      console.log(submissionObj);
      this._opappointmentService.appointregupdate(submissionObj).subscribe(response => {
        console.log(response);
        if (response) {
          Swal.fire('Congratulations !', 'Registered Appoinment Saved Successfully  !', 'success').then((result) => {
            if (result.isConfirmed) {
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
  }

  onClose() {
    this._opappointmentService.mySaveForm.reset();
     this.dialogRef.close();
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
 

  onChangeReg(event) {
    
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.personalFormGroup.reset();
      this.searchFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = true;
      // this.Patientnewold = 1;
    } else {
      this.searchFormGroup.get('RegId').enable();
      this.isRegSearchDisabled = false;
      this.personalFormGroup.reset();
      this.Patientnewold = 2;
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
      this.submitAppointForm();
      return;
    }
    this.appointmentFormStepper.next();
  }

  getSubTPACompList() {
    this._opappointmentService.getSubTPACompCombo().subscribe(data => { this.SubTPACompList = data; })
  }
  onDoctorOneChange(value) {
    console.log(this.VisitFormGroup.get('DoctorIdOne').value);
  }

  backClicked() {
    this.appointmentFormStepper.previous();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  get showNameEditor() {
    return this.editor === 'name';
  }

}
