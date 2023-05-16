import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { LocationMasterService } from "./location-master.service";

@Component({
    selector: "app-location-master",
    templateUrl: "./location-master.component.html",
    styleUrls: ["./location-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class LocationMasterComponent implements OnInit {
    LocationMasterList: any;
    msg: any;

    displayedColumns: string[] = [
        "LocationId",
        "LocationName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSLocationMasterList = new MatTableDataSource<LocationMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _locationService: LocationMasterService) {}

    ngOnInit(): void {
        this.getLocationMasterList();
    }

    onSearch() {
        this.getLocationMasterList();
    }

    onSearchClear() {
        this._locationService.myformSearch.reset({
            StateNameSearch: "",
            IsDeletedSearch: "2",
        });
    }

    getLocationMasterList() {
        this._locationService.getLocationMasterList().subscribe((Menu) => {
            this.DSLocationMasterList.data = Menu as LocationMaster[];
            this.DSLocationMasterList.sort = this.sort;
            this.DSLocationMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._locationService.myform.reset({ IsDeleted: "false" });
        this._locationService.initializeFormGroup();
    }

    onSubmit() {
        if (this._locationService.myform.valid) {
            if (!this._locationService.myform.get("LocationId").value) {
                var m_data = {
                    locationMasterInsert: {
                        LocationName: this._locationService.myform
                            .get("LocationName")
                            .value.trim(),

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._locationService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._locationService
                    .locationMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getLocationMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    locationMasterUpdate: {
                        LocationId:
                            this._locationService.myform.get("LocationId")
                                .value,
                        LocationName: this._locationService.myform
                            .get("LocationName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._locationService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };

                this._locationService
                    .locationMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getLocationMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            LocationId: row.LocationId,
            LocationName: row.LocationName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._locationService.populateForm(m_data);
    }
}
export class LocationMaster {
    LocationId: number;
    LocationName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param LocationMaster
     */
    constructor(LocationMaster) {
        {
            this.LocationId = LocationMaster.LocationId || "";
            this.LocationName = LocationMaster.LocationName || "";
            this.IsDeleted = LocationMaster.IsDeleted || "false";
            this.AddedBy = LocationMaster.AddedBy || "";
            this.UpdatedBy = LocationMaster.UpdatedBy || "";
        }
    }
}
