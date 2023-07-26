import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategoryMasterService } from "./category-master.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

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
        "IsDeleted",
        "action",
    ];

    DSCategoryMasterList = new MatTableDataSource<CategoryMaster>();

    constructor(public _categoryService: CategoryMasterService) {}

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
        });
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
                        CategoryName: this._categoryService.myform
                            .get("CategoryName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._categoryService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                // console.log(m_data);
                this._categoryService
                    .insertCategoryMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCategoryMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updateCategoryMaster: {
                        CategoryId:
                            this._categoryService.myform.get("CategoryId")
                                .value,
                        CategoryName:
                            this._categoryService.myform.get("CategoryName")
                                .value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._categoryService.myform.get("IsDeleted")
                                    .value
                            )
                        ),
                    },
                };
                this._categoryService
                    .updateCategoryMaster(m_dataUpdate)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCategoryMasterList();
                    });
            }
            this.onClear();
        }
    }
    onEdit(row) {
        var m_data = {
            CategoryId: row.CategoryId,
            CategoryName: row.CategoryName.trim(),
            IsDeleted: JSON.stringify(row.IsDeleted),
            UpdatedBy: row.UpdatedBy,
        };
        this._categoryService.populateForm(m_data);
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
