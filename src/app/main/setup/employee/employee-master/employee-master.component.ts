import { DatePipe } from '@angular/common';
import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from "@fuse/components/confirm-dialog/confirm-dialog.component";
import { gridModel, OperatorComparer } from "app/core/models/gridRequest";
import { gridActions, gridColumnTypes } from "app/core/models/tableActions";
import { AirmidTableComponent } from "app/main/shared/componets/airmid-table/airmid-table.component";
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { ToastrService } from 'ngx-toastr';
import { PageNames } from 'app/main/shared/componets/airmid-fileupload/airmid-fileupload.component';
import Swal from 'sweetalert2';
import { AirmidSignatureComponent } from 'app/main/shared/componets/airmid-signature/airmid-signature.component';
import { EmployeeMasterService } from './employee-master.service';
import { NewEmployeeMasterComponent } from './new-employee-master/new-employee-master.component';

@Component({
  selector: 'app-employee-master',
  templateUrl: './employee-master.component.html',
  styleUrls: ['./employee-master.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations
})
export class EmployeeMasterComponent {
  myFilterform: FormGroup;

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  f_name: any = ""
  regNo: any = "0"
  l_name: any = ""
  mobileno: any = "%"
  confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  photo: PageNames = PageNames.EMP_PHOTO; //Employee_Photo
  page: PageNames = PageNames.EMP_FILES;

  constructor(
    public _companyEmpService: EmployeeMasterService, public permissionService: PagePermissionService,
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

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
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
      heading: "Action", key: "action", align: "right", width: 200, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
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
    const dialogRef = this._matDialog.open(NewEmployeeMasterComponent,
      {
        maxWidth: "100vw",
        maxHeight: '95%',
        width: '90%',
        data: row,
      });
    dialogRef.afterClosed().subscribe(result => {
      that.grid.bindGridData();
    });
  }

  // img upload
  onFiles1(element) {
    const dialogRef = this._matDialog.open(
      AirmidSignatureComponent,
      {
        maxWidth: "50vw",
        maxHeight: "70vh",
        width: "100%",
        data: { refId: element.executiveId, refType: 'Employee_Photo', multiple: 'true', docName: 'Employee_Photo' }
      }
    );

    dialogRef.afterClosed().subscribe((result) => {
      // this.onCloseDialog.emit(result);
    });
  }

  onCancel(data) {
    Swal.fire({
      title: 'Confirm Employee Deactivation ',
      text: 'Are you sure you want to Deactive the Employee?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, deactivate!'

    }).then((flag) => {
      if (flag.isConfirmed) {
        this._companyEmpService.deactivateTheStatus(data.executiveId).subscribe((response: any) => {
          this.grid.bindGridData;
        });
      }
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
    designation: any;
    dateOfjoin: any;
    unitId: any;
    adharCardNo: any;
    pfno: any;
    experienceYear: any;
    previousSalary: any;
    previousCompany: any;
    previousDesignation: any;
    empDepartment: any
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
            this.designation = RegInsert.designation || '';
            this.dateOfjoin = RegInsert.dateOfjoin || ''
            this.unitId = RegInsert.unitId || ''
            this.adharCardNo = RegInsert.adharCardNo || ''
            this.pfno = RegInsert.pfno || ''
            this.experienceYear = RegInsert.experienceYear || ''
            this.previousSalary = RegInsert.previousSalary || ''
            this.previousCompany = RegInsert.previousCompany || ''
            this.previousDesignation = RegInsert.previousDesignation || ''
            this.empDepartment = RegInsert.empDepartment
        }
    }
}