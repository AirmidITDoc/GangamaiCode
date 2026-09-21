import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { FeedingrouteMasterService } from './feedingroute-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewFeedingrouteMasterComponent } from './new-feedingroute-master/new-feedingroute-master.component';

@Component({
  selector: 'app-feedingroute-master',
  templateUrl: './feedingroute-master.component.html',
  styleUrls: ['./feedingroute-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FeedingrouteMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.FeedingRouteMaster, permissionType.Add);
  feedingRouteName: any = "";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _feedingRouteMasterService: FeedingrouteMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Feeding Route Name", key: "feedingRouteName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Feeding Route Code", key: "feedingRouteCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Diet Type", key: "dietTypesId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA', width: 500 },
    { heading: "Active", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.FeedingRouteMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.FeedingRouteMaster, permissionType.Delete),
          callback: (data: any) => {
            if (data?.active === true) {
              this._feedingRouteMasterService.deactivateTheStatus(data.feedingRouteId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "feedingRouteName", fieldValue: this.feedingRouteName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.FeedingRouteMaster,
    apiUrl: "FeedingRoute/List",
    columnsList: this.allColumns,
    sortField: "feedingRouteId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewFeedingrouteMasterComponent,
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
