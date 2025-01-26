import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdmissionService } from '../admission.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { map, startWith, takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { AdmissionPersonlModel } from '../admission.component';



@Component({
  selector: 'app-sub-company-tpainfo',
  templateUrl: './sub-company-tpainfo.component.html',
  styleUrls: ['./sub-company-tpainfo.component.scss']
})
export class SubCompanyTPAInfoComponent implements OnInit {

  SubcompanyFormGroup: FormGroup;
  dateTimeObj: any;
  screenFromString = 'advance';
  selectedAdvanceObj: AdmissionPersonlModel;
  submitted: any;
  isLoading: any;
  AdmissionId: any;
  public value = new Date();
  CompanyList:any=[];
  cityList:any=[];
  filteredOptionsCity: Observable<string[]>;
  optionsCity: any[] = [];
  optionsCompany: any[] = [];
  isCitySelected: boolean = false;
  isCompanyselected: boolean = false;
  filteredOptionsCompany: Observable<string[]>;
  
  //company filter
  public companyFilterCtrl: FormControl = new FormControl();
  public filteredCompany: ReplaySubject<any> = new ReplaySubject<any>(1);


  public cityFilterCtrl: FormControl = new FormControl();
  public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  constructor(public _AdmissionService: AdmissionService,
    private formBuilder: UntypedFormBuilder,
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
      PinNo:['', Validators.required,
      Validators.minLength(5),
      Validators.pattern('[0-9]{7}')],
      PhoneNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      MobileNo: ['', [Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
      FaxNo: '',
      IsActive:''
    });
  }

  @ViewChild('phone') phone: ElementRef;
@ViewChild('mobile') mobile: ElementRef;
@ViewChild('company') company: ElementRef;
@ViewChild('fax') fax: ElementRef;
@ViewChild('pin') pin: ElementRef;


 
  
  public onEntercity(event): void {
    if (event.which === 13) {
      // if(this.company) this.company.focus();
      this.company.nativeElement.focus();
    }
  }

  public onEntercompany(event): void {
    if (event.which === 13) {
      this.phone.nativeElement.focus();
      
    }
  }
  
  public onEnterphone(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
    }
  }
  public onEntermobile(event): void {
    if (event.which === 13) {
    this.fax.nativeElement.focus();
    }
  }
  
  
  public onEnterfax(event): void {
    if (event.which === 13) {
      this.pin.nativeElement.focus();
    }
  }
  
  getCompanyList() {
    this._AdmissionService.getCompanyCombo().subscribe(data => {
      this.CompanyList = data;
      this.optionsCompany = this.CompanyList.slice();
      this.filteredOptionsCompany = this.SubcompanyFormGroup.get('CompanyId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterCompany(value) : this.CompanyList.slice()),
      );
      
    });
  }
  private _filterCompany(value: any): string[] {
    if (value) {
      const filterValue = value && value.CompanyName ? value.CompanyName.toLowerCase() : value.toLowerCase();
            return this.optionsCompany.filter(option => option.CompanyName.toLowerCase().includes(filterValue));
    }

  }
  getOptionTextCompany(option) {
    return option && option.CompanyName ? option.CompanyName : '';
  }

  
  getCityList() {
    this._AdmissionService.getCityList().subscribe(data => {
      this.cityList = data;
      this.optionsCity = this.cityList.slice();
      this.filteredOptionsCity = this.SubcompanyFormGroup.get('CityId').valueChanges.pipe(
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

  getOptionTextCity(option) {
    return option.CityName;
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
      "AddedBy": this.accountService.currentUserValue.userId,
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
  ;
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
      "UpdatedBy": this.accountService.currentUserValue.userId,
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

