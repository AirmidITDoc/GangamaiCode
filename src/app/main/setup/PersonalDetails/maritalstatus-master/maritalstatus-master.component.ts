import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { NotificationServiceService } from "app/core/notification-service.service";
import { AuthenticationService } from "app/core/services/authentication.service";
import { MaritalstatusMasterService } from "./maritalstatus-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewmaritalMasterComponent } from "./newmarital-master/newmarital-master.component";

@Component({
    selector: "app-maritalstatus-master",
    templateUrl: "./maritalstatus-master.component.html",
    styleUrls: ["./maritalstatus-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class MaritalstatusMasterComponent implements OnInit {
    MaritalStatusList: any;
    msg: any;
    sIsLoading: string = '';
    hasSelectedContacts: boolean;

    displayedColumns: string[] = [
        "MaritalStatusId",
        "MaritalStatusName",
        "IsDeleted",
        "action",
    ];

    DSMaritalStatusMasterList = new MatTableDataSource<MaritalStatusMaster>();

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
    // field validation 
    get f() { return this._maritalService.myformSearch.controls; }

    constructor(
        public _maritalService: MaritalstatusMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,) { }

    ngOnInit(): void {
        this.getmaritalstatusMasterList();
    }

    onSearchClear() {
        this._maritalService.myformSearch.reset({
            MaritalStatusNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getmaritalstatusMasterList();
    }
    onSearch() {
        this.getmaritalstatusMasterList();
    }

    newMaritalStatus() {
        const dialogRef = this._matDialog.open(NewmaritalMasterComponent,
            {
                maxWidth: "40%",
                width: "100%",
                height: "30%",
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);
            this.getmaritalstatusMasterList();
        });
    }
    getmaritalstatusMasterList() {
        // var m_data = {
        //     MaritalStatusName:
        //         this._maritalService.myformSearch
        //             .get("MaritalStatusNameSearch")
        //             .value.trim() || "%",
        //     // IsDeleted: Boolean(
        //     //     JSON.parse(
        //     //         this._maritalService.myformSearch.get("IsDeletedSearch")
        //     //             .value
        //     //     )
        //     // ),
        // };
        // this._maritalService
        //     .getmaritalstatusMasterList(m_data)
        //     .subscribe((Menu) => {
        //         this.DSMaritalStatusMasterList.data =
        //             Menu as MaritalStatusMaster[];
        //         this.DSMaritalStatusMasterList.sort = this.sort;
        //         this.DSMaritalStatusMasterList.paginator = this.paginator;
        //     });

        var param = {
            MaritalStatusName: this._maritalService.myformSearch.get("MaritalStatusNameSearch")
                        .value.trim() + "%" || "%",
                };
                this._maritalService.getmaritalstatusMasterList(param).subscribe((Menu) => {
                    this.DSMaritalStatusMasterList.data = Menu as MaritalStatusMaster[];
                    this.DSMaritalStatusMasterList.sort = this.sort;
                    this.DSMaritalStatusMasterList.paginator = this.paginator;
                });
    }

    // onClear() {
    //     this._maritalService.myform.reset({ IsDeleted: "false});
    //     this._maritalService.initializeFormGroup();
    // }

    // onSubmit() {
    //     if (this._maritalService.myform.valid) {
    //         if (!this._maritalService.myform.get("MaritalStatusId").value) {
    //             var m_data = {
    //                 maritalStatusMasterInsert: {
    //                     maritalStatusName: this._maritalService.myform
    //                         .get("MaritalStatusName")
    //                         .value.trim(),
    //                     addedBy: 1,
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._maritalService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                 },
    //             };

    //             this._maritalService
    //                 .insertMaritalStatusMaster(m_data)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record Saved Successfully.', 'Saved !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getmaritalstatusMasterList();
    //                         // Swal.fire(
    //                         //     "Saved !",
    //                         //     "Record saved Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getmaritalstatusMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('MaritalStatus Master Data not Saved !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getmaritalstatusMasterList();
    //                 },error => {
    //                     this.toastr.error('MaritalStatus Data not saved !, Please check API error..', 'Error !', {
    //                      toastClass: 'tostr-tost custom-toast-error',
    //                    });
    //                  } );
    //         } else {
    //             var m_dataUpdate = {
    //                 maritalStatusMasterUpdate: {
    //                     maritalStatusId:
    //                         this._maritalService.myform.get("MaritalStatusId")
    //                             .value,
    //                     maritalStatusName: this._maritalService.myform
    //                         .get("MaritalStatusName")
    //                         .value.trim(),
    //                     isDeleted: Boolean(
    //                         JSON.parse(
    //                             this._maritalService.myform.get("IsDeleted")
    //                                 .value
    //                         )
    //                     ),
    //                     updatedBy: 1,
    //                 },
    //             };

    //             this._maritalService
    //                 .updateMaritalStatusMaster(m_dataUpdate)
    //                 .subscribe((data) => {
    //                     this.msg = data;
    //                     if (data) {
    //                         this.toastr.success('Record updated Successfully.', 'updated !', {
    //                             toastClass: 'tostr-tost custom-toast-success',
    //                           });
    //                           this.getmaritalstatusMasterList();
    //                         // Swal.fire(
    //                         //     "Updated !",
    //                         //     "Record updated Successfully !",
    //                         //     "success"
    //                         // ).then((result) => {
    //                         //     if (result.isConfirmed) {
    //                         //         this.getmaritalstatusMasterList();
    //                         //     }
    //                         // });
    //                     } else {
    //                         this.toastr.error('MaritalStatus Master Data not updated !, Please check API error..', 'Error !', {
    //                             toastClass: 'tostr-tost custom-toast-error',
    //                           });
    //                     }
    //                     this.getmaritalstatusMasterList();
    //                 });
    //         }
    //         this.onClear();
    //     }
    // }

    onEdit(row) {
        // var m_data = {
        //     MaritalStatusId: row.MaritalStatusId,
        //     MaritalStatusName: row.MaritalStatusName.trim(),
        //     IsDeleted: JSON.stringify(row.IsDeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        // this._maritalService.populateForm(m_data);
        const dialogRef = this._matDialog.open(NewmaritalMasterComponent,
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
            this.getmaritalstatusMasterList();
        });
    }

    onDeactive(MaritalStatusId) {
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
                const tableItem = this.DSMaritalStatusMasterList.data.find(item => item.MaritalStatusId === MaritalStatusId);
                console.log("table:", tableItem)

                if (tableItem.IsDeleted) {
                    Query = "Update M_MaritalStatusMaster set IsDeleted=0 where MaritalStatusId=" + MaritalStatusId;
                } else {
                    Query = "Update M_MaritalStatusMaster set IsDeleted=1 where MaritalStatusId=" + MaritalStatusId;
                }

                console.log("query:", Query);

                this._maritalService.deactivateTheStatus(Query)
                    .subscribe(
                        (data) => {
                            Swal.fire('Changed!', 'MaritalStatus Status has been Changed.', 'success');
                            this.getmaritalstatusMasterList();
                        },
                        (error) => {
                            Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                        }
                    );
            }

        });
    }
}
export class MaritalStatusMaster {
    MaritalStatusId: number;
    MaritalStatusName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param MaritMaritalStatusMasteralMaster
     */
    constructor(MaritalStatusMaster) {
        {
            this.MaritalStatusId = MaritalStatusMaster.MaritalStatusId || "";
            this.MaritalStatusName = MaritalStatusMaster.PrefixName || "";
            this.IsDeleted = MaritalStatusMaster.IsDeleted || "false";
            this.AddedBy = MaritalStatusMaster.AddedBy || "";
            this.UpdatedBy = MaritalStatusMaster.UpdatedBy || "";
        }
    }
}
