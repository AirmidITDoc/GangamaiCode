import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategorymasterService } from "./categorymaster.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { fuseAnimations } from "@fuse/animations";

@Component({
    selector: "app-categorymaster",
    templateUrl: "./categorymaster.component.html",
    styleUrls: ["./categorymaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategorymasterComponent implements OnInit {
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

    constructor(public _categorymasterService: CategorymasterService) {}

    ngOnInit(): void {
        this.getCategoryMasterList();
    }
    onSearch() {
      this.getCategoryMasterList();
  }

  onSearchClear() {
      this._categorymasterService.myformSearch.reset({
        CategoryNameSearch: "",
          IsDeletedSearch: "2",
      });
  }

    getCategoryMasterList() {
        this._categorymasterService
            .getCategoryMasterList()
            .subscribe((Menu) => {
                this.DSCategoryMasterList.data = Menu as CategoryMaster[];
                this.DSCategoryMasterList.sort = this.sort;
                this.DSCategoryMasterList.paginator = this.paginator;
            });
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
                        CategoryName: this._categorymasterService.myform
                            .get("CategoryName")
                            .value.trim(),
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._categorymasterService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._categorymasterService
                    .insertPathologyCategoryMaster(m_data)
                    .subscribe((data) => {
                        this.msg = data;
                        this.getCategoryMasterList();
                    });
            } else {
                var m_dataUpdate = {
                    updatePathologyCategoryMaster: {
                        CategoryId:
                            this._categorymasterService.myform.get("CategoryId")
                                .value,
                        CategoryName:
                            this._categorymasterService.myform.get(
                                "CategoryName"
                            ).value,
                        IsDeleted: Boolean(
                            JSON.parse(
                                this._categorymasterService.myform.get(
                                    "IsDeleted"
                                ).value
                            )
                        ),
                    },
                };

                this._categorymasterService
                    .updatePathologyCategoryMaster(m_dataUpdate)
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
        this._categorymasterService.populateForm(m_data);
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
