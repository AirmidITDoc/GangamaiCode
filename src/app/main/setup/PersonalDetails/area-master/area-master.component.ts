import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { AreaMasterService } from "./area-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { AuthenticationService } from "app/core/services/authentication.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AreaMasterComponent implements OnInit {
    AreaMasterList: any;
    CitycmbList: any = [];
    msg: any;

    // city filter
    public cityFilterCtrl: FormControl = new FormControl();
    public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);
    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "AreaId",
        "AreaName",
        //  "CityName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSAreaMasterList = new MatTableDataSource<AreaMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _AreaService: AreaMasterService,
        public toastr : ToastrService,
        private accountService: AuthenticationService
    ) {}

    ngOnInit(): void {
        this.getAreaMasterList();
        this.getCityMasterCombo();

        this.cityFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
            this.filterCity();
        });
    }

    onSearch() {
        this.getAreaMasterList();
    }

    onSearchClear() {
        this._AreaService.myformSearch.reset({
            AreaNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getAreaMasterList();
    }
    private filterCity() {
        // debugger;
        if (!this.CitycmbList) {
            return;
        }
        // get the search keyword
        let search = this.cityFilterCtrl.value;
        if (!search) {
            this.filteredCity.next(this.CitycmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredCity.next(
            this.CitycmbList.filter(
                (bank) => bank.CityName.toLowerCase().indexOf(search) > -1
            )
        );     
    }
    getCityMasterCombo() {
        this._AreaService.getCityMasterCombo().subscribe((data) => {
            this.CitycmbList = data;
            this.filteredCity.next(this.CitycmbList.slice());
        
            console.log(this.CitycmbList)
        });
    }

    getAreaMasterList() {
        var param = {
            AreaName:
                this._AreaService.myformSearch
                    .get("AreaNameSearch")
                    .value.trim() || "%",
        };
        this._AreaService.getAreaMasterList(param).subscribe((Menu) => {
            this.DSAreaMasterList.data = Menu as AreaMaster[];
            this.DSAreaMasterList.sort = this.sort;
            this.DSAreaMasterList.paginator = this.paginator;
        });
    }

  

    onClear() {
        this._AreaService.myform.reset({ IsDeleted: "false" });
        this._AreaService.initializeFormGroup();
    }

    onSubmit() {
        if (this._AreaService.myform.valid) {
            if (!this._AreaService.myform.get("AreaId").value) {
                var m_data = {
                    areaMasterInsert: {
                        areaName: this._AreaService.myform
                            .get("AreaName")
                            .value.trim(),
                        addedBy: 10,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._AreaService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._AreaService.areaMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                          });
                          this.getAreaMasterList();
                        // Swal.fire(
                        //     "Saved !",
                        //     "Record saved Successfully !",
                        //     "success"
                        // ).then((result) => {
                        //     if (result.isConfirmed) {
                        //         this.getAreaMasterList();
                        //     }
                        // });
                    } else {
                        this.toastr.error('Area Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                          });
                    }
                    this.getAreaMasterList();
                });
            } else {
                var m_dataUpdate = {
                    areaMasterUpdate: {
                        areaId: this._AreaService.myform.get("AreaId").value,
                        areaName: this._AreaService.myform
                            .get("AreaName")
                            .value.trim(),
                        // CityId: this._AreaService.myform.get("CityId").value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._AreaService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._AreaService
                    .areaMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getAreaMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getAreaMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Area Master Data not Updated !, Please check API error..', 'Updated !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getAreaMasterList();
                    },error => {
                        this.toastr.error('Area Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     } );
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            AreaId: row.AreaId,
            AreaName: row.AreaName.trim(),
            CityId: row.CityId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._AreaService.populateForm(m_data);
    }
}

export class AreaMaster {
    AreaId: number;
    AreaName: string;
    CityId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param AreaMaster
     */
    constructor(AreaMaster) {
        {
            this.AreaId = AreaMaster.AreaId || "";
            this.AreaName = AreaMaster.AreaName || "";
            this.CityId = AreaMaster.CityId || "";
            this.IsDeleted = AreaMaster.IsDeleted || "false";
            this.AddedBy = AreaMaster.AddedBy || "";
            this.UpdatedBy = AreaMaster.UpdatedBy || "";
        }
    }
}
