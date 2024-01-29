import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { fuseAnimations } from "@fuse/animations";
import { UnitmasterService } from "./unitmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-unitmaster",
    templateUrl: "./unitmaster.component.html",
    styleUrls: ["./unitmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class UnitmasterComponent implements OnInit {
    displayedColumns: string[] = [
        "UnitId",
        "UnitName",
       // "AddedBy",
        "IsDeleted",
        "action",
    ];

    PrefixMasterList: any;
    GendercmbList: any = [];
    msg: any;

    DSUnitmasterList = new MatTableDataSource<PathunitMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        public _unitmasterService: UnitmasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
    ) { }

    ngOnInit(): void {
        this.getUnitMasterList();
    }
    onSearch() {
        this.getUnitMasterList();
    }

    onSearchClear() {
        this._unitmasterService.myformSearch.reset({
            UnitNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getUnitMasterList();
    }

    getUnitMasterList() {
        var param = {
            UnitName: this._unitmasterService.myformSearch.get('UnitNameSearch').value + "%" || "%",
        };
        this._unitmasterService.getUnitMasterList(param).subscribe((Menu) => {
            this.DSUnitmasterList.data = Menu as PathunitMaster[];
            console.log( this.DSUnitmasterList)
            this.DSUnitmasterList.sort = this.sort;
            this.DSUnitmasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._unitmasterService.myform.reset({ IsDeleted: "false" });
        this._unitmasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._unitmasterService.myform.valid) {
            if (!this._unitmasterService.myform.get("UnitId").value) {
                var m_data = {
                    insertUnitMaster: {
                        unitName: this._unitmasterService.myform
                            .get("UnitName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                    },
                };

                this._unitmasterService
                    .insertUnitMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getUnitMasterList();
                        } else {
                            this.toastr.error('Unit Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getUnitMasterList();
                    }, error => {
                        this.toastr.error('Unit not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
                var m_dataUpdate = {
                    updateUnitMaster: {
                        unitId: this._unitmasterService.myform.get("UnitId")
                            .value,
                        unitName:
                            this._unitmasterService.myform.get("UnitName")
                                .value,
                        isDeleted: Boolean(
                            JSON.parse(
                                this._unitmasterService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                this._unitmasterService
                    .updateUnitMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getUnitMasterList();
                        } else {
                            this.toastr.error('Unit Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getUnitMasterList();
                    }, error => {
                        this.toastr.error('Unit not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClear();
        }
    }
    onDeactive(UnitId) {
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
                "Update M_PathUnitMaster set Isdeleted=1 where UnitId=" +
                UnitId;
                    
                console.log(Query);
                this._unitmasterService.deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getUnitMasterList();
            }
            this.confirmDialogRef = null;
            
        });
        this.getUnitMasterList();
    }
    onEdit(row) {
        var m_data = {
            UnitId: row.UnitId,
            UnitName: row.UnitName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._unitmasterService.populateForm(m_data);
    }
}

export class PathunitMaster {
    UnitId: number;
    UnitName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param PathunitMaster
     */
    constructor(PathunitMaster) {
        {
            this.UnitId = PathunitMaster.UnitId || "";
            this.UnitName = PathunitMaster.UnitName || "";
            this.IsDeleted = PathunitMaster.IsDeleted || "false";
            this.AddedBy = PathunitMaster.AddedBy || "";
            this.UpdatedBy = PathunitMaster.UpdatedBy || "";
        }
    }
}
