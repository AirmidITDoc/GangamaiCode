import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { BatchAndExpDateAdjustmentService } from './batch-and-exp-date-adjustment.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { RegInsert } from 'app/main/opd/appointment/appointment.component';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
    'Landedrate',
    'PurchaseRate',
    'BalQty',
  ];

  StoreList: any = [];
  sIsLoading: string = '';
  isLoading = true;
  screenFromString = 'admission-form';
  filteredOptions: any;
  ItemListfilteredOptions: any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  ItemId:any;
  ItemName:any;
  isItemSearchDisabled:boolean =false;
  VLandedrate:any;
  VPurchaseRate:any;
  VMRP:any;
  VBatchNO:any;
  NewBatchNo:any;
  BtachExpDate:any;

  dsBatchAndExpDate = new MatTableDataSource<BatchAndExpList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;
  BalanceQty: any;
 

  constructor(
    public _BatchAndExpDateAdjustmentService: BatchAndExpDateAdjustmentService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
     private _loggedService: AuthenticationService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.SearchGroup= this.createSearchFrom();
    this.gePharStoreList();
  }
  createSearchFrom() {
    return this._formBuilder.group({
      StoreId: '',
      ItemID: '',
      BtachExpDate:'',
      NewExpDate:'',
      NewBatchNo:'',
      BalanceQty:''
    });
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
    // console.log(vdata);
    this._BatchAndExpDateAdjustmentService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this.SearchGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  getBatchAndAdjList(Param) {
    this.sIsLoading = 'loading-data';
   var vdata= { 
     "StoreId": this.SearchGroup.get('StoreId').value.storeid ,
     "ItemId": Param.ItemID
   }
   console.log(vdata);
     this._BatchAndExpDateAdjustmentService.getBatchAdjustList(vdata).subscribe(data => {
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

 getSearchList() {
  var m_data = {
    "ItemName": `${this.SearchGroup.get('ItemID').value}%`
    // "ItemID":0
  }
  //console.log(m_data);
  if (this.SearchGroup.get('ItemID').value.length >= 1) {
    this._BatchAndExpDateAdjustmentService.getItemlist(m_data).subscribe(resData => {
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
  return option.ItemID + ' ' + option.ItemName  ;
}
 
getSelectedObj(obj) {
  this.getBatchAndAdjList(obj);
  //console.log(obj);
}
OnSelect(param){

this.VBatchNO=param.BatchNo,
this.VLandedrate=param.LandedRate,
this.VMRP=param.UnitMRP,
this.VPurchaseRate=param.PurUnitRateWF,
this.NewBatchNo=param.BatchNo,
this.BtachExpDate=param.BatchExpDate,
this.BalanceQty=param.BalanceQty
console.log(param);
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

