import { Component, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup, UntypedFormBuilder } from '@angular/forms';
import { OperatorComparer, gridModel } from 'app/core/models/gridRequest';
import { gridColumnTypes } from 'app/core/models/tableActions';
import { permissionCodes } from 'app/main/shared/model/permission.model';
import { LabResultListService } from '../lab-result-list/lab-result-list.service';
import { AdvanceDataStored } from 'app/main/ipd/advance';
import { DatePipe } from '@angular/common';
import { PagePermissionService } from 'app/main/shared/services/page-permission.service';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { ExcelDownloadService } from 'app/main/shared/services/excel-download.service';
import { Overlay, ToastrService } from 'ngx-toastr';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { WhatsAppEmailService } from 'app/main/shared/services/whats-app-email.service';
import { MatDialog } from '@angular/material/dialog';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { MatTableDataSource } from '@angular/material/table';
import Chart, { Color } from 'chart.js/auto';
import { fuseAnimations } from '@fuse/animations';
import { element } from 'protractor';
import { ServiceWiseTrendComponent } from './service-wise-trend/service-wise-trend.component';
import { CategoryWiseTrendComponent } from './category-wise-trend/category-wise-trend.component';
import { DoctorWiseTrendComponent } from './doctor-wise-trend/doctor-wise-trend.component';
import { CompanyWiseTrendComponent } from './company-wise-trend/company-wise-trend.component';
import { PdfviewerComponent } from 'app/main/pdfviewer/pdfviewer.component';

