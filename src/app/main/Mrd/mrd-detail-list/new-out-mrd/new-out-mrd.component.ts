import { Component, EventEmitter, Inject, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { OPIPPatientModel } from 'app/main/nursingstation/patient-vist/patient-vist.component';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { OPIPPatientModel } from 'app/main/ipd/ipdsearc-patienth/ipdsearc-patienth.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MrdService } from '../../mrd.service';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
import { MrdDetailsService } from '../mrd-details.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-new-out-mrd',
  templateUrl: './new-out-mrd.component.html',
  styleUrls: ['./new-out-mrd.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class NewOutMrdComponent {
  NewOutMrdForm: FormGroup
  dateTimeString: any;
  rmdrecordId = 0
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  isTimeChanged: boolean = false;
   isDatePckrDisabled1: boolean = false;
  isTimeChanged1: boolean = false;
  minDate: Date;
  timeflag = 0;
  screenFromString = 'Common-form';
  date: string;


  constructor(private _fuseSidebarService: FuseSidebarService,
    public _MrdService: MrdDetailsService,
    public formBuilder: UntypedFormBuilder,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private accountService: AuthenticationService,
    private advanceDataStored: AdvanceDataStored, public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewOutMrdComponent>,
    public datePipe: DatePipe) {
     
    let mydate = new Date()
    this.date = (this.datePipe.transform(new Date(), "MM-dd-YYYY hh:mm tt"));
   
    var now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    this.date = now.toISOString().slice(0, 16);
  }

  ngOnInit(): void {
    this.NewOutMrdForm = this.createOutMrdForm();
    if (this.data) {
      this.rmdrecordId = this.data.rmdrecordId
      this.NewOutMrdForm.patchValue(this.data)
    }
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US").split(',');

    }, 1);

  }


  createOutMrdForm() {

    return this.formBuilder.group({
      outFileId: 0,
      opipid: ['', Validators.required],
      outNo: ['', Validators.required],
      givenUserId:this.accountService.currentUserValue.userId,
      personName:[''],

      outDate: [(new Date()).toISOString()],
      outTime: ['', [Validators.required]],
      outReason:[''],
      inNo:[''],
      inDate: [(new Date()).toISOString()],
      inTime:  ['', [Validators.required]],
      returnUserId:this.accountService.currentUserValue.userId,
      returnPersonName: [''],
      inReason: [false, Validators.required],

    });
  }

  onSubmit() {
    debugger

    // let selectedDate = this.datePipe.transform(this.NewOutMrdForm.get('outDate')?.value, 'yyyy-MM-dd');
    // let timeValue = this.NewOutMrdForm.get('outTime')?.value;
    // let time = new Date(timeValue);

    // extract hours and minutes
    // let hours = time.getHours();
    // let minutes = time.getMinutes();

    // combine reportingDate + reportingTime
    // let combinedDateTime = new Date(
    //   selectedDate + 'T' + this.pad(hours) + ':' + this.pad(minutes) + ':00'
    // );

       this.NewOutMrdForm.get('outDate').setValue(this.datePipe.transform(this.NewOutMrdForm.get('outDate').value, 'yyyy-MM-dd'))
    this.NewOutMrdForm.get('outTime').setValue(this.datePipe.transform(this.NewOutMrdForm.get('outDate').value, "MM-dd-yyyy hh:mm"))


    //  let selectedDate1 = this.datePipe.transform(this.NewOutMrdForm.get('inDate')?.value, 'yyyy-MM-dd');
    // let timeValue1 = this.NewOutMrdForm.get('inTime')?.value;
    // let time1 = new Date(timeValue1);

    // extract hours and minutes
    // let hours1 = time1.getHours();
    // let minutes1 = time1.getMinutes();

    // combine reportingDate + reportingTime
    // let combinedDateTime1 = new Date(
    //   selectedDate + 'T' + this.pad(hours1) + ':' + this.pad(minutes1) + ':00'
    // );

    // this.NewOutMrdForm.get('inDate').setValue(this.datePipe.transform(this.NewOutMrdForm.get('inDate').value, 'yyyy-MM-dd'))
    // this.NewOutMrdForm.get('inTime').setValue(this.datePipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss'))

         this.NewOutMrdForm.get('inDate').setValue(this.datePipe.transform(this.NewOutMrdForm.get('inDate').value, 'yyyy-MM-dd'))
    this.NewOutMrdForm.get('inTime').setValue(this.datePipe.transform(this.NewOutMrdForm.get('inDate').value, "MM-dd-yyyy hh:mm"))


   if (!this.NewOutMrdForm.invalid) {
      console.log(this.NewOutMrdForm.value)
      this._MrdService.MrdOutFileUpdate(this.NewOutMrdForm.value).subscribe((response) => {

        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.NewOutMrdForm.invalid) {
        for (const controlName in this.NewOutMrdForm.controls) {
          if (this.NewOutMrdForm.controls[controlName].invalid) {
            invalidFields.push(`MRD Out File Info Form: ${controlName}`);
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


  pad(n: number) {
    return n < 10 ? '0' + n : n;
  }

  getValidationMessages() {
    return {
      opipid: [
        { name: "required", Message: "opipid is required" }
      ],
      mrdno: [
        { name: "required", Message: "mrdno is required" }
      ],
      location: [
        { name: "required", Message: "location is required" }
      ],
       inReason: [
        { name: "required", Message: "inReason is required" }
      ],
      inNo: [
        { name: "required", Message: "inNo is required" }
      ],
      returnPersonName: [
        { name: "required", Message: "returnPersonName is required" }
      ],
      personName: [
        { name: "required", Message: "personName is required" }
      ],
      outNo: [
        { name: "required", Message: "outNo is required" }
      ],
    };
  }



  public now: Date = new Date();
  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US").split(',');
      let splitTime = this.NewOutMrdForm.get('outDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.NewOutMrdForm.get('outTime').value);
      let splitDate = selectedDate.toLocaleString("en-US").split(',');
      let splitTime = this.NewOutMrdForm.get('outTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      // this.phdatetime = splitTime[1]
      // console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  
  public now1: Date = new Date();
  onChangeDate1(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US").split(',');
      let splitTime = this.NewOutMrdForm.get('inDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime1(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.NewOutMrdForm.get('inTime').value);
      let splitDate = selectedDate.toLocaleString("en-US").split(',');
      let splitTime = this.NewOutMrdForm.get('inTime').value.toLocaleString("en-US").split(',');
      this.isTimeChanged = true;
      // this.phdatetime = splitTime[1]
      // console.log(this.phdatetime)
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    console.log('dateTimeObj ==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  onClose() {
    this.dialogRef.close();
  }
}