import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { BrowsSalesReturnBillService } from '../brows-sales-return-bill.service';

@Component({
  selector: 'app-accept-material-list-popup',
  templateUrl: './accept-material-list-popup.component.html',
  styleUrls: ['./accept-material-list-popup.component.scss']
})
export class AcceptMaterialListPopupComponent implements OnInit {

  displayedColumns = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'IssueQty',
    'PerUnitLandedRate',
    'LandedTotalAmount',
    'VatPercentage'
  ];

  sIsLoading: string = '';
  dsItemList = new MatTableDataSource<ItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _matDialog: MatDialog,
    public dialogRef: MatDialogRef<AcceptMaterialListPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public toastr: ToastrService,
    public _SalesReturn: BrowsSalesReturnBillService,
  ) { }

  ngOnInit(): void {
    console.log(this.data.Obj.IssueId);
    if (this.data) {
      this.getItemList(this.data.Obj.IssueId);
      setTimeout(() => {
      }, 2000);
    }
  }
  onClose() {
    this.dialogRef.close();
  }
  getItemList(Params) {
    debugger
    var Param = {
      "IssueId": Params
    }
    this._SalesReturn.getItemdetailList(Param).subscribe(data => {
      this.dsItemList.data = data as ItemList[];
      this.dsItemList.sort = this.sort;
      this.dsItemList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  onSubmit(){

  }

}
export class ItemList {
  ItemName: string;
  IssueQty: number;
  Bal: number;
  StoreId: any;
  StoreName: any;
  /**
   * Constructor
   *
   * @param ItemList
   */
  constructor(ItemList) {
    {
      this.ItemName = ItemList.ItemName || "";
      this.IssueQty = ItemList.IssueQty || 0;
      this.Bal = ItemList.Bal || 0;
      this.StoreId = ItemList.StoreId || 0;
      this.StoreName = ItemList.StoreName || '';
    }
  }
}
