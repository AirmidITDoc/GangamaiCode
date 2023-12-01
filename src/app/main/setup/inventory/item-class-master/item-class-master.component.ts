import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import { ItemClassMasterService } from "./item-class-master.service";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-item-class-master",
    templateUrl: "./item-class-master.component.html",
    styleUrls: ["./item-class-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemClassMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ItemClassId",
        "ItemClassName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSItemClassMasterList = new MatTableDataSource<ItemClassMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _itemclassService: ItemClassMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getitemclassMasterList();
    }
    onSearch() {
        this.getitemclassMasterList();
    }

    onSearchClear() {
        this._itemclassService.myformSearch.reset({
            ItemClassNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getitemclassMasterList();
    }
    getitemclassMasterList() {
        var param = {
            ItemClassName:
                this._itemclassService.myformSearch
                    .get("ItemClassNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._itemclassService
            .getitemclassMasterList(param)
            .subscribe((Menu) => {
                this.DSItemClassMasterList.data = Menu as ItemClassMaster[];
                this.DSItemClassMasterList.sort = this.sort;
                this.DSItemClassMasterList.paginator = this.paginator;
            });
    }

    onClear() {
        this._itemclassService.myform.reset({ IsDeleted: "false" });
        this._itemclassService.initializeFormGroup();
    }

    onSubmit() {
        if (this._itemclassService.myform.valid) {
            if (!this._itemclassService.myform.get("ItemClassId").value) {
                var m_data = {
                    insertItemClassMaster: {
                        itemClassName: this._itemclassService.myform
                            .get("ItemClassName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemclassService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        updatedBy: 1,
                    },
                };
                console.log(m_data);
                this._itemclassService
                    .insertItemClassMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getitemclassMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemclassMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Class Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemclassMasterList();
                    },error => {
                        this.toastr.error('Item-Class  not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateItemClassMaster: {
                        itemClassId:
                            this._itemclassService.myform.get("ItemClassId")
                                .value,
                        itemClassName: this._itemclassService.myform
                            .get("ItemClassName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemclassService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._itemclassService
                    .updateItemClassMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getitemclassMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemclassMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Class Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemclassMasterList();
                    },error => {
                        this.toastr.error('Item-Class  not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ItemClassId: row.ItemClassId,
            ItemClassName: row.ItemClassName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemclassService.populateForm(m_data);
    }
}
export class ItemClassMaster {
    ItemClassId: number;
    ItemClassName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param ItemClassMaster
     */
    constructor(ItemClassMaster) {
        {
            this.ItemClassId = ItemClassMaster.ItemClassId || "";
            this.ItemClassName = ItemClassMaster.ItemClassName || "";
            this.IsDeleted = ItemClassMaster.IsDeleted || "false";
            this.AddedBy = ItemClassMaster.AddedBy || "";
            this.UpdatedBy = ItemClassMaster.UpdatedBy || "";
        }
    }
}
