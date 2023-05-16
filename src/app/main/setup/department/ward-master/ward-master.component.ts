import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WardMasterService } from "./ward-master.service";

@Component({
    selector: "app-ward-master",
    templateUrl: "./ward-master.component.html",
    styleUrls: ["./ward-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class WardMasterComponent implements OnInit {
    WardMasterList: any;
    LocationcmbList: any = [];
    ClasscmbList: any = [];
    msg: any;

    displayedColumns: string[] = [
        "RoomId",
        "RoomName",
        "LocationName",
        "ClassName",
        "AddedByName",
        "IsAvailable",
        "IsDeleted",
        "action",
    ];

    DSWardMasterList = new MatTableDataSource<WardMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    //Class filter
    public classFilterCtrl: FormControl = new FormControl();
    public filteredClass: ReplaySubject<any> = new ReplaySubject<any>(1);

    //location filter
    public locationFilterCtrl: FormControl = new FormControl();
    public filteredLocation: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _wardService: WardMasterService) {}

    ngOnInit(): void {
        this.getwardMasterList();
        this.getLocationNameCombobox();
        this.getClassNameCombobox();

        this.locationFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterLocation();
            });

        this.classFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterClass();
            });
    }
    onSearch() {
        this.getwardMasterList();
    }

    onSearchClear() {
        this._wardService.myformSearch.reset({
            RoomNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    private filterLocation() {
        // debugger;
        if (!this.LocationcmbList) {
            return;
        }
        // get the search keyword
        let search = this.locationFilterCtrl.value;
        if (!search) {
            this.filteredLocation.next(this.LocationcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredLocation.next(
            this.LocationcmbList.filter(
                (bank) => bank.LocationName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    private filterClass() {
        // debugger;
        if (!this.ClasscmbList) {
            return;
        }
        // get the search keyword
        let search = this.classFilterCtrl.value;
        if (!search) {
            this.filteredClass.next(this.ClasscmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredClass.next(
            this.ClasscmbList.filter(
                (bank) => bank.ClassName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getwardMasterList() {
        this._wardService.getwardMasterList().subscribe((Menu) => {
            this.DSWardMasterList.data = Menu as WardMaster[];
            this.DSWardMasterList.sort = this.sort;
            this.DSWardMasterList.paginator = this.paginator;
        });
    }

    getLocationNameCombobox() {
        this._wardService.getLocationMasterCombo().subscribe((data) => {
            this.LocationcmbList = data;
            this.filteredLocation.next(this.LocationcmbList.slice());
            this._wardService.myform
                .get("LocationId")
                .setValue(this.LocationcmbList[0]);
        });
    }

    getClassNameCombobox() {
        this._wardService.getClassMasterCombo().subscribe((data) => {
            this.ClasscmbList = data;
            this.filteredClass.next(this.ClasscmbList.slice());
            this._wardService.myform
                .get("ClassId")
                .setValue(this.ClasscmbList[0]);
        });
    }

    onClear() {
        this._wardService.myform.reset({ IsDeleted: "false" });
        this._wardService.initializeFormGroup();
    }

    onSubmit() {
        if (this._wardService.myform.valid) {
            if (!this._wardService.myform.get("RoomId").value) {
                var m_data = {
                    wardMasterInsert: {
                        RoomName: this._wardService.myform
                            .get("RoomName")
                            .value.trim(),
                        RoomType: "1",
                        LocationId:
                            this._wardService.myform.get("LocationId").value,
                        IsAvailable: Boolean(
                            JSON.parse(
                                this._wardService.myform.get("IsAvailable")
                                    .value
                            )
                        ),

                        IsDeleted: Boolean(
                            JSON.parse(
                                this._wardService.myform.get("IsDeleted").value
                            )
                        ),
                        ClassId: this._wardService.myform.get("ClassId").value,
                    },
                };
                this._wardService.wardMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    this.getwardMasterList();
                });
            } else {
                var m_dataUpdate = {
                    wardMasterUpdate: {
                        RoomId: this._wardService.myform.get("RoomId").value,
                        RoomName: this._wardService.myform
                            .get("RoomName")
                            .value.trim(),
                        RoomType: "1",
                        LocationId:
                            this._wardService.myform.get("LocationId").value,
                        IsAvailable: Boolean(
                            JSON.parse(
                                this._wardService.myform.get("IsAvailable")
                                    .value
                            )
                        ),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._wardService.myform.get("IsDeleted").value
                            )
                        ),

                        ClassId: this._wardService.myform.get("ClassId").value,
                    },
                };
                this._wardService
                    .wardMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getwardMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            RoomId: row.RoomId,
            RoomName: row.RoomName.trim(),
            LocationId: row.LocationId,
            IsAvailable: JSON.stringify(row.IsAvailable),
            ClassId: row.ClassID,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._wardService.populateForm(m_data);
    }
}
export class WardMaster {
    RoomId: number;
    RoomName: string;
    LocationId: number;
    IsAvailable: boolean;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    ClassId: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param WardMaster
     */
    constructor(WardMaster) {
        {
            this.RoomId = WardMaster.RoomId || "";
            this.RoomName = WardMaster.RoomName || "";
            this.LocationId = WardMaster.LocationId || "";
            this.IsAvailable = WardMaster.IsAvailable || "false";
            this.IsDeleted = WardMaster.IsDeleted || "false";
            this.AddedBy = WardMaster.AddedBy || "";
            this.UpdatedBy = WardMaster.UpdatedBy || "";
            this.ClassId = WardMaster.ClassId || "";
        }
    }
}
