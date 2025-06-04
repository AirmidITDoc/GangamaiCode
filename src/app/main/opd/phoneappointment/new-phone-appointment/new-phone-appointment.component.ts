import { DatePipe } from '@angular/common';
import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { ToastrService } from 'ngx-toastr';
import { RegInsert } from '../../registration/registration.component';
import { PhoneAppointListService } from '../phone-appoint-list.service';

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
  @ViewChild('myButton', { static: true }) myButton: HTMLButtonElement;
  screenFromString = 'appointment-form';
  RegId = 0;
  phoneAppId: any = 0;
  timeflag = 0
  submitted = false;
  isChecked = true;
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  minDate: Date;
  registerObj = new RegInsert({});
  dateTimeString: any;
  phdatetime: any;
  autocompletedepartment: string = "Department";
  autocompleteModedoctor: string = "ConDoctor";
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  dateTimeControl = new FormControl('');
  selectedTime: string | null = null;


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
    return this.formBuilder.group({ RegId: 0, });
  }

  getSelectedObj(obj) {
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

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.phoneappForm.get('phAppDate').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.phoneappForm.get('phAppTime').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.phoneappForm.get('phAppTime').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.phdatetime = splitTime[1]
      console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }


  OnSubmit() {
    console.log(this.phoneappForm.value);
    this.phoneappForm.get('appDate').setValue(this.datePipe.transform(this.phoneappForm.get('appDate').value, 'yyyy-MM-dd'))
    this.phoneappForm.get('phAppDate').setValue(this.datePipe.transform(this.phoneappForm.get('phAppDate').value, 'yyyy-MM-dd'))
    if (!this.phoneappForm.invalid) {
      this._phoneAppointListService.phoneMasterSave(this.phoneappForm.value).subscribe((response) => {
        this.onClear(true);
      });
    } else {
      let invalidFields = [];
      if (this.phoneappForm.invalid) {
        for (const controlName in this.phoneappForm.controls) {
          if (this.phoneappForm.controls[controlName].invalid) {
            invalidFields.push(`phoneapp Form: ${controlName}`);
          }
        }
      }
      if (invalidFields.length > 0) {
        invalidFields.forEach(field => {
          this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
          );
        });
      }

    }
  }

  Phappcancle(data) {
    this._phoneAppointListService.phoneMasterCancle(data.phoneAppId).subscribe((response: any) => {
      this.toastr.success(response.message);
    });
  }


  onClear(val: boolean) {
    this.phoneappForm.reset();
    this.dialogRef.close(val);
  }

  onClose() { this.dialogRef.close(); }

  depId = 0 //changed by raksha
  selectChangedepartment(obj: any) {
    this.depId = obj.value
    this._phoneAppointListService.getDoctorsByDepartment(obj.value).subscribe((data: any) => {
      this.ddlDoctor.options = data;
      this.ddlDoctor.bindGridAutoComplete();
    });
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

  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
