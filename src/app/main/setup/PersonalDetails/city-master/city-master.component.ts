import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { CityMasterService } from "./city-master.service";
import { takeUntil } from "rxjs/operators";

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
        "CityId",
        "CityName",
        "StateName",
        "AddedByName",
        "IsDeleted",
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
                (bank) => bank.CountryName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getCityMasterList() {
        this._cityService.getCityMasterList().subscribe((Menu) => {
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
                        stateId: this._cityService.myform.get("StateId").value,
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
                    this.getCityMasterList();
                });
            } else {
                var m_dataUpdate = {
                    cityMasterUpdate: {
                        cityId: this._cityService.myform.get("StateId").value,
                        cityName: this._cityService.myform
                            .get("CityName")
                            .value.trim(),
                        stateId: this._cityService.myform.get("StateId").value,
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
                        this.getCityMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            StateId: row.StateId,
            StateName: row.StateName.trim(),
            CountryId: row.CountryId,
            IsDeleted: JSON.stringify(row.IsDeleted),
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
