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
import { FARegistrationService } from './fa-registration.service';
import { NewFARegistrationComponent } from './new-fa-registration/new-fa-registration.component';

@Component({
  selector: 'app-fa-registration',
  templateUrl: './fa-registration.component.html',
  styleUrls: ['./fa-registration.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class FARegistrationComponent {
  myFilterform: FormGroup;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  mobileno: any = "%"
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  photo: PageNames = PageNames.PATIENT_PHOTO;
  signature: PageNames = PageNames.PATIENT_SIGNATURE;

  constructor(
    public _FARegistrationService: FARegistrationService,
    public _matDialog: MatDialog,
    private commonService: PrintserviceService,
    public toastr: ToastrService, public datePipe: DatePipe) { }

  ngOnInit(): void {
    this.myFilterform = this._FARegistrationService.filterForm();
  }

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;

  allcolumns = [
    { heading: "Date", key: "regDate", sort: true, align: 'left', emptySign: 'NA', type: 6, width: 130 },
    { heading: "Time", key: "regTime", sort: true, align: 'left', emptySign: 'NA', type: 7 },
    { heading: "UHID", key: "regNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "Patient Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Age", key: "ageYear", sort: true, align: 'left', emptySign: 'NA', width: 50 },
    { heading: "Gender", key: "genderName", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Mobile No", key: "mobileNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Phone No", key: "phoneNo", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Adddress", key: "address", sort: true, align: 'left', emptySign: 'NA', width: 300 },
    { heading: "Annual Income", key: "annualIncome", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "EmgContactPerson Name", key: "emgContactPersonName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Emg MobileNo", key: "emgMobileNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Emg LandlineNo", key: "emgLandlineNo", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Emg Address", key: "engAddress", sort: true, align: 'left', emptySign: 'NA', width: 150 },
    { heading: "Added By", key: "createdBy", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Created Date", key: "createdDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 170 },
    { heading: "Updated By", key: "updatedBy", sort: true, align: 'left', emptySign: 'NA', },
    { heading: "Modify Date", key: "modifiedDate", sort: true, align: 'left', emptySign: 'NA', type: 8, width: 170 },
    {
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }

    // {
    //     heading: "Action", key: "action", align: "right", sticky: true, type: gridColumnTypes.action, actions: [
    //         {action: gridActions.edit, callback: (data: any) => {
    //                 this.onEdit(data);
    //                 this.grid.bindGridData();
    //             }},]
    // }
  ];

  gridConfig: gridModel = {
    apiUrl: "",
    columnsList: this.allcolumns,
    sortField: "RegId",
    sortOrder: 0,
    filters: [
      { fieldName: "F_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "L_Name", fieldValue: "%", opType: OperatorComparer.Contains },
      { fieldName: "Reg_No", fieldValue: "0", opType: OperatorComparer.Equals },
      { fieldName: "From_Dt", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "To_Dt", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      { fieldName: "MobileNo", fieldValue: "%", opType: OperatorComparer.Contains }
    ]
  }

  onNewfaregistration(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button
    const that = this;
    const dialogRef = this._matDialog.open(NewFARegistrationComponent,
      {
        maxWidth: "95vw",
        height: '95%',
        width: '90%',
        data: row
      });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.grid.bindGridData();
      }
    });
  }

  onChangeFirst() {

  }

  Clearfilter(event) {

    this.onChangeFirst();
  }

  keyPressAlphanumeric(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
export class assetsInsert {
  assertId: number;
  assetsName: any;
  assetCode: any;
  categoryId: any;
  subcategoryId: any;
  serialNo: any;
  modelNo: any;
  manufacturer: any;
  conditionId: any;
  description: any;
  purchaseDate: Date;
  purchaseCost: any;
  supplier: any;
  invoiceNo: any;
  depreciationId: any;
  usefullife: any;
  insurancePro: any;
  policyNo: any;
  insuranceExpDate: any;
  warrantyprovider: any;
  warrantyExpDate: any;
  amcprovider: any;
  amcExpDate: any;
  location: any;
  departmentId: any;
  assignedTo: any;
  building: any;
  floor: any;
  room: any;
  statusId:any;

  constructor(assetsInsert) {
    {
      this.assertId = assetsInsert.assertId || 0;
      this.assetsName = assetsInsert.assetsName || '';
      this.assetCode = assetsInsert.assetCode || 0;
      this.categoryId = assetsInsert.categoryId || 0;
      this.subcategoryId = assetsInsert.subcategoryId || 0;
      this.serialNo = assetsInsert.serialNo || 0;
      this.modelNo = assetsInsert.modelNo || 0;
      this.manufacturer = assetsInsert.manufacturer || '';
      this.conditionId = assetsInsert.conditionId || '';
      this.description = assetsInsert.description || ''
      this.purchaseDate = assetsInsert.purchaseDate || '1900-01-01';
      this.purchaseCost = assetsInsert.purchaseCost || 0;
      this.supplier = assetsInsert.supplier || ''
      this.invoiceNo = assetsInsert.invoiceNo || 0
      this.usefullife = assetsInsert.usefullife || 0
      this.insurancePro = assetsInsert.insurancePro || ''
      this.policyNo = assetsInsert.policyNo || 0
      this.insuranceExpDate = assetsInsert.insuranceExpDate || '1900-01-01';
      this.warrantyprovider = assetsInsert.warrantyprovider || ''
      this.warrantyExpDate = assetsInsert.warrantyExpDate || '1900-01-01';
      this.amcprovider = assetsInsert.amcprovider || ''
      this.amcExpDate = assetsInsert.amcExpDate || '1900-01-01';
      this.assignedTo = assetsInsert.assignedTo || ''
      this.building = assetsInsert.building || ''
      this.floor = assetsInsert.floor || ''
      this.room = assetsInsert.room || ''
      this.location = assetsInsert.location || ''
      this.departmentId = assetsInsert.departmentId || 0
      this.statusId = assetsInsert.statusId || 0
    }
  }
}