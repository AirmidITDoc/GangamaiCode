import { Component, HostListener, Inject, Input, OnInit, ViewEncapsulation } from '@angular/core';
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
  charcount:any=0;
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
  Prefix :any;
  RegId:any;
snackmessage:any;


isPrefixSelected: boolean = false;
optionsPrefix: any[] = [];


isDisabled: boolean = false;
  IsSave:any;


  //religion filter
  public religionFilterCtrl: FormControl = new FormControl();
  public filteredReligion: ReplaySubject<any> = new ReplaySubject<any>(1);

  //maritalstatus filter
  public maritalstatusFilterCtrl: FormControl = new FormControl();
  public filteredMaritalstatus: ReplaySubject<any> = new ReplaySubject<any>(1);

  //area filter
  public areaFilterCtrl: FormControl = new FormControl();
  public filteredArea: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();
  // private _onDestroy1 = new Subject<void>();

  options = [];

  isCompanySelected: boolean = false;
  filteredOptions: any;
  noOptionFound: boolean = false;
  screenFromString = 'registration';
  selectedPrefixId: any;

  matDialogRef: any;

  optionsCity: any[] = [];
  filteredOptionsCity: Observable<string[]>;
  filteredOptionsPrefix: Observable<string[]>;

  constructor(public _registerService: RegistrationService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewRegistrationComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router,
    
    )  
    {}

  
  ngOnInit(): void {
   this.RegId=0;

   this.personalFormGroup = this.createPesonalForm();
   this.searchFormGroup = this.createSearchForm();
   
   if(this.data){
      
    this.registerObj=this.data.registerObj;
    this.RegId= this.registerObj.RegId;
      this.isDisabled=true
      // this.Prefix=this.data.registerObj.PrefixID;
     this.setDropdownObjs1();
  }
 
    this.getPrefixList();
    this.getMaritalStatusList();
    this.getReligionList();
    // this.getPatientTypeList();
    this.getAreaList();
    this.getCityList();
    this.getDoctor1List();
    this.getDoctor2List();
    
   
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
        Validators.pattern("^[A-Za-z] *[a-zA-Z]*$"),
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
      DateOfBirth: [{ value: this.registerObj.DateofBirth }],
      AgeYear: ['', [
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern("^[0-9]*$")]],
      AgeMonth: ['', [
        Validators.pattern("^[0-9]*$")]],
      AgeDay: ['', [

        Validators.pattern("^[0-9]*$")]],
      PhoneNo: ['',[Validators.minLength(10),
      Validators.maxLength(15),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      AadharCardNo: ['',Validators.compose( [Validators.minLength(12),
        Validators.maxLength(12),
        // Validators.required,
        Validators.pattern("^[0-9]+$"),
        
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

validateadhaarcard( input: any){
  console.log(input.value);
}


  // get f() { return this._registerService.mySaveForm.controls }

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
       return this.optionsPrefix.filter(option => option.PrefixName.toLowerCase().includes(filterValue));
    }

  }

  getPrefixList() {
    debugger
    this._registerService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.optionsPrefix = this.PrefixList.slice();
      this.filteredOptionsPrefix = this.personalFormGroup.get('PrefixID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterPrex(value) : this.PrefixList.slice()),
      );
      
    });
    this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);  
  }


  getCityList() {
    this._registerService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.personalFormGroup.get('CityId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCity(value) : this.cityList.slice()),
      );
      
    });
  }

  private _filterCity(value: any): string[] {
    if (value) {
      const filterValue = value && value.CityName ? value.CityName.toLowerCase() : value.toLowerCase();
      return this.optionsCity.filter(option => option.CityName.toLowerCase().includes(filterValue));
    }

  }

  getPatientTypeList() {
    this._registerService.getPatientTypeCombo().subscribe(data => { this.PatientTypeList = data; })
  }

  
  getAreaList() {

    this._registerService.getAreaCombo().subscribe(data => {
      this.AreaList = data;
      this.filteredArea.next(this.AreaList.slice());

      if(this.data){
        const ddValue = this.AreaList.find(c => c.AreaId == this.data.registerObj.AreaId);
        this.personalFormGroup.get('AreaId').setValue(ddValue); 
      }
    });
  }

  getMaritalStatusList() {
     this._registerService.getMaritalStatusCombo().subscribe(data => {
      this.MaritalStatusList = data;
      this.filteredMaritalstatus.next(this.MaritalStatusList.slice());
      if(this.data){
        const ddValue = this.MaritalStatusList.find(c => c.MaritalStatusId == this.data.registerObj.MaritalStatusId);
        this.personalFormGroup.get('MaritalStatusId').setValue(ddValue);
      } 
    });
  }

  getReligionList() {
   
    this._registerService.getReligionCombo().subscribe(data => {
      this.ReligionList = data;
      this.filteredReligion.next(this.ReligionList.slice());
      if(this.data){
         const ddValue = this.ReligionList.find(c => c.ReligionId == this.data.registerObj.ReligionId);
     this.personalFormGroup.get('ReligionId').setValue(ddValue); 
      }
    });
  }


  getGendorMasterList() {
    this._registerService.getGenderMasterCombo().subscribe(data => {
      this.GenderList = data;
     const ddValue = this.GenderList.find(c => c.GenderId == this.data.registerObj.GenderId);
     this.personalFormGroup.get('GenderId').setValue(ddValue);  
    })
  }



  getcityList() {
    this._registerService.getCityList().subscribe(data => {
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
  
  onChangeCityList(obj) {
    debugger
        // if (obj.CityId > 0) {
          // if (this.registerObj.CityId! = 0) {
          //   CityId = this.registerObj.CityId
          // }
          this._registerService.getStateList(obj.CityId).subscribe(data => {
            this.stateList = data;
            this.selectedState = this.stateList[0].StateName;
            this.selectedStateID = this.stateList[0].StateId;
            // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
            this.personalFormGroup.get('StateId').setValue(this.stateList[0]);
            this.onChangeCountryList(this.selectedStateID);
          });
        // } else {
        //   this.selectedState = null;
        //   this.selectedStateID = null;
        //   this.selectedCountry = null;
        //   this.selectedCountryID = null;
        // }
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


  onChangeGenderList(prefixObj) {
    if(prefixObj) {
      this._registerService.getGenderCombo(prefixObj.PrefixID).subscribe(data => {
        this.GenderList = data;
        this.personalFormGroup.get('GenderId').setValue(this.GenderList[0]);
        
        this.selectedGenderID = this.GenderList[0].GenderId;
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
        this.setDropdownObjs1();
        
      }
        });
  }

    

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }

  getSelectedObj(obj) {
      
    // let a, b, c;

    // a = obj.AgeDay.trim();
    // b = obj.AgeMonth.trim();
    // c = obj.AgeYear.trim();
    // console.log(a, b, c);
    obj.AgeDay =  obj.AgeDay.trim();
    obj.AgeMonth =obj.AgeMonth.trim();
    obj.AgeYear = obj.AgeYear.trim();

    this.registerObj = obj;

    this.setDropdownObjs1();
  }


  setDropdownObjs1() {
   
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
    // this.dialogRef.close();
    
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
  onSubmit() {
   debugger
    this.isLoading = 'submit';
    if (!this.registerObj.RegId) {
      var m_data = {
        "opdRegistrationSave": {
          "RegID": 0,
          "RegDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
          "RegTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "PrefixId": this.personalFormGroup.get('PrefixID').value.PrefixID,
          "FirstName": this.registerObj.FirstName || "",
          "MiddleName": this.registerObj.MiddleName || "",
          "LastName": this.registerObj.LastName || "",
          "Address": this.registerObj.Address || "",
          "City": this.personalFormGroup.get('CityId').value.CityId || 0,
          "PinNo": '0',// this._registerService.mySaveForm.get("PinNo").value || "0",
          "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
          "Age": this.registerObj.AgeYear || 0,//this._registerService.mySaveForm.get("Age").value || "0",
          "GenderID": this.personalFormGroup.get('GenderId').value.GenderId || 0,
          "PhoneNo": this.registerObj.PhoneNo || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this.registerObj.MobileNo || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "AddedBy": this.accountService.currentUserValue.user.id,
          "UpdatedBy":this.accountService.currentUserValue.user.id,
          "AgeYear": this.registerObj.AgeYear || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "AgeMonth": this.registerObj.AgeMonth || "0",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          "AgeDay": this.registerObj.AgeDay || "0",// this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this.personalFormGroup.get('CountryId').value.CountryId,
          "StateId": this.personalFormGroup.get('StateId').value.StateId,
          "CityId": this.personalFormGroup.get('CityId').value.CityId,
          "MaritalStatusId":this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0,
          "IsCharity": false,//Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          "ReligionId": this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0,
          "AreaId": this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
          "isSeniorCitizen":0,
          "Aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
          "pancardno": this.personalFormGroup.get('PanCardNo').value ? this.personalFormGroup.get('PanCardNo').value : 0,
        }
      }
      console.log(m_data);
      this._registerService.regInsert(m_data).subscribe(response => {
        if (response) {
     
          Swal.fire('Congratulations !', 'Register Data save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              }
          });
        } else {
                    Swal.fire('Error !', 'Register Data  not saved', 'error');
        }
      });
    }
    else {
      var m_data1 = {
        "opdRegistrationUpdate": {
          "RegID": this.registerObj.RegId,
           "PrefixId": this.personalFormGroup.get('PrefixID').value.PrefixID,
          "FirstName": this.registerObj.FirstName || "",
          "MiddleName": this.registerObj.MiddleName || "",
          "LastName": this.registerObj.LastName || "",
          "Address": this.registerObj.Address || "",
          "City": this.personalFormGroup.get('CityId').value.CityName || 0,
          "PinNo": '222',// this._registerService.mySaveForm.get("PinNo").value || "0",
          "DateOfBirth": "2023-04-26T11:13:30.638Z",//this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
          "Age": this.registerObj.AgeYear || 0,//this._registerService.mySaveForm.get("Age").value || "0",
          "GenderID": this.personalFormGroup.get('GenderId').value.GenderId || 0,
          "PhoneNo": this.registerObj.PhoneNo || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this.registerObj.MobileNo || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "UpdatedBy": this.accountService.currentUserValue.user.id,
          "AgeYear": this.registerObj.AgeYear || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "AgeMonth": this.registerObj.AgeMonth || "0",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          "AgeDay": this.registerObj.AgeDay || "0",// this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this.personalFormGroup.get('CountryId').value.CountryId,
          "StateId": this.personalFormGroup.get('StateId').value.StateId,
          "CityId": this.personalFormGroup.get('CityId').value.CityId,
          "MaritalStatusId":this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0,
          "IsCharity":false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          // "ReligionId": this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0,
          // "AreaId": this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
          // "isSeniorCitizen":0,
          "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
          "pancardno": this.personalFormGroup.get('PanCardNo').value ? this.personalFormGroup.get('PanCardNo').value : 0,
        }
      }
      this._registerService.regUpdate(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Register Data Udated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              
            }
          });
        }

         else {
          Swal.fire('Error !', 'Register Data  not Updated', 'error');
        }

      });
    }
  }

  getOptionTextPrefix(option){
    return option.PrefixName;
  }


  getOptionTextCity(option) {
    return option.CityName;
  }
  onClose() {
    this.dialogRef.close();
  }

  createSearchForm() {
    return this.formBuilder.group({
      regRadio: ['registration'],
      RegId: [{ value: '', disabled: this.isRegSearchDisabled }]
    });
  }
  onChangeDateofBirth(DateOfBirth) {
    debugger
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
  onChangeIsactive(SiderOption){
   this.IsCharity= SiderOption.checked
    console.log(this.IsCharity);
  }

   myFunction(s) {
    this.snackmessage=s;
    console.log(s);
    console.log(this.snackmessage);
    var x = document.getElementById("snackbar");
    x.className = "show";
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 2000);
  }
}
