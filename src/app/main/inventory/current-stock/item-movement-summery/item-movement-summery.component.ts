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
    'BalQty',
    'R_Qty'
  ];
  displayedColumns1 = [
    'BatchNo',
    'ExpDate',
    'LandedRate',
    'PurUnitRateWF',
    'PurchaseRate',
    'UnitMRP',
    'TotalByMRP',
    'TotalByPTR',
    'BalQty'
  ];
  displayedColumns2 = [
    'GrnNumber',
    'GRNDate',
    'BillDate',
    'SupplierName',
    'ReceiveQty',
    'FreeQty',
    'InvoiceNo',
    'GST',
    'TotalAmount',
    'PaymentMode'
  ];
  displayedColumns3 = [
    'SalesNo',
    'Date',
    'DoctorName',
    'PatientName',
    'MobileNo',
    'Qty',
    'TotalAmount'
  ];
  displayedColumns4 = [
    'SalesNo',
    'Date',
    'DoctorName',
    'PatientName',
    'MobileNo',
    'Qty',
    'TotalAmount'
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
  registerObj: any;
  fiveDaysAgo: any;

  dsItemMovementSummery = new MatTableDataSource<ItemMovementList>();
  dsBatchExpWise = new MatTableDataSource<BatchExpWiseList>();
  dsPurSupplierWise = new MatTableDataSource<PurSupplierWiseList>();
  dsSaleList = new MatTableDataSource<SalesList>();
  dsSalesReturnList = new MatTableDataSource<SalesReturnList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;
  @ViewChild('Thirdpaginator', { static: true }) public Thirdpaginator: MatPaginator;
  @ViewChild('Fourthpaginator', { static: true }) public Fourthpaginator: MatPaginator;
  @ViewChild('Lastpaginator', { static: true }) public Lastpaginator: MatPaginator;


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
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      //console.log(this.registerObj);
      this._CurrentStockService.ItemSummeryFrom.get("start").setValue(this.fiveDaysAgo);
    }
    this.gePharStoreList();
    this.getItemMovementSummeryList();
    this.getBatchExpWiseList();
    this.getPueSupplierWiseList();
    this.getSalesList();
    this.getSalesReturnList();

    const currentDate = new Date();
    const fiveDaysAgos = new Date(currentDate.setDate(currentDate.getDate() - 5));
    this.fiveDaysAgo = this.datePipe.transform(new Date(currentDate.setDate(currentDate.getDate() - 5)), "yyyy-MM-dd 00:00:00.000");
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
  getItemMovementSummeryList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "FromDate": this.fiveDaysAgo || this.datePipe.transform(this._CurrentStockService.ItemSummeryFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._CurrentStockService.ItemSummeryFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "FromStoreID": this.registerObj.StoreId || 0,
      "ItemId": this.registerObj.ItemId || 0
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
  getBatchExpWiseList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemId": this.registerObj.ItemId || 0,
      "StoreId": this.registerObj.StoreId || 0
    }
    // console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getBatchExpWiseList(vdata).subscribe((data) => {
        this.dsBatchExpWise.data = data as BatchExpWiseList[];
        //console.log(this.dsBatchExpWise);
        this.dsBatchExpWise.sort = this.sort;
        this.dsBatchExpWise.paginator = this.SecondPaginator;
        this.sIsLoading = '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  //Purchase SupplierwiseList 
  getPueSupplierWiseList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemId": this.registerObj.ItemId || 0,
      "StoreId": this.registerObj.StoreId || 0
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getPueSupplierWiseList(vdata).subscribe((data) => {
        this.dsPurSupplierWise.data = data as PurSupplierWiseList[];
        console.log(this.dsPurSupplierWise);
        this.dsPurSupplierWise.sort = this.sort;
        this.dsPurSupplierWise.paginator = this.Thirdpaginator;
        this.sIsLoading = '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
  //Sales List 
  getSalesList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemId": this.registerObj.ItemId || 0,
      "StoreId": this.registerObj.StoreId || 0
    }
   // console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesList(vdata).subscribe((data) => {
        this.dsSaleList.data = data as SalesList[];
       // console.log(this.dsSaleList);
        this.dsSaleList.sort = this.sort;
        this.dsSaleList.paginator = this.Fourthpaginator;
        this.sIsLoading = '';
      },
        (error) => {
          this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
  }
    //SalesReturn List 
    getSalesReturnList() {
      this.sIsLoading = 'loading-data';
      var vdata = {
        "ItemId": this.registerObj.ItemId || 0,
        "StoreId": this.registerObj.StoreId || 0
      }
      console.log(vdata)
      setTimeout(() => {
        this._CurrentStockService.getSalesRetrunList(vdata).subscribe((data) => {
          this.dsSalesReturnList.data = data as SalesReturnList[];
          console.log(this.dsSalesReturnList);
          this.dsSalesReturnList.sort = this.sort;
          this.dsSalesReturnList.paginator = this.Lastpaginator;
          this.sIsLoading = '';
        },
          (error) => {
            this.isLoadingStr = 'no-data';
          }
        );
      }, 1000);
    }
  onClose() {
    this._matDialog.closeAll();
  }
  onClear() {

  }
}
export class ItemMovementList {
  TranDate: any;
  TransactionType: any;
  DocumentNo: number;
  PatientName: string;
  BatchNo: any;
  BatchExpDate: number;
  ReceiptQty: number;
  IssueQty: number;
  BalQty: number;

