import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemCategoryMasterService } from "./item-category-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewItemcategoryComponent } from "./new-itemcategory/new-itemcategory.component";

@Component({
    selector: "app-item-category-master",
    templateUrl: "./item-category-master.component.html",
    styleUrls: ["./item-category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemCategoryMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        apiUrl: "ItemCategoryMaster/List",
        columnsList: [
            { heading: "Code", key: "itemCategoryId", sort: true, width: 150, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "itemCategoryName", sort: true, width: 400, align: 'left', emptySign: 'NA' },
            { heading: "Item Type ID", key: "itemTypeId", sort: true, width: 400, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", width: 100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._categorymasterService.deactivateTheStatus(data.itemCategoryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "itemCategoryId",
        sortOrder: 0,
        filters: [
            { fieldName: "itemCategoryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _categorymasterService: ItemCategoryMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewItemcategoryComponent,
            {
                maxWidth: "45vw",
                height: '30%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}