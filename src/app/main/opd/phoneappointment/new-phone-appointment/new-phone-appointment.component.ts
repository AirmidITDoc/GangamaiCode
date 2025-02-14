import { Component, ElementRef, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';

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
  @ViewChild('ddlDoctor') ddlDoctor: AirmidDropDownComponent;
 
  RegId = 0;

  screenFromString = 'admission-form';
  submitted = false;
  isChecked = true;
  isTimeChanged: boolean = false;
  minDate: Date;
  phoneAppId: any = 0;
  registerObj = new RegInsert({});

  // New Api
  autocompletedepartment: string = "Department";
  autocompleteModedoctor: string = "ConDoctor";
  dateTimeString: any;
  timeflag=0
  public now: Date = new Date();
  constructor(private _fuseSidebarService: FuseSidebarService,
    public _phoneAppointListService: PhoneAppointListService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any, private accountService: AuthenticationService,
    public dialogRef: MatDialogRef<NewPhoneAppointmentComponent>,
    public datePipe: DatePipe) {
     
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.phoneappForm.get('phAppTime').setValue(this.now);
        if (this.phoneappForm.get('phAppTime'))
          this.phoneappForm.get('phAppTime').setValue(this.now);
      }
    }, 1);
  }


  ngOnInit(): void {

    this.minDate = new Date();

    this.phoneappForm = this._phoneAppointListService.createphoneForm();
    this.phoneappForm.markAllAsTouched();
    this.searchFormGroup = this.createSearchForm();
  }


  createSearchForm() {
    return this.formBuilder.group({
      RegId: 0,
     
    });
  }


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

@Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
phdatetime: any;
  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.phoneappForm.get('phAppDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
     this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
 
  onChangeTime(event) {
    this.timeflag=1
    if (event) {

      let selectedDate = new Date(this.phoneappForm.get('phAppTime').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.phoneappForm.get('phAppTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.phdatetime=splitTime[1]
      console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
        }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
  dateTimeControl = new FormControl('');
  selectedTime: string | null = null;

  OnSubmit() {

    console.log(this.phoneappForm.value);
       this.phoneappForm.get('appDate').setValue(this.datePipe.transform(this.phoneappForm.get('appDate').value, 'yyyy-MM-dd'))
      this.phoneappForm.get('appTime').setValue(this.datePipe.transform(this.phoneappForm.get('appTime').value, 'hh:mm:ss a'))
     
      this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(this.phoneappForm.get('phAppDate').value, 'yyyy-MM-dd'))

      // if(!this.timeflag){

      //   let selectedDate = new Date(this.phoneappForm.get('phAppTime').value);
      //   let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      //   let splitTime = this.phoneappForm.get('phAppTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      //   this.isTimeChanged = true;
      //   this.phdatetime=splitTime[1]
      // }
    
    if (!this.phoneappForm.invalid) {
      
      // this.phdatetime = this.phoneappForm.get('phAppDate').value + "" + this.phdatetime
      // console.log(this.phdatetime)
      // console.log(this.phoneappForm.value);
      
   
      this._phoneAppointListService.phoneMasterSave(this.phoneappForm.value).subscribe((response) => {
        this.toastr.success(response.message);
        this.onClear(true);
      }, (error) => {
        this.toastr.error(error.message);
      });
    } else {
      Swal.fire("Enter Proper Data ...Form is Invalid !.......")
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
    this._phoneAppointListService.getDoctorsByDepartment(obj.value).subscribe((data:any)=>{
        this.ddlDoctor.options=data;
        this.ddlDoctor.bindGridAutoComplete();
    });
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