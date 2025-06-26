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
    this.scheduleForm = this.fb.group({
      schedules: this.fb.array([this.createScheduleGroup()]),
      StartTime: [],
      EndTime: [],
      Slot: ['', [
        Validators.required]],
    });
  }

  ngOnInit(): void {
    this.DrschduleForm = this.createDrSchduleForm();
    this.DrschduleForm.markAllAsTouched();
    this.DrAdhocschduleForm = this.createScheduleGroup();
    this.DrAdhocschduleForm.markAllAsTouched();

  }


  createDrSchduleForm() {
    return this.formBuilder.group({

      doctorId: [0, [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator()]],
      slot: [''],
      startTime: [],
      endTime: [],

    });
  }
  isDatePckrDisabled: boolean = false;
  onChangeTime(event) {
  }


  get schedules(): FormArray {
    return this.scheduleForm.get('schedules') as FormArray;
  }

  createScheduleGroup(): FormGroup {
    return this.fb.group({

      scheduleDays: this.days.value,
      fromTime: [''],
      toTime: [''],
    
      schRadio: ['adhoc'],
    });
  }

  addSchedule() {
    // this.schedules.push(this.createScheduleGroup());
  }

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

  // removeSchedule(index: number) {
  //   this.schedules.removeAt(index);
  // }
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
    this.dialogRef.close(this.DrschduleForm.value)
  }


  onClear(val: boolean) {
    this.DrschduleForm.reset();
    this.dialogRef.close();
  }
  onClose() {
    this.dialogRef.close()
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