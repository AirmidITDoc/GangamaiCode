import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewSpecConditionMasterComponent } from "./new-spec-condition-master/new-spec-condition-master.component";
import { SpecConditionMasterService } from "./spec-condition-master.service";

@Component({
    selector: 'app-spec-condition-master',
    templateUrl: './spec-condition-master.component.html',
    styleUrls: ['./spec-condition-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SpecConditionMasterComponent {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    unitName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Add);

    allcolumns = [

        { heading: "Specimen Condition", key: "specimenCondition", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, callback: (data: any) => {
                        this._specimenService.deactivateTheStatus(data.specimenConditionId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allfilters = [
        { fieldName: "SpecimenCondition", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.SpecimenMaster,
        apiUrl: "PathSpecimenConditionMaster/List",
        columnsList: this.allcolumns,
        sortField: "SpecimenConditionId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _specimenService: SpecConditionMasterService, public permissionService: PagePermissionService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewSpecConditionMasterComponent,
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
