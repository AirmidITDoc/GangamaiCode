import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { GrnReturnService } from './grn-return.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { Observable } from 'rxjs/internal/Observable';
import { startWith } from 'rxjs/internal/operators/startWith';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { GrnListComponent } from './grn-list/grn-list.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-grn-return',
  templateUrl: './grn-return.component.html',
  styleUrls: ['./grn-return.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class GRNReturnComponent implements OnInit {
  displayedColumns = [
    'GRNReturnId',
    'GRNReturnNo',
    'GRNReturnDate',
    'StoreName',
    'SupplierName',
    'UserName',
    'GSTAmount',
    'NetAmount',
    'Remark',
    'AddedBy',
    'action',
  ];
  displayedColumns1 = [
    "ItemName",
    "BatchNo",
    "BatchExpiryDate",
    'Conversion',
    "ReturnQty",
    'TotalQty',
    'MRP',
    "LandedRate",
    "Totalamt",
    "GST",
    "GSTAmount",
    "StkId",
  ];
  displayedColumns2 = [
    "GRNNO",
    "GRNDate",
    "SupplierName",
    'TotalAmount',
    'NetAmount',
  ];
  ToStoreList: any = [];
  SupplierList: any;
  optionsToStore: any;
  optionsSupplier: any;
  isPaymentSelected: boolean = false;
  isSupplierSelected: boolean = false;
  isChecked: boolean = true;
  chargeslist: any = [];
  dateTimeObj: any;
  screenFromString = 'admission-form';
  labelPosition: 'before' | 'after' = 'after';
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsSupplier2: Observable<string[]>;
  vGRNReturnItemFilter: any;

  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemDetList = new MatTableDataSource<GRNReturnItemDetList>();
  dsNewGRNReturnItemList = new MatTableDataSource<NewGRNReturnItemList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) public paginator2: MatPaginator;
 
  constructor(
    public _GRNReturnHeaderList: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.getStoreList();
    this.getGRNReturnList();
    this.getSupplierSearchCombo();
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  getStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._GRNReturnHeaderList.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._GRNReturnHeaderList.GRNReturnSearchFrom.get('ToStoreId').setValue(this.ToStoreList[0]);
      this._GRNReturnHeaderList.NewGRNReturnFrom.get('ToStoreId').setValue(this.ToStoreList[0]);
    });
  }
  getSupplierSearchCombo() {
    this._GRNReturnHeaderList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(data);
      this.optionsSupplier = this.SupplierList.slice();
      this.filteredoptionsSupplier = this._GRNReturnHeaderList.GRNReturnSearchFrom.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
      this.filteredoptionsSupplier2 = this._GRNReturnHeaderList.NewGRNReturnFrom.get('SupplierId').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterSupplier(value) : this.SupplierList.slice()),
      );
    });
  }
  private _filterSupplier(value: any): string[] {
    if (value) {
      const filterValue = value && value.SupplierName ? value.SupplierName.toLowerCase() : value.toLowerCase();
      return this.optionsSupplier.filter(option => option.SupplierName.toLowerCase().includes(filterValue));
    }
  } 
  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  getOptionTextSupplier2(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }
  
  getGRNReturnList() {
    this.sIsLoading = 'loading-data';
    var Param = {
      "ToStoreId": this._loggedService.currentUserValue.user.storeId || 0,
      "From_Dt": this.datePipe.transform(this._GRNReturnHeaderList.GRNReturnSearchFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "To_Dt": this.datePipe.transform(this._GRNReturnHeaderList.GRNReturnSearchFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "SupplierId": this._GRNReturnHeaderList.GRNReturnSearchFrom.get('SupplierId').value.SupplierId || 0,
      "IsVerify": this._GRNReturnHeaderList.GRNReturnSearchFrom.get("Status").value || 0,
    }
    console.log(Param);
    this._GRNReturnHeaderList.getGRNReturnList(Param).subscribe(data => {
      this.dsGRNReturnList.data = data as GRNReturnList[];
      console.log(this.dsGRNReturnList.data);
      this.dsGRNReturnList.sort = this.sort;
      this.dsGRNReturnList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  getGRNReturnItemDetList(Params) {
    this.sIsLoading = 'loading-data';
    var Param = {
      "GRNReturnId": Params.GRNReturnId
    }
    this._GRNReturnHeaderList.getGRNReturnItemDetList(Param).subscribe(data => {
      this.dsGRNReturnItemDetList.data = data as GRNReturnItemDetList[];
      this.dsGRNReturnItemDetList.sort = this.sort;
      this.dsGRNReturnItemDetList.paginator = this.paginator1;
      this.sIsLoading = '';
      console.log(this.dsGRNReturnItemDetList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

  deleteTableRow(elm) {
    this.dsNewGRNReturnItemList.data = this.dsNewGRNReturnItemList.data
      .filter(i => i !== elm)
      .map((i, idx) => (i.position = (idx + 1), i));
      this.toastr.success('Record Deleted Successfully', 'Success !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
  }
  OnSave() {
    if ((!this.dsNewGRNReturnItemList.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
    if ((!this._GRNReturnHeaderList.GRNReturnSearchFrom.get('SupplierId').value.SupplierId)) {
      this.toastr.warning('Please Select Supplier name.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
   }

  OnReset() { 
    this._GRNReturnHeaderList.NewGRNReturnFrom.reset();
    this._GRNReturnHeaderList.NewGRNRetFinalFrom.reset();
    this.dsNewGRNReturnItemList.data = [];
  }

  onClear() { }
  getGRNList() {
    const dialogRef = this._matDialog.open(GrnListComponent,
      {
        maxWidth: "100%",
        height: '95%',
        width: '95%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      console.log(result)
      this.dsNewGRNReturnItemList.data = result as NewGRNReturnItemList[];
      const toSelectSUpplierId = this.SupplierList.find(c => c.SupplierId == result[0].SupplierId);
      this._GRNReturnHeaderList.NewGRNReturnFrom.get('SupplierId').setValue(toSelectSUpplierId);
    });
}
}

export class GRNReturnList {
  GRNReturnId: number;
  GRNReturnDate: number;
  StoreName: string;
  SupplierName: string;
  GSTAmount: number;
  NetAmount: number;
  Remark: string;
  AddedBy: number;
  action: number;
  GRNReturnNo: number;
  UserName: any;

  constructor(GRNReturnList) {
    {
      this.GRNReturnId = GRNReturnList.GRNReturnId || 0;
      this.GRNReturnDate = GRNReturnList.GRNReturnDate || 0;
      this.StoreName = GRNReturnList.StoreName || "";
      this.SupplierName = GRNReturnList.SupplierName || "";
      this.GSTAmount = GRNReturnList.GSTAmount || 0;
      this.NetAmount = GRNReturnList.NetAmount || 0;
      this.Remark = GRNReturnList.Remark || "";
      this.AddedBy = GRNReturnList.AddedBy || 0;
      this.GRNReturnNo = GRNReturnList.GRNReturnNo || 0;
      this.UserName = GRNReturnList.UserName || '';
    }
  }
}

export class GRNReturnItemDetList {
  ItemName: string;
  BatchNo: number;
  BatchExpiryDate: number;
  Conversion:any;
  BalQty: number;
  ReturnQty: number;
  PureRate: number;
  Amount: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  BQty: number;
  StkId: number;
  TotalQty:any;
  MRP:number;
  LandedRate: number;
  Totalamt:any;

  constructor(GRNReturnItemDetList) {
    {

      this.ItemName = GRNReturnItemDetList.ItemName || "";
      this.BatchNo = GRNReturnItemDetList.BatchNo || 0;
      this.BatchExpiryDate = GRNReturnItemDetList.BatchExpiryDate || 0;
      this.BalQty = GRNReturnItemDetList.BalQty || 0;
      this.ReturnQty = GRNReturnItemDetList.ReturnQty || 0;
      this.PureRate = GRNReturnItemDetList.PureRate || 0;
      this.Amount = GRNReturnItemDetList.Amount || 0;
      this.GST = GRNReturnItemDetList.GST || 0;
      this.GSTAmount = GRNReturnItemDetList.GSTAmount || 0;
      this.NetAmount = GRNReturnItemDetList.NetAmount || 0;
      this.BQty = GRNReturnItemDetList.BQty || 0;
      this.StkId = GRNReturnItemDetList.StkId || 0;
      this.Conversion = GRNReturnItemDetList.Conversion || 0;
      this.TotalQty = GRNReturnItemDetList.totalQty || 0;
      this.MRP = GRNReturnItemDetList.MRP || 0;
      this.LandedRate = GRNReturnItemDetList.LandedRate || 0;
      this.Totalamt = GRNReturnItemDetList.Totalamt || 0;
    }
  }
}

export class NewGRNReturnItemList {

  GRNNO: number;
  ItemName: number;
  BatchNo: number;
  BalQty: number;
  ReturnQty: number;
  LandedRate: number;
  TotalAmount: number;
  GST: number;
  GSTAmount: number;
  NetAmount: number;
  IsBatchRequired: number;
  StkID: number;
  CF: number;
  TotalQty: number;
  GrnId: number;
  position:any;

  constructor(NewGRNReturnItemList) {
    {
      this.GRNNO = NewGRNReturnItemList.GRNNO || 0;
      this.ItemName = NewGRNReturnItemList.ItemName || 0;
      this.BatchNo = NewGRNReturnItemList.BatchNo || 0;
      this.BalQty = NewGRNReturnItemList.BalQty || 0;
      this.ReturnQty = NewGRNReturnItemList.ReturnQty || 0;
      this.LandedRate = NewGRNReturnItemList.LandedRate || 0;
      this.TotalAmount = NewGRNReturnItemList.TotalAmount || 0;
      this.GST = NewGRNReturnItemList.GST || 0;
      this.GSTAmount = NewGRNReturnItemList.GSTAmount || 0;
      this.NetAmount = NewGRNReturnItemList.NetAmount || 0;
      this.IsBatchRequired = NewGRNReturnItemList.IsBatchRequired || 0;
      this.StkID = NewGRNReturnItemList.StkID || 0;
      this.CF = NewGRNReturnItemList.CF || 0;
      this.TotalQty = NewGRNReturnItemList.TotalQty || 0;
      this.GrnId = NewGRNReturnItemList.GrnId || 0;
    }
  }
}
