import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewRelationshipComponent } from "./new-relationship/new-relationship.component";
import { RelationshipMasterService } from "./relationship-master.service";

@Component({
    selector: "app-relationship-master",
    templateUrl: "./relationship-master.component.html",
    styleUrls: ["./relationship-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class RelationshipMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    relationshipName: any = "";
    msg: any;

    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RelationshipMaster, permissionType.Add);


    allcolumns = [
        // { heading: "Code", key: "relationshipId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "RelationshipName", key: "relationshipName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {

                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.RelationshipMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }

                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.RelationshipMaster, permissionType.Delete), callback: (data: any) => {
                        this._relationshipService.deactivateTheStatus(data.relationshipId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "relationshipName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.RelationshipMaster,
        apiUrl: "RelationshipMaster/List",
        columnsList: this.allcolumns,
        sortField: "relationshipId",
        sortOrder: 0,
        filters: this.allfilters
    }


    constructor(public _relationshipService: RelationshipMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }


    ngOnInit(): void { }


    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewRelationshipComponent,
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