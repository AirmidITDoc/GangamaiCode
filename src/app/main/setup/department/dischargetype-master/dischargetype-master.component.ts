import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { DischargetypeMasterService } from "./dischargetype-master.service";
import { MatAccordion } from "@angular/material/expansion";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-dischargetype-master",
    templateUrl: "./dischargetype-master.component.html",
    styleUrls: ["./dischargetype-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class DischargetypeMasterComponent implements OnInit {
    step = 0;
    @ViewChild(MatAccordion) accordion: MatAccordion;

    setStep(index: number) {
        this.step = index;
    }

    msg: any;
    SearchName: string;

    displayedColumns: string[] = [
        "DischargeTypeId",
        "DischargeTypeName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    DSDischargeTypeMasterList = new MatTableDataSource<DischargeTypeMaster>();

    constructor(
        public _dischargetypeService: DischargetypeMasterService,
        public toastr : ToastrService,

        public _matDialog: MatDialog
    ) {}

    ngOnInit(): void {
        this.getdischargetypeMasterList();
    }

    getdischargetypeMasterList() {
        var m_data = {
            DischargeTypeName:this._dischargetypeService.myformSearch.get("DischargeTypeNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._dischargetypeService
            .getdischargetypeMasterList(m_data).subscribe((Menu) => {
                this.DSDischargeTypeMasterList.data =
                    Menu as DischargeTypeMaster[];
                this.DSDischargeTypeMasterList.sort = this.sort;
                this.DSDischargeTypeMasterList.paginator = this.paginator;
                console.log(this.DSDischargeTypeMasterList);
            });
    }

    onClear() {
        this._dischargetypeService.myform.reset({ IsDeleted: "false" });
        this._dischargetypeService.initializeFormGroup();
    }

    onSearch() {
        this.getdischargetypeMasterList();
    }

    onDeactive(DischargeTypeId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage =
            "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                let Query =
                    "Update M_DischargeTypeMaster set IsDeleted=1 where DischargeTypeId=" +
                    DischargeTypeId;
                console.log(Query);
                this._dischargetypeService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getdischargetypeMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

    onSearchClear() {
        this._dischargetypeService.myformSearch.reset({
            DischargeTypeNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getdischargetypeMasterList();
    }

    onSubmit() {
        if (this._dischargetypeService.myform.valid) {
            if (
                !this._dischargetypeService.myform.get("DischargeTypeId").value
            ) {
                var m_data = {
                    dischargeTypeMasterInsert: {
                        dischargeTypeName: this._dischargetypeService.myform
                            .get("DischargeTypeName")
                            .value.trim(),
                        isActive: 0,
                        addedBy: 1,
                        updatedBy: 1,
                    },
                };

                this._dischargetypeService
                    .dischargeTypeMasterInsert(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getdischargetypeMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getdischargetypeMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('DischargeType Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getdischargetypeMasterList();
                    },error => {
                        this.toastr.error('DischargeType Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    dischargeTypeMasterUpdate: {
                        dischargeTypeId:
                            this._dischargetypeService.myform.get(
                                "DischargeTypeId"
                            ).value,
                        dischargeTypeName: this._dischargetypeService.myform
                            .get("DischargeTypeName")
                            .value.trim(),
                        isActive: 0,
                        updatedBy: 1,
                    },
                };

                this._dischargetypeService
                    .dischargeTypeMasterUpdate(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getdischargetypeMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getdischargetypeMasterList();
                            //     }
                            // });
                        } else {
                           
                            this.toastr.error('DischargeType Master Data not Updated !, Please check API error..', 'Updated !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                    
                        }
                        this.getdischargetypeMasterList();
                    },error => {
                        this.toastr.error('DischargeType Data not Updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            DischargeTypeId: row.DischargeTypeId,
            DischargeTypeName: row.DischargeTypeName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._dischargetypeService.populateForm(m_data);
    }
}
export class DischargeTypeMaster {
    DischargeTypeId: number;
    DischargeTypeName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    IsDeletedSearch: number;
    /**
     * Constructor
     *
     * @param DischargeTypeMaster
     */
    constructor(DischargeTypeMaster) {
        {
            this.DischargeTypeId = DischargeTypeMaster.DischargeTypeId || "";
            this.DischargeTypeName =
                DischargeTypeMaster.DischargeTypeName || "";
            this.IsDeleted = DischargeTypeMaster.IsDeleted || "false";
            this.AddedBy = DischargeTypeMaster.AddedBy || "";
            this.UpdatedBy = DischargeTypeMaster.UpdatedBy || "";
            this.IsDeletedSearch = DischargeTypeMaster.IsDeletedSearch || "";
        }
    }
}
