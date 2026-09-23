import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MrdService } from '../mrd.service';
import { NewMrdTemplateComponent } from './new-mrd-template/new-mrd-template.component';

@Component({
  selector: 'app-mrd-template',
  templateUrl: './mrd-template.component.html',
  styleUrls: ['./mrd-template.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class MrdTemplateComponent {

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  TemplateName: any = "";
  searchFormGroup: FormGroup;

  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.MRDTemplate, permissionType.Add);

  allColumn = [
    { heading: "TemplateCode", key: "templateId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TemplateName", key: "templateName", width: 200, sort: true, align: 'left', emptySign: 'NA' },
    { heading: "TemplateDesc", key: "templateDesc", width: 300, sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.MRDTemplate, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        },
        {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.MRDTemplate, permissionType.Delete), callback: (data: any) => {
            this._mrdService.deactivateTheStatus(data.templateId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    }
  ]

  allFilters = [
    { fieldName: "TemplateName", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.MRDTemplate,
    apiUrl: "MRDTemplate/List",
    columnsList: this.allColumn,
    sortField: "templateId",
    sortOrder: 0,
    filters: this.allFilters
  }

  Clearfilter(event) {
    console.log(event)
    if (event == 'TemplateNameSearch')
      this.searchFormGroup.get('TemplateNameSearch').setValue("")

    this.onChangeFirst();
  }

  onChangeFirst() {
    this.TemplateName = this.searchFormGroup.get('TemplateNameSearch').value //+ "%"
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "MRDTemplate/List",
      columnsList: this.allColumn,
      sortField: "",
      sortOrder: 0,
      filters: [
        { fieldName: "TemplateName", fieldValue: this.TemplateName , opType: OperatorComparer.Contains }
      ]
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  constructor(
    public _mrdService: MrdService,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public permissionService: PagePermissionService
  ) { }

  ngOnInit(): void {
    this.searchFormGroup = this._mrdService.createSearchForm();
  }

  onSave(row: any = null) {

    const that = this;
    const dialogRef = this._matDialog.open(NewMrdTemplateComponent,
      {
        maxWidth: "95vw",
        maxHeight: '95vh',
        width: '95%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        that.grid.bindGridData();
      }
    });
  }
}
