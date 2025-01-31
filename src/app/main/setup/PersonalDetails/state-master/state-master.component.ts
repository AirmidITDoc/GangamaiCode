import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { takeUntil } from "rxjs/operators";
import { StateMasterService } from "./state-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseUtils } from "@fuse/utils";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewstateMasterComponent } from "./newstate-master/newstate-master.component";


@Component({
    selector: "app-state-master",
    templateUrl: "./state-master.component.html",
    styleUrls: ["./state-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class StateMasterComponent implements OnInit {
    StateMasterList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    autocompleteModecountry: string = "Country";
    CountrycmbList: any = [];
    //country filter
    public countryFilterCtrl: FormControl = new FormControl();
    public filteredCountry: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "StateId",
        "StateName",
        "CountryName",
        "IsDeleted",
        "action",
    ];

    DSStateMasterList = new MatTableDataSource<StateMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._stateService.myformSearch.controls; }

    constructor(public _stateService: StateMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService) { }

    ngOnInit(): void {
        this.getstateMasterList();
        // this.getCountryNameCombobox();
    }

    onSearch() {
        this.getstateMasterList();
    }

    onSearchClear() {
        this._stateService.myformSearch.reset({
            StateNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getstateMasterList();
    }

    getstateMasterList() {
        var param = {
            StateName:
                this._stateService.myformSearch
                    .get("StateNameSearch")
                    .value.trim() || "%",
        };
        this._stateService.getstateMasterList(param).subscribe((Menu) => {
            this.DSStateMasterList.data = Menu as StateMaster[];
            this.DSStateMasterList.sort = this.sort;
            this.DSStateMasterList.paginator = this.paginator;
        });
    }

    newState() {
        const dialogRef = this._matDialog.open(NewstateMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getstateMasterList();
        });
    }
    onEdit(row) {
        const dialogRef = this._matDialog.open(NewstateMasterComponent,
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
            this.getstateMasterList();
        });
    }

    onDeactive(StateId) {
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
                const tableItem = this.DSStateMasterList.data.find(item => item.StateId === StateId);
                console.log("table:", tableItem)
                const isDeleted = Boolean(Number(tableItem.Isdeleted));
                if (isDeleted) {
                    Query = "Update M_StateMaster set IsDeleted=0 where StateId=" + StateId;
                } else {
                    Query = "Update M_StateMaster set IsDeleted=1 where StateId=" + StateId;
                }

                console.log("query:", Query);

                this._stateService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'State Status has been Changed.', 'success');
                            this.getstateMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class StateMaster {
    StateId: number;
    StateName: string;
    CountryId: number;
    CountryName: string;
    Isdeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param StateMaster
     */
    constructor(StateMaster) {
        {
            this.StateId = StateMaster.StateId || "";
            this.StateName = StateMaster.StateName || "";
            this.CountryId = StateMaster.CountryId || "";
            this.Isdeleted = StateMaster.Isdeleted || "";
            this.AddedBy = StateMaster.AddedBy || "";
            this.UpdatedBy = StateMaster.UpdatedBy || "";
        }
    }
}
