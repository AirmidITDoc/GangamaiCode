import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from '../sales.service';
@Component({
  selector: 'app-sale-popup',
  templateUrl: './sale-popup.component.html',
  styleUrls: ['./sale-popup.component.scss'],
  animations: fuseAnimations,
})
export class SalePopupComponent implements OnInit {
  displayedColumns: string[] = [
    'batchNo',
    'batchExpDate',
    'balanceQty',
    'unitMRP',
    'purchaseRate',
    'converFacto',
    'landedRate',
    'ExpDays'
    // 'ItemCode',
  ];
  isLoadingStr: string = '';
  dataSource = new MatTableDataSource<SalesList>();
  selectedRowIndex: number = -1;
  screenFromString = 'admission-form';
  vEscflag: boolean = false;
  selectedRow: SalesList = null;

  constructor(private dialogRef: MatDialogRef<SalePopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public salesService: SalesService) {}
  ngOnInit(): void {
    this.getSalesData();
  }
  // const ESCAPE_KEYCODE = 27;

  @HostListener('document:keydown.arrowup', ['$event'])
  onArrowUp(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.selectedRowIndex > 0) {
      this.selectedRowIndex--;
      this.highlightRow(this.selectedRowIndex);
    }
  }

  @HostListener('document:keydown.arrowdown', ['$event'])
  onArrowDown(event: KeyboardEvent): void {
    event.preventDefault();
    if (this.selectedRowIndex < this.dataSource.data.length - 1) {
      this.selectedRowIndex++;
      this.highlightRow(this.selectedRowIndex);
    }
  }

  @HostListener('document:keydown.enter', ['$event'])
  onEnter(event: KeyboardEvent): void {
    event.preventDefault();
    this.selectCurrentRow();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(event: KeyboardEvent): void {
    this.vEscflag = true;
    this.close();
  }

  highlightRow(index: number) {
    this.selectedRowIndex = index;
    this.selectedRow = this.dataSource.data[index];
    // Scroll the selected row into view if needed
    const element = document.getElementById(`row-${index}`);
    if (element) {
      element.scrollIntoView({ block: 'nearest' });
    }
  }

  selectCurrentRow() {
    if (this.selectedRowIndex >= 0 && this.selectedRowIndex < this.dataSource.data.length) {
      const selectedData = this.dataSource.data[this.selectedRowIndex];
      this.dialogRef.close({
        selectedData: selectedData,
        vEscflag: this.vEscflag,
      });
    }
  }
  selectNewRow(index:number){
    this.selectedRowIndex = index;
    this.selectCurrentRow();
  }
  close() {
    this.dialogRef.close({
      vEscflag: this.vEscflag,
    });
  }

  getSalesData() {
    console.log(this.data);
    this.isLoadingStr = 'loading';
    var reqData = {
      ItemId: this.data.ItemId,
      StoreId: this.data.StoreId,
    };

    this.salesService.getBatchList(reqData).subscribe((res: any) => {
      console.log(res);
      if (res && res.length > 0) {
        res.forEach((element, index) => {
          element['position'] = index + 1;
        });
        this.dataSource.data = res as SalesList[];
        this.selectedRowIndex = 0;
        this.highlightRow(0);
      } else {
        this.isLoadingStr = 'no-data';
      }
    });
  }

  onRowClick(row: SalesList, index: number) {
    this.highlightRow(index);
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onTableClick() {
    // let focusId = 'ele-' + this.selectedRowIndex;
    // document.getElementById(focusId).focus();
  }
}

export class SalesList {
  BatchNo: string;
  BatchExpDate: string;
  BalanceQty: any;
  UnitMRP: any;
  PurchaseRate: any;
  ItemName: string;
  ConversionFactor: string;
  position: number;
  DaysFlag: any;
  // Bal:number;
  // StoreId:any;
  // StoreName:any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.BatchExpDate = IndentList.BatchExpDate || '';
      this.BatchNo = IndentList.BatchNo || 0;
      this.BalanceQty = IndentList.BalanceQty || '';
      this.UnitMRP = IndentList.UnitMRP || '';
      this.PurchaseRate = IndentList.PurchaseRate || '';
      this.position = IndentList.position || 0;
      this.ItemName = IndentList.ItemName || '';
      this.ConversionFactor = IndentList.ConversionFactor || '';
      this.DaysFlag = IndentList.DaysFlag || 0;
      // this.StoreId = IndentList.StoreId || 0;
      // this.StoreName =IndentList.StoreName || '';
    }
  }
}

function onKeydownHandler(
  event: Event,
  KeyboardEvent: {
    new (type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent;
    prototype: KeyboardEvent;
    readonly DOM_KEY_LOCATION_STANDARD: 0;
    readonly DOM_KEY_LOCATION_LEFT: 1;
    readonly DOM_KEY_LOCATION_RIGHT: 2;
    readonly DOM_KEY_LOCATION_NUMPAD: 3;
  }
) {
  throw new Error('Function not implemented.');
}
