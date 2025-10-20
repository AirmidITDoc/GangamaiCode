import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog'; 
import { fuseAnimations } from '@fuse/animations'; 
import { AuthenticationService } from 'app/core/services/authentication.service'; 
import { PharmaitemsummaryService } from './pharmaitemsummary.service'; 
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';

@Component({
  selector: 'app-pharm-item-summary',
  templateUrl: './pharm-item-summary.component.html',
  styleUrls: ['./pharm-item-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PharmItemSummaryComponent implements OnInit {
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


  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid2') grid2: AirmidTableComponent;

  //Non Moving Item without Batchno list 
  NonMovingColumns = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Day Sales", key: "daySales", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 },
    { heading: "Last SalesDate", key: "lastSalesDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 }
  ]
  gridConfig: gridModel = {
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

  //Item Batch Expwise list
  ItemExpWiseColumns = [
    { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 130 },
    { heading: "Batch ExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 160, type: 6 },
    { heading: "Balance Qty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 130 },
  ]
  gridConfig2: gridModel = {
    apiUrl: "PharmacyItemSummary/ItemExpReportMonthWiseList",
    columnsList: this.ItemExpWiseColumns,
    sortField: "StockId",
    sortOrder: 0,
    filters: [
      { fieldName: "ExpMonth", fieldValue: this.ExpMonth, opType: OperatorComparer.Equals },
      { fieldName: "ExpYear", fieldValue: this.ExpYear, opType: OperatorComparer.Equals },
      { fieldName: "StoreId", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },
    ],
    row: 25
  }

  constructor(
    public _PharmaitemsummaryService: PharmaitemsummaryService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private formBuilder: UntypedFormBuilder,
    private accountService: AuthenticationService,
    public _FormvalidationserviceService: FormvalidationserviceService
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this.createSearchForm();
    this.StoreId = this.searchFormGroup.get('StoreId')?.value || 0;
    this.ExpStoreId = this.searchFormGroup.get('StoreId')?.value || 0;
  }
  createSearchForm() {
    return this.formBuilder.group({
      BatchRadio: ['Batch'],
      startdate: [(new Date()).toISOString()],
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

    this.onChangeExplist();
  }
  onChangeExplist() {
    this.ExpStoreId = this.searchFormGroup.get('StoreId').value || "0"
    this.ExpYear = this.searchFormGroup.get('ExpYear').value || "0"
    this.ExpMonth = this.searchFormGroup.get('ExpMonth').value || "0"
    this.getExpwiseData();
  }
  getExpwiseData() {
    this.gridConfig2 = {
      apiUrl: "PharmacyItemSummary/ItemExpReportMonthWiseList",
      columnsList: this.ItemExpWiseColumns,
      sortField: "StockId",
      sortOrder: 0,
      filters: [
        { fieldName: "ExpMonth", fieldValue: String(this.ExpMonth), opType: OperatorComparer.Equals },
        { fieldName: "ExpYear", fieldValue: String(this.ExpYear), opType: OperatorComparer.Equals },
        { fieldName: "StoreId", fieldValue: String(this.ExpStoreId), opType: OperatorComparer.Equals },
      ],
      row: 25
    }
    // this.grid2.gridConfig = this.gridConfig2;
    // this.grid2.bindGridData();
  }
  chosenYearHandler(event) {
    this.chosenYear = event.getFullYear();

  }
  chosenMonthHandler(event) {
    this.chosenMonth = event.getMonth() + 1;
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
  ItemName: Number;
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
  IssueQty: Number;
  BalanceQty: number;
  ReceivedQty: number;
  BatchNo: Number;
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
  IssueQty: Number;
  BalanceQty: number;
  ReceivedQty: number;
  BatchNo: Number;
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

