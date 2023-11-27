import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { BedMasterService } from "./bed-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

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
        "RoomId",
        "RoomName",
        "IsAvailable",
        "IsActive",
        "action",
    ];

    DSBedMasterList = new MatTableDataSource<BedMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    //room filter
    public roomFilterCtrl: FormControl = new FormControl();
    public filteredRoom: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _bedService: BedMasterService,
        public toastr : ToastrService,) {}

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
        this.getbedMasterList();
    }
    getbedMasterList() {
        var param = {
            BedName:
                this._bedService.myformSearch
                    .get("BedNameSearch")
                    .value.trim() + "%" || "%",
            WardId: 0,
        };

        this._bedService.getbedMasterList(param).subscribe((Menu) => {
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
                        bedName_1: this._bedService.myform
                            .get("BedName")
                            .value.trim(),
                        roomId_2:
                            this._bedService.myform.get("RoomId").value.RoomId,
                        isAvailible_3: 1,
                        //addedBy: 1,
                        isActive_4: 0,
                    },
                };

                this._bedService.bedMasterInsert(m_data).subscribe((data) => {
                    this.msg = data;
                    if (data) {
                        this.toastr.success('Record Saved Successfully.', 'Saved !', {
                            toastClass: 'tostr-tost custom-toast-success',
                          });
                        this.getbedMasterList();
                        // Swal.fire(
                        //     "Saved !",
                        //     "Record saved Successfully !",
                        //     "success"
                        // ).then((result) => {
                        //     if (result.isConfirmed) {
                        //         this.getbedMasterList();
                        //     }
                        // });
                    } else {
                        this.toastr.error('Bed Master Data not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                          });
                    }
                    this.getbedMasterList();
                },error => {
                    this.toastr.error('Bed Data not saved !, Please check API error..', 'Error !', {
                     toastClass: 'tostr-tost custom-toast-error',
                   });
                 });
            } else {
                var m_dataUpdate = {
                    bedMasterUpdate: {
                        bedId_1: this._bedService.myform.get("BedId").value,
                        bedName_2: this._bedService.myform
                            .get("BedName")
                            .value.trim(),
                        roomId_3:
                            this._bedService.myform.get("RoomId").value.RoomId,
                        // isAvailable: 1,
                        isActive_4: 0,
                        //  updatedBy: 1,
                    },
                };

                this._bedService
                    .bedMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getbedMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getbedMasterList();
                            //     }
                            // });
                        } else {
                           
                            this.toastr.error('Bed Master Data not Updated !, Please check API error..', 'Updated !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                    
                        }
                        this.getbedMasterList();
                    },error => {
                        this.toastr.error('Bed Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            BedId: row.BedId,
            BedName: row.BedName,
            RoomId: row.RoomId,
            IsAvailable: JSON.stringify(row.IsAvailible),
            IsActive: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._bedService.populateForm(m_data);
    }
}

export class BedMaster {
    BedId: number;
    BedName: string;
    RoomName: string;
    RoomId: number;
    IsAvailable: boolean;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;

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
            this.IsActive = BedMaster.IsActive || "false";
            this.AddedBy = BedMaster.AddedBy || "";
            this.UpdatedBy = BedMaster.UpdatedBy || "";
        }
    }
}
