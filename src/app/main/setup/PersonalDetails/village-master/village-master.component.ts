import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { takeUntil } from "rxjs/operators";
import { VillageMasterService } from "./village-master.service";
import { FormControl } from "@angular/forms";
import { ReplaySubject, Subject } from "rxjs";
import { fuseAnimations } from "@fuse/animations";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseUtils } from "@fuse/utils";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewvillageMasterComponent } from "./newvillage-master/newvillage-master.component";

@Component({
    selector: "app-village-master",
    templateUrl: "./village-master.component.html",
    styleUrls: ["./village-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class VillageMasterComponent implements OnInit {
    VillageMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "VillageId",
        "VillageName",
        "TalukaName",
        "IsDeleted",
        "action",
    ];

    DSVillageMasterList = new MatTableDataSource<VillageMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._VillageService.myformSearch.controls; }

    constructor(public _VillageService: VillageMasterService,
        public toastr : ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) {}

    ngOnInit(): void {
        this.getVillageMasterLists();
    }

    onSearch() {
        this. getVillageMasterLists()
    }

    onSearchClear() {
        this._VillageService.myformSearch.reset({
            VillageNameSearch: "",
            IsDeletedSearch: "2",
        });
        this. getVillageMasterLists()
    }

    getVillageMasterLists() {
        var param = {
            VillageName:this._VillageService.myformSearch.get("VillageNameSearch").value.trim() || "%",
        };
       // console.log(param)
        this._VillageService.getVillageMasterList(param).subscribe((Menu) => {
            this.DSVillageMasterList.data = Menu as VillageMaster[];
            this.DSVillageMasterList.sort = this.sort;
            this.DSVillageMasterList.paginator = this.paginator;
            console.log(this.DSVillageMasterList)
        });
    }

    newVillage(){
        const dialogRef = this._matDialog.open(NewvillageMasterComponent,
                    {
                        maxWidth: "40%",
                        width: "100%",
                        height: "40%",
                    });
                dialogRef.afterClosed().subscribe(result => {
                    console.log('The dialog was closed - Insert Action', result);
                    this.getVillageMasterLists();
                });
    }

    onEdit(row) {
        // var m_data1 = {
        //     VillageId: row.VillageId,
        //     VillageName: row.VillageName.trim(),
        //     TalukaId: row.TalukaId,
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // console.log(m_data1);
        // this._VillageService.populateForm(m_data1);
        const dialogRef = this._matDialog.open(NewvillageMasterComponent,
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
            this.getVillageMasterLists();
        });
    }

     onDeactive(VillageId) {
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
                            const tableItem = this.DSVillageMasterList.data.find(item => item.VillageId === VillageId);
                            console.log("table:", tableItem)
            
                            if (tableItem.IsDeleted) {
                                Query = "Update M_VillageMaster set IsDeleted=0 where VillageId=" + VillageId;
                            } else {
                                Query = "Update M_VillageMaster set IsDeleted=1 where VillageId=" + VillageId;
                            }
            
                            console.log("query:", Query);
            
                            this._VillageService.deactivateTheStatus(Query)
                                .subscribe(
                                    (data) => {
                                        Swal.fire('Changed!', 'Village Status has been Changed.', 'success');
                                        this.getVillageMasterLists();
                                    },
                                    (error) => {
                                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                                    }
                                );
                        }
            
                    });
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
