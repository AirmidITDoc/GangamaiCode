import { Component, ElementRef, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { UntypedFormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  phoneAppId:any=0;

  vDepartmentid: any = '1';
  vDoctorId: any = '2';


  isChecked = true;

  // New Api
  autocompletedepartment: string = "Department";
  autocompleteModedoctor: string = "ConDoctor";

  constructor(private _fuseSidebarService: FuseSidebarService,
    public _phoneAppointListService: PhoneAppointListService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewPhoneAppointmentComponent>,
    public datePipe: DatePipe) {
  }


  ngOnInit(): void {

    this.minDate = new Date();

    this.phoneappForm = this._phoneAppointListService.createphoneForm();
     }


  get f() { return this.phoneappForm.controls; }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  getValidationMessages() {
    return {
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [
        // { name: "required", Message: "Middle Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        // { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      address: [
        { name: "required", Message: "Address is required" },
       
      ],
      departmentId: [
        { name: "required", Message: "Department Name is required" }
      ],
      doctorId: [
        { name: "required", Message: "Doctor Name is required" }
      ]
    };
  }



  OnSubmit() {
    

    // var m_data = {
    //   "phoneAppId": 0,
    //   "regNo": '',
    //   "appDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
    //   "appTime": this.dateTimeObj.time,
    //   "firstName": this.phoneappForm.get('firstName').value || '',
    //   "middleName": this.phoneappForm.get('middleName').value || '',
    //   "lastName": this.phoneappForm.get('lastName').value || '',
    //   "address": this.phoneappForm.get('address').value || '',
    //   "mobileNo": this.phoneappForm.get('mobileNo').value.toString() || '',
    //   "phAppDate": this.datePipe.transform(this.phoneappForm.get('phAppDate').value, "yyyy-MM-dd"),
    //   "phAppTime": this.dateTimeObj.time,// this.datePipe.transform(this.phoneappForm.get('phAppTime').value, "yyyy-MM-dd 00:00:00.000"),
    //   "departmentId": this.vDepartmentid,
    //   "doctorId": this.vDoctorId,
    //   "addedBy": 1,// this.accountService.currentUserValue.userId,
    //   "updatedBy": 1,// this.accountService.currentUserValue.userId,

    // }
    // console.log(m_data);
    console.log(this.phoneappForm.value);
   this._phoneAppointListService.phoneMasterSave(this.phoneappForm.value).subscribe((response) => {
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


  Phappcancle(data) {
    this._phoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
      this.toastr.success(response.message);
      // that.grid.bindGridData();
    });
  }



  // new Api


  selectChangedepartment(obj: any) {
    console.log(obj);
    this.vDepartmentid = obj.value
  }

  selectChangedoctor(obj: any) {
    console.log(obj);
    this.vDoctorId = obj.value
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