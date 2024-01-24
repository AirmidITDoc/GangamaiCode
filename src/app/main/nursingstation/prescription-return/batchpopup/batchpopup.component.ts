import { Component, HostListener, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { PrescriptionReturnService } from '../prescription-return.service';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-batchpopup',
  templateUrl: './batchpopup.component.html',
  styleUrls: ['./batchpopup.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class BatchpopupComponent implements OnInit {

  displayedColumns: string[] = [
    'BatchNo',
    'BatchExpDate',
    'BalanceQty',
    'MRP',
    'PurPrice',
    'ConversionFactor',
    'LandedRate'
    // 'ItemName',
    // 'ItemCode',
  ];;
  isLoadingStr: string = '';
  dataSource = new MatTableDataSource<SalesList>();
  selectedRowIndex: number = 0;
  screenFromString = 'admission-form';

  
  
  constructor(
    private dialogRef: MatDialogRef<BatchpopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public _PrescriptionReturnService:PrescriptionReturnService,
  ) {
    

   }

  // const ESCAPE_KEYCODE = 27;

@HostListener('document:keydown', ['$event']) onKeydownHandler(event: KeyboardEvent) {
    if (event.keyCode === 27) {
        this. close();
    }
}




  close(){
    this.dialogRef.close();
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
      "StoreId": this.data.StoreId,
      "OP_IP_Id":this.data.OP_IP_Id
    }
    this._PrescriptionReturnService.getBatchList(reqData).subscribe((res: any) => {
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
    this.dialogRef.close(selectedData);
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
      // this.Bal = IndentList.Bal|| 0;
      // this.StoreId = IndentList.StoreId || 0;
      // this.StoreName =IndentList.StoreName || '';
    }
  }
}

function onKeydownHandler(event: Event, KeyboardEvent: { new(type: string, eventInitDict?: KeyboardEventInit): KeyboardEvent; prototype: KeyboardEvent; readonly DOM_KEY_LOCATION_STANDARD: 0; readonly DOM_KEY_LOCATION_LEFT: 1; readonly DOM_KEY_LOCATION_RIGHT: 2; readonly DOM_KEY_LOCATION_NUMPAD: 3; }) {
  throw new Error('Function not implemented.');
}
