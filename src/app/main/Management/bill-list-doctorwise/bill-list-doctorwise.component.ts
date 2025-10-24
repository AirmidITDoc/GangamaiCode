import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { FormvalidationserviceService } from 'app/main/shared/services/formvalidationservice.service';
import { ToastrService } from 'ngx-toastr';
import { BillDoctorwiseService } from './bill-doctorwise.service';
import { DatePipe } from '@angular/common';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { MatDrawer } from '@angular/material/sidenav';
import { Observable } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { DoctorAddonpayComponent } from './doctor-addonpay/doctor-addonpay.component';
import { ProcessDoctorshareComponent } from './process-doctorshare/process-doctorshare.component';
import { PatientBilldetailComponent } from './patient-billdetail/patient-billdetail.component';
import Swal from 'sweetalert2';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-bill-list-doctorwise',
  templateUrl: './bill-list-doctorwise.component.html',
  styleUrls: ['./bill-list-doctorwise.component.scss'],
      encapsulation: ViewEncapsulation.None,
      animations: fuseAnimations
})
export class BillListDoctorwiseComponent {

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
  pBillNo: any = "0"
  opipType: any = "1"

  dataSource = new MatTableDataSource<BillListForDocShrList>();
  dsAdditionalPay = new MatTableDataSource<BillListForDocShrList>();

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autocompleteModedoctor: string = "ConDoctor";
  autocompleteModedoctor1: string = "ConDoctor";
  autocompletedepartment: string = "Department";

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  

  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;


  // @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  // @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;

    @ViewChild('ipBrowse', { static: false }) grid: AirmidTableComponent;
    @ViewChild('summary', { static: false }) grid1: AirmidTableComponent;




  constructor(
    public _DoctorShareService: BillDoctorwiseService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
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
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 100 },
    { heading: "PatientName", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "Patient Type", key: "patientType", sort: true, align: 'left', emptySign: 'NA' },

    { heading: "Bill Amt", key: "totalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Discount Amt", key: "ConcessionAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Net Amt", key: "netPayableAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 100 },
    { heading: "Doctor Name", key: "admittedDoctorName", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    { heading: "Hospital Amt", key: "hospitalAmt", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Doctor Amt", key: "doctorShareAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },

    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 150 },
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
    apiUrl: "Doctor/DoctorshareBillList",
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
    let fromD = this._DoctorShareService.UserFormGroup.get("fromDate").value || "";
    let toD = this._DoctorShareService.UserFormGroup.get("enddate").value || "";
    this.fromDate = fromD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('fromDate').value, "yyyy-MM-dd") : "";
    this.toDate = toD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd") : "";
    this.DoctorId = this._DoctorShareService.UserFormGroup.get('DoctorID').value
debugger
    console.log("fromDate:", this.fromDate)
    console.log("toDate:", this.toDate)

    this.gridConfig = {
      apiUrl: "Doctor/DoctorshareBillList",
      columnsList: this.allColumns,
      sortField: "DoctorId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "DoctorId", fieldValue: this.DoctorId, opType: OperatorComparer.Equals },
        { fieldName: "PBillNo", fieldValue: this.pBillNo, opType: OperatorComparer.Equals },
        { fieldName: "OP_IP_TYpe", fieldValue: this.opipType, opType: OperatorComparer.Equals },
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();

      
  }
  ///Summary pay
  allColumns1 = [

    { heading: "AddChargeDrName", key: "addChargeDrName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Net Amount", key: "netAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Doctor Amount", key: "docAmt", sort: true, align: 'left', emptySign: 'NA', width: 250 },

    { heading: "Hospital Amount", key: "hospitalAmt", sort: true, align: 'left', emptySign: 'NA', width: 200 },
  ]
  allFilters1 = [
    { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.GreaterThanOrEqual },
    { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.GreaterThanOrEqual },
    { fieldName: "DoctorId", fieldValue: "0", opType: OperatorComparer.Equals },

  ]
  gridConfig1: gridModel = {
    apiUrl: "DoctorPAy/DoctorPaySummaryList",
    columnsList: this.allColumns1,
    sortField: "DoctorId",
    sortOrder: 0,
    filters: this.allFilters1
  }

  onChangeFirst1() {
    this.fromDate1 = this.datePipe.transform(this._DoctorShareService.DocSummaryfilterForm.get('fromDate').value, "yyyy-MM-dd")
    this.toDate1 = this.datePipe.transform(this._DoctorShareService.DocSummaryfilterForm.get('enddate').value, "yyyy-MM-dd")

    this.getfilterdata1();
  }

  getfilterdata1() {
   
debugger
    this.gridConfig1 = {
      apiUrl: "DoctorPAy/DoctorPaySummaryList",
      columnsList: this.allColumns1,
      sortField: "DoctorId",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate1, opType: OperatorComparer.StartsWith },
        { fieldName: "ToDate", fieldValue: this.toDate1, opType: OperatorComparer.StartsWith },
        { fieldName: "DoctorId", fieldValue: this.DoctorId1, opType: OperatorComparer.Equals },
      ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }
  //
  Clearfilter(event) {
    console.log(event)
    if (event == 'PbillNo')
      this._DoctorShareService.UserFormGroup.get('PbillNo').setValue("")
    this.onChangeFirst();
  }



  onHold(row: any = null) {
    //  const buttonElement = document.activeElement as HTMLElement; // Get the currently focused element
    //  buttonElement.blur(); // Remove focus from the button

    //  let that = this;
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


    Swal.fire({
      title: 'Do you want to Hold Bill ',
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Hold!"

    }).then((result) => {
      if (result.isConfirmed) {
      }
    });
  }

  DoctorId = "0";
  DoctorId1 = "0";

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.DoctorId = value.value
    else
      this.DoctorId = "0"

    this.onChangeFirst();
  }


  ListView1(value) {
    console.log(value)
    if (value.value !== 0)
      this.DoctorId1 = value.value
    else
      this.DoctorId1 = "0"

    this.onChangeFirst1();
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
  //  NewDocShare() {
  //    const dialogRef = this._matDialog.open(DoctorShareListComponent,
  //      {
  //        maxWidth: "35vw",
  //        height: "75%",
  //        width: "100%",
  //      });
  //    dialogRef.afterClosed().subscribe(result => {
  //      this.onChangeFirst()
  //    });
  //  }

  Additiondocpay() {
    const dialogRef = this._matDialog.open(DoctorAddonpayComponent,
      {
        maxWidth: "85vw",
        height: "70%",
        width: "100%",
      });
    dialogRef.afterClosed().subscribe(result => {
      this.onChangeFirst()
    });
  }

  processDocShare() {
    const dialogRef = this._matDialog.open(ProcessDoctorshareComponent,
      {
        maxWidth: "45vw",
        maxHeight: '35%',
        width: '35%',
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
    });
  }

  billdetail(element) {
    const dialogRef = this._matDialog.open(PatientBilldetailComponent,
      {
        maxWidth: "70vw",
        height: '900px',
        width: '100%',
        data: element
      });
    dialogRef.afterClosed().subscribe(result => {
      this.onChangeFirst()
    });
  }

  onClear() {
  }
  keyPressAlphanumeric(event) {
    var inp = String.fromCharCode(event.keyCode);
    if (/[a-zA-Z0-9]/.test(inp) && /^\d+$/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }
  keyPressCharater(event) {
    var inp = String.fromCharCode(event.keyCode);
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
  }
}

