import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { FoodItemmasterService } from './food-itemmaster.service';
import { NewFooditemMasterComponent } from './new-fooditem-master/new-fooditem-master.component';


@Component({
  selector: 'app-food-itemmaster',
  templateUrl: './food-itemmaster.component.html',
  styleUrls: ['./food-itemmaster.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class FoodItemmasterComponent {

  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.FoodItemMaster, permissionType.Add);
  foodName: any = "";

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _fooditemMasterService: FoodItemmasterService
  ) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isVegetarian')!.template = this.actionsTemplate;
  }

  allColumns = [
    { heading: "Food Code", key: "foodCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Food Name", key: "foodName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Local Name", key: "localName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Food Category", key: "foodCategoryId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Unit", key: "unit", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Vegeterian", key: "isVegetarian", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "IsVegeterian", key: "isVegetarian", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 150,
      template: this.actionsTemplate
    },
    { heading: "Active", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.FoodItemMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.FoodItemMaster, permissionType.Delete),
          callback: (data: any) => {
            if (data?.active === true) {
              this._fooditemMasterService.deactivateTheStatus(data.foodItemId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "foodName", fieldValue: this.foodName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.FoodItemMaster,
    apiUrl: "FoodItemMaster/List",
    columnsList: this.allColumns,
    sortField: "FoodItemId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewFooditemMasterComponent,
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
