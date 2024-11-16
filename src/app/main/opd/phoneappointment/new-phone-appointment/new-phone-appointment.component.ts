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
  
  DepartmentList: any = [];
  DoctorList: any = [];
  Doctor1List: any = [];
  

  hospitalFormGroup: FormGroup;
  // registerObj = new AdmissionPersonlModel({});
  options = [];
  filteredOptions: any;
  noOptionFound: boolean = false;
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
  // New Api
  autocompleteMode1: string = "Department";
  autocompleteMode2: string = "ConDoctor";

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


  ngOnInit(): void {

    this.getDepartmentList();
    this.getDoctor2List();
    this.minDate = new Date();

  
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

    return option && option.text ? option.text : '';
  }

  getOptionTextDoc(option) {

    return option && option.text ? option.text : '';

  }


  private _filterDoc(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      this.isDoctorSelected = false;
      return this.Doctor1List.filter(option => option.text.toLowerCase().includes(filterValue));
    }
  
  }


  OnChangeDoctorList(departmentObj) {

    this.isDepartmentSelected = true;
    this._phoneAppointListService.getDoctorMasterCombo(departmentObj.Departmentid).subscribe(
      data => {
        this.DoctorList = data;
        this.filteredOptionsDoc = this.phoneappForm.get('DoctorId').valueChanges.pipe(
          startWith(''),
          map(value => value ? this._filterDoc(value) : this.DoctorList.slice()),
        );
      })
  }



  private _filterDep(value: any): string[] {
    if (value) {
      const filterValue = value && value.text ? value.text.toLowerCase() : value.toLowerCase();
      // this.isDepartmentSelected = false;
      return this.optionsDep.filter(option => option.text.toLowerCase().includes(filterValue));
    }

  }



  getDepartmentList() {
    var mode="Department"
    this._phoneAppointListService.getMaster(mode,1).subscribe(data => {
      this.DepartmentList = data;
      this.optionsDep = this.DepartmentList.slice();
      this.filteredOptionsDep = this.phoneappForm.get('Departmentid').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDep(value) : this.DepartmentList.slice()),
      );
      // this.filteredDepartment.next(this.DepartmentList.slice());
    });
  }


  getDoctor2List() {
    var mode="ConDoctor"
    this._phoneAppointListService.getMaster(mode,1).subscribe(data => {
      this.Doctor1List = data;
     this.filteredOptionsDoc = this.phoneappForm.get('DoctorId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterDoc(value) : this.Doctor1List.slice()),
      );
      
    });
  }






  OnSubmit() {
    debugger
  
    var m_data = {
      "phoneAppId": 0,
      "regNo": '',
      "appDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
      "appTime": this.dateTimeObj.time,
      "firstName": this.phoneappForm.get('FirstName').value || '',
      "middleName": this.phoneappForm.get('MiddleName').value || '',
      "lastName": this.phoneappForm.get('LastName').value || '',
      "address": this.phoneappForm.get('Address').value || '',
      "mobileNo": this.phoneappForm.get('MobileNo').value.toString() || '',
      "phAppDate": this.datePipe.transform(this.phoneappForm.get('PhAppDate').value, "yyyy-MM-dd"),
      "phAppTime": this.dateTimeObj.time,// this.datePipe.transform(this.phoneappForm.get('phAppTime').value, "yyyy-MM-dd 00:00:00.000"),
      "departmentId": this.phoneappForm.get('Departmentid').value.value || 0,
      "doctorId": this.phoneappForm.get('DoctorId').value.value || 0,
      "addedBy": 1,// this.accountService.currentUserValue.user.id,
      "updatedBy": 1,// this.accountService.currentUserValue.user.id,

    }
    console.log(m_data);
  
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

Phappcancle(data){
  this._phoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
    this.toastr.success(response.message);
    // that.grid.bindGridData();
});
}



// new Api


selectChangedepartment(obj: any){
  console.log(obj);
}

selectChangedoctor(obj: any){
  console.log(obj);
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