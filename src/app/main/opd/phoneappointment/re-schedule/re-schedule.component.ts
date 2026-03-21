import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { PhoneAppointListService } from '../phone-appoint-list.service';

@Component({
    selector: 'app-re-schedule',
    templateUrl: './re-schedule.component.html',
    styleUrls: ['./re-schedule.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ReScheduleComponent {
    dateTimeObj: any;
    PhoneAppId: any;
    screenFromString = 'phoneAppointment';

    constructor(
        public _PhoneAppointListService: PhoneAppointListService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        public dialogRef: MatDialogRef<ReScheduleComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) { }

    ngOnInit(): void {
        if (this.data) {
            this.PhoneAppId = this.data.phoneAppId
        }
    }
    getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj
    }

    ScheduleDate() {
        const data = {
            "phoneAppId": this.PhoneAppId,
            "phAppDate": this.datePipe.transform(this.dateTimeObj.date, "yyyy-MM-dd"),
            "phAppTime": this.dateTimeObj.time
        }
        this._PhoneAppointListService.getDateTimeChange(data).subscribe(response => {
            this._matDialog.closeAll();
        });
    }

    onClose() {
        this._matDialog.closeAll();
    }
}
