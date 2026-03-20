import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { RegInsert } from '../lab-patient-reg.component';

@Component({
  selector: 'app-lab-tracking-details',
  templateUrl: './lab-tracking-details.component.html',
  styleUrls: ['./lab-tracking-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class LabTrackingDetailsComponent {

  registerObj: any;
  dsTracker = new MatTableDataSource<RegInsert>();

  constructor(
    public _labPatientRegService: LabPatientRegService,
    private dialogRef: MatDialogRef<LabTrackingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public matDialog: MatDialog,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.data) {
      this.registerObj = this.data
      console.log(this.registerObj)
      this.gettrackerList(this.registerObj)
    }
  }

  trackerList: any[] = [];
  gettrackerList(Obj) {
    const vdata = {
      "searchFields": [
        {
          "fieldName": "OpipId",
          "fieldValue": String(Obj.labPatientId),
          "opType": "13"
        }
      ],
      "mode": "LabSampletracker"
    }
    this._labPatientRegService.commonList(vdata).subscribe(data => {
      // this.dsTracker.data = data as RegInsert[]
      // console.log("Tracker List:", this.dsTracker.data)
      // this.trackerList = data as any[];
      this.trackerList = data.filter(item =>
        // item.RegDate &&
        // item.RegDate !== '1900-01-01T00:00:00'
        item.RegTime &&
        item.RegTime !== '1900-01-01T00:00:00'
      );
      console.log('Tracker List:', this.trackerList);
    })
  }

  onClose() {
    this.dialogRef.close();
  }

}
