import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from "ngx-toastr";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { SpecContainerMasterService } from "./spec-container-master.service";
import { NewSpecContainerMasterComponent } from "./new-spec-container-master/new-spec-container-master.component";

@Component({
  selector: 'app-spec-container-master',
  templateUrl: './spec-container-master.component.html',
  styleUrls: ['./spec-container-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class SpecContainerMasterComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  unitName: any = "";
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Add);

  allcolumns = [

    { heading: "Specimen Container Type", key: "containerType", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.SpecimenMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._specimenService.deactivateTheStatus(data.specimenContainerId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]

  allfilters = [
    { fieldName: "ContainerType", fieldValue: "", opType: OperatorComparer.StartsWith },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    permissionCode: permissionCodes.SpecimenMaster,
    apiUrl: "PathSpecimenContainerMaster/List",
    columnsList: this.allcolumns,
    sortField: "specimenContainerId",
    sortOrder: 0,
    filters: this.allfilters
  }

  constructor(
    public _specimenService: SpecContainerMasterService, public permissionService: PagePermissionService,
    public toastr: ToastrService,
    public _matDialog: MatDialog,
  ) { }

  ngOnInit(): void {

  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewSpecContainerMasterComponent,
      {
        maxWidth: "45vw",
        maxHeight: '35%',
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
