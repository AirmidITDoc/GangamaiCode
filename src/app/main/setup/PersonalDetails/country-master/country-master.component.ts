import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CountryMasterService } from "./country-master.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { FuseUtils } from "@fuse/utils";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { MatDialog } from "@angular/material/dialog";
import { NewcountryMasterComponent } from "./newcountry-master/newcountry-master.component";
import { NotificationServiceService } from "app/core/notification-service.service";

@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "CountryId",
        "CountryName",
        "IsDeleted",
        "action",
    ];

    DSCountryMasterList = new MatTableDataSource<CountryMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._CountryService.myformSearch.controls; }

    constructor(
        public _CountryService: CountryMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService) { }

    ngOnInit(): void {
        this.getCountryMasterList();
    }
    onSearch() {
        this.getCountryMasterList();
    }

    onSearchClear() {
        this._CountryService.myformSearch.reset({
            CountryNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCountryMasterList();
    }
    getCountryMasterList() {
        var param = {
            CountryName:
                this._CountryService.myformSearch
                    .get("CountryNameSearch")
                    .value.trim() || "%",
        };
        this._CountryService.getCountryMasterList(param).subscribe((Menu) => {
            this.DSCountryMasterList.data = Menu as CountryMaster[];
            this.DSCountryMasterList.sort = this.sort;
            this.DSCountryMasterList.paginator = this.paginator;
        });
    }

    // onClear() {
    //     this._CountryService.myform.reset({ IsDeleted: "false" });
    //     this._CountryService.initializeFormGroup();
    // }

    // onSubmit() {
    //     if (this._CountryService.myform.valid) {
    //         if (!this._CountryService.myform.get("CountryId").value) {
    //             var m_data = {
    //                 countryMasterInsert: {
    //                     countryName_1: this._CountryService.myform
    //                         .get("CountryName")
    //                         .value.trim(),
    //                     addedBy: 1,
    //                     isDeleted_2: Boolean(
    //                         JSON.parse(
    //                             this._CountryService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._CountryService
    //                 .countryMasterInsert(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) { 
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                         toastClass: 'tostr-tost custom-toast-success',
    //                       });
    //                       this.getCountryMasterList();
    //                         // Swal.fire(
    //                         //     "Saved !",
    //                         //     "Record saved Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getCountryMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('Country Master Data not saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getCountryMasterList();
    //                 },error => {
    //                     this.toastr.error('Country Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         } else {
    //             var m_dataUpdate = {
    //                 countryMasterUpdate: {
    //                     countryId:
    //                         this._CountryService.myform.get("CountryId").value,
    //                     countryName: this._CountryService.myform
    //                         .get("CountryName")
    //                         .value.trim(),
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._CountryService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._CountryService
    //                 .countryMasterUpdate(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getCountryMasterList();
    //                         // Swal.fire(
    //                         //     "Updated !",
    //                         //     "Record updated Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getCountryMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('Country Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getCountryMasterList();
    //                 },error => {
    //                     this.toastr.error('Country Data not Updated !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         }
    //         this.onClear();
    //     }
    // }

    newCountry() {
        const dialogRef = this._matDialog.open(NewcountryMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getCountryMasterList();
        });
    }

    onEdit(row) {
        const dialogRef = this._matDialog.open(NewcountryMasterComponent,
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
            this.getCountryMasterList();
        });
    }

    onDeactive(CountryId) {
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
                const tableItem = this.DSCountryMasterList.data.find(item => item.CountryId === CountryId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_CountryMaster set IsDeleted=0 where CountryId=" + CountryId;
                } else {
                    Query = "Update M_CountryMaster set IsDeleted=1 where CountryId=" + CountryId;
                }

                console.log("query:", Query);

                this._CountryService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'Country Status has been Changed.', 'success');
                            this.getCountryMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}

export class CountryMaster {
    CountryId: number;
    CountryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CountryMaster
     */
    constructor(CountryMaster) {
        {
            this.CountryId = CountryMaster.CountryId || "";
            this.CountryName = CountryMaster.CountryName || "";
            this.IsDeleted = CountryMaster.IsDeleted || "false";
            this.AddedBy = CountryMaster.AddedBy || "";
            this.UpdatedBy = CountryMaster.UpdatedBy || "";
        }
    }
}
