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

@Component({
    selector: "app-sub-group-master",
    templateUrl: "./sub-group-master.component.html",
    styleUrls: ["./sub-group-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class SubGroupMasterComponent implements OnInit {
    SubgroupMasterList: any;
    GroupcmbList: any = [];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "SubGroupId",
        "SubGroupName",
        "GroupName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSSubGroupMasterList = new MatTableDataSource<SubGroupMaster>();

    //groupname filter
    public groupnameFilterCtrl: FormControl = new FormControl();
    public filteredGroupname: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _subgroupService: SubGroupMasterService) {}

    ngOnInit(): void {
        this.getSubgroupMasterList();
        this.getGroupNameCombobox();

        this.groupnameFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterGroupname();
            });
    }
    onSearch() {
        this.getSubgroupMasterList();
    }

    onSearchClear() {
        this._subgroupService.myformSearch.reset({
            SubGroupNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    private filterGroupname() {
        // debugger;
        if (!this.GroupcmbList) {
            return;
        }
        // get the search keyword
        let search = this.groupnameFilterCtrl.value;
        if (!search) {
            this.filteredGroupname.next(this.GroupcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredGroupname.next(
            this.GroupcmbList.filter(
                (bank) => bank.GroupName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getSubgroupMasterList() {
        var param = { SubGroupName: "%" };
        this._subgroupService.getSubgroupMasterList(param).subscribe((Menu) => {
            this.DSSubGroupMasterList.data = Menu as SubGroupMaster[];
            this.DSSubGroupMasterList.sort = this.sort;
            this.DSSubGroupMasterList.paginator = this.paginator;
        });
    }

    getGroupNameCombobox() {
        this._subgroupService.getGroupMasterCombo().subscribe((data) => {
            this.GroupcmbList = data;
            this.filteredGroupname.next(this.GroupcmbList.slice());
            this._subgroupService.myform
                .get("GroupId")
                .setValue(this.GroupcmbList[0]);
        });
    }
    onClear() {
        this._subgroupService.myform.reset({ IsDeleted: "false" });
        this._subgroupService.initializeFormGroup();
    }

    onSubmit() {
        if (this._subgroupService.myform.valid) {
            if (!this._subgroupService.myform.get("SubGroupId").value) {
                var m_data = {
                    subGroupMasterInsert: {
                        groupId:
                            this._subgroupService.myform.get("GroupId").value,
                        subGroupName: this._subgroupService.myform
                            .get("SubGroupName")
                            .value.trim(),
                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._subgroupService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._subgroupService
                    .subGroupMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getSubgroupMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getSubgroupMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    subGroupMasterUpdate: {
                        subGroupID:
                            this._subgroupService.myform.get("SubGroupId")
                                .value,
                        groupId:
                            this._subgroupService.myform.get("GroupId").value,
                        subGroupName:
                            this._subgroupService.myform.get("SubGroupName")
                                .value,

                        isDeleted: Boolean(
                            JSON.parse(
                                this._subgroupService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._subgroupService
                    .subGroupMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getSubgroupMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getSubgroupMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            SubGroupId: row.SubGroupId,
            SubGroupName: row.SubGroupName.trim(),
            GroupId: row.GroupId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._subgroupService.populateForm(m_data);
    }
}

export class SubGroupMaster {
    SubGroupId: number;
    SubGroupName: string;
    GroupId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param SubGroupMaster
     */
    constructor(SubGroupMaster) {
        {
            this.SubGroupId = SubGroupMaster.SubGroupId || "";
            this.SubGroupName = SubGroupMaster.SubGroupName || "";
            this.GroupId = SubGroupMaster.GroupId || "";
            this.IsDeleted = SubGroupMaster.IsDeleted || "false";
            this.AddedBy = SubGroupMaster.AddedBy || "";
            this.UpdatedBy = SubGroupMaster.UpdatedBy || "";
            this.AddedByName = SubGroupMaster.AddedByName || "";
        }
    }
}
