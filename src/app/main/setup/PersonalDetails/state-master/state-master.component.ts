import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { StateMasterService } from "./state-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewStateMasterComponent } from "./new-state-master/new-state-master.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./state-master.component.html",
    styleUrls: ["./state-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StateMasterComponent implements OnInit {
    
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
     
        @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
        gridConfig: gridModel = {
            apiUrl: "StateMaster/List",
            columnsList: [
                { heading: "Code", key: "stateId", sort: true, align: 'left', emptySign: 'NA', width:150 },
            { heading: "State Name", key: "stateName", sort: true, align: 'left', emptySign: 'NA', width:400 },
            { heading: "Country Name", key: "countryId", sort: true, align: 'left', emptySign: 'NA', width:400 },
                { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center", width:100 },
                {
                    heading: "Action", key: "action", align: "right", width:100, type: gridColumnTypes.action, actions: [
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
                                        this._StateMasterService.deactivateTheStatus(data.stateId).subscribe((response: any) => {
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
            sortField: "stateId",
            sortOrder: 0,
            filters: [
                { fieldName: "stateName", fieldValue: "", opType: OperatorComparer.Contains },
                { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
            ],
            row: 25
        }
    
        constructor(
            public _StateMasterService: StateMasterService,
            public toastr: ToastrService, public _matDialog: MatDialog
        ) { }
    
        ngOnInit(): void { }
        onSave(row: any = null) {
            let that = this;
            const dialogRef = this._matDialog.open(NewStateMasterComponent,
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