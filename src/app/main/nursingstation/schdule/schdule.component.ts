import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { NursingstationService } from '../nursingstation.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { fuseAnimations } from '@fuse/animations';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-schdule',
  templateUrl: './schdule.component.html',
  styleUrls: ['./schdule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class SchduleComponent implements OnInit {

  selectedAdvanceObj: RegInsert;
Datecount:any;

DateList: any = [];

 
  hasSelectedContacts: boolean;
  ConfigcityList: any = [];
  cityList: any = [];
  PrefixList: any = [];
  _cityList: any = [];
  selectedState = "";
  selectedStateID: any;
  stateList: any = [];
  ReligionList: any = [];
  MaritalStatusList: any = [];
  PatientTypeList: any = [];
  RelationshipList: any = [];
  TariffList: any = [];
  selectedCountry: any;
  selectedCountryID: any;
  countryList: any = [];
  getAppointmentList = [];
  AreaList: any = [];
  GenderList: any = [];
  DepartmentList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  Doctor2List: any = [];
  WardList: any = [];
  BedList: any = [];
  BedClassList: any = [];
  HospitalList: any = [];
  CompanyList: any = [];
  SubTPACompList: any = [];
  selectedGender = "";
  selectedGenderID: any;
  capturedImage: any;
  personalFormGroup: FormGroup;
  hospitalFormGroup: FormGroup;
  // registerObj = new AdmissionPersonlModel({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
  selectedHName: any;
  selectedPrefixId: any;
  buttonColor: any;
  isCompanySelected: boolean = false;
  public now: Date = new Date();
  isLoading: string = '';
  screenFromString = 'admission-form';
  submitted = false;
  sIsLoading: string = '';
  minDate: Date;

  displayedColumns = [

    'AppDate',
    'Cnt',

  ];
  dataSource = new MatTableDataSource<PhoneschlistMaster>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _AppointmentService: NursingstationService,
    public formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored,
    
    // public dialogRef: MatDialogRef<SchduleComponent>,
    public datePipe: DatePipe) {
    // dialogRef.disableClose = true;
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();


  ngOnInit(): void {

    if (this.advanceDataStored.storage) {
      this.selectedAdvanceObj = this.advanceDataStored.storage;

    }


    this.personalFormGroup = this.createPesonalForm();
    this.getDepartmentList();
    this.minDate = new Date();

    this.doctorFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDoctor();
      });

    this.departmentFilterCtrl.valueChanges
      .pipe(takeUntil(this._onDestroy))
      .subscribe(() => {
        this.filterDepartment();
      });
    this.getPhoneschduleList();
  }


  get f() { return this.personalFormGroup.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  createPesonalForm() {
    return this.formBuilder.group({
      AppointmentDate: [(new Date()).toISOString()],
      phoneAppId: '',
      AppDate: '',
      AppTime: '',
      seqNo: '',
      FirstName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      MiddleName: ['', [

        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      LastName: ['', [
        Validators.required,
        Validators.pattern("^[A-Za-z]*[a-zA-Z]*$"),
      ]],
      Address: ['', Validators.required],
      PhAppDate: '',
      PhAppTime: '',
      DepartmentId: '',
      Departmentid: '',
      MobileNo: ['', [Validators.required,
      Validators.minLength(10),
      Validators.maxLength(10),
      Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")
      ]],
      DoctorId: '',
      DoctorID: '',
      AddedBy: '',
      UpdatedBy: '',
      PhoneAppId: '',
      isCancelled: '',
      isCancelledBy: '',
      isCancelledDate: '',
      regNo: '',
    });
  }



  private filterDepartment() {
    // debugger;
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



  OnChangeDoctorList(departmentObj) {
    console.log(departmentObj);
    this._AppointmentService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(data => { this.DoctorList = data; })
    console.log(this.DoctorList);
  }


  getDepartmentList() {
    this._AppointmentService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  onChangeAppointmentList(e,m){
  
    Swal.fire(e);
    Swal.fire(m);
  }

  date: Date;
  date1: any;
  OnSubmit() {
debugger;
  
    let j = 5;

    this.date = new Date();
    

    for (let i = 0; i < 5; i++) {
      
      debugger;
     this.date.setDate( this.date.getDate() + j );

     let s =this.date.getDate();
     console.log(s);

      console.log(this.datePipe.transform(this.date,"M-dd-yyyy"));

      this.DateList.push(this.datePipe.transform(this.date,"M-dd-yyyy"));
          

      this.Datecount=i;
      j = j + 5;

    }
    console.log(this.DateList);

    console.log(this.personalFormGroup.get('AppointmentDate').value.Date);
    debugger;
    var m_data = {
      "phoneAppointmentInsert": {
        "phoneAppId": 0,
        "appDate": this.dateTimeObj.date,// this.personalFormGroup.get('AppointmentDate').date.value || "2021-03-31",
        "appTime": this.dateTimeObj.time,//this.personalFormGroup.get('AppTime').value || "2021-03-31",
        "firstName": this.personalFormGroup.get('FirstName').value || '',
        "middleName": this.personalFormGroup.get('MiddleName').value || '',
        "lastName": this.personalFormGroup.get('LastName').value || '',
        "address": this.personalFormGroup.get('Address').value || '',
        "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
        "phAppDate": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
        "phAppTime": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),

        // "phAppDate":this.datePipe.transform (this.personalFormGroup.get('AppointmentDate').value,"yyyy-MM-dd 00:00:00.000"), 
        // "phAppTime":this.datePipe.transform (this.personalFormGroup.get('AppointmentDate').value,"yyyy-MM-dd 00:00:00.000"), 

        "departmentId": this.personalFormGroup.get('Departmentid').value.Departmentid || 0,
        "doctorId": this.personalFormGroup.get('DoctorId').value.DoctorId || 0,
        "addedBy": this.accountService.currentUserValue.user.id,

      }

    }
    console.log(m_data);
    // this._AppointmentService.PhoneAppointInsert(m_data).subscribe(response => {
    //   if (response) {
    //     Swal.fire('Congratulations !', 'Phone Appointment Data save Successfully !', 'success').then((result) => {
    //       if (result.isConfirmed) {
    //         this._matDialog.closeAll();

    //       }
    //     });
    //   } else {
    //     Swal.fire('Error !', 'Register Data  not saved', 'error');
    //   }
    //   // this.isLoading = '';

    // });

  }


  OnCancle() {
    var m_data = {
      "phoneAppointmentCancle": {
        "PhoneAppId": 0,

      }

    }
    console.log(m_data);
    // this._AppointmentService.PhoneAppointCancle(m_data).subscribe(response => {
    //   if (response) {
    //     Swal.fire('Congratulations !', 'Phone Appointment Cancle Successfully !', 'success').then((result) => {
    //       if (result.isConfirmed) {
    //         this._matDialog.closeAll();
    //       }
    //     });
    //   } else {
    //     Swal.fire('Error !', 'Register Data  not saved', 'error');
    //   }
    //   // this.isLoading = '';

    // });

  }


  onClose() {
    this.personalFormGroup.reset();
    // this.dialogRef.close();
  }


  getPhoneschduleList() {
    this.sIsLoading = 'loading-data';
    var m_data = {

    }

    this._AppointmentService.getappschdulelist(m_data).subscribe(Visit => {
      this.dataSource.data = Visit as PhoneschlistMaster[];
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  changec() {

    this.buttonColor = 'red';
    // this.buttonColor: ThemePalette = 'primary';
  }
}



export class PhoneschlistMaster {
  AppDate: Date;
  Cnt: string;

  /**
   * Constructor
   *
   * @param contact
   */
  constructor(PhoneschlistMaster) {
    {
      this.AppDate = PhoneschlistMaster.AppDate || '';
      this.Cnt = PhoneschlistMaster.Cnt || '';

    }
  }
}