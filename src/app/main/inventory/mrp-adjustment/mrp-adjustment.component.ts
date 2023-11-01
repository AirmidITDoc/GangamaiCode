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
  isLoading = true;
  StoreList:any=[];
  screenFromString = 'admission-form';
  ItemList:any=[];
  VBatchNO:any;
  VMRP:any;
  VLandedrate:any;
  VPurchaseRate:any;
  VBarCodeNo:any;
  VQty:any;
  
  dsMrpAdjList = new MatTableDataSource<MrpAdjList>();
 

  public itemFilterCtrl: FormControl = new FormControl();
  public filteredItemList: ReplaySubject<any> = new ReplaySubject<any>(1);
  private _onDestroy = new Subject<void>();
  

  constructor(
    public _MrpAdjustmentService: MrpAdjustmentService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    private _loggedService: AuthenticationService
    
  ) { }

  ngOnInit(): void {
    
    this.getMRPAdjList();
    this.getItemList();
    this.gePharStoreList();

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

  getMRPAdjList() {
     this.sIsLoading = 'loading-data';
    var vdata= {
      
      "StoreId": this._MrpAdjustmentService.userFormGroup.get('StoreId').value.StoreId || 1,
       "ItemId":1       
    }
    console.log(vdata);
      this._MrpAdjustmentService.getMRPAdjustList(vdata).subscribe(data => {
      this.dsMrpAdjList.data = data as MrpAdjList[];
      this.dsMrpAdjList.sort = this.sort;
      this.dsMrpAdjList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsMrpAdjList.data);
    },
      error => {
        this.sIsLoading = '';
      });
  }
  
onclickrow(contact){
Swal.fire("Row selected :" + contact)
}

gePharStoreList() {
  var vdata = {
    Id: this._loggedService.currentUserValue.user.storeId
  }
  console.log(vdata);
  this._MrpAdjustmentService.getLoggedStoreList(vdata).subscribe(data => {
    this.StoreList = data;
    console.log(this.StoreList);
    this._MrpAdjustmentService.userFormGroup.get('StoreId').setValue(this.StoreList[0]);
  });
}

  
 
  
  getItemList() {
    this._MrpAdjustmentService.getItemlist1().subscribe(data => {
      this.ItemList = data;
     // console.log(this.ItemList);
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
  
  noOptionFound: boolean = false;
  isItemIdSelected: boolean = false;
  registerObj = new RegInsert({});
 
  filteredOptions: any;
  ItemListfilteredOptions: any;
   isItemSearchDisabled: boolean;
   ItemName: any;
   ItemId: any;
  registration: any;

  getSearchList() {
    var m_data = {
      "ItemName": `${this._MrpAdjustmentService.userFormGroup.get('ItemID').value}%`
      // "ItemID":0
    }
    console.log(m_data);
    if (this._MrpAdjustmentService.userFormGroup.get('ItemID').value.length >= 1) {
      this._MrpAdjustmentService.getRegistrationList(m_data).subscribe(resData => {
        this.filteredOptions = resData;
        console.log( this.filteredOptions.resData)
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


  // getOptionTextPatientName(option) {
  //   return option && option.ItemName ? option.ItemName : '';
  // }
  
  // getOptionTextRegNo(option) {
  //   return option && option.ItemName ? option.ItemID : '';
  // }
  onEdit(row) {
    console.log(row);

    this.registerObj = row;
    this.getSelectedObj(row);
  }

  getSelectedObj(obj) {
    
    // debugger
    this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId= obj.ItemID;
    console.log(obj);
  }

  onChangeReg(event) {
    if (event.value == 'registration') {
      this.registerObj = new RegInsert({});
      this._MrpAdjustmentService.userFormGroup.get('ItemID').disable();
    }
    else {
      this.isItemSearchDisabled = false;
    }
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