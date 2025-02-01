import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { TalukaMasterService } from "./taluka-master.service";
import { takeUntil } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseUtils } from "@fuse/utils";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewtalukaMasterComponent } from "./newtaluka-master/newtaluka-master.component";


@Component({
    selector: "app-taluka-master",
    templateUrl: "./taluka-master.component.html",
    styleUrls: ["./taluka-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class TalukaMasterComponent implements OnInit {
    TalukaMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "TalukaID",
        "TalukaNAME",
        "CityNAME",
        "ISDELETED",
        "action",
    ];

    DSTalukaMasterList = new MatTableDataSource<TalukaMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._TalukaService.myformSearch.controls; }

    constructor(public _TalukaService: TalukaMasterService,
        public toastr : ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) {}

    ngOnInit(): void {
        this.getTalukaMasterList();
    }
    onSearch() {
        this.getTalukaMasterList();
    }
    onSearchClear() {
        this._TalukaService.myformSearch.reset({
            TalukaNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getTalukaMasterList();
    }

    newTaluka() {
            const dialogRef = this._matDialog.open(NewtalukaMasterComponent,
                {
                    maxWidth: "40%",
                    width: "100%",
                    height: "40%",
                });
            dialogRef.afterClosed().subscribe(result => {
                console.log('The dialog was closed - Insert Action', result);
                this.getTalukaMasterList();
            });
        }

    getTalukaMasterList() {
        var param = {
            TalukaName:
                this._TalukaService.myformSearch
                    .get("TalukaNameSearch")
                    .value.trim() || "%",
        };
        this._TalukaService.getTalukaMasterList(param).subscribe((Menu) => {
            this.DSTalukaMasterList.data = Menu as TalukaMaster[];
            console.log(this.DSTalukaMasterList.data);
            this.DSTalukaMasterList.sort = this.sort;
            this.DSTalukaMasterList.paginator = this.paginator;
        });
    }

    onEdit(row) {
        // var m_data1 = {
        //     TalukaId: row.TalukaID,
        //     TalukaName: row.TalukaNAME,
        //     CityId: row.CityID,
        //     IsDeleted: JSON.stringify(row.ISDELETED),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // console.log(m_data1);
        // this._TalukaService.populateForm(m_data1);
        const dialogRef = this._matDialog.open(NewtalukaMasterComponent,
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
            this.getTalukaMasterList();
        });
    }

     onDeactive(TalukaId) {
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
                            const tableItem = this.DSTalukaMasterList.data.find(item => item.TalukaId === TalukaId);
                            console.log("table:", tableItem)
            
                            if (tableItem.IsDeleted) {
                                Query = "Update M_TalukaMaster set IsDeleted=0 where TalukaId=" + TalukaId;
                            } else {
                                Query = "Update M_TalukaMaster set IsDeleted=1 where TalukaId=" + TalukaId;
                            }
            
                            console.log("query:", Query);
            
                            this._TalukaService.deactivateTheStatus(Query)
                                .subscribe(
                                    (data) => {
                                        Swal.fire('Changed!', 'Taluka Status has been Changed.', 'success');
                                        this.getTalukaMasterList();
                                    },
                                    (error) => {
                                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                                    }
                                );
                        }
            
                    });
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
        }
    }
}
