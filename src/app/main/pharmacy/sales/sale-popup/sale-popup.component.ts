import { Component, Inject, OnInit } from '@angular/core';
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
    'ConversionFactor'
    // 'ItemName',
    // 'ItemCode',
  ];;
  isLoadingStr: string = '';
  dataSource = new MatTableDataSource<SalesList>();
  selectedRowIndex: any;
  constructor(
    private dialogRef: MatDialogRef<SalePopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public salesService: SalesService,
  ) {


  }

  highlight(row: any) {
    if(row && row.position) {
      this.selectedRowIndex = row.position;
      console.log(this.selectedRowIndex);
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
        console.log(this.dataSource);
      } else {
        this.isLoadingStr = 'no-data';
      }
    });
  }

  selectedRow(element: SalesList) {
    this.dialogRef.close(element);
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