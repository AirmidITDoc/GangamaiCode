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

@Component({
  selector: 'app-pharmacy-dashboard',
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrls: ['./pharmacy-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
  
})
export class PharmacyDashboardComponent implements OnInit {

  displayedColumns = [
    'StoreName',
    'CollectionAmount',
    'RefundAmount',
    'NetAmount',
  ];

  name: any;
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
   
  pieChartData2:any;
  labelData:any[]=[];
  PiechartData5:any[]=[];
  PharmStoreList:any=[];

  dsPharmacyDashboard = new MatTableDataSource<PharDashSummary>();
  maindata: any;
  labeldata: any;

  staticOptions: any[] = [
    {value: 'BillCount', viewValue: 'Bill Count'},
    {value: 'CollectionAmount', viewValue: 'Collection Amount'}
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
  public pieChartData1: number[] ;//=[1312, 1312,2546,2154]; // The data for the chart
  public pieChartLabels1: string[] ;//= ['SS MEDICALS', 'Civil Store','IPD STORE','SSM-04 Muddebihal']; // The labels for the chart
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
    { data: [45, 37, 60, 70, 46, 100], label:'jan' },
    { data: [45, 37, 60, 70, 46, 33], label: 'Dec' },
    { data: [45, 34, 61, 70, 46, 40], label: 'Nov' }
  ];

  threeMonSalesData: ChartDataSets[] = [];
  threeMonSalesLabels: any[] = [];

  threeMonCollectionData: ChartDataSets[] = [];
  threeMonCollectionLabels: any[] = [];

  pharCustStockData: any[] = [];
  pharCustStockLabels: any[] = [];

  constructor(
    public _DashboardService : DashboardService,
    public datePipe: DatePipe,
    ) { }
  ngOnInit(): void {
   this.getPharDashboardSalesSummary();
  //  this.fetchChartData();
   this.getThreeMonSalesSumData();
   this.getThreeMonCollSumData();
   this.getPharmStoreList();
   this.getPharStockValueSumData();
   this.getPharPayModeColSumData();
   //this.BarChart(this.BarlabelData,this.BarchartData);
  }

  getThreeMonSalesSumData() {
    let req = { StoreId: 0};
    this._DashboardService.getThreeMonSumData('m_pharlast3MonthSalesSummaryDashboard', req).subscribe((respo: any) => {
      if(respo && respo.length > 0) {
        let labelNames = [...new Set(respo.map((ele) => ele.StoreName))];
        // console.log(labelNames);
        let salesMonth = [...new Set(respo.map((ele) => ele.SalesMonth))];
        // console.log(salesMonth);
        let data = [];
        salesMonth.forEach((month) => {
          let monthWiseData = respo.filter((ele: any) => ele.SalesMonth === month).
            map((ele: any) => ele.NetSalesAmount)
          data.push({
              data: monthWiseData,
              label: month
            }
          )
          console.log(monthWiseData);
        });
        console.log(data);
        this.threeMonSalesData = data;
        // [
        //   { data: [50, 67, 50, 35, 66, 100], label:'Jan' },
        //   { data: [65, 57, 40, 40, 56, 53], label: 'Dec' },
        //   { data: [35, 34, 61, 50, 36, 60], label: 'Nov' }
        // ];
        this.threeMonSalesLabels = labelNames; //['assApple', 'Banasna', 'Kiwissfruit', 'Bluddeberry', 'Oradnge', 'Grafgpes'];
      }
    },
    error => {
      this.sIsLoading = '';
    });
  }


  getThreeMonCollSumData() {
    this.isCollectionLoad = 'pharCollectionChartLoading';
    let req = { StoreId: 0 };
    this._DashboardService.getThreeMonSumData('m_pharlast3MonthCollectionSummaryDashboard ', req).subscribe((respo: any) => {
      if (respo && respo.length > 0) {
        this.isCollectionLoad = 'pharCollectionChartLoaded';
        let labelNames = [...new Set(respo.map((ele) => ele.StoreName))];
        // console.log(labelNames);
        let salesMonth = [...new Set(respo.map((ele) => ele.SalesMonth))];
        // console.log(salesMonth);
        let data = [];
        salesMonth.forEach((month) => {
          let monthWiseData = respo.filter((ele: any) => ele.SalesMonth === month).
            map((ele: any) => ele.NetCollectionAmount)
          data.push({
            data: monthWiseData,
            label: month
          })
          console.log(monthWiseData);
        });
        this.threeMonCollectionData = data;
        this.threeMonCollectionLabels = labelNames;
      }
    },
      error => {
        this.isCollectionLoad = '';
      });
  }

  getPharStockValueSumData() {
    this.isCollectionLoad = 'pharStockLoading';
    let req = { StoreId: 10016 };
    this._DashboardService.getPharStockColSumData('m_pharCurStockValueSummaryDashboard ', req).subscribe((respo: any) => {
      if (respo && respo.length > 0) {
        this.isCollectionLoad = 'pharStockLoaded';
        respo.forEach((element) => {
          this.pharCustStockLabels.push(element.StoreName);
          this.pharCustStockData.push(element.CurValueWithMRP);
        }); 
      }
    }, error => {
        this.sIsLoading = 'no';
      });
  }

  getPharPayModeColSumData() {
    //bar chart pending
    let req = { StoreId: 10035};
    this._DashboardService.getPharStockColSumData('m_pharPayModeColSummaryDashboard ', req).subscribe(data => {
      // this.BardataList = data;
      console.log(data);
    },
    error => {
      this.sIsLoading = '';
    });
  }
  // BarChart(BarlabelData:any,BarchartData:any){
          
  //   const Barchart = new Chart('BarChart', {
  //     type: 'bar',
  //     data: {
  //       labels:BarlabelData ,//['Apple', 'Banana', 'Kiwifruit', 'Blueberry', 'Orange', 'Grapes'],
  //       datasets: [
  //         { data: BarchartData, label:'jan' },
  //         { data: BarchartData, label: 'Dec' },
  //         { data: BarchartData, label: 'Nov' },
  //       ],
     
       
  //     },
  //     options: {  responsive: true,
  //       plugins: {
  //         legend: true,
          
  //         tooltip: {
  //           enabled: true,
  //         },
  //         backgroundColor: [
            
  //         ],
  //       },
  //     },
  //   })
    
  // }






 
 //Pei chart 
  /* fetchChartData() {
    this.sIsLoading = 'loading-data';
    var m_data = {
      "FromDate":this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") ||  '12/25/2023' ,
      "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '12/30/2023'
      } 
       // console.log(m_data);
      this._DashboardService.getPharDashboardPeichart(m_data).subscribe(data => {
      this.pieChartData2 = data;
      console.log(this.pieChartData2);
       if(this.pieChartData2 != null){
        this.pieChartData2.forEach((element) => {
          this.labelData.push(element.StoreName);
          this.PiechartData5.push(element.CollectionAmount);
        }); 
        this.RenderChart(this.labelData,this.PiechartData5);
       } this.sIsLoading = '';
       console.log(this.PiechartData5);
      },
        error => {
          this.sIsLoading = '';
        });
   
  } */

  RenderChart(labelData:any,PiechartData5:any){
    const mychart = new Chart('doughnutChart', {
      type: 'doughnut',
      data: {
        labels:labelData,
        datasets: [
          {
            backgroundColor: [
              '#FF3784',
              '#36A2EB',
              '#4BC0C0',
              '#F77825',
              '#9966FF',
            ],
            data: PiechartData5,
            
          },
        ],
       
      },
      options: {
        plugins: {
          legend: {
            position: 'right',
            align: 'end'
          },
          tooltip: {
            enabled: true,
          },
          outlabels: {
            text: '%l %p',
            color: 'white',
            stretch: 35,
         
          },
        },
      },
    })
    
  }

  
  getPharDashboardSalesSummary() {
    if(this._DashboardService.UseFrom.get("end").value == null) {
      return;
    }
    this.sIsLoading = 'pharSumChartLoading';
    var vdata = {
     "FromDate":this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") ||  '12/25/2023' ,
     "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '12/30/2023'
    }
    this._DashboardService.getPharDashboardSalesSummary(vdata).subscribe((res: any) => {
      if(res && res.length > 0) {
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
        // this.RenderChart(this.labelData,this.PiechartData5);
      } else {
        this.sIsLoading = 'noPharSumData';
      }
    },
    error => {
      this.sIsLoading = 'pharSumChartError';
    });
  }
  getTotalCollectionAmt(contact) {
    let TotalCollectionAmt=0;
    TotalCollectionAmt = contact.reduce((sum, { CollectionAmount }) => sum += +(CollectionAmount || 0), 0);
   // this.IGSTFinalAmount = IGSTAmt;
    return TotalCollectionAmt;
  }
  getTotalRefunAmt(contact) {
    let TotalRefundAmt=0;
    TotalRefundAmt = contact.reduce((sum, { RefundAmount }) => sum += +(RefundAmount || 0), 0);
   // this.IGSTFinalAmount = IGSTAmt;
    return TotalRefundAmt;
  }
  getTotalNetAmt(contact) {
    let TotalNetAmt=0;
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
    console.log(this.selectedStatic);
  }

}

export class PharDashSummary {
  StoreName: number;
  CollectionAmount:  any;
  RefundAmount: number;
  NetAmount:  any;

  constructor(PharDashSummary) {
    this.StoreName = PharDashSummary.StoreName || 0;
    this.CollectionAmount = PharDashSummary.CollectionAmount || 0;
    this.RefundAmount = PharDashSummary.RefundAmount || 0;
    this.NetAmount = PharDashSummary.NetAmount || 0;
  }
}