  constructor(ItemMovementList) {
    {
      this.TranDate = ItemMovementList.TranDate || 0;
      this.TransactionType = ItemMovementList.TransactionType || '';
      this.DocumentNo = ItemMovementList.DocumentNo || 0;
      this.PatientName = ItemMovementList.PatientName || "";
      this.BatchNo = ItemMovementList.BatchNo || '';
      this.BatchExpDate = ItemMovementList.BatchExpDate || 0;
      this.ReceiptQty = ItemMovementList.ReceiptQty || 0;
      this.IssueQty = ItemMovementList.IssueQty || 0;
      this.BalQty = ItemMovementList.BalQty || 0;
    }
  }
}
export class BatchExpWiseList {
  LandedRate: any;
  PurUnitRateWF: any;
  PurchaseRate: number;
  TotalByPTR: number;
  BatchNo: any;
  ExpDate: number;
  UnitMRP: number;
  TotalByMRP: number;
  BalQty: number;

  constructor(BatchExpWiseList) {
    {
      this.LandedRate = BatchExpWiseList.LandedRate || 0;
      this.PurUnitRateWF = BatchExpWiseList.PurUnitRateWF || '';
      this.PurchaseRate = BatchExpWiseList.PurchaseRate || 0;
      this.TotalByPTR = BatchExpWiseList.TotalByPTR || 0;
      this.BatchNo = BatchExpWiseList.BatchNo || '';
      this.ExpDate = BatchExpWiseList.ExpDate || 0;
      this.UnitMRP = BatchExpWiseList.UnitMRP || 0;
      this.TotalByMRP = BatchExpWiseList.TotalByMRP || 0;
      this.BalQty = BatchExpWiseList.BalQty || 0;
    }
  }
}
export class PurSupplierWiseList {
  GrnNumber: any;
  GRNDate: any;
  BillDate: number;
  SupplierName: string;
  ReceiveQty: any;
  FreeQty: number;
  InvoiceNo: number;
  PaymentMode: number;
  TotalAmount: number;
  GST:any;

  constructor(PurSupplierWiseList) {
    {
      this.GrnNumber = PurSupplierWiseList.GrnNumber || 0;
      this.GRNDate = PurSupplierWiseList.GRNDate ||  0;
      this.BillDate = PurSupplierWiseList.BillDate || 0;
      this.SupplierName = PurSupplierWiseList.SupplierName || '';
      this.ReceiveQty = PurSupplierWiseList.ReceiveQty || 0;
      this.FreeQty = PurSupplierWiseList.FreeQty || 0;
      this.InvoiceNo = PurSupplierWiseList.InvoiceNo || 0;
      this.PaymentMode = PurSupplierWiseList.PaymentMode || '';
      this.TotalAmount = PurSupplierWiseList.TotalAmount || 0;
      this.GST = PurSupplierWiseList.GST || 0;
    }
  }
}
export class SalesList {
  SalesNo: any;
  Date: any;
  DoctorName: string;
  PatientName: string;
  MobileNo: any;
  Qty: number;
  TotalAmount: number;

  constructor(SalesList) {
    {
      this.SalesNo = SalesList.SalesNo || 0;
      this.Date = SalesList.Date || 0;
      this.DoctorName = SalesList.DoctorName || '';
      this.PatientName = SalesList.PatientName || '';
      this.MobileNo = SalesList.MobileNo ||  0;
      this.Qty = SalesList.Qty || 0;
      this.TotalAmount = SalesList.TotalAmount || 0;
    }
  }
}
export class SalesReturnList {
  SalesNo: any;
  Date: any;
  DoctorName: string;
  PatientName: string;
  MobileNo: any;
  Qty: number;
  TotalAmount: number;

  constructor(SalesReturnList) {
    {
      this.SalesNo = SalesReturnList.SalesNo || 0;
      this.Date = SalesReturnList.Date || 0;
      this.DoctorName = SalesReturnList.DoctorName || '';
      this.PatientName = SalesReturnList.PatientName || '';
      this.MobileNo = SalesReturnList.MobileNo ||  0;
      this.Qty = SalesReturnList.Qty || 0;
      this.TotalAmount = SalesReturnList.TotalAmount || 0;
    }
  }
}
