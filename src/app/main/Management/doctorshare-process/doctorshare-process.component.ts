import { Component, TemplateRef, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatDrawer } from '@angular/material/sidenav';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BillListForDocShrList } from 'app/main/administration/doctor-share/doctor-share.component';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { Observable } from 'rxjs';
import { DoctorshareProcessService } from './doctorshare-process.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';

@Component({
  selector: 'app-doctorshare-process',
  templateUrl: './doctorshare-process.component.html',
  styleUrls: ['./doctorshare-process.component.scss']
})
export class DoctorshareProcessComponent {

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


  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  autocompleteModedoc: string = "ConDoctor";
  autocompletedepartment: string = "Department";

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  pBillNo: any = "0"
  opipType: any = "1"

  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;

  constructor(
    public _DoctorShareService: DoctorshareProcessService,
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
    this.gridConfig.columnsList.find(col => col.key === 'isBillShrHold')!.template = this.actionsTemplate;

  }

  allColumns = [
    { heading: "PType", key: "patientType", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "BillHold", key: "isBillShrHold", sort: true, align: 'left', type: gridColumnTypes.template, emptySign: 'NA', width: 25 },
    { heading: "PBillNo", key: "pbillNo", sort: true, align: 'left', emptySign: 'NA', width: 25 },
    { heading: "Service Name", key: "patientName", sort: true, align: 'left', emptySign: 'NA', width: 250 },
    { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Qty", key: "qty", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Total Amt", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', type: gridColumnTypes.amount, width: 125 },
    { heading: "Doctor Name", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 250 },

    { heading: "Doc Amt", key: "docAmount", sort: true, align: 'left', emptySign: 'NA', width: 200 },
    // { heading: "Hospital Amt", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 200 },

    // {
    //   heading: "Action", key: "action", align: "right", width: 150, sticky: true, type: gridColumnTypes.template,
    //   template: this.actionButtonTemplate  // Assign ng-template to the column
    // }
  ]
  allFilters = [
    { fieldName: "FromDate", fieldValue:this.fromDate, opType: OperatorComparer.StartsWith },
    { fieldName: "ToDate", fieldValue:this.toDate, opType: OperatorComparer.StartsWith },

  ]
  gridConfig: gridModel = {
    apiUrl: "DoctorPAy/DoctorPayList",
    columnsList: this.allColumns,
    sortField: "PBillNo",
    sortOrder: 0,
    filters: this.allFilters
  }

  //   onChangeFirst() {
  //     this.fromDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('startdate').value, "yyyy-MM-dd")
  //     this.toDate = this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd")

  //     this.getfilterdata();
  // }

  getfilterdata() {
    debugger
    let fromD = this._DoctorShareService.UserFormGroup.get("startdate").value || "";
    let toD = this._DoctorShareService.UserFormGroup.get("enddate").value || "";
    this.fromDate = fromD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('startdate').value, "yyyy-MM-dd") : "";
    this.toDate = toD ? this.datePipe.transform(this._DoctorShareService.UserFormGroup.get('enddate').value, "yyyy-MM-dd") : "";


    this.gridConfig = {
      apiUrl: "DoctorPAy/DoctorPayList",
      columnsList: this.allColumns,
      sortField: "PBillNo",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.GreaterThanOrEqual },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.GreaterThanOrEqual }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }


}