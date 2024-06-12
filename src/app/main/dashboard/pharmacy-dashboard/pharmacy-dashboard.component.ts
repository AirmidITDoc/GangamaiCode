import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { DashboardService } from "../dashboard.service";
import { FormBuilder, FormGroup } from "@angular/forms";
import { fuseAnimations } from "@fuse/animations";
import { ChartDataSets, ChartOptions, ChartType } from "chart.js";
import { MatTableDataSource } from "@angular/material/table";
import { DatePipe } from "@angular/common";
import { Label } from "ng2-charts";
import Chart from "chart.js";
import { element } from "protractor";
import { filter, map } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { SalesSummaryComponent } from "./sales-summary/sales-summary.component";

@Component({
    selector: "app-pharmacy-dashboard",
    templateUrl: "./pharmacy-dashboard.component.html",
    styleUrls: ["./pharmacy-dashboard.component.scss"],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
})
export class PharmacyDashboardComponent implements OnInit {
  displayedColumns:string[]=[
    'OPD',
    'IPD',
    'External',
    'Company'
  ]
  displayedAdvaColumns:string[]=[
    'Cash',
    'Cheque',
    'Online',
    'Company'
  ]
  displayedBillColumns:string[]=[
    'Cash',
    'Cheque',
    'Online',
    'Company'
  ]
  displayedPurchaseColumns:string[]=[
    'Cash',
    'Cheque',
    'Online',
    'Company'
  ]
  displayedsupplierColumns:string[]=[
    'SupplierName',
    'InvoiceNo',
    'Amount' 
  ]
    sIsLoading: any;
    PharmStoreList: any = [];
    dashCardsData: any = [];

    dsPharmaCountList= new MatTableDataSource
    dsPharmaAdvancList = new MatTableDataSource
    dsPharmaBillList = new MatTableDataSource
    dsPharmaPurchaseList = new MatTableDataSource
    dsPharmaSupplierList = new MatTableDataSource

  constructor(
    public _DashboardService: DashboardService,
    public datePipe: DatePipe,
    private formBuilder: FormBuilder,
    public _matDialog: MatDialog,
  ) { }
  ngOnInit(): void {
    this.getPharmStoreList();
  }

  getPharmStoreList() {
    this._DashboardService.getPharmStoreList().subscribe(data => {
      this.PharmStoreList = data;
      this._DashboardService.UseFrom.get('StoreId').setValue(this.PharmStoreList[0]);
      this.fetchStaticData();
      this.getPharCollSummStoreWiseDashboard()
      this.fetchThreeMonSalesSumData();
      this.getPieChart_CurrentValueData();
      this.fetchLineChartData();
    });
  }
  public getPharCollSummStoreWiseDashboard() {
    var m_data = {
      "FromDate": this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") || '01/01/2020',
      "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '03/01/2024',
      "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid ?? 0,
    }
    this._DashboardService.getPharCollSummStoreWiseDashboard(m_data).subscribe(data => {
      this.dashCardsData = data;
    });
  }

  onChangeStore() {
    this.fetchStaticData();
    this.fetchThreeMonSalesSumData();
    this.getPharCollSummStoreWiseDashboard();
    this.getPieChart_CurrentValueData();
    this.fetchLineChartData();
  }
  onDateRangeChanged() {
    this.fetchStaticData();
    this.fetchThreeMonSalesSumData();
    this.getPharCollSummStoreWiseDashboard();
    this.getPieChart_CurrentValueData();
    this.fetchLineChartData();
  }

    onChangeStatic(event) {
        this.selectedStatic = event.value;
        this.fetchStaticData();
    }

    staticOptions: any[] = [
        { value: "CollectionAmount", viewValue: "Collection Amount" },
        { value: "BillCount", viewValue: "Bill Count" },
    ];

    selectedStatic = this.staticOptions[0].value;

    StaticChartConfig: any = {
        gradient: true,
        showLegend: true,
        showLabels: true,
        isDoughnut: true,
        legendPosition: "below",
        colorScheme: { domain: [] },
        view: [300, 250],
        data: [],
    };

    fetchStaticData() {
        this.sIsLoading = "loading-data";
        var m_data = {
            FromDate:
                this.datePipe.transform(
                    this._DashboardService.UseFrom.get("start").value,
                    "yyyy-MM-dd 00:00:00.000"
                ) || "01/01/2020",
            ToDate:
                this.datePipe.transform(
                    this._DashboardService.UseFrom.get("end").value,
                    "yyyy-MM-dd 00:00:00.000"
                ) || "03/01/2024",
            StoreId:
                this._DashboardService.UseFrom.get("StoreId").value?.storeid ??
                0,
            Mode: this.selectedStatic || "CollectionAmount",
        };
        console.log(m_data);
        this._DashboardService
            .getPharDashboardPeichart(
                "m_pharPayModeColSummaryDashboard",
                m_data
            )
            .subscribe(
                (data : any) => {
                    if(data && data.data.length){
                        for(let item of data.data){
                            item.value = +item.value
                        }
                    }
                    this.StaticChartConfig.data = data["data"] as any[];
                    console.log(this.StaticChartConfig.data);
                    this.StaticChartConfig.colorScheme.domain = data[
                        "colors"
                    ] as any[];
                    this.sIsLoading = "";
                },
                (error) => {
                    this.sIsLoading = "noPharSumData";
                }
            );
    }

