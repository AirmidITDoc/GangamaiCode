import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { VaccineEntryService } from './vaccine-entry.service';
import { NewvaccineEntryComponent } from './newvaccine-entry/newvaccine-entry.component';

@Component({
  selector: 'app-vaccine-entry',
  templateUrl: './vaccine-entry.component.html',
  styleUrls: ['./vaccine-entry.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class VaccineEntryComponent {
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.VaccineEntry, permissionType.Add);
  allergyName: any = "";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('RequestColorCode1') RequestColorCode1!: TemplateRef<any>;
  @ViewChild('RequestColorCode2') RequestColorCode2!: TemplateRef<any>;
  @ViewChild('RequestColorCode3') RequestColorCode3!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'boosterRequired')!.template = this.RequestColorCode1;
    this.gridConfig.columnsList.find(col => col.key === 'diluentRequired')!.template = this.RequestColorCode2;
    this.gridConfig.columnsList.find(col => col.key === 'vaccineStatus')!.template = this.RequestColorCode3;
  }

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _vaccineEntryService: VaccineEntryService) { }

  ngOnInit(): void { }

  allColumns = [
    { heading: "Vaccine Code", key: "vaccineCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Vaccine Name", key: "vaccineName", sort: true, align: 'left', emptySign: 'NA',width: 200 },
    { heading: "Vaccine Type", key: "vaccineType", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Brand Name", key: "brandName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Batch Number", key: "batchNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Manufacturer", key: "manufName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Generic Name", key: "itemGenericName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Route", key: "routeName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Dose", key: "dose", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Age Group", key: "ageGroup", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "No of Doses", key: "noofDoses", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Dose Schedule", key: "doseSchedule", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Minimum Age", key: "minimumAge", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Maximum Age", key: "maximumAge", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Vial Type", key: "vialType", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Vial Size", key: "vialSize", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Storage Temperature", key: "storageTemperature", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Shelf Life", key: "shelfLife", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Expiry Date", key: "expiryDate", sort: true, align: 'left', emptySign: 'NA', type:6 },
    { heading: "Disease Indication", key: "diseaseIndication", sort: true, align: 'left', emptySign: 'NA',width: 150 },
    {
      heading: "Booster Required", key: "boosterRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.RequestColorCode1
    },
    {
      heading: "Diluent Required", key: "diluentRequired", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.RequestColorCode2
    },
    {
      heading: "Vaccine Status", key: "vaccineStatus", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.template,
      template: this.RequestColorCode3
    },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.VaccineEntry, permissionType.Edit), callback: (data: any) => {
              this.onSave(data);
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilters = [
    { fieldName: "VaccineName", fieldValue: this.allergyName, opType: OperatorComparer.Contains }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.VaccineEntry,
    apiUrl: "VaccineInformation/List",
    columnsList: this.allColumns,
    sortField: "VaccineId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewvaccineEntryComponent,
      {
        // maxWidth: "80vw",
        // maxHeight: '80%',
        // width: '70%',
        width: '70%',
        maxWidth: '80vw',
        height: '80vh',
        maxHeight: '80vh',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      that.grid.bindGridData();
    });
    console.log(row)
  }
}
