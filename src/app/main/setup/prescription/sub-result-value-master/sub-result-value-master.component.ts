import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { SubresultMasterService } from './subresult-master.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { NEWSubResultValueComponent } from './new-sub-result-value/new-sub-result-value.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-sub-result-value-master',
  templateUrl: './sub-result-value-master.component.html',
  styleUrls: ['./sub-result-value-master.component.scss'],
   encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations,
})
export class SubResultValueMasterComponent {
  // IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DepartmentMaster, permissionType.Add);

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  msg: any;
  departmentName: any = "";

  allcolumns = [
    { heading: "SubQuestion Value", key: "subQuestionValName", sort: true, align: 'left', emptySign: 'NA', width: 650 },
    // { heading: "Quesion Name", key: "subQuestionValName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Sequence No", key: "sequenceNo", sort: true, align: 'left', emptySign: 'NA' , width: 150},
    { heading: "Shortcut Values", key: "shortcutValues", sort: true, align: 'left', emptySign: 'NA' , width: 150},

    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {

          // action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DepartmentMaster, permissionType.Edit), callback: (data: any) => {
          //   this.onSave(data);
          // }
           action: gridActions.edit, callback: (data: any) => {
                            this.onSave(data) // EDIT Records
                        }
        }, {
          action: gridActions.delete, callback: (data: any) => {
            this._SubresultMasterService.deactivateTheStatus(data.subQuestionValId).subscribe((response: any) => {

              this.grid.bindGridData();
            });
          }
        }]
    }
  ]

  allfilters = [
    { fieldName: "SubQuestionValName", fieldValue: "", opType: OperatorComparer.StartsWith },
   
  ]
  gridConfig: gridModel = {
    // permissionCode: permissionCodes.DepartmentMaster,
    apiUrl: "SubQuestionValuesMaster/List",
    columnsList: this.allcolumns,
    sortField: "SubQuestionValId",
    sortOrder: 0,
    filters: this.allfilters
  }

  constructor(
    public _SubresultMasterService: SubresultMasterService,
    public _matDialog: MatDialog, public permissionService: PagePermissionService,
    public toastr: ToastrService,) { }

  ngOnInit(): void { }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NEWSubResultValueComponent,
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