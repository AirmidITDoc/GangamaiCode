import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { CurrentStockService } from '../current-stock.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-item-movement-summery',
  templateUrl: './item-movement-summery.component.html',
  styleUrls: ['./item-movement-summery.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ItemMovementSummeryComponent implements OnInit {
 
  displayedColumns = [
    'TranDate',
    'TransactionType',
    'DocumentNo',
    'PatientName',
    'BatchNo',
    'BatchExpDate',
    'ReceiptQty',
    'IssueQty',
    'BalQty'
  ];
  displayedColumns1 = [
    'BatchNo',
    'TransactionType',
    'DocumentNo',
    'PatientName',
    'BatchNo',
    'BatchExpDate',
    'ReceiptQty',
    'IssueQty',
    'BalQty'
  ];
  displayedColumns2 = [
    'BatchNo',
    'TransactionType',
    'DocumentNo',
    'PatientName',
    'BatchNo',
    'BatchExpDate',
    'ReceiptQty',
    'IssueQty',
    'BalQty'
  ];

  isItemSelected: boolean = false;
  StoreList: any = [];
  dateTimeObj: any;
  filteredOptions: any;
  ItemListfilteredOptions: any;
  noOptionFound: boolean = false;
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  registerObj:any;
  fiveDaysAgo:any;

  dsItemMovementSummery = new MatTableDataSource<ItemMovementList>();
  dsBatchExpWise = new MatTableDataSource<BatchExpWiseList>();
  dsPurSupplierWise= new MatTableDataSource<PurSupplierWiseList>();
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;  
  constructor(
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<ItemMovementSummeryComponent>,
    public _CurrentStockService: CurrentStockService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if(this.data.Obj ){
      this.registerObj = this.data.Obj;
      //console.log(this.registerObj);
      this._CurrentStockService.ItemSummeryFrom.get("start").setValue(this.fiveDaysAgo);
    }
    this.gePharStoreList();
    this.getItemMovementSummeryList();
    this.getBatchExpWiseList();
    this.getPueSupplierWiseList();
  
    const currentDate = new Date();
    const fiveDaysAgos = new Date(currentDate.setDate(currentDate.getDate() - 5));
    this.fiveDaysAgo =  this.datePipe.transform (new Date(currentDate.setDate(currentDate.getDate() - 5)),"yyyy-MM-dd 00:00:00.000");
    this._CurrentStockService.ItemSummeryFrom.get("start").setValue(fiveDaysAgos);
    //console.log(this.fiveDaysAgo)
    //  this.datePipe.transform(this._CurrentStockService.ItemSummeryFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._CurrentStockService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._CurrentStockService.ItemSummeryFrom.get('StoreId').setValue(this.StoreList[0]);
    });
  }
