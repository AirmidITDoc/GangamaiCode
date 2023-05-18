import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { AreaMasterService } from "./area-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AreaMasterComponent implements OnInit {
    AreaMasterList: any;
    TalukacmbList: any = [];
    msg: any;

    // taluka filter
    public talukaFilterCtrl: FormControl = new FormControl();
    public filteredTaluka: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "AreaId",
        "AreaName",
        "TalukaName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSAreaMasterList = new MatTableDataSource<AreaMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _AreaService: AreaMasterService) {}

    ngOnInit(): void {
        this.getAreaMasterList();
        this.getTalukaNameCombobox();

        this.talukaFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTaluka();
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
    }
    private filterTaluka() {
        if (!this.TalukacmbList) {
            return;
        }
        // get the search keyword
        let search = this.talukaFilterCtrl.value;
        if (!search) {
            this.filteredTaluka.next(this.TalukacmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredTaluka.next(
            this.TalukacmbList.filter(
                (bank) => bank.TalukaName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getAreaMasterList() {
        var param = {
            AreaName: "%",
        };
        this._AreaService.getAreaMasterList(param).subscribe((Menu) => {
            this.DSAreaMasterList.data = Menu as AreaMaster[];
            this.DSAreaMasterList.sort = this.sort;
            this.DSAreaMasterList.paginator = this.paginator;
        });
    }

    getTalukaNameCombobox() {
        this._AreaService
            .getTalukaMasterCombo()
            .subscribe((data) => (this.TalukacmbList = data));
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
                        AreaName: this._AreaService.myform
                            .get("AreaName")
                            .value.trim(),
                        TalukaId:
                            this._AreaService.myform.get("TalukaId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._AreaService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._AreaService.areaMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    this.getAreaMasterList();
                });
            } else {
                var m_dataUpdate = {
                    areaMasterUpdate: {
                        AreaId: this._AreaService.myform.get("AreaId").value,
                        AreaName: this._AreaService.myform
                            .get("AreaName")
                            .value.trim(),
                        TalukaId:
                            this._AreaService.myform.get("TalukaId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._AreaService.myform.get("IsDeleted").value
                            )
                        ),
                    },
                };

                this._AreaService
                    .areaMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getAreaMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            AreaId: row.AreaId,
            AreaName: row.AreaName.trim(),
            TalukaId: row.TalukaId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._AreaService.populateForm(m_data);
    }
}

export class AreaMaster {
    AreaId: number;
    AreaName: string;
    TalukaId: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param AreaMaster
     */
    constructor(AreaMaster) {
        {
            this.AreaId = AreaMaster.AreaId || "";
            this.AreaName = AreaMaster.AreaName || "";
            this.TalukaId = AreaMaster.TalukaId || "";
            this.IsDeleted = AreaMaster.IsDeleted || "false";
            this.AddedBy = AreaMaster.AddedBy || "";
            this.UpdatedBy = AreaMaster.UpdatedBy || "";
        }
    }
}
