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
  ItemList:any=[];
  screenFromString = 'admission-form';
  VQty:any;
  VBatchNO:any;

  
  dsStockAdjList = new MatTableDataSource<StockAdjList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  
  public itemFilterCtrl: FormControl = new FormControl();
  public filteredItemList: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  constructor(
    public _StockAdjustment: StockAdjustmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
   
    
  ) { }

  ngOnInit(): void {
    this.getMRPAdjList() ;
    this.gePharStoreList();
    this.getItemList();

    this.itemFilterCtrl.valueChanges
    .pipe(takeUntil(this._onDestroy))
    .subscribe(() => {
      this.filterItem();
    });
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
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

  
  getMRPAdjList() {
    this.sIsLoading = 'loading-data';
   var vdata= {
     
     "StoreId": this._StockAdjustment.userFormGroup.get('StoreId').value.StoreId || 1,
      "ItemId":1       
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

getItemList() {
  this._StockAdjustment.getItemlist1().subscribe(data => {
    this.ItemList = data;
    console.log(this.ItemList);
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