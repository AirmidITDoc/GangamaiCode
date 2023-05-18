import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

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
        "AddedByName",
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
        this._unitmasterService.getUnitMasterList().subscribe((Menu) => {
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
                        UnitName: this._unitmasterService.myform
                            .get("UnitName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._unitmasterService
                    .insertUnitMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getUnitMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitMaster: {
                        UnitId: this._unitmasterService.myform.get("UnitId")
                            .value,
                        UnitName:
                            this._unitmasterService.myform.get("UnitName")
                                .value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._unitmasterService
                    .updateUnitMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
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
    AddedByName: string;

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
            this.AddedByName = PathunitMaster.AddedByName || "";
        }
    }
}
