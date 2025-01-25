import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SubGroupMasterService } from "./sub-group-master.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { NewSubgroupComponent } from "./new-subgroup/new-subgroup.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-sub-group-master",
    templateUrl: "./sub-group-master.component.html",
    styleUrls: ["./sub-group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubGroupMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "SubGroupMaster/List",
        columnsList: [
            { heading: "Code", key: "subGroupId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Sub Group Name", key: "subGroupName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "Group Name", key: "groupId", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, width: 100, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._subgroupService.deactivateTheStatus(data.subGroupId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "subGroupId",
        sortOrder: 0,
        filters: [
            { fieldName: "subGroupName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _subgroupService: SubGroupMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void {

    }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewSubgroupComponent,
            {
                maxWidth: "45vw",
                height: '35%',
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