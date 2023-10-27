import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { CurrentStockService } from './current-stock.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class CurrentStockComponent implements OnInit {
  displayedColumns = [
    'action',
    'ToStoreName',
    'ItemName',
    'ReceivedQty',
    'IssueQty',
    'BalanceQty',
    'GenericName'
  ];

  sIsLoading: string = '';
  isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';

 
  
  dsCurrentStock= new MatTableDataSource<CurrentStockList>();

  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private _loggedService: AuthenticationService,
    private accountService: AuthenticationService,
    
  ) { }

  ngOnInit(): void {
    this.gePharStoreList();
    
  }
  
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  dateTimeObj: any;
  getDateTime(dateTimeObj) {
    // console.log('dateTimeObj==', dateTimeObj);
    this.dateTimeObj = dateTimeObj;
  }
 

  

  getCurrentStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemName":'%',
      "IsNarcotic":this._CurrentStockService.SearchGroup.get('IsDeleted').value || 0,
      "ish1Drug":this._CurrentStockService.SearchGroup.get('IsDeleted').value || 0,
      "isScheduleH":this._CurrentStockService.SearchGroup.get('IsDeleted').value || 0,
      "IsHighRisk":this._CurrentStockService.SearchGroup.get('IsDeleted').value || 0,
      "IsScheduleX":this._CurrentStockService.SearchGroup.get('IsDeleted').value || 0,
      "ItemCategaryId":this._CurrentStockService.SearchGroup.get('ItemCategory').value.ItemCategaryId || 1,
      "StoreId": this._CurrentStockService.SearchGroup.get('StoreId').value.StoreId || 1,
      //  "From_Dt": this.datePipe.transform(this._CurrentStockService.SearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      //  "To_Dt": this.datePipe.transform(this._CurrentStockService.SearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        
    }
    console.log(vdata);
      this._CurrentStockService.getCurrentStockList(vdata).subscribe(data => {
      this.dsCurrentStock.data = data as CurrentStockList[];
      console.log(this.dsCurrentStock.data)
      this.dsCurrentStock.sort = this.sort;
      this.dsCurrentStock.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }  
 
  onClear(){

    this._CurrentStockService.SearchGroup.get('start').reset();
    this._CurrentStockService.SearchGroup.get('end').reset();
    this._CurrentStockService.SearchGroup.get('StoreId').reset();
    this._CurrentStockService.SearchGroup.get('IsDeleted').reset();
    this._CurrentStockService.SearchGroup.get('ItemCategory').reset();
    
  }
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    // console.log(vdata);
    this._CurrentStockService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
      // console.log(this.StoreList);
      this._CurrentStockService.SearchGroup.get('StoreId').setValue(this.Store1List[0]);
    });
  }
}
 
export class CurrentStockList {
  IssueQty: Number;
  ReceivedQty: number;
  ItemName:string;
  ToStoreName:string;
  BalanceQty:number;
  GenericName: string;
  

  constructor(CurrentStockList) {
    {
      this.IssueQty = CurrentStockList.IssueQty || 0;
      this.ReceivedQty = CurrentStockList.ReceivedQty || 0;
      this.ItemName = CurrentStockList.ItemName || "";
      this.ToStoreName = CurrentStockList.ToStoreName || "";
      this.BalanceQty = CurrentStockList.BalanceQty || 0;
      this.GenericName = CurrentStockList.GenericName || "";
       
    }
  }
}

