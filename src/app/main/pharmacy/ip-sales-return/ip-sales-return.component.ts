import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IpSalesReturnService } from './ip-sales-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { IndentList } from '../sales/sales.component';

@Component({
  selector: 'app-ip-sales-return',
  templateUrl: './ip-sales-return.component.html',
  styleUrls: ['./ip-sales-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class IpSalesReturnComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';
  Itemchargeslist: any = [];
  NetAmt: any;
  ReturnAmt: any;

  labelPosition: 'before' | 'after' = 'after';

  dsIndentID = new MatTableDataSource<IndentID>();

  dsIndentItemwiseList = new MatTableDataSource<IndentList>();
  SelectionList = new MatTableDataSource<IndentList>();
  SelectedList = new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'UnitMRP',
    'Qty',
    'IssueQty',
    'Bal',
    'TotalAmount'
  ];

  displayedColumns2 = [
    'ItemName',
    'UnitMRP',
    'Qty',
    'IssueQty',
    'Bal',
    'TotalAmount'
  ];


  displayedColumns4 = [

    'ItemName',
    'Qty',
    'IssueQty',
    'UnitMRP',
    'TotalAmount',
    'ReturnQty',
    'Bal'
  ];



  displayedColumns5 = [
    'ItemName',
    'Qty',
    'IssueQty',
    'ReturnQty',
    'Bal',
    'TotalAmount'

  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IndentID: IpSalesReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIndentID()
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {

      "ToStoreId": this._IndentID.IndentSearchGroup.get('ToStoreId').value.StoreId || 1,
      "From_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "Status": 1//this._IndentID.IndentSearchGroup.get("Status").value || 1,
    }
    this._IndentID.getIndentID(Param).subscribe(data => {
      this.dsIndentID.data = data as IndentID[];
      console.log(this.dsIndentID.data)
      this.dsIndentID.sort = this.sort;
      this.dsIndentID.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getIndentList(Params) {
    // this.sIsLoading = 'loading-data';
    var Param = {
      "IndentId": Params.IndentId
    }
    this._IndentID.getIndentList(Param).subscribe(data => {
      this.dsIndentItemwiseList.data = data as IndentList[];
      this.dsIndentItemwiseList.sort = this.sort;
      this.dsIndentItemwiseList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  SelectedItem(contact) {

    let Amount = contact.UnitMRP * contact.ReturnQty;

    this.Itemchargeslist.push(
      {

        IssQty: contact.ItemId,
        ItemName: contact.ItemName,
        BatchNo: contact.BatchNo,
        BatchExpDate: contact.BatchExpDate || '01/01/1900',
        Qty: contact.Qty,
        UnitMRP: contact.MRP,
        ReturnQty: contact.ReturnQty,
        GSTPer: contact.GSTPer || 0,
        GSTAmount: contact.GSTAmount || 0,
        TotalAmount: Amount,
        DiscAmt: contact.DiscAmt | 0,
        NetAmt: contact.NetAmt,
        StockId: contact.StockId,

      });
    this.saleSelectedDatasource.data = this.Itemchargeslist;
  }

  onclickrow(contact) {
    Swal.fire("Row selected :" + contact)
  }
  getIndentStoreList() {
    debugger

    this._IndentID.getStoreFromList().subscribe(data => {
      this.Store1List = data;

    });

  }
  getSelectionIndentList() {

    this._IndentID.getSelectionList().subscribe(data => {
      this.Store1List = data;

    });
  }

  RtrvQueryChk() {
    if (this._IndentID.userFormGroup.get("CashPay").value == 'CashPay') {
      this._IndentID.getSalesReturncash().subscribe(data => {
        this.Store1List = data;

      });

    }
    else {
      this._IndentID.getSalesReturnCredit().subscribe(data => {
        this.Store1List = data;

      });

    }
  }


  onSave() {

  }

  onClose() {

  }

  onClear() {

  }
}

// export class IndentList {
//   ItemName: string;
//   Qty: number;
//   IssQty:number;
//   Bal:number;
//   StoreId:any;
//   StoreName:any;
//   /**
//    * Constructor
//    *
//    * @param IndentList
//    */
//   constructor(IndentList) {
//     {
//       this.ItemName = IndentList.ItemName || "";
//       this.Qty = IndentList.Qty || 0;
//       this.IssQty = IndentList.IssQty || 0;
//       this.Bal = IndentList.Bal|| 0;
//       this.StoreId = IndentList.StoreId || 0;
//       this.StoreName =IndentList.StoreName || '';
//     }
//   }
// }
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName: string;
  ToStoreName: string;
  Addedby: number;
  IsInchargeVerify: string;
  IndentId: any;
  FromStoreId: boolean;

  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

// <!-- (keyup)="getTotalAmount(contact)" -->