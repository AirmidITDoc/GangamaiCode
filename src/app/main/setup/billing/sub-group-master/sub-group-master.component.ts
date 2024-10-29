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

@Component({
    selector: "app-sub-group-master",
    templateUrl: "./sub-group-master.component.html",
    styleUrls: ["./sub-group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubGroupMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "BankMaster/List",
        columnsList: [
            { heading: "Code", key: "subGroupId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Sub Group  Name", key: "subGroupName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Group Name", key: "groupName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.subGroupId); // DELETE Records
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
        row:25
    }

    //groupname filter
    public groupnameFilterCtrl: FormControl = new FormControl();
    public filteredGroupname: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _subgroupService: SubGroupMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
    
    }
  
    onClear() {
        this._subgroupService.myform.reset({ IsDeleted: "false" });
        this._subgroupService.initializeFormGroup();
    }

  
    
    onSave(row:any = null) {
        const dialogRef = this._matDialog.open(NewSubgroupComponent,
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

    onDeactive(subGroupId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._subgroupService.deactivateTheStatus(subGroupId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                       
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
    onEdit(row) {
        var m_data = {
            SubGroupId: row.SubGroupId,
            SubGroupName: row.SubGroupName.trim(),
            GroupId: row.GroupId,
            GroupName: row.GroupName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._subgroupService.populateForm(m_data);
    }
}

export class SubGroupMaster {
    subGroupId: number;
    subGroupName: string;
    groupId: number;
    groupName: string;
    isActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param SubGroupMaster
     */
    constructor(SubGroupMaster) {
        {
            this.subGroupId = SubGroupMaster.subGroupId || "";
            this.subGroupName = SubGroupMaster.subGroupName || "";
            this.groupId = SubGroupMaster.groupId || "";
            this.isActive = SubGroupMaster.isActive || "false";
            this.AddedBy = SubGroupMaster.AddedBy || "";
            this.UpdatedBy = SubGroupMaster.UpdatedBy || "";
        }
    }
}
