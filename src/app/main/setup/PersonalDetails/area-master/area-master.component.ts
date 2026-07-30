import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { AreaMasterService } from "./area-master.service";
import { NewAreaComponent } from "./new-area/new-area.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AreaMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    areaName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.AreaMaster, permissionType.Add);

    allcolumns = [
        { heading: "Area Name", key: "areaName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Pincode", key: "pincode", sort: true, align: 'left', emptySign: 'NA' },

        { heading: "City Name", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.AreaMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.AreaMaster, permissionType.Delete), callback: (data: any) => {
                        this._AreaMasterService.deactivateTheStatus(data.areaId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]
    allfilters = [
        { fieldName: "areaName", fieldValue: this.areaName, opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.AreaMaster,
        apiUrl: "AreaMaster/List",
        columnsList: this.allcolumns,
        sortField: "areaId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _AreaMasterService: AreaMasterService, public permissionService: PagePermissionService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }


    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewAreaComponent,
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