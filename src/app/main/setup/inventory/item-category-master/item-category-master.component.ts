import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemCategoryMasterService } from "./item-category-master.service";
import { ReplaySubject, Subject } from "rxjs";
import { FormControl } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { takeUntil } from "rxjs/operators";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
    selector: "app-item-category-master",
    templateUrl: "./item-category-master.component.html",
    styleUrls: ["./item-category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemCategoryMasterComponent implements OnInit {
    ItemCategoryMasterList: any;
    ItemTypecmbList: any = [];
    msg: any;

    displayedColumns: string[] = [
        "ItemCategoryId",
        "ItemCategoryName",
        "ItemTypeName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];

    DSItemCategoryMasterList = new MatTableDataSource<ItemCategoryMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    // /Item filter
    public itemFilterCtrl: FormControl = new FormControl();
    public filteredItem: ReplaySubject<any> = new ReplaySubject<any>(1);

    private _onDestroy = new Subject<void>();

    constructor(public _itemcategoryService: ItemCategoryMasterService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getitemcategoryMasterList();
        this.getitemtypeNameCombobox();

        this.itemFilterCtrl.valueChanges
            .pipe(takeUntil(this._onDestroy))
            .subscribe(() => {
                this.filterItem();
            });
    }
    onSearch() {
        this.getitemcategoryMasterList();
    }

    onSearchClear() {
        this._itemcategoryService.myformSearch.reset({
            ItemCategoryNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getitemcategoryMasterList();
    }
    private filterItem() {
        if (!this.ItemTypecmbList) {
            return;
        }
        // get the search keyword
        let search = this.itemFilterCtrl.value;
        if (!search) {
            this.filteredItem.next(this.ItemTypecmbList.slice());
            return;
        } else {
            search = search.toLowerCase();
        }
        // filter the banks
        this.filteredItem.next(
            this.ItemTypecmbList.filter(
                (bank) => bank.ItemTypeName.toLowerCase().indexOf(search) > -1
            )
        );
    }

    getitemcategoryMasterList() {
        var param = {
            ItemCategoryName:
                this._itemcategoryService.myformSearch
                    .get("ItemCategoryNameSearch")
                    .value.trim() + "%" || "%",
        };
        this._itemcategoryService
            .getitemcategoryMasterList(param)
            .subscribe((Menu) => {
                this.DSItemCategoryMasterList.data =
                    Menu as ItemCategoryMaster[];
                this.DSItemCategoryMasterList.sort = this.sort;
                this.DSItemCategoryMasterList.paginator = this.paginator;
            });
    }

    getitemtypeNameCombobox() {
        this._itemcategoryService.getItemTypeMasterCombo().subscribe((data) => {
            this.ItemTypecmbList = data;
            this._itemcategoryService.myform
                .get("ItemCategoryId")
                .setValue(this.ItemTypecmbList[0]);
        });
    }

    onClear() {
        this._itemcategoryService.myform.reset({ IsDeleted: "false" });
        this._itemcategoryService.initializeFormGroup();
    }

    onSubmit() {
        if (this._itemcategoryService.myform.valid) {
            if (!this._itemcategoryService.myform.get("ItemCategoryId").value) {
                var m_data = {
                    insertItemCategoryMaster: {
                        itemCategoryName: this._itemcategoryService.myform
                            .get("ItemCategoryName")
                            .value.trim(),

                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemcategoryService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        addedBy: 1,
                        updatedBy: 1,
                        itemTypeId:
                            this._itemcategoryService.myform.get("ItemTypeID")
                                .value.ItemTypeId,
                    },
                };
                console.log(m_data);
                this._itemcategoryService
                    .insertItemCategoryMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getitemcategoryMasterList();
                            // Swal.fire(
                            //     "Saved !",
                            //     "Record saved Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemcategoryMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Category Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemcategoryMasterList();
                    },error => {
                        this.toastr.error('Item-Category not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateItemCategoryMaster: {
                        itemCategoryId:
                            this._itemcategoryService.myform.get(
                                "ItemCategoryId"
                            ).value,
                        itemCategoryName: this._itemcategoryService.myform
                            .get("ItemCategoryName")
                            .value.trim(),
                        isDeleted: Boolean(
                            JSON.parse(
                                this._itemcategoryService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                        updatedBy: 1,
                        itemTypeId:
                            this._itemcategoryService.myform.get("ItemTypeID")
                                .value.ItemTypeId,
                    },
                };

                this._itemcategoryService
                    .updateItemCategoryMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getitemcategoryMasterList();
                            // Swal.fire(
                            //     "Updated !",
                            //     "Record updated Successfully !",
                            //     "success"
                            // ).then((result) => {
                            //     if (result.isConfirmed) {
                            //         this.getitemcategoryMasterList();
                            //     }
                            // });
                        } else {
                            this.toastr.error('Item-Category Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
                        }
                        this.getitemcategoryMasterList();
                    },error => {
                        this.toastr.error('Item-Category not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }

    onEdit(row) {
        var m_data = {
            ItemCategoryId: row.ItemCategoryId,
            ItemCategoryName: row.ItemCategoryName.trim(),
            ItemTypeID: row.ItemTypeID,
            ItemTypeName: row.ItemTypeName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemcategoryService.populateForm(m_data);
    }
}
export class ItemCategoryMaster {
    ItemCategoryId: number;
    ItemCategoryName: string;
    ItemTypeID: number;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param ItemCategoryMaster
     */
    constructor(ItemCategoryMaster) {
        {
            this.ItemCategoryId = ItemCategoryMaster.ItemCategoryId || "";
            this.ItemCategoryName = ItemCategoryMaster.ItemCategoryName || "";
            this.ItemTypeID = ItemCategoryMaster.ItemTypeID || "";
            this.IsDeleted = ItemCategoryMaster.IsDeleted || "false";
            this.AddedBy = ItemCategoryMaster.AddedBy || "";
            this.UpdatedBy = ItemCategoryMaster.UpdatedBy || "";
        }
    }
}
