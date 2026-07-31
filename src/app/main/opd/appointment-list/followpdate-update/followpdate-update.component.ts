import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { AppointmentlistService } from '../appointmentlist.service';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';

@Component({
    selector: 'app-followpdate-update',
    templateUrl: './followpdate-update.component.html',
    styleUrls: ['./followpdate-update.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class FollowpdateUpdateComponent {
    FollowupFormGroup: FormGroup
    prevfolloeupdate: any
    opdipdno: any

    constructor(
        public _AppointmentlistService: AppointmentlistService,
        public datePipe: DatePipe, private _formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
    ) { }
    followUpDate: any//=new Date()
    ngOnInit(): void {
        this.FollowupFormGroup = this.createFollowupDateupdateForm();


        debugger
        if (this.data) {
            console.log(this.data)
            this.prevfolloeupdate = this.data.followupDate
            this.opdipdno = this.data.visitId
            // setTimeout(() => {
            //     this.followUpDate = new Date(this.data.followupDate);

            //    this.followUpDate= this.datePipe.transform( this.followUpDate, "dd-MMM-yyyy")
            //     this.FollowupFormGroup.get('followupdate').patchValue( this.followUpDate)
            // }, 500);

            const dateParts = this.data.followupDate.split('/'); // ["28", "08", "2026"]
            const day = +dateParts[0];
            const month = +dateParts[1] - 1;   // Month is 0-based
            const year = +dateParts[2];

            const parsedDate = new Date(year, month, day);
            this.FollowupFormGroup.get('followupdate')?.setValue(parsedDate);

        }

    }
    createFollowupDateupdateForm() {
        return this._formBuilder.group({
            followupdate: null,//this.followUpDate,// [(new Date()).toISOString()],

        })
    }


    OnSave() {

        const submitData = {
            "visitId": this.opdipdno,
            "followupDate": this.datePipe.transform(this.FollowupFormGroup.get("followupdate").value, "yyyy-MM-dd") || "1900/01/01",

        }
        console.log(submitData)
        this._AppointmentlistService.UpdateFollowupdate(submitData).subscribe((response) => {
            this.onClose()
        });
    }
    onClose() {
        this._matDialog.closeAll();
        this.FollowupFormGroup.get("followupdate").setValue(new Date());

    }
}

