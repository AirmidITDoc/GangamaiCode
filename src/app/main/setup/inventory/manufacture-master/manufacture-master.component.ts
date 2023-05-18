import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ManufactureMasterService } from "./manufacture-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-manufacture-master",
    templateUrl: "./manufacture-master.component.html",
    styleUrls: ["./manufacture-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ManufactureMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ManufId",
        "ManufName",
        "ManufShortName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSManufactureMasterList = new MatTableDataSource<ManufactureMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _manufactureService: ManufactureMasterService) {}

    ngOnInit(): void {
        this.getmanufactureMasterList();
    }
    onSearch() {
        this.getmanufactureMasterList();
    }

    onSearchClear() {
        this._manufactureService.myformSearch.reset({
            ManufNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getmanufactureMasterList() {
        this._manufactureService
            .getmanufactureMasterList()
            .subscribe((Menu) => {
                this.DSManufactureMasterList.data = Menu as ManufactureMaster[];
                this.DSManufactureMasterList.sort = this.sort;
                this.DSManufactureMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._manufactureService.myform.reset({ IsDeleted: "false" });
        this._manufactureService.initializeFormGroup();
    }

    onSubmit() {
        if (this._manufactureService.myform.valid) {
            if (!this._manufactureService.myform.get("ManufId").value) {
                var m_data = {
                    insertManufactureMaster: {
                        ManufName: this._manufactureService.myform
                            .get("ManufName")
                            .value.trim(),
                        ManufShortName: this._manufactureService.myform
                            .get("ManufShortName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._manufactureService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._manufactureService
                    .insertManufactureMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getmanufactureMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateManufactureMaster: {
                        ManufId:
                            this._manufactureService.myform.get(
                                "ManufIdManufId"
                            ).value,
                        ManufName: this._manufactureService.myform
                            .get("ManufName")
                            .value.trim(),
                        ManufShortName: this._manufactureService.myform
                            .get("ManufShortName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._manufactureService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                console.log(m_dataUpdate);
                this._manufactureService
                    .updateManufactureMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getmanufactureMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ManufId: row.ManufId,
            ManufName: row.ManufName.trim(),
            ManufShortName: row.ManufShortName.trim(),
            UpdatedBy: row.UpdatedBy,
        };
        this._manufactureService.populateForm(m_data);
    }
}
export class ManufactureMaster {
    ManufId: number;
    ManufName: string;
    ManufShortName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ManufactureMaster
     */
    constructor(ManufactureMaster) {
        {
            this.ManufId = ManufactureMaster.ManufId || "";
            this.ManufName = ManufactureMaster.ManufName || "";
            this.ManufShortName = ManufactureMaster.ManufShortName || "";
            this.IsDeleted = ManufactureMaster.IsDeleted || "false";
            this.AddedBy = ManufactureMaster.AddedBy || "";
            this.UpdatedBy = ManufactureMaster.UpdatedBy || "";
        }
    }
}
