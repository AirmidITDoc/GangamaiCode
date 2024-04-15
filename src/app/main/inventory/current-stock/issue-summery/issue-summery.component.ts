import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { CurrentStockService } from '../current-stock.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-issue-summery',
  templateUrl: './issue-summery.component.html',
  styleUrls: ['./issue-summery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IssueSummeryComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ReceivedQty',
  ];
  displayedColumns1 = [
    'IssueNo',
    'IssueDate',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'IssueQty',
    'UnitMRP',
    'PurRate',
    'LandedRate',
    'StkId',
  ];
  
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  registerObj:any;

  dsIssueSummeryList =new MatTableDataSource<IssuesummeryList>();
  dsIssueSummeryDetList =new MatTableDataSource<IssuesummeryDetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IssueSummeryComponent>,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
    this.getIssueSummeryList();
    this.getIssueSummeryDetailsList();
  }

  getIssueSummeryList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
    "ItemId": this.registerObj.ItemId || 0,
    "ToStoreId": this.registerObj.StoreId || 0
    }
    setTimeout(() => {
      this._CurrentStockService.getIssueSummeryList(vdata).subscribe(data =>{
        this.dsIssueSummeryList.data = data as IssuesummeryList[];
        this.dsIssueSummeryList.sort = this.sort;
        this.dsIssueSummeryList.paginator = this.paginator;
        console.log(this.dsIssueSummeryList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsIssueSummeryList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);

  }
  getIssueSummeryDetailsList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
     "ItemId": this.registerObj.ItemId || 0,
     "ToStoreId": this.registerObj.StoreId || 0
    }
    setTimeout(() => {
      this._CurrentStockService.getIssueSummeryDetailList(vdata).subscribe(data =>{
        this.dsIssueSummeryDetList.data = data as IssuesummeryDetList[];
        this.dsIssueSummeryDetList.sort = this.sort;
        this.dsIssueSummeryDetList.paginator = this.SecondPaginator;
        console.log(this.dsIssueSummeryDetList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsIssueSummeryDetList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  onClose(){
    this.dsIssueSummeryDetList.data =[];
    this.dsIssueSummeryList.data = [];
    this._matDialog.closeAll();
  }
}
export class IssuesummeryList {
 
  ItemName: any;
  BatchNo: any;
  ReceivedQty: number;

  constructor(IssuesummeryList) {
    {
      this.ItemName = IssuesummeryList.ItemName || '';
      this.BatchNo = IssuesummeryList.BatchNo || '';
      this.ReceivedQty = IssuesummeryList.ReceivedQty || 0;
    }
  }
}
export class IssuesummeryDetList {

  IssueNo: any;
  IssueDate: any;
  ItemName: any;
  BatchNo: any;
  BatchExpDate: number;
  IssueQty: number;
  UnitMRP: number;
  PurRate: number;
  LandedRate: number;
  StkId:any;

  constructor(IssuesummeryDetList) {
    {
      this.IssueNo = IssuesummeryDetList.IssueNo || 0;
      this.IssueDate = IssuesummeryDetList.IssueDate || '';
      this.ItemName = IssuesummeryDetList.ItemName || 0;
      this.BatchExpDate = IssuesummeryDetList.BatchExpDate || 0;
      this.BatchNo = IssuesummeryDetList.BatchNo || '';
      this.IssueQty = IssuesummeryDetList.IssueQty || 0;
      this.UnitMRP = IssuesummeryDetList.UnitMRP || 0;
      this.PurRate = IssuesummeryDetList.PurRate || 0;
      this.LandedRate = IssuesummeryDetList.LandedRate || 0;
    }
  }
}
