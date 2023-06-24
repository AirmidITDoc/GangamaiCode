import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { CityMasterService } from "./city-master.service";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {
    CityMasterList: any;
    StatecmbList: any = [];
    msg: any;

    //state filter
    public stateFilterCtrl: FormControl = new FormControl();
    public filteredState: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "CITYID",
        "CITYNAME",
        "STATENAME",
        "AddedBy",
        "ISDELETED",
        "action",
    ];

    DSCityMasterList = new MatTableDataSource<CityMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _cityService: CityMasterService) {}

    ngOnInit(): void {
        this.getCityMasterList();
        this.getStateNameCombobox();

        this.stateFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterState();
            });
    }

    onSearch() {
        this.getCityMasterList();
    }

    onSearchClear() {
        this._cityService.myformSearch.reset({
            CityNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    private filterState() {
        if (!this.StatecmbList) {
            return;
        }
        // get the search keyword
        let search = this.stateFilterCtrl.value;
        if (!search) {
            this.filteredState.next(this.StatecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredState.next(
            this.StatecmbList.filter(
                (bank) => bank.StateName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getCityMasterList() {
        var param = { CityName: "%" };
        this._cityService.getCityMasterList(param).subscribe((Menu) => {
            this.DSCityMasterList.data = Menu as CityMaster[];
            this.DSCityMasterList.sort = this.sort;
            this.DSCityMasterList.paginator = this.paginator;
        });
    }

    getStateNameCombobox() {
        this._cityService
            .getStateMasterCombo()
            .subscribe((data) => (this.StatecmbList = data));
    }

    onClear() {
        this._cityService.myform.reset({ IsDeleted: "false" });
        this._cityService.initializeFormGroup();
    }

    onSubmit() {
        if (this._cityService.myform.valid) {
            if (!this._cityService.myform.get("CityId").value) {
                var m_data = {
                    cityMasterInsert: {
                        cityName: this._cityService.myform
                            .get("CityName")
                            .value.trim(),
                        stateId:
                            this._cityService.myform.get("StateId").value
                                .StateId,
                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._cityService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._cityService.cityMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    if (data) {
                        Swal.fire(
                            "Saved !",
                            "Record saved Successfully !",
                            "success"
                        ).then((result) => {
                            if (result.isConfirmed) {
                                this.getCityMasterList();
                            }
                        });
                    } else {
                        Swal.fire("Error !", "Appoinment not saved", "error");
                    }
                    this.getCityMasterList();
                });
            } else {
                var m_dataUpdate = {
                    cityMasterUpdate: {
                        cityId: this._cityService.myform.get("CityId").value,
                        cityName: this._cityService.myform
                            .get("CityName")
                            .value.trim(),
                        stateId:
                            this._cityService.myform.get("StateId").value
                                .StateId,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._cityService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._cityService
                    .cityMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getCityMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getCityMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            CityId: row.CITYID,
            CityName: row.CITYNAME,
            StateId: row.STATEID,
            IsDeleted: JSON.stringify(row.ISDELETED),
            UpdatedBy: row.UpdatedBy,
        };
        this._cityService.populateForm(m_data);
    }
}

export class CityMaster {
    CityId: number;
    CityName: string;
    StateId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CityMaster
     */
    constructor(CityMaster) {
        {
            this.CityId = CityMaster.CityId || "";
            this.CityName = CityMaster.CityName || "";
            this.StateId = CityMaster.StateId || "";
            this.IsDeleted = CityMaster.IsDeleted || "false";
            this.AddedBy = CityMaster.AddedBy || "";
            this.UpdatedBy = CityMaster.UpdatedBy || "";
        }
    }
}
