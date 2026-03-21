import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewWardComponent } from "./new-ward/new-ward.component";
import { WardMasterService } from "./ward-master.service";

@Component({
    selector: "app-ward-master",
    templateUrl: "./ward-master.component.html",
    styleUrls: ["./ward-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class WardMasterComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.WardMaster, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    roomName: any = "";

    allcolumns = [
        { heading: "RoomName", key: "roomName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Location", key: "locationId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Class", key: "classId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsAvailable", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    // action: gridActions.edit, callback: (data: any) => {
                    //     this.onSave(data);
                    // }
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.WardMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.delete, callback: (data: any) => {
                        this._wardService.deactivateTheStatus(data.roomId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "roomName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.WardMaster,
        apiUrl: "WardMaster/List",
        columnsList: this.allcolumns,
        sortField: "roomId",
        sortOrder: 0,
        filters: this.allfilters
    }


    constructor(public _wardService: WardMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService, public permissionService: PagePermissionService) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewWardComponent,
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