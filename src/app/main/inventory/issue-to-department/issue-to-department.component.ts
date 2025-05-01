import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { IssueToDepartmentService } from './issue-to-department.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { DatePipe } from '@angular/common';
import { difference, indexOf, round, values } from 'lodash';
import { AuthenticationService } from 'app/core/services/authentication.service';
import Swal from 'sweetalert2';
import { SalePopupComponent } from 'app/main/pharmacy/sales/sale-popup/sale-popup.component';
import { ToastrService } from 'ngx-toastr';
import { element } from 'protractor';
import { FormControl } from '@angular/forms';
import { Observable, ReplaySubject, Subject } from 'rxjs';
import { map, startWith, takeUntil } from "rxjs/operators";
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { IssueToDeparmentAgainstIndentComponent } from './issue-to-deparment-against-indent/issue-to-deparment-against-indent.component';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
    selector: 'app-issue-to-department',
    templateUrl: './issue-to-department.component.html',
    styleUrls: ['./issue-to-department.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class IssueToDepartmentComponent implements OnInit {
    hasSelectedContacts: boolean;
   
    dsNewIssueList1 = new MatTableDataSource<IssueItemList>();
    
    dsTempItemNameList = new MatTableDataSource<NewIssueList3>();
    tempdata: any = [];
    ItemSamelist: any = [];
    BatchSamelist: any = [];
       
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType"; //Item
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();
    displayedNewIssuesList3: string[] = [
        'ItemId',
        'ItemName',
        'BatchNO',
        'ExpDate',
        'BalanceQty',
        'Qty',
        'UnitRate',
        'GSTPer',
        'GSTAmount',
        'TotalAmount',
        'Action'
    ];
    displayedNewIssuesList1: string[] = [
        'ItemName',
        'Qty',
        'Action'
    ]

    // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    @ViewChild('grid') grid: AirmidTableComponent;
    @ViewChild('grid1') grid1: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "IssueToDepartment/IssueToDeptList",
        columnsList: [
            { heading: "IsAccepted", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IssueNo", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Issue Date", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "From Store Name", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "To StoreName", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "AddedBy", key: "addedby", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Total Amount", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "GST Amount", key: "gstAmt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Net Amount", key: "netAmt", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Remark", key: "remark", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Recevied Bonus", key: "receviedBonus", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            {
                heading: "Action", key: "action", width: 50, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.print, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "IssueId",
        sortOrder: 0,
        filters: [
            { fieldName: "FromStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: "10003", opType: OperatorComparer.Equals },
            { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
            { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
        ]
    }

    gridConfig1: gridModel = new gridModel();
    isShowDetailTable: boolean = false;
    GetDetails1(data) {
        
        this.gridConfig1 = {
            apiUrl: "IssueToDepartment/IssueToDeptdetailList",
            columnsList: [
                { heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Batch Exp Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "GST%", key: "vatPercentage", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Rate", key: "perUnitLandedRate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Total Amount", key: "landedTotalAmount", sort: true, align: 'left', emptySign: 'NA' }
            ],
            sortField: "IssueId",
            sortOrder: 0,
            filters: [
                { fieldName: "IssueId", fieldValue: "10009", opType: OperatorComparer.Equals },
                
            ]
        }
        this.isShowDetailTable = true;
        this.grid1.gridConfig = this.gridConfig1;
        this.grid1.bindGridData();
    }

    constructor(
        public _IssueToDep: IssueToDepartmentService,
        public toastr: ToastrService,
         public _matDialog: MatDialog,
         public datePipe: DatePipe
    ) { }

    ngOnInit(): void { }

    getOptionTextStores(){

    }

    selectChangeItem(data){

    }

    AgainstInd: boolean = true;
    getAgainstIndet(event) {
        if (event.checked == true) {
            this.AgainstInd = false;
        } else {
            this.AgainstInd = true;
        }

    }

    Addflag: boolean = false;
    tempDatasource = new MatTableDataSource<IssueItemList>();
    DraftQty: any = 0;
    barcodeItemfetch() {
        this.Addflag = true;
        var d = {
            // "StockId": this._IssueToDep.NewIssueGroup.get("Barcode").value || 0,
            // "StoreId": this._loggedService.currentUserValue.user.storeId || 0
        }
        this._IssueToDep.getCurrentStockItem(d).subscribe(data => {
            this.tempDatasource.data = data as any;
            
            if (this.tempDatasource.data.length >= 1) {
                this.tempDatasource.data.forEach((element) => {
                    this.DraftQty = 1;
                    this.onAddBarcodeItemList(element, this.DraftQty);
                });
            }
            else if (this.tempDatasource.data.length == 0) {
                this.toastr.error('Item Not Found !', 'Error !', {
                    toastClass: 'tostr-tost custom-toast-error',
                });
            }
        });
        // this.vBarcode = '';
        this.Addflag = false
    }

    onAddBarcodeItemList(contact, DraftQty) {
      
    }
    selectChangeStore(obj: any) {
        console.log(obj)
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "95vw",
                height: '80%',
                width: '95%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

 

}

export class NewIssueList3 {

    ItemId: any;
    ItemName: any;
    BatchNO: any;
    ExpDate: any;
    BalanceQty: any;
    Qty: any;
    UnitRate: any;
    TotalAmount: any;
    BatchNo: string;
    BatchExpDate: any;
    QtyPerDay: any;
    UnitMRP: any;
    Bal: number;
    StoreId: any;
    StoreName: any;
    GSTPer: any;
    GSTAmount: any;
    TotalMRP: any;
    DiscPer: any;
    DiscAmt: any;
    NetAmt: any;
    StockId: any;
    ReturnQty: any;
    Total: any;
    VatPer: any;
    VatAmount: any;
    LandedRate: any;
    CgstPer: any;
    CGSTAmt: any;
    SgstPer: any;
    SGSTAmt: any;
    IgstPer: any;
    IGSTAmt: any;
    DiscAmount: any;
    NetAmount: any;
    ExpDateNo; any;
    BalQty: any;
    PurchaseRate: any;
    LandedRateandedTotal: any;
    PurTotAmt: any;
    IndentId: any;
    IndentDetailsId: any;
    IndQty: any;
    IsClosed: any;
    constructor(NewIssueList3) {
        this.ItemId = NewIssueList3.ItemId || 0;
        this.ItemName = NewIssueList3.ItemName || '';
        this.BatchNO = NewIssueList3.BatchNO || 0;
        this.ExpDate = NewIssueList3.ExpDate || 1 / 2 / 23;
        this.BalanceQty = NewIssueList3.BalanceQty || 0;
        this.Qty = NewIssueList3.Qty || 0;
        this.UnitRate = NewIssueList3.UnitRate || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.BatchExpDate = NewIssueList3.BatchExpDate || "";
        this.UnitMRP = NewIssueList3.UnitMRP || "";
        this.QtyPerDay = NewIssueList3.QtyPerDay || 0;
        this.Bal = NewIssueList3.Bal || 0;
        this.StoreId = NewIssueList3.StoreId || 0;
        this.StoreName = NewIssueList3.StoreName || '';
        this.GSTPer = NewIssueList3.GSTPer || "";
        this.TotalMRP = NewIssueList3.TotalMRP || 0;
        this.DiscAmt = NewIssueList3.DiscAmt || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.StockId = NewIssueList3.StockId || 0;
        this.NetAmt = NewIssueList3.NetAmt || 0;
        this.ReturnQty = NewIssueList3.ReturnQty || 0;
        this.TotalAmount = NewIssueList3.TotalAmount || 0;
        this.Total = NewIssueList3.Total || '';
        this.VatPer = NewIssueList3.VatPer || 0;
        this.VatAmount = NewIssueList3.VatAmount || 0;
        this.LandedRate = NewIssueList3.LandedRate || 0;
        this.CgstPer = NewIssueList3.CgstPer || 0;
        this.CGSTAmt = NewIssueList3.CGSTAmt || 0;
        this.SgstPer = NewIssueList3.SgstPer || 0;
        this.SGSTAmt = NewIssueList3.SGSTAmt || 0;
        this.IgstPer = NewIssueList3.IgstPer || 0;
        this.IGSTAmt = NewIssueList3.IGSTAmt || 0;
        this.NetAmount = NewIssueList3.NetAmount || 0;
        this.DiscAmount = NewIssueList3.DiscAmount || 0;
        this.ExpDateNo = NewIssueList3.ExpDateNo || 1 / 2 / 23;
        this.BalQty = NewIssueList3.BalQty || 0;
        this.PurchaseRate = NewIssueList3.PurchaseRate || 0;
        this.LandedRateandedTotal = NewIssueList3.LandedRateandedTotal || 0;
        this.PurTotAmt = NewIssueList3.PurTotAmt || 0;

    }
}



export class IssueItemList {
    ItemId: any;
    ItemName: string;
    BatchNo: number;
    BatchExpDate: number;
    Qty: number;
    PerUnitLandedRate: number;
    LandedTotalAmount: number;
    VatPercentage: number;
    StoreId: any;
    StoreName: any;
    IndentId: any;
    IndentDetailsId: any;
    IsClosed: any;

    constructor(IssueItemList) {
        {
            this.ItemId = IssueItemList.ItemId || 0;
            this.ItemName = IssueItemList.ItemName || "";
            this.BatchNo = IssueItemList.BatchNo || 0;
            this.BatchExpDate = IssueItemList.BatchExpDate || 0;
            this.Qty = IssueItemList.Qty || 0;
            this.PerUnitLandedRate = IssueItemList.PerUnitLandedRate || 0;
            this.LandedTotalAmount = IssueItemList.LandedTotalAmount || 0;
            this.VatPercentage = IssueItemList.VatPercentage || 0;
            this.StoreId = IssueItemList.StoreId || 0;
            this.StoreName = IssueItemList.StoreName || "";
            this.IndentId = IssueItemList.IndentId || 0;
            this.IndentDetailsId = IssueItemList.IndentDetailsId || 0;
            this.IsClosed = IssueItemList.IsClosed || 0;
        }
    }
}

export class IssueToDep {
    IssueNo: Number;
    IssueDate: number;
    FromStoreName: string;
    ToStoreName: string;
    NetAmount: number;
    Remark: string;
    Receivedby: string;
    IssueDepId: number;

    constructor(IssueToDep) {
        {
            this.IssueNo = IssueToDep.IssueNo || 0;
            this.IssueDate = IssueToDep.IssueDate || 0;
            this.FromStoreName = IssueToDep.FromStoreName || "";
            this.ToStoreName = IssueToDep.ToStoreName || "";
            this.NetAmount = IssueToDep.NetAmount || 0;
            this.Remark = IssueToDep.Remark || "";
            this.Receivedby = IssueToDep.Receivedby || "";
            this.IssueDepId = IssueToDep.IssueDepId || 0;
        }
    }
}