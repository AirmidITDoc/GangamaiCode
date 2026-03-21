import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewSpecimumMasterComponent } from "./new-specimum-master/new-specimum-master.component";
import { SpecimumMasterService } from "./specimum-master.service";


@Component({
    selector: 'app-specimum-master',
    templateUrl: './specimum-master.component.html',
    styleUrls: ['./specimum-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SpecimumMasterComponent {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    unitName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Add);

    allcolumns = [

        { heading: "Specimen Name", key: "specimenName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._specimenService.deactivateTheStatus(data.specimenId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "SpecimenName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.SpecimenMaster,
        apiUrl: "PathSpecimenMaster/List",
        columnsList: this.allcolumns,
        sortField: "SpecimenId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _specimenService: SpecimumMasterService, public permissionService: PagePermissionService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewSpecimumMasterComponent,
            {
                maxWidth: "45vw",
                maxHeight: '35%',
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
