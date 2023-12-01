import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ItemGenericMasterService } from "./item-generic-master.service";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

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
        public toastr : ToastrService,) {}

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
            ItemId: 0,
            ItemGenericId: 0,
            ItemGenericName:
                this._itemgenericService.myformSearch
                    .get("ItemGenericNameSearch")
                    .value.trim() + "%" || "%",
        };

        this._itemgenericService
            .getitemgenericMasterList(param)
            .subscribe((Menu) => {
                this.DSItemGenericMasterList.data = Menu as ItemGenericMaster[];
                this.DSItemGenericMasterList.sort = this.sort;
                this.DSItemGenericMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._itemgenericService.myform.reset({ IsDeleted: "false" });
        this._itemgenericService.initializeFormGroup();
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
        var m_data = {
            ItemGenericNameId: row.ItemGenericNameId,
            ItemGenericName: row.ItemGenericName.trim(),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemgenericService.populateForm(m_data);
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
