import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { LocationMasterService } from "./location-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

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

        "IsDeleted",
        "action",
    ];

    DSLocationMasterList = new MatTableDataSource<LocationMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _locationService: LocationMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getLocationMasterList();
    }

    onSearch() {
        this.getLocationMasterList();
    }

    onSearchClear() {
        this._locationService.myformSearch.reset({
            LocationNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getLocationMasterList();
    }
 
    getLocationMasterList() {
        var param = {
            LocationName:this._locationService.myformSearch.get("LocationNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._locationService.getLocationMasterList(param).subscribe((Menu) => {
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
                        locatioName_1: this._locationService.myform
                            .get("LocationName")
                            .value.trim(),
                        //  addedBy: 1,
                        isActive_2: 1,
                    },
                };

                this._locationService
                    .locationMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getLocationMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getLocationMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Location Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getLocationMasterList();
                    },error => {
                        this.toastr.error('Location Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    locationMasterUpdate: {
                        locationId_1:
                            this._locationService.myform.get("LocationId")
                                .value,
                        locationName_2: this._locationService.myform
                            .get("LocationName")
                            .value.trim(),
                        isActive_3: 1,
                        // updatedBy: 1,
                    },
                };

                this._locationService
                    .locationMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getLocationMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getLocationMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Location Master Data not Updated !, Please check API error..', 'Updated !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getLocationMasterList();
                    },error => {
                        this.toastr.error('Location Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            LocationId: row.LocationId,
            LocationName: row.LocationName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
        };
        this._locationService.populateForm(m_data);
    }
}
export class LocationMaster {
    LocationId: number;
    LocationName: string;
    IsDeleted: boolean;
    // AddedBy: number;
    // UpdatedBy: number;

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
            // this.AddedBy = LocationMaster.AddedBy || "";
            // this.UpdatedBy = LocationMaster.UpdatedBy || "";
        }
    }
}
