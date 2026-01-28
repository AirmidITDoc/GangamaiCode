import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { RegInsert } from 'app/main/opd/registration/registration.component';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { LabPatientRegService } from '../lab-patient-reg.service';

@Component({
  selector: 'app-prevlab-history',
  templateUrl: './prevlab-history.component.html',
  styleUrls: ['./prevlab-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrevlabHistoryComponent {
  displayedColumns: string[] = [
    // 'visitDate',
    'billNo',
    'netAmt',
    'paidAmt',
    'balAmt'
  ]

  registerObj: any;
  dsPrevCreditHistory = new MatTableDataSource<RegInsert>();
  dsPrevBillHistory = new MatTableDataSource<RegInsert>();

  constructor(
    public _labPatientRegService: LabPatientRegService,
    private dialogRef: MatDialogRef<PrevlabHistoryComponent>,
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

      this.getLastCreditList(this.registerObj)
      this.getLastBillHistoryList(this.registerObj)
    }
  }

  getLastCreditList(Obj) {
    var vdata = {
      "searchFields": [
        {
          "fieldName": "LabPatRegId",
          "fieldValue": String(Obj.visitId),//"12",
          "opType": "Contains"
        }
      ],
      "mode": "LabCreditBillList"
    }
    this._labPatientRegService.LastCreditList(vdata).subscribe(data => {
      this.dsPrevCreditHistory.data = data.data as RegInsert[]
      console.log("credit Bill:", this.dsPrevCreditHistory.data)
    })
  }

  getLastBillHistoryList(Obj) {
    var vdata = {
      "searchFields": [
        {
          "fieldName": "LabPatRegId",
          "fieldValue": String(Obj.visitId),//"12",
          "opType": "Contains"
        }
      ],
      "mode": "LabBillHistoryList"
    }
    this._labPatientRegService.LastCreditList(vdata).subscribe(data => {
      this.dsPrevBillHistory.data = data.data as RegInsert[]
      console.log("credit Bill:", this.dsPrevBillHistory.data)
    })
  }

  onClose() {
    this.dialogRef.close();
  }
}
