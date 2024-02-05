import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategoryMasterService } from "./category-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";

@Component({
    selector: "app-category-master",
    templateUrl: "./category-master.component.html",
    styleUrls: ["./category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
    CategoryMasterList: any;
    //GendercmbList:any=[];
    msg: any;

    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedColumns: string[] = [
        "CategoryId",
        "CategoryName",
        "AddedByName",
        "UpdatedBy",
        "IsDeleted",
        "action",
    ];

    DSCategoryMasterList = new MatTableDataSource<CategoryMaster>();
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(public _categoryService: CategoryMasterService,
        public _matDialog: MatDialog,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getCategoryMasterList();
    }
    
    onSearch() {
        this.getCategoryMasterList();
    }

    onSearchClear() {
        this._categoryService.myformSearch.reset({
            CategoryNameSearch: "",
            IsDeletedSearch: "2",
        }); this.getCategoryMasterList();
    } 
    getCategoryMasterList() {
        var m ={
            CategoryName: this._categoryService.myformSearch.get('CategoryNameSearch').value + '%' || '%'
        };
        this._categoryService.getCategoryMasterList(m).subscribe((Menu) => {
            this.DSCategoryMasterList.data = Menu as CategoryMaster[];
            this.DSCategoryMasterList.sort = this.sort;
            this.DSCategoryMasterList.paginator = this.paginator;
            console.log(this.DSCategoryMasterList.data );
        });
    }

    onClear() {
        this._categoryService.myform.reset({ IsDeleted: "false" });
        this._categoryService.initializeFormGroup();
    }

    onSubmit() {
        if (this._categoryService.myform.valid) {
            if (!this._categoryService.myform.get("CategoryId").value) {
                var m_data = {
                    insertCategoryMaster: {
                        categoryName: this._categoryService.myform
                            .get("CategoryName").value.trim(),
                            addedBy: 1,
                    },
                };
                // console.log(m_data);
                this._categoryService
                    .insertCategoryMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record Saved Successfully.', 'Saved !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                        
                        this.getCategoryMasterList();
                            }
                            else {
                                this.toastr.error('Category Master Master Data not saved !, Please check API error..', 'Error !', {
                                    toastClass: 'tostr-tost custom-toast-error',
                                  });
                            }    this.getCategoryMasterList();

                    },error => {
                        this.toastr.error('Category not saved !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            } else {
                var m_dataUpdate = {
                    updateCategoryMaster: {
                        CategoryId: this._categoryService.myform.get("CategoryId").value,
                        CategoryName: this._categoryService.myform.get("CategoryName").value,
                        updatedBy:1
                    },
                };
                this._categoryService
                    .updateCategoryMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        if (data) {
                            this.toastr.success('Record updated Successfully.', 'updated !', {
                                toastClass: 'tostr-tost custom-toast-success',
                              });
                        this.getCategoryMasterList();
                            }
                            else {
                                this.toastr.error('Category Master Data not updated !, Please check API error..', 'Error !', {
                                    toastClass: 'tostr-tost custom-toast-error',
                                  });
                            } this.getCategoryMasterList();
                    },error => {
                        this.toastr.error('Category not updated !, Please check API error..', 'Error !', {
                         toastClass: 'tostr-tost custom-toast-error',
                       });
                     });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            CategoryId: row.CategoryId,
            CategoryName: row.CategoryName.trim(),
            IsDeleted: JSON.stringify(row.Isdeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._categoryService.populateForm(m_data);
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
                "Update M_Radiology_CategoryMaster set Isdeleted=1 where CategoryId=" +
                    CategoryId;
                    
                console.log(Query);
                this._categoryService.deactivateTheStatus(Query)
                    .subscribe((data) => (this.msg = data));
                this.getCategoryMasterList();
            }
            this.confirmDialogRef = null;
            this.getCategoryMasterList();
        });
    }
}
export class CategoryMaster {
    CategoryId: number;
    CategoryName: string;
    IsDeleted: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;

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
            this.AddedByName = CategoryMaster.AddedByName || "";
        }
    }
}
