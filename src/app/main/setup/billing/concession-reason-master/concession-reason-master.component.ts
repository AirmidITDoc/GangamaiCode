import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ConcessionReasonMasterService } from "./concession-reason-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";

@Component({
    selector: "app-concession-reason-master",
    templateUrl: "./concession-reason-master.component.html",
    styleUrls: ["./concession-reason-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ConcessionReasonMasterComponent implements OnInit {
    ConsessionreasonMasterList: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "ConcessionId",
        "ConcessionReasonName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSConcessionReasonMasterList =
        new MatTableDataSource<ConcessionReasonMaster>();

    constructor(
        public _consessionreasonService: ConcessionReasonMasterService
    ) {}

    ngOnInit(): void {
        this.getConcessionreasonMasterList();
    }
    onSearch() {
        this.getConcessionreasonMasterList();
    }

    onSearchClear() {
        this._consessionreasonService.myformSearch.reset({
            ConcessionReasonNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getConcessionreasonMasterList() {
        var param = { ConcessionReasonName: "%" };
        this._consessionreasonService
            .getConcessionreasonMasterList(param)
            .subscribe((Menu) => {
                this.DSConcessionReasonMasterList.data =
                    Menu as ConcessionReasonMaster[];
                this.DSConcessionReasonMasterList.sort = this.sort;
                this.DSConcessionReasonMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._consessionreasonService.myform.reset({ IsDeleted: "false" });
        this._consessionreasonService.initializeFormGroup();
    }

    onSubmit() {
        if (this._consessionreasonService.myform.valid) {
            if (
                !this._consessionreasonService.myform.get("ConcessionId").value
            ) {
                var m_data = {
                    consessionReasonMasterInsert: {
                        concessionReason: this._consessionreasonService.myform
                            .get("ConcessionReasonName")
                            .value.trim(),
                        addedBy: 10,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._consessionreasonService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._consessionreasonService
                    .consessionReasonMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getConcessionreasonMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getConcessionreasonMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    consessionReasonMasterUpdate: {
                        concessionId:
                            this._consessionreasonService.myform.get(
                                "ConcessionId"
                            ).value,
                        concessionReason:
                            this._consessionreasonService.myform.get(
                                "ConcessionReasonName"
                            ).value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._consessionreasonService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 10,
                    },
                };

                this._consessionreasonService
                    .consessionReasonMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getConcessionreasonMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getConcessionreasonMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            ConcessionId: row.ConcessionId,
            ConcessionReasonName: row.ConcessionReason,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._consessionreasonService.populateForm(m_data);
    }
}

export class ConcessionReasonMaster {
    ConcessionId: number;
    ConcessionReasonName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ConcessionReasonMaster
     */
    constructor(ConcessionReasonMaster) {
        {
            this.ConcessionId = ConcessionReasonMaster.ConcessionId || "";
            this.ConcessionReasonName =
                ConcessionReasonMaster.ConcessionReasonName || "";
            this.IsDeleted = ConcessionReasonMaster.IsDeleted || "false";
            this.AddedBy = ConcessionReasonMaster.AddedBy || "";
            this.UpdatedBy = ConcessionReasonMaster.UpdatedBy || "";
            this.AddedByName = ConcessionReasonMaster.AddedByName || "";
        }
    }
}
