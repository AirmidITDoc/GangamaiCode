import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { NewTalukaComponent } from "./new-taluka/new-taluka.component";
import { TalukaMasterService } from "./taluka-master.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";

@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    msg: any;
    talukaName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.TalukaMaster, permissionType.Add);

    allcolumns = [
        //    { heading: "Code", key: "talukaId", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "Taluka Name", key: "talukaName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "City Name", key: "cityId", sort: true, align: 'left', emptySign: 'NA' },
        //    { heading: "UserName", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.TalukaMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.TalukaMaster, permissionType.Delete), callback: (data: any) => {
                        this._TalukaMasterService.deactivateTheStatus(data.talukaId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "talukaName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.TalukaMaster,
        apiUrl: "TalukaMaster/List",
        columnsList: this.allcolumns,
        sortField: "talukaId",
        sortOrder: 0,
        filters: this.allfilters
    }
    constructor(
        public _TalukaMasterService: TalukaMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog,
        public permissionService: PagePermissionService
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewTalukaComponent,
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
