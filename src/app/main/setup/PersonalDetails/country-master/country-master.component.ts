import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CountryMasterService } from "./country-master.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "CountryId",
        "CountryName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSCountryMasterList = new MatTableDataSource<CountryMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _CountryService: CountryMasterService) {}

    ngOnInit(): void {
        this.getCountryMasterList();
    }
    onSearch() {
        this.getCountryMasterList();
    }

    onSearchClear() {
        this._CountryService.myformSearch.reset({
            CountryNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getCountryMasterList() {
        this._CountryService.getCountryMasterList().subscribe((Menu) => {
            this.DSCountryMasterList.data = Menu as CountryMaster[];
            this.DSCountryMasterList.sort = this.sort;
            this.DSCountryMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._CountryService.myform.reset({ IsDeleted: "false" });
        this._CountryService.initializeFormGroup();
    }

    onSubmit() {
        if (this._CountryService.myform.valid) {
            if (!this._CountryService.myform.get("CountryId").value) {
                var m_data = {
                    countryMasterInsert: {
                        CountryName: this._CountryService.myform
                            .get("CountryName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._CountryService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._CountryService
                    .countryMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCountryMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    countryMasterUpdate: {
                        CountryId:
                            this._CountryService.myform.get("CountryId").value,
                        CountryName: this._CountryService.myform
                            .get("CountryName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._CountryService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._CountryService
                    .countryMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCountryMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            CountryId: row.CountryId,
            CountryName: row.CountryName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._CountryService.populateForm(m_data);
    }
}

export class CountryMaster {
    CountryId: number;
    CountryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param CountryMaster
     */
    constructor(CountryMaster) {
        {
            this.CountryId = CountryMaster.CountryId || "";
            this.CountryName = CountryMaster.CountryName || "";
            this.IsDeleted = CountryMaster.IsDeleted || "false";
            this.AddedBy = CountryMaster.AddedBy || "";
            this.UpdatedBy = CountryMaster.UpdatedBy || "";
            this.AddedByName = CountryMaster.AddedByName || "";
        }
    }
}