import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations'; 
import Swal from 'sweetalert2';
import { SalesHospitalService } from '../../sales-hopsital-new/sales-hospital-new.service';
import { ConfigService } from 'app/core/services/config.service';

@Component({
  selector: 'app-salesbatchpopup',
  templateUrl: './salesbatchpopup.component.html',
  styleUrls: ['./salesbatchpopup.component.scss'],
  animations: fuseAnimations,
})
export class SalesbatchpopupComponent implements OnInit {  
  displayedColumns: string[] = [
    'batchNo',
    'batchExpDate',
    'balanceQty',
    'unitMRP',
    'purchaseRate',
    'converFacto',
    'landedRate',
    'ExpDays',
    'prodLocation',
    'itemGenericName',
    // 'ItemCode',
  ];
  isLoadingStr: string = '';
  dataSource = new MatTableDataSource<SalesList>();
  selectedRowIndex: number = -1;
  screenFromString = 'admission-form';
  vEscflag: boolean = false;
  currency:any='';
  selectedRow: SalesList = null;

  constructor(private dialogRef: MatDialogRef<SalesbatchpopupComponent>, @Inject(MAT_DIALOG_DATA) public data: any, 
  public salesService: SalesHospitalService,
  public _ConfigService:ConfigService
) { }
  ngOnInit(): void {
    this.getSalesData();
            //this is for curreny symbol
        const [CurrencyId, CurrencyValue] = this._ConfigService.configParams.CurrencyValue.split(":");
        this.currency = CurrencyValue 
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
      if (!this.data?.formName && selectedData.daysFlag == '1') {
        Swal.fire({
          icon: "warning",
          title: "Selected Batch is already Expired",
          showConfirmButton: false,
          timer: 2000
        });
        return
      }
      this.dialogRef.close({
        selectedData: selectedData,
        vEscflag: this.vEscflag,
      });
    }
  }
  selectNewRow(row, index: number) {
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
    const reqData = {
      ItemId: this.data.ItemId,
      StoreId: this.data.StoreId,
      PatientTypeId:this.data.PatientTypeId
    };

    this.salesService.getKenyaSalesBatchList(reqData).subscribe((res: any) => {
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
  daysFlag: any;
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
      this.daysFlag = IndentList.daysFlag || 0;
      // this.StoreId = IndentList.StoreId || 0;
      // this.StoreName =IndentList.StoreName || '';
    }
  }
}

function onKeydownHandler(
  event: Event,
  KeyboardEvent: {
    new(type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent;
    prototype: KeyboardEvent;
    readonly DOM_KEY_LOCATION_STANDARD: 0;
    readonly DOM_KEY_LOCATION_LEFT: 1;
    readonly DOM_KEY_LOCATION_RIGHT: 2;
    readonly DOM_KEY_LOCATION_NUMPAD: 3;
  }
) {
  throw new Error('Function not implemented.');
}

