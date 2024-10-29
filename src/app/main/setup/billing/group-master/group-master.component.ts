import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { GroupMasterService } from "./group-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NewGroupComponent } from "./new-group/new-group.component";


@Component({
    selector: "app-group-master",
    templateUrl: "./group-master.component.html",
    styleUrls: ["./group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GroupMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "GroupMaster/List",
        columnsList: [
            { heading: "Code", key: "groupId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Group Name", key: "groupName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Isconsolidated", key: "isconsolidated", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsConsolidatedDr", key: "isConsolidatedDr", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.groupId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "groupId",
        sortOrder: 0,
        filters: [
            { fieldName: "GroupName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(public _groupService: GroupMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
      
    }
    onSearch() {
      
    }

    onSearchClear() {
        this._groupService.myformSearch.reset({
            GroupNameSearch: "",
            IsDeletedSearch: "2",
        });
      
    }
    get f() {
        return this._groupService.myform.controls;
    }

   
   
    
    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(NewGroupComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                // this.getGenderMasterList();
                // How to refresh Grid.
            }
            console.log('The dialog was closed - Action', result);
        });
    }

    onDeactive(groupId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._groupService.deactivateTheStatus(groupId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                        // this.getGenderMasterList();
                        // How to refresh Grid.
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    onEdit(row) {
        var m_data = {
            GroupId: row.GroupId,
            GroupName: row.GroupName.trim(),
            Isconsolidated: JSON.stringify(row.IsConsolidated),
            IsConsolidatedDR: JSON.stringify(row.IsConsolidatedDR),
            //  PrintSeqNo: row.PrintSeqNo,
            IsActive: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._groupService.populateForm(m_data);
    }
}

export class GroupMaster {
    groupId: number;
    groupName: string;
    isconsolidated: boolean;
    isConsolidatedDr: boolean;
    PrintSeqNo: Number;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param GroupMaster
     */
    constructor(GroupMaster) {
        {
            this.groupId = GroupMaster.groupId || "";
            this.groupName = GroupMaster.groupName || "";
            this.isconsolidated = GroupMaster.isconsolidated || "false";
            this.isConsolidatedDr = GroupMaster.isConsolidatedDr || "false";
            this.PrintSeqNo = GroupMaster.PrintSeqNo || "";
            this.IsActive = GroupMaster.IsActive || "false";
            this.AddedBy = GroupMaster.AddedBy || "";
            this.UpdatedBy = GroupMaster.UpdatedBy || "";
        }
    }
}
