import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategorymasterService } from "./categorymaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import Swal from "sweetalert2";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-categorymaster",
    templateUrl: "./categorymaster.component.html",
    styleUrls: ["./categorymaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategorymasterComponent implements OnInit {
    displayedColumns: string[] = [
        "CategoryId",
        "CategoryName",
        "AddedBy",
        "IsDeleted",
        "action",
    ];
    msg: any;

    DSCategoryMasterList = new MatTableDataSource<CategoryMaster>();
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(
        public _categorymasterService: CategorymasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
        ) { }

    ngOnInit(): void {
        this.getCategoryMasterList();
    }
    getCategoryMasterList() {
        var param = {
            CategoryName:this._categorymasterService.myformSearch.get("CategoryNameSearch").value + "%" || "%",
        };
            this._categorymasterService.getCategoryMasterList(param).subscribe((Menu) => {
            this.DSCategoryMasterList.data = Menu as CategoryMaster[];
            this.DSCategoryMasterList.sort = this.sort;
            this.DSCategoryMasterList.paginator = this.paginator;
        });
    }

    onSearch() {
        this.getCategoryMasterList();
    }

    onSearchClear() {
        this._categorymasterService.myformSearch.reset({
            CategoryNameSearch: "",
            IsDeletedSearch: "2",
        });
        this.getCategoryMasterList();
    }

   

    onClear() {
        this._categorymasterService.myform.reset({ IsDeleted: "false" });
        this._categorymasterService.initializeFormGroup();
    }

    onSubmit() {
        if (this._categorymasterService.myform.valid) {
            if (!this._categorymasterService.myform.get("CategoryId").value) {
                var m_data = {
                    insertPathologyCategoryMaster: {
                        categoryName: this._categorymasterService.myform.get("CategoryName").value.trim(),
                        isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
                        addedBy: 1,
                    },
                };
                    console.log(m_data)
                this._categorymasterService.insertPathologyCategoryMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getCategoryMasterList();
                        } else {
                            this.toastr.error('Category Master Data not saved !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getCategoryMasterList();
                    }, error => {
                        this.toastr.error('Category not saved !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            } else {
                
                var m_dataUpdate = {
                    updatePathologyCategoryMaster: {
                        categoryId:this._categorymasterService.myform.get("CategoryId").value,
                        categoryName: this._categorymasterService.myform.get("CategoryName").value,
                        isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
                        updatedBy: 1,
                    },
                };
                console.log(m_dataUpdate)
                this._categorymasterService.updatePathologyCategoryMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                            });
                            this.getCategoryMasterList();
                        } else {
                            this.toastr.error('Category Master Data not updated !, Please check API error..', 'Error !', {
                                toastClass: 'tostr-tost custom-toast-error',
                            });
                        }
                        this.getCategoryMasterList();
                    }, error => {
                        this.toastr.error('Category not updated !, Please check API error..', 'Error !', {
                            toastClass: 'tostr-tost custom-toast-error',
                        });
                    });
            }
            this.onClear();
        }
    }
    onDeactive(CategoryId) {
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
                "Update M_PathCategoryMaster set Isdeleted=1 where CategoryId=" +
                    CategoryId;
                    
                console.log(Query);
                this._categorymasterService.deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getCategoryMasterList();
            }
            this.confirmDialogRef = null;
            this.getCategoryMasterList();
        });
    }
    onEdit(row) {
        var m_data = {
            CategoryId: row.CategoryId,
            CategoryName: row.CategoryName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._categorymasterService.populateForm(m_data);
    }
}

export class CategoryMaster {
    CategoryId: number;
    CategoryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;

    /**
     * Constructor
     *
     * @param CategoryMaster
     */
    constructor(CategoryMaster) {
        {
            this.CategoryId = CategoryMaster.CategoryId || "";
            this.CategoryName = CategoryMaster.CategoryName || "";
            this.IsDeleted = CategoryMaster.IsDeleted || "false";
            this.AddedBy = CategoryMaster.AddedBy || "";
            this.UpdatedBy = CategoryMaster.UpdatedBy || "";
        }
    }
}
