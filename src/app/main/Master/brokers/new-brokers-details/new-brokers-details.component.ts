import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { InvoiceListService } from 'app/main/Invoice/invoice-list.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-new-brokers-details',
  templateUrl: './new-brokers-details.component.html',
  styleUrls: ['./new-brokers-details.component.scss']
})
export class NewBrokersDetailsComponent implements OnInit {

  
  now = Date.now();
  searchFormGroup: FormGroup;
  cityList: any = [];
  stateList: any = [];
  countryList: any = [];
  selectedState = "";
  VisitTime: String;
  selectedStateID: any;
  selectedCountry: any;
  selectedCountryID: any;
  isLoading: any;
  seelctedHospID: any;
  registerObj:any;
  //registerObj = new RegInsert({});
  // prefix filter
  
  // city filter
  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

  
  private _onDestroy = new Subject<void>();


  options = [];

  // @Input() childName: string[];
  // @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  matDialogRef: any;

  constructor(public _MasterService: MasterService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewBrokersDetailsComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router)  
    {}


  ngOnInit(): void {
  console.log(this.data)
    this.getcityList();
  
  
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCity();
      });

   
    
      
  }

  closeDialog() {
    console.log("closed")
     this.dialogRef.close();
   // this._MasterService.accountmasterform.reset();
  }
 


  // get f() { return this._registerService.mySaveForm.controls }

 
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
  

  
  
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

 


 
  getCityList() {
    this._MasterService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
    });
  }


  getcityList() {
    this._MasterService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
     if(this.data){
      const ddValue = this.cityList.find(c => c.CityId == this.data.registerObj.CityId);
     this._MasterService.accountmasterform.get('CityId').setValue(ddValue); 
     this.onChangeCityList(this.data.registerObj.CityId)
     }
    });
  }

  onChangeStateList(CityId) {
    if (CityId > 0) {
      this._MasterService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        //  this._AdmissionService.myFilterform.get('StateId').setValue(this.selectedState);
      });
    }
  }
  onChangeCityList(CityId) {
    if (CityId > 0) {
      this._MasterService.getStateList(CityId).subscribe(data => {
        this.stateList = data;
        this.selectedState = this.stateList[0].StateName;
        this.selectedStateID = this.stateList[0].StateId;
        // const stateListObj = this.stateList.find(s => s.StateId == this.selectedStateID);
        // this._MasterService.accountmasterform.get('StateId').setValue(this.stateList[0]);
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
      this._MasterService.getCountryList(StateId).subscribe(data => {
        this.countryList = data;
        this.selectedCountry = this.countryList[0].CountryName;
        // this._MasterService.accountmasterform.get('CountryId').setValue(this.countryList[0]);
        // this._MasterService.accountmasterform.updateValueAndValidity();
      });
    }
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
    
    
    const toSelectCity = this.cityList.find(c => c.CityId == this.registerObj.CityId);
    this._MasterService.accountmasterform.get('CityId').setValue(toSelectCity);
//this.onChangeCityList(this.registerObj.CityId);
    
    this._MasterService.accountmasterform.updateValueAndValidity();

    
  }

 



  onSubmit() {
    debugger;
    let reg = 0;//this.registerObj.RegId;
    this.isLoading = 'submit';

    if (!reg) {
      var m_data = {
        "opdRegistrationSave": {
          "RegId": 0,// this._registerService.mySaveForm.get("RegId").value || "0",
          "RegDate": this.dateTimeObj.date, //this.datePipe.transform(this.dateTimeObj.date,"yyyy-Mm-dd") || opdRegistrationSave"2021-03-31",// this.dateTimeObj.date,//
          "RegTime": this.dateTimeObj.time, // this._registerService.mySaveForm.get("RegTime").value || "2021-03-31T12:27:24.771Z",
          "PrefixId": this._MasterService.accountmasterform.get('PrefixID').value.PrefixID,
          "FirstName": this.registerObj.FirstName || "",
          "MiddleName": this.registerObj.MiddleName || "",
          "LastName": this.registerObj.LastName || "",
          "Address": this.registerObj.Address || "",
          "City": this._MasterService.accountmasterform.get('CityId').value.CityId || 0,
          "PinNo": '222',// this._registerService.mySaveForm.get("PinNo").value || "0",
          "DateOfBirth": this.datePipe.transform(this.registerObj.DateofBirth, "MM-dd-yyyy"),// this.registerObj.DateofBirth || "2021-03-31",
          // "DateOfBirth": this.datePipe.transform(this._MasterService.accountmasterform.get("DateOfBirth").value,"MM-dd-yyyy") || '01/01/1900', 
          "Age": this.registerObj.AgeYear || 0,//this._registerService.mySaveForm.get("Age").value || "0",
          "GenderID": this._MasterService.accountmasterform.get('GenderId').value.GenderId || 0,
          "PhoneNo": this.registerObj.PhoneNo || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this.registerObj.MobileNo || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "AddedBy": this.accountService.currentUserValue.user.id,
          "UpdatedBy":0,
          "AgeYear": this.registerObj.AgeYear || "0",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "AgeMonth": this.registerObj.AgeMonth || "0",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          "AgeDay": this.registerObj.AgeDay || "0",// this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this._MasterService.accountmasterform.get('CountryId').value.CountryId,
          "StateId": this._MasterService.accountmasterform.get('StateId').value.StateId,
          "CityId": this._MasterService.accountmasterform.get('CityId').value.CityId,
          "MaritalStatusId":this._MasterService.accountmasterform.get('MaritalStatusId').value ? this._MasterService.accountmasterform.get('MaritalStatusId').value.MaritalStatusId : 0,
          "IsCharity":false,// Boolean(JSON.parse(this._MasterService.accountmasterform.get("IsCharity").value)) || "0",
          "ReligionId": this._MasterService.accountmasterform.get('ReligionId').value ? this._MasterService.accountmasterform.get('ReligionId').value.ReligionId : 0,
          "AreaId": this._MasterService.accountmasterform.get('AreaId').value ? this._MasterService.accountmasterform.get('AreaId').value.AreaId : 0,
          "isSeniorCitizen":0,
          "aadharcardno": this._MasterService.accountmasterform.get('AadharCardNo').value ? this._MasterService.accountmasterform.get('AadharCardNo').value : 0,
          "pancardno": this._MasterService.accountmasterform.get('PanCardNo').value ? this._MasterService.accountmasterform.get('PanCardNo').value : 0,
        }
      }
      console.log(m_data);
      this._MasterService.accountInsert(m_data).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Account Data save Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
              //  this.addEmptyRow();
               
            }
          });
        } else {
          Swal.fire('Error !', 'Account Data  not saved', 'error');
        }

      });
    }
    else {
      debugger;
      var m_data1 = {

        "opdRegistrationUpdate": {
          // "RegId": this.registerObj.RegId,// this._registerService.mySaveForm.get("RegId").value || 0,
          "PrefixId": this._MasterService.accountmasterform.get('PrefixID').value.PrefixID || 0,
          "FirstName": this.registerObj.FirstName || "",
          "MiddleName": this.registerObj.MiddleName || "",
          "LastName": this.registerObj.LastName || "",
          "Address": this.registerObj.Address || "",
          "City": this._MasterService.accountmasterform.get('CityId').value.CityId || 0,
          "PinNo": '222',// this._registerService.mySaveForm.get("PinNo").value || "0",
          "DateofBirth": this.registerObj.DateofBirth, //this.datePipe.transform(this._MasterService.accountmasterform.get("DateOfBirth").value,"MM-dd-yyyy") || this.registerObj.DateofBirth, 
          "Age": this.registerObj.AgeYear || 0,
          "GenderID": this._MasterService.accountmasterform.get('GenderId').value.GenderId || 0,
          "PhoneNo": this.registerObj.PhoneNo || "",// this._registerService.mySaveForm.get("PhoneNo").value || "0",
          "MobileNo": this.registerObj.MobileNo || "",// this._registerService.mySaveForm.get("MobileNo").value || "0",
          "UpdatedBy": this.accountService.currentUserValue.user.id,
          "AgeYear": this.registerObj.AgeYear || "",// this._registerService.mySaveForm.get("AgeYear").value.trim() || "%",
          "AgeMonth": this.registerObj.AgeMonth || "",// this._registerService.mySaveForm.get("AgeMonth").value.trim() || "%",
          "AgeDay": this.registerObj.AgeDay || "", // this._registerService.mySaveForm.get("AgeDay").value.trim() || "%",
          "CountryId": this._MasterService.accountmasterform.get('CountryId').value.CountryId || 0,
          "StateId": this._MasterService.accountmasterform.get('StateId').value.StateId || 0,
          "CityId": this._MasterService.accountmasterform.get('CityId').value.CityId || 0,
          "MaritalStatusId": this._MasterService.accountmasterform.get('MaritalStatusId').value.MaritalStatusId ? this._MasterService.accountmasterform.get('MaritalStatusId').value.MaritalStatusId : 0 || 0,
          "ReligionId": this._MasterService.accountmasterform.get('ReligionId').value.ReligionId ? this._MasterService.accountmasterform.get('ReligionId').value.ReligionId : 0 || 0,
          "IsCharity":this._MasterService.accountmasterform.get("IsCharity").value || 0,

        }
      }
      console.log(m_data1);
      this._MasterService.accountUpdate(m_data1).subscribe(response => {
        if (response) {
          Swal.fire('Congratulations !', 'Account Data Updated Successfully !', 'success').then((result) => {
            if (result.isConfirmed) {
              this._matDialog.closeAll();
            }
          });
        } else {
          Swal.fire('Error !', 'Account Data  not saved', 'error');
        }

      });
    }
  }


  // onClose() {
   
  //    this.dialogRef.close();
  // }

 
 
  IsCharity: any;
  onChangeIsactive(SiderOption){
   this.IsCharity= SiderOption.checked
    console.log(this.IsCharity);
  }
}

