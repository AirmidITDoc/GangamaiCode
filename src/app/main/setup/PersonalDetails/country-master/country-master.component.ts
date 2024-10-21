import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CountryMasterService } from "./country-master.service";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { MatPaginator } from "@angular/material/paginator";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewCountryMasterComponent } from "./new-country-master/new-country-master.component";

@Component({
    selector: "app-country-master",
    templateUrl: "./country-master.component.html",
    styleUrls: ["./country-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CountryMasterComponent implements OnInit {
    msg: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "CountryMaster/List",
        columnsList: [
            { heading: "Code", key: "countryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Country Name", key: "countryName", sort: true, align: 'left', emptySign: 'NA' },
           { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            debugger
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            debugger
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "countryId",
        sortOrder: 0,
        filters: [
            { fieldName: "countryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }


    constructor(public _CountryService: CountryMasterService, public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        // this.getCountryMasterList();
    }
    onSearch() {
        // this.getCountryMasterList();
    }

    onSearchClear() {
        this._CountryService.myformSearch.reset({
            CountryNameSearch: "",
            IsDeletedSearch: "2",
        });
        // this.getCountryMasterList();
    }
    // getCountryMasterList() {
    //     var param = {
    //         CountryName:
    //             this._CountryService.myformSearch
    //                 .get("CountryNameSearch")
    //                 .value.trim() || "%",
    //     };
    //     this._CountryService.getCountryMasterList(param).subscribe((Menu) => {
    //         this.DSCountryMasterList.data = Menu as CountryMaster[];
    //         this.DSCountryMasterList.sort = this.sort;
    //         this.DSCountryMasterList.paginator = this.paginator;
    //     });
    // }

    newcitymaster() {
        const dialogRef = this._matDialog.open(NewCountryMasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

        });
    }
    onClear() {
        this._CountryService.myform.reset({ IsDeleted: "false" });
        this._CountryService.initializeFormGroup();
    }

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

    onEdit(row) {
        var m_data = {
            countryId: row.countryId,
            countryName: row.countryName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._CountryService.populateForm(m_data);
    }
    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.countryId);
                break;
            default:
                break;
        }
    }

    onDeactive(countryId) {
        debugger
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            debugger
            if (result) {
                this._CountryService.deactivateTheStatus(countryId).subscribe((data: any) => {
                    this.msg = data
                    if (data.StatusCode == 200) {
                        this.toastr.success(
                            "Record updated Successfully.",
                            "updated !",
                            {
                                toastClass:
                                    "tostr-tost custom-toast-success",
                            }
                        );
                        // this.getGenderMasterList();
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }
}

export class CountryMaster {
    countryId: number;
    countryName: string;
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
            this.countryId = CountryMaster.countryId || "";
            this.countryName = CountryMaster.countryName || "";
            this.IsDeleted = CountryMaster.IsDeleted || "false";
            this.AddedBy = CountryMaster.AddedBy || "";
            this.UpdatedBy = CountryMaster.UpdatedBy || "";
        }
    }
}
