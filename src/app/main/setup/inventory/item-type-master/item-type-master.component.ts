import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ItemTypeMasterService } from "./item-type-master.service";
import { NewItemtypeComponent } from "./new-itemtype/new-itemtype.component";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-item-type-master",
    templateUrl: "./item-type-master.component.html",
    styleUrls: ["./item-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemTypeMasterComponent implements OnInit {
     IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ItemTypeMaster, permissionType.Add);
        
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    itemTypeName: any = "";

         allcolumns = [
           { heading: "ItemType Name", key: "itemTypeName", sort: true, align: 'left', emptySign: 'NA' },            
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data);
                        // }
                         action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.ItemTypeMaster, permissionType.Edit), callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ItemTypeMasterService.deactivateTheStatus(data.itemTypeId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ]
        
        allfilters= [
            { fieldName: "itemTypeName", fieldValue: "", opType: OperatorComparer.StartsWith },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
     gridConfig: gridModel = {
             permissionCode: permissionCodes.ItemTypeMaster,
        apiUrl: "ItemType/List",
        columnsList: this.allcolumns,
        sortField: "itemTypeId",
        sortOrder: 0,
        filters: this.allfilters
    }
    
    constructor(public _ItemTypeMasterService: ItemTypeMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void { }
 
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        const that = this;
        const dialogRef = this._matDialog.open(NewItemtypeComponent,
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