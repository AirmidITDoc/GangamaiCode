import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { CurrentStockService } from '../current-stock.service';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';

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
  registerObj: any;
  itemId = "0";
  storeId = "0";
  dsSalesSummeryList = new MatTableDataSource<SalessummeryList>();
  dsSalesSummeryDetList = new MatTableDataSource<SalessummeryDetList>();

  tabIndex: number = 0;

  @ViewChild(MatTable) table: MatTable<any>;

  ngAfterViewInit() {
    this.table?.renderRows();
  }
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('SecondPaginator', { static: true }) public SecondPaginator: MatPaginator;

  @ViewChild('list1', { static: false }) grid1: AirmidTableComponent;
  @ViewChild('list2', { static: false }) grid2: AirmidTableComponent;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<SalesSummeryComponent>,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    if (this.data.Obj) {
      this.registerObj = this.data.Obj;
      this.storeId = String(this.registerObj.storeId)
      this.itemId = String(this.registerObj.itemId)
      console.log(this.registerObj)
    }
    this.getSalesSummeryList();
    this.getSalesSummeryDetailsList();
  }

  parseToDate(dateStr: string): Date | null {
    if (!dateStr) return null;
    const [datePart] = dateStr.split(' ');
    const [day, month, year] = datePart.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date.getTime()) ? null : date;
  }

  getSalesSummeryList() {
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "StoreID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ToStoreId",
          "fieldValue": String(this.registerObj.storeId),
          "opType": "Equals"
        },
        {
          "fieldName": "ItemId",
          "fieldValue": String(this.registerObj.itemId),
          "opType": "Equals"
        }
      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesSummeryList(vdata).subscribe(data => {
        this.dsSalesSummeryList.data = data.data as SalessummeryList[];
        this.dsSalesSummeryList.sort = this.sort;
        this.dsSalesSummeryList.paginator = this.paginator;
        console.log(this.dsSalesSummeryList.data)
      }
      );
    }, 500);

  }

  // allcurrentColumn = [
  //         { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA'},
  //         { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA'},
  //         { heading: "SalesQty", key: "salesQty", sort: true, align: 'left', emptySign: 'NA',},
  //     ]
  //     allcurrentFilters = [
  //         { fieldName: "ToStoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
  //         { fieldName: "ItemId", fieldValue: this.itemId, opType: OperatorComparer.Equals }
  //     ]

  //     gridConfig: gridModel = {
  //         apiUrl: "CurrentStock/SalesSummaryList",
  //         columnsList: this.allcurrentColumn,
  //         sortField: "StoreID",
  //         sortOrder: 0,
  //         filters: this.allcurrentFilters
  //     }

  //  getSalesSummeryList() {
  //   debugger
  //   this.gridConfig = {
  //               apiUrl: "CurrentStock/SalesSummaryList",
  //               columnsList: this.allcurrentColumn,
  //               sortField: "StoreID",
  //               sortOrder: 0,
  //               filters: [
  //                   { fieldName: "ToStoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
  //                   { fieldName: "ItemId", fieldValue: this.itemId, opType: OperatorComparer.Equals },
  //               ]
  //           }
  //           console.log(this.gridConfig)
  //           this.grid1.gridConfig = this.gridConfig;
  //           this.grid1.bindGridData();
  // }

  getSalesSummeryDetailsList() {
    var vdata = {
      "first": 0,
      "rows": 10,
      "sortField": "StoreID",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "ToStoreId",
          "fieldValue": String(this.registerObj.storeId),
          "opType": "Equals"
        },

        {
          "fieldName": "ItemId",
          "fieldValue": String(this.registerObj.itemId),
          "opType": "Equals"
        }


      ],
      "exportType": "JSON",
      "columns": []
    }
    console.log(vdata)
    setTimeout(() => {
      this._CurrentStockService.getSalesDetailSummeryList(vdata).subscribe(data => {
        this.dsSalesSummeryDetList.data = data.data as SalessummeryDetList[];
        this.dsSalesSummeryDetList.sort = this.sort;
        this.dsSalesSummeryDetList.paginator = this.SecondPaginator;
        console.log(this.dsSalesSummeryDetList.data)
      }
      );
    }, 500);
  }
  onClose() {
    this.dsSalesSummeryDetList.data = [];
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
