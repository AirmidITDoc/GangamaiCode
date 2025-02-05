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
import { RegInsert } from '../../registration/registration.component';

@Component({
  selector: 'app-new-phone-appointment',
  templateUrl: './new-phone-appointment.component.html',
  styleUrls: ['./new-phone-appointment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewPhoneAppointmentComponent implements OnInit {
  phoneappForm: FormGroup
  searchFormGroup: FormGroup
  hasSelectedContacts: boolean;
  date = new Date().toISOString();
  date1: any;

  public now: Date = new Date();

  screenFromString = 'admission-form';
  submitted = false;
  isChecked = true;
  minDate: Date;
  vMobile: any;
  phoneAppId: any = 0;

  registerObj = new RegInsert({});

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
      this.date1 = (this.datePipe.transform(new Date(),"MM-dd-YYYY hh:mm tt"));
      var now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      this.date1 = now.toISOString().slice(0,16);
  }


  ngOnInit(): void {

    this.minDate = new Date();

    this.phoneappForm = this._phoneAppointListService.createphoneForm();
    this.searchFormGroup = this.createSearchForm();
  }


  createSearchForm() {
    return this.formBuilder.group({
      RegId: 0,
     
    });
  }


  RegId = 0;

  getSelectedObj(obj) {
    console.log(obj)
    this.RegId = obj.value;
    
    if ((this.RegId ?? 0) > 0) {

      setTimeout(() => {
        this._phoneAppointListService.getRegistraionById(this.RegId).subscribe((response) => {
          this.registerObj = response;
          console.log(response)

        });

      }, 500);
    }

  }




  getValidationMessages() {

    return {
      firstName: [
        { name: "required", Message: "First Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      middleName: [

        { name: "maxLength", Message: "Enter only upto 50 chars" },
        { name: "pattern", Message: "only char allowed." }
      ],
      lastName: [
        { name: "required", Message: "Last Name is required" },
        { name: "maxLength", Message: "Enter only upto 50 chars" },
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
      ],
      mobileNo: [
        { name: "pattern", Message: "Only numbers allowed" },
        { name: "required", Message: "Mobile No is required" },
        { name: "minLength", Message: "10 digit required." },
        { name: "maxLength", Message: "More than 10 digits not allowed." }

      ]
    };
  }


  dateTimeControl = new FormControl('');
  selectedTime: string | null = null;
  OnSubmit() {

    console.log(this.phoneappForm.value);

    if (!this.phoneappForm.invalid) {
      debugger
      this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(this.phoneappForm.get('phAppDate').value, 'yyyy-MM-dd'))
      this.phoneappForm.get('phAppTime').setValue(this.datePipe.transform(this.phoneappForm.get('phAppTime').value, 'hh:mm:ss a'))
     
      // this.phoneappForm.get('phAppDate').setValue(this.date1,'yyyy-MM-dd')
      // this.phoneappForm.get('phAppTime').setValue(this.date1,'hh:mm:ss a')
     
     
      this.phoneappForm.get('appDate').setValue(this.datePipe.transform(this.phoneappForm.get('appDate').value, 'yyyy-MM-dd'))
      this.phoneappForm.get('appTime').setValue(this.datePipe.transform(this.phoneappForm.get('appTime').value, 'hh:mm:ss a'))
     
      console.log(this.phoneappForm.value);
      this._phoneAppointListService.phoneMasterSave(this.phoneappForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    } else {
      Swal.fire("Form is Invalid !.......")
    }
  }
  onClear(val: boolean) {
    this.phoneappForm.reset();
    this.dialogRef.close(val);
  }


  onClose() { this.dialogRef.close(); }


  Phappcancle(data) {
    this._phoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
      this.toastr.success(response.message);
      // that.grid.bindGridData();
    });
  }

  // new Api

  selectChangedepartment(obj: any) {
    console.log(obj);
    // this.vDepartmentid = obj.value
  }

  selectChangedoctor(obj: any) {
    console.log(obj);
    // this.vDoctorId = obj.value
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