    CurrentValChartConfig: any = {
        gradient: true,
        showLegend: false,
        showLabels: true,
        isDoughnut: true,
        legendPosition: "below",
        colorScheme: { domain: ["#f44336", "#9c27b0", "#03a9f4", "#e91e63"] },
        view: [300, 250],
        data: [],
    };

    public getPieChart_CurrentValueData() {
        var m_data = {
            StoreId:
                this._DashboardService.UseFrom.get("StoreId").value?.storeid ??
                0, // this.pieChartCurStkData.currentRange,
        };
        this._DashboardService
            .getPharDashboardPeichart(
                "m_pharCurStockValueSummaryDashboard",
                m_data
            )
            .subscribe((data) => {
                this.CurrentValChartConfig.data = data["data"] as any[];
                console.log(this.CurrentValChartConfig.data);
                // this.CurrentValChartConfig.colorScheme.domain = data["colors"] as any[];
            });
    }

    ThreeMonSalesConfig: any = {
        data: [],
        multi: [],
        view: [500, 300],
        showXAxis: true,
        showYAxis: true,
        gradient: false,
        showLegend: true,
        showXAxisLabel: true,
        xAxisLabel: "Store",
        showYAxisLabel: true,
        yAxisLabel: "Amount",
        legendTitle: "Month",
        showGridLines: true,
        showDataLabel: true,
        colorScheme: {
            domain: ["#5AA454", "#C7B42C", "#AAAAAA"],
            //['#5AA454', '#A10A28', '#C7B42C', '#AAAAAA'],
        },
        onSelect: null,
    };

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
  LineChartConfig: any = {
    data: [],
    multi: [],
    view: [500, 300],
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
    timeline:false,
    schemeType:"linear",
    colorScheme : {
      domain: ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d', '#aae3f5']
    }
  }
  
  fetchLineChartData() {
    this.LineChartConfig.data = [];
    this.LineChartConfig.multi = [];
    this.sIsLoading = 'loading-data';
    var m_data = {
      "StoreId": this._DashboardService.UseFrom.get("StoreId").value?.storeid?? 0,
    }
    this._DashboardService.getPharDashboardBarchart("m_PharSalesMonthWiseSummaryDashboard", m_data).subscribe(data => {
      if ((this._DashboardService.UseFrom.get("StoreId").value?.storeid ?? 0) > 0) {
        this.LineChartConfig.data = data["data"] as any[];
      }
      else {
        this.LineChartConfig.multi = data["data"] as any[];
      }
     // this.LineChartConfig.colorScheme.domain=data["colors"] as any[];
      this.sIsLoading = '';
    }, error => {
      this.sIsLoading = 'noPharSumData';
    });
  }
}
// export class PharDashSummary {
//   StoreName: number;
//   CollectionAmount: any;
//   RefundAmount: number;
//   NetAmount: any;

//   constructor(PharDashSummary) {
//     this.StoreName = PharDashSummary.StoreName || 0;
//     this.CollectionAmount = PharDashSummary.CollectionAmount || 0;
//     this.RefundAmount = PharDashSummary.RefundAmount || 0;
//     this.NetAmount = PharDashSummary.NetAmount || 0;
//   }
// }
// export class PieChartOPData {
//   currentRange = 'Todays';
//   mainChart = {
//     'Todays': [],
//     'Last Weeks': [],
//     'Last Month': []
//   };
//   footerLeft = {
//     title: '',
//     count: 0
//   };
//   footerRight = {
//     title: '',
//     count: 0
//   };
// }

// export class pieChartCurStkData {
//   currentRange = 'Todays';
//   mainChart = {
//     'Todays': [],
//     'Last Weeks': [],
//     'Last Month': []
//   };
//   footerLeft = {
//     title: '',
//     count: 0
//   };
//   footerRight = {
//     title: '',
//     count: 0
//   };
// }
// export class PathTestSummary {
//   StoreName: string;
//   CollectionAmount: number;
//   RefundAmount: number;
//   NetAmount :number;
//   BillCount: number;

//   constructor(PathTestSummary) {
//     this.StoreName = PathTestSummary.StoreName || '';
//     this.CollectionAmount = PathTestSummary.CollectionAmount || 0;
//     this.RefundAmount = PathTestSummary.RefundAmount || 0;
//     this.NetAmount = PathTestSummary.NetAmount || 0;
//     this.BillCount = PathTestSummary.BillCount || 0;
//     }
// }

// export class PaymentSummary {
//   StoreName: string;
//   CashPay: number;
//   ChequePay: number;
//   OnlinePay :number;
//   NetColAmt: number;

//   constructor(PaymentSummary) {
//     this.StoreName = PaymentSummary.StoreName || '';
//     this.CashPay = PaymentSummary.CashPay || 0;
//     this.ChequePay = PaymentSummary.ChequePay || 0;
//     this.OnlinePay = PaymentSummary.OnlinePay || 0;
//     this.NetColAmt = PaymentSummary.NetColAmt || 0;

//     }
// }

// export class Employee {
//   StoreName: string;
//   EmpCount: number;

//   constructor(Employee) {
//     this.StoreName = Employee.StoreName || '';
//     this.EmpCount = Employee.EmpCount || 0;
//   }
// }

// export class PathCateSummary {
//   PathDate: Date;
//   CategoryName:string;
//   TCount: number;

//   constructor(PathCateSummary) {
//     this.PathDate = PathCateSummary.PathDate || '';
//     this.CategoryName = PathCateSummary.CategoryName || 0;
//     this.TCount = PathCateSummary.TCount || 0 ;

//     }
// }
