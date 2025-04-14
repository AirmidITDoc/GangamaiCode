import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { IPSearchListService } from '../../ip-search-list.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-prebill-details',
  templateUrl: './prebill-details.component.html',
  styleUrls: ['./prebill-details.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class PrebillDetailsComponent implements OnInit {
  BillNo :any ='0'
   @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
   PrevColumnList=[
    { heading: "Bill No", key: "billNo", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "Service Name", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Total Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 140 },
    { heading: "Disc Amt", key: "concessionAmount", sort: true, align: 'left', emptySign: 'NA', width: 110 },
    { heading: "Net Amt", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', width: 140 },
    { heading: "Add Doctor Name", key: "addDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 }, 
  ] 
  gridConfig: gridModel = {
    apiUrl: "IPBill/PreviousBillDetailList", 
    columnsList: this.PrevColumnList,
    sortField: "BillNo",
    sortOrder: 0,
    filters: [
      { fieldName: "BillNo", fieldValue: String(this.BillNo), opType:OperatorComparer.Equals }
    ],
    row: 10
  }
 
  registerObj:any;  
  
  constructor(
    public _IpSearchListService: IPSearchListService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    public dialogRef: MatDialogRef<PrebillDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, 
  ) { }

  ngOnInit(): void {
    if(this.data){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
      this.BillNo = this.registerObj.billNo
      this.getprelistData(this.BillNo);
    }
  }  
  getprelistData(BillNo){
    this.gridConfig = {
      apiUrl: "IPBill/PreviousBillDetailList", 
      columnsList: this.PrevColumnList,
      sortField: "BillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "BillNo", fieldValue: String(BillNo), opType:OperatorComparer.Equals }
      ]
    }
  }
  onClose(){
    this.dialogRef.close();
  }
}
export class PreDetailsList {
  AdmissionID: Number;
  BillNo: any;
  BillDate: Date;
  concessionReasonId: number;
  tariffId: number;
  RemarkofBill: string
  /**
 * Constructor
 *
 * @param PreDetailsList
 */
  constructor(PreDetailsList) {
    {
      this.AdmissionID = PreDetailsList.AdmissionID || '';
      this.BillNo = PreDetailsList.BillNo || '';
      this.BillDate = PreDetailsList.BillDate || '';
      this.concessionReasonId = PreDetailsList.concessionReasonId || '';
      this.tariffId = PreDetailsList.tariffId || '';
      this.RemarkofBill = PreDetailsList.RemarkofBill;
    }
  }
}
