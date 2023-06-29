import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";

@Component({
    selector: "app-unitmaster",
    templateUrl: "./unitmaster.component.html",
    styleUrls: ["./unitmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UnitmasterComponent implements OnInit {
    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "UnitId",
        "UnitName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSUnitmasterList = new MatTableDataSource<PathunitMaster>();

    constructor(public _unitmasterService: UnitmasterService) {}

    ngOnInit(): void {
        this.getUnitMasterList();
    }
    onSearch() {
        this.getUnitMasterList();
    }

    onSearchClear() {
        this._unitmasterService.myformSearch.reset({
            UnitNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getUnitMasterList() {
        var param = { UnitName: "%" };
        this._unitmasterService.getUnitMasterList(param).subscribe((Menu) => {
            this.DSUnitmasterList.data = Menu as PathunitMaster[];
            this.DSUnitmasterList.sort = this.sort;
            this.DSUnitmasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._unitmasterService.myform.reset({ IsDeleted: "false" });
        this._unitmasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._unitmasterService.myform.valid) {
            if (!this._unitmasterService.myform.get("UnitId").value) {
                var m_data = {
                    insertUnitMaster: {
                        unitName: this._unitmasterService.myform
                            .get("UnitName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._unitmasterService
                    .insertUnitMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getUnitMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getUnitMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitMaster: {
                        unitId: this._unitmasterService.myform.get("UnitId")
                            .value,
                        unitName:
                            this._unitmasterService.myform.get("UnitName")
                                .value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._unitmasterService
                    .updateUnitMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getUnitMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getUnitMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            UnitId: row.UnitId,
            UnitName: row.UnitName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._unitmasterService.populateForm(m_data);
    }
}

export class PathunitMaster {
    UnitId: number;
    UnitName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PathunitMaster
     */
    constructor(PathunitMaster) {
        {
            this.UnitId = PathunitMaster.UnitId || "";
            this.UnitName = PathunitMaster.UnitName || "";
            this.IsDeleted = PathunitMaster.IsDeleted || "false";
            this.AddedBy = PathunitMaster.AddedBy || "";
            this.UpdatedBy = PathunitMaster.UpdatedBy || "";
        }
    }
}
