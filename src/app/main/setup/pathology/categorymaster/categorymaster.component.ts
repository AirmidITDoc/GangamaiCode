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
import { NewCategoryComponent } from "./new-category/new-category.component";


import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";

@Component({
    selector: "app-categorymaster",
    templateUrl: "./categorymaster.component.html",
    styleUrls: ["./categorymaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategorymasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    gridConfig: gridModel = {
        apiUrl: "PathCategoryMaster/List",
        columnsList: [
            { heading: "Code", key: "categoryId", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsDeleted", key: "isActive", type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onAdd(data) // EDIT Records
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.onDeactive(data.genderId); // DELETE Records
                        }
                    }]
            } //Action 1-view, 2-Edit,3-delete
        ],
        sortField: "categoryId",
        sortOrder: 0,
        filters: [
            { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row:25
    }
    constructor(
        public _categorymasterService: CategorymasterService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        
    }

    toggleSidebar(name): void {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
      }
  
    onSearch() {
       
    }

  


    onClear() {
        this._categorymasterService.myform.reset({ IsDeleted: "true" });
        this._categorymasterService.initializeFormGroup();
    }
    // toggle(val: any) {
    //     if (val == "2") {
    //         this.currentStatus = 2;
    //     } else if (val == "1") {
    //         this.currentStatus = 1;
    //     }
    //     else {
    //         this.currentStatus = 0;

    //     }
    // }

   
    // onFilterChange() {
       
    //     if (this.currentStatus == 1) {
    //         this.tempList.data = []
    //         this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
    //         for (let item of this.DSCategoryMasterList.data) {
    //             if (item.IsDeleted) this.tempList.data.push(item)

    //         }

    //         this.DSCategoryMasterList.data = [];
    //         this.DSCategoryMasterList.data = this.tempList.data;
    //     }
    //     else if (this.currentStatus == 0) {
    //         this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
    //         this.tempList.data = []

    //         for (let item of this.DSCategoryMasterList.data) {
    //             if (!item.IsDeleted) this.tempList.data.push(item)

    //         }
    //         this.DSCategoryMasterList.data = [];
    //         this.DSCategoryMasterList.data = this.tempList.data;
    //     }
    //     else {
    //         this.DSCategoryMasterList.data= this.DSCategoryMasterList1.data
    //         this.tempList.data = this.DSCategoryMasterList.data;
    //     }


    // }
    onDeactive(categoryId) {
        this.confirmDialogRef = this._matDialog.open(
            FuseConfirmDialogComponent,
            {
                disableClose: false,
            }
        );
        this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
        this.confirmDialogRef.afterClosed().subscribe((result) => {
            if (result) {
                this._categorymasterService.deactivateTheStatus(categoryId).subscribe((response: any) => {
                    if (response.StatusCode == 200) {
                        this.toastr.success(response.Message);
                        // this.getGenderMasterList();
                        // How to refresh Grid.
                    }
                });
            }
            this.confirmDialogRef = null;
        });
    }

    onAdd(row:any = null) {
        const dialogRef = this._matDialog.open(NewCategoryComponent,
        {
            maxWidth: "45vw",
            height: '35%',
            width: '70%',
            data: row
        });
        dialogRef.afterClosed().subscribe(result => {
            if(result){
                // this.getGenderMasterList();
                // How to refresh Grid.
            }
            console.log('The dialog was closed - Action', result);
        });
    }
    onEdit(row) {
        row.IsDeleted=JSON.stringify(row.IsDeleted)
               this._categorymasterService.populateForm(row);
    }
}

export class CategoryMaster {
    categoryId: number;
    categoryName: string;
    isActive: boolean;
    CreatedBy: any;
    ModifiedBy: any;

    /**
     * Constructor
     *
     * @param CategoryMaster
     */
    constructor(CategoryMaster) {
        {
            this.categoryId = CategoryMaster.categoryId || "";
            this.categoryName = CategoryMaster.categoryName || "";
            this.isActive = CategoryMaster.isActive || "true";
            this.CreatedBy = CategoryMaster.CreatedBy || "";
            this.ModifiedBy = CategoryMaster.ModifiedBy || "";
        }
    }
}
