import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { FoodcategoryMasterService } from './foodcategory-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewFoodcategoryMasterComponent } from './new-foodcategory-master/new-foodcategory-master.component';

@Component({
  selector: 'app-foodcategory-master',
  templateUrl: './foodcategory-master.component.html',
  styleUrls: ['./foodcategory-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FoodcategoryMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.FoodCategoryMaster, permissionType.Add);

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _foodCategoryMasterService: FoodcategoryMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Food Category Name", key: "foodCategoryName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Food Category Code", key: "foodCategoryCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "isActive", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.FoodCategoryMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.FoodCategoryMaster, permissionType.Delete), callback: (data: any) => {
            console.log(data)
            this._foodCategoryMasterService.deactivateTheStatus(data.foodCategoryId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    }
  ]

  allFilters = [
    { fieldName: "foodCategoryName", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.FoodCategoryMaster,
    apiUrl: "FoodCategoryMaster/List",
    columnsList: this.allColumns,
    sortField: "foodCategoryId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewFoodcategoryMasterComponent,
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
    console.log(row)
  }
}
