import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { GroupMasterService } from "./group-master.service";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewGroupComponent } from "./new-group/new-group.component";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";


@Component({
    selector: "app-group-master",
    templateUrl: "./group-master.component.html",
    styleUrls: ["./group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GroupMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    
    gridConfig: gridModel = {
        apiUrl: "GroupMaster/List",
        columnsList: [
            { heading: "Code", key: "groupId", sort: true, align: 'left', emptySign: 'NA',width:150 },
            { heading: "Group Name", key: "groupName", sort: true, align: 'left', emptySign: 'NA',width:400 },
            { heading: "Isconsolidated", key: "isconsolidated", sort: true, align: 'left', emptySign: 'NA',width:200 },
            { heading: "IsConsolidatedDr", key: "isConsolidatedDr", sort: true, align: 'left', emptySign: 'NA', width:200 },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center",width:100 },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action,width:100, actions: [
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
                                    this._GroupMasterService.deactivateTheStatus(data.groupId).subscribe((response: any) => {
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
        sortField: "groupId",
        sortOrder: 0,
        filters: [
            { fieldName: "groupName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }

    constructor(public _GroupMasterService: GroupMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
      
    }
    onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewGroupComponent,
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