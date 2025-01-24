import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewUnitComponent } from "./new-unit/new-unit.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-unitmaster",
    templateUrl: "./unitmaster.component.html",
    styleUrls: ["./unitmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UnitmasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


    gridConfig: gridModel = {
        apiUrl: "PathUnitMaster/List",
        columnsList: [
            { heading: "Code", key: "unitId", width: 150, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Unit Name", key: "unitName", width: 800, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", width: 100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._unitmasterService.deactivateTheStatus(data.unitId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "unitId",
        sortOrder: 0,
        filters: [
            { fieldName: "unitName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _unitmasterService: UnitmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {

    }


    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewUnitComponent,
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