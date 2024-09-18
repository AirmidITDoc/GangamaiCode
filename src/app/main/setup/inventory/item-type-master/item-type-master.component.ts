import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { ItemTypeMasterService } from "./item-type-master.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { AuthenticationService } from "app/core/services/authentication.service";

@Component({
    selector: "app-item-type-master",
    templateUrl: "./item-type-master.component.html",
    styleUrls: ["./item-type-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemTypeMasterComponent implements OnInit {
    msg: any;
    resultsLength = 0;
    displayedColumns: string[] = [
        "ItemTypeId",
        "ItemTypeName",
        "AddedBy",
        "IsActive",
        "action",
    ];

    DSItemTypeMasterList = new MatTableDataSource<ItemTypeMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(public _itemtypeService: ItemTypeMasterService,
        private accountService: AuthenticationService,
        public toastr : ToastrService,) {}

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
            console.log(this.DSItemTypeMasterList.data )
            this.DSItemTypeMasterList.paginator = this.paginator;
            this.resultsLength= this.DSItemTypeMasterList.data.length
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
                        IsActive: Boolean(
                            JSON.parse(
                                this._itemtypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        addedBy:this.accountService.currentUserValue.user.id,
                        updatedBy: this.accountService.currentUserValue.user.id,
                    },
                };

                this._itemtypeService
                    .insertItemTypeMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                              this.getItemtypeMasterList();
                         
                        } else {
                            this.toastr.error('Item-Type Master Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
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
                            IsActive: Boolean(
                            JSON.parse(
                                this._itemtypeService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                        updatedBy:this.accountService.currentUserValue.user.id,
                    },
                };

                this._itemtypeService
                    .updateItemTypeMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                            this.getItemtypeMasterList();
                           
                        } else {
                            this.toastr.error('Item-Type Master Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                              });
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
            IsActive: JSON.stringify(row.IsActive),
            UpdatedBy: row.UpdatedBy,
        };
        this._itemtypeService.populateForm(m_data);
    }
}
export class ItemTypeMaster {
    ItemTypeId: number;
    ItemTypeName: string;
    IsActive: boolean;
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
            this.IsActive = ItemTypeMaster.IsActive || "true";
            this.AddedBy = ItemTypeMaster.AddedBy || "";
            this.UpdatedBy = ItemTypeMaster.UpdatedBy || "";
        }
    }
}
