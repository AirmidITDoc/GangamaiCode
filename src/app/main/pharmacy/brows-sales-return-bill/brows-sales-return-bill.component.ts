import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BrowsSalesReturnBillService } from './brows-sales-return-bill.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { AcceptMaterialListPopupComponent } from './accept-material-list-popup/accept-material-list-popup.component';


@Component({
  selector: 'app-brows-sales-return-bill',
  templateUrl: './brows-sales-return-bill.component.html',
  styleUrls: ['./brows-sales-return-bill.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BrowsSalesReturnBillComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List: any = [];
  screenFromString = 'admission-form';

  labelPosition: 'before' | 'after' = 'after';

  DsIssuetodept = new MatTableDataSource<Issuetodept>();

  dsItemList = new MatTableDataSource<ItemList>();

  displayedColumns = [
    'IssueNo',
    'IssueDate',
    'FromStoreName',
    'ToStoreName',
    'NetAmount',
    'Remark',
    // 'Receivedby',
    'IsAccepted',
    'AcceptedBy',
    'AcceptedDatetime',
    'action',
  ];

  displayedColumns1 = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'IssueQty',
    'PerUnitLandedRate',
    'LandedTotalAmount',
    'VatPercentage'
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _SalesReturn: BrowsSalesReturnBillService,
    public _matDialog: MatDialog,
    private _loggedService: AuthenticationService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,

  ) { }

  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIssueTodept()
  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }


  getIssueTodept() {
    var Param = {
      "ToStoreId ": this._SalesReturn.MaterialReturnFrDept.get('ToStoreId').value.storeid || 0,
      "From_Dt": this.datePipe.transform(this._SalesReturn.MaterialReturnFrDept.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._SalesReturn.MaterialReturnFrDept.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "IsVerify ": 0
    }
    this._SalesReturn.getIssuetodeptlist(Param).subscribe(data => {
      this.DsIssuetodept.data = data as Issuetodept[];
      this.DsIssuetodept.sort = this.sort;
      this.DsIssuetodept.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getItemList(Params) {
    var Param = {
      "IssueId": Params.IssueId
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

  onEdit(contact) {
    console.log(contact);
    const dialogRef = this._matDialog.open(AcceptMaterialListPopupComponent,
      {
        maxWidth: "75vw",
        height: '650px',
        width: '100%',
        data: {
          Obj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getIssueTodept();
    });
  }


  onclickrow(contact) {
    // Swal.fire("Row selected :" + contact)
  }
  getIndentStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._SalesReturn.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      this._SalesReturn.MaterialReturnFrDept.get('ToStoreId').setValue(this.Store1List[0]);
    });

  }

  onClear() {

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

export class Issuetodept {
  IssueNo: any;
  IssueDate: any;
  FromStoreName: any;
  ToStoreName: any;
  NetAmount: any;
  Remark: any;
  Receivedby: any;
  FromStoreId: any;

  /**
   * Constructor
   *
   * @param Issuetodept
   */
  constructor(Issuetodept) {
    {
      this.IssueNo = Issuetodept.IssueNo || 0;
      this.IssueDate = Issuetodept.IssueDate || '';
      this.FromStoreName = Issuetodept.FromStoreName || "";
      this.ToStoreName = Issuetodept.ToStoreName || "";
      this.NetAmount = Issuetodept.NetAmount || 0;
      this.Remark = Issuetodept.Remark || "";
      this.Receivedby = Issuetodept.Receivedby || "";

    }
  }
}

