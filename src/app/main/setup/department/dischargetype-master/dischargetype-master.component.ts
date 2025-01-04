import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DischargetypeMasterService } from "./dischargetype-master.service";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewDischargetypeComponent } from "./new-dischargetype/new-dischargetype.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-dischargetype-master",
    templateUrl: "./dischargetype-master.component.html",
    styleUrls: ["./dischargetype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DischargetypeMasterComponent implements OnInit {
    constructor(
        public _dischargetypeService: DischargetypeMasterService,
        public toastr: ToastrService,

        public _matDialog: MatDialog
    ) { }

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "DischargeType/List",
        columnsList: [
            { heading: "Code", key: "dischargeTypeId", sort: true, align: 'left', emptySign: 'NA', width: 150 },
            { heading: "Discharge Type Name", key: "dischargeTypeName", sort: true, align: 'left', emptySign: 'NA', width: 800 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._dischargetypeService.deactivateTheStatus(data.dischargeTypeId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "dischargeTypeId",
        sortOrder: 0,
        filters: [
            { fieldName: "dischargeTypeName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }



    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewDischargetypeComponent,
            {
                maxWidth: "45vw",
                height: '30%',
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