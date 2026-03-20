import { DatePipe, Time } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { ToastrService } from 'ngx-toastr';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { CompanyEmployMasterService } from './company-employ-master.service';
import { NewcompanyEmployComponent } from './newcompany-employ/newcompany-employ.component';

@Component({
  selector: 'app-company-employ-master',
  templateUrl: './company-employ-master.component.html',
  styleUrls: ['./company-employ-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class CompanyEmployMasterComponent {
  myFilterform: FormGroup;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  mobileno: any = "%"
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  constructor(
    public _companyEmpService: CompanyEmployMasterService, public permissionService: PagePermissionService,
    public _matDialog: MatDialog,
    private commonService: PrintserviceService,
    public toastr: ToastrService, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.myFilterform = this._companyEmpService.filterForm();
  }
  onChangeStartDate(value) {
    this.gridConfig.filters[3].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
  }
  onChangeEndDate(value) {
    this.gridConfig.filters[4].fieldValue = this.datePipe.transform(value, "yyyy-MM-dd")
  }

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  allcolumns = [
    { heading: "First Name", key: "firstName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    { heading: "Last Name", key: "lastName", sort: true, align: 'left', emptySign: 'NA', width: 180 },
    // { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "EmailId", key: "emailId", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Adddress", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Added By", key: "createdBy", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "IsActive", key: "isActive", type: gridColumnTypes.status, align: "center" },
    {
      heading: "Action", key: "action", align: "right", type: gridColumnTypes.action, actions: [
        {
          action: gridActions.edit, visible: this.permissionService.getPermission(permissionCodes.CompanyRepresentative, permissionType.Edit), callback: (data: any) => {
            this.onNew(data);
          }

        }, {
          action: gridActions.delete, visible: this.permissionService.getPermission(permissionCodes.CompanyRepresentative, permissionType.Delete), callback: (data: any) => {
            this._companyEmpService.deactivateTheStatus(data.executiveId).subscribe((response: any) => {
              this.grid.bindGridData;
            });
          }
        }]
    }
  ];
  IsAdd: boolean = this.permissionService.getPermission(permissionCodes.CompanyRepresentative, permissionType.Add);

  gridConfig: gridModel = {
    permissionCode: permissionCodes.CompanyRepresentative,
    apiUrl: "CompanyEmployeInfo/List",
    columnsList: this.allcolumns,
    sortField: "ExecutiveId",
    sortOrder: 0,
    filters: [
      { fieldName: "FirstName", fieldValue: "", opType: OperatorComparer.StartsWith },
      { fieldName: "LastName", fieldValue: "", opType: OperatorComparer.StartsWith },
      // { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains }
    ]
  }

  onNew(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button 
    const that = this;
    const dialogRef = this._matDialog.open(NewcompanyEmployComponent,
      {
        maxWidth: "90vw",
        maxHeight: '90%',
        width: '75%',
        data: row,
      });
    dialogRef.afterClosed().subscribe(result => {
      that.grid.bindGridData();
    });
  }
}

export class RegInsert {

  patientName: string;
  prefixId: number;
  firstName: string;
  middleName: string;
  lastName: string;
  address: string;
  city: string;
  genderId: any;
  mobileNo: string;
  cityId: number;
  companyId: any;
  emailId: any;

  /**
   * Constructor
   *
   * @param RegInsert
   */

  constructor(RegInsert) {
    {
      this.patientName = RegInsert.patientName;
      this.prefixId = RegInsert.prefixId || 0;
      this.firstName = RegInsert.firstName || '';
      this.middleName = RegInsert.middleName || '%';
      this.lastName = RegInsert.lastName || '';
      this.address = RegInsert.address || '';
      this.genderId = RegInsert.genderId || 0;
      this.mobileNo = RegInsert.mobileNo || '';
      this.cityId = RegInsert.cityId || 0;
      this.companyId = RegInsert.companyId || 0
      this.emailId = RegInsert.emailId || ''

    }
  }
}
