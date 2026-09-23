import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MealtypeMasterService } from './mealtype-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewMealtypeMasterComponent } from './new-mealtype-master/new-mealtype-master.component';

@Component({
  selector: 'app-mealtype-master',
  templateUrl: './mealtype-master.component.html',
  styleUrls: ['./mealtype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MealtypeMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.MealTypeMaster, permissionType.Add);
  mealName: any = "";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _mealTypeMasterService: MealtypeMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Meal Type Code", key: "mealTypeCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Meal Name", key: "mealName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Meal Sequence", key: "mealSequence", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Default Time", key: "defaultTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
    { heading: "Order Cutoff Time", key: "orderCutoffTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
    { heading: "Preparation StartTime", key: "preparationStartTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
    { heading: "Dispatch Time", key: "dispatchTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
    { heading: "isActive", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.MealTypeMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.MealTypeMaster, permissionType.Delete), callback: (data: any) => {
            if (data?.active === true) {
              this._mealTypeMasterService.deactivateTheStatus(data.mealId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    }
  ]

  allFilters = [
    { fieldName: "mealName", fieldValue: this.mealName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.MealTypeMaster,
    apiUrl: "MealTypeMaster/List",
    columnsList: this.allColumns,
    sortField: "mealId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewMealtypeMasterComponent,
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
