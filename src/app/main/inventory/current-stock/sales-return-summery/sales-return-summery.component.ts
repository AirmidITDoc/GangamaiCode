import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { CurrentStockService } from '../current-stock.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sales-return-summery',
  templateUrl: './sales-return-summery.component.html',
  styleUrls: ['./sales-return-summery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SalesReturnSummeryComponent implements OnInit {
  displayedColumns = [
    'ItemName',
    'BatchNo',
    'ReturnQty',
  ];
  displayedColumns1 = [
    'SalesReturnNo',
    'Date',
    'ItemName',
    'BatchNo',
    //'BatchExpDate',
    'Qty',
    'MRP',
  ];
  
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  registerObj:any;

  dsSalesRetSummeryList =new MatTableDataSource<SaleReturnssummeryList>();
  dsSalesRetSummeryDetList =new MatTableDataSource<SalesReturnsummeryDetList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesReturnSummeryComponent>,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj){
      this.registerObj = this.data.Obj;
      console.log(this.registerObj)
    }
    this.getSalesReturnSummeryList();
    this.getSalesReturnSummeryDetailsList();
  }
  getSalesReturnSummeryList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
    "ItemId": this.registerObj.ItemId || 0,
    "ToStoreId": this.registerObj.StoreId || 0
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesReturnSummeryList(vdata).subscribe(data =>{
        this.dsSalesRetSummeryList.data = data as SaleReturnssummeryList[];
        this.dsSalesRetSummeryList.sort = this.sort;
        this.dsSalesRetSummeryList.paginator = this.paginator;
        console.log(this.dsSalesRetSummeryList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsSalesRetSummeryList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);

  }
  getSalesReturnSummeryDetailsList(){
    this.sIsLoading = 'loading-data';
   var  vdata={
     "ItemId": this.registerObj.ItemId || 0,
     "ToStoreId": this.registerObj.StoreId || 0
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesReturnDetailSummeryList(vdata).subscribe(data =>{
        this.dsSalesRetSummeryDetList.data = data as SalesReturnsummeryDetList[];
        this.dsSalesRetSummeryDetList.sort = this.sort;
        this.dsSalesRetSummeryDetList.paginator = this.SecondPaginator;
        console.log(this.dsSalesRetSummeryDetList.data)
        this.sIsLoading = '';
        this.isLoadingStr = this.dsSalesRetSummeryDetList.data.length == 0 ? 'no-data' : '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  onClose(){
    this.dsSalesRetSummeryDetList.data =[];
    this.dsSalesRetSummeryList.data = [];
    this._matDialog.closeAll();
  }
}
export class SaleReturnssummeryList {
 
  ItemName: any;
  BatchNo: any;
  ReturnQty: number;

  constructor(SaleReturnssummeryList) {
    {
      this.ItemName = SaleReturnssummeryList.ItemName || '';
      this.BatchNo = SaleReturnssummeryList.BatchNo || '';
      this.ReturnQty = SaleReturnssummeryList.ReturnQty || 0;
    }
  }
}
export class SalesReturnsummeryDetList {

  SalesReturnNo: any;
  Date: any;
  ItemName: any;
  BatchNo: any;
  BatchExpDate: number;
  Qty: number;
  MRP: number;

  constructor(SalesReturnsummeryDetList) {
    {
      this.SalesReturnNo = SalesReturnsummeryDetList.SalesReturnNo || 0;
      this.Date = SalesReturnsummeryDetList.Date || '';
      this.ItemName = SalesReturnsummeryDetList.ItemName || 0;
      this.BatchExpDate = SalesReturnsummeryDetList.BatchExpDate || 0;
      this.BatchNo = SalesReturnsummeryDetList.BatchNo || '';
      this.Qty = SalesReturnsummeryDetList.Qty || 0;
      this.MRP = SalesReturnsummeryDetList.MRP || 0;
    }
  }
}
