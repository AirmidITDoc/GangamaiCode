import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemTypeMasterService } from "./item-type-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";

@Component({
    selector: "app-item-type-master",
    templateUrl: "./item-type-master.component.html",
    styleUrls: ["./item-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemTypeMasterComponent implements OnInit {
    msg: any;

    displayedColumns: string[] = [
        "ItemTypeId",
        "ItemTypeName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSItemTypeMasterList = new MatTableDataSource<ItemTypeMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _itemtypeService: ItemTypeMasterService) {}

    ngOnInit(): void {
        this.getItemtypeMasterList();
    }
    onSearch() {
        this.getItemtypeMasterList();
    }

    onSearchClear() {
        this._itemtypeService.myformSearch.reset({
            ItemTypeNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getItemtypeMasterList();
    }
    getItemtypeMasterList() {
        var param = {
            ItemTypeName:
                this._itemtypeService.myformSearch
                    .get("ItemTypeNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._itemtypeService.getItemtypeMasterList(param).subscribe((Menu) => {
            this.DSItemTypeMasterList.data = Menu as ItemTypeMaster[];
            this.DSItemTypeMasterList.sort = this.sort;
            this.DSItemTypeMasterList.paginator = this.paginator;
        });
    }

    onClear() {
        this._itemtypeService.myform.reset({ IsDeleted: "false" });
        this._itemtypeService.initializeFormGroup();
    }

    onSubmit() {
        if (this._itemtypeService.myform.valid) {
            if (!this._itemtypeService.myform.get("ItemTypeId").value) {
                var m_data = {
                    insertItemTypeMaster: {
                        itemTypeName: this._itemtypeService.myform
                            .get("ItemTypeName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemtypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy: 1,
                        updatedBy: 1,
                    },
                };

                this._itemtypeService
                    .insertItemTypeMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Saved !",
                                "Record saved Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getItemtypeMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not saved",
                                "error"
                            );
                        }
                        this.getItemtypeMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateItemTypeMaster: {
                        itemTypeId:
                            this._itemtypeService.myform.get("ItemTypeId")
                                .value,
                        itemTypeName: this._itemtypeService.myform
                            .get("ItemTypeName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemtypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy: 1,
                    },
                };

                this._itemtypeService
                    .updateItemTypeMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            Swal.fire(
                                "Updated !",
                                "Record updated Successfully !",
                                "success"
                            ).then((result) => {
                                if (result.isConfirmed) {
                                    this.getItemtypeMasterList();
                                }
                            });
                        } else {
                            Swal.fire(
                                "Error !",
                                "Appoinment not updated",
                                "error"
                            );
                        }
                        this.getItemtypeMasterList();
                    });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ItemTypeId: row.ItemTypeId,
            ItemTypeName: row.ItemTypeName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemtypeService.populateForm(m_data);
    }
}
export class ItemTypeMaster {
    ItemTypeId: number;
    ItemTypeName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

    /**
     * Constructor
     *
     * @param ItemTypeMaster
     */
    constructor(ItemTypeMaster) {
        {
            this.ItemTypeId = ItemTypeMaster.ItemTypeId || "";
            this.ItemTypeName = ItemTypeMaster.ItemTypeName || "";
            this.IsDeleted = ItemTypeMaster.IsDeleted || "false";
            this.AddedBy = ItemTypeMaster.AddedBy || "";
            this.UpdatedBy = ItemTypeMaster.UpdatedBy || "";
        }
    }
}
