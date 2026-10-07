import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { SubspecialityMasterService } from './subspeciality-master.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { NewSubspecialityMasterComponent } from './new-subspeciality-master/new-subspeciality-master.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-subspeciality-master',
  templateUrl: './subspeciality-master.component.html',
  styleUrls: ['./subspeciality-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SubspecialityMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SetupOTSubSpecality, permissionType.Add);

  subSpecialtyName: any ="";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _subspecalityMasterService: SubspecialityMasterService
  ) { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;


  allColumns = [
    { heading: "Sub-Specialty Name", key: "subSpecialtyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Specialty Name", key: "specialtyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SetupOTSubSpecality, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.SetupOTSubSpecality, permissionType.Delete), callback: (data: any) => {
            debugger
            this._subspecalityMasterService.deactivateTheStatus(data.subSpecialtyId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "SubSpecialtyName", fieldValue: this.subSpecialtyName, opType: OperatorComparer.Contains },
    { fieldName: "IsActive", fieldValue: "2", opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    permissionCode: permissionCodes.SetupOtManagment,
    apiUrl: "SubSpecialtyMaster/List",
    columnsList: this.allColumns,
    sortField: "SubSpecialtyId",
    sortOrder: 0,
    filters: this.allFilters
    // filters:[]
  }

  ngOnInit(): void { }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewSubspecialityMasterComponent,
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
