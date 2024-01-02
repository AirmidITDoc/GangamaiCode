import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';
import { ChartDataSets, ChartOptions } from 'chart.js';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { Label } from 'ng2-charts';
import Chart from 'chart.js';

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
  isLoading = true;

  dsPharmacyDashboard = new MatTableDataSource<PharDashSummary>();
  maindata: any;
  labeldata: any;
  

  constructor(
    public _DashboardService : DashboardService,
    public datePipe: DatePipe,
    ) { }
  ngOnInit(): void {
   this.getPharDashboardSalesSummary();
   this.fetchChartData();
   this.RenderChart(this.labeldata,this.PiechartData5);
  }


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
  
  pieChartData2:any;
  labelData:any[]=[];
  PiechartData5:any[]=[];
 
  fetchChartData() {
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
        for(let i=0; i<this.pieChartData2.length;i++){
         //console.log(this.pieChartData2[i]);
         this.labelData.push(this.pieChartData2[i].StoreName);
         this.PiechartData5.push(this.pieChartData2[i].CollectionAmount);
        }
        this.RenderChart(this.labelData,this.PiechartData5);
       } this.sIsLoading = '';
       console.log(this.PiechartData5);
      },
        error => {
          this.sIsLoading = '';
        });
   
  }

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

 














  PharmacyDashboard: PharDashSummary[] = [];
  getPharDashboardSalesSummary() {
    this.sIsLoading = 'loading-data';
    var vdata = {
     "FromDate":this.datePipe.transform(this._DashboardService.UseFrom.get("start").value, "yyyy-MM-dd 00:00:00.000") ||  '12/25/2023' ,
     "ToDate": this.datePipe.transform(this._DashboardService.UseFrom.get("end").value, "yyyy-MM-dd 00:00:00.000") || '12/30/2023'
     }
   console.log(vdata);
      this._DashboardService.getPharDashboardSalesSummary(vdata).subscribe(data => {
      this.dsPharmacyDashboard.data = data as PharDashSummary[];
      this.PharmacyDashboard = data as PharDashSummary[];
       
     console.log(this.dsPharmacyDashboard.data)
     this.sIsLoading = '';
    },
      error => {
        this.sIsLoading = '';
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
