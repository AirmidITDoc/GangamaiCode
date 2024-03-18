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
    'BatchNo',
    'BatchExpDate',
    'BalanceQty',
    'MRP',
    'PurPrice',
    'ConversionFactor',
    'LandedRate',
    'ExpDays'
    // 'ItemCode',
  ];;
  isLoadingStr: string = '';
  dataSource = new MatTableDataSource<SalesList>();
  selectedRowIndex: number = 0;
  screenFromString = 'admission-form';
vEscflag:boolean=false;
  
  
  constructor(
    private dialogRef: MatDialogRef<SalePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public salesService: SalesService,
  ) {
    

   }

  // const ESCAPE_KEYCODE = 27;

@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.vEscflag=true
        this.close();

    }
}




  close(){
    var d={
      // selectedData:selectedData,
      vEscflag:this.vEscflag
    }
    this.dialogRef.close(d);
  }

  highlight(row: any) {
    if(row && row.position) {
      this.selectedRowIndex = row.position;
      // console.log(this.selectedRowIndex);
    }
   
  }

  arrowUpEvent(row: object, index: number) {
    var nextrow = this.dataSource.data[index - 2];
    this.highlight(nextrow);
  }

  arrowDownEvent(row: object, index: number) {
    var nextrow = this.dataSource.data[index];
    this.highlight(nextrow);
  }

  ngOnInit(): void {
    this.getSalesData();
    setTimeout(() => {
      document.getElementById('ele-1').focus();
    }, 1000);
  }

  getSalesData() {
    this.isLoadingStr = 'loading';
    var reqData = {
      "ItemId": this.data.ItemId,
      "StoreId": this.data.StoreId
    }
    this.salesService.getBatchList(reqData).subscribe((res: any) => {
      if (res && res.length > 0) {
        res.forEach((element, index) => {
          element['position'] = index + 1;
        });
        this.dataSource.data = res as SalesList[];
        this.highlight(this.dataSource.data[0]);
      } else {
        this.isLoadingStr = 'no-data';
      }
    });
  }

  selectedRow(index?: number, ele?: SalesList) {
    let selectedData;
    if(index) {
      selectedData = this.dataSource.data[index-1];
    } else if(ele) {
      selectedData = ele;
    }

    var d={
      selectedData:selectedData,
      vEscflag:this.vEscflag
    }

    console.log(d)
    this.dialogRef.close(d);
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  onTableClick() {
    let focusId = 'ele-'+this.selectedRowIndex;
    document.getElementById(focusId).focus();
  }

}

export class SalesList {
  BatchNo: string;
  BatchExpDate: string;
  BalanceQty: any
  UnitMRP: any;
  PurchaseRate: any;
  ItemName: string;
  ConversionFactor: string;
  position: number;
  DaysFlag:any;
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
      this.BalanceQty = IndentList.BalanceQty || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.PurchaseRate = IndentList.PurchaseRate || "";
      this.position = IndentList.position || 0;
      this.ItemName = IndentList.ItemName || "";
      this.ConversionFactor = IndentList.ConversionFactor || '';
      this.DaysFlag = IndentList.DaysFlag|| 0;
      // this.StoreId = IndentList.StoreId || 0;
      // this.StoreName =IndentList.StoreName || '';
    }
  }
}

function onKeydownHandler(event: Event, KeyboardEvent: { new(type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent; prototype: KeyboardEvent; readonly DOM_KEY_LOCATION_STANDARD: 0; readonly DOM_KEY_LOCATION_LEFT: 1; readonly DOM_KEY_LOCATION_RIGHT: 2; readonly DOM_KEY_LOCATION_NUMPAD: 3; }) {
  throw new Error('Function not implemented.');
}
