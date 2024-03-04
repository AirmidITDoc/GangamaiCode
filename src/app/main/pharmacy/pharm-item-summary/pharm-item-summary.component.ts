import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { PharmaitemsummaryService } from './pharmaitemsummary.service';
import { MatDialog } from '@angular/material/dialog';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { fuseAnimations } from '@fuse/animations';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-pharm-item-summary',
  templateUrl: './pharm-item-summary.component.html',
  styleUrls: ['./pharm-item-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PharmItemSummaryComponent implements OnInit {
  Itemflag:boolean=false;
  searchFormGroup: FormGroup;

  displayedColumns = [
    // 'action',
  
    'ItemName',
    'DaySales',
    'BatchExpDate',
    'BalanceQty',
    'LastSalesDate',
    // 'BalanceQty',
    // 'GenericName'
  ];
  displayedColumns1 = [
    // 'action',
    
    'ItemName',
    'DaySales',
    'BalanceQty',
    'LastSalesDate',
   
    
  ];
  displayedColumnsItemWise = [
  //  'action',
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'BalanceQty',
    // 'Sales_Qty',
    
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
  dsNonMovItemWithexpdate= new MatTableDataSource<Itemmovment>();
  dsNonMovItemWithoutexpdate= new MatTableDataSource<Itemmovment>();
  dsItemExpdatewiseStock= new MatTableDataSource<ItemWiseStockList>();
  printflag:boolean=false;
  
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  
  // @ViewChild(MatPaginator) paginator2: MatPaginator;

  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', { static: true }) public thirdPaginator: MatPaginator;

  constructor(
    public _PharmaitemsummaryService: PharmaitemsummaryService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    // private _loggedService: Authenticatio
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
    
  ) { 
    
  }

  ngOnInit(): void {
    this.gePharStoreList();

    this.geItemWithbatchexpList();
    this.searchFormGroup = this.createSearchForm();
 
  }
  
  createSearchForm() {
    return this.formBuilder.group({
      BatchRadio: ['Batch'],
    
    });
  }


  onChangeReg(event) {
    if (event.value == 'Batch') {
      this.Itemflag=true;
    }
  }

  getItemList(){
    if(this.searchFormGroup.get("BatchRadio").value == 'Batch'){
      this.geItemWithbatchexpList();
    }else if(this.searchFormGroup.get("BatchRadio").value == 'NoBatch'){
      this.geItemWithoutbatchexpList();
    }

  }

 gePharStoreList() {
    var vdata = {
      Id: this.accountService.currentUserValue.user.storeId
    }
    // console.log(vdata);
    this._PharmaitemsummaryService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
     // console.log(this.Store1List);
     this._PharmaitemsummaryService.SearchGroup.get('StoreId').setValue(this.Store1List[0]);
     this._PharmaitemsummaryService.userFormGroup.get('StoreId').setValue(this.Store1List[0]);
     this._PharmaitemsummaryService.ItemWiseFrom.get('StoreId').setValue(this.Store1List[0]);
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
  geItemWithbatchexpList() {

    debugger
    var vdata = {
      "NonMovingDay": this._PharmaitemsummaryService.SearchGroup.get("NonMovingDay").value || 0,
      "StoreId" : this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.SearchGroup.get("StoreId").value.StoreId

    }
   this._PharmaitemsummaryService.getItemBatchexpwiseList(vdata).subscribe(data => {
      this.dsNonMovItemWithexpdate.data = data as Itemmovment[];
      console.log(data);
      this.dsNonMovItemWithexpdate.sort = this.sort;
      this.dsNonMovItemWithexpdate.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  geItemWithoutbatchexpList() {
    debugger
    this.sIsLoading = 'loading-data';
    var vdata = {
      "NonMovingDay": this._PharmaitemsummaryService.SearchGroup.get("NonMovingDay").value,
      "StoreId": this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.SearchGroup.get("StoreId").value.StoreId

    }
      this._PharmaitemsummaryService.getItemWithoutBatchexpwiseList(vdata).subscribe(data => {
      this.dsNonMovItemWithoutexpdate.data = data as Itemmovment[];
      this.dsNonMovItemWithoutexpdate.sort = this.sort;
      this.dsNonMovItemWithoutexpdate.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }  
 
  onClear(){

    // this._PharmaitemsummaryService.SearchGroup.get('start').reset();
    // this._PharmaitemsummaryService.SearchGroup.get('end').reset();
    // this._PharmaitemsummaryService.SearchGroup.get('StoreId').reset();
    // this._PharmaitemsummaryService.SearchGroup.get('IsDeleted').reset();
    // this._PharmaitemsummaryService.SearchGroup.get('ItemCategory').reset();
    
  }  
  getItemExpdatewiseList() {
    
    this.sIsLoading = 'loading-data';
    var vdata = {
     "ExpMonth":this._PharmaitemsummaryService.userFormGroup.get("ExpMonth").value || 0,
     "ExpYear": this._PharmaitemsummaryService.userFormGroup.get("ExpYear").value || 0,     
     "StoreID": this.accountService.currentUserValue.user.storeId || 0        
    }
    setTimeout(() => {
      this._PharmaitemsummaryService.getItemexpdatewise(vdata).subscribe(
        (Visit) => {
          this.dsItemExpdatewiseStock.data = Visit as DayWiseStockList[];
          this.dsItemExpdatewiseStock.sort = this.sort;
          this.dsItemExpdatewiseStock.paginator = this.thirdPaginator;
          this.sIsLoading = '';
          this.isLoadingStr = this.dsItemExpdatewiseStock.data.length == 0 ? 'no-data' : '';
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
  exportItemExpwiseReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ItemName', 'ConversionFactor', 'Current_BalQty', 'Received_Qty', 'Sales_Qty'];
    this.reportDownloadService.getExportJsonData(this.dsItemExpdatewiseStock.data, exportHeaders, 'ItemWise Report');
 
    this.dsItemExpdatewiseStock.data=[];
    this.sIsLoading = '';
  }

    
  exportNonItemwithbatchReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ItemName', 'DaySales','BatchExpDate' ,'BalanceQty', 'LastSalesDate'];
    this.reportDownloadService.getExportJsonData(this.dsNonMovItemWithexpdate.data, exportHeaders, 'Non Moving Item List Report');
    this.dsNonMovItemWithexpdate.data=[];
    this.sIsLoading = '';
  }

  exportNonItemwithoutbatchReportExcel() {
    this.sIsLoading == 'loading-data'
    let exportHeaders = ['ItemName', 'DaySales','BalanceQty', 'LastSalesDate'];
    this.reportDownloadService.getExportJsonData(this.dsNonMovItemWithoutexpdate.data, exportHeaders, 'Non Moving Item List Withot BatchExp');
    this.dsNonMovItemWithoutexpdate.data=[];
    this.sIsLoading = '';
  }

  // viewgetDaywisestockReportPdf() {
  //   this.sIsLoading == 'loading-data'
  //   // let LedgerDate =  this.datePipe.transform(this._PharmaitemsummaryService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  //   // let StoreId =this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.userFormGroup.get("StoreId").value.StoreId || 0
  //   setTimeout(() => {
  //     this.SpinLoading =true;
  //   //  this.AdList=true;
  //   this._PharmaitemsummaryService.getDaywisestockview(
  //     LedgerDate,StoreId
  //   ).subscribe(res => {
  //     const dialogRef = this._matDialog.open(PdfviewerComponent,
  //       {
  //         maxWidth: "95vw",
  //         height: '850px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Day Wise Stock Viewer"
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.sIsLoading = '';
  //       });
     
  //   });
   
  //   },100);
  // }

  
  // viewgetCurrentstockReportPdf() {
  //   this.sIsLoading == 'loading-data'
  //   let ItemName = this._PharmaitemsummaryService.SearchGroup.get("ItemCategory").value + '%' || "%"
  //   let StoreId = this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.SearchGroup.get("StoreId").value.StoreId || 0
  //   setTimeout(() => {
  //     this.SpinLoading =true;
  //  this._PharmaitemsummaryService.getCurrentstockview(
  //   StoreId, ItemName
  //   ).subscribe(res => {
  //     const dialogRef = this._matDialog.open(PdfviewerComponent,
  //       {
  //         maxWidth: "95vw",
  //         height: '850px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Current Stock Viewer"
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.sIsLoading = '';
  //       });
       
  //   });
   
  //   },100);
  // }

  
  // viewgetItemwisestockReportPdf() {
  //   this.sIsLoading == 'loading-data'
  //   let FromDate = this.datePipe.transform(this._PharmaitemsummaryService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  //   let todate =this.datePipe.transform(this._PharmaitemsummaryService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
  //   let StoreId = this._loggedService.currentUserValue.user.storeId || this._PharmaitemsummaryService.ItemWiseFrom.get("StoreId").value.StoreId || 0
  //   setTimeout(() => {
  //   this.SpinLoading =true;
  //   //  this.AdList=true;
  //   this._PharmaitemsummaryService.getItemwisestockview(FromDate,todate,StoreId).subscribe(res => {
  //     const dialogRef = this._matDialog.open(PdfviewerComponent,
  //       {
  //         maxWidth: "95vw",
  //         height: '850px',
  //         width: '100%',
  //         data: {
  //           base64: res["base64"] as string,
  //           title: "Item Wise Current Stock Viewer"
  //         }
  //       });
  //       dialogRef.afterClosed().subscribe(result => {
  //         this.sIsLoading = '';
  //       });
  //   });
  //   },1000);
  // }
}

export class Itemmovment {
  ItemName: Number;
  DaySales: number;
  BatchExpDate:string;
  BalanceQty:string;
  LastSalesDate:number;
  // GenericName: string;
  
  constructor(Itemmovment) {
    {
      this.ItemName = Itemmovment.ItemName || 0;
      this.DaySales = Itemmovment.DaySales || 0;
      this.BatchExpDate = Itemmovment.BatchExpDate || "";
      this.BalanceQty = Itemmovment.BalanceQty || "";
      this.LastSalesDate = Itemmovment.LastSalesDate || 0;
      // this.GenericName = Itemmovment.GenericName || "";
       
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

