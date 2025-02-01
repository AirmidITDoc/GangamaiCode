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
import { MatDialog } from "@angular/material/dialog";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewareaMasterComponent } from "./newarea-master/newarea-master.component";

@Component({
    selector: "app-state-master",
    templateUrl: "./area-master.component.html",
    styleUrls: ["./area-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class AreaMasterComponent implements OnInit {
    AreaMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "AreaId",
        "AreaName",
        // "CityName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSAreaMasterList = new MatTableDataSource<AreaMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._AreaService.myformSearch.controls; }

    constructor(
        public _AreaService: AreaMasterService,
        public toastr: ToastrService,
        private accountService: AuthenticationService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
    ) { }

    ngOnInit(): void {
        this.getAreaMasterList();
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

    newArea() {
        const dialogRef = this._matDialog.open(NewareaMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getAreaMasterList();
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
            console.log(this.DSAreaMasterList);
        });
    }

    onEdit(row) {
        // var m_data = {
        //     AreaId: row.AreaId,
        //     AreaName: row.AreaName.trim(),
        //     CityId: row.CityId,
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._AreaService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewareaMasterComponent,
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
            this.getAreaMasterList();
        });
    }

    onDeactive(AreaId) {
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
                const tableItem = this.DSAreaMasterList.data.find(item => item.AreaId === AreaId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_AreaMaster set IsDeleted=0 where AreaId=" + AreaId;
                } else {
                    Query = "Update M_AreaMaster set IsDeleted=1 where AreaId=" + AreaId;
                }

                console.log("query:", Query);

                this._AreaService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Relationship Status has been Changed.', 'success');
                            this.getAreaMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
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
