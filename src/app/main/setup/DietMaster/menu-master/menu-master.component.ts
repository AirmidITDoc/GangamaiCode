import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fuseAnimations } from '@fuse/animations';
import { gridActions, gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { ToastrService } from 'ngx-toastr';
import { MenuMasterService } from './menu-master.service';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { NewMenuMasterComponent } from './new-menu-master/new-menu-master.component';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-menu-master',
  templateUrl: './menu-master.component.html',
  styleUrls: ['./menu-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class MenuMasterComponent {
  // IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Add);
  DietMenuId: any = "";

  DietMenuName = "%"
  DietName = "0"
  MealName = "0"
  autocompleteModeDietType: string = 'MDietTypeMaster'
  autocompleteModeMealType: string = 'MMealTypeMaster'

  myFilterform: FormGroup;
  Fromdate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  Todate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;
  gridConfig1: gridModel = new gridModel();
  @ViewChild('dietMenuDetails') dietMenuDetails!: TemplateRef<any>;

  isShowDetailTable: boolean = false;
  visibleCount = 2;
  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'dietMenuDetails')!.template = this.dietMenuDetails;
  }

  constructor(
    public permissionService: PagePermissionService, private cdr: ChangeDetectorRef,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _menuMasterService: MenuMasterService, public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._menuMasterService.filterForm();
  }

  allColumns = [
    { heading: "Diet Menu Code", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Meal Type", key: "mealName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Diet Type", key: "dietName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Texture", key: "texture", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Calories", key: "calories", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Proteins", key: "protein", sort: true, align: 'left', emptySign: 'NA' },
    {
      heading: "Menu Details", key: "dietMenuDetails", sort: true, align: "left", width: 550, type: gridColumnTypes.template,
      template: this.dietMenuDetails
    },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }
        // , {
        //   action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Delete), callback: (data: any) => {
        //     this._menuMasterService.deactivateTheStatus(data.dietMenuId).subscribe((response: any) => {
        //       this.grid.bindGridData();
        //     });
        //   }
        // }
      ]
    }
  ]

  allFilters = [
    { fieldName: "DietMenuName", fieldValue: this.DietMenuName, opType: OperatorComparer.StartsWith },
    { fieldName: "MealName", fieldValue: this.MealName, opType: OperatorComparer.StartsWith },
    { fieldName: "DietName", fieldValue: this.DietName, opType: OperatorComparer.StartsWith }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.DietMenuMaster,
    apiUrl: "DietMenuMaster/DietmenumasterList",
    columnsList: this.allColumns,
    sortField: "DietMenuid",
    sortOrder: 0,
    filters: this.allFilters
  }

  MealTypeView(value) {
    if (value.value !== 0)
      this.MealName = value.value
    else
      this.MealName = "0"

    this.onChangeFirst();
  }

  DietTypeView(value) {
    if (value.value !== 0)
      this.DietName = value.value
    else
      this.DietName = "0"

    this.onChangeFirst();
  }

  // chip design
  getDetailArray(data: string): string[] {
    if (!data) {
      return [];
    }
    return data.split('|')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  getDetailNames(data: string): string {
    const parts = data.split('~');
    const foodName = parts[0]?.trim() ?? '';
    const quantity = parts[1]?.trim() ?? '';
    const unit = parts[2]?.trim() ?? '';
    return `${foodName} - ${quantity} ${unit}`.trim();
  }

  expandedRows = new Set<any>();

  isExpanded(element: any): boolean {
    return this.expandedRows.has(element);
  }

  expandRow(element: any): void {
    this.expandedRows.add(element);
  }

  // dropdown way
  // expandedRow: any = null;

  // toggleRow(element: any): void {
  //   this.expandedRow = this.expandedRow === element ? null : element;
  // }

  Clearfilter(event) {
    if (event == 'DietMenuName')
      this.myFilterform.get('DietMenuName').setValue("")

    this.onChangeFirst();
  }

  onChangeFirst() {
    this.DietMenuName = this.myFilterform.get('DietMenuName').value + "%"
    this.MealName = this.myFilterform.get('MealName').value || "0"
    this.DietName = this.myFilterform.get('DietName').value || "0"

    this.getfilterdata();
  }


  getfilterdata() {
    this.gridConfig = {
      apiUrl: "DietMenuMaster/DietmenumasterList",
      columnsList: this.allColumns,
      sortField: "DietMenuid",
      sortOrder: 0,
      filters: [
        { fieldName: "DietMenuName", fieldValue: this.DietMenuName, opType: OperatorComparer.StartsWith },
        { fieldName: "MealName", fieldValue: this.MealName, opType: OperatorComparer.StartsWith },
        { fieldName: "DietName", fieldValue: this.DietName, opType: OperatorComparer.StartsWith }
      ],
      row: 25
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  GetDetails1(data: any): void {

    console.log("detailList:", data)
    const dietMenuID = data.dietMenuId;
    debugger
    this.gridConfig1 = {
      apiUrl: "DietMenuMaster/DietmenumasterDetailsList",
      columnsList: [
        { heading: "Diet Menu Code", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Food Name", key: "foodName", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Name", key: "name", sort: true, align: 'left', emptySign: 'NA' },
        // { heading: "Quantity", key: "quantity", sort: true, align: 'left', emptySign: 'NA' },
      ],
      sortField: "DietMenuid",
      sortOrder: 0,
      filters: [
        { fieldName: "DietMenuId", fieldValue: "10008", opType: OperatorComparer.Contains },
      ],
      row: 25
    };
    this.isShowDetailTable = true;
    this.cdr.detectChanges();
    // setTimeout(() => {
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
    // }, 500);
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewMenuMasterComponent,
      {
        maxWidth: "85vw",
        maxHeight: '100%',
        width: '90%',
        // maxWidth: "95vw",
        height: '90%',
        // width: '90%',
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
