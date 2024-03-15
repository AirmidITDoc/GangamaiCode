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
    "ItemName",
    "BatchNo",
    'Batch',
    'BalQty',
    "ReturnQty",
    "LandedRate",
    "TotalAmount",
    "GST",
    "GSTAmount",
    'NetAmount',
    'IsBatchRequired',
    'StkID',
    'CF',
    'TotalQty',
    'GrnId',
  ];


  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemDetList = new MatTableDataSource<GRNReturnItemDetList>();
  dsGRNReturnItemList = new MatTableDataSource<GRNReturnItemList>();

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




  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('paginator1', { static: true }) public paginator1: MatPaginator;
  @ViewChild('paginator2', { static: true }) public paginator2: MatPaginator;
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
  filteredoptionsSupplier2: Observable<string[]>;
  vGRNReturnItemFilter: any;

  constructor(
    public _GRNReturnHeaderList: GrnReturnService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,

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
  
  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';
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
      this.dsGRNReturnItemDetList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsGRNReturnItemDetList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }


  // onChangeDateofBirth(DateOfBirth) {
  //   if (DateOfBirth) {
  //     const todayDate = new Date();
  //     const dob = new Date(DateOfBirth);
  //     const timeDiff = Math.abs(Date.now() - dob.getTime());
  //     this.vGRNReturnItemFilter.get('DateOfBirth').setValue(DateOfBirth);
  //   }

  // }








  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsGRNReturnItemList.data = [];
      this.dsGRNReturnItemList.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }

  OnSave() { }

  OnReset() { }

  onClear() { }

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

  /**
   * Constructor
   *
   * @param GRNReturnList
   */
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
  /**
   * Constructor
   *
   * @param GRNReturnItemDetList
   */
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

export class GRNReturnItemList {

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

  /**
   * Constructor
   *
   * @param GRNReturnItemList
   */
  constructor(GRNReturnItemList) {
    {
      this.GRNNO = GRNReturnItemList.GRNNO || 0;
      this.ItemName = GRNReturnItemList.ItemName || 0;
      this.BatchNo = GRNReturnItemList.BatchNo || 0;
      this.BalQty = GRNReturnItemList.BalQty || 0;
      this.ReturnQty = GRNReturnItemList.ReturnQty || 0;
      this.LandedRate = GRNReturnItemList.LandedRate || 0;
      this.TotalAmount = GRNReturnItemList.TotalAmount || 0;
      this.GST = GRNReturnItemList.GST || 0;
      this.GSTAmount = GRNReturnItemList.GSTAmount || 0;
      this.NetAmount = GRNReturnItemList.NetAmount || 0;
      this.IsBatchRequired = GRNReturnItemList.IsBatchRequired || 0;
      this.StkID = GRNReturnItemList.StkID || 0;
      this.CF = GRNReturnItemList.CF || 0;
      this.TotalQty = GRNReturnItemList.TotalQty || 0;
      this.GrnId = GRNReturnItemList.GrnId || 0;
    }
  }
}
