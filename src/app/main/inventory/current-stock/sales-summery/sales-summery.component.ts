import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CurrentStockService } from '../current-stock.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sales-summery',
  templateUrl: './sales-summery.component.html',
  styleUrls: ['./sales-summery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesSummeryComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'SalesQty',
  ];
  displayedColumns1 = [
    'SalesNo',
    'Date',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'Qty',
    'UnitMRP',
  ];
  
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  registerObj:any;

  dsSalesSummeryList =new MatTableDataSource<SalessummeryList>();
  dsSalesSummeryDetList =new MatTableDataSource<SalessummeryDetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesSummeryComponent>,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
    this.getSalesSummeryList();
    this.getSalesSummeryDetailsList();
  }
  getSalesSummeryList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
    "ItemId": this.registerObj.ItemId || 0,
    "ToStoreId": this.registerObj.StoreId || 0
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesSummeryList(vdata).subscribe(data =>{
        this.dsSalesSummeryList.data = data as SalessummeryList[];
        this.dsSalesSummeryList.sort = this.sort;
        this.dsSalesSummeryList.paginator = this.paginator;
        console.log(this.dsSalesSummeryList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsSalesSummeryList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);

  }
  getSalesSummeryDetailsList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
     "ItemId": this.registerObj.ItemId || 0,
     "ToStoreId": this.registerObj.StoreId || 0
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesDetailSummeryList(vdata).subscribe(data =>{
        this.dsSalesSummeryDetList.data = data as SalessummeryDetList[];
        this.dsSalesSummeryDetList.sort = this.sort;
        this.dsSalesSummeryDetList.paginator = this.SecondPaginator;
        console.log(this.dsSalesSummeryDetList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsSalesSummeryDetList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  onClose(){
    this.dsSalesSummeryDetList.data =[];
    this.dsSalesSummeryList.data = [];
    this._matDialog.closeAll();
  }
}
export class SalessummeryList {
 
  ItemName: any;
  BatchNo: any;
  SalesQty: number;

  constructor(SalessummeryList) {
    {
      this.ItemName = SalessummeryList.ItemName || '';
      this.BatchNo = SalessummeryList.BatchNo || '';
      this.SalesQty = SalessummeryList.SalesQty || 0;
    }
  }
}
export class SalessummeryDetList {

  SalesNo: any;
  Date: any;
  ItemName: any;
  BatchNo: any;
  BatchExpDate: number;
  Qty: number;
  UnitMRP: number;

  constructor(SalessummeryDetList) {
    {
      this.SalesNo = SalessummeryDetList.SalesNo || 0;
      this.Date = SalessummeryDetList.Date || '';
      this.ItemName = SalessummeryDetList.ItemName || 0;
      this.BatchExpDate = SalessummeryDetList.BatchExpDate || 0;
      this.BatchNo = SalessummeryDetList.BatchNo || '';
      this.Qty = SalessummeryDetList.Qty || 0;
      this.UnitMRP = SalessummeryDetList.UnitMRP || 0;
    }
  }
}
