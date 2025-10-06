import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { ToastrService } from 'ngx-toastr';
import { DoctorShareService } from '../doctor-share.service';

@Component({
  selector: 'app-process-doctor-share',
  templateUrl: './process-doctor-share.component.html',
  styleUrls: ['./process-doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ProcessDoctorShareComponent implements OnInit {


  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }

  OnSave() {
    debugger
    let submitData = {
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
