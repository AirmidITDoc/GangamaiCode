import { Component, OnInit, ViewChild, ViewEncapsulation } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { fuseAnimations } from "@fuse/animations";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from "app/main/shared/model/permission.model";
import { PagePermissionService } from "app/main/shared/services/page-permission.service";
import { ToastrService } from "ngx-toastr";
import { NewEmployeeDepartmentComponent } from "./new-employee-department/new-employee-department.component";
import { EmployeeDepartmentService } from "./employee-department.service";

@Component({
  selector: 'app-employee-department',
  templateUrl: './employee-department.component.html',
  styleUrls: ['./employee-department.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class EmployeeDepartmentComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.EmployeeDepartment, permissionType.Add);

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  gridConfig: gridModel = {
    permissionCode: permissionCodes.EmployeeDepartment,
    apiUrl: "EmployeeDepartmentMaster/List",
    columnsList: [
      { heading: "Employee Department", key: "empDepartmentName", sort: true, align: 'left', emptySign: 'NA' },
      { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
      {
        heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
          {
            action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DoctorTypeMaster, permissionType.Edit), callback: (data: any) => {
              this.onSave(data);
            }
          }, {
            action: gridActions.delete, callback: (data: any) => {
              this._EmpDepartmentService.deactivateTheStatus(data.empDepartmentId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }]
      }
    ],
    sortField: "EmpDepartmentId",
    sortOrder: 0,
    filters: [
      { fieldName: "EmpDepartmentName", fieldValue: "", opType: OperatorComparer.StartsWith },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
    ]
  }

  constructor(public _EmpDepartmentService: EmployeeDepartmentService, public _matDialog: MatDialog,
    public toastr: ToastrService, public permissionService: PagePermissionService) { }

  ngOnInit(): void {

  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewEmployeeDepartmentComponent,
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
