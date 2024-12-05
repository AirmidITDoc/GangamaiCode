import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { ItemMovemnentService } from './item-movemnent.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { FormControl } from '@angular/forms';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-item-movemnent',
  templateUrl: './item-movemnent.component.html',
  styleUrls: ['./item-movemnent.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class ItemMovemnentComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedContacts: boolean;

    Store1List: any = [];
    StoreList: any = [];
   
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
    apiUrl: "ItemMovement/ItemMovementList",
    columnsList: [
        { heading: "movementId", key: "movementId", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "itemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "fromStoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "batchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "documentNo", key: "documentNo", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "transactionType", key: "transactionType", sort: true, align: 'left', emptySign: 'NA',width :50 },        
        { heading: "transactionDate", key: "transactionDate", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "tranDate", key: "tranDate", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "receiptQty", key: "receiptQty", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "issueQty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "movementNo", key: "movementNo", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "transactionTime", key: "transactionTime", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "toStoreName", key: "toStoreName", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "batchExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA',width :50 },
        { heading: "supplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA',width :100 },
        { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._ItemMovemnentService.deactivateTheStatus(data.batchNo).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "batchNo",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "ItemId", fieldValue: "580", opType: OperatorComparer.Equals },
            { fieldName: "FromStoreID", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "BatchNo", fieldValue: "G220720826", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
   
    constructor(
        public _ItemMovemnentService: ItemMovemnentService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { 
        
    }
    onSave(row: any = null) {
        let that = this;
        // const dialogRef = this._matDialog.open(,
        //     {
        //         maxWidth: "95vw",
        //         height: '95%',
        //         width: '70%',
        //         data: row
        //     });
        // dialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         that.grid.bindGridData();
        //     }
        // });
    }

//   displayedColumns = [
//     'No',
//     'Date',
//     'TransactionType',
//     'FromStoreName',
//     'DocNo',
//     'ItemName',
//     'BatchNO',
//     'RQty',
//     'IQty',
//     'BalQty',
//     'ReturnQty'
//   ]

//   hasSelectedContacts: boolean;
//   Store1List: any = [];
//   ItemList: any = [];
//   StoreList: any = []; 
//   sIsLoading: string = '';
//   isLoading = true;
//   isItemSelected:boolean=false;
//   isBatchNoSelected:boolean=false;
//   SpinLoading: boolean = false;

 
//   dsItemMovement = new MatTableDataSource<ItemMovementList>();

//   @ViewChild(MatSort) sort: MatSort;
//   @ViewChild(MatPaginator) paginator: MatPaginator;

//   constructor(
//     public _ItemMovemnentService: ItemMovemnentService,
//     public _matDialog: MatDialog,
//     private _fuseSidebarService: FuseSidebarService,
//     private _loggedService: AuthenticationService,
//     public datePipe: DatePipe,
//     private reportDownloadService: ExcelDownloadService,
//   ) { }

//   public ItemNameFilterCtrl: FormControl = new FormControl();
//   public filteredItem: ReplaySubject<any> = new ReplaySubject<any>(1);
//   private _onDestroy = new Subject<void>();

//   ngOnInit(): void {
//     this.getTOStoreList();
//     // this.getItemMovement();
//      this.gePharStoreList();
//     //  this.getFormStoreList();
   
//   }
  
//   toggleSidebar(name): void {
//     this._fuseSidebarService.getSidebar(name).toggleOpen();
//   }
//   dateTimeObj: any;
//   getDateTime(dateTimeObj) {
//     // console.log('dateTimeObj==', dateTimeObj);
//     this.dateTimeObj = dateTimeObj;
//   }

//   getItemMovementList() {  
//     this.sIsLoading = 'loading-data';
//     var vdata = {
//       "FromDate": this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
//       "ToDate": this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
//       "FromStoreID": this._ItemMovemnentService.ItemSearchGroup.get('StoreId').value.storeid || 0,
//       "ToStoreId": this._ItemMovemnentService.ItemSearchGroup.get('ToStoreId').value.StoreId || 0,
//       'ItemId': this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value.ItemID || 0,
//       'BatchNo': this._ItemMovemnentService.ItemSearchGroup.get('BatchNo').value.BatchNo || '%'
//     }
//     console.log(vdata);
//     this._ItemMovemnentService.getItemMovementList(vdata).subscribe(data => {
//       this.dsItemMovement.data = data as ItemMovementList[];
//       this.dsItemMovement.sort = this.sort;
//       this.dsItemMovement.paginator = this.paginator;
//       this.sIsLoading = '';
//       console.log(this.dsItemMovement.data);
//     },
//     error => {
//       this.sIsLoading = '';
//     });
//   }
 
//   getTOStoreList() {
//     this._ItemMovemnentService.getToStoreFromList().subscribe(data => {
//       this.Store1List = data;
//       // console.log(this.Store1List);
//      });
//   }
  
// filteredOptions:any;
// ItemListfilteredOptions:any;
// noOptionFound:boolean=false;
//   getStockItemList() {
//     var m_data = {
//       "ItemName": `${this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value}%` 
//     }
//     if (this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value.length >= 1) {
//       this._ItemMovemnentService.getItemFormList(m_data).subscribe(resData => {
//       //  this.filteredOptions = resData;
//        // console.log(this.filteredOptions)
//         this.ItemListfilteredOptions = resData;
//         if (this.ItemListfilteredOptions.length == 0) {
//           this.noOptionFound = true;
//         } else {
//           this.noOptionFound = false;
//         }
//       });
//     }
//     this.getBatchNoList();
//   }
//   getOptionTextItemList(option) {
//     if (!option) return '';
//     return option.ItemName;
//     }
    
//     getBatchNoList(){
//       var m_data = {
//         "BatchNo":`${this._ItemMovemnentService.ItemSearchGroup.get('BatchNo').value}%` ,
//         "ItemId":this._ItemMovemnentService.ItemSearchGroup.get('ItemID').value.ItemID || 0
//       }
//       console.log(m_data)
//         this._ItemMovemnentService.getBatchNoList(m_data).subscribe(resData => {
//           this.filteredOptions = resData;
//           console.log(this.filteredOptions)
//           if (this.filteredOptions.length == 0) {
//             this.noOptionFound = true;
//           } else {
//             this.noOptionFound = false;
//           }
//         });
//     }
//     getOptionTextBatchNoList(option) {
//       if (!option) return '';
//       return option.BatchNo;
//       }
//   gePharStoreList() {
//     var vdata = {
//       Id: this._loggedService.currentUserValue.storeId
//     }
//     // console.log(vdata);
//     this._ItemMovemnentService.getLoggedStoreList(vdata).subscribe(data => {
//       this.StoreList = data;
//       // console.log(this.StoreList);
//       this._ItemMovemnentService.ItemSearchGroup.get('StoreId').setValue(this.StoreList[0]);
//     });
//   }
//   exportItemMovementExcel(){
//     this.sIsLoading == 'loading-data'
//     let exportHeaders = ['MovementNo','TransactionDate','TransactionType','DocumentNo', 'ItemName','BatchNo', 'ReceiptQty', 'IssueQty', 'BalQty','ReturnQty'];
//     this.reportDownloadService.getExportJsonData(this.dsItemMovement.data, exportHeaders, 'ItemMovement');
//     this.dsItemMovement.data=[];
//     this.sIsLoading = '';
//   } 
 

//   viewgetItemmovementReportPdf() {
//     let ItemId=0;
//     let Fromdate = this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
//     let Todate = this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'

//     let FromStoreId = this._ItemMovemnentService.ItemSearchGroup.get("StoreId").value.storeid || 0

//     let ToStoreId = this._ItemMovemnentService.ItemSearchGroup.get("ToStoreId").value.StoreId || 0

//     this.sIsLoading == 'loading-data'

//     setTimeout(() => {
//         this.SpinLoading = true;
//       debugger
//         this._ItemMovemnentService.getItemmovementview(Fromdate, Todate,ItemId, FromStoreId, ToStoreId).subscribe(res => {
//             const dialogRef = this._matDialog.open(PdfviewerComponent,
//                 {
//                     maxWidth: "95vw",
//                     height: '850px',
//                     width: '100%',
//                     data: {
//                         base64: res["base64"] as string,
//                         title: "Itm Movement List Report Viewer"
//                     }
//                 });
//             dialogRef.afterClosed().subscribe(result => {
//                 this.sIsLoading = '';
//             });
//         });
//     }, 1000);
// }
// }


// export class ItemMovementList {
//   No: Number;
//   Date: number;
//   TransactionType: any;
//   FromStoreName: any;
//   DocNo: any;
//   ItemName: any;
//   BatchNO: any;
//   RQty: any;
//   IQty: any;
//   BalQty: any;
  

//   constructor(ItemMovementList) {
//     {
//       this.No = ItemMovementList.No || 0;
//       this.Date = ItemMovementList.Date || 0;
//       this.TransactionType = ItemMovementList.TransactionType || " ";
//       this.FromStoreName = ItemMovementList.FromStoreName || "";
//       this.DocNo = ItemMovementList.DocNo || 0;
//       this.ItemName = ItemMovementList.ItemName || " ";
//       this.BatchNO = ItemMovementList.BatchNO || 0;
//       this.RQty = ItemMovementList.RQty || 0;
//       this.IQty = ItemMovementList.IQty || 0;
//       this.BalQty = ItemMovementList.BalQty || 0;
//     }
//   }
}

