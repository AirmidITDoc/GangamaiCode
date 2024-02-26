import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DashboardService } from '../../dashboard.service';
import { FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sales-summary',
  templateUrl: './sales-summary.component.html',
  styleUrls: ['./sales-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesSummaryComponent implements OnInit {
  displayedColumns: string[] = [
    'Date',
    'StoreName',
    'CollectionAmount',
    'RefundAmount',
    'NetAmount',
    'BillCount'
  ];
  displayedColumns1: string[] = [
    'Date',
    'StoreName',
    'CollectionAmount',
    'RefundAmount',
    'NetAmount',
    'BillCount'
  ];
  dsDayWiseList = new MatTableDataSource<DayWiseList>();
  dsMonthWiseList = new MatTableDataSource<MonthWiseList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  rangeFormGroup: FormGroup;
  FromStoreList:any=[];

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<SalesSummaryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _DashboardService: DashboardService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    if (this.data) {
      this.getPharDayWiseData(this.data.Obj.IssueId);
      setTimeout(() => {
      }, 2000);
    }
    this.getPharStoreList();
  }
  onClose() {
    this.dialogRef.close();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getPharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._DashboardService.getLoggedStoreList(vdata).subscribe(data => {
      this.FromStoreList = data;
     // console.log(this.FromStoreList);
      this._DashboardService.DayWiseFrom.get('FromStoreId').setValue(this.FromStoreList[0]);
      this._DashboardService.MonthWiseFrom.get('FromStoreId').setValue(this.FromStoreList[0]);
    });
  }
  getPharDayWiseData(Params) {
    var Param = {
      "FromDate": this.datePipe.transform(this._DashboardService.DayWiseFrom.get('start').value,"MM-dd-yyyy"),
      "ToDate": this.datePipe.transform(this._DashboardService.DayWiseFrom.get('end').value,"MM-dd-yyyy"),
      "StoreId": this._loggedService.currentUserValue.user.storeId
    }
   // console.log(Param);
    this._DashboardService.getPharDayWiseDashboard(Param).subscribe(data => {
      this.dsDayWiseList.data = data as DayWiseList[];
     // console.log(this.dsDayWiseList);
      this.dsDayWiseList.sort = this.sort;
      this.dsDayWiseList.paginator = this.paginator;
    },
      error => {
        // this.sIsLoading = '';
      });
  }
  getPharMonthWiseData(Params) {
    var Param = {
      "FromDate": this.datePipe.transform(this._DashboardService.MonthWiseFrom.get('startDate').value,"MM-dd-yyyy"),
      "ToDate": this.datePipe.transform(this._DashboardService.MonthWiseFrom.get('endDate').value,"MM-dd-yyyy"),
      "StoreId":  this._loggedService.currentUserValue.user.storeId
    }
    this._DashboardService.getPharMonthWiseDashboard(Param).subscribe(data => {
      this.dsMonthWiseList.data = data as MonthWiseList[];
      console.log(this.dsMonthWiseList);
      this.dsMonthWiseList.sort = this.sort;
      this.dsMonthWiseList.paginator = this.paginator;
    },
      error => {
        // this.sIsLoading = '';
      });
  }

}

export class DayWiseList {
  StoreName: string;
  Date: number;
  CollectionAmount: number;
  RefundAmount: any;
  NetAmount: any;
  BillCount:any;
  /**
   * Constructor
   *
   * @param DayWiseList
   */
  constructor(DayWiseList) {
    {
      this.StoreName = DayWiseList.StoreName || "";
      this.Date = DayWiseList.Date || 0;
      this.CollectionAmount = DayWiseList.CollectionAmount || 0;
      this.RefundAmount = DayWiseList.RefundAmount || 0;
      this.NetAmount = DayWiseList.NetAmount || 0;
      this.BillCount = DayWiseList.BillCount || 0;
    }
  }
}
export class MonthWiseList {
  StoreName: string;
  Date: number;
  CollectionAmount: number;
  RefundAmount: any;
  NetAmount: any;
  BillCount:any;
  /**
   * Constructor
   *
   * @param MonthWiseList
   */
  constructor(MonthWiseList) {
    {
      this.StoreName = MonthWiseList.StoreName || "";
      this.Date = MonthWiseList.Date || 0;
      this.CollectionAmount = MonthWiseList.CollectionAmount || 0;
      this.RefundAmount = MonthWiseList.RefundAmount || 0;
      this.NetAmount = MonthWiseList.NetAmount || 0;
      this.BillCount = MonthWiseList.BillCount || 0;
    }
  }
}