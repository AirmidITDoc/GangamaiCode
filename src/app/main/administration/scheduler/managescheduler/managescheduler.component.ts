import { Component, Inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SchdulerComponent } from '../scheduler.component';
import Swal from 'sweetalert2';
import { SchdulerService } from '../scheduler.service';

@Component({
  selector: 'app-managescheduler',
  templateUrl: './managescheduler.component.html',
  styleUrls: ['./managescheduler.component.scss']
})
export class ManageschedulerComponent implements OnInit {
  Id:number=0;
  ScheduleType: number = 1;
  CustomDates: string[] = [];
  StartDate: Date;
  EndDate: Date;
  CustomDate: Date;
  Weeks = [
    { Text: "Sunday", Value: 0, Checked: false },
    { Text: "Monday", Value: 1, Checked: false },
    { Text: "Tuesday", Value: 2, Checked: false },
    { Text: "Wednesday", Value: 3, Checked: false },
    { Text: "Thursday", Value: 4, Checked: false },
    { Text: "Friday", Value: 5, Checked: false },
    { Text: "Saturday", Value: 6, Checked: false }
  ];

  getValue($event, data) {
    data.Checked = $event.checked;
  }
  onAddCustomDate() {
    if(!this.CustomDate){
      Swal.fire('Error !', 'Select Custom Date.', 'error');
      return;
    }
    this.CustomDates.push(this.CustomDate.toISOString().split('T')[0]);
    this.searchFormGroup.get("Customdate").setValue("");
  }
  onChangeStartDate(startDate) {
    this.StartDate = startDate;
  }
  onChangeEndDate(endDate) {
    this.EndDate = endDate;
  }
  onChangeCustomDate(customDate) {
    this.CustomDate = customDate;
  }
  onSubmit() {
    
    this.ScheduleType = Number(this.searchFormGroup.get("ScheduleType").value ?? "0");
    if (this.ScheduleType <= 0) {
      Swal.fire('Error !', 'Select Schedule Type.', 'error');
      return;
    }
    else if (!this.StartDate) {
      Swal.fire('Error !', 'Select start date.', 'error');
      return;
    }
    else if (!this.EndDate) {
      Swal.fire('Error !', 'Select end date.', 'error');
      return;
    }
    else if ((this.searchFormGroup.get("Hours").value ?? "").length <= 0) {
      Swal.fire('Error !', 'Enter hours.', 'error');
      return;
    }
    else if ((this.searchFormGroup.get("ScheduleName").value ?? "").length <= 0) {
      Swal.fire('Error !', 'Enter Scheduler Name.', 'error');
      return;
    }

    let data = {};
    if (this.ScheduleType == 1) {
      data = { ScheduleType: 1,Id:this.Id, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.StartDate.toISOString().split('T')[0], EndDate: this.EndDate.toISOString().split('T')[0], ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 2) {
      var weekdays = this.Weeks.filter(x => x.Checked).map(x => x.Value).join(',');
      if (weekdays.length <= 0) {
        Swal.fire('Error !', 'Select at least 1 Day.', 'error');
        return;
      }
      data = { ScheduleType: 2,Id:this.Id, Days: weekdays, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.StartDate.toISOString().split('T')[0], EndDate: this.EndDate.toISOString().split('T')[0], ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 3) {
      if ((this.searchFormGroup.get("Monthdate").value ?? "").length <= 0) {
        Swal.fire('Error !', 'Enter date(s).', 'error');
        return;
      }
      data = { ScheduleType: 3,Id:this.Id, Dates: this.searchFormGroup.get("Monthdate").value, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.StartDate.toISOString().split('T')[0], EndDate: this.EndDate.toISOString().split('T')[0], ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 4) {
      var customdates = this.CustomDates.join(',')
      if (customdates.length <= 0) {
        Swal.fire('Error !', 'Select custom date(s).', 'error');
        return;
      }
      data = { ScheduleType: 4,Id:this.Id, Custom: customdates, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.StartDate.toISOString().split('T')[0], EndDate: this.EndDate.toISOString().split('T')[0], ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    this._SchdulerService.saveScheduler(data).subscribe((data) => {
      if(data["id"]>0){
        Swal.fire('Succsess !', 'Schedule Added successfully.', 'success');
        this.dialogRef.close();
      }
    });
  }

  searchFormGroup: UntypedFormGroup;

  constructor(private formBuilder: UntypedFormBuilder, private _SchdulerService: SchdulerService,
    private dialogRef: MatDialogRef<SchdulerComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    if(this.data){
      this.CustomDates=this.data.custom.split(',');
      this.EndDate=new Date(this.data.endDate);
      this.ScheduleType=this.data.scheduleType;
      this.StartDate=new Date(this.data.startDate);
      this.Id=this.data.id;
      this.searchFormGroup.get("ScheduleName").setValue(this.data.scheduleName);
      this.searchFormGroup.get("Hours").setValue(this.data.hours);
      this.searchFormGroup.get("ScheduleType").setValue(this.data.scheduleType);
      this.searchFormGroup.get("Monthdate").setValue(this.data.dates);
      this.searchFormGroup.get("Query").setValue(this.data.query);
      (this.data.days.split(',')??[]).forEach(element => {
        this.Weeks.find(x=>x.Value==element).Checked=true;
      });
    }
  }
  createSearchForm() {
    return this.formBuilder.group({
      ScheduleType: ['1'],
      Hours: [''],
      Days: [''],
      WeekHours: [''],
      Monthdate: [''],
      MonthHours: [''],
      Customdate: [''],
      CustomHours: [''],
      Query: [''],
      StartDate: [{ value: this.StartDate }],
      EndDate: [{ value: this.EndDate }],
      ScheduleName: ['']
    });
  }


  onClear() {
    this.searchFormGroup.reset();
  }

  onClose() {
    this.dialogRef.close();
  }
}
