import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MasterService } from '../../master.service';

@Component({
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.scss']
})
export class EditAccountComponent implements OnInit {

  Account:any;
   
  submit(){
    this.Account=this._MasterService.accountmaster.get("AccountType").value;
     }

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
  
  registerObj:any;
  screenFromString = 'registration';

  AccountId:any;
  AccountType:any;
  Name:any;  
  PartyName:any;
  BrokerName:any;
  ContactPerson:any;
  Mobile:any;
  EMail:any;
  Website:any;
  BAddress:any;
  City:any;
  pin:any;
  District:any;
  State:any;
  Country:any;
  GSTno:any;
  PanNo:any;
  CINNo:any;
  StateId:any;
  CountryId:any;
  CityId:any;
  OpeningBalance:any;
  CreditDebit
  //registerObj = new RegInsert({});
  
  date1 = new FormControl(new Date())
  Today=[new Date().toISOString()];




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
    public dialogRef: MatDialogRef<EditAccountComponent>,
    private _snackBar: MatSnackBar,
    public datePipe: DatePipe,
    private router: Router)  
    {}


  ngOnInit(): void {
  console.log(this.data)

  if(this.data)
  {

    this.AccountId=this.data.registerObj.AccountId;
    this.AccountType=this.data.registerObj.AccountType;
    this.Name=this.data.registerObj.Name;
    this.PartyName=this.data.registerObj.Name;
  
    this.ContactPerson=this.data.registerObj.ContactPerson;
    this.Mobile=this.data.registerObj.Mobile;
    this.EMail=this.data.registerObj.EMail;
    this.Website=this.data.registerObj.Website;
    this.BAddress=this.data.registerObj.BAddress;
    this.City=this.data.registerObj.City;
    this.pin=this.data.registerObj.pin;
    this.District=this.data.registerObj.District;
    this.State=this.data.registerObj.State;
    this.Country=this.data.registerObj.Country;
    this.GSTno=this.data.registerObj.GSTno;
    this.PanNo=this.data.registerObj.PanNo;
    this.CINNo=this.data.registerObj.CINNo;
    this.CreditDebit=this.data.registerObj.CreditDebit;
    this.OpeningBalance=this.data.registerObj.OpeningBalance;
  }
    // this.getcityList();
  
  
    this.cityFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterCity();
      });

   
    
      
  }

  closeDialog() {
    console.log("closed")
     this.dialogRef.close();
   // this._MasterService.accountmaster.reset();
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
    this._MasterService.accountmaster.get('CityId').setValue(toSelectCity);
//this.onChangeCityList(this.registerObj.CityId);
    
    this._MasterService.accountmaster.updateValueAndValidity();

    
  }

 

  onClose() {
    this.dialogRef.close();
  }

  onSubmit(){

  
    this.isLoading = 'submit';

    console.log()
  
     
        var m_data = {
         "updatePartyAccount": {
          "operation": "UPDATE",
            "AccountId":this.data.registerObj.AccountId,
            "AccountType": this._MasterService.accountmaster.get('AccountType').value || '',
            "Name": this._MasterService.accountmaster.get('PartyName').value || 0,
            "ContactPerson": this._MasterService.accountmaster.get('ContactPerson').value || '',
            "ContactNo": this._MasterService.accountmaster.get('Mobile').value || '',
            "EmailAddress": this._MasterService.accountmaster.get('EMail').value || '',
            
            "Website": this._MasterService.accountmaster.get('Website').value || 0,
            "BussAddress": this._MasterService.accountmaster.get('BAddress').value || 0,

            "City":  this._MasterService.accountmaster.get('City').value || '',
            "District": this._MasterService.accountmaster.get('District').value || '',
            "State": this._MasterService.accountmaster.get('State').value || 0,
            "Country": this._MasterService.accountmaster.get('Country').value || '',
            "PinCode": this._MasterService.accountmaster.get('pin').value || 0,
            "GSTN": this._MasterService.accountmaster.get('GSTno').value || '',
            "PAN": this._MasterService.accountmaster.get('PanNo').value || 0,
            "CIN": this._MasterService.accountmaster.get('CINNo').value || 0,

            "CreditDebit": this._MasterService.accountmaster.get('CreditDebit').value || 0,
            "OpeningBalance": parseInt(this._MasterService.accountmaster.get('OpeningBalance').value) || 0,

          
            "UpdatedBy":this.accountService.currentUserValue.user.id,
         
          }
        }
        console.log(m_data);
        this._MasterService.accountUpdate(m_data).subscribe(response => {
          if (response) {
            Swal.fire('Congratulations !', 'Account Master  Data  save Successfully !', 'success').then((result) => {
              if (result.isConfirmed) {
                this._matDialog.closeAll();

              }
            });
          } else {
            Swal.fire('Error !', 'Account Master Data  not saved', 'error');
          }

        });
      
      
  }


}