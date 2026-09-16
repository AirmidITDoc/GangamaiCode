import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { NewSpecalityMasterComponent } from './new-specality-master/new-specality-master.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { SpecalitymasterService } from './specalitymaster.service';

@Component({
  selector: 'app-specalitymaster',
  templateUrl: './specalitymaster.component.html',
  styleUrls: ['./specalitymaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SpecalitymasterComponent {
  msg: any;
  specialtyName: any = "";
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SetupOTSpecality, permissionType.Add);

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _specalityMasterService: SpecalitymasterService
  ) { }

  ngOnInit(): void {}

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Specality Name", key: "specialtyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SetupOTSpecality, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.SetupOTSpecality, permissionType.Delete), callback: (data: any) => {
            console.log(data)
            this._specalityMasterService.deactivateTheStatus(data.specialtyId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "specialtyName", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.SetupOTSpecality,
    apiUrl: "SpecialtyMaster/List",
    columnsList: this.allColumns,
    sortField: "SpecialtyId",
    sortOrder: 0,
    filters: this.allFilters
  }


  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewSpecalityMasterComponent,
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
