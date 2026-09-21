import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { AllergyMasterService } from './allergy-master.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewAllergyMasterComponent } from './new-allergy-master/new-allergy-master.component';

@Component({
  selector: 'app-allergy-master',
  templateUrl: './allergy-master.component.html',
  styleUrls: ['./allergy-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class AllergyMasterComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.AllergyMaster, permissionType.Add);
  allergyName: any = "";
  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _allergyMasterService: AllergyMasterService) { }

  ngOnInit(): void { }

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'isKitchenAlert')!.template = this.actionsTemplate;
  }

  allColumns = [
    {
      heading: "IsKitchenAlert", key: "isKitchenAlert", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template, width: 100,
      template: this.actionsTemplate
    },
    { heading: "Allergy Name", key: "allergyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Allergy Code", key: "allergyCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Category", key: "categoryId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Severity", key: "severityId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Reaction", key: "reaction", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Active", key: "active", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.AllergyMaster, permissionType.Edit), callback: (data: any) => {
            if (data?.active === true) {
              this.onSave(data);
            }
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.AllergyMaster, permissionType.Delete),
          callback: (data: any) => {
            if (data?.active === true) {
              this._allergyMasterService.deactivateTheStatus(data.allergyId).subscribe((response: any) => {
                this.grid.bindGridData();
              });
            }
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]
  allFilters = [
    { fieldName: "allergyName", fieldValue: this.allergyName, opType: OperatorComparer.StartsWith },
    { fieldName: "active", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.AllergyMaster,
    apiUrl: "Allergy/List",
    columnsList: this.allColumns,
    sortField: "allergyId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewAllergyMasterComponent,
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
