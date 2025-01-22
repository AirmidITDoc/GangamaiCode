import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { StockAdjustmentService } from './stock-adjustment.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from 'rxjs/operators';
import { request } from 'http';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { MRPAdjustmentComponent } from './mrpadjustment/mrpadjustment.component';
import { GSTAdjustmentComponent } from './gstadjustment/gstadjustment.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
    selector: 'app-stock-adjustment',
    templateUrl: './stock-adjustment.component.html',
    styleUrls: ['./stock-adjustment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})

export class StockAdjustmentComponent implements OnInit {
    hasSelectedContacts: boolean;

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "StockAdjustment/StockAdjustmentList",
        columnsList: [
            { heading: "StockId", key: "stockId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "ItemId", key: "itemId", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BatchNo", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "BatchExpDate", key: "batchExpDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "UnitMRP", key: "unitMRP", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "LandedRate", key: "landedRate", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "PurUnitRateWF", key: "purUnitRateWF", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BalanceQty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "VatPercentage", key: "vatPercentage", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BarCodeSeqNo", key: "barCodeSeqNo", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "BatchEdit", key: "batchEdit", sort: true, align: 'left', emptySign: 'NA', width: 50 },
            { heading: "ExpDateEdit", key: "expDateEdit", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ConversionFactor", key: "conversionFactor", sort: true, align: 'left', emptySign: 'NA', width: 120 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._StockAdjustmentService.deactivateTheStatus(data.stockId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "stockId",
        sortOrder: 0,
        filters: [
            { fieldName: "StoreId", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "ItemId", fieldValue: "14645", opType: OperatorComparer.Equals },
            { fieldName: "Start", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "Length", fieldValue: "10", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _StockAdjustmentService: StockAdjustmentService,
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


    /**
     * 1.stockId
2.itemId
3.batchNo
4.batchExpDate
5.unitMRP
6.landedRate
7.purUnitRateWF
8.balanceQty
9.vatPercentage
10.barCodeSeqNo
11.batchEdit
12.expDateEdit
13.conversionFactor
    */
    //   displayedColumns = [
    //     'stockId',
    //     'itemId',
    //     'batchNo',
    //     'batchExpDate',
    //     'UnitMRP',
    //     'landedRate',
    //     'purUnitRateWF',
    //     'balanceQty',
    //     'vatPercentage',
    //     'barCodeSeqNo',
    //     'batchEdit',
    //     'expDateEdit',
    //     'conversionFactor'
    //   ];

    //   sIsLoading: string = '';
    //   isLoading = true;
    //   StoreList: any = [];
    //   screenFromString = 'admission-form';
    //   isItemIdSelected: boolean = false;
    //   ItemName: any;
    //   ItemId: any;
    //   dateTimeObj: any;
    //   ItemList: any = [];
    //   OptionsItemName: any;
    //   filteredoptionsItemName: Observable<string[]>;
    //   vBatchNo: any;
    //   vQty: any;
    //   vMRP: any;
    //   vUpdatedQty: any;
    //   vBalQty: any;


    //   dsStockAdjList = new MatTableDataSource<StockAdjList>();
    //   @ViewChild(MatSort) sort: MatSort;
    //   @ViewChild('paginator', { static: true }) public paginator: MatPaginator;


    //   constructor(
    //     public _StockAdjustment: StockAdjustmentService,
    //     private _loggedService: AuthenticationService,
    //     private accountService: AuthenticationService,
    //     public datePipe: DatePipe,
    //     public _matDialog: MatDialog,
    //     public toastr: ToastrService,
    //   ) { }

    //   ngOnInit(): void {
    //     this.gePharStoreList();
    //     this.getStockList();
    //   }

    //   getDateTime(dateTimeObj) {
    //     this.dateTimeObj = dateTimeObj;
    //   }
    //   gePharStoreList() {
    //     var vdata = {
    //       Id: this._loggedService.currentUserValue.storeId
    //     }
    //     this._StockAdjustment.getLoggedStoreList(vdata).subscribe(data => {
    //       this.StoreList = data;
    //       this._StockAdjustment.StoreFrom.get('StoreId').setValue(this.StoreList[0]);
    //     });
    //   }
    //   getSearchList() {
    //     var vdata = {
    //       "ItemName": `${this._StockAdjustment.userFormGroup.get('ItemID').value}%`
    //     }
    //     this._StockAdjustment.getItemlist(vdata).subscribe(resData => {
    //       this.ItemList = resData;
    //       //console.log(this.ItemList)
    //       this.OptionsItemName = this.ItemList.slice();
    //       this.filteredoptionsItemName = this._StockAdjustment.userFormGroup.get('ItemID').valueChanges.pipe(
    //         startWith(''),
    //         map(value => value ? this._filterLitem(value) : this.ItemList.slice()),
    //       );
    //     });
    //   }
    //   private _filterLitem(value: any): string[] {
    //     if (value) {
    //       const filterValue = value && value.ItemName ? value.ItemName.toLowerCase() : value.toLowerCase();
    //       return this.OptionsItemName.filter(option => option.ItemName.toLowerCase().includes(filterValue));
    //     }
    //   }
    //   getOptionTextItemName(option) {
    //     return option && option.ItemName ? option.ItemName : '';
    //   }
    //   getSelectedObj(obj) {
    //     //console.log(obj);
    //     this.getStockList();
    //   }

    //   getStockList() {
    //     var Param = {
    //       "StoreId": this._loggedService.currentUserValue.storeId || 0,
    //       "ItemId": this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0, //56784
    //     }
    //     //console.log(Param)
    //     this._StockAdjustment.getStockList(Param).subscribe(data => {
    //       this.dsStockAdjList.data = data as StockAdjList[];
    //      console.log(this.dsStockAdjList)
    //       this.dsStockAdjList.sort = this.sort;
    //       this.dsStockAdjList.paginator = this.paginator;
    //       this.sIsLoading = '';
    //     },
    //       error => {
    //         this.sIsLoading = '';
    //       });
    //   }

    //   OnSelect(param) {
    //     // console.log(param);

    //   }
    //   vStatus: any;
    //   vStockId: any;
    //   AddType: any;
    //   vExpDate: any;
    //   vPurchaseRate: any;
    //   vBatchEdit: any;
    //   vExpDateEdit: any;
    //   vDeudQty: any;
    //   AddQty(contact, AddQty) {
    //     if (contact.AddQty > 0) {
    //       contact.UpdatedQty =parseFloat(contact.BalanceQty) + parseFloat(contact.AddQty);
    //       this.AddType = 1;
    //     } else {
    //       contact.UpdatedQty = 0;
    //     }
    //     this.vUpdatedQty = contact.UpdatedQty;
    //     this.vQty = contact.AddQty;
    //     this.vBalQty = contact.BalanceQty;
    //     this.vStockId = contact.StockId;
    //     this.vBatchNo = contact.BatchNo;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //   }
    //   DeduQty(contact, DeduQty) {
    //     if (contact.DeduQty > 0) {
    //       contact.UpdatedQty = parseFloat(contact.BalanceQty) - parseFloat(contact.DeduQty);
    //       this.AddType = 0;
    //     } else {
    //       contact.UpdatedQty = 0;
    //     }
    //     this.vUpdatedQty = contact.UpdatedQty,
    //       this.vQty = contact.DeduQty;
    //     this.vBalQty = contact.BalanceQty;
    //     this.vStockId = contact.StockId;
    //     this.vBatchNo = contact.BatchNo;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //   }
    //   OneditBatch(contact) {
    //     this.vBatchNo = contact.BatchNo
    //     this.vExpDate = contact.BatchExpDate;
    //     this.vBatchEdit = contact.BatchEdit;
    //     this.vExpDateEdit = contact.BatchExpDate;
    //     this.vStockId = contact.StockId;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //   }
    //   onsaveStockAdj() {
    //     let isCheckQty: any;
    //     if (isCheckQty = this.dsStockAdjList.data.some(item => item.AddQty != '')) {
    //       this.OnSaveStockAdjustment();
    //     }
    //     else if (isCheckQty = this.dsStockAdjList.data.some(item => item.DeduQty < this.vBalQty || item.AddQty == '')) {
    //       this.OnSaveStockAdjustment();
    //     }
    //     else {
    //       this.toastr.warning('Please enter a Qty', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //     }
    //   }

    //   OnSaveStockAdjustment() {
    //     this.sIsLoading = 'loading-data';
    //     if ((!this.dsStockAdjList.data.length)) {
    //       this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //     let insertMRPStockadju = {};
    //     insertMRPStockadju['storeID'] = this.accountService.currentUserValue.storeId || 0;
    //     insertMRPStockadju['stkId'] = this.vStockId || 0;
    //     insertMRPStockadju['itemId'] = this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0;
    //     insertMRPStockadju['batchNo'] = this.vBatchNo || '';
    //     insertMRPStockadju['ad_DD_Type'] = this.AddType;
    //     insertMRPStockadju['ad_DD_Qty'] = this.vQty || 0;
    //     insertMRPStockadju['preBalQty'] = this.vBalQty || 0;
    //     insertMRPStockadju['afterBalQty'] = this.vUpdatedQty || 0;
    //     insertMRPStockadju['addedBy'] = this.accountService.currentUserValue.userId || 0;
    //     insertMRPStockadju['stockAdgId'] = 0;

    //     let submitData = {
    //       'stockAdjustment': insertMRPStockadju,
    //     }
    //     console.log(submitData);
    //     this._StockAdjustment.StockAdjSave(submitData).subscribe(response => {
    //       if (response) {
    //         this.toastr.success('Record Stock Adjustment Saved Successfully.', 'Saved !', {
    //           toastClass: 'tostr-tost custom-toast-success',
    //         });
    //         this.getStockList();
    //       } else {
    //         this.toastr.error('Stock Adjustment Data not saved !, Please check error..', 'Error !', {
    //           toastClass: 'tostr-tost custom-toast-error',
    //         });
    //       }
    //     }, error => {
    //       this.toastr.error('Stock Adjustment Data not saved !, Please check API error..', 'Error !', {
    //         toastClass: 'tostr-tost custom-toast-error',
    //       });
    //     });
    //   }


    //   getLastDayOfMonth(month: number, year: number): number {
    //     return new Date(year, month, 0).getDate();
    //   }
    //   pad(n: number): string {
    //     return n < 10 ? '0' + n : n.toString();
    //   }
    //   lastDay1: any;
    //   vlastDay: string = '';
    //   lastDay2: string = '';

    //   CellcalculateLastDay(contact, inputDate: string) {

    //     if (inputDate && inputDate.length === 6) {
    //       const month = +inputDate.substring(0, 2);
    //       const year = +inputDate.substring(2, 6);

    //       if (month >= 1 && month <= 12) {
    //         const lastDay1 = this.getLastDayOfMonth(month, year);
    //         this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
    //         this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
    //         //console.log(this.lastDay2)
    //         contact.ExpDateEdit = this.lastDay1;
    //         this.vExpDateEdit = this.lastDay1;
    //       } else {
    //         this.vlastDay = 'Invalid month';
    //       }
    //     } else {
    //       this.vlastDay = ' ';
    //     }
    //     this.vBatchNo = contact.BatchNo
    //     this.vExpDate = contact.BatchExpDate;
    //     this.vBatchEdit = contact.BatchNo;
    //     this.vExpDateEdit = contact.BatchExpDate;
    //     this.vStockId = contact.StockId;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //       toastClass: 'tostr-tost custom-toast-warning',
    //     });
    //   }
    //   OnSaveBatchAdj(){
    //     const chkExpDate = this.dsStockAdjList.data.some((item) => item.ExpDateEdit ==  this.vlastDay);
    //     if(!chkExpDate){
    //       if(this.vExpDateEdit){
    //         this.OnSaveBatchAdjustment() 
    //       }else{
    //         this.toastr.warning('Please enter BatchExpDate', 'Warning !', {
    //           toastClass: 'tostr-tost custom-toast-warning',
    //         }); 
    //       } 
    //     }else{
    //       this.toastr.warning('Please enter BatchExpDate', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //     }
    //   }
    //   Lastbatch:string = '';
    //   OnSaveBatch(){
    //     //const chkBatchNo = this.dsStockAdjList.data.some((item) => item.BatchEdit ==  this.Lastbatch);
    //     if(this.vBatchEdit){
    //       this.OnSaveBatchAdjustment();
    //     }
    //     else{
    //       this.toastr.warning('Please enter BatchNo', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //     }

    //   }

    //   OnSaveBatchAdjustment() {
    //     if ((!this.dsStockAdjList.data.length)) {
    //       this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //       });
    //       return;
    //     }
    //     this.dsStockAdjList.data.forEach(element =>{
    //       if (element.ExpDateEdit && element.ExpDateEdit.length === 10) {
    //         const day = +element.ExpDateEdit.substring(0, 2);
    //         const month = +element.ExpDateEdit.substring(3, 5);
    //         const year = +element.ExpDateEdit.substring(6, 10);

    //         this.vExpDate = `${year}/${this.pad(month)}/${day}`;
    //         // console.log(this.vExpDate)
    //       }
    //     })

    //     let batchAdjustment = {};
    //     batchAdjustment['storeId'] = this.accountService.currentUserValue.storeId || 0;
    //     batchAdjustment['itemId'] = this._StockAdjustment.userFormGroup.get('ItemID').value.ItemID || 0;
    //     batchAdjustment['oldBatchNo'] = this.vBatchNo || '';
    //     batchAdjustment['oldExpDate'] = this.vExpDate || 0;
    //     batchAdjustment['newBatchNo'] = this.vBatchEdit || '';
    //     batchAdjustment['newExpDate'] = this.vExpDate;
    //     batchAdjustment['addedBy'] = this.accountService.currentUserValue.userId || 0;
    //     batchAdjustment['stkId'] = this.vStockId || 0;

    //     let submitData = {
    //       'batchAdjustment': batchAdjustment,
    //     }
    //     console.log(submitData);
    //     this._StockAdjustment.BatchAdjSave(submitData).subscribe(response => {
    //       if (response) {
    //         this.toastr.success('Record Batch Adjustment Saved Successfully.', 'Saved !', {
    //           toastClass: 'tostr-tost custom-toast-success',
    //         });
    //         this.getStockList();
    //         this.vBatchEdit = '';
    //       } else {
    //         this.toastr.error('Batch Adjustment Data not saved !, Please check error..', 'Error !', {
    //           toastClass: 'tostr-tost custom-toast-error',
    //         });
    //       }
    //     }, error => {
    //       this.toastr.error('Batch Adjustment Data not saved !, Please check API error..', 'Error !', {
    //         toastClass: 'tostr-tost custom-toast-error',
    //       });
    //     });

    //   }
    //   EditMRP(contact){
    //       console.log(contact)
    //       const dialogRef = this._matDialog.open(MRPAdjustmentComponent,
    //         {
    //           maxWidth: "100%",
    //           height: '45%',
    //           width: '50%',
    //           data: {
    //             Obj: contact,
    //           }
    //         });
    //       dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed - Insert Action', result);
    //         this.getStockList();
    //       });
    //     }
    //     EditGST(contact){
    //       console.log(contact)
    //       const dialogRef = this._matDialog.open(GSTAdjustmentComponent,
    //         {
    //           maxWidth: "100%",
    //           height: '45%',
    //           width: '50%',
    //           data: {
    //             Obj: contact,
    //           }
    //         });
    //       dialogRef.afterClosed().subscribe(result => {
    //         console.log('The dialog was closed - Insert Action', result);
    //         this.getStockList();
    //       });
    //     }
    //   Addeditable: boolean = false;
    //   Dedueditable: boolean = false;
    //   Expeditable: boolean = false;
    //   Batcheditable: boolean = false;
    //   Rateeditable: boolean = false;
    //   Landededitable: boolean = false; 

    //   enableEditing(row: StockAdjList) {
    //     row.Addeditable = true;
    //   }
    //   disableEditing(row: StockAdjList) {
    //     row.Addeditable = false;
    //   }
    //   deduenableEditing(row: StockAdjList) {
    //     row.Dedueditable = true;
    //   }
    //   dedudisableEditing(row: StockAdjList) {
    //     row.Dedueditable = false;
    //   }
    //   RateenableEditing(row: StockAdjList) {
    //     row.Rateeditable = true;
    //   }
    //   RatedisableEditing(row: StockAdjList) {
    //     row.Rateeditable = false;
    //   }
    //   BatchenableEditing(row: StockAdjList) {
    //     row.Batcheditable = true;
    //   }
    //   BatchdisableEditing(row: StockAdjList) {
    //     row.Batcheditable = false;
    //   }
    //   ExpDateenableEditing(row: StockAdjList) {
    //     row.Expeditable = true;
    //   }
    //   ExpDatedisableEditing(row: StockAdjList) {
    //     row.Expeditable = false;
    //   }
    //   LandedenableEditing(row: StockAdjList) {
    //     row.Landededitable = true;
    //   }
    //   LandeddisableEditing(row: StockAdjList) {
    //     row.Landededitable = false;
    //   }
    // }
    // export class StockAdjList {
    //   BalQty: any;
    //   BatchNo: number;
    //   ExpDate: number;
    //   UnitMRP: number;
    //   Landedrate: any;
    //   PurchaseRate: any;
    //   UpdatedQty: any;
    //   LandedRate: any;
    //   AddQty: any;
    //   DeduQty: any;
    //   BatchEdit: any;
    //   ExpDateEdit: any;
    //   Addeditable: boolean = false;
    //   Dedueditable: boolean = false;
    //   Rateeditable: boolean = false;
    //   Batcheditable: boolean = false;
    //   Expeditable: boolean = false;
    //   Landededitable: boolean = false;
    //   GSTeditable:boolean=false;

    //   constructor(StockAdjList) {
    //     {
    //       this.BalQty = StockAdjList.BalQty || 0;
    //       this.BatchNo = StockAdjList.BatchNo || 0;
    //       this.ExpDate = StockAdjList.ExpDate || 0;
    //       this.UnitMRP = StockAdjList.UnitMRP || 0;
    //       this.Landedrate = StockAdjList.Landedrate || 0;
    //       this.PurchaseRate = StockAdjList.PurchaseRate || 0;
    //       this.UpdatedQty = StockAdjList.UpdatedQty || 0;
    //       this.LandedRate = StockAdjList.LandedRate || 0;
    //     }
    //   }
}