import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewItemWiseSupplierRateComponent } from "./new-item-wise-supplier-rate/new-item-wise-supplier-rate.component";

@Component({
    selector: 'app-item-wise-supplier-rate',
    templateUrl: './item-wise-supplier-rate.component.html',
    styleUrls: ['./item-wise-supplier-rate.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemWiseSupplierRateComponent implements OnInit {

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    constructor(public _matDialog: MatDialog,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ItemWiseSupplierRateComponent>,) { }

    ngOnInit(): void { }

    gridConfig: gridModel = {
        apiUrl: "",
        columnsList: [
            { heading: "ItemName", key: "itemName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "SupplierName", key: "supplierName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    },
                    // {
                    //   action: gridActions.delete, callback: (data: any) => {
                    //     this._ItemwiseSupplierrateService.deactivateTheStatus(data.genericId).subscribe((response: any) => {
                    //       this.toastr.success(response.message);
                    //       this.grid.bindGridData();
                    //     });
                    //   }
                    // }
                ]
            }
        ],
        sortField: "genericId",
        sortOrder: 0,
        filters: [
            { fieldName: "GenericName", fieldValue: "", opType: OperatorComparer.Contains }
            // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const dialogRef = this._matDialog.open(NewItemWiseSupplierRateComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });

        dialogRef.afterClosed().subscribe(result => {
            this.grid.bindGridData();
        });
    }
}