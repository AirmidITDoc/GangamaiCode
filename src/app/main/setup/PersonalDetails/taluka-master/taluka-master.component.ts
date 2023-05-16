import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { TalukaMasterService } from "./taluka-master.service";
import { takeUntil } from "rxjs/operators";

@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
    TalukaMasterList: any;
    CitycmbList: any = [];
    msg: any;

    public cityFilterCtrl: FormControl = new FormControl();
    public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "TalukaId",
        "TalukaName",
        "CityName",
        "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSTalukaMasterList = new MatTableDataSource<TalukaMaster>();

    constructor(public _TalukaService: TalukaMasterService) {}

    ngOnInit(): void {
        this.getTalukaMasterList();
        this.getCityMasterCombo();

        this.cityFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterCity();
            });
    }
    onSearch() {
        this.getTalukaMasterList();
    }
    onSearchClear() {
        this._TalukaService.myformSearch.reset({
            TalukaNameSearch: "",
            IsDeletedSearch: "2",
        });
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

    getTalukaMasterList() {
        this._TalukaService
            .getTalukaMasterList()
            .subscribe(
                (Menu) =>
                    (this.DSTalukaMasterList.data = Menu as TalukaMaster[])
            );
    }

    getCityMasterCombo() {
        // this._TalukaService.getCityMasterCombo().subscribe(data => this.CitycmbList =data);
        this._TalukaService.getCityMasterCombo().subscribe((data) => {
            this.CitycmbList = data;
            this.filteredCity.next(this.CitycmbList.slice());
        });
    }

    onClear() {
        this._TalukaService.myForm.reset({ IsDeleted: "false" });
        this._TalukaService.initializeFormGroup();
    }

    onSubmit() {
        if (this._TalukaService.myForm.valid) {
            if (!this._TalukaService.myForm.get("TalukaId").value) {
                var m_data = {
                    talukaMasterInsert: {
                        TalukaName: this._TalukaService.myForm
                            .get("TalukaName")
                            .value.trim(),
                        CityId: this._TalukaService.myForm.get("CityId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._TalukaService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._TalukaService
                    .talukaMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        this.getTalukaMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    talukaMasterUpdate: {
                        TalukaId:
                            this._TalukaService.myForm.get("TalukaId").value,
                        TalukaName: this._TalukaService.myForm
                            .get("TalukaName")
                            .value.trim(),
                        CityId: this._TalukaService.myForm.get("CityId").value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._TalukaService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._TalukaService
                    .talukaMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        this.getTalukaMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        // console.log(row);
        var m_data1 = {
            TalukaId: row.TalukaId,
            TalukaName: row.TalukaName.trim(),
            CityId: row.CityId,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._TalukaService.populateForm(m_data1);
    }
}

export class TalukaMaster {
    TalukaId: number;
    TalukaName: string;
    CityId: number;
    CityName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param TalukaMaster
     */
    constructor(TalukaMaster) {
        {
            this.TalukaId = TalukaMaster.TalukaId || "";
            this.TalukaName = TalukaMaster.TalukaName || "";
            this.CityId = TalukaMaster.CityId || "";
            this.CityName = TalukaMaster.CityName || "";
            this.IsDeleted = TalukaMaster.IsDeleted || "false";
            this.AddedBy = TalukaMaster.AddedBy || "";
            this.UpdatedBy = TalukaMaster.UpdatedBy || "";
            this.AddedByName = TalukaMaster.AddedByName || "";
        }
    }
}
