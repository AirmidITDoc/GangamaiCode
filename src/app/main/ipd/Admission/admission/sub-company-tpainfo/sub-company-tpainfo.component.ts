import { Component, OnInit } from '@angular/core';
import { Admission } from '../admission.component';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sub-company-tpainfo',
  templateUrl: './sub-company-tpainfo.component.html',
  styleUrls: ['./sub-company-tpainfo.component.scss']
})
export class SubCompanyTPAInfoComponent implements OnInit {

  SubcompanyFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: Admission;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  CompanyList:any=[];
  cityList:any=[];
  //company filter
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);


  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    // public notification: NotificationServiceService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<SubCompanyTPAInfoComponent>,
    private router: Router
  ) { }

  ngOnInit(): void {


    this.getCompanyList();
    this.getCityList();

    this.SubcompanyFormGroup = this.createmlcForm();
    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;
      console.log(this.selectedAdvanceObj);
    }

    this.cityFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCity();
    });

    this.companyFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterCompany();
    });
  }

  createmlcForm() {
    return this.formBuilder.group({
      SubCompanyId : '',
      CompTypeId: '',
      CompanyId:'',
      CompanyName: '',
      Address: '',
      CityId:'',
      City: '',
      PinNo: '',
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      MobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      FaxNo: '',
      IsActive:''
    });
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
  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => { this.CompanyList = data; })
  }

  getCityList() {
    let cData = this._AdmissionService.getCityList().subscribe(data => {
      this.cityList = data;
      this.filteredCity.next(this.cityList.slice());
    });
  }
  onClose() {
    this.dialogRef.close();
  }

  //   onSubmit() {
  //     this.dialogRef.close();
  //  }


 onSubmit() {

  this.submitted = true;
  this.isLoading = 'submit';
  let SubCompanyId =this.selectedAdvanceObj.SubCompanyId;
  if(!SubCompanyId){
  var m_data = {
    "insertsubcompanyTPA": {
     "CompTypeId": this.SubcompanyFormGroup.get("CompTypeId").value || 0,
       "CompanyName": this.SubcompanyFormGroup.get("CompanyId").value.CompanyName || '',
      "Address": this.SubcompanyFormGroup.get("Address").value || 0,
      "City": this.SubcompanyFormGroup.get("CityId").value.CityName || '',
      "PinNo": this.SubcompanyFormGroup.get("PinNo").value || '%',
      "PhoneNo": this.SubcompanyFormGroup.get("PhoneNo").value || '%',
       "MobileNo": this.SubcompanyFormGroup.get("MobileNo").value || '',
      "FaxNo": this.SubcompanyFormGroup.get("FaxNo").value || 0,
      "IsActive": this.SubcompanyFormGroup.get("IsActive").value || 'true',
      "AddedBy": this.accountService.currentUserValue.user.id,
      "IsCancelled":0,
      "IsCancelledBy":0,
      "IsCancelledDate":this.dateTimeObj.date
    }

  }
    console.log(m_data);
  this._AdmissionService.subcompanyTPAInsert(m_data).subscribe(response => {
    if (response) {
      Swal.fire('Congratulations !', 'SubcompanyTPA Information save Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
          let m = response;
          this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'SubcompanyTPA Information  not saved', 'error');
    }
    this.isLoading = '';
  });


}
else{
  debugger;
  var m_data1 = {
    "updatesubcompanyTPA": {
      "SubCompanyId": SubCompanyId || 0,
      "CompTypeId": this.SubcompanyFormGroup.get("CompTypeId").value || 0,
       "CompanyName": this.SubcompanyFormGroup.get("CompanyId").value.CompanyName || '',
      "Address": this.SubcompanyFormGroup.get("Address").value || 0,
      "City": this.SubcompanyFormGroup.get("CityId").value.CityName || '',
      "PinNo": this.SubcompanyFormGroup.get("PinNo").value || '%',
      "PhoneNo": this.SubcompanyFormGroup.get("PhoneNo").value || '%',
       "MobileNo": this.SubcompanyFormGroup.get("MobileNo").value || '',
      "FaxNo": this.SubcompanyFormGroup.get("FaxNo").value || 0,
      "IsActive":  this.SubcompanyFormGroup.get("IsActive").value || '',
      "UpdatedBy": this.accountService.currentUserValue.user.id,
      "IsCancelled":0,
      "IsCancelledBy":0,
      "IsCancelledDate":this.dateTimeObj.date
    }

  }
    console.log(m_data1);
  this._AdmissionService.subcompanyTPAUpdate(m_data1).subscribe(response => {
    if (response) {
      Swal.fire('Congratulations !', 'SubcompanyTPA Information Update Successfully !', 'success').then((result) => {
        if (result.isConfirmed) {
          let m = response;
          this._matDialog.closeAll();
        }
      });
    } else {
      Swal.fire('Error !', 'SubcompanyTPA Information  not Update', 'error');
    }
    this.isLoading = '';
  });
}

}


  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
}

