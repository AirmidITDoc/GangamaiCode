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
  selector: 'app-new-in-mrd',
  templateUrl: './new-in-mrd.component.html',
  styleUrls: ['./new-in-mrd.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class NewINMrdComponent {
NewInMrdForm:FormGroup
dateTimeString: any;
rmdrecordId=0
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  isDatePckrDisabled: boolean = false;
  isTimeChanged: boolean = false;
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
    private advanceDataStored: AdvanceDataStored,   public toastr: ToastrService,
    public dialogRef: MatDialogRef<NewINMrdComponent>,
    public datePipe: DatePipe) {
    dialogRef.disableClose = true;
     this.date = new Date().toISOString().slice(0, 16);
  }

  ngOnInit(): void {
       this.NewInMrdForm = this.createINMrdForm();
       if(this.data){
        this.rmdrecordId=this.data.rmdrecordId
        this.NewInMrdForm.patchValue(this.data)
       }
      setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US").split(',');
   
    }, 1);

     }


  createINMrdForm() {
  return this.formBuilder.group({
      outFileId: 0,
      opipid: ['', Validators.required],
      outNo: ['', Validators.required],
      givenUserId:[''],
      personName:[''],

      outDate: [(new Date()).toISOString()],
      outTime: [(new Date()).toISOString()],
      outReason:[''],
      inNo:[''],
      inDate: [(new Date()).toISOString()],
      inTime: [(new Date()).toISOString()],
      returnUserId: [this.accountService.currentUserValue.user.user],
      returnPersonName: [''],
      inReason: [false, Validators.required],

    
    });
  }

  onSubmit() {
    debugger

    let selectedDate = this.datePipe.transform(this.NewInMrdForm.get('outDate')?.value, 'yyyy-MM-dd');
    let timeValue = this.NewInMrdForm.get('outTime')?.value;
    let time = new Date(timeValue);

    // extract hours and minutes
    let hours = time.getHours();
    let minutes = time.getMinutes();

    // combine reportingDate + reportingTime
    let combinedDateTime = new Date(
      selectedDate + 'T' + this.pad(hours) + ':' + this.pad(minutes) + ':00'
    );

    this.NewInMrdForm.get('outDate').setValue(this.datePipe.transform(this.NewInMrdForm.get('outDate').value, 'yyyy-MM-dd'))
    this.NewInMrdForm.get('outTime').setValue(combinedDateTime)

    // this.NewInMrdForm.get('admissionId').setValue(this.EmgId ?? this.AdmissionId)
    if (!this.NewInMrdForm.invalid) {
      console.log(this.NewInMrdForm.value)
      this._MrdService.MrdOutFileUpdate(this.NewInMrdForm.value).subscribe((response) => {

        this._matDialog.closeAll();
      });
    } else {
      let invalidFields = [];

      if (this.NewInMrdForm.invalid) {
        for (const controlName in this.NewInMrdForm.controls) {
          if (this.NewInMrdForm.controls[controlName].invalid) {
            invalidFields.push(`MRD In File Info Form: ${controlName}`);
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
      let splitTime = this.NewInMrdForm.get('recievedDate').value.toLocaleString("en-US").split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  onChangeTime(event) {
    this.timeflag = 1
    if (event) {

      let selectedDate = new Date(this.NewInMrdForm.get('recievedTime').value);
      let splitDate = selectedDate.toLocaleString("en-US").split(',');
      let splitTime = this.NewInMrdForm.get('recievedTime').value.toLocaleString("en-US").split(',');
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
