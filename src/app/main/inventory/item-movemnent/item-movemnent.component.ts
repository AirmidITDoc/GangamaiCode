import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ItemMovemnentService } from './item-movemnent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-item-movemnent',
  templateUrl: './item-movemnent.component.html',
  styleUrls: ['./item-movemnent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class ItemMovemnentComponent implements OnInit {
  displayedColumns = [
    'No',
    'Date',
    'TransactionType',
    'FromStoreName',
    'DocNo',
    'ItemName',
    'BatchNO',
    'RQty',
    'IQty',
    'BalQty'
  ]

  hasSelectedContacts: boolean;
  Store1List: any = [];
  ItemList: any = [];
  StoreList: any = []; 
  sIsLoading: string = '';
  isLoading = true;
  isItemSelected:boolean=false;


 
  dsItemMovement = new MatTableDataSource<ItemMovementList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _ItemMovemnentService: ItemMovemnentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe,
 
  ) { }

  public ItemNameFilterCtrl: FormControl = new FormControl();
  public filteredItem: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();

  ngOnInit(): void {
    this.getTOStoreList();
    // this.getItemMovement();
     this.gePharStoreList();
    //  this.getFormStoreList();
   
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  getItemMovementList() {

    debugger
    this.sIsLoading = 'loading-data';
    var vdata = {

      "ToStoreId": this._ItemMovemnentService.ItemSearchGroup.get('ToStoreId').value.StoreId || 0,
      "FromDate": this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "ToDate": this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "FromStoreID": this._ItemMovemnentService.ItemSearchGroup.get('StoreId').value.storeid || 1,
      'ItemId': this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value.ItemID || 0
    }
    console.log(vdata);
    this._ItemMovemnentService.getItemMovementList(vdata).subscribe(data => {
      this.dsItemMovement.data = data as ItemMovementList[];
      this.dsItemMovement.sort = this.sort;
      this.dsItemMovement.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsItemMovement.data);
    },
    error => {
      this.sIsLoading = '';
    });
  }
 
  getTOStoreList() {
    this._ItemMovemnentService.getToStoreFromList().subscribe(data => {
      this.Store1List = data;
      // console.log(this.Store1List);
     });
  }
  
filteredOptions:any;
ItemListfilteredOptions:any;
noOptionFound:boolean=false;
  getStockItemList() {
    var m_data = {
      "ItemName": `${this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value}%` 
    }
    if (this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value.length >= 1) {
      this._ItemMovemnentService.getItemFormList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log(this.filteredOptions)
        this.ItemListfilteredOptions = resData;
        if (this.filteredOptions.length == 0) {
          this.noOptionFound = true;
        } else {
          this.noOptionFound = false;
        }
      });
    }
  }
  getOptionTextItemList(option) {
    if (!option) return '';
    return option.ItemName;
    }
  // getFormStoreList() {
  //   this._ItemMovemnentService.getFormStoreFormList().subscribe(data => {
  //     this.FormStore = data;
  //     // console.log(this.FormStore);
      
  //   });
  // }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    // console.log(vdata);
    this._ItemMovemnentService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      // console.log(this.StoreList);
      this._ItemMovemnentService.ItemSearchGroup.get('StoreId').setValue(this.StoreList[0]);
    });
  }
  
}


export class ItemMovementList {
  No: Number;
  Date: number;
  TransactionType: any;
  FromStoreName: any;
  DocNo: any;
  ItemName: any;
  BatchNO: any;
  RQty: any;
  IQty: any;
  BalQty: any;
  

  constructor(ItemMovementList) {
    {
      this.No = ItemMovementList.No || 0;
      this.Date = ItemMovementList.Date || 0;
      this.TransactionType = ItemMovementList.TransactionType || " ";
      this.FromStoreName = ItemMovementList.FromStoreName || "";
      this.DocNo = ItemMovementList.DocNo || 0;
      this.ItemName = ItemMovementList.ItemName || " ";
      this.BatchNO = ItemMovementList.BatchNO || 0;
      this.RQty = ItemMovementList.RQty || 0;
      this.IQty = ItemMovementList.IQty || 0;
      this.BalQty = ItemMovementList.BalQty || 0;
    }
  }
}

