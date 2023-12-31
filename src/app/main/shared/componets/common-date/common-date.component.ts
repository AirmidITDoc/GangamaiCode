import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-common-date',
  templateUrl: './common-date.component.html',
  styleUrls: ['./common-date.component.scss']
})
export class CommonDateComponent implements OnInit {

  @Input('screenFrom') screenFromString = '';
  @Output() dateTimeEventEmitter = new EventEmitter<{}>();
  dateForm: FormGroup;
  public now: Date = new Date();
  currentDate: any;
  currentTime: any;

  dateLabel: string = '';
  timeLabel: string = '';
  dateTimeString: any;
  isTimeChanged: boolean = false;
  isDatePckrDisabled: boolean = false;
  @Input('isAutoChangeTime') isAutoChangeTime: boolean = false;
  constructor(
    private formBuilder: FormBuilder
  ) {

    // this.currentDate = this.now.getMonth() + '/' + this.now.getDate() + '/' + this.now.getFullYear();
    setInterval(() => {
      this.now = new Date();
      this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      if (!this.isTimeChanged) {
        this.dateForm.get('timeController').setValue(this.now);
      }
      if (this.isAutoChangeTime) {
        let splitDate = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
        this.eventEmitForParent(splitDate[0], splitDate[1]);
      }
    }, 1000);
  }

  ngOnInit() {
    this.dateForm = this.formBuilder.group({
      dateController: [this.now],
      timeController: []
    });
    if (this.screenFromString == 'admission-form') {
      this.dateLabel = 'Admission Date';
      this.timeLabel = 'Admission Time';
      this.isDatePckrDisabled = false;
    } else if (this.screenFromString == 'payment-form') {
      this.dateLabel = 'Payment Date';
      this.timeLabel = 'Payment Time';
      this.isDatePckrDisabled = true;
    } else if (this.screenFromString == 'advance') {
      this.dateLabel = 'Advance Date';
      this.timeLabel = 'Advance Time';
      this.isDatePckrDisabled = true;
    } else if (this.screenFromString == 'discharge-summary') {
      this.dateLabel = 'Discharge Date';
      this.timeLabel = 'Discharge Time';
      this.isDatePckrDisabled = true;
    } else if (this.screenFromString == 'registration') {
      this.dateLabel = 'Registration Date';
      this.timeLabel = 'Registration Time';
      this.isDatePckrDisabled = true;
    } else if (this.screenFromString == 'discharge') {
      this.dateLabel = 'Discharge Date';
      this.timeLabel = 'Discharge Time';
      this.isDatePckrDisabled = true;
    }
    else if (this.screenFromString == 'IP-billing') {
      this.dateLabel = 'Discharge Date';
      this.timeLabel = 'Discharge Time';
      this.isDatePckrDisabled = true;
    }
    this.dateForm.get('timeController').setValue(this.now);
    setTimeout(() => {
      this.eventEmitForParent(this.dateTimeString[0], this.dateTimeString[1]);
    }, 2);
  }

  onChangeDate(value) {
    if (value) {
      const dateOfReg = new Date(value);
      let splitDate = dateOfReg.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.dateForm.get('timeController').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }
  onChangeTime(event) {
    if (event) {
      let selectedDate = new Date(this.dateForm.get('dateController').value);
      let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      let splitTime = this.dateForm.get('timeController').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
      this.isTimeChanged = true;
      this.eventEmitForParent(splitDate[0], splitTime[1]);
    }
  }

  eventEmitForParent(actualDate, actualTime) {
    let localaDateValues = actualDate.split('/');
    let localaDateStr = localaDateValues[1] + '/' + localaDateValues[0] + '/' + localaDateValues[2];
    this.dateTimeEventEmitter.emit({ date: actualDate, time: actualTime });
  }

}
