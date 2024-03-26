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
    'BatchEdit',
    'ExpDate',
    'ExpDateEdit',
    'UnitMRP',
    'PurchaseRate',
    'LandedRate',
    'BalQty',
    'Addition',
    'Deduction',
    'UpdatedQty'
  ];

  sIsLoading: string = '';
  isLoading = true;
  StoreList:any=[];
  screenFromString = 'admission-form';
  isItemIdSelected: boolean = false;
   ItemName: any;
   ItemId: any;
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
    private accountService: AuthenticationService,
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
      this._StockAdjustment.StoreFrom.get('StoreId').setValue(this.StoreList[0]);
    });
  }
getSearchList() {
    var vdata = {
      "ItemName": `${this._StockAdjustment.userFormGroup.get('ItemID').value}%` 
    }
    this._StockAdjustment.getItemlist(vdata).subscribe(resData => {
      this.ItemList = resData;
      //console.log(this.ItemList)
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
//console.log(obj);
this.getStockList();
}

getStockList() {
  var Param = {
    "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
    "ItemId": this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0, //56784
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
 // console.log(param);
 
} 
vStatus:any;
vStockId:any;
AddType:any;
vExpDate:any;
vPurchaseRate:any;
AddQty(contact,AddQty){
  if(contact.AddQty > 0){
    contact.UpdatedQty = contact.BalanceQty + contact.AddQty ;
    this.AddType = 1;
    this.toastr.success(contact.AddQty + ' Qty Added Successfully.', 'Success !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  }else{
    contact.UpdatedQty = 0;
  }
    this.vBatchNo=contact.BatchNo,
    this.vUpdatedQty = contact.UpdatedQty,
    this.vQty=contact.AddQty,
    this.vBalQty=contact.BalanceQty,
    this.vMRP=contact.UnitMRP,
    this.vStockId = contact.StockId,
    this.vExpDate = contact.BatchExpDate
    this.vPurchaseRate = contact.PurUnitRateWF
}
DeduQty(contact,DeduQty){
  if(contact.DeduQty > 0){
    contact.UpdatedQty = contact.BalanceQty - contact.DeduQty ;
    this.AddType=0;
    this.vQty=contact.DeduQty,
    this.toastr.success(contact.DeduQty + ' Qty Deduction Successfully.', 'Success !', {
      toastClass: 'tostr-tost custom-toast-success',
    });
  } else{
    contact.UpdatedQty = 0;
  }
 
}

Addeditable:boolean=false;
Dedueditable:boolean=false;
Expeditable:boolean=false;
Batcheditable:boolean=false;
Rateeditable:boolean=false;
Landededitable:boolean=false;

enableEditing(row: StockAdjList) {
  row.Addeditable = true;
}
disableEditing(row: StockAdjList) {
  row.Addeditable = false;
}
deduenableEditing(row: StockAdjList) {
  row.Dedueditable = true;
}
dedudisableEditing(row: StockAdjList) {
  row.Dedueditable = false;
}
RateenableEditing(row: StockAdjList) {
  row.Rateeditable = true;
}
RatedisableEditing(row: StockAdjList) {
  row.Rateeditable = false;
}
BatchenableEditing(row: StockAdjList) {
  row.Batcheditable = true;
}
BatchdisableEditing(row: StockAdjList) {
  row.Batcheditable = false;
}
ExpDateenableEditing(row: StockAdjList) {
  row.Expeditable = true;
}
ExpDatedisableEditing(row: StockAdjList) {
  row.Expeditable = false;
}
LandedenableEditing(row: StockAdjList) {
  row.Landededitable = true;
}
LandeddisableEditing(row: StockAdjList) {
  row.Landededitable = false;
}
OnSave(){
  if ((!this.dsStockAdjList.data.length)) {
    this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
    this.toastr.warning('Please enter a vQty', 'Warning !', {
      toastClass: 'tostr-tost custom-toast-warning',
    });
    return;
  }
  let insertMRPStockadju ={};
  insertMRPStockadju['storeID']= this.accountService.currentUserValue.user.storeId || 0;
  insertMRPStockadju['stkId']=this.vStockId || 0;
  insertMRPStockadju['itemId']=  this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0;
  insertMRPStockadju['batchNo']= this.vBatchNo || '';
  insertMRPStockadju['ad_DD_Type']=  this.AddType ;
  insertMRPStockadju['ad_DD_Qty']= this.vQty || 0;
  insertMRPStockadju['preBalQty']= this.vBalQty ||  0;
  insertMRPStockadju['afterBalQty']= this.vUpdatedQty ||  0;
  insertMRPStockadju['addedBy']= this.accountService.currentUserValue.user.id || 0;
  insertMRPStockadju['stockAdgId']= 0;

  let batchAdjustment ={};
  batchAdjustment['storeId']= this.accountService.currentUserValue.user.storeId || 0;
  batchAdjustment['itemId']= this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0;
  batchAdjustment['oldBatchNo']=  this.vUpdatedQty || 0;
  batchAdjustment['oldExpDate']=  this.vUpdatedQty || 0;
  batchAdjustment['newBatchNo']= this.accountService.currentUserValue.user.storeId || 0;
  batchAdjustment['newExpDate']= this.vStockId || 0
  batchAdjustment['addedBy']= this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0;
  batchAdjustment['stkId']= this.vStockId || 0;


  let submitData ={
    'stockAdjustment':insertMRPStockadju,
    'batchAdjustment':batchAdjustment,
  }
  console.log(submitData);
  this._StockAdjustment.StockAdjSave(submitData).subscribe(response => {
    if (response) {
      this.toastr.success('Record Stock Adjustment Saved Successfully.', 'Saved !', {
        toastClass: 'tostr-tost custom-toast-success',
      });
      this.OnReset();
      this.getStockList();
    } else {
      this.toastr.error('Stock Adjustment Data not saved !, Please check error..', 'Error !', {
        toastClass: 'tostr-tost custom-toast-error',
      });
    }
  }, error => {
    this.toastr.error('Stock Adjustment Data not saved !, Please check API error..', 'Error !', {
      toastClass: 'tostr-tost custom-toast-error',
    });
  });
}

 OnReset(){
 // this._StockAdjustment.userFormGroup.reset();

 }
}
export class StockAdjList {
  BalQty: any;
  BatchNo: number;
  ExpDate:number;
  UnitMRP:number;
  Landedrate:any;
  PurchaseRate:any;
  UpdatedQty:any;
  LandedRate:any;
  Addeditable:boolean=false;
  Dedueditable:boolean=false;
  Rateeditable:boolean=false;
  Batcheditable:boolean=false;
  Expeditable:boolean=false;
  Landededitable:boolean=false;

  constructor(StockAdjList) {
    {
      this.BalQty = StockAdjList.BalQty || 0;
      this.BatchNo = StockAdjList.BatchNo || 0;
      this.ExpDate = StockAdjList.ExpDate || 0;
      this.UnitMRP = StockAdjList.UnitMRP|| 0;
      this.Landedrate = StockAdjList.Landedrate || 0;
      this.PurchaseRate =StockAdjList.PurchaseRate || 0;
      this.UpdatedQty = StockAdjList.UpdatedQty || 0;
      this.LandedRate = StockAdjList.LandedRate || 0;
    }
  }
}