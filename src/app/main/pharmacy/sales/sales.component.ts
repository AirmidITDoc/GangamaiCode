import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { SalesService } from './sales.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from './sale-popup/sale-popup.component';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class SalesComponent implements OnInit {

  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';
  filteredOptions: any;
  noOptionFound: boolean = false;
  labelPosition: 'before' | 'after' = 'after';
  isItemIdSelected: boolean = false;
  dsIndentID = new MatTableDataSource<IndentID>();

  ItemName:any;
  ItemId:any;
  BalanceQty:any;

  dsIndentList = new MatTableDataSource<IndentList>();
  datasource= new MatTableDataSource<IndentList>();
  saleSelectedDatasource = new MatTableDataSource<IndentList>();

  displayedColumns = [
    'FromStoreId',
    'IndentNo',
    'IndentDate',
    'FromStoreName',
    'ToStoreName',
    'Addedby',
    'IsInchargeVerify',
    'action',
  ];

  displayedColumns1 = [
   'ItemName',
   'Qty',
   'IssQty',
   'Bal',
  ];

  selectedSaleDisplayedCol = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'BalanceQty',
    'MRP',
   ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _IndentID: SalesService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getIndentStoreList();
    this.getIndentID();
    
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }

  

  getIndentID() {
    // this.sIsLoading = 'loading-data';
    var Param = {
      
      "ToStoreId": this._IndentID.IndentSearchGroup.get('ToStoreId').value.StoreId || 1,
       "From_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "To_Dt": this.datePipe.transform(this._IndentID.IndentSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
       "Status": 1//this._IndentID.IndentSearchGroup.get("Status").value || 1,
    }
      this._IndentID.getIndentID(Param).subscribe(data => {
      this.dsIndentID.data = data as IndentID[];
      console.log(this.dsIndentID.data)
      this.dsIndentID.sort = this.sort;
      this.dsIndentID.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getIndentList(Params){
    // this.sIsLoading = 'loading-data';
    var Param = {
      "IndentId": Params.IndentId
    }
      this._IndentID.getIndentList(Param).subscribe(data => {
      this.dsIndentList.data = data as IndentList[];
      this.dsIndentList.sort = this.sort;
      this.dsIndentList.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }

  getSearchList(){
    debugger

    var m_data = {
      "ItemName": `${this._IndentID.IndentSearchGroup.get('ItemId').value}%`,
      "StoreId":12
    }
 
      this._IndentID.getItemList(m_data).subscribe(data => {
      
          this.filteredOptions = data;
          console.log(data);
          if (this.filteredOptions.length == 0) {
            this.noOptionFound = true;
          } else {
            this.noOptionFound = false;
          }
  
        });
  }

  getOptionText(option) {
    if (!option) return '';
    return option.ItemId + ' ' + option.ItemName + ' (' + option.BalanceQty + ')';
  }

  getSelectedObj(obj) {
    debugger
    // this.registerObj = obj;
    this.ItemName = obj.ItemName;
    this.ItemId = obj.ItemId;
    this.BalanceQty = obj.BalanceQty;
    Swal.fire("Selected", this.ItemId + '/' + this.ItemName + '/' + this.BalanceQty);
  }

  
  onclickrow(contact){
    Swal.fire("Row selected :" + contact)
  }
  getIndentStoreList(){
    debugger
   
        this._IndentID.getStoreFromList().subscribe(data => {
          this.Store1List = data;
          // this._IndentID.hospitalFormGroup.get('TariffId').setValue(this.TariffList[0]);
        });

       }

  onClear(){
    
  }

  getBatch() {
    const dialogRef = this._matDialog.open(SalePopupComponent,
      {
        maxWidth: "700px",
        minWidth: '700px',
        width: '700px',
        height: '500px',
        disableClose: true,
        data: {
          "ItemId": this._IndentID.IndentSearchGroup.get('FromStoreId').value.StoreId,
          "StoreId": 2// this._IndentID.IndentSearchGroup.get('ToStoreId').value.StoreId
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.saleSelectedDatasource.data = [];
      this.saleSelectedDatasource.data = [result];// as IndentList[];
    });
  }
}

export class IndentList {
  ItemId:any;
  ItemName: string;
  BatchNo: string;
  BatchExpDate: any;
  BalanceQty:any;
  UnitMRP: any;
  Qty: number;
  IssQty:number;
  Bal:number;
  StoreId:any;
  StoreName:any;
  /**
   * Constructor
   *
   * @param IndentList
   */
  constructor(IndentList) {
    {
      this.ItemId = IndentList.ItemId || 0;
      this.ItemName = IndentList.ItemName || "";
      this.BatchNo = IndentList.BatchNo || "";
      this.BatchExpDate = IndentList.BatchExpDate || "";
      this.UnitMRP = IndentList.UnitMRP || "";
      this.ItemName = IndentList.ItemName || "";
      this.Qty = IndentList.Qty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal|| 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName =IndentList.StoreName || '';
    }
  }
}
export class IndentID {
  IndentNo: Number;
  IndentDate: number;
  FromStoreName:string;
  ToStoreName:string;
  Addedby:number;
  IsInchargeVerify: string;
  IndentId:any;
  FromStoreId:boolean;
  
  /**
   * Constructor
   *
   * @param IndentID
   */
  constructor(IndentID) {
    {
      this.IndentNo = IndentID.IndentNo || 0;
      this.IndentDate = IndentID.IndentDate || 0;
      this.FromStoreName = IndentID.FromStoreName || "";
      this.ToStoreName = IndentID.ToStoreName || "";
      this.Addedby = IndentID.Addedby || 0;
      this.IsInchargeVerify = IndentID.IsInchargeVerify || "";
      this.IndentId = IndentID.IndentId || "";
      this.FromStoreId = IndentID.FromStoreId || "";
    }
  }
}

