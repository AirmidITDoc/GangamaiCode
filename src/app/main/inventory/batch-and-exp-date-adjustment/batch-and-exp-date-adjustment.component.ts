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
  filteredOptionsItem: any;
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  ItemId:any;
  ItemName:any;
  registerObj = new RegInsert({});
  isRegSearchDisabled:boolean =false;
  VLandedrate:any;
  VPurchaseRate:any;
  VMRP:any;
  VBatchNO:any;
  ItemList:any=[];
  
  public itemFilterCtrl: FormControl = new FormControl();
  public filteredItemList: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  

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
    this.getBatchAndAdjList();
    this.getItemList();

    this.itemFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterItem();
    });
  }
  createSearchFrom() {
    return this._formBuilder.group({
      StoreId: '',
      ItemID: '',
      BatchNO:'',
      MRP:'',
      BtachExpDate:'',
      PurchaseRate:'',
      NewExpDate:'',
      Landedrate:'',
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
  getBatchAndAdjList() {
    this.sIsLoading = 'loading-data';
   var vdata= {
     
     "StoreId": this.SearchGroup.get('StoreId').value.StoreId || 1,
      "ItemId":1       
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

  getItemList() {
    this._BatchAndExpDateAdjustmentService.getItemlist1().subscribe(data => {
      this.ItemList = data;
      this.filteredItemList.next(this.ItemList.slice());
    })

  }
  private filterItem() {

    if (!this.ItemList) {
      return;
    }
    // get the search keyword
    let search = this.itemFilterCtrl.value;
    if (!search) {
      this.filteredItemList.next(this.ItemList.slice());
      return;
    }
    else {
      search = search.toLowerCase();
    }
    // filter
    this.filteredItemList.next(
      this.ItemList.filter(bank => bank.ItemName.toLowerCase().indexOf(search) > -1)
    );
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

