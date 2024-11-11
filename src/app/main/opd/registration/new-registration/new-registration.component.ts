import { Component, ElementRef, HostListener, Inject, Input, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { RegInsert } from '../registration.component';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { RegistrationService } from '../registration.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationServiceService } from 'app/core/notification-service.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { SearchPageComponent } from '../../op-search-list/search-page/search-page.component';
import { MatSelect } from '@angular/material/select';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-registration',
  templateUrl: './new-registration.component.html',
  styleUrls: ['./new-registration.component.scss'],
  // directives: [appCharmaxLength],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewRegistrationComponent implements OnInit {


  personalFormGroup: FormGroup;
  charcount: any = 0;
  submitted = false;
  now = Date.now();
  searchFormGroup: FormGroup;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';
  isCitySelected: boolean = false;
  msg: any = [];
  AgeYear: any;
  AgeMonth: any;
  AgeDay: any;
  HospitalList: any = [];
  PatientTypeList: any = [];
  TariffList: any = [];
  AreaList: any = [];
  MaritalStatusList: any = [];
  PrefixList: any = [];
  ReligionList: any = [];
  GenderList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  cityList: any = [];
  stateList: any = [];
  countryList: any = [];
  selectedState = "";
  VisitTime: String;
  selectedStateID: any;
  selectedCountry: any;
  selectedCountryID: any;
  selectedHName: any;
  seelctedHospID: any;
  registerObj = new RegInsert({});
  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  isLinear = true;
  isLoading: string = '';
  Prefix: any;
  RegId: any=0;
  snackmessage: any;
  isAreaSelected: boolean = false;
  isMstatusSelected: boolean = false;
  isreligionSelected: boolean = false;
  RegID: any=0;
  AdmissionID: any=0;

  isPrefixSelected: boolean = false;
  optionsPrefix: any[] = [];
  currentDate = new Date();

  isDisabled: boolean = false;
  IsSave: any;

  optionsReligion: any[] = [];
  optionsArea: any[] = [];
  optionsMstatus: any[] = [];
  Submitflag:boolean=false;

  private _onDestroy = new Subject<void>();


  options = [];

  isCompanySelected: boolean = false;
  filteredOptions: any;
  noOptionFound: boolean = false;
  screenFromString = 'registration';
  selectedPrefixId: any;

  matDialogRef: any;
  sIsLoading: string = '';
  optionsCity: any[] = [];
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsPrefix: Observable<string[]>;
  filteredOptionsReligion: Observable<string[]>;
  filteredOptionsMstatus: Observable<string[]>;
  filteredOptionsArea: Observable<string[]>;
     


  constructor(public _registerService: RegistrationService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewRegistrationComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router,

  ) {
  
  }


  ngOnInit(): void {
    this.RegId = 0;

    this.personalFormGroup = this.createPesonalForm();
    this.searchFormGroup = this.createSearchForm();

    this.getPrefixList();
    this.getMaritalStatusList();
    this.getReligionList();
    this.getAreaList();
    this.getCityList();
    this.getDoctor1List();
    this.getDoctor2List();



    if (this.data) {
      debugger
        console.log(this.data.registerObj)
        this.registerObj = this.data.registerObj;
        this.registerObj.PrefixID=this.registerObj.PrefixID;
        this.registerObj.PrefixID=this.registerObj.PrefixId;
        this.RegID=this.registerObj.RegID;
       // this.RegID=this.registerObj.RegId;
        this.AdmissionID=this.registerObj.AdmissionID;
        this.isDisabled = true
        this.Submitflag=this.data.Submitflag;
        // this.registerObj.ReligionId=this.registerObj.ReligionId1;

        if(this.registerObj.AgeYear)
          this.registerObj.Age=this.registerObj.AgeYear.trim();
        if(this.registerObj.AgeMonth)
          this.registerObj.AgeMonth=this.registerObj.AgeMonth.trim();
        if(this.registerObj.AgeDay)
          this.registerObj.AgeDay=this.registerObj.AgeDay.trim();

        if(this.registerObj.AadharCardNo)
          this.registerObj.AadharCardNo=this.registerObj.AadharCardNo.trim();

        

        this.onChangeCityList(this.registerObj.CityId);
        this.setDropdownObjs();
    
    }


    this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
      startWith(''),
      map(value => this._filterPrex(value)),

    );

    this.filteredOptionsArea = this.personalFormGroup.get('AreaId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterArea(value)),

    );

    this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterCity(value)),

    );

    this.filteredOptionsMstatus = this.personalFormGroup.get('MaritalStatusId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterMstatus(value)),
    );


    this.filteredOptionsReligion = this.personalFormGroup.get('ReligionId').valueChanges.pipe(
      startWith(''),
      map(value => this._filterReligion(value)),
    );

  }



  get f() {
    return this.personalFormGroup.controls;
  }

  closeDialog() {
    console.log("closed")

  }
  createPesonalForm() {
    return this.formBuilder.group({
      RegId: '',
      RegNo: '',
      PrefixId: '',
      PrefixID: '',
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
      MiddleName: ['', [
        Validators.pattern("^[A-Za-z () ] *[a-zA-Z () ]*$"),
      ]],
    
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z () ]*[a-zA-z() ]*$"),
      ]],
      GenderId: '',
      Address: '',
      DateOfBirth: [{ value: this.registerObj.DateofBirth }],
      AgeYear: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['', [
        Validators.pattern("^[0-9]*$")]],
      AgeDay: ['', [
        Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['', [Validators.minLength(10),
      Validators.maxLength(15),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      AadharCardNo: ['', Validators.compose([Validators.minLength(12),
      Validators.maxLength(12)
      // Validators.required,
      // Validators.pattern("^[0-9]+$"),

      ])],
      PanCardNo: '',
      MaritalStatusId: '',
      ReligionId: '',
      AreaId: '',
      CityId: '',
      StateId: '',
      CountryId: '',
      IsCharity: '',
    });
  }

  validateadhaarcard(input: any) {
    console.log(input.value);
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getHospitalList() {
    //this._registerService.getHospitalCombo().subscribe(data => { this.HospitalList = data; })
  }



  private _filterPrex(value: any): string[] {
    if (value) {
      const filterValue = value && value.PrefixName ? value.PrefixName.toLowerCase() : value.toLowerCase();
      return this.PrefixList.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
    }
  }

  getPrefixList() {
    
    this._registerService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      if (this.data) {
        const ddValue = this.PrefixList.filter(c => c.PrefixID == this.registerObj.PrefixID);
        this.personalFormGroup.get('PrefixID').setValue(ddValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
    this.onChangeGenderList(this.registerObj);
  }


  getPatientTypeList() {
    this._registerService.getPatientTypeCombo().subscribe(data => { this.PatientTypeList = data; })
  }



  getAreaList() {
    this._registerService.getAreaCombo().subscribe(data => {
      this.AreaList = data;
      if (this.data) {
        const ddValue = this.AreaList.filter(c => c.AreaId == this.registerObj.AreaId);
        this.personalFormGroup.get('AreaId').setValue(ddValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterArea(value: any): string[] {
    if (value) {
      const filterValue = value && value.AreaName ? value.AreaName.toLowerCase() : value.toLowerCase();
      return this.AreaList.filter(option => option.AreaName.toLowerCase().includes(filterValue));
    }
  }



  getMaritalStatusList() {
    this._registerService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      if (this.data) {
        const ddValue = this.MaritalStatusList.filter(c => c.MaritalStatusId == this.registerObj.MaritalStatusId);
        this.personalFormGroup.get('MaritalStatusId').setValue(ddValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterMstatus(value: any): string[] {
    if (value) {
      const filterValue = value && value.MaritalStatusName ? value.MaritalStatusName.toLowerCase() : value.toLowerCase();
      return this.MaritalStatusList.filter(option => option.MaritalStatusName.toLowerCase().includes(filterValue));
    }
  }



  getReligionList() {
    this._registerService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      if (this.data) {
        const ddValue = this.ReligionList.filter(c => c.ReligionId == this.registerObj.ReligionId);
        this.personalFormGroup.get('ReligionId').setValue(ddValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterReligion(value: any): string[] {
    if (value) {
      const filterValue = value && value.ReligionName ? value.ReligionName.toLowerCase() : value.toLowerCase();
      return this.ReligionList.filter(option => option.ReligionName.toLowerCase().includes(filterValue));
    }
  }
  getGendorMasterList() {
    this._registerService.getGenderMasterCombo().subscribe(data => {
      this.GenderList = data;
      const ddValue = this.GenderList.find(c => c.GenderId == this.data.registerObj.GenderId);
      this.personalFormGroup.get('GenderId').setValue(ddValue);
    })
  }

  getCityList() {
    this._registerService.getCityListCombo().subscribe(data => {
      this.cityList = data;
      if (this.data) {
        const ddValue = this.cityList.filter(c => c.CityId == this.registerObj.CityId);
        this.personalFormGroup.get('CityId').setValue(ddValue[0]);
        this.personalFormGroup.updateValueAndValidity();
        return;
      }
    });
  }
  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      return this.cityList.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }
  }


  getcityList() {
    this._registerService.getCityListCombo().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
    });
  }


  onChangeStateList(CityId) {
    if (CityId > 0) {
      this._registerService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;

      });
    }
  }


  onChangeCityList(CityObj) {
    if (CityObj) {
      this._registerService.getStateList(CityObj.CityId).subscribe((data: any) => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
        this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
        this.selectedStateID = this.stateList[0].StateId;
        this.onChangeCountryList(this.selectedStateID);
      });

    }
  }


  onChangeCountryList(StateId) {
    if (StateId > 0) {

      this._registerService.getCountryList(StateId).subscribe(data => {
        this.countryList = data;
        this.selectedCountry = this.countryList[0].CountryName;
        this.personalFormGroup.get('CountryId').setValue(this.countryList[0]);
        this.personalFormGroup.updateValueAndValidity();
      });
    }
  }



  searchRegList() {
    var m_data = {
      "RegAppoint": 1
    }
    const dialogRef = this._matDialog.open(SearchPageComponent,
      {
        maxWidth: "90vw",
        maxHeight: "85vh", width: '100%', height: "100%",
        data: {
          registerObj: m_data,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      // console.log('The dialog was closed - Insert Action', result);
      console.log(result);
      if (result) {
        this.registerObj = result as RegInsert;
        this.setDropdownObjs();

      }
    });
  }



  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
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

  setDropdownObjs() {
debugger
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

    this.onChangeGenderList(this.registerObj);
    
    this.onChangeCityList(this.registerObj);
    this.personalFormGroup.updateValueAndValidity();


    if (this.registerObj.AgeMonth)
      this.registerObj.AgeMonth = this.registerObj.AgeMonth.trim();
    if (this.registerObj.AgeDay)
      this.registerObj.AgeDay = this.registerObj.AgeDay.trim();

  }

  onChangeGenderList(prefixObj) {
    
    if (prefixObj) {
      this._registerService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
        this.GenderList = data;
        this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
        this.selectedGenderID = this.GenderList[0].GenderId;
      });
    }
  }


  OnChangeDoctorList(departmentObj) {
    this._registerService.getDoctorMasterCombo(departmentObj.DepartmentId).subscribe(data => { this.DoctorList = data; })
  }

  getDoctor1List() {
    this._registerService.getDoctorMaster1Combo().subscribe(data => { this.Doctor1List = data; })
  }
  getDoctor2List() {
    this._registerService.getDoctorMaster2Combo().subscribe(data => { this.Doctor2List = data; })
  }
  OnSubmit() {
    debugger
    // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){
if(this.RegId==0){
    var m_data = {
                "regID": 0,
      "regDate": this.dateTimeObj.date || '01/01/1900',// this.dateTimeObj.date,//
      "regTime": this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
      "prefixId": 1,//this.personalFormGroup.get('PrefixID').value.PrefixID,
      "firstName":this.personalFormGroup.get("FirstName").value || "",
      "middleName":this.personalFormGroup.get("MiddleName").value || "",
      "lastName":this.personalFormGroup.get("LastName").value || "",
      "address": this.personalFormGroup.get("Address").value || "",
      "city":"Pune",// this.personalFormGroup.get('CityId').value.CityName || '',
      "pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
      "dateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
      "age": this.personalFormGroup.get("AgeYear").value.toString()  || "0",
      "genderID":1,// this.personalFormGroup.get('GenderId').value.GenderId || 0,
      "phoneNo":  this.personalFormGroup.get("PhoneNo").value || "0",
      "mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
      "addedBy":1,// this.accountService.currentUserValue.user.id,
      "updatedBy": 1,//this.accountService.currentUserValue.user.id,
      "ageYear": this.personalFormGroup.get("AgeYear").value.toString()  || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
      "ageMonth":  this.personalFormGroup.get("AgeMonth").value.toString()  || "",
      "ageDay":  this.personalFormGroup.get("AgeDay").value.toString()  || "",
      "countryId":1,// this.personalFormGroup.get('CountryId').value.CountryId,
      "stateId":1,// this.personalFormGroup.get('StateId').value.StateId,
      "cityId":1,// this.personalFormGroup.get('CityId').value.CityId,
      "maritalStatusId":1,// this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0,
      "isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
      "religionId":1,// this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0,
      "areaId":1,// this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
      "isSeniorCitizen": false,
      "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
      "pancardno":"",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
      "Photo": ''
      
    }
    console.log(m_data);
   
    this._registerService.RegstrationtSave(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }else{
    var m_data = {
      "regID": 0,
"regDate": this.dateTimeObj.date || '01/01/1900',// this.dateTimeObj.date,//
"regTime": this.dateTimeObj.time,// this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
"prefixId": 1,//this.personalFormGroup.get('PrefixID').value.PrefixID,
"firstName":this.personalFormGroup.get("FirstName").value || "",
"middleName":this.personalFormGroup.get("MiddleName").value || "",
"lastName":this.personalFormGroup.get("LastName").value || "",
"address": this.personalFormGroup.get("Address").value || "",
"city":"Pune",// this.personalFormGroup.get('CityId').value.CityName || '',
"pinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
"dateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
"age": this.personalFormGroup.get("AgeYear").value.toString()  || "0",
"genderID":1,// this.personalFormGroup.get('GenderId').value.GenderId || 0,
"phoneNo":  this.personalFormGroup.get("PhoneNo").value || "0",
"mobileNo": this.personalFormGroup.get("MobileNo").value || "0",
"addedBy":1,// this.accountService.currentUserValue.user.id,
"updatedBy": 1,//this.accountService.currentUserValue.user.id,
"ageYear": this.personalFormGroup.get("AgeYear").value.toString()  || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
"ageMonth":  this.personalFormGroup.get("AgeMonth").value.toString()  || "",
"ageDay":  this.personalFormGroup.get("AgeDay").value.toString()  || "",
"countryId":1,// this.personalFormGroup.get('CountryId').value.CountryId,
"stateId":1,// this.personalFormGroup.get('StateId').value.StateId,
"cityId":1,// this.personalFormGroup.get('CityId').value.CityId,
"maritalStatusId":1,// this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0,
"isCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
"religionId":1,// this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0,
"areaId":1,// this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
"isSeniorCitizen": false,
"aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
"pancardno":"",// this.personalFormGroup.get('PanCardNo').value.toString()  ? this.personalFormGroup.get('PanCardNo').value.toString()  : 0,
"Photo": ''

}
console.log(m_data);

this._registerService.Regstrationtupdate(m_data).subscribe((response) => {
this.toastr.success(response.message);
this.onClear(true);
}, (error) => {
this.toastr.error(error.message);
});
  }
  }


  getOptionTextPrefix(option) {
    return option && option.PrefixName ? option.PrefixName : '';
  }

  getOptionTextCity(option) {
    return option && option.CityName ? option.CityName : '';

  }

  

  viewgetPatientAppointmentReportPdf(VisitId) {
      

    this.sIsLoading = 'loading-data';
    setTimeout(() => {
      // this.AdList = true;
      this._registerService.getAppointmentReport(
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
          // this.AdList = false;
          this.sIsLoading = '';
        });
      });

    }, 100);
    
  }

  onClose() {
    this.dialogRef.close();
  }
  onClear(val: boolean) {
    this.personalFormGroup.reset();
    this.dialogRef.close(val);
  }


  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }]
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

  // Change Registered or New Registration
  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this.personalFormGroup.reset();
      this.searchFormGroup.get('RegId').reset();
      this.searchFormGroup.get('RegId').disable();
      this.isRegSearchDisabled = true;
    } else {
      this.searchFormGroup.get('RegId').enable();
      this.isRegSearchDisabled = false;
      // this.personalFormGroup.reset();
    }
    this.getPrefixList();
    // this.getDepartmentList();
    this.getcityList();
  }


  getSearchList() {
    var m_data = {
      "F_Name": `${this.searchFormGroup.get('RegId').value}%`,
      "L_Name": '%',
      "Reg_No": '0',
      "From_Dt": '01/01/1900',
      "To_Dt": '01/01/1900',
      "MobileNo": '%'
    }
    console.log(m_data);
    if (this.searchFormGroup.get('RegId').value.length >= 1) {
      this._registerService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }

  }


  IsCharity: any;
  onChangeIsactive(SiderOption) {
    this.IsCharity = SiderOption.checked
    console.log(this.IsCharity);
  }

  myFunction(s) {
    this.snackmessage = s;
    console.log(s);
    console.log(this.snackmessage);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function () { x.className = x.className.replace("show", ""); }, 2000);
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

  // public onEntergendere(event): void {
  //   if (event.which === 13) {
  //   // this.gender.nativeElement.focus();
  //   if(this.mstatus) this.mstatus.focus();
  //   }
  // }


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

  public onEntercity(event): void {
    if (event.which === 13) {
      // if (this.hname) this.hname.focus();

      this.mstatus.nativeElement.focus();
    }
  }

  getAdmittedPatientCasepaperview(AdmissionId) {
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
    //   this.SpinLoading =true;
    //  this.AdList=true;
    this._registerService.getAdmittedPatientCasepaaperView(
      AdmissionId
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
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }

  getRegistredPatientCasepaperview(VisitId) {
    debugger
    this.sIsLoading = 'loading-data';
    setTimeout(() => {
    //   this.SpinLoading =true;
    //  this.AdList=true;
    this._registerService.getRegisteredPatientCasepaaperView(
      VisitId
      ).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "85vw",
          height: '750px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Patient Case Paper  Viewer"
          }
        });

        matDialog.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.sIsLoading = ' ';
        });
    });
   
    },100);

  }
}