@Component({
  selector: 'app-branch-wise-summary',
  templateUrl: './branch-wise-summary.component.html',
  styleUrls: ['./branch-wise-summary.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BranchWiseSummaryComponent {

  myformSearch: FormGroup;
  myServicewiseSearch: FormGroup;
  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  fromDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate1 = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  UnitId: any = this._loggedService.currentUserValue.user.unitId;
  UnitId1: any = this._loggedService.currentUserValue.user.unitId;
  status: any = "0"


  public paymentModeChart: any;

  autocompleteModeunit: string = "Hospital";
  @ViewChild(AirmidTableComponent) grid: AirmidTableComponent;
  @ViewChild('actionButtonTemplate') actionButtonTemplate!: TemplateRef<any>;
  @ViewChild('ServiceGrid', { static: false }) grid1: AirmidTableComponent;
  @ViewChild('CategoryGrid', { static: false }) grid2: AirmidTableComponent;
  @ViewChild('DoctorGrid', { static: false }) grid3: AirmidTableComponent;
  @ViewChild('b2bGrid', { static: false }) grid4: AirmidTableComponent;
  @ViewChild('actionButtonTemplate1') actionButtonTemplate1!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate2') actionButtonTemplate2!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate3') actionButtonTemplate3!: TemplateRef<any>;
  @ViewChild('actionButtonTemplate4') actionButtonTemplate4!: TemplateRef<any>;

  ngAfterViewInit() {
    this.gridConfig.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate;
    this.gridConfig1.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate1;
    this.gridConfig2.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate2;
    this.gridConfig3.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate3;
    this.gridConfig4.columnsList.find(col => col.key === 'action')!.template = this.actionButtonTemplate4;
  }

  allcolumns = [

    { heading: "Branch / Unit Name", key: "unitBranchName", sort: true, align: 'left', emptySign: 'NA', width: 800 },
    { heading: "Count", key: "patientCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Amount", key: "netRevenue", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    {
      heading: "Action", key: "action", align: "right", width: 100, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate  // Assign ng-template to the column
    }
  ];

  gridConfig: gridModel = {
    permissionCode: permissionCodes.ExternalInvestigation,
    apiUrl: "Branch/UnitBranchWiseRevenueSummary",
    columnsList: this.allcolumns,
    sortField: "UnitId",
    sortOrder: 0,
    filters: [

      { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
    ]
  }

  constructor(
    public _LabResultListService: LabResultListService,
    public datePipe: DatePipe,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    public _WhatsAppEmailService: WhatsAppEmailService,
    public _whatsppService: WhatsAppEmailService,
    private _loggedService: AuthenticationService,
    public permissionService: PagePermissionService,
  ) { }


  ngOnInit(): void {
    this.myformSearch = this._LabResultListService.createBranchSummarySearchForm()
    this.myServicewiseSearch = this._LabResultListService.createServicerevenuSearchForm()
    // setTimeout(() => {
    //   this.initializeCharts();
    // }, 500);
    this.GetBillRevenudetail();
  }

  ListView(value) {
    console.log(value)
    if (value.value !== 0)
      this.UnitId = value.value
    else
      this.UnitId = 0

    this.onChangeFirst();
  }

  onChangeFirst() {
    // this.updateDateFilteredCharts();
    this.UnitId = this.myformSearch.get('UnitId').value || "0"

    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")

    this.getfilterdata();
    this.GetBillRevenudetail();
    this.getfilterdataservice();
    this.getfilterdataCategoryWise();
    this.getfilterdataDoctorWise();
    this.getfilterdataB2bWise();

    this.paymentModeChart = this.getPaymentDoughnutChart();
  }

  getfilterdata() {
    this.gridConfig = {
      apiUrl: "Branch/UnitBranchWiseRevenueSummary",
      columnsList: this.allcolumns,
      sortField: "UnitId",
      sortOrder: 0,
      filters: [
        { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
        { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
        { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
      ]
    }
    this.grid.gridConfig = this.gridConfig;
    this.grid.bindGridData();
  }


  Clearfilter(event) {
    console.log(event)
    this.onChangeFirst();
  }

  Clearfilter1(event) {
    console.log(event)

  }
  onClear() {
    // this.myformSearch.get('RegNoSearch').setValue("0");
    // this.myformSearch.get('StatusSearch').setValue("0");
    // this.myformSearch.get('PatientTypeSearch').setValue("3");
  }

  TotAmt = 0
  TotconAmt = 0
  TotNetamt = 0

  count = 0
  TotCount = 0
  getsumdetail() {
    // debugger
    this.count = this.Billdetaildatasource.data.length

    this.TotCount = this.Billdetaildatasource.data.reduce((sum, { patientCount }) => sum += +(patientCount || 0), 0);

    this.TotNetamt = this.Billdetaildatasource.data.reduce((sum, { netRevenue }) => sum += +(netRevenue || 0), 0);

    // this.TotDocAmt = this.Billdetaildatasource.data.reduce((sum, { docAmt }) => sum += +(docAmt || 0), 0);
    // this.TothospitalAmt = this.Billdetaildatasource.data.reduce((sum, { hospitalAmt }) => sum += +(hospitalAmt || 0), 0);

  }

  //service wise

  allServicefilters = [
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  ];

  allServicecolumns = [
    { heading: "ServiceName", key: "serviceName", sort: true, align: 'left', emptySign: 'NA', width: 1200 },
    // { heading: "TestCount", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    // { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Count", key: "qty", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate1
    }  // Assign ng-template to the column

  ];


  gridConfig1: gridModel = {

    apiUrl: "Branch/UnitBranchWiseTestSummary",
    columnsList: this.allServicecolumns,
    sortField: "UnitId",
    sortOrder: 0,
    filters: this.allServicefilters
  }

  getfilterdataservice() {

    this.gridConfig1 = {
      apiUrl: "Branch/UnitBranchWiseTestSummary",
      columnsList: this.allServicecolumns,
      sortField: "UnitId",
      sortOrder: 0,
      filters: [{ fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid1.gridConfig = this.gridConfig1;
    this.grid1.bindGridData();
  }

  serviceTrend(row: any = null) {
    const dialogRef = this._matDialog.open(ServiceWiseTrendComponent,
      {
        maxWidth: "90vw",
        height: '90%',
        width: '90%',
        data: { row, unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid.bindGridData();
    });
  }
  // category wise

  allCategoryfilters = [
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  ];

  allCategorycolumns = [
    { heading: "Category Name", key: "categoryName", sort: true, align: 'left', emptySign: 'NA', width: 1500 },
    { heading: "Count", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate2
    }  // Assign ng-template to the column

  ];

  gridConfig2: gridModel = {
    apiUrl: "Branch/UnitBranchWiseCategorySummary",
    columnsList: this.allCategorycolumns,
    sortField: "UnitId",
    sortOrder: 0,
    filters: this.allCategoryfilters
  }

  getfilterdataCategoryWise() {
    this.gridConfig2 = {
      apiUrl: "Branch/UnitBranchWiseCategorySummary",
      columnsList: this.allCategorycolumns,
      sortField: "CategoryName",
      sortOrder: 0,
      filters: [{ fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid2.gridConfig = this.gridConfig2;
    this.grid2.bindGridData();
  }

  categoryTrend(row: any = null) {
    const dialogRef = this._matDialog.open(CategoryWiseTrendComponent,
      {
        maxWidth: "90vw",
        height: '90%',
        width: '90%',
        data: { row, unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid2.bindGridData();
    });
  }
  // doctor wise

  alldoctorfilters = [
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  ];

  alldoctorcolumns = [
    { heading: "DoctorName", key: "doctorName", sort: true, align: 'left', emptySign: 'NA', width: 1500 },
    { heading: "Count", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate3
    }  // Assign ng-template to the column

  ];

  gridConfig3: gridModel = {
    apiUrl: "Branch/UnitBranchWiseDoctorSummary",
    columnsList: this.alldoctorcolumns,
    sortField: "DoctorName",
    sortOrder: 0,
    filters: this.alldoctorfilters
  }

  getfilterdataDoctorWise() {
    this.gridConfig3 = {
      apiUrl: "Branch/UnitBranchWiseDoctorSummary",
      columnsList: this.alldoctorcolumns,
      sortField: "DoctorName",
      sortOrder: 0,
      filters: [{ fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid3.gridConfig = this.gridConfig3;
    this.grid3.bindGridData();
  }

  doctorTrend(row: any = null) {
    const dialogRef = this._matDialog.open(DoctorWiseTrendComponent,
      {
        maxWidth: "90vw",
        height: '90%',
        width: '90%',
        data: { row, unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid2.bindGridData();
    });
  }
  // b2b wise

  all2b2filters = [
    { fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
    { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.Equals },
    { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.Equals }
  ];

  all2b2columns = [
    { heading: "Company Name", key: "companyName", sort: true, align: 'left', emptySign: 'NA', width: 1500 },
    // { heading: "TestCount", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    // { heading: "Price", key: "price", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "Count", key: "testCount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    { heading: "TotalAmount", key: "totalAmount", sort: true, align: 'left', emptySign: 'NA', width: 80 },
    {
      heading: "Action", key: "action", align: "right", width: 80, sticky: true, type: gridColumnTypes.template,
      template: this.actionButtonTemplate4
    }  // Assign ng-template to the column

  ];

  gridConfig4: gridModel = {
    apiUrl: "Branch/UnitBranchWiseCompanySummary",
    columnsList: this.all2b2columns,
    sortField: "CompanyName",
    sortOrder: 0,
    filters: this.all2b2filters
  }

  getfilterdataB2bWise() {
    this.gridConfig4 = {
      apiUrl: "Branch/UnitBranchWiseCompanySummary",
      columnsList: this.all2b2columns,
      sortField: "CompanyName",
      sortOrder: 0,
      filters: [{ fieldName: "UnitId", fieldValue: String(this.UnitId), opType: OperatorComparer.Equals },
      { fieldName: "FromDate", fieldValue: this.fromDate, opType: OperatorComparer.StartsWith },
      { fieldName: "Todate", fieldValue: this.toDate, opType: OperatorComparer.StartsWith }
      ]
    }
    this.grid4.gridConfig = this.gridConfig4;
    this.grid4.bindGridData();
  }

  companyTrend(row: any = null) {
    const dialogRef = this._matDialog.open(CompanyWiseTrendComponent,
      {
        maxWidth: "90vw",
        height: '90%',
        width: '90%',
        data: { row, unit: this.UnitId, fdate: this.fromDate, tdate: this.toDate }
      });
    dialogRef.afterClosed().subscribe(result => {
      this.grid2.bindGridData();
    });
  }

  viewgetReportPdf() {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")
    const vdata = {
      "searchFields": [
        {
          "fieldName": "UnitId",
          "fieldValue": String(this.UnitId),
          "opType": "13"
        },
        {
          "fieldName": "FromDate",
          "fieldValue": this.fromDate,
          "opType": "13"
        },
        {
          "fieldName": "ToDate",
          "fieldValue": this.toDate,
          "opType": "13"
        }
      ],
      "mode": "BranchWiseStatement"
    }
    this._LabResultListService.getMultiReportView(vdata).subscribe(res => {
      const matDialog = this._matDialog.open(PdfviewerComponent, {
        maxWidth: "85vw",
        height: '750px',
        width: '100%',
        data: {
          base64: res["base64"] as string,
          title: "Statement Viewer"
        }
      });
      matDialog.afterClosed().subscribe(result => { });
    });
  }

  Billdetaildatasource = new MatTableDataSource<BillRevenuList>();
  paydata = []
  paymentModeData1: any[] = []
  GetBillRevenudetail() {
    this.fromDate = this.datePipe.transform(this.myformSearch.get('start').value, "yyyy-MM-dd")
    this.toDate = this.datePipe.transform(this.myformSearch.get('end').value, "yyyy-MM-dd")

    const vdata = {
      "first": 0,
      "rows": 200,
      "sortField": "UnitId",
      "sortOrder": 0,
      "filters": [
        {
          "fieldName": "UnitId",
          "fieldValue": String(this.UnitId),
          "opType": "Equals"
        },
        {
          "fieldName": "FromDate",
          "fieldValue": this.fromDate,
          "opType": "Equals"
        },
        {
          "fieldName": "ToDate",
          "fieldValue": this.toDate,
          "opType": "Equals"
        },

      ],
      "Columns": [],
      "exportType": "JSON"
    }

    console.log(vdata)
    // debugger
    this._LabResultListService.getBillrevenudetailList(vdata).subscribe(data => {
      this.Billdetaildatasource.data = data.data as BillRevenuList[]
      console.log(this.Billdetaildatasource.data)
      this.paydata = [];

      if (this.paymentModeChart) {
        this.paymentModeChart.destroy();
      }
      this.Billdetaildatasource.data.forEach(element => {
        console.log(element)
        this.paydata.push({
          mode: element.unitBranchName?.trim() || '',
          amount: Number(element.netRevenue) || 0
        });
        console.log(this.paydata)
        // this.paymentModeData1.push(this.paydata)
      })

      // ✅ Re-create chart AFTER data is ready
      setTimeout(() => {
        this.renderPaymentChart();
      }, 0);

      // console.log(this.paymentModeData1)
      if (this.Billdetaildatasource.data.length > 0)
        this.getsumdetail()
    })
  }

  renderPaymentChart() {
    if (this.paymentModeChart) {
      this.paymentModeChart.destroy();
      this.paymentModeChart = null!;
    }

    this.paymentModeChart = new Chart('paymentModeChart', {
      type: 'doughnut',
      data: {
        labels: this.paydata.map(d => d.mode),
        datasets: [{
          data: this.paydata.map(d => d.amount),
          backgroundColor: ['#FF3784', '#36A2EB', '#4BC0C0', '#F77825']
        }]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
          tooltip: {
            callbacks: {
              label(context) {
                return `₹${context.parsed.toLocaleString('en-IN')}`;
              }
            }
          }
        }
      }
    });
  }

  getPaymentDoughnutChart() {
    // debugger
    return new Chart('paymentModeChart', {
      type: 'doughnut',
      data: {
        labels: this.paydata.map(d => d.mode),
        datasets: [
          {
            backgroundColor: ['#FF3784', '#36A2EB', '#4BC0C0', '#F77825'],
            data: this.paydata.map(d => d.amount)
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          },
          tooltip: {
            enabled: true,
            callbacks: {
              label: function (context) {
                let label = context.label || '';
                if (label) {
                  label += ': ';
                }
                label += '₹' + context.parsed.toLocaleString('en-IN');
                return label;
              }
            }
          }
        }
      }
    });
  }

  // initializeCharts(): void {
  //   console.log('Initializing charts...');

  //   if (document.getElementById('paymentModeChart')) {
  //     console.log('Creating payment mode chart');
  //     try {
  //       this.paymentModeChart = this.getPaymentDoughnutChart();
  //     } catch (error) {
  //       console.error('Error creating payment mode chart:', error);
  //     }
  //   }
  //   console.log('Charts initialization complete');
  // }

  // updateDateFilteredCharts(): void {

  //   if (this.paymentModeChart) {
  //     this.paymentModeChart.destroy();
  //   }
  //   // Reinitialize the affected charts
  //   setTimeout(() => {

  //     if (document.getElementById('paymentModeChart')) {
  //       this.paymentModeChart = this.getPaymentDoughnutChart();
  //     }
  //   }, 100);
  // }
}


export class BillRevenuList {

  unitBranchName: string;
  totalRevenue: number;
  discountAmount: number;
  netRevenue: number;
  balAmount: number;
  patientCount: number;

  constructor(BillRevenuList) {

    this.unitBranchName = BillRevenuList.unitBranchName;
    this.totalRevenue = BillRevenuList.totalRevenue || 0;
    this.discountAmount = BillRevenuList.discountAmount || '0';
    this.netRevenue = BillRevenuList.netRevenue || 0;
    this.balAmount = BillRevenuList.balAmount || 0;
    this.patientCount = BillRevenuList.patientCount;

  }
}

