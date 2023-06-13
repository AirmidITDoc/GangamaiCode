import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { BedMasterService } from "./bed-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: "app-bed-master",
    templateUrl: "./bed-master.component.html",
    styleUrls: ["./bed-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class BedMasterComponent implements OnInit {
    BedMasterList: any;
    WardcmbList: any = [];
    msg: any;

    displayedColumns: string[] = [
        "BedId",
        "BedName",
        "RoomName",
        "AddedByName",
        "IsAvailable",
        "IsDeleted",
        "action",
    ];

    DSBedMasterList = new MatTableDataSource<BedMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    //room filter
    public roomFilterCtrl: FormControl = new FormControl();
    public filteredRoom: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _bedService: BedMasterService) {}

    ngOnInit(): void {
        this.getbedMasterList();
        this.getWardNameCombobox();

        this.roomFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterRoom();
            });
    }

    private filterRoom() {
        // debugger;
        if (!this.WardcmbList) {
            return;
        }
        // get the search keyword
        let search = this.roomFilterCtrl.value;
        if (!search) {
            this.filteredRoom.next(this.WardcmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter
        this.filteredRoom.next(
            this.WardcmbList.filter(
                (bank) => bank.RoomName.toLowerCase().indexOf(search) > -1
            )
        );
    }
    onSearch() {
        this.getbedMasterList();
    }

    onSearchClear() {
        this._bedService.myformSearch.reset({
            BedNameSearch: "",
            IsDeletedSearch: "2",
        });
    }
    getbedMasterList() {
        this._bedService.getbedMasterList().subscribe((Menu) => {
            this.DSBedMasterList.data = Menu as BedMaster[];
            this.DSBedMasterList.sort = this.sort;
            this.DSBedMasterList.paginator = this.paginator;
        });
    }

    getWardNameCombobox() {
        this._bedService.getWardMasterCombo().subscribe((data) => {
            this.WardcmbList = data;
            this.filteredRoom.next(this.WardcmbList.slice());
            this._bedService.myform.get("RoomId").setValue(this.WardcmbList[0]);
        });
    }

    onClear() {
        this._bedService.myform.reset({ IsDeleted: "false" });
        this._bedService.initializeFormGroup();
    }

    onSubmit() {
        if (this._bedService.myform.valid) {
            if (!this._bedService.myform.get("BedId").value) {
                var m_data = {
                    bedMasterInsert: {
                        bedName: this._bedService.myform
                            .get("BedName")
                            .value.trim(),
                        roomId: this._bedService.myform.get("RoomId").value,
                        isAvailable: 1,
                        addedBy: 1,
                        isDeleted: 0,
                    },
                };

                this._bedService.bedMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    this.getbedMasterList();
                });
            } else {
                var m_dataUpdate = {
                    bedMasterUpdate: {
                        bedID: this._bedService.myform.get("BedId").value,
                        bedName: this._bedService.myform
                            .get("BedName")
                            .value.trim(),
                        roomId: this._bedService.myform.get("RoomId").value,
                        isAvailable: Boolean(
                            JSON.parse(
                                this._bedService.myform.get("IsAvailable").value
                            )
                        ),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._bedService.myform.get("IsDeleted").value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._bedService
                    .bedMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getbedMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            BedId: row.BedId,
            BedName: row.BedName.trim(),
            RoomId: row.RoomId,
            IsAvailable: JSON.stringify(row.IsAvailable),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._bedService.populateForm(m_data);
    }
}

export class BedMaster {
    BedId: number;
    BedName: string;
    RoomId: number;
    IsAvailable: boolean;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param BedMaster
     */
    constructor(BedMaster) {
        {
            this.BedId = BedMaster.BedId || "";
            this.BedName = BedMaster.BedName || "";
            this.RoomId = BedMaster.RoomId || "";
            this.IsAvailable = BedMaster.BedMaster || "";
            this.IsDeleted = BedMaster.IsDeleted || "false";
            this.AddedBy = BedMaster.AddedBy || "";
            this.UpdatedBy = BedMaster.UpdatedBy || "";
            this.AddedByName = BedMaster.AddedByName || "";
        }
    }
}
