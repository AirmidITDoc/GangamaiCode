import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { NewDietcategoryMasterComponent } from './new-dietcategory-master/new-dietcategory-master.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { DietcategoryMasterService } from './dietcategory-master.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-dietcategory-master',
  templateUrl: './dietcategory-master.component.html',
  styleUrls: ['./dietcategory-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DietcategoryMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DietCategoryMaster, permissionType.Add);
  categoryName: any = "";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _dietCategoryMasterService: DietcategoryMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  allColumns = [
    { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA',width:100 },
    { heading: "Category Code", key: "categoryCode", sort: true, align: 'left', emptySign: 'NA', width:80 },
    { heading: "Description", key: "description", sort: true, align: 'left', emptySign: 'NA' , width:500},
    { heading: "Active", key: "isActive", type: gridColumnTypes.status, align: "center", width:80 },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DietCategoryMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.isActive === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.DietCategoryMaster, permissionType.Delete),
          callback: (data: any) => {
            console.log(data)
            if (data?.isActive === true) {
              this._dietCategoryMasterService.deactivateTheStatus(data.dietCategoryId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "categoryName", fieldValue: this.categoryName, opType: OperatorComparer.StartsWith },
    { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.DietCategoryMaster,
    apiUrl: "DietCategoryMaster/List",
    columnsList: this.allColumns,
    sortField: "dietCategoryId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewDietcategoryMasterComponent,
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
