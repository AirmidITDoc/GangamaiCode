import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { ItemDrugMasterService } from "./item-drug-master.service";
import { NewitemDrugMasterComponent } from "./newitem-drug-master/newitem-drug-master.component";


@Component({
    selector: 'app-item-drug-master',
    templateUrl: './item-drug-master.component.html',
    styleUrls: ['./item-drug-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemDrugMasterComponent {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemDrugTypeMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allcolumns = [
        { heading: "Item Drug Type", key: "drugTypeName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.ItemDrugTypeMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._ItemDrugTypeMasterService.deactivateTheStatus(data.itemDrugTypeId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "drugTypeName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.ItemDrugTypeMaster,
        apiUrl: "ItemDrugTypeMaster/List",
        columnsList: this.allcolumns,
        sortField: "ItemDrugTypeId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(public _ItemDrugTypeMasterService: ItemDrugMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewitemDrugMasterComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
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
