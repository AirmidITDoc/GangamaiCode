import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Label } from 'ng2-charts';
import Chart from 'chart.js';
import { element } from 'protractor';
import { filter, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { SalesSummaryComponent } from './sales-summary/sales-summary.component';

@Component({
  selector: 'app-pharmacy-dashboard',
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrls: ['./pharmacy-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,

})
export class PharmacyDashboardComponent implements OnInit {

  dashCardsData: any = [];
  pieChartOPData = new PieChartOPData();
  pieChartCurStkData = new pieChartCurStkData();

  // pieChartCurrentStockData = new pieChartCurrentStockData();

  DashChartOP: any = [];
  DashChartCurStk: any = [];
  constructor(
    public _DashboardService: DashboardService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public _matDialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.getPharDashboardSalesSummary();
    this.getPharmStoreList();
    this.fetchStaticData();
    this.fetchThreeMonSalesSumData();
    this.getPharCollSummStoreWiseDashboard();

    this.getOPChartData();
    this.getPieChartPharCurrentValueData();
    this.getPharUserInfoStoreWise();
    this.createForm();
    this.createForm1();

  var myCurrentDate=new Date(); 
  var myPastDate=new Date(myCurrentDate);
  myPastDate.setDate(myPastDate.getDate() - 1);

  var myCurrentDate1=new Date(); 
    var myPastDate1=new Date(myCurrentDate1);
    myPastDate1.setDate(myPastDate1.getDate() - 1);
    let m_data1 = {
      "FromDate": this.datePipe.transform(this.rangeFormGroup.get('startDate').value,"MM-dd-yyyy"),
      "ToDate": this.datePipe.transform(this.rangeFormGroup1.get('endDate').value,"MM-dd-yyyy")
    }
    this.getPharmsaleTableData(m_data1);
    this.getPharPaymentSummary(m_data1);

    setTimeout(() => {
      this.widget6 = {
        // currentRange: 'Todays',
        legend: false,
        explodeSlices: false,
        labels: true,
        doughnut: true,
        gradient: true,
        // scheme: {
        //   domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
        // },
        onSelect: (ev) => {
          console.log(ev);
        }
      };
    }, 1);

    setTimeout(() => {
      this.widget7 = {
        // currentRange: 'Todays',
        legend: false,
        explodeSlices: false,
        labels: true,
        doughnut: true,
        gradient: true,
        // scheme: {
        //   domain: ['#f44336', '#9c27b0', '#03a9f4', '#e91e63']
        // },
        onSelect: (ev) => {
          console.log(ev);
        }
      };

    

    }, 1);
    
  }

  StaticChartConfig: any = {
    gradient: true,
    showLegend: true,
    showLabels: true,
    isDoughnut: true,
    legendPosition: 'below',
    colorScheme: { domain: [] },
    view: [800, 350],
    data: []
  };

  fetchStaticData() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "FromDate": this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '12/25/2023',
      "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '12/30/2023',
      "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid ?? 0,
      "Mode": this.selectedStatic || 'CollectionAmount'
    }
    this._DashboardService.getPharDashboardPeichart("m_pharPayModeColSummaryDashboard", m_data).subscribe(data => {
      this.StaticChartConfig.data = data["data"] as any[];
      this.StaticChartConfig.colorScheme.domain = data["colors"] as any[];
      this.sIsLoading = '';
    }, error => {
      this.sIsLoading = 'noPharSumData';
    });
  }

  ThreeMonSalesConfig: any = {
    data: [],
    multi: [],
    view: [1000, 400],
    showXAxis: true,
    showYAxis: true,
    gradient: false,
    showLegend: true,
    showXAxisLabel: true,
    xAxisLabel: 'Store',
    showYAxisLabel: true,
    yAxisLabel: 'Amount',
    legendTitle: 'Month',
    showGridLines: true,
    showDataLabel: true,
    colorScheme: {
      domain: ['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
    },
    onSelect: null,
  }

  fetchThreeMonSalesSumData() {
    this.ThreeMonSalesConfig.data = [];
    this.ThreeMonSalesConfig.multi = [];
    this.sIsLoading = 'loading-data';
    var m_data = {
      "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid?? 0,
    }
    this._DashboardService.getPharDashboardBarchart("m_pharlast3MonthSalesSummaryDashboard", m_data).subscribe(data => {
      if ((this._DashboardService.UseFrom.get("StoreId").value?.storeid ?? 0) > 0) {
        this.ThreeMonSalesConfig.data = data["data"] as any[];
      }
      else {
        this.ThreeMonSalesConfig.multi = data["data"] as any[];
      }
      // this.ThreeMonSalesConfig.colorScheme.domain = data["color"] as any[];
      this.sIsLoading = '';
    }, error => {
      this.sIsLoading = 'noPharSumData';
    });
  }
  public getPharCollSummStoreWiseDashboard() {
    this._DashboardService.getPharCollSummStoreWiseDashboard().subscribe(data => {
      this.dashCardsData = data;
    });
  }

  onChangeStore() {
    this.fetchStaticData();
    this.fetchThreeMonSalesSumData();
    this.getPieChartPharCurrentValueData();
    
  }

  public getOPChartData() {
    var m_data = {
      "DateRange": this.pieChartOPData.currentRange,
    }
    this._DashboardService.getPathCategoryPieChart(m_data).subscribe(data => {
      this.DashChartOP = data;
      if (this.DashChartOP && this.DashChartOP.length > 0) {
        this.pieChartOPData['footerLeft'].title = 'Total Count';
        this.pieChartOPData['footerLeft'].count = this.DashChartOP[0]['DischargeCount'];
        this.pieChartOPData['footerRight'].title = 'Total Count';
        this.pieChartOPData['footerRight'].count = this.DashChartOP[0]['TotalCount'];
        this.pieChartOPData.mainChart[this.pieChartOPData.currentRange] = [];
        this.DashChartOP.forEach(element => {
          this.pieChartOPData.mainChart[this.pieChartOPData.currentRange].push(element);
        });
      } else {
        this.pieChartOPData['footerLeft'].count = 0;
        this.pieChartOPData['footerRight'].count = 0;
      }
    });
  }
  
  public getPieChartPharCurrentValueData() {
    var m_data = {
      "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid?? 0, // this.pieChartCurStkData.currentRange,
    }
    this._DashboardService.getPieChartPharCurrentStockData(m_data).subscribe(data => {
      this.DashChartCurStk = data;
      if (this.DashChartCurStk && this.DashChartCurStk.length > 0) {
        this.pieChartCurStkData['footerLeft'].title = 'Purchase Rate (excl gst)';
        this.pieChartCurStkData['footerLeft'].count = this.DashChartCurStk[0]['DischargeCount'];
        this.pieChartCurStkData['footerRight'].title = 'MRP (incl gst)';
        this.pieChartCurStkData['footerRight'].count = this.DashChartCurStk[0]['TotalCount'];
        this.pieChartCurStkData.mainChart[this.pieChartCurStkData.currentRange] = [];
        this.DashChartCurStk.forEach(element => {
          this.pieChartCurStkData.mainChart[this.pieChartCurStkData.currentRange].push(element);
        });
      } else {
        this.pieChartCurStkData['footerLeft'].count = 0;
        this.pieChartCurStkData['footerRight'].count = 0;
      }
    });
  }

  dataSourceTable = new MatTableDataSource<PathTestSummary>();
  displayedColumns = [
      // 'PathDate',
      'StoreName',
      'CollectionAmount',
      'RefundAmount',
      'NetAmount',
      'BillCount'
    ];

  
    dsPaymentSummary = new MatTableDataSource<PaymentSummary>();
    displayedColumnsPaySum = [
      'StoreName',
      'CashPay',
      'ChequePay',
      'OnlinePay',
      'NetColAmt'
    ];  

    dsEmployee = new MatTableDataSource<Employee>();
    displayedColumnsEmp = [
      'StoreName',
      'EmpCount',
    ];

  dataSourceTable1 = new MatTableDataSource<PathCateSummary>();
  displayedColumns1 = [
      'PathDate',
      'CategoryName',
      'TCount'
  ];
  
  pieChartMaster = {
    'Todays': 'Today',
    'Last Weeks': 'Last Week',
    'Last Month': 'Last Month'
  };
  
  pieChartCurrValMaster = {
    'Todays': 'Today',
    'Last Weeks': 'Last Week',
    'Last Month': 'Last Month'
  };

   // Path Test Summary Date Range form
   createForm() {
    var myCurrentDate=new Date(); 
    var myPastDate=new Date(myCurrentDate);
    myPastDate.setDate(myPastDate.getDate() - 1);
    console.log(myPastDate);

    this.rangeFormGroup = this.formBuilder.group({
      startDate: [(new Date(myPastDate)).toISOString()],
      endDate: [(new Date()).toISOString()]
    });
  }

  // PharSales Range form
  createForm1() {
    var myCurrentDate1=new Date(); 
    var myPastDate1=new Date(myCurrentDate1);
    myPastDate1.setDate(myPastDate1.getDate() - 1);
    console.log(myPastDate1);

    this.rangeFormGroup1 = this.formBuilder.group({
      startDate: [(new Date(myPastDate1)).toISOString()],
      endDate: [(new Date()).toISOString()]
    });
  }

  onDateChange(event) {
    let m_data = {
      "FromDate": this.datePipe.transform(this.rangeFormGroup.get('startDate').value,"MM-dd-yyyy") || '01/01/2021',
      "ToDate": this.datePipe.transform(this.rangeFormGroup.get('endDate').value,"MM-dd-yyyy") || '01/11/2021'
    }
    this.getPharmsaleTableData(m_data);
    this.getPharPaymentSummary(m_data);
  }

  getPharmsaleTableData(params_sd) {
    this.sIsLoading = 'loading-data';
    this._DashboardService.getPharmacyCollectionStoreandDateWise(params_sd).subscribe((response: any) => {
      this.dataSourceTable.data = response;
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }

  getPharPaymentSummary(params_sd) {
    this.sIsLoading = 'loading-data';
    this._DashboardService.getPharPaymentSummary(params_sd).subscribe((response: any) => {
      this.dsPaymentSummary.data = response;
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }

  getPharUserInfoStoreWise() {
    // var m_data = {
    //   "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid?? 0, // this.pieChartCurStkData.currentRange,
    // }
    this.sIsLoading = 'loading-data';
    this._DashboardService.getPharUserCountStoreWise().subscribe((response: any) => {
      this.dsEmployee.data = response;
      this.sIsLoading = '';
    },
    error => {
      this.sIsLoading = '';
    });
  }

  OnPopSalesSummary(contact){
    const dialogRef = this._matDialog.open(SalesSummaryComponent,
      {
        maxWidth: "80vw",
        height: '650px',
        width: '100%',
        data: {
          Obj: contact,
        }
      });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed - Insert Action', result);
      // this.getIssueTodept();
    });
  }
  // getTableData(params) {
  //   this.sIsLoading = 'loading-data';
  //   this._DashboardService.getPathtestSummaryDateWise(params).subscribe((response: any) => {
  //     this.dataSourceTable.data = response;
  //     // this.dataSourceTable.sort = this.sort;
  //     // this.dataSourceTable.paginator = this.paginator;
  //     //  console.log(this.dataSourceTable.data);
  //     this.sIsLoading = '';
  //   },
  //   error => {
  //     this.sIsLoading = '';
  //   });
  // }

  onSelectPieOptionOP(value) {
    this.pieChartOPData.currentRange = value;
    this.getOPChartData();
  }

  onSelectPieOptionCurVal(value) {
    this.pieChartCurStkData.currentRange = value;
    this.getPieChartPharCurrentValueData();
  }

  SubPlease: any;
  progressValue = '75%';
  progressValue1 = '40%';
  progressValue2 = '12%';

  Totalamount: any = '26,24,940';
  GrossAmount: any = '24,24,990';
  TotalCustomers: any = '2,624';
  AverageOrderValue: any = '490.5';
  NewCustomers: any = '1,312';
  RepeatCustomers: any = '1,312';
  Cash: any = '2,26,241';
  Online: any = '76,241';
  Cheque: any = '22,241';

  sIsLoading: string = '';
  isCollectionLoad: string = '';
  isLoading = true;
  PharmacyDashboard: PharDashSummary[] = [];

  pieChartData2: any;
  labelData: any[] = [];
  PiechartData5: any[] = [];
  PharmStoreList: any = [];

  dsPharmacyDashboard = new MatTableDataSource<PharDashSummary>();
  maindata: any;
  labeldata: any;

  staticOptions: any[] = [
    { value: 'CollectionAmount', viewValue: 'Collection Amount' },
    { value: 'BillCount', viewValue: 'Bill Count' }
  ];
  selectedStatic = this.staticOptions[0].value;

  // BarChartData:any;
  // BarlabelData:any[]=[];
  // BarchartData:any[]=[];
  // BardataList:any=[];


  chartData: any[] = [
    { data: [40, 60, 20, 50], label: 'Net Sales' }
  ];
  chartLabels: string[] = ['January', 'February', 'March', 'April'];
  chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  chartData1: any[] = [
    { data: [20, 60, 40, 30], label: 'Net Sales' }
  ];
  chartLabels1: string[] = ['January', 'February', 'March', 'April'];
  chartOptions1: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public pieChartData: number[] = [1312, 1312]; // The data for the chart
  public pieChartLabels: string[] = ['New Customers', 'Repeat Customers']; // The labels for the chart
  public pieChartType: string = 'doughnut'; // Set the chart type to doughnut
  public pieChartOptions: ChartOptions = {
    legend: {
      position: 'right',
      align: 'end'

    }
  };
  public pieChartData1: number[];//=[1312, 1312,2546,2154]; // The data for the chart
  public pieChartLabels1: string[];//= ['SS MEDICALS', 'Civil Store','IPD STORE','SSM-04 Muddebihal']; // The labels for the chart
  public pieChartType1: string = 'doughnut'; // Set the chart type to doughnut
  public pieChartOptions1: ChartOptions = {
    legend: {
      position: 'right',
      align: 'end'

    }
  };

  barChartOptions: ChartOptions = {
    responsive: true,
  };
  barChartLabels: Label[] = ['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
    { data: [45, 37, 60, 70, 46, 100], label: 'jan' },
    { data: [45, 37, 60, 70, 46, 33], label: 'Dec' },
    { data: [45, 34, 61, 70, 46, 40], label: 'Nov' }
  ];

  threeMonSalesData: ChartDataSets[] = [];
  threeMonSalesLabels: any[] = [];

  threeMonCollectionData: ChartDataSets[] = [];
  threeMonCollectionLabels: any[] = [];

  pharCustStockData: any[] = [];
  pharCustStockLabels: any[] = [];

  rangeFormGroup: FormGroup;
  rangeFormGroup1: FormGroup;
  widget6: any = {};
  widget7: any = {};

  
  
  
  // getThreeMonSalesSumData() {
  //   let req = { StoreId: 0 };
  //   this._DashboardService.getThreeMonSumData('m_pharlast3MonthSalesSummaryDashboard', req).subscribe((respo: any) => {
  //     if (respo && respo.length > 0) {
  //       let labelNames = [...new Set(respo.map((ele) => ele.StoreName))];
  //       // console.log(labelNames);
  //       let salesMonth = [...new Set(respo.map((ele) => ele.SalesMonth))];
  //       // console.log(salesMonth);
  //       let data = [];
  //       salesMonth.forEach((month) => {
  //         let monthWiseData = respo.filter((ele: any) => ele.SalesMonth === month).
  //           map((ele: any) => ele.NetSalesAmount)
  //         data.push({
  //           data: monthWiseData,
  //           label: month
  //         }
  //         )
  //         console.log(monthWiseData);
  //       });
  //       console.log(data);
  //       this.threeMonSalesData = data;
  //       // [
  //       //   { data: [50, 67, 50, 35, 66, 100], label:'Jan' },
  //       //   { data: [65, 57, 40, 40, 56, 53], label: 'Dec' },
  //       //   { data: [35, 34, 61, 50, 36, 60], label: 'Nov' }
  //       // ];
  //       this.threeMonSalesLabels = labelNames; //['assApple', 'Banasna', 'Kiwissfruit', 'Bluddeberry', 'Oradnge', 'Grafgpes'];
  //     }
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }


  // getThreeMonCollSumData() {
  //   this.isCollectionLoad = 'pharCollectionChartLoading';
  //   let req = { StoreId: 0 };
  //   this._DashboardService.getThreeMonSumData('m_pharlast3MonthCollectionSummaryDashboard', req).subscribe((respo: any) => {
  //     if (respo && respo.length > 0) {
  //       this.isCollectionLoad = 'pharCollectionChartLoaded';
  //       let labelNames = [...new Set(respo.map((ele) => ele.StoreName))];
  //       // console.log(labelNames);
  //       let salesMonth = [...new Set(respo.map((ele) => ele.SalesMonth))];
  //       // console.log(salesMonth);
  //       let data = [];
  //       salesMonth.forEach((month) => {
  //         let monthWiseData = respo.filter((ele: any) => ele.SalesMonth === month).
  //           map((ele: any) => ele.NetCollectionAmount)
  //         data.push({
  //           data: monthWiseData,
  //           label: month
  //         })
  //         console.log(monthWiseData);
  //       });
  //       this.threeMonCollectionData = data;
  //       this.threeMonCollectionLabels = labelNames;
  //     }
  //   },
  //     error => {
  //       this.isCollectionLoad = '';
  //     });
  // }

  // getPharStockValueSumData() {
  //   this.isCollectionLoad = 'pharStockLoading';
  //   let req = { StoreId: 10016 };
  //   this._DashboardService.getPharStockColSumData('m_pharCurStockValueSummaryDashboard ', req).subscribe((respo: any) => {
  //     if (respo && respo.length > 0) {
  //       this.isCollectionLoad = 'pharStockLoaded';
  //       respo.forEach((element) => {
  //         this.pharCustStockLabels.push(element.StoreName);
  //         this.pharCustStockData.push(element.CurValueWithMRP);
  //       });
  //     }
  //   }, error => {
  //     this.sIsLoading = 'no';
  //   });
  // }

  // getPharPayModeColSumData() {
  //   //bar chart pending
  //   let req = { StoreId: 10035 };
  //   this._DashboardService.getPharStockColSumData('m_pharPayModeColSummaryDashboard ', req).subscribe(data => {
  //     // this.BardataList = data;
  //     console.log(data);
  //   },
  //     error => {
  //       this.sIsLoading = '';
  //     });
  // }
  // // BarChart(BarlabelData:any,BarchartData:any){

  // //   const Barchart = new Chart('BarChart', {
  // //     type: 'bar',
  // //     data: {
  // //       labels:BarlabelData ,//['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'],
  // //       datasets: [
  // //         { data: BarchartData, label:'jan' },
  // //         { data: BarchartData, label: 'Dec' },
  // //         { data: BarchartData, label: 'Nov' },
  // //       ],


  // //     },
  // //     options: {  responsive: true,
  // //       plugins: {
  // //         legend: true,

  // //         tooltip: {
  // //           enabled: true,
  // //         },
  // //         backgroundColor: [

  // //         ],
  // //       },
  // //     },
  // //   })

  // // }

  onDateRangeChanged() {
    this.fetchStaticData();
    this.getPharDashboardSalesSummary();
    // this.getPharPaymentSummary();
  }



  getPharDashboardSalesSummary() {
    if (this._DashboardService.UseFrom.get("end").value == null) {
      return;
    }
    this.sIsLoading = 'pharSumChartLoading';
    var vdata = {
      "FromDate": this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '12/25/2023',
      "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '12/30/2023'
    }
    this._DashboardService.getPharDashboardSalesSummary(vdata).subscribe((res: any) => {
      if (res && res.length > 0) {
        this.dsPharmacyDashboard.data = res as PharDashSummary[];
        this.PharmacyDashboard = res as PharDashSummary[];
        // console.log(this.dsPharmacyDashboard.data)
        this.labelData = [];
        this.PiechartData5 = [];
        res.forEach((element) => {
          this.labelData.push(element.StoreName);
          this.PiechartData5.push(element.CollectionAmount);
        });
        this.sIsLoading = 'pharSumChartLoaded';
      } else {
        this.sIsLoading = 'noPharSumData';
      }
    },
      error => {
        this.sIsLoading = 'pharSumChartError';
      });
  }
  getTotalCollectionAmt(contact) {
    let TotalCollectionAmt = 0;
    TotalCollectionAmt = contact.reduce((sum, { CollectionAmount }) => sum += +(CollectionAmount || 0), 0);
    // this.IGSTFinalAmount = IGSTAmt;
    return TotalCollectionAmt;
  }
  getTotalRefunAmt(contact) {
    let TotalRefundAmt = 0;
    TotalRefundAmt = contact.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
    // this.IGSTFinalAmount = IGSTAmt;
    return TotalRefundAmt;
  }
  getTotalNetAmt(contact) {
    let TotalNetAmt = 0;
    TotalNetAmt = contact.reduce((sum, { NetAmount }) => sum += +(NetAmount || 0), 0);
    // this.IGSTFinalAmount = IGSTAmt;
    return TotalNetAmt;
  }

  getPharmStoreList() {
    this._DashboardService.getPharmStoreList().subscribe(data => {
      this.PharmStoreList = data;
      // console.log(this.PharmStoreList);
    });
  }

  onChangeStatic(event) {
    this.selectedStatic = event.value;
    this.fetchStaticData();
  }

}

export class PharDashSummary {
  StoreName: number;
  CollectionAmount: any;
  RefundAmount: number;
  NetAmount: any;

  constructor(PharDashSummary) {
    this.StoreName = PharDashSummary.StoreName || 0;
    this.CollectionAmount = PharDashSummary.CollectionAmount || 0;
    this.RefundAmount = PharDashSummary.RefundAmount || 0;
    this.NetAmount = PharDashSummary.NetAmount || 0;
  }
}
export class PieChartOPData {
  currentRange = 'Todays';
  mainChart = {
    'Todays': [],
    'Last Weeks': [],
    'Last Month': []
  };
  footerLeft = {
    title: '',
    count: 0
  };
  footerRight = {
    title: '',
    count: 0
  };
}

export class pieChartCurStkData {
  currentRange = 'Todays';
  mainChart = {
    'Todays': [],
    'Last Weeks': [],
    'Last Month': []
  };
  footerLeft = {
    title: '',
    count: 0
  };
  footerRight = {
    title: '',
    count: 0
  };
}
export class PathTestSummary {
  StoreName: string;
  CollectionAmount: number;
  RefundAmount: number;
  NetAmount :number;
  BillCount: number;

  constructor(PathTestSummary) {
    this.StoreName = PathTestSummary.StoreName || '';
    this.CollectionAmount = PathTestSummary.CollectionAmount || 0;
    this.RefundAmount = PathTestSummary.RefundAmount || 0;
    this.NetAmount = PathTestSummary.NetAmount || 0;
    this.BillCount = PathTestSummary.BillCount || 0;
    }
}

export class PaymentSummary {
  StoreName: string;
  CashPay: number;
  ChequePay: number;
  OnlinePay :number;
  NetColAmt: number;
  
  constructor(PaymentSummary) {
    this.StoreName = PaymentSummary.StoreName || '';
    this.CashPay = PaymentSummary.CashPay || 0;
    this.ChequePay = PaymentSummary.ChequePay || 0;
    this.OnlinePay = PaymentSummary.OnlinePay || 0;
    this.NetColAmt = PaymentSummary.NetColAmt || 0;
    
    }
}

export class Employee {
  StoreName: string;
  EmpCount: number;

  constructor(Employee) {
    this.StoreName = Employee.StoreName || '';
    this.EmpCount = Employee.EmpCount || 0;
  }
}

export class PathCateSummary {
  PathDate: Date;
  CategoryName:string;
  TCount: number;
  
  constructor(PathCateSummary) {
    this.PathDate = PathCateSummary.PathDate || '';
    this.CategoryName = PathCateSummary.CategoryName || 0;
    this.TCount = PathCateSummary.TCount || 0 ;
    
    }
}