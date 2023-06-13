import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { StateMasterService } from "./state-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-state-master",
    templateUrl: "./state-master.component.html",
    styleUrls: ["./state-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StateMasterComponent implements OnInit {
    StateMasterList: any;
    CountrycmbList: any = [];
    msg: any;

    //country filter
    public countryFilterCtrl: FormControl = new FormControl();
    public filteredCountry: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "StateId",
        "StateName",
        "CountryName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSStateMasterList = new MatTableDataSource<StateMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _stateService: StateMasterService) {}

    ngOnInit(): void {
        this.getstateMasterList();
        this.getCountryNameCombobox();

        this.countryFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCountry();
            });
    }

    onSearch() {
        this.getstateMasterList();
    }

    onSearchClear() {
        this._stateService.myformSearch.reset({
            StateNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    private filterCountry() {
        if (!this.CountrycmbList) {
            return;
        }
        // get the search keyword
        let search = this.countryFilterCtrl.value;
        if (!search) {
            this.filteredCountry.next(this.CountrycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredCountry.next(
            this.CountrycmbList.filter(
                (bank) => bank.CountryName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getstateMasterList() {
        var param = {
            StateName: "%",
        };
        this._stateService.getstateMasterList(param).subscribe((Menu) => {
            this.DSStateMasterList.data = Menu as StateMaster[];
            this.DSStateMasterList.sort = this.sort;
            this.DSStateMasterList.paginator = this.paginator;
        });
    }

    getCountryNameCombobox() {
        this._stateService
            .getCountryMasterCombo()
            .subscribe((data) => (this.CountrycmbList = data));
    }

    onClear() {
        this._stateService.myform.reset({ IsDeleted: "false" });
        this._stateService.initializeFormGroup();
    }

    onSubmit() {
        if (this._stateService.myform.valid) {
            if (!this._stateService.myform.get("StateId").value) {
                var m_data = {
                    stateMasterInsert: {
                        stateName: this._stateService.myform
                            .get("StateName")
                            .value.trim(),
                        countryId:
                            this._stateService.myform.get("CountryId").value,

                        addedBy: 1,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._stateService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._stateService
                    .stateMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getstateMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    stateMasterUpdate: {
                        stateId: this._stateService.myform.get("StateId").value,
                        stateName: this._stateService.myform
                            .get("StateName")
                            .value.trim(),
                        countryId:
                            this._stateService.myform.get("CountryId").value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._stateService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._stateService
                    .stateMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getstateMasterList();
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
        this._stateService.populateForm(m_data);
    }
}

export class StateMaster {
    StateId: number;
    StateName: string;
    CountryId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param StateMaster
     */
    constructor(StateMaster) {
        {
            this.StateId = StateMaster.StateId || "";
            this.StateName = StateMaster.StateName || "";
            this.CountryId = StateMaster.CountryId || "";
            this.IsDeleted = StateMaster.IsDeleted || "false";
            this.AddedBy = StateMaster.AddedBy || "";
            this.UpdatedBy = StateMaster.UpdatedBy || "";
        }
    }
}
