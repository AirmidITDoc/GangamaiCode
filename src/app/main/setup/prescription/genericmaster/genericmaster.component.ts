import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { GenericmasterService } from "./genericmaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ToastrService } from "ngx-toastr";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: "app-genericmaster",
    templateUrl: "./genericmaster.component.html",
    styleUrls: ["./genericmaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class GenericmasterComponent implements OnInit {
    GenericMasterList: any;
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "GenericId",
        "GenericName",
        // "AddedByName",
        "IsDeleted",
        "action",
    ];

    DSGenericMasterList = new MatTableDataSource<GenericMaster>();

    constructor(public _GenericService: GenericmasterService,
        public toastr : ToastrService,
          public _matDialog: MatDialog
   ) {}

    ngOnInit(): void {
        this.getGenericMasterList();
    }
    onSearch() {
        this.getGenericMasterList();
    }

    onSearchClear() {
        this._GenericService.myformSearch.reset({
            GenericNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getGenericMasterList();
    }
    getGenericMasterList() {
        var param = {       
        GenericName: this._GenericService.myformSearch.get("GenericNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._GenericService.getGenericMasterList(param).subscribe((Menu) => {
            (this.DSGenericMasterList.data = Menu as GenericMaster[]),
                (this.DSGenericMasterList.sort = this.sort),
                (this.DSGenericMasterList.paginator = this.paginator);
        });
    }

    onClear() {
        this._GenericService.myForm.reset({ IsDeleted: "false" });
        this._GenericService.initializeFormGroup();
    }

    onSubmit() {
        if (this._GenericService.myForm.valid) {
            if (!this._GenericService.myForm.get("GenericId").value) {
                var m_data = {
                    insertGenericMaster: {
                        genericName: this._GenericService.myForm
                            .get("GenericName")
                            .value.trim(),
                        isActive: Boolean(
                            JSON.parse(
                                this._GenericService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        // addedBy: 1,
                    },
                };
                this._GenericService
                    .insertGenericMaster(m_data)
                    .subscribe((data) => {
                        this.msg = m_data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getGenericMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGenericMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Generic Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getGenericMasterList();
                    },error => {
                        this.toastr.error('Generic Class Data not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateGenericMaster: {
                        genericId:
                            this._GenericService.myForm.get("GenericId").value,
                        genericName: this._GenericService.myForm
                            .get("GenericName")
                            .value.trim(),

                        isActive: Boolean(
                            JSON.parse(
                                this._GenericService.myForm.get("IsDeleted")
                                    .value
                            )
                        ),
                        //  updatedBy: 1,
                    },
                };
                this._GenericService
                    .updateGenericMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = m_dataUpdate;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getGenericMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getGenericMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Generic Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getGenericMasterList();
                    },error => {
                        this.toastr.error('Generic Class Data not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data1 = {
            GenericId: row.Genericid,
            GenericName: row.GenericName.trim(),
            IsDeleted: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        console.log(m_data1);
        this._GenericService.populateForm(m_data1);
    }
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
      onDeactive(row) {
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
             let Query 
            if(row.IsActive){
             Query = "Update M_GenericMaster set IsActive=0 where Genericid=" + row.Genericid;
            }else{
            Query = "Update M_GenericMaster set IsActive=1 where Genericid=" + row.Genericid;
            }
            this._GenericService.deactivateTheStatus(Query).subscribe((data) => (data));
            this.getGenericMasterList();
          }
          this.confirmDialogRef = null;
        });
      }
}

export class GenericMaster {
    GenericId: number;
    GenericName: string;

    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param GenericMaster
     */
    constructor(GenericMaster) {
        {
            this.GenericId = GenericMaster.GenericId || "";
            this.GenericName = GenericMaster.GenericName || "";

            this.IsDeleted = GenericMaster.IsDeleted || "false";
            this.AddedBy = GenericMaster.AddedBy || "";
            this.UpdatedBy = GenericMaster.UpdatedBy || "";
            this.AddedByName = GenericMaster.AddedByName || "";
        }
    }
}
