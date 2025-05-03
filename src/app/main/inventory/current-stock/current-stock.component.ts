import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { CurrentStockService } from './current-stock.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, formatDate } from '@angular/common';
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
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-current-stock',
    templateUrl: './current-stock.component.html',
    styleUrls: ['./current-stock.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class CurrentStockComponent implements OnInit {
    EditRefund() {
        throw new Error('Method not implemented.');
    }
    EditOPBill() {
        throw new Error('Method not implemented.');
    }


    getWhatsappsharePaymentReceipt(data: any) {
        throw new Error('Method not implemented.');
    }
    viewgetOPPaymentReportPdf(data: any) {
        throw new Error('Method not implemented.');
    }
    onSave(data: any) {
        throw new Error('Method not implemented.');
    }
    isStoreSelected: boolean = false;
    filteredOptionsStorename: Observable<string[]>;
    @ViewChild('CurrentStock', { static: false }) grid1: AirmidTableComponent;
    @ViewChild('DayWise', { static: false }) grid2: AirmidTableComponent;
    @ViewChild('SaleSummery', { static: false }) grid3: AirmidTableComponent;
    @ViewChild('ItemSummery', { static: false }) grid4: AirmidTableComponent;

    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

    hasSelectedContacts: boolean;

    isLoadingStr: string = '';
    isLoading: String = '';
    sIsLoading: string = "";
    // isLoading = true;
    Store1List: any = [];
    screenFromString = 'admission-form';
    FromDate: any;
    Todate: any;
    SpinLoading: boolean = false;
    isItemSelected: boolean = false;

    storeId = "0";
    itemId = "0";

    // dsCurrentStock = new MatTableDataSource<CurrentStockList>();
    // dsDaywiseStock = new MatTableDataSource<DayWiseStockList>();
    // dsItemwiseStock = new MatTableDataSource<ItemWiseStockList>();
    // dsIssuewissueItemStock = new MatTableDataSource<ItemWiseStockList>();
    printflag: boolean = false;

    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";
    formattedDate: string;

    constructor(
        public _CurrentStockService: CurrentStockService,
        public _matDialog: MatDialog,
        private reportDownloadService: ExcelDownloadService,
        private _fuseSidebarService: FuseSidebarService,
        public datePipe: DatePipe,
        private _loggedService: AuthenticationService,
        private accountService: AuthenticationService,
        public toastr: ToastrService,

    ) { }

    ngOnInit(): void {
        // this.gePharStoreList();
        //this.getCrrentStkItemSearchList();
    }

    allcurrentColumn=[
        { heading: "ItemName", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ReceivedQty", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IssueQty", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "BalanceQty", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ReturnQty", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    ]
    allcurrentFilters=[
        { fieldName: "StoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
        { fieldName: "ItemName", fieldValue: this.itemId, opType: OperatorComparer.StartsWith }
    ]

    gridConfig: gridModel = {
        apiUrl: "CurrentStock/StorewiseCurrentStockList",
        columnsList: this.allcurrentColumn,
        sortField: "StoreId",
        sortOrder: 0,
        filters: this.allcurrentFilters
    }

    getfiltercurrentStock(){
        debugger
            this.gridConfig = {
                apiUrl: "CurrentStock/StorewiseCurrentStockList",
                columnsList:this.allcurrentColumn , 
                sortField: "StoreId",
                sortOrder: 0,
                filters:  [
                    { fieldName: "StoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
                    { fieldName: "ItemName", fieldValue: this.itemId, opType: OperatorComparer.StartsWith },
                ]
            }
            console.log(this.gridConfig)
            this.grid1.gridConfig = this.gridConfig;
            this.grid1.bindGridData(); 
        }

        selectChangeStore(obj:any){
            console.log(obj)
             if(obj.value!==0)
                this.storeId=obj.value
            else
            this.storeId="0"
    
            this.getfiltercurrentStock();
        }
        selectChangeItem(obj:any){
            console.log(obj)
             if(obj.value!==0)
                this.itemId=obj.value
            else
            this.itemId="0"
    
            this.getfiltercurrentStock();
        }

    onChangeDateofBirth(DateOfBirth) {
        debugger
        console.log(DateOfBirth)
        const date = new Date(DateOfBirth);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); 
        const day = String(date.getDate()).padStart(2, '0');
        this.formattedDate = `${year}-${month}-${day}`;
        console.log(this.formattedDate);

        this.alldayWiseFilter[0].fieldValue = this.formattedDate;
    }

    alldayWiseColumn= [
        { heading: "LedgerDate", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ItemName", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "BatchNo", key: "batch", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Batch ExpDate", key: "batchEx", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "Unit MRP", key: "unit", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "PurUnitRate", key: "PurUnitRate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "LandedRate", key: "LandedRate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "ReceivedQty", key: "recevideqty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "IssueQty", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "BalanceQty", key: "balance", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    ]
    alldayWiseFilter=[
        { fieldName: "LedgerDate", fieldValue: '', opType: OperatorComparer.StartsWith },
        { fieldName: "StoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
        { fieldName: "ItemId", fieldValue: this.itemId, opType: OperatorComparer.Equals },
    ]

    gridConfig1: gridModel = {
        apiUrl: "CurrentStock/DayWiseCurrentStockList",
        columnsList:this.alldayWiseColumn,
        sortField: "StoreId",
        sortOrder: 0,
        filters: this.alldayWiseFilter
    }

    onChangedayWise() {
        debugger
        this.fromDate = this.formattedDate
        // this.getfilterdayWise();
    }

    getfilterdayWise(){
    debugger
        this.gridConfig1 = {
            apiUrl: "CurrentStock/DayWiseCurrentStockList",
            columnsList:this.alldayWiseColumn , 
            sortField: "StoreId",
            sortOrder: 0,
            filters:  [
                { fieldName: "LedgerDate", fieldValue: this.formattedDate, opType: OperatorComparer.StartsWith },
                { fieldName: "StoreId", fieldValue: this.storeId, opType: OperatorComparer.Equals },
                { fieldName: "ItemId", fieldValue: this.itemId, opType: OperatorComparer.Equals },
            ]
        }
        console.log(this.gridConfig1)
        this.grid2.gridConfig = this.gridConfig1;
        this.grid2.bindGridData(); 
    }

    selectChangeStore1(obj:any){
        console.log(obj)
         if(obj.value!==0)
            this.storeId=obj.value
        else
        this.storeId="0"

        this.onChangedayWise();
    }
    selectChangeItem1(obj:any){
        console.log(obj)
         if(obj.value!==0)
            this.itemId=obj.value
        else
        this.itemId="0"

        this.onChangedayWise();
    }

    gridConfig2: gridModel = {
        apiUrl: "CurrentStock/ItemWiseSalesSummaryList",
        columnsList: [
            { heading: "ItemName", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Conversion Factor", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Current BalQty", key: "balQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReceivedQty", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Sales Qty", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        ],
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            { fieldName: "Item", fieldValue: "10003", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        ]
    }

    gridConfig3: gridModel = {
        apiUrl: "IssueToDepartment/IssueToDeptList",
        columnsList: [
            { heading: "ItemName", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Conversion Factor", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Current BalQty", key: "balQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReceivedQty", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Sales Qty", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        ],
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            { fieldName: "Item", fieldValue: "10003", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        ]
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }

    dateTimeObj: any;
    getDateTime(dateTimeObj) {
        // console.log('dateTimeObj==', dateTimeObj);
        this.dateTimeObj = dateTimeObj;
    }

    filteredOptions: any;
    ItemListfilteredOptions: any;
    noOptionFound: boolean = false;
    DaywiseItemListfilteredOptions: any;
    ItemwiseItemListfilteredOptions: any;
    IssuewiseItemListfilteredOptions: any;

    onClear() {
        this._CurrentStockService.SearchGroup.get('start').reset();
        this._CurrentStockService.SearchGroup.get('end').reset();
        this._CurrentStockService.SearchGroup.get('StoreId').reset();
        this._CurrentStockService.SearchGroup.get('IsDeleted').reset();
        this._CurrentStockService.SearchGroup.get('ItemCategory').reset();
    }

    // getItemWiseStockList() {
    //     this.sIsLoading = 'loading-data';
    //     var vdata = {
    //         "FromDate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "StoreId": this._loggedService.currentUserValue.storeId || 0,
    //         "ItemId": this._CurrentStockService.ItemWiseFrom.get('ItemCategory').value.ItemID || 0
    //     }
    //     setTimeout(() => {
    //         // this.isLoadingStr = 'loading';
    //         this._CurrentStockService.getItemWiseStockList(vdata).subscribe(
    //             (Visit) => {
    //                 this.dsItemwiseStock.data = Visit as ItemWiseStockList[];
    //                 this.dsItemwiseStock.sort = this.sort;
    //                 this.dsItemwiseStock.paginator = this.secondPaginator;
    //                 this.sIsLoading = '';
    //                 this.isLoadingStr = this.dsItemwiseStock.data.length == 0 ? 'no-data' : '';
    //             },
    //             (error) => {
    //                 this.isLoadingStr = 'no-data';
    //             }
    //         );
    //     }, 1000);


    // }

    // getIssueWiseItemStockList() {
    //     this.sIsLoading = 'loading-data';
    //     var vdata = {
    //         "FromDate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "StoreId": this._loggedService.currentUserValue.storeId || 0,
    //         "ItemId": this._CurrentStockService.PurchaseItem.get('ItemCategory').value.ItemID || 0
    //     }
    //     setTimeout(() => {
    //         this._CurrentStockService.getIssueWiseItemStockList(vdata).subscribe(
    //             (Visit) => {
    //                 this.dsIssuewissueItemStock.data = Visit as ItemWiseStockList[];
    //                 this.dsIssuewissueItemStock.sort = this.sort;
    //                 this.dsIssuewissueItemStock.paginator = this.secondPaginator;
    //                 this.sIsLoading = '';
    //                 this.isLoadingStr = this.dsIssuewissueItemStock.data.length == 0 ? 'no-data' : '';
    //             },
    //             (error) => {
    //                 this.isLoadingStr = 'no-data';
    //             }
    //         );
    //     }, 1000);
    // }
    getItemdetails(contact) {
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
            // this.getCurrentStockList();
        });
    }
    getIssueSummery(contact) {
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
            // this.getCurrentStockList();
        });
    }
    getSalesSummery(contact) {
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
            // this.getCurrentStockList();
        });
    }
    getSalesReturnSummery(contact) {
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
            // this.getCurrentStockList();
        });
    }

    @ViewChild('ItemWiseStockTemplate') ItemWiseStockTemplate: ElementRef;
    reportPrintObjList: ItemWiseStockList[] = [];
    printTemplate: any;
    reportPrintObj: ItemWiseStockList;
    reportPrintObjTax: ItemWiseStockList;
    subscriptionArr: Subscription[] = [];


    _loaderShow: boolean = true;
    // exportItemReportExcel() {
    //     this.sIsLoading == 'loading-data'
    //     let exportHeaders = ['ItemName', 'ConversionFactor', 'Current_BalQty', 'Received_Qty', 'Sales_Qty'];
    //     this.reportDownloadService.getExportJsonData(this.dsItemwiseStock.data, exportHeaders, 'ItemWise Report');

    //     this.dsItemwiseStock.data = [];
    //     this.sIsLoading = '';
    // }


    // exportDayReportExcel() {
    //     this.sIsLoading == 'loading-data'
    //     let exportHeaders = ['LedgerDate', 'ItemName', 'BatchNo', 'BalanceQty', 'ReceivedQty', 'IssueQty', 'UnitMRP', 'PurUnitRate', 'LandedRate', 'VatPercentage'];
    //     this.reportDownloadService.getExportJsonData(this.dsDaywiseStock.data, exportHeaders, 'Day Wise Report');
    //     this.dsDaywiseStock.data = [];
    //     this.sIsLoading = '';
    // }

    // exportCurrentStockReportExcel() {
    //     this.sIsLoading == 'loading-data'
    //     let exportHeaders = ['ItemName', 'ReceivedQty', 'IssueQty', 'BalanceQty', 'ReturnQty'];
    //     this.reportDownloadService.getExportJsonData(this.dsCurrentStock.data, exportHeaders, 'CurrentStock');
    //     console.log(this.dsCurrentStock.data)
    //     this.dsCurrentStock.data = [];
    //     this.sIsLoading = '';
    // }


    // exportIssuewiseItemReportExcel() {
    //     this.sIsLoading == 'loading-data'
    //     let exportHeaders = ['StoreName', 'ItemName', 'Received_Qty', 'Sales_Qty', 'Current_BalQty'];
    //     this.reportDownloadService.getExportJsonData(this.dsIssuewissueItemStock.data, exportHeaders, 'Issuw Wise Item Stock');
    //     this.dsCurrentStock.data = [];
    //     this.sIsLoading = '';
    // }

    viewgetDaywisestockReportPdf() {
        this.sIsLoading == 'loading-data'
        let LedgerDate = this.datePipe.transform(this._CurrentStockService.userFormGroup.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.userFormGroup.get("StoreId").value.StoreId || 0
        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._CurrentStockService.getDaywisestockview(
                LedgerDate, StoreId
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

        }, 100);
    }


    viewgetCurrentstockReportPdf() {
        this.sIsLoading == 'loading-data'
        let ItemName = this._CurrentStockService.SearchGroup.get("ItemCategory").value + '%' || "%"
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.SearchGroup.get("StoreId").value.StoreId || 0
        setTimeout(() => {
            this.SpinLoading = true;
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

        }, 100);
    }


    viewgetItemwisestockReportPdf() {
        this.sIsLoading == 'loading-data'
        let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let todate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.ItemWiseFrom.get("StoreId").value.StoreId || 0
        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._CurrentStockService.getItemwisestockview(FromDate, todate, StoreId).subscribe(res => {
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
        }, 1000);
    }


    viewgetItemWisePurchaseReportPdf() {
        this.sIsLoading == 'loading-data'
        let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let todate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end1").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.userFormGroup.get("StoreId").value.StoreId || 0
        setTimeout(() => {
            this.SpinLoading = true;
            //  this.AdList=true;
            this._CurrentStockService.ItemWisePurchaseView(
                FromDate, todate, StoreId
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

        }, 100);
    }
}

export class CurrentStockList {
    IssueQty: Number;
    ReceivedQty: number;
    ItemName: string;
    ToStoreName: string;
    BalanceQty: number;
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

    ItemName: string;
    ToStoreName: string;
    IssueQty: Number;
    BalanceQty: number;
    ReceivedQty: number;
    BatchNo: Number;
    BatchExpDate: number;
    UnitMRP: number;
    LedgerDate: any;
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

    ItemName: string;
    ToStoreName: string;
    IssueQty: Number;
    BalanceQty: number;
    ReceivedQty: number;
    BatchNo: Number;
    BatchExpDate: number;
    UnitMRP: number;
    LedgerDate: any;
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