//itemMovement Summery
  getItemMovementSummeryList(){
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromDate":this.fiveDaysAgo || this.datePipe.transform(this._CurrentStockService.ItemSummeryFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "ToDate": this.datePipe.transform(this._CurrentStockService.ItemSummeryFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "FromStoreID": this.registerObj.StoreId || 0,
     "ItemId":this.registerObj.ItemId || 0 
    }
  // console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getItemMovementsummeryList(vdata).subscribe((Visit) => {
          this.dsItemMovementSummery.data = Visit as ItemMovementList[];
        // console.log(this.dsItemMovementSummery);
          this.dsItemMovementSummery.sort = this.sort;
          this.dsItemMovementSummery.paginator = this.paginator;
          this.sIsLoading = '';
          this.isLoadingStr = this.dsItemMovementSummery.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
           this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  //batchExpwiseList
  getBatchExpWiseList(){
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromStoreID": this.registerObj.StoreId || 0,
     "ItemId":this.registerObj.ItemId || 0 
    }
   console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getBatchExpWiseList(vdata).subscribe((data) => {
          this.dsBatchExpWise.data = data as BatchExpWiseList[];
          console.log(data)
          console.log(this.dsBatchExpWise);
          this.dsBatchExpWise.sort = this.sort;
          this.dsBatchExpWise.paginator = this.paginator;
          this.sIsLoading = '';
        },
        (error) => {
           this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
    //Purchase SupplierwiseList
    getPueSupplierWiseList(){
      this.sIsLoading = 'loading-data';
      var vdata = {
       "FromStoreID": this.registerObj.StoreId || 0,
       "ItemId":this.registerObj.ItemId || 0 
      }
     console.log(vdata)
      setTimeout(() => {
        this._CurrentStockService.getPueSupplierWiseList(vdata).subscribe((data) => {
            this.dsPurSupplierWise.data = data as PurSupplierWiseList[];
            console.log(data)
            console.log(this.dsPurSupplierWise);
            this.dsPurSupplierWise.sort = this.sort;
            this.dsPurSupplierWise.paginator = this.paginator;
            this.sIsLoading = '';
          },
          (error) => {
             this.isLoadingStr = 'no-data';
          }
        );
      }, 1000);
    }
  onClose(){
    this._matDialog.closeAll();
  }
  onClear(){

  }
}
export class ItemMovementList{
  TranDate:any;
  TransactionType:any;
  DocumentNo:number;
  PatientName:string;
  BatchNo:any;
  BatchExpDate:number;
  ReceiptQty:number;
  IssueQty:number;
  BalQty:number;

  constructor(ItemMovementList){
    {
      this.TranDate = ItemMovementList.TranDate || 0;
      this.TransactionType = ItemMovementList.TransactionType || '';
      this.DocumentNo = ItemMovementList.DocumentNo || 0;
      this.PatientName = ItemMovementList.PatientName || "";
      this.BatchNo = ItemMovementList.BatchNo || '';
      this.BatchExpDate = ItemMovementList.BatchExpDate || 0;
      this.ReceiptQty = ItemMovementList.ReceiptQty || 0;
      this.IssueQty = ItemMovementList.IssueQty || 0;
      this.BalQty = ItemMovementList.BalQty ||  0;
    }

  }
}
export class BatchExpWiseList{
  TranDate:any;
  TransactionType:any;
  DocumentNo:number;
  PatientName:string;
  BatchNo:any;
  BatchExpDate:number;
  ReceiptQty:number;
  IssueQty:number;
  BalQty:number;

  constructor(BatchExpWiseList){
    {
      this.TranDate = BatchExpWiseList.TranDate || 0;
      this.TransactionType = BatchExpWiseList.TransactionType || '';
      this.DocumentNo = BatchExpWiseList.DocumentNo || 0;
      this.PatientName = BatchExpWiseList.PatientName || "";
      this.BatchNo = BatchExpWiseList.BatchNo || '';
      this.BatchExpDate = BatchExpWiseList.BatchExpDate || 0;
      this.ReceiptQty = BatchExpWiseList.ReceiptQty || 0;
      this.IssueQty = BatchExpWiseList.IssueQty || 0;
      this.BalQty = BatchExpWiseList.BalQty ||  0;
    }
  }
}
export class PurSupplierWiseList{
  TranDate:any;
  TransactionType:any;
  DocumentNo:number;
  PatientName:string;
  BatchNo:any;
  BatchExpDate:number;
  ReceiptQty:number;
  IssueQty:number;
  BalQty:number;

  constructor(PurSupplierWiseList){
    {
      this.TranDate = PurSupplierWiseList.TranDate || 0;
      this.TransactionType = PurSupplierWiseList.TransactionType || '';
      this.DocumentNo = PurSupplierWiseList.DocumentNo || 0;
      this.PatientName = PurSupplierWiseList.PatientName || "";
      this.BatchNo = PurSupplierWiseList.BatchNo || '';
      this.BatchExpDate = PurSupplierWiseList.BatchExpDate || 0;
      this.ReceiptQty = PurSupplierWiseList.ReceiptQty || 0;
      this.IssueQty = PurSupplierWiseList.IssueQty || 0;
      this.BalQty = PurSupplierWiseList.BalQty ||  0;
    }

  }
}
