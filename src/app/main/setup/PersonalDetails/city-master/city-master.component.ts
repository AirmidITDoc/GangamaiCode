import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ReplaySubject, Subject } from "rxjs";
import { CityMasterService } from "./city-master.service";
import { takeUntil } from "rxjs/operators";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewcityMasterComponent } from "./newcity-master/newcity-master.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: "app-city-master",
    templateUrl: "./city-master.component.html",
    styleUrls: ["./city-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CityMasterComponent implements OnInit {
    CityMasterList: any;
    // StatecmbList: any = [];
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;
    // CitycmbList: any = [];

    //state filter
    // public stateFilterCtrl: FormControl = new FormControl();
    // public filteredState: ReplaySubject<any> = new ReplaySubject<any>(1);
    // public cityFilterCtrl: FormControl = new FormControl();
    // public filteredCity: ReplaySubject<any> = new ReplaySubject<any>(1);


    private _onDestroy = new Subject<void>();

    displayedColumns: string[] = [
        "CityId",
        "CityName",
        //"STATEID",
        "StateName",
        //  "COUNTRYID",
        "CountryName",
        // "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSCityMasterList = new MatTableDataSource<CityMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._cityService.myformSearch.controls; }

    constructor(public _cityService: CityMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) { }

    ngOnInit(): void {
        this.getCityMasterList();
    }

    // apiUrl = 'Generic/GetByProc?procName=Retrieve_StateMasterForCombo_Conditional'; 
    // apiParams = {
    //     Id: 10181
    //      };

    // onSelectionChange(selectedOption: any) {
    //     console.log('Selected option:', selectedOption);
    // }
    // displayOption(option: any): string {
    //     return option ? option.StateName : '';
    // }

    onSearch() {
        this.getCityMasterList();
    }

    onSearchClear() {
        this._cityService.myformSearch.reset({
            CityNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCityMasterList();
    }

    getCityMasterList() {
        var param = {
            CityName:
                this._cityService.myformSearch
                    .get("CityNameSearch")
                    .value.trim() || "%",
        };
        this._cityService.getCityMasterList(param).subscribe((Menu) => {
            this.DSCityMasterList.data = Menu as CityMaster[];
            this.DSCityMasterList.sort = this.sort;
            this.DSCityMasterList.paginator = this.paginator;
        });
    }

    newCity() {
        const dialogRef = this._matDialog.open(NewcityMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "40%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getCityMasterList();
        });
    }
    onEdit(row) {
        // var m_data = {
        //     CityId: row.CITYID,
        //     CityName: row.CITYNAME,
        //     StateId: row.STATEID,
        //     StateName: row.STATENAME,
        //     // CountryId: row.COUNTRYID,
        //     //  CountryName: row.COUNTRYNAME,
        //     IsDeleted: JSON.stringify(row.ISDELETED),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // console.log(row);
        // this._cityService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewcityMasterComponent,
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
            this.getCityMasterList();
        });
    }
    onDeactive(CITYID) {
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
                const tableItem = this.DSCityMasterList.data.find(item => item.CITYID === CITYID);
                console.log("table:", tableItem)

                if (tableItem.ISDELETED) {
                    Query = "Update M_CityMaster set IsDeleted=0 where CityId=" + CITYID;
                } else {
                    Query = "Update M_CityMaster set IsDeleted=1 where CityId=" + CITYID;
                }

                console.log("query:", Query);

                this._cityService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'City Status has been Changed.', 'success');
                            this.getCityMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class CityMaster {
    CITYID: number;
    CityName: string;
    StateId: number;
    StateName: string;
    CountryId: number;
    CountryName: string;
    ISDELETED: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CityMaster
     */
    constructor(CityMaster) {
        {
            this.CITYID = CityMaster.CITYID || "";
            this.CityName = CityMaster.CityName || "";
            this.StateId = CityMaster.StateId || "";
            this.StateName = CityMaster.StateName || "";
            this.CountryId = CityMaster.CountryId || "";
            this.CountryName = CityMaster.CountryName || "";
            this.ISDELETED = CityMaster.ISDELETED || "false";
            this.AddedBy = CityMaster.AddedBy || "";
            this.UpdatedBy = CityMaster.UpdatedBy || "";
        }
    }
}
