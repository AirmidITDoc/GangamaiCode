import { Component, ElementRef, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { CurrentStockService } from './current-stock.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe, formatDate } from '@angular/common';
import { difference, template } from 'lodash';
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
    onlyStart = this.datePipe.transform(this._CurrentStockService.dayWiseForm.get('start').value, "yyyy-MM-dd")
    salesFromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get('startSales').value, "yyyy-MM-dd")
    salesToDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get('endSales').value, "yyyy-MM-dd")
    lastFromDate = this.datePipe.transform(this._CurrentStockService.IssueItem.get('laststart').value, "yyyy-MM-dd")
    lastToDate = this.datePipe.transform(this._CurrentStockService.IssueItem.get('lastend').value, "yyyy-MM-dd")

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

    storeId = this.accountService.currentUserValue.user.storeId;
    storeDayWise = this.accountService.currentUserValue.user.storeId;
    storeSales = this.accountService.currentUserValue.user.storeId;
    storeItem = this.accountService.currentUserValue.user.storeId;
    // itemId = "0";
    itemName = "%";
    DaywiseitemName = "0";
    SaleitemName = "0";
    lastitemName = "0";

    // dsCurrentStock = new MatTableDataSource<CurrentStockList>();
    // dsDaywiseStock = new MatTableDataSource<DayWiseStockList>();
    // dsItemwiseStock = new MatTableDataSource<ItemWiseStockList>();
    // dsIssuewissueItemStock = new MatTableDataSource<ItemWiseStockList>();
    printflag: boolean = false;

    autocompletestore: string = "Store";
    autocompleteitem: string = "Item";
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

    @ViewChild('eyeIcon1') eyeIcon1!: TemplateRef<any>;
    @ViewChild('eyeIcon2') eyeIcon2!: TemplateRef<any>;
    @ViewChild('eyeIcon3') eyeIcon3!: TemplateRef<any>;
    @ViewChild('eyeIcon4') eyeIcon4!: TemplateRef<any>;

    ngAfterViewInit() {
        this.gridConfig.columnsList.find(col => col.key === 'itemName')!.template = this.eyeIcon1;
        this.gridConfig.columnsList.find(col => col.key === 'receivedQty')!.template = this.eyeIcon2;
        this.gridConfig.columnsList.find(col => col.key === 'issueQty')!.template = this.eyeIcon3;
        this.gridConfig.columnsList.find(col => col.key === 'returnQty')!.template = this.eyeIcon4;
    }

    allcurrentColumn = [
        {
            heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250,
            type: gridColumnTypes.template,template:this.eyeIcon1
         },
        { heading: "ReceivedQty", key: "receivedQty", sort: true, align: 'left', emptySign: 'NA', width: 100,
            type: gridColumnTypes.template,template:this.eyeIcon2
         },
        { heading: "IssueQty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA', width: 100,
            type: gridColumnTypes.template,template:this.eyeIcon3
         },
        { heading: "BalanceQty", key: "balanceQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ReturnQty", key: "returnQty", sort: true, align: 'left', emptySign: 'NA', width: 100,
            type: gridColumnTypes.template,template:this.eyeIcon4
         },
    ]
    allcurrentFilters = [
        { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals },
        { fieldName: "ItemName", fieldValue: this.itemName, opType: OperatorComparer.StartsWith }
    ]

    gridConfig: gridModel = {
        apiUrl: "CurrentStock/StorewiseCurrentStockList",
        columnsList: this.allcurrentColumn,
        sortField: "StoreId",
        sortOrder: 0,
        filters: this.allcurrentFilters
    }

    getfiltercurrentStock() {
        debugger
        console.log(this._CurrentStockService.SearchGroup.get('ItemCategory').value)
        console.log(this.itemName)
        // if(this._CurrentStockService.SearchGroup.get('ItemCategory').value=='%')
        this.gridConfig = {
            apiUrl: "CurrentStock/StorewiseCurrentStockList",
            columnsList: this.allcurrentColumn,
            sortField: "StoreId",
            sortOrder: 0,
            filters: [
                { fieldName: "StoreId", fieldValue: String(this.storeId), opType: OperatorComparer.Equals },
                { fieldName: "ItemName", fieldValue: this.itemName, opType: OperatorComparer.StartsWith },
            ]
        }
        console.log(this.gridConfig)
        this.grid1.gridConfig = this.gridConfig;
        this.grid1.bindGridData();
    }

    selectChangeStore(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.storeId = obj.value
        else
            this.storeId = "0"

        this.getfiltercurrentStock();
    }
    // selectChangeItem(obj: any) {
    //     debugger
    //     console.log(obj)
    //     if (obj.value !== 0) {
    //         this.itemName = obj.itemName
    //     } else {
    //         this.itemName = "%"
    //     }
    //     this.getfiltercurrentStock();
    // }

    formattedText:any;

    selectChangeItem(obj: any) {
    debugger;
    console.log(obj);
    this.gridConfig.filters[1].fieldValue=obj.formattedText

    if (obj && obj.itemId) {
        this.itemName = obj.itemName;
        this.formattedText=obj.formattedText
    } else {
        this.itemName = "%";
    }

    this.getfiltercurrentStock();
}


    // Day wise current stock

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

    alldayWiseColumn = [
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
    alldayWiseFilter = [
        { fieldName: "LedgerDate", fieldValue: this.onlyStart, opType: OperatorComparer.StartsWith },
        { fieldName: "StoreId", fieldValue: String(this.storeDayWise), opType: OperatorComparer.Equals },
        { fieldName: "ItemId", fieldValue: String(this.DaywiseitemName), opType: OperatorComparer.Equals },
    ]

    gridConfig1: gridModel = {
        apiUrl: "CurrentStock/DayWiseCurrentStockList",
        columnsList: this.alldayWiseColumn,
        sortField: "StoreId",
        sortOrder: 0,
        filters: this.alldayWiseFilter
    }

    onChangedayWise() {
        debugger
        this.onlyStart = this.datePipe.transform(this._CurrentStockService.dayWiseForm.get('start').value, "yyyy-MM-dd")
        this.getfilterdayWise();
    }

    getfilterdayWise() {
        debugger
        this.gridConfig1 = {
            apiUrl: "CurrentStock/DayWiseCurrentStockList",
            columnsList: this.alldayWiseColumn,
            sortField: "StoreId",
            sortOrder: 0,
            filters: [
                { fieldName: "LedgerDate", fieldValue: this.onlyStart, opType: OperatorComparer.StartsWith },
                { fieldName: "StoreId", fieldValue: String(this.storeDayWise), opType: OperatorComparer.Equals },
                { fieldName: "ItemId", fieldValue: String(this.DaywiseitemName), opType: OperatorComparer.Equals },
            ]
        }
        console.log(this.gridConfig1)
        this.grid2.gridConfig = this.gridConfig1;
        this.grid2.bindGridData();
    }

    selectChangeStore1(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.storeDayWise = obj.value
        else
            this.storeDayWise = "0"

        this.onChangedayWise();
    }
    selectChangeItem1(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.DaywiseitemName = obj.itemId
        else
            this.DaywiseitemName = "0"

        this.onChangedayWise();
    }

    // item wise sales summery

    allSalesColumn = [
        { heading: "ItemName", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Conversion Factor", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Current BalQty", key: "balQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ReceivedQty", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Sales Qty", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    ]
    allSalesFilter = [
        { fieldName: "FromDate", fieldValue: this.salesFromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "todate", fieldValue: this.salesToDate, opType: OperatorComparer.StartsWith },
        { fieldName: "StoreId", fieldValue: String(this.storeSales), opType: OperatorComparer.Equals }, //2
        { fieldName: "ItemId", fieldValue: String(this.SaleitemName), opType: OperatorComparer.Equals }, //1
    ]

    gridConfig2: gridModel = {
        apiUrl: "CurrentStock/ItemWiseSalesSummaryList",
        columnsList: this.allSalesColumn,
        sortField: "ItemId",
        sortOrder: 0,
        filters: this.allSalesFilter
    }

    onChangeSales() {
        debugger
        this.salesFromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get('startSales').value, "yyyy-MM-dd")
        this.salesToDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get('endSales').value, "yyyy-MM-dd")
        this.getfilterSales();
    }

    getfilterSales() {
        debugger
        this.gridConfig2 = {
            apiUrl: "CurrentStock/ItemWiseSalesSummaryList",
            columnsList: this.allSalesColumn,
            sortField: "ItemId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.salesFromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "todate", fieldValue: this.salesToDate, opType: OperatorComparer.StartsWith },
                { fieldName: "StoreId", fieldValue: String(this.storeSales), opType: OperatorComparer.Equals }, //2
                { fieldName: "ItemId", fieldValue: String(this.SaleitemName), opType: OperatorComparer.Equals }, //1
            ]
        }
        console.log(this.gridConfig2)
        this.grid3.gridConfig = this.gridConfig2;
        this.grid3.bindGridData();
    }

    selectChangeStore2(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.storeSales = obj.value
        else
            this.storeSales = "0"
        this.onChangeSales();
    }

    selectChangeItem2(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.SaleitemName = obj.itemId
        else
            this.SaleitemName = "0"
        this.onChangeSales();
    }

    // Issue wise item summery
    allItemColumn = [
        { heading: "ItemName", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Conversion Factor", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Current BalQty", key: "balQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "ReceivedQty", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Sales Qty", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    ]
    allItemFilter = [
        { fieldName: "FromDate", fieldValue: this.lastFromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "todate", fieldValue: this.lastToDate, opType: OperatorComparer.StartsWith },
        { fieldName: "StoreId", fieldValue: String(this.storeItem), opType: OperatorComparer.Equals }, //2
        { fieldName: "ItemId", fieldValue: String(this.lastitemName), opType: OperatorComparer.Equals }, //1
    ]
    gridConfig3: gridModel = {
        apiUrl: "CurrentStock/IssueWiseItemSummaryList",
        columnsList: this.allItemColumn,
        sortField: "ItemId",
        sortOrder: 0,
        filters: this.allItemFilter
    }

    onChangeItem() {
        debugger
        this.lastFromDate = this.datePipe.transform(this._CurrentStockService.IssueItem.get('laststart').value, "yyyy-MM-dd")
        this.lastToDate = this.datePipe.transform(this._CurrentStockService.IssueItem.get('lastend').value, "yyyy-MM-dd")
        this.getfilterItem();
    }

    getfilterItem() {
        debugger
        this.gridConfig3 = {
            apiUrl: "CurrentStock/IssueWiseItemSummaryList",
            columnsList: this.allItemColumn,
            sortField: "ItemId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.lastFromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "todate", fieldValue: this.lastToDate, opType: OperatorComparer.StartsWith },
                { fieldName: "StoreId", fieldValue: String(this.storeItem), opType: OperatorComparer.Equals }, //2
                { fieldName: "ItemId", fieldValue: String(this.lastitemName), opType: OperatorComparer.Equals }, //1
            ]
        }
        console.log(this.gridConfig3)
        this.grid4.gridConfig = this.gridConfig3;
        this.grid4.bindGridData();
    }

    selectChangeStore3(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.storeItem = obj.value
        else
            this.storeItem = "0"

        this.onChangeItem();
    }
    selectChangeItem3(obj: any) {
        console.log(obj)
        if (obj.value !== 0)
            this.lastitemName = obj.itemId
        else
            this.lastitemName = "0"

        this.onChangeItem();
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
    //         "FromDate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
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
    //         "FromDate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "todate": this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900',
    //         "StoreId": this._loggedService.currentUserValue.storeId || 0,
    //         "ItemId": this._CurrentStockService.IssueItem.get('ItemCategory').value.ItemID || 0
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
        console.log(contact)
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
            this.getfiltercurrentStock();
        });
    }
    getIssueSummery(contact) {
        console.log(contact)
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
            this.getfiltercurrentStock();
        });
    }
    getSalesSummery(contact) {
        console.log(contact)
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
            this.getfiltercurrentStock();
        });
    }
    getSalesReturnSummery(contact) {
        console.log(contact)
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
            this.getfiltercurrentStock();
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
        let LedgerDate = this.datePipe.transform(this._CurrentStockService.dayWiseForm.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.dayWiseForm.get("StoreId").value.StoreId || 0
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
        let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let todate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
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
        let FromDate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let todate = this.datePipe.transform(this._CurrentStockService.ItemWiseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '01/01/1900'
        let StoreId = this._loggedService.currentUserValue.storeId || this._CurrentStockService.dayWiseForm.get("StoreId").value.StoreId || 0
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

