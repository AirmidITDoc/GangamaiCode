import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-common-date',
    templateUrl: './common-date.component.html',
    styleUrls: ['./common-date.component.scss']
})
export class CommonDateComponent implements OnInit {

    @Input('screenFrom') screenFromString = '';
    @Output() dateTimeEventEmitter = new EventEmitter<{}>();
    @Input() isDisableFuture:boolean=false;
    dateForm: FormGroup;
    public now: Date = new Date();
    currentDate: any;
    currentTime: any;

    dateLabel: string = '';
    timeLabel: string = '';
    timeLabel2: string = '';
    dateTimeString: any;
    isTimeChanged: boolean = false;
    isDatePckrDisabled: boolean = false;
    constructor(
        private formBuilder: UntypedFormBuilder
    ) {

        // this.currentDate = this.now.getMonth() + '/' + this.now.getDate() + '/' + this.now.getFullYear();
        setInterval(() => {
            this.now = new Date();
            this.dateTimeString = this.now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
            // this.currentTime = this.now.getHours() + ':' + this.now.getMinutes() + ':' + this.now.getSeconds();
            // console.log(dateTimeString[1]);
            // this.currentDate = dateTimeString[0];
            // this.currentTime = this.dateTimeString[1];
            if (!this.isTimeChanged) {
                this.dateForm.get('timeController').setValue(this.now);
                if (this.dateForm.get('timeController2'))
                    this.dateForm.get('timeController2').setValue(this.now);
            }
        }, 1);
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
        } else if (this.screenFromString == 'advance-form') {
            this.dateLabel = 'Advance Date';
            this.timeLabel = 'Advance Time';
            this.isDatePckrDisabled = true;
        } else if (this.screenFromString == 'discharge-summary') {
            this.dateLabel = 'Discharge Date';
            this.timeLabel = 'Discharge Time';
            this.isDatePckrDisabled = false;
        } else if (this.screenFromString == 'registration') {
            this.dateLabel = 'Registration Date';
            this.timeLabel = 'Registration Time';
            this.isDatePckrDisabled = false;
        } else if (this.screenFromString == 'discharge') {
            this.dateLabel = 'Discharge Date';
            this.timeLabel = 'Discharge Time';
            this.isDatePckrDisabled = false;
        }
        else if (this.screenFromString == 'IP-billing') {
            this.dateLabel = 'Discharge Date';
            this.timeLabel = 'Discharge Time';
            this.isDatePckrDisabled = true;
        }
        else if (this.screenFromString == 'OP-billing') {
            this.dateLabel = 'Billing Date';
            this.timeLabel = 'Billing Time';
            this.isDatePckrDisabled = false;
        }
        else if (this.screenFromString == 'appointment') {
            this.dateLabel = 'Visit Date';
            this.timeLabel = 'Visit Time';
            this.isDatePckrDisabled = false;
        }
        else if (this.screenFromString == 'phoneAppointment') {
            this.dateLabel = 'Phone Appointment Date';
            this.timeLabel = 'Phone Appointment Time';
            this.isDatePckrDisabled = false;
        }
        else if (this.screenFromString == 'Common-form') {
            this.dateLabel = 'Date';
            this.timeLabel = 'Time';
            // this.timeLabel2 = 'Admission End Time';
            this.isDatePckrDisabled = false;
            if (this.dateForm.get('timeController2'))
                this.dateForm.get('timeController2').setValue(this.now);
        }
        this.dateForm.get('timeController').setValue(this.now);
        setTimeout(() => {
            this.eventEmitForParent(this.dateTimeString[0], this.dateTimeString[1]);
        }, 2);
    }
    myFilter = (d: Date | null): boolean => {
        return this.isDisableFuture? d<=new Date():true;
    };
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
    onChangeTime2(event) {
        if (event) {
            let selectedDate = new Date(this.dateForm.get('dateController').value);
            let splitDate = selectedDate.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
            let splitTime = this.dateForm.get('timeController2').value.toLocaleString("en-US", { timeZone: "Asia/Kolkata" }).split(',');
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
