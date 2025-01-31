import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReligionMasterService } from "./religion-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseUtils } from "@fuse/utils";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewreligionMasterComponent } from "./newreligion-master/newreligion-master.component";

@Component({
    selector: "app-religion-master",
    templateUrl: "./religion-master.component.html",
    styleUrls: ["./religion-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ReligionMasterComponent implements OnInit {
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "ReligionId",
        "ReligionName",
        "IsDeleted",
        "action",
    ];

    DSReligionMasterList = new MatTableDataSource<ReligionMaster>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._religionService.myformSearch.controls; }

    constructor(public _religionService: ReligionMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService) { }

    ngOnInit(): void {
        this.getReligionMasterList();
    }
    onSearch() {
        this.getReligionMasterList();
    }

    onSearchClear() {
        this._religionService.myformSearch.reset({
            ReligionNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getReligionMasterList();
    }
    getReligionMasterList() {
        var m_data = {
            ReligionName:
                this._religionService.myformSearch.get("ReligionNameSearch")
                    .value + "%" || "%",
        };
        this._religionService
            .getReligionMasterList(m_data)
            .subscribe((Menu) => {
                this.DSReligionMasterList.data = Menu as ReligionMaster[];
                this.DSReligionMasterList.sort = this.sort;
                this.DSReligionMasterList.paginator = this.paginator;
            });
    }

    newReligion() {
        const dialogRef = this._matDialog.open(NewreligionMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getReligionMasterList();
        });
    }
    onEdit(row) {

        const dialogRef = this._matDialog.open(NewreligionMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
                data: {
                    Obj: row
                }
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getReligionMasterList();
        });
    }

    onDeactive(ReligionId) {
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
                const tableItem = this.DSReligionMasterList.data.find(item => item.ReligionId === ReligionId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_ReligionMaster set IsDeleted=0 where ReligionId=" + ReligionId;
                } else {
                    Query = "Update M_ReligionMaster set IsDeleted=1 where ReligionId=" + ReligionId;
                }

                console.log("query:", Query);

                this._religionService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Religion Status has been Changed.', 'success');
                            this.getReligionMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class ReligionMaster {
    ReligionId: number;
    ReligionName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ReligionMaster
     */
    constructor(ReligionMaster) {
        {
            this.ReligionId = ReligionMaster.ReligionId || "";
            this.ReligionName = ReligionMaster.ReligionName || "";
            this.IsDeleted = ReligionMaster.IsDeleted || "false";
            this.AddedBy = ReligionMaster.AddedBy || "";
            this.UpdatedBy = ReligionMaster.UpdatedBy || "";
            this.AddedByName = ReligionMaster.AddedByName || "";
        }
    }
}
