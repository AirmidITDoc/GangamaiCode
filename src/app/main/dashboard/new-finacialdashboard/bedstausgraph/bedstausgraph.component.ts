import { DatePipe } from '@angular/common';
import { Component, Inject, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { gridModel, OperatorComparer } from 'app/core/models/gridRequest';
import { AuthenticationService } from 'app/core/services/authentication.service';
import { AirmidTableComponent } from 'app/main/shared/componets/airmid-table/airmid-table.component';
import { PrintserviceService } from 'app/main/shared/services/printservice.service';
import { Chart } from 'chart.js';
import { ToastrService } from 'ngx-toastr';
import { DashboardService } from '../../dashboard.service';
import { fuseAnimations } from '@fuse/animations';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-bedstausgraph',
  templateUrl: './bedstausgraph.component.html',
  styleUrls: ['./bedstausgraph.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: fuseAnimations,
})
export class BedstausgraphComponent {

  unitId = 1

  public modalityChart: any;
  Financedata: any
  trendData: Servicecharge[] = [];

  modalityData = [
    { modality: '', opcount: 0 }
  ];

  fromDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")
  toDate = this.datePipe.transform(new Date().toISOString(), "yyyy-MM-dd")

  constructor(
    public _dashboardServices: DashboardService,
    private _loggedService: AuthenticationService,
    public datePipe: DatePipe, @Inject(MAT_DIALOG_DATA) public data: any,
    public _matDialog: MatDialog,
    public toastr: ToastrService,
    private commonService: PrintserviceService,) { }



  ngOnInit() {
    this.unitId = this.data.unit

    this.getServiceList();
  }


  onClose() {
    this._matDialog.closeAll()
  }

  getServiceList() {
    debugger

    this.fromDate = this.data.fdate
    this.toDate = this.data.tdate
    var vadat = {
      "UnitId": this.unitId,
      'FromDate': this.fromDate,
      'ToDate': this.toDate
    }
    this._dashboardServices.getwardCoutList(vadat).subscribe((data: any) => {
      this.Financedata = data
      this.trendData = this.Financedata.bedOccupancyCountSummary

      if (this.trendData) {

        this.modalityData = [
          ...this.modalityData,
          ...this.trendData.map(item => ({

            modality: item.roomName,
            opcount: item.occupancyPercent
          }))
        ];
      
      }
      console.log(this.modalityData)

      this.modalityChart = this.getModalityBarChart();
    
    });

  }

  // Tests by Modality Bar Chart
  getModalityBarChart() {
    return new Chart('modalityChart', {
      type: 'bar',
      data: {
        labels: this.modalityData.map(d => d.modality),
        datasets: [
          {
            label: 'Ward Name',
            data: this.modalityData.map(d => d.opcount),
            backgroundColor: ['#9661db', '#e9ac1b', '#28af28', '#70c7bd', '#ff5a8a'],
            borderRadius: 6
          }
        ]
      },
      options: {
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              font: { size: 11 }
            }
          },
          x: {
            ticks: {
              font: { size: 11 }
            }
          }
        }
      }
    });
  }


}

export class Servicecharge {
  roomName: any;
  occupancyPercent: any;
  

  constructor(test: any) {
    this.roomName = test.roomName || '';
    this.occupancyPercent = test.occupancyPercent || 0;
   
  }
}