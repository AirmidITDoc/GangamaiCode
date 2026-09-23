import { Component, ViewChild, ViewEncapsulation } from '@angular/core';
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
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Add);
  DietMenuId: any = "";

  myFilterform: FormGroup;
  Fromdate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  Todate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(
    public permissionService: PagePermissionService,
    public toastr: ToastrService, public _matDialog: MatDialog,
    public _menuMasterService: MenuMasterService, public datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.myFilterform = this._menuMasterService.filterForm();
  }
  onChangeStartDate(value) {
    this.gridConfig.filters[0].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
  }
  onChangeEndDate(value) {
    this.gridConfig.filters[1].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
  }

  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('grid') grid: AirmidTableComponent;
  @ViewChild('grid1') grid1: AirmidTableComponent;

  allColumns = [
    { heading: "Diet Menu Code", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Meal Type", key: "mealTypeId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Diet Type", key: "dietTypeId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Texture", key: "texture", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Calories", key: "calories", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Protein", key: "protein", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "meal Type Code", key: "mealTypeCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Meal Name", key: "mealName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "dietCode", key: "dietCode", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "dietName", key: "dietName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "createdDate", key: "createdDate", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Food Item", key: "foodItemId", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Qantity", key: "quantity", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Unit", key: "unitId", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "Sequence No", key: "sequenceNo", sort: true, align: 'left', emptySign: 'NA' },
    // { heading: "isActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Edit), callback: (data: any) => {
            this.onSave(data);
          }
        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.DietMenuMaster, permissionType.Delete), callback: (data: any) => {
            this._menuMasterService.deactivateTheStatus(data.specialtyId).subscribe((response: any) => {
              this.grid.bindGridData();
            });
          }
        }]
    } //Action 1-view, 2-Edit,3-delete
  ]

  allFilters = [
    // { fieldName: "DietMenuId", fieldValue: this.DietMenuId, opType: OperatorComparer.Contains },
    { fieldName: "Fromdate", fieldValue: this.Fromdate, opType: OperatorComparer.Contains },
    { fieldName: "Todate", fieldValue: this.Todate, opType: OperatorComparer.Contains },
    // { fieldName: "isActive", fieldValue: "", opType: OperatorComparer.Equals }
  ]

  gridConfig: gridModel = {
    permissionCode: permissionCodes.DietMenuMaster,
    apiUrl: "DietMenuMaster/DietmenumasterList",
    columnsList: this.allColumns,
    sortField: "DietMenuid",
    sortOrder: 0,
    filters: this.allFilters
  }

  onChangeFirst() {
    this.Fromdate = this.datePipe.transform(this.myFilterform.get('Fromdate').value, "yyyy-MM-dd")
    this.Todate = this.datePipe.transform(this.myFilterform.get('Todate').value, "yyyy-MM-dd")
    this.getfilterdata();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "DietMenuMaster/DietmenumasterList",
      columnsList: this.allColumns,
      sortField: "DietMenuid",
      sortOrder: 0,
      filters: [
        { fieldName: "Fromdate", fieldValue: this.Fromdate, opType: OperatorComparer.Contains },
        { fieldName: "Todate", fieldValue: this.Todate, opType: OperatorComparer.Contains }
      ],
      row: 25
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }

  GetDetails1(data: any): void {

    // console.log("detailList:", data)
    // const ipMedID = data.medicalRecoredId;

    // this.gridConfig = {
    //   apiUrl: "DietMenuMaster/DietmenumasterDetailsList",
    //   columnsList: [
    //     { heading: "Diet Menu Code", key: "dietMenuCode", sort: true, align: 'left', emptySign: 'NA'},
    //     { heading: "Diet Menu Name", key: "dietMenuName", sort: true, align: 'left', emptySign: 'NA' },
    //     { heading: "Food Name", key: "foodName", sort: true, align: 'left', emptySign: 'NA' },
    //     { heading: "Name", key: "name", sort: true, align: 'left', emptySign: 'NA' },
    //     { heading: "Quantity", key: "quantity", sort: true, align: 'left', emptySign: 'NA' },
    //   ],
    //   sortField: "ipMedID",
    //   sortOrder: 0,
    //   filters: [
    //     { fieldName: "ipMedID", fieldValue: String(ipMedID), opType: OperatorComparer.Equals },
    //   ]
    // };
    // this.isShowDetailTable = true;
    // setTimeout(() => {
    //   this.grid1.gridConfig = this.gridConfig1;
    //   this.grid1.bindGridData();
    // }, 500);
  }

  onSave(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    const dialogRef = this._matDialog.open(NewMenuMasterComponent,
      {
        maxWidth: "90vw",
        maxHeight: '90%',
        width: '90%',
        // maxWidth: "95vw",
        height: '95%',
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
