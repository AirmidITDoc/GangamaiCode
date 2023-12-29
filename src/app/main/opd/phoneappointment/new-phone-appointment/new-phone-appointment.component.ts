import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-new-phone-appointment',
  templateUrl: './new-phone-appointment.component.html',
  styleUrls: ['./new-phone-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPhoneAppointmentComponent implements OnInit {

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

  isDepartmentSelected:boolean=false;
  isDoctorSelected:boolean=false;

  
  optionsDep: any[] = [];
  optionsDoc: any[] = [];

  filteredOptionsDep: Observable<string[]>;
  filteredOptionsDoc: Observable<string[]>;
  

  displayedColumns = [

    'AppDate',
    'Cnt',

  ];
  dataSource = new MatTableDataSource<PhoneschlistMaster>();
  isChecked = true;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _phoneAppointListService: PhoneAppointListService,
    public formBuilder: FormBuilder,
    public _matDialog: MatDialog,
    private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewPhoneAppointmentComponent>,
    public datePipe: DatePipe) {
  }


  doctorNameCmbList: any = [];

  public doctorFilterCtrl: FormControl = new FormControl();
  public filteredDoctor: ReplaySubject<any> = new ReplaySubject<any>(1);

  //department filter
  public departmentFilterCtrl: FormControl = new FormControl();
  public filteredDepartment: ReplaySubject<any> = new ReplaySubject<any>(1);

  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
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

  getOptionTextDep(option) {
    return option.departmentName;
  }

  getOptionTextDoc(option) {
    
    return option && option.Doctorname ? option.Doctorname : '';
    
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

  // OnChangeDoctorList(departmentObj) {
  //   this._phoneAppointListService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(data => { this.DoctorList = data; })
  // }

  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.Doctorname ? value.Doctorname.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
    }
    // const filterValue = value.toLowerCase();
    // this.isDoctorSelected = false;
    // return this.optionsDoc.filter(option => option.Doctorname.toLowerCase().includes(filterValue));
  }


  OnChangeDoctorList(departmentObj) {
  
    this.isDepartmentSelected = true;
    this._phoneAppointListService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        console.log(this.DoctorList);
        // this.filteredDoctor.next(this.DoctorList.slice());
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.personalFormGroup.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
  }



   private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.departmentName ? value.departmentName.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.departmentName.toLowerCase().includes(filterValue));
    }

  }



  getDepartmentList() {
    this._phoneAppointListService.getDepartmentCombo().subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.personalFormGroup.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  OnSubmit() {
    console.log(this.personalFormGroup.get('AppointmentDate').value.Date);
    var m_data = {
      "phoneAppointmentInsert": {
        "phoneAppId": 0,
        "RegNo":'',
        "appDate": this.dateTimeObj.date,// this.personalFormGroup.get('AppointmentDate').date.value || "2021-03-31",
        "appTime": this.dateTimeObj.time,//this.personalFormGroup.get('AppTime').value || "2021-03-31",
        "firstName": this.personalFormGroup.get('FirstName').value || '',
        "middleName": this.personalFormGroup.get('MiddleName').value || '',
        "lastName": this.personalFormGroup.get('LastName').value || '',
        "address": this.personalFormGroup.get('Address').value || '',
        "mobileNo": this.personalFormGroup.get('MobileNo').value || '',
        "phAppDate": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
        "phAppTime": this.datePipe.transform(this.personalFormGroup.get('AppointmentDate').value, "yyyy-MM-dd 00:00:00.000"),
        "departmentId": this.personalFormGroup.get('Departmentid').value.Departmentid || 0,
        "doctorId": this.personalFormGroup.get('DoctorId').value.DoctorId || 0,
        "addedBy": this.accountService.currentUserValue.user.id,
        "UpdatedBy": this.accountService.currentUserValue.user.id,
      }
    }
    console.log(m_data);
    this._phoneAppointListService.PhoneAppointInsert(m_data).subscribe(response => {
      if (response) {
        Swal.fire('Record Save !', 'Phone Appointment Data save Successfully !', 'success').then((result) => {
          if (result.isConfirmed) {
            this._matDialog.closeAll();
          }
        });
      } else {
        Swal.fire('Error !', 'Register Data  not saved', 'error');
      }
      // this.isLoading = '';
    });
  }

  onClose() {
    this.personalFormGroup.reset();
    this.dialogRef.close();
  }


  getPhoneschduleList() {
    this.sIsLoading = 'loading-data';
    this._phoneAppointListService.getPhoenappschdulelist().subscribe(Visit => {
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
    // console.log('dateTimeObj==', dateTimeObj);
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