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
import { FormBuilder, FormGroup } from '@angular/forms';

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

  Store1List: any = [];
  screenFromString = 'admission-form';
  filteredOptions: any;
  filteredOptionsItem: any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  ItemId:any;
  ItemName:any;
  

  dsBatchAndExpDate = new MatTableDataSource<BatchAndExpList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  userFormGroup: FormGroup;
  SearchGroup :FormGroup;

  constructor(
    public _BatchAndExpDateAdjustmentService: BatchAndExpDateAdjustmentService,
    public _matDialog: MatDialog,
    public datePipe: DatePipe,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.SearchGroup= this.createSearchFrom();
    this.getIndentStoreList();
    this.getSearchItemList();
  }
  createSearchFrom() {
    return this._formBuilder.group({
      ToStoreId: '',
      ItemID: '',
      ItemName: '',
      BatchNO:'',
      MRP:'',
      BtachExpDate:'',
      PurchaseRate:'',
      NewExpDate:'',
      Landedrate:'',
      NewBatchNo:'',

      

    });
  }

  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getIndentStoreList() {

    this._BatchAndExpDateAdjustmentService.getStoreFromList().subscribe(data => {
      this.Store1List = data;
      // this._IndentID.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
    });

  }
  
  getSearchItemList() {
    var m_data = {
      "ItemName": `${this.SearchGroup.get('ItemID').value}%`,
      "ItemID": 2 // this.myForm.get('StoreId').value.storeid || 0
    }
    console.log(m_data);
    if (this.SearchGroup.get('ItemID').value.length >= 2) {
      this._BatchAndExpDateAdjustmentService.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
       // console.log(this.data);
        this.filteredOptionsItem = data;
        if (this.filteredOptionsItem.length == 0) {
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
    return option.ItemID + ' ' + option.ItemName ;
  }
  getSelectedObjItem(obj) {
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemID;
  
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

