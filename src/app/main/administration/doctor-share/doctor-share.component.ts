import { DatePipe } from '@angular/common';
import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { fuseAnimations } from '@fuse/animations';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DoctorShareService } from './doctor-share.service';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { DoctorShareListComponent } from 'app/main/setup/doctor/doctor-payoutpercentage/doctor-share-list/doctor-share-list.component';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { permissionCodes, permissionType } from 'app/main/shared/model/permission.model';


@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrls: ['./doctor-share.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class DoctorShareComponent implements OnInit {
    IsAdd: boolean = this.permissionService.getPermission(permissionCodes.RoleTemplateMaster, permissionType.Add);
        

  @ViewChild('drawer') public drawer: MatDrawer;
  isRegIdSelected: boolean = false;
  isDoctorIDSelected: boolean = false;
  isgroupIdSelected: boolean = false;
  DoctorListfilteredOptions: Observable<string[]>;
  filteredOptionsGroup: Observable<string[]>;
  doctorNameCmbList: any = [];
  groupNameList: any = [];
  sIsLoading: string = '';
  PatientListfilteredOptions: any;
  noOptionFound: any;

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autocompleteModedoctor: string = "ConDoctor";
  autocompletedepartment: string = "Department";

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  pBillNo: any = "0"
  opipType: any = "1"

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;


  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
@ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;
  constructor(
    public _DoctorShareService: DoctorShareService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,public permissionService: PagePermissionService,
    public toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    const today = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(today.getMonth() - 1);

    this._DoctorShareService.UserFormGroup.patchValue({
      startdate: oneMonthAgo
    });

  }
  @ViewChild('actionsTemplate1') actionsTemplate1!: TemplateRef<any>;
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  ngAfterViewInit() {
    // Assign the template to the column dynamically
    this.gridConfig.columnsList.find(col => col.key === 'patientType')!.template = this.actionsTemplate1;
    this.gridConfig.columnsList.find(col => col.key === 'opdipdtype')!.template = this.actionsTemplate;
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
  }

  allColumns = [
    { heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "-", key: "opdipdtype", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 25 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Discount Amt", key: "ConcessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Doctor Name", key: "admittedDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    // { heading: "Hospital Amt", key: "hospitalAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , width: 125},
    // { heading: "Doctor Amt", key: "doctorAmt", sort: true, align: 'left', emptySign: 'NA' , type: gridColumnTypes.amount , width: 125},

    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    {
      heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ]
  allFilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
    { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "PBillNo", fieldValue: "0", opType: OperatorComparer.Equals },
    { fieldName: "OP_IP_TYpe", fieldValue: "1", opType: OperatorComparer.Equals },
  ]
  gridConfig: gridModel = {
//  permissionCode: permissionCodes.BarcodeConfig,
    apiUrl: "DoctorPAy/DoctorshareBillList",
    columnsList: this.allColumns,
    sortField: "DoctorId",
    sortOrder: 0,
    filters: this.allFilters
  }

  onChangeFirst() {
    this.fromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
    this.pBillNo = this._DoctorShareService.UserFormGroup.get('PbillNo').value || "0"
    this.opipType = this._DoctorShareService.UserFormGroup.get('OP_IP_Type').value
    this.getfilterdata();
  }

  getfilterdata() {
    // debugger
    const fromD = this._DoctorShareService.UserFormGroup.get("fromDate").value || "";
    const toD = this._DoctorShareService.UserFormGroup.get("enddate").value || "";
    this.fromDate = fromD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd") : "";
    this.toDate = toD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd") : "";
    this.DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value

    console.log("fromDate:", this.fromDate)
    console.log("toDate:", this.toDate)

    this.gridConfig = {
      apiUrl: "DoctorPAy/DoctorshareBillList",
      columnsList: this.allColumns,
      sortField: "DoctorId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: this.pBillNo, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_TYpe", fieldValue: this.opipType, opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }
///Additonla pay
allColumns1 = [
    { heading: "-", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "-", key: "isBillShrHold", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 25 },
    { heading: "Service Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },

    { heading: "Doc Amt", key: "docAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
  ]
  allFilters1 = [
   { fieldName: "FromDate", fieldValue: "2025-06-10", opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue: "2025-10-10", opType: OperatorComparer.StartsWith },

  ]
  gridConfig1: gridModel = {
    apiUrl: "DoctorPAy/DoctorPayList",
    columnsList: this.allColumns1,
    sortField: "PBillNo",
    sortOrder: 0,
    filters: this.allFilters1
  }

  onChangeFirst1() {
    this.fromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")
  
    this.getfilterdata1();
  }

  getfilterdata1() {
    // debugger
    const fromD = this._DoctorShareService.UserFormGroup.get("fromDate").value || "";
    const toD = this._DoctorShareService.UserFormGroup.get("enddate").value || "";
    this.fromDate = fromD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd") : "";
    this.toDate = toD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd") : "";
    this.DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value

    console.log("fromDate:", this.fromDate)
    console.log("toDate:", this.toDate)

    this.gridConfig1 = {
      apiUrl: "DoctorPAy/DoctorPayList",
      columnsList: this.allColumns,
      sortField: "PBillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith },
       
      ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid.bindGridData();
  }
//
  Clearfilter(event) {
    console.log(event)
    if (event == 'PbillNo')
      this._DoctorShareService.UserFormGroup.get('PbillNo').setValue("")
    this.onChangeFirst();
  }



  onHold(row: any = null) {
    const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    buttonElement.blur(); // Remove focus from the button

    const that = this;
    // const dialogRef = this._matDialog.open(NewconfigComponent,
    //     {
    //         maxWidth: "95vw",
    //         height: '95%',
    //         width: '95%',
    //         data: row
    //     });
    // dialogRef.afterClosed().subscribe(result => {
    //     if (result) {
    //         that.grid.bindGridData();
    //     }
    // });
  }

  DoctorId = "0";

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = "0"

    this.onChangeFirst();
  }

  getValidationMessages() {
    return {
      registrationNo: [],
      ipNo: [],
      opNo: [],
      patientType: [],

    };
  }

  isDatePckrDisabled: boolean = false;
  NewDocShare() {
    const dialogRef = this._matDialog.open(DoctorShareListComponent,
      {
        maxWidth: "35vw",
        height: "75%",
        width: "100%",
      });
    dialogRef.afterClosed().subscribe(result => {
      this.onChangeFirst()
    });
  }

  // Additiondocpay() {
  //   const dialogRef = this._matDialog.open(AdditionDocpayComponent,
  //     {
  //       maxWidth: "85vw",
  //       height: "65%",
  //       width: "100%",
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.onChangeFirst()
  //   });
  // }

  // processDocShare() {
  //   const dialogRef = this._matDialog.open(ProcessDoctorShareComponent,
  //     {
  //       maxWidth: "45vw",
  //       maxHeight: '35%',
  //       width: '35%',
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     console.log('The dialog was closed - Insert Action', result);
  //   });
  // }

  // billdetail(element) {
  //   const dialogRef = this._matDialog.open(IPBillDoctorshareComponent,
  //     {
  //       maxWidth: "90vw",
  //       height: "75%",
  //       width: "100%",
  //     });
  //   dialogRef.afterClosed().subscribe(result => {
  //     this.onChangeFirst()
  //   });
  // }

  onClear() {
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
  keyPressCharater(event) {
    const inp = String.fromCharCode(event.keyCode);
    if (/^\d*\.?\d*$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}


export class BillListForDocShrList {

  PatientName: string;
  TotalAmt: number;
  ConAmt: number;
  NetAmt: number;
  PBillNo: number;
  // BillNo: number;
  AdmittedDoctorName: string;
  PatientType: number;
  CompanyName: string;
  IsBillShrHold: boolean;
  GroupName: any;
  op_IP_Type:any;
    serviceId:any;
      classId:any;
        doctorId:any; 
  constructor(BillListForDocShrList) {

    this.PatientName = BillListForDocShrList.PatientName;
    this.TotalAmt = BillListForDocShrList.TotalAmt || 0;
    this.ConAmt = BillListForDocShrList.ConAmt || '0';
    this.NetAmt = BillListForDocShrList.NetAmt || 0;
    this.PBillNo = BillListForDocShrList.PBillNo || 0;
    //this.BillNo= BillListForDocShrList.BillNo|| 0;
    this.AdmittedDoctorName = BillListForDocShrList.AdmittedDoctorName;
    this.PatientType = BillListForDocShrList.PatientType || 0;
    this.CompanyName = BillListForDocShrList.CompanyName;
    this.IsBillShrHold = BillListForDocShrList.IsBillShrHold || 0;
    this.GroupName = BillListForDocShrList.GroupName || '';
      this.op_IP_Type = BillListForDocShrList.op_IP_Type || 0;
        this.serviceId = BillListForDocShrList.serviceId || 0;
          this.classId = BillListForDocShrList.classId || 0;
            this.doctorId = BillListForDocShrList.doctorId || 0;

  }
}

