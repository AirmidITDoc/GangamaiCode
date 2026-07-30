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
    vfollowupdate = new Date()
    constructor(
        public _AppointmentlistService: AppointmentlistService,
        public datePipe: DatePipe, private _formBuilder: UntypedFormBuilder,
        public _matDialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {


        debugger
        if (this.data) {
            console.log(this.data)
            this.prevfolloeupdate = this.data.followupDate
            // this.vfollowupdate = new Date(this.prevfolloeupdate)
            this.opdipdno = this.data.visitId
        }
        this.FollowupFormGroup = this.createFollowupDateupdateForm();

    }
    createFollowupDateupdateForm() {
        return this._formBuilder.group({
            followupdate: [(new Date()).toISOString()],

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

