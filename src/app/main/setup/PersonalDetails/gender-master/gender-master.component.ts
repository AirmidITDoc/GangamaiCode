import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { GenderMasterService } from "./gender-master.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

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
        "GenderName",
        "IsDeleted",
        "action",
    ];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    DSGenderMasterList = new MatTableDataSource<GenderMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        public _GenderService: GenderMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getGenderMasterList();
    }

    onSearch() {
        this.getGenderMasterList();
    }

    onSearchClear() {
        this._GenderService.myformSearch.reset({
            GenderNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getGenderMasterList();
    }

    getGenderMasterList() {
        var Param : any = {
            "First": 0,
            "Rows": 10,
            "SortField": "GenderId",
            "SortOrder": 0,
            "Filters" : [],
            "ExportType": "Excel",
            "Columns": [
              {
                "Data": "string",
                "Name": "string"
              }
            ]
        };
        var GenderName = this._GenderService.myformSearch.get("GenderNameSearch").value.trim();
        if(GenderName){
            Param.Filters.push({
                "FieldName": "GenderName",
                "FieldValue": GenderName,
                "OpType": "13"
            });
        }
        var isActive = this._GenderService.myformSearch.get("IsDeletedSearch").value;
        if(isActive != 2){
            Param.Filters.push({
                "FieldName": "IsActive",
                "FieldValue": this._GenderService.myformSearch.get("IsDeletedSearch").value,
                "OpType": "13"
            });
        }        
        this._GenderService
            .getGenderMasterList(Param)
            .subscribe((response: any) => {
                if (response.StatusCode == 200) {
                    this.DSGenderMasterList.data = response.Data.Data as GenderMaster[];
                    this.DSGenderMasterList.sort = this.sort;
                    this.DSGenderMasterList.paginator = this.paginator;
                    console.log(this.DSGenderMasterList.data);
                }
            });
    }

    onClear() {
        this._GenderService.myform.reset({ IsDeleted: "false" });
        this._GenderService.initializeFormGroup();
    }

    onSubmit() {
        if (this._GenderService.myform.valid) {
            if (!this._GenderService.myform.get("GenderId").value) {
                var m_data = {
                    GenderId: 0,
                    GenderName: this._GenderService.myform
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
                            this.getGenderMasterList();
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
                        this.getGenderMasterList();
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
                    GenderId: this._GenderService.myform.get("GenderId").value,
                    GenderName: this._GenderService.myform
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
                            this.getGenderMasterList();
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
                        this.getGenderMasterList();
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
            GenderId: row.GenderId,
            GenderName: row.GenderName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
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
                if(data.StatusCode == 200) {
                    this.toastr.success(
                        "Record updated Successfully.",
                        "updated !",
                        {
                            toastClass:
                                "tostr-tost custom-toast-success",
                        }
                    );
                    this.getGenderMasterList();
                }
            });
          }
          this.confirmDialogRef = null;
        });
      }
}

export class GenderMaster {
    GenderId: number;
    GenderName: string;
    IsDeleted: boolean;

    /**
     * Constructor
     *
     * @param GenderMaster
     */
    constructor(GenderMaster) {
        {
            this.GenderId = GenderMaster.GenderId || "";
            this.GenderName = GenderMaster.GenderName || "";
            this.IsDeleted = GenderMaster.IsDeleted || "true";
        }
    }
}
