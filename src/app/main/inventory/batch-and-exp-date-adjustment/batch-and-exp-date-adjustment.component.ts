import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BatchAndExpDateAdjustmentService } from './batch-and-exp-date-adjustment.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-batch-and-exp-date-adjustment',
  templateUrl: './batch-and-exp-date-adjustment.component.html',
  styleUrls: ['./batch-and-exp-date-adjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class BatchAndExpDateAdjustmentComponent implements OnInit {
  displayedColumns = [
    'BatchNo',
    'ExpDate',
    'UnitMRP',
    'PurchaseRate',
    'BalQty',
    'Qty',
    'Addition',
    'Deduction',
    'UpdatedQty'
  ];


  ItemId: any;
  ItemName: any;
  BalanceQty:any
  VLandedrate: any;
  VPurchaseRate: any;
  VMRP: any;
  VBatchNO: any;
  NewBatchNo: any;
  BtachExpDate: any;
  OptionsItemName: any;

  StoreList: any = [];
  sIsLoading: string = '';
  isLoading = true;
  screenFromString = 'admission-form';
  dateTimeObj: any;
  isItemIdSelected: boolean = false;
  ItemList: any = [];
  filteredoptionsItemName: Observable<string[]>;

  dsBatchAndExpDate = new MatTableDataSource<BatchAndExpList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _BatchAndExpDateService: BatchAndExpDateAdjustmentService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    public toastr: ToastrService,
    private _loggedService: AuthenticationService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._BatchAndExpDateService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._BatchAndExpDateService.StoreFrom.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getItemList() {
    var vdata = {
      "ItemName": `${this._BatchAndExpDateService.SearchGroup.get('ItemID').value}%`
    }
    this._BatchAndExpDateService.getItemlist(vdata).subscribe(resData => {
      this.ItemList = resData;
      //console.log(this.ItemList)
      this.OptionsItemName = this.ItemList.slice();
      this.filteredoptionsItemName = this._BatchAndExpDateService.SearchGroup.get('ItemID').valueChanges.pipe(
        startWith(''),
        map(value => value ? this._filterLitem(value) : this.ItemList.slice()),
      );
    });
  }
  private _filterLitem(value: any): string[] {
    if (value) {
      const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
      return this.OptionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    }
  }
  getOptionTextItemName(option) {
    return option && option.ItemName ? option.ItemName : '';
  }
  getSelectedObj(obj) {
    this.getBatchAndAdjList(obj);
  }

  getBatchAndAdjList(Param) {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "StoreId": this._BatchAndExpDateService.StoreFrom.get('StoreId').value.storeid,
      "ItemId":this._BatchAndExpDateService.SearchGroup.get('ItemID').value.ItemID// Param.ItemID
    }
    console.log(vdata);
    this._BatchAndExpDateService.getBatchAdjustList(vdata).subscribe(data => {
      this.dsBatchAndExpDate.data = data as BatchAndExpList[];
      this.dsBatchAndExpDate.sort = this.sort;
      this.dsBatchAndExpDate.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsBatchAndExpDate.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  OnSelect(param) {

    this.VBatchNO = param.BatchNo,
      this.VLandedrate = param.LandedRate,
      this.VMRP = param.UnitMRP,
      this.VPurchaseRate = param.PurUnitRateWF,
      this.NewBatchNo = param.BatchNo,
      this.BtachExpDate = param.BatchExpDate,
      //this.BalanceQty=param.BalanceQty
      console.log(param);
  }
  OnSave() {
    if ((!this.dsBatchAndExpDate.data.length)) {
      this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
        toastClass: 'tostr-tost custom-toast-warning',
      });
      return;
    }
  }
  OnReset() {
    this._BatchAndExpDateService.SearchGroup.reset();
    this.dsBatchAndExpDate.data = [];
  }
}

export class BatchAndExpList {
  BatchNo: any;
  ExpDate: number;
  UnitMRP: number;
  Landedrate: number;
  PurchaseRate: any;
  BalQty: any;

  constructor(BatchAndExpList) {
    {
      this.BatchNo = BatchAndExpList.BatchNo || 0;
      this.ExpDate = BatchAndExpList.ExpDate || 0;
      this.UnitMRP = BatchAndExpList.UnitMRP || 0;
      this.Landedrate = BatchAndExpList.Landedrate || 0;
      this.PurchaseRate = BatchAndExpList.PurchaseRate || 0;
      this.BalQty = BatchAndExpList.BalQty || 0;
    }
  }
}

