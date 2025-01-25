import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemTypeMasterService } from "./item-type-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewItemtypeComponent } from "./new-itemtype/new-itemtype.component";

@Component({
    selector: "app-item-type-master",
    templateUrl: "./item-type-master.component.html",
    styleUrls: ["./item-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemTypeMasterComponent implements OnInit {
    constructor(public _ItemTypeMasterService: ItemTypeMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "ItemType/List",
        columnsList: [
            { heading: "Code", key: "itemTypeId", sort: true, width: 100, align: 'left', emptySign: 'NA' },
            { heading: "Item Type Name", key: "itemTypeName", sort: true, width: 700, align: 'left', emptySign: 'NA' },            
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, width: 100, align: "center" },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ItemTypeMasterService.deactivateTheStatus(data.itemTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "itemTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "itemTypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewItemtypeComponent,
            {
                maxWidth: "45vw",
                height: '35%',
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