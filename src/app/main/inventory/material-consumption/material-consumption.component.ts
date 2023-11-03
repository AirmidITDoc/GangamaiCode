import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { MaterialConsumptionService } from './material-consumption.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-material-consumption',
  templateUrl: './material-consumption.component.html',
  styleUrls: ['./material-consumption.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MaterialConsumptionComponent implements OnInit {
  displayedColumns = [
    'action',
    'Date',
    'FromStoreName',
    'PurchaseTotalAmount',
    'TotalVatAmount',
    'Remark',
    'Addedby',
  ];
  displayedNewMaterialList = [
    'ItemName',
    'BatchNo',
    'ExpDate',
    'BalQty',
    'UsedQty',
    'Rate',
    'TotalAmount',
    'Remark',
    'StkId'
  ];

  
  StoreList: any = [];
  screenFromString = 'admission-form';
  sIsLoading: string = '';
  isLoading = true;
  filteredOptions: any;
  showAutocomplete = false;
  noOptionFound: boolean = false;
  ItemName:any;
  filteredOptionsItem:any;
  isItemIdSelected:boolean = false;
  ItemId: any;
  
  dsMaterialConLList = new MatTableDataSource<MaterialConList>();

  dsNewMaterialConList = new MatTableDataSource<NewMaterialList>();


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _MaterialConsumptionService: MaterialConsumptionService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
   this. gePharStoreList();
    // this.getMaterialConList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

 
  getMaterialConList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ToStoreId": this._MaterialConsumptionService.SearchGroup.get('StoreId').value.storeid || 1,
       "From_Dt": this.datePipe.transform(this._MaterialConsumptionService.SearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._MaterialConsumptionService.SearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
 
    }
    console.log(vdata);
      this._MaterialConsumptionService.getMaterialConList(vdata).subscribe(data => {
      this.dsMaterialConLList.data = data as MaterialConList[];
      this.dsMaterialConLList.sort = this.sort;
      this.dsMaterialConLList.paginator = this.paginator;
      this.sIsLoading = '';
      console.log(this.dsMaterialConLList.data)
    },
    error => {
      this.sIsLoading = '';
    });
  }

  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    console.log(vdata);
    this._MaterialConsumptionService.getLoggedStoreList(vdata).subscribe(data => {
      this.StoreList = data;
      console.log(this.StoreList);
      this._MaterialConsumptionService.SearchGroup.get('StoreId').setValue(this.StoreList[0]);
      this._MaterialConsumptionService.userFormGroup.get('FromStoreId').setValue(this.StoreList[0]);
    });
  }

 
  
  getSearchItemList() {
    var m_data = {
      "ItemName": `${this._MaterialConsumptionService.userFormGroup.get('ItemID').value}%`
      // "ItemID": 1//this._IssueToDep.userFormGroup.get('ItemID').value.ItemID || 0 
    }
    // console.log(m_data);
    if (this._MaterialConsumptionService.userFormGroup.get('ItemID').value.length >= 2) {
      this._MaterialConsumptionService.getItemlist(m_data).subscribe(data => {
        this.filteredOptionsItem = data;
        // console.log(this.filteredOptionsItem.data);
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
   // console.log(obj);
 
  }


 
}

export class NewMaterialList {
  ItemName: string;
  BatchNo: number;
  ExpDate:number;
  BalQty:number;
  UsedQty:any;
  Rate:any;
  TotalAmount:any;
  Remark:any;
  StkId:any;
 
  constructor(NewMaterialList) {
    {
      this.ItemName = NewMaterialList.ItemName || "";
      this.BatchNo = NewMaterialList.BatchNo || 0;
      this.ExpDate = NewMaterialList.ExpDate || 0;
      this.BalQty = NewMaterialList.BalQty|| 0;
      this.UsedQty = NewMaterialList.UsedQty || 0;
      this.Rate =NewMaterialList.Rate || 0;
      this.TotalAmount = NewMaterialList.TotalAmount|| 0;
      this.Remark = NewMaterialList.Remark || ' ';
      this.StkId =NewMaterialList.StkId || 0;
    }
  }
}
export class MaterialConList {
  Date: Number;
  FromStoreName:string;
  PurchaseTotalAmount: number;
  TotalVatAmount:any;
  Addedby:number;
  Remark:any;
  
  constructor(MaterialConList) {
    {
      this.Date = MaterialConList.Date || 0;
      this.PurchaseTotalAmount = MaterialConList.PurchaseTotalAmount || 0;
      this.FromStoreName = MaterialConList.FromStoreName || "";
      this.TotalVatAmount = MaterialConList.TotalVatAmount || 0;
      this.Addedby = MaterialConList.Addedby || 0;
      this.Remark = MaterialConList.Remark || "";
 
    }
  }
}

