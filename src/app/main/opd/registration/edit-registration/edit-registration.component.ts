import { Component, ElementRef, EventEmitter, Inject, Input, OnInit, Output, SimpleChanges, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { RegInsert } from '../registration.component';
import { RegistrationService } from '../registration.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SearchPageComponent } from '../../op-search-list/search-page/search-page.component';

@Component({
  selector: 'app-edit-registration',
  templateUrl: './edit-registration.component.html',
  styleUrls: ['./edit-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EditRegistrationComponent implements OnInit {

  personalFormGroup: FormGroup;

  submitted = false;
  now = Date.now();
  searchFormGroup: FormGroup;
  isRegSearchDisabled: boolean = true;
  newRegSelected: any = 'registration';

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


  IsSaveupdate:any;
  IsSave:any;


  // prefix filter
  public bankFilterCtrl: FormControl = new FormControl();
  public filteredPrefix: ReplaySubject<any> = new ReplaySubject<any>(1);

  // city filter
  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

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

  constructor(public _registerService: RegistrationService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditRegistrationComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router)  
    {}


  ngOnInit(): void {

    this.IsSaveupdate="true";
  console.log(this.data)
   this.personalFormGroup = this.createPesonalForm();
   this.searchFormGroup = this.createSearchForm();
    // this.getHospitalList();
    this.getPrefixList();
    this.getMaritalStatusList();
    this.getReligionList();
    // this.getPatientTypeList();
    this.getAreaList();
    // this.getCityList();
    this.getcityList();
    this.getDoctor1List();
    this.getDoctor2List();
    // this.addEmptyRow();

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

    
    
      if(this.data){
        // this.IsSave="false";
        // this.IsSaveupdate='false';
        this.registerObj=this.data.registerObj;
      
        console.log( this.registerObj);
       
          // this.AgeYear = this.data.PatObj.AgeYear;
          this.Prefix=this.data.registerObj.PrefixID;
          // this.PatientName=this.data.PatObj.PatientName;
          // this.AdmissionDate=this.data.PatObj.AdmissionDate;
          // this.RelativeName= this.data.PatObj.RelativeName;
          // this.RelativeAddress= this.data.PatObj.RelativeAddress;
          // this.RelatvieMobileNo= this.data.PatObj.RelatvieMobileNo;
          this.setDropdownObjs1();
      }

      
  }

  closeDialog() {
    console.log("closed")
    //  this.dialogRef.close();
   // this.personalFormGroup.reset();
  }
  createPesonalForm() {
    return this.formBuilder.group({
      RegId: '',
      RegNo: '',
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
      AadharCardNo: ['', [
        // Validators.required,
        Validators.pattern("^[0-9]*$"),
        Validators.minLength(12),
        Validators.maxLength(12),
      ]],
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



  get f() { return this._registerService.mySaveForm.controls }

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

  addEmptyRow() { }
 
  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getHospitalList() {
    //this._registerService.getHospitalCombo().subscribe(data => { this.HospitalList = data; })
  }


  getPrefixList() {
    
      this._registerService.getPrefixCombo().subscribe(data => {
      this.PrefixList = data;
      this.filteredPrefix.next(this.PrefixList.slice());
        if(this.data){
      const ddValue = this.PrefixList.find(c => c.PrefixID == this.data.registerObj.PrefixID);
      this.personalFormGroup.get('PrefixID').setValue(ddValue);  
    }
     this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);   
    });
  }

  getCityList() {
    this._registerService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
    });
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
    // this._registerService.getMaritalStatusCombo().subscribe(data => { this.MaritalStatusList = data; })
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
      this.filteredCity.next(this.cityList.slice());
     if(this.data){
      const ddValue = this.cityList.find(c => c.CityId == this.data.registerObj.CityId);
     this.personalFormGroup.get('CityId').setValue(ddValue); 
     this.onChangeCityList(this.data.registerObj.CityId)
     }
    });
  }

  onChangeStateList(CityId) {
    if (CityId > 0) {
      this._registerService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        //  this._AdmissionService.myFilterform.get('StateId').setValue(this.selectedState);
      });
    }
  }
  onChangeCityList(CityId) {
    if (CityId > 0) {
      this._registerService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
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

    const dialogRef = this._matDialog.open(SearchPageComponent,
      {
        maxWidth: "90vw",
        maxHeight: "85vh", width: '100%', height: "100%"
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      if (result) {
        
        this.registerObj = result as RegInsert;
        this.setDropdownObjs1();
      }
      //this.getRegistrationList();
    });
  }

  getOptionText(option) {
    if (!option) return '';
    return option.FirstName + ' ' + option.LastName + ' (' + option.RegId + ')';
  }

  getSelectedObj(obj) {
    
    console.log('obj==', obj);
    
    let a, b, c;

    a = obj.AgeDay.trim();;
    b = obj.AgeMonth.trim();
    c = obj.AgeYear.trim();
    console.log(a, b, c);
    obj.AgeDay = a;
    obj.AgeMonth = b;
    obj.AgeYear = c;

    this.registerObj = obj;

    // this.setDropdownObjs();
  }


  setDropdownObjs1() {
    debugger;
    
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

    // const toSelectMat = this.cityList.find(c => c.CityId == this.registerObj.CityId);
    // this.personalFormGroup.get('CityId').setValue(toSelectCity);


    this.onChangeGenderList(this.personalFormGroup.get('PrefixID').value);
    
    this.onChangeCityList(this.registerObj.CityId);
    
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
    debugger;
    let reg = this.registerObj.RegId;
    this.isLoading = 'submit';

    if (!reg) {
      var m_data = {
        "opdRegistrationSave": {
          "RegId": 0,
          "RegDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
          "RegTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "PrefixId": this.personalFormGroup.get('PrefixID').value.PrefixID,
          "FirstName": this.registerObj.FirstName || "",
          "MiddleName": this.registerObj.MiddleName || "",
          "LastName": this.registerObj.LastName || "",
          "Address": this.registerObj.Address || "",
          "City": this.personalFormGroup.get('CityId').value.CityId || 0,
          "PinNo": '222',// this._registerService.mySaveForm.get("PinNo").value || "0",
          "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
          "Age": this.registerObj.AgeYear || 0,//this._registerService.mySaveForm.get("Age").value || "0",
          "GenderID": this.personalFormGroup.get('GenderId').value.GenderId || 0,
          "PhoneNo": this.registerObj.PhoneNo || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this.registerObj.MobileNo || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "AddedBy": this.accountService.currentUserValue.user.id,
          "UpdatedBy":0,
          "AgeYear": this.registerObj.AgeYear || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "AgeMonth": this.registerObj.AgeMonth || "0",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          "AgeDay": this.registerObj.AgeDay || "0",// this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this.personalFormGroup.get('CountryId').value.CountryId,
          "StateId": this.personalFormGroup.get('StateId').value.StateId,
          "CityId": this.personalFormGroup.get('CityId').value.CityId,
          "MaritalStatusId":this.personalFormGroup.get('MaritalStatusId').value ? this.personalFormGroup.get('MaritalStatusId').value.MaritalStatusId : 0,
          "IsCharity":false,// Boolean(JSON.parse(this.personalFormGroup.get("IsCharity").value)) || "0",
          "ReligionId": this.personalFormGroup.get('ReligionId').value ? this.personalFormGroup.get('ReligionId').value.ReligionId : 0,
          "AreaId": this.personalFormGroup.get('AreaId').value ? this.personalFormGroup.get('AreaId').value.AreaId : 0,
          "isSeniorCitizen":0,
          // "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
          // "pancardno": this.personalFormGroup.get('PanCardNo').value ? this.personalFormGroup.get('PanCardNo').value : 0,
        }
      }
      console.log(m_data);
      this._registerService.regInsert(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Register Data save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
               this.addEmptyRow();
               
            }
          });
        } else {
          Swal.fire('Error !', 'Register Data  not saved', 'error');
        }

      });
    }
    else {
      debugger;
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
          // "aadharcardno": this.personalFormGroup.get('AadharCardNo').value ? this.personalFormGroup.get('AadharCardNo').value : 0,
          // "pancardno": this.personalFormGroup.get('PanCardNo').value ? this.personalFormGroup.get('PanCardNo').value : 0,
        }
      }
      console.log(m_data1);
      this._registerService.regUpdate(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Register Data Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'Register Data  not saved', 'error');
        }

      });
    }


    // console.log(this.personalFormGroup.invalid && this.IsSave);
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
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      // this.registerObj.AgeYear = Math.floor((timeDiff / (1000 * 3600 * 24)) / 365.25);
      // this.registerObj.AgeMonth = Math.abs(todayDate.getMonth() - dob.getMonth());
      // this.registerObj.AgeDay = Math.abs(todayDate.getDate() - dob.getDate());
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
}
