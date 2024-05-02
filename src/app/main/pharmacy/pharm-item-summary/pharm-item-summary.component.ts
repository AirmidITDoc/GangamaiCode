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
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-pharm-item-summary',
  templateUrl: './pharm-item-summary.component.html',
  styleUrls: ['./pharm-item-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PharmItemSummaryComponent implements OnInit {
  displayedColumns = [  
    'ItemName',
    'DaySales',
    'BatchExpDate',
    'BalanceQty',
    'LastSalesDate',
  ];
  displayedColumns1 = [
    'ItemName',
    'DaySales',
    'BalanceQty',
    'LastSalesDate',
  ];
  displayedColumnsItemWise = [
    'ItemName',
    'BatchNo',
    'BatchExpDate',
    'BalanceQty',    
  ];
  Itemflag:boolean=false;
  searchFormGroup: FormGroup;
  dateTimeObj: any;
  isLoadingStr: string = '';
  isLoading: String = '';
  sIsLoading: string = "";
  Store1List:any=[];
  screenFromString = 'admission-form';
  FromDate:any;
  Todate:any;
  chosenYear:number;
  chosenMonth:number;
  SpinLoading:boolean=false;
  dsNonMovItemWithexpdate= new MatTableDataSource<Itemmovment>();
  dsNonMovItemWithoutexpdate= new MatTableDataSource<Itemmovment>();
  dsItemExpdatewiseStock= new MatTableDataSource<ItemWiseStockList>();
  printflag:boolean=false;
  
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('paginator', { static: true }) public paginator: MatPaginator;
  @ViewChild('secondPaginator', { static: true }) public secondPaginator: MatPaginator;
  @ViewChild('thirdPaginator', { static: true }) public thirdPaginator: MatPaginator;

  constructor(
    public _PharmaitemsummaryService: PharmaitemsummaryService,
    public _matDialog: MatDialog,
    private reportDownloadService: ExcelDownloadService,
    private _fuseSidebarService: FuseSidebarService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    private accountService: AuthenticationService,
  ) { 
   
  }
  UIForm:FormGroup;
  ngOnInit(): void {
    this.gePharStoreList();

    this.geItemWithbatchexpList();
    this.searchFormGroup = this.createSearchForm();
  }
  chosenYearHandler(event){
    this.chosenYear = event.getFullYear();

  }
  chosenMonthHandler(event){
    this.chosenMonth = event.getMonth() + 1;   
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
    this._PharmaitemsummaryService.getLoggedStoreList(vdata).subscribe(data => {
      this.Store1List = data;
     this._PharmaitemsummaryService.SearchGroup.get('StoreId').setValue(this.Store1List[0]);
     this._PharmaitemsummaryService.userFormGroup.get('StoreId').setValue(this.Store1List[0]);
     this._PharmaitemsummaryService.ItemWiseFrom.get('StoreId').setValue(this.Store1List[0]);
    });
  }
  toggleSidebar(name): void {
    this._fuseSidebarService.getSidebar(name).toggleOpen();
  }
  getDateTime(dateTimeObj) {
    this.dateTimeObj = dateTimeObj;
  }
  geItemWithbatchexpList() {
    var vdata = {
      "NonMovingDay": this._PharmaitemsummaryService.SearchGroup.get("NonMovingDay").value || 0,
      "StoreId" : this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.SearchGroup.get("StoreId").value.StoreId
    }
   this._PharmaitemsummaryService.getItemBatchexpwiseList(vdata).subscribe(data => {
      this.dsNonMovItemWithexpdate.data = data as Itemmovment[];
      this.dsNonMovItemWithexpdate.sort = this.sort;
      this.dsNonMovItemWithexpdate.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }


  geItemWithoutbatchexpList() {
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

  }  

  getItemExpdatewiseList() {
    // this.sIsLoading = 'loading-data';
    var vdata = {
     "ExpMonth":this.chosenMonth || 0,
     "ExpYear": this.chosenYear  || 'YYYY',     
     "StoreID": this.accountService.currentUserValue.user.storeId || 0        
    } 
    console.log(vdata)
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
        //  this.isLoadingStr = 'no-data';
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

//   viewgetExpItemListReportPdf() {
//     debugger

// let Expyear =  parseInt(this._PharmaitemsummaryService.userFormGroup.get("ExpYear").value) || 0
// let ExpMonth =  parseInt(this._PharmaitemsummaryService.userFormGroup.get("ExpMonth").value) || 0

// let ToStoreId = this.accountService.currentUserValue.user.storeId || parseInt(this._PharmaitemsummaryService.userFormGroup.get("StoreId").value.StoreId) || 0

//     this.sIsLoading == 'loading-data'

//     setTimeout(() => {
//         this.SpinLoading = true;
//         //  this.AdList=true;
//         this._PharmaitemsummaryService.getExpiryItemview(ExpMonth,Expyear,ToStoreId).subscribe(res => {
//             const dialogRef = this._matDialog.open(PdfviewerComponent,
//                 {
//                     maxWidth: "95vw",
//                     height: '850px',
//                     width: '100%',
//                     data: {
//                         base64: res["base64"] as string,
//                         title: "Expiry Item  Report Viewer"
//                     }
//                 });
//             dialogRef.afterClosed().subscribe(result => {
//                 this.sIsLoading = '';
//             });
//         });
//     }, 1000);
// }


viewgetExpItemListReportPdf(el) {
debugger
  let Expyear =  parseInt(this._PharmaitemsummaryService.userFormGroup.get("ExpYear").value) || 0
  let ExpMonth =  parseInt(this._PharmaitemsummaryService.userFormGroup.get("ExpMonth").value) || 0
  
  let ToStoreId = this.accountService.currentUserValue.user.storeId || parseInt(this._PharmaitemsummaryService.userFormGroup.get("StoreId").value.StoreId) || 0
  
  setTimeout(() => {
    // this.SpinLoading =true;
  //  this.AdList=true;
  this._PharmaitemsummaryService.getExpiryItemview(ExpMonth,Expyear,ToStoreId).subscribe(res => {
    const dialogRef = this._matDialog.open(PdfviewerComponent,
      {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Expiry  Item List viewer"
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        // this.AdList=false;
        // this.sIsLoading = '';
      });
  });
 
  },100);
}

ChkNonMovvalue(){
  if(this._PharmaitemsummaryService.SearchGroup.get("NonMovingDay").value > 0){
this.VNonMovdaysflag=false
  }
}


VNonMovdaysflag:boolean=true
viewgetNonMovingReportPdf() {
    debugger

let FromStoreId = this.accountService.currentUserValue.user.storeId || this._PharmaitemsummaryService.userFormGroup.get("StoreId").value.StoreId || 0

let NonMDays = parseInt(this._PharmaitemsummaryService.SearchGroup.get("NonMovingDay").value) || 0

    this.sIsLoading == 'loading-data'

    setTimeout(() => {
        this.SpinLoading = true;
        //  this.AdList=true;
        this._PharmaitemsummaryService.getNonMovingItemview(NonMDays,FromStoreId).subscribe(res => {
            const dialogRef = this._matDialog.open(PdfviewerComponent,
                {
                    maxWidth: "95vw",
                    height: '850px',
                    width: '100%',
                    data: {
                        base64: res["base64"] as string,
                        title: "Non Moving Item Report Viewer"
                    }
                });
            dialogRef.afterClosed().subscribe(result => {
                this.sIsLoading = '';
            });
        });
    }, 1000);
}

}

export class Itemmovment {
  ItemName: Number;
  DaySales: number;
  BatchExpDate:string;
  BalanceQty:string;
  LastSalesDate:number;
  
  constructor(Itemmovment) {
    {
      this.ItemName = Itemmovment.ItemName || 0;
      this.DaySales = Itemmovment.DaySales || 0;
      this.BatchExpDate = Itemmovment.BatchExpDate || "";
      this.BalanceQty = Itemmovment.BalanceQty || "";
      this.LastSalesDate = Itemmovment.LastSalesDate || 0;
       
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

