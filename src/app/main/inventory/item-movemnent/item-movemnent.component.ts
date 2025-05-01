import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { ItemMovemnentService } from './item-movemnent.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
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
    hasSelectedContacts: boolean;

    Store1List: any = [];
    StoreList: any = [];
    autocompletestore: string = "Store";
    autocompleteitem: string = "ItemType";

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "ItemMovement/ItemMovementList",
        columnsList: [
            { heading: "No", key: "movementId", sort: true, align: 'left', emptySign: 'NA', width: 80 },
            { heading: "Date", key: "itemName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "TransactionType", key: "fromStoreName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
            { heading: "FromStoreName", key: "batchNo", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Doc.No", key: "documentNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ItemName", key: "transactionType", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "BatchNo", key: "transactionDate", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "ReceiptQty", key: "receiptQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IssueQty", key: "issueQty", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Bal Qty", key: "movementNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "ReturnQty", key: "transactionTime", sort: true, align: 'left', emptySign: 'NA', width: 150 }
        ],
        sortField: "batchNo",
        sortOrder: 0,
        filters: [
            { fieldName: "FromDate", fieldValue: "01/01/2020", opType: OperatorComparer.Equals },
            { fieldName: "ToDate", fieldValue: "01/01/2024", opType: OperatorComparer.Equals },
            { fieldName: "ItemId", fieldValue: "580", opType: OperatorComparer.Equals },
            { fieldName: "FromStoreID", fieldValue: "2", opType: OperatorComparer.Equals },
            { fieldName: "ToStoreId", fieldValue: "0", opType: OperatorComparer.Equals },
            { fieldName: "BatchNo", fieldValue: "G220720826", opType: OperatorComparer.Equals }
        ]
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

    selectChangeStore(obj:any){

    }

    selectChangeItem(obj:any){

    }
}

