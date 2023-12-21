import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fuseAnimations } from '@fuse/animations';

@Component({
  selector: 'app-pharmacy-dashboard',
  templateUrl: './pharmacy-dashboard.component.html',
  styleUrls: ['./pharmacy-dashboard.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class PharmacyDashboardComponent implements OnInit {
  SearchForm: FormGroup;
  PharDashSalSummary=[];
  constructor(
    public _pharService:DashboardService,
    private _formBuilder: FormBuilder
  ) {
    this.SearchForm=this.SearchFilter();
   }

  ngOnInit(): void {
    this.getPharDashboardSalesSummary();
  }

  SearchFilter():FormGroup{
    return this._formBuilder.group({
      startdate: [(new Date()).toISOString()],
      enddate: [(new Date()).toISOString()],
      // StoreId :'',
    })
  }

Totalamount:any = '26,24,940';
GrossAmount:any = '24,24,990';
  getPharDashboardSalesSummary(){
    let reqParam = {
      FromDate: '10/01/2023',
      ToDate:'10/18/2023'
    }
    this._pharService.getPharDashboardSalesSummary(reqParam).subscribe(data => {
      console.log(data);
      this.PharDashSalSummary = data as PharDashSummary [];
    });
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

}

export class PharDashSummary {
  StoreName: number;
  TotalSales: String;
  TotalDisc: number;
  TotalNetSales: String;

  constructor(PharDashSummary) {
    this.StoreName = PharDashSummary.StoreName || '';
    this.TotalSales = PharDashSummary.TotalSales || 0;
    this.TotalDisc = PharDashSummary.TotalDisc || 0;
    this.TotalNetSales = PharDashSummary.TotalNetSales || 0;
  }
}
