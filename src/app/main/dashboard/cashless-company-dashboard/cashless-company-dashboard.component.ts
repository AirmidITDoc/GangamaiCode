import { Component, OnInit, ViewChild } from '@angular/core';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { CashlessDashboardService } from './cashless-dashboard.service';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { DatePipe } from '@angular/common';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cashless-company-dashboard',
  templateUrl: './cashless-company-dashboard.component.html',
  styleUrls: ['./cashless-company-dashboard.component.scss']
})
export class CashlessCompanyDashboardComponent implements OnInit {

  @ViewChild(AirmidTableComponent) grid1: AirmidTableComponent;
  @ViewChild(AirmidTableComponent) grid2: AirmidTableComponent;
  //fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  //toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate = this.datePipe.transform(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");
  toDate = this.datePipe.transform(new Date(), "yyyy-MM-dd");

  // ===== Start Table Count Wise summary  =================

  myformSearch: FormGroup;

  allcolumns = [
    { heading: "VisitDate", key: "visitDate", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "Count", key: "count", sort: true, align: "center", emptySign: 'NA' },
  ]

  allfilters = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  ]
  gridConfig: gridModel = {
    apiUrl: "CashLess/CashlessCountSummaryList",
    columnsList: this.allcolumns,
    sortField: "count",
    sortOrder: 0,
    filters: this.allfilters,
    row: 25
  }

  // ========================= end table Count Wise summary  =================
  // ===== Start Table Count Wise summary  =================

  allcolumns_CompanyWise = [
    { heading: "companyName", key: "companyName", sort: true, align: 'left', emptySign: 'NA' },
    { heading: "patientCount", key: "patientCount", sort: true, align: "center", emptySign: 'NA' },
  ]

  allfilters_CompanyWise = [
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  ]
  gridConfig_CompanyWise: gridModel = {
    apiUrl: "CashLess/CashlessCompanyWiseSummaryList",
    columnsList: this.allcolumns_CompanyWise,
    sortField: "companyName",
    sortOrder: 0,
    filters: this.allfilters_CompanyWise,
    row: 25
  }

  // ========================= end table Count Wise summary  =================

  constructor(
    public _CashlessDashboardService: CashlessDashboardService,
    public permissionService: PagePermissionService,
    public datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.myformSearch = this._CashlessDashboardService.createSearchForm();
  }
  onGo() {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('fromDate').value, "yyyy-MM-dd") || "01/01/1900",
      this.toDate = this.datePipe.transform(this.myformSearch.get('enddate').value, "yyyy-MM-dd") || "01/01/1900",
      this.getfilterdata();
  }

  //  getfilterdata() {
  //     // ===== Start Table Count Wise summary  =================
  //       this.gridConfig = {
  //           apiUrl: "CashLess/CashlessCountSummaryList",
  //           columnsList: this.allcolumns,
  //           sortField: "count",
  //           sortOrder: 0,
  //           filters: [
  //               { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //               { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  //           ],
  //           row: 25
  //       }
  //       console.log(this.gridConfig)
  //       this.grid1.gridConfig = this.gridConfig;
  //       this.grid1.bindGridData();

  // // ===== Start Table Company Count Wise summary  =================
  //        this.gridConfig_CompanyWise = {
  //           apiUrl: "CashLess/CashlessCompanyWiseSummaryList",
  //           columnsList: this.allcolumns_CompanyWise,
  //           sortField: "companyName",
  //           sortOrder: 0,
  //           filters: [
  //               { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
  //               { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
  //           ],
  //           row: 25
  //       }
  //       console.log(this.gridConfig_CompanyWise)
  //       this.grid2.gridConfig_CompanyWise = this.gridConfig_CompanyWise;
  //       this.grid2.bindGridData();

  //   }

  getfilterdata() {
    // Grid 1
    this.gridConfig = {
      apiUrl: "CashLess/CashlessCountSummaryList",
      columnsList: [...this.allcolumns],
      sortField: "count",
      sortOrder: 0,
      filters: [
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },
      ],
      row: 25
    };

    this.grid1.gridConfig = JSON.parse(JSON.stringify(this.gridConfig));
    this.grid1.bindGridData();

    // Grid 2 (delayed)
    setTimeout(() => {
      this.gridConfig_CompanyWise = {
        apiUrl: "CashLess/CashlessCompanyWiseSummaryList",
        columnsList: [...this.allcolumns_CompanyWise],
        sortField: "companyName",
        sortOrder: 0,
        filters: [{ fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "ToDate", fieldValue: this.toDate, opType: OperatorComparer.Equals },],
        row: 25
      };

      this.grid2.gridConfig = JSON.parse(JSON.stringify(this.gridConfig_CompanyWise));
      this.grid2.bindGridData();
    }, 200);
  }
}
