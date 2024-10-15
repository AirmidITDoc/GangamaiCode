import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { GenderMasterService } from "./gender-master.service";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { NewGendermasterComponent } from "./new-gendermaster/new-gendermaster.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";

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
        "genderId",
        "genderName",
        "isDeleted",
        "action"
    ];
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "Gender/List",
        headers: [
            "genderId",
            "genderName",
            "isActive",
            "action"
        ],
        columnsList: [
            { heading: "Code", key: "genderId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Gender Name", key: "genderName", sort: true, align: 'left', emptySign: 'NA' },
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
        sortField: "genderId",
        sortOrder: 0,
        filters: [
            { fieldName: "genderName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 10
    }

    constructor(
        public _GenderService: GenderMasterService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void {
    }
    onClear() {
        this._GenderService.myform.reset({ isDeleted: "false" });
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
    changeStatus(status: any) {
        switch (status.id) {
            case 1:
                //this.onEdit(status.data)
                break;
            case 2:
                this.onEdit(status.data)
                break;
            case 5:
                this.onDeactive(status.data.genderId);
                break;
            default:
                break;
        }
    }
    onEdit(row) {
        var m_data = {
            genderId: row.genderId,
            genderName: row.genderName.trim(),
            isDeleted: JSON.stringify(row.isActive),
        };
        this._GenderService.populateForm(m_data);
    }
    onDeactive(genderId) {
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
                this._GenderService.deactivateTheStatus(genderId).subscribe((data: any) => {
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

    newgendermaster() {
        const dialogRef = this._matDialog.open(NewGendermasterComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
            });
        dialogRef.afterClosed().subscribe(result => {
            console.log('The dialog was closed - Insert Action', result);

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
            this.genderId = GenderMaster.genderId || "";
            this.genderName = GenderMaster.genderName || "";
            this.isDeleted = GenderMaster.isDeleted || "true";
        }
    }
}
