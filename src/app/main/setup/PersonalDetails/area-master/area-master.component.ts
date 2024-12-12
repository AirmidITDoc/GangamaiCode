import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { AreaMasterService } from "./area-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewAreaComponent } from "./new-area/new-area.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})

export class AreaMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "AreaMaster/List",
        columnsList: [
            { heading: "Code", key: "areaId", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "Area Name", key: "areaName", sort: true, align: 'left', emptySign: 'NA', width:800 },
            // { heading: "City Name", key: "cityId", sort: true, align: 'left', emptySign: 'NA', width:400 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
            { heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    },
                    {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._AreaMasterService.deactivateTheStatus(data.areaId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "areaId",
        sortOrder: 0,
        filters: [
            { fieldName: "areaName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(
        public _AreaMasterService: AreaMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }
    onSave(row: any = null) {
        let that = this;
        const dialogRef = this._matDialog.open(NewAreaComponent,
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