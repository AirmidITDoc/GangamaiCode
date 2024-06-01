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
import { Observable, Subscription } from 'rxjs';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { map, startWith } from 'rxjs/operators';
import { ItemMovementSummeryComponent } from './item-movement-summery/item-movement-summery.component';
import { IssueSummeryComponent } from './issue-summery/issue-summery.component';
import { SalesSummeryComponent } from './sales-summery/sales-summery.component';
import { SalesReturnSummeryComponent } from './sales-return-summery/sales-return-summery.component';

@Component({
  selector: 'app-current-stock',
  templateUrl: './current-stock.component.html',
  styleUrls: ['./current-stock.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class CurrentStockComponent implements OnInit {
  isStoreSelected: boolean = false;
  filteredOptionsStorename: Observable<string[]>;
  
  displayedColumns = [
    // 'action',
  
    //'ToStoreName',
    'ItemName',
    'ReceivedQty',
    'IssueQty',
    'BalanceQty',
    'ReturnQty'
  ];
  displayedColumnsDayWise = [
    'LedgerDate',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'UnitMRP',
    'PurUnitRate',
    'LandedRate',
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

  displayedColumnsIssueWiseItem = [
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
  isItemSelected:boolean=false;

  dsCurrentStock= new MatTableDataSource<CurrentStockList>();
  dsDaywiseStock= new MatTableDataSource<DayWiseStockList>();
  dsItemwiseStock= new MatTableDataSource<ItemWiseStockList>();
  dsIssuewissueItemStock= new MatTableDataSource<ItemWiseStockList>();
  printflag:boolean=false;
  
  @ViewChild(MatSort) sort: MatSort;
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
    //this.getCrrentStkItemSearchList();
    
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
     this._CurrentStockService.PurchaseItem.get('StoreId').setValue(this.Store1List[0]);
    });
  }


  StoreId:any;
  gePharStoreList1() {
    var vdata = {
      Id: this._loggedService.currentUserValue.user.storeId
    } 
  this._CurrentStockService.getLoggedStoreList(vdata).subscribe(data => {
    this.Store1List = data;
    // if (this.data) {
      const ddValue = this.Store1List.filter(c => c.StoreId == this.StoreId);
      this._CurrentStockService.ItemWiseFrom.get('StoreId').setValue(ddValue[0]);
    this._CurrentStockService.ItemWiseFrom.updateValueAndValidity();
      return;
    // } 
  });
  
}


private _filterStore(value: any): string[] {
  if (value) {
    const filterValue = value && value.StoreName ? value.StoreName.toLowerCase() : value.toLowerCase();

    return this.Store1List.filter(option => option.StoreName.toLowerCase().includes(filterValue));
  }
}
getOptionTextStoreName(option) {
  return option && option.StoreName ? option.StoreName : '';
}
filteredOptions:any;
ItemListfilteredOptions:any;
noOptionFound:boolean=false;
DaywiseItemListfilteredOptions:any;
ItemwiseItemListfilteredOptions:any;
IssuewiseItemListfilteredOptions:any;

getStockItemList() {
  var m_data = {
    "ItemName": `${this._CurrentStockService.SearchGroup.get('ItemCategory').value}%` 
  }
  if (this._CurrentStockService.SearchGroup.get('ItemCategory').value.length >= 1) {
    this._CurrentStockService.getItemFormList(m_data).subscribe(resData => {
      this.filteredOptions = resData;
      this.ItemListfilteredOptions = resData;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
}
getDaywiseStockItemList() {
  var m_data = {
    "ItemName": `${this._CurrentStockService.userFormGroup.get('ItemCategory').value}%` 
  }
  if (this._CurrentStockService.userFormGroup.get('ItemCategory').value.length >= 1) {
    this._CurrentStockService.getItemFormList(m_data).subscribe(resData => {
      this.filteredOptions = resData;
      this.DaywiseItemListfilteredOptions = resData;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
}
getitemwiseStockItemList() {
  var m_data = {
    "ItemName": `${this._CurrentStockService.ItemWiseFrom.get('ItemCategory').value}%` 
  }
  if (this._CurrentStockService.ItemWiseFrom.get('ItemCategory').value.length >= 1) {
    this._CurrentStockService.getItemFormList(m_data).subscribe(resData => {
      this.filteredOptions = resData;
      this.ItemwiseItemListfilteredOptions = resData;
      if (this.filteredOptions.length == 0) {
        this.noOptionFound = true;
      } else {
        this.noOptionFound = false;
      }
    });
  }
}
getissuwiseStockItemList() {
  var m_data = {
    "ItemName": `${this._CurrentStockService.PurchaseItem.get('ItemCategory').value}%` 
  }
  if (this._CurrentStockService.PurchaseItem.get('ItemCategory').value.length >= 1) {
    this._CurrentStockService.getItemFormList(m_data).subscribe(resData => {
      this.filteredOptions = resData;
      this.IssuewiseItemListfilteredOptions = resData;
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
getOptionTextDaywiseItemList(option) {
  if (!option) return '';
  return option.ItemName;
}
getOptionTextItemwiseItemList(option) {
  if (!option) return '';
  return option.ItemName;
}
getOptionTextPurchaseItemList(option) {
  if (!option) return '';
  return option.ItemName;
}


  getCurrentStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
      "ItemName": this._CurrentStockService.SearchGroup.get('ItemCategory').value.ItemName || '%',
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
    }
    console.log(vdata)
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
     "StoreId": this._loggedService.currentUserValue.user.storeId || 0   ,
     "ItemId":this._CurrentStockService.userFormGroup.get('ItemCategory').value.ItemID || 0,   
    }
    setTimeout(() => {
      this._CurrentStockService.getDayWiseStockList(vdata).subscribe(
        (Visit) => {
          this.dsDaywiseStock.data = Visit as DayWiseStockList[];
          console.log(this.dsDaywiseStock.data)
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
     "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
     "ItemId": this._CurrentStockService.ItemWiseFrom.get('ItemCategory').value.ItemID || 0 
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
   
  getIssueWiseItemStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromDate":this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "StoreId": this._loggedService.currentUserValue.user.storeId || 0,
      "ItemId": this._CurrentStockService.PurchaseItem.get('ItemCategory').value.ItemID || 0
    }
    setTimeout(() => {
      this._CurrentStockService.getIssueWiseItemStockList(vdata).subscribe(
        (Visit) => {
          this.dsIssuewissueItemStock.data = Visit as ItemWiseStockList[];
          this.dsIssuewissueItemStock.sort = this.sort;
          this.dsIssuewissueItemStock.paginator = this.secondPaginator;
          this.sIsLoading = '';
          this.isLoadingStr = this.dsIssuewissueItemStock.data.length == 0 ? 'no-data' : '';
        },
        (error) => {
           this.isLoadingStr = 'no-data';
        }
      );
    }, 1000);
   
   
  }
  getItemdetails(contact){
    //console.log(contact)
    const dialogRef = this._matDialog.open(ItemMovementSummeryComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '85%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCurrentStockList();
    });
  }
  getIssueSummery(contact){
    //console.log(contact)
    const dialogRef = this._matDialog.open(IssueSummeryComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '85%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCurrentStockList();
    });
  }
  getSalesSummery(contact){
    //console.log(contact)
    const dialogRef = this._matDialog.open(SalesSummeryComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '85%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCurrentStockList();
    });
  }
  getSalesReturnSummery(contact){
    //console.log(contact)
    const dialogRef = this._matDialog.open(SalesReturnSummeryComponent,
      {
        maxWidth: "100%",
        height: '85%',
        width: '85%',
        data: {
          Obj: contact
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      this.getCurrentStockList();
    });
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
    let exportHeaders = ['LedgerDate','ItemName','BatchNo','BalanceQty','ReceivedQty', 'IssueQty','UnitMRP','PurUnitRate','LandedRate','VatPercentage'];
    this.reportDownloadService.getExportJsonData(this.dsDaywiseStock.data, exportHeaders, 'Day Wise Report');
    this.dsDaywiseStock.data=[];
    this.sIsLoading = '';
  }

  exportCurrentStockReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ItemName', 'ReceivedQty', 'IssueQty', 'BalanceQty','ReturnQty'];
    this.reportDownloadService.getExportJsonData(this.dsCurrentStock.data, exportHeaders, 'CurrentStock');
    console.log(this.dsCurrentStock.data)
    this.dsCurrentStock.data=[];
    this.sIsLoading = '';
  }


  exportIssuewiseItemReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['StoreName', 'ItemName', 'Received_Qty', 'Sales_Qty', 'Current_BalQty'];
    this.reportDownloadService.getExportJsonData(this.dsIssuewissueItemStock.data, exportHeaders, 'Issuw Wise Item Stock');
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


  viewgetItemWisePurchaseReportPdf() {
    this.sIsLoading == 'loading-data'
    let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let todate =this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let StoreId =this._loggedService.currentUserValue.user.storeId || this._CurrentStockService.userFormGroup.get("StoreId").value.StoreId || 0
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._CurrentStockService.ItemWisePurchaseView(
      FromDate,todate,StoreId
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

