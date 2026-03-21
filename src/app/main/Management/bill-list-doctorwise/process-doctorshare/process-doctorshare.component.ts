import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { BillDoctorwiseService } from '../bill-doctorwise.service';

@Component({
    selector: 'app-process-doctorshare',
    templateUrl: './process-doctorshare.component.html',
    styleUrls: ['./process-doctorshare.component.scss']
})
export class ProcessDoctorshareComponent {


    constructor(
        public _DoctorShareService: BillDoctorwiseService,
        public datePipe: DatePipe,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
    }

    OnSave() {
        debugger
        const submitData = {
            "fromDate": this.datePipe.transform(this._DoctorShareService.DocPrecessForm.get("startdate").value, "yyyy-MM-dd") || "1900/01/01",
            "toDate": this.datePipe.transform(this._DoctorShareService.DocPrecessForm.get("enddate").value, "yyyy-MM-dd") || "1900/01/01",
        }
        console.log(submitData)
        this._DoctorShareService.SaveProcessdocShare(submitData).subscribe((response) => {
            this.onClose()
        });
    }
    onClose() {
        this._matDialog.closeAll();
        this._DoctorShareService.DocPrecessForm.get("startdate").setValue(new Date());
        this._DoctorShareService.DocPrecessForm.get("enddate").setValue(new Date());
    }
}

