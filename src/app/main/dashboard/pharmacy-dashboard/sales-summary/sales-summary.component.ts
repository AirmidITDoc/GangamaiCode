import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../dashboard.service';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.scss']
})
export class SalesSummaryComponent implements OnInit {

  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  rangeFormGroup: FormGroup;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<SalesSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _DashboardService: DashboardService,
    public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    if (this.data) {
      this.getPharDayWiseData(this.data.Obj.IssueId);
      setTimeout(() => {
      }, 2000);
    }
  }
  onClose() {
    this.dialogRef.close();
  }

  getPharDayWiseData(Params) {
    var Param = {
      // "FromDate": this.datePipe.transform(this.rangeFormGroup.get('startDate').value,"MM-dd-yyyy"),
      // "ToDate": this.datePipe.transform(this.rangeFormGroup1.get('endDate').value,"MM-dd-yyyy")
      // "IssueId": Params
    }
    this._DashboardService.getPharDayWiseDashboard(Param).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
    },
      error => {
        // this.sIsLoading = '';
      });
  }
  getPharMonthWiseData(Params) {
    var Param = {
      // "FromDate": this.datePipe.transform(this.rangeFormGroup.get('startDate').value,"MM-dd-yyyy"),
      // "ToDate": this.datePipe.transform(this.rangeFormGroup1.get('endDate').value,"MM-dd-yyyy")
      // "IssueId": Params
    }
    this._DashboardService.getPharDayWiseDashboard(Param).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
    },
      error => {
        // this.sIsLoading = '';
      });
  }

}

export class ItemList {
  ItemName: string;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.IssueQty = ItemList.IssueQty || 0;
      this.Bal = ItemList.Bal || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || '';
    }
  }
}