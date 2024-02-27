import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class CurrentStockComponent implements OnInit {
  displayedColumns = [
    // 'action',
  
    'ToStoreName',
    'ItemName',
    'ReceivedQty',
    'IssueQty',
    'BalanceQty',
    // 'GenericName'
  ];
  displayedColumnsDayWise = [
    // 'action',
    'BatchNo',
    'BatchExpDate',
    'LedgerDate',
    'ItemName',
    'UnitMRP',
    'ReceivedQty',
    'IssueQty',
    'BalanceQty',
   
   
    
  ];
  displayedColumnsItemWise = [
  //  'action',
    'ItemName',
    'ConversionFactor',
    'Current_BalQty',
    'Received_Qty',
    'Sales_Qty',
    
  ];

  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  // isLoading = true;
  Store1List:any=[];
  screenFromString = 'admission-form';
  FromDate:any;
  Todate:any;
  SpinLoading:boolean=false;
  dsCurrentStock= new MatTableDataSource<CurrentStockList>();
  dsDaywiseStock= new MatTableDataSource<DayWiseStockList>();
  dsItemwiseStock= new MatTableDataSource<ItemWiseStockList>();
  printflag:boolean=false;
  
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  
  // @ViewChild(MatPaginator) paginator2: MatPaginator;

  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', { static: true }) public thirdPaginator: MatPaginator;

  constructor(
    public _CurrentStockService: CurrentStockService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
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
  gePharStoreList() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    }
    // console.log(vdata);
    this._CurrentStockService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
     // console.log(this.Store1List);
     this._CurrentStockService.SearchGroup.get('StoreId').setValue(this.Store1List[0]);
     this._CurrentStockService.userFormGroup.get('StoreId').setValue(this.Store1List[0]);
     this._CurrentStockService.ItemWiseFrom.get('StoreId').setValue(this.Store1List[0]);
    });
  }

  getCurrentStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemName":'%',
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
    }
      this._CurrentStockService.getCurrentStockList(vdata).subscribe(data => {
      this.dsCurrentStock.data = data as CurrentStockList[];
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
  getDayWiseStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
     "LedgerDate": this.datePipe.transform(this._CurrentStockService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "StoreId": this._loggedService.currentUserValue.user.storeId|| 1        
    }
    setTimeout(() => {
      this._CurrentStockService.getDayWiseStockList(vdata).subscribe(
        (Visit) => {
          this.dsDaywiseStock.data = Visit as DayWiseStockList[];
          this.dsDaywiseStock.sort = this.sort;
          this.dsDaywiseStock.paginator = this.thirdPaginator;
          this.sIsLoading = '';
          this.isLoadingStr = this.dsDaywiseStock.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
         this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);

 
  } 
  
  getItemWiseStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromDate":this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "StoreId": this._loggedService.currentUserValue.user.storeId|| 1        
    }
    setTimeout(() => {
      // this.isLoadingStr = 'loading';
      this._CurrentStockService.getItemWiseStockList(vdata).subscribe(
        (Visit) => {
          this.dsItemwiseStock.data = Visit as ItemWiseStockList[];
          this.dsItemwiseStock.sort = this.sort;
          this.dsItemwiseStock.paginator = this.secondPaginator;
          this.sIsLoading = '';
          this.isLoadingStr = this.dsItemwiseStock.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
           this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
   
   
  }


  @ViewChild('ItemWiseStockTemplate') ItemWiseStockTemplate: ElementRef;
  reportPrintObjList: ItemWiseStockList[] = [];
  printTemplate: any;
  reportPrintObj: ItemWiseStockList;
  reportPrintObjTax: ItemWiseStockList;
  subscriptionArr: Subscription[] = [];
 

  _loaderShow:boolean = true;
  exportItemReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ItemName', 'ConversionFactor', 'Current_BalQty', 'Received_Qty', 'Sales_Qty'];
    this.reportDownloadService.getExportJsonData(this.dsItemwiseStock.data, exportHeaders, 'ItemWise Report');
 
    this.dsItemwiseStock.data=[];
    this.sIsLoading = '';
  }

    
  exportDayReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['BatchNo', 'BatchExpDate','LedgerDate' ,'ItemName', 'UnitMRP', 'ReceivedQty', 'IssueQty', 'BalanceQty'];
    this.reportDownloadService.getExportJsonData(this.dsDaywiseStock.data, exportHeaders, 'Day Wise Report');
    this.dsDaywiseStock.data=[];
    this.sIsLoading = '';
  }

  exportCurrentStockReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['StoreName', 'ItemName', 'ReceivedQty', 'IssueQty', 'BalanceQty'];
    this.reportDownloadService.getExportJsonData(this.dsCurrentStock.data, exportHeaders, 'CurrentStock');
    this.dsCurrentStock.data=[];
    this.sIsLoading = '';
  }

  viewgetDaywisestockReportPdf() {
    this.sIsLoading == 'loading-data'
    let LedgerDate =  this.datePipe.transform(this._CurrentStockService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let StoreId =this._loggedService.currentUserValue.user.storeId || this._CurrentStockService.userFormGroup.get("StoreId").value.StoreId || 0
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._CurrentStockService.getDaywisestockview(
      LedgerDate,StoreId
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Day Wise Stock Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
     
    });
   
    },100);
  }

  
  viewgetCurrentstockReportPdf() {
    this.sIsLoading == 'loading-data'
    let ItemName = this._CurrentStockService.SearchGroup.get("ItemCategory").value + '%' || "%"
    let StoreId = this._loggedService.currentUserValue.user.storeId || this._CurrentStockService.SearchGroup.get("StoreId").value.StoreId || 0
    setTimeout(() => {
      this.SpinLoading =true;
   this._CurrentStockService.getCurrentstockview(
    StoreId, ItemName
    ).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Current Stock Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
       
    });
   
    },100);
  }

  
  viewgetItemwisestockReportPdf() {
    this.sIsLoading == 'loading-data'
    let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let todate =this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let StoreId = this._loggedService.currentUserValue.user.storeId || this._CurrentStockService.ItemWiseFrom.get("StoreId").value.StoreId || 0
    setTimeout(() => {
    this.SpinLoading =true;
    //  this.AdList=true;
    this._CurrentStockService.getItemwisestockview(FromDate,todate,StoreId).subscribe(res => {
      const dialogRef = this._matDialog.open(PdfviewerComponent,
        {
          maxWidth: "95vw",
          height: '850px',
          width: '100%',
          data: {
            base64: res["base64"] as string,
            title: "Item Wise Current Stock Viewer"
          }
        });
        dialogRef.afterClosed().subscribe(result => {
          this.sIsLoading = '';
        });
    });
    },1000);
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
 
export class DayWiseStockList {
 
  ItemName:string;
  ToStoreName:string;
  IssueQty: Number;
  BalanceQty:number;
  ReceivedQty: number;
  BatchNo: Number;
  BatchExpDate:number;
  UnitMRP: number;
  LedgerDate:any;
  constructor(DayWiseStockList) {
    {
      this.IssueQty = DayWiseStockList.IssueQty || 0;
      this.ReceivedQty = DayWiseStockList.ReceivedQty || 0;
      this.ItemName = DayWiseStockList.ItemName || "";
      this.ToStoreName = DayWiseStockList.ToStoreName || "";
      this.BalanceQty = DayWiseStockList.BalanceQty || 0;
      this.BatchNo = DayWiseStockList.BatchNo || 0;
      this.BatchExpDate = DayWiseStockList.BatchExpDate || 0;
      this.UnitMRP = DayWiseStockList.UnitMRP || 0;
      this.LedgerDate = DayWiseStockList.LedgerDate || 0;  
    }
  }
}
export class ItemWiseStockList {
 
  ItemName:string;
  ToStoreName:string;
  IssueQty: Number;
  BalanceQty:number;
  ReceivedQty: number;
  BatchNo: Number;
  BatchExpDate:number;
  UnitMRP: number;
  LedgerDate:any;
  constructor(ItemWiseStockList) {
    {
      this.IssueQty = ItemWiseStockList.IssueQty || 0;
      this.ReceivedQty = ItemWiseStockList.ReceivedQty || 0;
      this.ItemName = ItemWiseStockList.ItemName || "";
      this.ToStoreName = ItemWiseStockList.ToStoreName || "";
      this.BalanceQty = ItemWiseStockList.BalanceQty || 0;
      this.BatchNo = ItemWiseStockList.BatchNo || 0;
      this.BatchExpDate = ItemWiseStockList.BatchExpDate || 0;
      this.UnitMRP = ItemWiseStockList.UnitMRP || 0;
      this.LedgerDate = ItemWiseStockList.LedgerDate || 0; 
    }
  }
}

