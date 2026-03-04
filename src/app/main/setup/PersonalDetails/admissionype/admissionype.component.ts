import { Component, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NewAdmissiontypeComponent } from './new-admissiontype/new-admissiontype.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { MatDialog } from '@angular/material/dialog';
import { AdmissiontypeService } from './admissiontype.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { OperatorComparer, gridModel } from 'app/core/models/gridRequest';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';

@Component({
  selector: 'app-admissionype',
  templateUrl: './admissionype.component.html',
  styleUrls: ['./admissionype.component.scss']
})
export class AdmissionypeComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  admissiontypeName: any = "";
//   IsAdd: boolean = this.permissionService.getPermission(permissionCodes.AreaMaster, permissionType.Add);

  allcolumns = [
      { heading: "Admissiontype Name", key: "admissiontypeName", sort: true, align: 'left', emptySign: 'NA' },
     { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    //   {
    //       heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
    //           {
    //               action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.AdmissionType, permissionType.Edit), callback: (data: any) => {
    //                   this.onSave(data);
    //               }
    //           },
    //           {
    //               action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.AdmissionType, permissionType.Delete), callback: (data: any) => {
    //                   this._AdmissiontypeService.deactivateTheStatus(data.areaId).subscribe((response: any) => {
    //                       this.grid.bindGridData();
    //                   });
    //               }
    //           }
    //         ]
    //   }
  ]
  allfilters = [
      { fieldName: "AdmissiontypeName", fieldValue: this.admissiontypeName, opType: OperatorComparer.StartsWith },
      { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]
  gridConfig: gridModel = {
    //   permissionCode: permissionCodes.AreaMaster,
      apiUrl: "AdmissionType/List",
      columnsList: this.allcolumns,
      sortField: "AdmissiontypeId",
      sortOrder: 0,
      filters: this.allfilters
  }

  constructor(
      public _AdmissiontypeService: AdmissiontypeService, public permissionService: PagePermissionService,
      public toastr: ToastrService, public _matDialog: MatDialog
  ) { }

  ngOnInit(): void { }


  onSave(row: any = null) {
      const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
      buttonElement.blur(); // Remove focus from the button

      let that = this;
      const dialogRef = this._matDialog.open(NewAdmissiontypeComponent,
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
