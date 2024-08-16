import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategoryMasterService } from "./category-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import Swal from "sweetalert2";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

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
    DSCategoryMasterList1 = new MatTableDataSource<CategoryMaster>();
    tempList = new MatTableDataSource<CategoryMaster>();
    currentStatus=0;
    resultsLength=0;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(public _categoryService: CategoryMasterService,
        public _matDialog: MatDialog,
        private _fuseSidebarService: FuseSidebarService,
        private accountService: AuthenticationService,
        public toastr : ToastrService,) {}

    ngOnInit(): void {
        this.getCategoryMasterList();
    }
    
    onSearch() {
        this.getCategoryMasterList();
    }
    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
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
            this.DSCategoryMasterList1.data = Menu as CategoryMaster[];
            this.resultsLength= this.DSCategoryMasterList.data.length 
            this.DSCategoryMasterList.sort = this.sort;
            this.DSCategoryMasterList.paginator = this.paginator;
            console.log(this.DSCategoryMasterList.data );
        });
    }

    onClear() {
        this._categoryService.myform.reset({ IsDeleted: "true" });
        this._categoryService.initializeFormGroup();
    }

    onSubmit() {
        if (this._categoryService.myform.valid) {
            if (!this._categoryService.myform.get("CategoryId").value) {
                var m_data = {
                    insertCategoryMaster: {
                        categoryName: this._categoryService.myform.get("CategoryName").value.trim(),
                            isDeleted:this._categoryService.myform.get("IsDeleted").value || true,
                            addedBy: this.accountService.currentUserValue.user.id,
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
                        isDeleted:this._categoryService.myform.get("IsDeleted").value || true,
                        updatedBy:this.accountService.currentUserValue.user.id,
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
       debugger
        this._categoryService.populateForm(row);
    }
    onDeactive(row) {
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
          }).then((result) => {
            if (result) {
                let Query 
                if (!this.DSCategoryMasterList.data.find(item => item.CategoryId === row.CategoryId).IsActive){
                     Query ="Update M_Radiology_CategoryMaster set IsDeleted=0 where CategoryId=" + row.CategoryId;}
                else{
                let Query =
                "Update M_Radiology_CategoryMaster set IsDeleted=1 where CategoryId=" +row.CategoryId;}
                    
                console.log(Query);
                this._categoryService.deactivateTheStatus(Query)
                .subscribe((data) => {
                    Swal.fire('Changed!', 'Category Status has been Changed.', 'success');
                     this.getCategoryMasterList();
                   }, (error) => {
                     Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                   });
            }
            this.confirmDialogRef = null;
            this.getCategoryMasterList();
        });
    }
    toggle(val: any) {
        if (val == "2") {
            this.currentStatus = 2;
        } else if (val == "1") {
            this.currentStatus = 1;
        }
        else {
            this.currentStatus = 0;

        }
    }


    onFilterChange() {
       
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            for (let item of this.DSCategoryMasterList.data) {
                if (item.IsActive) this.tempList.data.push(item)

            }

            this.DSCategoryMasterList.data = [];
            this.DSCategoryMasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            this.tempList.data = []

            for (let item of this.DSCategoryMasterList.data) {
                if (!item.IsActive) this.tempList.data.push(item)

            }
            this.DSCategoryMasterList.data = [];
            this.DSCategoryMasterList.data = this.tempList.data;
        }
        else {
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            this.tempList.data = this.DSCategoryMasterList.data;
        }


    }
}
export class CategoryMaster {
    CategoryId: number;
    CategoryName: string;
    IsActive: boolean;
    AddedBy: number;
    UpdatedBy: number;
    AddedByName: string;
    IsDeleted: boolean;
    /**
     * Constructor
     *
     * @param CategoryMaster
     */
    constructor(CategoryMaster) {
        {
            this.CategoryId = CategoryMaster.CategoryId || "";
            this.CategoryName = CategoryMaster.CategoryName || "";
            this.IsActive = CategoryMaster.IsActive || "true";
            this.IsDeleted = CategoryMaster.IsDeleted || "true";
            this.AddedBy = CategoryMaster.AddedBy || "";
            this.UpdatedBy = CategoryMaster.UpdatedBy || "";
            this.AddedByName = CategoryMaster.AddedByName || "";
        }
    }
}
