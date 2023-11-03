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
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { request } from 'http';

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
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  registerObj = new RegInsert({});
  filteredOptions: any;
  ItemListfilteredOptions: any;
   isItemSearchDisabled: boolean;
   ItemName: any;
   ItemId: any;
   BalanceQty:any;
   MRP:any;
   Qty:any;
   UpdatedQty:any;
   result:any;

  
  dsStockAdjList = new MatTableDataSource<StockAdjList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
 

  constructor(
    public _StockAdjustment: StockAdjustmentService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,  
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._StockAdjustment.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      console.log(this.StoreList);
      this._StockAdjustment.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }

  getMRPAdjList(Param) {
    this.sIsLoading = 'loading-data';
   var vdata= {
     
     "StoreId": this._StockAdjustment.userFormGroup.get('StoreId').value.storeid,
     "ItemId": Param.ItemID   
   }
   console.log(vdata);
     this._StockAdjustment.getStockAdjustList(vdata).subscribe(data => {
     this.dsStockAdjList.data = data as StockAdjList[];
     this.dsStockAdjList.sort = this.sort;
     this.dsStockAdjList.paginator = this.paginator;
     this.sIsLoading = '';
     console.log(this.dsStockAdjList.data);
   },
     error => {
       this.sIsLoading = '';
     });
 }
getSearchList() {
  var m_data = {
    "ItemName": `${this._StockAdjustment.userFormGroup.get('ItemID').value}%`
    // "ItemID":0
  }
  //console.log(m_data);
  if (this._StockAdjustment.userFormGroup.get('ItemID').value.length >= 1) {
    this._StockAdjustment.getItemlist1(m_data).subscribe(resData => {
      this.filteredOptions = resData;
     // console.log(resData)
      this.ItemListfilteredOptions = resData;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }

    });
  }  
}
getOptionItemText(option) {
  this.ItemId = option.ItemID;
  if (!option) return '';
  return option.ItemID + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
}

getSelectedObj(obj) {
  this.registerObj = obj;
  this.getMRPAdjList(obj) ;
 
  //console.log(obj);
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