import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { CategoryMasterService } from './category-master.service';
import { NewCategoryMasterComponent } from './new-category-master/new-category-master.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';

@Component({
    selector: 'app-category-master',
    templateUrl: './category-master.component.html',
    styleUrls: ['./category-master.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class CategoryMasterComponent implements OnInit {
    msg: any;
    categoryName: any = "";
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Add);

    @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

    allColumns = [
        { heading: "Surgery Category", key: "surgeryCategoryName", sort: true, align: 'left', emptySign: 'NA' },
        { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
        {
            heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
                {
                    action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Edit), callback: (data: any) => {
                        this.onSave(data);
                    }
                }, {
                    action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.SetupOtManagment, permissionType.Delete), callback: (data: any) => {
                        this._CategoryMasterService.deactivateTheStatus(data.surgeryCategoryId).subscribe((response: any) => {
                            this.grid.bindGridData();
                        });
                    }
                }]
        } //Action 1-view, 2-Edit,3-delete
    ]

    allFilters = [
        { fieldName: "categoryName", fieldValue: "", opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]

    gridConfig: gridModel = {
        permissionCode: permissionCodes.SetupOtManagment,
        apiUrl: "SurgeryCategoryMaster/List",
        columnsList: this.allColumns,
        sortField: "SurgeryCategoryId",
        sortOrder: 0,
        filters: this.allFilters
    }
    constructor(
        public _CategoryMasterService: CategoryMasterService,
        public permissionService: PagePermissionService,
        public toastr: ToastrService, public _matDialog: MatDialog
    ) { }

    ngOnInit(): void { }

    onSave(row: any = null) {
        const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
        buttonElement.blur(); // Remove focus from the button

        const that = this;
        const dialogRef = this._matDialog.open(NewCategoryMasterComponent,
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
