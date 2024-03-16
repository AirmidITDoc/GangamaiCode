import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from './stock-adjustment.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { request } from 'http';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-stock-adjustment',
  templateUrl: './stock-adjustment.component.html',
  styleUrls: ['./stock-adjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class StockAdjustmentComponent implements OnInit {
  displayedColumns = [
    'BatchNo',
    'ExpDate',
    'UnitMRP',
    'PurchaseRate',
    'BalQty',
  ];

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[];
  screenFromString = 'admission-form';
  VQty:any;
  VBatchNO:any;
  isItemIdSelected: boolean = false;
  registerObj = new RegInsert({});
 
   ItemName: any;
   ItemId: any;
   BalanceQty:any;
   MRP:any;
   Qty:any;
   UpdatedQty:any;
   result:any;

   dateTimeObj: any;
   ItemList:any=[];
   OptionsItemName: any;
   filteredoptionsItemName: Observable<string[]>;
   vBatchNo:any;
   vQty:any;
   vMRP:any;
   vUpdatedQty:any;
   vBalQty:any;

  
  dsStockAdjList = new MatTableDataSource<StockAdjList>();
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
 

  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,  
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    this.getStockList();
  }

  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    this._StockAdjustment.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      this._StockAdjustment.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
getSearchList() {
    this._StockAdjustment.getItemlist().subscribe(resData => {
      this.ItemList = resData;
      console.log(this.ItemList)
      this.OptionsItemName = this.ItemList.slice();
      this.filteredoptionsItemName = this._StockAdjustment.userFormGroup.get('ItemID').valueChanges.pipe(
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
getSelectedObj(obj){
console.log(obj);
this.getStockList();
}

getStockList() {
  var Param = {
    "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
    "ItemId": this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0,
  }
  console.log(Param)
  this._StockAdjustment.getStockList(Param).subscribe(data => {
    this.dsStockAdjList.data = data as StockAdjList[];
    console.log(this.dsStockAdjList)
    this.dsStockAdjList.sort = this.sort;
    this.dsStockAdjList.paginator = this.paginator;
    this.sIsLoading = '';
  },
    error => {
      this.sIsLoading = '';
    });
}

OnSelect(param){
  this.VBatchNO=param.BatchNo,
  this.BalanceQty=param.BalanceQty,
  this.Qty=param.BalanceQty,
  this.MRP=param.UnitMRP
  console.log(param);
} 

addition(){
var q=this._StockAdjustment.userFormGroup.get('Qty').value;
  this.UpdatedQty = this.BalanceQty + q;
  
}
Substraction(){
  this.UpdatedQty =  this.BalanceQty - this.Qty;
  
}
OnSave(){
  if ((!this.dsStockAdjList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
}
 OnReset(){
  this._StockAdjustment.userFormGroup.reset();
 }
}

 

export class StockAdjList {
  BalQty: any;
  BatchNo: number;
  ExpDate:number;
  UnitMRP:number;
  Landedrate:any;
  PurchaseRate:any;
 
  constructor(StockAdjList) {
    {
      this.BalQty = StockAdjList.BalQty || 0;
      this.BatchNo = StockAdjList.BatchNo || 0;
      this.ExpDate = StockAdjList.ExpDate || 0;
      this.UnitMRP = StockAdjList.UnitMRP|| 0;
      this.Landedrate = StockAdjList.Landedrate || 0;
      this.PurchaseRate =StockAdjList.PurchaseRate || 0;
    }
  }
}