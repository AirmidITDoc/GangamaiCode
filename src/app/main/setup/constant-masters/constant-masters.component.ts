import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { ConstantMastersService } from './constant-masters.service';
import { NewconstantMasterComponent } from './newconstant-master/newconstant-master.component';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-constant-masters',
  templateUrl: './constant-masters.component.html',
  styleUrls: ['./constant-masters.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class ConstantMastersComponent {
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  searchForm: FormGroup;
  constantTypeList: any[] = [];
  type = ''
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.ConstantMaster, permissionType.Add);
  isActiveFilter: string = '2';

  allColumns = [
    { heading: "Name", key: "name", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Value", key: "value", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Constant Type", key: "constantType", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.ConstantMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.ConstantMaster, permissionType.Delete), callback: (data: any) => {
            this._ConstantService.deactivateTheStatus(data.constantId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    }
  ]
  allFilters = [
    { fieldName: "ConstantType", fieldValue: '', opType: OperatorComparer.StartsWith },
    { fieldName: "IsActive", fieldValue: this.isActiveFilter, opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.ConstantMaster,
    apiUrl: "Constants/ConstantsList",
    columnsList: this.allColumns,
    sortField: "ConstantId",
    sortOrder: 0,
    filters: this.allFilters
  }

  constructor(
    public _ConstantService: ConstantMastersService, private _formBuilder: UntypedFormBuilder,
    public toastr: ToastrService, public _matDialog: MatDialog, public permissionService: PagePermissionService
  ) { }

  ngOnInit(): void {
    this.searchForm = this.createSearchFrom();

    this._ConstantService.getconstantType().subscribe({
      next: (res) => {
        this.constantTypeList = res;
      },
      error: (err) => {
        console.error('Failed to load constant types', err);
      }
    });
  }

  getfilterdata() {
    const isActive = this.searchForm.get('isActive')?.value ?? '2';

    this.gridConfig = {
      apiUrl: "Constants/ConstantsList",
      columnsList: this.allColumns,
      sortField: "ConstantId",
      sortOrder: 0,
      filters: [
        { fieldName: "ConstantType", fieldValue: String(this.type), opType: OperatorComparer.StartsWith },
        { fieldName: "IsActive", fieldValue:  String(isActive), opType: OperatorComparer.Equals }
      ]
    }
    console.log(this.gridConfig)
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  clearType(): void {
    this.type = '';
    this.searchForm.get('constantType')?.setValue('');

    this.getfilterdata();
  }

  createSearchFrom() {
    return this._formBuilder.group({
      constantType: '',
      isActive: '2'
    });
  }

  onStatusChange(value: string) {
  this.isActiveFilter = value;
  this.getfilterdata();        // rebuilds the filters and reloads the grid
}

  selectChange(event: MatSelectChange): void {
    this.type = event.value;
    console.log('Selected type:', this.type);

    this.getfilterdata();
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const dialogRef = this._matDialog.open(NewconstantMasterComponent,
      {
        maxWidth: "90vw",
        maxHeight: '85%',
        width: '50%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
        this.grid.bindGridData();
    });
  }
}
