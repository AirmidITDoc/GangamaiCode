import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { VillageMasterService } from "./village-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";

@Component({
    selector: "app-village-master",
    templateUrl: "./village-master.component.html",
    styleUrls: ["./village-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VillageMasterComponent implements OnInit {
    VillageMasterList: any;
    TalukacmbList: any = [];
    msg: any;

    // taluka filter
    public talukaFilterCtrl: FormControl = new FormControl();
    public filteredTaluka: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "VillageId",
        "VillageName",
        "TalukaName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSVillageMasterList = new MatTableDataSource<VillageMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _VillageService: VillageMasterService) {}

    ngOnInit(): void {
        this.getVillageMasterList();
        this.getTalukaMasterCombo();

        this.talukaFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterTaluka();
            });
    }

    onSearch() {
        this.getVillageMasterList();
    }

    onSearchClear() {
        this._VillageService.myformSearch.reset({
            VillageNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    private filterTaluka() {
        // debugger;
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
        // filter
        this.filteredTaluka.next(
            this.TalukacmbList.filter(
                (bank) => bank.TalukaName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getVillageMasterList() {
        var param = {
            VillageName: "%",
        };
        this._VillageService.getVillageMasterList(param).subscribe((Menu) => {
            this.DSVillageMasterList.data = Menu as VillageMaster[];
            this.DSVillageMasterList.sort = this.sort;
            this.DSVillageMasterList.paginator = this.paginator;
        });
    }

    getTalukaMasterCombo() {
        // this._VillageService.getTalukaMasterCombo().subscribe(data => this.TalukacmbList =data);
        this._VillageService.getTalukaMasterCombo().subscribe((data) => {
            this.TalukacmbList = data;
            this.filteredTaluka.next(this.TalukacmbList.slice());
        });
    }

    onClear() {
        this._VillageService.myForm.reset({ IsDeleted: "false" });
        this._VillageService.initializeFormGroup();
    }

    onSubmit() {
        if (this._VillageService.myForm.valid) {
            if (!this._VillageService.myForm.get("VillageId").value) {
                var m_data = {
                    villageMasterInsert: {
                        VillageName: this._VillageService.myForm
                            .get("VillageName")
                            .value.trim(),
                        TalukaId:
                            this._VillageService.myForm.get("TalukaId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._VillageService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._VillageService
                    .villageMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        this.getVillageMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    villageMasterUpdate: {
                        VillageId:
                            this._VillageService.myForm.get("VillageId").value,
                        VillageName: this._VillageService.myForm
                            .get("VillageName")
                            .value.trim(),
                        TalukaId:
                            this._VillageService.myForm.get("TalukaId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._VillageService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._VillageService
                    .villageMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        this.getVillageMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            VillageId: row.VillageId,
            VillageName: row.VillageName.trim(),
            TalukaId: row.TalukaId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._VillageService.populateForm(m_data1);
    }
}

export class VillageMaster {
    VillageId: number;
    VillageName: string;
    TalukaId: number;
    TalukaName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param VillageMaster
     */
    constructor(VillageMaster) {
        {
            this.VillageId = VillageMaster.VillageId || "";
            this.VillageName = VillageMaster.VillageName || "";
            this.TalukaId = VillageMaster.TalukaId || "";
            this.TalukaName = VillageMaster.TalukaName || "";
            this.IsDeleted = VillageMaster.IsDeleted || "false";
            this.AddedBy = VillageMaster.AddedBy || "";
            this.UpdatedBy = VillageMaster.UpdatedBy || "";
            this.AddedByName = VillageMaster.AddedByName || "";
        }
    }
}
