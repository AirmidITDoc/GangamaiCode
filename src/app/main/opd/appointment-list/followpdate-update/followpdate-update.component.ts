import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../appointmentlist.service';

@Component({
    selector: 'app-followpdate-update',
    templateUrl: './followpdate-update.component.html',
    styleUrls: ['./followpdate-update.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FollowpdateUpdateComponent {

    prevfolloeupdate: any
    opdipdno: any

    constructor(
        public _AppointmentlistService: AppointmentlistService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        if (this.data)
            console.log(this.data)
        this.prevfolloeupdate = this.data.followupDate
        this.opdipdno = this.data.visitId





    }

    OnSave() {
        debugger
        const submitData = {
            "fromDate": this.datePipe.transform(this._AppointmentlistService.FollowupFormGroup.get("followupdate").value, "yyyy-MM-dd") || "1900/01/01",

        }
        console.log(submitData)
        this._AppointmentlistService.UpdateFollowupdate(submitData).subscribe((response) => {
            this.onClose()
        });
    }
    onClose() {
        this._matDialog.closeAll();
        this._AppointmentlistService.FollowupFormGroup.get("followupdate").setValue(new Date());

    }
}

