import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { SchdulerComponent } from '../scheduler.component';
import Swal from 'sweetalert2';
import { SchdulerService } from '../scheduler.service';

@Component({
  selector: 'app-managescheduler',
  templateUrl: './managescheduler.component.html',
  styleUrls: ['./managescheduler.component.scss']
})
export class ManageschedulerComponent implements OnInit {

  ScheduleType: number = 1;
  CustomDates: string[] = [];
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
    this.CustomDates.push(this.searchFormGroup.get("Customdate").value);
    this.searchFormGroup.get("Customdate").setValue("");
  }

  onSubmit() {
    this.ScheduleType = Number(this.searchFormGroup.get("ScheduleType").value ?? "0");
    if (this.ScheduleType <= 0) {
      Swal.fire('Error !', 'Select Schedule Type.', 'error');
      return;
    }
    else if ((this.searchFormGroup.get("StartDate").value ?? "").length <= 0) {
      Swal.fire('Error !', 'Select start date.', 'error');
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
      data = { ScheduleType: 1, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.searchFormGroup.get('StartDate').value, EndDate: this.searchFormGroup.get('StartDate').value, ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 2) {
      var weekdays = this.Weeks.filter(x => x.Checked).map(x => x.Value).join(',');
      if (weekdays.length <= 0) {
        Swal.fire('Error !', 'Select at least 1 Day.', 'error');
        return;
      }
      data = { ScheduleType: 2, Days: weekdays, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.searchFormGroup.get('StartDate').value, EndDate: this.searchFormGroup.get('StartDate').value, ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 3) {
      if ((this.searchFormGroup.get("Monthdate").value ?? "").length <= 0) {
        Swal.fire('Error !', 'Enter date(s).', 'error');
        return;
      }
      data = { ScheduleType: 3, Dates: this.searchFormGroup.get("Monthdate").value, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.searchFormGroup.get('StartDate').value, EndDate: this.searchFormGroup.get('StartDate').value, ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    else if (this.ScheduleType == 4) {
      var customdates = this.CustomDates.join(',')
      if (weekdays.length <= 0) {
        Swal.fire('Error !', 'Select custom date(s).', 'error');
        return;
      }
      data = { ScheduleType: 4, Custom: customdates, Hours: this.searchFormGroup.get("Hours").value, Query: this.searchFormGroup.get("Query").value, StartDate: this.searchFormGroup.get('StartDate').value, EndDate: this.searchFormGroup.get('StartDate').value, ScheduleName: this.searchFormGroup.get("ScheduleName").value };
    }
    this._SchdulerService.saveScheduler(data).subscribe((data) => {
      debugger
    });
  }

  searchFormGroup: FormGroup;

  constructor(private formBuilder: FormBuilder, private _SchdulerService: SchdulerService,
    private dialogRef: MatDialogRef<SchdulerComponent>) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
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
      StartDate: [''],
      EndDate: [''],
      ScheduleName:['']
    });
  }


  onClear() {
    this.searchFormGroup.reset();
  }

  onClose() {
    this.dialogRef.close();
  }
}
