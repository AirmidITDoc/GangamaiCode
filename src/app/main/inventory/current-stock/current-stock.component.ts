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
    'action',
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
    'ItemName',
    'ReceivedQty',
    'IssueQty',
    'BalanceQty',
    'UnitMRP',
    'LedgerDate'
    
  ];
  displayedColumnsItemWise = [
  //  'action',
    'ItemName',
    'ConversionFactor',
    'Current_BalQty',
    'Received_Qty',
    'Sales_Qty',
    
  ];

  sIsLoading: string = '';
  isLoading = true;
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
      "StoreId": this._loggedService.currentUserValue.user.storeId || 1,
      //  "From_Dt": this.datePipe.transform(this._CurrentStockService.SearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      //  "To_Dt": this.datePipe.transform(this._CurrentStockService.SearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
        
    }
  // console.log(vdata);
      this._CurrentStockService.getCurrentStockList(vdata).subscribe(data => {
      this.dsCurrentStock.data = data as CurrentStockList[];
    // console.log(this.dsCurrentStock.data)
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
  // console.log(vdata);
      this._CurrentStockService.getDayWiseStockList(vdata).subscribe(data => {
      this.dsDaywiseStock.data = data as DayWiseStockList[];
    // console.log(this.dsDaywiseStock.data)
      this.dsDaywiseStock.sort = this.sort;
      this.dsDaywiseStock.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  } 
  
  getItemWiseStockList() {
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromDate":this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
     "StoreId": this._loggedService.currentUserValue.user.storeId|| 1        
    }
   console.log(vdata);
      this._CurrentStockService.getItemWiseStockList(vdata).subscribe(data => {
      this.dsItemwiseStock.data = data as ItemWiseStockList[];
     console.log(this.dsItemwiseStock.data)
      this.dsItemwiseStock.sort = this.sort;
      this.dsItemwiseStock.paginator = this.paginator;
      this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
      });
  }
  @ViewChild('ItemWiseStockTemplate') ItemWiseStockTemplate: ElementRef;
  reportPrintObjList: ItemWiseStockList[] = [];
  printTemplate: any;
  reportPrintObj: ItemWiseStockList;
  reportPrintObjTax: ItemWiseStockList;
  subscriptionArr: Subscription[] = [];
 

  _loaderShow:boolean = true;
  getPrint() {
    this.printflag = true;
    var vdata = {
      "FromDate":this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
      "StoreId": this._loggedService.currentUserValue.user.storeId || 0     
     }

     this.FromDate=this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd");
     this.Todate=this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd");

    console.log(vdata);
 //   this.Fromdate=this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") 
    this._CurrentStockService.getItemWiseStockListPrint(vdata).subscribe(data => {
      this.reportPrintObjList = data as ItemWiseStockList[];
    
        console.log(this.reportPrintObjList);

        setTimeout(() => {
          this.print3();
         
        }, 1000);
    })
    this.printflag = false;
  }    
    
    print3() {
      let popupWin, printContents;
  
      popupWin = window.open('', '_blank', 'top=0,left=0,height=800px !important,width=auto,width=2200px !important');
  
      popupWin.document.write(` <html>
      <head><style type="text/css">`);
      popupWin.document.write(`
        </style>
        <style type="text/css" media="print">
      @page { size: portrait; }
    </style>
            <title></title>
        </head>
      `);
      popupWin.document.write(`<body onload="window.print();window.close()" style="font-family: system-ui, sans-serif;margin:0;font-size: 16px;">${this.ItemWiseStockTemplate.nativeElement.innerHTML}</body>
      <script>
        var css = '@page { size: portrait; }',
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');
        style.type = 'text/css';
        style.media = 'print';
    
        if (style.styleSheet){
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
        head.appendChild(style);
      </script>
      </html>`);
      // popupWin.document.write(`<body style="margin:0;font-size: 16px;">${this.printTemplate}</body>
      // </html>`);
  
      popupWin.document.close();
    }
  
  
    
  viewgetDaywisestockReportPdf() {
    debugger
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
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  
  viewgetCurrentstockReportPdf() {
    debugger
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
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
        });
    });
   
    },100);
  }

  
  viewgetItemwisestockReportPdf() {
    debugger
    
    let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let todate =this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
    let StoreId = this._loggedService.currentUserValue.user.storeId || this._CurrentStockService.ItemWiseFrom.get("StoreId").value.StoreId || 0
    setTimeout(() => {
      this.SpinLoading =true;
    //  this.AdList=true;
    this._CurrentStockService.getItemwisestockview(
      FromDate,todate,StoreId
    ).subscribe(res => {
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
          // this.AdList=false;
          this.SpinLoading = false;
        });
        dialogRef.afterClosed().subscribe(result => {
          // this.AdList=false;
          this.SpinLoading = false;
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

