import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { FoodpreferenceMasterService } from './foodpreference-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewFoodpreferenceMasterComponent } from './new-foodpreference-master/new-foodpreference-master.component';

@Component({
  selector: 'app-foodpreference-master',
  templateUrl: './foodpreference-master.component.html',
  styleUrls: ['./foodpreference-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FoodpreferenceMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.FoodPreferenceMaster, permissionType.Add);
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _foodPrefMasterService: FoodpreferenceMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Food Preference Name", key: "foodPreferenceName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Food Preference Code", key: "foodPreferenceCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Active", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.FoodPreferenceMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.FoodPreferenceMaster, permissionType.Delete), callback: (data: any) => {
            this._foodPrefMasterService.deactivateTheStatus(data.foodPreferenceId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "restrictionName", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.FoodPreferenceMaster,
    apiUrl: "FoodPreference/List",
    columnsList: this.allColumns,
    sortField: "foodPreferenceId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewFoodpreferenceMasterComponent,
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
    console.log("New/Edit Form Row", row)
  }
}
