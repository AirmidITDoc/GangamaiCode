import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { ExpeditComponent } from './expedit/expedit.component';
import { GSTAdjustmentComponent } from './gstadjustment/gstadjustment.component';
import { MRPAdjustmentComponent } from './mrpadjustment/mrpadjustment.component';
import { StockAdjustmentService } from './stock-adjustment.service';
import Swal from 'sweetalert2';

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
    BatchForm: FormGroup;
    StockUpdateForm: FormGroup;
    screenFromString = 'admission-form';
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";

    sIsLoading: string = '';
    ItemName: any;
    ItemId: any;
    dateTimeObj: any;
    vBatchNo: any;
    vQty: any;
    vMRP: any;
    vUpdatedQty: any;
    vBalQty: any;

    vStatus: any;
    vItemId: any;
    vStockId: any;
    AddType: any;
    vExpDate: any;
    vPurchaseRate: any;
    vBatchEdit: any = 0;
    vExpDateEdit: any;
    vDeudQty: any;
    OptionsItemName: any;

    ItemList: any = [];
    StoreList: any = [];
    filteredoptionsItemName: Observable<string[]>;

    isLoading = true;
    ApiUrl = ""
    isItemIdSelected: boolean = false;
    Addeditable: boolean = false;
    Dedueditable: boolean = false;
    Expeditable: boolean = false;
    Batcheditable: boolean = false;
    Rateeditable: boolean = false;
    vStoreId: any = 0;
    lastDay1: any;
    vlastDay: string = '';
    lastDay2: string = '';

    Lastbatch: string = '';
 
    displayedColumns = [
        'batchNo',
        'batchEdit',
        'batchExpDate',
        'expDateEdit',
        'unitMRP',
        'purUnitRateWF',
        'landedRate',
        'balanceQty',
        'Addition',
        'Deduction',
        'vatPercentage',
        'conversionFactor'
    ];

    dsStockAdjList = new MatTableDataSource<StockAdjList>();

    constructor(
        public _StockAdjustmentService: StockAdjustmentService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        public datePipe: DatePipe, private _formBuilder: UntypedFormBuilder, private _FormvalidationserviceService: FormvalidationserviceService,
    ) { }

    ngOnInit(): void {
        this.StoreFrom = this._StockAdjustmentService.CreateStoreFrom();
        this.BatchForm = this.CreateBatchFrom();
        this.StockUpdateForm = this.CreateStockUpdateFrom();
        this.StoreFrom.markAllAsTouched();
        this.getStockList();
        this.vStoreId = this.accountService.currentUserValue.user.storeId;
        this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`
    }

    CreateBatchFrom() {
        return this._formBuilder.group({
            batchAdjId: 0,
            storeId: [this.accountService.currentUserValue.user.storeId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            stkId: [this.vStockId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            oldBatchNo: [this.vBatchNo || ''],
            oldExpDate: [this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'), [Validators.required]],
            newBatchNo: [this.vBatchEdit || '', [Validators.required, Validators.min(0)]],
            newExpDate: [this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd')],
            addedBy: [this.accountService.currentUserValue.userId || 0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
        });
    }

    CreateStockUpdateFrom() {
        return this._formBuilder.group({
            storeId: [this.accountService.currentUserValue.user.storeId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            stkId: [this.vStockId || 0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            itemId: [0, [Validators.required, Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            batchNo: [''],
            adDdType: [0],
            adDdQty: [0],
            preBalQty: [0],
            afterBalQty: [0],
            addedBy: [this.accountService.currentUserValue.userId || 0, [Validators.min(0), this._FormvalidationserviceService.onlyNumberValidator()]],
            stockAdgId: [0, [this._FormvalidationserviceService.onlyNumberValidator()]]
        });
    }

    getStockList() {
        const Param = {
            "first": 0,
            "rows": 9999,
            "sortField": "ItemId",
            "sortOrder": 0,
            "filters": [
                {
                    "fieldName": "StoreId",
                    "fieldValue": String(this.accountService.currentUserValue.user.storeId),
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

    batchEdit: boolean = false;

   
    OneditBatch(contact) {

        console.log(contact)
        this.vBatchNo = contact.batchNo
        this.vExpDate = contact.batchExpDate;
        this.vBatchEdit = contact.batchEdit;
        this.vExpDateEdit = contact.batchExpDate;
        this.vStockId = contact.stockId;

    }

    resetFormItem() {

    }

    getLastDayOfMonth(month: number, year: number): number {
        return new Date(year, month, 0).getDate();
    }
    pad(n: number): string {
        return n < 10 ? '0' + n : n.toString();
    }
    
    OnSaveBatchAdjustment() {
        

        const chkBatchNo = this.dsStockAdjList.data.some((item) => item.BatchEdit == this.Lastbatch);
        if (this.vBatchEdit != 0) {

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
                    console.log(this.vExpDate)
                }
            })

            // let submitData = {
            //     "batchAdjId": 0,
            //     "storeId": this.accountService.currentUserValue.user.storeId || 0,
            //     "itemId": this.StoreFrom.get('ItemID').value.itemId || 0,
            //     "oldBatchNo": this.vBatchNo || '',
            //     "oldExpDate": this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'),
            //     "newBatchNo": this.vBatchEdit || '',
            //     "newExpDate": this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'),
            //     "addedBy": this.accountService.currentUserValue.userId || 0,
            //     "stkId": this.vStockId || 0
            // }
            
            this.BatchForm.get('oldBatchNo').setValue(this.vBatchNo || '')
            this.BatchForm.get('newBatchNo').setValue(this.vBatchEdit || '')
            this.BatchForm.get('storeId').setValue(this.accountService.currentUserValue.user.storeId || 0)
            this.BatchForm.get('stkId').setValue(this.vStockId || '')
            this.BatchForm.get('itemId').setValue(this.itemId || 0)
            this.BatchForm.get('addedBy').setValue(this.accountService.currentUserValue.userId || 0)
            // this.BatchForm.get('itemId').setValue(this.StoreFrom.get('ItemID').value.itemId || 0)



            this.BatchForm.get('oldExpDate').setValue(this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'))
            this.BatchForm.get('newExpDate').setValue(this.datePipe.transform(this.vExpDate, 'yyyy-MM-dd'))


            console.log(this.BatchForm.value);
            this._StockAdjustmentService.BatchAdjSave(this.BatchForm.value).subscribe(response => {
                this.getStockList();
            });
            this.StoreFrom.get("ItemID").setValue('')
        }
        else {
            this.toastr.warning('Please enter BatchNo', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }
        this.vBatchEdit = 0
    }
    EditMRP(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(MRPAdjustmentComponent,
            {
              maxWidth: "40vw",
                maxHeight: '50vh',
                width: '85%',
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
                maxWidth: "100vw",
                maxHeight: '60vh',
                // height: '55%',
                width: '55%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getStockList();
        });
    }

    EditExpDate(contact) {
        console.log(contact)
        const dialogRef = this._matDialog.open(ExpeditComponent,
            {
                maxWidth: "40vw",
                maxHeight: '50vh',
                width: '35%',
                data: {
                    Obj: contact,
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getStockList();
        });
    }

    enableEditing(row: StockAdjList) {
        row.Addeditable = true;
    }
    disableEditing(row: StockAdjList) {
        row.Addeditable = false;
        row.AddQty = null;
    }
    dedudisableEditing(row: StockAdjList) {
        row.Dedueditable = false;
        row.DeduQty = null;
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
    AddenableEditing(row: StockAdjList) {
        row.Addeditable = true;
    }
    deduenableEditing(row: StockAdjList) {
        row.Dedueditable = true;
    }
    // ExpDatedisableEditing(row: StockAdjList) {
    //     row.Expeditable = false;
    // }
    // LandedenableEditing(row: StockAdjList) {
    //     row.Landededitable = true;
    // }
    // LandeddisableEditing(row: StockAdjList) {
    //     row.Landededitable = false;
    // }


    BatchisableEditing(row: StockAdjList) {
        row.batchEdit = false;
        this.StoreFrom.get('batchEdit').setValue('')
        this.getStockList();
    }

    storeId = 0
    selectChangeStore(obj: any) {
        this.storeId = obj.value
        this.ApiUrl = `ItemMaster/NewGetItemListForGRNOrPO?StoreId=${this.vStoreId}&ItemName=`
    }

    itemId = 0
    selectChangeItem(obj: any) {
        console.log(obj)
        this.itemId = obj.itemId
        this.getStockList();
    }

    onClear() {
        this.StoreFrom.get('ItemID').reset('');
        this.dsStockAdjList.data = []
    }

    keyPressAlphanumeric(event) {
        const inp = String.fromCharCode(event.keyCode);
        if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
            return true;
        } else {
            event.preventDefault();
            return false;
        }
    }

    AddQty(contact) {
        console.log(contact)
        
        if (contact.AddQty > 0 && contact.AddQty < 100) {
            contact.UpdatedQty = parseFloat(contact.balanceQty) + parseFloat(contact.AddQty);
            this.AddType = 1;
        } else {
            contact.UpdatedQty = 0;
            contact.AddQty = 0
            Swal.fire("Enter Qty less than 100")
            contact.Addeditable = false;
            return;
        }
        this.vUpdatedQty = contact.UpdatedQty;
        this.vQty = contact.AddQty
        this.vBatchNo = contact.batchNo
        this.vItemId = contact.itemId;
        this.vStockId = contact.stockId;
        this.vBalQty = contact.balanceQty;
    }

    DeduQty(contact) {
        console.log(contact)
        
        if (contact.DeduQty > 0 && contact.DeduQty <= contact.balanceQty) {
            contact.UpdatedQty = parseFloat(contact.balanceQty) - parseFloat(contact.DeduQty);
            this.AddType = 0;
        } else {
            contact.UpdatedQty = 0;
            contact.DeduQty = 0
            contact.Dedueditable = false;
            Swal.fire("Enter Qty less than Balance Qty")
            return;
        }
        this.vUpdatedQty = contact.UpdatedQty,
            this.vQty = contact.DeduQty
        this.vBatchNo = contact.batchNo
        this.vItemId = contact.itemId;
        this.vStockId = contact.stockId;
        this.vBalQty = contact.balanceQty;
    }

    onsaveStockAdj() {
        
        let isCheckQty: any;
        if (isCheckQty = this.dsStockAdjList.data.some(item => item.AddQty != '')) {
            this.OnSaveStockAdjustment();
        }
        else if (isCheckQty = this.dsStockAdjList.data.some(item => item.DeduQty < this.vBalQty || item.AddQty == '')) {
            this.OnSaveStockAdjustment();
        }
        else {
            this.toastr.warning('Please enter a Qty', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
        }
    }

    OnSaveStockAdjustment() {
        
        if ((!this.dsStockAdjList.data.length)) {
            this.toastr.warning('Data is not available in list ,please add item in the list.', 'Warning !', {
                toastClass: 'tostr-tost custom-toast-warning',
            });
            return;
        }
        this.StockUpdateForm.get('stkId').setValue(this.vStockId)
        this.StockUpdateForm.get('batchNo').setValue(this.vBatchNo)
        this.StockUpdateForm.get('itemId').setValue(this.vItemId)
        this.StockUpdateForm.get('adDdType').setValue(this.AddType)
        this.StockUpdateForm.get('adDdQty').setValue(this.vQty)
        this.StockUpdateForm.get('preBalQty').setValue(this.vBalQty)
        this.StockUpdateForm.get('afterBalQty').setValue(this.vUpdatedQty)
        console.log(this.StockUpdateForm.value)
        if (!this.StockUpdateForm.invalid) {
            console.log(this.StockUpdateForm.value)
            this._StockAdjustmentService.StckupdateSave(this.StockUpdateForm.value).subscribe((response) => {
                this.getStockList();
            });
        } {
            const invalidFields = [];
            if (this.StockUpdateForm.invalid) {
                for (const controlName in this.StockUpdateForm.controls) {
                    if (this.StockUpdateForm.controls[controlName].invalid) {
                        invalidFields.push(`bank Form: ${controlName}`);
                    }
                }
            }
            if (invalidFields.length > 0) {
                invalidFields.forEach(field => {
                    this.toastr.warning(`Field "${field}" is invalid.`, 'Warning',
                    );
                });
            }

        }
       
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
            this.BatchNo = StockAdjList.BatchNo || '';
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