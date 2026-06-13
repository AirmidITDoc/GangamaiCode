import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { ItemMovemnentService } from './item-movemnent.service';

@Component({
    selector: 'app-item-movemnent',
    templateUrl: './item-movemnent.component.html',
    styleUrls: ['./item-movemnent.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,

})
export class ItemMovemnentComponent implements OnInit {
    hasSelectedContacts: boolean;

    Store1List: any = [];
    StoreList: any = [];
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";
    fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
    batchNo: any = "%"
    TostoreId: any = "0"
    FromstoreId = this.accountService.currentUserValue.user.storeId;
    storeId = this.accountService.currentUserValue.user.storeId;
    itemId = "0"; //"77617"

    @ViewChild('grid', { static: false }) grid: AirmidTableComponent;

    allColumns = [
        // { heading: "No", key: "movementNo", sort: true, align: 'left', emptySign: 'NA', width: 80 },
        { heading: "Date", key: "tranDate", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Transaction Type", key: "transactionType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
        { heading: "From StoreName", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Doc.No", key: "documentNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
        { heading: "Item Name", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
        { heading: "Batch No", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 120 },
        { heading: "Receipt Qty", key: "receiptQty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "IssueQty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Bal Qty", key: "balQty", sort: true, align: 'left', emptySign: 'NA', width: 90 },
        { heading: "Return Qty", key: "returnQty", sort: true, align: 'left', emptySign: 'NA', width: 90 }
    ]

    allFilters = [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ItemId", fieldValue: String(this.itemId), opType: OperatorComparer.Equals },
        { fieldName: "FromStoreID", fieldValue: String(this.FromstoreId), opType: OperatorComparer.Equals },
        { fieldName: "ToStoreId", fieldValue: String(this.TostoreId), opType: OperatorComparer.Equals },
        { fieldName: "BatchNo", fieldValue: this.batchNo, opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        // permissionCode: permissionCodes.Prefix,
        apiUrl: "ItemMovement/ItemMovementList",
        columnsList: this.allColumns,
        sortField: "MovementId",
        sortOrder: 0,
        filters: this.allFilters
    }

    constructor(
        public _ItemMovemnentService: ItemMovemnentService,
        public datePipe: DatePipe,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService
    ) { }

    ngOnInit(): void {
        this._ItemMovemnentService.ItemSearchGroup.get('ItemID')?.valueChanges.subscribe(value => {
            console.log(value)
            this.itemId = value.itemId || "0";
            this.getfilterdata();
        });
    }

    onChangeFirst() {
        this.fromDate = this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get('start').value, "yyyy-MM-dd")
        this.toDate = this.datePipe.transform(this._ItemMovemnentService.ItemSearchGroup.get('end').value, "yyyy-MM-dd")
        this.batchNo = this._ItemMovemnentService.ItemSearchGroup.get('BatchNo').value || "%"
        this.getfilterdata();
    }

    getfilterdata() {
        // debugger
        const fromDateControl = this._ItemMovemnentService.ItemSearchGroup.get('start')?.value;
        const toDateControl = this._ItemMovemnentService.ItemSearchGroup.get('end')?.value;

        this.fromDate = this.datePipe.transform(fromDateControl, 'yyyy-MM-dd');
        this.toDate = this.datePipe.transform(toDateControl, 'yyyy-MM-dd');

        this.gridConfig = {
            apiUrl: "ItemMovement/ItemMovementList",
            columnsList: this.allColumns,
            sortField: "MovementId",
            sortOrder: 0,
            filters: [
                { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
                { fieldName: "ItemId", fieldValue: String(this.itemId), opType: OperatorComparer.Equals },
                { fieldName: "FromStoreID", fieldValue: String(this.FromstoreId), opType: OperatorComparer.Equals },
                { fieldName: "ToStoreId", fieldValue: String(this.TostoreId), opType: OperatorComparer.Equals },
                { fieldName: "BatchNo", fieldValue: this.batchNo, opType: OperatorComparer.Equals }
            ]
        }
        console.log(this.gridConfig)
        this.grid.gridConfig = this.gridConfig;
        this.grid.bindGridData();
    }


    Clearfilter(event) {
        console.log(event)
        if (event == 'BatchNo')
            this._ItemMovemnentService.ItemSearchGroup.get('BatchNo').setValue("")

        this.onChangeFirst();
    }

    selectChangeStore(obj: any) {
        console.log(obj)
        if (obj.value !== 0) {
            this.TostoreId = obj.value
        }
        else {
            this.TostoreId = "0"
            this._ItemMovemnentService.ItemSearchGroup.get("ItemID")?.reset();
            this.itemId = "0";
        }
        this.getfilterdata();
    }

    ItemFromReset() {
        // this.TostoreId = 0
    }

    selectChangeItem(obj: any) {
        // debugger;
        console.log(obj);
        this.gridConfig.filters[2].fieldValue = obj.formattedText

        if (obj && obj.itemId) {
            this.itemId = obj.itemId;
        } else {
            this.itemId = "0";
        }
        this.getfilterdata();
    }

    onSave(row: any = null) {
        const that = this;
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

}

