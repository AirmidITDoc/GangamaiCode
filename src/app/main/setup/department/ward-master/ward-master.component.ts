import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { WardMasterService } from "./ward-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewwardComponent } from "./newward/newward.component";

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
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "RoomId",
        "RoomName",
        "LocationName",
        "ClassName",
        "IsAvailable",
        "IsActive",
        "action",
    ];

    DSWardMasterList = new MatTableDataSource<WardMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _wardService: WardMasterService,
        public toastr: ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getwardMasterList();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._wardService.myformSearch.controls; }

    onSearch() {
        this.getwardMasterList();
    }

    newward() {
        const dialogRef = this._matDialog.open(NewwardComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "50%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getwardMasterList();
        });
    }

    onSearchClear() {
        this._wardService.myformSearch.reset({
            RoomNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getwardMasterList();
    }

    getwardMasterList() {
        var param = {
            RoomName: this._wardService.myformSearch.get("RoomNameSearch")
                .value.trim() + "%" || "%",
        };
        this._wardService.getwardMasterList(param).subscribe((Menu) => {
            this.DSWardMasterList.data = Menu as WardMaster[];
            this.DSWardMasterList.sort = this.sort;
            this.DSWardMasterList.paginator = this.paginator;
        });
    }

    onEdit(row) {
        // var m_data = {
        //     RoomId: row.RoomId,
        //     RoomName: row.RoomName,
        //     LocationId: row.LocationId,
        //     IsAvailable: JSON.stringify(row.IsAvailible),
        //     ClassId: row.ClassID,
        //     IsDeleted: JSON.stringify(row.IsActive),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._wardService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewwardComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "50%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getwardMasterList();
        });
    }

    onDeactive(WardId) {
        debugger
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            debugger

            if (result.isConfirmed) {
                let Query;
                const tableItem = this.DSWardMasterList.data.find(item => item.WardId === WardId);
                console.log("table:", tableItem)

                if (tableItem.IsActive) {
                    Query = "Update RoomMaster set IsActive=0 where RoomId=" + WardId;
                } else {
                    Query = "Update RoomMaster set IsActive=1 where RoomId=" + WardId;
                }

                console.log("query:", Query);

                this._wardService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Ward Status has been Changed.', 'success');
                            this.getwardMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}
export class WardMaster {
    RoomId: number;
    RoomName: string;
    LocationId: number;
    IsAvailable: boolean;
    IsDeleted: boolean;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;
    ClassId: number;
    AddedByName: string;
    WardId:any;

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
            this.IsDeleted = WardMaster.IsDeleted || "";
            this.IsActive = WardMaster.IsActive || "";
            this.AddedBy = WardMaster.AddedBy || "";
            this.UpdatedBy = WardMaster.UpdatedBy || "";
            this.ClassId = WardMaster.ClassId || "";
            this.WardId = WardMaster.WardId || "";
        }
    }
}
