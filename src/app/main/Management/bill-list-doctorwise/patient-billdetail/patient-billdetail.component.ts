import { Component, Inject, TemplateRef, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { BillDoctorwiseService } from '../bill-doctorwise.service';
import { DatePipe } from '@angular/common';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-patient-billdetail',
  templateUrl: './patient-billdetail.component.html',
  styleUrls: ['./patient-billdetail.component.scss']
})
export class PatientBilldetailComponent {


  displayedColumns: string[] = [

    'serviceName',
    'Price',
    'Qty',
    'TotalAmt',
    'DoctorName',
    'DocAmt',

  ]

  registerObj: any;
  pBillNo = "0"
  opipType = "1"
  DoctorId = "0"
  Billdetaildatasource = new MatTableDataSource<BillListForDocShrList>();
  @ViewChild('drawer') public drawer: MatDrawer;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();


  constructor(
    public _DoctorShareService: BillDoctorwiseService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this._DoctorShareService.UserFormGroup.patchValue({
      startdate: oneMonthAgo
    });


    if (this.data) {
      console.log(this.data)
      this.pBillNo = this.data.pbillNo
      // this.fromDate = this.data.BillDate
      // this.toDate=this.data.pbillNo
      this.opipType = this.data.opdipdtype

      this.DoctorId = this.data.doctorId || 0
      this.getLastVisitDoctorList()
    }
  }

  getLastVisitDoctorList() {
    var vdata = {
      "first": 0,
      "rows": 20,
      "sortField": "DoctorId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "FromDate",
          "fieldValue": "1900-01-01",
          "opType": "Equals"
        },
        {
          "fieldName": "ToDate",
          "fieldValue": "1900-01-01",
          "opType": "Equals"
        },
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.DoctorId),
          "opType": "Equals"
        },
        {
          "fieldName": "PBillNo",
          "fieldValue": String(this.pBillNo),
          "opType": "Equals"
        },
        {
          "fieldName": "OP_IP_TYpe",
          "fieldValue": String(this.opipType),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    this._DoctorShareService.getBilldetailList(vdata).subscribe(data => {
      this.Billdetaildatasource.data = data.data as BillListForDocShrList[]
    })
  }
onClose(){
  this._matDialog.closeAll()
}
}


export class BillListForDocShrList {

  PatientName: string;
  TotalAmt: number;
  ConAmt: number;
  NetAmt: number;
  PBillNo: number;
  // BillNo: number;
  AdmittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;
  GroupName: any;
  constructor(BillListForDocShrList) {

    this.PatientName = BillListForDocShrList.PatientName;
    this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
    this.ConAmt = BillListForDocShrList.ConAmt || '0';
    this.NetAmt = BillListForDocShrList.NetAmt || 0;
    this.PBillNo = BillListForDocShrList.PBillNo || 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.AdmittedDoctorName = BillListForDocShrList.AdmittedDoctorName;
    this.PatientType = BillListForDocShrList.PatientType || 0;
    this.CompanyName = BillListForDocShrList.CompanyName;
    this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
    this.GroupName = BillListForDocShrList.GroupName || '';
  }
}


