import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { TaxMasterService } from "./tax-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-tax-master",
    templateUrl: "./tax-master.component.html",
    styleUrls: ["./tax-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TaxMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "Id",
        "TaxNature",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSTaxMasterList = new MatTableDataSource<TaxMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _taxmasterService: TaxMasterService) {}

    ngOnInit(): void {
        this.gettaxMasterList();
    }
    onSearch() {
        this.gettaxMasterList();
    }

    onSearchClear() {
        this._taxmasterService.myformSearch.reset({
            TaxNatureSearch: "",
            IsDeletedSearch: "2",
        });
    }
    gettaxMasterList() {
        this._taxmasterService.gettaxMasterList().subscribe((Menu) => {
            this.DSTaxMasterList.data = Menu as TaxMaster[];
            this.DSTaxMasterList.sort = this.sort;
            this.DSTaxMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._taxmasterService.myform.reset({ IsDeleted: "false" });
        this._taxmasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._taxmasterService.myform.valid) {
            if (!this._taxmasterService.myform.get("Id").value) {
                var m_data = {
                    insertTaxMaster: {
                        taxNature: this._taxmasterService.myform
                            .get("TaxNature")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._taxmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._taxmasterService
                    .insertTaxMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.gettaxMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateTaxMaster: {
                        id: this._taxmasterService.myform.get("Id").value,
                        taxNature: this._taxmasterService.myform
                            .get("TaxNature")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._taxmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._taxmasterService
                    .updateTaxMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.gettaxMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            Id: row.Id,
            TaxNature: row.TaxNature.trim(),
            UpdatedBy: row.UpdatedBy,
        };
        this._taxmasterService.populateForm(m_data);
    }
}
export class TaxMaster {
    Id: number;
    TaxNature: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param TaxMaster
     */
    constructor(TaxMaster) {
        {
            this.Id = TaxMaster.Id || "";
            this.TaxNature = TaxMaster.TaxNature || "";
            this.IsDeleted = TaxMaster.IsDeleted || "false";
            this.AddedBy = TaxMaster.AddedBy || "";
            this.UpdatedBy = TaxMaster.UpdatedBy || "";
        }
    }
}
