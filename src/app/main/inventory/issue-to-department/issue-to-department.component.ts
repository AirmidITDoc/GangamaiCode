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
    vVatPer: any;
    vCgstPer: any;
    vSgstPer: any;
    vIgstPer: any;
    vStockId: any;
    vPurchaseRate: any;
    chargeslist: any = [];
    vItemID: any;
    vFinalTotalAmount: any;
    vFinalNetAmount: any;
    vFinalGSTAmount: any;
    vAgainstIndet: boolean = false;
    vBarcode:any;
    vBatchNo:any;
    vBalanceQty: any;
    vQty:any;
    vLandedRate: any;
    vTotalAmount: any;
    dsNewIssueList1 = new MatTableDataSource<IssueItemList>();
    dsNewIssueList3 = new MatTableDataSource<NewIssueList3>();
    dsTempItemNameList = new MatTableDataSource<NewIssueList3>();
    tempdata: any = [];
    ItemSamelist: any = [];
    BatchSamelist: any = [];
    MRPSamelist: any = [];
    vBarcodeflag: boolean = false;
    vUnitMRP: any;
    vBatchExpDate:any;
    vsaveflag: boolean = true;
    ItemName: any;
    vremark:any;
    savebtn: boolean = false;
    
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType"; //Item
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

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
        apiUrl: "IssueToDepartment/IssueToDepttList",
        columnsList: [
            { heading: "IsAccepted", key: "isAcc", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IssueNo", key: "issueNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Issue Date", key: "issueDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "From Store Name", key: "fromStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "To StoreName", key: "toStoreId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "From StoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
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
            apiUrl: "IssueToDepartment/IssueToDepttList",
            columnsList: [
                { heading: "Status", key: "status", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Batch Exp Date", key: "date", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "GST%", key: "gst", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Rate", key: "rate", sort: true, align: 'left', emptySign: 'NA' },
                { heading: "Total Amount", key: "amt", sort: true, align: 'left', emptySign: 'NA' }
            ],
            sortField: "IssueId",
            sortOrder: 0,
            filters: [
                // { fieldName: "FromStoreId", fieldValue: "10009", opType: OperatorComparer.Equals },
                // { fieldName: "ToStoreId", fieldValue: "10003", opType: OperatorComparer.Equals },
                // { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
                // { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
                // { fieldName: "Status", fieldValue: "1", opType: OperatorComparer.Equals }
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

    onAdd($event) {
        if (this.vBarcode == 0) {

            if (!this._IssueToDep.NewIssueGroup.get('ItemID')?.value) {
                this.toastr.warning('Please enter a item', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
            if ((this.vQty == '' || this.vQty == null || this.vQty == undefined)) {
                this.toastr.warning('Please enter a Qty', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        this.ItemSamelist = this.dsNewIssueList3.data.filter(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId)
        if (this.ItemSamelist) {
            if (this.ItemSamelist.some(item => item.BatchNo === this.vBatchNo) && this.ItemSamelist.some(item => item.LandedRate === this.vLandedRate)) {
                this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        this.BatchSamelist = this.dsNewIssueList3.data.filter(item => item.BatchNo === this.vBatchNo)
        if (this.BatchSamelist) {
            if (this.BatchSamelist.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId) && this.BatchSamelist.some(item => item.LandedRate === this.vLandedRate)) {
                this.toastr.warning('Selected Item already added with same Batch & same MRP in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }
        this.MRPSamelist = this.dsNewIssueList3.data.filter(item => item.LandedRate === this.vLandedRate)
        if (this.MRPSamelist) {
            if (this.MRPSamelist.some(item => item.ItemId === this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId) && this.MRPSamelist.some(item => item.BatchNo === this.vBatchNo)) {
                this.toastr.warning('Selected Item already added with same Batch &  same MRP in the list', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
                return;
            }
        }

        if (!this.vBarcodeflag) {

            let gstper = ((this.vCgstPer) + (this.vSgstPer) + (this.vIgstPer));

            this.chargeslist = this.dsTempItemNameList.data;

            let TotalMRP = this.vUnitMRP * this.vQty
            let PurTotAmt = this.vPurchaseRate * this.vQty

            let LandedRateandedTotal = this.vLandedRate * this.vQty

            let GSTAmount = (((this.vUnitMRP) * (this.vVatPer) / 100) * parseInt(this.vQty)).toFixed(2);

            this.chargeslist.push(
                {
                    ItemId: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemId || 0,
                    ItemName: this._IssueToDep.NewIssueGroup.get('ItemID').value.ItemName || '',
                    BatchNo: this.vBatchNo,
                    BatchExpDate: this.vBatchExpDate || '01/01/1900',
                    BalanceQty: this.vBalanceQty || 0,
                    Qty: this.vQty || 0,
                    LandedRate: this.vLandedRate || 0,
                    UnitMRP: this.vUnitMRP || 0,
                    VatPer: gstper || 0,
                    VatAmount: (((this.vTotalAmount) * (gstper)) / 100).toFixed(2),
                    TotalAmount: this.vTotalAmount || 0,
                    StockId: this.vStockId,

                    TotalMRP: TotalMRP,
                    DiscPer: 0,// contact.DiscPer || 0,
                    DiscAmt: 0,
                    NetAmt: LandedRateandedTotal,
                    RoundNetAmt: Math.round(LandedRateandedTotal),// Math.round(TotalNet),
                    mrpTotalAmount: TotalMRP,

                    //LandedRate: this.vLandedRate,
                    LandedRateandedTotal: LandedRateandedTotal,
                    CgstPer: this.vCgstPer,
                    //   CGSTAmt: CGSTAmt,
                    SgstPer: this.vSgstPer,
                    //   SGSTAmt: SGSTAmt,
                    IgstPer: this.vIgstPer,
                    //   IGSTAmt: IGSTAmt,
                    PurchaseRate: this.vPurchaseRate,
                    PurTotAmt: PurTotAmt,
                    purTotalAmount: PurTotAmt,
                    //   MarginAmt: v_marginamt,
                    SalesDraftId: 1
                });
            console.log(this.chargeslist);
            this.dsNewIssueList3.data = this.chargeslist
        }

        this.ItemReset();
        // this.itemid.nativeElement.focus();
        this._IssueToDep.NewIssueGroup.get('ItemID').setValue('');
        this.Addflag = false;

        if (!(this._IssueToDep.NewIssueGroup.invalid) && this.dsNewIssueList3.data.length > 0) {
            this.vsaveflag = false;
        }
    }

    deleteTableRow(element) {
        let index = this.chargeslist.indexOf(element);
        if (index >= 0) {
            this.chargeslist.splice(index, 1);
            this.dsNewIssueList3.data = [];
            this.dsNewIssueList3.data = this.chargeslist;
        }
        this.toastr.success('Record Deleted Successfully.', 'Deleted !', {
            toastClass: 'tostr-tost custom-toast-success',
        });
    }

    getTotalamt(element) {
        this.vFinalTotalAmount = (element.reduce((sum, { LandedRateandedTotal }) => sum += +(LandedRateandedTotal || 0), 0)).toFixed(2);
        this.vFinalGSTAmount = (element.reduce((sum, { VatAmount }) => sum += +(VatAmount || 0), 0)).toFixed(2);
        this.vFinalNetAmount = (parseFloat(this.vFinalGSTAmount) + parseFloat(this.vFinalTotalAmount)).toFixed(2);
        return this.vFinalTotalAmount;
    }

    getCellCalculation(contact, Qty) {

        /// this.Indbalqty = parseInt(contact.TotalIndQty) - parseInt(contact.Qty);

        if (parseFloat(contact.Qty) > parseFloat(contact.BalanceQty)) {
            this.toastr.warning('Issue Qty cannot be greater than BalanceQty.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            contact.Qty = 0;
            contact.Qty = '';
            contact.VatAmount = 0;
            contact.LandedRateandedTotal = 0;
        }
        else {
            if (contact.Qty > 0) {
                contact.LandedRateandedTotal = (parseFloat(contact.Qty) * parseFloat(contact.LandedRate)).toFixed(2);
                contact.VatAmount = ((parseFloat(contact.VatPer) * parseFloat(contact.LandedRateandedTotal)) / 100).toFixed(2);
            }
            else {
                contact.Qty = 0;
                contact.Qty = '';
                contact.VatAmount = 0;
                contact.LandedRateandedTotal = 0;
            }
        }
    }

    keyPressAlphanumeric(event) {
        var inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    OnReset() {
        this._IssueToDep.NewIssueGroup.reset();
        this.dsNewIssueList1.data = [];
        this.dsNewIssueList3.data = [];
        this.chargeslist.data = [];
        this.dsTempItemNameList.data = [];
        this._IssueToDep.IssueFinalForm.reset();
    }

    ItemReset() {
        this.ItemName = " ";
        this.vItemID = 0;
        this.vBatchNo = " ";
        this.vBalanceQty = 0;
        this.vQty = 0;
        this.vLandedRate = 0;
        this.vTotalAmount = 0;
    }

    OnSave(){

    }

    selectChangeStore(obj: any) {
        console.log(obj)
    }

    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "95vw",
                height: '95%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }

    OnIndent() {
        const dialogRef = this._matDialog.open(IssueToDeparmentAgainstIndentComponent,
            {
                maxWidth: "100%",
                height: '95%',
                width: '95%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            // this.dsNewIssueList1.data = result;
            console.log(result)
            // this.vIndentId = result[0].IndentId;

            // const toSelectToStoreId = this.ToStoreList1.find(c => c.StoreId == result[0].FromStoreId);
            // this._IssueToDep.NewIssueGroup.get('ToStoreId').setValue(toSelectToStoreId);
            // console.log(this.vIndentId)
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