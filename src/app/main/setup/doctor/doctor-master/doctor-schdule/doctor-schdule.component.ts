import { Component, Inject, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { DoctorMasterService } from '../doctor-master.service';
import { fuseAnimations } from '@fuse/animations';
import { AirmidDropDownComponent } from 'app/main/shared/componets/airmid-dropdown/airmid-dropdown.component';
@Component({
  selector: 'app-doctor-schdule',
  templateUrl: './doctor-schdule.component.html',
  styleUrls: ['./doctor-schdule.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorSchduleComponent {


  DrschduleForm: FormGroup
  scheduleForm: FormGroup
  DrAdhocschduleForm: FormGroup
  RadioForm:FormGroup;
  allDays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  selectedDays: string[] = [];
  days = new FormControl([]);
  @ViewChild('ddlDays') ddlDays: AirmidDropDownComponent;


  constructor(public _DoctorMasterService: DoctorMasterService,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    private _FormvalidationserviceService: FormvalidationserviceService,
    public datePipe: DatePipe,
    private commonService: PrintserviceService,
    public toastr: ToastrService,
    private advanceDataStored: AdvanceDataStored,
    public dialogRef: MatDialogRef<DoctorSchduleComponent>,
    private fb: FormBuilder
  ) {

  }

  ngOnInit(): void {
    this.DrschduleForm = this.createDrSchduleForm();
    this.DrschduleForm.markAllAsTouched();
    this.DrAdhocschduleForm = this.createAdhocScheduleGroup();
    this.DrAdhocschduleForm.markAllAsTouched();
    this.RadioForm=this.createSearch();
  }


  createDrSchduleForm() {
    return this.formBuilder.group({

      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      scheduleDays: this.days.value,
      slot: [''],
      startTime: [''],
      endTime: [''],

    });
  }
 
  createAdhocScheduleGroup(): FormGroup {
    return this.fb.group({
      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      scheduleDays: "",
      startTime: [],
      endTime: [],
      slot: [],

      // schRadio: ['adhoc'],
    });
  }

  createSearch(): FormGroup {
    return this.fb.group({
          schRadio: ['adhoc'],
    });
  }

  //  isDatePckrDisabled: boolean = false;
  // onChangeTime(event) {
  // }


  // get schedules(): FormArray {
  //   return this.scheduleForm.get('schedules') as FormArray;
  // }


  // addSchedule() {
  //   // this.schedules.push(this.createScheduleGroup());
  // }

  schstatus: boolean = false
  onChangeSch(event) {
    debugger
    if (event.value === 'Sch') {
      this.schstatus = true
    }
    if (event.value === 'adhoc') {
      this.schstatus = false
    }
  }

  onDaySelectionChange() {
    this.selectedDays = this.days.value;
  }

  removeDay(day: string): void {
    const index = this.selectedDays.indexOf(day);
    if (index >= 0) {
      this.selectedDays.splice(index, 1);
      this.days.setValue(this.selectedDays);
    }
  }
  onSubmit() {
    if (this.schstatus) {
      console.log(this.DrschduleForm.value)
      console.log(this.selectedDays)
      console.log(this.days.value)

      this.DrschduleForm.get("scheduleDays").setValue(this.days.value)
      this.dialogRef.close(this.DrschduleForm.value)
    }
    else{
    // var Payload=this.DrAdhocschduleForm.value
    //  Payload.delete.schRadio

      this.dialogRef.close(this.DrAdhocschduleForm.value)
  }
  }

  onClear(val: boolean) {
    this.DrschduleForm.reset();
    this.dialogRef.close();
  }
  onClose() {
    this.dialogRef.close()
  }
  //new time
  startHour = 12;
  startMinute = 0;
  startMeridian = 'PM';

  endHour = 1;
  endMinute = 0;
  endMeridian = 'PM';

  increment(type: 'start' | 'end', field: 'hour' | 'minute') {
    if (type === 'start') {
      if (field === 'hour') this.startHour = this.startHour === 12 ? 1 : this.startHour + 1;
      else this.startMinute = (this.startMinute + 1) % 60;
    } else {
      if (field === 'hour') this.endHour = this.endHour === 12 ? 1 : this.endHour + 1;
      else this.endMinute = (this.endMinute + 1) % 60;
    }
  }

  decrement(type: 'start' | 'end', field: 'hour' | 'minute') {
    if (type === 'start') {
      if (field === 'hour') this.startHour = this.startHour === 1 ? 12 : this.startHour - 1;
      else this.startMinute = (this.startMinute - 1 + 60) % 60;
    } else {
      if (field === 'hour') this.endHour = this.endHour === 1 ? 12 : this.endHour - 1;
      else this.endMinute = (this.endMinute - 1 + 60) % 60;
    }
  }

  toggleMeridian(type: 'start' | 'end') {
    if (type === 'start') {
      this.startMeridian = this.startMeridian === 'AM' ? 'PM' : 'AM';
    } else {
      this.endMeridian = this.endMeridian === 'AM' ? 'PM' : 'AM';
    }
  }

  formatHour(hour: number): string {
    return hour < 10 ? '0' + hour : hour.toString();
  }

  formatMinute(min: number): string {
    return min < 10 ? '0' + min : min.toString();
  }
}


export class SchduleDetail {
  docSchedId: any;
  scheduleDays: any;
  startTime: any;
  endTime: any;
  slot: any;
  // YearsExp: any;

  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(SchduleDetail) {
    {
      this.docSchedId = SchduleDetail.docSchedId || 0;
      this.scheduleDays = SchduleDetail.scheduleDays || '';
      this.startTime = SchduleDetail.startTime || '';
      this.endTime = SchduleDetail.endTime || '';
      this.slot = SchduleDetail.slot || '';
      // this.YearsExp = SchduleDetail.YearsExp || '';


    }
  }
}