import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { CategorymasterService } from "./categorymaster.service";
import { fuseAnimations } from "@fuse/animations";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { NewCategoryComponent } from "./new-category/new-category.component";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";

@Component({
    selector: "app-categorymaster",
    templateUrl: "./categorymaster.component.html",
    styleUrls: ["./categorymaster.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategorymasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    gridConfig: gridModel = {
        apiUrl: "PathCategoryMaster/List",
        columnsList: [
            { heading: "Code", key: "categoryId", width: 150, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "Category Name", key: "categoryName", width: 800, sort: true, align: 'left', emptySign: 'NA' },
            { heading: "IsActive", key: "isActive", width: 100, type: gridColumnTypes.status, align: "center" },
            {
                heading: "Action", key: "action", width: 100, align: "right", type: gridColumnTypes.action, actions: [
                    {
                        action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data);
                        }
                    }, {
                        action: gridActions.delete, callback: (data: any) => {
                            this._categorymasterService.deactivateTheStatus(data.categoryId).subscribe((response: any) => {
                                this.toastr.success(response.message);
                                this.grid.bindGridData();
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
        public _categorymasterService: CategorymasterService,
        public _matDialog: MatDialog,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        
        let that = this;
        const dialogRef = this._matDialog.open(NewCategoryComponent,
            {
                maxWidth: "45vw",
                height: '30%',
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