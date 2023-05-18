import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { GroupMasterService } from "./group-master.service";

@Component({
    selector: "app-group-master",
    templateUrl: "./group-master.component.html",
    styleUrls: ["./group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GroupMasterComponent implements OnInit {
    GroupMasterList: any;
    submitted = false;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "GroupId",
        "GroupName",
        "Isconsolidated",
        "IsConsolidatedDR",
        "PrintSeqNo",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSGroupMasterList = new MatTableDataSource<GroupMaster>();

    constructor(public _groupService: GroupMasterService) {}

    ngOnInit(): void {
        this.getGroupMasterList();
    }
    onSearch() {
        this.getGroupMasterList();
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

    getGroupMasterList() {
        var param = {
            GroupName: "%",
        };
        this._groupService.getGroupMasterList(param).subscribe((Menu) => {
            this.DSGroupMasterList.data = Menu as GroupMaster[];
            this.DSGroupMasterList.sort = this.sort;
            this.DSGroupMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._groupService.myform.reset({ IsDeleted: "false" });
        this._groupService.initializeFormGroup();
    }

    onSubmit() {
        if (this._groupService.myform.valid) {
            if (!this._groupService.myform.get("GroupId").value) {
                var m_data = {
                    groupMasterInsert: {
                        GroupName: this._groupService.myform
                            .get("GroupName")
                            .value.trim(),
                        Isconsolidated: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("Isconsolidated")
                                    .value
                            )
                        ),
                        IsConsolidatedDR: Boolean(
                            JSON.parse(
                                this._groupService.myform.get(
                                    "IsConsolidatedDR"
                                ).value
                            )
                        ),
                        PrintSeqNo:
                            this._groupService.myform.get("PrintSeqNo").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._groupService
                    .groupMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getGroupMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    groupMasterUpdate: {
                        GroupId: this._groupService.myform.get("GroupId").value,
                        GroupName: this._groupService.myform
                            .get("GroupName")
                            .value.trim(),
                        Isconsolidated: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("Isconsolidated")
                                    .value
                            )
                        ),
                        IsConsolidatedDR: Boolean(
                            JSON.parse(
                                this._groupService.myform.get(
                                    "IsConsolidatedDR"
                                ).value
                            )
                        ),
                        PrintSeqNo:
                            this._groupService.myform.get("PrintSeqNo").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._groupService
                    .groupMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getGroupMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            GroupId: row.GroupId,
            GroupName: row.GroupName.trim(),
            Isconsolidated: JSON.stringify(row.Isconsolidated),
            IsConsolidatedDR: JSON.stringify(row.IsConsolidatedDR),
            PrintSeqNo: row.PrintSeqNo,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._groupService.populateForm(m_data);
    }
}

export class GroupMaster {
    GroupId: number;
    GroupName: string;
    Isconsolidated: boolean;
    IsConsolidatedDR: boolean;
    PrintSeqNo: Number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param GroupMaster
     */
    constructor(GroupMaster) {
        {
            this.GroupId = GroupMaster.GroupId || "";
            this.GroupName = GroupMaster.GroupName || "";
            this.Isconsolidated = GroupMaster.Isconsolidated || "false";
            this.IsConsolidatedDR = GroupMaster.IsConsolidatedDR || "false";
            this.PrintSeqNo = GroupMaster.PrintSeqNo || "";
            this.IsDeleted = GroupMaster.IsDeleted || "false";
            this.AddedBy = GroupMaster.AddedBy || "";
            this.UpdatedBy = GroupMaster.UpdatedBy || "";
            this.AddedByName = GroupMaster.AddedByName || "";
        }
    }
}
