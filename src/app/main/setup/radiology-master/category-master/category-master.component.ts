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
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewCategoryComponent } from "./new-category/new-category.component";

@Component({
    selector: "app-category-master",
    templateUrl: "./category-master.component.html",
    styleUrls: ["./category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

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
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this.confirmDialogRef = this._matDialog.open(
                                FuseConfirmDialogComponent,
                                {
                                    disableClose: false,
                                }
                            );
                            this.confirmDialogRef.componentInstance.confirmMessage = "Are you sure you want to deactive?";
                            this.confirmDialogRef.afterClosed().subscribe((result) => {
                                if (result) {
                                    let that = this;
                                    this._categorymasterService.deactivateTheStatus(data.categoryId).subscribe((response: any) => {
                                        this.toastr.success(response.message);
                                        that.grid.bindGridData();
                                    });
                                }
                                this.confirmDialogRef = null;
                            });
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
        row: 25
    }
    constructor(
        public _categorymasterService: CategoryMasterService,
        public _matDialog: MatDialog,
        private accountService: AuthenticationService,
        private _fuseSidebarService: FuseSidebarService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {
        
    }

  onSave(row: any = null) {
        debugger
        let that = this;
        const dialogRef = this._matDialog.open(NewCategoryComponent,
            {
                maxWidth: "45vw",
                height: '35%',
                width: '70%',
                data: row
            });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                that.grid.bindGridData();
            }
        });
    }
}