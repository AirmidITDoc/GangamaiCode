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
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewbedComponent } from "./newbed/newbed.component";


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
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "BedId",
        "BedName",
        // "RoomId",
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
        public toastr : ToastrService,
        private _fuseSidebarService: FuseSidebarService,
        public _matDialog: MatDialog,
    ) {}

    ngOnInit(): void {
        this.getbedMasterList();      
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    get f() { return this._bedService.myformSearch.controls; }

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
    newBed() {
        const dialogRef = this._matDialog.open(NewbedComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getbedMasterList();
        });
    }

    onEdit(row) {
        // var m_data = {
        //     BedId: row.BedId,
        //     BedName: row.BedName,
        //     RoomId: row.RoomId,
        //     IsAvailable: JSON.stringify(row.IsAvailible),
        //     IsActive: JSON.stringify(row.IsActive),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._bedService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewbedComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getbedMasterList();
        });
    }

    onDeactive(BedId) {
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
                    const tableItem = this.DSBedMasterList.data.find(item => item.BedId === BedId);
                    console.log("table:", tableItem)
    
                    if (tableItem.IsActive) {
                        Query = "Update Bedmaster set IsActive=0 where BedId=" + BedId;
                    } else {
                        Query = "Update Bedmaster set IsActive=1 where BedId=" + BedId;
                    }
    
                    console.log("query:", Query);
    
                    this._bedService.deactivateTheStatus(Query)
                        .subscribe(
                            (data) => {
                                Swal.fire('Changed!', 'Bed Status has been Changed.', 'success');
                                this.getbedMasterList();
                            },
                            (error) => {
                                Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                            }
                        );
                }
    
            });
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
