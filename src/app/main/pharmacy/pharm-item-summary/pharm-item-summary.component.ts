import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { PharmaitemsummaryService } from './pharmaitemsummary.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatDateFormats } from '@angular/material/core';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes } from 'app/main/shared/model/permission.model';

// export const MONTH_YEAR_FORMATS: MatDateFormats = {
//   parse: {
//     dateInput: 'MM/YYYY',
//   },
//   display: {
//     dateInput: 'MM/YYYY',
//     monthYearLabel: 'MMM YYYY',
//     dateA11yLabel: 'LL',
//     monthYearA11yLabel: 'MMMM YYYY',
//   },
// };

@Component({
  selector: 'app-pharm-item-summary',
  templateUrl: './pharm-item-summary.component.html',
  styleUrls: ['./pharm-item-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  //   providers: [
  //   { provide: MAT_DATE_FORMATS, useValue: MONTH_YEAR_FORMATS }
  // ]

})
export class PharmItemSummaryComponent implements OnInit {
  SupplietDetColumns: string[] = [
    'GRNDate',
    'GRNNO',
    'InvoiceDate',
    'InvoiceNo',
    'SupplierName',
    'qty',
    'mrp',
    'Rate',
    'GST'
  ]
  searchFormGroup: FormGroup;
  autocompletestore: string = "Store";
  ApiURl: any = 'PharmacyItemSummary/NonMovingItemList'
  StoreId = this.accountService.currentUserValue.user.storeId || '0';
  ExpStoreId = this.accountService.currentUserValue.user.storeId || '0';
  NonMovingDay: any = "0";
  ExpMonth: any = "01";
  ExpYear: any = "1999";
  ExpDate: any = "1999-01-01";
  Todate: any;
  chosenYear: number;
  chosenMonth: number;
  fromdate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  todate = this.datePipe.transform(new Date(), "yyyy-MM-dd")
  dssupplierdet = new MatTableDataSource<any>();


  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid2') grid2: AirmidTableComponent;

  //Non Moving Item without Batchno list 
  NonMovingColumns = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Day Sales", key: "daySales", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 },
    { heading: "Last SalesDate", key: "lastSalesDate", sort: true, align: 'left', emptySign: 'NA', width: 100, type: 6 }
  ]
  gridConfig: gridModel = {
    permissionCode: permissionCodes.Sales,
    apiUrl: this.ApiURl,
    columnsList: this.NonMovingColumns,
    sortField: "ItemName",
    sortOrder: 1,
    filters: [
      { fieldName: "NonMovingDay", fieldValue: "2", opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(2), opType: OperatorComparer.Equals }
    ],
    row: 25
  }
  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.supplierdetTemplate;
  }

  @ViewChild('supplierdetTemplate') supplierdetTemplate!: TemplateRef<any>;
  //Item Batch Expwise list
  ItemExpWiseColumns = [
    {
      heading: "", key: "action", align: "left", width: 50, sticky: true, type: gridColumnTypes.template,
      template: this.supplierdetTemplate
    },
    { heading: "Store Name", key: "storeName", sort: true, align: 'left', emptySign: 'NA', width: 150 },

    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    // { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 },
    { heading: "Batch ExpMonth", key: "expMonth", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Batch ExpYear", key: "expYear", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Received Qty", key: "receivedQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },

  ]
  gridConfig2: gridModel = {
    permissionCode: permissionCodes.Sales,
    apiUrl: "PharmacyItemSummary/ItemExpReportMonthWiseList",
    columnsList: this.ItemExpWiseColumns,
    sortField: "StockId",
    sortOrder: 0,
    filters: [
      // { fieldName: "ExpMonth", fieldValue: this.ExpMonth, opType: OperatorComparer.Equals },
      // { fieldName: "ExpYear", fieldValue: this.ExpYear, opType: OperatorComparer.Equals },
      // { fieldName: "StoreId", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },


      { fieldName: "FromDate", fieldValue: this.ExpMonth, opType: OperatorComparer.Equals },
      { fieldName: "ToDate", fieldValue: this.ExpYear, opType: OperatorComparer.Equals },
      { fieldName: "StoreID", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },
    ],
    row: 25
  }

  constructor(
    public _PharmaitemsummaryService: PharmaitemsummaryService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public _FormvalidationserviceService: FormvalidationserviceService,
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.StoreId = this.searchFormGroup.get('StoreId')?.value || 0;
    this.ExpStoreId = this.searchFormGroup.get('StoreId')?.value || 0;

    const CurrentDate = new Date();
    this.ExpYear = CurrentDate.getFullYear();
    this.ExpMonth = CurrentDate.getMonth() + 1;
    this.getExpwiseData();
  }
  createSearchForm() {
    return this.formBuilder.group({
      BatchRadio: ['Batch'],
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      NonMovingDay: '',
      ExpMonth: '',
      ExpYear: '',
      StoreId: [this.accountService.currentUserValue.user.storeId,
      [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
      ExpStoreId: [this.accountService.currentUserValue.user.storeId,
      [Validators.required, this._FormvalidationserviceService.notEmptyOrZeroValidator(), Validators.min(1)]],
    });
  }
  selectChangeStore(value) {
    if (value.value !== 0)
      this.StoreId = value.value
    else
      this.StoreId = "0"

    this.onChangeNonMoving();
  }
  onChangeNonMoving() {
    if (this.searchFormGroup.get("BatchRadio").value == 'Batch') {
      this.ApiURl = "PharmacyItemSummary/NonMovingItemList"
      this.NonMovingColumns = [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Day Sales", key: "daySales", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Last SalesDate", key: "lastSalesDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 }
      ]
    } else if (this.searchFormGroup.get("BatchRadio").value == 'NoBatch') {
      this.ApiURl = "PharmacyItemSummary/NonMovingItemWithoutBatchNoList"
      this.NonMovingColumns = [
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Day Sales", key: "daySales", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 130 },
        { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 },
        { heading: "Last SalesDate", key: "lastSalesDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 }
      ]
    }
    this.NonMovingDay = this.searchFormGroup.get('NonMovingDay').value || 0;
    this.StoreId = this.searchFormGroup.get('StoreId').value || "0"
    this.NonMovingDatalist();
  }
  NonMovingDatalist() {
    this.gridConfig = {
      apiUrl: this.ApiURl,
      columnsList: this.NonMovingColumns,
      sortField: "ItemName",
      sortOrder: 1,
      filters: [
        { fieldName: "NonMovingDay", fieldValue: String(this.NonMovingDay), opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.StoreId), opType: OperatorComparer.Equals }
      ],
      row: 25
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  //---------------------------------Exp wise Item list Tab 2
  selectChangeStoreExp(value) {
    if (value.value !== 0)
      this.ExpStoreId = value.value
    else
      this.ExpStoreId = "0"

    this.onchangeDate();
  }

  onchangeDate() {
    const selectedDate = new Date(this.datePipe.transform(this.searchFormGroup.get('startdate').value, 'yyyy-MM-dd'))
    this.ExpStoreId = this.searchFormGroup.get('StoreId').value || "0";
    this.ExpYear = selectedDate.getFullYear();
    this.ExpMonth = selectedDate.getMonth() + 1;
    this.getExpwiseData();
  }
  onChangeExplist() {
    this.ExpStoreId = this.searchFormGroup.get('StoreId').value || "0"
    if (this.searchFormGroup.get('ExpYear').value && this.searchFormGroup.get('ExpMonth').value) {
      this.ExpYear = this.searchFormGroup.get('ExpYear').value || "0"
      this.ExpMonth = this.searchFormGroup.get('ExpMonth').value || "0"
    } else {
      const selectedDate = new Date(this.datePipe.transform(this.searchFormGroup.get('startdate').value, 'yyyy-MM-dd'))
      this.ExpYear = selectedDate.getFullYear();
      this.ExpMonth = selectedDate.getMonth() + 1;
    }


    // this.fromdate=this.searchFormGroup.get('startdate').value,'yyyy-MM-dd'
    // this.todate=this.searchFormGroup.get('enddate').value,'yyyy-MM-dd'

    this.getExpwiseData();
  }
  getExpwiseData() {

    debugger
    this.fromdate = '2026-01-01',//this.searchFormGroup.get('startdate').value,'yyyy-MM-dd'
      this.todate = '2026-02-01'//this.searchFormGroup.get('enddate').value,'yyyy-MM-dd'

    debugger
    this.gridConfig2 = {
      apiUrl: "PharmacyItemSummary/ItemExpReportMonthWiseList",
      columnsList: this.ItemExpWiseColumns,
      sortField: "StockId",
      sortOrder: 0,
      filters: [
        // { fieldName: "ExpMonth", fieldValue: String(this.ExpMonth), opType: OperatorComparer.Equals },
        // { fieldName: "ExpYear", fieldValue: String(this.ExpYear), opType: OperatorComparer.Equals },
        // { fieldName: "StoreId", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },

        { fieldName: "FromDate", fieldValue: this.fromdate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.todate, opType: OperatorComparer.StartsWith },
        { fieldName: "StoreID", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },
      ],
      row: 25
    }
    this.grid2.gridConfig = this.gridConfig2;
    this.grid2.bindGridData();
  }
  chargelist: any = [];
  getItemSupplierDetList(row) {
    const Filters = [
      { "fieldName": "ItemId", "fieldValue": String(row?.itemId ?? 0), "opType": "Equals" },
    ]
    const param = {
      "searchFields": Filters,
      "mode": "ItemSupplierDetails"
    }

    this._PharmaitemsummaryService.getitemsupplierdet(param).subscribe(response => {
      debugger
      console.log('response', response)
      this.chargelist = response
      this.dssupplierdet.data = this.chargelist
    })
  }
  @ViewChild('SupplierdetTable') SupplierdetTable!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  openServiceTable(row): void {
    this.getItemSupplierDetList(row);
    this._matDialog.open(this.SupplierdetTable, {
      width: '65%',
      height: '50%',
    })
  }
  oncloseservice() {
    if (this.dialogRef) {
      this.dialogRef.close(this.SupplierdetTable);
    }
  }
  getValidationMessages() {
    return {
      ExpMonth: [
        // { name: "required", Message: "ExpMonth is required" }
      ],
      ExpYear: [
        // { name: "required", Message: "ExpYear is required" }
      ],
      NonMovingDay: [
        // { name: "required", Message: "NonMovingDay is required" }
      ],
      ExpStoreId: [
        // { name: "required", Message: "ExpStoreId is required" }
      ],
      StoreId: [
        // { name: "required", Message: "StoreId is required" }
      ]

    };
  }
}

export class Itemmovment {
  ItemName: number;
  DaySales: number;
  BatchExpDate: string;
  BalanceQty: string;
  LastSalesDate: number;

  constructor(Itemmovment) {
    {
      this.ItemName = Itemmovment.ItemName || 0;
      this.DaySales = Itemmovment.DaySales || 0;
      this.BatchExpDate = Itemmovment.BatchExpDate || "";
      this.BalanceQty = Itemmovment.BalanceQty || "";
      this.LastSalesDate = Itemmovment.LastSalesDate || 0;

    }
  }
}
export class DayWiseStockList {

  ItemName: string;
  ToStoreName: string;
  IssueQty: number;
  BalanceQty: number;
  ReceivedQty: number;
  BatchNo: number;
  BatchExpDate: number;
  UnitMRP: number;
  LedgerDate: any;
  constructor(DayWiseStockList) {
    {
      this.IssueQty = DayWiseStockList.IssueQty || 0;
      this.ReceivedQty = DayWiseStockList.ReceivedQty || 0;
      this.ItemName = DayWiseStockList.ItemName || "";
      this.ToStoreName = DayWiseStockList.ToStoreName || "";
      this.BalanceQty = DayWiseStockList.BalanceQty || 0;
      this.BatchNo = DayWiseStockList.BatchNo || 0;
      this.BatchExpDate = DayWiseStockList.BatchExpDate || 0;
      this.UnitMRP = DayWiseStockList.UnitMRP || 0;
      this.LedgerDate = DayWiseStockList.LedgerDate || 0;
    }
  }
}
export class ItemWiseStockList {

  ItemName: string;
  ToStoreName: string;
  IssueQty: number;
  BalanceQty: number;
  ReceivedQty: number;
  BatchNo: number;
  BatchExpDate: number;
  UnitMRP: number;
  LedgerDate: any;
  constructor(ItemWiseStockList) {
    {
      this.IssueQty = ItemWiseStockList.IssueQty || 0;
      this.ReceivedQty = ItemWiseStockList.ReceivedQty || 0;
      this.ItemName = ItemWiseStockList.ItemName || "";
      this.ToStoreName = ItemWiseStockList.ToStoreName || "";
      this.BalanceQty = ItemWiseStockList.BalanceQty || 0;
      this.BatchNo = ItemWiseStockList.BatchNo || 0;
      this.BatchExpDate = ItemWiseStockList.BatchExpDate || 0;
      this.UnitMRP = ItemWiseStockList.UnitMRP || 0;
      this.LedgerDate = ItemWiseStockList.LedgerDate || 0;
    }
  }
}

