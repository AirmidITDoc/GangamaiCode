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
  
  dsGRNReturnHeaderList = new MatTableDataSource<GRNReturnHeaderList>();
  dsGRNReturnList = new MatTableDataSource<GRNReturnList>();
  dsGRNReturnItemList = new MatTableDataSource<GRNReturnItemList>();

  ToStoreList:any=[];
  SupplierList:any;
  optionsToStore: any;
  optionsSupplier: any;
  isPaymentSelected : boolean = false;
  isSupplierSelected: boolean = false;
  isChecked: boolean = true;
  chargeslist: any = [];
  screenFromString = 'admission-form';
  labelPosition: 'before' | 'after' = 'after';

  displayedColumns = [
    'GRNReturnId',
    'GRNReturnDate',
    'StoreName',
    'SupplierName',
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
    "ReturnQty",
    "PureRate",
    "Amount",
    "GST",
    "GSTAmount",
    "NetAmount",
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


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  sIsLoading: string;
  filteredoptionsToStore: Observable<string[]>;
  filteredoptionsSupplier: Observable<string[]>;
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

  getGRNReturnList() {
    // this.sIsLoading = 'loading-data';
    var Param = {
       "ToStoreId": this._GRNReturnHeaderList.vGRNReturnSearchFilter.get('ToStoreId').value.storeid || 0,
       "From_Dt": this.datePipe.transform(this._GRNReturnHeaderList.vGRNReturnSearchFilter.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._GRNReturnHeaderList.vGRNReturnSearchFilter.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "SupplierId": this._GRNReturnHeaderList.vGRNReturnSearchFilter.get('SupplierId').value.SupplierId || 0,
       "IsVerify":  this._GRNReturnHeaderList.vGRNReturnSearchFilter.get("IsVerify").value || 0,
    }
    console.log(Param);
      this._GRNReturnHeaderList.getGRNReturnHeaderList(Param).subscribe(data => {
      this.dsGRNReturnHeaderList.data = data as GRNReturnHeaderList[];
      console.log(this.dsGRNReturnHeaderList.data);
      this.dsGRNReturnHeaderList.sort = this.sort;
      this.dsGRNReturnHeaderList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getGRNReturnDetailList(Params){
    this.sIsLoading = 'loading-data';
    var Param = {
      "GRNReturnId": Params.GRNReturnId 
    }
      this._GRNReturnHeaderList.getGRNReturnList(Param).subscribe(data => {
      this.dsGRNReturnList.data = data as GRNReturnList[];
      this.dsGRNReturnList.sort = this.sort;
      this.dsGRNReturnList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsGRNReturnList.data)
    },
      error => {
        this.sIsLoading = '';
      });
  }

  // getToStoreSearchList() {
  //   this._GRNReturnHeaderList.getToStoreSearchList().subscribe(data => {
  //     this.ToStoreList = data;
  //   });
  // }

  getStoreList() {
    var vdata = {
      Id: 10003, //this._loggedService.currentUserValue.user.storeId
    }
    this._GRNReturnHeaderList.getLoggedStoreList(vdata).subscribe(data => {
      this.ToStoreList = data;
      this._GRNReturnHeaderList.vGRNReturnSearchFilter.get('StoreId').setValue(this.ToStoreList[0]);
      // this.StoreName = this._GRNReturnHeaderList.GRNReturnHeaderGroup.get('StoreId').value.StoreName;
    });
  }

  getSupplierSearchList1() {
    this._GRNReturnHeaderList.getSupplierSearchList().subscribe(data => {
      this.SupplierList = data;
      // console.log(this.SupplierList);
    });
  }

  onChangeDateofBirth(DateOfBirth) {
    if (DateOfBirth) {
      const todayDate = new Date();
      const dob = new Date(DateOfBirth);
      const timeDiff = Math.abs(Date.now() - dob.getTime());
      this.vGRNReturnItemFilter.get('DateOfBirth').setValue(DateOfBirth);
    }

  }

  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }


  getSupplierSearchCombo() {
      this._GRNReturnHeaderList.getSupplierSearchList().subscribe(data => {
        this.SupplierList = data;
        console.log(data);
        this.optionsSupplier = this.SupplierList.slice();
        this.filteredoptionsSupplier = this._GRNReturnHeaderList.vGRNReturnSearchFilter.get('SupplierId').valueChanges.pipe(
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
    
    // private _filterStore(value: any): string[] {
    //   if (value) {
    //     const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();
    //     return this.optionsToStore.filter(option => option.StoreName.toLowerCase().includes(filterValue));
    //   }
    // }

  getOptionTextPayment(option) {
    return option && option.StoreName ? option.StoreName : '';
  }

  getOptionTextSupplier(option) {
    return option && option.SupplierName ? option.SupplierName : '';
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  deleteTableRow(element) {
    let index = this.chargeslist.indexOf(element);
    if (index >= 0) {
      this.chargeslist.splice(index, 1);
      this.dsGRNReturnItemList.data = [];
      this.dsGRNReturnItemList.data = this.chargeslist;
    }
    Swal.fire('Success !', 'ChargeList Row Deleted Successfully', 'success');
  }
  
  OnSave(){}

  OnReset(){}
  
  onClear(){}

}

export class GRNReturnHeaderList {
  GRNReturnId: number;
  GRNReturnDate: number;
  StoreName:string;
  SupplierName:string;
  GSTAmount:number;
  NetAmount:number;
  Remark:string;
  AddedBy:number;
  action:number;

  /**
   * Constructor
   *
   * @param GRNReturnHeaderList
   */
  constructor(GRNReturnHeaderList) {
    {
      this.GRNReturnId = GRNReturnHeaderList.GRNReturnId || 0;
      this.GRNReturnDate = GRNReturnHeaderList.GRNReturnDate || 0;
      this.StoreName = GRNReturnHeaderList.StoreName || "";
      this.SupplierName = GRNReturnHeaderList.SupplierName ||"";
      this.GSTAmount = GRNReturnHeaderList.GSTAmount || 0;
      this.NetAmount = GRNReturnHeaderList.NetAmount || 0;
      this.Remark = GRNReturnHeaderList.Remark || "";
      this.AddedBy = GRNReturnHeaderList.AddedBy || 0;
      this.action = GRNReturnHeaderList.action || 0;
    }
  }
}

    export class GRNReturnList {

      ItemName: string;
      BatchNo: number;
      BatchExpiryDate: number;
      BalQty: number;
      ReturnQty: number;
      PureRate: number;
      Amount: number;
      GST: number;
      GSTAmount: number;
      NetAmount: number;
      BQty: number;
      StkId: number;
      
      /**
       * Constructor
       *
       * @param GRNReturnList
       */
      constructor(GRNReturnList) {
        {
         
          this.ItemName = GRNReturnList.ItemName || "";
          this.BatchNo = GRNReturnList.BatchNo || 0;
          this.BatchExpiryDate = GRNReturnList.BatchExpiryDate || 0;
          this.BalQty =GRNReturnList.BalQty || 0;
          this.ReturnQty = GRNReturnList.ReturnQty || 0;
          this.PureRate = GRNReturnList.PureRate || 0;
          this.Amount = GRNReturnList.Amount || 0;
          this.GST = GRNReturnList.GST || 0;
          this.GSTAmount = GRNReturnList.GSTAmount || 0;
          this.NetAmount = GRNReturnList.NetAmount || 0;
          this.BQty = GRNReturnList.BQty || 0;
          this.StkId = GRNReturnList.StkId || 0;
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
          this.BalQty =GRNReturnItemList.BalQty || 0;
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
