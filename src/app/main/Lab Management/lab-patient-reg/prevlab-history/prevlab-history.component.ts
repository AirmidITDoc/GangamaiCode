import { DatePipe } from '@angular/common';
import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { fuseAnimations } from '@fuse/animations';
import { LabPatientRegService } from '../lab-patient-reg.service';
import { RegInsert } from '../lab-patient-reg.component';

@Component({
  selector: 'app-prevlab-history',
  templateUrl: './prevlab-history.component.html',
  styleUrls: ['./prevlab-history.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrevlabHistoryComponent {
  displayedColumns: string[] = [
    'patientType',
    'billDate',
    'billNo',
    'netAmt',
    'discAmt',
    'paidAmt',
    'balAmt'
  ]
  displayedColumns1: string[] = [
    // 'visitDate',
    'ServiceName',
    'Price',
    'total',
    'dicPer',
    'dicAmt',
    'netAmt'
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
          "fieldValue": String(Obj),
          "opType": "13"
        }
      ],
      "mode": "LabCreditBillList"
    }
    this._labPatientRegService.LastCreditList(vdata).subscribe(data => {
      this.dsPrevCreditHistory.data = data as RegInsert[]
      console.log("credit Bill:", this.dsPrevCreditHistory.data)
    })
  }

  uniqueBillNo: any[] = [];
  getLastBillHistoryList(Obj) {
    var vdata = {
      "searchFields": [
        {
          "fieldName": "LabPatRegId",
          "fieldValue": String(Obj),
          "opType": "13"
        }
      ],
      "mode": "LabBillHistoryList"
    }
    this._labPatientRegService.LastCreditList(vdata).subscribe(data => {
      this.dsPrevBillHistory.data = data as RegInsert[]
      this.extractUniqueBillNo();
      console.log("credit Bill:", this.dsPrevBillHistory.data)
    })
  }

  // extractUniqueBillNo() {
  //   const vBillNo = this.dsPrevBillHistory.data.map(patient => patient.PBillNo);
  //   this.uniqueBillNo = Array.from(new Set(vBillNo));
  // }
  extractUniqueBillNo() {
    const uniqueMap = new Map();

    this.dsPrevBillHistory.data.forEach(patient => {
      if (!uniqueMap.has(patient.PBillNo)) {
        uniqueMap.set(patient.PBillNo, {
          billNo: patient.PBillNo,
          dateTime: patient.BillTime,
          patientType: patient.PatientType,
          CompanyExecutiveName: patient.CompanyExecutiveName,
          DoctorExecutiveName: patient.DoctorExecutiveName
        });
      }
    });

    this.uniqueBillNo = Array.from(uniqueMap.values());
  }


  getFirstPatientForDate(billno: string) {
    return this.dsPrevBillHistory.data.filter(patient => patient.PBillNo === billno); //
  }

  CopyHistoryList: any = [];
  CopyList: any = [];
  getCopyPreviouseList(billno: string) {
    this.CopyHistoryList.date = [];
    this.CopyList = this.dsPrevBillHistory.data.filter(patient => patient.PBillNo === billno); // 
    console.log(this.CopyList)
    this.dialogRef.close(this.CopyList);
  }

  onClose() {
    this.dialogRef.close();
  }
}
