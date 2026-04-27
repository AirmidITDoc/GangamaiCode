import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { EmployeeDesignationService } from "./employee-designation.service";
import { NewEmployeeDesignationComponent } from "./new-employee-designation/new-employee-designation.component";

@Component({
  selector: 'app-employee-designation',
  templateUrl: './employee-designation.component.html',
  styleUrls: ['./employee-designation.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmployeeDesignationComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.EmployeeDepartment, permissionType.Add);

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  gridConfig: gridModel = {
    permissionCode: permissionCodes.EmployeeDepartment,
    apiUrl: "EmployeeDesignationMaster/List",
    columnsList: [
      { heading: "Employee Department", key: "empDesignationName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
      {
        heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
          {
            action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DoctorTypeMaster, permissionType.Edit), callback: (data: any) => {
              this.onSave(data);
            }
          }, {
            action: gridActions.delete, callback: (data: any) => {
              this._EmpDesignationService.deactivateTheStatus(data.empDesignationId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }]
      }
    ],
    sortField: "EmpDesignationId",
    sortOrder: 0,
    filters: [
      { fieldName: "EmpDesignationName", fieldValue: "", opType: OperatorComparer.StartsWith },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
  }

  constructor(public _EmpDesignationService: EmployeeDesignationService, public _matDialog: MatDialog,
    public toastr: ToastrService, public permissionService: PagePermissionService) { }

  ngOnInit(): void {

  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewEmployeeDesignationComponent,
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
