import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { GroupMasterService } from "./group-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

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
        //  "PrintSeqNo",

        "IsActive",
        "action",
    ];

    DSGroupMasterList = new MatTableDataSource<GroupMaster>();

    constructor(public _groupService: GroupMasterService,
        public toastr : ToastrService,) {}

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
        this.getGroupMasterList();
    }
    get f() {
        return this._groupService.myform.controls;
    }

    getGroupMasterList() {
        var param = {
            GroupName:
                this._groupService.myformSearch
                    .get("GroupNameSearch")
                    .value.trim() || "%",
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
                        groupName: this._groupService.myform
                            .get("GroupName")
                            .value.trim(),
                        isconsolidated: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("Isconsolidated")
                                    .value
                            )
                        ),
                        isConsolidatedDR: Boolean(
                            JSON.parse(
                                this._groupService.myform.get(
                                    "IsConsolidatedDR"
                                ).value
                            )
                        ),

                        isActive: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("IsActive").value
                            )
                        ),
                        // PrintSeqNo:
                        //     this._groupService.myform.get("PrintSeqNo").value,
                    },
                };

                this._groupService
                    .groupMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getGroupMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGroupMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Group Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getGroupMasterList();
                    },error => {
                        this.toastr.error('Group Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    groupMasterUpdate: {
                        groupId: this._groupService.myform.get("GroupId").value,
                        groupName: this._groupService.myform
                            .get("GroupName")
                            .value.trim(),
                        isconsolidated: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("Isconsolidated")
                                    .value
                            )
                        ),
                        isConsolidatedDR: Boolean(
                            JSON.parse(
                                this._groupService.myform.get(
                                    "IsConsolidatedDR"
                                ).value
                            )
                        ),

                        isActive: Boolean(
                            JSON.parse(
                                this._groupService.myform.get("IsActive").value
                            )
                        ),
                        // PrintSeqNo:
                        //     this._groupService.myform.get("PrintSeqNo").value,
                    },
                };

                this._groupService
                    .groupMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getGroupMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGroupMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Group Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getGroupMasterList();
                    },error => {
                        this.toastr.error('Group Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
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
    GroupId: number;
    GroupName: string;
    Isconsolidated: boolean;
    IsConsolidatedDR: boolean;
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
            this.GroupId = GroupMaster.GroupId || "";
            this.GroupName = GroupMaster.GroupName || "";
            this.Isconsolidated = GroupMaster.Isconsolidated || "false";
            this.IsConsolidatedDR = GroupMaster.IsConsolidatedDR || "false";
            this.PrintSeqNo = GroupMaster.PrintSeqNo || "";
            this.IsActive = GroupMaster.IsActive || "false";
            this.AddedBy = GroupMaster.AddedBy || "";
            this.UpdatedBy = GroupMaster.UpdatedBy || "";
        }
    }
}
