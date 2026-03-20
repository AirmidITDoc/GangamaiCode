import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { GenericmasterService } from "./genericmaster.service";
import { NewGnericMasterComponent } from "./new-gneric-master/new-gneric-master.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";


@Component({
    selector: "app-genericmaster",
    templateUrl: "./genericmaster.component.html",
    styleUrls: ["./genericmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenericmasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    genericName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.PGenericMaster, permissionType.Add);

    allcolumns = [
        // { heading: "Code", key: "genericId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Generic Name", key: "genericName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.PGenericMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.PGenericMaster, permissionType.Delete), callback: (data: any) => {
                        this._GenericService.deactivateTheStatus(data.genericId).subscribe((data: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "genericName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.PGenericMaster,
        apiUrl: "GenericMaster/List",
        columnsList: this.allcolumns,
        sortField: "genericId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(public _GenericService: GenericmasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,
        public permissionService: PagePermissionService) { }

    ngOnInit(): void { }

    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                // this.onEdit(status.data)
                break;
            case 5:
                // this.onDeactive(status.data.genericId);
                break;
            default:
                break;
        }
    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewGnericMasterComponent,
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


