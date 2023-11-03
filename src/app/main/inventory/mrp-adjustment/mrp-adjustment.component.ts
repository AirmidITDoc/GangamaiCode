import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MrpAdjustmentService } from './mrp-adjustment.service';
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

@Component({
  selector: 'app-mrp-adjustment',
  templateUrl: './mrp-adjustment.component.html',
  styleUrls: ['./mrp-adjustment.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MRPAdjustmentComponent implements OnInit {
  displayedColumns = [
    'BatchNo',
    'ExpDate',
    'UnitMRP',
    'Landedrate',
    'PurchaseRate',
    'BalQty',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  sIsLoading: string = '';
  // isLoading = true;
  isLoading : string='';
  StoreList:any=[];
  screenFromString = 'admission-form';
  ItemList:any=[];
  BatchNo:any;
  MRP:any;
  Landedrate:any;
  PurchaseRate:any;
  BarCodeNo:any;
  Qty:any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  filteredOptions: any;
  ItemListfilteredOptions: any;
   isItemSearchDisabled: boolean;
   ItemName: any;
   ItemId: any;
   MRP1: any;
   Landedrate1: any;
   BarcodeQty: any;
   PurchaseRate1: any;
   BalanceQty:any;
 
  
  dsMrpAdjList = new MatTableDataSource<MrpAdjList>();
 

  constructor(
    public _MrpAdjustmentService: MrpAdjustmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService
    
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
  }
 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getMRPAdjList(Param) {
 
    this.sIsLoading = 'loading-data';
    var vdata= {
      "StoreId": this._MrpAdjustmentService.userFormGroup.get('StoreId').value.storeid,
       "ItemId": Param.ItemID
    }
    console.log(vdata);
      this._MrpAdjustmentService.getMRPAdjustList(vdata).subscribe(data => {
      this.dsMrpAdjList.data = data as MrpAdjList[];

      console.log(data);
      this.dsMrpAdjList.sort = this.sort;
      this.dsMrpAdjList.paginator = this.paginator;
      this.sIsLoading = '';
     console.log(this.dsMrpAdjList.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getSearchList() {
    var m_data = {
      "ItemName": `${this._MrpAdjustmentService.userFormGroup.get('ItemID').value}%`
    }
    //console.log(m_data);
    if (this._MrpAdjustmentService.userFormGroup.get('ItemID').value.length >= 1) {
      this._MrpAdjustmentService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
       // console.log(resData)
        this.ItemListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }

      });
      // this.getMRPAdjList();
    }
    
  }
  getOptionItemText(option) {
    this.ItemId = option.ItemID;
    if (!option) return '';
    return option.ItemID + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObj(obj) {
    console.log(obj);
    this.getMRPAdjList(obj);
  }
  
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    //console.log(vdata);
    this._MrpAdjustmentService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      //console.log(this.StoreList);
      this._MrpAdjustmentService.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }

  OnSelect(Param){

    console.log(Param);

      this.BatchNo= Param.BatchNo,
      this.MRP= Param.UnitMRP,
      this.Landedrate=Param.LandedRate,
      this.PurchaseRate=Param.PurUnitRateWF,
      this.Qty=Param.BalanceQty,
      this.BarCodeNo= Param.BarCodeSeqNo,
      this.MRP1= Param.UnitMRP,
      this.Landedrate1=Param.LandedRate,
      this.PurchaseRate1=Param.PurUnitRateWF,
      this.BarcodeQty=Param.BalanceQty,
      this.BalanceQty=Param.BalanceQty
    
  } 
}

export class MrpAdjList {
  BalQty: any;
  BatchNo: number;
  ExpDate:number;
  UnitMRP:number;
  Landedrate:any;
  PurchaseRate:any;
 
  constructor(MrpAdjList) {
    {
      this.BalQty = MrpAdjList.BalQty || 0;
      this.BatchNo = MrpAdjList.BatchNo || 0;
      this.ExpDate = MrpAdjList.ExpDate || 0;
      this.UnitMRP = MrpAdjList.UnitMRP|| 0;
      this.Landedrate = MrpAdjList.Landedrate || 0;
      this.PurchaseRate =MrpAdjList.PurchaseRate || 0;
    }
  }
}