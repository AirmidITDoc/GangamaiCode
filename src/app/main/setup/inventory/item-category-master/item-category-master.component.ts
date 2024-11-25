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
import { AuthenticationService } from "app/core/services/authentication.service";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { NewItemcategoryComponent } from "./new-itemcategory/new-itemcategory.component";
import { FuseSidebarService } from "@fuse/components/sidebar/sidebar.service";
import { NewCategoryComponent } from "../../pathology/categorymaster/new-category/new-category.component";

@Component({
    selector: "app-item-category-master",
    templateUrl: "./item-category-master.component.html",
    styleUrls: ["./item-category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class ItemCategoryMasterComponent implements OnInit {
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    

    gridConfig: gridModel = {
        apiUrl: "ItemCategoryMaster/List",
        columnsList: [
            { heading: "Code", key: "itemCategoryId", sort: true, width:150, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "itemCategoryName", sort: true, width:400, align: 'left', emptySign: 'NA' },
            { heading: "ItemType Name", key: "itemTypeId", sort: true, width:400, align: 'left', emptySign: 'NA' },
           { heading: "IsDeleted", key: "isActive", width:100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width:100, align: "right", type: gridColumnTypes.action, actions: [
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
                                    this._categorymasterService.deactivateTheStatus(data.itemCategoryId).subscribe((response: any) => {
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
        sortField: "itemCategoryId",
        sortOrder: 0,
        filters: [
            { fieldName: "itemCategoryName", fieldValue: "", opType: OperatorComparer.Contains },
            { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
        ],
        row: 25
    }
    constructor(
        public _categorymasterService: ItemCategoryMasterService,
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
        const dialogRef = this._matDialog.open(NewItemcategoryComponent,
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