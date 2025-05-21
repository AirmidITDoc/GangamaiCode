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
import { FormControl, FormGroup } from '@angular/forms';
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
import { ChargesList } from 'app/main/ipd/ip-search-list/ip-search-list.component';

@Component({
    selector: 'app-stock-adjustment',
    templateUrl: './stock-adjustment.component.html',
    styleUrls: ['./stock-adjustment.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})

export class StockAdjustmentComponent implements OnInit {
    hasSelectedContacts: boolean;
    StoreFrom: FormGroup;

    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";

    sIsLoading: string = '';
    isLoading = true;
    StoreList: any = [];
    screenFromString = 'admission-form';
    isItemIdSelected: boolean = false;
    ItemName: any;
    ItemId: any;
    dateTimeObj: any;
    ItemList: any = [];
    OptionsItemName: any;
    filteredoptionsItemName: Observable<string[]>;
    vBatchNo: any;
    vQty: any;
    vMRP: any;
    vUpdatedQty: any;
    vBalQty: any;

    vStatus: any;
    vStockId: any;
    AddType: any;
    vExpDate: any;
    vPurchaseRate: any;
    vBatchEdit: any;
    vExpDateEdit: any;
    vDeudQty: any;

    displayedColumns = [
        'batchNo',
        'batchEdit',
        'batchExpDate',
        'expDateEdit',
        'unitMRP',
        'purUnitRateWF',
        'landedRate',
        'balanceQty',
        // 'Addition',
        // 'Deduction',
        'vatPercentage',
        'conversionFactor'
    ];

    dsStockAdjList = new MatTableDataSource<StockAdjList>();

    constructor(
        public _StockAdjustmentService: StockAdjustmentService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        public datePipe: DatePipe,
    ) { }

    ngOnInit(): void {
        this.StoreFrom = this._StockAdjustmentService.CreateStoreFrom();
        this.getStockList();
    }

    storeId = 0
    selectChangeStore(obj: any) {
        this.storeId = obj.value
    }

    itemId = 0
    selectChangeItem(obj: any) {
        console.log(obj)
        this.itemId = obj.itemId
        this.getStockList();
    }

    onClear() { }
    getStockList() {
        var Param = {
            "first": 0,
            "rows": 10,
            "sortField": "ItemId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "StoreId",
                    "fieldValue": "2",
                    "opType": "Equals"
                },
                {
                    "fieldName": "ItemId",
                    "fieldValue": String(this.itemId),
                    "opType": "Equals"
                }
            ],
            "exportType": "JSON",
            "columns": [
                {
                    "data": "string",
                    "name": "string"
                }
            ]
        }
        console.log(Param)
        this._StockAdjustmentService.getStockList(Param).subscribe(data => {
            this.dsStockAdjList.data = data.data as StockAdjList[];
            console.log(this.dsStockAdjList)
        });
    }

   
    // AddQty(contact, AddQty) {
    //     if (contact.AddQty > 0) {
    //         contact.UpdatedQty = parseFloat(contact.BalanceQty) + parseFloat(contact.AddQty);
    //         this.AddType = 1;
    //     } else {
    //         contact.UpdatedQty = 0;
    //     }
    //     this.vUpdatedQty = contact.UpdatedQty;
    //     this.vQty = contact.AddQty;
    //     this.vBalQty = contact.BalanceQty;
    //     this.vStockId = contact.StockId;
    //     this.vBatchNo = contact.BatchNo;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    // }
    // DeduQty(contact, DeduQty) {
    //     if (contact.DeduQty > 0) {
    //         contact.UpdatedQty = parseFloat(contact.BalanceQty) - parseFloat(contact.DeduQty);
    //         this.AddType = 0;
    //     } else {
    //         contact.UpdatedQty = 0;
    //     }
    //     this.vUpdatedQty = contact.UpdatedQty,
    //         this.vQty = contact.DeduQty;
    //     this.vBalQty = contact.BalanceQty;
    //     this.vStockId = contact.StockId;
    //     this.vBatchNo = contact.BatchNo;
    //     this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
    //         toastClass: 'tostr-tost custom-toast-warning',
    //     });
    // }

    batchEdit: boolean = false;
    // BatchenableEditing(row: StockAdjList) {
    //   row.batchEdit = true;
    //   row.batchEdit = '';
    // }


    OneditBatch(contact) {
        debugger

        console.log(contact)
        this.vBatchNo = contact.batchNo
        this.vExpDate = contact.batchExpDate;
        this.vBatchEdit = contact.batchEdit;
        this.vExpDateEdit = contact.batchExpDate;
        this.vStockId = contact.stockId;
        this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
    }
    // onsaveStockAdj() {
    //     let isCheckQty: any;
    //     if (isCheckQty = this.dsStockAdjList.data.some(item => item.AddQty != '')) {
    //         this.OnSaveStockAdjustment();
    //     }
    //     else if (isCheckQty = this.dsStockAdjList.data.some(item => item.DeduQty < this.vBalQty || item.AddQty == '')) {
    //         this.OnSaveStockAdjustment();
    //     }
    //     else {
    //         this.toastr.warning('Please enter a Qty', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //     }
    // }

    // OnSaveStockAdjustment() {

    //     if ((!this.dsStockAdjList.data.length)) {
    //         this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //         return;
    //     }

    //     let submitData = {

    //         "storeId": this.accountService.currentUserValue.storeId || 0,
    //         "stkId": this.vStockId || 0,
    //         "itemId": this.StoreFrom.get('ItemID').value.itemId || 0,
    //         "batchNo": this.vBatchNo || '',
    //         "adDdType": this.AddType,
    //         "adDdQty": this.vQty || 0,
    //         "preBalQty": this.vBalQty || 0,
    //         "afterBalQty": this.vUpdatedQty || 0,
    //         "addedBy": this.accountService.currentUserValue.userId || 0,
    //         "stockAdgId": 0
    //     }

    //     console.log(submitData);
    //     this._StockAdjustmentService.StockAdjSave(submitData).subscribe(response => {
    //         this.toastr.success(response.message);
    //         this._matDialog.closeAll();

    //     });
    // }
    resetFormItem() {

    }

    getLastDayOfMonth(month: number, year: number): number {
        return new Date(year, month, 0).getDate();
    }
    pad(n: number): string {
        return n < 10 ? '0' + n : n.toString();
    }
    lastDay1: any;
    vlastDay: string = '';
    lastDay2: string = '';

    CellcalculateLastDay(contact, inputDate: string) {

        if (inputDate && inputDate.length === 6) {
            const month = +inputDate.substring(0, 2);
            const year = +inputDate.substring(2, 6);

            if (month >= 1 && month <= 12) {
                const lastDay1 = this.getLastDayOfMonth(month, year);
                this.lastDay1 = `${lastDay1}/${this.pad(month)}/${year}`;
                this.lastDay2 = `${year}/${this.pad(month)}/${lastDay1}`;
                //console.log(this.lastDay2)
                contact.ExpDateEdit = this.lastDay1;
                this.vExpDateEdit = this.lastDay1;
            } else {
                this.vlastDay = 'Invalid month';
            }
        } else {
            this.vlastDay = ' ';
        }
        this.vBatchNo = contact.batchNo
        this.vExpDate = contact.batchExpDate;
        this.vBatchEdit = contact.batchNo;
        this.vExpDateEdit = contact.batchExpDate;
        this.vStockId = contact.stockId;
        this.toastr.warning('Record Not Saved Please Save Record', 'Warning !', {
            toastClass: 'tostr-tost custom-toast-warning',
        });
    }
    OnSaveBatchAdj() {
        debugger
        // const chkExpDate = this.dsStockAdjList.data.some((item) => item.expDateEdit == this.vlastDay);
        // if (!chkExpDate) {
            if (this.vExpDateEdit) {
                this.OnSaveBatchAdjustment()
            } else {
                this.toastr.warning('Please enter BatchExpDate', 'Warning !', {
                    toastClass: 'tostr-tost custom-toast-warning',
                });
            }
        // } else {
        //     this.toastr.warning('Please enter BatchExpDate', 'Warning !', {
        //         toastClass: 'tostr-tost custom-toast-warning',
        //     });
        // }
    }
    Lastbatch: string = '';
    // OnSaveBatch() {
    //     const chkBatchNo = this.dsStockAdjList.data.some((item) => item.BatchEdit ==  this.Lastbatch);
    //     if (this.vBatchEdit) {
    //         this.OnSaveBatchAdjustment();
    //     }
    //     else {
    //         this.toastr.warning('Please enter BatchNo', 'Warning !', {
    //             toastClass: 'tostr-tost custom-toast-warning',
    //         });
    //     }

    // }

    OnSaveBatchAdjustment() {
        debugger

        if ((!this.dsStockAdjList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
           this.dsStockAdjList.data.forEach(element => {
                if (element.expDateEdit && element.expDateEdit.length === 10) {
                    const day = +element.expDateEdit.substring(0, 2);
                    const month = +element.expDateEdit.substring(3, 5);
                    const year = +element.expDateEdit.substring(6, 10);

                    this.vExpDate = `${year}/${this.pad(month)}/${day}`;
                    // console.log(this.vExpDate)
                }
            })


            let submitData = {
                "batchAdjId": 0,
                "storeId": this.accountService.currentUserValue.user.storeId || 0,
                "itemId": this.StoreFrom.get('ItemID').value.itemId || 0,
                "oldBatchNo": this.vBatchNo || '',
                "oldExpDate": this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'),
                "newBatchNo": this.vBatchEdit || '',
                "newExpDate": this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'),
                "addedBy": this.accountService.currentUserValue.userId || 0,
                "stkId": this.vStockId || 0
            }
            console.log(submitData);
            this._StockAdjustmentService.BatchAdjSave(submitData).subscribe(response => {
                this.toastr.success(response.message);
                this._matDialog.closeAll();
                this.dsStockAdjList.data=[];
            });
      this.StoreFrom.get("ItemID").setValue('')
    }
    EditMRP(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(MRPAdjustmentComponent,
            {
                maxWidth: "100%",
                height: '45%',
                width: '50%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getStockList();
        });
    }
    EditGST(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(GSTAdjustmentComponent,
            {
                maxWidth: "100%",
                height: '50%',
                width: '50%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getStockList();
        });
    }
    Addeditable: boolean = false;
    Dedueditable: boolean = false;
    Expeditable: boolean = false;
    Batcheditable: boolean = false;
    Rateeditable: boolean = false;
    Landededitable: boolean = false;

    enableEditing(row: StockAdjList) {
        row.Addeditable = true;
    }
    disableEditing(row: StockAdjList) {
        row.Addeditable = false;
    }
    deduenableEditing(row: StockAdjList) {
        row.Dedueditable = true;
    }
    dedudisableEditing(row: StockAdjList) {
        row.Dedueditable = false;
    }
    RateenableEditing(row: StockAdjList) {
        row.Rateeditable = true;
    }
    RatedisableEditing(row: StockAdjList) {
        row.Rateeditable = false;
    }
    BatchenableEditing(row: StockAdjList) {
        row.Batcheditable = true;
    }
    BatchdisableEditing(row: StockAdjList) {
        row.Batcheditable = false;
    }
    ExpDateenableEditing(row: StockAdjList) {
        row.Expeditable = true;
    }
    ExpDatedisableEditing(row: StockAdjList) {
        row.Expeditable = false;
    }
    LandedenableEditing(row: StockAdjList) {
        row.Landededitable = true;
    }
    LandeddisableEditing(row: StockAdjList) {
        row.Landededitable = false;
    }


    //  batchEdit: boolean = false;
    // BatchenableEditing(row: StockAdjList) {
    //   row.batchEdit = true;
    //   row.batchEdit = '';
    // }
    BatchisableEditing(row: StockAdjList) {
        row.batchEdit = false;
        this.StoreFrom.get('batchEdit').setValue('')
        this.getStockList();
    }

}

export class StockAdjList {
    BalQty: any;
    BatchNo: number;
    ExpDate: number;
    UnitMRP: number;
    Landedrate: any;
    PurchaseRate: any;
    UpdatedQty: any;
    LandedRate: any;
    AddQty: any;
    DeduQty: any;
    BatchEdit: any;
    ExpDateEdit: any;
    expDateEdit: any;
    Addeditable: boolean = false;
    Dedueditable: boolean = false;
    Rateeditable: boolean = false;
    Batcheditable: boolean = false;
    Expeditable: boolean = false;
    Landededitable: boolean = false;
    GSTeditable: boolean = false;
    batchEdit: any;
    constructor(StockAdjList) {
        {
            this.BalQty = StockAdjList.BalQty || 0;
            this.BatchNo = StockAdjList.BatchNo || 0;
            this.ExpDate = StockAdjList.ExpDate || 0;
            this.UnitMRP = StockAdjList.UnitMRP || 0;
            this.Landedrate = StockAdjList.Landedrate || 0;
            this.PurchaseRate = StockAdjList.PurchaseRate || 0;
            this.UpdatedQty = StockAdjList.UpdatedQty || 0;
            this.LandedRate = StockAdjList.LandedRate || 0;
            this.batchEdit = StockAdjList.batchEdit || ''
            this.expDateEdit == StockAdjList.expDateEdit || ''
        }
    }
}