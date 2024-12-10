import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WardMasterService } from "./ward-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { NewWardComponent } from "./new-ward/new-ward.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-ward-master",
    templateUrl: "./ward-master.component.html",
    styleUrls: ["./ward-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class WardMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    gridConfig: gridModel = {
        apiUrl: "WardMaster/List",
        columnsList: [
            { heading: "Code", key: "roomId", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "Room Name", key: "roomName", sort: true, align: 'left', emptySign: 'NA', width:450 },
            { heading: "Room Type", key: "roomType", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "Location", key: "locationId", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "IsAvailible", key: "isAvailible", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "ClassId", key: "classId", sort: true, align: 'left', emptySign: 'NA', width:100 },
            { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
           { heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
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
                                this._wardService.deactivateTheStatus(data.roomId).subscribe((response: any) => {
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
    sortField: "roomId",
    sortOrder: 0,
    filters: [
        { fieldName: "roomName", fieldValue: "", opType: OperatorComparer.Contains },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ],
    row: 25
    }
    constructor(public _wardService: WardMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {}
    
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewWardComponent,
                {
                    maxWidth: "55vw",
                    height: '55%',
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