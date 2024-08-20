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
import { timeStamp } from "console";
import { forEach } from "lodash";
import { MatAccordion } from "@angular/material/expansion";
import { AuthenticationService } from "app/core/services/authentication.service";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";

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
    DSCategoryMasterList1 = new MatTableDataSource<CategoryMaster>();
    tempList = new MatTableDataSource<CategoryMaster>();
    currentStatus = 2;
    @ViewChild(MatSort) sort: MatSort;
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatAccordion) accordion: MatAccordion;
    resultsLength = 0;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    constructor(
        public _categorymasterService: CategorymasterService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        this.getCategoryMasterList();
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
    getCategoryMasterList() {
        var param = {
            CategoryName: this._categorymasterService.myformSearch.get("CategoryNameSearch").value + "%" || "%",

        };
        this._categorymasterService.getCategoryMasterList(param).subscribe((data) => {
            this.DSCategoryMasterList.data = data as CategoryMaster[];
            this.tempList.data = this.DSCategoryMasterList.data;
            this.DSCategoryMasterList1.data= this.DSCategoryMasterList.data;
            this.DSCategoryMasterList.sort = this.sort;
            this.DSCategoryMasterList.paginator = this.paginator;
            this.resultsLength= this.DSCategoryMasterList.data.length
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
        this._categorymasterService.myform.reset({ IsDeleted: "true" });
        this._categorymasterService.initializeFormGroup();
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

    onSubmit() {
        if (this._categorymasterService.myform.valid) {
            if (!this._categorymasterService.myform.get("CategoryId").value) {
                var m_data = {
                    insertPathologyCategoryMaster: {
                        categoryName: this._categorymasterService.myform.get("CategoryName").value.trim(),
                        isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
                        addedBy: this.accountService.currentUserValue.user.id,
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
                        categoryId: this._categorymasterService.myform.get("CategoryId").value,
                        categoryName: this._categorymasterService.myform.get("CategoryName").value,
                        isDeleted: Boolean(JSON.parse(this._categorymasterService.myform.get("IsDeleted").value)),
                        updatedBy: this.accountService.currentUserValue.user.id,
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
    onFilterChange() {
       
        if (this.currentStatus == 1) {
            this.tempList.data = []
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            for (let item of this.DSCategoryMasterList.data) {
                if (item.IsDeleted) this.tempList.data.push(item)

            }

            this.DSCategoryMasterList.data = [];
            this.DSCategoryMasterList.data = this.tempList.data;
        }
        else if (this.currentStatus == 0) {
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            this.tempList.data = []

            for (let item of this.DSCategoryMasterList.data) {
                if (!item.IsDeleted) this.tempList.data.push(item)

            }
            this.DSCategoryMasterList.data = [];
            this.DSCategoryMasterList.data = this.tempList.data;
        }
        else {
            this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
            this.tempList.data = this.DSCategoryMasterList.data;
        }


    }
    onDeactive(CategoryId) {

       
        Swal.fire({
            title: 'Confirm Status',
            text: 'Are you sure you want to Change Status?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes,Change Status!'
        }).then((result) => {
            if (result.isConfirmed) {
                let Query
                if (!this.DSCategoryMasterList.data.find(item => item.CategoryId === CategoryId).IsDeleted) {
                    Query = "Update M_PathCategoryMaster set IsDeleted=0 where CategoryId=" + CategoryId;
                    
                }
                else {
                     Query = "Update M_PathCategoryMaster set Isdeleted=1 where CategoryId=" + CategoryId;
                }
                console.log(Query);
                this._categorymasterService.deactivateTheStatus(Query)
                    .subscribe((data) => {
                        // Handle success response
                        Swal.fire('Changed!', 'Category Status has been Changed.', 'success');
                        this.getCategoryMasterList();
                    }, (error) => {
                        // Handle error response
                        Swal.fire('Error!', 'Failed to deactivate category.', 'error');
                    });
            }
        });
    }
    onEdit(row) {
        // var m_data = {
        //     CategoryId: row.CategoryId,
        //     CategoryName: row.CategoryName.trim(),
        //     Isdeleted: JSON.stringify(row.Isdeleted),
        //     UpdatedBy: row.UpdatedBy,
        // };
        this._categorymasterService.populateForm(row);
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
            this.IsDeleted = CategoryMaster.IsDeleted || "true";
            this.AddedBy = CategoryMaster.AddedBy || "";
            this.UpdatedBy = CategoryMaster.UpdatedBy || "";
        }
    }
}
