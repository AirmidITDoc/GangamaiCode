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
  Itemlist:any=[];
 

  displayedColumns1 = [
    'ItemId',
   'ItemName',
   'BalanceQty',
   
  //  'action',
  ];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  datasource =new MatTableDataSource<IndentList>();

  constructor(
    public _IndentID: SalesService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.getItemList();
    this.getIndentStoreList();
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }

 
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
        this.dateTimeObj = dateTimeObj;
  }



  getItemList(){
    
    var Param = {
      "ItemName": this._IndentID.IndentSearchGroup.get('ItemName').value + '%' || '%',
      "StoreId":this._IndentID.IndentSearchGroup.get('FromStoreId').value.StoreId || 0
    }
      this._IndentID.getItemList(Param).subscribe(data => {
      this.datasource.data = data as IndentList[];
      console.log(data)
      this.datasource.sort = this.sort;
      this.datasource.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  getIndentStoreList(){
    debugger
   
        this._IndentID.getStoreFromList().subscribe(data => {
          this.Store1List = data;
          this._IndentID.IndentSearchGroup.get('FromStoreId').setValue(this.Store1List[0]);
        });

       }

  onClear(){
    this._IndentID.IndentSearchGroup.get('ItemName').reset("")
  }
}

export class IndentList {
  ItemId:any;
  ItemName: string;
  BalanceQty: number;
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
      this.BalanceQty = IndentList.BalanceQty || 0;
      this.IssQty = IndentList.IssQty || 0;
      this.Bal = IndentList.Bal|| 0;
      this.StoreId = IndentList.StoreId || 0;
      this.StoreName =IndentList.StoreName || '';
    }
  }
}


