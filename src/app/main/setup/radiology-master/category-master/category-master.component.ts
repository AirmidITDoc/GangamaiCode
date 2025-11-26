import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { CategoryMasterService } from "./category-master.service";
import { NewCategoryComponent } from "./new-category/new-category.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";

@Component({
    selector: "app-category-master",
    templateUrl: "./category-master.component.html",
    styleUrls: ["./category-master.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
    categoryName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RadiologyCategoryMaster, permissionType.Add);

    allcolumns = [

        { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "User Name", key: "username", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Updated By", key: "updatedby", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.RadiologyCategoryMaster, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                },
                {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.RadiologyCategoryMaster, permissionType.Delete), callback: (data: any) => {
                        this._categorymasterService.deactivateTheStatus(data.categoryId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        }
    ]

    allfilters = [
        { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
    gridConfig: gridModel = {
        permissionCode: permissionCodes.RadiologyCategoryMaster,
        apiUrl: "RadiologyCategoryMaster/List",
        columnsList: this.allcolumns,
        sortField: "categoryId",
        sortOrder: 0,
        filters: this.allfilters
    }

    constructor(
        public _categorymasterService: CategoryMasterService,
        public _matDialog: MatDialog, public permissionService: PagePermissionService,
        public toastr: ToastrService,
    ) { }

    ngOnInit(): void {

    }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        let that = this;
        const dialogRef = this._matDialog.open(NewCategoryComponent,
            {
                maxWidth: "50vw",
                maxHeight: '50%',
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