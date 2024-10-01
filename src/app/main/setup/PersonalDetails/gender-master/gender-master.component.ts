import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { GenderMasterService } from "./gender-master.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import {  gridModel } from "app/core/models/gridRequest";

@Component({
    selector: "app-gender-master",
    templateUrl: "./gender-master.component.html",
    styleUrls: ["./gender-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenderMasterComponent implements OnInit {
    GenderMasterList: any;
    msg: any;
    displayedColumns: string[] = [
        "GenderId",
        "genderName",
        "IsDeleted",
        "action"
    ];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DSGenderMasterList = new MatTableDataSource<GenderMaster>();
    // @ViewChild(MatSort) sort: MatSort;
    // @ViewChild(MatPaginator) paginator: MatPaginator;
    gridConfig:gridModel={
        apiUrl: "Gender/List", 
        headers: [
            "GenderId",
            "genderName",
            "IsDeleted",
            "action"
        ], 
        sortField: "GenderId", 
        sortOrder: 0,
        filters: [],
        row: 10
    }
    constructor(
        public _GenderService: GenderMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
        //this.getGenderMasterList();
    }

    onSearch() {
       // this.getGenderMasterList();
    }

    onSearchClear() {
        this._GenderService.myformSearch.reset({
            GenderNameSearch: "",
            IsDeletedSearch: "2",
        });
        //this.getGenderMasterList();
    }

    resultsLength = 0;
    // getGenderMasterList() {
        
    //     var Param: gridRequest = {
    //         SortField: this.sort?.active ?? "GenderId", SortOrder: this.sort?.direction ?? 'asc' == 'asc' ? 0 : -1, Filters: [],
    //         Columns: [],
    //         First: (this.paginator?.pageIndex ?? 0),
    //         Rows: (this.paginator?.pageSize ?? 12),
    //         ExportType: gridResponseType.JSON
    //     };
    //     var GenderName = this._GenderService.myformSearch.get("GenderNameSearch").value.trim();
    //     if (GenderName) {
    //         Param.Filters.push({
    //             "FieldName": "GenderName",
    //             "FieldValue": GenderName,
    //             "OpType": "13"
    //         });
    //     }
    //     var isActive = this._GenderService.myformSearch.get("IsDeletedSearch").value;
    //     if (isActive != 2) {
    //         Param.Filters.push({
    //             "FieldName": "IsActive",
    //             "FieldValue": this._GenderService.myformSearch.get("IsDeletedSearch").value,
    //             "OpType": "13"
    //         });
    //     }
    //     this._GenderService.getGenderMasterList(Param).subscribe((data: any) => {
    //         this.DSGenderMasterList.data = data.data as GenderMaster[];
    //         this.DSGenderMasterList.sort = this.sort;
    //         //this.DSGenderMasterList.paginator = this.paginator;
    //         this.resultsLength = data["recordsFiltered"];
    //         console.log(this.DSGenderMasterList.data);
    //     });
    // }

    onClear() {
        this._GenderService.myform.reset({ IsDeleted: "false" });
        this._GenderService.initializeFormGroup();
    }

    onSubmit() {
        if (this._GenderService.myform.valid) {
            if (!this._GenderService.myform.get("GenderId").value) {
                var m_data = {
                    genderId: 0,
                    genderName: this._GenderService.myform
                        .get("GenderName")
                        .value.trim(),
                    isActive: Boolean(
                        JSON.parse(
                            this._GenderService.myform.get("IsDeleted")
                                .value
                        )
                    )
                };
                console.log(m_data);
                this._GenderService.genderMasterInsert(m_data).subscribe(
                    (data) => {
                        this.msg = data;
                        if (data.StatusCode == 200) {
                            this.toastr.success(
                                "Record Saved Successfully.",
                                "Saved !",
                                {
                                    toastClass:
                                        "tostr-tost custom-toast-success",
                                }
                            );
                            //this.getGenderMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGenderMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error(
                                "Gender Master Data not saved !, Please check API error..",
                                "Error !",
                                {
                                    toastClass: "tostr-tost custom-toast-error",
                                }
                            );
                        }
                        //this.getGenderMasterList();
                    },
                    (error) => {
                        this.toastr.error(
                            "Gender Data not saved !, Please check API error..",
                            "Error !",
                            {
                                toastClass: "tostr-tost custom-toast-error",
                            }
                        );
                    }
                );
            } else {
                var m_dataUpdate = {
                    genderId: this._GenderService.myform.get("GenderId").value,
                    genderName: this._GenderService.myform
                        .get("GenderName")
                        .value.trim(),
                    isActive: Boolean(
                        JSON.parse(
                            this._GenderService.myform.get("IsDeleted")
                                .value
                        )
                    ),
                };

                this._GenderService.genderMasterUpdate(this._GenderService.myform.get("GenderId").value, m_dataUpdate).subscribe(
                    (data) => {
                        this.msg = data;
                        if (data.StatusCode == 200) {
                            this.toastr.success(
                                "Record updated Successfully.",
                                "updated !",
                                {
                                    toastClass:
                                        "tostr-tost custom-toast-success",
                                }
                            );
                            //this.getGenderMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGenderMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error(
                                "Gender Master Data not updated !, Please check API error..",
                                "Error !",
                                {
                                    toastClass: "tostr-tost custom-toast-error",
                                }
                            );
                        }
                        //this.getGenderMasterList();
                    },
                    (error) => {
                        this.toastr.error(
                            "Gender Data not Updated !, Please check API error..",
                            "Error !",
                            {
                                toastClass: "tostr-tost custom-toast-error",
                            }
                        );
                    }
                );
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            genderId: row.GenderId,
            genderName: row.GenderName.trim(),
            isDeleted: JSON.stringify(row.IsActive),
        };
        this._GenderService.populateForm(m_data);
    }
    onDeactive(GenderId) {
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
                this._GenderService.deactivateTheStatus(GenderId).subscribe((data: any) => {
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

export class GenderMaster {
    genderId: number;
    genderName: string;
    isDeleted: boolean;

    /**
     * Constructor
     *
     * @param GenderMaster
     */
    constructor(GenderMaster) {
        {
            this.genderId = GenderMaster.GenderId || "";
            this.genderName = GenderMaster.GenderName || "";
            this.isDeleted = GenderMaster.IsDeleted || "true";
        }
    }
}
