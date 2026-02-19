import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { fuseAnimations } from '@fuse/animations';
import { ItemNameList } from 'app/main/purchase/purchase-order/purchase-order.component';

@Component({
  selector: 'app-patient-billdetail',
  templateUrl: './patient-billdetail.component.html',
  styleUrls: ['./patient-billdetail.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PatientBilldetailComponent {
  registerObj: any;
  pBillNo = "0"
  opipType = "1"
  DoctorId = "1"
  doctorName: any;
  sIsLoading: string = '';
  BillId = 0
  displayedColumns: string[] = [

    'serviceName',

    'Price',
    'Qty',
    'TotalAmt',
    'ConcessionAmount',
    'NetAmount',
    'DoctorName',
    'DocPer',
    'DocAmt',
    'HospitalAmt',
  ]


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
      debugger
      console.log(this.data)
      this.pBillNo = this.data.obj.billNo//"460203",//----------------------fr table
      this.BillId = this.data.obj.BillId
      this.opipType = this.data.obj.opdipdtype
      this.doctorName = this.data.obj.addChargeDrName
      this.DoctorId = this.data.doctorId || 0
      this.getBilldetailList()
    }
  }

  getBilldetailList() {
    var vdata = {
      "first": 0,
      "rows": 200,
      "sortField": "DoctorId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "BillNo",
          "fieldValue": String(this.pBillNo),//"228677",//
          "opType": "Equals"
        },
        {
          "fieldName": "DoctorId",
          "fieldValue": String(this.DoctorId),
          "opType": "Equals"
        }
      ],
      "Columns": [],
      "exportType": "JSON"
    }
    console.log(vdata)
    this._DoctorShareService.getBilldetailList(vdata).subscribe(data => {
      this.Billdetaildatasource.data = data.data as BillListForDocShrList[]
      console.log(this.Billdetaildatasource.data)
      if (this.Billdetaildatasource.data.length > 0)
        this.getsumdetail()
    })
  }

  TotAmt = 0
  TotconAmt = 0
  TotNetamt = 0
  TotDocAmt = 0
  TothospitalAmt = 0
  count = 0

  getsumdetail() {
    this.count = this.Billdetaildatasource.data.length
    this.TotAmt = this.Billdetaildatasource.data.reduce((sum, { totalAmt }) => sum += +(totalAmt || 0), 0);
    this.TotconAmt = this.Billdetaildatasource.data.reduce((sum, { concessionAmount }) => sum += +(concessionAmount || 0), 0);
    this.TotNetamt = this.Billdetaildatasource.data.reduce((sum, { netAmount }) => sum += +(netAmount || 0), 0);

    this.TotDocAmt = this.Billdetaildatasource.data.reduce((sum, { docAmt }) => sum += +(docAmt || 0), 0);
    this.TothospitalAmt = this.Billdetaildatasource.data.reduce((sum, { hospitalAmt }) => sum += +(hospitalAmt || 0), 0);

  }

  calculateshare() {
    debugger
    var data = {
      billNo: this.pBillNo,
      doctorId: parseInt(this.DoctorId)
    }
    console.log(data)
    this._DoctorShareService.DoctorCalculateshare(data).subscribe((response) => {
      console.log(response)
      this._matDialog.closeAll()
    });

  }

  Save() {
    let Billdetsarr = [];
    this.Billdetaildatasource.data.forEach((element) => {
      let BillDetailsInsertObj = {};
      BillDetailsInsertObj['docAmt'] = element.docAmt;
      BillDetailsInsertObj['hospitalAmt'] = element.hospitalAmt;
      BillDetailsInsertObj['chargesId'] = element.chargesId;
      Billdetsarr.push(BillDetailsInsertObj);
    });


    let data = {
      "shareDoctAddCharge": Billdetsarr
    }
    console.log(data)
    this._DoctorShareService.Updatesharedoccharges(data).subscribe((response) => {
      this._matDialog.closeAll();
    });
    // } 
  }


  getCellCalculation(item: ItemNameList) {
    console.log(item)
    setTimeout(() => {

      item.hospitalAmt = (Number(item.netAmount) - Number(item.docAmt)).toFixed(2); // just in case

    });
    this.getsumdetail()
  }

  onClose() {
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
  admittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;
  GroupName: any;
  price: any;
  qty: any;
  totalAmt: any;
  concessionAmount: any;
  netAmount: any;
  doctorName: any;
  docAmt: any;
  hospitalAmt: any;
  addChargeDrName: any;
  chargesId: any;

  constructor(BillListForDocShrList) {

    this.PatientName = BillListForDocShrList.PatientName;
    this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
    this.ConAmt = BillListForDocShrList.ConAmt || '0';
    this.NetAmt = BillListForDocShrList.NetAmt || 0;
    this.PBillNo = BillListForDocShrList.PBillNo || 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.admittedDoctorName = BillListForDocShrList.admittedDoctorName;
    this.PatientType = BillListForDocShrList.PatientType || 0;
    this.CompanyName = BillListForDocShrList.CompanyName;
    this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
    this.GroupName = BillListForDocShrList.GroupName || '';


    this.price = BillListForDocShrList.price || 0;
    this.qty = BillListForDocShrList.qty || 0;
    this.totalAmt = BillListForDocShrList.totalAmt || 0;
    this.concessionAmount = BillListForDocShrList.concessionAmount || 0;
    this.netAmount = BillListForDocShrList.netAmount || 0;
    this.doctorName = BillListForDocShrList.doctorName || '';
    this.docAmt = BillListForDocShrList.docAmt || 0;
    this.hospitalAmt = BillListForDocShrList.hospitalAmt || 0;
    this.addChargeDrName = BillListForDocShrList.addChargeDrName || '';
    this.chargesId = BillListForDocShrList.chargesId || 0;
  }
}


