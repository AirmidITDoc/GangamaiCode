import { Component, Inject, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ItemGenericMasterService } from "./item-generic-master.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { AuthenticationService } from "app/core/services/authentication.service";
import { DataRowOutlet } from "@angular/cdk/table";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-item-generic-master",
    templateUrl: "./item-generic-master.component.html",
    styleUrls: ["./item-generic-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemGenericMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ItemGenericNameId",
        "ItemGenericName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSItemGenericMasterList = new MatTableDataSource<ItemGenericMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _itemgenericService: ItemGenericMasterService,
        public toastr: ToastrService,
        public _matDialog: MatDialog,
        // public dialogRef: MatDialogRef<ItemGenericMasterComponent>, 
        private _loggedService: AuthenticationService,
    ) {}

    ngOnInit(): void {
        this.getitemgenericMasterList();
    }
    onSearch() {
        this.getitemgenericMasterList();
    }

    onSearchClear() {
        this._itemgenericService.myformSearch.reset({
            ItemGenericNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getitemgenericMasterList();
    }
    getitemgenericMasterList() {
        var param = { 
            ItemGenericName: this._itemgenericService.myformSearch
                    .get("ItemGenericNameSearch").value.trim() + "%" || "%",
        };
        console.log(param)
        this._itemgenericService
            .getitemgenericMasterList(param)
            .subscribe((Menu) => {
                this.DSItemGenericMasterList.data = Menu as ItemGenericMaster[];
                console.log(this.DSItemGenericMasterList.data)
                this.DSItemGenericMasterList.sort = this.sort;
                this.DSItemGenericMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._itemgenericService.myform.reset({ IsDeleted: "true" });
        this._itemgenericService.initializeFormGroup();
       // this._matDialog.closeAll(); 
      // this.dialogRef.close();
    }
    onClose(){
    //    this.dialogRef.close(); 
       this._itemgenericService.myform.reset();
        this._matDialog.closeAll();  
    }

    onSubmit() {
        if (this._itemgenericService.myform.valid) {
            if (
                !this._itemgenericService.myform.get("ItemGenericNameId").value
            ) {
                var m_data = {
                    insertItemGenericMaster: {
                        itemGenericName: this._itemgenericService.myform
                            .get("ItemGenericName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemgenericService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        updatedBy: 1,
                    },
                };

                console.log("m_data:",m_data)

                this._itemgenericService
                    .insertItemGenericMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getitemgenericMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemgenericMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Generic Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemgenericMasterList();
                    },error => {
                        this.toastr.error('Item-Generic not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateItemGenericMaster: {
                        itemGenericNameId:
                            this._itemgenericService.myform.get(
                                "ItemGenericNameId"
                            ).value,
                        itemGenericName: this._itemgenericService.myform
                            .get("ItemGenericName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemgenericService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };
                console.log("m_dataUpdate:",m_dataUpdate)
                this._itemgenericService
                    .updateItemGenericMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getitemgenericMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemgenericMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Generic Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemgenericMasterList();
                    },error => {
                        this.toastr.error('Item-Generic not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        console.log(row)
        var m_data = {
            ItemGenericNameId: row.ItemGenericNameId,
            ItemGenericName: row.ItemGenericName.trim(),
            // IsDeleted: row.IsDeleted,
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemgenericService.populateForm(m_data);
    }

      getEdit() { 
        const dialogRef = this._matDialog.open(ItemGenericMasterComponent,
          {
            maxWidth: "50vw",
            maxHeight: "40vh",
            width: '100%',
            height: "100%" 
          });
        dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed - Insert Action', result);
          this.getitemgenericMasterList();
        });
      }

      confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
      
      onDeactive(ItemGenericNameId) {
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
            if (result) {
                debugger
                let Query =
                    "Update M_ItemGenericNameMaster set IsDeleted=0 where ItemGenericNameId=" +
                    ItemGenericNameId;
                console.log(Query);
                this._itemgenericService
                    .deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getitemgenericMasterList();
            }
            this.confirmDialogRef = null;
        });
    }

}
export class ItemGenericMaster {
    ItemGenericNameId: number;
    ItemGenericName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param ItemGenericMaster
     */
    constructor(ItemGenericMaster) {
        {
            this.ItemGenericNameId = ItemGenericMaster.ItemGenericNameId || "";
            this.ItemGenericName = ItemGenericMaster.ItemGenericName || "";
            this.IsDeleted = ItemGenericMaster.IsDeleted || "false";
            this.AddedBy = ItemGenericMaster.AddedBy || "";
            this.UpdatedBy = ItemGenericMaster.UpdatedBy || "";
        }
    }
}
