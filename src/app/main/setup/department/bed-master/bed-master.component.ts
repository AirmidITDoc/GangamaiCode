import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { BedMasterService } from "./bed-master.service";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { MatDialog } from "@angular/material/dialog";
import { NewBedComponent } from "./new-bed/new-bed.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-bed-master",
    templateUrl: "./bed-master.component.html",
    styleUrls: ["./bed-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "BedMaster/List",
        columnsList: [
            { heading: "Code", key: "bedId", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "Bed Name", key: "bedName", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "Room Id", key: "roomId", sort: true, align: 'left', emptySign: 'NA', width: 350 },
            { heading: "IsAvailible", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA', width: 100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width: 100 },
            {
                heading: "Action", key: "action", align: "right", width: 100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._BedMasterService.deactivateTheStatus(data.bedId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "bedId",
        sortOrder: 0,
        filters: [
            { fieldName: "bedName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _BedMasterService: BedMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button
        
        let that = this;
        const dialogRef = this._matDialog.open(NewBedComponent,
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