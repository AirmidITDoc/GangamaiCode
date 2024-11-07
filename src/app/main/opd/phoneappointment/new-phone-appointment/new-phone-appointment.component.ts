import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { PhoneAppointListService } from '../phone-appoint-list.service';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-new-phone-appointment',
  templateUrl: './new-phone-appointment.component.html',
  styleUrls: ['./new-phone-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPhoneAppointmentComponent implements OnInit {
  phoneappForm: FormGroup
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
  vMobile: any;
  isDepartmentSelected: boolean = false;
  isDoctorSelected: boolean = false;

  vDepartmentid: any = '';
  vDoctorId: any = '';


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
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, private accountService: AuthenticationService,
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

    this.phoneappForm = this._phoneAppointListService.createphoneForm();
    var m_data = {
      phoneAppId: this.data?.phoneAppId,
      categoryName: this.data?.categoryName.trim(),
      appDate: this.data?.appDate,
      appTime: this.data?.appTime,
      firstName: this.data?.firstName.trim(),
      middleName: this.data?.middleName.trim(),
      lastName: this.data?.lastName.trim(),
      address: this.data?.address.trim(),
      mobileNo: this.data?.mobileNo.trim(),
      phAppDate: this.data?.phAppDate,
      phAppTime: this.data?.phAppTime,
      departmentId: this.data?.departmentId,
      doctorId: this.data?.doctorId,
      addedBy: this.data?.addedBy,
      updatedBy: this.data?.updatedBy,
      regNo: this.data?.regNo,
    };
    this.phoneappForm.patchValue(m_data);

  }


  get f() { return this.phoneappForm.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }




  getOptionTextDep(option) {

    return option && option.departmentName ? option.departmentName : '';
  }

  getOptionTextDoc(option) {

    return option && option.Doctorname ? option.Doctorname : '';

  }


  private filterDepartment() {

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

        // this.filteredDoctor.next(this.DoctorList.slice());
        this.optionsDoc = this.DoctorList.slice();
        this.filteredOptionsDoc = this.phoneappForm.get('doctorId').valueChanges.pipe(
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
      this.filteredOptionsDep = this.phoneappForm.get('departmentId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }

  OnSubmit() {
    debugger
    // if(!isNaN(this.vDepartmentid.Departmentid) && !isNaN(this.vDoctorId.DoctorId)){

    var m_data = {
      "phoneAppId": 0,
      "regNo": '',
      "appDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
      "appTime": this.dateTimeObj.time,
      "firstName": this.phoneappForm.get('firstName').value || '',
      "middleName": this.phoneappForm.get('middleName').value || '',
      "lastName": this.phoneappForm.get('lastName').value || '',
      "address": this.phoneappForm.get('address').value || '',
      "mobileNo": this.phoneappForm.get('mobileNo').value.toString() || '',
      "phAppDate": this.datePipe.transform(this.phoneappForm.get('phAppDate').value, "yyyy-MM-dd"),
      "phAppTime": this.dateTimeObj.time,// this.datePipe.transform(this.phoneappForm.get('phAppTime').value, "yyyy-MM-dd 00:00:00.000"),
      "departmentId": this.phoneappForm.get('departmentId').value || 0,
      "doctorId": this.phoneappForm.get('doctorId').value || 0,
      "addedBy": 1,// this.accountService.currentUserValue.user.id,
      "updatedBy": 1,// this.accountService.currentUserValue.user.id,

    }
    console.log(m_data);
    console.log(this.phoneappForm.value);


    this._phoneAppointListService.phoneMasterSave(m_data).subscribe((response) => {
      this.toastr.success(response.message);
      this.onClear(true);
    }, (error) => {
      this.toastr.error(error.message);
    });
  }
  onClear(val: boolean) {
    this.phoneappForm.reset();
    this.dialogRef.close(val);
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

    this.dateTimeObj = dateTimeObj;
  }

  onClose() { }

  @ViewChild('fname') fname: ElementRef;
  @ViewChild('mname') mname: ElementRef;
  @ViewChild('lname') lname: ElementRef;

  @ViewChild('Address') Address: ElementRef;
  @ViewChild('mobile') mobile: ElementRef;
  @ViewChild('dept') dept: ElementRef;
  @ViewChild('docname') docname: ElementRef;

  public onEnterfname(event): void {
    debugger
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
      this.Address.nativeElement.focus();
    }
  }

  public onEnterAddress(event): void {
    if (event.which === 13) {
      this.mobile.nativeElement.focus();
    }
  }

  public onEntermobile(event): void {
    if (event.which === 13) {
      this.dept.nativeElement.focus();
    }
  }
  public onEnterdept(event, value): void {

    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department.', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        this.docname.nativeElement.focus();
      }
    }
  }
  public onEnterdeptdoc(event, value): void {

    if (event.which === 13) {
      if (value == undefined) {
        this.toastr.warning('Please Enter Valid Department Dosctor', 'Warning !', {
          toastClass: 'tostr-tost custom-toast-warning',
        });
        return;
      } else {
        // this.button.nativeElement.focus();
      }
    }
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