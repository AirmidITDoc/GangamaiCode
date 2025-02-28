import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { MaritalstatusMasterService } from "./maritalstatus-master.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewMaritalstatusComponent } from "./new-maritalstatus/new-maritalstatus.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-maritalstatus-master",
    templateUrl: "./maritalstatus-master.component.html",
    styleUrls: ["./maritalstatus-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaritalstatusMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "MaritalStatus/List",
        columnsList: [
            { heading: "Code", key: "maritalStatusId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Marital Status", key: "maritalStatusName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._maritalService.deactivateTheStatus(data.maritalStatusId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "maritalStatusId",
        sortOrder: 0,
        filters: [
            { fieldName: "maritalStatusName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _maritalService: MaritalstatusMasterService, public _matDialog: MatDialog,
        public toastr: ToastrService,) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewMaritalstatusComponent,
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