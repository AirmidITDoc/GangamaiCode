import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { DietrestrictionMasterService } from './dietrestriction-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { NewDietrestrictionMasterComponent } from './new-dietrestriction-master/new-dietrestriction-master.component';

@Component({
  selector: 'app-dietrestriction-master',
  templateUrl: './dietrestriction-master.component.html',
  styleUrls: ['./dietrestriction-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DietrestrictionMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DietRestrictionMaster, permissionType.Add);
  restrictionName: any = "";

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _dietResMasterService: DietrestrictionMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Restriction Code", key: "restrictionCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Restriction Name", key: "restrictionName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Restriction Type", key: "restrictionTypeId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 500 },
    { heading: "Active", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DietRestrictionMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.DietRestrictionMaster, permissionType.Delete),
          callback: (data: any) => {
            if (data?.active === true) {
              this._dietResMasterService.deactivateTheStatus(data.restrictionId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "restrictionName", fieldValue: this.restrictionName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.DietRestrictionMaster,
    apiUrl: "DietRestriction/List",
    columnsList: this.allColumns,
    sortField: "restrictionId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewDietrestrictionMasterComponent,
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
