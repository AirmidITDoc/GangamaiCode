import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { SubGroupMasterService } from "./sub-group-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
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
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "SubGroupMaster/List",
        columnsList: [
            { heading: "Code", key: "subGroupId", sort: true, align: 'left', emptySign: 'NA',width:150 },
            { heading: "Sub Group  Name", key: "subGroupName", sort: true, align: 'left', emptySign: 'NA',width:500 },
            { heading: "Group Name", key: "groupId", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:160 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:165, actions: [
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
                                    this._subgroupService.deactivateTheStatus(data.subGroupId).subscribe((response: any) => {
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
        sortField: "subGroupId",
        sortOrder: 0,
        filters: [
            { fieldName: "subGroupName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }


    //groupname filter
    public groupnameFilterCtrl: FormControl = new FormControl();
    public filteredGroupname: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _subgroupService: SubGroupMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
    
    }
    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewSubgroupComponent,
            {
                maxWidth: "45vw",
                height: '45%',
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