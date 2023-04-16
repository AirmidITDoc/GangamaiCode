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

@Component({
  selector: 'app-new-sizing-details',
  templateUrl: './new-sizing-details.component.html',
  styleUrls: ['./new-sizing-details.component.scss']
})
export class NewSizingDetailsComponent implements OnInit {

  
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
  screenFromString = 'registration';
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

  constructor(public _MasterService: InvoiceListService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<NewSizingDetailsComponent>,
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

