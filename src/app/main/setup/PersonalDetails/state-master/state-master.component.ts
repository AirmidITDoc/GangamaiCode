import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { StateMasterService } from "./state-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

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
    autocompleteModecountry: string = "Country";
    //country filter
    public countryFilterCtrl: FormControl = new FormControl();
    public filteredCountry: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "StateId",
        "StateName",
        "CountryName",
        //  "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSStateMasterList = new MatTableDataSource<StateMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _stateService: StateMasterService,
        public toastr : ToastrService,) {}

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
        this.getstateMasterList();
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
            StateName:
                this._stateService.myformSearch
                    .get("StateNameSearch")
                    .value.trim() || "%",
        };
        this._stateService.getstateMasterList(param).subscribe((Menu) => {
            this.DSStateMasterList.data = Menu as StateMaster[];
            this.DSStateMasterList.sort = this.sort;
            this.DSStateMasterList.paginator = this.paginator;
        });
    }

    getCountryNameCombobox() {
        this._stateService.getCountryMasterCombo().subscribe((data) => {
            this.CountrycmbList = data
        });
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
                            this._stateService.myform.get("CountryId").value
                                .CountryId,

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
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getstateMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getstateMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('State Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        console.log(m_data);
                        this.getstateMasterList();
                    },error => {
                        this.toastr.error('State Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
            } else {
                var m_dataUpdate = {
                    stateMasterUpdate: {
                        stateId: this._stateService.myform.get("StateId").value,
                        stateName: this._stateService.myform
                            .get("StateName")
                            .value.trim(),
                        countryId:
                            this._stateService.myform.get("CountryId").value
                                .CountryId,
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
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getstateMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getstateMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('State Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getstateMasterList();
                    },error => {
                        this.toastr.error('State Master Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
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
            CountryName: row.CountryName.trim(),
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._stateService.populateForm(m_data);
    }


    getValidationMessages() {
        return {
            CountryId: [
                { name: "required", Message: "CountryId  is required" }
            ],
        };
    }
}

export class StateMaster {
    StateId: number;
    StateName: string;
    CountryId: number;
    CountryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

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
