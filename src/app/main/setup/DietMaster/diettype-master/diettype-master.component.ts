import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { DiettypeMasterService } from './diettype-master.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatDialog } from '@angular/material/dialog';
import { NewDiettypeMasterComponent } from './new-diettype-master/new-diettype-master.component';

@Component({
  selector: 'app-diettype-master',
  templateUrl: './diettype-master.component.html',
  styleUrls: ['./diettype-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DiettypeMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DietTypeMaster, permissionType.Add);
  dietName: any = "";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _diettypeMasterService: DiettypeMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Diet Name", key: "dietName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Diet Code", key: "dietCode", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Short Name", key: "shortName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 350 },
    { heading: "Diet Category", key: "dietCategoryId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Default Calories", key: "defaultCalories", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Default Proteins", key: "defaultProtein", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Default Fluids", key: "defaultFluid", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Display Order", key: "displayOrder", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Remarks", key: "remarks", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "isActive", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DietTypeMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.DietTypeMaster, permissionType.Delete),
          callback: (data: any) => {
            if (data?.active === true) {
              this._diettypeMasterService.deactivateTheStatus(data.dietTypeId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "dietName", fieldValue: this.dietName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.DietTypeMaster,
    apiUrl: "DietTypeMaster/List",
    columnsList: this.allColumns,
    sortField: "dietTypeId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewDiettypeMasterComponent,
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
