import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { ItemGenericMasterService } from "./item-generic-master.service";
import { NewGenericComponent } from "./new-generic/new-generic.component";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";

@Component({
    selector: "app-item-generic-master",
    templateUrl: "./item-generic-master.component.html",
    styleUrls: ["./item-generic-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemGenericMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.GenericMaster, permissionType.Add);
        
    genericForm: FormGroup;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
           permissionCode: permissionCodes.GenericMaster,
        apiUrl: "GenericMaster/List",
        columnsList: [
            { heading: "GenericName", key: "itemGenericName", sort: true, align: 'left', emptySign: 'NA' },
           { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        // action: gridActions.edit, callback: (data: any) => {
                        //     this.onSave(data);
                        // }
                          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.GenericMaster, permissionType.Edit), callback: (data: any) => {
                                                    this.onSave(data);
                                                }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._ItemGenericMasterService.deactivateTheStatus(data.itemGenericNameId).subscribe((response: any) => {
                                this.grid.bindGridData();
                            });
                        }
                    }]
            }
        ],
        sortField: "ItemGenericNameId",
        sortOrder: 0,
        filters: [
            { fieldName: "ItemGenericName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ]
    }

    constructor(public _ItemGenericMasterService: ItemGenericMasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        @Inject(MAT_DIALOG_DATA) public data: any, public permissionService: PagePermissionService,
        public dialogRef: MatDialogRef<ItemGenericMasterComponent>,) { }

    ngOnInit(): void { }


    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewGenericComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
                width: '70%',
                data: row
            });

        dialogRef.afterClosed().subscribe(result => {
            that.grid.bindGridData();

        });
    }

}